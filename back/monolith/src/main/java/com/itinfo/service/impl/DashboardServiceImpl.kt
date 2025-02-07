package com.itinfo.service.impl

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.dao.DashboardDao
import com.itinfo.OvirtStatsName
import com.itinfo.findAllHosts
import com.itinfo.findAllVms
import com.itinfo.findAllStorageDomains
import com.itinfo.findAllStatisticsFromHost
import com.itinfo.findAllNicsFromHost
import com.itinfo.findAllEvents

import com.itinfo.model.DataCenterVo
import com.itinfo.model.UsageVo
import com.itinfo.model.HostVo
import com.itinfo.model.EventVo
import com.itinfo.model.toEventVos
import com.itinfo.model.DataCenterVo.Companion.simpleSetup
import com.itinfo.service.DashboardService
import com.itinfo.service.engine.ConnectionService

import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.types.*

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

import java.math.BigDecimal

@Service
class DashboardServiceImpl : DashboardService {
	@Autowired private lateinit var connectionService: ConnectionService
	@Autowired private lateinit var dashboardDao: DashboardDao
	
	private var dcv: DataCenterVo? = null
	private val usageVos: MutableList<UsageVo> = arrayListOf()
	
	override fun retrieveDataCenterStatus(): DataCenterVo {
		log.info("... retrieveDataCenterStatus")
		val c = connectionService.getConnection()
		dcv = simpleSetup(c)
		getHosts(c)
		return dcv!!
	}

	private fun getHosts(conn: Connection) {
		log.info("... getHosts")
		var hosts = conn.findAllHosts("status!=up")
		dcv?.hostsDown = hosts.size
		hosts = conn.findAllHosts("status=up")
		dcv?.hostsUp = hosts.size
		val ids: MutableList<String> = ArrayList()
		val interfaceIds: MutableList<String> = ArrayList()
		var sumTotalCpu = 0
		for (host in hosts) {
			val stats = conn.findAllStatisticsFromHost(host.id())
			stats.forEach { stat: Statistic ->
				if (stat.name() == OvirtStatsName.MEMORY_TOTAL) dcv?.memoryTotal =
					dcv?.memoryTotal?.add(stat.values().first().datum()) ?: BigDecimal.ZERO
				if (stat.name() == OvirtStatsName.MEMORY_USED) dcv?.memoryUsed =
					dcv?.memoryUsed?.add(stat.values().first().datum()) ?: BigDecimal.ZERO
				if (stat.name() == OvirtStatsName.MEMORY_FREE) dcv?.memoryFree =
					dcv?.memoryFree?.add(stat.values().first().datum()) ?: BigDecimal.ZERO
				if (stat.name() == OvirtStatsName.KCM_CPU_CURRENT)

				if (stat.name() == OvirtStatsName.CPU_CURRENT_USER) dcv?.cpuCurrentUser =
					dcv?.cpuCurrentUser?.plus(stat.values().first().datum().toDouble()) ?: 0.0
				if (stat.name() == OvirtStatsName.CPU_CURRENT_SYSTEM) dcv?.cpuCurrentSystem =
					dcv?.cpuCurrentSystem?.plus(stat.values().first().datum().toDouble()) ?: 0.0
				if (stat.name() == "cpu.current.idle") dcv?.cpuCurrentIdle =
					dcv?.cpuCurrentIdle?.plus(stat.values()[0].datum().toDouble()) ?: 0.0
			}
			sumTotalCpu +=
				host.cpu().topology().cores().toInt() *
				host.cpu().topology().sockets().toInt() *
				host.cpu().topology().threads().toInt()
			val vms = conn.findAllVms("host=${host.name()}")
			var sumCpu = 0
			for (vm in vms) sumCpu += vm.cpu().topology().cores().toInt() *
					vm.cpu().topology().sockets().toInt() * vm.cpu().topology().threads().toInt()
			dcv?.usingcpu = sumCpu
			val nics = conn.findAllNicsFromHost(host.id())
			interfaceIds.addAll(nics.map { it.id() })
			ids.add(host.id())
		}
		dcv?.totalcpu = sumTotalCpu
		if (ids.isNotEmpty()) {
			val hostStat = dashboardDao.retrieveHosts(ids)
			if (hostStat.size > 0) hostStat.forEach { (_, _, _, historyDatetime, _, memoryUsagePercent, cpuUsagePercent): HostVo ->
				val usageVo = UsageVo()
				usageVo.cpuUsages = cpuUsagePercent
				usageVo.memoryUsages = memoryUsagePercent
				usageVo.usageDate = historyDatetime
				usageVos.add(usageVo)
			}
		}
		if (interfaceIds.size > 0) {
			val hostInterfaces = dashboardDao.retrieveHostsInterface(interfaceIds)
			if (hostInterfaces.size > 0) for (i in hostInterfaces.indices) {
				usageVos[i].receiveUsages = hostInterfaces[i].receiveRatePercent
				usageVos[i].transitUsages = hostInterfaces[i].transmitRatePercent
			}
		}
		getStorageDomains(conn)
	}

	private fun getStorageDomains(connection: Connection) {
		log.info("... getStorageDomains")
		val dcvT = dcv ?: run {
			log.error("dcv NOT defined!")
		}
		var storageDomains = 
			connection.findAllStorageDomains("status=unattached")
		storageDomains.forEach { storageDomain: StorageDomain ->
			if (storageDomain.type().name == "DATA") 
				dcv?.storagesUnattached = dcv?.storagesUnattached?.plus(1) ?: 0
		}
		storageDomains = 
			connection.findAllStorageDomains("status=active")
		val storageIds: MutableList<String> = ArrayList()
		storageDomains.forEach { storageDomain: StorageDomain ->
			if (storageDomain.type().name == "DATA") {
				dcv?.storageAvaliable =
					if (dcv?.storageAvaliable != null) dcv?.storageAvaliable?.add(storageDomain.available()) ?: storageDomain.available() else storageDomain.available()
				dcv?.storageUsed =
					if (dcv?.storageUsed != null) dcv?.storageUsed?.add(storageDomain.used()) ?: storageDomain.used() else storageDomain.used()
				storageIds.add(storageDomain.id())
			}
		}
		dcv?.storagesActive = storageIds.size
		if (storageIds.size > 0) {
			val storages = dashboardDao.retrieveStorages(storageIds)
			if (storages.size > 0) for (j in storages.indices) {
				usageVos[j].storageUsages =
					storages[j].usedDiskSizeGb * 100 / (storages[j].availableDiskSizeGb + storages[j].usedDiskSizeGb)
				usageVos[j].storageUsageDate = storages[j].historyDatetime
			}
		}
		dcv?.usageVos = usageVos
	}

	@Deprecated("")
	private fun getVms(c: Connection) {
		var vms: List<Vm> = 
			c.findAllVms("status!=up")
		dcv?.vmsDown = vms.size
		vms = 
			c.findAllVms("status=up")
		dcv?.vmsUp = vms.size
	}

	override fun retrieveEvents(): List<EventVo> {
		log.info("... retrieveEvents")
		val c = connectionService.getConnection()
		val items = c.findAllEvents("time>today")
		return items.toEventVos()
	}
	
	companion object {
		private val log by LoggerDelegate()
	}
}