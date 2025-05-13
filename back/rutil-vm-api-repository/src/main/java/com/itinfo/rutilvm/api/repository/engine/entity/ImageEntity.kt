package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.common.gson
import org.hibernate.annotations.Type
import org.slf4j.LoggerFactory
import java.time.LocalDateTime
import java.util.UUID
import java.io.Serializable
import java.math.BigInteger
// Or jakarta.persistence.* for newer Spring Boot
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.JoinTable
import javax.persistence.ManyToMany
import javax.persistence.ManyToOne
import javax.persistence.OneToMany
import javax.persistence.Table

private val log = LoggerFactory.getLogger(ImageEntity::class.java)

/**
 *
 * [ImageEntity]
 * Represents disk images, including snapshots
 *
 * @property imageGuid [UUID]
 * @property description [String] Description of this specific disk image
 * @property creationDate [LocalDateTime] Creation date of this disk image
 * @property active [UUID]
 * @property vmSnapshot [VmSnapshotEntity] Renamed to avoid clash with Snapshot annotation
 * @property baseDisk [BaseDiskEntity]
 * @property storageDomains List<[ImageStorageDomainMapEntity]>
 *
 * @see VmSnapshotEntity
 * @see BaseDiskEntity
 * @see ImageStorageDomainMapEntity
 */
@Entity
@Table(name = "images")
class ImageEntity(
	@Id
	@Column(name="image_guid", unique = true, nullable = true)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val imageGuid: UUID? = null,
	val description: String? = "",
	val size: BigInteger? = BigInteger.ZERO,
	val creationDate: LocalDateTime?,
	val active: Boolean? = false,

	// Crucial link to the VM Snapshot entity
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "vm_snapshot_id", referencedColumnName = "snapshot_id")
	val vmSnapshot: VmSnapshotEntity?,

	// Link to the "logical" disk this image belongs to
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "image_group_id", referencedColumnName = "disk_id")
	val baseDisk: BaseDiskEntity?,

	// Images are mapped to Storage Domains
	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(
		name = "image_storage_domain_map",
		joinColumns = [JoinColumn(name = "image_id", referencedColumnName = "image_guid")],
		inverseJoinColumns = [JoinColumn(name = "storage_domain_id", referencedColumnName = "id")]
	)
	val storageDomains: Set<StorageDomainStaticEntity>? = hashSetOf()
	/*
	@OneToMany(mappedBy = "image", fetch = FetchType.LAZY)
	val imageStorageDomainMaps: Set<ImageStorageDomainMapEntity>? = hashSetOf()
	*/
): Serializable {
	override fun toString(): String = gson.toJson(this)

	class Builder {
		private var bImageGuid: UUID? = null;fun imageGuid(block: () -> UUID?) { bImageGuid = block() }
		private var bDescription: String? = "";fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bSize: BigInteger? = BigInteger.ZERO;fun size(block: () -> BigInteger?) { bSize = block() ?: BigInteger.ZERO }
		private var bCreationDate: LocalDateTime? = null;fun creationDate(block: () -> LocalDateTime?) { bCreationDate = block() }
		private var bActive: Boolean? = false;fun active(block: () -> Boolean?) { bActive = block() ?: false }
		private var bVmSnapshot: VmSnapshotEntity? = VmSnapshotEntity();fun vmSnapshot(block: () -> VmSnapshotEntity?) { bVmSnapshot = block() ?: VmSnapshotEntity() }
		private var bBaseDisk: BaseDiskEntity? = BaseDiskEntity();fun baseDisk(block: () -> BaseDiskEntity?) { bBaseDisk = block() ?: BaseDiskEntity() }
		private var bStorageDomains: Set<StorageDomainStaticEntity>? = hashSetOf();fun storageDomains(block: () -> Set<StorageDomainStaticEntity>?) { bStorageDomains = block() ?: hashSetOf() }
		// private var bImageStorageDomainMaps: Set<ImageStorageDomainMapEntity>? = hashSetOf();fun imageStorageDomainMaps(block: () -> Set<ImageStorageDomainMapEntity>?) { bImageStorageDomainMaps = block() ?: hashSetOf() }
		fun build(): ImageEntity = ImageEntity(bImageGuid, bDescription, bSize, bCreationDate, bActive, bVmSnapshot, bBaseDisk, bStorageDomains)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): ImageEntity = Builder().apply(block).build()
	}
}
