package com.itinfo.rutilvm.api.model.computing

import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.model.computing.VmVo.Companion
import com.itinfo.rutilvm.api.model.fromClusterToIdentifiedVo
import com.itinfo.rutilvm.api.model.fromCpuProfileToIdentifiedVo
import com.itinfo.rutilvm.api.model.fromDataCenterToIdentifiedVo
import com.itinfo.rutilvm.api.model.fromDiskAttachmentsToIdentifiedVos
import com.itinfo.rutilvm.api.model.fromDiskToIdentifiedVo
import com.itinfo.rutilvm.api.model.fromHostToIdentifiedVo
import com.itinfo.rutilvm.api.model.fromHostsToIdentifiedVos
import com.itinfo.rutilvm.api.model.fromNicsToIdentifiedVos
import com.itinfo.rutilvm.api.model.fromSnapshotsToIdentifiedVos
import com.itinfo.rutilvm.api.model.fromStorageDomainToIdentifiedVo
import com.itinfo.rutilvm.api.model.fromTemplateToIdentifiedVo
import com.itinfo.rutilvm.api.model.network.NicVo
import com.itinfo.rutilvm.api.model.network.toNicIdNames
import com.itinfo.rutilvm.api.model.network.toVmNics
import com.itinfo.rutilvm.api.model.storage.DiskAttachmentVo
import com.itinfo.rutilvm.api.model.storage.toDiskAttachmentIdNames
import com.itinfo.rutilvm.api.model.storage.toDiskAttachmentVos
import com.itinfo.rutilvm.api.repository.engine.entity.VmsEntity
import com.itinfo.rutilvm.api.repository.history.dto.UsageDto
import com.itinfo.rutilvm.api.repository.history.dto.toVmUsage
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.common.formatEnhanced
import com.itinfo.rutilvm.common.formatEnhancedFromLDT
import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.common.ovirtDf
import com.itinfo.rutilvm.common.toLocalDateTime
import com.itinfo.rutilvm.common.toTimeElapsedKr
import com.itinfo.rutilvm.util.ovirt.findAllNicsFromVm
import com.itinfo.rutilvm.util.ovirt.findAllSnapshotsFromVm
import com.itinfo.rutilvm.util.ovirt.findAllStatisticsFromVm
import com.itinfo.rutilvm.util.ovirt.findCluster
import com.itinfo.rutilvm.util.ovirt.findDisk
import com.itinfo.rutilvm.util.ovirt.findHost
import com.itinfo.rutilvm.util.ovirt.findStorageDomain
import com.itinfo.rutilvm.util.ovirt.findTemplate
import com.itinfo.rutilvm.util.ovirt.findVm
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.builders.BiosBuilder
import org.ovirt.engine.sdk4.builders.BootBuilder
import org.ovirt.engine.sdk4.builders.BootMenuBuilder
import org.ovirt.engine.sdk4.builders.ClusterBuilder
import org.ovirt.engine.sdk4.builders.CpuBuilder
import org.ovirt.engine.sdk4.builders.CpuTopologyBuilder
import org.ovirt.engine.sdk4.builders.HighAvailabilityBuilder
import org.ovirt.engine.sdk4.builders.HostBuilder
import org.ovirt.engine.sdk4.builders.InitializationBuilder
import org.ovirt.engine.sdk4.builders.MemoryPolicyBuilder
import org.ovirt.engine.sdk4.builders.OperatingSystemBuilder
import org.ovirt.engine.sdk4.builders.StorageDomainBuilder
import org.ovirt.engine.sdk4.builders.StorageDomainLeaseBuilder
import org.ovirt.engine.sdk4.builders.TemplateBuilder
import org.ovirt.engine.sdk4.builders.TimeZoneBuilder
import org.ovirt.engine.sdk4.builders.VmBuilder
import org.ovirt.engine.sdk4.builders.VmPlacementPolicyBuilder
import org.ovirt.engine.sdk4.types.Architecture
import org.ovirt.engine.sdk4.types.BiosType
import org.ovirt.engine.sdk4.types.BootDevice
import org.ovirt.engine.sdk4.types.Cluster
import org.ovirt.engine.sdk4.types.Disk
import org.ovirt.engine.sdk4.types.DiskAttachment
import org.ovirt.engine.sdk4.types.DisplayType
import org.ovirt.engine.sdk4.types.Host
import org.ovirt.engine.sdk4.types.InheritableBoolean
import org.ovirt.engine.sdk4.types.IpVersion.V4
import org.ovirt.engine.sdk4.types.IpVersion.V6
import org.ovirt.engine.sdk4.types.Nic
import org.ovirt.engine.sdk4.types.ReportedDevice
import org.ovirt.engine.sdk4.types.Snapshot
import org.ovirt.engine.sdk4.types.SnapshotType
import org.ovirt.engine.sdk4.types.SnapshotType.ACTIVE
import org.ovirt.engine.sdk4.types.SnapshotType.PREVIEW
import org.ovirt.engine.sdk4.types.Statistic
import org.ovirt.engine.sdk4.types.StorageDomain
import org.ovirt.engine.sdk4.types.Template
import org.ovirt.engine.sdk4.types.Vm
import org.ovirt.engine.sdk4.types.VmAffinity
import org.ovirt.engine.sdk4.types.VmStatus
import org.ovirt.engine.sdk4.types.VmStorageErrorResumeBehaviour
import org.ovirt.engine.sdk4.types.VmType
import org.slf4j.LoggerFactory
import java.io.Serializable
import java.math.BigInteger
import java.time.LocalDateTime
import java.util.*

private val log = LoggerFactory.getLogger(VmVo::class.java)

