package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.VnicProfileEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface VnicProfileRepository: JpaRepository<VnicProfileEntity, UUID> {
	@Query("""
SELECT DISTINCT vp FROM VnicProfileEntity vp
LEFT JOIN FETCH vp.network AS n
  LEFT JOIN FETCH n.storagePool sp
  LEFT JOIN FETCH n.provider p
  LEFT JOIN FETCH n.dnsConfiguration dc
  LEFT JOIN FETCH dc.nameServers ns
  LEFT JOIN FETCH ns.dnsResolverConfiguration drc
  LEFT JOIN FETCH n.networkClusters nc
  LEFT JOIN FETCH nc.cluster c
LEFT JOIN FETCH vp.networkFilter nf
WHERE 1=1
""")
	override fun findAll(): List<VnicProfileEntity>

	@Query("""
SELECT DISTINCT vp FROM VnicProfileEntity vp
LEFT JOIN FETCH vp.network AS n
  LEFT JOIN FETCH n.storagePool sp
  LEFT JOIN FETCH n.provider p
  LEFT JOIN FETCH n.dnsConfiguration dc
  LEFT JOIN FETCH dc.nameServers ns
  LEFT JOIN FETCH ns.dnsResolverConfiguration drc
  LEFT JOIN FETCH n.networkClusters nc
  LEFT JOIN FETCH nc.cluster c
LEFT JOIN FETCH vp.networkFilter nf
WHERE 1=1
AND vp.id = :id
""")
	fun findByVnicProfileId(
		@Param("id") id: UUID
	): VnicProfileEntity?

	@Query("""
SELECT DISTINCT vp FROM VnicProfileEntity vp
LEFT JOIN FETCH vp.network AS n
  LEFT JOIN FETCH n.storagePool sp
  LEFT JOIN FETCH n.provider p
  LEFT JOIN FETCH n.dnsConfiguration dc
  LEFT JOIN FETCH dc.nameServers ns
  LEFT JOIN FETCH ns.dnsResolverConfiguration drc
  LEFT JOIN FETCH n.networkClusters nc
  LEFT JOIN FETCH nc.cluster c
LEFT JOIN FETCH vp.networkFilter nf
WHERE 1=1
AND c.id = :clusterId
""")
	fun findAllByClusterId(
		@Param("clusterId") clusterId: UUID
	): List<VnicProfileEntity>

	@Query("""
SELECT DISTINCT vp FROM VnicProfileEntity vp
LEFT JOIN FETCH vp.network AS n
  LEFT JOIN FETCH n.storagePool sp
  LEFT JOIN FETCH n.provider p
  LEFT JOIN FETCH n.dnsConfiguration dc
  LEFT JOIN FETCH dc.nameServers ns
  LEFT JOIN FETCH ns.dnsResolverConfiguration drc
  LEFT JOIN FETCH n.networkClusters nc
  LEFT JOIN FETCH nc.cluster c
LEFT JOIN FETCH vp.networkFilter nf
WHERE 1=1
AND n.id = :networkId
""")
	fun findAllByNetworkId(
		@Param("networkId") networkId: UUID
	): List<VnicProfileEntity>
}
