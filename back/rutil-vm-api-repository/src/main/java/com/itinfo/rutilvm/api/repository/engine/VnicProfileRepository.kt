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
SELECT vp FROM VnicProfileEntity vp
LEFT JOIN FETCH vp.network
LEFT JOIN FETCH vp.networkFilter nf
WHERE 1=1
""")
	override fun findAll(): List<VnicProfileEntity>

	@Query("""
SELECT vp FROM VnicProfileEntity vp
LEFT JOIN FETCH vp.network
LEFT JOIN FETCH vp.networkFilter nf
WHERE 1=1
AND vp.id = :id
""")
	fun findByVnicProfileId(
		@Param("id") id: UUID
	): VnicProfileEntity?
}
