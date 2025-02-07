package com.itinfo.service

import com.itinfo.model.ClusterCreateVo
import com.itinfo.model.ClusterVo
import com.itinfo.model.NetworkProviderVo
import com.itinfo.model.NetworkVo

/**
 * [ClustersService]
 * 클러스터 관리 서비스
 *
 * @since 2023.12.07
 * @author chlee
 */
interface ClustersService {
	/**
	 * [com.itinfo.service.impl.ClustersServiceImpl.createCluster]
	 *
	 * @param clusterCreateVo [ClusterCreateVo]
	 */
	fun createCluster(clusterCreateVo: ClusterCreateVo)

	/**
	 * [com.itinfo.service.impl.ClustersServiceImpl.updateCluster]
	 *
	 * @param clusterCreateVo [ClusterCreateVo]
	 */
	fun updateCluster(clusterCreateVo: ClusterCreateVo)

	/**
	 * [com.itinfo.service.impl.ClustersServiceImpl.removeCluster]
	 *
	 * @param clusterId [String]
	 */
	fun removeCluster(clusterId: String)

	/**
	 * [com.itinfo.service.impl.ClustersServiceImpl.retrieveClusters]
	 *
	 */
	fun retrieveClusters(): List<ClusterVo>

	/**
	 * [com.itinfo.service.impl.ClustersServiceImpl.retrieveCluster]
	 *
	 * @param clusterId [String]
	 * @return [ClusterVo]
	 */
	fun retrieveCluster(clusterId: String): ClusterVo?

	/**
	 * [com.itinfo.service.impl.ClustersServiceImpl.retrieveCreateClusterInfo]
	 *
	 * @param clusterId [String]
	 * @return [ClusterCreateVo]
	 */
	fun retrieveCreateClusterInfo(clusterId: String): ClusterCreateVo

	/**
	 * [com.itinfo.service.impl.ClustersServiceImpl.retrieveNetworks]
	 *
	 * @return [List]<[NetworkVo]>
	 */
	fun retrieveNetworks(): List<NetworkVo>

	/**
	 * [com.itinfo.service.impl.ClustersServiceImpl.retrieveNetworkProviders]
	 *
	 * @return [List]<[NetworkProviderVo]>
	 */
	fun retrieveNetworkProviders(): List<NetworkProviderVo>
}