package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.api.ovirt.business.StorageDomainStatusB
import com.itinfo.rutilvm.api.ovirt.business.StorageDomainTypeB
import com.itinfo.rutilvm.api.ovirt.business.StorageTypeB
import com.itinfo.rutilvm.common.gson
import org.hibernate.annotations.Immutable
import org.hibernate.annotations.Type
import java.time.LocalDateTime
import java.util.UUID
import java.io.Serializable
import java.math.BigInteger
import javax.persistence.Id
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Table

/**
 *
 * [StorageDomainEntity]
 * oVirt 4.5.5의 `storage_domains` 뷰에 대한 엔티티
 *
 * @property id [UUID] 스토리지 도메인 ID (기본 키)
 * @property storage [String] 스토리지 경로 또는 볼륨 그룹 ID
 * @property storageName [String] 스토리지 도메인 이름
 * @property storageDescription [String] 스토리지 도메인 설명
 * @property storageComment [String] 스토리지 도메인 코멘트
 * @property storagePoolId [UUID] 스토리지 풀 ID
 * @property availableDiskSize [BigInteger] 사용 가능한 디스크 크기 (GiB)
 * @property confirmedAvailableDiskSize [BigInteger] 확정된 사용 가능한 디스크 크기 (GiB)
 * @property vdoSavings [BigInteger] VDO 절감량 (GB)
 * @property usedDiskSize [BigInteger] 사용된 디스크 크기 (GiB)
 * @property commitedDiskSize [BigInteger] 커밋된 디스크 크기 (GiB)
 * @property actualImagesSize [BigInteger] 실제 이미지 크기 (GiB)
 * @property status [Int] 스토리지 도메인 상태
 * @property storagePoolName [String] 스토리지 풀 이름
 * @property _storageType [Int] 스토리지 타입
 * @property storageDomainType [Int] 스토리지 도메인 타입
 * @property storageDomainFormatType [String] 스토리지 도메인 포맷 타입
 * @property lastTimeUsedAsMaster [LocalDateTime] 마지막으로 마스터로 사용된 시간
 * @property wipeAfterDelete [Boolean] 삭제 후 와이프 여부
 * @property discardAfterDelete [Boolean] 삭제 후 디스카드 여부
 * @property firstMetadataDevice [String] 첫 번째 메타데이터 장치
 * @property vgMetadataDevice [String] 볼륨 그룹 메타데이터 장치
 * @property backup [Boolean] 백업 여부
 * @property blockSize [Int] 블록 사이즈 (바이트)
 * @property storageDomainSharedStatus [Int] 스토리지 도메인 공유 상태
 * @property recoverable [Boolean] 복구 가능 여부
 * @property containsUnregisteredEntities [Boolean] 미등록 엔티티 포함 여부
 * @property warningLowSpaceIndicator [Int] 낮은 공간 경고 지표
 * @property criticalSpaceActionBlocker [Int] 심각한 공간 부족 액션 블로커
 * @property warningLowConfirmedSpaceIndicator [Int] 낮은 확정된 공간 경고 지표
 * @property externalStatus [Int] 외부 상태
 * @property supportsDiscard [Boolean] 디스카드 지원 여부
 * @property isHostedEngineStorage [Boolean] 호스티드 엔진 스토리지 여부
 */
