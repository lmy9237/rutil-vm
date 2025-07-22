package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.api.ovirt.business.BiosTypeB
import com.itinfo.rutilvm.api.ovirt.business.DisplayTypeB
import com.itinfo.rutilvm.api.ovirt.business.OriginType
import com.itinfo.rutilvm.api.ovirt.business.VmOsType
import com.itinfo.rutilvm.api.ovirt.business.VmTypeB
import com.itinfo.rutilvm.common.gson
import org.hibernate.annotations.Type
import org.slf4j.LoggerFactory
import java.time.LocalDateTime
import java.util.UUID
import java.io.Serializable
import java.math.BigInteger
// Or jakarta.persistence.* for newer Spring Boot
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.Table

/**
 * [VmStaticEntity]
 * 가상머신 기본정보
 *
 * @property vmGuid [UUID] 가상머신 ID
 * @property vmName [String] 가상머신 이름
 * @property _vmType [Int] 가상머신 유형
 * @property _defaultDisplayType [Int] 디스플레이 유형 [DisplayTypeB]
 */

/**
 * Maps to the `vm_static` table, containing the static, persistent
 * configuration of a Virtual Machine or a Template.
 */
@Entity
@Table(name = "vm_static")
class VmStaticEntity(

	@Id
	@Column(name="vm_guid") // Explicit @Column needed for PK
	val vmGuid: UUID? = null,
	val vmName: String? = "",
	val description: String? = "",
	@Column(name="vm_type", nullable=false)
	private val _vmType: Int? = -1,
	val entityType: String = DEFAULT_ENTITY_TYPE, // VM, TEMPLATE
	@Column(name="origin", nullable=false)
	private val _origin: Int? = null,
	// val vmtGuid: UUID? = null,
	val isTemplateSealed: Boolean = false,
	val originalTemplateId: UUID? = null,
	val originalTemplateName: String? = "",
	val templateVersionName: String? = "",
	val templateVersionNumber: Int? = 0,

	// --- OS & Hardware Configuration ---
	val memSizeMb: BigInteger? = BigInteger.ZERO,
	val minAllocatedMem: BigInteger? = BigInteger.ZERO,
	val maxMemorySizeMb: BigInteger? = BigInteger.ZERO,
	@Column(name="bios_type", nullable=true)
	private val _biosType: Int? = -1,
	val numOfMonitors: Int? = 1,
	val numOfSockets: Int? = 1,
	val cpuPerSocket: Int? = 1,
	val threadsPerCpu: Int? = 1,
	val numOfIoThreads: Int? = 0,
	val useTscFrequency: Boolean = false,
	val balloonEnabled: Boolean = false,

	// --- Boot & Initialization ---
	val isInitialized: Boolean? = false,
	val defaultBootSequence: Int = 0,
	val isBootMenuEnabled: Boolean = false,
	val isoPath: String? = null,
	val initrdUrl: String? = null,
	val kernelUrl: String? = null,
	val kernelParams: String? = null,

	// --- High Availability & Migration ---
	val autoStartup: Boolean? = true,
	val priority: Int? = 0,
	val migrationSupport: Int? = 0,
	val migrationDowntime: Int? = 0,
	val isAutoConverge: Boolean? = false,
	val isMigrateCompressed: Boolean? = false,
	val isMigrateEncrypted: Boolean? = false,
	val tunnelMigration: Boolean? = false,
	val resumeBehavior: String? = "AUTO_RESUME",
	val parallelMigrations: Short? = 0,

	// --- Properties & Behavior ---
	val timeZone: String? = "",
	val isStateless: Boolean? = false,
	val isRunAndPause: Boolean? = false,
	val isDeleteProtected: Boolean? = false,
	val isSmartcardEnabled: Boolean? = false,
	val ssoMethod: String? = "guest_agent",
	val isSpiceFileTransferEnabled: Boolean? = true,
	val isSpiceCopyPasteEnabled: Boolean? = true,
	val allowConsoleReconnect: Boolean? = false,
	val vncKeyboardLayout: String? = null,
	val consoleDisconnectAction: String? = null,
	val consoleDisconnectActionDelay: Int? = 0,
	@Column(name="default_display_type")
	private var _defaultDisplayType: Int? = 0,
	val userdefinedProperties: String? = "",
	val predefinedProperties: String? = "",
	val freeTextComment: String = "",

	// --- CPU & NUMA Pinning ---
	val niceLevel: Int = 0,
	val cpuShares: Int = 0,
	val cpuPinning: String? = null,
	val hostCpuFlags: Boolean = false,
	val customEmulatedMachine: String? = "",
	val customCpuName: String? = "",
	val customCompatibilityVersion: String? = "",
	val cpuPinningPolicy: Short? = 0,

	// --- Serial Number ---
	val serialNumberPolicy: Short? = 0,
	val customSerialNumber: String? = "",

	// --- USB Policy ---
	val usbPolicy: Int?,

	// --- Misc ---
	val virtioScsiMultiQueues: Int = 0,
	val multiQueuesEnabled: Boolean = true,
	val namespace: String? = "",

	// --- Timestamps & Metadata ---
	val creationDate: LocalDateTime? = null,
	@Column(name="_create_date")
	val createDate: LocalDateTime? = null,
	@Column(name="_update_date")
	val updateDate: LocalDateTime? = null,
	val dbGeneration: Long? = 1L,
	val createdByUserId: UUID? = null,

	// --- Relationships ---
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(
		name="os",
		referencedColumnName="os_id",
		insertable=false,
		updatable=false
	)
	val dwhOsInfo: DwhOsinfoEntity? = null,

	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="cluster_id")
	val cluster: ClusterViewEntity? = null,

	/*
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="quota_id")
	val quota: QuotaEntity? = null,
	*/

	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="instance_type_id")
	val instanceType: VmStaticEntity? = null, // Self-referencing FK

	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="image_type_id")
	val imageType: VmStaticEntity? = null, // Self-referencing FK

	/*
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="cpu_profile_id")
	val cpuProfile: CpuProfileEntity? = null,

	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="migration_policy_id")
	val migrationPolicy: MigrationPolicyEntity? = null,
	*/

	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="small_icon_id")
	val smallIcon: VmIconEntity? = null,

	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="large_icon_id")
	val largeIcon: VmIconEntity? = null,

	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="provider_id")
	val provider: ProvidersEntity? = null,

	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="lease_sd_id")
	val leaseStorageDomain: StorageDomainStaticEntity? = null,

	// This is a self-referencing link for the template a VM is based on.
	// The DDL links vmt_guid -> vm_guid, so it's a link to another record
	// in this same table.
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="vmt_guid", referencedColumnName = "vm_guid", insertable = false, updatable = false)
	val template: VmStaticEntity? = null

) : Serializable {
	var defaultDisplayType: DisplayTypeB?			get() = DisplayTypeB.forValue(_defaultDisplayType)
														set(newVal) {
															_defaultDisplayType = newVal?.value
														}
	val vmType: VmTypeB?							get() = VmTypeB.forValue(_vmType) /* a.k.a. 최적화 옵션 (optmizationOption) */
	val originType: OriginType?					get() = OriginType.forValue(_origin)
	val origin: Int?								get() = originType?.value
	val biosType: BiosTypeB						get() = BiosTypeB.forValue(_biosType)
	val osType: VmOsType?							get() = dwhOsInfo?.toVmOsType()

	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bVmGuid: UUID? = null;fun vmGuid(block: () -> UUID?) { bVmGuid = block() }
		private var bVmName: String? = "";fun vmName(block: () -> String?) { bVmName = block() ?: "" }
		private var bDescription: String? = "";fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bVmType: Int? = -1;fun vmType(block: () -> Int?) { bVmType = block() ?: -1 }
		private var bEntityType: String = DEFAULT_ENTITY_TYPE;fun entityType(block: () -> String?) { bEntityType = block() ?: DEFAULT_ENTITY_TYPE }
		private var bOrigin: Int? = null;fun origin(block: () -> Int?) { bOrigin = block()  }
		private var bVmtGuid: UUID? = null;fun vmtGuid(block: () -> UUID?) { bVmtGuid = block() }
		private var bIsTemplateSealed: Boolean = false;fun isTemplateSealed(block: () -> Boolean?) { bIsTemplateSealed = block() ?: false }
		private var bOriginalTemplateId: UUID? = null;fun originalTemplateId(block: () -> UUID?) { bOriginalTemplateId = block() }
		private var bOriginalTemplateName: String? = "";fun originalTemplateName(block: () -> String?) { bOriginalTemplateName = block() ?: "" }
		private var bTemplateVersionName: String? = "";fun templateVersionName(block: () -> String?) { bTemplateVersionName = block() ?: "" }
		private var bTemplateVersionNumber: Int? = 0;fun templateVersionNumber(block: () -> Int?) { bTemplateVersionNumber = block() ?: 0 }
		private var bMemSizeMb: BigInteger? = BigInteger.ZERO;fun memSizeMb(block: () -> BigInteger?) { bMemSizeMb = block() ?: BigInteger.ZERO }
		private var bMinAllocatedMem: BigInteger? = BigInteger.ZERO;fun minAllocatedMem(block: () -> BigInteger?) { bMinAllocatedMem = block() ?: BigInteger.ZERO }
		private var bMaxMemorySizeMb: BigInteger? = BigInteger.ZERO;fun maxMemorySizeMb(block: () -> BigInteger?) { bMaxMemorySizeMb = block() ?: BigInteger.ZERO }
		private var bBiosType: Int? = -1;fun biosType(block: () -> Int?) { bBiosType = block() ?: -1 }
		private var bNumOfMonitors: Int? = 1;fun numOfMonitors(block: () -> Int?) { bNumOfMonitors = block() ?: 1 }
		private var bNumOfSockets: Int? = 1;fun numOfSockets(block: () -> Int?) { bNumOfSockets = block() ?: 1 }
		private var bCpuPerSocket: Int? = 1;fun cpuPerSocket(block: () -> Int?) { bCpuPerSocket = block() ?: 1 }
		private var bThreadsPerCpu: Int? = 1;fun threadsPerCpu(block: () -> Int?) { bThreadsPerCpu = block() ?: 1 }
		private var bNumOfIoThreads: Int? = 0;fun numOfIoThreads(block: () -> Int?) { bNumOfIoThreads = block() ?: 0 }
		private var bUseTscFrequency: Boolean? = false;fun useTscFrequency(block: () -> Boolean?) { bUseTscFrequency = block() ?: false }
		private var bBalloonEnabled: Boolean? = false;fun balloonEnabled(block: () -> Boolean?) { bBalloonEnabled = block() ?: false }
		private var bDefaultDisplayType: Int = -1; fun defaultDisplayType(block: () -> Int?) { bDefaultDisplayType = block() ?: -1 }
		// fun build(): VmStaticEntity = VmStaticEntity(bVmGuid, bVmName, bDescription, bVmType, bEntityType, bOrigin, bVmtGuid, bIsTemplateSealed, bOriginalTemplateId, bOriginalTemplateName, bTemplateVersionName, bTemplateVersionNumber, bMemSizeMb, bMinAllocatedMem, bMaxMemorySizeMb, bBiosType, bNumOfMonitors, bNumOfSockets, bCpuPerSocket, bThreadsPerCpu, bNumOfIoThreads, bUseTscFrequency, bBalloonEnabled, bDefaultDisplayType, bDefaultDisplayType)
	}

	companion object {
		const val DEFAULT_ENTITY_TYPE = "INSTANCE_TYPE"
		// inline fun builder(block: Builder.() -> Unit): VmStaticEntity = Builder().apply(block).build()
	}
}
