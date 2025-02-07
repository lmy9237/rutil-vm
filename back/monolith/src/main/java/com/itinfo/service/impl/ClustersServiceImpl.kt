package com.itinfo.service.impl

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.dao.ClustersDao
import com.itinfo.findAllClusters
import com.itinfo.findAllHosts
import com.itinfo.findAllNetworks
import com.itinfo.findAllOpenStackNetworkProviders
import com.itinfo.findCluster
import com.itinfo.addCluster
import com.itinfo.controller.doSleep
import com.itinfo.updateCluster
import com.itinfo.removeCluster


import com.itinfo.model.MessageVo
import com.itinfo.model.ClusterCreateVo
import com.itinfo.model.toClusterCreateVo
import com.itinfo.model.ClusterVo
import com.itinfo.model.toCluster
import com.itinfo.model.toClusterVo
import com.itinfo.model.toClusterVos
import com.itinfo.model.HostDetailVo
import com.itinfo.model.MessageType
import com.itinfo.model.NetworkVo
import com.itinfo.model.toNetworkVos
import com.itinfo.model.NetworkProviderVo
import com.itinfo.model.toNetworkProviderVos

import com.itinfo.service.ClustersService
import com.itinfo.service.HostsService
import com.itinfo.service.engine.AdminConnectionService
import com.itinfo.service.engine.WebsocketService

import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.types.Cluster
import org.ovirt.engine.sdk4.types.Host
import org.ovirt.engine.sdk4.types.Network
import org.ovirt.engine.sdk4.types.OpenStackNetworkProvider

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Service


@Service
class ClustersServiceImpl: ClustersService {
	@Autowired private lateinit var adminConnectionService: AdminConnectionService
	@Autowired private lateinit var clustersDao: ClustersDao
	@Autowired private lateinit var hostsService: HostsService
	@Autowired private lateinit var websocketService: WebsocketService


	@Async("karajanTaskExecutor")
	override fun createCluster(clusterCreateVo: ClusterCreateVo) {
		log.info("... createCluster")
		val conn = adminConnectionService.getConnection()
		val cluster: Cluster = clusterCreateVo.toCluster(conn)
		val res = conn.addCluster(cluster)
		val message: MessageVo =
			MessageVo.createMessage(MessageType.CLUSTER_ADD, res != null, clusterCreateVo.name, "")
		doSleep(1000L)
		websocketService.notify(message)
		websocketService.reload(message, "clusters")
	}

	@Async("karajanTaskExecutor")
	override fun updateCluster(clusterCreateVo: ClusterCreateVo) {
		log.info("... updateCluster")
		val conn = adminConnectionService.getConnection()
		val cluster: Cluster
			= clusterCreateVo.toCluster(conn)
		val res = conn.updateCluster(clusterCreateVo.id, cluster)
		val message: MessageVo =
			MessageVo.createMessage(MessageType.CLUSTER_UPDATE, res != null, clusterCreateVo.name, "")
		doSleep(1000L)
		websocketService.notify(message)
		websocketService.reload(message, "clusters")
	}

	@Async("karajanTaskExecutor")
	override fun removeCluster(clusterId: String) {
		log.info("... removeCluster('${clusterId}')")
		val conn: Connection = adminConnectionService.getConnection()
		val cluster: Cluster? = conn.findCluster(clusterId)
		if (cluster == null) {
			log.error("something went WRONG! ... reason: NO cluster found")
			return
		}
		val removeRes = conn.removeCluster(clusterId)
		val message: MessageVo =
			MessageVo.createMessage(MessageType.CLUSTER_REMOVE, removeRes, cluster!!.name(), "")
		doSleep(1000L)
		websocketService.notify(message)
		websocketService.reload(message, "clusters")
	}

	override fun retrieveClusters(): List<ClusterVo> {
		log.info("... retrieveClusters")
		val conn: Connection = adminConnectionService.getConnection()
		val clustersFound: List<Cluster> =
			conn.findAllClusters("")
		val res: List<ClusterVo> =
			clustersFound.toClusterVos(conn, clustersDao)
		log.info("... retrieveClusters clustersFound[${res.size}]")
		return clustersFound.toClusterVos(conn, clustersDao)
	}

	override fun retrieveCluster(clusterId: String): ClusterVo? {
		log.info("... retrieveCluster('$clusterId')")
		val conn: Connection = adminConnectionService.getConnection()
		val clusterFound: Cluster? =
			conn.findCluster(clusterId)
		if (clusterFound == null) {
			// 무조건 있어야 하기 때문에 여기를 들어가면 안됨
			log.error("[CRITICAL] something went WRONG! ... reason: NO cluster found")
			return null
		}
		val clusterVo: ClusterVo = clusterFound.toClusterVo(conn, clustersDao)
		setClusterDetailHosts(conn, clusterId, clusterVo)
		return clusterVo
	}

	private fun setClusterDetailHosts(conn: Connection, clusterId: String, clusterVo: ClusterVo) {
		log.info("... setClusterDetailHosts")
		val hosts = conn.findAllHosts("")
		val predicate: (h: Host) -> Boolean = { h: Host ->
			h.clusterPresent()
			&& h.cluster().idPresent()
			&& clusterId == h.cluster().id()
		}
		val hostsDetails: List<HostDetailVo> =
			hosts.filter(predicate).map { hostsService.getHostInfo(conn, it) }
		val ids: List<String> = hostsDetails.map { it.id }
		clusterVo.hostsDetail = hostsDetails
	}

	override fun retrieveCreateClusterInfo(clusterId: String): ClusterCreateVo {
		log.info("... retrieveCreateClusterInfo('$clusterId')")
		val conn = adminConnectionService.getConnection()
		val cluster = conn.findCluster(clusterId)
		if (cluster == null) {
			log.warn("no cluster FOUND! id: '$clusterId'", )
			return ClusterCreateVo()
		}
		return cluster.toClusterCreateVo(conn)
	}

	override fun retrieveNetworks(): List<NetworkVo> {
		log.info("... retrieveNetworks")
		val c = adminConnectionService.getConnection()
		val nws: List<Network> =
			c.findAllNetworks()
		return nws.toNetworkVos()
	}

	override fun retrieveNetworkProviders(): List<NetworkProviderVo> {
		log.info("... retrieveNetworkProviders")
		val c = adminConnectionService.getConnection()
		val nwps: List<OpenStackNetworkProvider> =
			c.findAllOpenStackNetworkProviders()
		return nwps.toNetworkProviderVos()
	}
	
	companion object {
		private val log by LoggerDelegate()
	}
}
