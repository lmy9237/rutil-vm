package com.itinfo.dao.history

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.dao.gson
import com.itinfo.dao.toFormatted
import com.itinfo.model.VmUsageVo
import org.hibernate.annotations.ColumnDefault
import java.io.Serializable
import java.math.BigInteger
import java.util.UUID
import java.time.LocalDateTime
import javax.persistence.Entity
import javax.persistence.Table
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Column
import javax.persistence.Id


/**
 * [VmSamplesHistory]
 * ovirt_engine_history 엔티티: VM_SAMPLES_HISTORY
 *
 * CLUSTER-SQL > COMPUTE-CLUSTER
 * @see com.itinfo.model.VmUsageVo
 */
@Entity
@Table(name="VM_SAMPLES_HISTORY")
data class VmSamplesHistory(
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(unique=true, nullable=false)
	val historyId: Int, // bigint
	var historyDatetime: LocalDateTime,

	@org.hibernate.annotations.Type(type="org.hibernate.type.PostgresUUIDType")
	val vmId: UUID,
	var vmStatus: Int, // smallint

	@Column(nullable=true)
	var cpuUsagePercent: Int? = 0, // smallint

	@Column(nullable=true)
	var memoryUsagePercent: Int? = 0, // smallint

	@Column(nullable=true)
	var vmIp: String? = "",

	@Column(nullable=true)
	var currentUserName: String? = "",

	@org.hibernate.annotations.Type(type="org.hibernate.type.PostgresUUIDType")
	val currentlyRunningOnHost: UUID,

	@Column(nullable=true)
	var vmConfigurationVersion: Int? = 0,

	@Column(nullable=true)
	var currentHostConfigurationVersion: Int? = 0,

	@Column(nullable=true)
	@ColumnDefault(value="")
	var vmClientIp: String,

	@Column(nullable=true)
	var userLoggedInToGuest: Boolean? = false,

	@Column(nullable=true)
	var userCpuUsagePercent: Int? = 0, // smallint

	@Column(nullable=true)
	var systemCpuUsagePercent: Int? = 0, // smallint

	@org.hibernate.annotations.Type(type="org.hibernate.type.PostgresUUIDType")
	val currentUserId: UUID,

	@Column(nullable=true)
	var memoryBufferedKb: BigInteger? = 0.toBigInteger(), // bigint

	@Column(nullable=true)
	var memoryCachedKb: BigInteger? = 0.toBigInteger(), // bigint

	@Column(nullable=true)
	var secondsInStatus: Int? = 0,

	): Serializable {
	override fun toString(): String = gson.toJson(this)

	companion object {
		private val log by LoggerDelegate()
	}

}

fun VmSamplesHistory.toVmUsageVo(): VmUsageVo = VmUsageVo.vmUsageVo {
	historyDatetime { this@toVmUsageVo.historyDatetime.toFormatted }
	cpuUsagePercent { this@toVmUsageVo.cpuUsagePercent }
	memoryUsagePercent { this@toVmUsageVo.memoryUsagePercent }
}

fun List<VmSamplesHistory>.toVmUsageVos(): List<VmUsageVo> =
	this.map { it.toVmUsageVo() }