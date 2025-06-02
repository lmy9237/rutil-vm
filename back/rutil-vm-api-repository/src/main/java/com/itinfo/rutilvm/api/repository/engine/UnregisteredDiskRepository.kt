package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.UnregisteredDiskEntity
import com.itinfo.rutilvm.api.repository.engine.entity.UnregisteredDiskId
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface UnregisteredDiskRepository : JpaRepository<UnregisteredDiskEntity, UnregisteredDiskId> {
	fun findByIdStorageDomainId(storageDomainId: UUID): List<UnregisteredDiskEntity>
	// Find by the disk_id part of the composite key
	fun findByIdDiskId(diskId: UUID): List<UnregisteredDiskEntity> // Might return multiple if disk_id isn't globally unique across storage domains

	// Find by alias (Note: alias might not be unique)
	fun findByDiskAlias(diskAlias: String): List<UnregisteredDiskEntity>

	// Find by image_id
	fun findByImageId(imageId: UUID): List<UnregisteredDiskEntity>

	// Example of a custom query to find disks with a specific volume type on a storage domain
	@Query("""
SELECT ud FROM UnregisteredDiskEntity ud WHERE 1=1
AND ud.id.storageDomainId = :storageDomainId
AND ud.volumeType = :volumeType
""")
	fun findByStorageDomainIdAndVolumeType(
		@Param("storageDomainId") storageDomainId: UUID,
		@Param("volumeType") volumeType: Int
	): List<UnregisteredDiskEntity>
}
