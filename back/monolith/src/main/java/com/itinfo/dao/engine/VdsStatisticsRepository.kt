package com.itinfo.dao.engine

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface VdsStatisticsRepository: JpaRepository<VdsStatistics, UUID> {
	fun findByHaConfigured(haConfigured: Boolean): List<VdsStatistics> // COMPUTE-CLUSTER.retrieveHostHaInfo
}