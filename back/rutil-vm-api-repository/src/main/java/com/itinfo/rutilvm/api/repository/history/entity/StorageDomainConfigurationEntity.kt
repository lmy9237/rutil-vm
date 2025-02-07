package com.itinfo.rutilvm.api.repository.history.entity

import com.itinfo.rutilvm.common.gson

import org.hibernate.annotations.Type
import org.slf4j.LoggerFactory
import java.io.Serializable
import java.time.LocalDateTime
import java.util.UUID
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table

private val log = LoggerFactory.getLogger(StorageDomainConfigurationEntity::class.java)

/**
 * [StorageDomainConfigurationEntity]
 *
 * @property historyId [String]
 * @property storageDomainId [String]
 * @property storageDomainName [String]
 * @property storageDomainType [Int]
 * @property storageType [Int]
 * @property createDate [LocalDateTime]
 * @property updateDate [LocalDateTime]
 * @property deleteDate [LocalDateTime]
 */
@Entity
@Table(name="storage_domain_configuration", schema="public")
class StorageDomainConfigurationEntity(
    @Id
    @Column(unique = true, nullable = false)
    val historyId: Int = -1,

    @Type(type = "org.hibernate.type.PostgresUUIDType")
    val storageDomainId: UUID? = null,

	val storageDomainName: String = "",
	val storageDomainType: Int = -1,
	val storageType: Int = -1,
	val createDate: LocalDateTime = LocalDateTime.MIN,
	val updateDate: LocalDateTime = LocalDateTime.MIN,
	val deleteDate: LocalDateTime = LocalDateTime.MIN,
): Serializable {
	override fun toString(): String = gson.toJson(this)

	class Builder {
		private var bHistoryId: Int = -1;fun historyId(block: () -> Int?) { bHistoryId = block() ?: -1 }
		private var bStorageDomainId: UUID? = null;fun storageDomainId(block: () -> UUID?) { bStorageDomainId = block() }
		private var bStorageDomainName: String = "";fun storageDomainName(block: () -> String?) { bStorageDomainName = block() ?: "" }
		private var bStorageDomainType: Int = -1;fun storageDomainType(block: () -> Int?) { bStorageDomainType = block() ?: -1 }
		private var bStorageType: Int = -1;fun storageType(block: () -> Int?) { bStorageType = block() ?: -1 }
		private var bCreateDate: LocalDateTime = LocalDateTime.MIN;fun createDate(block: () -> LocalDateTime?) { bCreateDate = block() ?:LocalDateTime.MIN }
		private var bUpdateDate: LocalDateTime = LocalDateTime.MIN;fun updateDate(block: () -> LocalDateTime?) { bUpdateDate = block() ?:LocalDateTime.MIN }
		private var bDeleteDate: LocalDateTime = LocalDateTime.MIN;fun deleteDate(block: () -> LocalDateTime?) { bDeleteDate = block() ?:LocalDateTime.MIN }

		fun build(): StorageDomainConfigurationEntity = StorageDomainConfigurationEntity(bHistoryId,  bStorageDomainId, bStorageDomainName, bStorageDomainType, bStorageType, bCreateDate, bUpdateDate, bDeleteDate,)
	}

	companion object {
		inline fun builder(block: StorageDomainConfigurationEntity.Builder.() -> Unit): StorageDomainConfigurationEntity = StorageDomainConfigurationEntity.Builder().apply(block).build()
	}
}
