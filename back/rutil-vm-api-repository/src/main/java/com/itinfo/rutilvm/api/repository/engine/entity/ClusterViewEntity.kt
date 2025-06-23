package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.api.ovirt.business.ArchitectureType
import com.itinfo.rutilvm.api.ovirt.business.BiosTypeB
import com.itinfo.rutilvm.api.ovirt.business.DiskContentType
import com.itinfo.rutilvm.api.ovirt.business.DiskStorageType
import com.itinfo.rutilvm.api.ovirt.business.FipsModeB
import com.itinfo.rutilvm.api.ovirt.business.FirewallTypeB
import com.itinfo.rutilvm.api.ovirt.business.LogMaxMemoryUsedThresholdTypeB
import com.itinfo.rutilvm.api.ovirt.business.MigrateOnErrorB
import com.itinfo.rutilvm.api.ovirt.business.MigrationBandwidthLimitType
import com.itinfo.rutilvm.api.ovirt.business.SwitchTypeB
import com.itinfo.rutilvm.common.gson
import org.hibernate.annotations.Immutable
import org.hibernate.annotations.Type
import java.time.LocalDateTime
import java.util.UUID
import java.io.Serializable
import java.math.BigDecimal
import java.math.BigInteger
import javax.persistence.Id
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.OneToMany
import javax.persistence.Table

/**
 * [ClusterViewEntity]
 * 클러스터 정보
 *
 * @property logMaxMemoryUsedThreshold [Int] 클러스터 로그의 최대 메모리 한계
 * @property logMaxMemoryUsedThresholdType [LogMaxMemoryUsedThresholdTypeB] 클러스터 로그 최대 메모리 한계 설정 유형 코드
 * @property isAutoConverge [Boolean] 마이그레이션 정책 > 자동 병합 여부
 * @property migrationBandwidthLimitType [MigrationBandwidthLimitType] 클러스터 마이그레이션 대역폭 제한 유형
 * @property customMigrationBandwidthLimit [Int] 마이그레이션 대역폭 제한 수치
 * @property isMigrateEncrypted [Boolean] 마이그레이션 추가속성- 암호화 사용
 *
 */
