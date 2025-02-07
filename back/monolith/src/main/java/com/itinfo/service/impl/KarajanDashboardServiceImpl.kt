package com.itinfo.service.impl

import com.google.gson.Gson
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.util.model.SystemPropertiesVo

import com.itinfo.controller.doSleep
import com.itinfo.findHost
import com.itinfo.findVm
import com.itinfo.migrateHostFromVm
import com.itinfo.model.MessageType
import com.itinfo.model.MessageVo.Companion.createMessage
import com.itinfo.model.karajan.ConsolidationVo
import com.itinfo.model.karajan.HostVo
import com.itinfo.model.karajan.KarajanVo
import com.itinfo.service.HostsService
import com.itinfo.service.KarajanDashboardService
import com.itinfo.service.SystemPropertiesService
import com.itinfo.service.consolidation.Ffd
import com.itinfo.service.engine.AdminConnectionService
import com.itinfo.service.engine.ConnectionService
import com.itinfo.service.engine.KarajanService
import com.itinfo.service.engine.WebsocketService

import org.ovirt.engine.sdk4.types.Host
import org.ovirt.engine.sdk4.types.Vm
import org.ovirt.engine.sdk4.types.VmStatus

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Service

import java.util.stream.Collectors


@Service
class KarajanDashboardServiceImpl : KarajanDashboardService {
	@Autowired private lateinit var connectionService: ConnectionService
	@Autowired private lateinit var adminConnectionService: AdminConnectionService
	@Autowired private lateinit var karajanService: KarajanService
	@Autowired private lateinit var ffd: Ffd
	@Autowired private lateinit var websocketService: WebsocketService
	@Autowired private lateinit var systemPropertiesService: SystemPropertiesService
	@Autowired private lateinit var hostsService: HostsService

	override fun retrieveDataCenterStatus(): KarajanVo {
		log.info("... retrieveDataCenterStatus")
		return karajanService.getDataCenter()
	}

	override fun consolidateVm(clusterId: String): List<ConsolidationVo> {
		log.info("... consolidateVm('$clusterId')")
		val karajan = karajanService.getDataCenter()
		return ffd.optimizeDataCenter(karajan, clusterId)
	}

	override fun migrateVm(hostId: String, vmId: String): String {
		log.info("... migrateVm('$hostId', '$vmId')")
		val c = connectionService.getConnection()
		try {
			c.findHost(hostId)?.let {
				c.migrateHostFromVm(vmId, it)
				doSleep(2000L)
			}
			return VmStatus.MIGRATING.value()
		} catch (e: Exception) {
			e.printStackTrace()
			log.error(e.localizedMessage)
			return e.message ?: "에러"
		}
	}

	@Async("karajanTaskExecutor")
	override fun publishVmStatus(hostId: String, vmId: String) {
		log.info("... publishVmStatus('$hostId', '$vmId')")
		val c = adminConnectionService.getConnection()
		var vm: Vm?
		do {
			doSleep(3000L)
			vm = c.findVm(vmId)
		} while (vm?.status() != VmStatus.UP)
		notify(vm.name(), if (hostId == vm.host().id()) "success" else "error")
	}

	@Async("karajanTaskExecutor")
	override fun relocateVms(consolidations: List<ConsolidationVo>) {
		log.info("... relocateVms[${consolidations.size}]")
		val c = adminConnectionService.getConnection()
		var vm: Vm?
		for ((hostId, _, vmId, vmName) in consolidations) {
			c.findHost(hostId)?.let {
				try {
					c.migrateHostFromVm(vmId, it)
				} catch (e: Exception) {
					notify(vmName, "error")
				}		
			}

			do {
				doSleep(3000L)
				vm = c.findVm(vmId)
			} while (vm?.status() != VmStatus.UP)
			if (hostId == vm.host().id()) {
				notify(vm.name(), "success")
				continue
			}
			notify(vm.name(), "error")
		}

		val properties: SystemPropertiesVo  = 
			systemPropertiesService.retrieveSystemProperties()
		if (properties.symphonyPowerControll) 
			turnOffHosts(consolidations)
	}

	private fun turnOffHosts(consolidations: List<ConsolidationVo>) {
		log.info("... turnOffHosts")
		val karajan: KarajanVo = 
			karajanService.getDataCenter()
		for ((_, _, _, hosts) in karajan.clusters) {
			for ((id) in hosts) {
				if (consolidations.first().hostId == id) {
					val turnOffHosts = hosts.filter { target: HostVo -> target.vms.isEmpty() }
					hostsService.shutdownHost(turnOffHosts)
				}
			}
		}
	}

	private fun notify(vmName: String, status: String) {
		val message = if ("success" == status) createMessage(MessageType.VIRTUAL_MACHINE_RELOCATE, true, vmName, "")
		else createMessage(MessageType.VIRTUAL_MACHINE_RELOCATE, false, vmName, "")
		websocketService.sendMessage(
			if ("success" == status)
				"/topic/migrateVm"
			else "/topic/notify",
				Gson().toJson(message)
		)
	}
	
	companion object {
		private val log by LoggerDelegate()
	}
}