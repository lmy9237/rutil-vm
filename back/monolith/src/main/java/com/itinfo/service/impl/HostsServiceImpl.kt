package com.itinfo.service.impl

import com.itinfo.*

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.controller.doSleep

import com.itinfo.dao.ClustersDao

import com.itinfo.model.MessageVo
import com.itinfo.model.MessageType
import com.itinfo.model.EventVo
import com.itinfo.model.toEventVos
import com.itinfo.model.VmSummaryVo
import com.itinfo.model.DashboardTopVo
import com.itinfo.model.HostCreateVo
import com.itinfo.model.toHostDetailVo
import com.itinfo.model.NicUsageApiVo
import com.itinfo.model.HostDetailVo
import com.itinfo.model.toSshVo
import com.itinfo.model.LunVo
import com.itinfo.model.NicUsageVo
import com.itinfo.model.toNicUsageApiVo
import com.itinfo.model.NetworkAttachmentVo
import com.itinfo.model.FenceAgentVo
import com.itinfo.model.toAgent
import com.itinfo.model.toUsageVosWithHostUsage
import com.itinfo.model.karajan.ConsolidationVo
import com.itinfo.model.karajan.HostVo

import com.itinfo.service.HostsService
import com.itinfo.service.consolidation.Ffd
import com.itinfo.service.engine.AdminConnectionService
import com.itinfo.service.engine.KarajanService
import com.itinfo.service.engine.WebsocketService

import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.builders.*
import org.ovirt.engine.sdk4.types.*

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Service
import java.util.*


@Service
class HostsServiceImpl : HostsService {
	@Autowired private lateinit var adminConnectionService: AdminConnectionService
	@Autowired private lateinit var karajanService: KarajanService
	@Autowired private lateinit var ffd: Ffd
	@Autowired private lateinit var clustersDao: ClustersDao
	@Autowired private lateinit var websocketService: WebsocketService
	
	override fun maintenanceBeforeConsolidateVms(
		hostIds: List<String>
	): List<ConsolidationVo> {
		log.info("... maintenanceBeforeConsolidateVms")
		val c = adminConnectionService.getConnection()
		var consolidations: List<ConsolidationVo> = arrayListOf()
		try {
			for (id in hostIds) {
				val host: Host = c.findHost(id) ?: continue
				val karajan = karajanService.getDataCenter()
				consolidations = ffd.reassignVirtualMachine(karajan, host.cluster().id(), host.id())
			}
		} catch (e: Exception) {
			log.error(e.localizedMessage)
			e.printStackTrace()
		}
		return consolidations
	}

	@Async("karajanTaskExecutor")
	override fun maintenanceStart(
		hostIds: List<String>
	) {
		log.info("... maintenanceStart")
		val connection = adminConnectionService.getConnection()
		var message: MessageVo
		for (id in hostIds) {
			connection.findHost(id)?.let {
				try {
					if (it.status() != HostStatus.MAINTENANCE) connection.deactivateHost(id)
					var h : Host?
					do {
						Thread.sleep(5000L)
						h = connection.findHost(id)
					} while (h != null && h.status() != HostStatus.MAINTENANCE)
					message = MessageVo.createMessage(MessageType.MAINTENANCE_START, true, it.name(), "")
					websocketService.notify(message)
					websocketService.reload(message, "hosts")
				} catch (e: Exception) {
					e.printStackTrace()
					log.error(e.localizedMessage)
					message = MessageVo.createMessage(MessageType.MAINTENANCE_START, false, it.name(), e.localizedMessage)
					websocketService.notify(message)
					websocketService.reload(message, "hosts")
				}
			}
		}
	}

	@Async("karajanTaskExecutor")
	override fun maintenanceStop(
		hostIds: List<String>
	) {
		log.info("... maintenanceStop")
		val c = adminConnectionService.getConnection()
		var message: MessageVo
		for (id in hostIds) {
			var host: Host = c.findHost(id) ?: continue
			try {
				c.activateHost(id)
				do {
					Thread.sleep(5000L)
					host = c.findHost(id) ?: continue
				} while (host.status() != HostStatus.UP)
				message = MessageVo.createMessage(MessageType.MAINTENANCE_STOP, true, host.name(), "")
			} catch (e: Exception) {
				e.printStackTrace()
				log.error(e.localizedMessage)
				message = MessageVo.createMessage(MessageType.MAINTENANCE_STOP, false, host.name(), e.localizedMessage)
			}
			websocketService.notify(message)
			websocketService.reload(message, "hosts")
		}
	}

	@Async("karajanTaskExecutor")
	override fun restartHost(hosts: List<String>) {
		val c = adminConnectionService.getConnection()
		var message: MessageVo
		for (id in hosts) {
			var host: Host = c.findHost(id) ?: continue
			try {
				val pwMng = c.findPowerManagementFromHost(id, FenceType.RESTART)
				do {
					Thread.sleep(5000L)
					host = c.findHost(id) ?: continue
				} while (host.status() != HostStatus.UP)
				message = MessageVo.createMessage(MessageType.HOST_RESTART, true, host.name(), "")
			} catch (e: Exception) {
				e.printStackTrace()
				log.error(e.localizedMessage)
				message = MessageVo.createMessage(MessageType.HOST_RESTART, false, host.name(), e.localizedMessage)
			}
			websocketService.notify(message)
			websocketService.reload(message, "hosts")
		}
	}

	@Async("karajanTaskExecutor")
	override fun startHost(hosts: List<String>) {
		val c = adminConnectionService.getConnection()
		var message: MessageVo
		for (id in hosts) {
			val host = c.findHost(id)
			try {
				var item: Host?
				val pwrMng = c.findPowerManagementFromHost(id, FenceType.START)
				do {
					Thread.sleep(5000L)
					item = c.findHost(id)
				} while (item?.status() != HostStatus.UP)
				message = MessageVo.createMessage(MessageType.HOST_START, true, host?.name() ?: "", "")
			} catch (e: Exception) {
				e.printStackTrace()
				log.error(e.localizedMessage)
				message = MessageVo.createMessage(MessageType.HOST_START, false, host?.name() ?: "", e.localizedMessage)
			}
			websocketService.notify(message)
			websocketService.reload(message, "hosts")
		}
	}

	@Async("karajanTaskExecutor")
	override fun stopHost(hosts: List<String>) {
		val c = adminConnectionService.getConnection()
		var message: MessageVo
		for (id in hosts) {
			val host = c.findHost(id)
			try {
				var item: Host?
				val res = c.findPowerManagementFromHost(id, FenceType.STOP)
				do {
					Thread.sleep(5000L)
					item = c.findHost(id)
				} while (item?.status() != HostStatus.DOWN)
				message = MessageVo.createMessage(MessageType.HOST_STOP, true, host?.name() ?: "", "")
			} catch (e: Exception) {
				e.printStackTrace()
				log.error(e.localizedMessage)
				message = MessageVo.createMessage(MessageType.HOST_STOP, false, host?.name() ?: "", e.localizedMessage)
			}
			websocketService.notify(message)
			websocketService.reload(message, "hosts")
		}
	}

	@Async("karajanTaskExecutor")
	override fun createHost(hostCreateVo: HostCreateVo) {
		log.info("... createHost")
		val c = adminConnectionService.getConnection()
		val message = MessageVo()
		message.title = "호스트 추가"
		message.text = "호스트 추가 실패(${hostCreateVo.name}) 찾을 수 없음"
		message.style = "error"
		val cluster: Cluster = c.findCluster(hostCreateVo.clusterId) ?: run {
			websocketService.notify(message)
			log.error("something went WRONG ... reason: NO cluster found")
			return
		}
		val hostBuilder = HostBuilder()
		if (hostCreateVo.ssh?.port != null && hostCreateVo.ssh?.port == 22) {
			hostBuilder
				.name(hostCreateVo.name)
				.comment(hostCreateVo.comment)
				.description(hostCreateVo.description)
				.address(hostCreateVo.ssh?.address)
				.rootPassword(hostCreateVo.ssh?.password)
				.cluster(ClusterBuilder().name(cluster.name()))
		} else {
			hostBuilder
				.name(hostCreateVo.name)
				.comment(hostCreateVo.comment)
				.description(hostCreateVo.description)
				.address(hostCreateVo.ssh?.address)
				.port(54321)
				.ssh(SshBuilder().port(hostCreateVo.ssh?.port))
				.rootPassword(hostCreateVo.ssh?.password)
				.cluster(ClusterBuilder().name(cluster.name()))
		}
		try {
			var host: Host? =
				c.addHost(hostBuilder.build(), hostCreateVo.hostEngineEnabled)
			do {
				Thread.sleep(2000L)
				host = c.findHost(hostCreateVo.id)
			} while (host?.status() != HostStatus.UP && host?.status() != HostStatus.INSTALLING)
			if (hostCreateVo.powerManagementEnabled && hostCreateVo.fenceAgent != null && "" != hostCreateVo.fenceAgent!!.address) {
				val agentBuilder = AgentBuilder()
				agentBuilder.address(hostCreateVo.fenceAgent!!.address)
					.username(hostCreateVo.fenceAgent!!.username)
					.password(hostCreateVo.fenceAgent!!.password)
					.type(hostCreateVo.fenceAgent!!.type)
					.order(1)
					.encryptOptions(false)
				val agent: Agent? = c.addFenceAgent(host.id(), agentBuilder.build())
				hostBuilder.powerManagement(
					PowerManagementBuilder()
						.enabled(true)
						.kdumpDetection(true)
						.agents(agent)
				)
			}
			if (host.status() == HostStatus.UP) try {
				host = c.updateHost(hostBuilder.build())
				message.text = "호스트 추가 완료(${hostCreateVo.name})"
				message.style = "success"
			} catch (e: Exception) {
				log.error(e.localizedMessage)
				message.text = "호스트 추가 완료, 전원관리 추가 실패 (${hostCreateVo.name})"
				message.style = "warning"
			}
		} catch (e: Exception) {
			log.error(e.localizedMessage)
			e.printStackTrace()
			message.text = "호스트 추가 실패(${hostCreateVo.name})"
			message.style = "error"
		}
		websocketService.notify(message)
		websocketService.reload(message, "hosts")
	}

