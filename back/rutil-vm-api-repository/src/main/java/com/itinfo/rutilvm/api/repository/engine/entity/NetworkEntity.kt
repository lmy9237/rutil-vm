package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.api.ovirt.business.NetworkStatusB
import com.itinfo.rutilvm.common.gson
import org.hibernate.annotations.Type
import org.slf4j.LoggerFactory
import java.time.LocalDateTime
import java.util.UUID
import java.io.Serializable
import java.math.BigInteger
import javax.persistence.CascadeType
// Or jakarta.persistence.* for newer Spring Boot
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.JoinTable
import javax.persistence.ManyToMany
import javax.persistence.ManyToOne
import javax.persistence.OneToMany
import javax.persistence.OneToOne
import javax.persistence.Table

private val log = LoggerFactory.getLogger(NetworkEntity::class.java)

/**
 * [NetworkEntity]
 * 네트워크 정보
 *
 * @property id [UUID]
 * @property name [String]
 * @property description [String]
 * @property vlanId [Int]
 * @property mtu [Int]
 * @property vmNetwork [Boolean]
 * @property freeTextComment [String]
 * @property dnsConfiguration [DnsResolverConfigurationEntity]
 *
 * @see DnsResolverConfigurationEntity
 */
@Entity
@Table(name = "network")
class NetworkEntity(
	@Id
	@Column(name = "id", unique = true, nullable = true)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val id: UUID? = null,
	val name: String? = "",
	val description: String? = "",
	val type: Int? = null,
	val addr: String? = "",
	val subnet: String? = "",
	val gateway: String? = "",
	val stp: Boolean? = false,
	val vlanId: Int? = null,
	val mtu: Int? = 0,
	val vmNetwork: Boolean? = true,
	val providerNetworkExternalId: String? = "",
	val freeTextComment: String? = "",
	val label: String? = "",
	val vdsmName: String? = "",
	@Column(name = "provider_physical_network_id", unique = true, nullable = true)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val providerPhysicalNetworkId: UUID? = null,
	val portIsolation: Boolean? = false,
	// This is the link from Network to its DnsResolverConfiguration
	// It's a one-to-one relationship from the perspective of the Network,
	// but dns_resolver_configuration can be shared (so it's ManyToOne from another view,
	// but a Network has AT MOST ONE dns_resolver_configuration).
	// We make it optional (nullable = true) if a network doesn't have to have DNS config.
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(
		name="storage_pool_id",
		referencedColumnName="id",
		nullable=true
	)
	var storagePool: StoragePoolEntity? = null,
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(
		name="provider_network_provider_id",
		referencedColumnName="id",
		nullable=true
	)
	var provider: ProvidersEntity? = null,
	@OneToOne(
		fetch=FetchType.LAZY,
		orphanRemoval=true,
		cascade=[CascadeType.ALL]
	) // Cascade ALL might delete a shared config
	@JoinColumn(
		name="dns_resolver_configuration_id",
		referencedColumnName="id",
		nullable=true
	)
	var dnsConfiguration: DnsResolverConfigurationEntity? = null,
	@OneToMany(
		mappedBy="network",
		fetch=FetchType.LAZY,
		cascade=[CascadeType.ALL],
		orphanRemoval=true
	)
	var networkClusters: MutableSet<NetworkClusterEntity>? = mutableSetOf(),
	@OneToMany(
		mappedBy="network",
		fetch=FetchType.LAZY,
		cascade=[CascadeType.ALL],
		orphanRemoval=true,
	)
	/*@JoinColumn(
		name="id",
		referencedColumnName="network_id",
		nullable=true
	)*/
	var vnicProfiles: MutableSet<VnicProfileEntity>? = mutableSetOf(),
): Serializable {
	override fun toString(): String =
		gson.toJson(this)
	val status: NetworkStatusB? 		get() =
		if (
			networkClusters?.isNotEmpty() == true &&
			networkClusters?.all { it.status == NetworkStatusB.operational } == true
		)
			NetworkStatusB.operational
		else
			NetworkStatusB.non_operational
	val isDisplay: Boolean			get() = networkClusters?.any { it.isDisplay } == true
	val required: Boolean				get() = networkClusters?.any { it.required } == true
	val migration: Boolean			get() = networkClusters?.any { it.migration } == true
	val management: Boolean			get() = networkClusters?.any { it.management } == true
	val isGluster: Boolean			get() = networkClusters?.any { it.isGluster } == true
	val defaultRoute: Boolean			get() = networkClusters?.any { it.defaultRoute } == true

	class Builder {
		private var bId: UUID? = null;fun id(block: () -> UUID?) { bId = block() }
		private var bName: String? = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bDescription: String? = "";fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bType: Int? = null;fun type(block: () -> Int?) { bType = block() }
		private var bAddr: String? = "";fun addr(block: () -> String?) { bAddr = block() ?: "" }
		private var bSubnet: String? = "";fun subnet(block: () -> String?) { bSubnet = block() ?: "" }
		private var bGateway: String? = "";fun gateway(block: () -> String?) { bGateway = block() ?: "" }
		private var bStp: Boolean? = false;fun stp(block: () -> Boolean?) { bStp = block() ?: false }
		private var bVlanId: Int? = null;fun vlanId(block: () -> Int?) { bVlanId = block() }
		private var bMtu: Int? = 0;fun mtu(block: () -> Int?) { bMtu = block() ?: 0 }
		private var bVmNetwork: Boolean? = true;fun vmNetwork(block: () -> Boolean?) { bVmNetwork = block() ?: true }
		private var bProviderNetworkExternalId: String? = "";fun providerNetworkExternalId(block: () -> String?) { bProviderNetworkExternalId = block() ?: "" }
		private var bFreeTextComment: String? = "";fun freeTextComment(block: () -> String?) { bFreeTextComment = block() ?: "" }
		private var bLabel: String? = "";fun label(block: () -> String?) { bLabel = block() ?: "" }
		private var bVdsmName: String? = "";fun vdsmName(block: () -> String?) { bVdsmName = block() ?: "" }
		private var bProviderPhysicalNetworkId: UUID? = null;fun providerPhysicalNetworkId(block: () -> UUID?) { bProviderPhysicalNetworkId = block() }
		private var bPortIsolation: Boolean? = false;fun portIsolation(block: () -> Boolean?) { bPortIsolation = block() ?: false }
		private var bStoragePool: StoragePoolEntity? = null;fun storagePool(block: () -> StoragePoolEntity?) { bStoragePool = block() }
		private var bProvider: ProvidersEntity? = null;fun provider(block: () -> ProvidersEntity?) { bProvider = block() }
		private var bDnsConfiguration: DnsResolverConfigurationEntity? = null;fun dnsConfiguration(block: () -> DnsResolverConfigurationEntity?) { bDnsConfiguration = block() }
		private var bNetworkClusters: MutableSet<NetworkClusterEntity> = mutableSetOf(); fun networkClusters(block: () -> MutableSet<NetworkClusterEntity>?) { bNetworkClusters = block() ?: mutableSetOf() } // ADD THIS
		private var bVnicProfiles: MutableSet<VnicProfileEntity>? = mutableSetOf();fun vnicProfiles(block: () -> MutableSet<VnicProfileEntity>?) { bVnicProfiles = block() ?: mutableSetOf() }
		fun build(): NetworkEntity = NetworkEntity(bId, bName, bDescription, bType, bAddr, bSubnet, bGateway, bStp, bVlanId, bMtu, bVmNetwork, bProviderNetworkExternalId, bFreeTextComment, bLabel, bVdsmName, bProviderPhysicalNetworkId, bPortIsolation, bStoragePool, bProvider, bDnsConfiguration, bNetworkClusters, bVnicProfiles)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): NetworkEntity = Builder().apply(block).build()
	}
}
