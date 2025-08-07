package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.AllDiskEntity

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface AllDisksRepository : JpaRepository<AllDiskEntity, UUID> {
	@Query("""
SELECT DISTINCT ad FROM AllDiskEntity ad
LEFT JOIN FETCH ad.diskVmElement dve
  LEFT JOIN FETCH dve.vm
WHERE 1=1
AND ad.active = true
ORDER BY ad.diskAlias
""")
	fun findAllByOrderByDiskAliasAsc(): List<AllDiskEntity>
	@Query("""
SELECT DISTINCT ad FROM AllDiskEntity ad
LEFT JOIN FETCH ad.diskVmElement dve
  LEFT JOIN FETCH dve.vm
WHERE 1=1
AND ad.active = true
AND ad.storageId = :storageDomainId
ORDER BY ad.diskAlias
""")
	fun findAllByStorageDomainIdOrderByDiskAliasAsc(storageDomainId: String): List<AllDiskEntity>
	@Query("""
SELECT DISTINCT ad FROM AllDiskEntity ad
LEFT JOIN FETCH ad.diskVmElement dve
  LEFT JOIN FETCH dve.vm
WHERE 1=1
AND ad.active = true
AND ad.storagePoolId = :storagePoolId
ORDER BY ad.diskAlias
""")
	fun findAllByStoragePoolIdOrderByDiskAliasAsc(storagePoolId: UUID?): List<AllDiskEntity>
	@Query("""
SELECT DISTINCT ad FROM AllDiskEntity ad
LEFT JOIN FETCH ad.diskVmElement dve
  LEFT JOIN FETCH dve.vm
WHERE 1=1
AND ad.active = true
AND ad.diskId = :diskId
""")
	fun findByDiskId(diskId: UUID?): AllDiskEntity?
	// fun findAllByVmNamesOrderByDiskAliasAsc(vNames: String): List<AllDiskEntity>
}

