package com.itinfo.rutilvm.api.model.network

import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.model.fromNetworkToIdentifiedVo
import com.itinfo.rutilvm.api.model.fromVnicProfileToIdentifiedVo
import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.api.model.computing.*
import com.itinfo.rutilvm.api.ovirt.business.InterfaceStatus
import com.itinfo.rutilvm.api.ovirt.business.VmInterfaceType
import com.itinfo.rutilvm.api.ovirt.business.toNicInterface
import com.itinfo.rutilvm.api.ovirt.business.toVmInterfaceType
import com.itinfo.rutilvm.util.ovirt.*
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.builders.MacBuilder
import org.ovirt.engine.sdk4.builders.NicBuilder
import org.ovirt.engine.sdk4.builders.VnicProfileBuilder
import org.ovirt.engine.sdk4.types.*
import org.ovirt.engine.sdk4.types.IpVersion.V4
import org.ovirt.engine.sdk4.types.IpVersion.V6
import org.slf4j.LoggerFactory
import java.io.Serializable
import java.math.BigInteger

private val log = LoggerFactory.getLogger(NicVo::class.java)

/**
 * [NicVo]
 * nic 내부 mac address가 같은거끼리 묶어야될듯
 *
 * @property id [String]
 * @property name [String]
 * @property interface_ [NicInterface]		유형  NicInterface
 * @property macAddress [String]
 * @property linked [Boolean]				링크상태 (link state) t(up)/f(down) -> nic 상태도 같이 변함
 * @property plugged [Boolean]				연결상태 (card status) t(up)/f(down)
 * @property synced [Boolean]				동기화
 * @property status [NicStatus]				링크상태인줄 알았는데 .... TODO: 값 연결 방식 찾아야 함
 * @property ipv4 [String]
 * @property ipv6 [String]
 * @property speed [BigInteger] mbps
 * @property rxSpeed [BigInteger] mbps
 * @property txSpeed [BigInteger] mbps
 * @property rxTotalSpeed [BigInteger] byte
 * @property txTotalSpeed [BigInteger] byte
 * @property rxTotalError [BigInteger] byte
 * @property txTotalError [BigInteger] byte
 * @property guestInterfaceName [String]
 * @property networkVo [IdentifiedVo]
 * @property vnicProfileVo [IdentifiedVo]
 * @property vmViewVo [VmViewVo]
 * @property bNetworkFilterVo [NetworkFilterVo]
 *
 */
