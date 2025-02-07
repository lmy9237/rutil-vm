package com.itinfo.rutilvm.api.repository.history.dto

import com.itinfo.rutilvm.common.gson

import org.slf4j.LoggerFactory
import java.io.Serializable
import java.time.LocalDateTime

private val log = LoggerFactory.getLogger(StorageUsageDto::class.java)

/**
 * [StorageDto]
 * 
 * @property storageDomainId [String]
 * @property storageDomainName [String]
 * @property storageDomainType [Int]
 * @property storageType [Int]
 * @property createDate [LocalDateTime]
 * @property updateDate [LocalDateTime]
 * @property deleteDate [LocalDateTime]
 */
class StorageDto(
	// 스토리지 도메인 생성일
	val storageDomainId: String = "",
	val storageDomainName: String = "",
	val storageDomainType: Int = 0,
	val storageType: Int = 0,
	val createDate: LocalDateTime? = null,
	val updateDate: LocalDateTime? = null,
	val deleteDate: LocalDateTime? = null,
): Serializable {
    override fun toString(): String = gson.toJson(this)

    class Builder {
		private var bStorageDomainId: String = "";fun storageDomainId(block: () -> String?) { bStorageDomainId = block() ?: "" }
		private var bStorageDomainName: String = "";fun storageDomainName(block: () -> String?) { bStorageDomainName = block() ?: "" }
		private var bStorageDomainType: Int = 0;fun storageDomainType(block: () -> Int?) { bStorageDomainType = block() ?: 0 }
		private var bStorageType: Int = 0;fun storageType(block: () -> Int?) { bStorageType = block() ?: 0 }
		private var bCreateDate: LocalDateTime? = null;fun createDate(block: () -> LocalDateTime?) { bCreateDate = block() }
		private var bUpdateDate: LocalDateTime? = null;fun updateDate(block: () -> LocalDateTime?) { bUpdateDate = block() }
		private var bDeleteDate: LocalDateTime? = null;fun deleteDate(block: () -> LocalDateTime?) { bDeleteDate = block() }
        fun build(): StorageDto = StorageDto(bStorageDomainId, bStorageDomainName, bStorageDomainType, bStorageType, bCreateDate, bUpdateDate, bDeleteDate)
    }

    companion object {
        inline fun builder(block: StorageDto.Builder.() -> Unit): StorageDto = StorageDto.Builder().apply(block).build()
    }
}
