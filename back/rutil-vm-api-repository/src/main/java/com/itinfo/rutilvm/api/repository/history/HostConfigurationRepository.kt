package com.itinfo.rutilvm.api.repository.history

import com.itinfo.rutilvm.api.repository.history.entity.HostConfigurationEntity

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface HostConfigurationRepository : JpaRepository<HostConfigurationEntity, Int> {
	fun findFirstByHostIdOrderByUpdateDateDesc(
		hostId: UUID
	): HostConfigurationEntity


	@Query("""
SELECT hc FROM HostConfigurationEntity hc
LEFT JOIN FETCH hc.hostInterfaceSamples s
WHERE 1=1
AND hc.historyId = :historyId
""")
	fun findByIdWithInterfaceSamples(
		@Param("historyId") historyId: Int
	): HostConfigurationEntity?
}
