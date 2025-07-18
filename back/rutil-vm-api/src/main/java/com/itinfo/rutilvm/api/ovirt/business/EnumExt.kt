package com.itinfo.rutilvm.api.ovirt.business

import com.itinfo.rutilvm.common.deepEquals
import org.ovirt.engine.sdk4.types.Architecture
import org.ovirt.engine.sdk4.types.Bios
import org.ovirt.engine.sdk4.types.BiosType
import org.ovirt.engine.sdk4.types.BootDevice
import org.ovirt.engine.sdk4.types.BootProtocol
import org.ovirt.engine.sdk4.types.Cpu
import org.ovirt.engine.sdk4.types.CpuPinningPolicy
import org.ovirt.engine.sdk4.types.DataCenterStatus
import org.ovirt.engine.sdk4.types.DiskContentType
import org.ovirt.engine.sdk4.types.DiskFormat
import org.ovirt.engine.sdk4.types.DiskInterface
import org.ovirt.engine.sdk4.types.Display
import org.ovirt.engine.sdk4.types.DisplayType
import org.ovirt.engine.sdk4.types.FipsMode
import org.ovirt.engine.sdk4.types.FirewallType
import org.ovirt.engine.sdk4.types.HostStatus
import org.ovirt.engine.sdk4.types.ImageTransferDirection
import org.ovirt.engine.sdk4.types.ImageTransferPhase
import org.ovirt.engine.sdk4.types.ImageTransferTimeoutPolicy
import org.ovirt.engine.sdk4.types.InheritableBoolean
import org.ovirt.engine.sdk4.types.LogMaxMemoryUsedThresholdType
import org.ovirt.engine.sdk4.types.LogSeverity
import org.ovirt.engine.sdk4.types.MigrateOnError
import org.ovirt.engine.sdk4.types.MigrationBandwidthAssignmentMethod
import org.ovirt.engine.sdk4.types.Template
import org.ovirt.engine.sdk4.types.MigrationOptions
import org.ovirt.engine.sdk4.types.NetworkStatus
import org.ovirt.engine.sdk4.types.NicInterface
import org.ovirt.engine.sdk4.types.NicStatus
import org.ovirt.engine.sdk4.types.OperatingSystem
import org.ovirt.engine.sdk4.types.OperatingSystemInfo
import org.ovirt.engine.sdk4.types.OsType
import org.ovirt.engine.sdk4.types.QuotaModeType
import org.ovirt.engine.sdk4.types.SeLinuxMode
import org.ovirt.engine.sdk4.types.SpmStatus
import org.ovirt.engine.sdk4.types.StorageDomainStatus
import org.ovirt.engine.sdk4.types.StorageDomainType
import org.ovirt.engine.sdk4.types.StorageType
import org.ovirt.engine.sdk4.types.SwitchType
import org.ovirt.engine.sdk4.types.Vm
import org.ovirt.engine.sdk4.types.VmAffinity
import org.ovirt.engine.sdk4.types.VmPlacementPolicy
import org.ovirt.engine.sdk4.types.VmStatus
import org.ovirt.engine.sdk4.types.TemplateStatus
import org.ovirt.engine.sdk4.types.VmStorageErrorResumeBehaviour
import org.ovirt.engine.sdk4.types.VmType

fun DataCenterStatus?.toStoragePoolStatus(): StoragePoolStatus =
	StoragePoolStatus.forCode(this@toStoragePoolStatus?.value())

fun StoragePoolStatus?.toDataCenterStatus(): DataCenterStatus =
	DataCenterStatus.fromValue(this@toDataCenterStatus?.code)

fun LogSeverity?.toAuditLogSeverity(): AuditLogSeverity =
	AuditLogSeverity.forCode(this@toAuditLogSeverity?.value())

fun VmStatus?.toVmStatusB(): VmStatusB = VmStatusB.forCode(this@toVmStatusB?.value())
fun VmStatusB?.toVmStatus(): VmStatus = VmStatus.fromValue(this@toVmStatus?.code)
fun Vm.findStatus(): VmStatusB = this@findStatus.status().toVmStatusB()

fun VmTemplateStatusB.toTemplateStatus(): TemplateStatus = TemplateStatus.fromValue(this@toTemplateStatus.code)
fun TemplateStatus?.toVmTemplateStatusB(): VmTemplateStatusB = VmTemplateStatusB.forCode(this@toVmTemplateStatusB?.value())
fun Template.findTemplateStatus(): VmTemplateStatusB = this@findTemplateStatus.status().toVmTemplateStatusB()