/**
 * [VmVo]
 * @property id [String]
 * @property name [String]
 * @property description [String]
 * @property comment [String]
 * @property status [VmStatus]
 * @property optimizeOption [String]
 * @property biosBootMenu [Boolean]
 * @property biosType [String] vm.bios().type() 칩셋
 * @property osType [String] vm.os().type()  운영체제
 * @property cpuArc [Architecture]
 * @property cpuTopologyCnt [Int]
 * @property cpuTopologyCore [Int]
 * @property cpuTopologySocket [Int]
 * @property cpuTopologyThread [Int]
 * @property cpuPinningPolicy [String]
 * @property memorySize [BigInteger]
 * @property memoryGuaranteed [BigInteger]
 * @property memoryMax [BigInteger]
 * @property ha [Boolean]
 * @property haPriority [Int]
 * @property ioThreadCnt [Int]
 * @property timeOffset [String]
 * @property cloudInit [Boolean]
 * @property script [String]
 * @property placementPolicy [VmAffinity]
 * @property migrationMode [String]
 * @property migrationPolicy [String]
 * @property migrationAutoConverge [InheritableBoolean]
 * @property migrationCompression [InheritableBoolean]
 * @property migrationEncrypt [InheritableBoolean]
 * @property migrationParallelPolicy [InheritableBoolean]
 * @property parallelMigration [String]
 * @property storageErrorResumeBehaviour [VmStorageErrorResumeBehaviour]
 * @property virtioScsiMultiQueueEnabled [Boolean]
 * @property firstDevice [String]
 * @property secDevice [String]
 * @property deviceList List<[String]>
 * @property monitor [Int]
 * @property displayType [DisplayType]
 * @property guestArc [String]
 * @property guestOsType [String]
 * @property guestDistribution [String]
 * @property guestKernelVer [String]
 * @property guestTimeZone [String]
 * @property deleteProtected [Boolean]
 * @property startPaused [Boolean]
 * @property usb [Boolean]
 * @property hostedEngineVm [Boolean]
 * @property fqdn [String]
 * @property nextRun [Boolean]
 * @property runOnce [Boolean]
 * @property upTime [String]
 * @property _creationTime [Date]
 * @property _startTime [Date]
 * @property _stopTime [Date]
 * @property ipv4 List<[String]>
 * @property ipv6 List<[String]>
 * @property hostInCluster [Boolean]
 * @property hostVos List<[IdentifiedVo]>
 * @property storageDomainVo [IdentifiedVo]
 * @property cpuProfileVo [IdentifiedVo]
 * @property cdRomVo [IdentifiedVo]
 * @property dataCenterVo [IdentifiedVo]
 * @property clusterVo [IdentifiedVo]
 * @property hostVo [IdentifiedVo]
 * @property snapshotVos List<[IdentifiedVo]>
 * @property hostDeviceVos List<[IdentifiedVo]>
 * @property originTemplateVo [IdentifiedVo]
 * @property templateVo [IdentifiedVo]
 * @property nicVos List<[NicVo]>
 * @property diskAttachmentVos List<[DiskAttachmentVo]>
 * @property usageDto [UsageDto]
 */
