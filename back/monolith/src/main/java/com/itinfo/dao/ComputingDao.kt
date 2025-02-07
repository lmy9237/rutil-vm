package com.itinfo.dao

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.dao.history.*
import com.itinfo.model.VmDeviceVo
import com.itinfo.model.VmNetworkUsageVo
import com.itinfo.model.VmUsageVo
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class ComputingDao {
	@Autowired private lateinit var vmSampleHistoryRepository: VmSamplesHistoryRepository
	@Autowired private lateinit var vmInterfaceSamplesHistoryRepository: VmInterfaceSamplesHistoryRepository
	@Autowired private lateinit var vmDeviceHistoryRepository: VmDeviceHistoryRepository

	fun retrieveVmUsage(vmId: String): List<VmUsageVo> {
		log.info("... retrieveVmUsage('$vmId')")
		val itemsFound: List<VmSamplesHistory> =
			vmSampleHistoryRepository.findByVmIdOrderByHistoryDatetimeDesc(vmId.toUUID())
		log.info("itemsFound: $itemsFound")
		return itemsFound.toVmUsageVos() // COMPUTING.retrieveVmUsage
	}

	fun retrieveVmUsageOne(vmId: String): VmUsageVo? {
		log.info("... retrieveVmUsageOne('$vmId')")
		return retrieveVmUsage(vmId).firstOrNull() // COMPUTING.retrieveVmUsageOne
	}

	fun retrieveVmNetworkUsage(vmIds: List<String>): List<VmNetworkUsageVo> {
		log.info("... retrieveVmNetworkUsage > vmIds: $vmIds")
		val itemsFound: List<VmInterfaceSamplesHistory> =
			vmInterfaceSamplesHistoryRepository.findByVmInterfaceIdIn(vmIds.toUUIDs())
		log.debug("itemsFound: $itemsFound")
		return itemsFound
			.toDashboardStatistics()
			.toVmNetworkUsageVos() // COMPUTING.retrieveVmNetworkUsage
	}

	fun retrieveVmNetworkUsageOne(vmIds: List<String>): VmNetworkUsageVo? {
		log.info("... retrieveVmNetworkUsageOne > vmIds: $vmIds")
		return retrieveVmNetworkUsage(vmIds).firstOrNull() // COMPUTING.retrieveVmNetworkUsageOne
	}

	fun retrieveVmDevices(vmId: String): List<VmDeviceVo> {
		log.info("... ")
		val itemsFound: List<VmDeviceHistory> =
			vmDeviceHistoryRepository.findByVmIdOrderByUpdateDateAsc(vmId.toUUID())
		log.info("itemsFound: $itemsFound")
		return itemsFound.toVmDeviceVos() // COMPUTING.retrieveVmDevices
	}

	companion object {
		private val log by LoggerDelegate()
	}
}