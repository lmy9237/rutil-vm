package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.api.ovirt.business.DiskContentType
import com.itinfo.rutilvm.api.ovirt.business.DiskStorageType
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
import javax.persistence.Table

/**
 *
 * [AllDiskEntity]
 * 디스크 기본정보
 *
 * @property diskId [UUID]
 * @property storageId [String]
 * @property storageName [String]
 * @property storageType [String]
 * @property storagePoolId [UUID]
 * @property imageGuid [UUID]
 * @property creationDate [LocalDateTime]
 * @property actualSize [BigInteger]
 * @property readRate [BigInteger]
 * @property readOps [BigInteger]
 * @property writeRate [BigInteger]
 * @property writeOps [BigInteger]
 * @property readLatencySeconds [BigDecimal]
 * @property writeLatencySeconds [BigDecimal]
 * @property flushLatencySeconds [BigDecimal]
 * @property size [BigInteger]
 * @property itGuid [UUID]
 * @property imagestatus [Int]
 * @property lastmodified [LocalDateTime]
 * @property volumeType [Int]
 * @property volumeFormat [Int]
 * @property qcowCompat [Int]
 * @property imageGroupId [UUID]
 * @property description [String]
 * @property parentid [UUID]
 * @property appList [String]
 * @property vmSnapshotId [UUID]
 * @property active [Boolean]
 * @property volumeClassification [Int]
 * @property sequenceNumber [Int]
 * @property entityType [String]
 * @property numberOfVms [Int]
 * @property vmNames [String]
 * @property templateVersionNames [String]
 * @property quotaId [String]
 * @property quotaName [String]
 * @property quotaEnforcementType [Int]
 * @property imageTransferPhase [Int]
 * @property imageTransferType [Int]
 * @property imageTransferBytesSent [BigInteger]
 * @property imageTransferBytesTotal [BigInteger]
 * @property progress [BigInteger]
 * @property diskProfileId [String]
 * @property diskProfileName [String]
 * @property lunId [String]
 * @property physicalVolumeId [String]
 * @property volumeGroupId [String]
 * @property serial [String]
 * @property lunMapping [Int]
 * @property vendorId [String]
 * @property productId [String]
 * @property deviceSize [Int]
 * @property discardMaxSize [BigInteger]
 * @property diskId [UUID]
 * @property wipeAfterDelete [Boolean]
 * @property propagateErrors [String]
 * @property diskAlias [String]
 * @property diskDescription [String]
 * @property shareable [Boolean]
 * @property sgio [Int]
 * @property diskStorageType [Int]
 * @property cinderVolumeType [String]
 * @property diskContentType [Int]
 * @property backup [String]
 * @property backupMode [String]
 */
