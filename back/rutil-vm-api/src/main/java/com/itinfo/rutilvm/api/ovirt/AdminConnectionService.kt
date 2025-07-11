package com.itinfo.rutilvm.api.ovirt

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.service.setting.ItSystemPropertiesService

import org.ovirt.engine.sdk4.Connection
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class AdminConnectionService {
	@Autowired
	private lateinit var systemPropertiesService: ItSystemPropertiesService
	fun getConnection(): Connection {
		// TODO null 체크 할 수 있는 예외처리 필요
//		log.debug("getConnection ... ")
		val systemProperties = systemPropertiesService.findOne()
		val connection: Connection? = try {
			 systemProperties.toConnection()
		} catch (e: Exception) {
			log.error(e.localizedMessage)
			null
		}
		return connection!!
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
