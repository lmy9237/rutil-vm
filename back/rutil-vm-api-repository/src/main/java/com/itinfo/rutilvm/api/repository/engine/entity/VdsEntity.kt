package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.api.ovirt.business.SELinuxModeB
import com.itinfo.rutilvm.api.ovirt.business.VdsSpmStatus
import com.itinfo.rutilvm.api.ovirt.business.VdsStatus
import com.itinfo.rutilvm.api.ovirt.business.VdsTransparentHugePages
import com.itinfo.rutilvm.common.gson
import org.hibernate.annotations.Immutable
import org.hibernate.annotations.Type
import javax.persistence.Id
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.OneToMany
import javax.persistence.Table
import java.io.Serializable
import java.math.BigDecimal
import java.math.BigInteger
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Immutable
@Table(name = "vds")
class VdsEntity(
	@Id
	@Column(name = "vds_id")
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val vdsId: UUID? = null,
	val vdsName: String? = null,
	val vdsUniqueId: String? = null,

	val hostName: String? = "",
	val freeTextComment: String? = "",
	val port: Int? = 0,
	val serverSslEnabled: Boolean? = true,
	@Column(name="vds_type")
	private val _vdsType: Int? = null,
	val pmEnabled: Boolean? = false,
	val pmProxyPreferences: String? = "",
	val pmDetectKdump: Boolean? = false,
	val vdsSpmPriority: Int? = 0,
	val hooks: String? = "",
	@Column(name="status")
	private val _status: Int? = null,
	@Column(name="external_status")
	private val _externalStatus: Int? = null,
	val cpuCores: Int? = 0,
	val cpuThreads: Int? = 0,
	val cpuModel: String? = "",
	val cpuSpeedMh: Double? = 0.0,
	val ifTotalSpeed: String? = "",
	val kvmEnabled: Boolean? = false,
	val physicalMemMb: Int? = 0,
	val pendingVcpusCount: Int? = 0,
	val pendingVmemSize: Int? = 0,
	val memCommited: Int? = null,
	val vmActive: Int? = null,
	val vmCount: Int? = null,
	val vmMigrating: Int? = null,
	val incomingMigrations: Int? = null,
	val outgoingMigrations: Int? = null,
	val kernelArgs: String? = null,
	val prettyName: String? = null,
	val hostedEngineConfigured: Boolean? = null,

	val vmsCoresCount: Int? = null,
	val cpuOverCommitTimeStamp: LocalDateTime? = null,

	@Column(name = "net_config_dirty")
	val netConfigDirty: Boolean? = null,

	@Column(name = "reserved_mem")
	val reservedMem: Int? = null,

	@Column(name = "guest_overhead")
	val guestOverhead: Int? = null,

	@Column(name = "rpm_version")
	val rpmVersion: String? = null,

	@Column(name = "software_version")
	val softwareVersion: String? = null,

	@Column(name = "version_name")
	val versionName: String? = null,

	@Column(name = "build_name")
	val buildName: String? = null,

	@Column(name = "previous_status")
	val previousStatus: Int? = null,

	@Column(name = "cpu_idle")
	val cpuIdle: BigDecimal? = null,

	@Column(name = "cpu_load")
	val cpuLoad: BigDecimal? = null,

	@Column(name = "cpu_sys")
	val cpuSys: BigDecimal? = null,

	@Column(name = "cpu_user")
	val cpuUser: BigDecimal? = null,

	@Column(name = "usage_mem_percent")
	val usageMemPercent: Int? = null,

	@Column(name = "usage_cpu_percent")
	val usageCpuPercent: Int? = null,

	@Column(name = "usage_network_percent")
	val usageNetworkPercent: Int? = null,

	@Column(name = "mem_free")
	val memFree: Long? = null,

	@Column(name = "mem_shared")
	val memShared: Long? = null,

	@Column(name = "swap_free")
	val swapFree: Long? = null,

	@Column(name = "swap_total")
	val swapTotal: Long? = null,

	@Column(name = "ksm_cpu_percent")
	val ksmCpuPercent: Int? = null,

	val ksmPages: Long? = null,
	val ksmState: Boolean? = null,

	val cpuFlags: String? = null,
	val cpuSockets: Int? = null,

	@Column(name = "vds_spm_id")
	val vdsSpmId: Int? = null,

	@Column(name = "otp_validity")
	val otpValidity: Long? = null,

	@Column(name = "spm_status")
	private val _spmStatus: Int? = null,

	@Column(name = "supported_cluster_levels")
	val supportedClusterLevels: String? = null,

	@Column(name = "supported_engines")
	val supportedEngines: String? = null,

	@Column(name = "host_os")
	val hostOs: String? = null,

	@Column(name = "kvm_version")
	val kvmVersion: String? = null,

	@Column(name = "libvirt_version")
	val libvirtVersion: String? = null,

	@Column(name = "spice_version")
	val spiceVersion: String? = null,

	@Column(name = "gluster_version")
	val glusterVersion: String? = null,

	@Column(name = "librbd1_version")
	val librbd1Version: String? = null,

	@Column(name = "glusterfs_cli_version")
	val glusterfsCliVersion: String? = null,

	@Column(name = "openvswitch_version")
	val openvswitchVersion: String? = null,

	@Column(name = "nmstate_version")
	val nmstateVersion: String? = null,

	@Column(name = "kernel_version")
	val kernelVersion: String? = null,

	@Column(name = "iscsi_initiator_name")
	val iscsiInitiatorName: String? = null,

	@Column(name = "transparent_hugepages_state")
	private val _transparentHugepagesState: Int? = null,

	@Column(name = "anonymous_hugepages")
	val anonymousHugepages: Int? = null,

	@Column(name = "hugepages")
	val hugepages: String? = "",

	@Column(name = "non_operational_reason")
	val nonOperationalReason: Int? = null,

	@Column(name = "recoverable")
	val recoverable: Boolean? = null,

	@Column(name = "sshkeyfingerprint")
	val sshkeyfingerprint: String? = null,

	@Column(name = "host_provider_id")
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val hostProviderId: UUID? = null,

	@Column(name = "hw_manufacturer")
	val hwManufacturer: String? = null,

	@Column(name = "hw_product_name")
	val hwProductName: String? = null,

	@Column(name = "hw_version")
	val hwVersion: String? = null,

	@Column(name = "hw_serial_number")
	val hwSerialNumber: String? = null,

	@Column(name = "hw_uuid")
	val hwUuid: String? = null,

	@Column(name = "hw_family")
	val hwFamily: String? = null,

	@Column(name = "console_address")
	val consoleAddress: String? = null,

	@Column(name = "hbas")
	val hbas: String? = null,

	@Column(name = "supported_emulated_machines")
	val supportedEmulatedMachines: String? = null,

	@Column(name = "supported_rng_sources")
	val supportedRngSources: String? = null,
	val sshPort: Int? = null,
	val sshUsername: String? = null,

	val haScore: Int? = null,
	val haConfigured: Boolean? = null,
	val haActive: Boolean? = null,
	val haGlobalMaintenance: Boolean? = null,
	val haLocalMaintenance: Boolean? = null,

	val disableAutoPm: Boolean? = null,
	val controlledByPmPolicy: Boolean? = null,
	val bootTime: Long? = null,

	@Column(name = "kdump_status")
	val kdumpStatus: Int? = null,
	@Column(name = "selinux_enforce_mode")
	private val _selinuxEnforceMode: Int? = null,

	@Column(name = "auto_numa_balancing")
	val autoNumaBalancing: Int? = null,

	@Column(name = "is_numa_supported")
	val isNumaSupported: Boolean? = null,

	@Column(name = "online_cpus")
	val onlineCpus: String? = null,

	@Column(name = "maintenance_reason")
	val maintenanceReason: String? = null,

	@Column(name = "is_update_available")
	val isUpdateAvailable: Boolean? = null,

	@Column(name = "is_hostdev_enabled")
	val isHostdevEnabled: Boolean? = null,

	@Column(name = "is_hosted_engine_host")
	val isHostedEngineHost: Boolean? = null,

	@Column(name = "kernel_cmdline")
	val kernelCmdline: String? = null,

	@Column(name = "last_stored_kernel_cmdline")
	val lastStoredKernelCmdline: String? = null,

	@Column(name = "fencing_enabled")
	val fencingEnabled: Boolean? = null,

	@Column(name = "gluster_peer_status")
	val glusterPeerStatus: String? = null,

	@Column(name = "in_fence_flow")
	val inFenceFlow: Boolean? = null,

	@Column(name = "reinstall_required")
	val reinstallRequired: Boolean? = null,

	@Column(name = "kernel_features")
	val kernelFeatures: String? = null,

	@Column(name = "vnc_encryption_enabled")
	val vncEncryptionEnabled: Boolean? = null,

	@Column(name = "vgpu_placement")
	val vgpuPlacement: Int? = null,

	@Column(name = "connector_info")
	val connectorInfo: String? = null,

	@Column(name = "backup_enabled")
	val backupEnabled: Boolean? = null,

	@Column(name = "cold_backup_enabled")
	val coldBackupEnabled: Boolean? = null,

	@Column(name = "clear_bitmaps_enabled")
	val clearBitmapsEnabled: Boolean? = null,

	@Column(name = "supported_domain_versions")
	val supportedDomainVersions: String? = null,

	@Column(name = "supported_block_size")
	val supportedBlockSize: String? = null,

	@Column(name = "cluster_smt_disabled")
	val clusterSmtDisabled: Boolean? = null,

	@Column(name = "tsc_frequency")
	val tscFrequency: String? = null,

	@Column(name = "tsc_scaling")
	val tscScaling: Boolean? = null,

	@Column(name = "fips_enabled")
	val fipsEnabled: Boolean? = null,

	@Column(name = "boot_uuid")
	val bootUuid: String? = null,

	@Column(name = "cd_change_pdiv")
	val cdChangePdiv: String? = null,
	val ovnConfigured: Boolean? = null,

	val sshPublicKey: String? = null,
	val cpuTopology: String? = null,
	val vdsmCpusAffinity: String? = null,

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(
		name="storage_pool_id",
		referencedColumnName="id",
		insertable=false,
		updatable=false
	)
	val storagePool: StoragePoolEntity? = null,
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(
		name="cluster_id",
		referencedColumnName="cluster_id",
		insertable=false,
		updatable=false
	)
	val cluster: ClusterViewEntity? = null,
) : Serializable {

	val selinuxEnforceMode: SELinuxModeB?		get() = SELinuxModeB.forValue(_selinuxEnforceMode)
	val spmStatus: VdsSpmStatus?				get() = VdsSpmStatus.forValue(_spmStatus)
	val vdsStatus: VdsStatus? 				get() = VdsStatus.forValue(_status)
	val transparentHugepagesState: VdsTransparentHugePages get() = VdsTransparentHugePages.forValue(_transparentHugepagesState)


	override fun toString(): String =
		gson.toJson(this@VdsEntity)

	class Builder {
		private var bVdsId: UUID? = null; fun vdsId(block: () -> UUID?) { bVdsId = block() }
		private var bVdsName: String? = null; fun vdsName(block: () -> String?) { bVdsName = block() }
		private var bVdsUniqueId: String? = null; fun vdsUniqueId(block: () -> String?) { bVdsUniqueId = block() }
		private var bHostName: String? = null; fun hostName(block: () -> String?) { bHostName = block() }
		private var bFreeTextComment: String? = null; fun freeTextComment(block: () -> String?) { bFreeTextComment = block() }
		private var bPort: Int? = null; fun port(block: () -> Int?) { bPort = block() }
		private var bServerSslEnabled: Boolean? = null; fun serverSslEnabled(block: () -> Boolean?) { bServerSslEnabled = block() }
		private var bVdsType: Int? = null; fun vdsType(block: () -> Int?) { bVdsType = block() }
		private var bPmEnabled: Boolean? = null; fun pmEnabled(block: () -> Boolean?) { bPmEnabled = block() }
		private var bPmProxyPreferences: String? = null; fun pmProxyPreferences(block: () -> String?) { bPmProxyPreferences = block() }
		private var bPmDetectKdump: Boolean? = null; fun pmDetectKdump(block: () -> Boolean?) { bPmDetectKdump = block() }
		private var bVdsSpmPriority: Int? = null; fun vdsSpmPriority(block: () -> Int?) { bVdsSpmPriority = block() }
		private var bHooks: String? = null; fun hooks(block: () -> String?) { bHooks = block() }
		private var bStatus: Int? = null; fun status(block: () -> Int?) { bStatus = block() }
		private var bExternalStatus: Int? = null; fun externalStatus(block: () -> Int?) { bExternalStatus = block() }
		private var bCpuCores: Int? = null; fun cpuCores(block: () -> Int?) { bCpuCores = block() }
		private var bCpuThreads: Int? = null; fun cpuThreads(block: () -> Int?) { bCpuThreads = block() }
		private var bCpuModel: String? = null; fun cpuModel(block: () -> String?) { bCpuModel = block() }
		private var bCpuSpeedMh: Double? = null; fun cpuSpeedMh(block: () -> Double?) { bCpuSpeedMh = block() }
		private var bIfTotalSpeed: String? = null; fun ifTotalSpeed(block: () -> String?) { bIfTotalSpeed = block() }
		private var bKvmEnabled: Boolean? = null; fun kvmEnabled(block: () -> Boolean?) { bKvmEnabled = block() }
		private var bPhysicalMemMb: Int? = null; fun physicalMemMb(block: () -> Int?) { bPhysicalMemMb = block() }
		private var bPendingVcpusCount: Int? = null; fun pendingVcpusCount(block: () -> Int?) { bPendingVcpusCount = block() }
		private var bPendingVmemSize: Int? = null; fun pendingVmemSize(block: () -> Int?) { bPendingVmemSize = block() }
		private var bMemCommited: Int? = null; fun memCommited(block: () -> Int?) { bMemCommited = block() }
		private var bVmActive: Int? = null; fun vmActive(block: () -> Int?) { bVmActive = block() }
		private var bVmCount: Int? = null; fun vmCount(block: () -> Int?) { bVmCount = block() }
		private var bVmMigrating: Int? = null; fun vmMigrating(block: () -> Int?) { bVmMigrating = block() }
		private var bIncomingMigrations: Int? = null; fun incomingMigrations(block: () -> Int?) { bIncomingMigrations = block() }
		private var bOutgoingMigrations: Int? = null; fun outgoingMigrations(block: () -> Int?) { bOutgoingMigrations = block() }
		private var bKernelArgs: String? = null; fun kernelArgs(block: () -> String?) { bKernelArgs = block() }
		private var bPrettyName: String? = null; fun prettyName(block: () -> String?) { bPrettyName = block() }
		private var bHostedEngineConfigured: Boolean? = null; fun hostedEngineConfigured(block: () -> Boolean?) { bHostedEngineConfigured = block() }
		private var bVmsCoresCount: Int? = null; fun vmsCoresCount(block: () -> Int?) { bVmsCoresCount = block() }
		private var bCpuOverCommitTimeStamp: LocalDateTime? = null; fun cpuOverCommitTimeStamp(block: () -> LocalDateTime?) { bCpuOverCommitTimeStamp = block() }
		private var bNetConfigDirty: Boolean? = null; fun netConfigDirty(block: () -> Boolean?) { bNetConfigDirty = block() }
		private var bReservedMem: Int? = null; fun reservedMem(block: () -> Int?) { bReservedMem = block() }
		private var bGuestOverhead: Int? = null; fun guestOverhead(block: () -> Int?) { bGuestOverhead = block() }
		private var bRpmVersion: String? = null; fun rpmVersion(block: () -> String?) { bRpmVersion = block() }
		private var bSoftwareVersion: String? = null; fun softwareVersion(block: () -> String?) { bSoftwareVersion = block() }
		private var bVersionName: String? = null; fun versionName(block: () -> String?) { bVersionName = block() }
		private var bBuildName: String? = null; fun buildName(block: () -> String?) { bBuildName = block() }
		private var bPreviousStatus: Int? = null; fun previousStatus(block: () -> Int?) { bPreviousStatus = block() }
		private var bCpuIdle: BigDecimal? = null; fun cpuIdle(block: () -> BigDecimal?) { bCpuIdle = block() }
		private var bCpuLoad: BigDecimal? = null; fun cpuLoad(block: () -> BigDecimal?) { bCpuLoad = block() }
		private var bCpuSys: BigDecimal? = null; fun cpuSys(block: () -> BigDecimal?) { bCpuSys = block() }
		private var bCpuUser: BigDecimal? = null; fun cpuUser(block: () -> BigDecimal?) { bCpuUser = block() }
		private var bUsageMemPercent: Int? = null; fun usageMemPercent(block: () -> Int?) { bUsageMemPercent = block() }
		private var bUsageCpuPercent: Int? = null; fun usageCpuPercent(block: () -> Int?) { bUsageCpuPercent = block() }
		private var bUsageNetworkPercent: Int? = null; fun usageNetworkPercent(block: () -> Int?) { bUsageNetworkPercent = block() }
		private var bMemFree: Long? = null; fun memFree(block: () -> Long?) { bMemFree = block() }
		private var bMemShared: Long? = null; fun memShared(block: () -> Long?) { bMemShared = block() }
		private var bSwapFree: Long? = null; fun swapFree(block: () -> Long?) { bSwapFree = block() }
		private var bSwapTotal: Long? = null; fun swapTotal(block: () -> Long?) { bSwapTotal = block() }
		private var bKsmCpuPercent: Int? = null; fun ksmCpuPercent(block: () -> Int?) { bKsmCpuPercent = block() }
		private var bKsmPages: Long? = null; fun ksmPages(block: () -> Long?) { bKsmPages = block() }
		private var bKsmState: Boolean? = null; fun ksmState(block: () -> Boolean?) { bKsmState = block() }
		private var bCpuFlags: String? = null; fun cpuFlags(block: () -> String?) { bCpuFlags = block() }
		private var bClusterCpuName: String? = null; fun clusterCpuName(block: () -> String?) { bClusterCpuName = block() }
		private var bClusterCpuFlags: String? = null; fun clusterCpuFlags(block: () -> String?) { bClusterCpuFlags = block() }
		private var bClusterCpuVerb: String? = null; fun clusterCpuVerb(block: () -> String?) { bClusterCpuVerb = block() }
		private var bCpuSockets: Int? = null; fun cpuSockets(block: () -> Int?) { bCpuSockets = block() }
		private var bVdsSpmId: Int? = null; fun vdsSpmId(block: () -> Int?) { bVdsSpmId = block() }
		private var bOtpValidity: Long? = null; fun otpValidity(block: () -> Long?) { bOtpValidity = block() }
		private var bSpmStatus: Int? = null; fun spmStatus(block: () -> Int?) { bSpmStatus = block() }
		private var bSupportedClusterLevels: String? = null; fun supportedClusterLevels(block: () -> String?) { bSupportedClusterLevels = block() }
		private var bSupportedEngines: String? = null; fun supportedEngines(block: () -> String?) { bSupportedEngines = block() }
		private var bClusterCompatibilityVersion: String? = null; fun clusterCompatibilityVersion(block: () -> String?) { bClusterCompatibilityVersion = block() }
		private var bClusterVirtService: Boolean? = null; fun clusterVirtService(block: () -> Boolean?) { bClusterVirtService = block() }
		private var bClusterGlusterService: Boolean? = null; fun clusterGlusterService(block: () -> Boolean?) { bClusterGlusterService = block() }
		private var bHostOs: String? = null; fun hostOs(block: () -> String?) { bHostOs = block() }
		private var bKvmVersion: String? = null; fun kvmVersion(block: () -> String?) { bKvmVersion = block() }
		private var bLibvirtVersion: String? = null; fun libvirtVersion(block: () -> String?) { bLibvirtVersion = block() }
		private var bSpiceVersion: String? = null; fun spiceVersion(block: () -> String?) { bSpiceVersion = block() }
		private var bGlusterVersion: String? = null; fun glusterVersion(block: () -> String?) { bGlusterVersion = block() }
		private var bLibrbd1Version: String? = null; fun librbd1Version(block: () -> String?) { bLibrbd1Version = block() }
		private var bGlusterfsCliVersion: String? = null; fun glusterfsCliVersion(block: () -> String?) { bGlusterfsCliVersion = block() }
		private var bOpenvswitchVersion: String? = null; fun openvswitchVersion(block: () -> String?) { bOpenvswitchVersion = block() }
		private var bNmstateVersion: String? = null; fun nmstateVersion(block: () -> String?) { bNmstateVersion = block() }
		private var bKernelVersion: String? = null; fun kernelVersion(block: () -> String?) { bKernelVersion = block() }
		private var bIscsiInitiatorName: String? = null; fun iscsiInitiatorName(block: () -> String?) { bIscsiInitiatorName = block() }
		private var bTransparentHugepagesState: Int? = null; fun transparentHugepagesState(block: () -> Int?) { bTransparentHugepagesState = block() }
		private var bAnonymousHugepages: Int? = null; fun anonymousHugepages(block: () -> Int?) { bAnonymousHugepages = block() }
		private var bHugepages: String? = ""; fun hugepages(block: () -> String?) { bHugepages = block() ?: "" }
		private var bNonOperationalReason: Int? = null; fun nonOperationalReason(block: () -> Int?) { bNonOperationalReason = block() }
		private var bRecoverable: Boolean? = null; fun recoverable(block: () -> Boolean?) { bRecoverable = block() }
		private var bSshkeyfingerprint: String? = null; fun sshkeyfingerprint(block: () -> String?) { bSshkeyfingerprint = block() }
		private var bHostProviderId: UUID? = null; fun hostProviderId(block: () -> UUID?) { bHostProviderId = block() }
		private var bHwManufacturer: String? = null; fun hwManufacturer(block: () -> String?) { bHwManufacturer = block() }
		private var bHwProductName: String? = null; fun hwProductName(block: () -> String?) { bHwProductName = block() }
		private var bHwVersion: String? = null; fun hwVersion(block: () -> String?) { bHwVersion = block() }
		private var bHwSerialNumber: String? = null; fun hwSerialNumber(block: () -> String?) { bHwSerialNumber = block() }
		private var bHwUuid: String? = null; fun hwUuid(block: () -> String?) { bHwUuid = block() }
		private var bHwFamily: String? = null; fun hwFamily(block: () -> String?) { bHwFamily = block() }
		private var bConsoleAddress: String? = null; fun consoleAddress(block: () -> String?) { bConsoleAddress = block() }
		private var bHbas: String? = null; fun hbas(block: () -> String?) { bHbas = block() }
		private var bSupportedEmulatedMachines: String? = null; fun supportedEmulatedMachines(block: () -> String?) { bSupportedEmulatedMachines = block() }
		private var bSupportedRngSources: String? = null; fun supportedRngSources(block: () -> String?) { bSupportedRngSources = block() }
		private var bSshPort: Int? = null; fun sshPort(block: () -> Int?) { bSshPort = block() }
		private var bSshUsername: String? = null; fun sshUsername(block: () -> String?) { bSshUsername = block() }
		private var bHaScore: Int? = null; fun haScore(block: () -> Int?) { bHaScore = block() }
		private var bHaConfigured: Boolean? = null; fun haConfigured(block: () -> Boolean?) { bHaConfigured = block() }
		private var bHaActive: Boolean? = null; fun haActive(block: () -> Boolean?) { bHaActive = block() }
		private var bHaGlobalMaintenance: Boolean? = null; fun haGlobalMaintenance(block: () -> Boolean?) { bHaGlobalMaintenance = block() }
		private var bHaLocalMaintenance: Boolean? = null; fun haLocalMaintenance(block: () -> Boolean?) { bHaLocalMaintenance = block() }
		private var bDisableAutoPm: Boolean? = null; fun disableAutoPm(block: () -> Boolean?) { bDisableAutoPm = block() }
		private var bControlledByPmPolicy: Boolean? = null; fun controlledByPmPolicy(block: () -> Boolean?) { bControlledByPmPolicy = block() }
		private var bBootTime: Long? = null; fun bootTime(block: () -> Long?) { bBootTime = block() }
		private var bKdumpStatus: Int? = null; fun kdumpStatus(block: () -> Int?) { bKdumpStatus = block() }
		private var bSelinuxEnforceMode: Int? = null; fun selinuxEnforceMode(block: () -> Int?) { bSelinuxEnforceMode = block() }
		private var bAutoNumaBalancing: Int? = null; fun autoNumaBalancing(block: () -> Int?) { bAutoNumaBalancing = block() }
		private var bIsNumaSupported: Boolean? = null; fun isNumaSupported(block: () -> Boolean?) { bIsNumaSupported = block() }
		private var bOnlineCpus: String? = null; fun onlineCpus(block: () -> String?) { bOnlineCpus = block() }
		private var bMaintenanceReason: String? = null; fun maintenanceReason(block: () -> String?) { bMaintenanceReason = block() }
		private var bIsUpdateAvailable: Boolean? = null; fun isUpdateAvailable(block: () -> Boolean?) { bIsUpdateAvailable = block() }
		private var bIsHostdevEnabled: Boolean? = null; fun isHostdevEnabled(block: () -> Boolean?) { bIsHostdevEnabled = block() }
		private var bIsHostedEngineHost: Boolean? = null; fun isHostedEngineHost(block: () -> Boolean?) { bIsHostedEngineHost = block() }
		private var bKernelCmdline: String? = null; fun kernelCmdline(block: () -> String?) { bKernelCmdline = block() }
		private var bLastStoredKernelCmdline: String? = null; fun lastStoredKernelCmdline(block: () -> String?) { bLastStoredKernelCmdline = block() }
		private var bFencingEnabled: Boolean? = null; fun fencingEnabled(block: () -> Boolean?) { bFencingEnabled = block() }
		private var bGlusterPeerStatus: String? = null; fun glusterPeerStatus(block: () -> String?) { bGlusterPeerStatus = block() }
		private var bInFenceFlow: Boolean? = null; fun inFenceFlow(block: () -> Boolean?) { bInFenceFlow = block() }
		private var bReinstallRequired: Boolean? = null; fun reinstallRequired(block: () -> Boolean?) { bReinstallRequired = block() }
		private var bKernelFeatures: String? = null; fun kernelFeatures(block: () -> String?) { bKernelFeatures = block() }
		private var bVncEncryptionEnabled: Boolean? = null; fun vncEncryptionEnabled(block: () -> Boolean?) { bVncEncryptionEnabled = block() }
		private var bVgpuPlacement: Int? = null; fun vgpuPlacement(block: () -> Int?) { bVgpuPlacement = block() }
		private var bConnectorInfo: String? = null; fun connectorInfo(block: () -> String?) { bConnectorInfo = block() }
		private var bBackupEnabled: Boolean? = null; fun backupEnabled(block: () -> Boolean?) { bBackupEnabled = block() }
		private var bColdBackupEnabled: Boolean? = null; fun coldBackupEnabled(block: () -> Boolean?) { bColdBackupEnabled = block() }
		private var bClearBitmapsEnabled: Boolean? = null; fun clearBitmapsEnabled(block: () -> Boolean?) { bClearBitmapsEnabled = block() }
		private var bSupportedDomainVersions: String? = null; fun supportedDomainVersions(block: () -> String?) { bSupportedDomainVersions = block() }
		private var bSupportedBlockSize: String? = null; fun supportedBlockSize(block: () -> String?) { bSupportedBlockSize = block() }
		private var bClusterSmtDisabled: Boolean? = null; fun clusterSmtDisabled(block: () -> Boolean?) { bClusterSmtDisabled = block() }
		private var bTscFrequency: String? = null; fun tscFrequency(block: () -> String?) { bTscFrequency = block() }
		private var bTscScaling: Boolean? = null; fun tscScaling(block: () -> Boolean?) { bTscScaling = block() }
		private var bFipsEnabled: Boolean? = null; fun fipsEnabled(block: () -> Boolean?) { bFipsEnabled = block() }
		private var bBootUuid: String? = null; fun bootUuid(block: () -> String?) { bBootUuid = block() }
		private var bCdChangePdiv: String? = null; fun cdChangePdiv(block: () -> String?) { bCdChangePdiv = block() }
		private var bOvnConfigured: Boolean? = null; fun ovnConfigured(block: () -> Boolean?) { bOvnConfigured = block() }
		private var bSshPublicKey: String? = null; fun sshPublicKey(block: () -> String?) { bSshPublicKey = block() }
		private var bCpuTopology: String? = null; fun cpuTopology(block: () -> String?) { bCpuTopology = block() }
		private var bVdsmCpusAffinity: String? = null; fun vdsmCpusAffinity(block: () -> String?) { bVdsmCpusAffinity = block() }
		private var bStoragePool: StoragePoolEntity? = null; fun storagePool(block: () -> StoragePoolEntity?) { bStoragePool = block() }
		private var bCluster: ClusterViewEntity? = null; fun cluster(block: () -> ClusterViewEntity?) { bCluster = block() }

		fun build(): VdsEntity = VdsEntity(bVdsId, bVdsName, bVdsUniqueId, bHostName, bFreeTextComment, bPort, bServerSslEnabled, bVdsType, bPmEnabled, bPmProxyPreferences, bPmDetectKdump, bVdsSpmPriority, bHooks, bStatus, bExternalStatus, bCpuCores, bCpuThreads, bCpuModel, bCpuSpeedMh, bIfTotalSpeed, bKvmEnabled, bPhysicalMemMb, bPendingVcpusCount, bPendingVmemSize, bMemCommited, bVmActive, bVmCount, bVmMigrating, bIncomingMigrations, bOutgoingMigrations, bKernelArgs, bPrettyName, bHostedEngineConfigured, bVmsCoresCount, bCpuOverCommitTimeStamp, bNetConfigDirty,  bReservedMem, bGuestOverhead, bRpmVersion, bSoftwareVersion, bVersionName, bBuildName, bPreviousStatus, bCpuIdle, bCpuLoad, bCpuSys, bCpuUser, bUsageMemPercent, bUsageCpuPercent, bUsageNetworkPercent, bMemFree, bMemShared, bSwapFree, bSwapTotal, bKsmCpuPercent, bKsmPages, bKsmState, bCpuFlags, bCpuSockets, bVdsSpmId, bOtpValidity, bSpmStatus, bSupportedClusterLevels, bSupportedEngines, bHostOs, bKvmVersion, bLibvirtVersion, bSpiceVersion, bGlusterVersion, bLibrbd1Version, bGlusterfsCliVersion, bOpenvswitchVersion, bNmstateVersion, bKernelVersion, bIscsiInitiatorName, bTransparentHugepagesState, bAnonymousHugepages, bHugepages, bNonOperationalReason, bRecoverable, bSshkeyfingerprint, bHostProviderId, bHwManufacturer, bHwProductName, bHwVersion, bHwSerialNumber, bHwUuid, bHwFamily, bConsoleAddress, bHbas, bSupportedEmulatedMachines, bSupportedRngSources, bSshPort, bSshUsername, bHaScore, bHaConfigured, bHaActive, bHaGlobalMaintenance, bHaLocalMaintenance, bDisableAutoPm, bControlledByPmPolicy, bBootTime, bKdumpStatus, bSelinuxEnforceMode, bAutoNumaBalancing, bIsNumaSupported, bOnlineCpus, bMaintenanceReason, bIsUpdateAvailable, bIsHostdevEnabled, bIsHostedEngineHost, bKernelCmdline, bLastStoredKernelCmdline, bFencingEnabled, bGlusterPeerStatus, bInFenceFlow, bReinstallRequired, bKernelFeatures, bVncEncryptionEnabled, bVgpuPlacement, bConnectorInfo, bBackupEnabled, bColdBackupEnabled, bClearBitmapsEnabled, bSupportedDomainVersions, bSupportedBlockSize, bClusterSmtDisabled, bTscFrequency, bTscScaling, bFipsEnabled, bBootUuid, bCdChangePdiv, bOvnConfigured, bSshPublicKey, bCpuTopology, bVdsmCpusAffinity, bStoragePool, bCluster)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): VdsEntity = Builder().apply(block).build()
	}
}