class VmVo (
	val id: String = "",
	val name: String = "",
	val description: String = "",
	val comment: String = "",
	val status: String = "",
	// val status: VmStatus = VmStatus.UNKNOWN,
	val optimizeOption: String = "", // VmType
	val biosBootMenu: Boolean = false,
	val biosType: String = "", // chipsetFirmwareType
	val osType: String = "",
	val cpuArc: Architecture = Architecture.UNDEFINED,
	val cpuTopologyCnt: Int = 0,
	val cpuTopologyCore: Int = 0,
	val cpuTopologySocket: Int = 0,
	val cpuTopologyThread: Int = 0,
	val cpuPinningPolicy: String = "",
	val memorySize: BigInteger = BigInteger.ZERO,
	val memoryGuaranteed: BigInteger = BigInteger.ZERO,
	val memoryMax: BigInteger = BigInteger.ZERO,
	val ha: Boolean = false,
	val haPriority: Int = 0,
	val ioThreadCnt: Int = 0,
	val timeOffset: String = "Etc/GMT",
	val cloudInit: Boolean = false,
	val script: String = "",
	val migrationMode: String = "", //VmAffinity
	val migrationPolicy: String = "",
	val migrationAutoConverge: InheritableBoolean = InheritableBoolean.INHERIT,
	val migrationCompression: InheritableBoolean = InheritableBoolean.INHERIT,
	val migrationEncrypt: InheritableBoolean = InheritableBoolean.INHERIT,
	val migrationParallelPolicy: InheritableBoolean = InheritableBoolean.INHERIT,
	val parallelMigration: String = "",
	val storageErrorResumeBehaviour: VmStorageErrorResumeBehaviour = VmStorageErrorResumeBehaviour.AUTO_RESUME,
	val virtioScsiMultiQueueEnabled: Boolean = false,
	val firstDevice: String = "",
	val secDevice: String = "",
	val deviceList: List<String> = listOf(),
	val monitor: Int = 0,
	val displayType: DisplayType = DisplayType.VNC,
	val guestArc: String = "",
	val guestOsType: String = "",
	val guestDistribution: String = "",
	val guestKernelVer: String = "",
	val guestTimeZone: String = "",
	val deleteProtected: Boolean = false,
	val startPaused: Boolean = false,
	val usb: Boolean = false,
	val hostedEngineVm: Boolean = false,
	val fqdn: String = "",
	val nextRun: Boolean = false,
	val runOnce: Boolean = false,
	val upTime: String = "",
	private val _creationTime: LocalDateTime? = null,
	private val _startTime: LocalDateTime? = null,
	private val _stopTime: LocalDateTime? = null,
	val ipv4: List<String> = listOf(),
	val ipv6: List<String> = listOf(),
	val hostInCluster: Boolean = false,
	val hostVos: List<IdentifiedVo> = listOf(),
	val storageDomainVo: IdentifiedVo = IdentifiedVo(),
	val cpuProfileVo: IdentifiedVo = IdentifiedVo(),
	val cdRomVo: IdentifiedVo = IdentifiedVo(),
	val dataCenterVo: IdentifiedVo = IdentifiedVo(),
	val clusterVo: IdentifiedVo = IdentifiedVo(),
	val hostVo: IdentifiedVo = IdentifiedVo(),
	val snapshotVos: List<IdentifiedVo> = listOf(),
	val hostDeviceVos: List<IdentifiedVo> = listOf(),
	val originTemplateVo: IdentifiedVo = IdentifiedVo(),
	val templateVo: IdentifiedVo = IdentifiedVo(),
	val nicVos: List<NicVo> = listOf(),
	val diskAttachmentVos: List<DiskAttachmentVo> = listOf(),
	val usageDto: UsageDto = UsageDto(),
): Serializable {
    override fun toString(): String =
		gson.toJson(this)

	val creationTime: String?
		get() = ovirtDf.formatEnhancedFromLDT(_creationTime)
	val startTime: String?
		get() = ovirtDf.formatEnhancedFromLDT(_startTime)
	val stopTime: String?
		get() = ovirtDf.formatEnhancedFromLDT(_stopTime)

    class Builder {
		private var bId: String = ""; fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String = ""; fun name(block: () -> String?) { bName = block() ?: "" }
		private var bDescription: String = ""; fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bComment: String = ""; fun comment(block: () -> String?) { bComment = block() ?: "" }
		// private var bStatus: VmStatus = VmStatus.UNKNOWN; fun status(block: () -> VmStatus?) { bStatus = block() ?: VmStatus.UNKNOWN }
		private var bStatus: String = ""; fun status(block: () -> String?) { bStatus = block() ?: "" }
		private var bOptimizeOption: String = ""; fun optimizeOption(block: () -> String?) { bOptimizeOption = block() ?: "" }
		private var bBiosBootMenu: Boolean = false; fun biosBootMenu(block: () -> Boolean?) { bBiosBootMenu = block() ?: false }
		private var bBiosType: String = ""; fun biosType(block: () -> String?) { bBiosType = block() ?: "" }
		private var bOsType: String = ""; fun osType(block: () -> String?) { bOsType = block() ?: "" }
		private var bCpuArc: Architecture = Architecture.UNDEFINED; fun cpuArc(block: () -> Architecture?) { bCpuArc = block() ?: Architecture.UNDEFINED }
		private var bCpuTopologyCnt: Int = 0; fun cpuTopologyCnt(block: () -> Int?) { bCpuTopologyCnt = block() ?: 0 }
		private var bCpuTopologyCore: Int = 0; fun cpuTopologyCore(block: () -> Int?) { bCpuTopologyCore = block() ?: 0 }
		private var bCpuTopologySocket: Int = 0; fun cpuTopologySocket(block: () -> Int?) { bCpuTopologySocket = block() ?: 0 }
		private var bCpuTopologyThread: Int = 0; fun cpuTopologyThread(block: () -> Int?) { bCpuTopologyThread = block() ?: 0 }
		private var bCpuPinningPolicy: String = ""; fun cpuPinningPolicy(block: () -> String?) { bCpuPinningPolicy = block() ?: "" }
		private var bMemorySize: BigInteger = BigInteger.ZERO; fun memorySize(block: () -> BigInteger?) { bMemorySize = block() ?: BigInteger.ZERO }
		private var bMemoryGuaranteed: BigInteger = BigInteger.ZERO; fun memoryGuaranteed(block: () -> BigInteger?) { bMemoryGuaranteed = block() ?: BigInteger.ZERO }
		private var bMemoryMax: BigInteger = BigInteger.ZERO; fun memoryMax(block: () -> BigInteger?) { bMemoryMax = block() ?: BigInteger.ZERO }
		private var bHa: Boolean = false; fun ha(block: () -> Boolean?) { bHa = block() ?: false }
		private var bHaPriority: Int = 0; fun haPriority(block: () -> Int?) { bHaPriority = block() ?: 0 }
		private var bIoThreadCnt: Int = 0; fun ioThreadCnt(block: () -> Int?) { bIoThreadCnt = block() ?: 0 }
		private var bTimeOffset: String = ""; fun timeOffset(block: () -> String?) { bTimeOffset = block() ?: "" }
		private var bCloudInit: Boolean = false; fun cloudInit(block: () -> Boolean?) { bCloudInit = block() ?: false }
		private var bScript: String = ""; fun script(block: () -> String?) { bScript = block() ?: "" }
		private var bMigrationMode: String = ""; fun migrationMode(block: () -> String?) { bMigrationMode = block() ?: "" }
		private var bMigrationPolicy: String = ""; fun migrationPolicy(block: () -> String?) { bMigrationPolicy = block() ?: "" }
		private var bMigrationAutoConverge: InheritableBoolean = InheritableBoolean.INHERIT; fun migrationAutoConverge(block: () -> InheritableBoolean?) { bMigrationAutoConverge = block() ?: InheritableBoolean.INHERIT }
		private var bMigrationCompression: InheritableBoolean = InheritableBoolean.INHERIT; fun migrationCompression(block: () -> InheritableBoolean?) { bMigrationCompression = block() ?: InheritableBoolean.INHERIT }
		private var bMigrationEncrypt: InheritableBoolean = InheritableBoolean.INHERIT; fun migrationEncrypt(block: () -> InheritableBoolean?) { bMigrationEncrypt = block() ?: InheritableBoolean.INHERIT }
		private var bMigrationParallelPolicy: InheritableBoolean = InheritableBoolean.INHERIT; fun migrationParallelPolicy(block: () -> InheritableBoolean?) { bMigrationParallelPolicy = block() ?: InheritableBoolean.INHERIT }
		private var bParallelMigration: String = ""; fun parallelMigration(block: () -> String?) { bParallelMigration = block() ?: "" }
		private var bStorageErrorResumeBehaviour: VmStorageErrorResumeBehaviour = VmStorageErrorResumeBehaviour.AUTO_RESUME; fun storageErrorResumeBehaviour(block: () -> VmStorageErrorResumeBehaviour?) { bStorageErrorResumeBehaviour = block() ?: VmStorageErrorResumeBehaviour.AUTO_RESUME }
		private var bVirtioScsiMultiQueueEnabled: Boolean = false; fun virtioScsiMultiQueueEnabled(block: () -> Boolean?) { bVirtioScsiMultiQueueEnabled = block() ?: false }
		private var bFirstDevice: String = ""; fun firstDevice(block: () -> String?) { bFirstDevice = block() ?: "" }
		private var bSecDevice: String = ""; fun secDevice(block: () -> String?) { bSecDevice = block() ?: "" }
		private var bDeviceList: List<String> = listOf(); fun deviceList(block: () -> List<String>?) { bDeviceList = block() ?: listOf() }
		private var bMonitor: Int = 0; fun monitor(block: () -> Int?) { bMonitor = block() ?: 0 }
		private var bDisplayType: DisplayType = DisplayType.VNC; fun displayType(block: () -> DisplayType?) { bDisplayType = block() ?: DisplayType.VNC }
		private var bGuestArc: String = ""; fun guestArc(block: () -> String?) { bGuestArc = block() ?: "" }
		private var bGuestOsType: String = ""; fun guestOsType(block: () -> String?) { bGuestOsType = block() ?: "" }
		private var bGuestDistribution: String = ""; fun guestDistribution(block: () -> String?) { bGuestDistribution = block() ?: "" }
		private var bGuestKernelVer: String = ""; fun guestKernelVer(block: () -> String?) { bGuestKernelVer = block() ?: "" }
		private var bGuestTimeZone: String = ""; fun guestTimeZone(block: () -> String?) { bGuestTimeZone = block() ?: "" }
		private var bDeleteProtected: Boolean = false; fun deleteProtected(block: () -> Boolean?) { bDeleteProtected = block() ?: false }
		private var bStartPaused: Boolean = false; fun startPaused(block: () -> Boolean?) { bStartPaused = block() ?: false }
		private var bUsb: Boolean = false; fun usb(block: () -> Boolean?) { bUsb = block() ?: false }
		private var bHostedEngineVm: Boolean = false; fun hostedEngineVm(block: () -> Boolean?) { bHostedEngineVm = block() ?: false }
		private var bFqdn: String = ""; fun fqdn(block: () -> String?) { bFqdn = block() ?: "" }
		private var bNextRun: Boolean = false; fun nextRun(block: () -> Boolean?) { bNextRun = block() ?: false }
		private var bRunOnce: Boolean = false; fun runOnce(block: () -> Boolean?) { bRunOnce = block() ?: false }
		private var bUpTime: String = ""; fun upTime(block: () -> String?) { bUpTime = block() ?: "" }
		private var bCreationTime: LocalDateTime? = null; fun creationTime(block: () -> LocalDateTime?) { bCreationTime = block() }
		private var bStartTime: LocalDateTime? = null; fun startTime(block: () -> LocalDateTime?) { bStartTime = block() }
		private var bStopTime: LocalDateTime? = null; fun stopTime(block: () -> LocalDateTime?) { bStopTime = block() }
		private var bIpv4: List<String> = listOf(); fun ipv4(block: () -> List<String>?) { bIpv4 = block() ?: listOf() }
		private var bIpv6: List<String> = listOf(); fun ipv6(block: () -> List<String>?) { bIpv6 = block() ?: listOf() }
		private var bHostInCluster: Boolean = false; fun hostInCluster(block: () -> Boolean?) { bHostInCluster = block() ?: false }
		private var bHostVos: List<IdentifiedVo> = listOf(); fun hostVos(block: () -> List<IdentifiedVo>?) { bHostVos = block() ?: listOf() }
		private var bStorageDomainVo: IdentifiedVo = IdentifiedVo(); fun storageDomainVo(block: () -> IdentifiedVo?) { bStorageDomainVo = block() ?: IdentifiedVo() }
		private var bCpuProfileVo: IdentifiedVo = IdentifiedVo(); fun cpuProfileVo(block: () -> IdentifiedVo?) { bCpuProfileVo = block() ?: IdentifiedVo() }
		private var bCdRomVo: IdentifiedVo = IdentifiedVo(); fun cdRomVo(block: () -> IdentifiedVo?) { bCdRomVo = block() ?: IdentifiedVo() }
		private var bDataCenterVo: IdentifiedVo = IdentifiedVo(); fun dataCenterVo(block: () -> IdentifiedVo?) { bDataCenterVo = block() ?: IdentifiedVo() }
		private var bClusterVo: IdentifiedVo = IdentifiedVo(); fun clusterVo(block: () -> IdentifiedVo?) { bClusterVo = block() ?: IdentifiedVo() }
		private var bHostVo: IdentifiedVo = IdentifiedVo(); fun hostVo(block: () -> IdentifiedVo?) { bHostVo = block() ?: IdentifiedVo() }
		private var bSnapshotVos: List<IdentifiedVo> = listOf(); fun snapshotVos(block: () -> List<IdentifiedVo>?) { bSnapshotVos = block() ?: listOf() }
		private var bHostDeviceVos: List<IdentifiedVo> = listOf(); fun hostDeviceVos(block: () -> List<IdentifiedVo>?) { bHostDeviceVos = block() ?: listOf() }
		private var bOriginTemplateVo: IdentifiedVo = IdentifiedVo(); fun originTemplateVo(block: () -> IdentifiedVo?) { bOriginTemplateVo = block() ?: IdentifiedVo() }
		private var bTemplateVo: IdentifiedVo = IdentifiedVo(); fun templateVo(block: () -> IdentifiedVo?) { bTemplateVo = block() ?: IdentifiedVo() }
		private var bNicVos: List<NicVo> = listOf(); fun nicVos(block: () -> List<NicVo>?) { bNicVos = block() ?: listOf() }
		private var bDiskAttachmentVos: List<DiskAttachmentVo> = listOf(); fun diskAttachmentVos(block: () -> List<DiskAttachmentVo>?) { bDiskAttachmentVos = block() ?: listOf() }
		private var bUsageDto: UsageDto = UsageDto(); fun usageDto(block: () -> UsageDto?) { bUsageDto = block() ?: UsageDto() }
        fun build(): VmVo = VmVo(bId, bName, bDescription, bComment, bStatus, bOptimizeOption, bBiosBootMenu, bBiosType, bOsType, bCpuArc, bCpuTopologyCnt, bCpuTopologyCore, bCpuTopologySocket, bCpuTopologyThread, bCpuPinningPolicy, bMemorySize, bMemoryGuaranteed, bMemoryMax, bHa, bHaPriority, bIoThreadCnt, bTimeOffset, bCloudInit, bScript, bMigrationMode, bMigrationPolicy, bMigrationAutoConverge, bMigrationCompression, bMigrationEncrypt, bMigrationParallelPolicy, bParallelMigration, bStorageErrorResumeBehaviour, bVirtioScsiMultiQueueEnabled, bFirstDevice, bSecDevice, bDeviceList, bMonitor, bDisplayType, bGuestArc, bGuestOsType, bGuestDistribution, bGuestKernelVer, bGuestTimeZone, bDeleteProtected, bStartPaused, bUsb, bHostedEngineVm, bFqdn, bNextRun, bRunOnce, bUpTime, bCreationTime, bStartTime, bStopTime, bIpv4, bIpv6, bHostInCluster, bHostVos, bStorageDomainVo, bCpuProfileVo, bCdRomVo, bDataCenterVo, bClusterVo, bHostVo, bSnapshotVos, bHostDeviceVos, bOriginTemplateVo, bTemplateVo, bNicVos, bDiskAttachmentVos, bUsageDto, )

    }

    companion object {
        private val log by LoggerDelegate()
        inline fun builder(block: Builder.() -> Unit): VmVo = Builder().apply(block).build()
    }
}



