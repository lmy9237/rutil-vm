package com.itinfo.rutilvm.util.ssh.model

import com.google.gson.Gson
import com.google.gson.GsonBuilder
import com.itinfo.rutilvm.util.ssh.util.SSHHelper
import com.itinfo.rutilvm.util.ssh.util.executeAll
import com.jcraft.jsch.JSch
import com.jcraft.jsch.Session
import com.jcraft.jsch.UserInfo
import org.slf4j.LoggerFactory
import java.io.Serializable
import java.util.*

private val log = LoggerFactory.getLogger(RemoteConnMgmt::class.java.canonicalName)

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
	val connectionTimeout: Int? = DEFAULT_CONNECTION_TIMEOUT,
	val prvKey: String? = null,
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bHost: String = "";fun host(block: () -> String?) { bHost = block() ?: "" }
		private var bPort: Int = 0;fun port(block: () -> Int?) { bPort = block() ?: 0 }
		private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bConnectionTimeout: Int? = DEFAULT_CONNECTION_TIMEOUT;fun connectionTimeout(block: () -> Int?) { bConnectionTimeout = block() ?:DEFAULT_CONNECTION_TIMEOUT }
		private var bPrvKey: String? = null;fun prvKey(block: () -> String?) { bPrvKey = block() }
		fun build(): RemoteConnMgmt = RemoteConnMgmt(bHost, bPort, bId, bConnectionTimeout, bPrvKey)
	}

	companion object {
		const val DEFAULT_CONNECTION_TIMEOUT = 60000
		private const val DELIMITER_ADDRESS = ";"
		private val MATCHER_ADDRESS = "(?<=@)[^:]+(?=:)".toRegex()
		fun asRemoteConnMgmt(fullAddress: String, prvKey: String? = null, connectionTimeout: Int = DEFAULT_CONNECTION_TIMEOUT): RemoteConnMgmt {
			val id: String = fullAddress.split("@").first()
			val host: String = MATCHER_ADDRESS.find(fullAddress)?.value ?: ""
			val port: Int = fullAddress.split(DELIMITER_ADDRESS).last().toIntOrNull() ?: 22
			return builder {
				host { host }
				port { port }
				id { id }
				connectionTimeout { connectionTimeout }
				prvKey { prvKey }
			}
		}
		inline fun builder(block: Builder.() -> Unit): RemoteConnMgmt = Builder().apply(block).build()
	}
}

/**
 * [RemoteConnMgmt.activateGlobalHA]
 * SSH로 global HA 활성화
 *
 */
fun RemoteConnMgmt.activateGlobalHA(): Result<Boolean> = runCatching {
	log.info("enableGlobalHA ... ")
	val session: Session? = toInsecureSession()
	return session?.executeAll(listOf(SSHHelper.SSH_COMMAND_SET_MAINTENANCE_ACTIVE)) ?: throw Error("UNKNOWN ERROR!")
}.onSuccess {
	log.info("SSH로 '글로벌 HA 활성화' 성공: {}", it)
}.onFailure {
	log.error("SSH로 '글로벌 HA 활성화' 실패: {}", it.localizedMessage)
	// throw if (it is Error) it.toItCloudException() else it
	throw it
}
fun RemoteConnMgmt.deactivateGlobalHA(): Result<Boolean> = runCatching {
	log.info("deactivateGlobalHA ... ")
	val session: Session? = toInsecureSession()
	return session?.executeAll(listOf(SSHHelper.SSH_COMMAND_SET_MAINTENANCE_DEACTIVE)) ?: throw Error("UNKNOWN ERROR!")
}.onSuccess {
	log.info("SSH로 '글로벌 HA 비활성화' 성공: {}", it)
}.onFailure {
	log.error("SSH로 '글로벌 HA 비활성화' 실패: {}", it.localizedMessage)
	// throw if (it is Error) it.toItCloudException() else it
	throw it
}

/**
 * [RemoteConnMgmt.rebootHostViaSSH]
 * SSH로 재시작
 */
fun RemoteConnMgmt.rebootSystem(command: String? = SSHHelper.SSH_COMMAND_RESTART): Result<Boolean> = runCatching {
	log.info("rebootSystem ... ")
	val session: Session? = toInsecureSession()
	if (command.isNullOrEmpty())
		throw Error("명령어가 없음")
	return session?.executeAll(listOf(command)) ?: throw Error("UNKNOWN ERROR!")
}.onSuccess {
	log.info("SSH로 재부팅 성공: {}", it)
}.onFailure {
	log.error("SSH로 재부팅 실패: {}", it.localizedMessage)
	// throw if (it is Error) it.toItCloudException() else it
	throw it
}

fun RemoteConnMgmt.toInsecureSession(connectionTimeout: Int = 60000): Session? {
	log.debug("toInsecureSession... fullAddress: {}, prvKey: {}", "${id}@${host}:${port}", prvKey)
	val jsch = JSch()
	val session: Session? = jsch.getSession(id, host, port)
	jsch.addIdentity(UUID.randomUUID().toString(), prvKey?.toByteArray(), null, "".toByteArray())
	session?.setConfig(Properties().apply {
		put("StrictHostKeyChecking", "no")
		put("PreferredAuthentications", "publickey")
	})
	/*
	session?.userInfo = object: UserInfo {
		override fun getPassphrase(): String? {
			TODO("Not yet implemented")
		}

		override fun getPassword(): String? {
			TODO("Not yet implemented")
		}

		override fun promptPassword(message: String?): Boolean {
			TODO("Not yet implemented")
		}

		override fun promptPassphrase(message: String?): Boolean {
			TODO("Not yet implemented")
		}

		override fun promptYesNo(message: String?): Boolean {
			TODO("Not yet implemented")
		}

		override fun showMessage(message: String?) {
			TODO("Not yet implemented")
		}
	})
	*/
	return session?.also {
		it.connect(connectionTimeout)
	}
}
