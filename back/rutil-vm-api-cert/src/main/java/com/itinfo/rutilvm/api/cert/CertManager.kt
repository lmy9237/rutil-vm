package com.itinfo.rutilvm.api.cert

import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.util.cert.model.CertType
import com.itinfo.rutilvm.util.cert.util.CertParser
import com.itinfo.rutilvm.util.ssh.model.RemoteConnMgmt
import com.itinfo.rutilvm.util.ssh.model.toInsecureSession
import com.itinfo.rutilvm.util.ssh.util.fetchFile

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
	val id: Int,
	val alias: String,
	val path: String,
	private val connInfo: RemoteConnMgmt?
): Serializable {
	override fun toString(): String = gson.toJson(this)

	private val certFileData: ByteArray?
		get() =  connInfo?.toInsecureSession()?.fetchFile(path)

	private val cert: X509Certificate?
		get() = certP.parseCertificate(certFileData)

	open val version: String
		get() = "v${cert?.version ?: 0}"

	open val notAfter: Date?
		get() = cert?.notAfter

	open val serialNumber: BigInteger
		get() = cert?.serialNumber ?: BigInteger.ZERO

	open val daysRemaining: Long
		get() {
			val currentDate = Date()
			val diffInMillis: Long = (notAfter?.time?.minus(currentDate.time)) ?: 0L
			return diffInMillis / (24*60*60*1000)
		}

	class Builder {
		private var bId:Int = 0;fun id(block: () -> Int?) { bId = block() ?: 0 }
		private var bAlias:String = "";fun alias(block: () -> String?) { bAlias = block() ?: "" }
		private var bPath:String = "";fun path(block: () -> String?) { bPath = block() ?: "" }
		private var bConnInfo:RemoteConnMgmt? = null;fun connInfo(block: () -> RemoteConnMgmt?) { bConnInfo = block() }
		fun build(): CertManager = CertManager(bId, bAlias, bPath, bConnInfo)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): CertManager =  Builder().apply(block).build()
	}
}

fun CertType.toCertManager(connInfo: RemoteConnMgmt?): CertManager = CertManager.builder {
	id { id }
	alias { alias }
	path { path }
	connInfo { connInfo }
}
