package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.DiskVmElementEntity
import com.itinfo.rutilvm.api.repository.engine.entity.UnregisteredDiskEntity

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface DiskVmElementRepository : JpaRepository<DiskVmElementEntity, UUID> {
	fun findByDiskId(diskId: UUID): Optional<DiskVmElementEntity>
	fun findByDiskIdIn(diskIds: List<UUID>): List<DiskVmElementEntity>
	fun findByVmId(vmId: UUID): List<DiskVmElementEntity>

/*
	@Query("""
SELECT ude FROM UnregisteredDiskEntity ude
LEFT JOIN FETCH ude.diskToVmEntries dte
LEFT JOIN FETCH dte.unregisteredOvfOfEntities
WHERE 1=1
AND ude.id.storageDomainId = :storageDomainId
""")
	fun findByStorageDomainIdWithDetails(
		@Param("storageDomainId") storageDomainId: UUID
	): List<UnregisteredDiskEntity>
	// Find by the disk_id part of the composite key
	fun findByIdDiskId(diskId: UUID): List<UnregisteredDiskEntity> // Might return multiple if disk_id isn't globally unique across storage domains
*/

}
