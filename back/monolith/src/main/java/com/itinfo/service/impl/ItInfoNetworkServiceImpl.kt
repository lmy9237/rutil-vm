package com.itinfo.service.impl

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.controller.doSleep
import com.itinfo.findAllNetworks
import com.itinfo.findAllNicsFromHost
import com.itinfo.findAllVms
import com.itinfo.findAllDataCenters
import com.itinfo.findAllClusters
import com.itinfo.findAllOpenStackNetworkProviders
import com.itinfo.findAllQossFromDataCenter
import com.itinfo.findAllNetworksFromCluster
import com.itinfo.findAllVnicProfilesFromNetwork
import com.itinfo.findNicsFromVm
import com.itinfo.findAllStatisticsFromVmNic
import com.itinfo.findAllHosts
import com.itinfo.addNetwork
import com.itinfo.addNetworkFromCluster
import com.itinfo.addNetworkLabelFromNetwork
import com.itinfo.removeNetwork
import com.itinfo.updateNetwork
import com.itinfo.findAllNetworkLabelsFromNetwork
import com.itinfo.removeNetworkLabelFromNetwork
import com.itinfo.removeNetworkFromCluster
import com.itinfo.updateNetworkFromCluster

import com.itinfo.model.*
import com.itinfo.service.ItInfoNetworkService
import com.itinfo.service.engine.AdminConnectionService
import com.itinfo.service.engine.WebsocketService

import org.ovirt.engine.sdk4.builders.Builders
import org.ovirt.engine.sdk4.builders.NetworkBuilder
import org.ovirt.engine.sdk4.types.*

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Service

import java.math.BigDecimal
import java.util.function.Consumer


@Service
class ItInfoNetworkServiceImpl : ItInfoNetworkService {
	@Autowired private lateinit var adminConnectionService: AdminConnectionService
	@Autowired private lateinit var websocketService: WebsocketService

	override fun getNetworkList(): List<ItInfoNetworkVo> {
		log.info("... getNetworkList")
		val c = adminConnectionService.getConnection()
		val networkList: List<Network> =
			c.findAllNetworks()
		val list: List<ItInfoNetworkVo> =
			networkList.toItInfoNetworkVos(c)
		return list
	}