@Entity
@Immutable
@Table(name = "storage_domains")
class StorageDomainEntity(
	@Id
	@Column(name = "id", unique = true, nullable = true)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val id: UUID? = null,
	val storage: String = "",
	val storageName: String = "",
	val storageDescription: String = "",
	val storageComment: String = "",
	val availableDiskSize: BigInteger? = BigInteger.ZERO,
	val confirmedAvailableDiskSize: BigInteger? = BigInteger.ZERO,
	val vdoSavings: BigInteger? = BigInteger.ZERO,
	val usedDiskSize: BigInteger? = BigInteger.ZERO,
	val commitedDiskSize: BigInteger? = BigInteger.ZERO,
	val actualImagesSize: BigInteger? = BigInteger.ZERO,
	@Column(name = "status", nullable=true)
	private val _status: Int? = null,
	val storagePoolId: UUID? = null,
	val storagePoolName: String = "",
	@Column(name = "storage_type", nullable=true)
	private val _storageType: Int? = null,
	@Column(name = "storage_domain_type", nullable=true)
	private val _storageDomainType: Int? = null,
	val storageDomainFormatType: String? = null,
	val wipeAfterDelete: Boolean? = null,
	val discardAfterDelete: Boolean? = null,
	val firstMetadataDevice: String? = null,
	val vgMetadataDevice: String? = null,
	val backup: Boolean? = null,
	val blockSize: Int? = null,
	val storageDomainSharedStatus: Int? = null,
	val recoverable: Boolean? = null,
	val containsUnregisteredEntities: Boolean = false,
	val warningLowSpaceIndicator: Int? = null,
	val criticalSpaceActionBlocker: Int? = null,
	val warningLowConfirmedSpaceIndicator: Int? = null,
	val externalStatus: Int? = null,
	val supportsDiscard: Boolean? = null,
	val isHostedEngineStorage: Boolean = false,
) : Serializable {
	val status: StorageDomainStatusB					get() = StorageDomainStatusB.forValue(_status)
	val storageType: StorageTypeB						get() = StorageTypeB.forValue(_storageType)
	val storageDomainType: StorageDomainTypeB			get() = StorageDomainTypeB.forValue(_storageDomainType)

	val availableDiskSizeInByte: BigInteger				get() = availableDiskSize?.multiply(GIGABYTE_2_BYTE) ?: BigInteger.ZERO
	val confirmedAvailableDiskSizeInByte: BigInteger	get() = confirmedAvailableDiskSize?.multiply(GIGABYTE_2_BYTE) ?: BigInteger.ZERO
	val vdoSavingsInByte: BigInteger					get() = vdoSavings?.multiply(GIGABYTE_2_BYTE) ?: BigInteger.ZERO
	val usedDiskSizeInByte: BigInteger					get() = usedDiskSize?.multiply(GIGABYTE_2_BYTE) ?: BigInteger.ZERO
	val commitedDiskSizeInByte: BigInteger				get() = commitedDiskSize?.multiply(GIGABYTE_2_BYTE) ?: BigInteger.ZERO
	val actualImagesSizeInByte: BigInteger				get() = actualImagesSize?.multiply(GIGABYTE_2_BYTE) ?: BigInteger.ZERO

	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bId: UUID? = null; fun id(block: () -> UUID?) { bId = block() }
		private var bStorage: String = ""; fun storage(block: () -> String?) { bStorage = block() ?: "" }
		private var bStorageName: String = ""; fun storageName(block: () -> String?) { bStorageName = block() ?: "" }
		private var bStorageDescription: String = ""; fun storageDescription(block: () -> String?) { bStorageDescription = block() ?: "" }
		private var bStorageComment: String = ""; fun storageComment(block: () -> String?) { bStorageComment = block() ?: "" }
		private var bAvailableDiskSize: BigInteger? = BigInteger.ZERO; fun availableDiskSize(block: () -> BigInteger?) { bAvailableDiskSize = block() ?: BigInteger.ZERO }
		private var bConfirmedAvailableDiskSize: BigInteger? = BigInteger.ZERO; fun confirmedAvailableDiskSize(block: () -> BigInteger?) { bConfirmedAvailableDiskSize = block() }
		private var bVdoSavings: BigInteger? = BigInteger.ZERO; fun vdoSavings(block: () -> BigInteger?) { bVdoSavings = block() ?: BigInteger.ZERO }
		private var bUsedDiskSize: BigInteger? = BigInteger.ZERO; fun usedDiskSize(block: () -> BigInteger?) { bUsedDiskSize = block() ?: BigInteger.ZERO }
		private var bCommitedDiskSize: BigInteger? = null; fun commitedDiskSize(block: () -> BigInteger?) { bCommitedDiskSize = block() ?: BigInteger.ZERO }
		private var bActualImagesSize: BigInteger? = null; fun actualImagesSize(block: () -> BigInteger?) { bActualImagesSize = block() ?: BigInteger.ZERO }
		private var bStatus: Int? = null; fun status(block: () -> Int?) { bStatus = block() }
		private var bStoragePoolId: UUID? = null; fun storagePoolId(block: () -> UUID?) { bStoragePoolId = block() }
		private var bStoragePoolName: String = ""; fun storagePoolName(block: () -> String?) { bStoragePoolName = block() ?: "" }
		private var bStorageType: Int? = null; fun storageType(block: () -> Int?) { bStorageType = block() }
		private var bStorageDomainType: Int? = null; fun storageDomainType(block: () -> Int?) { bStorageDomainType = block() }
		private var bStorageDomainFormatType: String? = null; fun storageDomainFormatType(block: () -> String?) { bStorageDomainFormatType = block() }
		private var bWipeAfterDelete: Boolean? = null; fun wipeAfterDelete(block: () -> Boolean?) { bWipeAfterDelete = block() }
		private var bDiscardAfterDelete: Boolean? = null; fun discardAfterDelete(block: () -> Boolean?) { bDiscardAfterDelete = block() }
		private var bFirstMetadataDevice: String? = null; fun firstMetadataDevice(block: () -> String?) { bFirstMetadataDevice = block() }
		private var bVgMetadataDevice: String? = null; fun vgMetadataDevice(block: () -> String?) { bVgMetadataDevice = block() }
		private var bBackup: Boolean? = null; fun backup(block: () -> Boolean?) { bBackup = block() }
		private var bBlockSize: Int? = null; fun blockSize(block: () -> Int?) { bBlockSize = block() }
		private var bStorageDomainSharedStatus: Int? = null; fun storageDomainSharedStatus(block: () -> Int?) { bStorageDomainSharedStatus = block() }
		private var bRecoverable: Boolean? = null; fun recoverable(block: () -> Boolean?) { bRecoverable = block() }
		private var bContainsUnregisteredEntities: Boolean = false; fun containsUnregisteredEntities(block: () -> Boolean?) { bContainsUnregisteredEntities = block() ?: false }
		private var bWarningLowSpaceIndicator: Int? = null; fun warningLowSpaceIndicator(block: () -> Int?) { bWarningLowSpaceIndicator = block() }
		private var bCriticalSpaceActionBlocker: Int? = null; fun criticalSpaceActionBlocker(block: () -> Int?) { bCriticalSpaceActionBlocker = block() }
		private var bWarningLowConfirmedSpaceIndicator: Int? = null; fun warningLowConfirmedSpaceIndicator(block: () -> Int?) { bWarningLowConfirmedSpaceIndicator = block() }
		private var bExternalStatus: Int? = null; fun externalStatus(block: () -> Int?) { bExternalStatus = block() }
		private var bSupportsDiscard: Boolean? = null; fun supportsDiscard(block: () -> Boolean?) { bSupportsDiscard = block() }
		private var bIsHostedEngineStorage: Boolean = false; fun isHostedEngineStorage(block: () -> Boolean?) { bIsHostedEngineStorage = block() ?: false }

		fun build(): StorageDomainEntity = StorageDomainEntity(bId, bStorage, bStorageName, bStorageDescription, bStorageComment, bAvailableDiskSize, bConfirmedAvailableDiskSize, bVdoSavings, bUsedDiskSize, bCommitedDiskSize, bActualImagesSize, bStatus, bStoragePoolId, bStoragePoolName, bStorageType, bStorageDomainType, bStorageDomainFormatType, bWipeAfterDelete, bDiscardAfterDelete, bFirstMetadataDevice, bVgMetadataDevice, bBackup, bBlockSize, bStorageDomainSharedStatus, bRecoverable, bContainsUnregisteredEntities, bWarningLowSpaceIndicator, bCriticalSpaceActionBlocker, bWarningLowConfirmedSpaceIndicator, bExternalStatus, bSupportsDiscard, bIsHostedEngineStorage, )
	}

	companion object {
		val GIGABYTE_2_BYTE: BigInteger = BigInteger.valueOf(1024L*1024L*1024L)
		inline fun builder(block: Builder.() -> Unit): StorageDomainEntity = Builder().apply(block).build()
	}
}

