package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.VmInterfaceEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface VmInterfaceRepository: JpaRepository<VmInterfaceEntity, UUID> {
	@Query("""
SELECT DISTINCT vi FROM VmInterfaceEntity vi
LEFT JOIN FETCH vi.vnicProfile AS vp
  LEFT JOIN FETCH vp.networkFilter AS nf
LEFT JOIN FETCH vi.stats AS s
LEFT JOIN FETCH vi.vm AS v
LEFT JOIN FETCH v.snapshots
LEFT JOIN FETCH v.smallIcon
LEFT JOIN FETCH v.largeIcon
LEFT JOIN FETCH v.dwhOsInfo
LEFT JOIN FETCH v.diskVmElements
LEFT JOIN FETCH v.vmDevices
LEFT JOIN FETCH v.iconDefaults ide
LEFT JOIN FETCH ide.smallIcon
LEFT JOIN FETCH ide.largeIcon
WHERE 1=1
""")
	override fun findAll(): List<VmInterfaceEntity>
	@Query("""
SELECT DISTINCT vi FROM VmInterfaceEntity vi
LEFT JOIN FETCH vi.vnicProfile AS vp
  LEFT JOIN FETCH vp.networkFilter AS nf
LEFT JOIN FETCH vi.stats AS s
LEFT JOIN FETCH vi.vm AS v
LEFT JOIN FETCH v.snapshots
LEFT JOIN FETCH v.smallIcon
LEFT JOIN FETCH v.largeIcon
LEFT JOIN FETCH v.dwhOsInfo
LEFT JOIN FETCH v.diskVmElements
LEFT JOIN FETCH v.vmDevices
LEFT JOIN FETCH v.iconDefaults ide
LEFT JOIN FETCH ide.smallIcon
LEFT JOIN FETCH ide.largeIcon
WHERE 1=1
AND vi.id = :id
""")
	fun findById(id: UUID?): VmInterfaceEntity?

@Query("""
SELECT DISTINCT vi FROM VmInterfaceEntity vi
LEFT JOIN FETCH vi.vnicProfile AS vp
  LEFT JOIN FETCH vp.networkFilter AS nf
LEFT JOIN FETCH vi.stats AS s
LEFT JOIN FETCH vi.vm AS v
LEFT JOIN FETCH v.snapshots
LEFT JOIN FETCH v.smallIcon
LEFT JOIN FETCH v.largeIcon
LEFT JOIN FETCH v.dwhOsInfo
LEFT JOIN FETCH v.diskVmElements
LEFT JOIN FETCH v.vmDevices
LEFT JOIN FETCH v.iconDefaults ide
LEFT JOIN FETCH ide.smallIcon
LEFT JOIN FETCH ide.largeIcon
WHERE 1=1
AND v.vmGuid = :vmGuid
""")
	fun findAllByVmGuid(vmGuid: UUID?): List<VmInterfaceEntity>

	@Query("""
SELECT DISTINCT vi FROM VmInterfaceEntity vi
LEFT JOIN FETCH vi.vnicProfile AS vp
  LEFT JOIN FETCH vp.networkFilter AS nf
  LEFT JOIN FETCH vp.network AS n
    LEFT JOIN FETCH n.networkClusters nc
      LEFT JOIN FETCH nc.cluster c
LEFT JOIN FETCH vi.stats AS s
LEFT JOIN FETCH vi.vm AS v
LEFT JOIN FETCH v.snapshots
LEFT JOIN FETCH v.smallIcon
LEFT JOIN FETCH v.largeIcon
LEFT JOIN FETCH v.dwhOsInfo
LEFT JOIN FETCH v.diskVmElements
LEFT JOIN FETCH v.vmDevices
LEFT JOIN FETCH v.iconDefaults ide
LEFT JOIN FETCH ide.smallIcon
LEFT JOIN FETCH ide.largeIcon
WHERE 1=1
AND c.clusterId = :clusterId
""")
	fun findAllByClusterId(clusterId: UUID?): List<VmInterfaceEntity>
}