/**
 * 가상머신 id & name
 */
fun Vm.toVmIdName(): VmVo = VmVo.builder {
	id { this@toVmIdName.id() }
	name { this@toVmIdName.name() }
}
fun List<Vm>.toVmsIdName(): List<VmVo> =
	this@toVmsIdName.map { it.toVmIdName() }


fun Vm.toVmStatus(): VmVo = VmVo.builder {
	id { this@toVmStatus.id() }
	name { this@toVmStatus.name() }
	status { this@toVmStatus.status().value() }
}
fun List<Vm>.toVmStatusList(): List<VmVo> =
	this@toVmStatusList.map { it.toVmStatus() }


fun Vm.toVmMenu(conn: Connection): VmVo {
	val vm = this@toVmMenu
	val snapshots: List<IdentifiedVo> = vm.snapshots().filter { it.snapshotType() != ACTIVE && it.snapshotType() != PREVIEW }.fromSnapshotsToIdentifiedVos()
	return VmVo.builder {
		id { vm.id() }
		name { vm.name() }
		comment { vm.comment() }
		creationTime { vm.creationTime().toLocalDateTime() }
		status { vm.status().value() }
		description { vm.description() }
		nextRun { vm.nextRunConfigurationExists() }
		hostedEngineVm { vm.origin() == "managed_hosted_engine" } // 엔진여부
		dataCenterVo { if(vm.clusterPresent()) vm.cluster().dataCenter()?.fromDataCenterToIdentifiedVo() else IdentifiedVo() }
		clusterVo { if(vm.clusterPresent()) vm.cluster().fromClusterToIdentifiedVo() else IdentifiedVo() }
		snapshotVos { snapshots }
		if (vm.status() == VmStatus.UP) {
			val statistics: List<Statistic> = conn.findAllStatisticsFromVm(vm.id()).getOrDefault(emptyList())
			val host: Host? = conn.findHost(vm.host().id()).getOrNull()
			fqdn { vm.fqdn() }
			hostVo { host?.fromHostToIdentifiedVo() }
			ipv4 { vm.reportedDevices().findVmIpv4() }
			ipv6 { vm.reportedDevices().findVmIpv6() }
			upTime { statistics.findVmUptime() }
			usageDto { statistics.toVmUsage() }
		} else {
			fqdn { null }
			upTime { null }
			ipv4 { null }
			ipv6 { null }
			usageDto { null }
		}
	}
}
fun List<Vm>.toVmMenus(conn: Connection): List<VmVo> =
	this@toVmMenus.map { it.toVmMenu(conn) }