fun VmType?.toVmTypeB(): VmTypeB? = VmTypeB.forCode(this@toVmTypeB?.value())
fun VmTypeB?.toVmType(): VmType? = VmType.fromValue(this@toVmType?.code)

fun NicInterface?.toVmInterfaceType(): VmInterfaceType = VmInterfaceType.forCode(this@toVmInterfaceType?.value())
fun VmInterfaceType?.toNicInterface(): NicInterface = NicInterface.fromValue(this@toNicInterface?.code)

fun BootSequence.toBootDevices(): List<BootDevice> = when(this@toBootDevices) {
	BootSequence.C -> listOf(BootDevice.HD)
	BootSequence.D -> listOf(BootDevice.CDROM)
	BootSequence.N -> listOf(BootDevice.NETWORK)
	BootSequence.DC -> listOf(BootDevice.CDROM, BootDevice.HD)
	BootSequence.CDN -> listOf(BootDevice.HD, BootDevice.CDROM, BootDevice.NETWORK)
	BootSequence.CND -> listOf(BootDevice.HD, BootDevice.NETWORK, BootDevice.CDROM)
	BootSequence.DCN -> listOf(BootDevice.CDROM, BootDevice.HD, BootDevice.NETWORK)
	BootSequence.DNC -> listOf(BootDevice.CDROM, BootDevice.NETWORK, BootDevice.HD)
	BootSequence.NCD -> listOf(BootDevice.NETWORK, BootDevice.HD, BootDevice.CDROM)
	BootSequence.NDC -> listOf(BootDevice.NETWORK, BootDevice.CDROM, BootDevice.HD)
	BootSequence.CD -> listOf(BootDevice.HD, BootDevice.CDROM)
	BootSequence.CN -> listOf(BootDevice.HD, BootDevice.NETWORK)
	BootSequence.DN -> listOf(BootDevice.CDROM, BootDevice.NETWORK)
	BootSequence.NC -> listOf(BootDevice.NETWORK, BootDevice.HD)
	BootSequence.ND -> listOf(BootDevice.NETWORK, BootDevice.CDROM)
}

fun List<BootDevice>.toBootSequence(): BootSequence = when {
	this@toBootSequence.deepEquals(listOf(BootDevice.CDROM)) -> BootSequence.D
	this@toBootSequence.deepEquals(listOf(BootDevice.NETWORK)) -> BootSequence.N
	this@toBootSequence.deepEquals(listOf(BootDevice.CDROM, BootDevice.HD)) -> BootSequence.DC
	this@toBootSequence.deepEquals(listOf(BootDevice.HD, BootDevice.CDROM, BootDevice.NETWORK)) -> BootSequence.CDN
	this@toBootSequence.deepEquals(listOf(BootDevice.HD, BootDevice.NETWORK, BootDevice.CDROM)) -> BootSequence.CND
	this@toBootSequence.deepEquals(listOf(BootDevice.CDROM, BootDevice.HD, BootDevice.NETWORK)) -> BootSequence.DCN
	this@toBootSequence.deepEquals(listOf(BootDevice.CDROM, BootDevice.NETWORK, BootDevice.HD)) -> BootSequence.DNC
	this@toBootSequence.deepEquals(listOf(BootDevice.NETWORK, BootDevice.HD, BootDevice.CDROM)) -> BootSequence.NCD
	this@toBootSequence.deepEquals(listOf(BootDevice.NETWORK, BootDevice.CDROM, BootDevice.HD)) -> BootSequence.NDC
	this@toBootSequence.deepEquals(listOf(BootDevice.HD, BootDevice.CDROM)) -> BootSequence.CD
	this@toBootSequence.deepEquals(listOf(BootDevice.HD, BootDevice.NETWORK)) -> BootSequence.CN
	this@toBootSequence.deepEquals(listOf(BootDevice.CDROM, BootDevice.NETWORK)) -> BootSequence.DN
	this@toBootSequence.deepEquals(listOf(BootDevice.NETWORK, BootDevice.HD)) -> BootSequence.NC
	this@toBootSequence.deepEquals(listOf(BootDevice.NETWORK, BootDevice.CDROM)) -> BootSequence.ND
	this@toBootSequence.deepEquals(listOf(BootDevice.HD)) -> BootSequence.C
	else -> BootSequence.C
}

