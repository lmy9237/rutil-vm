package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.common.gson
import org.hibernate.annotations.Type
import java.util.UUID
import java.io.Serializable
import java.math.BigInteger
import java.time.LocalDateTime
import javax.persistence.CascadeType
// Or jakarta.persistence.* for newer Spring Boot
import javax.persistence.Column
import javax.persistence.Embeddable
import javax.persistence.EmbeddedId
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.OneToMany
import javax.persistence.Table
import javax.persistence.Temporal
import javax.persistence.TemporalType


@Embeddable
data class UnregisteredDiskId(
	@Column(name = "disk_id", nullable = false)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	var diskId: UUID? = null,

	@Column(name = "storage_domain_id", nullable = false)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	var storageDomainId: UUID? = null, // Default for construction, should be set
) : Serializable

@Entity
@Table(name = "unregistered_disks")
data class UnregisteredDiskEntity(
	@EmbeddedId
	var id: UnregisteredDiskId = UnregisteredDiskId(),
	val diskAlias: String? = "",
	val diskDescription: String? = "",

	@Column(name = "creation_date", nullable = false)
	val creationDate: LocalDateTime? = LocalDateTime.now(),

	@Column(name = "last_modified", nullable = true)
	val lastModified: LocalDateTime? = null,

	val volumeType: Int? = null,
	val volumeFormat: Int? = null,
	val actualSize: BigInteger? = BigInteger.ZERO,
	val size: BigInteger? = BigInteger.ZERO,
	@Column(name = "image_id", nullable = false)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val imageId: UUID? = null,

	@OneToMany(
		mappedBy="unregisteredDisk",
		cascade=[CascadeType.ALL],
		orphanRemoval=true,
		fetch= FetchType.LAZY
	)
	val diskToVmEntries: MutableSet<UnregisteredDiskToVmEntity> = mutableSetOf()
) : Serializable {
	override fun toString(): String =
		gson.toJson(this)

	// equals and hashCode are important for Set operations in ManyToMany
	override fun equals(other: Any?): Boolean {
		if (this === other) return true
		if (javaClass != other?.javaClass) return false
		other as UnregisteredDiskEntity
		return id == other.id
	}

	override fun hashCode(): Int =
		id.hashCode()

	class Builder {
		private var bId: UnregisteredDiskId = UnregisteredDiskId(); fun id(block: () -> UnregisteredDiskId?) { bId = block() ?: UnregisteredDiskId() }
		fun diskId(block: () -> UUID?) { bId.diskId = block() ?: UUID.randomUUID() }
		fun storageDomainIdForId(block: () -> UUID?) { bId.storageDomainId = block() ?: UUID.randomUUID() } // Renamed to avoid clash
		private var bDiskAlias: String? = ""; fun diskAlias(block: () -> String?) { bDiskAlias = block() }
		private var bDescription: String? = ""; fun description(block: () -> String?) { bDescription = block() }
		private var bCreationDate: LocalDateTime? = null; fun creationDate(block: () -> LocalDateTime?) { bCreationDate = block() }
		private var bLastModified: LocalDateTime? = null; fun lastModified(block: () -> LocalDateTime?) { bLastModified = block() }
		private var bVolumeType: Int? = null; fun volumeType(block: () -> Int?) { bVolumeType = block() }
		private var bVolumeFormat: Int? = null; fun volumeFormat(block: () -> Int?) { bVolumeFormat = block() }
		private var bActualSize: BigInteger? = BigInteger.ZERO; fun actualSize(block: () -> BigInteger?) { bActualSize = block() ?: BigInteger.ZERO}
		private var bDiskSize: BigInteger? = BigInteger.ZERO; fun diskSize(block: () -> BigInteger?) { bDiskSize = block() ?: BigInteger.ZERO } // Mapped to "size"
		private var bImageId: UUID? = null; fun imageId(block: () -> UUID?) { bImageId = block() }
		private var bDiskToVmEntries: MutableSet<UnregisteredDiskToVmEntity> = mutableSetOf(); fun diskToVmEntries(block: () -> MutableSet<UnregisteredDiskToVmEntity>?) { bDiskToVmEntries = block() ?: mutableSetOf() }

		fun build(): UnregisteredDiskEntity {
			return UnregisteredDiskEntity(
				bId, bDiskAlias, bDescription, bCreationDate, bLastModified,
				bVolumeType, bVolumeFormat, bActualSize, bDiskSize, bImageId, bDiskToVmEntries
			)
		}
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): UnregisteredDiskEntity = Builder().apply(block).build()
	}
}
