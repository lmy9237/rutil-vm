package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.AllDisksForVmsEntity

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface AllDisksForVmsRepository : JpaRepository<AllDisksForVmsEntity, UUID> {
	fun findByDiskId(diskId: UUID): AllDisksForVmsEntity?
	fun findAllByOrderByDiskAliasAsc(): List<AllDisksForVmsEntity>

	@Query("""
select *
from all_disks_for_vms adfv
left join disk_vm_element_extended dvee
on adfv.vm_id = dvee.vm_id
""", nativeQuery = true)
	fun findAllDiskByVmId(vmId: UUID?): List<AllDisksForVmsEntity>?
}