fun VmsEntity.toVmEntity(conn: Connection): VmVo {
	val entity = this@toVmEntity
	// val snapshots: List<Snapshot> = conn.findAllSnapshotsFromVm(entity.vmGuid.toString())
	// 	.getOrDefault(listOf())
	// 	.filter { it.snapshotType() != ACTIVE && it.snapshotType() != PREVIEW }

	return VmVo.builder {
		id { entity.vmGuid.toString() }
		name { entity.vmName }
		comment { entity.freeTextComment }
		creationTime { entity.creationDate }
		stopTime { entity.lastStopTime }
		// upTime { entity.elapsedTime }
		status { com.itinfo.rutilvm.api.ovirt.business.VmStatus.forValue(entity.status).description }
		description { entity.description }
		nextRun { entity.nextRunConfigExists }
		hostedEngineVm { entity.origin == 6 }
		usageDto {
			UsageDto.builder {
				cpuPercent { usageCpuPercent }
				memoryPercent { usageMemPercent }
				networkPercent { usageNetworkPercent }
			}
		}
		ipv4 { listOf(entity.vmIp) }
		fqdn { entity.vmHost }
		templateVo {
			IdentifiedVo.builder {
				id { entity.originalTemplateId.toString() }
				name { entity.originalTemplateName }
			}
		}
		hostVo {
			IdentifiedVo.builder {
				id { entity.runOnVds.toString() }
				name { entity.runOnVdsName }
			}
		}
		clusterVo {
			IdentifiedVo.builder {
				id { entity.clusterId.toString() }
				name { entity.clusterName }
			}
		}
		dataCenterVo {
			IdentifiedVo.builder {
				id { entity.storagePoolId.toString() }
				name { entity.storagePoolName }
			}
		}
		// snapshotVos { snapshots.fromSnapshotsToIdentifiedVos() }
	}
}

fun List<VmsEntity>.toVmEntities(conn: Connection): List<VmVo> =
	this@toVmEntities.map { it.toVmEntity(conn) }


