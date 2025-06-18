package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.api.ovirt.business.VdsStatus
import com.itinfo.rutilvm.common.gson
import org.hibernate.annotations.Type
import java.time.LocalDateTime
import java.util.UUID
import java.io.Serializable
import java.math.BigDecimal
// Or jakarta.persistence.* for newer Spring Boot
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.OneToOne
import javax.persistence.MapsId
import javax.persistence.Table

/**
 *
 * [VdsDynamicEntity]
 * 호스트 유동적 정보
 *
 * @property vdsId [UUID]
 * @property vdsId: UUID
 * @property status [Int]
 * @property cpuCores [Int]
 * @property cpuModel [String]
 * @property cpuSpeedMh [BigDecimal]
 * @property ifTotalSpeed [String]
 * @property kvmEnabled [Boolean]
 * @property physicalMemMb [Int]
 * @property memCommited [Int]
 * @property vmActive [Int]
 * @property vmCount [Int]
 * @property vmMigrating [Int]
 * @property reservedMem [Int]
 * @property guestOverhead [Int]
 * @property softwareVersion [String]
 * @property versionName [String]
 * @property buildName [String]
 * @property previousStatus [Int]
 * @property cpuFlags [String]
 * @property vmsCoresCount [Int]
 * @property pendingVcpusCount [Int]
 * @property cpuSockets [Int]
 * @property netConfigDirty [Boolean]
 * @property supportedClusterLevels [String]
 * @property hostOs [String]
 * @property kvmVersion [String]
 * @property spiceVersion [String]
 * @property kernelVersion [String]
 * @property iscsiInitiatorName [String]
 * @property transparentHugepagesState [Int]
 * @property hooks [String]
 * @property updateDate [LocalDateTime]
 * @property nonOperationalReason [Int]
 * @property pendingVmemSize [Int]
 * @property rpmVersion [String]
 * @property supportedEngines [String]
 * @property libvirtVersion [String]
 * @property cpuThreads [Int]
 * @property hwManufacturer [String]
 * @property hwProductName [String]
 * @property hwVersion [String]
 * @property hwSerialNumber [String]
 * @property hwUuid [String]
 * @property hwFamily [String]
 * @property hbas [String]
 * @property supportedEmulatedMachines [String]
 * @property glusterVersion [String]
 * @property controlledByPmPolicy [Boolean]
 * @property kdumpStatus [Short]
 * @property selinuxEnforceMode [Int]
 * @property autoNumaBalancing [Short]
 * @property isNumaSupported [Boolean]
 * @property supportedRngSources [String]
 * @property onlineCpus [String]
 * @property maintenanceReason [String]
 * @property incomingMigrations [Int]
 * @property outgoingMigrations [Int]
 * @property isUpdateAvailable [Boolean]
 * @property externalStatus [Int]
 * @property isHostdevEnabled [Boolean]
 * @property librbd1Version [String]
 * @property glusterfsCliVersion [String]
 * @property kernelArgs [String]
 * @property prettyName [String]
 * @property hostedEngineConfigured [Boolean]
 * @property inFenceFlow [Boolean]
 * @property kernelFeatures [String]
 * @property openvswitchVersion [String]
 * @property vncEncryptionEnabled [Boolean]
 * @property connectorInfo [String]
 * @property backupEnabled [Boolean]
 * @property supportedDomainVersions [String]
 * @property supportedBlockSize [String]
 * @property tscFrequency [String]
 * @property tscScaling [Boolean]
 * @property fipsEnabled [Boolean]
 * @property bootUuid [String]
 * @property nmstateVersion [String]
 * @property coldBackupEnabled [Boolean]
 * @property cdChangePdiv [Boolean]
 * @property clearBitmapsEnabled [Boolean]
 * @property ovnConfigured [Boolean]
 * @property cpuTopology [String]
 * @property vdsmCpusAffinity [String]
 * @property vdsStatic [VdsStaticEntity]
 *
 * @see VdsStaticEntity
 */
