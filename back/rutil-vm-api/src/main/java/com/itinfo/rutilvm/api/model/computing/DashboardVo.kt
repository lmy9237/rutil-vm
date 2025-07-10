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
 * @property datacenters
 * @property datacentersUp
 * @property datacentersDown
 * @property clusters
 * @property hosts
 * @property hostsUp
 * @property hostsDown
 * @property vms
 * @property vmsUp
 * @property vmsDown
 * @property events
 * @property eventsAlert
 * @property eventsError
 * @property eventsWarning
 * @property dateCreated 최초생성시간
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
        private var bEvents: Int = 0; fun events(block: () -> Int?) { bEvents = block() ?: 0}
        private var bEventAlert: Int = 0; fun eventsAlert(block: () -> Int?) { bEventAlert = block() ?: 0}
        private var bEventError: Int = 0; fun eventsError(block: () -> Int?) { bEventError = block() ?: 0}
        private var bEventsWarning: Int = 0; fun eventsWarning(block: () -> Int?) { bEventsWarning = block() ?: 0}
        private var bDateCreated: Date? = null; fun dateCreated(block: () -> Date?) { bDateCreated = block() }
		private var bTimeElapsed: BigDecimal = BigDecimal.ZERO; fun timeElapsed(block: () -> BigDecimal?) { bTimeElapsed = block() ?: BigDecimal.ZERO }
        private var bVersion: String = ""; fun version(block: () -> String?) { bVersion = block() ?: "" }
        private var bReleaseDate: String = ""; fun releaseDate(block: () -> String?) { bReleaseDate = block() ?: "" }

        fun build(): DashboardVo = DashboardVo(bDatacenters, bDatacentersUp, bDatacentersDown, bClusters, bHosts, bHostsUp, bHostsDown, bVms, bVmsUp, bVmsDown, bStorageDomains, bEvents, bEventAlert, bEventError, bEventsWarning, bDateCreated, bTimeElapsed, bVersion, bReleaseDate)
    }

    companion object {
        inline fun builder(block: DashboardVo.Builder.() -> Unit): DashboardVo = DashboardVo.Builder().apply(block).build()
    }
}

fun Connection.toDashboardVo(propConfig: PropertiesConfig): DashboardVo {
    val allDataCenters = this@toDashboardVo.findAllDataCenters().getOrDefault(listOf())
    val allHosts = this@toDashboardVo.findAllHosts().getOrDefault(listOf())
    val allVms = this@toDashboardVo.findAllVms(follow="statistics").getOrDefault(listOf())
    val allClusters = this@toDashboardVo.findAllClusters().getOrDefault(listOf())
    val allStorageDomains = this@toDashboardVo.findAllStorageDomains().getOrDefault(listOf())
//	val allEvents = this@toDashboardVo.findAllEvents("time > Today  sortby time desc").getOrDefault(listOf())
	val allEvents = this@toDashboardVo.findAllEvents("severity > normal and time > Today sortby time desc")
		.getOrDefault(listOf())
    // 각 상태별 카운트를 필터링하여 계산
    val dataCenters = allDataCenters.size
    val dataCentersUp = allDataCenters.count { it.status() == DataCenterStatus.UP }
    val dataCentersDown = dataCenters - dataCentersUp

    val hosts = allHosts.size
    val hostsUp = allHosts.count { it.status() == HostStatus.UP }
    val hostsDown = hosts - hostsUp

    val vms = allVms.size
    val vmsUp = allVms.count { it.status() == VmStatus.UP }
    val vmsDown = vms - vmsUp

    val clusters = allClusters.size

    // 스토리지 도메인 필터링 (GLANCE 제외)
    val storageDomains = allStorageDomains.count { it.storage().type() != StorageType.GLANCE }

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
        datacenters { dataCenters }
        datacentersUp { dataCentersUp }
        datacentersDown { dataCentersDown }
        clusters { clusters }
        hosts { hosts }
        hostsUp { hostsUp }
        hostsDown { hostsDown }
        vms { vms }
        vmsUp { vmsUp }
        vmsDown { vmsDown }
        storageDomains { storageDomains }
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