fun Vm.toVmVo(conn: Connection): VmVo {
	val vm = this@toVmVo
	val template: Template? = conn.findTemplate(vm.template().id()).getOrNull()
	// val originTemplate: Template? = conn.findTemplate(vm.originalTemplate().id()).getOrNull()
	val storageDomain: StorageDomain? =
		if (vm.leasePresent()) { conn.findStorageDomain(vm.lease().storageDomain().id()).getOrNull() }
		else null
	val hosts =
		if (vm.placementPolicy().hostsPresent()) { vm.placementPolicy().hosts().map { it } }
		else listOf()
	// val snapshots: List<Snapshot> = conn.findAllSnapshotsFromVm(vm.id()).getOrDefault(listOf())
	val cdromId = vm.cdroms().firstOrNull()?.file()?.id()
	val disk: Disk? = if (cdromId != null) {
		try {
			conn.findDisk(cdromId).getOrNull()
		} catch (e: Exception) {
			null
		}
	} else null

	return VmVo.builder {
		id { vm.id() }
		name { vm.name() }
		description { vm.description() }
		comment { vm.comment() }
		status { vm.status().value() }
		optimizeOption { vm.type().value() }
		biosType { vm.bios().type().value() }
		osType { vm.os().type() }
		cpuArc { vm.cpu().architecture() }
		cpuTopologyCnt { calculateCpuTopology(vm) }
		cpuTopologyCore { vm.cpu().topology().coresAsInteger() }
		cpuTopologySocket { vm.cpu().topology().socketsAsInteger() }
		cpuTopologyThread { vm.cpu().topology().threadsAsInteger() }
		cpuPinningPolicy { vm.cpuPinningPolicy().value() }
		memorySize { vm.memory() }
		memoryGuaranteed { vm.memoryPolicy().guaranteed() }
		memoryMax { vm.memoryPolicy().max() }
		creationTime { vm.creationTime().toLocalDateTime() }
		deleteProtected { vm.deleteProtected() }
		monitor { if(vm.displayPresent()) vm.display().monitorsAsInteger() else 0 }
		displayType { if(vm.displayPresent()) vm.display().type() else DisplayType.VNC }
		ha { vm.highAvailability().enabled() }
		haPriority { vm.highAvailability().priorityAsInteger() }
		ioThreadCnt  { if (vm.io().threadsPresent()) vm.io().threadsAsInteger() else 0 }
		migrationMode { vm.placementPolicy().affinity().value() } //migrationMode
		migrationEncrypt { vm.migration().encrypted() }
		migrationAutoConverge { vm.migration().autoConverge() }
		migrationCompression { vm.migration().compressed() }
		firstDevice { vm.os().boot().devices().first().value() }
		secDevice {
			if (vm.os().boot().devices().size > 1) vm.os().boot().devices()[1].value()
			else null
		}
		hostInCluster { !vm.placementPolicy().hostsPresent() }
		hostVos { hosts.fromHostsToIdentifiedVos() }
		storageDomainVo { storageDomain?.fromStorageDomainToIdentifiedVo() }
		if(vm.guestOperatingSystemPresent()){
			guestArc { vm.guestOperatingSystem().architecture() }
			guestOsType { vm.guestOperatingSystem().family() }
			guestDistribution { vm.guestOperatingSystem().distribution() }
			guestKernelVer { vm.guestOperatingSystem().kernel().version().fullVersion() }
			guestTimeZone { vm.guestTimeZone().name() + " " + vm.guestTimeZone().utcOffset() }
		}else{
			guestArc { "" }
			guestOsType { "" }
			guestDistribution { "" }
			guestKernelVer { "" }
			guestTimeZone { "" }
		}
		startPaused { vm.startPaused() }
		storageErrorResumeBehaviour { vm.storageErrorResumeBehaviour() }
		usb { if(vm.usbPresent()) vm.usb().enabled() else false }
		virtioScsiMultiQueueEnabled { vm.virtioScsiMultiQueuesEnabled() }
		hostedEngineVm { vm.origin() == "managed_hosted_engine" }
		timeOffset { vm.timeZone().name() }
		nextRun { vm.nextRunConfigurationExists() }
		if (vm.status() == VmStatus.UP) {
			val host: Host? = conn.findHost(vm.host().id()).getOrNull()
			fqdn { vm.fqdn() }
			ipv4 { vm.reportedDevices().findVmIpv4() }
			ipv6 { vm.reportedDevices().findVmIpv6() }
			hostVo { host?.fromHostToIdentifiedVo() }
			upTime { vm.statistics().findVmUptime() }
			usageDto { vm.statistics().toVmUsage() }
		} else {
			fqdn { null }
			upTime { null }
			ipv4 { null }
			ipv6 { null }
			usageDto { null }
		}
		dataCenterVo { if(vm.clusterPresent()) vm.cluster().dataCenter()?.fromDataCenterToIdentifiedVo() else IdentifiedVo() }
		clusterVo { if(vm.clusterPresent()) vm.cluster().fromClusterToIdentifiedVo() else IdentifiedVo() }
		originTemplateVo { if(vm.originalTemplatePresent()) vm.originalTemplate().fromTemplateToIdentifiedVo() else null }
		templateVo { template?.fromTemplateToIdentifiedVo() }
		cpuProfileVo { vm.cpuProfile().fromCpuProfileToIdentifiedVo() }
		diskAttachmentVos { vm.diskAttachments().toDiskAttachmentVos(conn) }
		cdRomVo { disk?.fromDiskToIdentifiedVo() }
		nicVos { vm.nics().toVmNics(conn) }
	}
}
fun List<Vm>.toVmVos(conn: Connection) =
	this@toVmVos.map { it.toVmVo(conn) }

fun Vm.toTemplateVmVo(conn: Connection): VmVo {
	val vm = this@toTemplateVmVo
	return VmVo.builder {
		id { vm.id() }
		name { vm.name() }
		status { vm.status().value() }
		if (vm.status() == VmStatus.UP) {
			val statistics: List<Statistic> = conn.findAllStatisticsFromVm(vm.id()).getOrDefault(emptyList())
			val host: Host? = conn.findHost(vm.host().id()).getOrNull()
			fqdn { vm.fqdn() }
			upTime { statistics.findVmUptime() }
			ipv4 { vm.reportedDevices().findVmIpv4() }
			ipv6 { vm.reportedDevices().findVmIpv6() }
			hostVo { host?.fromHostToIdentifiedVo() }
		} else {
			fqdn { null }
			upTime { null }
			ipv4 { null }
			ipv6 { null }
			hostVo { null }
		}
	}
}
fun List<Vm>.toTemplateVmVos(conn: Connection) =
	this@toTemplateVmVos.map { it.toTemplateVmVo(conn) }


