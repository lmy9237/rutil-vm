package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.api.ovirt.business.DiskInterfaceB
import com.itinfo.rutilvm.common.gson
//import com.itinfo.rutilvm.api.model.storage.DiskImageVo

import org.hibernate.annotations.Type
import org.slf4j.LoggerFactory
import java.io.Serializable
import java.util.UUID
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table

private val log = LoggerFactory.getLogger(DiskVmElementEntity::class.java)

/**
 * [DiskVmElementEntity]
 *
 * @property diskId [UUID]
 * @property vmId [UUID]
 * @property isBoot [Boolean]
 * @property diskInterface [String]
 * @property isUsingScsiReservation [Boolean]
 * @property passDiscard [Boolean]
 */
@Entity
@Table(name="disk_vm_element", schema = "public")
class DiskVmElementEntity(
	@Id
    @Type(type = "org.hibernate.type.PostgresUUIDType")
	@Column(name="disk_id", unique = true, nullable = true)
    val diskId: UUID? = null,

	@Type(type = "org.hibernate.type.PostgresUUIDType")
	@Column(name="vm_id", unique = true, nullable = true)
	val vmId: UUID? = null,

	val isBoot: Boolean = false,
	@Column(name="disk_interface", unique = true, nullable = true)
	private val _diskInterface: String = "",
	val isUsingScsiReservation: Boolean = false,
	val passDiscard: Boolean = false,

): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	val diskInterface: DiskInterfaceB?
		get() = DiskInterfaceB.forCode(_diskInterface)

	class Builder {
		private var bDiskId: UUID? = null; fun diskId(block: () -> UUID?) { bDiskId = block() }
		private var bVmId: UUID? = null; fun vmId(block: () -> UUID?) { bVmId = block() }
		private var bIsBoot: Boolean = false; fun isBoot(block: () -> Boolean?) { bIsBoot = block() ?: false }
		private var bDiskInterface: String = ""; fun diskInterface(block: () -> String?) { bDiskInterface = block() ?: "" }
		private var bIsUsingScsiReservation: Boolean = false; fun isUsingScsiReservation(block: () -> Boolean?) { bIsUsingScsiReservation = block() ?: false }
		private var bPassDiscard: Boolean = false; fun passDiscard(block: () -> Boolean?) { bPassDiscard = block() ?: false }
		fun build(): DiskVmElementEntity = DiskVmElementEntity(bDiskId, bVmId, bIsBoot, bDiskInterface, bIsUsingScsiReservation, bPassDiscard, )
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): DiskVmElementEntity = Builder().apply(block).build()
	}
}

fun DiskVmElementEntity.toVmId(): String {
	return vmId.toString()
}
fun List<DiskVmElementEntity>.toVmIds(): List<String> =
	this@toVmIds.map { it.toVmId() }

fun DiskVmElementEntity.toDiskId(): String {
	return diskId.toString()
}
fun List<DiskVmElementEntity>.toDiskIds(): List<String> =
	this@toDiskIds.map { it.toDiskId() }
/*
fun DiskVmElementEntity.toVmDisk(): DiskImageVo{
	return DiskImageVo.builder {

	}
}
*/
