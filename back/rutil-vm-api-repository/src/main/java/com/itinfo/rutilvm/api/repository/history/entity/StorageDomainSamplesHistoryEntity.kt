package com.itinfo.rutilvm.api.repository.history.entity

import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.api.repository.history.dto.StorageUsageDto

import org.hibernate.annotations.Type
import org.slf4j.LoggerFactory
import java.io.Serializable
import java.time.LocalDateTime
import java.util.UUID
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table

private val log = LoggerFactory.getLogger(StorageDomainSamplesHistoryEntity::class.java)

/**
 * [StorageDomainSamplesHistoryEntity]
 * 
 * @property historyId [Int]
 * @property storageDomainId [UUID]
 * @property historyDatetime [LocalDateTime]
 * @property availableDiskSizeGb [Int]
 * @property usedDiskSizeGb [Int]
 * @property storageConfigurationVersion [Int]
 * @property storageDomainStatus [Int]
 * @property secondsInStatus [Int]
 */
@Entity
@Table(name="storage_domain_samples_history", schema="public")
class StorageDomainSamplesHistoryEntity(
    @Id
    @Column(unique = true, nullable = false)
    val historyId: Int = -1,

    @Type(type = "org.hibernate.type.PostgresUUIDType")
    val storageDomainId: UUID? = null,

    val historyDatetime: LocalDateTime = LocalDateTime.MIN,

    val availableDiskSizeGb: Int = -1,
    val usedDiskSizeGb: Int = -1,

    val storageConfigurationVersion: Int = -1,
    val storageDomainStatus: Int = -1,
    val secondsInStatus: Int = -1,
): Serializable {
	override fun toString(): String = gson.toJson(this)

	class Builder {
		private var bHistoryId: Int = -1;fun historyId(block: () -> Int?) { bHistoryId = block() ?: -1 }
		private var bStorageDomainId: UUID? = null;fun storageDomainId(block: () -> UUID?) { bStorageDomainId = block() }
		private var bHistoryDatetime: LocalDateTime = LocalDateTime.MIN;fun historyDatetime(block: () -> LocalDateTime?) { bHistoryDatetime = block() ?: LocalDateTime.MIN }
		private var bAvailableDiskSizeGb: Int = -1;fun availableDiskSizeGb(block: () -> Int?) { bAvailableDiskSizeGb = block() ?: -1 }
		private var bUsedDiskSizeGb: Int = -1;fun usedDiskSizeGb(block: () -> Int?) { bUsedDiskSizeGb = block() ?: -1 }
		private var bStorageConfigurationVersion: Int = -1;fun storageConfigurationVersion(block: () -> Int?) { bStorageConfigurationVersion = block() ?: -1 }
		private var bStorageDomainStatus: Int = -1;fun storageDomainStatus(block: () -> Int?) { bStorageDomainStatus = block() ?: -1 }
		private var bSecondsInStatus: Int = -1;fun secondsInStatus(block: () -> Int?) { bSecondsInStatus = block() ?: -1 }
		fun build(): StorageDomainSamplesHistoryEntity = StorageDomainSamplesHistoryEntity(bHistoryId, bStorageDomainId, bHistoryDatetime, bAvailableDiskSizeGb, bUsedDiskSizeGb, bStorageConfigurationVersion, bStorageDomainStatus, bSecondsInStatus)
	}

	companion object {
		inline fun builder(block: StorageDomainSamplesHistoryEntity.Builder.() -> Unit): StorageDomainSamplesHistoryEntity = StorageDomainSamplesHistoryEntity.Builder().apply(block).build()
	}
}

fun StorageDomainSamplesHistoryEntity.toStorageUsageDto(): StorageUsageDto {
	return StorageUsageDto.builder {
		historyDatetime { historyDatetime }
		totalGB { (availableDiskSizeGb + usedDiskSizeGb).toDouble() }
		usedGB { usedDiskSizeGb.toDouble() }
		freeGB { availableDiskSizeGb.toDouble() }
	}
}