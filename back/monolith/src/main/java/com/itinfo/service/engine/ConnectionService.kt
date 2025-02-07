package com.itinfo.service.engine

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.model.toConnection
import com.itinfo.service.SystemPropertiesService

import org.ovirt.engine.sdk4.Connection

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Scope
import org.springframework.context.annotation.ScopedProxyMode
import org.springframework.stereotype.Component

import java.util.*


@Scope(value = "session", proxyMode = ScopedProxyMode.TARGET_CLASS)
@Component
class ConnectionService(
	val uid: String = Random().nextInt(1000).toString()
) {
	@Autowired private lateinit var systemPropertiesService: SystemPropertiesService

	fun getConnection(): Connection {
		log.debug("getConnection ...")
		val systemProperties = systemPropertiesService.retrieveSystemProperties()
		return systemProperties.toConnection()
	}
	companion object {
		private val log by LoggerDelegate()
	}
}

