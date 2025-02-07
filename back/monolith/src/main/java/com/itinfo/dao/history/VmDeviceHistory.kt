package com.itinfo.dao.history

import com.itinfo.dao.gson
import com.itinfo.model.VmDeviceVo

import java.io.Serializable
import java.util.UUID
import java.time.LocalDateTime
import javax.persistence.Entity
import javax.persistence.Table
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Column
import javax.persistence.Id

/**
 * [VmDeviceHistory]
 * ovirt_engine_history 엔티티: VM_DEVICE_HISTORY
 *
 * COMPUTING-SQL > COMPUTING
 * @see com.itinfo.model.VmNetworkUsageVo
 */
@Entity
@Table(name = "VM_DEVICE_HISTORY")
class VmDeviceHistory(
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(unique = true, nullable = false)
	var historyId: Int,

	var deleteDate: LocalDateTime,
	@org.hibernate.annotations.Type(type="org.hibernate.type.PostgresUUIDType")
	var vmId: UUID,
	@org.hibernate.annotations.Type(type="org.hibernate.type.PostgresUUIDType")
	var deviceId: UUID,
	var type: String,
	var address: String,
	var isManaged: Boolean = false,

	@Column(nullable=true)
	var isPlugged: Boolean? = false,

	var isReadonly: Boolean = false,

	@Column(nullable=true)
	var vmConfigurationVersion: Int? = 0,

	@Column(nullable=true)
	var deviceConfigurationVersion: Int? = 0,

	var createDate: LocalDateTime,

	@Column(nullable=true)
	var updateDate: LocalDateTime? = null,
): Serializable {
	override fun toString(): String = gson.toJson(this)
}

fun VmDeviceHistory.toVmDeviceVo(): VmDeviceVo = VmDeviceVo.vmDeviceVo {
	historyId { this@toVmDeviceVo.historyId.toString() }
	type { this@toVmDeviceVo.type }
	address { this@toVmDeviceVo.address }
	readonly { this@toVmDeviceVo.isReadonly }
	plugged { this@toVmDeviceVo.isPlugged }
	managed { this@toVmDeviceVo.isManaged }
	deviceId { this@toVmDeviceVo.deviceId.toString() }
}

fun List<VmDeviceHistory>.toVmDeviceVos(): List<VmDeviceVo> =
	this.map { it.toVmDeviceVo() }