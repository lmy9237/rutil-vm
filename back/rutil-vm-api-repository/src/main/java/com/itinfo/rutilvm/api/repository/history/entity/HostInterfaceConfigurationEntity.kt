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
import org.hibernate.annotations.UpdateTimestamp
import org.hibernate.annotations.CreationTimestamp
import javax.persistence.CascadeType
import javax.persistence.FetchType
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.OneToMany
import javax.persistence.SequenceGenerator

/**
 * [HostInterfaceConfigurationEntity]
 *
 * @property historyId [Int]
 * @property hostInterfaceId [UUID]
 * @property hostInterfaceName [String]
 * @property hostId [UUID]
 * @property hostInterfaceType [Short]
 * @property hostInterfaceSpeedBps [Int]
 * @property macAddress [String]
 * @property logicalNetworkName [String]
 * @property ipAddress [String]
 * @property gateway [String]
 * @property bond [Boolean]
 * @property bondName [String]
 * @property vlanId [Int]
 * @property hostConfigurationVersion [Int]
 * @property createDate [LocalDateTime]
 * @property updateDate [LocalDateTime]
 * @property deleteDate [LocalDateTime]
 * @property samplesHistory MutableList<[HostInterfaceSamplesHistoryEntity]>
 */
@Entity
@Table(name = "host_interface_configuration", schema="public")
class HostInterfaceConfigurationEntity(
	@Id
	@GeneratedValue(strategy=GenerationType.SEQUENCE, generator="configuration_seq_generator")
	@SequenceGenerator(name="configuration_seq_generator", sequenceName="configuration_seq", allocationSize=1)
	@Column(name = "history_id")
	val historyId: Int? = -1, // Nullable as it's generated

	@Column(name = "host_interface_id", nullable = false)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val hostInterfaceId: UUID? = null,
	val hostInterfaceName: String = "",

	@Column(name = "host_id", nullable = false)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val hostId: UUID? = null,

	val hostInterfaceType: Short? = null,
	@Column(name = "host_interface_speed_bps")
	val hostInterfaceSpeedBps: Int? = 0,
	val macAddress: String? = "",
	val logicalNetworkName: String? = "",
	val ipAddress: String? = "",
	val gateway: String? = "",
	var bond: Boolean? = null,
	val bondName: String? = "",
	val vlanId: Int? = null,
	var hostConfigurationVersion: Int? = null,

	@CreationTimestamp // Optional: Handled by Hibernate
	@Column(name = "create_date", updatable=false)
	val createDate: LocalDateTime? = null,

	@UpdateTimestamp // Optional: Handled by Hibernate
	val updateDate: LocalDateTime? = null,
	var deleteDate: LocalDateTime? = null,

	@OneToMany(
		mappedBy = "hostInterfaceConfiguration",
		cascade = [CascadeType.ALL],
		orphanRemoval = true,
		fetch = FetchType.LAZY
	)
	val hostInterfaceSamplesHistories: MutableList<HostInterfaceSamplesHistoryEntity>? = mutableListOf()
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bHistoryId: Int? = -1;fun HistoryId(block: () -> Int?) { bHistoryId = block() ?: -1 }
		private var bHostInterfaceId: UUID? = null;fun hostInterfaceId(block: () -> UUID?) { bHostId = block() }
		private var bHostInterfaceName: String = "";fun hostInterfaceName(block: () -> String?) { bHostInterfaceName = block() ?: "" }
		private var bHostId: UUID? = null;fun hostId(block: () -> UUID?) { bHostId = block() }
		private var bHostInterfaceType: Short? = null;fun hostInterfaceType(block: () -> Short?) { bHostInterfaceType = block() }
		private var bHostInterfaceSpeedBps: Int = 0;fun hostInterfaceSpeedBps(block: () -> Int?) { bHostInterfaceSpeedBps = block() ?: 0 }
		private var bMacAddress: String? = "";fun macAddress(block: () -> String?) { bMacAddress = block() ?: "" }
		private var bLogicalNetworkName: String? = "";fun logicalNetworkName(block: () -> String?) { bLogicalNetworkName = block() ?: "" }
		private var bIpAddress: String? = "";fun ipAddress(block: () -> String?) { bIpAddress = block() ?: "" }
		private var bGateway: String? = "";fun gateway(block: () -> String?) { bGateway = block() ?: "" }
		private var bBond: Boolean? = null;fun bond(block: () -> Boolean?) { bBond = block() }
		private var bBondName: String? = "";fun bondName(block: () -> String?) { bBondName = block() ?: "" }
		private var bVlanId: Int? = null;fun vlanId(block: () -> Int?) { bVlanId = block() }
		private var bHostConfigurationVersion: Int? = null;fun hostConfigurationVersion(block: () -> Int?) { bHostConfigurationVersion = block() }
		private var bCreateDate: LocalDateTime = LocalDateTime.MIN;fun CreateDate(block: () -> LocalDateTime?) { bCreateDate = block() ?: LocalDateTime.MIN }
		private var bUpdateDate: LocalDateTime = LocalDateTime.MIN;fun UpdateDate(block: () -> LocalDateTime?) { bUpdateDate = block() ?: LocalDateTime.MIN }
		private var bDeleteDate: LocalDateTime = LocalDateTime.MIN;fun DeleteDate(block: () -> LocalDateTime?) { bDeleteDate = block() ?: LocalDateTime.MIN }
		private var bNumberOfSockets: Int = -1;fun NumberOfSockets(block: () -> Int?) { bNumberOfSockets = block() ?: -1 }
		private var bHostInterfaceSamplesHistories: MutableList<HostInterfaceSamplesHistoryEntity>? = mutableListOf();fun hostInterfaceSamplesHistories(block: () -> MutableList<HostInterfaceSamplesHistoryEntity>?) { bHostInterfaceSamplesHistories = block() ?: mutableListOf() }

		fun build(): HostInterfaceConfigurationEntity = HostInterfaceConfigurationEntity(bHistoryId, bHostInterfaceId, bHostInterfaceName, bHostId, bHostInterfaceType, bHostInterfaceSpeedBps, bMacAddress, bLogicalNetworkName, bIpAddress, bGateway, bBond, bBondName, bVlanId, bHostConfigurationVersion, bCreateDate, bUpdateDate, bDeleteDate, bHostInterfaceSamplesHistories)
	}

	companion object {
		inline fun builder(block: HostInterfaceConfigurationEntity.Builder.() -> Unit): HostInterfaceConfigurationEntity = HostInterfaceConfigurationEntity.Builder().apply(block).build()
	}
}
