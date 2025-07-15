package com.itinfo.rutilvm.api.repository.history.dto

import com.itinfo.rutilvm.api.GB
import com.itinfo.rutilvm.api.repository.history.entity.HostSamplesHistoryEntity
import com.itinfo.rutilvm.api.repository.history.entity.VmInterfaceSamplesHistoryEntity
import com.itinfo.rutilvm.api.repository.history.entity.VmSamplesHistoryEntity
import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.repository.engine.entity.VdsStatisticsEntity
import com.itinfo.rutilvm.api.repository.history.entity.StorageDomainSamplesHistoryEntity
import com.itinfo.rutilvm.util.ovirt.findAllHosts
import com.itinfo.rutilvm.util.ovirt.findAllStatisticsFromHost
import com.itinfo.rutilvm.util.ovirt.findAllVms
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern
import com.itinfo.rutilvm.util.ovirt.findVm
import com.itinfo.rutilvm.util.ovirt.findHost
import com.itinfo.rutilvm.util.ovirt.findStorageDomain
import com.itinfo.rutilvm.util.ovirt.findAllStorageDomains
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.types.StorageDomain
import org.ovirt.engine.sdk4.types.Vm
import org.ovirt.engine.sdk4.types.Host
import org.ovirt.engine.sdk4.types.VmStatus
import org.ovirt.engine.sdk4.types.Statistic
import java.sql.Timestamp

import java.time.LocalDateTime

//region: HostUsageDto
fun HostSamplesHistoryEntity.toHostUsageDto(): HostUsageDto {
    return HostUsageDto.builder {
        hostId { "${this@toHostUsageDto.hostId}" }
        historyDatetime { this@toHostUsageDto.historyDatetime }
        totalCpuUsagePercent { this@toHostUsageDto.cpuUsagePercent?.toDouble() }
        totalMemoryUsagePercent { this@toHostUsageDto.memoryUsagePercent?.toDouble() }
    }
}

fun List<HostSamplesHistoryEntity>.toHostUsageDtos(): List<HostUsageDto> =
    this@toHostUsageDtos.map { it.toHostUsageDto() }

fun List<Host>.toHostUsageDto(conn: Connection, hostSamplesHistoryEntities: List<HostSamplesHistoryEntity>): HostUsageDto {
    val hostAll: List<Host> = conn.findAllHosts().getOrDefault(listOf())
    val vmAll = conn.findAllVms().getOrDefault(listOf())
    val hostCnt = this@toHostUsageDto.size

    // 총 메모리 계산
    val totalMemoryGB: Double = hostAll.sumOf { it.memoryAsLong()?.toDouble() ?: 0.0 } / GB

    // 사용 중인 메모리 계산
    val usedMemoryGB = this@toHostUsageDto
        .asSequence() // 시퀀스를 사용해 지연 평가로 효율성 증가
        .flatMap { conn.findAllStatisticsFromHost(it.id()).getOrDefault(listOf()).asSequence() }
        .filter { it.name() == "memory.used" }
        .sumOf { it.values().firstOrNull()?.datum()?.toDouble() ?: 0.0 } / GB

	val totalCpuCore: Int = hostAll.sumOf { it.hostCpuCoreCount() }
	val commitCpuCore: Int = vmAll.sumOf { it.vmCpuCoreCount() }
	val usedCpuCore: Int = vmAll
		.filter { it.status() == VmStatus.UP }
		.sumOf { it.vmCpuCoreCount() }

    val freeMemoryGB = totalMemoryGB - usedMemoryGB

    val (totalCpuUsage, totalMemoryUsage, historyTime) =
        hostSamplesHistoryEntities.toHostUsageDtos()
            .fold(Triple(0.0, 0.0, null as LocalDateTime?)) { acc, usage ->
                Triple(acc.first + usage.totalCpuUsagePercent, acc.second + usage.totalMemoryUsagePercent, usage.historyDatetime)
    }

    return HostUsageDto.builder {
        historyDatetime { historyTime }
        totalCpuUsagePercent { Math.round(totalCpuUsage / hostCnt).toDouble() }
        totalMemoryUsagePercent { Math.round(totalMemoryUsage / hostCnt).toDouble() }
        totalMemoryGB { totalMemoryGB }
        usedMemoryGB { usedMemoryGB }
        freeMemoryGB { freeMemoryGB }
        totalCpuCore { totalCpuCore }
        commitCpuCore { commitCpuCore }
        usedCpuCore { usedCpuCore }
    }
}

