package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.BaseDiskEntity
import com.itinfo.rutilvm.api.repository.engine.entity.DiskVmElementEntity

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface BaseDisksRepository : JpaRepository<BaseDiskEntity, UUID> {
	fun findByDiskId(diskId: UUID): BaseDiskEntity?

}
