package com.itinfo.rutilvm.api.model.network

import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.model.fromHostNicToIdentifiedVo
import com.itinfo.rutilvm.api.model.fromHostToIdentifiedVo
import com.itinfo.rutilvm.api.model.fromNetworkToIdentifiedVo
import com.itinfo.rutilvm.api.ovirt.business.InterfaceStatus
import com.itinfo.rutilvm.api.ovirt.business.Ipv4BootProtocol
import com.itinfo.rutilvm.api.ovirt.business.Ipv6BootProtocol
import com.itinfo.rutilvm.api.ovirt.business.toInterfaceStatus
import com.itinfo.rutilvm.api.ovirt.business.toIpv4BootProtocol
import com.itinfo.rutilvm.api.ovirt.business.toIpv6BootProtocol
import com.itinfo.rutilvm.util.ovirt.*

import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.builders.HostNicBuilder
import org.ovirt.engine.sdk4.types.*
import org.slf4j.LoggerFactory
import java.io.Serializable
import java.math.BigDecimal
import java.math.BigInteger

private val log = LoggerFactory.getLogger(HostNicVo::class.java)

/**
 * [HostNicVo]
 *
 * @property id [String]
 * @property name [String]
 * @property macAddress [String]
 * @property bridged [Boolean]
 * @property mtu [Int]
 // * @property customConfiguration [Boolean]
 * @property status [InterfaceStatus]
 * @property speed [BigInteger]
 * @property rxSpeed [BigInteger]
 * @property txSpeed [BigInteger]
 * @property rxTotalSpeed [BigInteger]
 * @property txTotalSpeed [BigInteger]
 * @property rxTotalError [BigInteger]
 * @property txTotalError [BigInteger]
 * @property vlan [String]
 * @property adAggregatorId [Int]
 * @property bootProtocol [BootProtocol]
 * @property ipv6BootProtocol [BootProtocol]
 * @property ip [IpVo]
 * @property ipv6 [IpVo]]
 * @property baseInterface [IdentifiedVo]
 * @property bondingVo [bondingVo]
 * @property hostVo [IdentifiedVo]
 * @property networkVo [IdentifiedVo]
 */
