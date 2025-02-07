package com.itinfo.service.impl

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.findAllMacPools

import com.itinfo.model.MacAddressPoolsVo
import com.itinfo.model.toMacAddressPoolsVos
import com.itinfo.service.MacAddressService
import com.itinfo.service.engine.ConnectionService

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service


/**
 * [MacAddressServiceImpl]
 * mac address 관리 서비스 응용
 *
 * @author chlee
 * @since 2023.12.07
 */
@Service
class MacAddressServiceImpl : MacAddressService {
	@Autowired private lateinit var connectionService: ConnectionService
	
	override fun retrieveMacAddressPools(): List<MacAddressPoolsVo> {
		log.info("... retrieveMacAddressPools")
		val c = connectionService.getConnection()
		val macPoolList = c.findAllMacPools()
		return macPoolList.toMacAddressPoolsVos()
	}

	companion object {
		private val log by LoggerDelegate()
	}
}

