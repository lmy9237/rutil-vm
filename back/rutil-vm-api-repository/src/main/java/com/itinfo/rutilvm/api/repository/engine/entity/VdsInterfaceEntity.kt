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
	var name: String? = null,
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	var vdsId: UUID? = null,
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
