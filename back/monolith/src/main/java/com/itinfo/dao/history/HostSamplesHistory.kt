package com.itinfo.dao.history

import com.itinfo.dao.gson
import com.itinfo.dao.toFormatted
import com.itinfo.model.HostUsageVo
import com.itinfo.model.HostVo

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
 * [HostSamplesHistory]
 * ovirt_engine_history 엔티티: HOST_SAMPLES_HISTORY
 *
 * CLUSTER-SQL > COMPUTE-CLUSTER
 * @see com.itinfo.model.HostUsageVo
 */
@Entity
@Table(name="HOST_SAMPLES_HISTORY")
data class HostSamplesHistory(
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(unique = true, nullable = false)
	val historyId: Int,

	var historyDatetime: LocalDateTime,
	@org.hibernate.annotations.Type(type="org.hibernate.type.PostgresUUIDType")
	val hostId: UUID,
	var hostStatus: Int,
	var memoryUsagePercent: Int,
	var cpuUsagePercent: Int,
	var ksmCpuPercent: Int,
	var activeVms: Int,
	var totalVms: Int,
	var totalVmsVcpus: Int,
	var cpuLoad: Int,
	var systemCpuUsagePercent: Int,
	var userCpuUsagePercent: Int,
	var swapUsedMb: Int,
	var hostConfigurationVersion: Int,
	var ksmSharedMemoryMb: Int,
	var secondsInStatus: Int
): Serializable {
	override fun toString(): String = gson.toJson(this)
	// EXTRACT(EPOCH FROM HISTORY_DATETIME AT TIME ZONE 'ASIA/SEOUL') * 1000 AS HISTORY_DATETIME
	// ROUND(AVG(MEMORY_USAGE_PERCENT)) AS MEMORY_USAGE_PERCENT
	// ROUND(AVG(CPU_USAGE_PERCENT)) AS CPU_USAGE_PERCENT
}

fun HostSamplesHistory.toHostUsageVo(): HostUsageVo = HostUsageVo.hostUsageVo {
	hostId { this@toHostUsageVo.hostId.toString() }
	hostStatus { "${this@toHostUsageVo.hostStatus}" }
	cpuUsagePercent { "${this@toHostUsageVo.cpuUsagePercent}" }
	memoryUsagePercent { "${this@toHostUsageVo.memoryUsagePercent}" }
	historyDatetime { "${this@toHostUsageVo.historyDatetime}" }
}

fun List<HostSamplesHistory>.toHostUsageVos(): List<HostUsageVo> =
	this.map { it.toHostUsageVo() }



class HostSamplesHistoryDashboard(
	val historyDatetime: String,
	val cpuUsagePercent: Double,
	val memoryUsagePercent: Double,
): Serializable {
	class Builder {
		private var bHistoryDatetime: String = "";fun historyDatetime(block: () -> String?) { bHistoryDatetime = block() ?: "" }
		private var bCpuUsagePercent: Double = 0.0;fun cpuUsagePercent(block: () -> Double?) { bCpuUsagePercent = block() ?: 0.0 }
		private var bMemoryUsagePercent: Double = 0.0;fun memoryUsagePercent(block: () -> Double?) { bMemoryUsagePercent = block() ?: 0.0 }
		fun build(): HostSamplesHistoryDashboard = HostSamplesHistoryDashboard(bHistoryDatetime, bCpuUsagePercent, bMemoryUsagePercent)
	}
	companion object {
		@JvmStatic inline fun hostSamplesHistoryDashboard(block: Builder.() -> Unit): HostSamplesHistoryDashboard = Builder().apply(block).build()
	}
}

fun List<HostSamplesHistory>.toDashboardStatistics(): List<HostSamplesHistoryDashboard> =
	this.sortedByDescending { it.historyDatetime }
		.take(360)
		.groupBy { it.historyDatetime }
		.map {
			return@map HostSamplesHistoryDashboard.hostSamplesHistoryDashboard {
				historyDatetime { it.key.toFormatted }
				cpuUsagePercent { it.value.mapNotNull { p -> p.cpuUsagePercent }.average() }
				memoryUsagePercent { it.value.mapNotNull { p -> p.memoryUsagePercent }.average() }
			}		
		}
/*
DASHBOARD.retrieveHosts

	SELECT
		EXTRACT(EPOCH FROM HISTORY_DATETIME AT TIME ZONE 'ASIA/SEOUL') * 1000 AS HISTORY_DATETIME
		, ROUND(AVG(MEMORY_USAGE_PERCENT)) AS MEMORY_USAGE_PERCENT
		, ROUND(AVG(CPU_USAGE_PERCENT)) AS CPU_USAGE_PERCENT
	FROM
		HOST_SAMPLES_HISTORY
	WHERE 1=1
	AND HOST_ID::TEXT IN (:hostIds)
	GROUP BY HISTORY_DATETIME
	ORDER BY HISTORY_DATETIME DESC
	LIMIT 360
*/

fun HostSamplesHistoryDashboard.toHostVo(): HostVo = HostVo.hostVo {
	clusterId { "" } 
	hostId { "" } 
	hostName { "" } 
	historyDatetime { this@toHostVo.historyDatetime }
	hostStatus { "" } 
	memoryUsagePercent { this@toHostVo.memoryUsagePercent.toInt() }
	cpuUsagePercent { this@toHostVo.cpuUsagePercent.toInt() }
	ksmCpuPercent { 0 }
	activeVms { 0 }
	totalVms { 0 }
	totalVmsVcpus { 0 }
	cpuLoad { 0 }
	systemCpuUsagePercent { 0 }
	userCpuUsagePercent { 0 }
	swapUsedMb { 0 }
	ksmSharedMemoryMb { 0 }
	lunVos { listOf() }
	netAttachment { listOf() }
}

fun List<HostSamplesHistoryDashboard>.toHostVos(): List<HostVo> =
	this.map { it.toHostVo() }