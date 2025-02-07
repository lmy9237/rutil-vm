package com.itinfo.dao

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.dao.history.*
import com.itinfo.model.HostInterfaceVo
import com.itinfo.model.HostVo
import com.itinfo.model.StorageVo

import org.springframework.beans.factory.annotation.Autowired

import org.springframework.stereotype.Component

@Component
class DashboardDao {
	@Autowired private lateinit var hostSamplesHistoryRepository: HostSamplesHistoryRepository
	@Autowired private lateinit var storageDomainHourlyHistoryRepository: StorageDomainHourlyHistoryRepository
	@Autowired private lateinit var hostInterfaceSamplesHistoryRepository: HostInterfaceSamplesHistoryRepository

	fun retrieveHosts(hostIds: List<String>): List<HostVo> {
		log.info("... retrieveHosts() > hostIds: $hostIds")
		val itemsFound: List<HostSamplesHistory> =
			hostSamplesHistoryRepository.findByHostIdIn(hostIds.toUUIDs())
		log.info("itemsFound: $itemsFound")
		return itemsFound
			.toDashboardStatistics()
			.toHostVos()
		// return this.sqlSessionTemplate.selectList("DASHBOARD.retrieveHosts", ids)
	}

	fun retrieveStorages(storageIds: List<String>): List<StorageVo> {
		log.info("... retrieveStorages > storageIds: $storageIds")
		val itemsFound: List<StorageDomainHourlyHistory> =
			storageDomainHourlyHistoryRepository.findByStorageDomainIdIn(storageIds.toUUIDs())
		log.info("itemsFound: $itemsFound")
		return itemsFound
			.toDashboardStatistics()
			.toStorageVos()
		// return this.sqlSessionTemplate.selectList("DASHBOARD.retrieveStorages", storageIds)
	}

	fun retrieveHostsInterface(interfaceIds: List<String>): List<HostInterfaceVo> {
		log.info("... retrieveHostsInterface > interfaceIds: $interfaceIds")
		val itemsFound: List<HostInterfaceSamplesHistory> =
			hostInterfaceSamplesHistoryRepository.findByHostInterfaceIdIn(interfaceIds.toUUIDs())
		log.info("itemsFound: $itemsFound")
		return itemsFound
			.toDashboardStatistics()
			.toHostInterfaceVos()
		// return this.sqlSessionTemplate.selectList("DASHBOARD.retrieveHostsInterface", interfaceIds)
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
