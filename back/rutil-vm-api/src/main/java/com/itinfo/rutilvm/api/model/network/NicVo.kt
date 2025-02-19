package com.itinfo.rutilvm.api.model.network

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.model.fromNetworkToIdentifiedVo
import com.itinfo.rutilvm.api.model.fromVnicProfileToIdentifiedVo
import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.api.model.computing.*
import com.itinfo.rutilvm.util.ovirt.*
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.builders.MacBuilder
import org.ovirt.engine.sdk4.builders.NicBuilder
import org.ovirt.engine.sdk4.builders.VnicProfileBuilder
import org.ovirt.engine.sdk4.types.*
import java.io.Serializable
import java.math.BigInteger

/**
 * [NicVo]
 *
 * nic 내부 mac address가 같은거끼리 묶어야될듯
 *
 * @property id [String]
 * @property name [String]
 * @property interface_ [NicInterface]		유형  NicInterface
 * @property macAddress [String]
 * @property linked [Boolean]		링크상태(link state) t(up)/f(down) -> nic 상태도 같이 변함
 * @property plugged [Boolean]		연결상태(card status) t(up)/f(down)
 * @property synced [Boolean]		동기화
 *
 * @property status [NicStatus]  링크상태인줄 알았는데 ?
 *
 * @property ipv4 [String]
 * @property ipv6 [String]
 * @property guestInterfaceName [String]
 *
 * @property networkVo [IdentifiedVo]
 * @property vnicProfileVo [IdentifiedVo]
 * @property vmVo [IdentifiedVo]
 * @property networkFilterVos List[IdentifiedVo]
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
class NicVo (
	val id: String = "",
	val name: String = "",
	val interface_: NicInterface = NicInterface.VIRTIO,
	val macAddress: String = "",
	val linked: Boolean = false,
	val plugged: Boolean = false,
	val synced: Boolean = false,
	val status: NicStatus = NicStatus.DOWN,
	val ipv4: String = "",
	val ipv6: String = "",
	val guestInterfaceName: String = "",
	val networkVo: IdentifiedVo = IdentifiedVo(),
	val vnicProfileVo: IdentifiedVo = IdentifiedVo(),
	val vmVo: VmVo = VmVo(),
	val networkFilterVos: List<NetworkFilterVo> = listOf(),
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
		private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bInterface_: NicInterface = NicInterface.VIRTIO;fun interface_(block: () -> NicInterface?) { bInterface_ = block() ?: NicInterface.VIRTIO }
		private var bMacAddress: String = "";fun macAddress(block: () -> String?) { bMacAddress = block() ?: "" }
		private var bLinked: Boolean = false;fun linked(block: () -> Boolean?) { bLinked = block() ?: false }
		private var bPlugged: Boolean = false;fun plugged(block: () -> Boolean?) { bPlugged = block() ?: false }
		private var bSynced: Boolean = false;fun synced(block: () -> Boolean?) { bSynced = block() ?: false }
		private var bStatus: NicStatus = NicStatus.DOWN;fun status(block: () -> NicStatus?) { bStatus = block() ?: NicStatus.DOWN }
		private var bIpv4: String = "";fun ipv4(block: () -> String?) { bIpv4 = block() ?: "" }
		private var bIpv6: String = "";fun ipv6(block: () -> String?) { bIpv6 = block() ?: "" }
		private var bGuestInterfaceName: String = "";fun guestInterfaceName(block: () -> String?) { bGuestInterfaceName = block() ?: "" }
		private var bNetworkVo: IdentifiedVo = IdentifiedVo();fun networkVo(block: () -> IdentifiedVo?) { bNetworkVo = block() ?: IdentifiedVo() }
		private var bVnicProfileVo: IdentifiedVo = IdentifiedVo();fun vnicProfileVo(block: () -> IdentifiedVo?) { bVnicProfileVo = block() ?: IdentifiedVo()}
		private var bVmVo: VmVo = VmVo(); fun vmVo(block: () -> VmVo?) { bVmVo = block() ?: VmVo() }
		private var bNetworkFilterVos: List<NetworkFilterVo> = listOf(); fun networkFilterVos(block: () -> List<NetworkFilterVo>?) { bNetworkFilterVos = block() ?: listOf() }
		private var bSpeed: BigInteger = BigInteger.ZERO;fun speed(block: () -> BigInteger?) { bSpeed = block() ?: BigInteger.ZERO }
		private var bRxSpeed: BigInteger = BigInteger.ZERO;fun rxSpeed(block: () -> BigInteger?) { bRxSpeed = block() ?: BigInteger.ZERO }
		private var bTxSpeed: BigInteger = BigInteger.ZERO;fun txSpeed(block: () -> BigInteger?) { bTxSpeed = block() ?: BigInteger.ZERO }
		private var bRxTotalSpeed: BigInteger = BigInteger.ZERO;fun rxTotalSpeed(block: () -> BigInteger?) { bRxTotalSpeed = block() ?: BigInteger.ZERO }
		private var bTxTotalSpeed: BigInteger = BigInteger.ZERO;fun txTotalSpeed(block: () -> BigInteger?) { bTxTotalSpeed = block() ?: BigInteger.ZERO }
		private var bRxTotalError: BigInteger = BigInteger.ZERO;fun rxTotalError(block: () -> BigInteger?) { bRxTotalError = block() ?: BigInteger.ZERO }
		private var bTxTotalError: BigInteger = BigInteger.ZERO;fun txTotalError(block: () -> BigInteger?) { bTxTotalError = block() ?: BigInteger.ZERO }

		fun build(): NicVo = NicVo(bId, bName, bInterface_, bMacAddress, bLinked, bPlugged, bSynced, bStatus, bIpv4, bIpv6, bGuestInterfaceName, bNetworkVo, bVnicProfileVo, bVmVo, bNetworkFilterVos, bSpeed, bRxSpeed, bTxSpeed, bRxTotalSpeed, bTxTotalSpeed, bRxTotalError, bTxTotalError)
	}

	companion object {
		private val log by LoggerDelegate()
		inline fun builder(block: Builder.() -> Unit): NicVo =
			Builder().apply(block).build()
	}
}

/**
 * Nic id&name
 */
