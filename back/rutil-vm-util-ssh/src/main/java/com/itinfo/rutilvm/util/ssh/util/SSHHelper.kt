package com.itinfo.rutilvm.util.ssh.util

import com.jcraft.jsch.ChannelExec
import com.jcraft.jsch.ChannelSftp
import com.jcraft.jsch.JSch
import com.jcraft.jsch.JSchException
import com.jcraft.jsch.Session
import org.slf4j.LoggerFactory
import java.util.*

private val log = LoggerFactory.getLogger(SSHHelper::class.java.canonicalName)

class SSHHelper {
	companion object {
		@Volatile private var INSTANCE: SSHHelper? = null
		@JvmStatic fun getInstance(): SSHHelper = INSTANCE ?: synchronized(this) {
			INSTANCE ?: build().also { INSTANCE = it }
		}
		private fun build(): SSHHelper = SSHHelper()
		const val SSH_COMMAND_RESTART = "sudo -S reboot"
		const val SSH_COMMAND_SET_MAINTENANCE_ACTIVE = "sudo hosted-engine --set-maintenance --mode=global"
	}

	fun getInsecureSession(
		host: String?,
		port: Int,
		user: String,
		password: String,
	): Session? {
		val jsch = JSch()
		val session: Session? = jsch.getSession(user, host, port)
		session?.setPassword(password)
		// Disable host key checking for simplicity (not recommended for production)
		session?.setConfig(Properties().apply {
			put("StrictHostKeyChecking", "no")
			// put("PreferredAuthentications", "password")
		})
		return session?.also {
			it.connect()
		}
	}

	fun connectToSFTP(session: Session?): ChannelSftp?
		= (session?.openChannel("sftp") as? ChannelSftp).also {
			it?.connect()
		}
}

@Throws(JSchException::class)
fun Session.executeAll(commands: List<String>): Result<Boolean> = runCatching {
	log.debug("executeAll ...")
	val channel: ChannelExec? = this.openChannel("exec") as? ChannelExec
	log.info("---------------------------------------")
	for (c in commands) {
		log.debug("> {}", c)
		channel?.setCommand(c)
	}
	log.info("---------------------------------------")
	// 시작!
	channel?.connect()

	val startTime = System.currentTimeMillis()
	while (channel?.isClosed == false && System.currentTimeMillis() - startTime < 30000) {
		Thread.sleep(100)
	}
	val exitStatus = channel?.exitStatus
	if (exitStatus != 0) {
		return@runCatching false
	}
	// 종료
	channel?.disconnect()
	this@executeAll.disconnect()
	true
}.onSuccess {
	log.info("명령어 실행 성공 ... ")
}.onFailure {
	log.error("명령어 실행 실패: {}", it.localizedMessage)
	// throw if (it is Error) it.toItCloudException() else it
	throw it
}
