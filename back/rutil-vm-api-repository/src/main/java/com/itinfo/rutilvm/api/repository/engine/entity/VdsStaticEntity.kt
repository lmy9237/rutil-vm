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
import javax.persistence.PrimaryKeyJoinColumn
import javax.persistence.Table

/**
 *
 * [VdsStaticEntity]
 * 호스트 정보
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
@Table(name = "vds_static")
class VdsStaticEntity(
	@Id
	@Column(name = "vds_id", unique = true, nullable = true)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val vdsId: UUID? = null,
	var vdsName: String = "",
	var vdsUniqueId: String = "",
	var hostName: String = "",
	var port: Int? = 0,
	@Column(name = "cluster_id", unique = true, nullable = true)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	var clusterId: UUID? = null,
	var serverSslEnabled: Boolean? = null,
	var vdsTyoe: Int? = 0,
	var pmEnabled: Boolean? = false,
	@Column(name="_create_date", nullable=true)
	val createDate: LocalDateTime = LocalDateTime.now(),
	@Column(name="_update_date", nullable=true)
	var updateDate: LocalDateTime? = null,

	var otpValidity: Long? = 0L,
	var vdsSpmPriority: Short? = 5, // smallint maps to Short
	var recoverable: Boolean = true,
	@Column(name = "sshkeyfingerprint", length = 1024)
	var sshKeyFingerprint: String? = "",
	var pmProxyPreferences: String? = "",
	var consoleAddress: String? = "",
	var sshUsername: String? = "",
	var sshPort: Int? = 0,

	@Lob // For TEXT type
	@Type(type="org.hibernate.type.TextType")
	var freeTextComment: String = "",
	var disableAutoPm: Boolean? = false,
	var pmDetectKdump: Boolean = false,
	@Column(name = "host_provider_id")
	var hostProviderId: UUID? = null, // Assuming Provider entity not mapped here
	@Lob
	@Type(type="org.hibernate.type.TextType")
	var kernelCmdline: String? = null,
	@Lob // For TEXT type
	@Type(type="org.hibernate.type.TextType")
	var lastStoredKernelCmdline: String? = null,
	var reinstallRequired: Boolean = false,
	var vgpuPlacement: Int = 1,
	var sshPublicKey: String? = "",
	// Relationships
	// One-to-One relationship to VdsDynamic
	// VdsStatic is the "owner" of this relationship if VdsDynamic's PK is also its FK.
	// 'mappedBy' indicates that the foreign key management is on the VdsDynamic side.
	// However, since vds_dynamic.vds_id IS the PK and also the FK, it's a shared primary key scenario.
	@OneToOne(
		fetch=FetchType.LAZY,
		cascade=[CascadeType.ALL]
	)
	@JoinColumn(
		name="vds_id",
		referencedColumnName="vds_id",
		insertable=false,
		updatable=false
	)
	var vdsDynamic: VdsDynamicEntity? = null,
	@OneToMany(
		mappedBy="vdsStatic",
		cascade=[CascadeType.ALL],
		fetch=FetchType.LAZY,
		orphanRemoval = true
	)
	var interfaces: MutableSet<VdsInterfaceEntity> = mutableSetOf(),
	@OneToMany(mappedBy="vdsStatic",
		cascade=[CascadeType.ALL],
		fetch=FetchType.LAZY,
		orphanRemoval=true
	)
	var interfaceStatistics: MutableSet<VdsInterfaceStatisticsEntity> = mutableSetOf()
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	fun addInterface(vdsInterface: VdsInterfaceEntity) {
		interfaces.add(vdsInterface)
		vdsInterface.vdsStatic = this
	}

	fun removeInterface(vdsInterface: VdsInterfaceEntity) {
		interfaces.remove(vdsInterface)
		vdsInterface.vdsStatic = null
	}

	fun addInterfaceStatistic(stat: VdsInterfaceStatisticsEntity) {
		interfaceStatistics.add(stat)
		stat.vdsStatic = this
	}

	fun removeInterfaceStatistic(stat: VdsInterfaceStatisticsEntity) {
		interfaceStatistics.remove(stat)
		stat.vdsStatic = null
	}

	// Override equals and hashCode if not using data class or if specific fields are needed
	// For data classes, they are auto-generated based on primary constructor properties
	override fun equals(other: Any?): Boolean {
		if (this === other) return true
		if (javaClass != other?.javaClass) return false
		other as VdsStaticEntity
		return vdsId == other.vdsId
	}

	override fun hashCode(): Int = vdsId.hashCode()
}
