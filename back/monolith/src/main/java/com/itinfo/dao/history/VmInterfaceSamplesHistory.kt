package com.itinfo.dao.history

import com.itinfo.dao.gson
import com.itinfo.dao.toFormatted
import com.itinfo.model.NicUsageVo
import com.itinfo.model.VmNetworkUsageVo
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
 * [VmInterfaceSamplesHistory]
 * ovirt_engine_history 엔티티: VM_INTERFACE_SAMPLES_HISTORY
 *
 * CLUSTER-SQL > COMPUTE-CLUSTER
 * @see com.itinfo.model.NicUsageVo
 */
@Entity
@Table(name="VM_INTERFACE_SAMPLES_HISTORY")
data class VmInterfaceSamplesHistory(
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(unique = true, nullable = false)
	val historyId: Int,

	var historyDatetime: LocalDateTime,
	@org.hibernate.annotations.Type(type="org.hibernate.type.PostgresUUIDType")
	val vmInterfaceId: UUID,

	@Column(nullable=true)
	var receiveRatePercent: Double? = 0.0,

	@Column(nullable=true)
	var transmitRatePercent: Double? = 0.0,

	@Column(nullable=true)
	var vmInterfaceConfigurationVersion: Int? = 0,

	@Column(nullable=true)
	var receivedTotalByte: BigInteger? = 0.toBigInteger(),

	@Column(nullable=true)
	var transmittedTotalByte: BigInteger? = 0.toBigInteger(),

	@Column(nullable=true)
	var receivedDroppedTotalPackets: Int? = 0,

	@Column(nullable=true)
	var transmittedDroppedTotalPackets: Int? = 0
): Serializable {
	override fun toString(): String = gson.toJson(this)

}

fun VmInterfaceSamplesHistory.toNicUsageVo(): NicUsageVo = NicUsageVo.nicUsageVo {
	hostInterfaceId { "" }
	hostInterfaceName { "" }
	vmInterfaceId { "${this@toNicUsageVo.vmInterfaceId}" }
	vmInterfaceName { "" }
	receiveRatePercent { "${this@toNicUsageVo.receiveRatePercent}" }
	transmitRatePercent { "${this@toNicUsageVo.transmitRatePercent}" }
	receivedTotalByte { "${this@toNicUsageVo.receivedTotalByte}" }
	transmittedTotalByte { "${this@toNicUsageVo.transmittedTotalByte}" }
	historyDatetime { this@toNicUsageVo.historyDatetime.toFormatted } // YYYYMMDDHH24MM
	macAddress { "" }
}

fun List<VmInterfaceSamplesHistory>.toNicUsageVos(): List<NicUsageVo> =
	this.map { it.toNicUsageVo() }

class VmInterfaceSamplesHistoryDashboard(
	val historyDatetime: String,
	val receiveRatePercent: Double,
	val transmitRatePercent: Double
): Serializable {
	class Builder {
		private var bHistoryDatetime: String = "";fun historyDatetime(block: () -> String?) { bHistoryDatetime = block() ?: "" }
		private var bTransmitRatePercent: Double = 0.0;fun transmitRatePercent(block: () -> Double?) { bTransmitRatePercent = block() ?: 0.0 }
		private var bReceiveRatePercent: Double = 0.0;fun receiveRatePercent(block: () -> Double?) { bReceiveRatePercent = block() ?: 0.0 }
		fun build(): VmInterfaceSamplesHistoryDashboard = VmInterfaceSamplesHistoryDashboard(bHistoryDatetime, bReceiveRatePercent, bTransmitRatePercent)
	}
	companion object {
		@JvmStatic inline fun vmInterfaceSamplesHistoryDashboard(block: Builder.() -> Unit): VmInterfaceSamplesHistoryDashboard = Builder().apply(block).build()
	}
}

fun List<VmInterfaceSamplesHistory>.toDashboardStatistics(): List<VmInterfaceSamplesHistoryDashboard> =
	this.sortedByDescending { it.historyDatetime }
		.take(360)
		.groupBy { it.historyDatetime }
		.map {
			return@map VmInterfaceSamplesHistoryDashboard.vmInterfaceSamplesHistoryDashboard {
				historyDatetime { it.key.toFormatted }
				receiveRatePercent { it.value.mapNotNull { p -> p.receiveRatePercent }.average() }
				transmitRatePercent { it.value.mapNotNull { p -> p.transmitRatePercent }.average() }
			}
		}
/*
COMPUTING.retrieveVmNetworkUsage

	SELECT
		EXTRACT(EPOCH FROM HISTORY_DATETIME AT TIME ZONE 'ASIA/SEOUL') * 1000 AS HISTORY_DATETIME
		, AVG(RECEIVE_RATE_PERCENT) AS RECEIVE_RATE_PERCENT
		, AVG(TRANSMIT_RATE_PERCENT) AS TRANSMIT_RATE_PERCENT
	FROM
		VM_INTERFACE_SAMPLES_HISTORY
	WHERE 1=1
	AND VM_INTERFACE_ID::TEXT IN (:interfaceIds)
	GROUP BY HISTORY_DATETIME
	ORDER BY HISTORY_DATETIME DESC
	LIMIT 360
*/


fun VmInterfaceSamplesHistoryDashboard.toVmNetworkUsageVo(): VmNetworkUsageVo = VmNetworkUsageVo.vmNetworkUsageVo {
	historyDatetime { this@toVmNetworkUsageVo.historyDatetime }
	receiveRatePercent { this@toVmNetworkUsageVo.receiveRatePercent.toInt() }
	transmitRatePercent { this@toVmNetworkUsageVo.transmitRatePercent.toInt() }
	// TODO 데이터는 정확한 값을 전달해야 하는데 Int는 소수점을 알 수 없다.
}

fun List<VmInterfaceSamplesHistoryDashboard>.toVmNetworkUsageVos(): List<VmNetworkUsageVo> =
	this.map { it.toVmNetworkUsageVo() }