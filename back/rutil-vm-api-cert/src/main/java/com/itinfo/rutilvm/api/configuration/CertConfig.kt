package com.itinfo.rutilvm.api.configuration

import com.itinfo.rutilvm.api.model.cert.CertManager
import com.itinfo.rutilvm.api.model.cert.toCertManager
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.util.cert.model.EngineCertType
import com.itinfo.rutilvm.util.ssh.model.RemoteConnMgmt
import com.jcraft.jsch.JSch
import com.jcraft.jsch.Logger
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.io.File
import java.io.IOException
import javax.annotation.PostConstruct

/**
 * [CertConfig]
 * oVirt 관련 인증서 관리 설정
 *
 * @since 2025-02-21
 * @author 이찬희 (@chanhi2000)
 */
@Configuration
open class CertConfig(

) {
	@Autowired private lateinit var pkiServiceClient: PkiServiceClient

	@Value("\${application.ovirt.ssh.jsch.log.enabled}")	private lateinit var _jschLogEnabled: String
	@Value("\${application.ovirt.ssh.jsch.connection-timeout}")	private lateinit var _jschConnectionTimeout: String
	@Value("\${application.ovirt.ssh.cert.location}")		lateinit var ovirtSSHCertLocation: String
	@Value("\${application.ovirt.ssh.prvkey.location}")		private lateinit var _ovirtSSHPrivateKeyLocation: String
	@Value("\${application.ovirt.ssh.engine.address}")		private lateinit var _ovirtSSHEngineAddress: String
	@Value("\${application.ovirt.ssh.engine.prvkey}")		lateinit var ovirtSSHEnginePrvKey: String

	val jschLogEnabled: Boolean
		get() = _jschLogEnabled.toBooleanStrictOrNull() ?: false
	val jschConnectionTimeout: Int
		get() = _jschConnectionTimeout.toIntOrNull() ?: RemoteConnMgmt.DEFAULT_CONNECTION_TIMEOUT
	val ovirtEngineSSH: RemoteConnMgmt
		get() = RemoteConnMgmt.asRemoteConnMgmt(_ovirtSSHEngineAddress, ovirtSSHEnginePrvKey, jschConnectionTimeout)

	val ovirtSSHPrvKey: String?
		get() = (try {  File(_ovirtSSHPrivateKeyLocation) } catch (e: IOException) { log.error("something went WRONG! ... reason: {}", e.localizedMessage);null })?.readText(Charsets.UTF_8)


	@PostConstruct
	fun init() {
		log.info("init ... ")
		log.debug("  application.ovirt.ssh.jsch.log.enabled: {}", jschLogEnabled)
		log.debug("  application.ovirt.ssh.jsch.connection-timeout: {}", jschConnectionTimeout)
		log.debug("  application.ovirt.ssh.cert.location: {}", ovirtSSHCertLocation)
		log.debug("  application.ovirt.ssh.prvkeypath: {}", _ovirtSSHPrivateKeyLocation)
		log.debug("  application.ovirt.ssh.engine.address: {}", pkiServiceClient.fetchEngineSshPublicKey())
		log.debug("  application.ovirt.ssh.engine.prvkey: {}", ovirtSSHEnginePrvKey)

		log.debug("  ovirtSSHPrvKey ... {}", ovirtSSHPrvKey)
		log.debug("  ovirtEngineSSH ... {}", ovirtEngineSSH)
		// log.debug("  ovirtHostSSHs ... {}\n\n", ovirtHostSSHs)

		if (!jschLogEnabled) return
		JSch.setLogger(object : Logger {
			override fun isEnabled(level: Int): Boolean = true
			override fun log(level: Int, message: String) {
				val canonicalName = CertConfig::class.java.canonicalName
				when(level) {
					Logger.INFO -> log.info("{}: {}", canonicalName, message)
					Logger.WARN -> log.warn("{}: {}", canonicalName, message)
					Logger.FATAL, Logger.ERROR -> log.error("{}: {}",canonicalName, message)
					else -> log.debug("{}: {}",canonicalName, message)
				}
			}
		})

	}

	@Bean
	open fun engineCertManagers(): List<CertManager> {
		log.info("engineCertManagers ... ")
		val certs = EngineCertType.values().filter {
			it != EngineCertType.UNKNOWN
		}.map {
			it.toCertManager(conn4Engine(), ovirtSSHCertLocation)
		}
		return certs.onEach {
			// 반환 전에 한번 임시저장
			val res: Boolean = it.save2Tmp().getOrNull() ?: false
			if (res) log.info("engineCertManagers ... SUCCESS") else log.warn("downloadEngineCerts ... FAILURE for {}", it.alias)
		}
	}

	@Bean
	open fun conn4Engine(): RemoteConnMgmt {
		log.info("conn4Engine ...")
		return ovirtEngineSSH
	}

	companion object {
		private val log by LoggerDelegate()
		private const val DEFAULT_SPLIT = "|"
	}
}
