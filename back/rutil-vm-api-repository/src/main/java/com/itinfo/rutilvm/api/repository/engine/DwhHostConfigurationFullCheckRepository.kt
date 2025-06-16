package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.DwhHostConfigurationFullCheckEntity

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface DwhHostConfigurationFullCheckRepository : JpaRepository<DwhHostConfigurationFullCheckEntity, UUID> {
	fun findByHostId(hostId: UUID): DwhHostConfigurationFullCheckEntity?


}
