package com.itinfo.rutilvm.api.repository.history

import com.itinfo.rutilvm.api.repository.history.entity.VmSamplesHistoryEntity

import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.*

private const val QUERY_FIND_VM_CPU_CHART = "a"
@Repository
interface VmSamplesHistoryRepository: JpaRepository<VmSamplesHistoryEntity, Int> {
	// 가상머신 개인 cpu, memory
	fun findFirstByVmIdOrderByHistoryDatetimeDesc(vmId: UUID): VmSamplesHistoryEntity

	@Query(value = """
SELECT DISTINCT
  v.vm_id,
  v.*
FROM
  vm_samples_history v
  JOIN vm_configuration c ON v.vm_id = c.vm_id
WHERE 1=1
AND v.vm_status = 1
AND v.history_datetime = (
  SELECT MAX(v2.history_datetime)
  FROM vm_samples_history v2
  WHERE v2.vm_id = v.vm_id
)
AND NOT EXISTS (
  SELECT 1
  FROM vm_configuration c2
  WHERE c2.vm_id = v.vm_id
  AND (c2.vm_name ~* 'external\-.*ocal' -- 정규식 external-HostedEngineLocal
       or c2.vm_name = 'HostedEngine')  -- hosted_engine 제외 조건 추가
)
AND NOT EXISTS (
  SELECT d.vm_id, max(d.history_id) as max FROM vm_configuration d WHERE 1=1 AND d.delete_date IS NOT NULL and v.vm_id = d.vm_id GROUP BY d.vm_id
) -- 지워진 VM은 조회대상에서 제외
ORDER BY v.cpu_usage_percent DESC
	""", nativeQuery = true
	)
	fun findVmCpuChart(page: Pageable?): List<VmSamplesHistoryEntity>


	@Query(value = """
SELECT DISTINCT
  v.vm_id
  , v.*
FROM
  vm_samples_history v
  JOIN vm_configuration c ON v.vm_id = c.vm_id
WHERE 1=1
AND v.vm_status = 1
AND v.history_datetime = (
  SELECT MAX(v2.history_datetime) FROM vm_samples_history v2 WHERE 1=1
  AND v2.vm_id = v.vm_id
)
AND NOT EXISTS (
  SELECT 1 FROM vm_configuration c2 WHERE 1=1
  AND c2.vm_id = v.vm_id
  AND (c2.vm_name ~* 'external\-.*ocal' -- 정규식 external-HostedEngineLocal
       or c2.vm_name = 'HostedEngine')  -- hosted_engine 제외 조건 추가
)
AND NOT EXISTS (
  SELECT d.vm_id, max(d.history_id) as max FROM vm_configuration d WHERE 1=1 AND d.delete_date IS NOT NULL and v.vm_id = d.vm_id GROUP BY d.vm_id
) -- 지워진 VM은 조회대상에서 제외
ORDER BY v.memory_usage_percent DESC
		""", nativeQuery = true
	)
	fun findVmMemoryChart(page: Pageable?): List<VmSamplesHistoryEntity>


	// vm 사용량 순위
	fun findFirstByVmStatusOrderByCpuUsagePercentDesc(vmStatus: Int): List<VmSamplesHistoryEntity>

	@Query(	value = """
WITH rankedvms AS (
  SELECT
    *, ROW_NUMBER() OVER (
      PARTITION BY vm_id
      ORDER BY history_datetime DESC
    ) AS rn
  FROM
    vm_samples_history
  WHERE 1=1
  AND cpu_usage_percent IS NOT NULL
  AND vm_id NOT IN (
    SELECT vm_id FROM vm_samples_history WHERE 1=1
    AND history_id = 1
  )
  AND CAST(EXTRACT(minute FROM history_datetime) AS INTEGER) % 10 = 0
),
latestvmstatus AS (
  SELECT
    vm_id,
    vm_status
  FROM
    vm_samples_history
  WHERE 1=1
  AND history_datetime = (
    SELECT MAX(history_datetime) FROM vm_samples_history AS sub WHERE 1=1
    AND sub.vm_id = vm_samples_history.vm_id
  )
  AND vm_id NOT IN (
    SELECT vm_id FROM vm_samples_history WHERE 1=1
    AND history_id = 1
  )
)
SELECT
  *
FROM
  rankedvms
  JOIN latestvmstatus ON rankedvms.vm_id = latestvmstatus.vm_id
  JOIN vm_configuration vc ON rankedvms.vm_id = vc.vm_id -- vm_name을 조회하기 위해 vm_configuration 테이블 조인
WHERE 1=1
AND rankedvms.rn <= 10
AND latestvmstatus.vm_status = 1
ORDER BY rankedvms.vm_id, rankedvms.history_datetime DESC
	""", nativeQuery = true
	)
	fun findVmUsageListChart(): List<VmSamplesHistoryEntity>
	// TODO findVmUsageListChart vmCpuPerList&vmMemoryPerList 가상머신 external-HostedEngineLocal (빈값) 에 대한 에러있음
	// 에러처리로 우선 history_id 1은 예외처리해서 검색x

	@Query(value = """
SELECT DISTINCT
  v.vm_id,
  v.*
FROM
  vm_samples_history v
  JOIN vm_configuration c ON v.vm_id = c.vm_id
WHERE 1=1
AND v.vm_status = 1
AND v.history_datetime = (
  SELECT MAX(v2.history_datetime) FROM vm_samples_history v2 WHERE 1=1
  AND v2.vm_id = v.vm_id
)
AND NOT EXISTS (
  SELECT 1 FROM vm_configuration c2 WHERE 1=1
  AND c2.vm_id = v.vm_id
  AND (c2.vm_name ~* 'external\-.*ocal' -- 정규식 external-HostedEngineLocal
       or c2.vm_name = 'HostedEngine')  -- hosted_engine 제외 조건 추가
)
AND NOT EXISTS (
  SELECT d.vm_id, max(d.history_id) as max FROM vm_configuration d WHERE 1=1 AND d.delete_date IS NOT NULL and v.vm_id = d.vm_id GROUP BY d.vm_id
) -- 지워진 VM은 조회대상에서 제외
ORDER BY cpu_usage_percent DESC
	""", nativeQuery = true
	)
	fun findVmCpuMetricListChart(): List<VmSamplesHistoryEntity>

	@Query(value = """
SELECT DISTINCT
  v.vm_id,
  v.*
FROM
  vm_samples_history v
  JOIN vm_configuration c ON v.vm_id = c.vm_id
WHERE 1=1
AND v.vm_status = 1
AND v.history_datetime = (
  SELECT MAX(v2.history_datetime) FROM vm_samples_history v2 WHERE 1=1
  AND v2.vm_id = v.vm_id
)
AND NOT EXISTS (
  SELECT 1 FROM vm_configuration c2 WHERE 1=1
  AND c2.vm_id = v.vm_id
  AND (c2.vm_name ~* 'external\-.*ocal' -- 정규식 external-HostedEngineLocal
       or c2.vm_name = 'HostedEngine')  -- hosted_engine 제외 조건 추가
)
AND NOT EXISTS (
  SELECT d.vm_id, max(d.history_id) as max FROM vm_configuration d WHERE 1=1 AND d.delete_date IS NOT NULL and v.vm_id = d.vm_id GROUP BY d.vm_id
) -- 지워진 VM은 조회대상에서 제외
ORDER BY memory_usage_percent DESC
	""", nativeQuery = true
	)
	fun findVmMemoryMetricListChart(): List<VmSamplesHistoryEntity>

}
