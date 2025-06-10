package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.AllDiskEntity
import com.itinfo.rutilvm.api.repository.engine.entity.VmsEntity

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface VmsRepository : JpaRepository<VmsEntity, UUID> {
	fun findByVmGuid(vmGuid: UUID): VmsEntity?
	fun findAllByOrderByVmNameAsc(): List<VmsEntity>
}