	@Async("karajanTaskExecutor")
	override fun updateHost(hostCreateVo: HostCreateVo) {
		log.info("... updateHost")
		val c = adminConnectionService.getConnection()
		val (_, clusterId, name, _, _, _, _, powerManagementEnabled, _, ssh) = retrieveCreateHostInfo(hostCreateVo.id)
		val hostBuilder = HostBuilder()
		if ("" != hostCreateVo.name && name != hostCreateVo.name) hostBuilder.name(hostCreateVo.name)
		hostBuilder.comment(hostCreateVo.comment)
		if (hostCreateVo.ssh != null && hostCreateVo.ssh!!.port != null && ssh != null && ssh.port != null && ssh.port == hostCreateVo.ssh!!.port) hostBuilder.port(
			54321
		)
			.ssh(SshBuilder().port(hostCreateVo.ssh!!.port))
		if (clusterId != hostCreateVo.clusterId) {
			val cluster: Cluster? = c.findCluster(hostCreateVo.clusterId)
			hostBuilder.cluster(ClusterBuilder().name(cluster?.name()))
		}
		if (hostCreateVo.fenceAgent != null)
			if (!powerManagementEnabled &&
				hostCreateVo.powerManagementEnabled &&
				hostCreateVo.fenceAgent?.address != null || "" == hostCreateVo.fenceAgent?.address) {
			val agentBuilder = AgentBuilder()
			agentBuilder.address(hostCreateVo.fenceAgent?.address)
				.username(hostCreateVo.fenceAgent?.username)
				.password(hostCreateVo.fenceAgent?.password)
				.type(hostCreateVo.fenceAgent?.type)
				.order(1)
				.encryptOptions(false)
			val agent: Agent? = c.addFenceAgent(hostCreateVo.id, agentBuilder.build())
			hostBuilder.powerManagement(
				PowerManagementBuilder()
					.enabled(true)
					.kdumpDetection(true)
					.agents(agent)
			)
		} else if (powerManagementEnabled && !hostCreateVo.powerManagementEnabled) {
			hostBuilder.powerManagement(
				PowerManagementBuilder()
					.enabled(false)
					.kdumpDetection(true)
			)
		}
		val message: MessageVo = try {
			val host: Host? =
				c.updateHost(hostBuilder.build())
			doSleep(2000L)
			MessageVo.createMessage(MessageType.HOST_MODIFY, true, hostCreateVo.name, "")
		} catch (e: Exception) {
			e.printStackTrace()
			log.error(e.localizedMessage)
			MessageVo.createMessage(MessageType.HOST_MODIFY, false, hostCreateVo.name, e.localizedMessage)
		}
		websocketService.notify(message)
		websocketService.reload(message, "hosts")
	}

	@Async("karajanTaskExecutor")
	override fun removeHost(
		hostIds: List<String>
	) {
		log.info("... removeHost")
		val c = adminConnectionService.getConnection()
		val host: Host = c.findHost(hostIds.first()) ?: run {
			val message: MessageVo = MessageVo.createMessage(MessageType.HOST_REMOVE, true, "실패", "찾을 수 없음")
			websocketService.notify(message)
			log.error("something went WRONG ... reason: NO host found")
			return
		}

		val message: MessageVo = try {
			val res: Boolean = c.removeHost(hostIds[0])
			MessageVo.createMessage(MessageType.HOST_REMOVE, res, host.name() ?: "", "")
		} catch (e: Exception) {
			e.printStackTrace()
			log.error(e.localizedMessage)
			MessageVo.createMessage(MessageType.HOST_REMOVE, false, host.name() ?: "", e.localizedMessage)
		}
		doSleep(2000L)
		websocketService.notify(message)
		websocketService.reload(message, "hosts")
	}

