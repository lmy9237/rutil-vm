package com.itinfo.rutilvm.api.repository.history

import com.itinfo.rutilvm.api.repository.history.entity.StorageDomainSamplesHistoryEntity

import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface StorageDomainSamplesHistoryRepository : JpaRepository<StorageDomainSamplesHistoryEntity, Int> {
	// 전체 사용량 - 스토리지
	fun findFirstByStorageDomainIdOrderByHistoryDatetimeDesc(storageDomainId: UUID): StorageDomainSamplesHistoryEntity

	// storage 사용량 3
	@Query(value = """
SELECT * FROM storage_domain_samples_history s WHERE 1=1
AND storage_domain_status = 1
AND (s.available_disk_size_gb NOTNULL)
AND s.history_datetime = (
  SELECT MAX(s2.history_datetime) FROM storage_domain_samples_history s2 WHERE 1=1
  AND s2.storage_domain_id = s.storage_domain_id
)
ORDER BY s.used_disk_size_gb DESC
	""", nativeQuery = true
	)
	fun findStorageChart(page: Pageable?): List<StorageDomainSamplesHistoryEntity>


	@Query(	value = """
SELECT
    history_datetime,
    ROUND(AVG(CAST(used_disk_size_gb AS DECIMAL) / NULLIF((available_disk_size_gb + used_disk_size_gb), 0) * 100), 2) AS avg_domain_usage_percent
FROM
    storage_domain_samples_history
WHERE
    storage_domain_status = 1
	AND CAST(EXTRACT(MINUTE FROM history_datetime) AS INTEGER) % 10 = 0
GROUP BY
    history_datetime
ORDER BY
    history_datetime DESC
LIMIT 10
	""", nativeQuery = true
	)
	fun findDomainUsageListChart(): List<Array<Any>>

}