class HostNicVo(
	val id: String = "",
	val name: String = "",
	val macAddress: String = "",
	val mtu: Int = 0,
	val bridged: Boolean = false,
	val status: InterfaceStatus? = InterfaceStatus.down,
	val speed: BigInteger? = BigInteger.ZERO,
	val rxSpeed: BigDecimal? = BigDecimal.ZERO,
	val txSpeed: BigDecimal? = BigDecimal.ZERO,
	val rxTotalSpeed: BigInteger = BigInteger.ZERO,
	val txTotalSpeed: BigInteger = BigInteger.ZERO,
	val rxTotalError: BigInteger = BigInteger.ZERO,
	val txTotalError: BigInteger = BigInteger.ZERO,
	val vlan: String = "",
	val adAggregatorId: Int = 0,
	val bootProtocol: Ipv4BootProtocol? = Ipv4BootProtocol.none,
	val ipv6BootProtocol: Ipv6BootProtocol? = Ipv6BootProtocol.none,
	val ip: IpVo = IpVo(),
	val ipv6: IpVo = IpVo(),
	val baseInterface: IdentifiedVo = IdentifiedVo(),
	val bondingVo: BondingVo = BondingVo(), // 본딩
	val hostVo: IdentifiedVo = IdentifiedVo(),
	val networkVo: IdentifiedVo = IdentifiedVo(), // null 일수도 잇음
	// val networkVo: NetworkVo = NetworkVo(),
) : Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bId: String = ""; fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String = ""; fun name(block: () -> String?) { bName = block() ?: "" }
		private var bMacAddress: String = ""; fun macAddress(block: () -> String?) { bMacAddress = block() ?: "" }
		private var bMtu: Int = 0; fun mtu(block: () -> Int?) { bMtu = block() ?: 0 }
		private var bBridged: Boolean = false; fun bridged(block: () -> Boolean?) { bBridged = block() ?: false }
		// private var bCustomConfiguration: Boolean = false; fun customConfiguration(block: () -> Boolean?) { bCustomConfiguration = block() ?: false }
		private var bStatus: InterfaceStatus? = InterfaceStatus.down; fun status(block: () -> InterfaceStatus?) { bStatus = block() ?: InterfaceStatus.down }
		private var bSpeed: BigInteger? = BigInteger.ZERO; fun speed(block: () -> BigInteger?) { bSpeed = block() ?: BigInteger.ZERO }
		private var bRxSpeed: BigDecimal? = BigDecimal.ZERO; fun rxSpeed(block: () -> BigDecimal?) { bRxSpeed = block() ?: BigDecimal.ZERO }
		private var bTxSpeed: BigDecimal? = BigDecimal.ZERO; fun txSpeed(block: () -> BigDecimal?) { bTxSpeed = block() ?: BigDecimal.ZERO }
		private var bRxTotalSpeed: BigInteger = BigInteger.ZERO; fun rxTotalSpeed(block: () -> BigInteger?) { bRxTotalSpeed = block() ?: BigInteger.ZERO }
		private var bTxTotalSpeed: BigInteger = BigInteger.ZERO; fun txTotalSpeed(block: () -> BigInteger?) { bTxTotalSpeed = block() ?: BigInteger.ZERO }
		private var bRxTotalError: BigInteger = BigInteger.ZERO; fun rxTotalError(block: () -> BigInteger?) { bRxTotalError = block() ?: BigInteger.ZERO }
		private var bTxTotalError: BigInteger = BigInteger.ZERO; fun txTotalError(block: () -> BigInteger?) { bTxTotalError = block() ?: BigInteger.ZERO }
		private var bVlan: String = ""; fun vlan(block: () -> String?) { bVlan = block() ?: "" }
		private var bAdAggregatorId: Int = 0; fun adAggregatorId(block: () -> Int?) { bAdAggregatorId = block() ?: 0 }
		private var bBootProtocol: Ipv4BootProtocol? = Ipv4BootProtocol.none; fun bootProtocol(block: () -> Ipv4BootProtocol?) { bBootProtocol = block() ?: Ipv4BootProtocol.none }
		private var bIpv6BootProtocol: Ipv6BootProtocol? = Ipv6BootProtocol.none; fun ipv6BootProtocol(block: () -> Ipv6BootProtocol?) { bIpv6BootProtocol = block() ?: Ipv6BootProtocol.none }
		private var bIp: IpVo = IpVo(); fun ip(block: () -> IpVo?) { bIp = block() ?: IpVo() }
		private var bIpv6: IpVo = IpVo(); fun ipv6(block: () -> IpVo?) { bIpv6 = block() ?: IpVo() }
		private var bBaseInterface: IdentifiedVo = IdentifiedVo(); fun baseInterface(block: () -> IdentifiedVo?) { bBaseInterface = block() ?: IdentifiedVo() }
		private var bBondingVo: BondingVo = BondingVo(); fun bondingVo(block: () -> BondingVo?) { bBondingVo = block() ?: BondingVo() }
		private var bHostVo: IdentifiedVo = IdentifiedVo(); fun hostVo(block: () -> IdentifiedVo?) { bHostVo = block() ?: IdentifiedVo() }
		private var bNetworkVo: IdentifiedVo = IdentifiedVo(); fun networkVo(block: () -> IdentifiedVo?) { bNetworkVo = block() ?: IdentifiedVo() }
		// private var bNetworkVo: NetworkVo = NetworkVo(); fun networkVo(block: () -> NetworkVo?) { bNetworkVo = block() ?: NetworkVo() }

		fun build(): HostNicVo = HostNicVo( bId,  bName,  bMacAddress,  bMtu,  bBridged,  bStatus,  bSpeed,  bRxSpeed,  bTxSpeed,  bRxTotalSpeed,  bTxTotalSpeed,  bRxTotalError,  bTxTotalError,  bVlan, bAdAggregatorId,  bBootProtocol,  bIpv6BootProtocol,  bIp,  bIpv6, bBaseInterface, bBondingVo,  bHostVo,  bNetworkVo, )
	}

	companion object {
		inline fun builder(block: HostNicVo.Builder.() -> Unit): HostNicVo = HostNicVo.Builder().apply(block).build()
	}
}

/**
 * 호스트 nic id & name
 */
fun HostNic.toHostNicIdName(): HostNicVo = HostNicVo.builder {
	id { this@toHostNicIdName.id() }
	name { this@toHostNicIdName.name() }
}
fun List<HostNic>.toHostNicIdNames(): List<HostNicVo> =
	this@toHostNicIdNames.map { it.toHostNicIdName() }