	override fun getHostNetworkList(id: String): List<ItInfoNetworkVo> {
		log.info("... getHostNetworkList('$id')")
		val c = adminConnectionService.getConnection()

		val hostNics: List<HostNic> =
			c.findAllNicsFromHost(id)
		val vms: List<Vm> =
			c.findAllVms()
		val dataCenter: DataCenter =
			c.findAllDataCenters().first()
		val clusters: List<Cluster> =
			c.findAllClusters()
		val networkList: List<Network> =
			c.findAllNetworks()
		val openStackNetworkProviders: List<OpenStackNetworkProvider> =
			c.findAllOpenStackNetworkProviders()
		val qoss: List<Qos> =
			c.findAllQossFromDataCenter(dataCenter.id())

		val itInfoNetworkClusterVos: MutableList<ItInfoNetworkClusterVo> = arrayListOf()
		var itInfoNetworkClusterVoList: List<ItInfoNetworkClusterVo> = arrayListOf()
		val list: MutableList<ItInfoNetworkVo> = arrayListOf()

		networkList.forEach(Consumer<Network> { network: Network ->
			val networkVo = ItInfoNetworkVo()
			for (hostNic in hostNics) {
				if (hostNic.network() != null && network.id() == hostNic.network().id()) {
					if (hostNic.baseInterface() == null) {
						networkVo.baseInterface = hostNic.name()
						break
					}
					if (hostNic.baseInterface() != null) {
						networkVo.baseInterface = hostNic.baseInterface()
						break
					}
				}
			}
			for (cluster in clusters) {
				val networkss
						: List<Network> =
					c.findAllNetworksFromCluster(cluster.id())

				for (clusterNetwork in networkss) {
					val networkClusterVo = ItInfoNetworkClusterVo()
					val usages: MutableList<ItInfoNetworkUsagesVo> =
						arrayListOf()
					if (clusterNetwork.id()
							.equals(network.id(), ignoreCase = true) && clusterNetwork.required()
					) networkVo.required = clusterNetwork.required()
					clusterNetwork.usages().forEach(Consumer { cn: NetworkUsage ->
						val usageVo = ItInfoNetworkUsagesVo()
						usageVo.usage = cn.name
						usages.add(usageVo)
					})
					networkClusterVo.usages = usages
					networkClusterVo.status = clusterNetwork.status().value()
					itInfoNetworkClusterVos.add(networkClusterVo)
				}
			}
			val vnicProfiles
					: List<VnicProfile> =
				c.findAllVnicProfilesFromNetwork(network.id())
			val vnicIds: MutableList<String> = arrayListOf()
			for (vnic in vnicProfiles) vnicIds.add(vnic.id())
			for (vm in vms) {
				val nics
						: List<Nic> = c.findNicsFromVm(vm.id())
				for (nic in nics) {
					if (nic.idPresent()) for (vnicId in vnicIds) {
						if (nic.vnicProfile() != null && vnicId.equals(
								nic.vnicProfile().id(),
								ignoreCase = true
							) && "up" == vm.status().value()
						) networkVo.usingVmNetwork = true
					}
				}
			}
			networkVo.comment = network.comment()
			networkVo.id = network.id()
			networkVo.name = network.name()
			networkVo.description = network.description()
			if (network.mtuPresent()) networkVo.mtu = network.mtuAsInteger().toString()
			if (network.vlanPresent()) networkVo.vlan = network.vlan().id().toInt().toString()
			list.add(networkVo)
		})
		if (networkList.isNotEmpty())
			itInfoNetworkClusterVoList = itInfoNetworkClusterVos.subList(0, networkList.size)
		for (j in list.indices) {
			list[j].usages = itInfoNetworkClusterVoList[j].usages
			list[j].status = itInfoNetworkClusterVoList[j].status
		}
		return list
	}

	override fun getNetworkDetail(castanetsNetworkVo: ItInfoNetworkVo): ItInfoNetworkGroupVo {
		var _castanetsNetworkVo = castanetsNetworkVo
		val networkId = _castanetsNetworkVo.id
		log.info("... getNetworkDetail({})", networkId)
		val c = adminConnectionService.getConnection()
		val clusters
				: List<Cluster> = c.findAllClusters()
		val networkClusterVos = clusters.toItInfoNetworkClusterVos(c, networkId)

		val networkHostVos = getNetworkHost(networkId)
		_castanetsNetworkVo = getNetwork(networkId)

		val castanetsNetworkVmVos = getNetworkVm(networkId)

		return ItInfoNetworkGroupVo(
			_castanetsNetworkVo,
			networkClusterVos,
			networkHostVos,
			castanetsNetworkVmVos
		)
	}

	override fun getNetworkCluster(clusterId: String, networkId: String): List<ItInfoNetworkClusterVo> {
		log.info("... getNetworkCluster('$clusterId', '$networkId')")
		val c = adminConnectionService.getConnection()
		val clusters: List<Cluster> =
			c.findAllClusters()
		val list: List<ItInfoNetworkClusterVo> =
			clusters.toItInfoNetworkClusterVos(c, networkId)
		return list
	}

	override fun getNetwork(networkId: String): ItInfoNetworkVo {
		log.info("... getNetwork('$networkId')")
		val c = adminConnectionService.getConnection()
		val networkList: List<Network> =
			c.findAllNetworks()
		val n: Network =
			networkList.first {
				it.id().equals(networkId, ignoreCase = true)
			}
		return n.toItInfoNetworkVo(c)
	}


	override fun getNetworkHost(networkId: String): List<ItInfoNetworkHostVo> {
		log.info("... getNetworkHost('$networkId')")
		val c = adminConnectionService.getConnection()
		val hosts: List<Host> =
			c.findAllHosts()
		return hosts.toItInfoNetworkHostVos(c, networkId)
	}

