package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.VdsStatisticsEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface VdsStatisticsRepository : JpaRepository<VdsStatisticsEntity, UUID> {
	fun findByVdsId(vdsId: UUID?): VdsStatisticsEntity
}

