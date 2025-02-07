package com.itinfo.dao

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.dao.engine.VdsStatistics
import com.itinfo.dao.engine.VdsStatisticsRepository
import com.itinfo.dao.engine.toHostHaVos
import com.itinfo.dao.history.*
import com.itinfo.model.HostUsageVo
import com.itinfo.model.NicUsageVo
import com.itinfo.model.VmUsageVo
import com.itinfo.model.HostHaVo
import com.itinfo.model.HostSwVo

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class ClustersDao {
	@Autowired private lateinit var hostSamplesHistoryRepository: HostSamplesHistoryRepository
	@Autowired private lateinit var hostInterfaceSamplesHistoryRepository: HostInterfaceSamplesHistoryRepository
	@Autowired private lateinit var vmSamplesHistoryRepository: VmSamplesHistoryRepository
	@Autowired private lateinit var vmInterfaceSamplesHistoryRepository: VmInterfaceSamplesHistoryRepository
	@Autowired private lateinit var vdsStatisticsRepository: VdsStatisticsRepository
	@Autowired private lateinit var hostConfigurationRepository: HostConfigurationRepository

	fun retrieveClusterUsage(ids: List<String>): List<HostUsageVo> {
		log.info("... retrieveClusterUsage() ... ids: $ids")
		val itemsFound: List<HostSamplesHistory> =
			hostSamplesHistoryRepository.findByHostIdIn(ids.toUUIDs())
		log.info("itemsFound: $itemsFound")
		return itemsFound.toHostUsageVos() // COMPUTE-CLUSTER.retrieveClusterChartUsage
	}

	fun retrieveHostUsage(hostId: String): List<HostUsageVo> {
		log.info("... retrieveHostUsage('$hostId')")
		val itemsFound: List<HostSamplesHistory> =
			hostSamplesHistoryRepository.findByHostIdOrderByHistoryDatetimeDesc(hostId.toUUID())
		log.info("itemsFound: $itemsFound")
		return itemsFound.toHostUsageVos() // COMPUTE-CLUSTER.retrieveHostChartUsage
	}

	fun retrieveHostLastUsage(hostId: String): HostUsageVo? {
		log.info("... retrieveHostLastUsage('$hostId')")
		return retrieveHostUsage(hostId).firstOrNull() // COMPUTE-CLUSTER.retrieveHostLastUsage
	}

	fun retrieveHostNicUsage(nicId: String): NicUsageVo? {
		log.info("... retrieveHostNicUsage('$nicId')")
		val itemsFound: List<HostInterfaceSamplesHistory> =
			hostInterfaceSamplesHistoryRepository.findByHostInterfaceIdOrderByHistoryDatetimeDesc(nicId.toUUID())
		log.debug("itemFound: $itemsFound")
		return itemsFound.toNicUsageVos().firstOrNull() // COMPUTE-CLUSTER.retrieveHostInterfaceLastUsage
	}

	fun retrieveVmUsage(vmId: String): VmUsageVo? {
		log.info("... retrieveVmUsage('$vmId')")
		val itemsFound: List<VmSamplesHistory> =
			vmSamplesHistoryRepository.findByVmIdOrderByHistoryDatetimeDesc(vmId.toUUID())
		log.debug("itemFound: $itemsFound")
		return itemsFound.toVmUsageVos().firstOrNull() // COMPUTE-CLUSTER.retrieveVmLastUsage
	}

	fun retrieveVmNicUsage(nicId: String): NicUsageVo? {
		log.info("... retrieveVmNicUsage('$nicId')")
		val itemsFound: List<VmInterfaceSamplesHistory> =
			vmInterfaceSamplesHistoryRepository.findByVmInterfaceIdOrderByHistoryDatetimeDesc(nicId.toUUID())
		log.debug("itemsFound: $itemsFound")
		return itemsFound.toNicUsageVos().firstOrNull() // COMPUTE-CLUSTER.retrieveVmInterfaceLastUsage
	}

	fun retrieveHostSw(hostId: String): HostSwVo? {
		log.info("... retrieveHostHaInfo('$hostId')")
		val itemsFound: List<HostConfiguration> =
			hostConfigurationRepository.findByHostIdOrderByHistoryIdDesc(hostId.toUUID())
		log.debug("itemsFound: $itemsFound")
		return itemsFound.toHostSwVos().firstOrNull()?.also { log.debug("returning ... $it") }
		// return sqlSessionTemplate.selectOne("COMPUTE-CLUSTER.retrieveHostSw", hostId)
	}

	fun retrieveHostHaInfo(): List<HostHaVo> {
		log.info("... retrieveHostHaInfo")
		val itemsFound: List<VdsStatistics> =
			vdsStatisticsRepository.findByHaConfigured(true)
		log.debug("itemsFound: $itemsFound")
		return itemsFound.toHostHaVos().also { log.debug("returning ... $it") }
		// return sqlSessionTemplateEngine.selectList("COMPUTE-CLUSTER.retrieveHostHaInfo")
	}

	companion object {
		val log by LoggerDelegate()
	}
}
