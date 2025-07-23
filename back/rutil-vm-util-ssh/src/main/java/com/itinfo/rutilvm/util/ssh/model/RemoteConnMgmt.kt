package com.itinfo.rutilvm.util.ssh.model

import com.google.gson.Gson
import com.google.gson.GsonBuilder
import com.itinfo.rutilvm.util.ssh.util.SSHHelper
import com.itinfo.rutilvm.util.ssh.util.executeAll
import com.jcraft.jsch.JSch
import com.jcraft.jsch.JSchException
import com.jcraft.jsch.Session
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
@Throws(JSchException::class)
fun RemoteConnMgmt.activateGlobalHA(): Boolean? {
	log.info("enableGlobalHA ... ")
	val session: Session? = toInsecureSession()
	return session?.executeAll(listOf(SSHHelper.SSH_COMMAND_SET_MAINTENANCE_ACTIVE))?.getOrThrow()
}

@Throws(JSchException::class)
fun RemoteConnMgmt.deactivateGlobalHA(): Boolean? {
	log.info("deactivateGlobalHA ... ")
	val session: Session? = toInsecureSession()
	return session?.executeAll(listOf(SSHHelper.SSH_COMMAND_SET_MAINTENANCE_DEACTIVE))?.getOrThrow()
}

/**
 * [RemoteConnMgmt.rebootHostViaSSH]
 * SSH로 재시작
 */
@Throws(JSchException::class)
fun RemoteConnMgmt.rebootSystem(command: String? = SSHHelper.SSH_COMMAND_RESTART): Boolean? {
	log.info("rebootSystem ... ")
	val session: Session? = toInsecureSession()
	if (command.isNullOrEmpty())
		throw Error("명령어가 없음")
	return session?.executeAll(listOf(command))?.getOrThrow()
}

fun RemoteConnMgmt.registerRutilVMPubkey2Host(
	targetHost: String? = "",
	targetHostSshPort: Int? = 22,
	rootPassword4Host: String? = "",
	pubkey2Add: String? = "",
): Boolean? {
	log.info("registerRutilVMPubkey2Host ... targetHost: {}, targetHostSshPort: {}", targetHost, targetHostSshPort)
	val session: Session? = toInsecureSession()
	if (targetHost?.isEmpty() == true ||
		rootPassword4Host?.isEmpty() == true)
		throw Error("필수 값 없음")
	val command: List<String> = SSHHelper.registerRutilVMPubkey2Host(targetHost, targetHostSshPort, rootPassword4Host, pubkey2Add)
	return session?.executeAll(command)?.getOrThrow()
}

fun RemoteConnMgmt.toInsecureSession(isRoot: Boolean = false, connectionTimeout: Int = 60000): Session? {
	val _id = if (isRoot) "root" else id
	log.debug("toInsecureSession... fullAddress: {}, prvKey: {}", "${_id}@${host}:${port}", prvKey)
	val jsch = JSch()
	val session: Session? = jsch.getSession(_id, host, port)
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