fun Vm.toVmStorageDomainMenu(conn: Connection, storageDomainId: String): VmVo {
	val vm: Vm? = conn.findVm(this@toVmStorageDomainMenu.id(), follow = "diskattachments.disk,snapshots").getOrNull()
	val snapshots: List<Snapshot> = vm?.snapshots()?.filter { snapshot ->
		snapshot.snapshotType() != SnapshotType.ACTIVE
	} ?: emptyList()

	val diskAttachments: List<DiskAttachment> = vm?.diskAttachments()?.filter { diskAttachment ->
		diskAttachment.disk().storageDomains()?.any { it.id() == storageDomainId } == true
	} ?: emptyList()

	val virtualSize = diskAttachments.sumOf { it.disk().provisionedSize() }
	val actualSize = diskAttachments.sumOf { it.disk().totalSize() }

	return VmVo.builder {
		id { this@toVmStorageDomainMenu.id() }
		name { this@toVmStorageDomainMenu.name() }
		status { this@toVmStorageDomainMenu.status().value() }
		creationTime { this@toVmStorageDomainMenu.creationTime().toLocalDateTime() }
		memoryGuaranteed { virtualSize }  // 원래 디스크의 가상크기 합친값
		memorySize { actualSize }		// 디스크 실제 값 합친값
		diskAttachmentVos { diskAttachments.toDiskAttachmentIdNames(conn) }
		snapshotVos { snapshots.fromSnapshotsToIdentifiedVos() }
	}
}
fun List<Vm>.toVmStorageDomainMenus(conn: Connection, storageDomainId: String): List<VmVo> =
	this@toVmStorageDomainMenus.map { it.toVmStorageDomainMenu(conn, storageDomainId) }

fun Vm.toNetworkVm(conn: Connection): VmVo {
	val cluster: Cluster? = conn.findCluster(this@toNetworkVm.cluster().id()).getOrNull()
	return VmVo.builder {
		id { this@toNetworkVm.id() }
		name { this@toNetworkVm.name() }
		description { this@toNetworkVm.description() }
		status { this@toNetworkVm.status().value() }
		clusterVo { cluster?.fromClusterToIdentifiedVo() }
		if (this@toNetworkVm.status() == VmStatus.UP) {
			val statistics: List<Statistic> = conn.findAllStatisticsFromVm(this@toNetworkVm.id()).getOrDefault(emptyList())
			fqdn { this@toNetworkVm.fqdn() }
			upTime { statistics.findVmUptime() }
			ipv4 { this@toNetworkVm.reportedDevices().findVmIpv4() }
			ipv6 { this@toNetworkVm.reportedDevices().findVmIpv6() }
		} else {
			fqdn { null }
			upTime { null }
			ipv4 { null }
			ipv6 { null }
		}
	}
}
fun List<Vm>.toNetworkVms(conn: Connection): List<VmVo> =
	this@toNetworkVms.map { it.toNetworkVm(conn) }

fun Vm.toDiskVm(conn: Connection): VmVo {
	val cluster: Cluster? = conn.findCluster(this@toDiskVm.cluster().id()).getOrNull()
	return VmVo.builder {
		id { this@toDiskVm.id() }
		name { this@toDiskVm.name() }
		description { this@toDiskVm.description() }
		status { this@toDiskVm.status().value() }
		clusterVo { cluster?.fromClusterToIdentifiedVo() }
		if (this@toDiskVm.status() == VmStatus.UP) {
			val statistics: List<Statistic> = conn.findAllStatisticsFromVm(this@toDiskVm.id()).getOrDefault(emptyList())
			val host: Host? = conn.findHost(this@toDiskVm.host().id()).getOrNull()
			fqdn { this@toDiskVm.fqdn() }
			upTime { statistics.findVmUptime() }
			ipv4 { this@toDiskVm.reportedDevices().findVmIpv4() }
			ipv6 { this@toDiskVm.reportedDevices().findVmIpv6() }
			usageDto { this@toDiskVm.statistics().toVmUsage() }
			hostVo { host?.fromHostToIdentifiedVo() }
		}
	}
}
fun List<Vm>.toDiskVms(conn: Connection): List<VmVo> =
	this@toDiskVms.map { it.toDiskVm(conn) }

fun Vm.toUnregisteredVm(conn: Connection): VmVo {
	val vm = this@toUnregisteredVm
	val tmp = conn.findTemplate(vm.template().id()).getOrNull()
	return VmVo.builder {
		id { vm.id() }
		name { vm.name() }
		description { vm.description() }
		comment { vm.comment() }
		status { vm.status().value() }
		templateVo { tmp?.fromTemplateToIdentifiedVo() }
		biosType { vm.bios().type().toString() }
		cpuArc { vm.cpu().architecture() }
		cpuTopologyCnt { calculateCpuTopology(vm) }
		cpuTopologyCore { vm.cpu().topology().coresAsInteger() }
		cpuTopologySocket { vm.cpu().topology().socketsAsInteger() }
		cpuTopologyThread { vm.cpu().topology().threadsAsInteger() }
		cpuPinningPolicy { vm.cpuPinningPolicy().value() }
		creationTime { vm.creationTime().toLocalDateTime() }
		monitor { if(vm.displayPresent()) vm.display().monitorsAsInteger() else 0 }
		displayType { if(vm.displayPresent()) vm.display().type() else DisplayType.VNC }
		ha { vm.highAvailability().enabled() }
		haPriority { vm.highAvailability().priorityAsInteger() }
		memorySize { vm.memory() }
		memoryGuaranteed { vm.memoryPolicy().guaranteed() }
		memoryMax { vm.memoryPolicy().max() }
		osType { vm.os().type() }
		optimizeOption { vm.type().toString() }
		usb { if(vm.usbPresent()) vm.usb().enabled() else false }
	}
}
fun List<Vm>.toUnregisterdVms(conn: Connection): List<VmVo> =
	this@toUnregisterdVms.map { it.toUnregisteredVm(conn) }


/**
 * [Vm.toVmSystem]
 * 스냅샷에서 사용
 *
 * @return
 */