fun HostNic.toHostNicVo(conn: Connection): HostNicVo {
	val hostNic = this@toHostNicVo
	val network: Network? =
		if (hostNic.networkPresent() && hostNic.network().idPresent()) conn.findNetwork(hostNic.network().id()).getOrNull()
		else null
	val bond: Bonding? = if(hostNic.bondingPresent()) hostNic.bonding() else null
	val base: HostNic? =
		if(hostNic.baseInterfacePresent()) {
			conn.findAllHostNicsFromHost(hostNic.host().id()).getOrDefault(emptyList())
				.firstOrNull { it.name() == hostNic.baseInterface() }
		} else { null }

	return HostNicVo.builder {
		id { hostNic.id() }
		name { hostNic.name() }
		baseInterface { base?.fromHostNicToIdentifiedVo()  }
		bridged { hostNic.bridged() }
		macAddress { if(hostNic.macPresent()) hostNic.mac().address() else "" }
		mtu { hostNic.mtuAsInteger() }
		status { hostNic.status().toInterfaceStatus() }
		speed { hostNic.speed() }
		rxSpeed { hostNic.statistics().findSpeedDecimal("data.current.rx.bps") }
		txSpeed { hostNic.statistics().findSpeedDecimal("data.current.tx.bps") }
		rxTotalSpeed { hostNic.statistics().findSpeed("data.total.rx") }
		txTotalSpeed { hostNic.statistics().findSpeed("data.total.tx") }
		rxTotalError { hostNic.statistics().findSpeed("errors.total.rx") }
		txTotalError { hostNic.statistics().findSpeed("errors.total.tx") }
		adAggregatorId { if(hostNic.adAggregatorIdPresent()) { hostNic.adAggregatorIdAsInteger() } else null }
		bootProtocol { hostNic.bootProtocol().toIpv4BootProtocol() }
		ipv6BootProtocol { hostNic.ipv6BootProtocol().toIpv6BootProtocol() }
		ip { if(hostNic.ipPresent()) hostNic.ip().toIpVo() else null }
		ipv6 { if(hostNic.ipv6Present()) hostNic.ipv6().toIpVo() else null }
		bondingVo { bond?.toBondingVo(conn, hostNic.host().id()) }
		hostVo { hostNic.host().fromHostToIdentifiedVo() }
		networkVo { network?.fromNetworkToIdentifiedVo() }
	}
}
fun List<HostNic>.toHostNicVos(conn: Connection): List<HostNicVo> =
	this@toHostNicVos.map { it.toHostNicVo(conn) }


fun HostNic.toSlaveHostNicVo(conn: Connection): HostNicVo {
	val hostNic = this@toSlaveHostNicVo
	val statistics: List<Statistic> = conn.findAllStatisticsFromHostNic(hostNic.host().id(), hostNic.id()).getOrDefault(listOf())

	return HostNicVo.builder {
		id { hostNic.id() }
		name { hostNic.name() }
		status { hostNic.status().toInterfaceStatus() }
		speed { hostNic.speed() }
		macAddress { if(hostNic.macPresent()) hostNic.mac().address() else "" }
		rxSpeed { statistics.findSpeedDecimal("data.current.rx.bps") }
		txSpeed { statistics.findSpeedDecimal("data.current.tx.bps") }
		rxTotalSpeed { statistics.findSpeed("data.total.rx") }
		txTotalSpeed { statistics.findSpeed("data.total.tx") }
		rxTotalError { statistics.findSpeed("errors.total.rx") }
		txTotalError { statistics.findSpeed("errors.total.tx") }
	}
}
fun List<HostNic>.toSlaveHostNicVos(conn: Connection): List<HostNicVo> =
	this@toSlaveHostNicVos.map { it.toSlaveHostNicVo(conn) }


// region: builder

/**
 * 호스트 네트워크 생성/편집 modified_bonds
 */
fun HostNicVo.toModifiedBond(): HostNic {
	return HostNicBuilder()
			.name(name)
			.bonding(bondingVo.toBonding())
			.build()
}
fun List<HostNicVo>.toModifiedBonds(): List<HostNic> =
	this.map { it.toModifiedBond() }

/**
 * 호스트 본딩 삭제 remove_bonds
 */
fun HostNicVo.toRemoveBond(): HostNic {
	return HostNicBuilder().name(name).build()
}

fun List<HostNicVo>.toRemoveBonds(): List<HostNic> =
	this.map { it.toRemoveBond() }

// endregion
