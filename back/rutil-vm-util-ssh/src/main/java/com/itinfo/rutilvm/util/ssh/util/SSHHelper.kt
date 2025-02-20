package com.itinfo.rutilvm.util.ssh.util

import com.jcraft.jsch.ChannelSftp
import com.jcraft.jsch.JSch
import com.jcraft.jsch.Session
import java.util.*

class SSHHelper {
	companion object {
		@Volatile private var INSTANCE: SSHHelper? = null
		@JvmStatic fun getInstance(): SSHHelper = INSTANCE ?: synchronized(this) {
			INSTANCE ?: build().also { INSTANCE = it }
		}
		private fun build(): SSHHelper = SSHHelper()
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