@Entity
@Immutable
@Table(name = "cluster_view")
class ClusterViewEntity(
	@Id
	@Column(name="cluster_id", nullable=false, unique=true)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val clusterId: UUID? = null,
	val name: String? = "",
	val description: String? = "",
	val cpuName: String? = "",
	@Column(name="_create_date")
	val createDate: LocalDateTime? = null,
	@Column(name="_update_date")
	val updateDate: LocalDateTime? = null,
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(
		name="storage_pool_id",
		referencedColumnName="id",
		insertable=false,
		updatable=false
	)
	val storagePool: StoragePoolEntity? = null,
	val maxVdsMemoryOverCommit: Int? = 0,
	val compatibilityVersion: String? = "",
	val transparentHugepages: Boolean? = false,
	@Column(name="migrate_on_error")
	private val _migrateOnError: Int? = -1,
	val virtService: Boolean? = false,
	val glusterService: Boolean? = false,
	val countThreadsAsCores: Boolean? = false,
	val emulatedMachine: String? = "",
	val trustedService: Boolean? = false,
	val tunnelMigration: Boolean? = false,
	@Column(name="cluster_policy_id")
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val clusterPolicyId: UUID? = null,
	val clusterPolicyName: String? = null,
	val clusterPolicyCustomProperties: String? = "",
	val enableBalloon: Boolean? = false,
	val freeTextComment: String? = "",
	val detectEmulatedMachine: Boolean? = false,
	@Column(name="architecture")
	private val _architecture: Int? = 0,
	@Column(name="optimization_type")
	private val _optimizationType: Int? = 0,
	val spiceProxy: String? = "",
	val haReservation: Boolean? = false,
	val enableKsm: Boolean? = false,
	val serialNumberPolicy: Int? = null,
	val customSerialNumber: String? = "",
	val additionalRngSources: String? = "",
	val skipFencingIfSdActive: Boolean? = false,
	val skipFencingIfConnectivityBroken: Boolean? = false,
	val hostsWithBrokenConnectivityThreshold: Int? = 0,
	val fencingEnabled: Boolean? = false,
	val isAutoConverge: Boolean? = null,
	val isMigrateCompressed: Boolean? = null,
	val glusterTunedProfile: String? = "",
	val glusterCliBasedSnapshotScheduled: Boolean? = false,
	val ksmMergeAcrossNodes: Boolean? = false,
	@Column(name = "migration_bandwidth_limit_type")
	private val _migrationBandwidthLimitType: String? = "",
	val customMigrationBandwidthLimit: Int? = 0,
	@Column(name = "migration_policy_id")
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val migrationPolicyId: UUID? = null,

	@Column(name = "mac_pool_id")
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val macPoolId: UUID? = null,
	@Column(name = "switch_type")
	private val _switchType: String? = "legacy",

	val skipFencingIfGlusterBricksUp: Boolean? = false,
	val skipFencingIfGlusterQuorumNotMet: Boolean? = false,
	@Column(name="firewall_type")
	private val _firewallType: Int? = -1,

	@Column(name = "default_network_provider_id")
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val defaultNetworkProviderId: UUID? = null,
	val logMaxMemoryUsedThreshold: Int? = null,
	@Column(name="log_max_memory_used_threshold_type")
	private val _logMaxMemoryUsedThresholdType: Int? = 0,
	val vncEncryptionEnabled: Boolean? = false,
	val upgradeRunning: Boolean? = false,
	val smtDisabled: Boolean? = false,

	@Column(name="bios_type", nullable=false)
	private val _biosType: Int? = null,

	val cpuFlags: String? = "",
	val cpuVerb: String? = "",
	val isMigrateEncrypted: Boolean? = false,
	val managed: Boolean? = false,
	@Column(name="fips_mode", nullable=false)
	private val _fipsMode: Int? = 0,
	val parallelMigrations: Int? = 0,
	val upgradePercentComplete: Int? = 0,
	val upgradeCorrelationId: String? = "",

	@OneToMany(fetch=FetchType.LAZY)
	@JoinColumn(
		name="cluster_id",
		referencedColumnName="cluster_id",
		insertable=false,
		updatable=false
	)
	val hosts: Set<VdsEntity>? = emptySet(),
	@OneToMany(fetch = FetchType.LAZY)
	@JoinColumn(
		name="cluster_id",
		referencedColumnName="cluster_id",
		insertable=false,
		updatable=false
	)
	val vms: Set<VmEntity>? = emptySet(),
) : Serializable {
	val architecture: ArchitectureType? 	get() = ArchitectureType.forValue(_architecture)
	val biosType: BiosTypeB?				get() = BiosTypeB.forValue(_biosType)
	val migrateOnError: MigrateOnErrorB	get() = MigrateOnErrorB.forValue(_migrateOnError)
	val fipsMode: FipsModeB				get() = FipsModeB.forValue(_fipsMode)
	val firewallType: FirewallTypeB		get() = FirewallTypeB.forValue(_firewallType)
	val logMaxMemoryUsedThresholdType: LogMaxMemoryUsedThresholdTypeB get() = LogMaxMemoryUsedThresholdTypeB.forValue(_logMaxMemoryUsedThresholdType)
	val migrationBandwidthLimitType: MigrationBandwidthLimitType get() = MigrationBandwidthLimitType.forCode(_migrationBandwidthLimitType)
	val switchType: SwitchTypeB			get() = SwitchTypeB.forCode(_switchType)

	override fun toString(): String =
		gson.toJson(this@ClusterViewEntity)

	class Builder {
		private var bClusterId: UUID? = null;fun clusterId(block: () -> UUID?) { bClusterId = block() }
		private var bName: String? = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bDescription: String? = "";fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bCpuName: String? = "";fun cpuName(block: () -> String?) { bCpuName = block() ?: "" }
		private var bCreateDate: LocalDateTime? = null;fun createDate(block: () -> LocalDateTime?) { bCreateDate = block() }
		private var bUpdateDate: LocalDateTime? = null;fun updateDate(block: () -> LocalDateTime?) { bUpdateDate = block() }
		private var bStoragePool: StoragePoolEntity? = null;fun storagePool(block: () -> StoragePoolEntity?) { bStoragePool = block() }
		private var bMaxVdsMemoryOverCommit: Int? = null;fun maxVdsMemoryOverCommit(block: () -> Int?) { bMaxVdsMemoryOverCommit = block() }
		private var bCompatibilityVersion: String? = "";fun compatibilityVersion(block: () -> String?) { bCompatibilityVersion = block() }
		private var bTransparentHugepages: Boolean? = null;fun transparentHugepages(block: () -> Boolean?) { bTransparentHugepages = block() }
		private var bMigrateOnError: Int? = null;fun migrateOnError(block: () -> Int?) { bMigrateOnError = block() }
		private var bVirtService: Boolean? = null;fun virtService(block: () -> Boolean?) { bVirtService = block() }
		private var bGlusterService: Boolean? = null;fun glusterService(block: () -> Boolean?) { bGlusterService = block() }
		private var bCountThreadsAsCores: Boolean? = null;fun countThreadsAsCores(block: () -> Boolean?) { bCountThreadsAsCores = block() }
		private var bEmulatedMachine: String? = "";fun emulatedMachine(block: () -> String?) { bEmulatedMachine = block() }
		private var bTrustedService: Boolean? = null;fun trustedService(block: () -> Boolean?) { bTrustedService = block() }
		private var bTunnelMigration: Boolean? = null;fun tunnelMigration(block: () -> Boolean?) { bTunnelMigration = block() }
		private var bClusterPolicyId: UUID? = null;fun clusterPolicyId(block: () -> UUID?) { bClusterPolicyId = block() }
		private var bClusterPolicyName: String? = "";fun clusterPolicyName(block: () -> String?) { bClusterPolicyName = block() }
		private var bClusterPolicyCustomProperties: String? = "";fun clusterPolicyCustomProperties(block: () -> String?) { bClusterPolicyCustomProperties = block() }
		private var bEnableBalloon: Boolean? = null;fun enableBalloon(block: () -> Boolean?) { bEnableBalloon = block() }
		private var bFreeTextComment: String? = "";fun freeTextComment(block: () -> String?) { bFreeTextComment = block() }
		private var bDetectEmulatedMachine: Boolean? = null;fun detectEmulatedMachine(block: () -> Boolean?) { bDetectEmulatedMachine = block() }
		private var bArchitecture: Int? = null;fun architecture(block: () -> Int?) { bArchitecture = block() }
		private var bOptimizationType: Int? = null;fun optimizationType(block: () -> Int?) { bOptimizationType = block() }
		private var bSpiceProxy: String? = "";fun spiceProxy(block: () -> String?) { bSpiceProxy = block() }
		private var bHaReservation: Boolean? = null;fun haReservation(block: () -> Boolean?) { bHaReservation = block() }
		private var bEnableKsm: Boolean? = null;fun enableKsm(block: () -> Boolean?) { bEnableKsm = block() }
		private var bSerialNumberPolicy: Int? = null;fun serialNumberPolicy(block: () -> Int?) { bSerialNumberPolicy = block() }
		private var bCustomSerialNumber: String? = "";fun customSerialNumber(block: () -> String?) { bCustomSerialNumber = block() }
		private var bAdditionalRngSources: String? = "";fun additionalRngSources(block: () -> String?) { bAdditionalRngSources = block() }
		private var bSkipFencingIfSdActive: Boolean? = null;fun skipFencingIfSdActive(block: () -> Boolean?) { bSkipFencingIfSdActive = block() }
		private var bSkipFencingIfConnectivityBroken: Boolean? = null;fun skipFencingIfConnectivityBroken(block: () -> Boolean?) { bSkipFencingIfConnectivityBroken = block() }
		private var bHostsWithBrokenConnectivityThreshold: Int? = null;fun hostsWithBrokenConnectivityThreshold(block: () -> Int?) { bHostsWithBrokenConnectivityThreshold = block() }
		private var bFencingEnabled: Boolean? = null;fun fencingEnabled(block: () -> Boolean?) { bFencingEnabled = block() }
		private var bIsAutoConverge: Boolean? = null;fun isAutoConverge(block: () -> Boolean?) { bIsAutoConverge = block() }
		private var bIsMigrateCompressed: Boolean? = null;fun isMigrateCompressed(block: () -> Boolean?) { bIsMigrateCompressed = block() }
		private var bGlusterTunedProfile: String? = "";fun glusterTunedProfile(block: () -> String?) { bGlusterTunedProfile = block() }
		private var bGlusterCliBasedSnapshotScheduled: Boolean? = null;fun glusterCliBasedSnapshotScheduled(block: () -> Boolean?) { bGlusterCliBasedSnapshotScheduled = block() }
		private var bKsmMergeAcrossNodes: Boolean? = null;fun ksmMergeAcrossNodes(block: () -> Boolean?) { bKsmMergeAcrossNodes = block() }
		private var bMigrationBandwidthLimitType: String? = "";fun migrationBandwidthLimitType(block: () -> String?) { bMigrationBandwidthLimitType = block() }
		private var bCustomMigrationBandwidthLimit: Int? = null;fun customMigrationBandwidthLimit(block: () -> Int?) { bCustomMigrationBandwidthLimit = block() }
		private var bMigrationPolicyId: UUID? = null;fun migrationPolicyId(block: () -> UUID?) { bMigrationPolicyId = block() }
		private var bMacPoolId: UUID? = null;fun macPoolId(block: () -> UUID?) { bMacPoolId = block() }
		private var bSwitchType: String? = "";fun switchType(block: () -> String?) { bSwitchType = block() }
		private var bSkipFencingIfGlusterBricksUp: Boolean? = null;fun skipFencingIfGlusterBricksUp(block: () -> Boolean?) { bSkipFencingIfGlusterBricksUp = block() }
		private var bSkipFencingIfGlusterQuorumNotMet: Boolean? = null;fun skipFencingIfGlusterQuorumNotMet(block: () -> Boolean?) { bSkipFencingIfGlusterQuorumNotMet = block() }
		private var bFirewallType: Int? = 1;fun firewallType(block: () -> Int?) { bFirewallType = block() ?: 1 }
		private var bDefaultNetworkProviderId: UUID? = null;fun defaultNetworkProviderId(block: () -> UUID?) { bDefaultNetworkProviderId = block() }
		private var bLogMaxMemoryUsedThreshold: Int? = null;fun logMaxMemoryUsedThreshold(block: () -> Int?) { bLogMaxMemoryUsedThreshold = block() }
		private var bLogMaxMemoryUsedThresholdType: Int? = 0;fun logMaxMemoryUsedThresholdType(block: () -> Int?) { bLogMaxMemoryUsedThresholdType = block() ?: 0 }
		private var bVncEncryptionEnabled: Boolean? = null;fun vncEncryptionEnabled(block: () -> Boolean?) { bVncEncryptionEnabled = block() }
		private var bUpgradeRunning: Boolean? = null;fun upgradeRunning(block: () -> Boolean?) { bUpgradeRunning = block() }
		private var bSmtDisabled: Boolean? = null;fun smtDisabled(block: () -> Boolean?) { bSmtDisabled = block() }
		private var bBiosType: Int? = null;fun biosType(block: () -> Int?) { bBiosType = block() }
		private var bCpuFlags: String? = "";fun cpuFlags(block: () -> String?) { bCpuFlags = block() }
		private var bCpuVerb: String? = "";fun cpuVerb(block: () -> String?) { bCpuVerb = block() }
		private var bIsMigrateEncrypted: Boolean? = null;fun isMigrateEncrypted(block: () -> Boolean?) { bIsMigrateEncrypted = block() }
		private var bManaged: Boolean? = null;fun managed(block: () -> Boolean?) { bManaged = block() }
		private var bFipsMode: Int? = null;fun fipsMode(block: () -> Int?) { bFipsMode = block() }
		private var bParallelMigrations: Int? = null;fun parallelMigrations(block: () -> Int?) { bParallelMigrations = block() }
		private var bUpgradePercentComplete: Int? = null;fun upgradePercentComplete(block: () -> Int?) { bUpgradePercentComplete = block() }
		private var bUpgradeCorrelationId: String? = "";fun upgradeCorrelationId(block: () -> String?) { bUpgradeCorrelationId = block() }
		private var bHosts: Set<VdsEntity>? = emptySet(); fun hosts(block: () -> Set<VdsEntity>??) { bHosts = block() ?: emptySet() }

		fun build(): ClusterViewEntity = ClusterViewEntity(bClusterId, bName, bDescription, bCpuName, bCreateDate, bUpdateDate, bStoragePool, bMaxVdsMemoryOverCommit, bCompatibilityVersion, bTransparentHugepages, bMigrateOnError, bVirtService, bGlusterService, bCountThreadsAsCores, bEmulatedMachine, bTrustedService, bTunnelMigration, bClusterPolicyId, bClusterPolicyName, bClusterPolicyCustomProperties, bEnableBalloon, bFreeTextComment, bDetectEmulatedMachine, bArchitecture, bOptimizationType, bSpiceProxy, bHaReservation, bEnableKsm, bSerialNumberPolicy, bCustomSerialNumber, bAdditionalRngSources, bSkipFencingIfSdActive, bSkipFencingIfConnectivityBroken, bHostsWithBrokenConnectivityThreshold, bFencingEnabled, bIsAutoConverge, bIsMigrateCompressed, bGlusterTunedProfile, bGlusterCliBasedSnapshotScheduled, bKsmMergeAcrossNodes, bMigrationBandwidthLimitType, bCustomMigrationBandwidthLimit, bMigrationPolicyId, bMacPoolId, bSwitchType, bSkipFencingIfGlusterBricksUp, bSkipFencingIfGlusterQuorumNotMet, bFirewallType, bDefaultNetworkProviderId, bLogMaxMemoryUsedThreshold, bLogMaxMemoryUsedThresholdType, bVncEncryptionEnabled, bUpgradeRunning, bSmtDisabled, bBiosType, bCpuFlags, bCpuVerb, bIsMigrateEncrypted, bManaged, bFipsMode, bParallelMigrations, bUpgradePercentComplete, bUpgradeCorrelationId, bHosts)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): ClusterViewEntity = Builder().apply(block).build()
	}
}