fun Vm.vmCpuCoreCount(): Int {
	return if (this.cpuPresent()) {
		this.cpu().topology().coresAsInteger() *
			this.cpu().topology().socketsAsInteger() *
			this.cpu().topology().threadsAsInteger()
	} else 0
}

fun Host.hostCpuCoreCount(): Int {
	return if (this.cpuPresent()) {
		this.cpu().topology().coresAsInteger() *
			this.cpu().topology().socketsAsInteger() *
			this.cpu().topology().threadsAsInteger()
	} else 0
}


fun List<HostSamplesHistoryEntity>.toTotalCpuMemoryUsages(host: Host): List<HostUsageDto>  {
    val hostName = host.name()
    return this@toTotalCpuMemoryUsages.map {
        HostUsageDto.builder {
            hostName { hostName }
            historyDatetime { it.historyDatetime }
            totalCpuUsagePercent { it.cpuUsagePercent?.toDouble() }
            totalMemoryUsagePercent { it.memoryUsagePercent?.toDouble() }
        }
    }
}


//endregion


//region: LineDto
fun List<VmSamplesHistoryEntity>.toVmCpuLineDtos(conn: Connection): List<LineDto> {
    val vmDataMap = mutableMapOf<String, MutableList<Int>>()
    val vmTimeMap = mutableMapOf<String, MutableList<LocalDateTime>>()

    this@toVmCpuLineDtos.forEach {
		vmDataMap.computeIfAbsent(it.vmId.toString()) { mutableListOf() }.add(it.cpuUsagePercent ?: 0)
        vmTimeMap.computeIfAbsent(it.vmId.toString()) { mutableListOf() }.add(it.historyDatetime)
    }

    return vmDataMap.map { (vmId, dataList) ->
        val vm: Vm = conn.findVm(vmId)
            .getOrNull() ?: throw ErrorPattern.VM_NOT_FOUND.toException()
        LineDto.builder {
            name { vm.name() }
            dataList { dataList }
            time { vmTimeMap[vmId] ?: listOf() }
        }
    }
}

fun List<VmSamplesHistoryEntity>.toVmMemoryLineDtos(conn: Connection): List<LineDto> {
    val vmDataMap = mutableMapOf<String, MutableList<Int>>()
    val vmTimeMap = mutableMapOf<String, MutableList<LocalDateTime>>()

    this@toVmMemoryLineDtos.forEach {
		vmDataMap.computeIfAbsent(it.vmId.toString()) { mutableListOf() }.add(it.memoryUsagePercent ?: 0)
		vmTimeMap.computeIfAbsent(it.vmId.toString()) { mutableListOf() }.add(it.historyDatetime)
    }

    return vmDataMap.map { (vmId, dataList) ->
        val vm: Vm = conn.findVm(vmId)
            .getOrNull() ?: throw ErrorPattern.VM_NOT_FOUND.toException()
        LineDto.builder {
            name { vm.name() }
            dataList { dataList }
            time { vmTimeMap[vmId] ?: listOf() }
        }
    }
}


fun List<VmInterfaceSamplesHistoryEntity>.toVmNetworkLineDtos(conn: Connection): List<LineDto> {
    val vmDataMap = mutableMapOf<String, MutableList<Int>>()
    val vmTimeMap = mutableMapOf<String, MutableList<LocalDateTime>>()

    this@toVmNetworkLineDtos.forEach {
        vmDataMap.computeIfAbsent(it.vmId.toString()) { mutableListOf() }.add(it.networkUsagePer)
        vmTimeMap.computeIfAbsent(it.vmId.toString()) { mutableListOf() }.add(it.historyDatetime)
    }

    return vmDataMap.map { (vmId, dataList) ->
        val vm: Vm = conn.findVm(vmId)
            .getOrNull() ?: throw ErrorPattern.VM_NOT_FOUND.toException()
        LineDto.builder {
            name { vm.name() }
            dataList { dataList }
            time { vmTimeMap[vmId] ?: listOf() }
        }
    }
}
//endregion