fun BiosType?.toBiosTypeB(): BiosTypeB = BiosTypeB.forCode(this@toBiosTypeB?.value())
fun BiosTypeB?.toBiosType(): BiosType? = BiosType.fromValue(this@toBiosType?.name?.lowercase())
fun Bios?.findBiosTypeB(): BiosTypeB = BiosTypeB.forCode(this@findBiosTypeB?.type()?.value())
fun Bios?.findBiosType(): BiosType = BiosType.fromValue(this@findBiosType?.type()?.value())

fun OsType?.toVmOsType(): VmOsType = VmOsType.forCode(this@toVmOsType?.value())
fun VmOsType?.toOsType(): OsType = when(this@toOsType) {
	else -> OsType.fromValue(this@toOsType?.code ?: VmOsType.other.code)
}

fun VmOsType?.toOsTypeCode(): String = when(this@toOsTypeCode) {
	// NOTE: SDK OsType 에서 없는 것들은 강제로 주입
	VmOsType.rhel_7x64,
	VmOsType.rhel_8x64,
	VmOsType.rhel_9x64,
	VmOsType.rhel_core_os,
	VmOsType.red_hat_atomic_7x64,
	VmOsType.other_linux_kernel_4,
	VmOsType.windows_10,
	VmOsType.windows_10x64,
	VmOsType.windows_11,
	VmOsType.windows_2008r2x64,
	VmOsType.windows_2012x64,
	VmOsType.windows_2012r2x64,
	VmOsType.windows_2022,
	VmOsType.windows_2025,
	VmOsType.sles_11,
	VmOsType.ubuntu_12_04,
	VmOsType.ubuntu_12_10,
	VmOsType.ubuntu_13_04,
	VmOsType.ubuntu_13_10,
	VmOsType.ubuntu_14_04,
	VmOsType.ubuntu_18_04,
	VmOsType.debian_7,
	VmOsType.debian_9,
	VmOsType.freebsd,
	VmOsType.freebsdx64 -> this@toOsTypeCode.name
	else -> OsType.fromValue(this@toOsTypeCode?.code ?: VmOsType.other.code).value()
}

fun OperatingSystem.findVmOsType(): VmOsType = VmOsType.forCode(this@findVmOsType.type())
fun OperatingSystem.findOsType(): OsType = OsType.fromValue(this@findOsType.type())

fun Architecture?.toArchitectureType(): ArchitectureType? = ArchitectureType.forCode(this@toArchitectureType?.value())
fun ArchitectureType?.toArchitecture(): Architecture? = Architecture.fromValue(this@toArchitecture?.name?.lowercase())
fun Cpu?.findArchitectureType(): ArchitectureType? = this@findArchitectureType?.architecture()?.toArchitectureType()

fun CpuPinningPolicy?.toCpuPinningPolicyB(): CpuPinningPolicyB? = CpuPinningPolicyB.forCode(this@toCpuPinningPolicyB?.name?.lowercase())
fun CpuPinningPolicyB?.toCpuPinningPolicy(): CpuPinningPolicy? = CpuPinningPolicy.fromValue(this@toCpuPinningPolicy?.name?.lowercase())

fun DisplayType?.toGraphicsTypeB(): GraphicsTypeB? = GraphicsTypeB.forCode(this@toGraphicsTypeB?.value())
fun GraphicsTypeB?.toDisplayType(): DisplayType? = DisplayType.fromValue(this@toDisplayType?.code)
fun Display?.findGraphicsTypeB(): GraphicsTypeB? = this@findGraphicsTypeB?.type().toGraphicsTypeB()

fun DiskContentType?.toDiskContentTypeB(): DiskContentTypeB? = DiskContentTypeB.forCode(this@toDiskContentTypeB?.value())
fun DiskContentTypeB?.toDiskContentType(): DiskContentType = DiskContentType.fromValue(this@toDiskContentType?.code)

fun DiskInterface?.toDiskInterfaceB(): DiskInterfaceB? = DiskInterfaceB.forCode(this@toDiskInterfaceB?.value())
fun DiskInterfaceB?.toDiskInterface(): DiskInterface? = DiskInterface.fromValue(this@toDiskInterface?.code)
fun DiskInterfaceB?.toDiskInterfaceBuilder(): DiskInterface? = DiskInterface.fromValue(this@toDiskInterfaceBuilder?.name?.lowercase())

