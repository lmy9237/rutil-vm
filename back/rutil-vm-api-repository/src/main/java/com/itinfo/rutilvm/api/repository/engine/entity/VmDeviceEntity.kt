package com.itinfo.rutilvm.api.repository.engine.entity

import com.google.gson.annotations.SerializedName
import com.itinfo.rutilvm.common.fromJson
import com.itinfo.rutilvm.common.gson // Assuming you have this
import org.hibernate.annotations.Type
import java.util.UUID
import java.io.Serializable
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.Table
import java.time.OffsetDateTime

/**
 * [VmDeviceEntity]
 * 가상머신 장치
 *
 * @author 이찬희 (@chanhi2000)
 */
@Entity
@Table(name = "vm_device")
class VmDeviceEntity(
	@Id
	@Column(name="device_id", unique = true, nullable = true)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val deviceId: UUID? = null,

	@Column(name="vm_id", unique = true, nullable = true)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val vmId: UUID? = null,

	@Column(name = "type", nullable = false)
	val type: String? = "",
	@Column(name = "device", nullable = false)
	private var _device: String? = "",
	val address: String? = "",
	@Column(name = "spec_params", nullable = false)
	var _specParams: String? = null,
	val isManaged: Boolean? = false,
	val isPlugged: Boolean? = false,
	val isReadonly: Boolean = false,
	@Column(name = "_create_date")
	val createDate: OffsetDateTime? = null, // Using OffsetDateTime for timestamptz
	@Column(name = "_update_date")
	val updateDate: OffsetDateTime? = null,
	val alias: String = "",
	val customProperties: String? = null,
	val logicalName: String? = null,
	val hostDevice: String? = null,

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(
		name="vm_id",
		referencedColumnName="vm_guid",
		insertable=false,
		updatable=false
	)
	val vm: VmStaticEntity? = null,

	// This is a standard FK relationship to the snapshots table.
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(
		name="snapshot_id",
		referencedColumnName="snapshot_id",
		insertable=false,
		updatable=false
	)
	val snapshot: SnapshotEntity? = null,
) : Serializable {

	var device: String?
		get() = this@VmDeviceEntity._device
		set(newVal) {
			this@VmDeviceEntity._device = newVal
			when(_device) {
				"qxl" -> specParams = VmDeviceQxlSpecParams()
				"vga" -> specParams = VmDeviceVgaSpecParams()
				// else ->
			}
		}

	var specParams: VmDeviceSpecParams 			get() = gson.fromJson<VmDeviceSpecParams>(_specParams ?: "{}")
														set(newVal) {
															_specParams = gson.toJson(newVal)
														}
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bDeviceId: UUID? = null; fun deviceId(block: () -> UUID?) { bDeviceId = block() }
		private var bVmId: UUID? = null; fun vmId(block: () -> UUID?) { bVmId = block() }
		private var bType: String = ""; fun type(block: () -> String?) { bType = block() ?: "" }
		private var bDevice: String = ""; fun device(block: () -> String?) { bDevice = block() ?: "" }
		private var bAddress: String = ""; fun address(block: () -> String?) { bAddress = block() ?: "" }
		private var bSpecParams: String? = null; fun specParams(block: () -> String?) { bSpecParams = block() }
		private var bIsManaged: Boolean = false; fun isManaged(block: () -> Boolean?) { bIsManaged = block() ?: false }
		private var bIsPlugged: Boolean = false; fun isPlugged(block: () -> Boolean?) { bIsPlugged = block() ?: false }
		private var bIsReadOnly: Boolean = false; fun isReadOnly(block: () -> Boolean?) { bIsReadOnly = block() ?: false }
		private var bCreateDate: OffsetDateTime? = null; fun createDate(block: () -> OffsetDateTime?) { bCreateDate = block() }
		private var bUpdateDate: OffsetDateTime? = null; fun updateDate(block: () -> OffsetDateTime?) { bUpdateDate = block() }
		private var bAlias: String = ""; fun alias(block: () -> String?) { bAlias = block() ?: "" }
		private var bCustomProperties: String? = null; fun customProperties(block: () -> String?) { bCustomProperties = block() }
		private var bLogicalName: String? = null; fun logicalName(block: () -> String?) { bLogicalName = block() }
		private var bHostDevice: String? = null; fun hostDevice(block: () -> String?) { bHostDevice = block() }
		private var bVm: VmStaticEntity? = null; fun vm(block: () -> VmStaticEntity?) { bVm = block() }
		private var bSnapshot: SnapshotEntity? = null; fun snapshot(block: () -> SnapshotEntity?) { bSnapshot = block() }

		fun build(): VmDeviceEntity = VmDeviceEntity(bDeviceId, bVmId, bType, bDevice, bAddress, bSpecParams, bIsManaged, bIsPlugged, bIsReadOnly, bCreateDate, bUpdateDate, bAlias, bCustomProperties, bLogicalName, bHostDevice, bVm, bSnapshot)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): VmDeviceEntity = Builder().apply(block).build()
	}
}

sealed class VmDeviceSpecParams(
	@SerializedName("vram") open val vram: String? = "16384",
): Serializable {}

class VmDeviceVgaSpecParams(
): VmDeviceSpecParams() {
}

class VmDeviceQxlSpecParams(
	@SerializedName("vgamem") val vgamem: String? = "16384",
	@SerializedName("heads") val heads: String? = "1",
	@SerializedName("ram") val ram: String? = "65536",
): VmDeviceSpecParams("32768") {
}
