package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.SnapshotEntity
import com.itinfo.rutilvm.api.repository.engine.entity.VmsEntity

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface SnapshotsRepository : JpaRepository<SnapshotEntity, UUID> {
	fun findByVmId(vmId: UUID): SnapshotEntity?
	fun findBySnapshotId(snapshotId: UUID): SnapshotEntity?
	fun findAllByOrderByDescriptionAsc(): List<SnapshotEntity>
}