class NicVo (
	val id: String? = "",
	val name: String? = "",
	val interface_: VmInterfaceType? = VmInterfaceType.virtio,
	val macAddress: String? = "",
	val linked: Boolean? = false,
	val plugged: Boolean? = false,
	val synced: Boolean? = false,
	val ipv4: String? = "",
	val ipv6: String? = "",
	val guestInterfaceName: String? = "",
	val speed: BigInteger? = BigInteger.ZERO,
	val rxSpeed: BigInteger? = BigInteger.ZERO,
	val txSpeed: BigInteger? = BigInteger.ZERO,
	val rxTotalSpeed: BigInteger? = BigInteger.ZERO,
	val txTotalSpeed: BigInteger? = BigInteger.ZERO,
	val rxTotalError: BigInteger? = BigInteger.ZERO,
	val txTotalError: BigInteger? = BigInteger.ZERO,
	val networkVo: IdentifiedVo = IdentifiedVo(),
	val vnicProfileVo: IdentifiedVo = IdentifiedVo(),
	val vmVo: VmVo = VmVo(),
	// val vmViewVo: VmViewVo = VmViewVo(),
	val networkFilterVos: NetworkFilterVo? = null,
) : Serializable {
	val status: InterfaceStatus? = if (linked==true) InterfaceStatus.up else InterfaceStatus.down

	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bId: String? = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String? = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bInterface_: VmInterfaceType? = VmInterfaceType.virtio;fun interface_(block: () -> VmInterfaceType?) { bInterface_ = block() ?: VmInterfaceType.virtio }
		private var bMacAddress: String? = "";fun macAddress(block: () -> String?) { bMacAddress = block() ?: "" }
		private var bLinked: Boolean? = false;fun linked(block: () -> Boolean?) { bLinked = block() ?: false }
		private var bPlugged: Boolean? = false;fun plugged(block: () -> Boolean?) { bPlugged = block() ?: false }
		private var bSynced: Boolean? = false;fun synced(block: () -> Boolean?) { bSynced = block() ?: false }
		private var bIpv4: String? = "";fun ipv4(block: () -> String?) { bIpv4 = block() ?: "" }
		private var bIpv6: String? = "";fun ipv6(block: () -> String?) { bIpv6 = block() ?: "" }
		private var bGuestInterfaceName: String? = "";fun guestInterfaceName(block: () -> String?) { bGuestInterfaceName = block() ?: "" }
		private var bSpeed: BigInteger? = BigInteger.ZERO;fun speed(block: () -> BigInteger?) { bSpeed = block() ?: BigInteger.ZERO }
		private var bRxSpeed: BigInteger? = BigInteger.ZERO;fun rxSpeed(block: () -> BigInteger?) { bRxSpeed = block() ?: BigInteger.ZERO }
		private var bTxSpeed: BigInteger? = BigInteger.ZERO;fun txSpeed(block: () -> BigInteger?) { bTxSpeed = block() ?: BigInteger.ZERO }
		private var bRxTotalSpeed: BigInteger? = BigInteger.ZERO;fun rxTotalSpeed(block: () -> BigInteger?) { bRxTotalSpeed = block() ?: BigInteger.ZERO }
		private var bTxTotalSpeed: BigInteger? = BigInteger.ZERO;fun txTotalSpeed(block: () -> BigInteger?) { bTxTotalSpeed = block() ?: BigInteger.ZERO }
		private var bRxTotalError: BigInteger? = BigInteger.ZERO;fun rxTotalError(block: () -> BigInteger?) { bRxTotalError = block() ?: BigInteger.ZERO }
		private var bTxTotalError: BigInteger? = BigInteger.ZERO;fun txTotalError(block: () -> BigInteger?) { bTxTotalError = block() ?: BigInteger.ZERO }
		private var bNetworkVo: IdentifiedVo = IdentifiedVo();fun networkVo(block: () -> IdentifiedVo?) { bNetworkVo = block() ?: IdentifiedVo() }
		private var bVnicProfileVo: IdentifiedVo = IdentifiedVo();fun vnicProfileVo(block: () -> IdentifiedVo?) { bVnicProfileVo = block() ?: IdentifiedVo()}
		// private var bVmViewVo: VmViewVo = VmViewVo(); fun vmVo(block: () -> VmViewVo?) { bVmViewVo = block() ?: VmViewVo() }
		private var bVmVo: VmVo = VmVo(); fun vmVo(block: () -> VmVo?) { bVmVo = block() ?: VmVo() }
		private var bNetworkFilterVo: NetworkFilterVo? = null; fun networkFilterVo(block: () -> NetworkFilterVo?) { bNetworkFilterVo = block() }
		fun build(): NicVo = NicVo(bId, bName, bInterface_, bMacAddress, bLinked, bPlugged, bSynced, bIpv4, bIpv6, bGuestInterfaceName, bSpeed, bRxSpeed, bTxSpeed, bRxTotalSpeed, bTxTotalSpeed, bRxTotalError, bTxTotalError, bNetworkVo, bVnicProfileVo, bVmVo,/*bVmViewVo,*/ bNetworkFilterVo, )
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): NicVo = Builder().apply(block).build()
	}
}

/**
 * Nic id&name
 */
fun Nic.toIdentifiedVoFromNic(): IdentifiedVo = IdentifiedVo.builder {
	id { this@toIdentifiedVoFromNic.id()}
	name { this@toIdentifiedVoFromNic.name() }
}
fun List<Nic>.toIdentifiedVosFromNics(): List<IdentifiedVo> =
	this@toIdentifiedVosFromNics.map { it.toIdentifiedVoFromNic() }


fun Nic.toVmNic(conn: Connection): NicVo {
	val vnicProfile: VnicProfile? =
		if(this@toVmNic.vnicProfilePresent()) conn.findVnicProfile(this@toVmNic.vnicProfile().id()).getOrNull()
		else null
	val network: Network? = vnicProfile?.network()?.let { conn.findNetwork(it.id()).getOrNull() }

	return NicVo.builder {
		id { this@toVmNic.id() }
		name { this@toVmNic.name() }
		plugged { this@toVmNic.plugged() }
		linked { this@toVmNic.linked() }
		vnicProfileVo { vnicProfile?.fromVnicProfileToIdentifiedVo() }
		networkVo { network?.fromNetworkToIdentifiedVo() }
	}
}
fun List<Nic>.toVmNics(conn: Connection): List<NicVo> =
	this@toVmNics.map { it.toVmNic(conn) }


