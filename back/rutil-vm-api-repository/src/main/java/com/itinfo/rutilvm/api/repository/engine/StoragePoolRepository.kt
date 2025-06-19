package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.StoragePoolEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface StoragePoolRepository: JpaRepository<StoragePoolEntity, UUID> {

	@Query("""
SELECT DISTINCT sp FROM StoragePoolEntity sp
LEFT JOIN FETCH sp.clusters
WHERE 1=1
""")
	fun findAllWithClusters(): List<StoragePoolEntity>

	@Query("""
SELECT DISTINCT sp FROM StoragePoolEntity sp
LEFT JOIN FETCH sp.clusters
WHERE 1=1
AND sp.id = :storagePoolId
""")
	fun findByIdWithClusters(storagePoolId: UUID): StoragePoolEntity?
}