//region: StorageDto
fun List<StorageDomain>.toStorageDto(conn: Connection): StorageUsageDto {
    val storageDomains: List<StorageDomain> =
        conn.findAllStorageDomains()
            .getOrDefault(listOf())
            .filter { it.availablePresent() }
    val free: Double = storageDomains.filter { it.availablePresent() }.sumOf { it.availableAsLong()?.toDouble() ?: 0.0 } / GB
    val used: Double = storageDomains.filter { it.usedPresent() }.sumOf { it.usedAsLong()?.toDouble() ?: 0.0 } / GB

    return StorageUsageDto.builder {
        totalGB { free + used }
        freeGB { free }
        usedGB { used }
        usedPercent { used / (free + used) * 100 }
    }
}
//endregion


//region: StorageUsageDto
fun List<StorageDomain>.toStorageUsageDto(): StorageUsageDto {
    val storageDomains: List<StorageDomain> = this@toStorageUsageDto.filter { it.availablePresent() }
    val free: Double = storageDomains.sumOf { it.availableAsLong()?.toDouble() ?: 0.0 } / GB
    val used: Double = storageDomains.sumOf { it.usedAsLong()?.toDouble() ?: 0.0 } / GB

    return StorageUsageDto.builder {
        totalGB { free + used }
        freeGB { free }
        usedGB { used }
        usedPercent { used / (free + used) * 100 }
    }
}
//endregion


//region: UsageDto

fun VmSamplesHistoryEntity.toVmCpuUsageDto(conn: Connection): UsageDto {
    val vm: Vm = conn.findVm(this@toVmCpuUsageDto.vmId.toString())
        .getOrNull() ?: throw ErrorPattern.VM_NOT_FOUND.toException()
    return UsageDto.builder {
		id { vm.id() }
        name { vm.name() }
        cpuPercent { this@toVmCpuUsageDto.cpuUsagePercent }
    }
}
fun List<VmSamplesHistoryEntity>.toVmCpuUsageDtos(conn: Connection): List<UsageDto> =
    this@toVmCpuUsageDtos.map { it.toVmCpuUsageDto(conn) }


fun List<Array<Any>>.toUsageDtoList(): List<UsageDto> {
	return this.map { row ->
		val time = when (val ts = row[0]) {
			is Timestamp -> ts.toLocalDateTime()
			is LocalDateTime -> ts
			else -> throw IllegalArgumentException("Unsupported time type: ${ts::class}")
		}

		val cpuPercent = (row[1] as? Number)?.toInt()
		val memoryPercent = (row[2] as? Number)?.toInt()
		val networkPercent = (row[3] as? Number)?.toInt()

		UsageDto.builder {
			this.time { time }
			this.cpuPercent { cpuPercent }
			this.memoryPercent { memoryPercent }
			this.networkPercent { networkPercent }
		}
	}
}

fun VmSamplesHistoryEntity.toVmMemUsageDto(conn: Connection): UsageDto {
    val vm: Vm = conn.findVm(this@toVmMemUsageDto.vmId.toString())
        .getOrNull() ?: throw ErrorPattern.VM_NOT_FOUND.toException()
    return UsageDto.builder {
		id { vm.id() }
        name { vm.name() }
        memoryPercent { this@toVmMemUsageDto.memoryUsagePercent }
    }
}
fun List<VmSamplesHistoryEntity>.toVmMemUsageDtos(conn: Connection): List<UsageDto> =
    this@toVmMemUsageDtos.map { it.toVmMemUsageDto(conn) }


