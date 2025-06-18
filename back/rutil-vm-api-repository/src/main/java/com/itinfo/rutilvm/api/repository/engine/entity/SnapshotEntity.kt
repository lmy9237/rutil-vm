package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.api.ovirt.business.SnapshotType
import com.itinfo.rutilvm.common.gson
import org.hibernate.annotations.Immutable
import org.hibernate.annotations.Type
import java.time.LocalDateTime
import java.util.UUID
import java.io.Serializable
import javax.persistence.Id
import javax.persistence.Column
import javax.persistence.Embeddable
import javax.persistence.Entity
import javax.persistence.Table

@Embeddable
data class SnapshotsId(
	@Column(name = "vm_id", nullable = false)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	var vmId: UUID? = null,

	@Column(name = "snapshot_id", nullable = false)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	var snapshotId: UUID? = null, // Default for construction, should be set
) : Serializable {
}

/**
 * [SnapshotEntity]
 * 스냅샷 기본정보
 *
 * @property snapshotId [UUID]
 * @property vmId [UUID]
 * @property snapshotType [String]
 * @property status [String]
 * @property description [String]
 * @property appList [String]
 * @property vmConfiguration [String]
 * @property creationDate [LocalDateTime]
 * @property updateDate [LocalDateTime]
 * @property memoryDumpDiskId [UUID]
 * @property memoryMetadataDiskId [UUID]
 * @property vmConfigurationBroken [Boolean]
 * @property changedFields [String]
 */
@Entity
@Immutable
@Table(name = "snapshots")
class SnapshotEntity(
	/*@EmbeddedId
	var id: SnapshotsId = SnapshotsId(),*/
	@Id
	@Column(name = "snapshot_id", unique = true, nullable = true)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val snapshotId: UUID? = null,
	@Column(name = "vm_id", unique = true, nullable = true)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val vmId: UUID? = null,
	val snapshotType: String = "",
	val status: String = "",
	val description: String = "",
	val appList: String = "",
	val vmConfiguration: String = "",
	@Column(name="_create_date")
	val creationDate: LocalDateTime? = LocalDateTime.now(),
	@Column(name="_update_date")
	val updateDate: LocalDateTime? = null,
	val memoryMetadataDiskId: UUID? = null,
	val memoryDumpDiskId: UUID? = null,
	val vmConfigurationBroken: Boolean = false,
	val changedFields: String = "",
): Serializable {
	val _snapshotType: SnapshotType
		get() = SnapshotType.forCode(snapshotType.uppercase())

	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bSnapshotId: UUID? = null;fun snapshotId(block: () -> UUID?) { bSnapshotId = block() }
		private var bVmId: UUID? = null;fun vmId(block: () -> UUID?) { bVmId = block() }
		private var bSnapshotType: String = ""; fun snapshotType(block: () -> String?) { bSnapshotType = block() ?: "" }
		private var bStatus: String = "";fun status(block: () -> String?) { bStatus = block() ?: "" }
		private var bDescription: String = "";fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bAppList: String = "";fun appList(block: () -> String?) { bAppList = block() ?: "" }
		private var bVmConfiguration: String = "";fun vmConfiguration(block: () -> String?) { bVmConfiguration = block() ?: "" }
		private var bCreationDate: LocalDateTime? = LocalDateTime.now();fun creationDate(block: () -> LocalDateTime?) { bCreationDate = block() ?: LocalDateTime.now() }
		private var bUpdateDate: LocalDateTime? = null;fun updateDate(block: () -> LocalDateTime?) { bUpdateDate = block() }
		private var bMemoryMetadataDiskId: UUID? = null;fun memoryMetadataDiskId(block: () -> UUID?) { bMemoryMetadataDiskId = block() }
		private var bMemoryDumpDiskId: UUID? = null;fun memoryDumpDiskId(block: () -> UUID?) { bMemoryDumpDiskId = block() }
		private var bVmConfigurationBroken: Boolean = false;fun vmConfigurationBroken(block: () -> Boolean?) { bVmConfigurationBroken = block() ?: false }
		private var bChangedFields: String = "";fun changedFields(block: () -> String?) { bChangedFields = block() ?: "" }

		fun build(): SnapshotEntity = SnapshotEntity(bSnapshotId, bVmId, bSnapshotType, bStatus, bDescription, bAppList, bVmConfiguration, bCreationDate, bUpdateDate, bMemoryMetadataDiskId, bMemoryDumpDiskId, bVmConfigurationBroken, bChangedFields)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): SnapshotEntity = Builder().apply(block).build()
	}
}

