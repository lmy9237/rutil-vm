package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.api.ovirt.business.ArchitectureType
import com.itinfo.rutilvm.api.ovirt.business.BiosTypeB
import com.itinfo.rutilvm.api.ovirt.business.CpuPinningPolicyB
import com.itinfo.rutilvm.api.ovirt.business.GraphicsTypeB
import com.itinfo.rutilvm.api.ovirt.business.MigrationSupport
import com.itinfo.rutilvm.api.ovirt.business.OriginType
import com.itinfo.rutilvm.api.ovirt.business.UsbPolicy
import com.itinfo.rutilvm.api.ovirt.business.VmOsType
import com.itinfo.rutilvm.api.ovirt.business.VmResumeBehavior
import com.itinfo.rutilvm.api.ovirt.business.VmStatusB
import com.itinfo.rutilvm.api.ovirt.business.VmTypeB
import com.itinfo.rutilvm.common.gson
import org.hibernate.annotations.Immutable
import org.hibernate.annotations.Type
import java.util.UUID
import java.io.Serializable
import java.math.BigDecimal
import java.math.BigInteger
import java.time.LocalDateTime
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.OneToMany
import javax.persistence.ManyToOne
import javax.persistence.Table
import kotlin.math.pow

/**
 * [VmEntity]
 * 가상머신
 *
 * @property acpiEnable [Boolean]
 * @property allowConsoleReconnect [Boolean]
 * @property appList [String]
 * @property architecture [Int]
 * @property autoStartup [Boolean]
 * @property balloonEnabled [Boolean]
 * @property biosType [Int]
 * @property bootSequence [Int]
 * @property bootTime [LocalDateTime]
 * @property changedFields [String]
 * @property clientIp [String]
 * @property clusterBiosType [Int]
 * @property clusterCompatibilityVersion [String]
 * @property clusterCpuFlags [String]
 * @property clusterCpuName [String]
 * @property clusterCpuVerb [String]
 * @property clusterId [UUID]
 * @property clusterName [String]
 * @property clusterSpiceProxy [String]
 * @property consoleCurUserName [String]
 * @property consoleDisconnectAction [String]
 * @property consoleDisconnectActionDelay [Int]
 * @property consoleUserId [UUID]
 * @property cpuName [String]
 * @property cpuPerSocket [Int]
 * @property cpuPinning [String]
 * @property cpuPinningPolicy [Int]
 * @property cpuProfileId [UUID]
 * @property cpuShares [Int]
 * @property cpuSys [BigDecimal]
 * @property cpuUser [BigDecimal]
 * @property createdByUserId [UUID]
 * @property creationDate [LocalDateTime]
 * @property currentCd [String]
 * @property currentCores [Int]
 * @property currentCpuPinning [String]
 * @property currentNumaPinning [String]
 * @property currentSockets [Int]
 * @property currentThreads [Int]
 * @property customCompatibilityVersion [String]
 * @property customCpuName [String]
 * @property customEmulatedMachine [String]
 * @property customSerialNumber [String]
 * @property dbGeneration [BigInteger]
 * @property dedicatedVmForVds [String]
 * @property defaultBootSequence [Int]
 * @property defaultDisplayType [Int]
 * @property description [String]
 * @property disksUsage [String]
 * @property downtime [BigInteger]
 * @property elapsedTime [BigDecimal] //TODO: 업타임
 * @property emulatedMachine [String]
 * @property exitMessage [String]
 * @property exitReason [Int]
 * @property exitStatus [Int]
 * @property freeTextComment [String]
 * @property guestAgentNicsHash [Int]
 * @property guestContainers [String]
 * @property guestCpuCount [Int]
 * @property guestCurUserName [String]
 * @property guestMemBuffered [BigInteger]
 * @property guestMemCached [BigInteger]
 * @property guestOs [String]
 * @property guestRequestedMemory [Int]
 * @property guestTimezoneName [String]
 * @property guestTimezoneOffset [Int]
 * @property guestosArch [Int]
 * @property guestosCodename [String]
 * @property guestosDistribution [String]
 * @property guestosKernelVersion [String]
 * @property guestosType [String]
 * @property guestosVersion [String]
 * @property hasIllegalImages [Boolean]
 * @property hash [String]
 * @property hostCpuFlags [Boolean]
 * @property imageTypeId [UUID]
 * @property initrdUrl [String]
 * @property instanceTypeId [UUID]
 * @property isAutoConverge [Boolean]
 * @property isBootMenuEnabled [Boolean]
 * @property isDeleteProtected [Boolean]
 * @property isInitialized [Boolean]
 * @property isMigrateCompressed [Boolean]
 * @property isMigrateEncrypted [Boolean]
 * @property isPreviewingSnapshot [Boolean]
 * @property isRunAndPause [Boolean]
 * @property isRunOnce [Boolean]
 * @property isSmartcardEnabled [Boolean]
 * @property isSpiceCopyPasteEnabled [Boolean]
 * @property isSpiceFileTransferEnabled [Boolean]
 * @property isStateless [Boolean]
 * @property isoPath [String]
 * @property kernelParams [String]
 * @property kernelUrl [String]
 * @property largeIconId [UUID]
 * @property lastStartTime [LocalDateTime]
 * @property lastStopTime [LocalDateTime]
 * @property lastWatchdogAction [String]
 * @property lastWatchdogEvent [BigInteger]
 * @property leaseInfo [String]
 * @property leaseSdId [UUID]
 * @property maxMemorySizeMb [Int] 최대 메모리 크기 (MB)
 * @property memSizeMb [Int] 메모리 크기 (MB)
 * @property migratingToVds [UUID]
 * @property migrationDowntime [Int]
 * @property migrationPolicyId [UUID]
 * @property migrationSupport [Int]
 * @property minAllocatedMem [Int]
 * @property multiQueuesEnabled [Boolean]
 * @property namespace [String]
 * @property nextRunConfigExists [Boolean]
 * @property niceLevel [Int]
 * @property numOfCpus [Int]
 * @property numOfIoThreads [Int] I/O 스레드 수
 * @property numOfMonitors [Int]
 * @property numOfSockets [Int]
 * @property origin [Int]
 * @property originalTemplateId [UUID]
 * @property originalTemplateName [String]
 * @property os [Int]
 * @property ovirtGuestAgentStatus [Int]
 * @property parallelMigrations [Int]
 * @property pauseStatus [Int]
 * @property predefinedProperties [String]
 * @property priority [Int]
 * @property providerId [UUID]
 * @property qemuGuestAgentStatus [Int]
 * @property quotaEnforcementType [Int]
 * @property quotaId [UUID]
 * @property quotaName [String]
 * @property reason [String]
 * @property resumeBehavior [String]
 * @property runOnVds [UUID]
 * @property runOnVdsName [String]
 * @property runtimeName [String]
 * @property serialNumberPolicy [Int]
 * @property session [Int]
 * @property smallIconId [UUID]
 * @property spiceIp [String]
 * @property spicePort [Int]
 * @property spiceTlsPort [Int]
 * @property ssoMethod [String]
 * @property status [Int]
 * @property storagePoolId [UUID]
 * @property storagePoolName [String]
 * @property templateVersionNumber [Int]
 * @property threadsPerCpu [Int]
 * @property timeZone [String]
 * @property transparentHugepages [Boolean]
 * @property trustedService [Boolean]
 * @property tunnelMigration [Boolean]
 * @property usageCpuPercent [Int]
 * @property usageMemPercent [Int]
 * @property usageNetworkPercent [Int]
 * @property usbPolicy [Int]
 * @property useTscFrequency [Boolean]
 * @property userdefinedProperties [String]
 * @property utcDiff [Int]
 * @property virtioScsiMultiQueues [Int]
 * @property vmFqdn [String]
 * @property vmGuid [String]
 * @property vmHost [String]
 * @property vmIp [String]
 * @property vmIpInetArray [String]
 * @property vmName [String]
 * @property vmPoolId [UUID]
 * @property vmPoolName [String]
 * @property vmPoolSpiceProxy [String]
 * @property vmType [Int]
 * @property vmtGuid [UUID]
 * @property vmtName [String]
 * @property vncIp [String]
 * @property vncKeyboardLayout [String]
 * @property vncPort [Int]
 * @property volatileRun [Boolean]
 *
 */
