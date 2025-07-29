package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.NetworkClusterEntity

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface NetworkClusterRepository : JpaRepository<NetworkClusterEntity, UUID> {
	@Query("""
SELECT DISTINCT nc FROM NetworkClusterEntity nc
LEFT JOIN FETCH nc.cluster c
LEFT JOIN FETCH nc.network n
LEFT JOIN FETCH n.storagePool sp
LEFT JOIN FETCH n.vnicProfiles vp
LEFT JOIN FETCH n.networkClusters ncs
WHERE 1=1
""")
	override fun findAll(): List<NetworkClusterEntity>
	@Query("""
SELECT DISTINCT nc FROM NetworkClusterEntity nc
LEFT JOIN FETCH nc.cluster c
LEFT JOIN FETCH nc.network n
LEFT JOIN FETCH n.storagePool sp
LEFT JOIN FETCH n.vnicProfiles vp
LEFT JOIN FETCH n.networkClusters ncs
WHERE 1=1
AND nc.id.clusterId = :clusterId
""")
	fun findByClusterId(clusterId: UUID): List<NetworkClusterEntity>?
	@Query("""
SELECT DISTINCT nc FROM NetworkClusterEntity nc
LEFT JOIN FETCH nc.cluster c
LEFT JOIN FETCH nc.network n
LEFT JOIN FETCH n.storagePool sp
LEFT JOIN FETCH n.vnicProfiles vp
LEFT JOIN FETCH n.networkClusters ncs
WHERE 1=1
AND nc.id.networkId = :networkId
""")
	fun findByNetworkId(networkId: UUID): List<NetworkClusterEntity>

// @Query("""
// SELECT *,
// EXISTS (
//    SELECT 1
//    FROM public.network_cluster_view v2
//    WHERE v2.cluster_id = v1.cluster_id
// 	 AND v2.network_id = :networkId
// ) AS is_connected
// FROM (
// SELECT DISTINCT *
// FROM public.network_cluster_view
// ) v1
// """ )
// 	fun findClustersWithNetworkConnection(networkId: UUID): List<NetworkClusterEntity>
}
