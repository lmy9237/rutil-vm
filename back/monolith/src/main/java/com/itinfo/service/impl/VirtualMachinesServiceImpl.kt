package com.itinfo.service.impl

import com.google.gson.Gson
import com.itinfo.*
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.controller.doLongSleep
import com.itinfo.controller.doSleep

import com.itinfo.dao.ComputingDao
import com.itinfo.model.*
import com.itinfo.model.MessageVo

import com.itinfo.service.VirtualMachinesService
import com.itinfo.service.consolidation.GreedyHost
import com.itinfo.service.engine.AdminConnectionService
import com.itinfo.service.engine.ConnectionService
import com.itinfo.service.engine.KarajanService
import com.itinfo.service.engine.WebsocketService

import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.builders.*
import org.ovirt.engine.sdk4.services.*
import org.ovirt.engine.sdk4.types.*

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Service

import java.math.BigDecimal
import java.math.BigInteger
import java.util.*
import java.util.function.Consumer
import kotlin.math.pow


@Service
class VirtualMachinesServiceImpl : VirtualMachinesService {
	@Autowired private lateinit var connectionService: ConnectionService
	@Autowired private lateinit var adminConnectionService: AdminConnectionService
	@Autowired private lateinit var karajanService: KarajanService
//	@Autowired private lateinit var greedyHost: GreedyHost
	@Autowired private lateinit var computingDao: ComputingDao
//	@Autowired private lateinit var clustersDao: ClustersDao
	@Autowired private lateinit var websocketService: WebsocketService

	@Async("karajanTaskExecutor")
	override fun startVm(vms: List<VmVo>) {
		log.info("... startVm[${vms.size}]")
		val c = adminConnectionService.getConnection()

		for (vm in vms) {
			val vmService: VmService = c.srvVm(vm.id)
			try {
				if (vmService.get().send().vm().initializationPresent())
					vmService.start().useCloudInit(true).send()
				else
					vmService.start().send()
			} catch (e: Exception) {
				val gson = Gson()
				if (e.message?.contains("There are no hosts to use. Check that the cluster contains at least one host in Up state.") == true) {
					val result = VmVo().apply { 
						id = vm.id
						status = "down"
					}
					val message = MessageVo.createMessage(MessageType.VIRTUAL_MACHINE_START, false, vm.name, 
						"이 사용할 호스트가 없습니다. 클러스터에 최소 하나의 Up 상태의 호스트가 있는지 확인하십시오."
					)
					websocketService.custom(result, "vms")
					websocketService.notify(message)
				} else if (e.message?.contains("did not satisfy internal filter Memory because its available memory is too low")  == true) {
					log.error(e.localizedMessage)
					val result = VmVo().apply {
						id = vm.id
						status = "down"
					}
					val message = MessageVo.createMessage(MessageType.VIRTUAL_MACHINE_START, false, vm.name,
						"을 실행 할 수 없습니다. 가상 머신을 실행하기 위한 여유 메모리가 충분하지 않습니다."
					)
					websocketService.custom(result, "vms")
					websocketService.notify(message)
				}
			}
		}

		try {
			for ((id) in vms) {
				var item: Vm?
				do {
					doSleep(5000L)
					item = c.findVm(id)
				} while (item?.status() != VmStatus.UP)
				val result = item.toVmVOBasic()
				val message = MessageVo.createMessage(MessageType.VIRTUAL_MACHINE_START, true, item.name(), "")
				websocketService.custom(result, "vms")
				websocketService.notify(message)
			}
		} catch (e: Exception) {
			log.error(e.localizedMessage)
			e.printStackTrace()
			val gson = Gson()
			val message = MessageVo.createMessage(MessageType.VIRTUAL_MACHINE_START, false, "none", "")
			websocketService.sendMessage("/topic/vms", gson.toJson("{}"))
			websocketService.notify(message)
		}
	}

	@Async("karajanTaskExecutor")
	override fun stopVm(vms: List<VmVo>) {
		log.info("... stopVm[${vms.size}]")
		val c = adminConnectionService.getConnection()
		val gson = Gson()
		try {
			val res = vms.stopAllVms(c)
			for ((id) in vms) {
				var item: Vm?
				do {
					Thread.sleep(2000L)
					item = c.findVm(id)
				} while (item?.status() != VmStatus.DOWN)

				val result = item.toVmVOBasic()
				val message = MessageVo.createMessage(MessageType.VIRTUAL_MACHINE_STOP, true, item.name(), "")
				websocketService.custom(result, "vms")
				websocketService.notify(message)
			}
		} catch (e: Exception) {
			log.error(e.localizedMessage)
			e.printStackTrace()
			val message = MessageVo.createMessage(MessageType.VIRTUAL_MACHINE_STOP, false, "none", e.localizedMessage)
			websocketService.sendMessage("/topic/vms", gson.toJson("{}"))
			websocketService.notify(message)
		}
	}

	@Async("karajanTaskExecutor")
	override fun rebootVm(vms: List<VmVo>) {
		log.info("... rebootVm[${vms.size}]")
		val c = adminConnectionService.getConnection()
		try {
			val res = vms.rebootAllVms(c)
			for ((id) in vms) {
				var item: Vm?
				do {
					doSleep(5000L)
					item = c.findVm(id)
				} while (item?.status() != VmStatus.UP)

				val result = item.toVmVo(c)
				websocketService.custom(result, "vms")
				val message = MessageVo.createMessage(MessageType.VIRTUAL_MACHINE_REBOOT, true, item.name(), "")
				websocketService.notify(message)
			}
		} catch (e: Exception) {
			log.error(e.localizedMessage)
			e.printStackTrace()
		}
	}

	@Async("karajanTaskExecutor")
	override fun suspendVm(vms: List<VmVo>) {
		log.info("... suspendVm[${vms.size}]")
		val c = adminConnectionService.getConnection()
		try {
			for ((id) in vms) c.suspendVm(id)
			for ((id) in vms) {
				var item: Vm?
				do {
					doSleep(5000L)
					item = c.findVm(id)
				} while (item?.status() != VmStatus.SUSPENDED)
				val result = item.toVmVOBasic()
				val message = MessageVo.createMessage(MessageType.VIRTUAL_MACHINE_SUSPEND, true, item.name(), "")
				websocketService.custom(result, "vms")
				websocketService.notify(message)
			}
		} catch (e: Exception) {
			log.error(e.localizedMessage)
			e.printStackTrace()
			val message = MessageVo.createMessage(MessageType.VIRTUAL_MACHINE_SUSPEND, false, "{}", "")
			websocketService.custom("", "vms")
			websocketService.notify(message)
		}
	}

	@Async("karajanTaskExecutor")
	override fun removeVm(vms: List<VmVo>) {
		log.info("... removeVm[${vms.size}]")
		val c = adminConnectionService.getConnection()
		try {
			for (vm in vms) {
				c.removeVm(vm.id, !vm.diskDetach)
				// doSleep(5000L)
				do {
					Thread.sleep(5000L)
				} while (c.findAllVms("id=${vm.id}").isNotEmpty())
				vm.status = "removed"
				val message = MessageVo.createMessage(MessageType.VIRTUAL_MACHINE_REMOVE, true, vm.name, "")
				websocketService.custom(vm, "vms")
				websocketService.notify(message)
			}
		} catch (e: Exception) {
			log.error(e.localizedMessage)
			e.printStackTrace()
			val gson = Gson()
			val message = MessageVo.createMessage(MessageType.VIRTUAL_MACHINE_REMOVE, false, "none", "")
			websocketService.sendMessage("/topic/vms", gson.toJson("{}"))
			websocketService.notify(message)
		}
	}

	override fun retrieveVmsAll(): List<VmVo> {
		log.info("... retrieveVmsAll")
		val c = connectionService.getConnection()
		val systemService = c.systemService()
		val vmList = c.findAllVms()
		val date = Date(System.currentTimeMillis())
		val vms: MutableList<VmVo> = ArrayList()
		try {
			vmList.forEach(Consumer<Vm> { item: Vm ->
				val vmService = systemService.vmsService().vmService(item.id())
				val vm = item.toVmVo(c)
				val nics: List<Nic> = 
					c.findNicsFromVm(item.id())
				val nicIds: List<String> = nics.map { it.id() }
				var ips: String = nics.filter { it.reportedDevicesPresent() }.flatMap { 
					it.reportedDevices()
				}.filter { it.ipsPresent() }.flatMap { it.ips() }.joinToString { it.address() + " /" }
				
				vm.ipAddress = ips
				vm.status = item.status().value()
				vm.nextRunConfigurationExists = item.nextRunConfigurationExists()
				
				if (item.display() == null) {
					vm.headlessMode = true
					vm.graphicProtocol = "없음"
				} else {
					vm.headlessMode = false
					vm.graphicProtocol = item.display().type().toString()
				}
				
				if ("up" == item.status().value() && item.startTimePresent()) {
					vm.startTime = "${(date.time - item.startTime().time) / 60000L}"
				} else if ("up" == item.status().value() && item.creationTimePresent()) {
					vm.startTime = "${(date.time - item.creationTime().time) / 60000L}"
				}
				if (item.host() != null) {
					val h: Host? = c.findHost(item.host().id())
					vm.hostId = item.host().id()
					vm.hostName = if ((h != null && h.namePresent())) h.name() else ""
				}
				vm.clusterId = item.cluster().id()
				val usage = computingDao.retrieveVmUsageOne(item.id())
				val cpuUsage: MutableList<List<String>> =
					ArrayList()
				val memoryUsage: MutableList<List<String>> =
					ArrayList()
				val cpu: MutableList<String> = ArrayList()
				val memory: MutableList<String> = ArrayList()
				if (usage != null) {
					cpu.add(usage.historyDatetime)
					cpu.add(usage.cpuUsagePercent.toString())
					memory.add(usage.historyDatetime)
					memory.add(usage.memoryUsagePercent.toString())
				} else {
					cpu.add("0")
					cpu.add("0")
					memory.add("0")
					memory.add("0")
				}
				cpuUsage.add(cpu)
				memoryUsage.add(memory)
				vm.cpuUsage = cpuUsage
				vm.memoryUsage = memoryUsage
				val networkUsages: MutableList<List<String>> =
					ArrayList()
				val network: MutableList<String> = ArrayList()
				if (nicIds.isNotEmpty()) {
					val networkUsage =
						computingDao.retrieveVmNetworkUsageOne(nicIds)
					if (networkUsage != null) {
						if (networkUsage.transmitRatePercent < networkUsage.receiveRatePercent) {
							network.add(networkUsage.historyDatetime)
							network.add(networkUsage.receiveRatePercent.toString())
						} else {
							network.add(networkUsage.historyDatetime)
							network.add(networkUsage.transmitRatePercent.toString())
						}
					} else {
						network.add("0")
						network.add("0")
					}
					networkUsages.add(network)
					vm.networkUsage = networkUsages
				} else {
					network.add("0")
					network.add("0")
					networkUsages.add(network)
					vm.networkUsage = networkUsages
				}
				vm.diskSize = vmService.diskAttachmentsService().list().send().attachments().size
				val vmCdromService = vmService.cdromsService()
					.cdromService(
						vmService.cdromsService().list().send().cdroms()[0].id()
					)
				if (vmCdromService.get().current(true).send().cdrom().filePresent()) vm.disc =
					vmCdromService.get().current(true).send().cdrom().file().id()
				val vmSystem = VmSystemVo()
				vmSystem.definedMemory =
					"${item.memoryAsLong() / 1024L / 1024L} MB"
				vmSystem.guaranteedMemory =
					"${item.memoryPolicy().guaranteedAsLong() / 1024L / 1024L} MB"
				vmSystem.maxMemoryPolicy =
					"${item.memoryPolicy().maxAsLong() / 1024L / 1024L} MB"
				vmSystem.virtualSockets = item.cpu().topology().socketsAsInteger()
				vmSystem.coresPerVirtualSocket = item.cpu().topology().coresAsInteger()
				vmSystem.threadsPerCore = item.cpu().topology().threadsAsInteger()
				vmSystem.totalVirtualCpus =
					vmSystem.virtualSockets * vmSystem.coresPerVirtualSocket * vmSystem.threadsPerCore
				vm.vmSystem = vmSystem
				vms.add(vm)
			})
		} catch (e: Exception) {
			log.error(e.localizedMessage)
			e.printStackTrace()
		}
		return vms
	}

