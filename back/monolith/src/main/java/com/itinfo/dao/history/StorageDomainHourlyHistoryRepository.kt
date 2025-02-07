package com.itinfo.dao.history

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface StorageDomainHourlyHistoryRepository: JpaRepository<StorageDomainHourlyHistory, Int> {
	fun findByStorageDomainIdOrderByHistoryDatetimeDesc(storageDomainId: UUID): List<StorageDomainHourlyHistory> // STORAGE-DOMAINS.retrieveStorageDomainUsage
	fun findByStorageDomainIdIn(storageDomainIds: List<UUID>): List<StorageDomainHourlyHistory> // DASHBOARD.retrieveStorages
}