@Entity
@Immutable
@Table(name = "all_disks")
class AllDiskEntity(
	val storageId: String = "",
	val storageName: String = "",
	val storageType: String = "",
	val storagePoolId: UUID? = null,
	val imageGuid: UUID? = null,
	val creationDate: LocalDateTime? = LocalDateTime.now(),
	val actualSize: BigInteger? = BigInteger.ZERO,
	val readRate: BigInteger? = BigInteger.ZERO,
	val readOps: BigInteger? = BigInteger.ZERO,
	val writeRate: BigInteger? = BigInteger.ZERO,
	val writeOps: BigInteger? = BigInteger.ZERO,
	val readLatencySeconds: BigDecimal? = BigDecimal.ZERO,
	val writeLatencySeconds: BigDecimal? = BigDecimal.ZERO,
	val flushLatencySeconds: BigDecimal? = BigDecimal.ZERO,
	val size: BigInteger? = BigInteger.ZERO,
	val itGuid: UUID? = null,
	val imagestatus: Int? = null,
	val lastmodified: LocalDateTime? = LocalDateTime.now(),
	val volumeType: Int? = null,
	val volumeFormat: Int? = null,
	val qcowCompat: Int? = null,
	val imageGroupId: UUID? = null,
	val description: String = "",
	val parentid: UUID? = null,
	val appList: String = "",
	val vmSnapshotId: UUID? = null,
	val active: Boolean = false,
	val volumeClassification: Int? = null,
	val sequenceNumber: Int? = null,
	val entityType: String = "",
	val numberOfVms: Int? = null,
	val vmNames: String = "",
	val templateVersionNames: String = "",
	val quotaId: String = "",
	val quotaName: String = "",
	val quotaEnforcementType: Int? = null,
	val imageTransferPhase: Int? = null,
	val imageTransferType: Int? = null,
	val imageTransferBytesSent: BigInteger? = BigInteger.ZERO,
	val imageTransferBytesTotal: BigInteger? = BigInteger.ZERO,
	val progress: BigInteger? = BigInteger.ZERO,
	val diskProfileId: String = "",
	val diskProfileName: String = "",
	val lunId: String = "",
	val physicalVolumeId: String = "",
	val volumeGroupId: String = "",
	val serial: String = "",
	val lunMapping: Int? = null,
	val vendorId: String = "",
	val productId: String = "",
	val deviceSize: Int? = null,
	val discardMaxSize: BigInteger? = BigInteger.ZERO,
	@Id
	@Column(name = "disk_id", unique = true, nullable = true)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val diskId: UUID? = null,
	val wipeAfterDelete: Boolean = false,
	val propagateErrors: String = "",
	val diskAlias: String = "",
	val diskDescription: String = "",
	val shareable: Boolean = false,
	val sgio: Int? = null,
	@Column(name = "disk_storage_type", nullable = true)
	private val _diskStorageType: Int? = null,
	val cinderVolumeType: String = "",
	@Column(name = "disk_content_type", nullable = true)
	private val _diskContentType: Int? = null,
	val backup: String = "",
	val backupMode: String = "",

): Serializable {
	val diskStorageType: DiskStorageType
		get() = DiskStorageType.forValue(_diskStorageType)

	val diskContentType: DiskContentType
		get() = DiskContentType.forValue(_diskContentType)

	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bStorageId: String = ""; fun storageId(block: () -> String?) { bStorageId = block() ?: "" }
		private var bStorageName: String = ""; fun storageName(block: () -> String?) { bStorageName = block() ?: "" }
		private var bStorageType: String = ""; fun storageType(block: () -> String?) { bStorageType = block() ?: "" }
		private var bStoragePoolId: UUID? = null; fun storagePoolId(block: () -> UUID?) { bStoragePoolId = block() }
		private var bImageGuid: UUID? = null; fun imageGuid(block: () -> UUID?) { bImageGuid = block() }
		private var bCreationDate: LocalDateTime = LocalDateTime.MIN; fun creationDate(block: () -> LocalDateTime?) { bCreationDate = block() ?: LocalDateTime.MIN }
		private var bActualSize: BigInteger = BigInteger.ZERO; fun actualSize(block: () -> BigInteger?) { bActualSize = block() ?: BigInteger.ZERO }
		private var bReadRate: BigInteger = BigInteger.ZERO; fun readRate(block: () -> BigInteger?) { bReadRate = block() ?: BigInteger.ZERO }
		private var bReadOps: BigInteger = BigInteger.ZERO; fun readOps(block: () -> BigInteger?) { bReadOps = block() ?: BigInteger.ZERO }
		private var bWriteRate: BigInteger = BigInteger.ZERO; fun writeRate(block: () -> BigInteger?) { bWriteRate = block() ?: BigInteger.ZERO }
		private var bWriteOps: BigInteger = BigInteger.ZERO; fun writeOps(block: () -> BigInteger?) { bWriteOps = block() ?: BigInteger.ZERO }
		private var bReadLatencySeconds: BigDecimal = BigDecimal.ZERO; fun readLatencySeconds(block: () -> BigDecimal?) { bReadLatencySeconds = block() ?: BigDecimal.ZERO }
		private var bWriteLatencySeconds: BigDecimal = BigDecimal.ZERO; fun writeLatencySeconds(block: () -> BigDecimal?) { bWriteLatencySeconds = block() ?: BigDecimal.ZERO }
		private var bFlushLatencySeconds: BigDecimal = BigDecimal.ZERO; fun flushLatencySeconds(block: () -> BigDecimal?) { bFlushLatencySeconds = block() ?: BigDecimal.ZERO }
		private var bSize: BigInteger = BigInteger.ZERO; fun size(block: () -> BigInteger?) { bSize = block() ?: BigInteger.ZERO }
		private var bItGuid: UUID? = null; fun itGuid(block: () -> UUID?) { bItGuid = block()  }
		private var bImagestatus: Int = -1; fun imagestatus(block: () -> Int?) { bImagestatus = block() ?: -1 }
		private var bLastmodified: LocalDateTime = LocalDateTime.MIN; fun lastmodified(block: () -> LocalDateTime?) { bLastmodified = block() ?: LocalDateTime.MIN }
		private var bVolumeType: Int = -1; fun volumeType(block: () -> Int?) { bVolumeType = block() ?: -1 }
		private var bVolumeFormat: Int = -1; fun volumeFormat(block: () -> Int?) { bVolumeFormat = block() ?: -1 }
		private var bQcowCompat: Int = -1; fun qcowCompat(block: () -> Int?) { bQcowCompat = block() ?: -1 }
		private var bImageGroupId: UUID? = null; fun imageGroupId(block: () -> UUID?) { bImageGroupId = block() }
		private var bDescription: String = ""; fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bParentid: UUID? = null; fun parentid(block: () -> UUID?) { bParentid = block() }
		private var bAppList: String = ""; fun appList(block: () -> String?) { bAppList = block() ?: "" }
		private var bVmSnapshotId: UUID? = null; fun vmSnapshotId(block: () -> UUID?) { bVmSnapshotId = block() }
		private var bActive: Boolean = false; fun active(block: () -> Boolean?) { bActive = block() ?: false }
		private var bVolumeClassification: Int = -1; fun volumeClassification(block: () -> Int?) { bVolumeClassification = block() ?: -1 }
		private var bSequenceNumber: Int = -1; fun sequenceNumber(block: () -> Int?) { bSequenceNumber = block() ?: -1 }
		private var bEntityType: String = ""; fun entityType(block: () -> String?) { bEntityType = block() ?: "" }
		private var bNumberOfVms: Int = -1; fun numberOfVms(block: () -> Int?) { bNumberOfVms = block() ?: -1 }
		private var bVmNames: String = ""; fun vmNames(block: () -> String?) { bVmNames = block() ?: "" }
		private var bTemplateVersionNames: String = ""; fun templateVersionNames(block: () -> String?) { bTemplateVersionNames = block() ?: "" }
		private var bQuotaId: String = ""; fun quotaId(block: () -> String?) { bQuotaId = block() ?: "" }
		private var bQuotaName: String = ""; fun quotaName(block: () -> String?) { bQuotaName = block() ?: "" }
		private var bQuotaEnforcementType: Int = -1; fun quotaEnforcementType(block: () -> Int?) { bQuotaEnforcementType = block() ?: -1 }
		private var bImageTransferPhase: Int = -1; fun imageTransferPhase(block: () -> Int?) { bImageTransferPhase = block() ?: -1 }
		private var bImageTransferType: Int = -1; fun imageTransferType(block: () -> Int?) { bImageTransferType = block() ?: -1 }
		private var bImageTransferBytesSent: BigInteger = BigInteger.ZERO; fun imageTransferBytesSent(block: () -> BigInteger?) { bImageTransferBytesSent = block() ?: BigInteger.ZERO }
		private var bImageTransferBytesTotal: BigInteger = BigInteger.ZERO; fun imageTransferBytesTotal(block: () -> BigInteger?) { bImageTransferBytesTotal = block() ?: BigInteger.ZERO }
		private var bProgress: BigInteger = BigInteger.ZERO; fun progress(block: () -> BigInteger?) { bProgress = block() ?: BigInteger.ZERO }
		private var bDiskProfileId: String = ""; fun diskProfileId(block: () -> String?) { bDiskProfileId = block() ?: "" }
		private var bDiskProfileName: String = ""; fun diskProfileName(block: () -> String?) { bDiskProfileName = block() ?: "" }
		private var bLunId: String = ""; fun lunId(block: () -> String?) { bLunId = block() ?: "" }
		private var bPhysicalVolumeId: String = ""; fun physicalVolumeId(block: () -> String?) { bPhysicalVolumeId = block() ?: "" }
		private var bVolumeGroupId: String = ""; fun volumeGroupId(block: () -> String?) { bVolumeGroupId = block() ?: "" }
		private var bSerial: String = ""; fun serial(block: () -> String?) { bSerial = block() ?: "" }
		private var bLunMapping: Int = -1; fun lunMapping(block: () -> Int?) { bLunMapping = block() ?: -1 }
		private var bVendorId: String = ""; fun vendorId(block: () -> String?) { bVendorId = block() ?: "" }
		private var bProductId: String = ""; fun productId(block: () -> String?) { bProductId = block() ?: "" }
		private var bDeviceSize: Int = -1; fun deviceSize(block: () -> Int?) { bDeviceSize = block() ?: -1 }
		private var bDiscardMaxSize: BigInteger = BigInteger.ZERO; fun discardMaxSize(block: () -> BigInteger?) { bDiscardMaxSize = block() ?: BigInteger.ZERO }
		private var bDiskId: UUID? = null;fun diskId(block: () -> UUID?) { bDiskId = block() }
		private var bWipeAfterDelete: Boolean = false; fun wipeAfterDelete(block: () -> Boolean?) { bWipeAfterDelete = block() ?: false }
		private var bPropagateErrors: String = ""; fun propagateErrors(block: () -> String?) { bPropagateErrors = block() ?: "" }
		private var bDiskAlias: String = ""; fun diskAlias(block: () -> String?) { bDiskAlias = block() ?: "" }
		private var bDiskDescription: String = ""; fun diskDescription(block: () -> String?) { bDiskDescription = block() ?: "" }
		private var bShareable: Boolean = false; fun shareable(block: () -> Boolean?) { bShareable = block() ?: false }
		private var bSgio: Int = -1; fun sgio(block: () -> Int?) { bSgio = block() ?: -1 }
		private var bDiskStorageType: Int = -1; fun diskStorageType(block: () -> Int?) { bDiskStorageType = block() ?: -1 }
		private var bCinderVolumeType: String = ""; fun cinderVolumeType(block: () -> String?) { bCinderVolumeType = block() ?: "" }
		private var bDiskContentType: Int = -1; fun diskContentType(block: () -> Int?) { bDiskContentType = block() ?: -1 }
		private var bBackup: String = ""; fun backup(block: () -> String?) { bBackup = block() ?: "" }
		private var bBackupMode: String = ""; fun backupMode(block: () -> String?) { bBackupMode = block() ?: "" }

		fun build(): AllDiskEntity = AllDiskEntity(bStorageId, bStorageName, bStorageType, bStoragePoolId, bImageGuid, bCreationDate, bActualSize, bReadRate, bReadOps, bWriteRate, bWriteOps, bReadLatencySeconds, bWriteLatencySeconds, bFlushLatencySeconds, bSize, bItGuid, bImagestatus, bLastmodified, bVolumeType, bVolumeFormat, bQcowCompat, bImageGroupId, bDescription, bParentid, bAppList, bVmSnapshotId, bActive, bVolumeClassification, bSequenceNumber, bEntityType, bNumberOfVms, bVmNames, bTemplateVersionNames, bQuotaId, bQuotaName, bQuotaEnforcementType, bImageTransferPhase, bImageTransferType, bImageTransferBytesSent, bImageTransferBytesTotal, bProgress, bDiskProfileId, bDiskProfileName, bLunId, bPhysicalVolumeId, bVolumeGroupId, bSerial, bLunMapping, bVendorId, bProductId, bDeviceSize, bDiscardMaxSize, bDiskId, bWipeAfterDelete, bPropagateErrors, bDiskAlias, bDiskDescription, bShareable, bSgio, bDiskStorageType, bCinderVolumeType, bDiskContentType, bBackup, bBackupMode, )
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): AllDiskEntity = Builder().apply(block).build()
	}
}

