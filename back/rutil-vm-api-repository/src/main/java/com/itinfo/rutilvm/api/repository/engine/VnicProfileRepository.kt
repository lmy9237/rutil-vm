package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.VnicProfileEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface VnicProfileRepository: JpaRepository<VnicProfileEntity, UUID> {
	@Query("""
SELECT DISTINCT vp FROM VnicProfileEntity vp
LEFT JOIN FETCH vp.network AS n
LEFT JOIN FETCH n.storagePool AS sp
LEFT JOIN FETCH vp.networkFilter nf
WHERE 1=1
""")
	override fun findAll(): List<VnicProfileEntity>

	@Query("""
SELECT DISTINCT vp FROM VnicProfileEntity vp
LEFT JOIN FETCH vp.network AS n
LEFT JOIN FETCH n.storagePool AS sp
LEFT JOIN FETCH vp.networkFilter nf
WHERE 1=1
AND vp.id = :id
""")
	fun findByVnicProfileId(
		@Param("id") id: UUID
	): VnicProfileEntity?

	@Query("""
SELECT DISTINCT vp FROM VnicProfileEntity vp
LEFT JOIN FETCH vp.network AS n
LEFT JOIN FETCH n.storagePool AS sp
LEFT JOIN FETCH vp.networkFilter nf
WHERE 1=1
AND n.id = :networkId
""")
	fun findByNetworkId(
		@Param("networkId") networkId: UUID
	): List<VnicProfileEntity>
}
