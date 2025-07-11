package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.api.ovirt.business.NetworkStatusB
import com.itinfo.rutilvm.common.gson
import org.hibernate.annotations.Type
import java.util.UUID
import java.io.Serializable
import javax.persistence.Column
import javax.persistence.Embeddable
import javax.persistence.EmbeddedId
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table


/**
 * [NetworkClusterViewEntity]
 * 네트워크 클러스터 정보
 *
 * @property clusterId [UUID]
 * @property clusterName [String]
 * @property networkId [UUID]
 * @property networkName [String]
 * @property status [Int]
 * @property required [Boolean]
 * @property isDisplay [Boolean]
 * @property migration [Boolean]
 */
@Entity
@Table(name = "network_cluster_view")
class NetworkClusterViewEntity(
	@Id
	@Column(name = "cluster_id", unique = true, nullable = true)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val clusterId: UUID? = null,
	val clusterName: String? = "",
	val networkId: UUID? = null,
	val networkName: String? = "",
	@Column(name = "status", nullable = false)
	private val _status: Int = 0,
	val required: Boolean? = false,
	// val isConnected: Boolean? = false,
	val isDisplay: Boolean? = false,
	val migration: Boolean? = false,
): Serializable {
	val status: NetworkStatusB			get() = NetworkStatusB.forValue(_status)

	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bClusterId: UUID? = null;fun clusterId(block: () -> UUID?) { bClusterId = block() }
		private var bClusterName: String = ""; fun clusterName(block: () -> String?) { bClusterName = block() ?: ""}
		private var bNetworkId: UUID? = null;fun networkId(block: () -> UUID?) { bNetworkId = block() }
		private var bNetworkName: String = ""; fun networkName(block: () -> String?) { bNetworkName = block() ?: ""}
		private var bStatus: Int = 0; fun status(block: () -> Int?) { bStatus = block() ?: 0}
		private var bRequired: Boolean = false; fun required(block: () -> Boolean?) { bRequired = block() ?: false}
		// private var bIsConnected: Boolean = false; fun isConnected(block: () -> Boolean?) { bIsConnected = block() ?: false}
		private var bIsDisplay: Boolean = false; fun isDisplay(block: () -> Boolean?) { bIsDisplay = block() ?: false}
		private var bMigration: Boolean = false; fun migration(block: () -> Boolean?) { bMigration = block() ?: false}

		fun build(): NetworkClusterViewEntity = NetworkClusterViewEntity(bClusterId, bClusterName, bNetworkId, bNetworkName, bStatus, bRequired, /*bIsConnected,*/ bIsDisplay, bMigration, )
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): NetworkClusterViewEntity = Builder().apply(block).build()
	}
}
