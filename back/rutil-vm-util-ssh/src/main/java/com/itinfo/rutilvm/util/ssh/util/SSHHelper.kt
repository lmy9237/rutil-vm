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
		const val SSH_COMMAND_SET_MAINTENANCE_DEACTIVE = "sudo hosted-engine --set-maintenance --mode=none"
		const val RUTILVM_DIR_HOME_HOST = "/home/rutilvm"
		const val RUTILVM_DIR_SSH_HOST = "${RUTILVM_DIR_HOME_HOST}/.ssh"
		const val RUTILVM_SSH_APP_PUBKEY = "${RUTILVM_DIR_SSH_HOST}/id_rsa.pub"
		/**
		 * [SSHHelper.sshRegisterRutilvmPubkey2Host]
		 * 엔진 rutilvm사용자의 (설치 당시 미리 만들어진) ssh 공개키를
		 * 최종적으로 호스트의 rutilvm사용자의 authorized_keys에 등록하여
		 * 비밀번호 없이 접근 가능하도록 만든 명령어
		 *
		 * 목적: 신규 등록한 호스트에 접근하여 등록처리
		 *
		 * @return [String] 조합 된 명령어
		 */
		fun registerRutilvmPubkey2Host(
			targetHost: String? = "",
			rootPassword4Host: String? = "",
			pubkey2Add: String? = "",
		): String {
			// val _pubkey = if (pubkey2Add.isNullOrEmpty()) "cat $RUTILVM_SSH_APP_PUBKEY" else "echo $pubkey2Add"
return """
cat $RUTILVM_SSH_APP_PUBKEY | sshpass -p '${rootPassword4Host}' ssh root@${targetHost} "su - rutilvm -c 'mkdir -p $RUTILVM_DIR_SSH_HOST && touch $RUTILVM_DIR_SSH_HOST/authorized_keys && chown -R rutilvm:rutilvm $RUTILVM_DIR_SSH_HOST && chmod 700 $RUTILVM_DIR_SSH_HOST && chmod 600 $RUTILVM_DIR_SSH_HOST/authorized_keys && tee -a $RUTILVM_DIR_SSH_HOST/authorized_keys > /dev/null'"
""".trimIndent()
		}
// cat $RUTILVM_SSH_APP_PUBKEY | sshpass -p '${rootPassword4Host}' ssh root@${targetHost} "su - rutilvm -c 'mkdir -p $RUTILVM_DIR_SSH_HOST && touch $RUTILVM_DIR_SSH_HOST/authorized_keys && chown -R rutilvm:rutilvm $RUTILVM_DIR_SSH_HOST && chmod 700 $RUTILVM_DIR_SSH_HOST && chmod 600 $RUTILVM_DIR_SSH_HOST/authorized_keys && tee -a $RUTILVM_DIR_SSH_HOST/authorized_keys > /dev/null'"
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