	override fun retrieveVmsHosts(): List<HostVo> {
		log.info("... retrieveVmsHosts")
		val c = connectionService.getConnection()
		val hostItems: List<Host> =
			c.findAllHosts()
		val hosts = hostItems.toHostVos(c)
		return hosts
	}

	override fun retrieveVmsClusters(): List<ClusterVo> {
		log.info("... retrieveVmsClusters")
		val c = connectionService.getConnection()
		val clusterItems
				: List<Cluster> = c.findAllClusters()
		val clusters = clusterItems.toClusterVos(c, null)
		return clusters
	}

	override fun retrieveVms(status: String): List<VmVo> {
		log.info("... retrieveVms('$status')")
		val c = connectionService.getConnection()
		val systemService = c.systemService()
		val vmsService = systemService.vmsService()
		val vmList: List<Vm> =
			c.findAllVms()
		val date = Date()
		val vms: MutableList<VmVo> = ArrayList()
		try {
			vmList.forEach(Consumer<Vm> { item: Vm ->
				if (status.equals(VmStatus.UP.value(), ignoreCase = true)) {
					if (item.status() == VmStatus.UP) {
						val vmService = systemService.vmsService().vmService(item.id())
						val vm = VmVo()
						vm.id = item.id()
						vm.name = item.name()
						vm.comment = item.comment()
						vm.use = item.description()
						val nics: List<Nic> =
							c.findNicsFromVm(item.id())

						var ips = ""
						val nicIds: MutableList<String> = ArrayList()
						for (nic in nics) {
							nicIds.add(nic.id())
							if (nic.reportedDevicesPresent()) for (device in nic.reportedDevices()) {
								if (device.ipsPresent()) for (ip in device.ips()) ips = ips + ip.address() + " "
							}
						}
						vm.ipAddress = ips
						vm.status = item.status().value()
						vm.nextRunConfigurationExists = item.nextRunConfigurationExists()
						vm.headlessMode = item.display() == null
						vm.graphicProtocol = if (item.display() == null) "없음" else item.display().type().toString()

						if (item.status().value() == "up" && item.startTimePresent()) {
							vm.startTime = "${(date.time - item.startTime().time) / 60000L}"
						} else if (item.status().value() == "up" && item.creationTimePresent()) {
							vm.startTime = "${(date.time - item.creationTime().time) / 60000L}"
						}
						if (item.host() != null) vm.hostId = item.host().id()
						vm.clusterId = item.cluster().id()
						val usage = computingDao.retrieveVmUsageOne(item.id())
						val cpuUsage: MutableList<List<String>> =
							ArrayList()
						val memoryUsage: MutableList<List<String>> =
							ArrayList()
						val cpu: MutableList<String> = ArrayList()
						val memory: MutableList<String> = ArrayList()
						if (usage != null) {
							cpu.add(usage.historyDatetime)
							cpu.add(usage.cpuUsagePercent.toString())
							memory.add(usage.historyDatetime)
							memory.add(usage.memoryUsagePercent.toString())
						} else {
							cpu.add("0")
							cpu.add("0")
							memory.add("0")
							memory.add("0")
						}
						cpuUsage.add(cpu)
						memoryUsage.add(memory)
						vm.cpuUsage = cpuUsage
						vm.memoryUsage = memoryUsage
						val networkUsages: MutableList<List<String>> =
							ArrayList()
						val network: MutableList<String> =
							ArrayList()
						if (nicIds.size > 0) {
							val networkUsage =
								computingDao.retrieveVmNetworkUsageOne(nicIds)
							if (networkUsage != null) {
								network.add(networkUsage.historyDatetime)
								network.add(networkUsage.transmitRatePercent.toString())
							} else {
								network.add("0")
								network.add("0")
							}
							networkUsages.add(network)
							vm.networkUsage = networkUsages
						} else {
							network.add("0")
							network.add("0")
							networkUsages.add(network)
							vm.networkUsage = networkUsages
						}
						vm.diskSize =
							c.findAllDiskAttachmentsFromVm(item.id()).size
						val vmCdromService =
							vmService.cdromsService()
								.cdromService(vmService.cdromsService().list().send().cdroms()[0].id())
						if (vmCdromService.get().current(true).send().cdrom().filePresent()) vm.disc =
							vmCdromService.get().current(true).send().cdrom().file().id()
						vms.add(vm)
					}
				} else if (item.status() != VmStatus.UP) {
					val vm = VmVo()
					vm.id = item.id()
					vm.name = item.name()
					vm.comment = item.comment()
					vm.use = item.description()
					val nics: List<Nic>
						= c.findNicsFromVm(item.id())
					var ips = ""
					val nicIds: MutableList<String> = ArrayList()
					for (nic in nics) {
						nicIds.add(nic.id())
						if (nic.reportedDevicesPresent()) for (device in nic.reportedDevices()) {
							if (device.ipsPresent()) for (ip in device.ips()) ips = ips + ip.address() + " "
						}
					}
					vm.ipAddress = ips
					vm.status = item.status().value()
					vm.nextRunConfigurationExists = item.nextRunConfigurationExists()
					if (item.display() == null) {
						vm.graphicProtocol = "없음"
					} else {
						vm.graphicProtocol = item.display().type().toString()
					}
					if (item.status().value() == "up") vm.startTime =
						((date.time - item.startTime().time) / 60000L).toString()
					if (item.host() != null) vm.hostId = item.host().id()
					vm.clusterId = item.cluster().id()
					val usage = computingDao.retrieveVmUsageOne(item.id())
					val cpuUsage: MutableList<List<String>> =
						ArrayList()
					val memoryUsage: MutableList<List<String>> =
						ArrayList()
					val cpu: MutableList<String> = ArrayList()
					val memory: MutableList<String> = ArrayList()
					if (usage != null) {
						cpu.add(usage.historyDatetime)
						cpu.add(usage.cpuUsagePercent.toString())
						memory.add(usage.historyDatetime)
						memory.add(usage.memoryUsagePercent.toString())
					} else {
						cpu.add("0")
						cpu.add("0")
						memory.add("0")
						memory.add("0")
					}
					cpuUsage.add(cpu)
					memoryUsage.add(memory)
					vm.cpuUsage = cpuUsage
					vm.memoryUsage = memoryUsage
					val networkUsages: MutableList<List<String>> =
						ArrayList()
					val network: MutableList<String> = ArrayList()
					if (nicIds.size > 0) {
						val networkUsage =
							computingDao.retrieveVmNetworkUsageOne(nicIds)
						if (networkUsage != null) {
							network.add(networkUsage.historyDatetime)
							network.add(networkUsage.transmitRatePercent.toString())
						} else {
							network.add("0")
							network.add("0")
						}
						networkUsages.add(network)
						vm.networkUsage = networkUsages
					} else {
						network.add("0")
						network.add("0")
						networkUsages.add(network)
						vm.networkUsage = networkUsages
					}
					vm.diskSize =
						vmsService.vmService(item.id()).diskAttachmentsService().list().send().attachments().size
					vms.add(vm)
				}
			})
		} catch (e: Exception) {
			log.error(e.localizedMessage)
			e.printStackTrace()
		}
		return vms
	}

	override fun retrieveVm(id: String): VmVo {
		log.info("... retrieveVm('{}')", id)
		val c = connectionService.getConnection()
		val systemService = c.systemService()
		val item: Vm = c.findVm(id)!! // TODO 
		val vm = VmVo()
		try {
			vm.id = id
			vm.name = item.name()
			vm.description = item.description()
			vm.comment = item.comment()
			vm.status = item.status().value()
			if (item.placementPolicyPresent() && item.placementPolicy().hostsPresent()) 
				vm.runHost = c.findHost(item.placementPolicy().hosts()[0].id())?.name() ?: ""
			val nics: List<Nic> =
				c.findNicsFromVm(item.id())
			var ips = ""
			val nicIds: MutableList<String> = ArrayList()
			for (nic in nics) {
				nicIds.add(nic.id())
				if (nic.reportedDevicesPresent()) for (device in nic.reportedDevices()) {
					if (device.ipsPresent()) for (ip in device.ips()) ips = ips + ip.address() + " "
				}
			}
			vm.ipAddress = ips

			val date = Date()
			if (item.status().value() == "up" && item.startTimePresent()) {
				vm.startTime = "" + ((date.time - item.startTime().time) / 60000L)
			} else if (item.status().value() == "up" && item.creationTimePresent()) {
				vm.startTime = "" + ((date.time - item.creationTime().time) / 60000L)
			}
			val usageList = computingDao.retrieveVmUsage(item.id())
			val usageVos = usageList.toUsageVos(c)

			val networkUsage: List<Int> = arrayListOf()
			var networkType: String? = null
			if (nicIds.size > 0) {
				val networkUsageList = computingDao.retrieveVmNetworkUsage(nicIds)
				if (networkUsageList.isNotEmpty()) {
					if (networkUsageList[0].receiveRatePercent > networkUsageList[0].transmitRatePercent) networkType =
						if ((networkUsageList[0].receiveRatePercent > networkUsageList[0].transmitRatePercent)
						) "Receive"
						else "Transmit"
				} else {
					networkType = "undefined"
				}

				if ("Receive" == networkType) {
					for (i in networkUsageList.indices) usageVos[i].networkUsages =
						networkUsageList[i].receiveRatePercent
				} else {
					for (i in networkUsageList.indices) usageVos[i].networkUsages =
						networkUsageList[i].transmitRatePercent
				}
			}
			vm.usageVos = usageVos
			vm.vmSystem = retrieveVmSystem(id)
			val osInfoList = systemService.operatingSystemsService().list().send().operatingSystem()
			for (osInfo in osInfoList) {
				if (osInfo.name() == item.os().type()) vm.os = osInfo.description()
			}
			vm.vmNics = retrieveVmNics(id, vm)
			vm.events = retrieveVmEvents(id)
		} catch (e: Exception) {
			log.error(e.localizedMessage)
			e.printStackTrace()
		}
		return vm
	}

	override fun retrieveVmSystem(id: String): VmSystemVo {
		log.info("... retrieveVmSystem('$id')")
		val c = connectionService.getConnection()
		val vm: Vm? = c.findVm(id)
		val vmSystem: VmSystemVo? = vm?.toVmSystemVo()
		return vmSystem!! // TODO
	}

	override fun retrieveVmNics(id: String): List<VmNicVo> {
		log.info("... retrieveVmNics('$id')")
		val c = connectionService.getConnection()
		val nicItems: List<Nic> =
			c.findNicsFromVm(id)
		val nics = nicItems.toVmNicVos(c)
		return nics
	}

	override fun retrieveVmNics(id: String, vm: VmVo): List<VmNicVo> {
		log.info("... retrieveVmNics('$id')")
		val c = connectionService.getConnection()
		val systemService = c.systemService()
		val nicItems: List<Nic> =
			c.findNicsFromVm(id)
		val nics: MutableList<VmNicVo> = ArrayList()
		if (nicItems.size > 0) {
			for (nicItem in nicItems) {
				val nic = VmNicVo()
				nic.id = id
				nic.nicName = nicItem.name()
				nic.nicId = nicItem.id()
				val profiles =
					c.findAllVnicProfiles().toVmNicVos()
				nic.profileList = profiles
				vm.profileList = profiles
				nic.interfaceType = nicItem.interface_().value()

				if (nicItem.reportedDevicesPresent()) {
					val ips = nicItem.reportedDevices()[0].ips()
					if (ips.size > 0) nic.ipv4 = ips[0].address()
					if (ips.size > 1) nic.ipv6 = ips[1].address()
				} else {
					nic.ipv4 = "해당 없음"
					nic.ipv6 = "해당 없음"
				}
				if (nicItem.vnicProfile() != null) {
					c.findVnicProfile(nicItem.vnicProfile().id())?.also { vnicProfile ->
						val network: Network? =
							c.findNetwork(vnicProfile.network().id())
						nic.networkName = network?.name() ?: "" // TODO
						nic.profileName = vnicProfile.name()
						nic.profileId = vnicProfile.id()
					}
				}
				nic.macAddress = nicItem.mac().address()
				nic.status = nicItem.linked()
				nic.linked = nicItem.linked()
				nic.plugged = nicItem.plugged()
				nics.add(nic)
			}
		} else {
			vm.profileList = c.findAllVnicProfiles().toVmNicVos()
		}
		return nics
	}

