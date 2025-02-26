package com.itinfo.rutilvm.api.cert

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.util.cert.model.CertType
import com.itinfo.rutilvm.util.cert.util.CertParser
import com.itinfo.rutilvm.util.ssh.model.RemoteConnMgmt
import com.itinfo.rutilvm.util.ssh.model.toInsecureSession
import com.itinfo.rutilvm.util.ssh.util.fetchFile
import com.jcraft.jsch.JSchException

import java.io.Serializable
import java.math.BigInteger
import java.security.cert.X509Certificate
import java.util.*

private val certP: CertParser
	get() = CertParser.getInstance()

/**
 * [CertManager]
 * 인증서 정보 관리
 */
open class CertManager(
	val alias: String,
	val path: String,
	private val connInfo: RemoteConnMgmt?
): Serializable {
	override fun toString(): String = gson.toJson(this)

	private val certFileData: ByteArray?
		get() = try {
			log.info("certFileData ... path: {}", path)
			connInfo?.toInsecureSession()?.fetchFile(path)
		} catch (e: JSchException) {
			log.error("something went WRONG ... reason: {}", e.localizedMessage)
			null
		}

	private val cert: X509Certificate?
		get() = try {
			certP.parseCertificate(certFileData)
		} catch (e: NullPointerException) {
			log.error("something went WRONG ... reason: {}", e.localizedMessage)
			null
		}

	open val version: String
		get() = if (cert == null) "N/A" else "v${cert?.version}"

	open val address: String
		get() = connInfo?.host ?: ""

	open val notAfter: Date?
		get() = cert?.notAfter

	open val serialNumber: BigInteger?
		get() = cert?.serialNumber ?: BigInteger.ZERO

	private val _daysRemaining: Long?
		get() {
			val currentDate = Date()
			val diffInMillis: Long = (notAfter?.time?.minus(currentDate.time)) ?: -1L
			return if (diffInMillis == -1L) diffInMillis
			else diffInMillis / (24*60*60*1000)
		}
	open val daysRemaining: String
		get() = "${_daysRemaining ?: "N/A"}"
	
	class Builder {
		private var bAlias:String = "";fun alias(block: () -> String?) { bAlias = block() ?: "" }
		private var bPath:String = "";fun path(block: () -> String?) { bPath = block() ?: "" }
		private var bConnInfo:RemoteConnMgmt? = null;fun connInfo(block: () -> RemoteConnMgmt?) { bConnInfo = block() }
		fun build(): CertManager = CertManager(bAlias, bPath, bConnInfo)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): CertManager =  Builder().apply(block).build()
		private val log by LoggerDelegate()
	}
}

fun CertType.toCertManager(connInfo: RemoteConnMgmt?): CertManager = CertManager.builder {
	alias { alias }
	path { path }
	connInfo { connInfo }
}
