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
SELECT * FROM all_disks
WHERE storage_pool_id = :storagePoolId
AND active = true
AND (disk_storage_type = 0 OR disk_storage_type = 1)
ORDER BY disk_alias
""", nativeQuery = true)
	fun findAllByStoragePoolIdOrderByDiskAliasAsc(storagePoolId: UUID?): List<AllDiskEntity>?

@Query("""
SELECT * FROM all_disks WHERE 1=1
AND storage_id = :storageDomainId
AND active = true
AND (disk_storage_type = 0 OR disk_storage_type = 1)
ORDER BY disk_alias
""", nativeQuery = true)
	fun findAllByStorageDomainIdOrderByDiskAliasAsc(storageDomainId: String?): List<AllDiskEntity>?
}

