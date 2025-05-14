package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.NetworkEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface NetworkRepository: JpaRepository<NetworkEntity, UUID> {
	fun findByName(name: String): NetworkEntity?

	// Custom query to fetch network with its DNS config eagerly if needed,
	// though @OneToOne(fetch = FetchType.EAGER) on the entity can also achieve this.
	// Use this if you want to control fetching more explicitly in specific scenarios.
	@Query("""
SELECT
  n
FROM
  NetworkEntity n
  LEFT JOIN FETCH n.dnsConfiguration dc
  LEFT JOIN FETCH dc.nameServers
WHERE 1=1
AND n.id = :id
""")
	fun findByIdWithDnsConfiguration(
		@Param("id") id: UUID
	): NetworkEntity?
}