	override fun setupHostNetwork(
		nicUsageApiVoList: List<NicUsageApiVo>
	) {
		log.info("... setupHostNetwork")
		val c = adminConnectionService.getConnection()
		var hostId = ""
		val it = nicUsageApiVoList.iterator()
		if (it.hasNext()) {
			val (_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, hostId1) = it.next()
			hostId = hostId1
		}
		if (hostId.isEmpty()) {
			val message = MessageVo()
			message.title = "호스트 네트워크 편집"
			message.text = "호스트 네트워크 편집 실패(no such hostId Found)"
			message.style = "error"
			log.error("호스트 네트워크 편집 실패(no such hostId Found)")
			return
		}
		val host: Host = c.findHost(hostId) ?: run {
			log.error("something went WRONG ... reason: NO host found")
			return
		}
		val hostNics = c.findAllNicsFromHost(hostId)
		var networkAttachmentId: String? = null
		val message = MessageVo()
		message.title = "호스트 네트워크 편집"
		for (nicUsageApiVo in nicUsageApiVoList) {
			if (nicUsageApiVo.bonding.isEmpty() && nicUsageApiVo.id.isEmpty()) {
				if ("" != nicUsageApiVo.networkId) {
					val it2: Iterator<HostNic> = hostNics.iterator()
					while (true) {
						if (!it2.hasNext()) {
							break
						} else if (hostNics.indexOf(it2.next()) == hostNics.size - 1) {
							if (nicUsageApiVo.nicExNetExist) {
								if (nicUsageApiVo.vlanNetworkList.isNotEmpty() && nicUsageApiVo.networkId != "") {
									try {
										val slaves: List<HostNicBuilder> = nicUsageApiVo.bonding.map {
											Builders.hostNic().name(it.name)
										}
										val networkArray: MutableList<NetworkBuilder> = arrayListOf()
										val modifiedNetworkAttachments: MutableList<NetworkAttachment> = arrayListOf()
										
										networkAttachmentId = c.findAllNetworkAttachmentsFromHost(host.id()).first() { 
											it.networkPresent() && it.network().id() == nicUsageApiVo.networkId
										}.id()
										
										for (vlan in nicUsageApiVo.vlanNetworkList) {
											val networkBuilder = NetworkBuilder()
											networkBuilder.id(vlan)
											networkArray.add(networkBuilder)
										}
										
										for (networkAttachment2 in c.findAllNetworkAttachmentsFromHost(hostId)) {
											val it4 = nicUsageApiVo.vlanNetworkList.iterator()
											while (true) {
												if (it4.hasNext()) {
													val vlan2 = it4.next()
													if (networkAttachment2.network().id() == vlan2) {
														modifiedNetworkAttachments.add(networkAttachment2)
														break
													}
												}
											}
										}
										
										for (netattach in modifiedNetworkAttachments)
											c.removeNetworkAttachmentFromHost(hostId, netattach.id())

										c.setupNetworksFromHost(hostId,
											Builders.hostNic().name(nicUsageApiVo.name).bonding(
												Builders.bonding().options(
													Builders.option().name("mode").value(nicUsageApiVo.bondingMode).build(),
													Builders.option().name("miimon").value("100").build()
												).slaves(*slaves.toTypedArray<HostNicBuilder>())
											).build(), listOf(Builders.networkAttachment().id(networkAttachmentId)
											.hostNic(Builders.hostNic().name(nicUsageApiVo.name)).build()
										))

										for (network in networkArray) {
											c.setupNetworksFromHost(hostId,
												Builders.hostNic().name(nicUsageApiVo.name).bonding(
													Builders.bonding().options(
														Builders.option().name("mode").value(nicUsageApiVo.bondingMode).build(),
														Builders.option().name("miimon").value("100").build()
													).slaves(*slaves.toTypedArray<HostNicBuilder>())
												).build(), listOf(Builders.networkAttachment().network(network)
													.hostNic(Builders.hostNic().name(nicUsageApiVo.name)).build()
												)
											)
										}
										message.text = "호스트 네트워크 편집 완료(${nicUsageApiVo.name})"
										message.style = "success"
									} catch (e: Exception) {
										log.error(e.localizedMessage)
										e.printStackTrace()
										message.text = "호스트 네트워크 편집 실패(${nicUsageApiVo.name})"
										message.style = "error"
									}
								} else if (nicUsageApiVo.vlanNetworkList.isEmpty()) {
									try {
										val slaves2: List<HostNicBuilder> = nicUsageApiVo.bonding.map {
											Builders.hostNic().name(it.name)
										}
										networkAttachmentId = c.findAllNetworkAttachmentsFromHost(hostId).first {
											it.networkPresent() && it.network().id() == nicUsageApiVo.networkId
										}.id()

										c.setupNetworksFromHost(hostId,
											Builders.hostNic().name(nicUsageApiVo.name).bonding(
												Builders.bonding().options(
													Builders.option().name("mode").value(nicUsageApiVo.bondingMode),
													Builders.option().name("miimon").value("100")
												).slaves(*slaves2.toTypedArray<HostNicBuilder>())
											).build(), listOf(Builders.networkAttachment().id(networkAttachmentId)
													.hostNic(Builders.hostNic().name(nicUsageApiVo.name)).build()
											)
										)
										message.text = "호스트 네트워크 편집 완료(${nicUsageApiVo.name})"
										message.style = "success"
									} catch (e2: Exception) {
										log.error(e2.localizedMessage)
										e2.printStackTrace()
										message.text = "호스트 네트워크 편집 실패(${nicUsageApiVo.name})"
										message.style = "error"
									}
								} else if (nicUsageApiVo.vlanNetworkList.isNotEmpty() && nicUsageApiVo.networkId.isEmpty()) {
									try {
										val slaves3: MutableList<HostNicBuilder> = arrayListOf()
										for ((_, name) in nicUsageApiVo.bonding) {
											val hostNic3 = Builders.hostNic()
											hostNic3.name(name)
											slaves3.add(hostNic3)
										}
										val networkArray2: MutableList<NetworkBuilder> = arrayListOf()
										for (vlan3 in nicUsageApiVo.vlanNetworkList) {
											val networkBuilder2 = NetworkBuilder()
											networkBuilder2.id(vlan3)
											networkArray2.add(networkBuilder2)
										}
										val modifiedNetworkAttachments2: MutableList<NetworkAttachment> = arrayListOf()
										for (networkAttachment4 in c.findAllNetworkAttachmentsFromHost(hostId)) {
											val it6: Iterator<*> = nicUsageApiVo.vlanNetworkList.iterator()
											while (true) {
												if (it6.hasNext()) {
													val vlan4 = it6.next() as String
													if (networkAttachment4.network().id() == vlan4) {
														modifiedNetworkAttachments2.add(networkAttachment4)
														break
													}
												}
											}
										}
										for (netattach2 in modifiedNetworkAttachments2) 
											c.removeNetworkAttachmentFromHost(host.id(), netattach2.id())
										
										for (network2 in networkArray2) {
											c.setupNetworksFromHost(hostId,
												Builders.hostNic().name(nicUsageApiVo.name).bonding(
													Builders.bonding().options(
															Builders.option().name("mode").value(nicUsageApiVo.bondingMode),
															Builders.option().name("miimon").value("100")
													).slaves(*slaves3.toTypedArray<HostNicBuilder>())
												).build(), listOf(
													Builders.networkAttachment().network(network2)
														.hostNic(Builders.hostNic().name(nicUsageApiVo.name)).build()
												)
											)
										}
										message.text = "호스트 네트워크 편집 완료(${nicUsageApiVo.name})"
										message.style = "success"
									} catch (e3: Exception) {
										e3.printStackTrace()
										message.text = "호스트 네트워크 편집 실패(${nicUsageApiVo.name})"
										message.style = "error"
									}
								}
							} else if (!nicUsageApiVo.nicExNetExist) {
								try {
									val slaves4: List<HostNicBuilder> = nicUsageApiVo.bonding.map {
										Builders.hostNic().name(it.name)
									}

									if (nicUsageApiVo.networkId.isNotEmpty()) {
										val network3 = NetworkBuilder()
										network3.id(nicUsageApiVo.networkId)
										c.setupNetworksFromHost(hostId,
											Builders.hostNic().name(nicUsageApiVo.name).bonding(
												Builders.bonding().options(
														Builders.option().name("mode").value(nicUsageApiVo.bondingMode),
														Builders.option().name("miimon").value("100")
												).slaves(*slaves4.toTypedArray<HostNicBuilder>())
											).build(), listOf(Builders.networkAttachment().network(network3)
												.hostNic(Builders.hostNic().name(nicUsageApiVo.name)).build()
											)
										)
									}
									val vlanList: List<NetworkBuilder> = nicUsageApiVo.vlanNetworkList.map {
										NetworkBuilder().id(it)
									}

									for (network4 in vlanList) {
										c.setupNetworksFromHost(hostId,
											Builders.hostNic().name(nicUsageApiVo.name).bonding(
												Builders.bonding().options(
													Builders.option().name("mode").value(nicUsageApiVo.bondingMode),
													Builders.option().name("miimon").value("100")
												).slaves(*slaves4.toTypedArray<HostNicBuilder>())
											).build(), listOf(
												Builders.networkAttachment().network(network4)
													.hostNic(Builders.hostNic().name(nicUsageApiVo.name)).build()
											)
										)
									}
									message.text = "호스트 네트워크 편집 완료(${nicUsageApiVo.name})"
									message.style = "success"
								} catch (e4: Exception) {
									e4.printStackTrace()
									message.text = "호스트 네트워크 편집 실패(${nicUsageApiVo.name})"
									message.style = "error"
								}
							}
						}
					}
				}
				if (nicUsageApiVo.networkId.isEmpty()) {
					try {
						val slaves5: List<HostNicBuilder> = nicUsageApiVo.bonding.map {
							Builders.hostNic().name(it.name)
						}

						c.setupNetworksFromHost(hostId,
							Builders.hostNic().name(nicUsageApiVo.name).bonding(
									Builders.bonding().options(
										Builders.option().name("mode").value(nicUsageApiVo.bondingMode),
										Builders.option().name("miimon").value("100")
									).slaves(*slaves5.toTypedArray<HostNicBuilder>()).build()
							).build(), listOf()
						)
						message.text = "호스트 네트워크 편집 완료(${nicUsageApiVo.name})"
						message.style = "success"
						return
					} catch (e5: Exception) {
						e5.printStackTrace()
						log.error(e5.localizedMessage)
						message.text = "호스트 네트워크 편집 실패(${nicUsageApiVo.name})"
						message.style = "error"
						return
					}
				}
			} else if (nicUsageApiVo.id.isNotEmpty()) {
				var vlanCount = 0
				val exBondingVlanList: MutableList<String> = arrayListOf()
				var logicalNetId = ""
				for (checkHostNic in hostNics) {
					if (nicUsageApiVo.name == checkHostNic.baseInterface()) {
						vlanCount++
						exBondingVlanList.add(checkHostNic.network().id())
					} else if (nicUsageApiVo.name == checkHostNic.name() && checkHostNic.network() != null) {
						logicalNetId = checkHostNic.network().id()
					}
				}
				if (nicUsageApiVo.insertSlave) {
					try {
						val slaves6: List<HostNicBuilder> = nicUsageApiVo.bonding.map {
							Builders.hostNic().name(it.name)
						}

						val network5 = NetworkBuilder()
							.id(nicUsageApiVo.networkId)
							.name(c.findNetwork(nicUsageApiVo.networkId)?.name())

						c.setupNetworksFromHost(hostId,
							Builders.hostNic().name(nicUsageApiVo.name).bonding(
								Builders.bonding().options(
									Builders.option().name("mode").value(nicUsageApiVo.bondingMode),
									Builders.option().name("miimon").value("100")
							).slaves(*slaves6.toTypedArray<HostNicBuilder>())
						).build())
						message.text = "호스트 네트워크 편집 완료(${nicUsageApiVo.name})"
						message.style = "success"
					} catch (e6: Exception) {
						e6.printStackTrace()
						log.error(e6.localizedMessage)
						message.text = "호스트 네트워크 편집 실패(${nicUsageApiVo.name})"
						message.style = "error"
					}
				} else if (logicalNetId.isEmpty() &&
					nicUsageApiVo.networkId.isNotEmpty()) {
					try {
						val networkBuilder4 = NetworkBuilder()
						networkBuilder4.id(nicUsageApiVo.networkId)
						c.modifyNetworkAttachmentFromHost(hostId,
								Builders.networkAttachment().network(networkBuilder4)
									.hostNic(Builders.hostNic().name(nicUsageApiVo.name)).build()
						)

						if (nicUsageApiVo.vlanNetworkList.isNotEmpty()) {
							val vlanNetworkList: List<NetworkBuilder> =
								if (vlanCount == 0)
									nicUsageApiVo.vlanNetworkList.map {
										NetworkBuilder().id(it)
									}
								else
									exBondingVlanList.filter { it in nicUsageApiVo.vlanNetworkList }.map {
										NetworkBuilder().id(it)
									}


							for (vlanNet in vlanNetworkList) {
								c.modifyNetworkAttachmentFromHost(hostId, Builders.networkAttachment().network(vlanNet)
									.hostNic(Builders.hostNic().name(nicUsageApiVo.name)).build())
							}
						}
						message.text = "호스트 네트워크 편집 완료(${nicUsageApiVo.name})"
						message.style = "success"
					} catch (e7: Exception) {
						e7.printStackTrace()
						log.error(e7.localizedMessage)
						message.text = "호스트 네트워크 편집 실패(${nicUsageApiVo.name})"
						message.style = "error"
					}
				} else if (nicUsageApiVo.vlanNetworkList.isNotEmpty()) {
					try {
						val vlanNetworkList2: MutableList<NetworkBuilder> = arrayListOf()
						if (vlanCount == 0) {
							for (nowVlan3 in nicUsageApiVo.vlanNetworkList) {
								val networkBuilder5 = NetworkBuilder()
								networkBuilder5.id(nowVlan3)
								vlanNetworkList2.add(networkBuilder5)
							}
						} else if (vlanCount > 0) {
							for (exVlan2 in exBondingVlanList) {
								for (nowVlan4 in nicUsageApiVo.vlanNetworkList) {
									if (exVlan2 != nowVlan4) {
										val networkBuilder6 = NetworkBuilder()
										networkBuilder6.id(nowVlan4)
										vlanNetworkList2.add(networkBuilder6)
									}
								}
							}
						}
						for (vlanNet2 in vlanNetworkList2) {
							c.modifyNetworkAttachmentsFromHost(host.id(),
								listOf(
									Builders.networkAttachment()
										.network(vlanNet2)
										.hostNic(Builders.hostNic().name(nicUsageApiVo.name)).build()
								)
							)
						}
						message.text = "호스트 네트워크 편집 완료(${nicUsageApiVo.name})"
						message.style = "success"
					} catch (e8: Exception) {
						e8.printStackTrace()
						message.text = "호스트 네트워크 편집 실패(${nicUsageApiVo.name})"
						message.style = "error"
					}
				} else if (nicUsageApiVo.networkId.isEmpty()) {
					try {
						networkAttachmentId = c.findAllNetworkAttachmentsFromHost(host.id()).first {
							it.networkPresent() &&
							it.network().id() == logicalNetId
						}.id()
						c.removeNetworkAttachmentFromHost(host.id(), networkAttachmentId)
						message.text = "호스트 네트워크 편집 완료(${nicUsageApiVo.name})"
						message.style = "success"
					} catch (e9: Exception) {
						e9.printStackTrace()
						log.error(e9.localizedMessage)
						message.text = "호스트 네트워크 편집 실패(${nicUsageApiVo.name})"
						message.style = "error"
					}
				} else if (
					vlanCount > 0 &&
					nicUsageApiVo.vlanNetworkList.isNotEmpty() &&
					vlanCount > nicUsageApiVo.vlanNetworkList.size
				) {

					try {
						val vlanNetworkList3: List<String> =
						if (nicUsageApiVo.vlanNetworkList.isNotEmpty())
							nicUsageApiVo.vlanNetworkList.filter {
								it !in exBondingVlanList
							}
						else
							exBondingVlanList

						val vlanNetAttachment: MutableList<String> = arrayListOf()
						for (networkAttachment6 in c.findAllNetworkAttachmentsFromHost(host.id())) {
							for (vlan6 in vlanNetworkList3) {
								if (networkAttachment6.network().id() == vlan6) {
									vlanNetAttachment.add(networkAttachment6.id())
								}
							}
						}
						for (attachmentId in vlanNetAttachment)
							c.removeNetworkAttachmentFromHost(host.id(), attachmentId)

						message.text = "호스트 네트워크 편집 완료(${nicUsageApiVo.name})"
						message.style = "success"
					} catch (e10: Exception) {
						e10.printStackTrace()
						log.error(e10.localizedMessage)
						message.text = "호스트 네트워크 편집 실패(${nicUsageApiVo.name})"
						message.style = "error"
					}
				}
			} else {
				if (nicUsageApiVo.bonding.isNotEmpty()) {
					val deleteBondingList: MutableList<NicUsageApiVo> = arrayListOf()
					val modifyNicList: MutableList<NicUsageApiVo> = arrayListOf()
					try {
						val vlanNetList: List<String> = hostNics.filter {
							it.baseInterfacePresent() && it.baseInterface() == nicUsageApiVo.unBondName &&
									it.networkPresent() && !it.network().id().isNullOrBlank()
						}.map { it.network().id() }

						val vlanNetAttachList: List<String> = c.findAllNetworkAttachmentsFromHost(host.id()).filter {
							it.networkPresent() && it.network().id() in vlanNetList
						}.map { it.id() }


						for (hostNic8 in hostNics) {
							if (hostNic8.bonding() != null && hostNic8.name() == nicUsageApiVo.unBondName && !nicUsageApiVo.checkBonding) {
								if (hostNic8.network() != null) {
									val tempDeleteBonding = NicUsageApiVo()
									tempDeleteBonding.networkName = hostNic8.network().name()
									tempDeleteBonding.networkId = hostNic8.network().id()
									val it8: Iterator<HostNic> = hostNic8.bonding().slaves().iterator()
									while (true) {
										if (!it8.hasNext()) break
										if (it8.next().id() == nicUsageApiVo.id) {
											tempDeleteBonding.hostName = hostNic8.name()
											tempDeleteBonding.hostId = hostNic8.id()
											deleteBondingList.add(tempDeleteBonding)
											break
										}
									}
								} else if (hostNic8.network() == null) {
									val tempDeleteBonding2 = NicUsageApiVo()
									val it9: Iterator<HostNic> = hostNic8.bonding().slaves().iterator()
									while (true) {
										if (!it9.hasNext()) break
										val bonding8 = it9.next()
										if (bonding8.id() == nicUsageApiVo.id) {
											tempDeleteBonding2.hostName = hostNic8.name()
											deleteBondingList.add(tempDeleteBonding2)
											break
										}
									}
								}
							} else if (hostNic8.bonding() == null && !nicUsageApiVo.checkBonding && hostNic8.id() == nicUsageApiVo.id) {
								if (hostNic8.network() == null) {
									modifyNicList.add(nicUsageApiVo)
								} else if (hostNic8.network() != null) {
									for (netAtt in c.findAllNetworkAttachmentsFromHost(host.id())) {
										if (netAtt.networkPresent() &&
											netAtt.network().id() == hostNic8.network().id()) {
											nicUsageApiVo.networkAttachmentId = netAtt.id()
											modifyNicList.add(nicUsageApiVo)
											break
										}
									}
								}
							}
						}
						var idx = 0
						while (true) {
							if (idx >= deleteBondingList.size) {
								break
							} else if (idx >= deleteBondingList.size - 1 || deleteBondingList[idx].hostName != deleteBondingList[idx + 1].hostName || deleteBondingList[idx].networkId != deleteBondingList[idx + 1].networkId) {
								idx++
							} else {
								deleteBondingList.removeAt(idx)
								break
							}
						}
						if (deleteBondingList.size != 0) {
							val it11: Iterator<NicUsageApiVo> = deleteBondingList.iterator()
							while (true) {
								if (!it11.hasNext()) {
									break
								}
								val (_, _, _, _, _, _, _, _, _, _, _, _, _, networkId, _, _, _, hostName) = it11.next()
								val it12: Iterator<NetworkAttachment> =
									c.findAllNetworkAttachmentsFromHost(hostId).iterator()
								while (true) {
									if (!it12.hasNext())
										break

									val networkAttachment9 = it12.next() as NetworkAttachment
									if (networkAttachment9.network().id() == networkId) {
										networkAttachmentId = networkAttachment9.id()
										break
									}
								}
								networkAttachmentId?.let {
									c.removeNetworkAttachmentFromHost(hostId, it)
								}
								for (delVlan in vlanNetAttachList)
									c.removeNetworkAttachmentFromHost(hostId, delVlan)
								c.removeBondsFromHost(hostId, listOf(Builders.hostNic().name(hostName).build()))
							}
						} else if (modifyNicList.isNotEmpty()) {
							val logicalNetwork: MutableList<NetworkBuilder> = arrayListOf()
							val it13: Iterator<NicUsageApiVo> = modifyNicList.iterator()
							while (true) {
								if (!it13.hasNext()) {
									break
								}
								val (id, _, _, _, _, _, _, _, _, _, _, _, _, networkId, _, _, _, _, _, _, _, _, _, vlanNetworkList) = it13.next()
								val it14: Iterator<HostNic> = hostNics.iterator()
								while (true) {
									if (!it14.hasNext()) {
										break
									}
									val hostNic9 = it14.next()
									if (hostNic9.id() == id && hostNic9.network() == null) {
										val networkBuilder9 = NetworkBuilder()
										networkBuilder9.id(networkId)
										logicalNetwork.add(networkBuilder9)
										break
									}
								}
								val vlanNetworkList4: List<NetworkBuilder> =
									if (vlanNetworkList.isNotEmpty())
										vlanNetworkList.filter { it.isNotEmpty() }.map {
											NetworkBuilder().id(it)
										}
									else listOf()

								for (logicalNet in logicalNetwork) {
									c.modifyNetworkAttachmentFromHost(hostId,
										Builders.networkAttachment().network(logicalNet)
											.hostNic(Builders.hostNic().name(nicUsageApiVo.name)).build()
									)
								}
								for (vlanNet3 in vlanNetworkList4) {
									c.modifyNetworkAttachmentFromHost(hostId,
										Builders.networkAttachment().network(vlanNet3)
											.hostNic(Builders.hostNic().name(nicUsageApiVo.name)).build()
									)
								}
								if (networkId.isEmpty()) {
									c.removeNetworkAttachmentFromHost(host.id(), nicUsageApiVo.networkAttachmentId)
									break
								}
							}
						}
						message.text = "호스트 네트워크 편집 완료(${nicUsageApiVo.name})"
						message.style = "success"
					} catch (e11: Exception) {
						e11.printStackTrace()
						log.error(e11.localizedMessage)
						message.text = "호스트 네트워크 편집 실패(${nicUsageApiVo.name})"
						message.style = "error"
					}
				}
			}
			websocketService.notify(message)
		}
	}