	override fun createVmNic(vmNicVo: VmNicVo) {
		log.info("... createVmNic")
		val c = connectionService.getConnection()
		var message: MessageVo
		try {

			val systemService = c.systemService()
			if (vmNicVo.profileId != "none")
			{
				c.addNicFromVm(vmNicVo.id, Builders.nic().name(vmNicVo.nicName)
					.vnicProfile(Builders.vnicProfile().id(vmNicVo.profileId)).build())
			} else {
				c.addNicFromVm(vmNicVo.id, Builders.nic().name(vmNicVo.nicName).build())
			}
			// doSleep(2000L)
			try {
				Thread.sleep(2000L)
			} catch (e: InterruptedException) {
				message = MessageVo(
					"네트워크 인터페이스 생성",
					"네트워크 인터페이스 생성 실패(" + vmNicVo.nicName + ")",
					"error"
				)
			}
			message = MessageVo(
				"네트워크 인터페이스 생성",
				"네트워크 인터페이스 생성 성공(" + vmNicVo.nicName + ")",
				"success"
			)
		} catch (e: Exception) {
			log.error(e.localizedMessage)
			e.printStackTrace()
			message = MessageVo(
				"네트워크 인터페이스 생성",
				"네트워크 인터페이스 생성 실패(" + vmNicVo.nicName + ")",
				"error"
			)
		}
		websocketService.notify(message)
	}

	override fun updateVmNic(vmNicVo: VmNicVo) {
		log.info("... updateVmNic")
		val c = connectionService.getConnection()
		val systemService = c.systemService()
		val vmNicService = systemService.vmsService().vmService(vmNicVo.id).nicsService().nicService(vmNicVo.nicId)

		val srcVmNicVo: VmNicVo? =
			setUpdateNicInfo(c, vmNicVo.id, vmNicVo.nicId, vmNicVo.profileId)
		val nic: Nic? =
			c.findNicFromVm(vmNicVo.id, vmNicVo.nicId)
		val srcVnicProfileVo =
			if ((nic?.vnicProfile() != null))
				setUpdateNicProfileInfo(c, vmNicVo.id, vmNicVo.nicId)
			else
				null
		val vmNics: List<Nic> =
			c.findNicsFromVm(vmNicVo.id)

		var message: MessageVo
		for (vmNic in vmNics) {
			if (vmNic.id() == vmNicVo.nicId) {
				val nicBuilder = NicBuilder()
				if (vmNicVo.nicName.isNotEmpty() && srcVmNicVo?.nicName != vmNicVo.nicName)
					nicBuilder.name(vmNicVo.nicName)
				if (vmNicVo.macAddress.isNotEmpty() && srcVmNicVo?.macAddress != vmNicVo.macAddress) {
					val macBuilder = MacBuilder()
					macBuilder.address(vmNicVo.macAddress)
					nicBuilder.mac(macBuilder)
				}

				if (srcVmNicVo?.linked != vmNicVo.linked) nicBuilder.linked(vmNicVo.linked)
				if (srcVmNicVo?.plugged != vmNicVo.plugged) nicBuilder.plugged(vmNicVo.plugged)
				if (nic?.vnicProfile() != null) {
					if (vmNicVo.profileId.isNotEmpty() && srcVnicProfileVo != null && srcVnicProfileVo.id != vmNicVo.profileId) {
						val vnicProfileBuilder = VnicProfileBuilder()
						vnicProfileBuilder.id(vmNicVo.profileId)
						nicBuilder.vnicProfile(vnicProfileBuilder)
					}
				} else {
					val vnicProfileBuilder = VnicProfileBuilder()
					vnicProfileBuilder.id(vmNicVo.profileId)
					nicBuilder.vnicProfile(vnicProfileBuilder)
				}
				if ("" != vmNicVo.ipv4 && "" != vmNicVo.ipv6 &&
					"해당 없음" != vmNicVo.ipv4 &&
					"해당 없음" != vmNicVo.ipv6 && vmNic.reportedDevices().size >= 1
				) if (vmNicVo.macAddress.isNotEmpty() && srcVmNicVo?.macAddress != vmNicVo.macAddress) {
					val reportedDeviceBuilder = ReportedDeviceBuilder()
					reportedDeviceBuilder.ips(vmNic.reportedDevices()[0].ips())
					reportedDeviceBuilder.id(vmNic.reportedDevices()[0].id())
					val macBuilder = MacBuilder()
					macBuilder.address(vmNicVo.macAddress)
					reportedDeviceBuilder.mac(macBuilder)
					reportedDeviceBuilder.type(vmNic.reportedDevices()[0].type())
					reportedDeviceBuilder.description(vmNic.reportedDevices()[0].description())
					reportedDeviceBuilder.name(vmNic.reportedDevices()[0].name())
					nicBuilder.reportedDevices(reportedDeviceBuilder)
				} else {
					nicBuilder.reportedDevices(vmNic.reportedDevices())
				}
				val vmBuilder = VmBuilder()
				vmBuilder.id(vmNicVo.id)
				nicBuilder.vm(vmBuilder)
				nicBuilder.interface_(vmNic.interface_())
				try {
					c.updateNicFromVm(vmNicVo.id, vmNicVo.nicId, nicBuilder.build())
					doSleep(2000L)
					message = MessageVo(
						"네트워크 인터페이스 편집",
						"네트워크 인터페이스 편집 완료" + vmNicVo.nicName + ")",
						"success"
					)
				} catch (e: Exception) {
					log.error(e.localizedMessage)
					e.printStackTrace()
					message = MessageVo(
						"네트워크 인터페이스 편집",
						"네트워크 인터페이스 편집 실패" + vmNicVo.nicName + ")",
						"error"
					)
				}
				websocketService.notify(message)
			}
		}
	}

	override fun removeVmNic(vmNicVo: VmNicVo) {
		log.info("... removeVmNic")
		var message: MessageVo
		try {
			val connection = connectionService.getConnection()
			val systemService = connection.systemService()
			val vmService =
				systemService.vmsService().vmService(vmNicVo.id)
			vmService.nicsService().nicService(vmNicVo.nicId).remove().send()
			try {
				Thread.sleep(2000L)
			} catch (e: InterruptedException) {
				message = MessageVo(
					"네트워크 인터페이스 삭제",
					"네트워크 인터페이스 삭제 실패(" + vmNicVo.nicName + ")",
					"error"
				)
			}
			message = MessageVo(
				"네트워크 인터페이스 삭제",
				"네트워크 인터페이스 삭제 완료(" + vmNicVo.nicName + ")",
				"success"
			)
		} catch (e: Exception) {
			message = MessageVo(
				"네트워크 인터페이스 삭제",
				"네트워크 인터페이스 삭제 실패(" + vmNicVo.nicName + ")",
				"error"
			)
		}
		websocketService.notify(message)
	}

	private fun setUpdateNicProfileInfo(c: Connection, vmId: String, nicId: String): VnicProfileVo? {
		log.info("... setUpdateNicProfileInfo")
		val nic: Nic? =
			c.findNicFromVm(vmId, nicId)
		if (nic == null) {
			log.error("something went WRONG! ... reason: no NIC found")
			return null
		}
		val vnicProfile: VnicProfile? =
			c.findVnicProfile(nic.vnicProfile().id())
		val vnicProfileVo = vnicProfile?.toVnicProfileVo()
		return vnicProfileVo
	}

	private fun setUpdateNicInfo(c: Connection, vmId: String, nicId: String, profileId: String): VmNicVo? {
		log.info("... setUpdateNicInfo")
		val nic: Nic? =
			c.findNicFromVm(vmId, nicId)
		if (nic == null) {
			log.error("something went WRONG! ... reason: no NIC found")
			return null
		}
		val vmNicVo = nic.toVmNicVo(vmId, nicId, profileId)
		return vmNicVo
	}

	override fun retrieveDisks(id: String): List<DiskVo> {
		log.info("... retrieveDisks('{}')", id)
		val connection = connectionService.getConnection()
		val systemService = connection.systemService()
		val vmService = systemService.vmsService().vmService(id)
		val diskAttachments = vmService.diskAttachmentsService().list().send().attachments()
		val disks: MutableList<DiskVo> = ArrayList()
		diskAttachments.forEach(Consumer<DiskAttachment> { diskAttachment: DiskAttachment ->
			val item =
				systemService.disksService().diskService(diskAttachment.disk().id()).get().send().disk()
			val disk = DiskVo()
			disk.id = item.id()
			disk.name = item.name()
			disk.attachedTo = vmService.get().send().vm().name()
			disk.diskInterface = diskAttachment.interface_().name
			disk.alignment = "Unknown"
			disk.type = item.storageType().name
			disk.description = item.description()
			disk.virtualSize =
				if (item.provisionedSize() != null)
					"${item.provisionedSize().toDouble() / 1024.0.pow(3.0)} GiB"
				else
					"${item.lunStorage().logicalUnits()[0].size().toDouble() / 1024.0.pow(3.0)} GiB"

			if (item.format() != null) disk.format = item.format().value()
			if (item.storageDomains().size > 0) disk.storageDomainId = item.storageDomains()[0].id()
			disk.status = if (item.statusPresent()) item.status().value() else "ok"
			disks.add(disk)
		})
		return disks
	}


	override fun retrieveVmRole(id: String): List<Map<String, Any>> {
		log.info("... retrieveVmRole('{}')", id)
		val c = connectionService.getConnection()

		val list: MutableList<Map<String, Any>> = ArrayList()
		c.findAllAssignedPermissionsFromVm(id).forEach { permission ->
			val map: MutableMap<String, Any> =
				HashMap()
			val rFound: Role = c.findRole(permission.role().id())
			val rName = if (rFound.namePresent()) rFound.name() else ""
			val rHref = if (rFound.hrefPresent()) rFound.href() else ""
			log.info("role name: {}", rName)
			map["역할"] = rName
			log.info("role href: {}", rHref)
			if (permission.userPresent()) {
				val userFound: User =
					c.findUser(permission.user().id())
				val uName = if ((userFound.namePresent())) userFound.name() else ""
				log.info("user name: {}", uName)
				map["사용자"] = uName
			}
			list.add(map)
		}
		return list
	}


	override fun retrieveVmDevices(id: String): List<VmDeviceVo> {
		log.info("... retrieveVmDevices('{}')", id)
		return computingDao.retrieveVmDevices(id)
	}

	override fun retrieveVmEvents(id: String): List<EventVo> {
		log.info("... retrieveVmEvents('$id')")
		val c = connectionService.getConnection()
		val items: List<Event> = 
			c.findAllEvents("severity!=normal")
		val events = items.toEventVos4Vm(id)
		return events
	}

	override fun recommendHosts(vmCreate: VmCreateVo): List<Array<String>> {
		log.info("... recommendHosts")
		val vm = vmCreate.toVmVoKarajan()
		val greedyHost = GreedyHost()
		val recommendHosts = greedyHost.recommendHosts(vmCreate.cluster, karajanService!!.getDataCenter(), vm)
		return recommendHosts
	}

	override fun retrieveDisks(): List<DiskVo> {
		log.info("... recommendHosts")
		val c = connectionService.getConnection()
		val vms: List<Vm> = 
			c.findAllVms()
		val disks: MutableList<DiskVo> = ArrayList()
		val ids: MutableList<String> = ArrayList()
		for (vm in vms) {
			val diskAttachments: List<DiskAttachment> = c.findAllDiskAttachmentsFromVm(vm.id())
			for (diskAttachment in diskAttachments) ids.add(diskAttachment.id())
		}

		val diskList
				: List<Disk> = c.findAllDisks()
		disks.addAll(diskList.toDiskVos(c, ids))
		return disks
	}

