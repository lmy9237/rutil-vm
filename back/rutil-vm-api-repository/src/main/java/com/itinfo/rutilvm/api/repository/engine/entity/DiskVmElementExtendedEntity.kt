package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.common.gson
import org.hibernate.annotations.Type
import java.util.UUID
import java.io.Serializable
// Or jakarta.persistence.* for newer Spring Boot
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table

/**
 *
 * [DiskVmElementExtendedEntity]
 * DiskAttachment
 *
 * @property diskId [UUID]
 */
@Entity
@Table(name = "disk_vm_element_extended")
class DiskVmElementExtendedEntity(
	@Id
	@Column(name = "disk_id", unique = true, nullable = true)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val diskId: UUID? = null,
	@Column(name = "vmId", unique = true, nullable = true)
	val vmId: UUID? = null,
	val isBoot: Boolean? = false,
	val diskInterface: String? = "",
	val isUsingScsiReservation: Boolean? = false,
	val passDiscard: Boolean? = false,
	val isPlugged: Boolean? = false,
	val logicalName: String? = "",
	val isReadonly: Boolean? = false,

): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bDiskId: UUID? = null;fun diskId(block: () -> UUID?) { bDiskId = block() }
		private var bVmId: UUID? = null; fun vmId(block: () -> UUID?) { bVmId = block() }
		private var bIsBoot: Boolean? = false; fun isBoot(block: () -> Boolean?) { bIsBoot = block() }
		private var bDiskInterface: String? = ""; fun diskInterface(block: () -> String?) { bDiskInterface = block() }
		private var bIsUsingScsiReservation: Boolean? = false; fun isUsingScsiReservation(block: () -> Boolean?) { bIsUsingScsiReservation = block() }
		private var bPassDiscard: Boolean? = false; fun passDiscard(block: () -> Boolean?) { bPassDiscard = block() }
		private var bIsPlugged: Boolean? = false; fun isPlugged(block: () -> Boolean?) { bIsPlugged = block() }
		private var bLogicalName: String? = ""; fun logicalName(block: () -> String?) { bLogicalName = block() }
		private var bIsReadonly: Boolean? = false; fun isReadonly(block: () -> Boolean?) { bIsReadonly = block() }

		fun build(): DiskVmElementExtendedEntity = DiskVmElementExtendedEntity(bDiskId, bVmId, bIsBoot, bDiskInterface, bIsUsingScsiReservation, bPassDiscard, bIsPlugged, bLogicalName, bIsReadonly,)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): DiskVmElementExtendedEntity = Builder().apply(block).build()
	}
}
