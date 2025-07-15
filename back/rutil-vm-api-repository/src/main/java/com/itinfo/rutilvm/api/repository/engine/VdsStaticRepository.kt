package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.VdsStaticEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface VdsStaticRepository: JpaRepository<VdsStaticEntity, UUID> {

	@Query("""
SELECT DISTINCT vds FROM VdsStaticEntity vds
LEFT JOIN FETCH vds.vdsDynamic AS vdsd
LEFT JOIN FETCH vds.interfaces AS i
LEFT JOIN FETCH vds.interfaceStatistics AS is
WHERE 1=1
""")
	override fun findAll(): List<VdsStaticEntity>
	@Query("""
SELECT DISTINCT vds FROM VdsStaticEntity vds
LEFT JOIN FETCH vds.vdsDynamic AS vdsd
LEFT JOIN FETCH vds.interfaces AS i
LEFT JOIN FETCH vds.interfaceStatistics AS is
WHERE 1=1
AND vds.vdsId = :vdsId
""")
	fun findByVdsId(
		@Param("vdsId") vdsId: String?,
	): VdsStaticEntity?
	fun findByHostNameAndClusterId(hostName: String, clusterId: UUID): VdsStaticEntity?
	fun findByVdsNameAndClusterId(vdsName: String, clusterId: UUID): VdsStaticEntity?
}