@Entity
@Table(name = "vds_dynamic")
class VdsDynamicEntity(
	@Id
	@Column(name = "vds_id", unique = true, nullable = true)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	var vdsId: UUID? = null,
	var status: Int? = 0,
	val cpuCores: Int? = null,
	val cpuModel: String? = null,
	val cpuSpeedMh: BigDecimal? = BigDecimal.ZERO,
	var ifTotalSpeed: String = "",
	var kvmEnabled: Boolean? = false,
	var physicalMemMb: Int? = 0,
	var memCommited: Int? = 0,
	var vmActive: Int? = 0,
	var vmCount: Int? = 0,
	var vmMigrating: Int? = 0,
	var reservedMem: Int? = 0,
	var guestOverhead: Int? = 0,
	val softwareVersion: String = "",
	val versionName: String = "",
	val buildName: String = "",
	var previousStatus: Int? = null,
	var cpuFlags: String? = "",
	var vmsCoresCount: Int? = 0,
	var pendingVcpusCount: Int? = 0,
	var cpuSockets: Int? = 0,
	var netConfigDirty: Boolean? = false,
	var supportedClusterLevels: String? = "",
	val hostOs: String? = "",
	val kvmVersion: String? = "",
	val spiceVersion: String? = "",
	val kernelVersion: String? = "",
	val iscsiInitiatorName: String? = "",
	var transparentHugepagesState: Int? = 0,
	var hooks: String? = "",
	@Column(name = "_update_date")
	var updateDate: LocalDateTime? = null,
	var nonOperationalReason: Int? = 0,
	var pendingVmemSize: Int? = 0,
	val rpmVersion: String? = "",
	val supportedEngines: String? = "",
	val libvirtVersion: String? = "",
	var cpuThreads: Int? = 0,
	val hwManufacturer: String? = "",
	val hwProductName: String? = "",
	val hwVersion: String? = "",
	val hwSerialNumber: String? = "",
	val hwUuid: String? = "",
	val hwFamily: String? = "",
	val hbas: String? = "",
	val supportedEmulatedMachines: String? = "",
	var glusterVersion: String? = "",
	var controlledByPmPolicy: Boolean? = false,
	var kdumpStatus: Short = -1, // int2 maps to Short
	var selinuxEnforceMode: Int? = 0,
	var autoNumaBalancing: Short? = 0,
	var isNumaSupported: Boolean? = false,
	var supportedRngSources: String? = "",
	var onlineCpus: String? = "",
	var maintenanceReason: String? = "",
	var incomingMigrations: Int? = 0,
	var outgoingMigrations: Int? = 0,
	var isUpdateAvailable: Boolean? = false,
	var externalStatus: Int? = 0,
	var isHostdevEnabled: Boolean? = false,
	@Column(name = "librbd1_version", nullable = true)
	var librbd1Version: String? = "",
	var glusterfsCliVersion: String? = "",
	var kernelArgs: String? = "",
	var prettyName: String? = "",
	var hostedEngineConfigured: Boolean? = false,
	var inFenceFlow: Boolean? = false,
	// @Column(name = "kernel_features", columnDefinition = "jsonb") // Store as String, or use a converter
	// @Convert(converter = JsonbToStringConverter::class) // Example custom converter
	var kernelFeatures: String? = "",
	var openvswitchVersion: String? = "",
	var vncEncryptionEnabled: Boolean? = false,
	// @Column(name = "connector_info", columnDefinition = "jsonb")
	// @Convert(converter = JsonbToStringConverter::class) // Example custom converter
	var connectorInfo: String? = "",
	var backupEnabled: Boolean? = false,
	val supportedDomainVersions: String? = "",
	// @Column(name = "supported_block_size", columnDefinition = "jsonb")
	// @Convert(converter = JsonbToStringConverter::class) // Example custom converter
	var supportedBlockSize: String? = "",
	var tscFrequency: String? = "",
	var tscScaling: Boolean? = false,
	var fipsEnabled: Boolean? = false,
	var bootUuid: String? = "",
	var nmstateVersion: String? = "",
	var coldBackupEnabled: Boolean? = false,
	var cdChangePdiv: Boolean? = false,
	var clearBitmapsEnabled: Boolean? = false,
	var ovnConfigured: Boolean? = false,
	// @Convert(converter = JsonbToStringConverter::class) // Example custom converter
	val cpuTopology: String? = "",
	var vdsmCpusAffinity: String? = "",

	@OneToOne(fetch = FetchType.LAZY)
	@MapsId
	// This annotation is used for derived identities:
	// it means this entity's @Id field ('id') is mapped by the 'vdsStatic' relationship.
	// Essentially, VdsDynamic's ID comes from VdsStatic.
	@JoinColumn(name="vds_id",
		referencedColumnName="vds_id",
		insertable=false,
		updatable=false
	)
	val vdsStatic: VdsStaticEntity? = null,
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	var vdsStatus: VdsStatus
		get() = VdsStatus.forValue(status)
		set(newV) {
			this.previousStatus = this.status
			this.vdsStatus = newV
			this.status = newV.value
		}
	val vdsPreviousStatus: VdsStatus
		get() = VdsStatus.forValue(previousStatus)

	class Builder {
		private var bVdsId: UUID? = null;fun vdsId(block: () -> UUID?) { bVdsId = block() }
		private var bStatus: Int? = 0;fun status(block: () -> Int?) { bStatus = block() ?: 0 }
		private var bCpuCores: Int? = 0;fun cpuCores(block: () -> Int?) { bCpuCores = block() ?: 0 }
		private var bCpuModel: String? = "";fun cpuModel(block: () -> String?) { bCpuModel = block() ?: "" }
		private var bCpuSpeedMh: BigDecimal? = BigDecimal.ZERO;fun cpuSpeedMh(block: () -> BigDecimal?) { bCpuSpeedMh = block() ?: BigDecimal.ZERO }
		private var bIfTotalSpeed: String = "";fun ifTotalSpeed(block: () -> String ) { bIfTotalSpeed = block() ?: "" }
		private var bKvmEnabled: Boolean? = false;fun kvmEnabled(block: () -> Boolean?) { bKvmEnabled = block() ?: false }
		private var bPhysicalMemMb: Int? = 0;fun physicalMemMb(block: () -> Int?) { bPhysicalMemMb = block() ?: 0 }
		private var bMemCommited: Int? = 0;fun memCommited(block: () -> Int?) { bMemCommited = block() ?: 0 }
		private var bVmActive: Int? = 0;fun vmActive(block: () -> Int?) { bVmActive = block() ?: 0 }
		private var bVmCount: Int? = 0;fun vmCount(block: () -> Int?) { bVmCount = block() ?: 0 }
		private var bVmMigrating: Int? = 0;fun vmMigrating(block: () -> Int?) { bVmMigrating = block() ?: 0}
		private var bReservedMem: Int? = 0;fun reservedMem(block: () -> Int?) { bReservedMem = block() ?: 0}
		private var bGuestOverhead: Int? = 0;fun guestOverhead(block: () -> Int?) { bGuestOverhead = block() ?: 0}
		private var bSoftwareVersion: String = "";fun softwareVersion(block: () -> String ) { bSoftwareVersion = block() ?: "" }
		private var bVersionName: String = "";fun versionName(block: () -> String ) { bVersionName = block() ?: "" }
		private var bBuildName: String = "";fun buildName(block: () -> String ) { bBuildName = block() ?: "" }
		private var bPreviousStatus: Int? = null;fun previousStatus(block: () -> Int?) { bPreviousStatus = block() ?: 0 }
		private var bCpuFlags: String? = "";fun cpuFlags(block: () -> String?) { bCpuFlags = block() ?: "" }
		private var bVmsCoresCount: Int? = 0;fun vmsCoresCount(block: () -> Int?) { bVmsCoresCount = block() ?: 0 }
		private var bPendingVcpusCount: Int? = 0;fun pendingVcpusCount(block: () -> Int?) { bPendingVcpusCount = block() ?: 0 }
		private var bCpuSockets: Int? = 0;fun cpuSockets(block: () -> Int?) { bCpuSockets = block() ?: 0 }
		private var bNetConfigDirty: Boolean? = false;fun netConfigDirty(block: () -> Boolean?) { bNetConfigDirty = block() ?: false }
		private var bSupportedClusterLevels: String? = "";fun supportedClusterLevels(block: () -> String?) { bSupportedClusterLevels = block() ?: "" }
		private var bHostOs: String? = "";fun hostOs(block: () -> String?) { bHostOs = block() ?: "" }
		private var bKvmVersion: String? = "";fun kvmVersion(block: () -> String?) { bKvmVersion = block() ?: "" }
		private var bSpiceVersion: String? = "";fun spiceVersion(block: () -> String?) { bSpiceVersion = block() ?: "" }
		private var bKernelVersion: String? = "";fun kernelVersion(block: () -> String?) { bKernelVersion = block() ?: "" }
		private var bIscsiInitiatorName: String? = "";fun iscsiInitiatorName(block: () -> String?) { bIscsiInitiatorName = block() ?: "" }
		private var bTransparentHugepagesState: Int? = 0;fun transparentHugepagesState(block: () -> Int?) { bTransparentHugepagesState = block() ?: 0 }
		private var bHooks: String? = "";fun hooks(block: () -> String?) { bHooks = block() ?: "" }
		private var bUpdateDate: LocalDateTime? = null;fun updateDate(block: () -> LocalDateTime?) { bUpdateDate = block() }
		private var bNonOperationalReason: Int? = 0;fun nonOperationalReason(block: () -> Int?) { bNonOperationalReason = block() ?: 0 }
		private var bPendingVmemSize: Int? = 0;fun pendingVmemSize(block: () -> Int?) { bPendingVmemSize = block() ?: 0 }
		private var bRpmVersion: String? = "";fun rpmVersion(block: () -> String?) { bRpmVersion = block() ?: "" }
		private var bSupportedEngines: String? = "";fun supportedEngines(block: () -> String?) { bSupportedEngines = block() ?: "" }
		private var bLibvirtVersion: String? = "";fun libvirtVersion(block: () -> String?) { bLibvirtVersion = block() ?: "" }
		private var bCpuThreads: Int? = 0;fun cpuThreads(block: () -> Int?) { bCpuThreads = block() ?: 0 }
		private var bHwManufacturer: String? = "";fun hwManufacturer(block: () -> String?) { bHwManufacturer = block() ?: "" }
		private var bHwProductName: String? = "";fun hwProductName(block: () -> String?) { bHwProductName = block() ?: "" }
		private var bHwVersion: String? = "";fun hwVersion(block: () -> String?) { bHwVersion = block() ?: "" }
		private var bHwSerialNumber: String? = "";fun hwSerialNumber(block: () -> String?) { bHwSerialNumber = block() ?: "" }
		private var bHwUuid: String? = "";fun hwUuid(block: () -> String?) { bHwUuid = block() ?: "" }
		private var bHwFamily: String? = "";fun hwFamily(block: () -> String?) { bHwFamily = block() ?: "" }
		private var bHbas: String? = "";fun hbas(block: () -> String?) { bHbas = block() ?: "" }
		private var bSupportedEmulatedMachines: String? = "";fun supportedEmulatedMachines(block: () -> String?) { bSupportedEmulatedMachines = block() ?: "" }
		private var bGlusterVersion: String? = "";fun glusterVersion(block: () -> String?) { bGlusterVersion = block() ?: "" }
		private var bControlledByPmPolicy: Boolean? = false;fun controlledByPmPolicy(block: () -> Boolean?) { bControlledByPmPolicy = block() ?: false }
		private var bKdumpStatus: Short = -1;fun kdumpStatus(block: () -> Short?) { bKdumpStatus = block() ?: -1 }
		private var bSelinuxEnforceMode: Int? = 0;fun selinuxEnforceMode(block: () -> Int?) { bSelinuxEnforceMode = block() ?: 0 }
		private var bAutoNumaBalancing: Short? = 0;fun autoNumaBalancing(block: () -> Short?) { bAutoNumaBalancing = block() ?: 0 }
		private var bIsNumaSupported: Boolean? = false;fun isNumaSupported(block: () -> Boolean?) { bIsNumaSupported = block() ?: false }
		private var bSupportedRngSources: String? = "";fun supportedRngSources(block: () -> String?) { bSupportedRngSources = block() ?: "" }
		private var bOnlineCpus: String? = "";fun onlineCpus(block: () -> String?) { bOnlineCpus = block() ?: "" }
		private var bMaintenanceReason: String? = "";fun maintenanceReason(block: () -> String?) { bMaintenanceReason = block() ?: "" }
		private var bIncomingMigrations: Int? = 0;fun incomingMigrations(block: () -> Int?) { bIncomingMigrations = block() ?: 0 }
		private var bOutgoingMigrations: Int? = 0;fun outgoingMigrations(block: () -> Int?) { bOutgoingMigrations = block() ?: 0 }
		private var bIsUpdateAvailable: Boolean? = false;fun isUpdateAvailable(block: () -> Boolean?) { bIsUpdateAvailable = block() ?: false }
		private var bExternalStatus: Int? = 0;fun externalStatus(block: () -> Int?) { bExternalStatus = block() ?: 0 }
		private var bIsHostdevEnabled: Boolean? = false;fun isHostdevEnabled(block: () -> Boolean?) { bIsHostdevEnabled = block() ?: false }
		private var bLibrbd1Version: String? = "";fun librbd1Version(block: () -> String?) { bLibrbd1Version = block() ?: "" }
		private var bGlusterfsCliVersion: String? = "";fun glusterfsCliVersion(block: () -> String?) { bGlusterfsCliVersion = block() ?: "" }
		private var bKernelArgs: String? = "";fun kernelArgs(block: () -> String?) { bKernelArgs = block() ?: "" }
		private var bPrettyName: String? = "";fun prettyName(block: () -> String?) { bPrettyName = block() ?: "" }
		private var bHostedEngineConfigured: Boolean? = false;fun hostedEngineConfigured(block: () -> Boolean?) { bHostedEngineConfigured = block() ?: false }
		private var bInFenceFlow: Boolean? = false;fun inFenceFlow(block: () -> Boolean?) { bInFenceFlow = block() ?: false }
		private var bKernelFeatures: String? = "";fun kernelFeatures(block: () -> String?) { bKernelFeatures = block() ?: "" }
		private var bOpenvswitchVersion: String? = "";fun openvswitchVersion(block: () -> String?) { bOpenvswitchVersion = block() ?: "" }
		private var bVncEncryptionEnabled: Boolean? = false;fun vncEncryptionEnabled(block: () -> Boolean?) { bVncEncryptionEnabled = block() ?: false }
		private var bConnectorInfo: String? = "";fun connectorInfo(block: () -> String?) { bConnectorInfo = block() ?: "" }
		private var bBackupEnabled: Boolean? = false;fun backupEnabled(block: () -> Boolean?) { bBackupEnabled = block() ?: false }
		private var bSupportedDomainVersions: String? = "";fun supportedDomainVersions(block: () -> String?) { bSupportedDomainVersions = block() ?: "" }
		private var bSupportedBlockSize: String? = "";fun supportedBlockSize(block: () -> String?) { bSupportedBlockSize = block() ?: "" }
		private var bTscFrequency: String? = "";fun tscFrequency(block: () -> String?) { bTscFrequency = block() ?: "" }
		private var bTscScaling: Boolean? = false;fun tscScaling(block: () -> Boolean?) { bTscScaling = block() ?: false }
		private var bFipsEnabled: Boolean? = false;fun fipsEnabled(block: () -> Boolean?) { bFipsEnabled = block() ?: false }
		private var bBootUuid: String? = "";fun bootUuid(block: () -> String?) { bBootUuid = block() ?: "" }
		private var bNmstateVersion: String? = "";fun nmstateVersion(block: () -> String?) { bNmstateVersion = block() ?: "" }
		private var bColdBackupEnabled: Boolean? = false;fun coldBackupEnabled(block: () -> Boolean?) { bColdBackupEnabled = block() ?: false }
		private var bCdChangePdiv: Boolean? = false;fun cdChangePdiv(block: () -> Boolean?) { bCdChangePdiv = block() ?: false }
		private var bClearBitmapsEnabled: Boolean? = false;fun clearBitmapsEnabled(block: () -> Boolean?) { bClearBitmapsEnabled = block() ?: false }
		private var bOvnConfigured: Boolean? = false;fun ovnConfigured(block: () -> Boolean?) { bOvnConfigured = block() ?: false }
		private var bCpuTopology: String? = "";fun cpuTopology(block: () -> String?) { bCpuTopology = block() ?: "" }
		private var bVdsmCpusAffinity: String? = "";fun vdsmCpusAffinity(block: () -> String?) { bVdsmCpusAffinity = block() ?: "" }
		fun build(): VdsDynamicEntity = VdsDynamicEntity(bVdsId, bStatus, bCpuCores, bCpuModel, bCpuSpeedMh, bIfTotalSpeed, bKvmEnabled, bPhysicalMemMb, bMemCommited, bVmActive, bVmCount, bVmMigrating, bReservedMem, bGuestOverhead, bSoftwareVersion, bVersionName, bBuildName, bPreviousStatus, bCpuFlags, bVmsCoresCount, bPendingVcpusCount, bCpuSockets, bNetConfigDirty, bSupportedClusterLevels, bHostOs, bKvmVersion, bSpiceVersion, bKernelVersion, bIscsiInitiatorName, bTransparentHugepagesState, bHooks, bUpdateDate, bNonOperationalReason, bPendingVmemSize, bRpmVersion, bSupportedEngines, bLibvirtVersion, bCpuThreads, bHwManufacturer, bHwProductName, bHwVersion, bHwSerialNumber, bHwUuid, bHwFamily, bHbas, bSupportedEmulatedMachines, bGlusterVersion, bControlledByPmPolicy, bKdumpStatus, bSelinuxEnforceMode, bAutoNumaBalancing, bIsNumaSupported, bSupportedRngSources, bOnlineCpus, bMaintenanceReason, bIncomingMigrations, bOutgoingMigrations, bIsUpdateAvailable, bExternalStatus, bIsHostdevEnabled, bLibrbd1Version, bGlusterfsCliVersion, bKernelArgs, bPrettyName, bHostedEngineConfigured, bInFenceFlow, bKernelFeatures, bOpenvswitchVersion, bVncEncryptionEnabled, bConnectorInfo, bBackupEnabled, bSupportedDomainVersions, bSupportedBlockSize, bTscFrequency, bTscScaling, bFipsEnabled, bBootUuid, bNmstateVersion, bColdBackupEnabled, bCdChangePdiv, bClearBitmapsEnabled, bOvnConfigured, bCpuTopology, bVdsmCpusAffinity)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): VdsDynamicEntity = Builder().apply(block).build()
	}
}
