package com.itinfo.rutilvm.api.model.computing

import com.itinfo.rutilvm.api.configuration.PropertiesConfig
import com.itinfo.rutilvm.common.formatEnhanced
import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.common.ovirtDf
import com.itinfo.rutilvm.util.ovirt.*
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.types.*
import org.slf4j.LoggerFactory
import java.io.Serializable
import java.math.BigDecimal
import java.util.Date

private val log = LoggerFactory.getLogger(DashboardVo::class.java)

/**
 * [DashboardVo]
 * 대시보드 그래프
 *
 * @property datacenters [Int]
 * @property datacentersUp [Int]
 * @property datacentersDown [Int]
 * @property clusters [Int]
 * @property hosts [Int]
 * @property hostsUp [Int]
 * @property hostsDown [Int]
 * @property vms [Int]
 * @property vmsUp [Int]
 * @property vmsDown [Int]
 * @property storageDomains [Int]
 * @property storageDomainsUp [Int]
 * @property storageDomainsDown [Int]
 * @property events [Int]
 * @property eventsAlert [Int]
 * @property eventsError [Int]
 * @property eventsWarning [Int]
 * @property _dateCreated [Date]
 * @property _timeElapsed [BigDecimal]
 * @property version [String]
 * @property releaseDate [String]
 */
class DashboardVo (
    val datacenters: Int = 0,
    val datacentersUp: Int = 0,
    val datacentersDown: Int = 0,
    val clusters: Int = 0,
    val hosts: Int = 0,
    val hostsUp: Int = 0,
    val hostsDown: Int = 0,
    val vms: Int = 0,
    val vmsUp: Int = 0,
    val vmsDown: Int = 0,
    val storageDomains: Int = 0,
    val storageDomainsUp: Int = 0,
    val storageDomainsDown: Int = 0,
    val events: Int = 0,
    val eventsAlert: Int = 0,
    val eventsError: Int = 0,
    val eventsWarning: Int = 0,
	private val _dateCreated: Date? = null,
	private val _timeElapsed: BigDecimal? = BigDecimal.ZERO,
    val version: String = "",
	val releaseDate: String = "",

): Serializable {
    override fun toString(): String =
        gson.toJson(this)

	val dateCreated: String
		get() = ovirtDf.formatEnhanced(_dateCreated)

	val timeElapsedInMilli: Long
		get() = _timeElapsed?.toLong()?.times(1000L) ?: 0L
	val dateBooted: String
		get() = if (timeElapsedInMilli <= 0L) "N/A"
			else ovirtDf.formatEnhanced(
				Date((Date().time - timeElapsedInMilli))
			)

    class Builder {
        private var bDatacenters: Int = 0; fun datacenters(block: () -> Int?) { bDatacenters = block() ?: 0}
        private var bDatacentersUp: Int = 0; fun datacentersUp(block: () -> Int?) { bDatacentersUp = block() ?: 0}
        private var bDatacentersDown: Int = 0; fun datacentersDown(block: () -> Int?) { bDatacentersDown = block() ?: 0}
        private var bClusters: Int = 0; fun clusters(block: () -> Int?) { bClusters = block() ?: 0}
        private var bHosts: Int = 0; fun hosts(block: () -> Int?) { bHosts = block() ?: 0}
        private var bHostsUp: Int = 0; fun hostsUp(block: () -> Int?) { bHostsUp = block() ?: 0}
        private var bHostsDown: Int = 0; fun hostsDown(block: () -> Int?) { bHostsDown = block() ?: 0}
        private var bVms: Int = 0; fun vms(block: () -> Int?) { bVms = block() ?: 0}
        private var bVmsUp: Int = 0; fun vmsUp(block: () -> Int?) { bVmsUp = block() ?: 0}
        private var bVmsDown: Int = 0; fun vmsDown(block: () -> Int?) { bVmsDown = block() ?: 0}
        private var bStorageDomains: Int = 0; fun storageDomains(block: () -> Int?) { bStorageDomains = block() ?: 0}
        private var bStorageDomainsUp: Int = 0; fun storageDomainsUp(block: () -> Int?) { bStorageDomainsUp = block() ?: 0}
        private var bStorageDomainsDown: Int = 0; fun storageDomainsDown(block: () -> Int?) { bStorageDomainsDown = block() ?: 0}
        private var bEvents: Int = 0; fun events(block: () -> Int?) { bEvents = block() ?: 0}
        private var bEventAlert: Int = 0; fun eventsAlert(block: () -> Int?) { bEventAlert = block() ?: 0}
        private var bEventError: Int = 0; fun eventsError(block: () -> Int?) { bEventError = block() ?: 0}
        private var bEventsWarning: Int = 0; fun eventsWarning(block: () -> Int?) { bEventsWarning = block() ?: 0}
        private var bDateCreated: Date? = null; fun dateCreated(block: () -> Date?) { bDateCreated = block() }
		private var bTimeElapsed: BigDecimal = BigDecimal.ZERO; fun timeElapsed(block: () -> BigDecimal?) { bTimeElapsed = block() ?: BigDecimal.ZERO }
        private var bVersion: String = ""; fun version(block: () -> String?) { bVersion = block() ?: "" }
        private var bReleaseDate: String = ""; fun releaseDate(block: () -> String?) { bReleaseDate = block() ?: "" }

        fun build(): DashboardVo = DashboardVo(bDatacenters, bDatacentersUp, bDatacentersDown, bClusters, bHosts, bHostsUp, bHostsDown, bVms, bVmsUp, bVmsDown, bStorageDomains, bStorageDomainsUp, bStorageDomainsDown, bEvents, bEventAlert, bEventError, bEventsWarning, bDateCreated, bTimeElapsed, bVersion, bReleaseDate)
    }

    companion object {
        inline fun builder(block: Builder.() -> Unit): DashboardVo = DashboardVo.Builder().apply(block).build()
    }
}

