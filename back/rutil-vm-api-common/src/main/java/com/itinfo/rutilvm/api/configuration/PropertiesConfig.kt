package com.itinfo.rutilvm.api.configuration

import com.itinfo.rutilvm.common.LoggerDelegate
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import javax.annotation.PostConstruct

/**
 * [PropertiesConfig]
 * application.properties 에서 받아 올 수 있는 값
 *
 * @author 이찬희 (chanhi2000)
 * @since 2025.02.11
 */
@Component
open class PropertiesConfig {
	@Value("\${application.title}")					open lateinit var title: String
	@Value("\${application.version}")					open lateinit var version: String
	@Value("\${application.buildNo}")					lateinit var _buildNo: String
	@Value("\${application.release-date}")				open lateinit var releaseDate: String
	@Value("\${application.ovirt.ip}")					open lateinit var ovirtIp: String
	@Value("\${application.ovirt.port}")				lateinit var _ovirtPort: String
	@Value("\${application.ovirt.port.ssl}")			lateinit var _ovirtPortSsl: String
	@Value("\${application.ovirt.vnc.ip}")				open lateinit var ovirtVncIp: String
	@Value("\${application.ovirt.vnc.port}")			open lateinit var ovirtVncPort: String
	@Value("\${application.ovirt.admin.id}")			open lateinit var ovirtAdminId: String
	@Value("\${application.ovirt.admin.pw}")			open lateinit var ovirtAdminPw: String
	@Value("\${application.ovirt.threshold.cpu") 		private lateinit var _thresholdCpu: String
	@Value("\${application.ovirt.threshold.memory") 	private lateinit var _thresholdMemory: String
	@Value("\${application.ovirt.login.limit")			private lateinit var _loginLimit: String
	@Value("\${application.api.cors.allowed-origins}")	private lateinit var _corsAllowedOrigins: String
	@Value("\${application.api.cors.allowed-origins.port}")	private lateinit var _corsAllowedOriginsPort: String

	@Value("\${spring.datasource.history.url}")			open lateinit var historyJdbcUrl: String
	@Value("\${spring.datasource.engine.url}")			open lateinit var engineJdbcUrl: String
	@Value("\${spring.datasource.aaa.url}")				open lateinit var aaaJdbcUrl: String

	@Value("\${server.port}")							open lateinit var serverPort: String
	@Value("\${server.ssl.key-store}")					open lateinit var sslKeyStore: String
	@Value("\${server.ssl.key-store-password}")			open lateinit var sslKeyStorePassword: String
	@Value("\${server.ssl.key-alias}")					open lateinit var sslKeyAlias: String
	/*
	@Value("\${management.endpoints.web.exposure.include}")	lateinit var exposureInclude: String
	@Value("\${management.endpoint.shutdown.enabled}")		lateinit var _shutdownEnabled1: String
	@Value("\${endpoints.shutdown.enabled}")				lateinit var _shutdownEnabled2: String
	*/

	@Value("\${reboot-host.id}")				lateinit var rebootHostId: String
	@Value("\${reboot-host.password}")			lateinit var rebootHostPassword: String

	/*@Value("\${vmware.api.url}")				open lateinit var vmwareApiUrl: String
	@Value("\${vmware.api.id}")				open lateinit var vmwareApiId: String
	@Value("\${vmware.api.password}")			open lateinit var vmwareApiPassword: String*/

	open val buildNo: Int			get() = _buildNo.toIntOrNull() ?: 1
	open val ovirtPort: Int			get() = _ovirtPort.toIntOrNull() ?: 80
	open val ovirtPortSsl: Int		get() = _ovirtPortSsl.toIntOrNull() ?: 443

	open val thresholdCpu: Int
		get() = _thresholdCpu.toIntOrNull() ?: 80
	open val thresholdMemory: Int
		get() = _thresholdMemory.toIntOrNull() ?: 78
	open val loginLimit: Int
		get() = _loginLimit.toIntOrNull() ?: 5

	open val corsAllowedOrigins: List<String>
		get() = _corsAllowedOrigins.split(";")
	open val corsAllowedOriginsPort: List<String>
		get() = _corsAllowedOriginsPort.split(";")
	open val corsAllowedOriginsFull: List<String>
		get() = corsAllowedOrigins.flatMap { o ->
			corsAllowedOriginsPort.map { p ->
				"https://${o}${if (p != "443") ":$p" else ""}"
			}
		}
	/*
	val shutdownEnabled1: Boolean
		get() = _shutdownEnabled1.toBooleanStrictOrNull() ?: false
	val shutdownEnabled2: Boolean
		get() = _shutdownEnabled2.toBooleanStrictOrNull() ?: false
	*/


	@PostConstruct
	fun init() {
		log.info("init ... ")
		log.debug("  application.title: {}", title)
		log.debug("  application.version: {}", version)
		log.debug("  application.buildNo: {}", buildNo)
		log.debug("  application.release-date: {}\n\n", releaseDate)
		log.debug("  application.ovirt.ip: {}", ovirtIp)
		log.debug("  application.ovirt.port: {}", ovirtPort)
		log.debug("  application.ovirt.port.ssl: {}", ovirtPortSsl)
		log.debug("  application.ovirt.vnc.ip: {}", ovirtVncIp)
		log.debug("  application.ovirt.vnc.port: {}", ovirtVncPort)
		log.debug("  application.ovirt.admin.id: {}", ovirtAdminId)
		log.debug("  application.ovirt.admin.pw: {}", ovirtAdminPw)
		log.debug("  application.ovirt.threshold.cpu: {}", thresholdCpu)
		log.debug("  application.ovirt.threshold.memory: {}", thresholdMemory)
		log.debug("  application.api.cors.allowed-origins: {}", corsAllowedOrigins)
		log.debug("  application.api.cors.allowed-origins.port: {}", corsAllowedOriginsPort)
		log.debug("  application.api.cors.allowed-origins (FULL): {}", corsAllowedOriginsFull)
		log.debug("  application.ovirt.login.limit: {}\n\n", loginLimit)
		log.debug("  server.port: {}", serverPort)
		log.debug("  server.ssl.key-store: {}", sslKeyStore)
		log.debug("  server.ssl.key-store-password: {}", sslKeyStorePassword)
		log.debug("  server.ssl.key-alias: {}\n\n", sslKeyAlias)
		log.debug("  spring.datasource.history.url: {}", historyJdbcUrl)
		log.debug("  spring.datasource.engine.url: {}", engineJdbcUrl)
		log.debug("  spring.datasource.aaa.url: {}\n\n", aaaJdbcUrl)
		/*log.debug("  management.endpoints.web.exposure.include: {}", exposureInclude)
		log.debug("  management.endpoint.shutdown.enabled: {}", shutdownEnabled1)
		log.debug("  endpoints.shutdown.enabled: {}\n\n", shutdownEnabled2)*/
		log.debug("  reboot-host.id: {}", rebootHostId)
		log.debug("  reboot-host.password: {}\n\n", rebootHostPassword)

		/*log.debug("  vmware.api.url: {}", vmwareApiUrl)
		log.debug("  vmware.api.id: {}", vmwareApiId)
		log.debug("  vmware.api.password: {}\n\n", vmwareApiPassword)*/
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
