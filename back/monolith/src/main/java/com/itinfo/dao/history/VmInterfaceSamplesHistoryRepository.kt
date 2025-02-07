package com.itinfo.dao.history

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

import java.util.UUID


@Repository
interface VmInterfaceSamplesHistoryRepository: JpaRepository<VmInterfaceSamplesHistory, Int> {
	fun findByVmInterfaceIdOrderByHistoryDatetimeDesc(vmInterfaceId: UUID): List<VmInterfaceSamplesHistory> // COMPUTE-CLUSTER.retrieveVmInterfaceLastUsage
	fun findByVmInterfaceIdIn(vmInterfaceIds: List<UUID>): List<VmInterfaceSamplesHistory>
}