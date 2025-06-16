package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.VmTemplateEntity

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface VmTemplateRepository : JpaRepository<VmTemplateEntity, UUID> {
	fun findByVmtGuid(vmtGuid: UUID): VmTemplateEntity?
	fun findByStoragePoolIdOrderByNameAsc(storagePoolId: UUID): List<VmTemplateEntity>?

}
