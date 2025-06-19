package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.ClusterViewEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface ClusterViewRepository: JpaRepository<ClusterViewEntity, UUID> {

	@Query("""
SELECT DISTINCT cv FROM ClusterViewEntity cv
LEFT JOIN FETCH cv.storagePool
LEFT JOIN FETCH cv.hosts
WHERE 1=1
""")
	fun findAllWithDataCenter(): List<ClusterViewEntity>

	@Query("""
SELECT DISTINCT cv FROM ClusterViewEntity cv
LEFT JOIN FETCH cv.storagePool
LEFT JOIN FETCH cv.hosts
WHERE 1=1
AND cv.clusterId = :clusterId
""")
	fun findByIdWithDataCenter(clusterId: UUID): ClusterViewEntity?
}
