package com.itinfo.rutilvm.api.repository.history.entity

import com.itinfo.rutilvm.common.gson

import org.hibernate.annotations.Type
import org.slf4j.LoggerFactory
import java.io.Serializable
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table

private val log = LoggerFactory.getLogger(VmInterfaceSamplesHistoryEntity::class.java)

/**
 * [VmInterfaceSamplesHistoryEntity]
 *
 * @property historyId [Int]
 * @property vmInterfaceId [UUID]
 * @property historyDatetime [LocalDateTime]
 * @property receiveRatePercent [BigDecimal]
 * @property transmitRatePercent [BigDecimal]
 * @property vmInterfaceConfigurationVersion [Int]
 * @property receivedTotalByte [BigDecimal]
 * @property transmittedTotalByte [BigDecimal]
 * @property receivedDroppedTotalPackets [BigDecimal]
 * @property transmittedDroppedTotalPackets [BigDecimal]
 */
@Entity
@Table(name="vm_interface_samples_history", schema="public")
class VmInterfaceSamplesHistoryEntity(
	@Id
    @Column(unique = true, nullable = false)
    val historyId: Int = -1,

	// join 추가
	@Type(type="org.hibernate.type.PostgresUUIDType")
	val vmId: UUID? = null,

	@Type(type = "org.hibernate.type.PostgresUUIDType")
    val vmInterfaceId: UUID? = null,

	val networkUsagePer: Int = -1,

	val historyDatetime: LocalDateTime = LocalDateTime.MIN,

	val receiveRatePercent: BigDecimal? = BigDecimal.ZERO,
	val transmitRatePercent: BigDecimal? = BigDecimal.ZERO,

	val vmInterfaceConfigurationVersion: Int = -1,

	val receivedTotalByte: BigDecimal = BigDecimal.ZERO,
	val transmittedTotalByte: BigDecimal = BigDecimal.ZERO,
	val receivedDroppedTotalPackets: BigDecimal = BigDecimal.ZERO,
	val transmittedDroppedTotalPackets: BigDecimal = BigDecimal.ZERO,
): Serializable {
	override fun toString(): String = gson.toJson(this)

	class Builder {
		private var bHistoryId: Int = -1;fun historyId(block: () -> Int?) { bHistoryId = block() ?: -1 }
		private var bVmId: UUID? = null;fun vmId(block: () -> UUID?) { bVmId = block() }
		private var bVmInterfaceId: UUID? = null;fun vmInterfaceId(block: () -> UUID?) { bVmInterfaceId = block() }
		private var bNetworkUsagePer: Int = -1;fun networkUsagePer(block: () -> Int?) { bNetworkUsagePer = block() ?: -1 }
		private var bHistoryDatetime: LocalDateTime = LocalDateTime.MIN;fun historyDatetime(block: () -> LocalDateTime?) { bHistoryDatetime = block() ?: LocalDateTime.MIN }
		private var bReceiveRatePercent: BigDecimal? = BigDecimal.ZERO;fun receiveRatePercent(block: () -> BigDecimal?) { bReceiveRatePercent = block() ?: BigDecimal.ZERO }
		private var bTransmitRatePercent: BigDecimal? = BigDecimal.ZERO;fun transmitRatePercent(block: () -> BigDecimal?) { bTransmitRatePercent = block() ?: BigDecimal.ZERO }
		private var bVmInterfaceConfigurationVersion: Int = -1;fun vmInterfaceConfigurationVersion(block: () -> Int?) { bVmInterfaceConfigurationVersion = block() ?: -1 }
		private var bReceivedTotalByte: BigDecimal = BigDecimal.ZERO;fun receivedTotalByte(block: () -> BigDecimal?) { bReceivedTotalByte = block() ?: BigDecimal.ZERO }
		private var bTransmittedTotalByte: BigDecimal = BigDecimal.ZERO;fun transmittedTotalByte(block: () -> BigDecimal?) { bTransmittedTotalByte = block() ?: BigDecimal.ZERO }
		private var bReceivedDroppedTotalPackets: BigDecimal = BigDecimal.ZERO;fun receivedDroppedTotalPackets(block: () -> BigDecimal?) { bReceivedDroppedTotalPackets = block() ?: BigDecimal.ZERO }
		private var bTransmittedDroppedTotalPackets: BigDecimal = BigDecimal.ZERO;fun transmittedDroppedTotalPackets(block: () -> BigDecimal?) { bTransmittedDroppedTotalPackets = block() ?: BigDecimal.ZERO }
		fun build(): VmInterfaceSamplesHistoryEntity = VmInterfaceSamplesHistoryEntity(bHistoryId, bVmId, bVmInterfaceId, bNetworkUsagePer, bHistoryDatetime, bReceiveRatePercent, bTransmitRatePercent, bVmInterfaceConfigurationVersion, bReceivedTotalByte, bTransmittedTotalByte, bReceivedDroppedTotalPackets, bTransmittedDroppedTotalPackets)
	}

	companion object {
		inline fun builder(block: VmInterfaceSamplesHistoryEntity.Builder.() -> Unit): VmInterfaceSamplesHistoryEntity = VmInterfaceSamplesHistoryEntity.Builder().apply(block).build()
	}
}