	override fun modifyNicNetwork(networkAttachmentVo: NetworkAttachmentVo) {
		val c = adminConnectionService.getConnection()
		val message = MessageVo()
		message.title = "호스트 네트워크 편집"
		message.text = "할당된 네트워크 편집 실패(${networkAttachmentVo.nicNetworkName})"
		message.style = "error"
		val host: Host = c.findHost(networkAttachmentVo.netHostId) ?: run {
			websocketService.notify(message)
			log.error("something went WRONG ... reason: NO host found")
			return
		}
		try {
			if ("none" == networkAttachmentVo.bootProtocol && networkAttachmentVo.dnsServer[0].isEmpty()) {
				val network = NetworkBuilder()
				network.name(networkAttachmentVo.nicNetworkName)
				network.id(networkAttachmentVo.nicNetworkId)
				c.removeNetworkAttachmentFromHost(host.id(), networkAttachmentVo.netAttachmentId)
				c.modifyNetworkAttachmentFromHost(host.id(),
							Builders.networkAttachment()
								.hostNic(Builders.hostNic().name(networkAttachmentVo.hostNicName))
								.network(network)
								.ipAddressAssignments(
									Builders.ipAddressAssignment().assignmentMethod(BootProtocol.NONE)
								).build()
					)
			} else if ("none" == networkAttachmentVo.bootProtocol && networkAttachmentVo.dnsServer.isNotEmpty()) {
				val network = NetworkBuilder()
					.name(networkAttachmentVo.nicNetworkName)
					.id(networkAttachmentVo.nicNetworkId)
				val dnsContainer = DnsResolverConfigurationBuilder()
				for (dnsServer in networkAttachmentVo.dnsServer)
					dnsContainer.nameServers(dnsServer)
				c.removeNetworkAttachmentFromHost(host.id(), networkAttachmentVo.netAttachmentId)

				c.modifyNetworkAttachmentFromHost(host.id(),
					Builders.networkAttachment()
								.hostNic(Builders.hostNic().name(networkAttachmentVo.hostNicName))
								.network(network)
								.ipAddressAssignments(
									Builders.ipAddressAssignment()
										.assignmentMethod(BootProtocol.NONE)
								).dnsResolverConfiguration(dnsContainer)
								.build()
					)
			} else if ("dhcp" == networkAttachmentVo.bootProtocol && networkAttachmentVo.dnsServer[0].isEmpty()) {
				val network = NetworkBuilder()
				network.name(networkAttachmentVo.nicNetworkName)
				network.id(networkAttachmentVo.nicNetworkId)
				c.removeNetworkAttachmentFromHost(host.id(), networkAttachmentVo.netAttachmentId)
				c.modifyNetworkAttachmentFromHost(host.id(),
						Builders.networkAttachment()
							.hostNic(Builders.hostNic().name(networkAttachmentVo.hostNicName))
							.network(network)
							.ipAddressAssignments(
								Builders.ipAddressAssignment()
									.assignmentMethod(BootProtocol.DHCP)
							)
							.build()
				)
			} else if ("dhcp" == networkAttachmentVo.bootProtocol && networkAttachmentVo.dnsServer.isNotEmpty()) {
				val network = NetworkBuilder()
				network.name(networkAttachmentVo.nicNetworkName)
				network.id(networkAttachmentVo.nicNetworkId)
				val dnsContainer = DnsResolverConfigurationBuilder()
				for (dnsServer in networkAttachmentVo.dnsServer)
					dnsContainer.nameServers(dnsServer)
				c.removeNetworkAttachmentFromHost(host.id(), networkAttachmentVo.netAttachmentId)
				c.modifyNetworkAttachmentFromHost(host.id(),
					Builders.networkAttachment()
						.hostNic(Builders.hostNic().name(networkAttachmentVo.hostNicName))
						.network(network)
						.ipAddressAssignments(
							Builders.ipAddressAssignment()
								.assignmentMethod(BootProtocol.DHCP)
						)
						.dnsResolverConfiguration(dnsContainer)
						.build()
				)
			} else if ("static" == networkAttachmentVo.bootProtocol && networkAttachmentVo.dnsServer[0].isEmpty()) {
				val network = NetworkBuilder()
				network.name(networkAttachmentVo.nicNetworkName)
				network.id(networkAttachmentVo.nicNetworkId)
				c.updateNetworkAttachmentFromHost(host.id(), networkAttachmentVo.netAttachmentId,
						Builders.networkAttachment()
							.network(network)
							.hostNic(Builders.hostNic().name(networkAttachmentVo.hostNicName))
							.ipAddressAssignments(
								Builders.ipAddressAssignment()
									.assignmentMethod(BootProtocol.STATIC)
									.ip(
										Builders.ip()
											.address(networkAttachmentVo.nicAddress)
											.netmask(networkAttachmentVo.nicNetmask)
											.gateway(networkAttachmentVo.nicGateway)
									)
							)
							.build()
					)
			} else if ("static" == networkAttachmentVo.bootProtocol && networkAttachmentVo.dnsServer.isNotEmpty()) {
				val dnsContainer = DnsResolverConfigurationBuilder()
				for (dnsServer in networkAttachmentVo.dnsServer)
					dnsContainer.nameServers(dnsServer)

				val network = NetworkBuilder()
				network.name(networkAttachmentVo.nicNetworkName)
				network.id(networkAttachmentVo.nicNetworkId)
				c.updateNetworkAttachmentFromHost(host.id(), networkAttachmentVo.netAttachmentId,
						Builders.networkAttachment()
							.network(network)
							.hostNic(Builders.hostNic().name(networkAttachmentVo.hostNicName))
							.ipAddressAssignments(
								Builders.ipAddressAssignment()
									.assignmentMethod(BootProtocol.STATIC)
									.ip(
										Builders.ip()
											.address(networkAttachmentVo.nicAddress)
											.netmask(networkAttachmentVo.nicNetmask)
											.gateway(networkAttachmentVo.nicGateway)
									)
							).dnsResolverConfiguration(dnsContainer)
							.build()
					)
			}
			try {
				Thread.sleep(2000L)
				message.text = "할당된 네트워크 편집 완료(" + networkAttachmentVo.nicNetworkName + ")"
				message.style = "success"
			} catch (e: InterruptedException) {
				e.printStackTrace()
				log.error(e.localizedMessage)
				message.text = "할당된 네트워크 편집 실패(" + networkAttachmentVo.nicNetworkName + ")"
				message.style = "error"
			}
			websocketService.notify(message)
		} catch (e: Exception) {
			e.printStackTrace()
			log.error(e.localizedMessage)
			message.text = "할당된 네트워크 편집 실패(" + networkAttachmentVo.nicNetworkName + ")"
			message.style = "error"
		}
	}

