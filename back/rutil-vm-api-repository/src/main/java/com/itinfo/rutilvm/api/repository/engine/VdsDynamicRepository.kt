package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.VdsDynamicEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface VdsDynamicRepository: JpaRepository<VdsDynamicEntity, UUID> {
	fun findByVdsId(vdsId: UUID): VdsDynamicEntity?
}


