package com.itinfo.rutilvm.api.repository.history

import com.itinfo.rutilvm.api.repository.history.entity.HostSamplesHistoryEntity

import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface HostSamplesHistoryRepository : JpaRepository<HostSamplesHistoryEntity, Int> {
	// 해당 호스트 cpu, memory 한행만 % 출력
	fun findFirstByHostIdOrderByHistoryDatetimeDesc(hostId: UUID?): HostSamplesHistoryEntity

	// 해당 호스트 cpu,memory % List 출력
	fun findByHostIdOrderByHistoryDatetimeDesc(hostId: UUID?, page: Pageable?): List<HostSamplesHistoryEntity>


	@Query(value = """
SELECT * FROM host_samples_history h WHERE 1=1
AND host_status = 1
AND h.history_datetime = (
	SELECT MAX(h2.history_datetime) FROM host_samples_history h2 WHERE 1=1
	AND h2.host_id = h.host_id
)
ORDER BY h.cpu_usage_percent DESC
	""", nativeQuery = true
	)
	fun findHostCpuChart(page: Pageable?): List<HostSamplesHistoryEntity>

	@Query(value = """
SELECT * FROM host_samples_history h WHERE 1=1
AND host_status = 1
AND h.history_datetime = (
  SELECT MAX(h2.history_datetime) FROM host_samples_history h2 WHERE 1=1
  AND h2.host_id = h.host_id
)
ORDER BY h.memory_usage_percent DESC
	""", nativeQuery = true
	)
	fun findHostMemoryChart(page: Pageable?): List<HostSamplesHistoryEntity>

	
}