	override fun retrieveCreateHostInfo(hostId: String): HostCreateVo {
		val connection = adminConnectionService.getConnection()
		val hostCreateVo = HostCreateVo()
		val host: Host = connection.findHost(hostId) ?: run {
			log.error("something went WRONG ... reason: NO host found")
			return hostCreateVo
		}
		hostCreateVo.id = hostId
		hostCreateVo.clusterId = host.cluster().id()
		hostCreateVo.name = host.name()
		hostCreateVo.comment = host.comment()
		hostCreateVo.description = host.description()
		hostCreateVo.status = host.status().value()
		hostCreateVo.powerManagementEnabled = host.powerManagement().enabled()
		if (host.powerManagement().enabled()) {
			val agents = connection.findAllFenceAgentsFromHost(host.id())			
			val fenceAgentVo = FenceAgentVo()
			fenceAgentVo.id = agents[0].id()
			fenceAgentVo.address = agents[0].address()
			fenceAgentVo.username = agents[0].username()
			fenceAgentVo.type = agents[0].type()
			hostCreateVo.fenceAgent = fenceAgentVo
		}
		hostCreateVo.hostEngineEnabled = clustersDao.retrieveHostHaInfo().any { it.hostId == host.id() }
		val sshVo = host.toSshVo()
		hostCreateVo.ssh = sshVo
		return hostCreateVo
	}

