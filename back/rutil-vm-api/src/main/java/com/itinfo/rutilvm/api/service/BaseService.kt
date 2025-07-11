package com.itinfo.rutilvm.api.service

import com.itinfo.rutilvm.api.ovirt.AdminConnectionService
import com.itinfo.rutilvm.api.service.setting.ItSystemPropertiesService
import com.itinfo.rutilvm.util.model.SystemPropertiesVo

import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.services.SystemService
import org.springframework.beans.factory.annotation.Autowired

open class BaseService {
	@Autowired protected lateinit var admin: AdminConnectionService
	@Autowired private lateinit var sysProps: ItSystemPropertiesService

	open val conn: Connection							get() = admin.getConnection()
	open val system: SystemService						get() = conn.systemService()
	open val systemPropertiesVo: SystemPropertiesVo		get() = sysProps.findOne()

	companion object {
	}
}
