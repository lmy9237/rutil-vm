package com.itinfo.rutilvm.api.repository.history.entity

import com.itinfo.rutilvm.common.gson

import org.slf4j.LoggerFactory
import java.io.Serializable
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID
import org.hibernate.annotations.Type

private val log = LoggerFactory.getLogger(HostInterfaceSamplesHistoryEntity::class.java)

/**
 * [HostInterfaceSamplesHistoryEntity]
 * 
 * @property historyId [Int]
 * @property hostInterfaceId [UUID]
 * @property historyDatetime [LocalDateTime]
 * @property receiveRatePercent [BigDecimal]
 * @property transmitRatePercent [BigDecimal]
 * @property hostInterfaceConfigurationVersion [Int]
 * @property receivedTotalByte [BigDecimal]
 * @property transmittedTotalByte [BigDecimal]
 * @property receivedDroppedTotalPackets [BigDecimal]
 * @property transmittedDroppedTotalPackets [BigDecimal]
 */
@Entity
@Table(name="host_interface_samples_history", schema="public")
class HostInterfaceSamplesHistoryEntity(
	@Id
	@Column(unique = true, nullable = false)
	val historyId: Int = -1,

	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val hostInterfaceId: UUID? = null,

	val historyDatetime: LocalDateTime = LocalDateTime.MIN,

	val receiveRatePercent: BigDecimal = BigDecimal.ZERO,
	val transmitRatePercent: BigDecimal = BigDecimal.ZERO,

	val hostInterfaceConfigurationVersion: Int = -1,

	val receivedTotalByte: BigDecimal = BigDecimal.ZERO,
	val transmittedTotalByte: BigDecimal = BigDecimal.ZERO,
	val receivedDroppedTotalPackets: BigDecimal = BigDecimal.ZERO,
	val transmittedDroppedTotalPackets: BigDecimal = BigDecimal.ZERO,
): Serializable {
	override fun toString(): String = gson.toJson(this)

	class Builder {
		private var bHistoryId: Int = -1;fun historyId(block: () -> Int?) { bHistoryId = block() ?: -1 }
		private var bHostInterfaceId: UUID? = null;fun hostInterfaceId(block: () -> UUID?) { bHostInterfaceId = block() }
		private var bHistoryDatetime: LocalDateTime = LocalDateTime.MIN;fun historyDatetime(block: () -> LocalDateTime?) { bHistoryDatetime = block() ?: LocalDateTime.MIN }
		private var bReceiveRatePercent: BigDecimal = BigDecimal.ZERO;fun receiveRatePercent(block: () -> BigDecimal?) { bReceiveRatePercent = block() ?: BigDecimal.ZERO }
		private var bTransmitRatePercent: BigDecimal = BigDecimal.ZERO;fun transmitRatePercent(block: () -> BigDecimal?) { bTransmitRatePercent = block() ?: BigDecimal.ZERO }
		private var bHostInterfaceConfigurationVersion: Int = -1;fun hostInterfaceConfigurationVersion(block: () -> Int?) { bHostInterfaceConfigurationVersion = block() ?: -1 }
		private var bReceivedTotalByte: BigDecimal = BigDecimal.ZERO;fun receivedTotalByte(block: () -> BigDecimal?) { bReceivedTotalByte = block() ?: BigDecimal.ZERO }
		private var bTransmittedTotalByte: BigDecimal = BigDecimal.ZERO;fun transmittedTotalByte(block: () -> BigDecimal?) { bTransmittedTotalByte = block() ?: BigDecimal.ZERO }
		private var bReceivedDroppedTotalPackets: BigDecimal = BigDecimal.ZERO;fun receivedDroppedTotalPackets(block: () -> BigDecimal?) { bReceivedDroppedTotalPackets = block() ?: BigDecimal.ZERO }
		private var bTransmittedDroppedTotalPackets: BigDecimal = BigDecimal.ZERO;fun transmittedDroppedTotalPackets(block: () -> BigDecimal?) { bTransmittedDroppedTotalPackets = block() ?: BigDecimal.ZERO }
		fun build(): HostInterfaceSamplesHistoryEntity = HostInterfaceSamplesHistoryEntity(bHistoryId, bHostInterfaceId, bHistoryDatetime, bReceiveRatePercent, bTransmitRatePercent, bHostInterfaceConfigurationVersion, bReceivedTotalByte, bTransmittedTotalByte, bReceivedDroppedTotalPackets, bTransmittedDroppedTotalPackets)
	}

	companion object {
		inline fun builder(block: HostInterfaceSamplesHistoryEntity.Builder.() -> Unit): HostInterfaceSamplesHistoryEntity = HostInterfaceSamplesHistoryEntity.Builder().apply(block).build()
	}
}