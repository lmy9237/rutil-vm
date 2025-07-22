package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.api.ovirt.business.InterfaceStatus
import com.itinfo.rutilvm.common.gson
import org.hibernate.annotations.Immutable
import org.hibernate.annotations.Type
import java.util.UUID
import java.io.Serializable
import java.math.BigDecimal
import java.math.BigInteger
import java.time.LocalDateTime
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.OneToMany
import javax.persistence.ManyToOne
import javax.persistence.MapsId
import javax.persistence.OneToOne
import javax.persistence.Table

/**
 * [VmInterfaceStatisticsEntity]
 * Maps to the `vm_interface_statistics` table. This table holds the dynamic
 * statistical data for a specific VM network interface (vNIC).
 * It has a one-to-one relationship with VmInterfaceEntity using a shared primary key.
 *
 * @author 이찬희 (@chanhi2000)
 */
@Entity
@Table(name = "vm_interface_statistics")
class VmInterfaceStatisticsEntity(
	@Id
	@Column(name = "id")
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val id: UUID? = null,
	val rxRate: BigDecimal? = null,
	val txRate: BigDecimal? = null,
	val rxDrop: Long? = null, // numeric(20) fits in a Long
	val txDrop: Long? = null,
	@Column(name = "iface_status")
	private val _ifaceStatus: Int? = null,

	@Column(name = "_update_date")
	val updateDate: LocalDateTime? = null, // timestamptz -> OffsetDateTime
	val rxTotal: Long? = null,
	val rxOffset: Long? = null,
	val txTotal: Long? = null,
	val txOffset: Long? = null,
	val sampleTime: Double? = null, // float8 -> Double

	// --- Relationships ---
	// This is the primary OneToOne relationship using a shared primary key.
	// @MapsId tells JPA that the primary key of this entity is populated from this relationship.
	@OneToOne(fetch = FetchType.LAZY)
	@MapsId
	@JoinColumn(name="id", referencedColumnName="id")
	val vmInterface: VmInterfaceEntity? = null,

	// This is a secondary relationship to the VM itself.
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name="vm_id", referencedColumnName="vm_guid")
	val vm: VmStaticEntity? = null // Assumes you have a VmStaticEntity
): Serializable {
	val ifaceStatus: InterfaceStatus 		get() = InterfaceStatus.forValue(_ifaceStatus) // TODO: 맞는지 모르겠음

	override fun toString(): String =
		gson.toJson(this@VmInterfaceStatisticsEntity)

	class Builder {
		private var bId: UUID? = null; fun id(block: () -> UUID?) { bId = block() }
		private var bRxRate: BigDecimal? = null; fun rxRate(block: () -> BigDecimal?) { bRxRate = block() }
		private var bTxRate: BigDecimal? = null; fun txRate(block: () -> BigDecimal?) { bTxRate = block() }
		private var bRxDrop: Long? = null; fun rxDrop(block: () -> Long?) { bRxDrop = block() }
		private var bTxDrop: Long? = null; fun txDrop(block: () -> Long?) { bTxDrop = block() }
		private var bIfaceStatus: Int? = null; fun ifaceStatus(block: () -> Int?) { bIfaceStatus = block() ?: 0 }
		private var bUpdateDate: LocalDateTime? = null; fun updateDate(block: () -> LocalDateTime?) { bUpdateDate = block() }
		private var bRxTotal: Long? = null; fun rxTotal(block: () -> Long?) { bRxTotal = block() }
		private var bRxOffset: Long? = null; fun rxOffset(block: () -> Long?) { bRxOffset = block() }
		private var bTxTotal: Long? = null; fun txTotal(block: () -> Long?) { bTxTotal = block() }
		private var bTxOffset: Long? = null; fun txOffset(block: () -> Long?) { bTxOffset = block() }
		private var bSampleTime: Double? = null; fun sampleTime(block: () -> Double?) { bSampleTime = block() }
		private var bVmInterface: VmInterfaceEntity? = null; fun vmInterface(block: () -> VmInterfaceEntity?) { bVmInterface = block() }
		private var bVm: VmStaticEntity? = null; fun vm(block: () -> VmStaticEntity?) { bVm = block() }

		fun build(): VmInterfaceStatisticsEntity = VmInterfaceStatisticsEntity(bId, bRxRate, bTxRate, bRxDrop, bTxDrop, bIfaceStatus, bUpdateDate, bRxTotal, bRxOffset, bTxTotal, bTxOffset, bSampleTime, bVmInterface, bVm)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): VmInterfaceStatisticsEntity = Builder().apply(block).build()
	}
}
