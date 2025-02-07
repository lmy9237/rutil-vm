package com.itinfo.service.impl


import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.util.BasicConfiguration
import com.itinfo.rutilvm.util.model.SystemPropertiesVo
import com.itinfo.service.SystemPropertiesService

import org.springframework.stereotype.Service


/**
 * [SystemPropertiesServiceImpl]
 * 시스템 설정 관리 서비스 응용체
 *
 * @author chlee
 * @since 2023.12.07
 */
@Service
class SystemPropertiesServiceImpl : SystemPropertiesService {
	// @Autowired private lateinit var systemPropertiesDao: SystemPropertiesDao
	private val basicConf: BasicConfiguration
		get() = BasicConfiguration.getInstance()

	override fun retrieveSystemProperties(): SystemPropertiesVo {
		val vo = basicConf.systemProperties
		log.info("... retrieveSystemProperties ... result: $vo")
		return vo
	}

	override fun saveSystemProperties(systemProperties: SystemPropertiesVo): Int {
		log.info("... saveSystemProperties")
		// return systemPropertiesDao.updateSystemProperties(systemProperties);
		return -1; // TODO: 개발 필요
	}

	// TODO : 버전 조회 방식 변경
	override fun retrieveProgramVersion(): Array<String> {
		log.info("... retrieveProgramVersion")
		val result = arrayOf<String>(
//			"오케스트로 v${basicConf.okestroVersion}",
//			basicConf.okestroReleaseDate
		)
		log.info("... retrieveProgramVersion ... res: $result")
		return result
	}
	
	companion object {
		private val log by LoggerDelegate()
	}
}

