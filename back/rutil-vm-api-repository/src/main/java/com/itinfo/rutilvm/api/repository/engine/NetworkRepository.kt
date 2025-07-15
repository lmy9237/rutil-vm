package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.NetworkEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface NetworkRepository: JpaRepository<NetworkEntity, UUID> {
	@Query("""
SELECT DISTINCT n FROM NetworkEntity n
LEFT JOIN FETCH n.storagePool sp
LEFT JOIN FETCH n.provider p
LEFT JOIN FETCH n.dnsConfiguration dc
LEFT JOIN FETCH dc.nameServers ns
LEFT JOIN FETCH ns.dnsResolverConfiguration drc
LEFT JOIN FETCH n.networkCluster nc
LEFT JOIN FETCH nc.cluster c
LEFT JOIN FETCH nc.network nn
LEFT JOIN FETCH n.vnicProfiles vp
LEFT JOIN FETCH vp.networkFilter nf
WHERE 1=1
""")
	override fun findAll(): List<NetworkEntity>

	@Query("""
SELECT DISTINCT n FROM NetworkEntity n
LEFT JOIN FETCH n.storagePool sp
LEFT JOIN FETCH n.provider p
LEFT JOIN FETCH n.dnsConfiguration dc
LEFT JOIN FETCH dc.nameServers ns
LEFT JOIN FETCH ns.dnsResolverConfiguration drc
LEFT JOIN FETCH n.networkCluster nc
LEFT JOIN FETCH nc.cluster c
LEFT JOIN FETCH nc.network nn
LEFT JOIN FETCH n.vnicProfiles vp
LEFT JOIN FETCH vp.networkFilter nf
WHERE 1=1
AND n.id = :id
""")
	fun findByNetworkId(
		@Param("id") id: UUID
	): NetworkEntity?

	@Query("""
SELECT DISTINCT n FROM NetworkEntity n
LEFT JOIN FETCH n.storagePool sp
LEFT JOIN FETCH n.provider p
LEFT JOIN FETCH n.dnsConfiguration dc
LEFT JOIN FETCH dc.nameServers ns
LEFT JOIN FETCH ns.dnsResolverConfiguration drc
LEFT JOIN FETCH n.networkCluster nc
LEFT JOIN FETCH nc.cluster c
LEFT JOIN FETCH nc.network nn
LEFT JOIN FETCH n.vnicProfiles vp
LEFT JOIN FETCH vp.networkFilter nf
WHERE 1=1
AND c.clusterId = :clusterId
""")
	fun findAllByClusterId(
		@Param("clusterId") clusterId: UUID
	): List<NetworkEntity>
}
