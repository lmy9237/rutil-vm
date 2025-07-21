package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.VdsEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface VdsRepository : JpaRepository<VdsEntity, UUID> {
	fun findByVdsId(vdsId: UUID?): VdsEntity
	// fun findByStoragePoolId(storagePoolId: UUID?): VdsEntity

// 	@Query("""
// SELECT v
// FROM VdsEntity v
// WHERE v.storagePool.id = :storagePoolId
// """)
	@Query("""
SELECT v
FROM VdsEntity v
WHERE v.storagePool.id = :storagePoolId
	""")
	fun findByStoragePoolId(storagePoolId: UUID): List<VdsEntity>

	@Query("""
SELECT v
FROM VdsEntity v
WHERE v.cluster.id = :clusterId
	""")
	fun findByClusterId(clusterId: UUID): List<VdsEntity>

}
