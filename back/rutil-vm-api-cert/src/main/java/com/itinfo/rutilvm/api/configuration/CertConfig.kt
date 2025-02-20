package com.itinfo.rutilvm.api.configuration

import com.itinfo.rutilvm.api.cert.CertManager
import com.itinfo.rutilvm.api.cert.toCertManager
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.util.cert.model.CertType
import com.itinfo.rutilvm.util.ssh.model.RemoteConnMgmt
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import javax.annotation.PostConstruct

/**
 * [CertConfig]
 * oVirt 관련 인증서 관리 설정
 *
 * @since 2025.02.21
 * @author chanhi2000
 */
@Configuration
open class CertConfig(

) {
	@Value("\${application.ovirt.ip}")						lateinit var ovirtEngineSSHIp: String
	@Value("\${application.ovirt.host.ssh.ip}")				lateinit var ovirtHostSSHIp: String
	@Value("\${application.ovirt.host.ssh.port}")			private lateinit var _ovirtHostSSHPort: String
	@Value("\${application.ovirt.host.ssh.id}")				lateinit var ovirtHostSSHId: String
	@Value("\${application.ovirt.host.ssh.pw}")				lateinit var ovirtHostSSHPw: String

	val ovirtHostSSHPort: Int
		get() = _ovirtHostSSHPort.toIntOrNull() ?: 22

	@PostConstruct
	fun init() {
		log.info("init ... ")
		log.debug("  application.ovirt.ip: {}", ovirtEngineSSHIp)
		log.debug("  application.ovirt.host.ssh.ip: {}", ovirtHostSSHIp)
		log.debug("  application.ovirt.host.ssh.port: {}", ovirtHostSSHPort)
		log.debug("  application.ovirt.host.ssh.id: {}", ovirtHostSSHId)
		log.debug("  application.ovirt.host.ssh.pw: {}\n\n", ovirtHostSSHPw)
	}

	@Bean
	open fun allCertManagers(): List<CertManager> {
		log.info("parseCerts ...")
		return vdsmCertManagers() + engineCertManagers()
	}

	@Bean
	open fun engineCertManagers(): List<CertManager> {
		log.info("engineCertManagers ... ")
		val certs = CertType.engineCertTypes.map { it.toCertManager(conn4Engine()) }
		return certs
	}

	@Bean
	open fun vdsmCertManagers(): List<CertManager> {
		log.info("vdsmCertManagers ...")
		val certs = CertType.vdsmCertTypes.map { it.toCertManager(conn4VDSM()) }
		return certs
	}

	@Bean
	open fun conn4VDSM(): RemoteConnMgmt {
		log.info("conn4VDSM ...")
		return RemoteConnMgmt.forVDSM(ovirtHostSSHIp, ovirtHostSSHPort, ovirtHostSSHId, ovirtHostSSHPw)
	}

	@Bean
	open fun conn4Engine(): RemoteConnMgmt {
		log.info("conn4Engine ...")
		return RemoteConnMgmt.forEngine(ovirtEngineSSHIp, ovirtHostSSHPort, ovirtHostSSHId, ovirtHostSSHPw)
	}

	/*
	@Bean
	open fun sshFileFetcher(): SSHFileFetcher {
		log.info("sshFileFetcher ...")
		return SSHFileFetcher.getInstance()
	}

	@Bean
	open fun sshHelper(): SSHHelper {
		log.info("sshHelper ...")
		return SSHHelper.getInstance()
	}
	*/

	companion object {
		private val log by LoggerDelegate()
	}
}
