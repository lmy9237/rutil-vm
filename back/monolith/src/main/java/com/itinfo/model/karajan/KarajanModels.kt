package com.itinfo.model.karajan

import com.itinfo.SystemServiceHelper
import com.itinfo.rutilvm.util.model.SystemPropertiesVo
import com.itinfo.findAllClusters
import com.itinfo.findAllHosts
import com.itinfo.findAllVms
import com.itinfo.findAllStatisticsFromHost
import com.itinfo.findAllStatisticsFromVm

import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.types.Cluster
import org.ovirt.engine.sdk4.types.Host
import org.ovirt.engine.sdk4.types.Statistic
import org.ovirt.engine.sdk4.types.Vm

import org.springframework.jdbc.core.JdbcTemplate

import java.math.BigDecimal
import java.math.BigInteger
import java.util.function.Consumer

private val sysSrvH: SystemServiceHelper
	get() = SystemServiceHelper.getInstance()
data class KarajanVo(
	var clusters: List<ClusterVo> = listOf()
	, var cpuThreshold: Int = -1
	, var memoryThreshold: Int = -1
)

fun SystemPropertiesVo.toKarajanVo(connection: Connection): KarajanVo {
	val clusters: List<Cluster> =
		connection.findAllClusters()
	val tgtClusters: List<ClusterVo> =
		clusters.toClusterVos(connection)
	return KarajanVo(
		tgtClusters,
		cpuThreshold,
		memoryThreshold
	)
}

data class ClusterVo(
	var id: String = ""
	, var name: String = ""
	, var cpuType: String = ""
	, var hosts: List<HostVo> = listOf()
	, var vms: List<WorkloadVmVo> = listOf()
)

fun Cluster.toClusterVo(c: Connection): ClusterVo {
	val hosts2Add: List<Host> =
		c.findAllHosts("cluster=${name()}")
	val hostVos2Add: List<HostVo> =
		hosts2Add.toHostVos(c)
	val vms2Add: List<Vm> =
		c.findAllVms("cluster=${name()}")
	val workloadVos2Add: List<WorkloadVmVo> =
		vms2Add.toWorkloadVmVos(c)

	return ClusterVo(
		if (idPresent()) id() else ""				// id
		, if (namePresent()) name() else ""			// name
		, if (cpuPresent() &&
			cpu().typePresent()) cpu().type() else ""		// cpuType
		, hostVos2Add		// hosts
		, workloadVos2Add	// vms
	)
}

fun List<Cluster>.toClusterVos(connection: Connection): List<ClusterVo>
	= this.map { it.toClusterVo(connection) }


data class ConsolidationVo(
	var hostId: String = ""
	, var hostName: String = ""
	, var vmId: String = ""
	, var vmName: String = ""
	, var fromHostId: String = ""
	, var fromHostName: String = ""
	, var description: String = ""
)

fun List<HostVo>.findHostId(vmId: String): String {
	var hostId = ""
	for (host in this) {
		val vmInfo = host.vms
		val vmIdFound = vmInfo.firstOrNull { vmi -> vmi.id == vmId }
		hostId = vmIdFound?.id ?: ""
	}
	return hostId
}

fun List<HostVo>.findHostname(vmId: String): String {
	var hostname = ""
	for (host in this) {
		val vmInfo = host.vms
		val vmIdFound = vmInfo.firstOrNull { vmi -> vmi.id == vmId }
		hostname = vmIdFound?.hostName ?: ""
	}
	return hostname
}

fun VmVo.toConsolidationVo(
	vmDesc: String = "",
	host: HostVo? = null
): ConsolidationVo = ConsolidationVo(
	host?.id ?: this.hostId,
	host?.name ?: hostName,
	id,
	name,
	"",
	"",
	if (placementPolicy == "pinned") "호스트에 고정된 가상머신입니다." else vmDesc
)

fun VmVo.toConsolidationVoPostMigration(hosts: List<HostVo>, srcVmId: String): ConsolidationVo = ConsolidationVo(
	hosts.findHostId(srcVmId),
	hosts.findHostname(srcVmId),
	id,
	name,
	hostId,
	hostName,
	"",
)

fun VmVo.toConsolidationVoWithSpecificHost(host: HostVo) : ConsolidationVo = ConsolidationVo(
	host.id,
	host.name,
	id,
	name,
	hostId,
	hostName,
	""
)





data class HistoryVo(
	var historyDatetime: String = ""
	, var cpuUsagePercent: Int = -1
	, var memoryUsagePercent: Int = -1
	, var memoryUsage: BigDecimal = BigDecimal.ZERO
)
data class HostVo(
	var id: String = "",
	var name: String = "",
	var status: String = "",
	var clusterId: String = "",
	var cores: Int = 0,
	var sockets: Int = 0,
	var threads: Int = 0,
	var cpuVmUsed: Int = 0,
	var cpuCurrentUser: Double = 0.0,
	var cpuCurrentSystem: Double = 0.0,
	var cpuCurrentIdle: Double = 0.0,
	var maxSchedulingMemory: BigInteger = BigInteger.ZERO,
	var memoryTotal: BigDecimal = BigDecimal.ZERO,
	var memoryUsed: BigDecimal = BigDecimal.ZERO,
	var memoryFree: BigDecimal = BigDecimal.ZERO,
	var vms: List<VmVo> = listOf()
)