	override fun retrieveHostsInfo(status: String): List<HostDetailVo> {
		log.info("... retrieveHostsInfo('$status')")
		val connection = adminConnectionService.getConnection()
		val hosts: List<Host> =
			if ("all".equals(status, ignoreCase = true))
				connection.findAllHosts()
			else if (HostStatus.UP.value().equals(status, ignoreCase = true))
				connection.findAllHosts("status=up")
			else
				connection.findAllHosts("status!=up")
		val hostHaList = clustersDao.retrieveHostHaInfo()
		val hostDetailList: MutableList<HostDetailVo> = arrayListOf()
		for (host in hosts) {
			val hostDetailVo = getHostInfo(connection, host)
			setHosCpuMemory(connection, host, hostDetailVo)
			setClusterInfo(connection, hostDetailVo.clusterId, hostDetailVo)
			hostDetailList.add(hostDetailVo)
			for (ha in hostHaList) {
				if (ha.hostId == host.id()) {
					hostDetailVo.haConfigured = true
					hostDetailVo.haScore = ha.haScore
				}
			}
		}
		return hostDetailList
	}

	private fun setClusterInfo(connection: Connection, clusterId: String, hostDetailVo: HostDetailVo) {
		val cluster: Cluster = connection.findCluster(clusterId) ?: run {
			log.error("something went WRONG ... reason: NO cluster found")
			return
		}
		hostDetailVo.clusterId = cluster.id()
		hostDetailVo.clusterName = cluster.name()
		hostDetailVo.cpuType = cluster.cpu().type()
	}

	private fun setHosCpuMemory(c: Connection, host: Host, hostDetailVo: HostDetailVo) {
		try {
			val stats: List<Statistic> = c.findAllStatisticsFromHost(host.id())
			for (stat in stats) {
				if (stat.name() == "memory.total") hostDetailVo.memoryTotal = stat.values()[0].datum()
				if (stat.name() == "memory.used") hostDetailVo.memoryUsed = stat.values()[0].datum()
				if (stat.name() == "memory.free") hostDetailVo.memoryFree = stat.values()[0].datum()
				if (stat.name() == "swap.total") hostDetailVo.swapTotal = stat.values()[0].datum()
				if (stat.name() == "swap.used") hostDetailVo.swapUsed = stat.values()[0].datum()
				if (stat.name() == "swap.free") hostDetailVo.swapFree = stat.values()[0].datum()
				if (stat.name() == "ksm.cpu.current") hostDetailVo.ksmCpuUsagePercent = stat.values()[0].datum()
				if (stat.name() == "cpu.current.user") hostDetailVo.userCpuUsagePercent = stat.values()[0].datum()
				if (stat.name() == "cpu.current.system") hostDetailVo.systemCpuUsagePercent = stat.values()[0].datum()
				if (stat.name() == "cpu.current.idle") hostDetailVo.idleCpuUsagePercent = stat.values()[0].datum()
				if (stat.name() == "boot.time") hostDetailVo.bootTime = stat.values()[0].datum()
			}
		} catch (e: Exception) {
			log.error(e.localizedMessage)
			e.printStackTrace()
		}
	}

	override fun retrieveLunHostsInfo(status: String): List<HostDetailVo> {
		val c = adminConnectionService.getConnection()
		val hosts: List<Host> = c.findAllHosts()
		val hostDetailList: MutableList<HostDetailVo> = arrayListOf()
		for (host in hosts) {
			if ("up" == host.status().value()) {
				val hostDetailVo = getHostInfo(c, host)
				val luns: List<HostStorage> = c.findAllStoragesFromHost(host.id())
				val lunVos: List<LunVo> = luns.map { lun ->
					val lunVo = LunVo()
					lunVo.id = lun.logicalUnits()[0].id()
					lunVo.path = lun.logicalUnits()[0].paths().toString()
					lunVo.productId = lun.logicalUnits()[0].productId()
					lunVo.serial = lun.logicalUnits()[0].serial()
					lunVo.size = lun.logicalUnits()[0].size().toString()
					lunVo.type = lun.type().value()
					lunVo.vendor = lun.logicalUnits()[0].vendorId()
					lunVo.hostId = host.id()
					if (lun.logicalUnits()[0].diskId() != null) lunVo.diskId = lun.logicalUnits()[0].diskId()
					lunVo
				}
				hostDetailVo.lunVos = lunVos
				hostDetailList.add(hostDetailVo)
			}
		}
		return hostDetailList
	}

	override fun retrieveHostDetail(hostId: String): HostDetailVo {
		val connection = adminConnectionService.getConnection()
		val host: Host = connection.findHost(hostId) ?: run {
			log.error("something went WRONG ... reason: NO host found")
			return HostDetailVo()
		}
		val hostDetailVo = getHostInfo(connection, host)
		setHostDetail(connection, host, hostDetailVo)
		setNetworkAttachment(connection, host, hostDetailVo)
		setVmsInfo(connection, host, hostDetailVo)
		return hostDetailVo
	}

