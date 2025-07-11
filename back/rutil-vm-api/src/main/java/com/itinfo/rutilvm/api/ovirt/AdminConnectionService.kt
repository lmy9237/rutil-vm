package com.itinfo.rutilvm.api.ovirt

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.service.setting.ItSystemPropertiesService
import com.itinfo.rutilvm.util.model.basicConf

import org.ovirt.engine.sdk4.Connection
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component


@Component
class AdminConnectionService {
	@Autowired	private lateinit var iSystemProperties: ItSystemPropertiesService
	fun getConnection(): Connection {
		// TODO null 체크 할 수 있는 예외처리 필요
//		log.debug("getConnection ... ")
		val tokenSaved: String = basicConf.findSessionTokenAvailable()
		log.debug("getConnection ... tokenSaved: {}", tokenSaved)
		val systemProperties = iSystemProperties.findOne()
		val conn: Connection? = try {
			 systemProperties.toConnection(tokenSaved).also {
				 log.debug("getConnection ... token: {}", it.authenticate())
				 if (tokenSaved !== it.authenticate())
				 	basicConf.addSessionToken(it.authenticate())
			 }
		} catch (e: Exception) {
			log.error(e.localizedMessage)
			null
		}
		return conn!!
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
