package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.common.formatEnhanced
import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.common.ovirtDf
import org.hibernate.annotations.Type
import org.slf4j.LoggerFactory
import java.time.LocalDateTime
import java.util.UUID
import java.io.Serializable
import java.sql.Timestamp
// Or jakarta.persistence.* for newer Spring Boot
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.Table

private val log = LoggerFactory.getLogger(VmSnapshotEntity::class.java)

/**
 *
 * [VmSnapshotEntity]
 * 가상머신 스냅샷
 *
 * @property snapshotId [UUID]
 * @property description [String] The overall VM snapshot description
 * @property creationDate [LocalDateTime] Creation date of the VM snapshot
 * @property vm [VmStaticEntity]
 *
 * @see VmStaticEntity
 */
@Entity
@Table(name = "snapshots")
class VmSnapshotEntity(
	@Id
	@Column(name="snapshot_id", unique = true, nullable = true)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val snapshotId: UUID? = null,
	val description: String? = "",
	val creationDate: LocalDateTime? = null,

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "vm_id", referencedColumnName = "vm_guid")
	val vm: VmStaticEntity? = VmStaticEntity()
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bSnapshotId: UUID? = null;fun snapshotId(block: () -> UUID?) { bSnapshotId = block() }
		private var bDescription: String = "";fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bCreationDate: LocalDateTime? = null;fun creationDate(block: () -> LocalDateTime?) { bCreationDate = block() }
		private var bVm: VmStaticEntity? = VmStaticEntity();fun vm(block: () -> VmStaticEntity?) { bVm = block() ?: VmStaticEntity() }
		fun build(): VmSnapshotEntity = VmSnapshotEntity(bSnapshotId, bDescription, bCreationDate, bVm)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): VmSnapshotEntity = Builder().apply(block).build()
	}
}