fun Vm.toVmSystem(): VmVo {
	return VmVo.builder {
		memorySize { this@toVmSystem.memory() }
		memoryGuaranteed { this@toVmSystem.memoryPolicy().guaranteed() }
		memoryMax { this@toVmSystem.memoryPolicy().max() }
		cpuTopologyCnt { calculateCpuTopology(this@toVmSystem) }
		cpuTopologySocket { this@toVmSystem.cpu().topology().socketsAsInteger() }
		cpuTopologyCore { this@toVmSystem.cpu().topology().coresAsInteger() }
		cpuTopologyThread { this@toVmSystem.cpu().topology().threadsAsInteger() }
		// timeOffset { this@toVmSystem.timeZone().name() }
	}
}


/**
 * [List<[Statistic]>.findVmUptime]
 * Vm 업타임 구하기
 * 이건 매개변수로 statisticList 안줘도 되는게 vm에서만 사용
 *
 * @return 일, 시간, 분 형식
 */
fun List<Statistic>.findVmUptime(): String {
	val time: Long = this@findVmUptime.filter {
		it.name() == "elapsed.time"
	}.map {
		it.values().firstOrNull()?.datum()?.toLong()
	}.firstOrNull() ?: 0L
	return time.toTimeElapsedKr()
}


/**
 * [List<[Nic]>.findVmIpv4]
 * Vm ip 알아내기
 * vms/{id}/nic/{id}/statistic
 * @return
 */
fun List<ReportedDevice>.findVmIpv4(): List<String> {
	return this@findVmIpv4.flatMap { report ->
		report.ips()?.filter { it.version() == V4 }?.map { it.address() } ?: emptyList()
	}.distinct()
}

/**
 * [List<[ReportedDevice]>.findVmIpv6]
 * Vm ip 알아내기
 * vms/{id}/nic/{id}/statistic
 * @return
 */
fun List<ReportedDevice>.findVmIpv6(): List<String> {
	return this@findVmIpv6.flatMap { report ->
		report.ips()?.filter { it.version() == V6 }?.map { it.address() } ?: emptyList()
	}.distinct()
}


fun VmVo.toVmBuilder(): VmBuilder {
	return VmBuilder().apply {
		toVmInfoBuilder(this)
		toVmSystemBuilder(this)
		toVmInitBuilder(this)
		toVmHostBuilder(this)
		toVmHaBuilder(this)
		toVmBootBuilder(this)
		// toVmNicBuilder(this)
	}
}

fun VmVo.toAddVm(): Vm =
	toVmBuilder()
		.template(TemplateBuilder().id(templateVo.id))
		.build()

fun VmVo.toEditVm(): Vm =
	toVmBuilder()
		.id(id)
		.bios(
			BiosBuilder()
				.type(BiosType.fromValue(biosType))
				.bootMenu(BootMenuBuilder().enabled(biosBootMenu).build())
		)
		.build()

fun VmVo.toVmInfoBuilder(vmBuilder: VmBuilder): VmBuilder = vmBuilder.apply {
	name(name)
	description(description)
	comment(comment)
	cluster(ClusterBuilder().id(clusterVo.id))
	bios(BiosBuilder().type(BiosType.fromValue(biosType)).build())
	type(VmType.fromValue(optimizeOption))
	timeZone(
		TimeZoneBuilder().name(
			if(osType.contains("windows")) "GMT Standard Time"
			else timeOffset
		)
	)
}

fun VmVo.toVmSystemBuilder(vmBuilder: VmBuilder): VmBuilder = vmBuilder.apply {
	memory(memorySize)
	memoryPolicy(
		MemoryPolicyBuilder().max(memoryMax).guaranteed(memoryGuaranteed)
	)
	cpu(
		CpuBuilder()
			.topology(
				CpuTopologyBuilder()
					.cores(cpuTopologyCore)
					.sockets(cpuTopologySocket)
					.threads(cpuTopologyThread)
					.build()
			)
	)
}

fun VmVo.toVmInitBuilder(vmBuilder: VmBuilder): VmBuilder = vmBuilder.apply {
	if (cloudInit) {
		initialization(InitializationBuilder().customScript(script))
	}
}

fun VmVo.toVmHostBuilder(vmBuilder: VmBuilder): VmBuilder = vmBuilder.apply {
	val placementBuilder = VmPlacementPolicyBuilder()
	if (!hostInCluster) {
		placementBuilder.hosts(hostVos.map { HostBuilder()
			.id(it.id)
			.build() })
	}
	placementPolicy(placementBuilder.affinity(VmAffinity.fromValue(migrationMode)))
}

fun VmVo.toVmHaBuilder(vmBuilder: VmBuilder): VmBuilder = vmBuilder.apply {
	highAvailability(HighAvailabilityBuilder().enabled(ha).priority(haPriority))
	if (ha && storageDomainVo.id.isNotEmpty()) {
		lease(StorageDomainLeaseBuilder().storageDomain(StorageDomainBuilder().id(storageDomainVo.id).build()).build())
	}
}

fun VmVo.toVmBootBuilder(vmBuilder: VmBuilder): VmBuilder = vmBuilder.apply {
	val bootDeviceList = mutableListOf<BootDevice>()
	bootDeviceList.add(BootDevice.fromValue(firstDevice))

	// 두 번째 장치가 비어있지 않고 "none"이 아닐 때만 추가
	if (secDevice.isNotEmpty() && secDevice != "none") {
		bootDeviceList.add(BootDevice.fromValue(secDevice))
	}
	os(
		OperatingSystemBuilder()
			.type(osType)
			.boot(BootBuilder().devices(bootDeviceList))
	)
	bios(BiosBuilder().bootMenu(BootMenuBuilder().enabled(biosBootMenu).build()))
}


fun VmVo.toRegisterVm(): Vm {
	return VmBuilder()
		.id(this.id)
		.name(this.name)
		.cluster(ClusterBuilder().id(this.clusterVo.id).build())
		.build()
}



// CPU Topology 계산 최적화
fun calculateCpuTopology(vm: Vm): Int {
	val topology = vm.cpu().topology()
	return topology.coresAsInteger() * topology.socketsAsInteger() * topology.threadsAsInteger()
}

