package com.itinfo.dao.history

import com.itinfo.dao.gson
import com.itinfo.dao.toFormatted
import com.itinfo.model.NicUsageVo
import com.itinfo.model.HostInterfaceVo

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
 * [HostInterfaceSamplesHistory]
 * ovirt_engine_history 엔티티: HOST_INTERFACE_SAMPLES_HISTORY
 *
 * CLUSTER-SQL > COMPUTE-CLUSTER
 * @see com.itinfo.model.VmUsageVo
 * @see com.itinfo.model.HostInterfaceVo
 */
@Entity
@Table(name = "HOST_INTERFACE_SAMPLES_HISTORY")
data class HostInterfaceSamplesHistory(
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(unique = true, nullable = false)
	val historyId: Int,

	var historyDatetime: LocalDateTime,

	@org.hibernate.annotations.Type(type="org.hibernate.type.PostgresUUIDType")
	val hostInterfaceId: UUID,

	@Column(nullable=true)
	var receiveRatePercent: Double? = 0.0,

	@Column(nullable=true)
	var transmitRatePercent: Double? = 0.0,

	@Column(nullable=true)
	var hostInterfaceConfigurationVersion: Int? = 0,

	@Column(nullable=true)
	var receivedTotalByte: BigInteger? = 0.toBigInteger(),

	@Column(nullable=true)
	var transmittedTotalByte: BigInteger? = 0.toBigInteger(),

	@Column(nullable=true)
	var receivedDroppedTotalPackets: Int? = 0,

	@Column(nullable=true)
	var transmittedDroppedTotalPackets: Int? = 0,
): Serializable {
	override fun toString(): String = gson.toJson(this)
}

fun HostInterfaceSamplesHistory.toNicUsageVo(): NicUsageVo = NicUsageVo.nicUsageVo {
	hostInterfaceId { this@toNicUsageVo.hostInterfaceId.toString() }
	hostInterfaceName { "" }
	vmInterfaceId { "" } 
	vmInterfaceName { "" } 
	receiveRatePercent { "${this@toNicUsageVo.receiveRatePercent}" }
	transmitRatePercent { "${this@toNicUsageVo.transmitRatePercent}" }
	receivedTotalByte { "${this@toNicUsageVo.receivedTotalByte}" } 
	transmittedTotalByte { "${this@toNicUsageVo.transmittedTotalByte}" }
	historyDatetime { this@toNicUsageVo.historyDatetime.toFormatted } // YYYYMMDDHH24MI
	macAddress { "" } 
}

fun List<HostInterfaceSamplesHistory>.toNicUsageVos(): List<NicUsageVo> =
	this.map { it.toNicUsageVo() }

class HostInterfaceSamplesHistoryDashboard(
	val historyDatetime: String,
	val transmitRatePercent: Double,
	val receiveRatePercent: Double,
): Serializable {
	class Builder {
		private var bHistoryDatetime: String = "";fun historyDatetime(block: () -> String?) { bHistoryDatetime = block() ?: "" }
		private var bTransmitRatePercent: Double = 0.0;fun transmitRatePercent(block: () -> Double?) { bTransmitRatePercent = block() ?: 0.0 }
		private var bReceiveRatePercent: Double = 0.0;fun receiveRatePercent(block: () -> Double?) { bReceiveRatePercent = block() ?: 0.0 }
		fun build(): HostInterfaceSamplesHistoryDashboard = HostInterfaceSamplesHistoryDashboard(bHistoryDatetime, bReceiveRatePercent, bTransmitRatePercent)
	}
	companion object {
		@JvmStatic inline fun hostInterfaceSamplesHistoryDashboard(block: Builder.() -> Unit): HostInterfaceSamplesHistoryDashboard = Builder().apply(block).build()
	}
}

fun List<HostInterfaceSamplesHistory>.toDashboardStatistics(): List<HostInterfaceSamplesHistoryDashboard> =
	this.sortedByDescending { it.historyDatetime }
		.take(360)
		.groupBy { it.historyDatetime }
		.map {
			return@map HostInterfaceSamplesHistoryDashboard.hostInterfaceSamplesHistoryDashboard {
				historyDatetime { it.key.toFormatted }
				receiveRatePercent { it.value.mapNotNull { p -> p.receiveRatePercent }.average() }
				transmitRatePercent { it.value.mapNotNull { p -> p.transmitRatePercent }.average() }
			}
		}

/*
	SELECT
		EXTRACT(EPOCH FROM HISTORY_DATETIME AT TIME ZONE 'ASIA/SEOUL') * 1000 AS HISTORY_DATETIME
		, SUM(RECEIVE_RATE_PERCENT) AS RECEIVE_RATE_PERCENT
		, SUM(TRANSMIT_RATE_PERCENT) AS TRANSMIT_RATE_PERCENT
	FROM
		HOST_INTERFACE_SAMPLES_HISTORY
	WHERE 1=1
	AND HOST_INTERFACE_ID::TEXT IN (:hostInterfaceIds)
	GROUP BY HISTORY_DATETIME
	ORDER BY HISTORY_DATETIME DESC
	LIMIT 360
*/


fun HostInterfaceSamplesHistoryDashboard.toHostInterfaceVo(): HostInterfaceVo = HostInterfaceVo.hostInterfaceVo {
	historyDatetime { this@toHostInterfaceVo.historyDatetime }
	receiveRatePercent { this@toHostInterfaceVo.receiveRatePercent.toInt() }
	transmitRatePercent { this@toHostInterfaceVo.transmitRatePercent.toInt() }
	receivedTotalByte { 0 }
	transmittedTotalByte { 0 }
}

fun List<HostInterfaceSamplesHistoryDashboard>.toHostInterfaceVos(): List<HostInterfaceVo> =
		this.map { it.toHostInterfaceVo() }