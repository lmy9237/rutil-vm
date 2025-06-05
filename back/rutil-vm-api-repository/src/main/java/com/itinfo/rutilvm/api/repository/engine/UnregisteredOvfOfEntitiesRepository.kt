package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.UnregisteredOvfOfEntities
import com.itinfo.rutilvm.api.repository.engine.entity.UnregisteredOvfEntityId
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface UnregisteredOvfOfEntitiesRepository : JpaRepository<UnregisteredOvfOfEntities, UnregisteredOvfEntityId> {

	// Find by the storage_domain_id part of the composite key
	fun findByIdStorageDomainId(
		storageDomainId: UUID
	): List<UnregisteredOvfOfEntities>

	// Find by the entity_guid part of the composite key
	fun findByIdEntityGuid(
		entityGuid: UUID
	): List<UnregisteredOvfOfEntities>

	// Find by entity type
	fun findByEntityType(
		entityType: String
	): List<UnregisteredOvfOfEntities>

	// Find by entity type on a specific storage domain
	@Query("""
SELECT uo FROM UnregisteredOvfOfEntities uo WHERE 1=1
AND uo.id.storageDomainId = :storageDomainId
AND uo.entityType = :entityType
""")
	fun findByStorageDomainIdAndEntityType(
		@Param("storageDomainId") storageDomainId: UUID,
		@Param("entityType") entityType: String
	): List<UnregisteredOvfOfEntities>

	// Find by status
	fun findByStatus(status: Int): List<UnregisteredOvfOfEntities>
}