	override fun getNetworkVm(networkId: String): List<ItInfoNetworkVmVo> {
		log.info("... getNetworkVm('$networkId')")
		val c = adminConnectionService.getConnection()
		val vms: List<Vm> =
			c.findAllVms()
		val clusters: List<Cluster> =
			c.findAllClusters()
		val vnicProfiles: List<VnicProfile> =
			c.findAllVnicProfilesFromNetwork(networkId)

		val networkVmVos: MutableList<ItInfoNetworkVmVo> = arrayListOf()
		val vnicIds: List<String> = vnicProfiles.map { it.id() }
		val number = BigDecimal("1000000")
		vms.forEach(Consumer<Vm> { vm: Vm ->
			val nics
					: List<Nic> = c.findNicsFromVm(vm.id())
			nics.forEach(Consumer<Nic> { nic: Nic ->
				if (nic.idPresent()) {
					var vnicIdCheck = false
					for (vnicId in vnicIds)
						if (nic.vnicProfile() != null && vnicId.equals(nic.vnicProfile().id(), ignoreCase = true))
							vnicIdCheck = true

					if (vnicIdCheck) {
						val castanetsNetworkVmVo = ItInfoNetworkVmVo()
						castanetsNetworkVmVo.vmName = vm.name()
						castanetsNetworkVmVo.vmStatus = vm.status().value()
						for (cluster in clusters)
							if (cluster.id().equals(vm.cluster().id(), ignoreCase = true))
								castanetsNetworkVmVo.vmCluster = cluster.name()

						castanetsNetworkVmVo.nicName = nic.name()
						if (nic.reportedDevicesPresent()) {
							var ips = ""
							for (i in nic.reportedDevices().indices) {
								for (j in nic.reportedDevices()[i].ips().indices) {
									ips = "$ips " + nic.reportedDevices()[i].ips()[j].address()
								}
							}
							castanetsNetworkVmVo.ip = ips
						}
						if (vm.fqdnPresent()) castanetsNetworkVmVo.fqdn = vm.fqdn()
						if (nic.linkedPresent()) castanetsNetworkVmVo.linked = if (nic.linked()) "true" else "false"

						val statistics: List<Statistic> =
							c.findAllStatisticsFromVmNic(vm.id(), nic.id())
						statistics.forEach(Consumer<Statistic> { statistic: Statistic ->
							if (statistic.namePresent()) {
								val values =
									statistic.values()
								if (statistic.name().equals("data.current.rx.bps", ignoreCase = true)) {
									values.forEach(Consumer { value: Value ->
										castanetsNetworkVmVo.dataCurrentRxBps = value.datum().divide(number, 1, 0)
									})
								}
								if (statistic.name().equals("data.current.tx.bps", ignoreCase = true)) {
									values.forEach(Consumer { value2: Value ->
										castanetsNetworkVmVo.dataCurrentTxBps = value2.datum().divide(number, 1, 0)
									})
								}
								if (statistic.name().equals("data.total.rx", ignoreCase = true)) {
									values.forEach(Consumer { value3: Value ->
										castanetsNetworkVmVo.dataTotalRx = value3.datum()
									})
								}
								if (statistic.name().equals("data.total.tx", ignoreCase = true)) {
									values.forEach(Consumer { value4: Value ->
										castanetsNetworkVmVo.dataTotalTx = value4.datum()
									})
								}
							}
						})
						networkVmVos.add(castanetsNetworkVmVo)
					}
				}
			})
		})
		return networkVmVos
	}

	override fun getNetworkCreateResource(): ItInfoNetworkCreateVo {
		log.info("... getNetworkCreateResource")
		val c = adminConnectionService.getConnection()
		val dataCenter: DataCenter =
			c.findAllDataCenters().first()
		val clusters: List<Cluster> =
			c.findAllClusters()
		val networks: List<Network> =
			c.findAllNetworks()
		val qoss: List<Qos> =
			c.findAllQossFromDataCenter(dataCenter.id())

		return ItInfoNetworkCreateVo().apply {
			this.clusters = clusters.map {
				ItInfoNetworkClusterVo().apply {
					if (it.idPresent()) this.clusterId = it.id()
					if (it.namePresent()) this.clusterName = it.name()
					this.connect = true
					this.required = true
				}
			}
			this.qoss = qoss.map {
				ItInfoNetworkQosVo().apply {
					if (it.idPresent()) this.id = it.id()
					if (it.namePresent()) this.name = it.name()
				}
			}
			this.networkName = networks.filter { it.namePresent() }.map { it.name() }
		}
	}