fun VmSamplesHistoryEntity.toVmUsageDto(conn: Connection): UsageDto {
    val vm: Vm = conn.findVm(this@toVmUsageDto.vmId.toString())
        .getOrNull() ?: throw ErrorPattern.VM_NOT_FOUND.toException()

    return UsageDto.builder {
        id { vm.id() }
        name { vm.name() }
        cpuPercent { this@toVmUsageDto.cpuUsagePercent }
        memoryPercent { this@toVmUsageDto.memoryUsagePercent }
        time { this@toVmUsageDto.historyDatetime }
    }
}
fun List<VmSamplesHistoryEntity>.toVmUsageDtos(conn: Connection): List<UsageDto> =
    this@toVmUsageDtos.map { it.toVmUsageDto(conn) }


fun StorageDomainSamplesHistoryEntity.toStorageChart(conn: Connection): UsageDto {
    val storageDomain: StorageDomain = conn.findStorageDomain(this@toStorageChart.storageDomainId.toString())
        .getOrNull() ?: throw ErrorPattern.STORAGE_DOMAIN_NOT_FOUND.toException()
    val totalGB = (this@toStorageChart.availableDiskSizeGb + this@toStorageChart.usedDiskSizeGb).toDouble()
    return UsageDto.builder {
        id { storageDomain.id() }
        name { storageDomain.name() }
        memoryPercent { ((this@toStorageChart.usedDiskSizeGb / totalGB) * 100).toInt() }
    }
}
fun List<StorageDomainSamplesHistoryEntity>.toStorageCharts(conn: Connection) =
    this@toStorageCharts.map { it.toStorageChart(conn) }


fun HostSamplesHistoryEntity.toHostCpuChart(conn: Connection): UsageDto {
    val host: Host = conn.findHost(this@toHostCpuChart.hostId.toString())
        .getOrNull() ?: throw ErrorPattern.HOST_NOT_FOUND.toException()
    return UsageDto.builder {
        name { host.name() }
        cpuPercent { this@toHostCpuChart.cpuUsagePercent }
    }
}
fun List<HostSamplesHistoryEntity>.toHostCpuCharts(conn: Connection): List<UsageDto> =
    this@toHostCpuCharts.map { it.toHostCpuChart(conn) }

fun HostSamplesHistoryEntity.toHostMemChart(conn: Connection): UsageDto {
    val host: Host = conn.findHost(this@toHostMemChart.hostId.toString())
        .getOrNull() ?: throw ErrorPattern.HOST_NOT_FOUND.toException()
    return UsageDto.builder {
        name { host.name() }
        memoryPercent { this@toHostMemChart.memoryUsagePercent }
    }
}
fun List<HostSamplesHistoryEntity>.toHostMemCharts(conn: Connection): List<UsageDto> =
    this@toHostMemCharts.map { it.toHostMemChart(conn) }


fun VdsStatisticsEntity.toHostUsage(): UsageDto{
	return UsageDto.builder {
		cpuPercent { this@toHostUsage.usageCpuPercent }
		memoryPercent { this@toHostUsage.usageMemPercent }
		networkPercent { this@toHostUsage.usageNetworkPercent }
	}
}

/**
 * vm 사용량
 */
fun List<Statistic>.toVmUsage(): UsageDto{
    return UsageDto.builder {
        cpuPercent { this@toVmUsage.findCpuPercent() }
        memoryPercent { this@toVmUsage.findMemoryPercent() }
        networkPercent { this@toVmUsage.findNetworkPercent() }
    }
}

/**
 * vm cpuPercent 반환
 */
fun List<Statistic>.findCpuPercent(): Int? {
    val cpuUsageStatistic = this@findCpuPercent.firstOrNull { it.name() == "cpu.usage.history" }
    return cpuUsageStatistic?.values()?.firstOrNull()?.datum()?.toInt()
}
/**
 * vm MemoryPercent 반환
 */
fun List<Statistic>.findMemoryPercent(): Int? {
    val cpuUsageStatistic = this@findMemoryPercent.firstOrNull { it.name() == "memory.usage.history" }
    return cpuUsageStatistic?.values()?.firstOrNull()?.datum()?.toInt()
}
/**
 * vm NetworkPercent
 */
fun List<Statistic>.findNetworkPercent(): Int? {
    val cpuUsageStatistic = this@findNetworkPercent.firstOrNull { it.name() == "network.usage.history" }
    return cpuUsageStatistic?.values()?.firstOrNull()?.datum()?.toInt()
}
//endregion
