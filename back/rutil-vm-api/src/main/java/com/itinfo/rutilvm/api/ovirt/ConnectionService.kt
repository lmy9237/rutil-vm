package com.itinfo.rutilvm.api.ovirt

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.service.setting.ItSystemPropertiesService
import com.itinfo.rutilvm.util.model.SystemPropertiesVo

import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.ConnectionBuilder
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.util.*


@Service
class ConnectionService {
	@Autowired private lateinit var itSystemPropertyService: ItSystemPropertiesService

	private val uid: String
		get() = Random().nextInt(1000).toString()

	fun getConnection(): Connection {
		val systemPropertiesVO: SystemPropertiesVo = itSystemPropertyService.findOne()
		log.info(systemPropertiesVO.ovirtIp)
		val conn: Connection = systemPropertiesVO.toConnection()
		return conn.also {
			log.debug("getConnection ... token: {}", it.authenticate())
			it.authenticate()
		}
	}
	companion object {
		private val log by LoggerDelegate()
	}
}

fun SystemPropertiesVo.toConnection(
	token: String = ""
): Connection = ConnectionBuilder.connection()
	.url(ovirtEngineApiUrl)
	.user(ovirtUserId)
	.password(password)
	.insecure(true)
	.timeout(20000).apply {
		if (token.isNotEmpty()) token(token)
	}
	.build()
