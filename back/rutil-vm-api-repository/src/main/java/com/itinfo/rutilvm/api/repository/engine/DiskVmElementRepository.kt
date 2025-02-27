package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.DiskVmElementEntity

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface DiskVmElementRepository : JpaRepository<DiskVmElementEntity, UUID> {
	fun findByDiskId(diskId: UUID): Optional<DiskVmElementEntity>
	fun findByDiskIdIn(diskIds: List<UUID>): List<DiskVmElementEntity>
	fun findByVmId(vmId: UUID): List<DiskVmElementEntity>
}
