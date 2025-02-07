package com.itinfo.dao.history

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

import java.util.UUID

@Repository
interface HostInterfaceSamplesHistoryRepository: JpaRepository<HostInterfaceSamplesHistory, Int> {
	fun findByHostInterfaceIdOrderByHistoryDatetimeDesc(hostInterfaceId: UUID): List<HostInterfaceSamplesHistory> // COMPUTE-CLUSTER.retrieveHostInterfaceLastUsage
	fun findByHostInterfaceIdIn(interfaceIds: List<UUID>): List<HostInterfaceSamplesHistory> // DASHBOARD.retrieveHostsInterface
}