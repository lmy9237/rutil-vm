package com.itinfo.rutilvm.api.repository.history

import com.itinfo.rutilvm.api.repository.history.entity.HostInterfaceSamplesHistoryEntity

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface HostInterfaceSampleHistoryRepository : JpaRepository<HostInterfaceSamplesHistoryEntity, Int> {
	// 호스트 - 네트워크
	@Query("""
SELECT hic FROM HostInterfaceSamplesHistoryEntity hic
LEFT JOIN FETCH hic.hostInterfaceConfiguration c
WHERE 1=1
AND hic.hostInterfaceId = :hostInterfaceId
ORDER BY hic.historyDatetime DESC
""")
	fun findAllByHostInterfaceIdOrderByHistoryDatetimeDesc(
		hostInterfaceId: UUID?
	): List<HostInterfaceSamplesHistoryEntity>



}
