package com.itinfo.dao

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.dao.history.StorageDomainHourlyHistory
import com.itinfo.dao.history.StorageDomainHourlyHistoryRepository
import com.itinfo.dao.history.toStorageDomainUsageVos
import com.itinfo.model.StorageDomainUsageVo
import org.springframework.beans.factory.annotation.Autowired

import org.springframework.stereotype.Component

@Component
class DomainsDao {
	@Autowired private lateinit var storageDomainHourlyHistoryRepository: StorageDomainHourlyHistoryRepository

	fun retrieveStorageDomainUsage(storageDomainId: String): List<StorageDomainUsageVo> {
		log.info("... retrieveStorageDomainUsage($storageDomainId)")
		val itemsFound: List<StorageDomainHourlyHistory> =
			storageDomainHourlyHistoryRepository.findByStorageDomainIdOrderByHistoryDatetimeDesc(storageDomainId.toUUID())
		log.info("itemsFound: $itemsFound")
		return itemsFound.toStorageDomainUsageVos()
		// return sqlSessionTemplate.selectList("STORAGE-DOMAINS.retrieveStorageDomainUsage", storageDomainId)
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