fun Nic.toNicIdName(): NicVo = NicVo.builder {
	id { this@toNicIdName.id()}
	name { this@toNicIdName.name() }
}
fun List<Nic>.toNicIdNames(): List<NicVo> =
	this@toNicIdNames.map { it.toNicIdName() }


fun Nic.toVmNic(conn: Connection, vmId: String): NicVo {
	val nic = this@toVmNic
	val vm :Vm = conn.findVm(vmId)
		.getOrNull() ?: throw ErrorPattern.VM_NOT_FOUND.toException()
	val vnicProfile: VnicProfile = conn.findVnicProfile(nic.vnicProfile().id())
		.getOrNull() ?: throw ErrorPattern.VNIC_PROFILE_NOT_FOUND.toException()
	val network: Network = conn.findNetwork(vnicProfile.network().id())
		.getOrNull() ?: throw ErrorPattern.NETWORK_NOT_FOUND.toException()

	return NicVo.builder {
		id { nic.id() }
		name { nic.name() }
		networkVo { network.fromNetworkToIdentifiedVo() }
		vnicProfileVo { vnicProfile.fromVnicProfileToIdentifiedVo() }
	}
}
fun List<Nic>.toVmNics(conn: Connection, vmId: String): List<NicVo> =
	this@toVmNics.map { it.toVmNic(conn, vmId) }