	override fun retrieveVmCreateInfo(): VmCreateVo {
		log.info("... retrieveVmCreateInfo")
		val connection = connectionService.getConnection()
		val systemService = connection.systemService()
		val clusterItemList = systemService.clustersService().list().send().clusters()
		val clusters = clusterItemList.toClusterVos4VmCreate(connection)

		val vmCreate = VmCreateVo()
		vmCreate.clusters = clusters

		val templates: MutableList<TemplateVo> = ArrayList()
		for (item in systemService.templatesService().list().send().templates()) {
			val template = TemplateVo()
			template.id = item.id()
			template.name = item.name()
			template.diskAttachmentSize =
				systemService.templatesService().templateService(item.id()).diskAttachmentsService().list().send()
					.attachments().size
			val version = if ((item.version().versionName() != null)
			) (item.version().versionName() + "(" + item.version().versionNumber() + ")")
			else ("(" + item.version().versionNumber() + ")")
			template.version = version
			val nics = systemService.templatesService().templateService(item.id()).nicsService().list().send().nics()
			val vmNics: MutableList<VmNicVo> = ArrayList()
			if (nics.size > 0) for (nic in nics) {
				val vmNic = VmNicVo()
				if (nic.vnicProfile() != null) vmNic.id = nic.vnicProfile().id()
				vmNic.nicName = nic.name()
				vmNics.add(vmNic)
			}
			template.nics = vmNics
			templates.add(template)
		}
		vmCreate.templates = templates
		val osItemList = systemService.operatingSystemsService().list().send().operatingSystem()
		val osInfoList = osItemList.toOsInfoVos()
		vmCreate.operatingSystems = osInfoList

		val instanceTypeList = systemService.instanceTypesService().list().send().instanceType()
		val instanceTypes = instanceTypeList.toInstanceTypeVos(connection)
		vmCreate.instanceTypes = instanceTypes

		val nicItemList = systemService.vnicProfilesService().list().send().profiles()
		val vnicList = nicItemList.toVmNicVos()
		vmCreate.nics = vnicList

		val hostList = systemService.hostsService().list().send().hosts()
		val hosts = hostList.toHostVos(connection)
		vmCreate.hosts = hosts
		vmCreate.affinity = "migratable"

		val storageDomainList = systemService.storageDomainsService().list().send().storageDomains()

		val storageDomains: MutableList<StorageDomainVo> = ArrayList()
		val bootImages: MutableList<StorageDomainVo> = ArrayList()
		for (item in storageDomainList) {
			if ("data" == item.type().value() && item.storage().type() == StorageType.NFS) {
				val storageDomain = StorageDomainVo()
				storageDomain.id = item.id()
				storageDomain.name = item.name()
				storageDomain.type = item.type().value()
				storageDomains.add(storageDomain)
				continue
			}

			if ("iso" == item.type().value()) {
				val storageDomainService = systemService.storageDomainsService().storageDomainService(item.id())
				vmCreate.imageStorage = item.id()
				for (file in storageDomainService.filesService().list().send().file()) {
					val storageDomain = StorageDomainVo()
					storageDomain.id = file.id()
					storageDomain.name = file.name()
					storageDomain.type = file.type()
					bootImages.add(storageDomain)
				}
			}
		}
		vmCreate.leaseStorageDomains = storageDomains
		vmCreate.bootImages = bootImages
		val isoDisks = systemService.disksService().list().search(" disk_content_type = iso").send().disks()
		bootImages.addAll(isoDisks.toStorageDomainVosUsingDisks())

		val cpuProfileList = systemService.cpuProfilesService().list().send().profile()
		val cpuProfiles = cpuProfileList.toCpuProfileVos()
		vmCreate.cpuProfiles = cpuProfiles
		return vmCreate
	}

	override fun retrieveVmUpdateInfo(vmId: String): VmCreateVo? {
		log.info("... retrieveVmUpdateInfo('$vmId')")
		val c = connectionService.getConnection()
		val systemService = c.systemService()
		val vm: Vm? = c.findVm(vmId)
		if (vm == null) {
			log.error("something went WRONG! ... reason: vm NOT found")
			return null
		}

		val vmInfo = retrieveVmCreateInfo()
		vmInfo.id = vmId
		vmInfo.status = vm.status().value()
		vmInfo.headlessMode = vm.display() == null
		vmInfo.cluster = vm.cluster().id()
		vmInfo.template = vm.template().id()
		val osItemList: List<OperatingSystemInfo> = c.findAllOperatingSystems()
		for (item in osItemList) {
			if (vm.os().type() == item.name()) vmInfo.operatingSystem = item.name()
		}
		if (vm.instanceType() != null) vmInfo.instanceType = vm.instanceType().id()
		vmInfo.type = vm.type().value()
		vmInfo.name = vm.name()
		vmInfo.description = vm.comment()
		vmInfo.use = vm.description()
		val diskAttachments
				: List<DiskAttachment> = c.findAllDiskAttachmentsFromVm(vmId)
		val disks: MutableList<DiskVo> = ArrayList()
		for (diskAttachment in diskAttachments) {
			val item
					: Disk = c.findDisk(diskAttachment.disk().id())
			if (item.storageDomains().size > 0) {
				val diskVo = item.toDiskVo(c, diskAttachment)
				disks.add(diskVo)
				continue
			}
			val disk = item.toDiskVo(c, diskAttachment)
			disks.add(disk)
		}
		vmInfo.disks = disks
		val clusterItemList
				: List<Cluster> = c.findAllClusters()
		val clusters: MutableList<ClusterVo> = ArrayList()

		for (value in clusterItemList) {
			val cluster = ClusterVo()
			cluster.id = value.id()
			cluster.name = value.name()
			val networkVos: MutableList<NetworkVo> = ArrayList()
			val networkList =
				systemService.clustersService().clusterService(value.id()).networksService().list().send().networks()
			for (network in networkList) {
				val networkVo1 = NetworkVo()
				networkVo1.id = network.id()
				networkVo1.name = network.name()
				networkVos.add(networkVo1)
			}
			cluster.clusterNetworkList = networkVos
			clusters.add(cluster)
		}
		vmInfo.clusters = clusters
		val nics: List<Nic>
				= c.findNicsFromVm(vmId)
		if (nics.isNotEmpty()) {
			val vmNics: MutableList<VmNicVo> = arrayListOf()
			for (nic in nics) {
				val vmNic = VmNicVo()
				if (nic.vnicProfile() == null && nic.id() != null) {
					vmNic.id = nic.id()
					vmNic.networkId = ""
					vmNic.networkName = ""
				} else {
					c.findVnicProfile(nic.vnicProfile().id())?.let { vnicProfile ->
						vmNic.id = vnicProfile.id()
						vmNic.networkId = vnicProfile.network().id()
						vmNic.networkName = vnicProfile.name()
					}
				}
				vmNic.nicName = nic.name()
				vmNics.add(vmNic)
			}
			vmInfo.selectNics = vmNics
		} else {
			val vmNics: MutableList<VmNicVo> = ArrayList()
			val vmNic = VmNicVo().apply {
				id = ""
				networkName = ""
			}
			vmNics.add(vmNic)
			vmInfo.selectNics = vmNics
		}
		if (vm.display() != null) {
			vmInfo.disconnectAction = vm.display().disconnectAction()
			vmInfo.smartcard = vm.display().smartcardEnabled()
		}
		vmInfo.memory = vm.memoryPolicy().guaranteed()
		vmInfo.physicalMemory = vm.memoryPolicy().guaranteed()
		vmInfo.maximumMemory = vm.memoryPolicy().max()
		vmInfo.virtualSockets = vm.cpu().topology().socketsAsInteger()
		vmInfo.coresPerVirtualSocket = vm.cpu().topology().coresAsInteger()
		vmInfo.threadsPerCore = vm.cpu().topology().threadsAsInteger()
		if (vm.placementPolicy().hostsPresent()) {
			vmInfo.pickHost = "targetHost"
			vmInfo.targetHost = (vm.placementPolicy().hosts()[0] as Host).id()
		}
		val hosts: MutableList<HostVo> = ArrayList()
		for (item in systemService.hostsService().list().send().hosts()) {
			val host = HostVo()
			if ("up" == item.status().value()) {
				val luns = systemService.hostsService().hostService(item.id()).storageService().list().send().storages()
				host.hostId = item.id()
				host.hostName = item.name()
				host.clusterId = item.cluster().id()
				host.lunVos = luns.toLunVos()
				val hostService = systemService.hostsService().hostService(item.id())
				val networkAttachmentList = hostService.networkAttachmentsService().list().send().attachments()
				host.netAttachment = networkAttachmentList.toNetworkAttachmentVos(systemService)
				hosts.add(host)
			}
		}
		vmInfo.hosts = hosts
		vmInfo.affinity = vm.placementPolicy().affinity().value()
		vmInfo.autoConverge = vm.migration().autoConverge().value()
		vmInfo.compressed = vm.migration().compressed().value()
		if (vm.migration().policyPresent()) {
			vmInfo.customMigrationUsed = true
			vmInfo.customMigration = vm.migration().policy().id()
			vmInfo.customMigrationDowntime = vm.migrationDowntime()
		}
		if (vm.initializationPresent()) {
			vmInfo.useCloudInit = vm.initializationPresent()
			vmInfo.hostName = vm.initialization().hostName()
			vmInfo.timezone = vm.initialization().timezone()
			vmInfo.customScript = vm.initialization().customScript()
		}
		vmInfo.highAvailability = vm.highAvailability().enabled()
		if (vm.leasePresent()) vmInfo.leaseStorageDomain = vm.lease().storageDomain().id()
		vmInfo.resumeBehaviour = vm.storageErrorResumeBehaviour().value()
		vmInfo.priority = vm.highAvailability().priority()
		vmInfo.firstDevice = vm.os().boot().devices()[0].value()
		vmInfo.secondDevice =
			if (vm.os().boot().devices().size > 1)
			 	vm.os().boot().devices()[1].value()
			else "none"

		val cdroms: List<Cdrom> =
			c.findAllVmCdromsFromVm(vmId)
		if (cdroms.isNotEmpty() && cdroms[0].filePresent()) {
			vmInfo.bootImageUse = true
			vmInfo.bootImage = cdroms[0].file().id()
		}
		vmInfo.cpuShare = vm.cpuShares()
		vmInfo.memoryBalloon = vm.memoryPolicy().ballooning()
		vmInfo.ioThreadsEnabled = vm.io().threads()
		log.info("setVirtioScsiEnabled:" + vm.virtioScsiPresent())
		return vmInfo
	}

	override fun retrieveVmCloneInfo(vmId: String, snapshotId: String): VmCreateVo {
		log.info("... retrieveVmCloneInfo('$vmId', '$snapshotId')")
		val connection = connectionService.getConnection()
		val systemService = connection.systemService()
		val vmService = systemService.vmsService().vmService(vmId)
		val snapshotService = systemService.vmsService().vmService(vmId).snapshotsService().snapshotService(snapshotId)
		val vm = vmService.get().send().vm()
		val vmInfo = retrieveVmCreateInfo()
		vmInfo.headlessMode = vm.display() == null
		vmInfo.cluster = vm.cluster().id()
		vmInfo.template = vm.template().id()
		val osItemList = systemService.operatingSystemsService().list().send().operatingSystem()
		for (item in osItemList) {
			if (vm.os().type() == item.name()) vmInfo.operatingSystem = item.name()
		}
		if (vm.instanceType() != null) vmInfo.instanceType = vm.instanceType().id()
		vmInfo.type = vm.type().value()
		vmInfo.use = vm.description()
		if (vm.display() != null) {
			vmInfo.disconnectAction = vm.display().disconnectAction()
			vmInfo.smartcard = vm.display().smartcardEnabled()
		}
		vmInfo.memory = vm.memoryPolicy().guaranteed()
		vmInfo.physicalMemory = vm.memoryPolicy().guaranteed()
		vmInfo.maximumMemory = vm.memoryPolicy().max()
		vmInfo.virtualSockets = vm.cpu().topology().socketsAsInteger()
		vmInfo.coresPerVirtualSocket = vm.cpu().topology().coresAsInteger()
		vmInfo.threadsPerCore = vm.cpu().topology().threadsAsInteger()
		if (vm.placementPolicy().hostsPresent()) vmInfo.targetHost = (vm.placementPolicy().hosts()[0] as Host).id()
		vmInfo.affinity = vm.placementPolicy().affinity().value()
		vmInfo.autoConverge = vm.migration().autoConverge().value()
		vmInfo.compressed = vm.migration().compressed().value()
		if (vm.migration().policyPresent()) {
			vmInfo.customMigrationUsed = true
			vmInfo.customMigration = vm.migration().policy().id()
			vmInfo.customMigrationDowntime = vm.migrationDowntime()
		}
		if (vm.initializationPresent()) {
			vmInfo.useCloudInit = vm.initializationPresent()
			vmInfo.hostName = vm.initialization().hostName()
			vmInfo.timezone = vm.initialization().timezone()
			vmInfo.customScript = vm.initialization().customScript()
		}
		vmInfo.highAvailability = vm.highAvailability().enabled()
		if (vm.leasePresent()) vmInfo.leaseStorageDomain = vm.lease().storageDomain().id()
		vmInfo.resumeBehaviour = vm.storageErrorResumeBehaviour().value()
		vmInfo.priority = vm.highAvailability().priority()
		vmInfo.firstDevice = (vm.os().boot().devices()[0] as BootDevice).value()
		if (vm.os().boot().devices().size > 1) vmInfo.secondDevice = vm.os().boot().devices()[1].value()
		else vmInfo.secondDevice = "none"

		val cdroms = vmService.cdromsService().list().send().cdroms()
		if (cdroms.size > 0 && cdroms[0].filePresent()) {
			vmInfo.bootImageUse = true
			vmInfo.bootImage = cdroms[0].file().id()
		}
		vmInfo.cpuShare = vm.cpuShares()
		vmInfo.memoryBalloon = vm.memoryPolicy().ballooning()
		vmInfo.ioThreadsEnabled = vm.io().threads()
		return vmInfo
	}

