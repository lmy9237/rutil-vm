package com.itinfo.service.impl

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.findAllExternalHostProviders
import com.itinfo.findAllOpenStackImageProviders
import com.itinfo.findAllOpenStackNetworkProviders
import com.itinfo.findAllOpenStackVolumeProviders

import com.itinfo.service.ProvidersService
import com.itinfo.service.engine.ConnectionService

import com.itinfo.model.ProviderVo
import com.itinfo.model.toProviderVosWithExternalHost
import com.itinfo.model.toProviderVosWithOpenStackImage
import com.itinfo.model.toProviderVosWithOpenStackNetwork
import com.itinfo.model.toProviderVosWithOpenStackVolume

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

/**
 * [ProvidersServiceImpl]
 * 프로바이더 관리 서비스 응용체
 *
 * @author chlee
 * @since 2023.12.07
 */
@Service
class ProvidersServiceImpl : ProvidersService {

	@Autowired private lateinit var connectionService: ConnectionService
	override fun retrieveProviders(): List<ProviderVo> {
		log.info("... retrieveProviders")
		val c = connectionService.getConnection()

		val externalHostProviders = c.findAllExternalHostProviders()
		val openStackImageProviders = c.findAllOpenStackImageProviders()
		val openStackNetworkProviders = c.findAllOpenStackNetworkProviders()
		val openStackVolumeProviders = c.findAllOpenStackVolumeProviders()

		val targets: MutableList<ProviderVo> = arrayListOf()
		targets.addAll(externalHostProviders.toProviderVosWithExternalHost())
		targets.addAll(openStackImageProviders.toProviderVosWithOpenStackImage())
		targets.addAll(openStackNetworkProviders.toProviderVosWithOpenStackNetwork())
		targets.addAll(openStackVolumeProviders.toProviderVosWithOpenStackVolume())
		return targets
	}

	companion object {
		private val log by LoggerDelegate()
	}
}