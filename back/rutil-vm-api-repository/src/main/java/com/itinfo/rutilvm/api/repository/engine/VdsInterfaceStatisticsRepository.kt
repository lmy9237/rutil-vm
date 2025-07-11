package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.VdsInterfaceStatisticsEntity
import com.itinfo.rutilvm.api.repository.engine.entity.VmEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface VdsInterfaceStatisticsRepository: JpaRepository<VdsInterfaceStatisticsEntity, UUID> {
	fun findAllByVdsStaticVdsId(vdsId: UUID): List<VdsInterfaceStatisticsEntity>

	@Query(
		value = """
    WITH latest_ts AS (
      SELECT vds_id, MAX(_update_date) AS max_time
      FROM vds_interface_statistics
      WHERE vds_id = :vdsId
      GROUP BY vds_id
    ),
    filtered AS (
      SELECT
        s.id,                     -- ✅ 반드시 포함
        s.vds_id,                 -- not used in entity directly, but required for join
        s.rx_rate, s.tx_rate, s.rx_drop, s.tx_drop,
        s.iface_status, s._update_date, s.rx_total, s.rx_offset,
        s.tx_total, s.tx_offset, s.sample_time,
        ROW_NUMBER() OVER (
          PARTITION BY s.vds_id
          ORDER BY (COALESCE(s.rx_rate, 0) + COALESCE(s.tx_rate, 0)) DESC
        ) AS rn
      FROM vds_interface_statistics s
      JOIN latest_ts t ON s.vds_id = t.vds_id AND s._update_date = t.max_time
    )
    SELECT
      id, vds_id, rx_rate, tx_rate, rx_drop, tx_drop,
      iface_status, _update_date, rx_total, rx_offset,
      tx_total, tx_offset, sample_time
    FROM filtered
    WHERE rn = 1
    """,
		nativeQuery = true
	)
	fun findByVdsId(vdsId: UUID): VdsInterfaceStatisticsEntity?


}