	override fun checkDuplicateName(name: String): Boolean {
		log.info("... checkDuplicateName('$name')")
		val c = connectionService.getConnection()
		return c.findAllVms(" name=$name").isNotEmpty()
	}

	override fun checkDuplicateDiskName(disk: DiskVo): Boolean {
		log.info("... checkDuplicateDiskName")
		val result = false
		return result
	}

	@Async("karajanTaskExecutor")
	override fun createVm(vmCreate: VmCreateVo) {
		log.info("... createVm")
		val c = adminConnectionService.getConnection()
		val systemService = c.systemService()
		val vmsService = systemService.vmsService()
		val response: Vm?
		try {
			val vmBuilder = VmBuilder()
			val cluster: Cluster =
				c.findCluster(vmCreate.cluster) ?: throw Exception("클러스터를 찾을 수 없습니다.")

			val operatingSystemBuilder = OperatingSystemBuilder()
			operatingSystemBuilder.type(vmCreate.operatingSystem)
			vmBuilder.template(
				systemService.templatesService().templateService(vmCreate.template).get().send().template()
			)
			for (instanceType in systemService.instanceTypesService().list().send().instanceType()) {
				if (vmCreate.instanceType.equals(
						instanceType.id(),
						ignoreCase = true
					)
				) vmBuilder.instanceType(instanceType)
			}
			vmBuilder.type(VmType.fromValue(vmCreate.type))
			vmBuilder.name(vmCreate.name)
			vmBuilder.comment(vmCreate.description)
			vmBuilder.description(vmCreate.use)
			val displayBuilder = DisplayBuilder()
			displayBuilder.type(DisplayType.VNC)
			displayBuilder.disconnectAction(vmCreate.disconnectAction)
			displayBuilder.smartcardEnabled(vmCreate.smartcard)
			if (vmCreate.singleSignOn) {
				val ssoBuilder = SsoBuilder()
				ssoBuilder.methods(
					*arrayOf(
						MethodBuilder()
							.id(SsoMethod.GUEST_AGENT)
					)
				)
				vmBuilder.sso(ssoBuilder)
			}
			vmBuilder.display(displayBuilder)
			val cpuBuilder = CpuBuilder()
			val cpuTopologyBuilder = CpuTopologyBuilder()
			cpuTopologyBuilder.cores(vmCreate.coresPerVirtualSocket)
			cpuTopologyBuilder.sockets(vmCreate.virtualSockets)
			cpuTopologyBuilder.threads(vmCreate.threadsPerCore)
			cpuBuilder.topology(cpuTopologyBuilder)
			vmBuilder.cpu(cpuBuilder)
			val memoryPolicy = MemoryPolicyBuilder()
			vmBuilder.memory(vmCreate.memory)
			memoryPolicy.max(vmCreate.maximumMemory)
			vmBuilder.memoryPolicy(memoryPolicy)
			memoryPolicy.guaranteed(vmCreate.physicalMemory)
			memoryPolicy.ballooning(vmCreate.memoryBalloon)
			vmBuilder.memoryPolicy(memoryPolicy)

			val vmPlacementPolicyBuilder = VmPlacementPolicyBuilder()
			if (vmCreate.affinity != null) vmPlacementPolicyBuilder.affinity(VmAffinity.fromValue(vmCreate.affinity))
			if ("" != vmCreate.recommendHostId || "" != vmCreate.targetHost) {
				val runHosts: MutableList<Host> = ArrayList()
				if ("" != vmCreate.recommendHostId) runHosts.add(
					systemService.hostsService().hostService(vmCreate.recommendHostId).get().send().host()
				)
				else runHosts.add(systemService.hostsService().hostService(vmCreate.targetHost).get().send().host())
				vmPlacementPolicyBuilder.hosts(runHosts)
			}
			vmBuilder.placementPolicy(vmPlacementPolicyBuilder)
			if (vmCreate.customMigrationUsed) {
				val migrationOptionBuilder = MigrationOptionsBuilder()
				migrationOptionBuilder.autoConverge(InheritableBoolean.fromValue(vmCreate.autoConverge))
				migrationOptionBuilder.compressed(InheritableBoolean.fromValue(vmCreate.compressed))
				if (vmCreate.customMigrationDowntimeUsed) vmBuilder.migrationDowntime(vmCreate.customMigrationDowntime)
			}
			if (vmCreate.useCloudInit) {
				val initializationBuilder = InitializationBuilder()
				initializationBuilder.hostName(vmCreate.hostName)
				initializationBuilder.timezone(vmCreate.timezone)
				initializationBuilder.customScript(vmCreate.customScript)
				vmBuilder.initialization(initializationBuilder)
			}
			val highAvailabilityBuilder = HighAvailabilityBuilder()
			highAvailabilityBuilder.enabled(vmCreate.highAvailability)
			highAvailabilityBuilder.priority(vmCreate.priority)
			vmBuilder.highAvailability(highAvailabilityBuilder)
			if (vmCreate.leaseStorageDomain != null && vmCreate.leaseStorageDomain != "") {
				val storageDomainLeaseBuilder = StorageDomainLeaseBuilder()
				storageDomainLeaseBuilder.storageDomain(
					systemService.storageDomainsService().storageDomainService(vmCreate.leaseStorageDomain).get().send()
						.storageDomain()
				)
				vmBuilder.lease(storageDomainLeaseBuilder)
			}
			vmBuilder.storageErrorResumeBehaviour(VmStorageErrorResumeBehaviour.fromValue(vmCreate.resumeBehaviour))
			if ("" != vmCreate.firstDevice) {
				val bootDevices: MutableList<BootDevice> = ArrayList()
				bootDevices.add(BootDevice.fromValue(vmCreate.firstDevice))
				if (vmCreate.secondDevice != "none") bootDevices.add(BootDevice.fromValue(vmCreate.secondDevice))
				val bootBuilder = BootBuilder()
				bootBuilder.devices(bootDevices)
				operatingSystemBuilder.boot(bootBuilder)
				vmBuilder.os(operatingSystemBuilder)
			}
			val cpuProfileBuilder = CpuProfileBuilder()
			try {
				cpuProfileBuilder.cluster(
					systemService.clustersService().clusterService(vmCreate.cluster).get().send().cluster()
				)
			} catch (e: Exception) {
				throw Exception("클러스터를 찾을 수 없습니다.")
			}
			vmBuilder.cpuProfile(cpuProfileBuilder)
			vmBuilder.cpuShares(vmCreate.cpuShare)
			val ioBuilder = IoBuilder()
			ioBuilder.threads(vmCreate.ioThreadsEnabled)
			vmBuilder.io(ioBuilder)
			val virtioScsiBuilder = VirtioScsiBuilder()
			virtioScsiBuilder.enabled(vmCreate.virtioScsiEnabled)
			vmBuilder.virtioScsi(virtioScsiBuilder)
			if ("" != vmCreate.deviceSource) {
				val rngDeviceBuilder = RngDeviceBuilder()
				val rateBuilder = RateBuilder()
				rateBuilder.period(vmCreate.periodDuration)
				rateBuilder.bytes(vmCreate.bytesPerPeriod)
				rngDeviceBuilder.source(RngSource.fromValue(vmCreate.deviceSource))
				vmBuilder.rngDevice(rngDeviceBuilder)
			}
			response = vmsService.add().vm(vmBuilder).send().vm()
			if (response == null) {
				log.error("something went WRONG ... reason: NO vm found")
				return
			}
			val nics: List<Nic>
				= c.findNicsFromVm(response.id())
			if (nics.isNotEmpty() && vmCreate.selectNics.isNotEmpty())
				for (i in vmCreate.selectNics.indices) {
					if ("" != vmCreate.selectNics[i].id && "empty" == vmCreate.selectNics[i].id) {
						systemService.vmsService().vmService(response.id()).nicsService().add()
							.nic(
								Builders.nic()
									.name("nic${i+1}")
							).send()
					} else {
						systemService.vmsService().vmService(response.id()).nicsService().add()
							.nic(
								Builders.nic()
									.name("nic${i+1}" )
									.vnicProfile(Builders.vnicProfile().id(vmCreate.selectNics[i].id))
							).send()
					}
				}
			val template: Template =
				c.findTemplate(vmCreate.template)
//				templateService.get().send().template()
			if (template.version().versionName().isNotEmpty()) {
				val nics: List<Nic> =
					c.findAllNicsFromTemplate(vmCreate.template)
//					templateService.nicsService().list().send().nics()
				for (i in nics.indices) systemService.vmsService().vmService(response.id()).nicsService().add()
					.nic(
						Builders.nic()
							.name("nic${i+1}")
							.vnicProfile(Builders.vnicProfile().id(nics[i].vnicProfile().id()))
					).send()
			}
			val diskAttachmentsService = vmsService.vmService(response.id()).diskAttachmentsService()
			if (vmCreate.disks.isNotEmpty()) for ((id, name, virtualSize, _, _, _, bootable, sharable, readOnly, _, _, storageDomainId, _, _, diskInterface, _, _, _, description, _, lunId, hostId, _, storageType) in vmCreate.disks) {
				if (systemService.disksService().list().search(" id=$id").send().disks().size < 1) {
					if ("" == lunId && "" == storageType) {
						val storageDomain =
							systemService.storageDomainsService().storageDomainService(storageDomainId).get().send()
								.storageDomain()
						val diskBuilder = DiskBuilder()
						diskBuilder.name(name)
						diskBuilder.description(description)
						diskBuilder.format(if (sharable) DiskFormat.RAW else DiskFormat.COW)
						diskBuilder.shareable(sharable)
						diskBuilder.provisionedSize(
							BigInteger.valueOf(virtualSize.toLong()).multiply(BigInteger.valueOf(2L).pow(30))
						)
						diskBuilder.storageDomains(*arrayOf(storageDomain))
						(diskAttachmentsService.add()
							.attachment(
								Builders.diskAttachment()
									.disk(diskBuilder)
									.interface_(DiskInterface.fromValue(diskInterface))
									.bootable(bootable)
									.readOnly(readOnly)
							)

							.send() as DiskAttachmentsService.AddResponse)
							.attachment()
						continue
					}
					if (lunId.isNotEmpty() && "FCP" == storageType) {
						val luns: List<HostStorage> =
							c.findAllStoragesFromHost(hostId)
						val diskBuilder = DiskBuilder()
						diskBuilder.alias(name)
						diskBuilder.description(description)
						diskBuilder.shareable(sharable)
						val lunStorage = HostStorageBuilder()
						for (lun in luns) {
							if (lun.id() == lunId) {
								val logicalUnitBuilder = LogicalUnitBuilder()
								logicalUnitBuilder.id(lunId)
								logicalUnitBuilder.lunMapping(lun.logicalUnits()[0].lunMapping())
								logicalUnitBuilder.productId(lun.logicalUnits()[0].productId())
								logicalUnitBuilder.serial(lun.logicalUnits()[0].serial())
								logicalUnitBuilder.size(lun.logicalUnits()[0].size())
								logicalUnitBuilder.vendorId(lun.logicalUnits()[0].vendorId())
								val hostBuilder = HostBuilder()
								hostBuilder.id(hostId)
								lunStorage.host(hostBuilder)
								lunStorage.type(StorageType.FCP)
								lunStorage.logicalUnits(*arrayOf(logicalUnitBuilder))
								diskBuilder.lunStorage(lunStorage)
								break
							}
						}
						(diskAttachmentsService.add()
							.attachment(
								Builders.diskAttachment()
									.disk(diskBuilder)
									.interface_(DiskInterface.fromValue(diskInterface))
									.bootable(bootable)
							)

							.send() as DiskAttachmentsService.AddResponse)
							.attachment()
					}
					continue
				}
				val disk = systemService.disksService().diskService(id).get().send().disk()
				val diskAttachResponse =
					diskAttachmentsService.add().attachment(
						Builders.diskAttachment().disk(disk).interface_(
							DiskInterface.fromValue(
								diskInterface
							)
						)
					).send()
						.attachment()
				if (diskAttachResponse != null && (bootable || readOnly)) {
					Thread.sleep(1000L)
					diskAttachmentsService.attachmentService(diskAttachResponse.id()).update().diskAttachment(
						Builders.diskAttachment()
							.bootable(bootable)
							.readOnly(readOnly)
					)
						.send()
						.diskAttachment()
				}
			}
			if (vmCreate.bootImageUse) {
				vmCreate.bootImage = vmCreate.bootImage.replace(" ".toRegex(), "%20")
				val cdromBuilder = CdromBuilder()
				val fileBuilder = FileBuilder()
				fileBuilder.id(vmCreate.bootImage)
				cdromBuilder.file(fileBuilder)
				vmsService.vmService(response.id()).cdromsService().add().cdrom(cdromBuilder).send()
			}
			do {
				Thread.sleep(5000L)
			} while (systemService.vmsService().list().search(" id=" + response.id()).send().vms().size <= 0 &&
				systemService.vmsService().vmService(response.id()).get().send().vm().status() != VmStatus.DOWN
			)
			val gson = Gson()
			val vm = VmVo()
			vm.id = response.id()
			vm.name = response.name()
			vm.comment = response.comment()
			vm.cluster =
				systemService.clustersService().clusterService(response.cluster().id()).get().send().cluster().name()
			vm.clusterId = response.cluster().id()
			if (vmCreate.headlessMode) {
				val consoleId = systemService.vmsService().vmService(
					response.id()
				).graphicsConsolesService().list().send().consoles()[0].id()
				systemService.vmsService().vmService(response.id()).graphicsConsolesService().consoleService(consoleId)
					.remove().send()
				vm.graphicProtocol = "null"
			} else {
				vm.graphicProtocol = "VNC"
			}
			vm.status = "created"
			websocketService.sendMessage("/topic/vms", gson.toJson(vm))
			val message = MessageVo.createMessage(MessageType.VIRTUAL_MACHINE_CREATE, true, vm.name, "")
			websocketService.notify(message)
		} catch (e: Exception) {
			try {
				Thread.sleep(5000L)
			} catch (interruptedException: InterruptedException) {
				log.error(e.localizedMessage)
				interruptedException.printStackTrace()
			}
			log.error(e.localizedMessage)
			e.printStackTrace()
			val gson = Gson()
			val message = MessageVo.createMessage(
				MessageType.VIRTUAL_MACHINE_CREATE, false,
				e.message!!, e.localizedMessage
			)
			websocketService.sendMessage("/topic/notify", gson.toJson(message))
		}
	}