	@Async("karajanTaskExecutor")
	override fun addLogicalNetwork(castanetsNetworkVo: ItInfoNetworkVo) {
		log.info("... addLogicalNetwork")
		val c = adminConnectionService.getConnection()
		val dataCenter: DataCenter =
			c.findAllDataCenters().first()
		val nameServers: List<String> = castanetsNetworkVo.dnss.filter { 
			it.dnsIp.isNotEmpty()
		}.map { it.dnsIp }
		
		try {
			c.addNetwork(
				NetworkBuilder()
					.name(castanetsNetworkVo.name)
					.description(castanetsNetworkVo.description)
					.dataCenter(Builders.dataCenter().id(dataCenter.id()))
					.vlan(
						if (castanetsNetworkVo.vlan.isNotEmpty())
							Builders.vlan().id(castanetsNetworkVo.vlan.toInt())
						else null
					)
					.usages(
						if (castanetsNetworkVo.usage.equals("true", ignoreCase = true))
							NetworkUsage.VM
						else
							NetworkUsage.DEFAULT_ROUTE
					)
					.mtu(
						if (castanetsNetworkVo.mtu.isNotEmpty())
							castanetsNetworkVo.mtu.toInt()
						else
							1500
					)
					.dnsResolverConfiguration(Builders.dnsResolverConfiguration().nameServers(nameServers))
					.qos(
						if (castanetsNetworkVo.qos.isNotEmpty())
							Builders.qos().id(castanetsNetworkVo.qos).build()
						else
							Builders.qos().build()
					)
					.build()
			)?.let {
				castanetsNetworkVo.clusters.forEach { clusterVo: ItInfoNetworkClusterVo ->
					if (clusterVo.connect) {
						c.addNetworkFromCluster(clusterVo.clusterId,
							Builders.network().id(it.id()).required(clusterVo.required).build()
						)?.id()
					}
					// 추가행위
				}
				if (castanetsNetworkVo.label.isNotEmpty()) {
					val nl2add = Builders.networkLabel().id(castanetsNetworkVo.label).build()
					c.addNetworkLabelFromNetwork(it.id(), nl2add)
				}
				doSleep(2000L)
				val message = MessageVo.createMessage(MessageType.NETWORK_ADD, true, castanetsNetworkVo.name, "")
				websocketService.notify(message)
			}
			
		} catch (e: Exception) {
			log.error(e.localizedMessage)
			doSleep(2000L)
			val message = MessageVo.createMessage(MessageType.NETWORK_ADD, false, castanetsNetworkVo.name, "")
			websocketService.notify(message)
		}
	}

	override fun deleteNetworks(itinfoNetworkVos: List<ItInfoNetworkVo>) {
		log.info("... deleteNetworks[{}]", itinfoNetworkVos.size)
		val c = adminConnectionService.getConnection()
		try {
			c.findAllNetworks().forEach { network ->
				itinfoNetworkVos.forEach { itinfoNetworkVo: ItInfoNetworkVo ->
					if (network.id().equals(itinfoNetworkVo.id, ignoreCase=true)) {
						if (network.status() !== NetworkStatus.OPERATIONAL)
							c.removeNetwork(itinfoNetworkVo.id)
					}
				}
			}
			val message = MessageVo.createMessage(MessageType.NETWORK_REMOVE, true, itinfoNetworkVos[0].name, "")
			websocketService.notify(message)
		} catch (e: Exception) {
			log.error(e.localizedMessage)
			e.printStackTrace()
			val message = MessageVo.createMessage(MessageType.NETWORK_REMOVE, false, itinfoNetworkVos[0].name, "")
			websocketService.notify(message)
		}
	}

