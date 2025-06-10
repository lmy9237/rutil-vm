package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.common.gson
import org.hibernate.annotations.Immutable
import org.hibernate.annotations.Type
import java.time.LocalDateTime
import java.util.UUID
import java.io.Serializable
import java.math.BigDecimal
import java.math.BigInteger
import javax.persistence.Id
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Table

/**
 *
 * [SnapshotEntity]
 * 디스크 기본정보
 *
 * @property appList [String]
 * @property changedFields [String]
 * @property creationDate [LocalDateTime]
 * @property description [String]
 * @property memoryDumpDiskId [UUID]
 * @property memoryMetadataDiskId [UUID]
 * @property snapshotId [UUID]
 * @property snapshotType [String]
 * @property status [String]
 * @property vmConfiguration [String]
 * @property vmConfigurationBroken [Boolean]
 * @property vmId [UUID]
 */
@Entity
@Immutable
@Table(name = "snapshots")
class SnapshotEntity(

	// val _createDate: String = "",
	// val _updateDate: String = "",
	val appList: String = "",
	val changedFields: String = "",
	val creationDate: LocalDateTime? = LocalDateTime.now(),
	val description: String = "",
	val memoryDumpDiskId: UUID? = null,
	val memoryMetadataDiskId: UUID? = null,
	@Id
	@Column(name = "snapshot_id", unique = true, nullable = true)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val snapshotId: UUID? = null,
	val snapshotType: String = "",
	val status: String = "",
	val vmConfiguration: String = "",
	val vmConfigurationBroken: Boolean = false,
	@Column(name = "vm_id", unique = true, nullable = true)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val vmId: UUID? = null,

): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bAppList: String = ""; fun appList(block: () -> String?) { bAppList = block() ?: "" }
		private var bChangedFields: String = ""; fun changedFields(block: () -> String?) { bChangedFields = block() ?: "" }
		private var bCreationDate: LocalDateTime = LocalDateTime.now(); fun creationDate(block: () -> LocalDateTime?) { bCreationDate = block() ?: LocalDateTime.now() }
		private var bDescription: String = ""; fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bMemoryDumpDiskId: UUID? = null; fun memoryDumpDiskId(block: () -> UUID?) { bMemoryDumpDiskId = block() }
		private var bMemoryMetadataDiskId: UUID? = null; fun memoryMetadataDiskId(block: () -> UUID?) { bMemoryMetadataDiskId = block() }
		private var bSnapshotId: UUID? = null; fun snapshotId(block: () -> UUID?) { bSnapshotId = block() }
		private var bSnapshotType: String = ""; fun snapshotType(block: () -> String?) { bSnapshotType = block() ?: "" }
		private var bStatus: String = ""; fun status(block: () -> String?) { bStatus = block() ?: "" }
		private var bVmConfiguration: String = ""; fun vmConfiguration(block: () -> String?) { bVmConfiguration = block() ?: "" }
		private var bVmConfigurationBroken: Boolean = false; fun vmConfigurationBroken(block: () -> Boolean?) { bVmConfigurationBroken = block() ?: false }
		private var bVmId: UUID? = null; fun vmId(block: () -> UUID?) { bVmId = block() }

		fun build(): SnapshotEntity = SnapshotEntity(bAppList, bChangedFields, bCreationDate, bDescription, bMemoryDumpDiskId, bMemoryMetadataDiskId, bSnapshotId, bSnapshotType, bStatus, bVmConfiguration, bVmConfigurationBroken, bVmId, )
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): SnapshotEntity = Builder().apply(block).build()
	}
}

