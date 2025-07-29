package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.api.ovirt.business.NetworkStatusB
import com.itinfo.rutilvm.common.gson
import org.hibernate.annotations.Type
import java.io.Serializable
import java.util.UUID
import javax.persistence.Column
import javax.persistence.Embeddable
import javax.persistence.EmbeddedId
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.MapsId
import javax.persistence.Table

@Embeddable
data class NetworkClusterId(
	@Column(name = "network_id", unique = true, nullable = true)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	var networkId: UUID? = null,
	@Column(name = "cluster_id", unique = true, nullable = true)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	var clusterId: UUID? = null
): Serializable

@Entity
@Table(name = "network_cluster")
class NetworkClusterEntity(
	@EmbeddedId
	var id: NetworkClusterId? = null,
	@Column(name = "status", nullable = false)
	private val _status: Int = 0,
	val isDisplay: Boolean = false,
	val required: Boolean = true,
	val migration: Boolean = false,
	val management: Boolean = false,
	val isGluster: Boolean = false,
	val defaultRoute: Boolean = false,

	// --- Relationships ---
	@ManyToOne(fetch=FetchType.LAZY)
	@MapsId("networkId")
	@JoinColumn(name="network_id")
	val network: NetworkEntity? = null,

	@ManyToOne(fetch = FetchType.LAZY)
	@MapsId("clusterId")
	@JoinColumn(name="cluster_id")
	val cluster: ClusterViewEntity? = null
): Serializable {
	val status: NetworkStatusB			get() = NetworkStatusB.forValue(_status)

	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bId: NetworkClusterId? = null;fun id(block: () -> NetworkClusterId?) { bId = block() }
		private var bStatus: Int = 0;fun status(block: () -> Int?) { bStatus = block() ?: 0 }
		private var bIsDisplay: Boolean = false;fun isDisplay(block: () -> Boolean?) { bIsDisplay = block() ?: false }
		private var bRequired: Boolean = true;fun required(block: () -> Boolean?) { bRequired = block() ?: true }
		private var bMigration: Boolean = false;fun migration(block: () -> Boolean?) { bMigration = block() ?: false }
		private var bManagement: Boolean = false;fun management(block: () -> Boolean?) { bManagement = block() ?: false }
		private var bIsGluster: Boolean = false;fun isGluster(block: () -> Boolean?) { bIsGluster = block() ?: false }
		private var bDefaultRoute: Boolean = false;fun defaultRoute(block: () -> Boolean?) { bDefaultRoute = block() ?: false }
		private var bNetwork: NetworkEntity? = null;fun network(block: () -> NetworkEntity?) { bNetwork = block() }
		private var bCluster: ClusterViewEntity? = null;fun cluster(block: () -> ClusterViewEntity?) { bCluster = block() }
		fun build(): NetworkClusterEntity = NetworkClusterEntity(bId, bStatus, bIsDisplay, bRequired, bMigration, bManagement, bIsGluster, bDefaultRoute, bNetwork, bCluster)
	}
}
