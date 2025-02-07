package com.itinfo.dao.history

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface HostSamplesHistoryRepository: JpaRepository<HostSamplesHistory, Int> {
	fun findByHostIdOrderByHistoryDatetimeDesc(hostId: UUID): List<HostSamplesHistory> // COMPUTE-CLUSTER.retrieveHostChartUsage

	// COMPUTE-CLUSTER.retrieveClusterChartUsage
	// DASHBOARD.retrieveHosts
	fun findByHostIdIn(hostIds: List<UUID>): List<HostSamplesHistory>
}