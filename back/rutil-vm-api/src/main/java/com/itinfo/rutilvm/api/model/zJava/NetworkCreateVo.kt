package com.itinfo.rutilvm.api.model.zJava/*
package com.itinfo.rutilvm.api.model.create

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.itcloud.gson
import com.itinfo.itcloud.model.network.NetworkClusterVo
import com.itinfo.itcloud.model.network.VnicProfileVo
import com.itinfo.rutilvm.util.ovirt.findAllOpenStackNetworkProviders
import com.itinfo.rutilvm.util.ovirt.findDataCenterName
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.builders.DataCenterBuilder
import org.ovirt.engine.sdk4.builders.NetworkBuilder
import org.ovirt.engine.sdk4.builders.VlanBuilder
import org.ovirt.engine.sdk4.types.Network
import org.ovirt.engine.sdk4.types.NetworkUsage
import org.ovirt.engine.sdk4.types.OpenStackNetworkProvider
import java.io.Serializable

*/
/**
 * [NetworkCreateVo]
 *
 * name, data_center
 * @proprety datacenterId [String]
 * @proprety datacenterName [String]
 * 
 * @proprety networkClusterVo [NetworkClusterVo] cluster=network 추가
 * @proprety clusterVos List<[NetworkClusterVo]>
 * 
 * @proprety id [String]
 * @proprety name [String]
 * @proprety description [String]
 * @proprety comment [String]
 * @proprety label [String] 네트워크 레이블
 * 
 * @proprety vlan [Int] vlan 태그 (태그 자체는 활성화를 해야 입력란이 생김)
 * @proprety mtu [Int] true면 기본값
 * @proprety usageVm [Boolean] 기본이 체크된 상태 (true)
 * @proprety portIsolation [Boolean]
 * @proprety stp [Boolean]
 * 
 * @proprety externalProvider [Boolean]
 * @proprety physicalNw [Boolean]
 * // @proprety externalName [String]
 * 
 * @proprety dnsList List<[String]>
 * @proprety vnicProfileVos List<[VnicProfileVo]>
 *//*
@Deprecated("사용안함")
class NetworkCreateVo(
	val datacenterId: String = "",
	val datacenterName: String = "",
	val networkClusterVo: NetworkClusterVo = NetworkClusterVo(),
	val clusterVos: List<NetworkClusterVo> = listOf(),
	val id: String = "",
	val name: String = "",
	val description: String = "",
	val comment: String = "",
	val label: String = "",
	val vlan: Int? = 0,
	val mtu: Int = 0,
	val usageVm: Boolean = false,
	val portIsolation: Boolean = false,
	val stp: Boolean = false,
	val externalProvider: Boolean = false,
	val physicalNw: Boolean = false,
	// val externalName: String = "",
	val dnsList: List<String> = listOf(),
	val vnicProfileVos: List<VnicProfileVo> = listOf(),
) : Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bDatacenterId: String = "";fun datacenterId(block: () -> String?) { bDatacenterId = block() ?: "" }
		private var bDatacenterName: String = "";fun datacenterName(block: () -> String?) { bDatacenterName = block() ?: "" }
		private var bNetworkClusterVo: NetworkClusterVo = NetworkClusterVo();fun networkClusterVo(block: () -> NetworkClusterVo?) { bNetworkClusterVo = block() ?: NetworkClusterVo() }
		private var bClusterVos: List<NetworkClusterVo> = listOf();fun clusterVos(block: () -> List<NetworkClusterVo>?) { bClusterVos = block() ?: listOf() }
		private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bDescription: String = "";fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bComment: String = "";fun comment(block: () -> String?) { bComment = block() ?: "" }
		private var bLabel: String = "";fun label(block: () -> String?) { bLabel = block() ?: "" }
		private var bVlan: Int = 0;fun vlan(block: () -> Int?) { bVlan = block() ?: 0 }
		private var bMtu: Int = 0;fun mtu(block: () -> Int?) { bMtu = block() ?: 0 }
		private var bUsageVm: Boolean = false;fun usageVm(block: () -> Boolean?) { bUsageVm = block() ?: false }
		private var bPortIsolation: Boolean = false;fun portIsolation(block: () -> Boolean?) { bPortIsolation = block() ?: false }
		private var bStp: Boolean = false;fun stp(block: () -> Boolean?) { bStp = block() ?: false }
		private var bExternalProvider: Boolean = false;fun externalProvider(block: () -> Boolean?) { bExternalProvider = block() ?: false }
		private var bPhysicalNw: Boolean = false;fun physicalNw(block: () -> Boolean?) { bPhysicalNw = block() ?: false }
		// private var bExternalName: String = "";fun externalName(block: () -> String?) { bExternalName = block() ?: "" }
		private var bDnsList: List<String> = listOf();fun dnsList(block: () -> List<String>?) { bDnsList = block() ?: listOf() }
		private var bVnicProfileVos: List<VnicProfileVo> = listOf();fun vnicProfileVos(block: () -> List<VnicProfileVo>?) { bVnicProfileVos = block() ?: listOf() }
		fun build(): NetworkCreateVo = NetworkCreateVo(bDatacenterId, bDatacenterName, bNetworkClusterVo, bClusterVos, bId, bName, bDescription, bComment, bLabel, bVlan, bMtu, bUsageVm, bPortIsolation, bStp, bExternalProvider, bPhysicalNw*/
