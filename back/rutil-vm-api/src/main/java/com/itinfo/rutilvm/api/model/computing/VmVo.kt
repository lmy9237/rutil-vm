package com.itinfo.rutilvm.api.model.computing

import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.model.fromClusterToIdentifiedVo
import com.itinfo.rutilvm.api.model.fromCpuProfileToIdentifiedVo
import com.itinfo.rutilvm.api.model.fromDataCenterToIdentifiedVo
import com.itinfo.rutilvm.api.model.fromDiskToIdentifiedVo
import com.itinfo.rutilvm.api.model.fromHostToIdentifiedVo
import com.itinfo.rutilvm.api.model.fromHostsToIdentifiedVos
import com.itinfo.rutilvm.api.model.fromSnapshotsToIdentifiedVos
import com.itinfo.rutilvm.api.model.fromStorageDomainToIdentifiedVo
import com.itinfo.rutilvm.api.model.fromTemplateToIdentifiedVo
import com.itinfo.rutilvm.api.model.network.NicVo
import com.itinfo.rutilvm.api.model.network.toVmNics
import com.itinfo.rutilvm.api.model.storage.DiskAttachmentVo
import com.itinfo.rutilvm.api.model.storage.toDiskAttachmentIdNames
import com.itinfo.rutilvm.api.model.storage.toDiskAttachmentVos
import com.itinfo.rutilvm.api.ovirt.business.ArchitectureType
import com.itinfo.rutilvm.api.ovirt.business.BiosTypeB
import com.itinfo.rutilvm.api.ovirt.business.CpuPinningPolicyB
import com.itinfo.rutilvm.api.ovirt.business.DisplayTypeB
import com.itinfo.rutilvm.api.ovirt.business.GraphicsTypeB
import com.itinfo.rutilvm.api.ovirt.business.MigrationSupport
import com.itinfo.rutilvm.api.ovirt.business.VmOsType
import com.itinfo.rutilvm.api.ovirt.business.VmPauseStatusB
import com.itinfo.rutilvm.api.ovirt.business.VmPauseStatusB.none
import com.itinfo.rutilvm.api.ovirt.business.VmResumeBehavior
import com.itinfo.rutilvm.api.ovirt.business.VmStatusB
import com.itinfo.rutilvm.api.ovirt.business.VmTypeB
import com.itinfo.rutilvm.api.ovirt.business.findArchitectureType
import com.itinfo.rutilvm.api.ovirt.business.findBiosTypeB
import com.itinfo.rutilvm.api.ovirt.business.findGraphicsTypeB
import com.itinfo.rutilvm.api.ovirt.business.findMigrationAutoConverge
import com.itinfo.rutilvm.api.ovirt.business.findMigrationCompression
import com.itinfo.rutilvm.api.ovirt.business.findMigrationEncrypt
import com.itinfo.rutilvm.api.ovirt.business.findMigrationSupport
import com.itinfo.rutilvm.api.ovirt.business.findStatus
import com.itinfo.rutilvm.api.ovirt.business.findVmOsType
import com.itinfo.rutilvm.api.ovirt.business.model.TreeNavigatable
import com.itinfo.rutilvm.api.ovirt.business.model.TreeNavigatableType
import com.itinfo.rutilvm.api.ovirt.business.toBiosType
import com.itinfo.rutilvm.api.ovirt.business.toCpuPinningPolicyB
import com.itinfo.rutilvm.api.ovirt.business.toDisplayType
import com.itinfo.rutilvm.api.ovirt.business.toOsTypeCode
import com.itinfo.rutilvm.api.ovirt.business.toVmAffinity
import com.itinfo.rutilvm.api.ovirt.business.toVmResumeBehavior
import com.itinfo.rutilvm.api.ovirt.business.toVmStatusB
import com.itinfo.rutilvm.api.ovirt.business.toVmType
import com.itinfo.rutilvm.api.ovirt.business.toVmTypeB
import com.itinfo.rutilvm.api.repository.history.dto.UsageDto
import com.itinfo.rutilvm.api.repository.history.dto.toVmUsage
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.common.formatEnhancedFromLDT
import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.common.ovirtDf
import com.itinfo.rutilvm.common.toLocalDateTime
import com.itinfo.rutilvm.common.toTimeElapsedKr
import com.itinfo.rutilvm.util.ovirt.findAllStatisticsFromVm
import com.itinfo.rutilvm.util.ovirt.findCluster
import com.itinfo.rutilvm.util.ovirt.findDisk
import com.itinfo.rutilvm.util.ovirt.findHost
import com.itinfo.rutilvm.util.ovirt.findStorageDomain
import com.itinfo.rutilvm.util.ovirt.findTemplate
import com.itinfo.rutilvm.util.ovirt.findVm
import com.itinfo.rutilvm.util.ovirt.isHostedEngineVm
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.builders.BiosBuilder
import org.ovirt.engine.sdk4.builders.BootBuilder
import org.ovirt.engine.sdk4.builders.BootMenuBuilder
import org.ovirt.engine.sdk4.builders.CdromBuilder
import org.ovirt.engine.sdk4.builders.ClusterBuilder
import org.ovirt.engine.sdk4.builders.CpuBuilder
import org.ovirt.engine.sdk4.builders.CpuTopologyBuilder
import org.ovirt.engine.sdk4.builders.FileBuilder
import org.ovirt.engine.sdk4.builders.DisplayBuilder
import org.ovirt.engine.sdk4.builders.FloppyBuilder
import org.ovirt.engine.sdk4.builders.HighAvailabilityBuilder
import org.ovirt.engine.sdk4.builders.HostBuilder
import org.ovirt.engine.sdk4.builders.InitializationBuilder
import org.ovirt.engine.sdk4.builders.MemoryPolicyBuilder
import org.ovirt.engine.sdk4.builders.OperatingSystemBuilder
import org.ovirt.engine.sdk4.builders.StorageDomainBuilder
import org.ovirt.engine.sdk4.builders.StorageDomainLeaseBuilder
import org.ovirt.engine.sdk4.builders.TemplateBuilder
import org.ovirt.engine.sdk4.builders.TimeZoneBuilder
import org.ovirt.engine.sdk4.builders.VirtioScsiBuilder
import org.ovirt.engine.sdk4.builders.VmBuilder
import org.ovirt.engine.sdk4.builders.VmPlacementPolicyBuilder
import org.ovirt.engine.sdk4.types.Architecture
import org.ovirt.engine.sdk4.types.BootDevice
import org.ovirt.engine.sdk4.types.BootDevice.CDROM
import org.ovirt.engine.sdk4.types.BootDevice.HD
import org.ovirt.engine.sdk4.types.BootDevice.NETWORK
import org.ovirt.engine.sdk4.types.Cdrom
import org.ovirt.engine.sdk4.types.Cluster
import org.ovirt.engine.sdk4.types.Disk
import org.ovirt.engine.sdk4.types.DiskAttachment
import org.ovirt.engine.sdk4.types.DisplayType
import org.ovirt.engine.sdk4.types.Floppy
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
import org.ovirt.engine.sdk4.types.VmStorageErrorResumeBehaviour

