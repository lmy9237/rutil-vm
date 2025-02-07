package com.itinfo.service.engine

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.model.karajan.KarajanVo
import com.itinfo.model.karajan.toKarajanVo
import com.itinfo.service.SystemPropertiesService

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component


@Component
class KarajanService {
	@Autowired private lateinit var adminConnectionService: AdminConnectionService
	@Autowired private lateinit var systemPropertiesService: SystemPropertiesService
	fun getDataCenter(): KarajanVo {
		log.debug("getDataCenter ...")
		val connection = adminConnectionService.getConnection()
		val properties = systemPropertiesService.retrieveSystemProperties()
		val vo = properties.toKarajanVo(connection).also {
			log.debug("vo FOUND! $it")
		}
		return vo
	}

	companion object {
		private val log by LoggerDelegate()
	}
}