	@Async("karajanTaskExecutor")
	override fun updateVm(vmUpdate: VmCreateVo) {
		log.info("... updateVm")
		val c = adminConnectionService.getConnection()
		val systemService = c.systemService()
		val vmService = systemService.vmsService().vmService(vmUpdate.id)
		var response: Vm? = null
		try {
			val vmBuilder = VmBuilder()
			val cluster: Cluster?
					= c.findCluster(vmUpdate.cluster) ?: throw Exception("클러스터를 찾을 수 없습니다.")
			vmBuilder.cluster(cluster)

			val operatingSystemBuilder = OperatingSystemBuilder()
			operatingSystemBuilder.type(vmUpdate.operatingSystem)
			if (vmUpdate.instanceType.isEmpty() || vmUpdate.instanceType == "null") {
				val instanceTypeBuilder = InstanceTypeBuilder()
				vmBuilder.instanceType(instanceTypeBuilder)
			} else {
				for (instanceType in systemService.instanceTypesService().list().send().instanceType()) {
					if (vmUpdate.instanceType.equals(instanceType.id(), ignoreCase = true)) vmBuilder.instanceType(
						instanceType
					)
				}
			}
			vmBuilder.type(VmType.fromValue(vmUpdate.type))
			vmBuilder.name(vmUpdate.name)
			vmBuilder.comment(vmUpdate.description)
			vmBuilder.description(vmUpdate.use)
			if (!vmUpdate.headlessMode) {
				val displayBuilder = DisplayBuilder()
				displayBuilder.type(DisplayType.VNC)
				displayBuilder.disconnectAction(vmUpdate.disconnectAction)
				displayBuilder.smartcardEnabled(vmUpdate.smartcard)
				if (vmUpdate.singleSignOn) {
					val ssoBuilder = SsoBuilder()
					ssoBuilder.methods(
						*arrayOf(
							MethodBuilder()
								.id(SsoMethod.GUEST_AGENT)
						)
					)
					vmBuilder.sso(ssoBuilder)
				}
				vmBuilder.display(displayBuilder)
			} else {
				val graphicsConsoleList =
					systemService.vmsService().vmService(vmUpdate.id).graphicsConsolesService().list().send().consoles()
				if (graphicsConsoleList.size > 0) for (graphicsConsole in graphicsConsoleList) {
					val consoleId = graphicsConsole.id()
					systemService.vmsService().vmService(vmUpdate.id).graphicsConsolesService()
						.consoleService(consoleId).remove().send()
				}
			}
			val cpuTopologyBuilder = CpuTopologyBuilder()
				.sockets(vmUpdate.virtualSockets)
				.cores(vmUpdate.coresPerVirtualSocket)
				.threads(vmUpdate.threadsPerCore)
			val cpuBuilder = CpuBuilder()
				.topology(cpuTopologyBuilder)
			val memoryPolicy = MemoryPolicyBuilder()
				.max(vmUpdate.maximumMemory)
				.guaranteed(vmUpdate.physicalMemory)
				.ballooning(vmUpdate.memoryBalloon)
			vmBuilder.cpu(cpuBuilder)
			vmBuilder.memory(vmUpdate.memory)
			vmBuilder.memoryPolicy(memoryPolicy)
			val vmPlacementPolicyBuilder = VmPlacementPolicyBuilder()
			vmPlacementPolicyBuilder.affinity(VmAffinity.fromValue(vmUpdate.affinity))
			if (vmUpdate.recommendHostId.isNotEmpty() || vmUpdate.targetHost.isNotEmpty()) {
				val runHosts: MutableList<Host> = arrayListOf()
				if (vmUpdate.pickHost == "targetHost") {
					if (vmUpdate.recommendHostId.isNotEmpty()) {

						runHosts.add(
							systemService.hostsService().hostService(vmUpdate.recommendHostId).get().send()
								.host()
						)
					} else {
						runHosts.add(
							systemService.hostsService().hostService(vmUpdate.targetHost).get().send()
								.host()
						)
					}
					vmPlacementPolicyBuilder.hosts(runHosts)
				}
			}
			vmBuilder.placementPolicy(vmPlacementPolicyBuilder)
			if (vmUpdate.customMigrationUsed) {
				val migrationOptionBuilder = MigrationOptionsBuilder()
				migrationOptionBuilder.autoConverge(InheritableBoolean.fromValue(vmUpdate.autoConverge))
				migrationOptionBuilder.compressed(InheritableBoolean.fromValue(vmUpdate.compressed))
				if (vmUpdate.customMigrationDowntimeUsed) vmBuilder.migrationDowntime(vmUpdate.customMigrationDowntime)
			}
			if (vmUpdate.useCloudInit) {
				val initializationBuilder = InitializationBuilder()
				initializationBuilder.hostName(vmUpdate.hostName)
				initializationBuilder.timezone(vmUpdate.timezone)
				initializationBuilder.customScript(vmUpdate.customScript)
				vmBuilder.initialization(initializationBuilder)
			}
			val highAvailabilityBuilder = HighAvailabilityBuilder()
			highAvailabilityBuilder.enabled(vmUpdate.highAvailability)
			highAvailabilityBuilder.priority(vmUpdate.priority)
			vmBuilder.highAvailability(highAvailabilityBuilder)
			val storageDomainLeaseBuilder = StorageDomainLeaseBuilder()
			storageDomainLeaseBuilder.storageDomain(
				systemService.storageDomainsService().storageDomainService(vmUpdate.leaseStorageDomain).get().send()
					.storageDomain()
			)
			vmBuilder.lease(storageDomainLeaseBuilder)
			vmBuilder.storageErrorResumeBehaviour(VmStorageErrorResumeBehaviour.fromValue(vmUpdate.resumeBehaviour))
			val bootDevices: MutableList<BootDevice> = ArrayList()
			bootDevices.add(BootDevice.fromValue(vmUpdate.firstDevice))
			if (vmUpdate.secondDevice != "none") bootDevices.add(BootDevice.fromValue(vmUpdate.secondDevice))
			val bootBuilder = BootBuilder()
			bootBuilder.devices(bootDevices)
			operatingSystemBuilder.boot(bootBuilder)
			vmBuilder.os(operatingSystemBuilder)
			val cpuProfileBuilder = CpuProfileBuilder()
			try {
				cpuProfileBuilder.cluster(
					systemService.clustersService().clusterService(vmUpdate.cluster).get().send().cluster()
				)
			} catch (e: Exception) {
				throw Exception("클러스터를 찾을 수 없습니다.")
			}
			vmBuilder.cpuProfile(cpuProfileBuilder)
			vmBuilder.cpuShares(vmUpdate.cpuShare)
			val ioBuilder = IoBuilder()
			ioBuilder.threads(vmUpdate.ioThreadsEnabled)
			vmBuilder.io(ioBuilder)

			val virtioScsiBuilder = VirtioScsiBuilder()
			virtioScsiBuilder.enabled(vmUpdate.virtioScsiEnabled)
			vmBuilder.virtioScsi(virtioScsiBuilder)

			val rngDeviceBuilder = RngDeviceBuilder()
			val rateBuilder = RateBuilder()
			rateBuilder.period(vmUpdate.periodDuration)
			rateBuilder.bytes(vmUpdate.bytesPerPeriod)
			rngDeviceBuilder.source(RngSource.fromValue(vmUpdate.deviceSource))
			vmBuilder.rngDevice(rngDeviceBuilder)

			response =
				vmService.update().vm(vmBuilder).send().vm()
			if (vmUpdate.disks.isNotEmpty()) {
				val diskAttachmentsService = vmService.diskAttachmentsService()
				for ((id, name, virtualSize, _, _, _, bootable, _, readOnly, _, _, storageDomainId, _, _, diskInterface, _, status, _, description) in vmUpdate.disks) {
					if ("" != status) {
						if (status == "create") {
							val storageDomain =
								systemService.storageDomainsService().storageDomainService(storageDomainId).get().send()
									.storageDomain()
							diskAttachmentsService.add()
								.attachment(
									Builders.diskAttachment()
										.disk(
											DiskBuilder()
												.name(name)
												.description(description)
												.format(DiskFormat.COW)
												.provisionedSize(
													BigInteger.valueOf(virtualSize.toLong()).multiply(BigInteger.valueOf(2L).pow(30))
												)
												.storageDomains(storageDomain)
										).interface_(DiskInterface.fromValue(diskInterface))
										.bootable(bootable)
										.readOnly(readOnly)
										.active(true)
								)

								.send()
								.attachment()
							continue
						}
						if (status == "update") {
							diskAttachmentsService.attachmentService(id).update()
								.diskAttachment(
									Builders.diskAttachment()
										.disk(
											DiskBuilder()
												.name(name)
												.description(description)
												.provisionedSize(
													BigDecimal.valueOf(virtualSize.toDouble()).toBigInteger().multiply(
														BigInteger.valueOf(2L).pow(30)
													)
												)
										)
										.bootable(bootable)
										.readOnly(readOnly)
								).send()
							continue
						}

						if (status == "remove") {
							systemService.disksService().diskService(id).remove().send()
							continue
						}

						if (status == "disconnect") {
							diskAttachmentsService.attachmentService(id).remove().send()
							continue
						}

						if (status == "linked") {
							val disk = systemService.disksService().diskService(id).get().send().disk()
							val diskAttachResponse =
								diskAttachmentsService.add().attachment(
									Builders.diskAttachment().disk(disk).interface_(
										DiskInterface.fromValue(
											diskInterface
										)
									)
								).send()
									.attachment()
							if (diskAttachResponse != null && (bootable || readOnly)) {
								Thread.sleep(1000L)
								(diskAttachmentsService.attachmentService(diskAttachResponse.id()).update()
									.diskAttachment(
										Builders.diskAttachment()
											.bootable(bootable)
											.readOnly(readOnly)
									)
									.send() as DiskAttachmentService.UpdateResponse)
									.diskAttachment()
							}
						}
					}
				}
			}
			val nicsService = vmService.nicsService()
			val nics = nicsService.list().send().nics()

			if (vmUpdate.exSelectNics.size == vmUpdate.selectNics.size) {
				for (i in vmUpdate.exSelectNics.indices) {
					if (vmUpdate.exSelectNics[i].id == "none" && (vmUpdate.selectNics[i].id == "empty")) {
						systemService.vmsService().vmService(vmUpdate.id).nicsService().add()
							.nic(
								Builders.nic()
									.name("nic" + (i + 1))
							)
							.send()
					} else if (nics[i].vnicProfile() == null) {
						if (vmUpdate.selectNics[i].id != "empty" && vmUpdate.exSelectNics[i].id != vmUpdate.selectNics[i].id) {
							val nic = NicBuilder()
							val vnicProfileBuilder = VnicProfileBuilder()
							nic.id(nics[i].id()).vnicProfile(vnicProfileBuilder.id(vmUpdate.selectNics[i].id))
							vmService.nicsService().nicService(nics[i].id()).update().nic(nic).send()
						}
					} else if (vmUpdate.selectNics[i].id != "empty") {
						val nic = NicBuilder()
						val vnicProfileBuilder = VnicProfileBuilder()
						nic.id(nics[i].id()).vnicProfile(vnicProfileBuilder.id(vmUpdate.selectNics[i].id))
						vmService.nicsService().nicService(nics[i].id()).update().nic(nic).send()
					} else if (vmUpdate.selectNics[i].id == "empty") {
						val nic = NicBuilder()
						val vnicProfileBuilder = VnicProfileBuilder()
						nic.id(nics[i].id()).vnicProfile(vnicProfileBuilder)
						vmService.nicsService().nicService(nics[i].id()).update().nic(nic).send()
					} else if (vmUpdate.selectNics[i].id == "none") {
						vmService.nicsService().nicService(nics[i].id()).remove().send()
					}
				}
			} else if (vmUpdate.exSelectNics.size > vmUpdate.selectNics.size) {
				if (vmService.get().send().vm().status()
						.value() != "up"
				) for (i in vmUpdate.selectNics.size until vmUpdate.exSelectNics.size) {
					if (vmUpdate.exSelectNics[i].id != "none") nicsService.nicService(nics[i].id()).remove().send()
				}
				if ((vmService.nicsService().list()
						.send() as VmNicsService.ListResponse).nics().size == vmUpdate.selectNics.size
				) {
					val nicList = (vmService.nicsService().list().send() as VmNicsService.ListResponse).nics()
					for (i in vmUpdate.selectNics.indices) {
						if ((nicList[i] as Nic).vnicProfile() == null) {
							if (vmUpdate.selectNics[i].id != "none") if (vmUpdate.exSelectNics[i].id != vmUpdate.selectNics[i].id) {
								val nic = NicBuilder()
								val vnicProfileBuilder = VnicProfileBuilder()
								nic.id(nics[i].id()).vnicProfile(
									vnicProfileBuilder.id(
										vmUpdate.selectNics[i].id
									)
								)
								nic.name("nic" + (i + 1))
								vmService.nicsService().nicService(nicList[i].id()).update().nic(nic).send()
							}
						} else if (vmUpdate.selectNics[i].id != "none" || vmUpdate.selectNics[i].id != "empty") {
							val nic = NicBuilder()
							val vnicProfileBuilder = VnicProfileBuilder()
							nic.id(nicList[i].id()).vnicProfile(
								vnicProfileBuilder.id(
									vmUpdate.selectNics[i].id
								)
							)
							nic.name("nic" + (i + 1))
							vmService.nicsService().nicService(nicList[i].id()).update().nic(nic).send()
						} else if (vmUpdate.selectNics[i].id == "empty") {
							val nic = NicBuilder()
							val vnicProfileBuilder = VnicProfileBuilder()
							nic.id(nicList[i].id()).vnicProfile(vnicProfileBuilder)
							nic.name("nic" + (i + 1))
							vmService.nicsService().nicService(nicList[i].id()).update().nic(nic).send()
						}
					}
				}
			} else {
				val nicList = (vmService.nicsService().list().send() as VmNicsService.ListResponse).nics()
				var i = 0
				while (i < vmUpdate.exSelectNics.size) {
					if (vmUpdate.exSelectNics[i].id == "none" && (vmUpdate.selectNics[i].id == "empty")) {
						systemService.vmsService().vmService(vmUpdate.id).nicsService().add()
							.nic(
								Builders.nic()
									.name("nic" + (i + 1))
							)

							.send()
					} else if (nicList[i].vnicProfile() == null) {
						if (vmUpdate.selectNics[i].id != "empty" && vmUpdate.exSelectNics[i].id != vmUpdate.selectNics[i].id) {
							val nic = NicBuilder()
							val vnicProfileBuilder = VnicProfileBuilder()
							nic.id(nics[i].id()).vnicProfile(vnicProfileBuilder.id(vmUpdate.selectNics[i].id))
							nic.name("nic" + (i + 1))
							vmService.nicsService().nicService(nicList[i].id()).update().nic(nic).send()
						}
					} else if (vmUpdate.selectNics[i].id != "empty") {
						val nic = NicBuilder()
						val vnicProfileBuilder = VnicProfileBuilder()
						nic.id(nicList[i].id()).vnicProfile(vnicProfileBuilder.id(vmUpdate.selectNics[i].id))
						nic.name("nic" + (i + 1))
						vmService.nicsService().nicService(nicList[i].id()).update().nic(nic).send()
					} else if (vmUpdate.selectNics[i].id == "empty") {
						val nic = NicBuilder()
						val vnicProfileBuilder = VnicProfileBuilder()
						nic.id(nicList[i].id()).vnicProfile(vnicProfileBuilder)
						nic.name("nic" + (i + 1))
						vmService.nicsService().nicService(nicList[i].id()).update().nic(nic).send()
					}
					i++
				}
				i = vmUpdate.exSelectNics.size
				while (i < vmUpdate.selectNics.size) {
					if (vmUpdate.selectNics[i].id != "empty") {
						c.addNicFromVm(vmUpdate.id, Builders.nic().name("nic${i+1}")
							.vnicProfile(Builders.vnicProfile().id(vmUpdate.selectNics[i].id)).build())
					} else {
						c.addNicFromVm(vmUpdate.id, Builders.nic().name("nic" + (i + 1))
							.vnicProfile(VnicProfileBuilder()).build())
					}
					i++
				}
			}
			if (vmUpdate.bootImageUse) {
				vmUpdate.bootImage = vmUpdate.bootImage.replace(" ".toRegex(), "%20")
				val cdromBuilder = CdromBuilder()
				val fileBuilder = FileBuilder()
				fileBuilder.id(vmUpdate.bootImage)
				cdromBuilder.file(fileBuilder)
				vmService.cdromsService().add().cdrom(cdromBuilder).send()
			} else {
				val vmCdromService =
					vmService.cdromsService().cdromService(vmService.cdromsService().list().send().cdroms()[0].id())
				if (vmCdromService.get().send().cdrom().filePresent()) vmCdromService.update()
					.cdrom(Builders.cdrom().file(Builders.file().id(""))).send()
			}
		} catch (e: Exception) {
			try {
				Thread.sleep(1000L)
			} catch (ie: InterruptedException) {
				log.error(ie.localizedMessage)
				ie.printStackTrace()
			}
			log.error(e.localizedMessage)
			e.printStackTrace()
			val gson1 = Gson()
			val messageVo = MessageVo.createMessage(
				MessageType.VIRTUAL_MACHINE_MODIFY, false,
				e.message!!, e.cause!!.localizedMessage
			)
			websocketService.sendMessage("/topic/notify", gson1.toJson(messageVo))
			return
		}
		val gson = Gson()
		val message = MessageVo.createMessage(MessageType.VIRTUAL_MACHINE_MODIFY, true, response!!.name(), "")
		websocketService.sendMessage("/topic/notify", gson.toJson(message))
	}

