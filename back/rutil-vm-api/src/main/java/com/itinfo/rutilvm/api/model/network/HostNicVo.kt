package com.itinfo.rutilvm.api.model.network

import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.model.fromHostToIdentifiedVo
import com.itinfo.rutilvm.api.model.fromNetworkToIdentifiedVo
import com.itinfo.rutilvm.util.ovirt.*

import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.builders.BondingBuilder
import org.ovirt.engine.sdk4.builders.HostNicBuilder
import org.ovirt.engine.sdk4.builders.NetworkAttachmentBuilder
import org.ovirt.engine.sdk4.types.*
import org.slf4j.LoggerFactory
import java.io.Serializable
import java.math.BigInteger

private val log = LoggerFactory.getLogger(HostNicVo::class.java)

/**
 * [HostNicVo]
 * Host
 * @property id [String]
 * @property name [String]
 * @property bridged [Boolean]
 * @property bootProtocol [BootProtocol]
 * @property ipv4 [String] ip.address
 * @property ipv6 [String]
 * @property macAddress [String]
 * @property mtu [Int]
 * @property status [NicStatus]
 * @property hostVo [IdentifiedVo]
 * @property networkVo [NetworkVo]
 *
 * nic.statistics
 * @property speed [BigInteger] mbps
 * @property rxSpeed [BigInteger] mbps
 * @property txSpeed [BigInteger] mbps
 * @property rxTotalSpeed [BigInteger] byte
 * @property txTotalSpeed [BigInteger] byte
 * @property rxTotalError [BigInteger] byte
 * @property txTotalError [BigInteger] byte
 *
 */
class HostNicVo(
	val id: String = "",
	val name: String = "",
	val bondingVo: BondingVo = BondingVo(), // 본딩
	val bootProtocol: BootProtocol = BootProtocol.NONE,
	val bridged: Boolean = false,
	val customConfiguration: Boolean = false,
	val ip: IpVo = IpVo(),
	val ipv6: IpVo = IpVo(),
	val ipv6BootProtocol: BootProtocol = BootProtocol.NONE,
	val macAddress: String = "",
	val mtu: Int = 0,
	val status: NicStatus = NicStatus.DOWN,
	val hostVo: IdentifiedVo = IdentifiedVo(),
	val networkVo: IdentifiedVo = IdentifiedVo(), // null 일수도 잇음
	val speed: BigInteger = BigInteger.ZERO,
	val rxSpeed: BigInteger = BigInteger.ZERO,
	val txSpeed: BigInteger = BigInteger.ZERO,
	val rxTotalSpeed: BigInteger = BigInteger.ZERO,
	val txTotalSpeed: BigInteger = BigInteger.ZERO,
	val rxTotalError: BigInteger = BigInteger.ZERO,
	val txTotalError: BigInteger = BigInteger.ZERO,
) : Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bId: String = ""; fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String = ""; fun name(block: () -> String?) { bName = block() ?: "" }
		private var bBondingVo: BondingVo = BondingVo(); fun bondingVo(block: () -> BondingVo?) { bBondingVo = block() ?: BondingVo() }
		private var bBootProtocol: BootProtocol = BootProtocol.NONE; fun bootProtocol(block: () -> BootProtocol?) { bBootProtocol = block() ?: BootProtocol.NONE }
		private var bBridged: Boolean = false; fun bridged(block: () -> Boolean?) { bBridged = block() ?: false }
		private var bCustomConfiguration: Boolean = false; fun customConfiguration(block: () -> Boolean?) { bCustomConfiguration = block() ?: false }
		private var bIp: IpVo = IpVo(); fun ip(block: () -> IpVo?) { bIp = block() ?: IpVo() }
		private var bIpv6: IpVo = IpVo(); fun ipv6(block: () -> IpVo?) { bIpv6 = block() ?: IpVo() }
		private var bIpv6BootProtocol: BootProtocol = BootProtocol.NONE; fun ipv6BootProtocol(block: () -> BootProtocol?) { bIpv6BootProtocol = block() ?: BootProtocol.NONE }
		private var bMacAddress: String = ""; fun macAddress(block: () -> String?) { bMacAddress = block() ?: "" }
		private var bMtu: Int = 0; fun mtu(block: () -> Int?) { bMtu = block() ?: 0 }
		private var bStatus: NicStatus = NicStatus.DOWN; fun status(block: () -> NicStatus?) { bStatus = block() ?: NicStatus.DOWN }
		private var bHostVo: IdentifiedVo = IdentifiedVo(); fun hostVo(block: () -> IdentifiedVo?) { bHostVo = block() ?: IdentifiedVo() }
		private var bNetworkVo: IdentifiedVo = IdentifiedVo(); fun networkVo(block: () -> IdentifiedVo?) { bNetworkVo = block() ?: IdentifiedVo() }
		private var bSpeed: BigInteger = BigInteger.ZERO; fun speed(block: () -> BigInteger?) { bSpeed = block() ?: BigInteger.ZERO }
		private var bRxSpeed: BigInteger = BigInteger.ZERO; fun rxSpeed(block: () -> BigInteger?) { bRxSpeed = block() ?: BigInteger.ZERO }
		private var bTxSpeed: BigInteger = BigInteger.ZERO; fun txSpeed(block: () -> BigInteger?) { bTxSpeed = block() ?: BigInteger.ZERO }
		private var bRxTotalSpeed: BigInteger = BigInteger.ZERO; fun rxTotalSpeed(block: () -> BigInteger?) { bRxTotalSpeed = block() ?: BigInteger.ZERO }
		private var bTxTotalSpeed: BigInteger = BigInteger.ZERO; fun txTotalSpeed(block: () -> BigInteger?) { bTxTotalSpeed = block() ?: BigInteger.ZERO }
		private var bRxTotalError: BigInteger = BigInteger.ZERO; fun rxTotalError(block: () -> BigInteger?) { bRxTotalError = block() ?: BigInteger.ZERO }
		private var bTxTotalError: BigInteger = BigInteger.ZERO; fun txTotalError(block: () -> BigInteger?) { bTxTotalError = block() ?: BigInteger.ZERO }

		fun build(): HostNicVo = HostNicVo(bId, bName, bBondingVo, bBootProtocol, bBridged, bCustomConfiguration, bIp, bIpv6, bIpv6BootProtocol, bMacAddress, bMtu, bStatus, bHostVo, bNetworkVo, bSpeed, bRxSpeed, bTxSpeed, bRxTotalSpeed, bTxTotalSpeed, bRxTotalError, bTxTotalError )
	}

	companion object {
		inline fun builder(block: HostNicVo.Builder.() -> Unit): HostNicVo = HostNicVo.Builder().apply(block).build()
	}
}