fun Nic.toNicVoFromVm(conn: Connection): NicVo {
	val nic = this@toNicVoFromVm
	val vnicProfile: VnicProfile? =
		if(nic.vnicProfilePresent()) conn.findVnicProfile(nic.vnicProfile().id()).getOrNull()
		else null
	val network: Network? = vnicProfile?.network()?.let { conn.findNetwork(it.id()).getOrNull() }
	val rd: ReportedDevice? = nic.reportedDevices().firstOrNull { reportedDevice ->
		nic.macPresent() && reportedDevice.mac()?.address() == nic.mac().address()
	}
//	val networkFilterParameters: List<NetworkFilterParameter> = conn.findAllNicNetworkFilterParametersFromVm(vmId, vmNicId)
//			.getOrDefault(listOf())

	return NicVo.builder {
        id { nic.id() }
        name { nic.name() }
        networkVo { network?.fromNetworkToIdentifiedVo() }
        vnicProfileVo { vnicProfile?.fromVnicProfileToIdentifiedVo() }
        plugged { nic.plugged() }
        synced { nic.synced() }
        linked { nic.linked() }
        interface_ { nic.interface_().toVmInterfaceType() }
        macAddress { if (nic.macPresent()) nic.mac().address() else null }
        ipv4 { rd?.findVmIpv4() }
        ipv6 { rd?.findVmIpv6() }
		// speed { nic. }
        rxSpeed { nic.statistics().findSpeed("data.current.rx.bps") }
        txSpeed { nic.statistics().findSpeed("data.current.tx.bps") }
        rxTotalSpeed { nic.statistics().findSpeed("data.total.rx") }
        txTotalSpeed { nic.statistics().findSpeed("data.total.tx") }
        rxTotalError { nic.statistics().findSpeed("errors.total.rx") } // 이게 중단 스피드
        guestInterfaceName { rd?.name() }
    }
}
fun List<Nic>.toNicVosFromVm(conn: Connection): List<NicVo> =
	this@toNicVosFromVm.map { it.toNicVoFromVm(conn) }


fun Nic.toNicVmMenu(): NicVo {
	val nic = this@toNicVmMenu
	val rd: ReportedDevice? = nic.reportedDevices().firstOrNull { reportedDevice ->
		nic.macPresent() && reportedDevice.mac()?.address() == nic.mac().address()
	}
//	val networkFilterParameters: List<NetworkFilterParameter> = conn.findAllNicNetworkFilterParametersFromVm(vmId, vmNicId)
//			.getOrDefault(listOf())
	return NicVo.builder {
		id { nic.id() }
		name { nic.name() }
		networkVo { nic.vnicProfile().network().fromNetworkToIdentifiedVo() }
		vnicProfileVo { nic.vnicProfile().fromVnicProfileToIdentifiedVo() }
		plugged { nic.plugged() }
		synced { nic.synced() }
		linked { nic.linked() }
		interface_ { nic.interface_().toVmInterfaceType() }
		macAddress { if (nic.macPresent()) nic.mac().address() else null }
		ipv4 { rd?.findVmIpv4() }
		ipv6 { rd?.findVmIpv6() }
		// speed { nic. }
		rxSpeed { nic.statistics().findSpeed("data.current.rx.bps") }
		txSpeed { nic.statistics().findSpeed("data.current.tx.bps") }
		rxTotalSpeed { nic.statistics().findSpeed("data.total.rx") }
		txTotalSpeed { nic.statistics().findSpeed("data.total.tx") }
		rxTotalError { nic.statistics().findSpeed("errors.total.rx") } // 이게 중단 스피드
		guestInterfaceName { rd?.name() }
	}
}
fun List<Nic>.toNicVmMenus(): List<NicVo> =
	this@toNicVmMenus.map { it.toNicVmMenu() }


fun Nic.toNicVo(conn: Connection): NicVo = NicVo.builder {
	id { this@toNicVo.id() }
	name { this@toNicVo.name() }
	networkVo { this@toNicVo.vnicProfile().network().fromNetworkToIdentifiedVo() }
	vnicProfileVo { this@toNicVo.vnicProfile().fromVnicProfileToIdentifiedVo() }
	plugged { this@toNicVo.plugged() }
	synced { this@toNicVo.synced() }
	linked { this@toNicVo.linked() }
	interface_ { this@toNicVo.interface_().toVmInterfaceType() }
	macAddress { if (this@toNicVo.macPresent()) this@toNicVo.mac().address() else null }
}


