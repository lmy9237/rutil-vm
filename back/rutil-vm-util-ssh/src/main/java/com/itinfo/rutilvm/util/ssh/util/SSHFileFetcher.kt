package com.itinfo.rutilvm.util.ssh.util

import com.jcraft.jsch.ChannelSftp
import com.jcraft.jsch.JSchException
import com.jcraft.jsch.Session
import org.slf4j.LoggerFactory
import java.io.ByteArrayOutputStream
import java.io.IOException
import java.util.*

private val log = LoggerFactory.getLogger("com.itinfo.rutilvm.util.ssh.SSHCertFetcherKt")

private val sshH: SSHHelper
	get() = SSHHelper.getInstance()

/**
 * [SSHFileFetcher]
 * 인증서 가져오기
 *
 * @author 이찬희 (chanhi2000)
 * @since 2025.02.20
 */
class SSHFileFetcher {
	companion object {
		@Volatile private var INSTANCE: SSHFileFetcher? = null
		@JvmStatic fun getInstance(): SSHFileFetcher = INSTANCE ?: synchronized(this) {
			INSTANCE ?: build().also { INSTANCE = it }
		}
		fun build(): SSHFileFetcher = SSHFileFetcher()
	}

	@Throws(IOException::class)
	fun fetchFile(
		host: String?,
		port: Int,
		username: String,
		password: String,
		remoteFile: String
	): ByteArray? {
		log.info("fetchFile ... ")
		if (host.isNullOrEmpty()) {
			log.error("something went WRONG ... reason: host EMPTY")
			return null
		}
		if (port == 0) {
			log.error("something went WRONG ... reason: INVALID port value: {}", port)
			return null
		}
		if (username.isEmpty()) {
			log.error("something went WRONG ... reason: username EMPTY")
			return null
		}
		if (password.isEmpty()) {
			log.error("something went WRONG ... reason: password EMPTY")
			return null
		}

		val session: Session? = sshH.getInsecureSession(host, port, username, password)
		val channel: ChannelSftp? = sshH.connectToSFTP(session)

		val baos = ByteArrayOutputStream()
		channel?.get(remoteFile, baos)
		channel?.disconnect()
		session?.disconnect()
		return baos.toByteArray()
	}
}

@Throws(IOException::class)
fun Session.fetchFile(remoteFile: String): ByteArray? {
	log.info("fetchFileUsingSession ... ")
	val channel: ChannelSftp? = sshH.connectToSFTP(this@fetchFile)

	val baos = ByteArrayOutputStream()
	channel?.get(remoteFile, baos)
	channel?.disconnect()
	this@fetchFile.disconnect()
	return baos.toByteArray()
}
