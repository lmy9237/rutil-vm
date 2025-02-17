package com.itinfo.rutilvm.api.model.computing

import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.api.model.*
import com.itinfo.rutilvm.api.model.network.*
import com.itinfo.rutilvm.api.model.storage.*
import com.itinfo.rutilvm.api.ovirtDf
import com.itinfo.rutilvm.api.repository.history.dto.UsageDto
import com.itinfo.rutilvm.api.repository.history.dto.toVmUsage
import com.itinfo.rutilvm.util.ovirt.*
import net.bytebuddy.asm.Advice.AssignReturned.ExceptionHandler.Factory.Enabled

import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.builders.*
import org.ovirt.engine.sdk4.types.*
import org.slf4j.LoggerFactory
import org.springframework.boot.autoconfigure.cassandra.CassandraProperties.Compression
import java.io.Serializable
import java.math.BigInteger
import java.util.Date

private val log = LoggerFactory.getLogger(VmVo::class.java)

/**
 * [VirtualMachineVo]
 *
 * @property id [String] 가상머신 Id
 * @property name [String]
 * @property status [String]
 */
class VirtualMachineVo (
    val id: String = "",
    val name: String = "",
	val description: String = "",
	val comment: String = "",
    val status: VmStatus = VmStatus.UNKNOWN,
	val biosBootMenu: Boolean = false,
	val biosType: String = "",  // chipsetFirmwareType
	val cpuArc: Architecture = Architecture.UNDEFINED,
	val cpuTopologyCnt: Int = 0,
	val cpuTopologyCore: Int = 0,
	val cpuTopologySocket: Int = 0,
	val cpuTopologyThread: Int = 0,
	val cpuPinningPolicy: String = "",
    val creationTime: String = "",
	val deleteProtected: Boolean = false,
	val monitor: Int = 0,
	val displayType: DisplayType = DisplayType.VNC,
	val ha: Boolean = false,
	val haPriority: Int = 0,
	val ioThreadCnt: Int = 0,
	val memorySize: BigInteger = BigInteger.ZERO,
    val memoryGuaranteed: BigInteger = BigInteger.ZERO,
	val memoryMax: BigInteger = BigInteger.ZERO,
	val migrationAutoConverge: InheritableBoolean = InheritableBoolean.INHERIT,
	val migrationCompression: InheritableBoolean = InheritableBoolean.INHERIT,
	val migrationEncrypt: InheritableBoolean = InheritableBoolean.INHERIT,
	val migrationParallelPolicy: InheritableBoolean = InheritableBoolean.INHERIT,
	val osBootDevices: List<String> = listOf(),
	val osType: String = "",
	val placementPolicy: VmAffinity = VmAffinity.MIGRATABLE,
    val startPaused: Boolean = false,
	val storageErrorResumeBehaviour: VmStorageErrorResumeBehaviour = VmStorageErrorResumeBehaviour.AUTO_RESUME,
	// val timeZone: String = "Asia/Seoul", // Etc/GMT & Asia/Seoul
	val type: String = "",  //VmType
	val usb: Boolean = false,
	val virtioScsiMultiQueueEnabled: Boolean = false,

	val clusterVo: IdentifiedVo = IdentifiedVo(),
	val hostVo: IdentifiedVo = IdentifiedVo(),
	val originTemplate: IdentifiedVo = IdentifiedVo(),
	val template: IdentifiedVo = IdentifiedVo(),
	val cpuProfileVo: IdentifiedVo = IdentifiedVo(),
	val upTime: String = "",
	val startTime: String = "",
	val stopTime: String = "",

	val diskAttachmentVos: List<IdentifiedVo> = listOf(),
    val cdRomVo: IdentifiedVo = IdentifiedVo(),
	val snapshotVos: List<IdentifiedVo> = listOf(),
	val hostDeviceVos: List<IdentifiedVo> = listOf(),
	val nicVos: List<IdentifiedVo> = listOf(),
): Serializable {
    override fun toString(): String =
        gson.toJson(this)

    val statusDetail: String
        get() = status.findVmStatus()

    class Builder {
        private var bId: String = ""; fun id(block: () -> String?) { bId = block() ?: ""}
        private var bName: String = ""; fun name(block: () -> String?) { bName = block() ?: ""}
        private var bStatus: VmStatus = VmStatus.UNKNOWN; fun status(block: () -> VmStatus?) { bStatus = block() ?: VmStatus.UNKNOWN }
        private var bUpTime: String = ""; fun upTime(block: () -> String?) { bUpTime = block() ?: "" }
        private var bCreationTime: String = ""; fun creationTime(block: () -> String?) { bCreationTime = block() ?: "" }
        private var bMemoryInstalled: BigInteger = BigInteger.ZERO; fun memoryInstalled(block: () -> BigInteger?) { bMemoryInstalled = block() ?: BigInteger.ZERO }
        private var bMemoryUsed: BigInteger = BigInteger.ZERO; fun memoryUsed(block: () -> BigInteger?) { bMemoryUsed = block() ?: BigInteger.ZERO }
        private var bMemoryBuffered: BigInteger = BigInteger.ZERO; fun memoryBuffered(block: () -> BigInteger?) { bMemoryBuffered = block() ?: BigInteger.ZERO }
        private var bMemoryCached: BigInteger = BigInteger.ZERO; fun memoryCached(block: () -> BigInteger?) { bMemoryCached = block() ?: BigInteger.ZERO }
        private var bMemoryFree: BigInteger = BigInteger.ZERO; fun memoryFree(block: () -> BigInteger?) { bMemoryFree = block() ?: BigInteger.ZERO }
        private var bMemoryUnused: BigInteger = BigInteger.ZERO; fun memoryUnused(block: () -> BigInteger?) { bMemoryUnused = block() ?: BigInteger.ZERO }
        private var bFqdn: String = ""; fun fqdn(block: () -> String?) { bFqdn = block() ?: "" }
        private var bIpv4: List<String> = listOf(); fun ipv4(block: () -> List<String>?) { bIpv4 = block() ?: listOf() }
        private var bIpv6: List<String> = listOf(); fun ipv6(block: () -> List<String>?) { bIpv6 = block() ?: listOf() }
        private var bHostEngineVm: Boolean = false; fun hostEngineVm(block: () -> Boolean?) { bHostEngineVm = block() ?: false }
        private var bPlacement: String = ""; fun placement(block: () -> String?) { bPlacement = block() ?: "" }
        private var bHostVo: IdentifiedVo = IdentifiedVo(); fun hostVo(block: () -> IdentifiedVo?) { bHostVo = block() ?: IdentifiedVo() }
        private var bSnapshotVos: List<IdentifiedVo> = listOf(); fun snapshotVos(block: () -> List<IdentifiedVo>?) { bSnapshotVos = block() ?: listOf() }
        private var bNicVos: List<NicVo> = listOf(); fun nicVos(block: () -> List<NicVo>?) { bNicVos = block() ?: listOf() }
        private var bDataCenterVo: IdentifiedVo = IdentifiedVo(); fun dataCenterVo(block: () -> IdentifiedVo?) { bDataCenterVo = block() ?: IdentifiedVo() }
        private var bClusterVo: IdentifiedVo = IdentifiedVo(); fun clusterVo(block: () -> IdentifiedVo?) { bClusterVo = block() ?: IdentifiedVo() }
        private var bTemplateVo: IdentifiedVo = IdentifiedVo(); fun templateVo(block: () -> IdentifiedVo?) { bTemplateVo = block() ?: IdentifiedVo() }
        private var bDescription: String = ""; fun description(block: () -> String?) { bDescription = block() ?: "" }
        private var bComment: String = ""; fun comment(block: () -> String?) { bComment = block() ?: "" }
        private var bOsSystem: String = ""; fun osSystem(block: () -> String?) { bOsSystem = block() ?: "" }
        private var bChipsetFirmwareType: String = ""; fun chipsetFirmwareType(block: () -> String?) { bChipsetFirmwareType = block() ?: "" }
        private var bOptimizeOption: String = ""; fun optimizeOption(block: () -> String?) { bOptimizeOption = block() ?: "" }
        private var bStateless: Boolean = false; fun stateless(block: () -> Boolean?) { bStateless = block() ?: false }
        private var bStartPaused: Boolean = false; fun startPaused(block: () -> Boolean?) { bStartPaused = block() ?: false }
        private var bDeleteProtected: Boolean = false; fun deleteProtected(block: () -> Boolean?) { bDeleteProtected = block() ?: false }
        private var bDiskAttachmentVos: List<DiskAttachmentVo> = listOf(); fun diskAttachmentVos(block: () -> List<DiskAttachmentVo>?) { bDiskAttachmentVos = block() ?: listOf() }
        private var bVnicProfileVos: List<VnicProfileVo> = listOf(); fun vnicProfileVos(block: () -> List<VnicProfileVo>?) { bVnicProfileVos = block() ?: listOf() }
        private var bMemorySize: BigInteger = BigInteger.ZERO; fun memorySize(block: () -> BigInteger?) { bMemorySize = block() ?: BigInteger.ZERO }
        private var bMemoryMax: BigInteger = BigInteger.ZERO; fun memoryMax(block: () -> BigInteger?) { bMemoryMax = block() ?: BigInteger.ZERO }
        private var bMemoryActual: BigInteger = BigInteger.ZERO; fun memoryActual(block: () -> BigInteger?) { bMemoryActual = block() ?: BigInteger.ZERO }
        private var bCpuArc: Architecture = Architecture.UNDEFINED; fun cpuArc(block: () -> Architecture?) { bCpuArc = block() ?: Architecture.UNDEFINED }
        private var bCpuTopologyCnt: Int = 0; fun cpuTopologyCnt(block: () -> Int?) { bCpuTopologyCnt = block() ?: 0 }
        private var bCpuTopologyCore: Int = 0; fun cpuTopologyCore(block: () -> Int?) { bCpuTopologyCore = block() ?: 0 }
        private var bCpuTopologySocket: Int = 0; fun cpuTopologySocket(block: () -> Int?) { bCpuTopologySocket = block() ?: 0 }
        private var bCpuTopologyThread: Int = 0; fun cpuTopologyThread(block: () -> Int?) { bCpuTopologyThread = block() ?: 0 }
//        private var bUserEmulation: String = ""; fun userEmulation(block: () -> String?) { bUserEmulation = block() ?: "" }
//        private var bUserCpu: String = ""; fun userCpu(block: () -> String?) { bUserCpu = block() ?: "" }
//        private var bUserVersion: String = ""; fun userVersion(block: () -> String?) { bUserVersion = block() ?: "" }
        private var bInstanceType: String = ""; fun instanceType(block: () -> String?) { bInstanceType = block() ?: "" }
        private var bTimeOffset: String = ""; fun timeOffset(block: () -> String?) { bTimeOffset = block() ?: "" }
        private var bCloudInit: Boolean = false; fun cloudInit(block: () -> Boolean?) { bCloudInit = block() ?: false }
        private var bHostName: String = ""; fun hostName(block: () -> String?) { bHostName = block() ?: "" }
        private var bTimeStandard: String = ""; fun timeStandard(block: () -> String?) { bTimeStandard = block() ?: "" }
        private var bScript: String = ""; fun script(block: () -> String?) { bScript = block() ?: "" }
        private var bMonitor: Int = 0; fun monitor(block: () -> Int?) { bMonitor = block() ?: 0 }
        private var bUsb: Boolean = false; fun usb(block: () -> Boolean?) { bUsb = block() ?: false }
        private var bHostInCluster: Boolean = false; fun hostInCluster(block: () -> Boolean?) { bHostInCluster = block() ?: false }
        private var bHostVos: List<IdentifiedVo> = listOf(); fun hostVos(block: () -> List<IdentifiedVo>?) { bHostVos = block() ?: listOf() }
        private var bMigrationMode: String = ""; fun migrationMode(block: () -> String?) { bMigrationMode = block() ?: "" }
        private var bMigrationPolicy: String = ""; fun migrationPolicy(block: () -> String?) { bMigrationPolicy = block() ?: "" }
        private var bMigrationEncrypt: InheritableBoolean = InheritableBoolean.INHERIT; fun migrationEncrypt(block: () -> InheritableBoolean?) { bMigrationEncrypt = block() ?: InheritableBoolean.INHERIT }
        private var bParallelMigration: String = ""; fun parallelMigration(block: () -> String?) { bParallelMigration = block() ?: "" }
        private var bHa: Boolean = false; fun ha(block: () -> Boolean?) { bHa = block() ?: false }
        private var bStorageDomainVo: IdentifiedVo = IdentifiedVo(); fun storageDomainVo(block: () -> IdentifiedVo?) { bStorageDomainVo = block() ?: IdentifiedVo() }
        private var bResumeOperation: String = ""; fun resumeOperation(block: () -> String?) { bResumeOperation = block() ?: "" }
        private var bPriority: Int = 0; fun priority(block: () -> Int?) { bPriority = block() ?: 0 }
        private var bWatchDogModel: String = ""; fun watchDogModel(block: () -> String?) { bWatchDogModel = block() ?: "" }
        private var bWatchDogAction: WatchdogAction = WatchdogAction.NONE; fun watchDogAction(block: () -> WatchdogAction?) { bWatchDogAction = block() ?: WatchdogAction.NONE }
        private var bCpuProfileVo: IdentifiedVo = IdentifiedVo(); fun cpuProfileVo(block: () -> IdentifiedVo?) { bCpuProfileVo = block() ?: IdentifiedVo() }
        private var bCpuShare: Int = 0; fun cpuShare(block: () -> Int?) { bCpuShare = block() ?: 0 }
        private var bCpuPinningPolicy: String = ""; fun cpuPinningPolicy(block: () -> String?) { bCpuPinningPolicy = block() ?: "" }
        private var bMemoryBalloon: Boolean = false; fun memoryBalloon(block: () -> Boolean?) { bMemoryBalloon = block() ?: false }
        private var bIoThreadCnt: Int = 0; fun ioThreadCnt(block: () -> Int?) { bIoThreadCnt = block() ?: 0 }
        private var bMultiQue: Boolean = false; fun multiQue(block: () -> Boolean?) { bMultiQue = block() ?: false }
        private var bVirtSCSIEnable: Boolean = false; fun virtSCSIEnable(block: () -> Boolean?) { bVirtSCSIEnable = block() ?: false }
        private var bVirtIoCnt: String = ""; fun virtIoCnt(block: () -> String?) { bVirtIoCnt = block() ?: "" }
        private var bFirstDevice: String = ""; fun firstDevice(block: () -> String?) { bFirstDevice = block() ?: "" }
        private var bSecDevice: String = ""; fun secDevice(block: () -> String?) { bSecDevice = block() ?: "" }
        private var bDeviceList: List<String> = listOf(); fun deviceList(block: () -> List<String>?) { bDeviceList = block() ?: listOf() }
        private var bConnVo: IdentifiedVo = IdentifiedVo(); fun connVo(block: () -> IdentifiedVo?) { bConnVo = block() ?: IdentifiedVo() }
        private var bBootingMenu: Boolean = false; fun bootingMenu(block: () -> Boolean?) { bBootingMenu = block() ?: false }
        private var bUsageDto: UsageDto = UsageDto(); fun usageDto(block: () -> UsageDto?) { bUsageDto = block() ?: UsageDto() }
        private var bStopTime: String = ""; fun stopTime(block: () -> String?) { bStopTime = block() ?: "" }

        fun build(): VirtualMachineVo = VirtualMachineVo()
    }

    companion object {
        inline fun builder(block: VirtualMachineVo.Builder.() -> Unit): VirtualMachineVo = VirtualMachineVo.Builder().apply(block).build()
    }
}
