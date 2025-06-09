package com.itinfo.rutilvm.api.model.cert

import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.util.cert.model.CertType
import com.itinfo.rutilvm.util.cert.util.CertParser
import com.itinfo.rutilvm.util.ssh.model.RemoteConnMgmt
import com.itinfo.rutilvm.util.ssh.model.registerRutilVMPubkey2Host
import com.itinfo.rutilvm.util.ssh.model.toInsecureSession
import com.itinfo.rutilvm.util.ssh.util.fetchFile
import com.jcraft.jsch.JSchException
import org.slf4j.LoggerFactory

import java.io.File
import java.io.IOException
import java.io.Serializable
import java.math.BigInteger
import java.nio.file.Path
import java.nio.file.Paths
import java.security.cert.X509Certificate
import java.util.*

private val certP: CertParser
	get() = CertParser.getInstance()

private val log = LoggerFactory.getLogger(CertManager::class.java.canonicalName)

/**
 * [CertManager]
 * 인증서 정보 관리
 *
 * @author 이찬희 (@chanhi2000)
 * @since 2025-03-11
 */
open class CertManager(
	val alias: String,
	val path: String,
	private val tempDest: String,
	val connInfo: RemoteConnMgmt?
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	private fun certFileLocal(): ByteArray? = try {
		log.info("certFileLocal ... path: {}", path)
		val ext = path.split("/").last().split(".").last()
		val fnameDest =
			if (alias.contains("VDSM".toRegex()))
				"${alias}-${connInfo?.host}"
			else
				alias
		File("${tempDest}${File.separator}${fnameDest}.${ext}").readBytes()
	} catch (e: IOException) {
		log.error("something went WRONG ... reason: {}", e.localizedMessage)
		null
	}

	fun certFileDataSSH(): ByteArray? = try {
		log.info("certFileDataSSH ... path: {}", path)
		connInfo?.toInsecureSession()?.fetchFile(path)
	} catch (e: JSchException) {
		log.error("something went WRONG ... reason: {}", e.localizedMessage)
		null
	}

	private val cert: X509Certificate?
		get() {
			val cLocal: ByteArray? = certFileLocal()
			return certP.parseCertificate(
				if (tempDest.isEmpty() || cLocal == null) certFileDataSSH()
				else cLocal
			)
		}

	open val version: String
		get() = if (cert == null) "N/A" else "v${cert?.version}"

	open val address: String
		get() = connInfo?.host ?: ""

	private val _notAfter: Date?
		get() = cert?.notAfter

	open val notAfter: String
		get() = "${_notAfter ?: "N/A"}"

	open val serialNumber: BigInteger?
		get() = cert?.serialNumber ?: BigInteger.ZERO

	private val _daysRemaining: Long?
		get() {
			val currentDate = Date()
			val diffInMillis: Long = (_notAfter?.time?.minus(currentDate.time)) ?: -1L
			return if (diffInMillis == -1L) diffInMillis
			else diffInMillis / (24*60*60*1000)
		}
	open val daysRemaining: String
		get() = "${_daysRemaining ?: "N/A"}"

	fun save2Tmp(): Result<Boolean> = runCatching {
		val filenameExt: String = path.split("/").last().split(".").last()
		val filename =
			if (alias.contains("VDSM")) // 호스트 인증서
				"[${connInfo?.host}]${alias}.${filenameExt}"
			else
				"$alias.$filenameExt" // 그 외 인증서 (엔진)
		log.info("save2Tmp ... path: {}, filenameExt: {}, filename: {}", path, filenameExt, filename)
		val tgtPath: Path = Paths.get(tempDest, filename)
		val fTmpDest = File(tempDest)
		if (!fTmpDest.exists()) {
			fTmpDest.mkdir()
		}
		certFileDataSSH()?.let { fd ->
			log.debug("save2Tmp ... fileData FOUND!!!")
			// Files.write(tgtPath, fd)
			val fTmp = File("$tempDest${File.separator}${filename}")
			if (!fTmp.exists())
				fTmp.createNewFile()
			fTmp.writeBytes(fd)
			log.debug("save2Tmp ... File downloaded and saved to ${tgtPath.toAbsolutePath()}")
			return@runCatching true
		}
		false
	}.onSuccess {
		log.info("인증서 임시보관 성공!")
	}.onFailure {
		log.error("인증서 임시보관 실패 ... 이유: {}", it.localizedMessage)
		it.stackTrace
	}

	fun registerRutilVMPubkey2Host(
		rootPassword: String? = "", ovirtSSHPubkey: String? = "",
	): Result<Boolean> = runCatching {
		connInfo?.registerRutilVMPubkey2Host(
			"$address:${connInfo.port}",
			rootPassword,
			ovirtSSHPubkey
		)?.getOrDefault(false)
			?: false
			// TODO: 예외처리 필요
	}.onSuccess {
		log.info("SSH 공개키 등록 및 연결 성공!")
	}.onFailure {
		log.error("SSH 공개키 등록 및 연결 실패 ... 이유: {}", it.localizedMessage)
		it.stackTrace
	}

	class Builder {
		private var bAlias:String = "";fun alias(block: () -> String?) { bAlias = block() ?: "" }
		private var bPath:String = "";fun path(block: () -> String?) { bPath = block() ?: "" }
		private var bTempDest:String = "";fun tempDest(block: () -> String?) { bTempDest = block() ?: "" }
		private var bConnInfo:RemoteConnMgmt? = null;fun connInfo(block: () -> RemoteConnMgmt?) { bConnInfo = block() }
		fun build(): CertManager = CertManager(bAlias, bPath, bTempDest, bConnInfo)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): CertManager =  Builder().apply(block).build()
	}
}

fun CertType.toCertManager(connInfo: RemoteConnMgmt?, tempDest: String = ""): CertManager = CertManager.builder {
	alias { alias }
	path { path }
	tempDest { tempDest }
	connInfo { connInfo }
}
