package com.itinfo.rutilvm.api.repository.engine.entity

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
 *
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
	val name: String = "",
	val description: String = "",
	val vlanId: Int? = null,
	val mtu: Int? = 0,
	val vmNetwork: Boolean? = true,
	val freeTextComment: String? = "",
	// This is the link from Network to its DnsResolverConfiguration
	// It's a one-to-one relationship from the perspective of the Network,
	// but dns_resolver_configuration can be shared (so it's ManyToOne from another view,
	// but a Network has AT MOST ONE dns_resolver_configuration).
	// We make it optional (nullable = true) if a network doesn't have to have DNS config.
	@OneToOne(fetch = FetchType.LAZY, cascade = [CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH]) // Cascade ALL might delete a shared config
	@JoinColumn(name = "dns_resolver_configuration_id", referencedColumnName = "id", nullable = true)
	var dnsConfiguration: DnsResolverConfigurationEntity? = null
	// ... other network properties
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bId: UUID? = null;fun id(block: () -> UUID?) { bId = block() }
		private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bDescription: String = "";fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bVlanId: Int? = null;fun vlanId(block: () -> Int?) { bVlanId = block() }
		private var bMtu: Int? = 0;fun mtu(block: () -> Int?) { bMtu = block() ?: 0 }
		private var bVmNetwork: Boolean? = true;fun vmNetwork(block: () -> Boolean?) { bVmNetwork = block() ?: true }
		private var bFreeTextComment: String? = "";fun freeTextComment(block: () -> String?) { bFreeTextComment = block() ?: "" }
		private var bDnsConfiguration: DnsResolverConfigurationEntity? = null;fun dnsConfiguration(block: () -> DnsResolverConfigurationEntity?) { bDnsConfiguration = block() }
		fun build(): NetworkEntity = NetworkEntity(bId, bName, bDescription, bVlanId, bMtu, bVmNetwork, bFreeTextComment, bDnsConfiguration)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): NetworkEntity = Builder().apply(block).build()
	}
}
