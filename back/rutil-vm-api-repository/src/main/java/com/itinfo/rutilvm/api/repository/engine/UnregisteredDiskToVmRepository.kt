package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.UnregisteredDiskId
import com.itinfo.rutilvm.api.repository.engine.entity.UnregisteredDiskToVmId
import com.itinfo.rutilvm.api.repository.engine.entity.UnregisteredDiskEntity
import com.itinfo.rutilvm.api.repository.engine.entity.UnregisteredDiskToVmEntity
import com.itinfo.rutilvm.api.repository.engine.entity.UnregisteredOvfEntityId
import com.itinfo.rutilvm.api.repository.engine.entity.UnregisteredOvfOfEntities
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface UnregisteredDiskToVmRepository : JpaRepository<UnregisteredDiskToVmEntity, UnregisteredDiskToVmId> {
	fun findByIdDiskId(diskId: UUID): List<UnregisteredDiskToVmEntity>
	fun findByIdEntityId(entityId: UUID): List<UnregisteredDiskToVmEntity>
	fun findByIdStorageDomainId(storageDomainId: UUID): List<UnregisteredDiskToVmEntity>
	// Find associations by the full UnregisteredDisk object
	// Spring Data JPA can derive this based on the property name 'unregisteredDisk' and its ID.
	fun findByUnregisteredDisk(unregisteredDisk: UnregisteredDiskEntity): List<UnregisteredDiskToVmEntity>
	// Find associations by the full UnregisteredOvfEntity object
	fun findByUnregisteredOvfOfEntities(unregisteredOvfOfEntities: UnregisteredOvfOfEntities): List<UnregisteredDiskToVmEntity>
	// More specific: Find associations for a specific disk (by its full composite ID)
	fun findByUnregisteredDiskId(diskId: UnregisteredDiskId): List<UnregisteredDiskToVmEntity>

	// More specific: Find associations for a specific OVF entity (by its full composite ID)
	// fun findByUnregisteredOvfEntityId(ovfEntityId: UnregisteredOvfEntityId): List<UnregisteredDiskToVmEntity>

	// Find a specific association by disk_id and entity_id (and implicitly storage_domain_id if it's unique for the pair)
	// This query might be too broad if storage_domain_id can vary for the same disk_id and entity_id pair.
	// The findById(UnregisteredDiskToVmId) is more precise.
	fun findByIdDiskIdAndIdEntityId(diskId: UUID, entityId: UUID): List<UnregisteredDiskToVmEntity>

	// --- Queries to get related entities directly ---
	// Get all UnregisteredOvfEntity associated with a specific UnregisteredDisk
	@Query("""
SELECT udtv.unregisteredOvfOfEntities FROM UnregisteredDiskToVmEntity udtv WHERE 1=1
AND udtv.unregisteredDisk = :disk
""")
	fun findOvfEntitiesByDisk(
		@Param("disk") disk: UnregisteredDiskEntity
	): List<UnregisteredOvfOfEntities>

	// Get all UnregisteredDisk associated with a specific UnregisteredOvfEntity
	@Query("""
SELECT udtv.unregisteredDisk FROM UnregisteredDiskToVmEntity udtv WHERE 1=1
AND udtv.unregisteredOvfOfEntities = :ovfEntity
""")
	fun findDisksByOvfEntity(
		@Param("ovfEntity") ovfEntity: UnregisteredOvfOfEntities
	): List<UnregisteredDiskEntity>

	// Example: Get all UnregisteredDisks associated with an UnregisteredOvfEntity identified by its entity_guid and storage_domain_id
	@Query("""
SELECT udtv.unregisteredDisk FROM UnregisteredDiskToVmEntity udtv WHERE 1=1
AND udtv.unregisteredOvfOfEntities.id.entityGuid = :entityGuid
AND udtv.unregisteredOvfOfEntities.id.storageDomainId = :storageDomainId
""")
	fun findDisksByOvfEntityGuidAndStorageDomainId(
		@Param("entityGuid") entityGuid: UUID,
		@Param("storageDomainId") storageDomainId: UUID
	): List<UnregisteredDiskEntity>

	// Example: Get all UnregisteredOvfEntities associated with an UnregisteredDisk identified by its disk_id and storage_domain_id
	@Query("""
SELECT udtv.unregisteredOvfOfEntities FROM UnregisteredDiskToVmEntity udtv WHERE 1=1
AND udtv.unregisteredDisk.id.diskId = :diskId
AND udtv.unregisteredDisk.id.storageDomainId = :storageDomainId
    """)
	fun findOvfEntitiesByDiskIdAndStorageDomainId(
		@Param("diskId") diskId: UUID,
		@Param("storageDomainId") storageDomainId: UUID
	): List<UnregisteredOvfOfEntities>
}
