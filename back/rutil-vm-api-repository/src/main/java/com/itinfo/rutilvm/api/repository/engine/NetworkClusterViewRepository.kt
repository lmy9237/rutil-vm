package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.NetworkClusterViewEntity

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface NetworkClusterViewRepository : JpaRepository<NetworkClusterViewEntity, UUID> {
	fun findByClusterId(clusterId: UUID): List<NetworkClusterViewEntity>?
	fun findByNetworkId(networkId: UUID): List<NetworkClusterViewEntity>?

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
// 	fun findClustersWithNetworkConnection(networkId: UUID): List<NetworkClusterViewEntity>
}
