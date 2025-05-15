package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.common.gson
import org.hibernate.annotations.Type
import org.hibernate.annotations.UpdateTimestamp
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

private val log = LoggerFactory.getLogger(NetworkAttachmentEntity::class.java)

/**
 * [NetworkAttachmentEntity]
 * 네트워크 인터페이스 (NIC) 정보
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
@Table(name = "network_attachment")
class NetworkAttachmentEntity(
	@Id
	@Column(name = "id", unique = true, nullable = true)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val id: UUID? = null,
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name = "network_id", referencedColumnName = "id", nullable = false)
	var logicalNetwork: NetworkEntity? = null,
	@OneToOne(fetch=FetchType.LAZY)
	@JoinColumn(name = "nic_id", referencedColumnName = "id", nullable = false)
	var vdsInterface: VdsInterfaceEntity? = null,

	// Link to the Logical Network being attached

	// THIS IS THE KEY: DNS configuration SPECIFIC to THIS attachment.
	// This allows overriding or specifying DNS for how this logicalNetwork
	// is realized on this vdsInterface. It can be different from
	// logicalNetwork.logicalNetworkDnsConfiguration.

	// Other attachment-specific properties (boot_protocol, static IP, gateway, etc.)
	var bootProtocol: String? = null, // e.g., "STATIC", "DHCP", "NONE"
	var address: String? = null,
	var netmask: String? = null,
	var gateway: String? = null,
	@Column(name="_create_date")
	val createDate: LocalDateTime = LocalDateTime.now(),
	@UpdateTimestamp
	@Column(name="_update_date", nullable=true)
	var updateDate: LocalDateTime? = null,
	var ipv6BootProtocol: String? = null,
	var ipv6Address: String? = null,
	var ipv6Prefix: String? = null,
	var ipv6Gateway: String? = null,
	@ManyToOne(
		fetch=FetchType.LAZY,
		cascade=[CascadeType.PERSIST, CascadeType.MERGE] // Don't cascade REMOVE if DnsResolverConfig is shared
	)
	@JoinColumn(name="dns_resolver_configuration_id", referencedColumnName = "id", nullable = true)
	var attachmentSpecificDnsConfiguration: DnsResolverConfigurationEntity? = null,
): Serializable {

	override fun equals(other: Any?): Boolean {
		if (this === other) return true
		if (other !is NetworkAttachmentEntity) return false
		return id == other.id
	}
	override fun hashCode(): Int = id.hashCode()
}