	// TODO: 함수로 뺴내기
	private fun setHostDetail(connection: Connection, host: Host, hostDetailVo: HostDetailVo) {
		log.info("... setHostDetail")
		hostDetailVo.hwManufacturer = host.hardwareInformation().manufacturer()
		hostDetailVo.hwProductName = host.hardwareInformation().productName()
		val nicsUsageApiVo3: MutableList<NicUsageApiVo> = arrayListOf()
		val nicsUsageApiVo: MutableList<NicUsageApiVo> = arrayListOf()
		try {
			val hostNics: List<HostNic> = connection.findAllNicsFromHost(host.id())
			val slaveFlagList = BooleanArray(hostNics.size)
			for (hostNic in hostNics) {
				val nicUsageApiVo = hostNic.toNicUsageApiVo(connection, host.id())
				/*
				nicUsageApiVo.setCheckBonding(false);
				nicUsageApiVo.setHostId(host.id());
				nicUsageApiVo.setId(hostNic.id());
				nicUsageApiVo.setName(hostNic.name());
				nicUsageApiVo.setIpAddress(hostNic.ip().address());
				if (hostNic.baseInterface() == null) {
					nicUsageApiVo.setBase(hostNic.name());
				} else if (hostNic.baseInterface() != null) {
					nicUsageApiVo.setBase(hostNic.baseInterface());
				}
				if (hostNic.baseInterface() != null)
					nicUsageApiVo.setBaseInterface(hostNic.baseInterface());
				if (hostNic.vlan() != null)
					nicUsageApiVo.setVlan(hostNic.vlan().id());
				if (hostNic.status() != null)
					nicUsageApiVo.setStatus(hostNic.status().name());
				if (hostNic.network() != null)
					if (hostNic.vlan() == null) {
						nicUsageApiVo.setNetworkName(hostNic.network().name());
						nicUsageApiVo.setNetworkId(hostNic.network().id());
					} else if (hostNic.vlan() != null) {
						List<String> tempVlanList = new ArrayList<>();
						tempVlanList.add(hostNic.network().id());
						nicUsageApiVo.setVlanNetworkList(tempVlanList);
					}
				if (hostNic.bonding() != null)
					for (Option bondingOption : hostNic.bonding().options()) {
						if (bondingOption.name().equals("mode")) {
							nicUsageApiVo.setBondingMode(bondingOption.value());
							nicUsageApiVo.setBondingModeName(bondingOption.type());
						}
					}
				if (hostNic.mac() != null) {
					nicUsageApiVo.setMacAddress(hostNic.mac().address());
				} else {
					nicUsageApiVo.setMacAddress("");
				}

				List<Statistic> nicStats
						= getSysSrvHelper().findAllStatisticsFromHostNic(connection, host.id(), hostNic.id());
				for (Statistic nicStat : nicStats) {
					if (nicStat.name().equals("data.current.rx"))
						nicUsageApiVo.setDataCurrentRx(((Value)nicStat.values().get(0)).datum());
					if (nicStat.name().equals("data.current.tx"))
						nicUsageApiVo.setDataCurrentTx(((Value)nicStat.values().get(0)).datum());
					if (nicStat.name().equals("data.current.rx.bps"))
						nicUsageApiVo.setDataCurrentRxBps(((Value)nicStat.values().get(0)).datum());
					if (nicStat.name().equals("data.current.tx.bps"))
						nicUsageApiVo.setDataCurrentTxBps(((Value)nicStat.values().get(0)).datum());
					if (nicStat.name().equals("data.total.rx"))
						nicUsageApiVo.setDataTotalRx(((Value)nicStat.values().get(0)).datum());
					if (nicStat.name().equals("data.total.tx"))
						nicUsageApiVo.setDataTotalTx(((Value)nicStat.values().get(0)).datum());
					if (nicStat.name().equals("errors.total.rx"));
					if (nicStat.name().equals("errors.total.tx"));
				}
				*/if (hostNic.bonding() != null) for (bondingSlave in hostNic.bonding().slaves()) {
					val id = bondingSlave.id()
					for (j in hostNics.indices) {
						val slaveHost = hostNics[j]
						if (slaveHost.id() == id) {
							val nicUsageApiVo2 = NicUsageApiVo()
							nicUsageApiVo2.checkBonding = false
							nicUsageApiVo2.hostId = host.id()
							nicUsageApiVo2.id = hostNics[j].id()
							nicUsageApiVo2.name = hostNics[j].name()
							nicUsageApiVo2.ipAddress = hostNics[j].ip().address()
							nicUsageApiVo2.status = hostNics[j].status().name
							if (hostNics[j].baseInterface() == null) {
								nicUsageApiVo2.base = hostNics[j].name()
							} else if (hostNics[j].baseInterface() != null) {
								nicUsageApiVo2.base = hostNics[j].baseInterface()
							}
							if (hostNics[j].baseInterface() != null) nicUsageApiVo2.baseInterface =
								hostNics[j].baseInterface()
							if (hostNics[j].vlan() != null) nicUsageApiVo2.vlan = hostNics[j].vlan().id()
							if (hostNics[j].mac() != null) {
								nicUsageApiVo2.macAddress = hostNics[j].mac().address()
							} else {
								nicUsageApiVo2.macAddress = ""
							}
							if (hostNics[j].network() != null) if (hostNics[j].vlan() == null) {
								nicUsageApiVo2.networkName = hostNic.network().name()
								nicUsageApiVo2.networkId = hostNics[j].network().id()
							} else if (hostNics[j].vlan() != null) {
								val tempVlanList: MutableList<String> = arrayListOf()
								tempVlanList.add(hostNics[j].network().id())
								nicUsageApiVo2.vlanNetworkList = tempVlanList
							}
							val nicStats2: List<Statistic> =
								connection.findAllStatisticsFromHostNic(host.id(), hostNics[j].id())
							for (nicStat in nicStats2) {
								if (nicStat.name() == "data.current.rx") nicUsageApiVo2.dataCurrentRx =
									(nicStat.values()[0] as Value).datum()
								if (nicStat.name() == "data.current.tx") nicUsageApiVo2.dataCurrentTx =
									(nicStat.values()[0] as Value).datum()
								if (nicStat.name() == "data.current.rx.bps") nicUsageApiVo2.dataCurrentRxBps =
									(nicStat.values()[0] as Value).datum()
								if (nicStat.name() == "data.current.tx.bps") nicUsageApiVo2.dataCurrentTxBps =
									(nicStat.values()[0] as Value).datum()
								if (nicStat.name() == "data.total.rx") nicUsageApiVo2.dataTotalRx =
									(nicStat.values()[0] as Value).datum()
								if (nicStat.name() == "data.total.tx") nicUsageApiVo2.dataTotalTx =
									(nicStat.values()[0] as Value).datum()
								if (nicStat.name() == "errors.total.rx");
								if (nicStat.name() == "errors.total.tx");
							}
							nicUsageApiVo.bonding.add(nicUsageApiVo2)
							slaveFlagList[j] = true
						}
					}
				}
				nicsUsageApiVo.add(nicUsageApiVo)
			}
			for (i in hostNics.indices)
				if (!slaveFlagList[i]) nicsUsageApiVo3.add(nicsUsageApiVo[i])
		} catch (e: Exception) {
			log.error(e.localizedMessage)
			e.printStackTrace()
		}
		hostDetailVo.hostNicsUsageApi = nicsUsageApiVo3
		val hostSw = clustersDao.retrieveHostSw(host.id())
		hostDetailVo.hostSw = hostSw
		val cluster: Cluster? = connection.findCluster(host.cluster().id())
		hostDetailVo.clusterName = cluster?.name() ?: ""
		hostDetailVo.cpuType = cluster?.cpu()?.type() ?: ""
	}

	// TODO: ModelKt 로 이동
	private fun setNetworkAttachment(c: Connection, host: Host, hostDetailVo: HostDetailVo) {
		val networkAttachmentListVo: MutableList<NetworkAttachmentVo> = arrayListOf()
		try {
			val networkAttachmentList: List<NetworkAttachment> =
				c.findAllNetworkAttachmentsFromHost(host.id())
			for (networkAttachment in networkAttachmentList) {
				val networkAttachmentVo = NetworkAttachmentVo()
				if (networkAttachment.dnsResolverConfiguration() != null) 
					networkAttachmentVo.dnsServer = networkAttachment.dnsResolverConfiguration().nameServers()
				if (networkAttachment.ipAddressAssignments() != null) {
					networkAttachmentVo.bootProtocol = networkAttachment.ipAddressAssignments()[0].assignmentMethod().value()
					networkAttachmentVo.nicAddress = networkAttachment.ipAddressAssignments()[0].ip().address()
					networkAttachmentVo.nicGateway = networkAttachment.ipAddressAssignments()[0].ip().gateway()
					networkAttachmentVo.nicNetmask = networkAttachment.ipAddressAssignments()[0].ip().netmask()
				}
				networkAttachmentVo.netAttachmentId = networkAttachment.id()
				networkAttachmentVo.netHostId = networkAttachment.host().id()
				networkAttachmentVo.netHostName = host.name()
				networkAttachmentVo.hostNicId = networkAttachment.hostNic().id()
				networkAttachmentVo.hostNicName =
					c.findNicFromHost(host.id(), networkAttachmentVo.hostNicId)?.name() ?: ""
				networkAttachmentVo.nicNetworkId = networkAttachment.network().id()
				networkAttachmentVo.nicNetworkName =
					c.findNetwork(networkAttachmentVo.nicNetworkId)?.name() ?: ""
				networkAttachmentListVo.add(networkAttachmentVo)
			}
		} catch (e: Exception) {
			log.error(e.localizedMessage)
			e.printStackTrace()
		}
		hostDetailVo.netAttachment = networkAttachmentListVo
	}

	// TODO: ModelKt 로 이동
	override fun retrieveHostEvents(hostId: String): List<EventVo> {
		log.info("... retrieveHostEvents('{}')", hostId)
		val c = adminConnectionService.getConnection()
		val host: Host = c.findHost(hostId) ?: run {
			log.error("something went WRONG ... reason: NO host found")
			return listOf()
		}
		val events: List<Event> = c.findAllEvents("host.name=${host.name()}")
		return events.toEventVos()
	}

	private fun setVmsInfo(c: Connection, host: Host, hostDetailVo: HostDetailVo) {
		log.info("... setVmsInfo")
		val vms: List<Vm> = c.findAllVms("host=${host.name()}")
		val vmSummaries: MutableList<VmSummaryVo> = arrayListOf()
		for (vm in vms) {
			val vmSummary = getVmInfo(c, vm)
			vmSummaries.add(vmSummary)
		}
		hostDetailVo.vmSummaries = vmSummaries
	}

	override fun getHostInfo(connection: Connection, host: Host): HostDetailVo {
		val hostDetailVo = host.toHostDetailVo(connection, clustersDao)
		/*
		HostDetailVo hostDetailVo = new HostDetailVo();
		hostDetailVo.setId(host.id());
		hostDetailVo.setName(host.name());
		hostDetailVo.setDescription(host.description());
		hostDetailVo.setComment(host.comment());
		hostDetailVo.setAddress(host.address());
		hostDetailVo.setStatus(host.status().value());
		hostDetailVo.setPowerManagementEnabled(host.powerManagement().enabled());
		hostDetailVo.setCpuName(host.cpu().name());
		hostDetailVo.setCpuCores(host.cpu().topology().cores());
		hostDetailVo.setCpuSockets(host.cpu().topology().sockets());
		hostDetailVo.setCpuThreads(host.cpu().topology().threads());
		if (host.cpu().topology().cores() == null ||
			host.cpu().topology().sockets() == null ||
			host.cpu().topology().threads() == null) {
			hostDetailVo.setCpuTotal(0);
		} else {
			hostDetailVo.setCpuTotal(host.cpu().topology().cores().intValue() * host.cpu().topology().sockets().intValue() * host.cpu().topology().threads().intValue());
		}
		*/
		hostDetailVo.hostLastUsage =
			clustersDao.retrieveHostLastUsage(host.id())
		val hostUsageList = 
			clustersDao.retrieveHostUsage(host.id())
		hostDetailVo.usageVos = 
			hostUsageList.toUsageVosWithHostUsage()
		val hostNics: List<HostNic> = 
			connection.findAllNicsFromHost(host.id())
		val hostNicsLastUsage: MutableList<NicUsageVo> = arrayListOf()
		for (hostNic in hostNics) {
			val nicUsageVo = clustersDao.retrieveHostNicUsage(hostNic.id()) ?: continue
			nicUsageVo.hostInterfaceName = hostNic.name()
			nicUsageVo.macAddress = if (hostNic.macPresent()) hostNic.mac().address() else ""
			hostNicsLastUsage.add(nicUsageVo)
		}
		hostDetailVo.hostNicsLastUsage = hostNicsLastUsage
		setHosCpuMemory(connection, host, hostDetailVo)
		hostDetailVo.clusterId = host.cluster().id()
		setHostVmCnt(connection, host, hostDetailVo)
		setHostDetail(connection, host, hostDetailVo)
		return hostDetailVo
	}