	@Async("karajanTaskExecutor")
	override fun updateNetwork(castanetsNetworkVo: ItInfoNetworkVo) {
		log.info("... updateNetwork")
		val c = adminConnectionService.getConnection()
		val dataCenter: DataCenter = c.findAllDataCenters().first()
		val nameServers: List<String> = castanetsNetworkVo.dnss.filter { it.dnsIp.isNotEmpty() }.map { it.dnsIp }

		try {
			val n2Update = NetworkBuilder()
				.name(castanetsNetworkVo.name)
				.description(castanetsNetworkVo.description)
				.dataCenter(Builders.dataCenter().id(dataCenter.id()))
				.vlan(
					if ((castanetsNetworkVo.vlan.isNotEmpty()))
						Builders.vlan().id(castanetsNetworkVo.vlan.toInt())
					else
						null
				)
				.usages(
					if ("true".equals(castanetsNetworkVo.usage, ignoreCase = true))
						NetworkUsage.VM
					else
						NetworkUsage.DEFAULT_ROUTE
				)
				.dnsResolverConfiguration(Builders.dnsResolverConfiguration().nameServers(nameServers))
				.qos(
					if (castanetsNetworkVo.qos.isNotEmpty())
						Builders.qos().id(castanetsNetworkVo.qos).build()
					else
						Builders.qos().build()
				).build()
			val nUpdated: Network? =
				c.updateNetwork(castanetsNetworkVo.id, n2Update)
			val networkLabels: List<NetworkLabel> =
				c.findAllNetworkLabelsFromNetwork(castanetsNetworkVo.id)
			networkLabels.forEach { networkLabel: NetworkLabel ->
				c.removeNetworkLabelFromNetwork(castanetsNetworkVo.id, networkLabel.id())
			}

			if (castanetsNetworkVo.label.isNotEmpty()) {
				val lbl2add = Builders.networkLabel().id(castanetsNetworkVo.label).build()
				c.addNetworkLabelFromNetwork(castanetsNetworkVo.id, lbl2add)
			}

			val clusterVos = getNetworkCluster("", castanetsNetworkVo.id)

			clusterVos.forEach { clusterVo: ItInfoNetworkClusterVo ->
				if (clusterVo.connect)
					castanetsNetworkVo.clusters.forEach { cluster: ItInfoNetworkClusterVo ->
						if (cluster.clusterId.equals(clusterVo.clusterId, ignoreCase = true)) {
							if (!cluster.connect) {
								c.removeNetworkFromCluster(
									clusterVo.clusterId,
									castanetsNetworkVo.id
								)
								return
							}
							c.updateNetworkFromCluster(
								clusterVo.clusterId,
								Builders.network().id(castanetsNetworkVo.id).required(cluster.required && !clusterVo.required).build()
							)
						}
					}
				else castanetsNetworkVo.clusters.forEach{ cluster2: ItInfoNetworkClusterVo ->
					if (cluster2.clusterId.equals(clusterVo.clusterId, ignoreCase = true)) {
						if (cluster2.connect) {
							c.addNetworkFromCluster(
								clusterVo.clusterId,
								Builders.network().id(castanetsNetworkVo.id).required(true).build()
							)?.id()?.let {
								if (!cluster2.required) {
									c.updateNetworkFromCluster(
										it,
										Builders.network().id(castanetsNetworkVo.id).required(false).build()
									)
								}
							}
						}
					}
				}
			}
			doSleep(2000L)
			val message = MessageVo.createMessage(MessageType.NETWORK_UPDATE, true, castanetsNetworkVo.name, "")
			websocketService.notify(message)
		} catch (e: Exception) {
			log.error(e.localizedMessage)
			e.printStackTrace()
			doSleep(2000L)
			val message = MessageVo.createMessage(MessageType.NETWORK_UPDATE, false, castanetsNetworkVo.name, "")
			websocketService.notify(message)
		}
	}
	
	companion object {
		private val log by LoggerDelegate()
	}
}