/*, bExternalName*//*
, bDnsList, bVnicProfileVos)
	}

	companion object {
		private val log by LoggerDelegate()
		inline fun builder(block: NetworkCreateVo.Builder.() -> Unit): NetworkCreateVo =
			NetworkCreateVo.Builder().apply(block).build()
	}
}

fun Network.toNetworkCreateVo(conn: Connection, networkId: String): NetworkCreateVo {

	return NetworkCreateVo.builder {
		datacenterId { this@toNetworkCreateVo.dataCenter().id() }
		datacenterName { conn.findDataCenterName(this@toNetworkCreateVo.dataCenter().id()) }
		id { networkId }
		name { this@toNetworkCreateVo.name() }
		description { this@toNetworkCreateVo.description() }
		comment { this@toNetworkCreateVo.comment() }
		label { if (this@toNetworkCreateVo.networkLabelsPresent()) this@toNetworkCreateVo.networkLabels().firstOrNull()?.id() else null }
		vlan { if (this@toNetworkCreateVo.vlanPresent()) this@toNetworkCreateVo.vlan().idAsInteger() else null }
		usageVm { this@toNetworkCreateVo.usages().contains(NetworkUsage.VM) }
		portIsolation { this@toNetworkCreateVo.portIsolation() }
		mtu { this@toNetworkCreateVo.mtu().toInt() }
		dnsList {
			if (this@toNetworkCreateVo.dnsResolverConfigurationPresent()) this@toNetworkCreateVo.dnsResolverConfiguration().nameServers() else null
		}
		externalProvider {
			this@toNetworkCreateVo.externalProviderPresent()
		}
		// physicalNw { }     // TODO 물리적 네트워크
	}
}

fun NetworkCreateVo.toNetworkBuilder(conn: Connection, add: Boolean = true): NetworkBuilder{
	val externalProvider: OpenStackNetworkProvider? =
		if (this@toNetworkBuilder.externalProvider)
			conn.findAllOpenStackNetworkProviders().getOrDefault(listOf()).firstOrNull()
		else null
	val networkBuilder = NetworkBuilder()
		.dataCenter(DataCenterBuilder().id(this@toNetworkBuilder.datacenterId).build())
		.name(this@toNetworkBuilder.name)
		.description(this@toNetworkBuilder.description)
		.comment(this@toNetworkBuilder.comment)
		.vlan(if (this@toNetworkBuilder.vlan != null) VlanBuilder().id(this@toNetworkBuilder.vlan) else null)
		.usages(if (this@toNetworkBuilder.usageVm) NetworkUsage.VM else NetworkUsage.DEFAULT_ROUTE)
		.portIsolation(this@toNetworkBuilder.portIsolation)
		.mtu(this@toNetworkBuilder.mtu)
		.stp(this@toNetworkBuilder.stp)
		.externalProvider(externalProvider)
		.externalProviderPhysicalNetwork(
			NetworkBuilder()
				// .externalProviderPhysicalNetwork() // TODO 물리적네트워크
				.build()
		)

	return if (add) { // 생성 시
		networkBuilder
	} else {  // 편집 시
		networkBuilder.id(this@toNetworkBuilder.id)
	}
}*/