fun HostNic.toHostNicIdName(): HostNicVo = HostNicVo.builder {
	id { this@toHostNicIdName.id() }
	name { this@toHostNicIdName.name() }
}
fun List<HostNic>.toHostNicIdNames(): List<HostNicVo> =
	this@toHostNicIdNames.map { it.toHostNicIdName() }


fun HostNic.toHostNicVo(conn: Connection): HostNicVo {
	val hostNic = this@toHostNicVo
	val host: Host? = conn.findHost(this@toHostNicVo.host().id()).getOrNull()
	val network: Network? =
		if (hostNic.networkPresent() && hostNic.network().idPresent()) conn.findNetwork(hostNic.network().id()).getOrNull()
		else null
	val statistics: List<Statistic> =conn.findAllStatisticsFromHostNic(hostNic.host().id(), hostNic.id()).getOrDefault(listOf())
	val bond: Bonding? = if(hostNic.bondingPresent()) hostNic.bonding() else null

	return HostNicVo.builder {
		id { hostNic.id() }
		name { hostNic.name() }
		bridged { hostNic.bridged() }
		bootProtocol { hostNic.bootProtocol() }
		ip { if(hostNic.ipPresent()) hostNic.ip().toIp() else null }
		ipv6BootProtocol { hostNic.ipv6BootProtocol() }
		ipv6 { if(hostNic.ipv6Present()) hostNic.ipv6().toIp() else null }
		macAddress { hostNic.mac().address() }
		mtu { hostNic.mtuAsInteger() }
		status { hostNic.status() }
		hostVo { host?.fromHostToIdentifiedVo() }
		networkVo { network?.fromNetworkToIdentifiedVo() }
		bondingVo { bond?.toBondingVo(conn, hostNic.host().id()) }
		speed { hostNic.speed() }
		rxSpeed { statistics.findSpeed("data.current.rx.bps") }
		txSpeed { statistics.findSpeed("data.current.tx.bps") }
		rxTotalSpeed { statistics.findSpeed("data.total.rx") }
		txTotalSpeed { statistics.findSpeed("data.total.tx") }
		rxTotalError { statistics.findSpeed("errors.total.rx") }
		txTotalError { statistics.findSpeed("errors.total.tx") }
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
		status { hostNic.status() }
		speed { hostNic.speed() }
		macAddress { hostNic.mac().address() }
		rxSpeed { statistics.findSpeed("data.current.rx.bps") }
		txSpeed { statistics.findSpeed("data.current.tx.bps") }
		rxTotalSpeed { statistics.findSpeed("data.total.rx") }
		txTotalSpeed { statistics.findSpeed("data.total.tx") }
		rxTotalError { statistics.findSpeed("errors.total.rx") }
		txTotalError { statistics.findSpeed("errors.total.tx") }
	}
}
fun List<HostNic>.toSlaveHostNicVos(conn: Connection): List<HostNicVo> =
	this@toSlaveHostNicVos.map { it.toSlaveHostNicVo(conn) }



fun HostNic.toSetHostNicVo(conn: Connection): HostNicVo {
	val host: Host? = conn.findHost(this@toSetHostNicVo.host().id())
		.getOrNull()
	val network: Network? =
		if (this@toSetHostNicVo.networkPresent()) conn.findNetwork(this@toSetHostNicVo.network().id()).getOrNull()
		else null

	return HostNicVo.builder {
		id { this@toSetHostNicVo.id() }
		name { this@toSetHostNicVo.name() }
		bridged { this@toSetHostNicVo.bridged() }
		status { this@toSetHostNicVo.status() }
		hostVo { host?.fromHostToIdentifiedVo() }
		networkVo { network?.fromNetworkToIdentifiedVo() }
		bondingVo {
			if(this@toSetHostNicVo.bondingPresent())
				this@toSetHostNicVo.bonding().toBondingVo(conn, this@toSetHostNicVo.host().id())
			else null
		}
	}
}
fun List<HostNic>.toSetHostNicVos(conn: Connection): List<HostNicVo> =
	this@toSetHostNicVos.map { it.toSetHostNicVo(conn) }

/**
 * 호스트 네트워크 modified_bonds
 * host_nic 빌더
 */
fun HostNicVo.toModifiedBondBuilder(): HostNic = HostNicBuilder()
	.name(this@toModifiedBondBuilder.name) // bonding 이름
	.bonding( this@toModifiedBondBuilder.bondingVo.toBonding() )
	.build()

fun List<HostNicVo>.toModifiedBonds(): List<HostNic> =
	this@toModifiedBonds.map { it.toModifiedBondBuilder() }



// fun HostNicVo.toModifiedBond(): HostNic =
// 	this@toModifiedBond.toModifiedBondBuilder().build()