fun FipsMode.toFipsModeB(): FipsModeB = FipsModeB.forCode(this@toFipsModeB.value())
fun FipsModeB.toFipsMode(): FipsMode = FipsMode.fromValue(this@toFipsMode.code)

fun FirewallType.toFirewallTypeB(): FirewallTypeB = FirewallTypeB.forCode(this@toFirewallTypeB.value())
fun FirewallTypeB.toFirewallType(): FirewallType = FirewallType.fromValue(this@toFirewallType.code)

fun ImageTransferPhase.toImageTransferPhaseB(): ImageTransferPhaseB = ImageTransferPhaseB.forCode(this@toImageTransferPhaseB.value())
fun ImageTransferPhaseB.toImageTransferPhaseB(): ImageTransferPhase = ImageTransferPhase.fromValue(this@toImageTransferPhaseB.code)

fun LogMaxMemoryUsedThresholdType?.toLogMaxMemoryUsedThresholdTypeB(): LogMaxMemoryUsedThresholdTypeB = LogMaxMemoryUsedThresholdTypeB.forCode(this@toLogMaxMemoryUsedThresholdTypeB?.value())
fun LogMaxMemoryUsedThresholdTypeB?.toLogMaxMemoryUsedThresholdType(): LogMaxMemoryUsedThresholdType = LogMaxMemoryUsedThresholdType.fromValue(this@toLogMaxMemoryUsedThresholdType?.code)

fun VmAffinity?.toMigrationSupport(): MigrationSupport = MigrationSupport.forCode(this@toMigrationSupport?.value())
fun VmPlacementPolicy.findMigrationSupport(): MigrationSupport = this@findMigrationSupport.affinity().toMigrationSupport()

fun MigrationBandwidthAssignmentMethod?.toMigrationBandwidthLimitType(): MigrationBandwidthLimitType? = MigrationBandwidthLimitType.forCode(this@toMigrationBandwidthLimitType?.value())
fun MigrationBandwidthLimitType?.toMigrationBandwidthAssignmentMethod(): MigrationBandwidthAssignmentMethod? = MigrationBandwidthAssignmentMethod.fromValue(this@toMigrationBandwidthAssignmentMethod?.code)

fun MigrationOptions.findMigrationBandwidthLimitType(): MigrationBandwidthLimitType? = this@findMigrationBandwidthLimitType.bandwidth().assignmentMethod().toMigrationBandwidthLimitType()
fun MigrationOptions.findMigrationEncrypt(): Boolean? = this@findMigrationEncrypt.encrypted().toBoolean()
fun MigrationOptions.findMigrationAutoConverge(): Boolean? = this@findMigrationAutoConverge.autoConverge().toBoolean()
fun MigrationOptions.findMigrationCompression(): Boolean? = this@findMigrationCompression.compressed().toBoolean()
fun MigrationSupport.toVmAffinity(): VmAffinity = VmAffinity.fromValue(this@toVmAffinity.code)

fun MigrateOnError.toMigrateOnErrorB(): MigrateOnErrorB = MigrateOnErrorB.forCode(this@toMigrateOnErrorB.value())
fun MigrateOnErrorB.toMigrateOnError(): MigrateOnError = MigrateOnError.fromValue(this@toMigrateOnError.code)

fun NetworkStatus.toNetworkStatusB(): NetworkStatusB = NetworkStatusB.forCode(this@toNetworkStatusB.value())
fun NetworkStatusB.toNetworkStatus(): NetworkStatus = NetworkStatus.fromValue(this@toNetworkStatus.code)

fun OperatingSystemInfo.toVmOsType(): VmOsType = VmOsType.forCode(this@toVmOsType.id())
fun List<OperatingSystemInfo>.toVmOsTypes(): List<VmOsType> = this@toVmOsTypes.map { it.toVmOsType() }

fun SeLinuxMode?.toSELinuxModeB(): SELinuxModeB? = SELinuxModeB.forCode(this@toSELinuxModeB?.value())
fun SELinuxModeB?.toSeLinuxMode(): SeLinuxMode? = SeLinuxMode.fromValue(this@toSeLinuxMode?.code)

