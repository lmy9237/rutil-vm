package com.itinfo.security

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.model.toConnection
import com.itinfo.service.SystemPropertiesService
import org.ovirt.engine.sdk4.Connection
import org.springframework.beans.factory.annotation.Autowired

class SecurityConnectionService(
	var user: String = "",
	var password: String = "",
	var url: String = ""
) {
	@Autowired private lateinit var systemPropertiesService: SystemPropertiesService

	fun getConnection(): Connection {
		log.info("... getConnection")
		val systemProperties =
			systemPropertiesService.retrieveSystemProperties()
		val connection = systemProperties.toConnection()
		return connection
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
