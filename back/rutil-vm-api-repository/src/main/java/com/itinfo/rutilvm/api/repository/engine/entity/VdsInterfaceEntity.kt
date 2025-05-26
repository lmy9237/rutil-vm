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
import javax.persistence.Lob
import javax.persistence.Table

private val log = LoggerFactory.getLogger(VdsInterfaceEntity::class.java)

/**
 *
 * [VdsInterfaceEntity]
 * 호스트 네트워크 인터페이스 (NIC) 정보
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
@Table(name = "vds_interface")
class VdsInterfaceEntity(
	@Id
	@Column(name = "id", unique = true, nullable = true)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val id: UUID? = null,
	var name: String? = "",
	var networkName: String? = "",
	// @Column(name = "vds_id") // This is handled by the ManyToOne relationship below
	// @Type(type = "org.hibernate.type.PostgresUUIDType")
	// var vdsId: UUID? = null,
	var macAddr: String? = "",
	var isBond: Boolean? = false,
	var bondName: String? = "",
	var bondType: Int? = -1, // Consider an Enum for this if values are known
	var bondOpts: String? = "",
	var vlanId: Int? = null,
	var speed: Int? = null,
	var addr: String? = "",
	var subnet: String? = "",
	var gateway: String? = "",
	var bootProtocol: Int? = null, // Consider an Enum
	var type: Int? = 0, // Consider an Enum
	@Column(name="_create_date", nullable=true)
	val createDate: LocalDateTime = LocalDateTime.now(),
	@Column(name="_update_date", nullable=true)
	var updateDate: LocalDateTime? = null,
	var mtu: Int? = null,
	var bridged: Boolean = true,
	@Lob // For TEXT type
	@Type(type="org.hibernate.type.TextType")
	var labels: String? = "",
	var qosOverridden: Boolean = false,
	var baseInterface: String? = "", // Name of the base interface for VLANs/slaves
	@Column(name = "ipv6_boot_protocol")
	var ipv6BootProtocol: Int? = null, // Consider an Enum
	var ipv6Address: String? = "",
	var ipv6Prefix: Int? = null,
	var ipv6Gateway: String? = "",
	var adPartnerMac: String? = "",
	var reportedSwitchType: String? = "",
	var adAggregatorId: Int? = null,
	var bondActiveSlave: String? = "",
	var ipv4DefaultRoute: Boolean = false,

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "vds_id", referencedColumnName = "vds_id") // Foreign key column in vds_interface
	var vdsStatic: VdsStaticEntity? = null,

	@OneToOne(
		mappedBy="vdsInterface",
		cascade=[CascadeType.ALL],
		orphanRemoval=true,
		fetch=FetchType.LAZY
	)
	private var _activeNetworkAttachment: NetworkAttachmentEntity? = null
): Serializable {
	var activeNetworkAttachment = _activeNetworkAttachment
		set(newVal) {
			this.activeNetworkAttachment = newVal
			newVal?.vdsInterface = this
		}

	// equals & hashCode
	override fun equals(other: Any?): Boolean {
		if (this === other) return true;
		if (other !is VdsInterfaceEntity) return false
		return id == other.id
	}
	override fun hashCode(): Int = id.hashCode()
}