	// TODO: ModelKt 로 이동
	private fun setHostVmCnt(connection: Connection, host: Host, hostDetailVo: HostDetailVo) {
		var cnt = 0
		var upCnt = 0
		var downCnt = 0
		val vms: List<Vm> = connection.findAllVms("host=${host.name()}")
		for (vm in vms) {
			if ("up".equals(vm.status().value(), ignoreCase = true)) {
				upCnt++
			} else if ("down".equals(vm.status().value(), ignoreCase = true)) {
				downCnt++
			}
			cnt++
		}
		hostDetailVo.vmsCnt = cnt
		hostDetailVo.vmsUpCnt = upCnt
		hostDetailVo.vmsDownCnt = downCnt
	}

	override fun getVmInfo(connection: Connection, vm: Vm): VmSummaryVo {
		val vmSummary = VmSummaryVo()
		vmSummary.id = vm.id()
		vmSummary.name = vm.name()
		vmSummary.comment = vm.comment()
		vmSummary.description = vm.description()
		vmSummary.status = vm.status().value()
		if (vm.hostPresent() && vm.host().idPresent() && vm.host().id().isNotEmpty()) {
			val host: Host? = connection.findHost(vm.host().id())
			vmSummary.hostId = host?.id() ?: ""
			vmSummary.hostName = host?.name() ?: ""
		}
		val vmLastUsage = clustersDao.retrieveVmUsage(vm.id())
		vmSummary.vmLastUsage = vmLastUsage
		val vmNics: List<Nic> = connection.findNicsFromVm(vm.id())
		val vmNicsLastUsage: MutableList<NicUsageVo> = arrayListOf()
		for (vmNic in vmNics) {
			var nicUsageVo = clustersDao.retrieveVmNicUsage(vmNic.id())
			if (nicUsageVo == null) {
				nicUsageVo = NicUsageVo()
				nicUsageVo.vmInterfaceName = vmNic.name()
				nicUsageVo.receiveRatePercent = "0"
				nicUsageVo.receivedTotalByte = "0"
				nicUsageVo.transmitRatePercent = "0"
				nicUsageVo.transmittedTotalByte = "0"
			} else {
				nicUsageVo.vmInterfaceName = vmNic.name()
			}
			nicUsageVo.macAddress =
				if (vmNic.macPresent() && vmNic.mac().addressPresent()) vmNic.mac().address() else ""
			if (vmNic.reportedDevicesPresent() && vmNic.reportedDevices()[0].ips() != null && vmNic.reportedDevices()[0].ips().size != 0) {
				val ips = vmNic.reportedDevices()[0].ips()
				vmSummary.address = ips[0].address()
			} else {
				vmSummary.address = ""
			}
			vmNicsLastUsage.add(nicUsageVo)
		}
		vmSummary.vmNicsLastUsage = vmNicsLastUsage
		return vmSummary
	}

	override fun retrieveFanceAgentType(): List<String> {
		val connection = adminConnectionService.getConnection()
		return arrayListOf()
	}

	@Async("karajanTaskExecutor")
	override fun connectTestFenceAgent(fenceAgentVo: FenceAgentVo): Boolean {
		val connection = adminConnectionService.getConnection()
		val hosts: List<Host> = connection.findAllHosts()
		if (hosts.isEmpty()) {
			log.warn("something went WRONG ... reason: NO host found")
			return false
		}
		val agent: Agent = connection.addFenceAgent(hosts.first().id(), fenceAgentVo.toAgent()) ?: run {
			log.warn("something went WRONG ... reason: NO agent found")
			return false
		}
		val status: String? = connection.findPowerManagementFromHost(hosts.first().id(), FenceType.START)?.status()?.value()
		return agent != null
	}

	@Async("karajanTaskExecutor")
	override fun shutdownHost(hosts: List<HostVo>) {
		val connection = adminConnectionService.getConnection()
		val message = MessageVo()
		for (h in hosts) {
			var host: Host = connection.findHost(h.id) ?: continue
			try {
				if (!host.powerManagement().enabled()) {
					Thread.sleep(500L)
					message.text = "전원관리가 활성화 되어 있지 않아 호스트를 정지할 수 없습니다.(" + host.name() + ")"
					message.style = "warning"
					websocketService.notify(message)
					continue
				}
				if (host.status() != HostStatus.MAINTENANCE) connection.deactivateHost(h.id)
				do {
					Thread.sleep(3000L)
					host = connection.findHost(h.id) ?: continue
				} while (host.status() != HostStatus.MAINTENANCE)
				message.text = "호스트 유지보수 모드 완료(${host.name()})"
				message.style = "success"
				websocketService.notify(message)
				websocketService.custom(message, "migrateVm")
			} catch (e: Exception) {
				e.printStackTrace()
				log.error(e.localizedMessage)
				message.text = "호스트 유지보수 모드 실패(${host.name()})"
				message.style = "error"
				websocketService.notify(message)
				try { Thread.sleep(300L) } catch (ie: InterruptedException) { }
				message.text = "호스트 유지보수 모드 전환 실패하여 호스트를 정지할 수 없습니다.(" + host.name() + ")"
				message.style = "warning"
				websocketService.notify(message)
				continue
			}
			try {
				var item: Host? = null
				val res = connection.findPowerManagementFromHost(h.id, FenceType.STOP)
				do {
					Thread.sleep(3000L)
					item = connection.findHost(h.id) ?: continue
				} while (item?.status() != HostStatus.DOWN)
				message.text = "호스트 정지 완료(${host.name()})"
				message.style = "success"
				websocketService.custom(message, "migrateVm")
			} catch (e: Exception) {
				e.printStackTrace()
				log.error(e.localizedMessage)
				message.text = "호스트 정지 실패(${host.name()})"
				message.style = "error"
			}
			websocketService.notify(message)
		}
	}

	override fun retrieveHostsTop(totalHosts: List<HostDetailVo>): List<DashboardTopVo> {
		val data: MutableList<DashboardTopVo> = arrayListOf()
		val hostCpuPraramMap: MutableMap<String, Int> = hashMapOf()
		val hostMemoryPraramMap: MutableMap<String, Int> = hashMapOf()
		var index = 0
		var i: Int
		i = 0
		while (i < totalHosts.size) {
			hostCpuPraramMap[totalHosts[i].name] = totalHosts[i].hostLastUsage!!.cpuUsagePercent.toInt()
			hostMemoryPraramMap[totalHosts[i].name] = totalHosts[i].hostLastUsage!!.memoryUsagePercent.toInt()
			i++
		}
		val hostCpuKeyList: MutableList<String> = arrayListOf()
		val hostCpuValList: MutableList<String> = arrayListOf()
		val hostMemoryKeyList: MutableList<String> = arrayListOf()
		val hostMemoryValList: MutableList<String> = arrayListOf()
		Collections.sort(
			hostCpuKeyList
		) { o1: String, o2: String ->
			hostCpuPraramMap[o2]!!.compareTo(
				hostCpuPraramMap[o1]!!
			)
		}
		Collections.sort(
			hostMemoryKeyList
		) { o1: String, o2: String ->
			hostMemoryPraramMap[o2]!!.compareTo(
				hostMemoryPraramMap[o1]!!
			)
		}
		for (key in hostCpuKeyList) {
			hostCpuValList.add(index, hostCpuPraramMap[key].toString())
			index++
		}
		index = 0
		for (key in hostMemoryKeyList) {
			hostMemoryValList.add(index, hostMemoryPraramMap[key].toString())
			index++
		}
		i = hostCpuKeyList.size
		while (i < 3) {
			hostCpuKeyList.add(index, "N/A")
			hostCpuValList.add(index, "0")
			hostMemoryKeyList.add(index, "N/A")
			hostMemoryValList.add(index, "0")
			i++
		}
		val dashboardTopVo = DashboardTopVo(
			arrayListOf(), arrayListOf(), arrayListOf(), arrayListOf(),
			hostCpuKeyList, hostCpuValList, hostMemoryKeyList, hostMemoryValList
		)
		data.add(dashboardTopVo)
		return data
	}
	
	companion object {
		private val log by LoggerDelegate()
	}
}
