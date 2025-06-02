package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.common.gson
import org.hibernate.annotations.Type
import org.slf4j.LoggerFactory
import java.util.UUID
import java.io.Serializable
// Or jakarta.persistence.* for newer Spring Boot
import javax.persistence.Column
import javax.persistence.Embeddable
import javax.persistence.EmbeddedId
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.JoinColumn
import javax.persistence.JoinColumns
import javax.persistence.ManyToOne
import javax.persistence.Table

@Embeddable
data class UnregisteredDiskToVmId(
	@Column(name = "disk_id", nullable = false)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	var diskId: UUID? = null,

	@Column(name = "entity_id", nullable = false)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	var entityId: UUID? = null,

	@Column(name = "storage_domain_id", nullable = false)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	var storageDomainId: UUID? = null, // Default for construction, should be set
) : Serializable

@Entity
@Table(name = "unregistered_disks_to_vms")
data class UnregisteredDiskToVmEntity(
	@EmbeddedId
	var id: UnregisteredDiskToVmId = UnregisteredDiskToVmId(),

	@Column(name = "entity_name", length = 255)
	val entityName: String? = null, // Renamed to avoid clash if entity_name is a field in related entities

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumns(
		JoinColumn(name = "disk_id", referencedColumnName = "disk_id", insertable = false, updatable = false),
		JoinColumn(name = "storage_domain_id", referencedColumnName = "storage_domain_id", insertable = false, updatable = false)
	)
	var unregisteredDisk: UnregisteredDiskEntity? = null,

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumns(
		JoinColumn(name = "entity_id", referencedColumnName = "entity_guid", insertable = false, updatable = false),
		// The storage_domain_id in unregistered_disks_to_vms maps to the storage_domain_id part of UnregisteredOvfEntity's composite key
		JoinColumn(name = "storage_domain_id", referencedColumnName = "storage_domain_id", insertable = false, updatable = false)
	)
	var unregisteredOvfOfEntities: UnregisteredOvfOfEntities? = null

) : Serializable {
	override fun toString(): String =
		gson.toJson(this)

	override fun equals(other: Any?): Boolean {
		if (this === other) return true
		if (javaClass != other?.javaClass) return false
		other as UnregisteredDiskToVmEntity
		return id == other.id
	}

	override fun hashCode(): Int = id.hashCode()

	// Helper methods to associate entities correctly
	fun associateEntities(disk: UnregisteredDiskEntity, ovfEntity: UnregisteredOvfOfEntities) {
		// Set the ID components from the associated entities
		this.id.diskId = disk.id.diskId
		this.id.entityId = ovfEntity.id?.entityGuid
		// The storage_domain_id in UnregisteredDiskToVmId should be consistent.
		// It is part of the PK of UnregisteredDiskToVm and also part of the FKs.
		// It should typically match disk.id.storageDomainId and ovfEntity.id.storageDomainId
		// Assuming they are indeed the same storage domain for this linkage:
		if (disk.id.storageDomainId != ovfEntity.id?.storageDomainId) {
			// This scenario might indicate a modeling issue or a specific oVirt logic
			// For now, we'll pick one, or you might need a more complex rule.
			// The DDL implies storage_domain_id in unregistered_disks_to_vms FKs to unregistered_disks.
			// Let's assume it's derived from the disk.
			this.id.storageDomainId = disk.id.storageDomainId
		} else {
			this.id.storageDomainId = disk.id.storageDomainId
		}

		this.unregisteredDisk = disk
		this.unregisteredOvfOfEntities = ovfEntity
		disk.diskToVmEntries.add(this)
		ovfEntity.diskToVmEntries.add(this)
	}


	class Builder {
		private var bId: UnregisteredDiskToVmId = UnregisteredDiskToVmId(); fun id(block: () -> UnregisteredDiskToVmId?) { bId = block() ?: UnregisteredDiskToVmId() }
		fun diskId(block: () -> UUID?) { bId.diskId = block() ?: UUID.randomUUID() }
		fun entityId(block: () -> UUID?) { bId.entityId = block() ?: UUID.randomUUID() }
		fun storageDomainIdForId(block: () -> UUID?) { bId.storageDomainId = block() ?: UUID.randomUUID() }
		private var bEntityName: String? = ""; fun entityName(block: () -> String?) { bEntityName = block() }
		private var bUnregisteredDisk: UnregisteredDiskEntity? = null; fun unregisteredDisk(block: () -> UnregisteredDiskEntity?) { bUnregisteredDisk = block() }
		private var bUnregisteredOvfOfEntities: UnregisteredOvfOfEntities? = null; fun unregisteredOvfOfEntities(block: () -> UnregisteredOvfOfEntities?) { bUnregisteredOvfOfEntities = block() }

		fun build(): UnregisteredDiskToVmEntity {
			val entry = UnregisteredDiskToVmEntity(
				id = bId,
				bEntityName,
			// Associations will be set manually or via helper
			)
			// If entities are provided, try to set ID parts and associate
			if (bUnregisteredDisk != null && bUnregisteredOvfOfEntities != null) {
				entry.id.diskId = bUnregisteredDisk!!.id.diskId
				entry.id.entityId = bUnregisteredOvfOfEntities?.id?.entityGuid

				// Important: storage_domain_id in UnregisteredDiskToVmId must be consistent.
				// It's part of the PK of UnregisteredDiskToVm.
				// It's also part of the FK to UnregisteredDisk.
				// And it's used in the FK (conceptually) to UnregisteredOvfEntity.
				// The DDL FK for unregistered_disks_to_vms points (disk_id, storage_domain_id) to unregistered_disks.
				// So, this storage_domain_id should come from bUnregisteredDisk.
				entry.id.storageDomainId = bUnregisteredDisk?.id?.storageDomainId

				// Verify consistency if possible (or handle specific oVirt logic)
				if (bUnregisteredDisk?.id?.storageDomainId != bUnregisteredOvfOfEntities?.id?.storageDomainId) {
					log.debug("Warning: Storage domain ID mismatch between associated disk and OVF entity for UnregisteredDiskToVm. Using disk's storage domain ID for the join entry's ID.")
					// Depending on requirements, this might be an error or expected.
				}

				entry.unregisteredDisk = bUnregisteredDisk
				entry.unregisteredOvfOfEntities = bUnregisteredOvfOfEntities
				// Add to collections (usually done by the owning side or a service method)
				// bUnregisteredDisk?.diskToVmEntries?.add(entry)
				// bUnregisteredOvfEntity?.diskToVmEntries?.add(entry)
			} else if (bId.diskId == UUID(0,0) || bId.entityId == UUID(0,0) || bId.storageDomainId == UUID(0,0)) {
				// If full entities are not provided, ID components must be set
				// Throw exception if ID is not properly initialized
				throw IllegalStateException("UnregisteredDiskToVm ID components (diskId, entityId, storageDomainId) must be set if not derived from associated entities.")
			}
			return entry
		}
	}
	companion object {
		inline fun builder(block: Builder.() -> Unit): UnregisteredDiskToVmEntity = Builder().apply(block).build()
	}
}

private val log = LoggerFactory.getLogger(UnregisteredDiskToVmEntity::class.java)