	@Async("karajanTaskExecutor")
	override fun cloneVm(vmClone: VmCreateVo) {
		log.info("... cloneVm")
		val c = adminConnectionService.getConnection()
		val systemService = c.systemService()
		var response: Vm?
		try {
			val vmBuilder = VmBuilder()
			val snapshots: List<Snapshot> =
				c.findAllSnapshotsFromVm(vmClone.id)
			vmBuilder.snapshots(snapshots.filter { it.id() == vmClone.snapshotId })
			val cluster: Cluster? =
				c.findCluster(vmClone.cluster) ?: throw Exception("찾을 수 없음")
			vmBuilder.cluster(cluster)

			val operatingSystemBuilder = OperatingSystemBuilder()
			operatingSystemBuilder.type(vmClone.operatingSystem)
			for (instanceType in systemService.instanceTypesService().list().send().instanceType()) {
				if (vmClone.instanceType.isNotEmpty() &&
					vmClone.instanceType.equals(instanceType.id(), ignoreCase = true)
				) vmBuilder.instanceType(instanceType)
			}
			vmBuilder.type(if (vmClone.type.isNotEmpty()) VmType.fromValue(vmClone.type) else VmType.SERVER)
			vmBuilder.name(vmClone.name)
			vmBuilder.comment(vmClone.description)
			vmBuilder.description(if (vmClone.use.isEmpty()) "systemManagement" else vmClone.use)

			if (!vmClone.headlessMode) {
				val displayBuilder = DisplayBuilder()
				displayBuilder.type(DisplayType.VNC)
				displayBuilder.disconnectAction(vmClone.disconnectAction)
				displayBuilder.smartcardEnabled(vmClone.smartcard)
				if (vmClone.singleSignOn) {
					val ssoBuilder = SsoBuilder()
					ssoBuilder.methods(MethodBuilder().id(SsoMethod.GUEST_AGENT))
					vmBuilder.sso(ssoBuilder)
				}
				vmBuilder.display(displayBuilder)
			} else {
				val graphicsConsoleList =
					systemService.vmsService().vmService(vmClone.id).graphicsConsolesService().list().send().consoles()
				if (graphicsConsoleList.size > 0) for (i in graphicsConsoleList.indices) {
					val consoleId: String? = graphicsConsoleList[i].id()
					systemService.vmsService().vmService(vmClone.id).graphicsConsolesService().consoleService(consoleId)
						.remove().send()
				}
			}

			val cpuTopologyBuilder = CpuTopologyBuilder()
				.cores(vmClone.coresPerVirtualSocket)
				.sockets(vmClone.virtualSockets)
				.threads(vmClone.threadsPerCore)
			val cpuBuilder = CpuBuilder()
				.topology(cpuTopologyBuilder)

			val memoryPolicy = MemoryPolicyBuilder()
				.max(vmClone.maximumMemory)
				.guaranteed(vmClone.physicalMemory)
				.ballooning(vmClone.memoryBalloon)

			vmBuilder.cpu(cpuBuilder)
			vmBuilder.memory(vmClone.memory)
			vmBuilder.memoryPolicy(memoryPolicy)
			vmBuilder.memoryPolicy(memoryPolicy)

			val vmPlacementPolicyBuilder = VmPlacementPolicyBuilder()
			if (vmClone.affinity.isNotEmpty()) vmPlacementPolicyBuilder.affinity(VmAffinity.fromValue(vmClone.affinity))
			if (vmClone.recommendHostId.isNotEmpty() || vmClone.targetHost.isNotEmpty()) {
				val runHosts: MutableList<Host> = arrayListOf()
				if (vmClone.recommendHostId.isNotEmpty()) {
					runHosts.add(
						systemService.hostsService().hostService(vmClone.recommendHostId).get().send()
							.host()
					)
				} else {
					runHosts.add(
						systemService.hostsService().hostService(vmClone.targetHost).get().send()
							.host()
					)
				}
				vmPlacementPolicyBuilder.hosts(runHosts)
			}
			vmBuilder.placementPolicy(vmPlacementPolicyBuilder)
			if (vmClone.customMigrationUsed) {
				val migrationOptionBuilder = MigrationOptionsBuilder()
				migrationOptionBuilder.autoConverge(InheritableBoolean.fromValue(vmClone.autoConverge))
				migrationOptionBuilder.compressed(InheritableBoolean.fromValue(vmClone.compressed))
				if (vmClone.customMigrationDowntimeUsed) vmBuilder.migrationDowntime(vmClone.customMigrationDowntime)
			}
			if (vmClone.useCloudInit) {
				val initializationBuilder = InitializationBuilder()
					.hostName(vmClone.hostName)
					.timezone(vmClone.timezone)
					.customScript(vmClone.customScript)
				vmBuilder.initialization(initializationBuilder)
			}
			val highAvailabilityBuilder = HighAvailabilityBuilder()
				.enabled(vmClone.highAvailability)
				.priority(vmClone.priority)

			vmBuilder.highAvailability(highAvailabilityBuilder)
			val storageDomainLeaseBuilder = StorageDomainLeaseBuilder()
			storageDomainLeaseBuilder.storageDomain(
				(systemService.storageDomainsService().storageDomainService(vmClone.leaseStorageDomain).get()
					.send() as StorageDomainService.GetResponse).storageDomain()
			)
			vmBuilder.lease(storageDomainLeaseBuilder)
			vmBuilder.storageErrorResumeBehaviour(VmStorageErrorResumeBehaviour.fromValue(vmClone.resumeBehaviour))
			val bootDevices: MutableList<BootDevice> = ArrayList()
			bootDevices.add(BootDevice.fromValue(vmClone.firstDevice))
			if (vmClone.secondDevice != "none") bootDevices.add(BootDevice.fromValue(vmClone.secondDevice))
			val bootBuilder = BootBuilder()
			bootBuilder.devices(bootDevices)
			operatingSystemBuilder.boot(bootBuilder)
			vmBuilder.os(operatingSystemBuilder)
			val cpuProfileBuilder = CpuProfileBuilder()
			try {
				cpuProfileBuilder.cluster(
					systemService.clustersService().clusterService(vmClone.cluster).get().send().cluster()
				)
			} catch (e: Exception) {
				throw Exception("클러스터를 찾을 수 없습니다.")
			}
			vmBuilder.cpuProfile(cpuProfileBuilder)
			vmBuilder.cpuShares(vmClone.cpuShare)
			val ioBuilder = IoBuilder()
			ioBuilder.threads(vmClone.ioThreadsEnabled)
			vmBuilder.io(ioBuilder)
			val virtioScsiBuilder = VirtioScsiBuilder()
			virtioScsiBuilder.enabled(vmClone.virtioScsiEnabled)
			vmBuilder.virtioScsi(virtioScsiBuilder)
			if ("" != vmClone.deviceSource) {
				val rngDeviceBuilder = RngDeviceBuilder()
				val rateBuilder = RateBuilder()
				rateBuilder.period(vmClone.periodDuration)
				rateBuilder.bytes(vmClone.bytesPerPeriod)
				rngDeviceBuilder.source(RngSource.fromValue(vmClone.deviceSource))
				vmBuilder.rngDevice(rngDeviceBuilder)
			}
			response = systemService.vmsService().addFromSnapshot().vm(vmBuilder).send().vm()
			if (vmClone.bootImageUse) {
				vmClone.bootImage = vmClone.bootImage.replace(" ".toRegex(), "%20")
				val fileBuilder = FileBuilder()
					.id(vmClone.bootImage)
				val cdromBuilder = CdromBuilder()
					.file(fileBuilder)

				systemService.vmsService().vmService(response.id()).cdromsService().add().cdrom(cdromBuilder).send()
			}
			do {
				Thread.sleep(5000L)
			} while (systemService.vmsService().list().search(" id=" + response.id()).send().vms().size == 0 &&
				systemService.vmsService().vmService(response.id()).get().send().vm().status() != VmStatus.DOWN
			)
			val gson = Gson()
			val vm = VmVo().apply {
				id = response.id()
				name = response.name()
				comment = response.comment()
			}
			vm.cluster = c.findCluster(response.cluster().id())?.name() ?: ""
			vm.clusterId = response.cluster().id()
			vm.graphicProtocol = "VNC"
			vm.status = "created"
			websocketService.sendMessage("/topic/vms", gson.toJson(vm))
			val message = MessageVo.createMessage(MessageType.VIRTUAL_MACHINE_COPY, true, vm.name, "")
			websocketService.notify(message)
		} catch (e: Exception) {
			doLongSleep()
			log.error(e.localizedMessage)
			e.printStackTrace()
			val gson = Gson()
			val message = MessageVo.createMessage(
				MessageType.VIRTUAL_MACHINE_COPY, false,
				e.message!!, e.cause!!.localizedMessage
			)
			websocketService.sendMessage("/topic/notify", gson.toJson(message))
		}
	}

