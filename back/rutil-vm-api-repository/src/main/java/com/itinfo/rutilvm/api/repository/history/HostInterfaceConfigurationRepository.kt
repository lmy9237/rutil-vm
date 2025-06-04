package com.itinfo.rutilvm.api.repository.history

import com.itinfo.rutilvm.api.repository.history.entity.HostInterfaceConfigurationEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface HostInterfaceConfigurationRepository : JpaRepository<HostInterfaceConfigurationEntity, Int> {

	@Query("""
SELECT hic FROM HostInterfaceConfigurationEntity hic
LEFT JOIN FETCH hic.hostInterfaceSamplesHistories s
WHERE 1=1
AND hic.hostInterfaceId = :hostInterfaceId
AND hic.historyId = :historyId
""")
	fun findByHostInterfaceIdWithInterfaceSamplesHistories(
		@Param("hostInterfaceId") hostInterfaceId: UUID?,
		@Param("historyId") historyId: Int?,
	): HostInterfaceConfigurationEntity?
}
