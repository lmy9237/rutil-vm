package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.api.ovirt.business.InterfaceStatus
import com.itinfo.rutilvm.api.ovirt.business.Ipv4BootProtocol
import com.itinfo.rutilvm.api.ovirt.business.Ipv6BootProtocol
import com.itinfo.rutilvm.common.gson
import org.hibernate.annotations.Immutable
import org.hibernate.annotations.Type
import java.io.Serializable
import java.math.BigDecimal
import java.math.BigInteger
import java.util.UUID
import javax.persistence.Id
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.OneToMany
import javax.persistence.Table

/**
 * [VdsInterfaceViewEntity]
 * 호스트 네트워크 인터페이스
 *
 * @author 이찬희 (@chanhi2000)
 */
@Entity
@Immutable
@Table(name = "vds_interface_view")
class VdsInterfaceViewEntity(
	@Id
	@Column(name = "id", nullable=false, unique=true)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val id: UUID? = null,
	val name: String? = null,

	// --- Network & VLAN ---
	val networkName: String? = null,
	val baseInterface: String? = null,
	val vlanId: Int? = null,

	// --- Addressing & Routing ---
	val macAddr: String? = null,
	val addr: String? = null, // IPv4 address
	val subnet: String? = null,
	val gateway: String? = null,
	@Column(name = "ipv4_default_route")
	val ipv4DefaultRoute: Boolean? = null,

	@Column(name = "ipv6_address")
	val ipv6Address: String? = null,
	@Column(name = "ipv6_prefix")
	val ipv6Prefix: Int? = null,
	@Column(name = "ipv6_gateway")
	val ipv6Gateway: String? = null,

	@Column(name = "boot_protocol")
	private val _bootProtocol: Int? = null,
	@Column(name = "ipv6_boot_protocol")
	private val _ipv6BootProtocol: Int? = null,

	// --- Bonding Info ---
	val isBond: Boolean? = null,
	val bondName: String? = null,
	val bondType: Int? = null,
	val bondOpts: String? = null,
	val bondActiveSlave: String? = null,

	// --- Physical & Logical Properties ---
	val type: Int? = null,
	val speed: Int? = null,
	val mtu: Int? = null,
	val bridged: Boolean? = null,
	val labels: String? = null,
	val qosOverridden: Boolean? = null,
	@Column(name = "reported_switch_type")
	val reportedSwitchType: String? = null,
	val adPartnerMac: String? = null,
	val adAggregatorId: Int? = null,

	// --- Statistics ---
	@Column(name = "iface_status")
	private val _ifaceStatus: Int? = null,
	val rxRate: BigDecimal? = null,
	val txRate: BigDecimal? = null,
	val rxDrop: BigInteger? = BigInteger.ZERO,
	val txDrop: BigInteger? = BigInteger.ZERO,
	val rxTotal: BigInteger? = BigInteger.ZERO,
	val txTotal: BigInteger? = BigInteger.ZERO,
	val rxOffset: BigInteger? = BigInteger.ZERO,
	val txOffset: BigInteger? = BigInteger.ZERO,
	val sampleTime: BigDecimal? = null,
	val isVds: Int? = null, // This is a literal '1' in the view, not a real column
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(
		name="cluster_id",
		referencedColumnName="cluster_id",
		insertable=false,
		updatable=false
	)
	val cluster: ClusterViewEntity? = null,
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(
		name="vds_id",
		referencedColumnName="vds_id",
		insertable=false,
		updatable=false
	)
	val host: VdsEntity? = null,
) : Serializable {

val ifaceStatus: InterfaceStatus?			get() = InterfaceStatus.forValue(_ifaceStatus)
val bootProtocol: Ipv4BootProtocol?		get() = Ipv4BootProtocol.forValue(_bootProtocol)
val ipv6BootProtocol: Ipv6BootProtocol?	get() = Ipv6BootProtocol.forValue(_ipv6BootProtocol)

	override fun toString(): String =
		gson.toJson(this@VdsInterfaceViewEntity)

	class Builder {
		private var bId: UUID? = null;fun id(block: () -> UUID?) { bId = block() }
		private var bName: String? = null;fun name(block: () -> String?) { bName = block() }
		private var bVdsId: UUID? = null;fun vdsId(block: () -> UUID?) { bVdsId = block() }
		private var bVdsName: String? = null;fun vdsName(block: () -> String?) { bVdsName = block() }
		private var bClusterId: UUID? = null;fun clusterId(block: () -> UUID?) { bClusterId = block() }
		private var bNetworkName: String? = null;fun networkName(block: () -> String?) { bNetworkName = block() }
		private var bBaseInterface: String? = null;fun baseInterface(block: () -> String?) { bBaseInterface = block() }
		private var bVlanId: Int? = null;fun vlanId(block: () -> Int?) { bVlanId = block() }
		private var bMacAddr: String? = null;fun macAddr(block: () -> String?) { bMacAddr = block() }
		private var bAddr: String? = null;fun addr(block: () -> String?) { bAddr = block() }
		private var bSubnet: String? = null;fun subnet(block: () -> String?) { bSubnet = block() }
		private var bGateway: String? = null;fun gateway(block: () -> String?) { bGateway = block() }
		private var bIpv4DefaultRoute: Boolean? = null;fun ipv4DefaultRoute(block: () -> Boolean?) { bIpv4DefaultRoute = block() }
		private var bIpv6Address: String? = null;fun ipv6Address(block: () -> String?) { bIpv6Address = block() }
		private var bIpv6Prefix: Int? = null;fun ipv6Prefix(block: () -> Int?) { bIpv6Prefix = block() }
		private var bIpv6Gateway: String? = null;fun ipv6Gateway(block: () -> String?) { bIpv6Gateway = block() }
		private var bBootProtocol: Int? = null;fun bootProtocol(block: () -> Int?) { bBootProtocol = block() }
		private var bIpv6BootProtocol: Int? = null;fun ipv6BootProtocol(block: () -> Int?) { bIpv6BootProtocol = block() }
		private var bIsBond: Boolean? = null;fun isBond(block: () -> Boolean?) { bIsBond = block() }
		private var bBondName: String? = null;fun bondName(block: () -> String?) { bBondName = block() }
		private var bBondType: Int? = null;fun bondType(block: () -> Int?) { bBondType = block() }
		private var bBondOpts: String? = null;fun bondOpts(block: () -> String?) { bBondOpts = block() }
		private var bBondActiveSlave: String? = null;fun bondActiveSlave(block: () -> String?) { bBondActiveSlave = block() }
		private var bType: Int? = null;fun type(block: () -> Int?) { bType = block() }
		private var bSpeed: Int? = null;fun speed(block: () -> Int?) { bSpeed = block() }
		private var bMtu: Int? = null;fun mtu(block: () -> Int?) { bMtu = block() }
		private var bBridged: Boolean? = null;fun bridged(block: () -> Boolean?) { bBridged = block() }
		private var bLabels: String? = null;fun labels(block: () -> String?) { bLabels = block() }
		private var bQosOverridden: Boolean? = null;fun qosOverridden(block: () -> Boolean?) { bQosOverridden = block() }
		private var bReportedSwitchType: String? = null;fun reportedSwitchType(block: () -> String?) { bReportedSwitchType = block() }
		private var bAdPartnerMac: String? = null;fun adPartnerMac(block: () -> String?) { bAdPartnerMac = block() }
		private var bAdAggregatorId: Int? = null;fun adAggregatorId(block: () -> Int?) { bAdAggregatorId = block() }
		private var bIfaceStatus: Int? = null;fun ifaceStatus(block: () -> Int?) { bIfaceStatus = block() }
		private var bRxRate: BigDecimal? = null;fun rxRate(block: () -> BigDecimal?) { bRxRate = block() }
		private var bTxRate: BigDecimal? = null;fun txRate(block: () -> BigDecimal?) { bTxRate = block() }
		private var bRxDrop: BigInteger? = BigInteger.ZERO;fun rxDrop(block: () -> BigInteger?) { bRxDrop = block() ?: BigInteger.ZERO }
		private var bTxDrop: BigInteger? = BigInteger.ZERO;fun txDrop(block: () -> BigInteger?) { bTxDrop = block() ?: BigInteger.ZERO }
		private var bRxTotal: BigInteger? = BigInteger.ZERO;fun rxTotal(block: () -> BigInteger?) { bRxTotal = block() ?: BigInteger.ZERO }
		private var bTxTotal: BigInteger? = BigInteger.ZERO;fun txTotal(block: () -> BigInteger?) { bTxTotal = block() ?: BigInteger.ZERO }
		private var bRxOffset: BigInteger? = BigInteger.ZERO;fun rxOffset(block: () -> BigInteger?) { bRxOffset = block() ?: BigInteger.ZERO }
		private var bTxOffset: BigInteger? = BigInteger.ZERO;fun txOffset(block: () -> BigInteger?) { bTxOffset = block() ?: BigInteger.ZERO }
		private var bSampleTime: BigDecimal? = null;fun sampleTime(block: () -> BigDecimal?) { bSampleTime = block() }
		private var bIsVds: Int? = null;fun isVds(block: () -> Int?) { bIsVds = block() }
		private var bCluster: ClusterViewEntity? = null;fun cluster(block: () -> ClusterViewEntity?) { bCluster = block() }
		private var bHost: VdsEntity? = null;fun host(block: () -> VdsEntity?) { bHost = block() }

		fun build(): VdsInterfaceViewEntity = VdsInterfaceViewEntity(bId, bName, bNetworkName, bBaseInterface, bVlanId, bMacAddr, bAddr, bSubnet, bGateway, bIpv4DefaultRoute, bIpv6Address, bIpv6Prefix, bIpv6Gateway, bBootProtocol, bIpv6BootProtocol, bIsBond, bBondName, bBondType, bBondOpts, bBondActiveSlave, bType, bSpeed, bMtu, bBridged, bLabels, bQosOverridden, bReportedSwitchType, bAdPartnerMac, bAdAggregatorId, bIfaceStatus, bRxRate, bTxRate, bRxDrop, bTxDrop, bRxTotal, bTxTotal, bRxOffset, bTxOffset, bSampleTime, bIsVds, bCluster, bHost)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): VdsInterfaceViewEntity = Builder().apply(block).build()
	}
}
