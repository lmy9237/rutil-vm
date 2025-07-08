package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.VmDeviceEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface VmDeviceRepository: JpaRepository<VmDeviceEntity, UUID> {
	fun findAllByVmId(vmId: UUID?): List<VmDeviceEntity>
	fun findByVmIdAndType(vmId: UUID?, type: String): VmDeviceEntity?
}