fun StorageDomainStatus?.toStorageDomainStatusB(): StorageDomainStatusB = StorageDomainStatusB.forCode(this@toStorageDomainStatusB?.value())
fun StorageDomainStatusB?.toStorageDomainStatus(): StorageDomainStatus = StorageDomainStatus.fromValue(this@toStorageDomainStatus?.code)

fun StorageDomainType.toStorageDomainTypeB(): StorageDomainTypeB = StorageDomainTypeB.forCode(this@toStorageDomainTypeB.value())
fun StorageDomainTypeB.toStorageDomainType(): StorageDomainType = StorageDomainType.fromValue(this@toStorageDomainType.code)

fun StorageType.toStorageTypeB(): StorageTypeB = StorageTypeB.forCode(this@toStorageTypeB.value())
fun StorageTypeB.toStorageType(): StorageType = StorageType.fromValue(this@toStorageType.code)

fun SwitchType.toSwitchTypeB(): SwitchTypeB =	SwitchTypeB.forCode(this@toSwitchTypeB.value())
fun SwitchTypeB.toSwitchType(): SwitchType =	SwitchType.fromValue(this@toSwitchType.code)

fun QuotaEnforcementType.toQuotaModeType(): QuotaModeType =	QuotaModeType.fromValue(this@toQuotaModeType.name)
fun QuotaModeType.toQuotaEnforcementType(): QuotaEnforcementType = QuotaEnforcementType.forCode(this@toQuotaEnforcementType.value())

fun SpmStatus.toVdsSpmStatus(): VdsSpmStatus = VdsSpmStatus.forCode(this@toVdsSpmStatus.value())
fun VdsSpmStatus.toSpmStatus(): SpmStatus = SpmStatus.fromValue(this@toSpmStatus.code)

fun ImageTransferDirection.toImageTransferType(): ImageTransferType = ImageTransferType.forCode(this@toImageTransferType.value())
fun ImageTransferType.toImageTransferDirection(): ImageTransferDirection = ImageTransferDirection.fromValue(this@toImageTransferDirection.code)

fun ImageTransferTimeoutPolicy.toTimeoutPolicyType(): TimeoutPolicyType = TimeoutPolicyType.forCode(this@toTimeoutPolicyType.value())
fun TimeoutPolicyType.toImageTransferTimeoutPolicy(): ImageTransferTimeoutPolicy = ImageTransferTimeoutPolicy.fromValue(this@toImageTransferTimeoutPolicy.code)

fun HostStatus.toVdsStatus(): VdsStatus = VdsStatus.forCode(this@toVdsStatus.value())
fun VdsStatus.toHostStatus(): HostStatus = HostStatus.fromValue(this@toHostStatus.code)

fun NicStatus.toInterfaceStatus(): InterfaceStatus = InterfaceStatus.forCode(this@toInterfaceStatus.value())
fun InterfaceStatus.toNicStatus(): NicStatus = NicStatus.fromValue(this@toNicStatus.code)

fun BootProtocol.toIpv4BootProtocol(): Ipv4BootProtocol? = Ipv4BootProtocol.forCode(this@toIpv4BootProtocol.value())
fun Ipv4BootProtocol.toBootProtocol(): BootProtocol = BootProtocol.fromValue(this@toBootProtocol.code)
fun BootProtocol.toIpv6BootProtocol(): Ipv6BootProtocol? = Ipv6BootProtocol.forCode(this@toIpv6BootProtocol.value())
fun Ipv6BootProtocol.toBootProtocol(): BootProtocol = BootProtocol.fromValue(this@toBootProtocol.code)

fun VmStorageErrorResumeBehaviour.toVmResumeBehavior(): VmResumeBehavior = VmResumeBehavior.forCode(this@toVmResumeBehavior.name)
fun VmResumeBehavior.toVmStorageErrorResumeBehavior(): VmStorageErrorResumeBehaviour = VmStorageErrorResumeBehaviour.fromValue(this@toVmStorageErrorResumeBehavior.name.lowercase())

fun DiskFormat?.toVolumeFormat(): VolumeFormat? = VolumeFormat.forCode(this@toVolumeFormat?.value())
fun VolumeFormat?.toDiskFormat(): DiskFormat? = DiskFormat.fromValue(this@toDiskFormat?.code)

fun InheritableBoolean.toBoolean(): Boolean? = when(this@toBoolean.name) {
	"true" -> true
	"false" -> false
	else -> null
}
