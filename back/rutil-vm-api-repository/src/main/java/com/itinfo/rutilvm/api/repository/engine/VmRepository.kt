package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.VmEntity

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface VmRepository: JpaRepository<VmEntity, UUID> {

	@Query("""
SELECT DISTINCT v FROM VmEntity v
LEFT JOIN FETCH v.snapshots
WHERE 1=1
ORDER BY v.vmName ASC
""")
	fun findAllWithSnapshotsOrderByVmNameAsc(): List<VmEntity>

	@Query("""
    SELECT DISTINCT v FROM VmEntity v
    LEFT JOIN FETCH v.snapshots
    WHERE v.storagePoolId = :storagePoolId
    ORDER BY v.vmName ASC
""")
	fun findAllByStoragePoolIdWithSnapshotsOrderByVmNameAsc(storagePoolId: UUID): List<VmEntity>

	@Query("""
    SELECT DISTINCT v FROM VmEntity v
    LEFT JOIN FETCH v.snapshots
    WHERE v.clusterId = :clusterId
    ORDER BY v.vmName ASC
""")
	fun findAllByClusterIdWithSnapshotsOrderByVmNameAsc(clusterId: UUID): List<VmEntity>

	@Query("""
    SELECT DISTINCT v FROM VmEntity v
    LEFT JOIN FETCH v.snapshots
    WHERE v.runOnVds = :runOnVds
    ORDER BY v.vmName ASC
""")
	fun findAllByRunOnVdsWithSnapshotsOrderByVmNameAsc(runOnVds: UUID): List<VmEntity>


	@Query("""
SELECT DISTINCT v FROM VmEntity v
LEFT JOIN FETCH v.snapshots
WHERE 1=1
AND v.vmGuid = :vmId
""")

	fun findByIdWithSnapshots(vmId: UUID): VmEntity?

}