import org.slf4j.LoggerFactory
import java.io.Serializable
import java.math.BigInteger
import java.time.LocalDateTime
import java.util.*

private val log = LoggerFactory.getLogger(VmVo::class.java)

/**
 * [VmVo]
 * 가삳머신
 *
 * @property id [String]
 * @property name [String]
 * @property description [String]
 * @property comment [String]
 * @property status [VmStatusB] 가상머신 상태
 * @property iconSmall [VmIconVo] 작은 아이콘
 * @property iconLarge [VmIconVo] 큰 아이콘
 * @property optimizeOption [VmTypeB] 가상머신 최적화 옵션
 * @property biosType [BiosTypeB] vm.bios().type() 칩셋
 * @property biosBootMenu [Boolean] BIOS 부팅 메뉴 활성화 여부
 * @property osType [VmOsType] vm.os().type()  운영체제
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
 * @property migrationMode [VmAffinity]
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
 * @property autoStartUp [Boolean]
 * @property statusDetail [VmPauseStatusB]
 * @property windowGuestTool [Boolean]
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
	override val id: String = "",
	override val name: String = "",
	val description: String = "",
	val comment: String = "",
	// val status: String = "",
	override val status: VmStatusB? = VmStatusB.unknown,
	private val iconSmall: VmIconVo? = null,
	private val iconLarge: VmIconVo? = null,
	val optimizeOption: VmTypeB? = VmTypeB.unknown, // VmType
	val biosType: BiosTypeB? = BiosTypeB.cluster_default,
	val biosBootMenu: Boolean = false,
	val osType: VmOsType? = VmOsType.other,
	val cpuArc: ArchitectureType? = ArchitectureType.undefined,
	val cpuTopologyCnt: Int = 0,
	val cpuTopologyCore: Int = 0,
	val cpuTopologySocket: Int = 0,
	val cpuTopologyThread: Int = 0,
	val cpuPinningPolicy: CpuPinningPolicyB? = CpuPinningPolicyB.none,
	val memorySize: BigInteger = BigInteger.ZERO,
	val memoryGuaranteed: BigInteger = BigInteger.ZERO,
	val memoryMax: BigInteger = BigInteger.ZERO,
	val ha: Boolean = false,
	val haPriority: Int = 0,
	val ioThreadCnt: Int = 0,
	val timeOffset: String = "Etc/GMT",
	val isInitialized: Boolean = false,
	val cloudInit: Boolean = false,
	val script: String = "",
	val migrationMode: MigrationSupport? = MigrationSupport.migratable, // VmAffinity
	val migrationPolicy: String = "",
	val migrationAutoConverge: Boolean? = null,
	val migrationCompression: Boolean? = null,
	val migrationEncrypt: Boolean? = null,
	val migrationParallelPolicy: Boolean? = null,
	val parallelMigration: String = "",
	val storageErrorResumeBehaviour: VmResumeBehavior? = VmResumeBehavior.auto_resume,
	val virtioScsiMultiQueueEnabled: Boolean = false,
	val firstDevice: String = "",
	val secDevice: String = "",
	val deviceList: List<String> = listOf(),
	val monitor: Int = 0,
	var displayType: DisplayTypeB? = DisplayTypeB.vga,
	val videoType: GraphicsTypeB? = GraphicsTypeB.vnc,
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
	val nextRun: Boolean? = false,
	val runOnce: Boolean? = false,
	val autoStartUp: Boolean = false,
	val statusDetail: VmPauseStatusB? = none,
	val timeElapsed: Long? = 0,
	val windowGuestTool: Boolean = false,
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
): Serializable, TreeNavigatable<VmStatusB> {
	override val type: TreeNavigatableType	get() = TreeNavigatableType.VM
	val statusCode: String 				get() = status?.code ?: VmStatusB.unknown.code
	val statusKr: String				get() = status?.kr ?: "알 수 없음"
	val statusEn: String 				get() = status?.en ?: "N/A"

	val urlSmallIcon: String			get() = iconSmall?.dataUrl ?: ""
	val urlLargeIcon: String			get() = iconLarge?.dataUrl ?: ""

	val optimizeOptionCode: String		get() = optimizeOption?.code ?: VmTypeB.unknown.code

	val biosTypeCode: String			get() = biosType?.code ?: BiosTypeB.cluster_default.code
	val biosTypeEn: String				get() = biosType?.en ?: "N/A"
	val biosTypeKr: String				get() = biosType?.kr ?: "알 수 없음"

	val osTypeCode: String				get() = osType?.code ?: VmOsType.other.code
	val osTypeName: String				get() = osType?.description ?: VmOsType.other.description

	val cpuArcCode: String				get() = cpuArc?.code ?: ArchitectureType.undefined.code

	val migrationModeCode: String			get() = migrationMode?.code ?: MigrationSupport.unknown.code
	val migrationModeEn: String				get() = migrationMode?.en ?: "N/A"
	val migrationModeKr: String				get() = migrationMode?.kr ?: "알 수 없음"

	val cpuPinningPolicyCode: String		get() = cpuPinningPolicy?.code ?: CpuPinningPolicyB.none.code
	val cpuPinningPolicyEn: String			get() = cpuPinningPolicy?.en ?: "N/A"
	val cpuPinningPolicyKr: String			get() = cpuPinningPolicy?.kr ?: "알 수 없음"

	val creationTime: String?				get() = ovirtDf.formatEnhancedFromLDT(_creationTime)
	val startTime: String?					get() = ovirtDf.formatEnhancedFromLDT(_startTime)
	val stopTime: String?					get() = ovirtDf.formatEnhancedFromLDT(_stopTime)
	val upTime: String?						get() = timeElapsed?.toTimeElapsedKr()

	val notRunning: Boolean					get() = status?.notRunning ?: false /* '실행 중'이 아닌 상태 */
	val qualified2Migrate: Boolean			get() = status?.qualified2Migrate ?: false /* 마이그레이션이 가능한 상태 */
	val qualified4SnapshotMerge: Boolean /* 스냅샷 머지 가능한 상태 */
		get() = status?.qualified4SnapshotMerge ?: false
	val qualified4LiveSnapshotMerge: Boolean /* 라이브 스냅샷 머지 가능한 상태 */
		get() = status?.qualified4LiveSnapshotMerge ?: false
	val qualified4VmBackup: Boolean /* 가상머신 백업 가능한 상태 */
		get() = status?.qualified4VmBackup ?: false
	val qualified4ConsoleConnect: Boolean /* 콘솔로 가상머신 접근 가능한 상태 */
		get() = status?.qualified4ConsoleConnect ?: false
	val qualified4PowerDown: Boolean /* 가상머신 종료 가능한 상태*/
		get() = status?.qualified4PowerDown ?: false
	val runningOrPaused: Boolean /* 가상머신이 '실행 중'이거나 '일시정지' 인 상태*/
		get() = status?.runningOrPaused ?: false
	val running: Boolean /* '실행 중' 인 상태 */
		get() = status?.running ?: false
	val upOrPaused: Boolean
		get() = status?.upOrPaused ?: false
	val starting: Boolean
		get() = status?.starting ?: false
	val startingOrUp: Boolean
		get() = status?.startingOrUp ?: false
	val hibernating: Boolean /* '수면 중' 인 상태 */
		get() = status?.hibernating ?: false
	val downOrSuspended: Boolean
		get() = status?.downOrSuspended ?: false
	val qualified4QosChange: Boolean
		get() = status?.qualified4QosChange ?: false
	val guestCpuRunning: Boolean
		get() = status?.guestCpuRunning ?: false
	val poweringUpOrMigrating: Boolean
		get() = status?.poweringUpOrMigrating ?: false
	val migrating: Boolean
		get() = status?.migrating ?: false

    override fun toString(): String =
		gson.toJson(this)

    class Builder {
		private var bId: String = ""; fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String = ""; fun name(block: () -> String?) { bName = block() ?: "" }
		private var bDescription: String = ""; fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bComment: String = ""; fun comment(block: () -> String?) { bComment = block() ?: "" }
		private var bStatus: VmStatusB = VmStatusB.unknown; fun status(block: () -> VmStatusB?) { bStatus = block() ?: VmStatusB.unknown }
		private var bIconSmall: VmIconVo? = null;fun iconSmall(block: () -> VmIconVo?) { bIconSmall = block() }
		private var bIconLarge: VmIconVo? = null;fun iconLarge(block: () -> VmIconVo?) { bIconLarge = block() }
		private var bOptimizeOption: VmTypeB? = VmTypeB.unknown; fun optimizeOption(block: () -> VmTypeB?) { bOptimizeOption = block() ?: VmTypeB.unknown }
		private var bBiosType: BiosTypeB? = BiosTypeB.cluster_default; fun biosType(block: () -> BiosTypeB?) { bBiosType = block() ?: BiosTypeB.cluster_default }
		private var bBiosBootMenu: Boolean = false; fun biosBootMenu(block: () -> Boolean?) { bBiosBootMenu = block() ?: false }
		private var bOsType: VmOsType? = VmOsType.other; fun osType(block: () -> VmOsType?) { bOsType = block() ?: VmOsType.other }
		private var bCpuArc: ArchitectureType = ArchitectureType.undefined; fun cpuArc(block: () -> ArchitectureType?) { bCpuArc = block() ?: ArchitectureType.undefined }
		private var bCpuTopologyCnt: Int = 0; fun cpuTopologyCnt(block: () -> Int?) { bCpuTopologyCnt = block() ?: 0 }
		private var bCpuTopologyCore: Int = 0; fun cpuTopologyCore(block: () -> Int?) { bCpuTopologyCore = block() ?: 0 }
		private var bCpuTopologySocket: Int = 0; fun cpuTopologySocket(block: () -> Int?) { bCpuTopologySocket = block() ?: 0 }
		private var bCpuTopologyThread: Int = 0; fun cpuTopologyThread(block: () -> Int?) { bCpuTopologyThread = block() ?: 0 }
		private var bCpuPinningPolicy: CpuPinningPolicyB? = CpuPinningPolicyB.none; fun cpuPinningPolicy(block: () -> CpuPinningPolicyB?) { bCpuPinningPolicy = block() ?: CpuPinningPolicyB.none }
		private var bMemorySize: BigInteger = BigInteger.ZERO; fun memorySize(block: () -> BigInteger?) { bMemorySize = block() ?: BigInteger.ZERO }
		private var bMemoryGuaranteed: BigInteger = BigInteger.ZERO; fun memoryGuaranteed(block: () -> BigInteger?) { bMemoryGuaranteed = block() ?: BigInteger.ZERO }
		private var bMemoryMax: BigInteger = BigInteger.ZERO; fun memoryMax(block: () -> BigInteger?) { bMemoryMax = block() ?: BigInteger.ZERO }
		private var bHa: Boolean = false; fun ha(block: () -> Boolean?) { bHa = block() ?: false }
		private var bHaPriority: Int = 0; fun haPriority(block: () -> Int?) { bHaPriority = block() ?: 0 }
		private var bIoThreadCnt: Int = 0; fun ioThreadCnt(block: () -> Int?) { bIoThreadCnt = block() ?: 0 }
		private var bTimeOffset: String = ""; fun timeOffset(block: () -> String?) { bTimeOffset = block() ?: "" }
		private var bIsInitialized: Boolean = false; fun isInitialized(block: () -> Boolean?) { bIsInitialized = block() ?: false }
		private var bCloudInit: Boolean = false; fun cloudInit(block: () -> Boolean?) { bCloudInit = block() ?: false }
		private var bScript: String = ""; fun script(block: () -> String?) { bScript = block() ?: "" }
		private var bMigrationMode: MigrationSupport? = MigrationSupport.migratable; fun migrationMode(block: () -> MigrationSupport?) { bMigrationMode = block() ?: MigrationSupport.migratable }
		private var bMigrationPolicy: String = ""; fun migrationPolicy(block: () -> String?) { bMigrationPolicy = block() ?: "" }
		private var bMigrationAutoConverge: Boolean? = null; fun migrationAutoConverge(block: () -> Boolean?) { bMigrationAutoConverge = block() }
		private var bMigrationCompression: Boolean? = null; fun migrationCompression(block: () -> Boolean?) { bMigrationCompression = block() }
		private var bMigrationEncrypt: Boolean? = null; fun migrationEncrypt(block: () -> Boolean?) { bMigrationEncrypt = block() }
		private var bMigrationParallelPolicy: Boolean? = null; fun migrationParallelPolicy(block: () -> Boolean?) { bMigrationParallelPolicy = block() }
		private var bParallelMigration: String = ""; fun parallelMigration(block: () -> String?) { bParallelMigration = block() ?: "" }
		private var bStorageErrorResumeBehaviour: VmResumeBehavior = VmResumeBehavior.auto_resume; fun storageErrorResumeBehaviour(block: () -> VmResumeBehavior?) { bStorageErrorResumeBehaviour = block() ?: VmResumeBehavior.auto_resume }
		private var bVirtioScsiMultiQueueEnabled: Boolean = false; fun virtioScsiMultiQueueEnabled(block: () -> Boolean?) { bVirtioScsiMultiQueueEnabled = block() ?: false }
		private var bFirstDevice: String = ""; fun firstDevice(block: () -> String?) { bFirstDevice = block() ?: "" }
		private var bSecDevice: String = ""; fun secDevice(block: () -> String?) { bSecDevice = block() ?: "" }
		private var bDeviceList: List<String> = listOf(); fun deviceList(block: () -> List<String>?) { bDeviceList = block() ?: listOf() }
		private var bMonitor: Int = 0; fun monitor(block: () -> Int?) { bMonitor = block() ?: 0 }
		private var bDisplayType: DisplayTypeB? = DisplayTypeB.vga; fun displayType(block: () -> DisplayTypeB?) { bDisplayType = block() ?: DisplayTypeB.vga }
		private var bVideoType: GraphicsTypeB? = GraphicsTypeB.vnc; fun videoType(block: () -> GraphicsTypeB?) { bVideoType = block() ?: GraphicsTypeB.vnc }
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
		private var bNextRun: Boolean? = false; fun nextRun(block: () -> Boolean?) { bNextRun = block() ?: false }
		private var bRunOnce: Boolean? = false; fun runOnce(block: () -> Boolean?) { bRunOnce = block() ?: false }
		private var bAutoStartUp: Boolean = false; fun autoStartUp(block: () -> Boolean?) { bAutoStartUp = block() ?: false }
		private var bStatusDetail: VmPauseStatusB? = none; fun statusDetail(block: () -> VmPauseStatusB?) { bStatusDetail = block() ?: none }
		private var bTimeElapsed: Long? = 0L; fun timeElapsed(block: () -> Long?) { bTimeElapsed = block() ?: 0L }
		private var bWindowGuestTool: Boolean = false; fun windowGuestTool(block: () -> Boolean?) { bWindowGuestTool = block() ?: false }
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
        fun build(): VmVo = VmVo(bId, bName, bDescription, bComment, bStatus, bIconSmall, bIconLarge, bOptimizeOption, bBiosType, bBiosBootMenu, bOsType, bCpuArc, bCpuTopologyCnt, bCpuTopologyCore, bCpuTopologySocket, bCpuTopologyThread, bCpuPinningPolicy, bMemorySize, bMemoryGuaranteed, bMemoryMax, bHa, bHaPriority, bIoThreadCnt, bTimeOffset, bIsInitialized, bCloudInit, bScript, bMigrationMode, bMigrationPolicy, bMigrationAutoConverge, bMigrationCompression, bMigrationEncrypt, bMigrationParallelPolicy, bParallelMigration, bStorageErrorResumeBehaviour, bVirtioScsiMultiQueueEnabled, bFirstDevice, bSecDevice, bDeviceList, bMonitor, bDisplayType, bVideoType, bGuestArc, bGuestOsType, bGuestDistribution, bGuestKernelVer, bGuestTimeZone, bDeleteProtected, bStartPaused, bUsb, bHostedEngineVm, bFqdn, bNextRun, bRunOnce, bAutoStartUp, bStatusDetail, bTimeElapsed, bWindowGuestTool, bCreationTime, bStartTime, bStopTime, bIpv4, bIpv6, bHostInCluster, bHostVos, bStorageDomainVo, bCpuProfileVo, bCdRomVo, bDataCenterVo, bClusterVo, bHostVo, bSnapshotVos, bHostDeviceVos, bOriginTemplateVo, bTemplateVo, bNicVos, bDiskAttachmentVos, bUsageDto)
    }

    companion object {
        private val log by LoggerDelegate()
        inline fun builder(block: Builder.() -> Unit): VmVo = Builder().apply(block).build()
    }
}