fun Nic.toNicVoFromSnapshot(conn: Connection, vmId: String): NicVo {
	val nic = this@toNicVoFromSnapshot
	val nicVm: Nic? = conn.findNicFromVm(vmId, nic.id(), follow = "vnicprofile").getOrNull()
	val network = nicVm?.vnicProfile()?.network()?.id()?.let { conn.findNetwork(it).getOrNull() }

	return NicVo.builder {
		name { nic.name() }
		interface_ { nic.interface_().toVmInterfaceType() }
		linked { nic.linked() }
		macAddress { if(nic.macPresent()) nic.mac().address() else "" }
		plugged { nic.plugged() }
		synced { nic.synced() }
		networkVo {
			IdentifiedVo.builder {
				id { network?.id() }
				name { network?.name() }
			}
		}
		vnicProfileVo {
			IdentifiedVo.builder {
				id { nicVm?.vnicProfile()?.id() }
				name { nicVm?.vnicProfile()?.name() }
			}
		}
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
		interface_ { this@toNicVoFromTemplate.interface_().toVmInterfaceType() }
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
//		ipv4 { vm.findVmIpv4(conn) }
//		ipv6 { vm.findVmIpv6(conn) }
		rxSpeed { statistics.findSpeed("data.current.rx.bps") }
		txSpeed { statistics.findSpeed("data.current.tx.bps") }
		rxTotalSpeed { statistics.findSpeed("data.total.rx") }
		txTotalSpeed { statistics.findSpeed("data.total.tx") }
	}
}
fun List<Nic>.toNetworkFromVms(conn: Connection): List<NicVo> =
	this@toNetworkFromVms.map { it.toNicVoFromVm(conn) }


// fun Vm.toVmViewVoFromNetwork(conn: Connection): VmViewVo {
// 	val vm = this@toVmViewVoFromNetwork
// 	val cluster: Cluster? = conn.findCluster(vm.cluster().id()).getOrNull()
// 	val vmNic: List<Nic> = conn.findAllNicsFromVm(vm.id()).getOrDefault(listOf())
//
// 	return VmViewVo.builder {
// 		id { vm.id() }
// 		name { vm.name() }
// 		status { vm.status() }
// 		fqdn { vm.fqdn() }
// 		description { vm.description() }
// 		clusterVo { cluster?.fromClusterToIdentifiedVo() }
// 		nicVos { vmNic.fromNicsToIdentifiedVos() }
// 	}
// }
// fun List<Vm>.toVmViewVoFromNetworks(conn: Connection): List<VmViewVo> =
// 	this@toVmViewVoFromNetworks.map { it.toVmViewVoFromNetwork(conn) }

fun Nic.toNetworkVmMenu(conn: Connection): NicVo {
	val nic = this@toNetworkVmMenu
	val vm = conn.findVm(nic.vm().id(), follow = "reporteddevices").getOrNull()

	return NicVo.builder {
		id { nic.id() }
		name { nic.name() }
		vnicProfileVo { nic.vnicProfile().fromVnicProfileToIdentifiedVo() }
		linked { nic.linked() }
		rxSpeed { nic.statistics().findSpeed("data.current.rx.bps") }
		txSpeed { nic.statistics().findSpeed("data.current.tx.bps") }
		rxTotalSpeed { nic.statistics().findSpeed("data.total.rx") }
		txTotalSpeed { nic.statistics().findSpeed("data.total.tx") }
		vmVo { vm?.toNetworkVm(conn) }
	}
}


// region: builder

/**
 * Nic 빌더
 */
fun NicVo.toNicBuilder(): NicBuilder {
	val nicBuilder = NicBuilder()
	nicBuilder
		.name(name)
		.vnicProfile(VnicProfileBuilder().id(vnicProfileVo.id))
		.interface_(interface_.toNicInterface())
		.linked(linked)
		.plugged(plugged)
	if (macAddress?.isEmpty() == false) {
		nicBuilder.mac(MacBuilder().address(macAddress).build())
	}
	return nicBuilder
}

/**
 * [NicVo.toAddNic]
 * Nic 생성 빌더
 */
fun NicVo.toAddNic(): Nic =
	toNicBuilder().build()

/**
 * [NicVo.toEditNic]
 * Nic 편집 빌더
 */
fun NicVo.toEditNic(): Nic {
	return toNicBuilder()
		.id(id)
		.build()
}

// 가상머신 만들때 nic
fun NicVo.toAddVmNic(): Nic {
	return NicBuilder()
		.name(name)
		.vnicProfile(VnicProfileBuilder().id(vnicProfileVo.id).build())
		.build()
}
// endregion


/**
 * [ReportedDevice].findVmIpv4
 * Vm ip 알아내기
 * @return
 */
fun ReportedDevice.findVmIpv4(): String? {
	return this@findVmIpv4.ips()?.firstOrNull { it.version() == V4 }?.address()
}
/**
 * [ReportedDevice].findVmIpv6]
 * Vm ip 알아내기
 * @return
 */
fun ReportedDevice.findVmIpv6(): String? {
	return this@findVmIpv6.ips()?.firstOrNull { it.version() == V6 }?.address()
}