fun Nic.toNicVoFromVm(conn: Connection, vmId: String): NicVo {
	val vm :Vm = conn.findVm(vmId)
		.getOrNull() ?: throw ErrorPattern.VM_NOT_FOUND.toException()
	val statistics: List<Statistic> = conn.findAllStatisticsFromVmNic(vmId, this@toNicVoFromVm.id())
		.getOrDefault(listOf())
	val vnicProfile: VnicProfile = conn.findVnicProfile(this@toNicVoFromVm.vnicProfile().id())
		.getOrNull() ?: throw ErrorPattern.VNIC_PROFILE_NOT_FOUND.toException()
	val network: Network = conn.findNetwork(vnicProfile.network().id())
		.getOrNull() ?: throw ErrorPattern.NETWORK_NOT_FOUND.toException()
	val reportedDevices: List<ReportedDevice> = conn.findAllReportedDeviceFromVmNic(vmId, this@toNicVoFromVm.id())
		.getOrDefault(listOf())
//	val networkFilterParameters: List<NetworkFilterParameter> =
//		conn.findAllNicNetworkFilterParametersFromVm(vmId, vmNicId)
//			.getOrDefault(listOf())

	return NicVo.builder {
        id { this@toNicVoFromVm.id() }
        name { this@toNicVoFromVm.name() }
        networkVo { network.fromNetworkToIdentifiedVo() }
        vnicProfileVo { vnicProfile.fromVnicProfileToIdentifiedVo() }
        plugged { this@toNicVoFromVm.plugged() }
        synced { this@toNicVoFromVm.synced() }
        linked { this@toNicVoFromVm.linked() }
		status { if(this@toNicVoFromVm.linked()) NicStatus.UP else NicStatus.DOWN }
        interface_ { this@toNicVoFromVm.interface_() }
        macAddress { if (this@toNicVoFromVm.macPresent()) this@toNicVoFromVm.mac().address() else null }
//        ipv4 { vm. }
//        ipv6 { vm.findVmIpv6(conn) }
//				.speed()
        rxSpeed { statistics.findSpeed("data.current.rx.bps") }
        txSpeed { statistics.findSpeed("data.current.tx.bps") }
        rxTotalSpeed { statistics.findSpeed("data.total.rx") }
        txTotalSpeed { statistics.findSpeed("data.total.tx") }
        rxTotalError { statistics.findSpeed("errors.total.rx") } // 이게 중단 스피드
        guestInterfaceName { if(reportedDevicesPresent()) reportedDevices.first().name() else ""}
    }
}
fun List<Nic>.toNicVosFromVm(conn: Connection, vmId: String): List<NicVo> =
	this@toNicVosFromVm.map { it.toNicVoFromVm(conn, vmId) }

fun Nic.toEditNicVoFromVm(conn: Connection): NicVo {
	val vnicProfile: VnicProfile? = conn.findVnicProfile(this@toEditNicVoFromVm.vnicProfile().id()).getOrNull()
	val network: Network? = vnicProfile?.network()?.let { conn.findNetwork(it.id()).getOrNull() }

	return NicVo.builder {
		id { this@toEditNicVoFromVm.id() }
		name { this@toEditNicVoFromVm.name() }
		networkVo { network?.fromNetworkToIdentifiedVo() }
		vnicProfileVo { vnicProfile?.fromVnicProfileToIdentifiedVo() }
		plugged { this@toEditNicVoFromVm.plugged() }
		synced { this@toEditNicVoFromVm.synced() }
		linked { this@toEditNicVoFromVm.linked() }
		interface_ { this@toEditNicVoFromVm.interface_() }
		macAddress { if (this@toEditNicVoFromVm.macPresent()) this@toEditNicVoFromVm.mac().address() else null }
	}
}