/**
 * [Vm.toVmIdName]
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
	status { this@toVmStatus.findStatus() }
}

fun List<Vm>.toVmStatusList(): List<VmVo> =
	this@toVmStatusList.map { it.toVmStatus() }

fun Vm.toVmMenu(conn: Connection): VmVo {
	val vm = this@toVmMenu
	val status = vm.findStatus()
	val snapshots: List<IdentifiedVo> = vm.snapshots().filter { it.snapshotType() != ACTIVE && it.snapshotType() != PREVIEW }.fromSnapshotsToIdentifiedVos()
	return VmVo.builder {
		id { vm.id() }
		name { vm.name() }
		comment { vm.comment() }
		description { vm.description() }
		status { status }
		iconSmall { if (vm.largeIconPresent()) vm.largeIcon().toVmIconVo() else null }
		iconLarge { if (vm.smallIconPresent()) vm.smallIcon().toVmIconVo() else null }
		creationTime { vm.creationTime().toLocalDateTime() }
		nextRun { vm.nextRunConfigurationExists() }
		hostedEngineVm { vm.isHostedEngineVm } // 엔진여부
		dataCenterVo { if(vm.clusterPresent()) vm.cluster().dataCenter()?.fromDataCenterToIdentifiedVo() else IdentifiedVo() }
		clusterVo { if(vm.clusterPresent()) vm.cluster().fromClusterToIdentifiedVo() else IdentifiedVo() }
		snapshotVos { snapshots }
		if (status == VmStatusB.up) {
			val statistics: List<Statistic> = conn.findAllStatisticsFromVm(vm.id()).getOrDefault(emptyList())
			val host: Host? = conn.findHost(vm.host().id()).getOrNull()
			fqdn { vm.fqdn() }
			hostVo { host?.fromHostToIdentifiedVo() }
			ipv4 { vm.reportedDevices().findVmIpv4() }
			ipv6 { vm.reportedDevices().findVmIpv6() }
			timeElapsed { statistics.findVmUptime() }
			usageDto { statistics.toVmUsage() }
		} else {
			fqdn { null }
			timeElapsed { null }
			ipv4 { null }
			ipv6 { null }
			usageDto { null }
		}
	}
}
fun List<Vm>.toVmMenus(conn: Connection): List<VmVo> =
	this@toVmMenus.map { it.toVmMenu(conn) }

fun Vm.toVmVo(conn: Connection): VmVo {
	val vm = this@toVmVo
	val status = vm.findStatus()
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
		status { status }
		iconSmall { if (vm.smallIconPresent()) vm.smallIcon().toVmIconVo() else null }
		iconLarge { if (vm.largeIconPresent()) vm.largeIcon().toVmIconVo() else null }
		creationTime { vm.creationTime().toLocalDateTime() }
		optimizeOption { vm.type().toVmTypeB() }
		nextRun { vm.nextRunConfigurationExists() }
		biosType { vm.bios().findBiosTypeB() }
		biosBootMenu { vm.bios().bootMenu().enabled() }
		osType { vm.os().findVmOsType() }
		cpuArc { vm.cpu().findArchitectureType() }
		cpuTopologyCnt { calculateCpuTopology(vm) }
		cpuTopologyCore { vm.cpu().topology().coresAsInteger() }
		cpuTopologySocket { vm.cpu().topology().socketsAsInteger() }
		cpuTopologyThread { vm.cpu().topology().threadsAsInteger() }
		cpuPinningPolicy { vm.cpuPinningPolicy().toCpuPinningPolicyB() }
		memorySize { vm.memory() }
		memoryGuaranteed { vm.memoryPolicy().guaranteed() }
		memoryMax { vm.memoryPolicy().max() }
		deleteProtected { vm.deleteProtected() }
		monitor { if (vm.displayPresent()) vm.display().monitorsAsInteger() else 0 }
		// displayType {  }
		videoType { vm.display().findGraphicsTypeB() }
		ha { vm.highAvailability().enabled() }
		haPriority { vm.highAvailability().priorityAsInteger() }
		ioThreadCnt  { if (vm.io().threadsPresent()) vm.io().threadsAsInteger() else 0 }
		migrationMode { vm.placementPolicy().findMigrationSupport() } //migrationMode
		migrationEncrypt { vm.migration().findMigrationEncrypt() }
		migrationAutoConverge { vm.migration().findMigrationAutoConverge() }
		migrationCompression { vm.migration().findMigrationCompression() }
		firstDevice { vm.os().boot().devices().first().value() }
		secDevice {
			if (vm.os().boot().devices().size > 1) vm.os().boot().devices()[1].value()
			else null
		}
		hostInCluster { !vm.placementPolicy().hostsPresent() }
		hostVos { hosts.fromHostsToIdentifiedVos() }
		storageDomainVo { storageDomain?.fromStorageDomainToIdentifiedVo() }
		if (vm.guestOperatingSystemPresent()){
			guestArc { vm.guestOperatingSystem().architecture() }
			guestOsType { vm.guestOperatingSystem().family() }
			guestDistribution { vm.guestOperatingSystem().distribution() }
			guestKernelVer { vm.guestOperatingSystem().kernel().version().fullVersion() }
			guestTimeZone { vm.guestTimeZone().name() + " " + vm.guestTimeZone().utcOffset() }
		} else {
			guestArc { "" }
			guestOsType { "" }
			guestDistribution { "" }
			guestKernelVer { "" }
			guestTimeZone { "" }
		}
		startPaused { vm.startPaused() }
		storageErrorResumeBehaviour { vm.storageErrorResumeBehaviour().toVmResumeBehavior() }
		usb { if(vm.usbPresent()) vm.usb().enabled() else false }
		virtioScsiMultiQueueEnabled { vm.virtioScsiMultiQueuesEnabled() }
		hostedEngineVm { vm.isHostedEngineVm }
		timeOffset { vm.timeZone().name() }
		if (status == VmStatusB.up) {
			val host: Host? = conn.findHost(vm.host().id()).getOrNull()
			fqdn { vm.fqdn() }
			ipv4 { vm.reportedDevices().findVmIpv4() }
			ipv6 { vm.reportedDevices().findVmIpv6() }
			hostVo { host?.fromHostToIdentifiedVo() }
			timeElapsed { vm.statistics().findVmUptime() }
			usageDto { vm.statistics().toVmUsage() }
		} else {
			fqdn { null }
			timeElapsed { null }
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
	val status = vm.findStatus()
	return VmVo.builder {
		id { vm.id() }
		name { vm.name() }
		status { status }
		if (status == VmStatusB.up) {
			val statistics: List<Statistic> = conn.findAllStatisticsFromVm(vm.id()).getOrDefault(emptyList())
			val host: Host? = conn.findHost(vm.host().id()).getOrNull()
			fqdn { vm.fqdn() }
			timeElapsed { statistics.findVmUptime() }
			ipv4 { vm.reportedDevices().findVmIpv4() }
			ipv6 { vm.reportedDevices().findVmIpv6() }
			hostVo { host?.fromHostToIdentifiedVo() }
		} else {
			fqdn { null }
			timeElapsed { null }
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
	val status: VmStatusB? = vm?.findStatus()
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
		status { status }
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
	val status: VmStatusB = this@toNetworkVm.findStatus()
	return VmVo.builder {
		id { this@toNetworkVm.id() }
		name { this@toNetworkVm.name() }
		description { this@toNetworkVm.description() }
		status { status }
		clusterVo { cluster?.fromClusterToIdentifiedVo() }
		if (status == VmStatusB.up) {
			val statistics: List<Statistic> = conn.findAllStatisticsFromVm(this@toNetworkVm.id()).getOrDefault(emptyList())
			fqdn { this@toNetworkVm.fqdn() }
			timeElapsed { statistics.findVmUptime() }
			ipv4 { this@toNetworkVm.reportedDevices().findVmIpv4() }
			ipv6 { this@toNetworkVm.reportedDevices().findVmIpv6() }
		} else {
			fqdn { null }
			timeElapsed { null }
			ipv4 { null }
			ipv6 { null }
		}
	}
}
fun List<Vm>.toNetworkVms(conn: Connection): List<VmVo> =
	this@toNetworkVms.map { it.toNetworkVm(conn) }

fun Vm.toDiskVm(conn: Connection): VmVo {
	val cluster: Cluster? = conn.findCluster(this@toDiskVm.cluster().id()).getOrNull()
	val status: VmStatusB = this@toDiskVm.status().toVmStatusB()

	return VmVo.builder {
		id { this@toDiskVm.id() }
		name { this@toDiskVm.name() }
		description { this@toDiskVm.description() }
		status { status }
		clusterVo { cluster?.fromClusterToIdentifiedVo() }
		if (status == VmStatusB.up) {
			val statistics: List<Statistic> = conn.findAllStatisticsFromVm(this@toDiskVm.id()).getOrDefault(emptyList())
			val host: Host? = conn.findHost(this@toDiskVm.host().id()).getOrNull()
			fqdn { this@toDiskVm.fqdn() }
			timeElapsed { statistics.findVmUptime() }
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
	val status: VmStatusB = this@toUnregisteredVm.findStatus()
	val tmp = conn.findTemplate(vm.template().id()).getOrNull()
	return VmVo.builder {
		id { vm.id() }
		name { vm.name() }
		description { vm.description() }
		comment { vm.comment() }
		status { status }
		templateVo { tmp?.fromTemplateToIdentifiedVo() }
		optimizeOption { vm.type().toVmTypeB() }
		biosType { vm.bios().findBiosTypeB() }
		osType { vm.os().findVmOsType() }
		cpuArc { vm.cpu().findArchitectureType() }
		cpuTopologyCnt { calculateCpuTopology(vm) }
		cpuTopologyCore { vm.cpu().topology().coresAsInteger() }
		cpuTopologySocket { vm.cpu().topology().socketsAsInteger() }
		cpuTopologyThread { vm.cpu().topology().threadsAsInteger() }
		cpuPinningPolicy { vm.cpuPinningPolicy().toCpuPinningPolicyB() }
		creationTime { vm.creationTime().toLocalDateTime() }
		monitor { if(vm.displayPresent()) vm.display().monitorsAsInteger() else 0 }
		// displayType {  }
		videoType { vm.display().findGraphicsTypeB() }
		ha { vm.highAvailability().enabled() }
		haPriority { vm.highAvailability().priorityAsInteger() }
		memorySize { vm.memory() }
		memoryGuaranteed { vm.memoryPolicy().guaranteed() }
		memoryMax { vm.memoryPolicy().max() }
		usb { if(vm.usbPresent()) vm.usb().enabled() else false }
	}
}
fun List<Vm>.toUnregisteredVms(conn: Connection): List<VmVo> =
	this@toUnregisteredVms.map { it.toUnregisteredVm(conn) }


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
 * @return [Long] 시간 (in milliseconds)
 */
