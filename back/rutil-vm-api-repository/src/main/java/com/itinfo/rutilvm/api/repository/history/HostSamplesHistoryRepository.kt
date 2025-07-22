package com.itinfo.rutilvm.api.repository.history

import com.itinfo.rutilvm.api.repository.history.entity.HostSamplesHistoryEntity

import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface HostSamplesHistoryRepository : JpaRepository<HostSamplesHistoryEntity, Int> {
	// 해당 호스트 cpu, memory 한행만 % 출력
	fun findFirstByHostIdOrderByHistoryDatetimeDesc(
		hostId: UUID?
	): HostSamplesHistoryEntity

	// 해당 호스트 cpu,memory % List 출력
	fun findByHostIdOrderByHistoryDatetimeDesc(
		hostId: UUID?,
		page: Pageable?
	): List<HostSamplesHistoryEntity>


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


	@Query(	value = """
SELECT
    history_datetime,
    AVG(cpu_usage_percent) AS avg_cpu_usage,
    AVG(memory_usage_percent) AS avg_memory_usage
FROM
    host_samples_history
WHERE
    host_status = 1
    AND CAST(EXTRACT(MINUTE FROM history_datetime) AS INTEGER) % 10 = 0
GROUP BY
    history_datetime
ORDER BY
    history_datetime DESC
LIMIT 10
	""", nativeQuery = true
	)
	fun findHostUsageListChart(): List<Array<Any>>

	@Query(
		value = """
        SELECT
            history_datetime,
            cpu_usage_percent,
            memory_usage_percent
        FROM
            host_samples_history
        WHERE
            host_status = 1
            AND host_id = :hostId
            AND CAST(EXTRACT(MINUTE FROM history_datetime) AS INTEGER) % 60 = 0
        ORDER BY
            history_datetime DESC
        LIMIT 14
    """, nativeQuery = true
	)
	fun findHostUsageById(@Param("hostId") hostId: UUID): List<Array<Any>>


	@Query(
		nativeQuery = true,
		value = """
    WITH net_usage AS (
        SELECT
            sh.history_datetime,
            AVG(COALESCE(sh.receive_rate_percent, 0) + COALESCE(sh.transmit_rate_percent, 0)) AS total_network_usage_percent
        FROM
            host_interface_samples_history sh
        JOIN
            host_interface_configuration cfg
            ON sh.host_interface_id = cfg.host_interface_id
        WHERE
            cfg.host_id = :hostId
			AND CAST(EXTRACT(MINUTE FROM sh.history_datetime) AS INTEGER) % 60 = 0
        GROUP BY
            sh.history_datetime
    ),
    host_usage AS (
        SELECT
            history_datetime,
            cpu_usage_percent,
            memory_usage_percent
        FROM
            host_samples_history
        WHERE
            host_status = 1
            AND host_id = :hostId
			AND CAST(EXTRACT(MINUTE FROM history_datetime) AS INTEGER) % 60 = 0
    )
    SELECT
        h.history_datetime,
        h.cpu_usage_percent,
        h.memory_usage_percent,
        n.total_network_usage_percent
    FROM
        host_usage h
    LEFT JOIN
        net_usage n
    ON
        h.history_datetime = n.history_datetime
    ORDER BY
        h.history_datetime DESC
    LIMIT 14
    """
	)
	fun findHostUsageWithNetwork(@Param("hostId") hostId: UUID): List<Array<Any>>


	@Query(
		nativeQuery = true,
		value = """
select
	h.host_id,
    h.history_datetime,
    h.cpu_usage_percent,
    h.memory_usage_percent
FROM
    host_samples_history h
WHERE
    host_status = 1
	AND CAST(EXTRACT(MINUTE FROM history_datetime) AS INTEGER) % 10 = 0
ORDER BY
    history_datetime desc
    """
	)
	fun findHostUsage(): List<Array<Any>>

	@Query(
		nativeQuery = true,
		value = """
        select *
		FROM host_samples_history
		WHERE
		host_status = 1
		AND CAST(EXTRACT(MINUTE FROM history_datetime) AS INTEGER) % 10 = 0
        ORDER BY history_datetime DESC
		LIMIT 90
    """)
	fun findAllHost(): List<HostSamplesHistoryEntity>
}