//fun Nic.toNicVoFromSnapshot(conn: Connection, vmId: String): NicVo {
//	conn.findVm(vmId).getOrNull() ?: throw ErrorPattern.VM_ID_NOT_FOUND.toException()
//	val nic: Nic = conn.findNicFromVm(vmId, this@toNicVoFromSnapshot.id())
//		.getOrNull() ?: throw ErrorPattern.NIC_NOT_FOUND.toException()
//	val vnicProfile: VnicProfile? = conn.findVnicProfile(nic.vnicProfile().id()).getOrNull()
//	val networkId: String = vnicProfile?.network()?.id() ?: "" // TODO: 없을 경우 예외처리
//	val network: Network? = conn.findNetwork(networkId).getOrNull()
//
//	return NicVo.builder {
//		name { this@toNicVoFromSnapshot.name() }
//		networkVo { network?.fromNetworkToIdentifiedVo() }
//		vnicProfileVo { vnicProfile?.fromVnicProfileToIdentifiedVo() }
//		interface_ { this@toNicVoFromSnapshot.interface_() }
//		macAddress { if (this@toNicVoFromSnapshot.macPresent()) this@toNicVoFromSnapshot.mac().address() else null }
//	}
//}
//fun List<Nic>.toNicVosFromSnapshot(conn: Connection, vmId: String): List<NicVo> =
//	this@toNicVosFromSnapshot.map { it.toNicVoFromSnapshot(conn, vmId) }

fun Nic.toNicVoFromSnapshot(conn: Connection, vmId: String): NicVo {
	conn.findVm(vmId).getOrNull() ?: throw ErrorPattern.VM_ID_NOT_FOUND.toException()
	val nic = this@toNicVoFromSnapshot
//	val nicVm: Nic? = conn.findNicFromVm(vmId, nic.id()).getOrNull()

	return NicVo.builder {
		name { nic.name() }
		interface_ { nic.interface_() }
		linked { nic.linked() }
		macAddress { if(nic.macPresent()) nic.mac().address() else "" }
		plugged { nic.plugged() }
		synced { nic.synced() }
//		networkVo { nicVm.ne }
	}
}
fun List<Nic>.toNicVosFromSnapshot(conn: Connection, vmId: String): List<NicVo> =
	this@toNicVosFromSnapshot.map { it.toNicVoFromSnapshot(conn, vmId) }


fun Nic.toNicVoFromTemplate(conn: Connection): NicVo {
	val vnicProfile: VnicProfile? = conn.findVnicProfile(this@toNicVoFromTemplate.vnicProfile().id()).getOrNull()
	val network: Network? =
		if (vnicProfile != null && vnicProfile.networkPresent())
			conn.findNetwork(vnicProfile.network().id()).getOrNull()
		else null
	return NicVo.builder {
		id { this@toNicVoFromTemplate.id() }
		name { this@toNicVoFromTemplate.name() }
		linked { this@toNicVoFromTemplate.linked() }
		plugged { this@toNicVoFromTemplate.plugged() } // 연결됨
		networkVo { network?.fromNetworkToIdentifiedVo() }
		vnicProfileVo { vnicProfile?.fromVnicProfileToIdentifiedVo() }
		interface_ { this@toNicVoFromTemplate.interface_() }
	}
}
fun List<Nic>.toNicVosFromTemplate(conn: Connection): List<NicVo> =
	this@toNicVosFromTemplate.map { it.toNicVoFromTemplate(conn) }