fun Connection.toDashboardVo(propConfig: PropertiesConfig): DashboardVo {
    val allDataCenters = this.findAllDataCenters().getOrDefault(listOf())
    val allHosts = this.findAllHosts().getOrDefault(listOf())
    val allVms = this.findAllVms(follow="statistics").getOrDefault(listOf())
    val allClusters = this.findAllClusters().getOrDefault(listOf())
    val allStorageDomains = this.findAllStorageDomains().getOrDefault(listOf())
	val allEvents = this.findAllEvents("severity > normal and time > Today sortby time desc")
		.getOrDefault(listOf())

    // 각 상태별 카운트를 필터링하여 계산
	val (dataCenterUpList, dataCenterDownList) = allDataCenters.partition { it.status() == DataCenterStatus.UP }
	val (hostUpList, hostDownList) = allHosts.partition { it.status() == HostStatus.UP }
	val (vmUpList, vmDownList) = allVms.partition { it.status() == VmStatus.UP }

    // 스토리지 도메인 필터링 (GLANCE 제외)
	val std = allStorageDomains.filter { it.storage().type() != StorageType.GLANCE  }
	val (storageDomainUpList, storageDomainDownList) = std.partition { it.status() != StorageDomainStatus.UNATTACHED}

    // 이벤트 필터링
    val eventsAlert = allEvents.count { it.severity() == LogSeverity.ALERT }
    val eventsError = allEvents.count { it.severity() == LogSeverity.ERROR }
    val eventsWarning = allEvents.count { it.severity() == LogSeverity.WARNING }
    val eventsTotal = eventsAlert + eventsError + eventsWarning

    // 관리형 호스티드 엔진 VM의  최초생성 시간 가져오기
	val vmHostedEngine: Vm? = allVms.firstOrNull { it.isHostedEngineVm }
	val timeElapsed: BigDecimal = vmHostedEngine?.statistics()?.firstOrNull {
		it.name() == "elapsed.time"
	}?.values()?.firstOrNull()?.datum() ?: BigDecimal.ZERO

    return DashboardVo.builder {
        datacenters { allDataCenters.size }
        datacentersUp { dataCenterUpList.size }
        datacentersDown { dataCenterDownList.size }
        clusters { allClusters.size }
        hosts { allHosts.size }
        hostsUp { hostUpList.size }
        hostsDown { hostDownList.size }
        vms { allVms.size }
        vmsUp { vmUpList.size }
        vmsDown { vmDownList.size }
        storageDomains { std.size }
		storageDomainsUp { storageDomainUpList.size }
		storageDomainsDown { storageDomainDownList.size }
        events { eventsTotal }
        eventsAlert { eventsAlert }
        eventsError { eventsError }
        eventsWarning { eventsWarning }
		dateCreated { vmHostedEngine?.creationTime() }
		timeElapsed { timeElapsed }
        version { propConfig.version }
        releaseDate { propConfig.releaseDate }
    }
}
