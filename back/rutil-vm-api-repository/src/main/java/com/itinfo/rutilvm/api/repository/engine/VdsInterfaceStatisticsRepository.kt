package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.VdsInterfaceStatisticsEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface VdsInterfaceStatisticsRepository: JpaRepository<VdsInterfaceStatisticsEntity, UUID> {
	fun findAllByVdsStaticVdsId(vdsId: UUID): List<VdsInterfaceStatisticsEntity>
}