@Entity
@Immutable
@Table(name = "vms")
class VmEntity(
	val acpiEnable: Boolean? = null,
	val allowConsoleReconnect: Boolean? = false,
	val appList: String = "",
	@Column(name="architecture", nullable=true)
	private val _architecture: Int? = null,
	val autoStartup: Boolean? = null,
	val balloonEnabled: Boolean? = null,
	@Column(name="bios_type", nullable=true)
	private val _biosType: Int? = -1,
	val bootSequence: Int? = null,
	val bootTime: LocalDateTime? = LocalDateTime.now(),
	val changedFields: String = "",
	val clientIp: String = "",
	val clusterBiosType: Int? = null,
	val clusterCompatibilityVersion: String = "",
	val clusterCpuFlags: String = "",
	val clusterCpuName: String = "",
	val clusterCpuVerb: String = "",
	val clusterId: UUID? = null,
	val clusterName: String = "",
	val clusterSpiceProxy: String = "",
	val consoleCurUserName: String = "",
	val consoleDisconnectAction: String = "",
	val consoleDisconnectActionDelay: Int? = null,
	val consoleUserId: UUID? = null,
	val cpuName: String = "",
	val cpuPerSocket: Int? = null,
	val cpuPinning: String = "",
	@Column(name="cpu_pinning_policy", nullable=true)
	private val _cpuPinningPolicy: Int? = null,
	val cpuProfileId: UUID? = null,
	val cpuShares: Int? = null,
	val cpuSys: BigDecimal? = BigDecimal.ZERO,
	val cpuUser: BigDecimal? = BigDecimal.ZERO,
	val createdByUserId: UUID? = null,
	val creationDate: LocalDateTime? = LocalDateTime.now(),
	val currentCd: String = "",
	val currentCores: Int? = null,
	val currentCpuPinning: String = "",
	val currentNumaPinning: String = "",
	val currentSockets: Int? = null,
	val currentThreads: Int? = null,
	val customCompatibilityVersion: String = "",
	val customCpuName: String = "",
	val customEmulatedMachine: String = "",
	val customSerialNumber: String = "",
	val dbGeneration: BigInteger? = BigInteger.ZERO,
	val dedicatedVmForVds: String = "",
	val defaultBootSequence: Int? = null,
	@Column(name="default_display_type", nullable=true)
	private val _defaultDisplayType: Int? = null,
	val description: String = "",
	val disksUsage: String = "",
	val downtime: BigInteger? = BigInteger.ZERO,
	val elapsedTime: BigDecimal? = BigDecimal.ZERO,
	val emulatedMachine: String = "",
	val exitMessage: String = "",
	val exitReason: Int? = null,
	val exitStatus: Int? = null,
	val freeTextComment: String = "",
	val guestAgentNicsHash: Int? = null,
	val guestContainers: String = "",
	val guestCpuCount: Int? = null,
	val guestCurUserName: String = "",
	val guestMemBuffered: BigInteger? = BigInteger.ZERO,
	val guestMemCached: BigInteger? = BigInteger.ZERO,
	val guestOs: String = "",
	val guestRequestedMemory: Int? = null,
	val guestTimezoneName: String = "",
	val guestTimezoneOffset: Int? = null,
	val guestosArch: Int? = null,
	val guestosCodename: String = "",
	val guestosDistribution: String = "",
	val guestosKernelVersion: String = "",
	val guestosType: String = "",
	val guestosVersion: String = "",
	val hasIllegalImages: Boolean? = null,
	val hash: String = "",
	val hostCpuFlags: Boolean? = null,
	val imageTypeId: UUID? = null,
	val initrdUrl: String = "",
	val instanceTypeId: UUID? = null,
	val isAutoConverge: Boolean? = null,
	val isBootMenuEnabled: Boolean? = null,
	val isDeleteProtected: Boolean? = null,
	val isInitialized: Boolean? = null,
	val isMigrateCompressed: Boolean? = null,
	val isMigrateEncrypted: Boolean? = null,
	val isPreviewingSnapshot: Boolean? = null,
	val isRunAndPause: Boolean? = null,
	val isRunOnce: Boolean? = null,
	val isSmartcardEnabled: Boolean? = null,
	val isSpiceCopyPasteEnabled: Boolean? = null,
	val isSpiceFileTransferEnabled: Boolean? = null,
	val isStateless: Boolean? = null,
	val isoPath: String = "",
	val kernelParams: String = "",
	val kernelUrl: String = "",
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(
		name="large_icon_id",
		referencedColumnName="id",
		insertable=false,
		updatable=false
	)
	val largeIcon: VmIconEntity? = null,
	val lastStartTime: LocalDateTime? = LocalDateTime.now(),
	val lastStopTime: LocalDateTime? = LocalDateTime.now(),
	val lastWatchdogAction: String = "",
	val lastWatchdogEvent: BigInteger? = BigInteger.ZERO,
	val leaseInfo: String = "",
	val leaseSdId: UUID? = null,
	val maxMemorySizeMb: BigInteger? = BigInteger.ZERO,
	val memSizeMb: BigInteger? = BigInteger.ZERO,
	val migratingToVds: UUID? = null,
	val migrationDowntime: Int? = null,
	val migrationPolicyId: UUID? = null,
	@Column(name="migration_support", nullable=true)
	private val _migrationSupport: Int? = null,
	val minAllocatedMem: Int? = null,
	val multiQueuesEnabled: Boolean? = null,
	val namespace: String = "",
	val nextRunConfigExists: Boolean? = null,
	val niceLevel: Int? = null,
	val numOfCpus: Int? = null,
	val numOfIoThreads: Int? = null,
	val numOfMonitors: Int? = null,
	val numOfSockets: Int? = null,
	@Column(name="origin", nullable=false)
	private val _origin: Int? = null,
	val originalTemplateId: UUID? = null,
	val originalTemplateName: String = "",
	// private val os: Int? = null,
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(
		name="os",                         // The column in the 'vms' view
		referencedColumnName="os_id",      // The PK column in the 'dwh_osinfo' table
		insertable = false,
		updatable = false
	)
	val dwhOsInfo: DwhOsinfoEntity? = null,
	val ovirtGuestAgentStatus: Int? = null,
	val parallelMigrations: Int? = null,
	val pauseStatus: Int? = null,
	val predefinedProperties: String = "",
	val priority: Int? = null,
	val providerId: UUID? = null,
	val qemuGuestAgentStatus: Int? = null,
	val quotaEnforcementType: Int? = null,
	val quotaId: UUID? = null,
	val quotaName: String = "",
	val reason: String = "",
	@Column(name="resume_behavior", nullable=true)
	private val _resumeBehavior: String = "",
	val runOnVds: UUID? = null, // a.k.a. 호스트 ID
	val runOnVdsName: String = "", // a.k.a. 호스트 ID
	val runtimeName: String = "",
	val serialNumberPolicy: Int? = null,
	val session: Int? = null,
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(
		name="small_icon_id",
		referencedColumnName="id",
		insertable=false,
		updatable=false
	)
	val smallIcon: VmIconEntity? = null,
	val spiceIp: String = "",
	val spicePort: Int? = null,
	val spiceTlsPort: Int? = null,
	val ssoMethod: String = "",
	@Column(name="status", nullable=true)
	private val _status: Int? = -1,
	val storagePoolId: UUID? = null,
	val storagePoolName: String = "",
	val templateVersionNumber: Int? = null,
	val threadsPerCpu: Int? = null,
	val timeZone: String = "",
	val transparentHugepages: Boolean? = null,
	val trustedService: Boolean? = null,
	val tunnelMigration: Boolean? = null,
	val usageCpuPercent: Int? = null,
	val usageMemPercent: Int? = null,
	val usageNetworkPercent: Int? = null,
	@Column(name="usb_policy", nullable=true)
	private val _usbPolicy: Int? = 1,
	val useTscFrequency: Boolean? = null,
	val userdefinedProperties: String = "",
	val utcDiff: Int? = null,
	val virtioScsiMultiQueues: Int? = null,
	val vmFqdn: String = "",
	@Id
	@Column(name="vm_guid", unique = true, nullable = true)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val vmGuid: UUID? = null,
	val vmHost: String = "",
	val vmIp: String = "",
	val vmIpInetArray: String = "",
	val vmName: String = "",
	val vmPoolId: UUID? = null,
	val vmPoolName: String = "",
	val vmPoolSpiceProxy: String = "",
	@Column(name="vm_type", nullable=false)
	private val _vmType: Int? = -1,
	val vmtGuid: UUID? = null,
	val vmtName: String = "",
	val vncIp: String = "",
	val vncKeyboardLayout: String = "",
	val vncPort: Int? = null,
	val volatileRun: Boolean? = null,

	@OneToMany(fetch = FetchType.LAZY)
	@JoinColumn(
		name="vm_id",
		referencedColumnName="vm_guid",
		insertable=false,
		updatable=false
	)
	val snapshots: Set<SnapshotEntity> = emptySet(),
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(
		name="os",
		referencedColumnName="os_id",
		insertable=false,
		updatable=false
	)
	val iconDefaults: VmIconDefaultsEntity? = null,
	@OneToMany(fetch = FetchType.LAZY)
	@JoinColumn(
		name="vm_id",
		referencedColumnName="vm_guid",
		insertable=false,
		updatable=false
	)
	val diskVmElements: Set<DiskVmElementEntity>? = emptySet(),
): Serializable {
	val status: VmStatusB?
		get() = VmStatusB.forValue(_status)

	val biosType: BiosTypeB
		get() = BiosTypeB.forValue(_biosType)

	val vmType: VmTypeB? /* a.k.a. 최적화 옵션 (optmizationOption) */
		get() = VmTypeB.forValue(_vmType)

	val osType: VmOsType?
		get() = dwhOsInfo?.toVmOsType()

	val architecture: ArchitectureType?
		get() = ArchitectureType.forValue(_architecture)

	val memSize: BigInteger?
		get() = memSizeMb?.times(MEGABYTE_2_BYTE)

	val maxMemorySize: BigInteger?
		get() = maxMemorySizeMb?.times(MEGABYTE_2_BYTE)

	val cpuPinningPolicy: CpuPinningPolicyB?
		get() = CpuPinningPolicyB.forValue(_cpuPinningPolicy)

	val defaultDisplayType: GraphicsTypeB?
		get() = GraphicsTypeB.forValue(_defaultDisplayType)

	val migrationSupport: MigrationSupport?
		get() = MigrationSupport.forValue(_migrationSupport)

	val vmResumeBehavior: VmResumeBehavior?
		get() = VmResumeBehavior.forCode(_resumeBehavior)

	val usbPolicy: UsbPolicy?
		get() = UsbPolicy.forValue(_usbPolicy)

	val originType: OriginType?
		get() = OriginType.forValue(_origin)
	val origin: Int?
		get() = originType?.value
	val isHostedEngineVm: Boolean
		get() = originType == OriginType.MANAGED_HOSTED_ENGINE

	val virtioScsiMultiQueuesEnabled: Boolean?
		get() = (virtioScsiMultiQueues ?: 0) > 0

	val effectiveSmallIcon: VmIconEntity?
		get() = this.iconDefaults?.smallIcon ?: this.smallIcon

	val effectiveLargeIcon: VmIconEntity?
		get() = this.iconDefaults?.largeIcon ?: this.largeIcon

	val bootableDiskVmElements: Set<DiskVmElementEntity>
		get() = this@VmEntity.diskVmElements?.filter { it.isBoot }?.toSet() ?: emptySet()

	/*
	val isVmNotRunning: Boolean *//* '실행 중'이 아닌 상태 *//*
		get() = _status?.notRunning ?: false
	val isVmQualified2Migrate: Boolean *//* 마이그레이션이 가능한 상태 *//*
		get() = _status?.qualified2Migrate ?: false
	val isVmQualified4SnapshotMerge: Boolean *//* 스냅샷 머지 가능한 상태 *//*
		get() = _status?.qualified4SnapshotMerge ?: false
	val isVmQualified4LiveSnapshotMerge: Boolean *//* 라이브 스냅샷 머지 가능한 상태 *//*
		get() = _status?.qualified4LiveSnapshotMerge ?: false
	val isVmQualified4VmBackup: Boolean *//* 가상머신 백업 가능한 상태 *//*
		get() = _status?.qualified4VmBackup ?: false
	val isVmQualified4ConsoleConnect: Boolean *//* 콘솔로 가상머신 접근 가능한 상태 *//*
		get() = _status?.qualified4ConsoleConnect ?: false
	val isVmRunningOrPaused: Boolean *//* 가상머신이 '실행 중'이거나 '일시정지' 인 상태*//*
		get() = _status?.runningOrPaused ?: false
	val isVmRunning: Boolean *//* '실행 중' 인 상태 *//*
		get() = _status?.running ?: false
	val isVmUpOrPaused: Boolean
		get() = _status?.upOrPaused ?: false
	val isVmStarting: Boolean
		get() = _status?.starting ?: false
	val isVmStartingOrUp: Boolean
		get() = _status?.startingOrUp ?: false
	val isVmHibernating: Boolean *//* '수면 중' 인 상태 *//*
		get() = _status?.hibernating ?: false
	val isVmDownOrSuspended: Boolean
		get() = _status?.downOrSuspended ?: false
	val isVmQualified4QosChange: Boolean
		get() = _status?.qualified4QosChange ?: false
	val isVmGuestCpuRunning: Boolean
		get() = _status?.guestCpuRunning ?: false
	val isVmPoweringUpOrMigrating: Boolean
		get() = _status?.poweringUpOrMigrating ?: false
	val isVmMigrating: Boolean
		get() = _status?.migrating ?: false
	*/

	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bAcpiEnable: Boolean? = null; fun acpiEnable(block: () -> Boolean?) { bAcpiEnable = block() }
		private var bAllowConsoleReconnect: Boolean? = null; fun allowConsoleReconnect(block: () -> Boolean?) { bAllowConsoleReconnect = block() }
		private var bAppList: String = ""; fun appList(block: () -> String?) { bAppList = block() ?: "" }
		private var bArchitecture: Int = -1; fun architecture(block: () -> Int?) { bArchitecture = block() ?: -1 }
		private var bAutoStartup: Boolean? = null; fun autoStartup(block: () -> Boolean?) { bAutoStartup = block() }
		private var bBalloonEnabled: Boolean? = null; fun balloonEnabled(block: () -> Boolean?) { bBalloonEnabled = block() }
		private var bBiosType: Int = -1; fun biosType(block: () -> Int?) { bBiosType = block() ?: -1 }
		private var bBootSequence: Int = -1; fun bootSequence(block: () -> Int?) { bBootSequence = block() ?: -1 }
		private var bBootTime: LocalDateTime = LocalDateTime.MIN; fun bootTime(block: () -> LocalDateTime?) { bBootTime = block() ?: LocalDateTime.MIN }
		private var bChangedFields: String = ""; fun changedFields(block: () -> String?) { bChangedFields = block() ?: "" }
		private var bClientIp: String = ""; fun clientIp(block: () -> String?) { bClientIp = block() ?: "" }
		private var bClusterBiosType: Int = -1; fun clusterBiosType(block: () -> Int?) { bClusterBiosType = block() ?: -1 }
		private var bClusterCompatibilityVersion: String = ""; fun clusterCompatibilityVersion(block: () -> String?) { bClusterCompatibilityVersion = block() ?: "" }
		private var bClusterCpuFlags: String = ""; fun clusterCpuFlags(block: () -> String?) { bClusterCpuFlags = block() ?: "" }
		private var bClusterCpuName: String = ""; fun clusterCpuName(block: () -> String?) { bClusterCpuName = block() ?: "" }
		private var bClusterCpuVerb: String = ""; fun clusterCpuVerb(block: () -> String?) { bClusterCpuVerb = block() ?: "" }
		private var bClusterId: UUID? = null; fun clusterId(block: () -> UUID?) { bClusterId = block() }
		private var bClusterName: String = ""; fun clusterName(block: () -> String?) { bClusterName = block() ?: "" }
		private var bClusterSpiceProxy: String = ""; fun clusterSpiceProxy(block: () -> String?) { bClusterSpiceProxy = block() ?: "" }
		private var bConsoleCurUserName: String = ""; fun consoleCurUserName(block: () -> String?) { bConsoleCurUserName = block() ?: "" }
		private var bConsoleDisconnectAction: String = ""; fun consoleDisconnectAction(block: () -> String?) { bConsoleDisconnectAction = block() ?: "" }
		private var bConsoleDisconnectActionDelay: Int = -1; fun consoleDisconnectActionDelay(block: () -> Int?) { bConsoleDisconnectActionDelay = block() ?: -1 }
		private var bConsoleUserId: UUID? = null; fun consoleUserId(block: () -> UUID?) { bConsoleUserId = block() }
		private var bCpuName: String = ""; fun cpuName(block: () -> String?) { bCpuName = block() ?: "" }
		private var bCpuPerSocket: Int = -1; fun cpuPerSocket(block: () -> Int?) { bCpuPerSocket = block() ?: -1 }
		private var bCpuPinning: String = ""; fun cpuPinning(block: () -> String?) { bCpuPinning = block() ?: "" }
		private var bCpuPinningPolicy: Int = -1; fun cpuPinningPolicy(block: () -> Int?) { bCpuPinningPolicy = block() ?: -1 }
		private var bCpuProfileId: UUID? = null; fun cpuProfileId(block: () -> UUID?) { bCpuProfileId = block() }
		private var bCpuShares: Int = -1; fun cpuShares(block: () -> Int?) { bCpuShares = block() ?: -1 }
		private var bCpuSys: BigDecimal = BigDecimal.ZERO; fun cpuSys(block: () -> BigDecimal?) { bCpuSys = block() ?: BigDecimal.ZERO }
		private var bCpuUser: BigDecimal = BigDecimal.ZERO; fun cpuUser(block: () -> BigDecimal?) { bCpuUser = block() ?: BigDecimal.ZERO }
		private var bCreatedByUserId: UUID? = null; fun createdByUserId(block: () -> UUID?) { bCreatedByUserId = block() }
		private var bCreationDate: LocalDateTime = LocalDateTime.MIN; fun creationDate(block: () -> LocalDateTime?) { bCreationDate = block() ?: LocalDateTime.MIN }
		private var bCurrentCd: String = ""; fun currentCd(block: () -> String?) { bCurrentCd = block() ?: "" }
		private var bCurrentCores: Int = -1; fun currentCores(block: () -> Int?) { bCurrentCores = block() ?: -1 }
		private var bCurrentCpuPinning: String = ""; fun currentCpuPinning(block: () -> String?) { bCurrentCpuPinning = block() ?: "" }
		private var bCurrentNumaPinning: String = ""; fun currentNumaPinning(block: () -> String?) { bCurrentNumaPinning = block() ?: "" }
		private var bCurrentSockets: Int = -1; fun currentSockets(block: () -> Int?) { bCurrentSockets = block() ?: -1 }
		private var bCurrentThreads: Int = -1; fun currentThreads(block: () -> Int?) { bCurrentThreads = block() ?: -1 }
		private var bCustomCompatibilityVersion: String = ""; fun customCompatibilityVersion(block: () -> String?) { bCustomCompatibilityVersion = block() ?: "" }
		private var bCustomCpuName: String = ""; fun customCpuName(block: () -> String?) { bCustomCpuName = block() ?: "" }
		private var bCustomEmulatedMachine: String = ""; fun customEmulatedMachine(block: () -> String?) { bCustomEmulatedMachine = block() ?: "" }
		private var bCustomSerialNumber: String = ""; fun customSerialNumber(block: () -> String?) { bCustomSerialNumber = block() ?: "" }
		private var bDbGeneration: BigInteger = BigInteger.ZERO; fun dbGeneration(block: () -> BigInteger?) { bDbGeneration = block() ?: BigInteger.ZERO }
		private var bDedicatedVmForVds: String = ""; fun dedicatedVmForVds(block: () -> String?) { bDedicatedVmForVds = block() ?: "" }
		private var bDefaultBootSequence: Int = -1; fun defaultBootSequence(block: () -> Int?) { bDefaultBootSequence = block() ?: -1 }
		private var bDefaultDisplayType: Int = -1; fun defaultDisplayType(block: () -> Int?) { bDefaultDisplayType = block() ?: -1 }
		private var bDescription: String = ""; fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bDisksUsage: String = ""; fun disksUsage(block: () -> String?) { bDisksUsage = block() ?: "" }
		private var bDowntime: BigInteger = BigInteger.ZERO; fun downtime(block: () -> BigInteger?) { bDowntime = block() ?: BigInteger.ZERO }
		private var bElapsedTime: BigDecimal = BigDecimal.ZERO; fun elapsedTime(block: () -> BigDecimal?) { bElapsedTime = block() ?: BigDecimal.ZERO }
		private var bEmulatedMachine: String = ""; fun emulatedMachine(block: () -> String?) { bEmulatedMachine = block() ?: "" }
		private var bExitMessage: String = ""; fun exitMessage(block: () -> String?) { bExitMessage = block() ?: "" }
		private var bExitReason: Int = -1; fun exitReason(block: () -> Int?) { bExitReason = block() ?: -1 }
		private var bExitStatus: Int = -1; fun exitStatus(block: () -> Int?) { bExitStatus = block() ?: -1 }
		private var bFreeTextComment: String = ""; fun freeTextComment(block: () -> String?) { bFreeTextComment = block() ?: "" }
		private var bGuestAgentNicsHash: Int = -1; fun guestAgentNicsHash(block: () -> Int?) { bGuestAgentNicsHash = block() ?: -1 }
		private var bGuestContainers: String = ""; fun guestContainers(block: () -> String?) { bGuestContainers = block() ?: "" }
		private var bGuestCpuCount: Int = -1; fun guestCpuCount(block: () -> Int?) { bGuestCpuCount = block() ?: -1 }
		private var bGuestCurUserName: String = ""; fun guestCurUserName(block: () -> String?) { bGuestCurUserName = block() ?: "" }
		private var bGuestMemBuffered: BigInteger = BigInteger.ZERO; fun guestMemBuffered(block: () -> BigInteger?) { bGuestMemBuffered = block() ?: BigInteger.ZERO }
		private var bGuestMemCached: BigInteger = BigInteger.ZERO; fun guestMemCached(block: () -> BigInteger?) { bGuestMemCached = block() ?: BigInteger.ZERO }
		private var bGuestOs: String = ""; fun guestOs(block: () -> String?) { bGuestOs = block() ?: "" }
		private var bGuestRequestedMemory: Int = -1; fun guestRequestedMemory(block: () -> Int?) { bGuestRequestedMemory = block() ?: -1 }
		private var bGuestTimezoneName: String = ""; fun guestTimezoneName(block: () -> String?) { bGuestTimezoneName = block() ?: "" }
		private var bGuestTimezoneOffset: Int = -1; fun guestTimezoneOffset(block: () -> Int?) { bGuestTimezoneOffset = block() ?: -1 }
		private var bGuestosArch: Int = -1; fun guestosArch(block: () -> Int?) { bGuestosArch = block() ?: -1 }
		private var bGuestosCodename: String = ""; fun guestosCodename(block: () -> String?) { bGuestosCodename = block() ?: "" }
		private var bGuestosDistribution: String = ""; fun guestosDistribution(block: () -> String?) { bGuestosDistribution = block() ?: "" }
		private var bGuestosKernelVersion: String = ""; fun guestosKernelVersion(block: () -> String?) { bGuestosKernelVersion = block() ?: "" }
		private var bGuestosType: String = ""; fun guestosType(block: () -> String?) { bGuestosType = block() ?: "" }
		private var bGuestosVersion: String = ""; fun guestosVersion(block: () -> String?) { bGuestosVersion = block() ?: "" }
		private var bHasIllegalImages: Boolean? = null; fun hasIllegalImages(block: () -> Boolean?) { bHasIllegalImages = block() }
		private var bHash: String = ""; fun hash(block: () -> String?) { bHash = block() ?: "" }
		private var bHostCpuFlags: Boolean? = null; fun hostCpuFlags(block: () -> Boolean?) { bHostCpuFlags = block() }
		private var bImageTypeId: UUID? = null; fun imageTypeId(block: () -> UUID?) { bImageTypeId = block() }
		private var bInitrdUrl: String = ""; fun initrdUrl(block: () -> String?) { bInitrdUrl = block() ?: "" }
		private var bInstanceTypeId: UUID? = null; fun instanceTypeId(block: () -> UUID?) { bInstanceTypeId = block() }
		private var bIsAutoConverge: Boolean? = null; fun isAutoConverge(block: () -> Boolean?) { bIsAutoConverge = block() }
		private var bIsBootMenuEnabled: Boolean? = null; fun isBootMenuEnabled(block: () -> Boolean?) { bIsBootMenuEnabled = block() }
		private var bIsDeleteProtected: Boolean? = null; fun isDeleteProtected(block: () -> Boolean?) { bIsDeleteProtected = block() }
		private var bIsInitialized: Boolean? = null; fun isInitialized(block: () -> Boolean?) { bIsInitialized = block() }
		private var bIsMigrateCompressed: Boolean? = null; fun isMigrateCompressed(block: () -> Boolean?) { bIsMigrateCompressed = block() }
		private var bIsMigrateEncrypted: Boolean? = null; fun isMigrateEncrypted(block: () -> Boolean?) { bIsMigrateEncrypted = block() }
		private var bIsPreviewingSnapshot: Boolean? = null; fun isPreviewingSnapshot(block: () -> Boolean?) { bIsPreviewingSnapshot = block() }
		private var bIsRunAndPause: Boolean? = null; fun isRunAndPause(block: () -> Boolean?) { bIsRunAndPause = block() }
		private var bIsRunOnce: Boolean? = null; fun isRunOnce(block: () -> Boolean?) { bIsRunOnce = block() }
		private var bIsSmartcardEnabled: Boolean? = null; fun isSmartcardEnabled(block: () -> Boolean?) { bIsSmartcardEnabled = block() }
		private var bIsSpiceCopyPasteEnabled: Boolean? = null; fun isSpiceCopyPasteEnabled(block: () -> Boolean?) { bIsSpiceCopyPasteEnabled = block() }
		private var bIsSpiceFileTransferEnabled: Boolean? = null; fun isSpiceFileTransferEnabled(block: () -> Boolean?) { bIsSpiceFileTransferEnabled = block() }
		private var bIsStateless: Boolean? = null; fun isStateless(block: () -> Boolean?) { bIsStateless = block() }
		private var bIsoPath: String = ""; fun isoPath(block: () -> String?) { bIsoPath = block() ?: "" }
		private var bKernelParams: String = ""; fun kernelParams(block: () -> String?) { bKernelParams = block() ?: "" }
		private var bKernelUrl: String = ""; fun kernelUrl(block: () -> String?) { bKernelUrl = block() ?: "" }
		private var bLargeIcon: VmIconEntity? = null; fun largeIcon(block: () -> VmIconEntity?) { bLargeIcon = block() }
		private var bLastStartTime: LocalDateTime = LocalDateTime.MIN; fun lastStartTime(block: () -> LocalDateTime?) { bLastStartTime = block() ?: LocalDateTime.MIN }
		private var bLastStopTime: LocalDateTime = LocalDateTime.MIN; fun lastStopTime(block: () -> LocalDateTime?) { bLastStopTime = block() ?: LocalDateTime.MIN }
		private var bLastWatchdogAction: String = ""; fun lastWatchdogAction(block: () -> String?) { bLastWatchdogAction = block() ?: "" }
		private var bLastWatchdogEvent: BigInteger = BigInteger.ZERO; fun lastWatchdogEvent(block: () -> BigInteger?) { bLastWatchdogEvent = block() ?: BigInteger.ZERO }
		private var bLeaseInfo: String = ""; fun leaseInfo(block: () -> String?) { bLeaseInfo = block() ?: "" }
		private var bLeaseSdId: UUID? = null; fun leaseSdId(block: () -> UUID?) { bLeaseSdId = block() }
		private var bMaxMemorySizeMb: BigInteger? = BigInteger.ZERO; fun maxMemorySizeMb(block: () -> BigInteger?) { bMaxMemorySizeMb = block() ?: BigInteger.ZERO }
		private var bMemSizeMb: BigInteger? = BigInteger.ZERO; fun memSizeMb(block: () -> BigInteger?) { bMemSizeMb = block() ?: BigInteger.ZERO }
		private var bMigratingToVds: UUID? = null; fun migratingToVds(block: () -> UUID?) { bMigratingToVds = block() }
		private var bMigrationDowntime: Int = -1; fun migrationDowntime(block: () -> Int?) { bMigrationDowntime = block() ?: -1 }
		private var bMigrationPolicyId: UUID? = null; fun migrationPolicyId(block: () -> UUID?) { bMigrationPolicyId = block() }
		private var bMigrationSupport: MigrationSupport? = MigrationSupport.UNKNOWN; fun migrationSupport(block: () -> MigrationSupport?) { bMigrationSupport = block() ?: MigrationSupport.UNKNOWN }
		private var bMinAllocatedMem: Int = -1; fun minAllocatedMem(block: () -> Int?) { bMinAllocatedMem = block() ?: -1 }
		private var bMultiQueuesEnabled: Boolean? = null; fun multiQueuesEnabled(block: () -> Boolean?) { bMultiQueuesEnabled = block() }
		private var bNamespace: String = ""; fun namespace(block: () -> String?) { bNamespace = block() ?: "" }
		private var bNextRunConfigExists: Boolean? = null; fun nextRunConfigExists(block: () -> Boolean?) { bNextRunConfigExists = block() }
		private var bNiceLevel: Int = -1; fun niceLevel(block: () -> Int?) { bNiceLevel = block() ?: -1 }
		private var bNumOfCpus: Int = -1; fun numOfCpus(block: () -> Int?) { bNumOfCpus = block() ?: -1 }
		private var bNumOfIoThreads: Int = -1; fun numOfIoThreads(block: () -> Int?) { bNumOfIoThreads = block() ?: -1 }
		private var bNumOfMonitors: Int = -1; fun numOfMonitors(block: () -> Int?) { bNumOfMonitors = block() ?: -1 }
		private var bNumOfSockets: Int = -1; fun numOfSockets(block: () -> Int?) { bNumOfSockets = block() ?: -1 }
		private var bOrigin: Int = -1; fun origin(block: () -> Int?) { bOrigin = block() ?: -1 }
		private var bOriginalTemplateId: UUID? = null; fun originalTemplateId(block: () -> UUID?) { bOriginalTemplateId = block() }
		private var bOriginalTemplateName: String = ""; fun originalTemplateName(block: () -> String?) { bOriginalTemplateName = block() ?: "" }
		// private var bOs: Int = -1; fun os(block: () -> Int?) { bOs = block() ?: -1 }
		private var bDwhOsInfo: DwhOsinfoEntity? = null;fun dwhOsInfo(block: () -> DwhOsinfoEntity?) { bDwhOsInfo = block() }
		private var bOvirtGuestAgentStatus: Int = -1; fun ovirtGuestAgentStatus(block: () -> Int?) { bOvirtGuestAgentStatus = block() ?: -1 }
		private var bParallelMigrations: Int = -1; fun parallelMigrations(block: () -> Int?) { bParallelMigrations = block() ?: -1 }
		private var bPauseStatus: Int = -1; fun pauseStatus(block: () -> Int?) { bPauseStatus = block() ?: -1 }
		private var bPredefinedProperties: String = ""; fun predefinedProperties(block: () -> String?) { bPredefinedProperties = block() ?: "" }
		private var bPriority: Int = -1; fun priority(block: () -> Int?) { bPriority = block() ?: -1 }
		private var bProviderId: UUID? = null; fun providerId(block: () -> UUID?) { bProviderId = block() }
		private var bQemuGuestAgentStatus: Int = -1; fun qemuGuestAgentStatus(block: () -> Int?) { bQemuGuestAgentStatus = block() ?: -1 }
		private var bQuotaEnforcementType: Int = -1; fun quotaEnforcementType(block: () -> Int?) { bQuotaEnforcementType = block() ?: -1 }
		private var bQuotaId: UUID? = null; fun quotaId(block: () -> UUID?) { bQuotaId = block() }
		private var bQuotaName: String = ""; fun quotaName(block: () -> String?) { bQuotaName = block() ?: "" }
		private var bReason: String = ""; fun reason(block: () -> String?) { bReason = block() ?: "" }
		private var bResumeBehavior: String = ""; fun resumeBehavior(block: () -> String?) { bResumeBehavior = block() ?: "" }
		private var bRunOnVds: UUID? = null; fun runOnVds(block: () -> UUID?) { bRunOnVds = block() }
		private var bRunOnVdsName: String = ""; fun runOnVdsName(block: () -> String?) { bRunOnVdsName = block() ?: "" }
		private var bRuntimeName: String = ""; fun runtimeName(block: () -> String?) { bRuntimeName = block() ?: "" }
		private var bSerialNumberPolicy: Int = -1; fun serialNumberPolicy(block: () -> Int?) { bSerialNumberPolicy = block() ?: -1 }
		private var bSession: Int = -1; fun session(block: () -> Int?) { bSession = block() ?: -1 }
		private var bSmallIcon: VmIconEntity? = null; fun smallIcon(block: () -> VmIconEntity?) { bSmallIcon = block() }
		private var bSpiceIp: String = ""; fun spiceIp(block: () -> String?) { bSpiceIp = block() ?: "" }
		private var bSpicePort: Int = -1; fun spicePort(block: () -> Int?) { bSpicePort = block() ?: -1 }
		private var bSpiceTlsPort: Int = -1; fun spiceTlsPort(block: () -> Int?) { bSpiceTlsPort = block() ?: -1 }
		private var bSsoMethod: String = ""; fun ssoMethod(block: () -> String?) { bSsoMethod = block() ?: "" }
		private var bStatus: VmStatusB? = VmStatusB.Unknown; fun status(block: () -> VmStatusB?) { bStatus = block() ?: VmStatusB.Unknown }
		private var bStoragePoolId: UUID? = null; fun storagePoolId(block: () -> UUID?) { bStoragePoolId = block() }
		private var bStoragePoolName: String = ""; fun storagePoolName(block: () -> String?) { bStoragePoolName = block() ?: "" }
		private var bTemplateVersionNumber: Int = -1; fun templateVersionNumber(block: () -> Int?) { bTemplateVersionNumber = block() ?: -1 }
		private var bThreadsPerCpu: Int = -1; fun threadsPerCpu(block: () -> Int?) { bThreadsPerCpu = block() ?: -1 }
		private var bTimeZone: String = ""; fun timeZone(block: () -> String?) { bTimeZone = block() ?: "" }
		private var bTransparentHugepages: Boolean? = null; fun transparentHugepages(block: () -> Boolean?) { bTransparentHugepages = block() }
		private var bTrustedService: Boolean? = null; fun trustedService(block: () -> Boolean?) { bTrustedService = block() }
		private var bTunnelMigration: Boolean? = null; fun tunnelMigration(block: () -> Boolean?) { bTunnelMigration = block() }
		private var bUsageCpuPercent: Int = -1; fun usageCpuPercent(block: () -> Int?) { bUsageCpuPercent = block() ?: -1 }
		private var bUsageMemPercent: Int = -1; fun usageMemPercent(block: () -> Int?) { bUsageMemPercent = block() ?: -1 }
		private var bUsageNetworkPercent: Int = -1; fun usageNetworkPercent(block: () -> Int?) { bUsageNetworkPercent = block() ?: -1 }
		private var bUsbPolicy: Int = -1; fun usbPolicy(block: () -> Int?) { bUsbPolicy = block() ?: -1 }
		private var bUseTscFrequency: Boolean? = null; fun useTscFrequency(block: () -> Boolean?) { bUseTscFrequency = block() }
		private var bUserdefinedProperties: String = ""; fun userdefinedProperties(block: () -> String?) { bUserdefinedProperties = block() ?: "" }
		private var bUtcDiff: Int = -1; fun utcDiff(block: () -> Int?) { bUtcDiff = block() ?: -1 }
		private var bVirtioScsiMultiQueues: Int = -1; fun virtioScsiMultiQueues(block: () -> Int?) { bVirtioScsiMultiQueues = block() ?: -1 }
		private var bVmFqdn: String = ""; fun vmFqdn(block: () -> String?) { bVmFqdn = block() ?: "" }
		private var bVmGuid: UUID? = null; fun vmGuid(block: () -> UUID?) { bVmGuid = block() }
		private var bVmHost: String = ""; fun vmHost(block: () -> String?) { bVmHost = block() ?: "" }
		private var bVmIp: String = ""; fun vmIp(block: () -> String?) { bVmIp = block() ?: "" }
		private var bVmIpInetArray: String = ""; fun vmIpInetArray(block: () -> String?) { bVmIpInetArray = block() ?: "" }
		private var bVmName: String = ""; fun vmName(block: () -> String?) { bVmName = block() ?: "" }
		private var bVmPoolId: UUID? = null; fun vmPoolId(block: () -> UUID?) { bVmPoolId = block() }
		private var bVmPoolName: String = ""; fun vmPoolName(block: () -> String?) { bVmPoolName = block() ?: "" }
		private var bVmPoolSpiceProxy: String = ""; fun vmPoolSpiceProxy(block: () -> String?) { bVmPoolSpiceProxy = block() ?: "" }
		private var bVmType: Int = -1; fun vmType(block: () -> Int?) { bVmType = block() ?: -1 }
		private var bVmtGuid: UUID? = null; fun vmtGuid(block: () -> UUID?) { bVmtGuid = block() }
		private var bVmtName: String = ""; fun vmtName(block: () -> String?) { bVmtName = block() ?: "" }
		private var bVncIp: String = ""; fun vncIp(block: () -> String?) { bVncIp = block() ?: "" }
		private var bVncKeyboardLayout: String = ""; fun vncKeyboardLayout(block: () -> String?) { bVncKeyboardLayout = block() ?: "" }
		private var bVncPort: Int = -1; fun vncPort(block: () -> Int?) { bVncPort = block() ?: -1 }
		private var bVolatileRun: Boolean? = null; fun volatileRun(block: () -> Boolean?) { bVolatileRun = block() }
		private var bSnapshots: Set<SnapshotEntity> = emptySet(); fun snapshots(block: () -> Set<SnapshotEntity>?) { bSnapshots = block() ?: emptySet() }
		private var bIconDefaults: VmIconDefaultsEntity? = null; fun iconDefaults(block: () -> VmIconDefaultsEntity?) { bIconDefaults = block() }
		fun build(): VmEntity = VmEntity(bAcpiEnable, bAllowConsoleReconnect, bAppList, bArchitecture, bAutoStartup, bBalloonEnabled, bBiosType, bBootSequence, bBootTime, bChangedFields, bClientIp, bClusterBiosType, bClusterCompatibilityVersion, bClusterCpuFlags, bClusterCpuName, bClusterCpuVerb, bClusterId, bClusterName, bClusterSpiceProxy, bConsoleCurUserName, bConsoleDisconnectAction, bConsoleDisconnectActionDelay, bConsoleUserId, bCpuName, bCpuPerSocket, bCpuPinning, bCpuPinningPolicy, bCpuProfileId, bCpuShares, bCpuSys, bCpuUser, bCreatedByUserId, bCreationDate, bCurrentCd, bCurrentCores, bCurrentCpuPinning, bCurrentNumaPinning, bCurrentSockets, bCurrentThreads, bCustomCompatibilityVersion, bCustomCpuName, bCustomEmulatedMachine, bCustomSerialNumber, bDbGeneration, bDedicatedVmForVds, bDefaultBootSequence, bDefaultDisplayType, bDescription, bDisksUsage, bDowntime, bElapsedTime, bEmulatedMachine, bExitMessage, bExitReason, bExitStatus, bFreeTextComment, bGuestAgentNicsHash, bGuestContainers, bGuestCpuCount, bGuestCurUserName, bGuestMemBuffered, bGuestMemCached, bGuestOs, bGuestRequestedMemory, bGuestTimezoneName, bGuestTimezoneOffset, bGuestosArch, bGuestosCodename, bGuestosDistribution, bGuestosKernelVersion, bGuestosType, bGuestosVersion, bHasIllegalImages, bHash, bHostCpuFlags, bImageTypeId, bInitrdUrl, bInstanceTypeId, bIsAutoConverge, bIsBootMenuEnabled, bIsDeleteProtected, bIsInitialized, bIsMigrateCompressed, bIsMigrateEncrypted, bIsPreviewingSnapshot, bIsRunAndPause, bIsRunOnce, bIsSmartcardEnabled, bIsSpiceCopyPasteEnabled, bIsSpiceFileTransferEnabled, bIsStateless, bIsoPath, bKernelParams, bKernelUrl, bLargeIcon, bLastStartTime, bLastStopTime, bLastWatchdogAction, bLastWatchdogEvent, bLeaseInfo, bLeaseSdId, bMaxMemorySizeMb, bMemSizeMb, bMigratingToVds, bMigrationDowntime, bMigrationPolicyId, bMigrationSupport?.value, bMinAllocatedMem, bMultiQueuesEnabled, bNamespace, bNextRunConfigExists, bNiceLevel, bNumOfCpus, bNumOfIoThreads, bNumOfMonitors, bNumOfSockets, bOrigin, bOriginalTemplateId, bOriginalTemplateName, /*bOs,*/ bDwhOsInfo, bOvirtGuestAgentStatus, bParallelMigrations, bPauseStatus, bPredefinedProperties, bPriority, bProviderId, bQemuGuestAgentStatus, bQuotaEnforcementType, bQuotaId, bQuotaName, bReason, bResumeBehavior, bRunOnVds, bRunOnVdsName, bRuntimeName, bSerialNumberPolicy, bSession, bSmallIcon, bSpiceIp, bSpicePort, bSpiceTlsPort, bSsoMethod, bStatus?.value, bStoragePoolId, bStoragePoolName, bTemplateVersionNumber, bThreadsPerCpu, bTimeZone, bTransparentHugepages, bTrustedService, bTunnelMigration, bUsageCpuPercent, bUsageMemPercent, bUsageNetworkPercent, bUsbPolicy, bUseTscFrequency, bUserdefinedProperties, bUtcDiff, bVirtioScsiMultiQueues, bVmFqdn, bVmGuid, bVmHost, bVmIp, bVmIpInetArray, bVmName, bVmPoolId, bVmPoolName, bVmPoolSpiceProxy, bVmType, bVmtGuid, bVmtName, bVncIp, bVncKeyboardLayout, bVncPort, bVolatileRun, bSnapshots, bIconDefaults)
	}

	companion object {
		val MEGABYTE_2_BYTE: BigInteger = BigInteger.valueOf(2.0.pow(20.0).toLong()) // 2^20승
		inline fun builder(block: Builder.() -> Unit): VmEntity = Builder().apply(block).build()
	}
}
