package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.AllDiskEntity

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface AllDisksRepository : JpaRepository<AllDiskEntity, UUID> {
	fun findByDiskId(diskId: UUID): AllDiskEntity?
	fun findAllByOrderByDiskAliasAsc(): List<AllDiskEntity>

	fun findByStorageId(storageId: String): List<AllDiskEntity>?
	fun findBystoragePoolId(storagePoolId: String): List<AllDiskEntity>?
}