	override fun retrieveDiskProfiles(): List<DiskProfileVo> {
		log.info("... retrieveDiskProfiles")
		val c = connectionService.getConnection()
		val items: List<DiskProfile> = 
			c.findAllDiskProfiles()
		return items.toDiskProfileVos(c)
	}

	override fun retrieveVmSnapshots(id: String): List<SnapshotVo> {
		log.info("... retrieveVmSnapshots('{}')", id)
		val c = connectionService.getConnection()
		val snapshots
				: List<Snapshot> = c.findAllSnapshotsFromVm(id)
		return snapshots.toSnapshotVos(c)
	}

	override fun createSnapshot(snapshot: SnapshotVo) {
		log.info("... createSnapshot")
		val c = connectionService.getConnection()
		val diskAttachments
				: List<DiskAttachment> = c.findAllDiskAttachmentsFromVm(snapshot.vmId)

		val attachments: MutableList<DiskAttachment> = ArrayList()
		for (diskAttachment in diskAttachments) {
			for ((id) in snapshot.disks) {
				if (id == diskAttachment.id()) attachments.add(diskAttachment)
			}
		}
		val s = Builders.snapshot().description(snapshot.description)
			.diskAttachments(attachments).build()
		val res
				: Boolean = c.addSnapshotFromVm(snapshot.vmId, s)
		log.info("createSnapshot ... res: $res")
	}

	override fun previewSnapshot(snapshot: SnapshotVo) {
		log.info("previewSnapshot ... vmId:" + snapshot.vmId + ", snapshot id:" + snapshot.id + ", memoryRestored:" + snapshot.memoryRestore)
		val c = connectionService.getConnection()
		val previewSnapshot: Snapshot? =
			c.findSnapshotFromVm(snapshot.vmId, snapshot.id)
		if (previewSnapshot == null) {
			log.error("something went WRONG ... reason: NO previous snapshot found")
			return
		}
		val res: Boolean =
			c.previewSnapshotFromVm(snapshot.vmId, previewSnapshot, snapshot.memoryRestore)
		log.info("previewSnapshot ... res: $res")
	}

	override fun commitSnapshot(vmId: String) {
		log.info("... commitSnapshot('$vmId')")
		val c = connectionService.getConnection()
		val res: Boolean =
			c.commitSnapshotFromVm(vmId)
		log.info("commitSnapshot ... res: $res")
	}

	override fun undoSnapshot(vmId: String) {
		log.info("... undoSnapshot('{}')", vmId)
		val c = connectionService.getConnection()
		val res: Boolean =
			c.undoSnapshotFromVm(vmId)
		log.info("undoSnapshot ... res: $res")
	}


	override fun removeSnapshot(snapshot: SnapshotVo) {
		log.info("... removeSnapshot")
		val c = connectionService.getConnection()
		val res: Boolean =
			c.removeSnapshotFromVm(snapshot.vmId, snapshot.id)
		log.info("... removeSnapshot ... res: $res")
	}


	override fun retrieveDiscs(): List<StorageDomainVo> {
		log.info("... retrieveDiscs")
		val c = connectionService.getConnection()
		val storageDomainList : List<StorageDomain> =
			c.findAllStorageDomains()
		val disks: List<Disk> =
			c.findAllDisks()

		val discs: List<StorageDomainVo> = storageDomainList.filter {
			it.typePresent() && it.type().value() == "iso"
		}.map {
			c.findAllFilesFromStorageDomain(it.id()).toStorageDomainVosUsingFiles()
		}.flatten() + disks.toStorageDomainVosUsingDisks()
		return discs
	}

	@Async("karajanTaskExecutor")
	override fun changeDisc(vm: VmVo) {
		log.info("... changeDisc")
		val c = adminConnectionService.getConnection()
		val vmId = vm.id
		val vmCdroms
				: List<Cdrom> = c.findAllVmCdromsFromVm(vmId)
		val fb = Builders.file().id(if ("eject" == vm.disc) "" else vm.disc)
		val cdrom = Builders.cdrom().file(fb).build()
		val res
				: Boolean = c.updateVmCdromFromVm(vm.id, vmCdroms[0].id(), cdrom)

		val vmName
				: String = c.findVm(vmId)?.name() ?: ""
		val message = MessageVo.createMessage(MessageType.CHANGE_CD_ROM, res, vmName, "")
		websocketService.notify(message)
	}

	override fun retrieveVmsTop(totalVms: List<VmVo>): List<DashboardTopVo> {
		log.info("... retrieveVmsTop")
		val data: MutableList<DashboardTopVo> = arrayListOf()
		val vmCpuParamMap: MutableMap<String, Int> = hashMapOf()
		val vmMemoryParamMap: MutableMap<String, Int> = hashMapOf()
		var i = 0
		while (i < totalVms.size) {
			vmCpuParamMap[totalVms[i].name] = totalVms[i].cpuUsage[0][1].toInt()
			vmMemoryParamMap[totalVms[i].name] = totalVms[i].memoryUsage[0][1].toInt()
			i++
		}
		val vmCpuKeyList = totalVms.toVmCpuKeys().toMutableList()
		val vmCpuValList = totalVms.toVmCpuVals().toMutableList()
		val vmMemoryKeyList = totalVms.toVmMemoryKeys().toMutableList()
		val vmMemoryValList = totalVms.toVmMemoryVals().toMutableList()

		var index = 0
		for (key in vmMemoryKeyList) {
			vmMemoryValList.add(index, vmMemoryParamMap[key].toString())
			index++
		}
		i = vmCpuKeyList.size
		while (i < 3) {
			vmCpuKeyList.add(index, "N/A")
			vmCpuValList.add(index, "0")
			vmMemoryKeyList.add(index, "N/A")
			vmMemoryValList.add(index, "0")
			i++
		}
		val dashboardTopVo = totalVms.toDashboardTopVo()
		data.add(dashboardTopVo)
		return data
	}
	
	companion object {
		private val log by LoggerDelegate()
	}
}