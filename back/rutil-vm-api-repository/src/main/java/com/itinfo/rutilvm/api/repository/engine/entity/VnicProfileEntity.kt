package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.common.gson
import org.hibernate.annotations.Immutable
import org.hibernate.annotations.Type
import java.time.LocalDateTime
import java.util.UUID
import java.io.Serializable
import java.math.BigInteger
import javax.persistence.Id
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.Table

/**
 * [VnicProfileEntity]
 * vNIC 프로필 정보
 *
 * @author 이찬희 (@chanhi2000)
 */
@Entity
@Table(name="vnic_profiles")
class VnicProfileEntity(
	@Id
	@Column(name="id")
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val id: UUID? = null,
	val name: String? = "",
	val portMirroring: Boolean? = false,
	@Column(name="custom_properties", columnDefinition = "text")
	private val _customProperties: String? = null,
	val description: String? = null,
	@Column(name="_create_date")
	val createDate: LocalDateTime? = null,
	@Column(name="_update_date")
	val updateDate: LocalDateTime? = null,
	val passthrough: Boolean? = false,
	val migratable: Boolean? = false,

	// --- Relationships ---
	/*@Column(name="network_id")
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val networkId: UUID? = null,*/

	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(
		name="network_id",
		referencedColumnName="id",
		nullable=false
	)
	val network: NetworkEntity? = null,
	/*@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(
		name="network_qos_id",
		referencedColumnName="id"
	)
	val qos: QosEntity? = null, // Assumes you have a QosEntity
	*/
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(
		name="network_filter_id",
		referencedColumnName="filter_id"
	)
	val networkFilter: NetworkFilterEntity? = null,
	// This is a self-referencing relationship for failover
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="failover_vnic_profile_id")
	val failoverVnicProfile: VnicProfileEntity? = null
) : Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bId: UUID? = null; fun id(block: () -> UUID?) { bId = block() }
		private var bName: String? = ""; fun name(block: () -> String?) { bName = block() ?: "" }
		private var bPortMirroring: Boolean? = false; fun portMirroring(block: () -> Boolean?) { bPortMirroring = block() ?: false }
		private var bCustomProperties: String? = null; fun customProperties(block: () -> String?) { bCustomProperties = block() }
		private var bDescription: String? = null; fun description(block: () -> String?) { bDescription = block() }
		private var bCreateDate: LocalDateTime? = null; fun createDate(block: () -> LocalDateTime?) { bCreateDate = block() }
		private var bUpdateDate: LocalDateTime? = null; fun updateDate(block: () -> LocalDateTime?) { bUpdateDate = block() }
		private var bPassthrough: Boolean? = false; fun passthrough(block: () -> Boolean?) { bPassthrough = block() ?: false }
		private var bMigratable: Boolean? = false; fun migratable(block: () -> Boolean?) { bMigratable = block() ?: false }
		private var bNetworkId: UUID? = null; fun networkId(block: () -> UUID?) { bNetworkId = block() }
		private var bNetwork: NetworkEntity? = null; fun network(block: () -> NetworkEntity?) { bNetwork = block() }
		private var bNetworkQos: QosEntity? = null; fun networkQos(block: () -> QosEntity?) { bNetworkQos = block() }
		private var bNetworkFilter: NetworkFilterEntity? = null; fun networkFilter(block: () -> NetworkFilterEntity?) { bNetworkFilter = block() }
		private var bFailoverVnicProfile: VnicProfileEntity? = null; fun failoverVnicProfile(block: () -> VnicProfileEntity?) { bFailoverVnicProfile = block() }
		fun build(): VnicProfileEntity = VnicProfileEntity(bId, bName, bPortMirroring, bCustomProperties, bDescription, bCreateDate, bUpdateDate, bPassthrough, bMigratable,/* bNetworkId, */bNetwork, /*bNetworkQos, */bNetworkFilter, bFailoverVnicProfile)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): VnicProfileEntity = Builder().apply(block).build()
	}
}
