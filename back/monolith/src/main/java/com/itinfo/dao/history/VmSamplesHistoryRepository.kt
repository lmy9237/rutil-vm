package com.itinfo.dao.history

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface VmSamplesHistoryRepository: JpaRepository<VmSamplesHistory, Int> {
	fun findByVmIdOrderByHistoryDatetimeDesc(vmId: UUID): List<VmSamplesHistory> // COMPUTE-CLUSTER.retrieveVmLastUsage
}