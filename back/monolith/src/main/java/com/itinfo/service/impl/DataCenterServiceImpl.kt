package com.itinfo.service.impl

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.findAllDataCenters
import com.itinfo.model.DataCenterVo
import com.itinfo.model.toDataCenterVos
import com.itinfo.service.DataCenterService
import com.itinfo.service.engine.AdminConnectionService
import com.itinfo.service.engine.ConnectionService

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service


/**
 * [DataCenterServiceImpl]
 * 데이터센터 응용
 *
 * @author chanhi2000
 * @since 2023.08.18
 */
@Service
class DataCenterServiceImpl : DataCenterService {
	@Autowired private lateinit var adminConnectionService: AdminConnectionService
	@Autowired private lateinit var connectionService: ConnectionService

	override fun retrieveDataCenters(): List<DataCenterVo> {
		log.info("... retrieveDataCenters")
		val conn = connectionService.getConnection()
		val dataCenters = conn.findAllDataCenters()
		return dataCenters.toDataCenterVos(conn)
	}

	companion object {
		private val log by LoggerDelegate()
	}
}

