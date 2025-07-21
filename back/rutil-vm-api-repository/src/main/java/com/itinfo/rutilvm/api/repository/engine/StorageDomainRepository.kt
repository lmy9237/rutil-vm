package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.StorageDomainEntity

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface StorageDomainRepository : JpaRepository<StorageDomainEntity, UUID> {
	// fun findById(id: UUID): StorageDomainEntity?
	fun findAllByOrderByStorageNameAsc(): List<StorageDomainEntity>

	fun findAllByStoragePoolIdOrderByStorageNameAsc(storagePoolId: UUID): List<StorageDomainEntity>

	@Query("""
SELECT sd
FROM StorageDomainEntity sd
WHERE sd.storagePoolId = :storagePoolId
	""")
	fun findByStoragePoolId(storagePoolId: UUID): List<StorageDomainEntity>
}

