package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.AllDiskEntity

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface AllDisksRepository : JpaRepository<AllDiskEntity, UUID> {
	fun findByDiskId(diskId: UUID): AllDiskEntity?
	fun findAllByOrderByDiskAliasAsc(): List<AllDiskEntity>
	fun findAllByVmNamesOrderByDiskAliasAsc(vNames: String): List<AllDiskEntity>

	fun findByStorageId(storageId: String): List<AllDiskEntity>?

@Query("""
    SELECT *
    FROM all_disks
    WHERE storage_pool_id = :storagePoolId
      AND active = true
      AND disk_content_type = 0
      AND (disk_storage_type = 0 OR disk_storage_type = 1)
      AND number_of_vms = 0
    ORDER BY disk_alias
""", nativeQuery = true)
	fun findByStoragePoolIdOrderByDiskAliasAsc(storagePoolId: UUID): List<AllDiskEntity>?
}

