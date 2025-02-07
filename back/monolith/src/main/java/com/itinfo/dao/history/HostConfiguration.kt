package com.itinfo.dao.history

import com.itinfo.dao.gson
import com.itinfo.model.HostSwVo

import org.hibernate.annotations.ColumnDefault

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
 * [HostConfiguration]
 * ovirt_engine_history 엔티티: HOST_CONFIGURATION
 *
 * CLUSTER-SQL > COMPUTE-CLUSTER
 * @see com.itinfo.model.HostSwVo
 */
@Entity
@Table(name = "HOST_CONFIGURATION")
data class HostConfiguration(
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(unique = true, nullable = false)
	val historyId: Int, // auto-generated, auto-incremented

	@org.hibernate.annotations.Type(type="org.hibernate.type.PostgresUUIDType")
	val hostId: UUID,

	@Column(nullable=true)
	var hostUniqueId: String? = "",
	var hostName: String,

	@org.hibernate.annotations.Type(type="org.hibernate.type.PostgresUUIDType")
	val clusterId: UUID,
	var hostType: Int,
	var fqdnOrIp: String,

	@Column(nullable = true)
	var memorySizeMb: Int? = 0,

	@Column(nullable = true)
	var swapSizeMb: Int? = 0,

	@Column(nullable=true)
	var cpuModel: String? = "",

	@Column(nullable = true)
	var numberOfCores: Int? = 0,

	@Column(nullable=true)
	var hostOs: String? = "",

	@Column(nullable=true)
	var kernelVersion: String? = "",

	@Column(nullable=true)
	var kvmVersion: String? = "",

	@Column(nullable=true)
	var vdsmVersion: String? = "",
	var vdsmPort: Int,

	@Column(nullable=true)
	var clusterConfigurationVersion: Int? = 0,

	var createDate: LocalDateTime,
	var updateDate: LocalDateTime,
	var deleteDate: LocalDateTime,

	@Column(nullable=true)
	var numberOfSockets: Int? = 0,

	@Column(nullable=true)
	var cpuSpeedMh: Int? = 0,

	@Column(nullable=true)
	var threadsPerCore: Int? = 0,

	@Column(nullable=true)
	var hardwareManufacturer: String? = "",

	@Column(nullable=true)
	var hardwareProductName: String? = "",

	@Column(nullable=true)
	var hardwareVersion: String? = "",

	@Column(nullable=true)
	var hardwareSerialNumber: String,

	@Column(nullable=true)
	var numberOfThreads: Int? = 0,
): Serializable {
	override fun toString(): String = gson.toJson(this)
}

fun HostConfiguration.toHostSwVo(): HostSwVo = HostSwVo.hostSwVo {
	hostId { this@toHostSwVo.hostId.toString()}
	hostOs { this@toHostSwVo.hostOs }
	kernelVersion { this@toHostSwVo.kernelVersion }
	kvmVersion { this@toHostSwVo.kvmVersion }
	vdsmVersion { this@toHostSwVo.vdsmVersion }
}

fun List<HostConfiguration>.toHostSwVos(): List<HostSwVo> =
	this.map { it.toHostSwVo() }