fun Nic.toNetworkFromVm(conn: Connection, vmId: String): NicVo {
	val vm :Vm = conn.findVm(vmId)
		.getOrNull() ?: throw ErrorPattern.VM_NOT_FOUND.toException()
	val statistics: List<Statistic> = conn.findAllStatisticsFromVmNic(vmId, this@toNetworkFromVm.id()).getOrDefault(listOf())
	val vnicProfile: VnicProfile = conn.findVnicProfile(this@toNetworkFromVm.vnicProfile().id())
		.getOrNull() ?: throw ErrorPattern.VNIC_PROFILE_NOT_FOUND.toException()

	return NicVo.builder {
		id { this@toNetworkFromVm.id() }
		name { this@toNetworkFromVm.name() }
		vnicProfileVo { vnicProfile.fromVnicProfileToIdentifiedVo() }
		linked { this@toNetworkFromVm.linked() }
		status { if(this@toNetworkFromVm.linked()) NicStatus.UP else NicStatus.DOWN }
//		ipv4 { vm.findVmIpv4(conn) }
//		ipv6 { vm.findVmIpv6(conn) }
		rxSpeed { statistics.findSpeed("data.current.rx.bps") }
		txSpeed { statistics.findSpeed("data.current.tx.bps") }
		rxTotalSpeed { statistics.findSpeed("data.total.rx") }
		txTotalSpeed { statistics.findSpeed("data.total.tx") }
	}
}
fun List<Nic>.toNetworkFromVms(conn: Connection, vmId: String): List<NicVo> =
	this@toNetworkFromVms.map { it.toNicVoFromVm(conn, vmId) }

//fun Nic.toNetworkFromVm(conn: Connection, vmId: String): NicVo {
//	val vm :Vm = conn.findVm(vmId)
//		.getOrNull() ?: throw ErrorPattern.VM_NOT_FOUND.toException()
//	val statistics: List<Statistic> = conn.findAllStatisticsFromVmNic(vmId, this@toNetworkFromVm.id()).getOrDefault(listOf())
//	val vnicProfile: VnicProfile = conn.findVnicProfile(this@toNetworkFromVm.vnicProfile().id())
//		.getOrNull() ?: throw ErrorPattern.VNIC_PROFILE_NOT_FOUND.toException()
//
//	return NicVo.builder {
//		id { this@toNetworkFromVm.id() }
//		name { this@toNetworkFromVm.name() }
//		vnicProfileVo { vnicProfile.fromVnicProfileToIdentifiedVo() }
//		linked { this@toNetworkFromVm.linked() }
//		status { if(this@toNetworkFromVm.linked()) NicStatus.UP else NicStatus.DOWN }
//		rxSpeed { statistics.findSpeed("data.current.rx.bps") }
//		txSpeed { statistics.findSpeed("data.current.tx.bps") }
//		rxTotalSpeed { statistics.findSpeed("data.total.rx") }
//		txTotalSpeed { statistics.findSpeed("data.total.tx") }
//		vmVo { vm.toNetworkNic(conn) }
//	}
//}
//fun List<Nic>.toNetworkFromVms(conn: Connection, vmId: String): List<NicVo> =
//	this@toNetworkFromVms.map { it.toNicVoFromVm(conn, vmId) }



/**
 * Nic 빌더
 */
fun NicVo.toNicBuilder(): NicBuilder {
	val nicBuilder = NicBuilder()
	nicBuilder
		.name(this@toNicBuilder.name)
		.vnicProfile(VnicProfileBuilder().id(this@toNicBuilder.vnicProfileVo.id))
		.interface_(this@toNicBuilder.interface_)
		.linked(this@toNicBuilder.linked)
		.plugged(this@toNicBuilder.plugged)
	if (this@toNicBuilder.macAddress.isNotEmpty()) {
		nicBuilder.mac(MacBuilder().address(this@toNicBuilder.macAddress).build())
	}
	log.info("nicvo: {}", this)
	return nicBuilder
}

/**
 * Nic 생성 빌더
 */
fun NicVo.toAddNicBuilder(): Nic =
	this@toAddNicBuilder.toNicBuilder().build()

/**
 * Nic 편집 빌더
 */
fun NicVo.toEditNicBuilder(): Nic =
	this@toEditNicBuilder.toNicBuilder().id(this@toEditNicBuilder.id).build()


// 가상머신 만들때 nic
fun NicVo.toVmNicBuilder(): Nic = NicBuilder()
		.name(this@toVmNicBuilder.name)
		.vnicProfile(VnicProfileBuilder().id(this@toVmNicBuilder.vnicProfileVo.id).build())
		.build()