fun Host.toHostVo(c: Connection): HostVo {
	val vms: List<Vm> =
		c.findAllVms("Hosts.name=${name()}").filter {
			it.cpuPresent() && it.cpu().topologyPresent()
		}
	val vmVos: List<VmVo> =
		vms.toVmVos(c)
	val cpuVmUsed: Int =
		vmVos.map { it.cores + it.sockets + it.threads }.reduceOrNull { acc, i -> acc + i } ?: 0
	val stats =
		c.findAllStatisticsFromHost(id())
	stats.forEach(Consumer { _: Statistic? ->

	})

	return HostVo(
		id(),
		name(),
		status().value(),
		cluster().id(),
		if (cpu().topologyPresent() &&
			cpu().topology().coresAsInteger() != null) cpu().topology().coresAsInteger() else 0,
		if (cpu().topologyPresent() &&
			cpu().topology().socketsAsInteger() != null) cpu().topology().socketsAsInteger() else 0,
		if (cpu().topologyPresent() &&
			cpu().topology().threadsAsInteger() != null) cpu().topology().threadsAsInteger() else 0,
		cpuVmUsed,
		0.0,
		0.0,
		0.0,
		maxSchedulingMemory(),
		BigDecimal.ZERO,
		BigDecimal.ZERO,
		BigDecimal.ZERO,
		vmVos,
	)
}

fun List<Host>.toHostVos(connection: Connection): List<HostVo>
	= this.map { it.toHostVo(connection) }


data class VmVo(
	var id: String = ""
	, var name: String = ""
	, var status: String = ""
	, var hostId: String = ""
	, var hostName: String = ""
	, var cores: Int = -1
	, var sockets: Int = -1
	, var threads: Int = -1
	, var cpuCurrentGuest: Double = -1.0
	, var cpuCurrentHypervisor: Double = -1.0
	, var cpuCurrentTotal: Double = -1.0
	, var memoryInstalled: BigDecimal = BigDecimal.ZERO
	, var memoryUsed: BigDecimal = BigDecimal.ZERO
	, var memoryFree: BigDecimal = BigDecimal.ZERO
	, var memoryBuffered: BigDecimal = BigDecimal.ZERO
	, var memoryCached: BigDecimal = BigDecimal.ZERO
	, var placementPolicy: String = ""
)

fun Vm.toVmVo(connection: Connection) : VmVo {
	val stats = connection.findAllStatisticsFromVm(id())
	stats.forEach(Consumer { _: Statistic? ->
	})

	return VmVo(
		id(),
		name(),
		status().value(),
		if (hostPresent() &&
			host().idPresent()) host().id() else "",
		if (hostPresent() &&
			host().namePresent()) host().name() else "",
		if (cpuPresent() &&
			cpu().topologyPresent() &&
			cpu().topology().coresAsInteger() != null) cpu().topology().coresAsInteger() else 0,
		if (cpuPresent() &&
			cpu().topologyPresent() &&
			cpu().topology().socketsAsInteger() != null) cpu().topology().socketsAsInteger() else 0,
		if (cpuPresent() &&
			cpu().topologyPresent() &&
			cpu().topology().threadsAsInteger() != null) cpu().topology().threadsAsInteger() else 0,
		0.0,
		0.0,
		0.0,
		BigDecimal.ZERO,
		BigDecimal.ZERO,
		BigDecimal.ZERO,
		BigDecimal.ZERO,
		BigDecimal.ZERO,
		placementPolicy().affinity().value()
	)
}

fun List<Vm>.toVmVos(connection: Connection): List<VmVo> =
	this.map { it.toVmVo(connection) }

data class WorkloadVmVo(
	var id: String = ""
	, var name: String = ""
	, var status: String = ""
	, var hostId: String? = ""
	, var hostName: String? = ""
	, var cores: Int = 0
	, var sockets: Int = 0
	, var threads: Int = 0
	, var memoryInstalled: BigDecimal = BigDecimal.ZERO
	, var histories: List<HistoryVo> = arrayListOf()
)

fun Vm.toWorkloadVmVo(connection: Connection, jdbcTemplate: JdbcTemplate? = null): WorkloadVmVo {
	val stats: List<Statistic> =
		connection.findAllStatisticsFromVm(id())
	val histories: List<HistoryVo>
		= arrayListOf()

	return WorkloadVmVo(
		if (idPresent()) id() else "",
		if (namePresent()) name() else "",
		if (statusPresent()) status().value() else "",
		if (hostPresent() &&
			host().idPresent()) host().id() else "",
		if (hostPresent() &&
			host().namePresent()) host().name() else "",
		if (cpuPresent() &&
			cpu().topologyPresent() &&
			cpu().topology().coresPresent()) cpu().topology().coresAsInteger() else 0,
		if (cpuPresent() &&
			cpu().topologyPresent() &&
			cpu().topology().socketsPresent()) cpu().topology().socketsAsInteger() else 0,
		if (cpuPresent() &&
			cpu().topologyPresent() &&
			cpu().topology().threadsPresent()) cpu().topology().threadsAsInteger() else 0,
		BigDecimal.ZERO,
		histories
	)
}

fun List<Vm>.toWorkloadVmVos(connection: Connection, jdbcTemplate: JdbcTemplate? = null)
	= this.map { it.toWorkloadVmVo(connection, jdbcTemplate) }

data class WorkloadVo(
	var clusters: List<ClusterVo> = arrayListOf(),
	var cpuThreshold: Int = 0,
	var memoryThreshold: Int = 0,
)

fun SystemPropertiesVo.toWorkloadVo(connection: Connection): WorkloadVo {
	val clusters: List<Cluster> =
		connection.findAllClusters()
	val tgtClusters: List<ClusterVo> =
		clusters.toClusterVos(connection)
	return WorkloadVo(
		tgtClusters,
		cpuThreshold,
		memoryThreshold
	)
}