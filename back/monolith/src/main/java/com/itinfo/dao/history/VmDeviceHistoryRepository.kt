package com.itinfo.dao.history

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID


@Repository
interface VmDeviceHistoryRepository: JpaRepository<VmDeviceHistory, Int> {
	fun findByVmIdOrderByUpdateDateAsc(vmId: UUID): List<VmDeviceHistory> // COMPUTING.retrieveVmDevices
}