package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.VmEntity
import com.itinfo.rutilvm.api.repository.engine.entity.VmStaticEntity

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface VmStaticRepository: JpaRepository<VmStaticEntity, UUID> {
	fun findByVmGuid(vmGuid: UUID?): VmStaticEntity?
}