fun List<Statistic>.findVmUptime(): Long {
	val time: Long = this@findVmUptime.filter {
		it.name() == "elapsed.time"
	}.map {
		it.values().firstOrNull()?.datum()?.toLong()
	}.firstOrNull() ?: 0L
	return time
	//  time.toTimeElapsedKr()
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


//region: Builder

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
		.template(TemplateBuilder().id(templateVo.id).build())
		.tpmEnabled(osType?.isWindows == true)
		.build()

fun VmVo.toEditVm(): Vm =
	toVmBuilder()
		.id(id)
		.bios(
			BiosBuilder()
				.type(biosType.toBiosType())
				.bootMenu(BootMenuBuilder().enabled(biosBootMenu).build())
		)
		.build()


fun VmVo.toVmInfoBuilder(vmBuilder: VmBuilder): VmBuilder = vmBuilder.apply {
	name(name)
	description(description)
	comment(comment)
	cluster(ClusterBuilder().id(clusterVo.id))
	bios(BiosBuilder().type(biosType.toBiosType()).build())
	type(optimizeOption.toVmType())
	display(DisplayBuilder().type(videoType.toDisplayType()))
	timeZone(
		TimeZoneBuilder().name(
			if (osType?.isWindows == true) "GMT Standard Time"
			else timeOffset
			// Asia/Seoul   |    Korea Standard Time
		)
	)
}

fun VmVo.toVmSystemBuilder(vmBuilder: VmBuilder): VmBuilder = vmBuilder.apply {
	memory(memorySize)
	memoryPolicy(
		MemoryPolicyBuilder().max(memoryMax).guaranteed(memoryGuaranteed)
	)
	cpu(
		CpuBuilder().topology(
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
	val placementPolicy = VmPlacementPolicyBuilder().apply {
		affinity(migrationMode?.toVmAffinity())
		if (!hostInCluster) {
			hosts(hostVos.map { HostBuilder().id(it.id).build() })
		}
	}
	placementPolicy(placementPolicy.build())
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
			.type(osType?.toOsTypeCode())
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

fun VmVo.toStartOnceVm(): Vm {
	val cdroms = listOf<Cdrom>(
		CdromBuilder()
			.file(FileBuilder().id(this.cdRomVo.id))
			.build(),
		/*CdromBuilder()
			.file(FileBuilder().id("5de14742-afa1-49a7-a793-5721102c5754"))
			.build(),*/
	)
	val floppies = listOf<Floppy>(
		FloppyBuilder().file(FileBuilder().id("5de14742-afa1-49a7-a793-5721102c5754"))
			.build()
	)

	return VmBuilder()
		.id(this.id)
		.os(OperatingSystemBuilder().boot(BootBuilder().devices(listOf(CDROM, HD, NETWORK)).build()))
		.bios(BiosBuilder()
			.bootMenu(
				BootMenuBuilder().enabled(biosBootMenu)
			)
		)
		.runOnce(true)
		.cdroms(cdroms)
		.virtioScsi(VirtioScsiBuilder().enabled(true).build())
		.build()
}

//endregion

// CPU Topology 계산 최적화
fun calculateCpuTopology(vm: Vm): Int {
	val topology = vm.cpu().topology()
	return topology.coresAsInteger() * topology.socketsAsInteger() * topology.threadsAsInteger()
}

fun List<VmVo>.toCountByStatus(code: String): Int {
	val status = VmStatusB.forCode(code)
	return this@toCountByStatus.count {
		when (status) {
			VmStatusB.up -> it.status == VmStatusB.up
			VmStatusB.down -> it.status != VmStatusB.up
			else -> true
		}
	}
}
