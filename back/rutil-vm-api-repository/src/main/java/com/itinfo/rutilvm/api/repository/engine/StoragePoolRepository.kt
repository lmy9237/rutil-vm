package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.StoragePoolEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface StoragePoolRepository: JpaRepository<StoragePoolEntity, UUID> {

	@Query("""
SELECT DISTINCT sp FROM StoragePoolEntity sp
LEFT JOIN FETCH sp.clusters AS c
LEFT JOIN FETCH c.hosts AS h
LEFT JOIN FETCH c.vms AS v1
LEFT JOIN FETCH v1.snapshots
LEFT JOIN FETCH v1.smallIcon
LEFT JOIN FETCH v1.largeIcon
LEFT JOIN FETCH v1.dwhOsInfo
LEFT JOIN FETCH v1.diskVmElements
LEFT JOIN FETCH v1.vmDevices
LEFT JOIN FETCH v1.iconDefaults ide1
LEFT JOIN FETCH ide1.smallIcon
LEFT JOIN FETCH ide1.largeIcon
LEFT JOIN FETCH h.vms AS v2
LEFT JOIN FETCH v2.snapshots
LEFT JOIN FETCH v2.smallIcon
LEFT JOIN FETCH v2.largeIcon
LEFT JOIN FETCH v2.dwhOsInfo
LEFT JOIN FETCH v2.diskVmElements
LEFT JOIN FETCH v2.vmDevices
LEFT JOIN FETCH v2.iconDefaults ide2
LEFT JOIN FETCH ide2.smallIcon
LEFT JOIN FETCH ide2.largeIcon
LEFT JOIN FETCH h.nics AS n
WHERE 1=1
""")
	fun findAllWithClusters(): List<StoragePoolEntity>

	@Query("""
SELECT DISTINCT sp FROM StoragePoolEntity sp
LEFT JOIN FETCH sp.clusters AS c
LEFT JOIN FETCH c.hosts AS h
LEFT JOIN FETCH c.vms AS v1
LEFT JOIN FETCH v1.snapshots
LEFT JOIN FETCH v1.smallIcon
LEFT JOIN FETCH v1.largeIcon
LEFT JOIN FETCH v1.dwhOsInfo
LEFT JOIN FETCH v1.diskVmElements
LEFT JOIN FETCH v1.vmDevices
LEFT JOIN FETCH v1.iconDefaults ide1
LEFT JOIN FETCH ide1.smallIcon
LEFT JOIN FETCH ide1.largeIcon
LEFT JOIN FETCH h.vms AS v2
LEFT JOIN FETCH v2.snapshots
LEFT JOIN FETCH v2.smallIcon
LEFT JOIN FETCH v2.largeIcon
LEFT JOIN FETCH v2.dwhOsInfo
LEFT JOIN FETCH v2.diskVmElements
LEFT JOIN FETCH v2.vmDevices
LEFT JOIN FETCH v2.iconDefaults ide2
LEFT JOIN FETCH ide2.smallIcon
LEFT JOIN FETCH ide2.largeIcon
LEFT JOIN FETCH h.nics AS n
WHERE 1=1
AND sp.id = :storagePoolId
""")
	fun findByIdWithClusters(storagePoolId: UUID): StoragePoolEntity?
}
