package com.itinfo.rutilvm.util.ssh.model

import com.google.gson.Gson
import com.google.gson.GsonBuilder
import com.itinfo.rutilvm.util.ssh.util.SSHHelper
import com.itinfo.rutilvm.util.ssh.util.executeAll
import com.jcraft.jsch.JSch
import com.jcraft.jsch.Session
import org.slf4j.LoggerFactory
import java.io.Serializable
import java.util.*

private val log = LoggerFactory.getLogger("com.itinfo.rutilvm.util.ssh.model.RemoteConnMgmtKt")

private val gson: Gson =
	GsonBuilder()
		.setPrettyPrinting()
		.create()

/**
 * [RemoteConnMgmt]
 * SSH 연결 유형
 *
 * @since 2025.02.20
 * @author chanhi2000
 */
open class RemoteConnMgmt(
	val host: String = "",
	val port: Int = 0,
	val id: String = "",
	val prvKey: String? = null,
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bHost: String = "";fun host(block: () -> String?) { bHost = block() ?: "" }
		private var bPort: Int = 0;fun port(block: () -> Int?) { bPort = block() ?: 0 }
		private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bPrvKey: String? = null;fun prvKey(block: () -> String?) { bPrvKey = block() }
		fun build(): RemoteConnMgmt = RemoteConnMgmt(bHost, bPort, bId, bPrvKey)
	}

	companion object {
		private val MATCHER_ADDRESS = "(?<=@)[^:]+(?=:)".toRegex()
		fun asRemoteConnMgmt(fullAddress: String, prvKey: String? = null): RemoteConnMgmt {
			val id: String = fullAddress.split("@").first()
			val host: String = MATCHER_ADDRESS.find(fullAddress)?.value ?: ""
			val port: Int = fullAddress.split(":").last().toIntOrNull() ?: 22
			return builder {
				host { host }
				port { port }
				id { id }
				prvKey { prvKey }
			}
		}
		inline fun builder(block: Builder.() -> Unit): RemoteConnMgmt = Builder().apply(block).build()
	}
}

/**
 * [RemoteConnMgmt.rebootHostViaSSH]
 * SSH로 재시작
 */
fun RemoteConnMgmt.rebootSystem(): Result<Boolean> = runCatching {
	log.info("rebootSystem ... ")
	val session: Session? = toInsecureSession()
	return session?.executeAll(listOf(SSHHelper.SSH_COMMAND_RESTART)) ?: throw Error("UNKNOWN ERROR!")
}.onSuccess {
	log.info("SSH 재부팅 성공: {}", it)
}.onFailure {
	log.error("SSH 재부팅 실패: {}", it.localizedMessage)
	// throw if (it is Error) it.toItCloudException() else it
	throw it
}

fun RemoteConnMgmt.toInsecureSession(): Session? {
	log.debug("toInsecureSession... fullAddress: {}, prvKey: {}", "${id}@${host}:${port}", prvKey)
	val jsch = JSch()
	val session: Session? = jsch.getSession(id, host, port)
	jsch.addIdentity(UUID.randomUUID().toString(), prvKey?.toByteArray(), null, "".toByteArray())
	session?.setConfig(Properties().apply {
		put("StrictHostKeyChecking", "no")
		put("PreferredAuthentications", "publickey")
	})
	return session?.also {
		it.connect(5000)
	}
}
