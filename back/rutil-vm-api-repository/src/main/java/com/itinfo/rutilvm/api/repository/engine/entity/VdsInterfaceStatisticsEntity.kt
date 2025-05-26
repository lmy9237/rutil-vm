package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.common.gson
import org.hibernate.annotations.Type
import org.slf4j.LoggerFactory
import java.time.LocalDateTime
import java.util.UUID
import java.io.Serializable
import java.math.BigDecimal
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

/**
 *
 * [VdsInterfaceStatisticsEntity]
 * 호스트 네트워크 인터페이스 (NIC) 통계 정보
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
@Table(name = "vds_interfaces_statistics")
class VdsInterfaceStatisticsEntity (
	@Id
	@Column(name = "id", nullable = false)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val id: UUID, // This is its own PK, not an FK to vds_interface based on DDL
// @Column(name = "vds_id") // Handled by ManyToOne
// var vdsId: UUID? = null,
	var rxRate: BigDecimal? = BigDecimal.ZERO,
	var txRate: BigDecimal? = BigDecimal.ZERO,
	var rxDrop: BigDecimal? = BigDecimal.ZERO,
	var txDrop: BigDecimal? = BigDecimal.ZERO,
	@Column(name = "iface_status")
	var ifaceStatus: Int? = null, // Consider an Enum

	@Column(name = "_update_date")
	var updateDate: LocalDateTime? = null,
	var rxTotal: BigDecimal? = BigDecimal.ZERO,
	var rxOffset: BigDecimal? = BigDecimal.ZERO,
	var txTotal: BigDecimal? = BigDecimal.ZERO,
	var txOffset: BigDecimal? = BigDecimal.ZERO,
	var sampleTime: Double? = 0.0, // float8 maps to Double

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "vds_id", referencedColumnName = "vds_id")
	var vdsStatic: VdsStaticEntity? = null

	// Note: Based on the DDL, there isn't a direct FK from vds_interface_statistics to vds_interface.
	// The statistics are linked to vds_static (the host).
	// If vds_interface_statistics.id was meant to be a FK to vds_interface.id
	// for a OneToOne relationship, the DDL and mapping would be different.
	// (e.g., @MapsId and @OneToOne on vdsInterface field).
	// The current mapping strictly follows the provided DDL.
): Serializable {

	override fun equals(other: Any?): Boolean {
		if (this === other) return true
		if (javaClass != other?.javaClass) return false
		other as VdsInterfaceStatisticsEntity
		return id == other.id
	}

	override fun hashCode(): Int = id.hashCode()
}
