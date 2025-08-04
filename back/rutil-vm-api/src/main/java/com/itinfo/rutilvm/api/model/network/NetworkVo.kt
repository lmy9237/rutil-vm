package com.itinfo.rutilvm.api.model.network

import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.model.computing.*
import com.itinfo.rutilvm.api.model.fromDataCenterToIdentifiedVo
import com.itinfo.rutilvm.api.model.fromVnicProfilesToIdentifiedVos
import com.itinfo.rutilvm.api.ovirt.business.NetworkStatusB
import com.itinfo.rutilvm.api.ovirt.business.toNetworkStatusB
import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.util.ovirt.*
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern

import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.builders.DataCenterBuilder
import org.ovirt.engine.sdk4.builders.NetworkBuilder
import org.ovirt.engine.sdk4.builders.NetworkLabelBuilder
import org.ovirt.engine.sdk4.builders.VlanBuilder
import org.ovirt.engine.sdk4.types.*
import org.slf4j.LoggerFactory
import java.io.Serializable

private val log = LoggerFactory.getLogger(NetworkVo::class.java)

/**
 * [NetworkVo]
 * 네트워크, 클러스터 네트워크
 *
 * @property id [String]
 * @property name [String]
 * @property description [String]
 * @property comment [String]
 * @property mtu [Int] true면 기본값
 * @property portIsolation [Boolean]
 * @property stp [Boolean] Spanning Tree Protocol 없어도 될듯
 * @property usage [UsageVo]  management 기본이 체크된 상태 (true, 가상머신 네트워크 (기본) (usage))
 * @property vdsmName [String]
 * @property dataCenterVo [IdentifiedVo]
 * @property openStackNetworkVo [OpenStackNetworkVo] 네트워크 공급자(한개만 있음) (생성시 여부(boolean)으로 처리,추가)
 * @property vlan [Int] vlan 태그 (태그 자체는 활성화를 해야 입력란이 생김)
 * @property dnsNameServers List<[String]> DNS 서버는 애매함
 * @property status [NetworkStatus] 네트워크 상태
 * @property display [Boolean] 클러스터-네트워크 관리
 * @property networkLabel [String] 네트워크 레이블
 * @property clusterVo [IdentifiedVo]
 * @property vnicProfileVos List<[IdentifiedVo]> vnicProfile
 * @property clusterVos List<[ClusterVo]> clusters  // networks clusters
 * @property required [Boolean] 클러스터-네트워크 관리 -> 필수(t,f)
 * @property isConnected [Boolean] 클러스터-네트워크 관리 -> 필수(t,f)
 *
 */
class NetworkVo (
	val id: String = "",
	val name: String = "",
	val description: String = "",
	val comment: String = "",
	val mtu: Int = 1500,
	val portIsolation: Boolean = false,
	val stp: Boolean = false,
	val vdsmName: String = "",
	val vlan: Int = 0,
	val status: NetworkStatusB? = NetworkStatusB.non_operational,
	val display: Boolean? = false,
	val networkLabel: String = "",
	val dnsNameServers: List<DnsVo> = emptyList(),
	val openStackNetworkVo: OpenStackNetworkVo = OpenStackNetworkVo(),
	val usage: UsageVo = UsageVo(),
	val dataCenterVo: IdentifiedVo = IdentifiedVo(),
	val clusterVo: IdentifiedVo = IdentifiedVo(),
	val vnicProfileVos: List<IdentifiedVo> = emptyList(),
	val clusterVos: List<ClusterVo> = emptyList(),
	val required: Boolean = false,
	val isConnected: Boolean? = false,
):Serializable {
	override fun toString(): String = gson.toJson(this)

	class Builder{
		private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bDescription: String = "";fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bComment: String = "";fun comment(block: () -> String?) { bComment = block() ?: "" }
		private var bMtu: Int = 0;fun mtu( block: () -> Int?) { bMtu = block() ?: 1500 }
		private var bPortIsolation: Boolean = false;fun portIsolation( block: () -> Boolean?) { bPortIsolation = block() ?: false }
		private var bStp: Boolean = false;fun stp( block: () -> Boolean?) { bStp = block() ?: false }
		private var bVdsmName: String = "";fun vdsmName(block: () -> String?) { bVdsmName = block() ?: "" }
		private var bVlan: Int = 0;fun vlan(block: () -> Int?) { bVlan = block() ?: 0 }
		private var bStatus: NetworkStatusB? = NetworkStatusB.non_operational;fun status(block: () -> NetworkStatusB?) { bStatus = block() ?: NetworkStatusB.non_operational }
		private var bDisplay: Boolean = false;fun display(block: () -> Boolean?) { bDisplay = block() ?: false }
		private var bNetworkLabel: String = "";fun networkLabel(block: () -> String?) { bNetworkLabel = block() ?: "" }
		private var bDnsNameServers: List<DnsVo> = emptyList();fun dnsNameServers(block: () -> List<DnsVo>?) { bDnsNameServers = block() ?: emptyList() }
		private var bOpenStackNetworkVo: OpenStackNetworkVo = OpenStackNetworkVo();fun openStackNetworkVo(block: () -> OpenStackNetworkVo?) { bOpenStackNetworkVo = block() ?: OpenStackNetworkVo() }
		private var bUsage: UsageVo = UsageVo();fun usage(block: () -> UsageVo?) { bUsage = block() ?: UsageVo() }
		private var bDataCenterVo: IdentifiedVo = IdentifiedVo();fun dataCenterVo(block: () -> IdentifiedVo?) { bDataCenterVo = block() ?: IdentifiedVo() }
		private var bClusterVo: IdentifiedVo = IdentifiedVo();fun clusterVo(block: () -> IdentifiedVo?) { bClusterVo = block() ?: IdentifiedVo() }
		private var bVnicProfileVos: List<IdentifiedVo> = emptyList();fun vnicProfileVos(block: () -> List<IdentifiedVo>?) { bVnicProfileVos = block() ?: emptyList() }
		private var bClusterVos: List<ClusterVo> = emptyList();fun clusterVos(block: () -> List<ClusterVo>?) { bClusterVos = block() ?: emptyList() }
		private var bRequired: Boolean = false;fun required(block: () -> Boolean?) { bRequired = block() ?: false }
		private var bIsConnected: Boolean = false;fun isConnected(block: () -> Boolean?) { bIsConnected = block() ?: false}

		fun build(): NetworkVo = NetworkVo( bId, bName, bDescription, bComment, bMtu, bPortIsolation, bStp, bVdsmName, bVlan, bStatus, bDisplay, bNetworkLabel, bDnsNameServers, bOpenStackNetworkVo, bUsage, bDataCenterVo, bClusterVo, bVnicProfileVos, bClusterVos, bRequired, bIsConnected)
	}

	companion object{
		inline fun builder(block: NetworkVo.Builder.() -> Unit): NetworkVo =  NetworkVo.Builder().apply(block).build()
	}
}

fun Network.toNetworkIdName(): NetworkVo = NetworkVo.builder {
	id { this@toNetworkIdName.id() }
	name { this@toNetworkIdName.name() }
}
fun List<Network>.toNetworksIdName(): List<NetworkVo> =
	this@toNetworksIdName.map { it.toNetworkIdName() }

fun Network.toNetworkMenu(): NetworkVo {
	val network = this@toNetworkMenu
 	return NetworkVo.builder {
		id { network.id() }
		name { network.name() }
		description { network.description() }
		comment { network.comment() }
		mtu { network.mtu().toInt() }
		portIsolation { network.portIsolation() }
		dataCenterVo { network.dataCenter().fromDataCenterToIdentifiedVo() }
		usage { network.usages().toUsageVo() }
		vlan { if (network.vlanPresent()) network.vlan().idAsInteger() else 0 }
	}
}
fun List<Network>.toNetworkMenus(): List<NetworkVo> =
	this@toNetworkMenus.map { it.toNetworkMenu() }


fun Network.toNetworkVo(conn: Connection): NetworkVo {
	val network = this@toNetworkVo
	// val usages: MutableList<NetworkUsage>? = conn.findNetwork(network.id()).getOrNull()?.usages()
	// val dataCenter: DataCenter? = conn.findDataCenter(network.dataCenter().id()).getOrNull()
	return NetworkVo.builder {
		id { network.id() }
		name { network.name() }
		description { network.description() }
		comment { network.comment() }
		mtu { network.mtu().toInt() }
		portIsolation { network.portIsolation() }
		stp { network.stp() }
		usage { network.usages().toUsageVo() }
		vdsmName { network.vdsmName() }
		dataCenterVo { network.dataCenter().fromDataCenterToIdentifiedVo() }
		openStackNetworkVo {
			if(network.externalProviderPresent())
				conn.findOpenStackNetworkProvider(network.externalProvider().id())
					.getOrNull()?.toOpenStackNetworkVo()
			else null
		}
		dnsNameServers {
			if (network.dnsResolverConfigurationPresent()){
				network.dnsResolverConfiguration().nameServers().toDnsVos()
			} else emptyList()
		}
		vlan { if (network.vlanPresent()) network.vlan().idAsInteger() else 0}
		vnicProfileVos { network.vnicProfiles().fromVnicProfilesToIdentifiedVos() }
	}
}
fun List<Network>.toNetworkVos(conn: Connection): List<NetworkVo> =
	this@toNetworkVos.map { it.toNetworkVo(conn) }


fun Network.toHostNetworkVo(usage: UsageVo): NetworkVo {
	val network = this@toHostNetworkVo
	return NetworkVo.builder {
		id { network.id() }
		name { network.name() }
		description { network.description() }
		comment { network.comment() }
		mtu { network.mtu().toInt() }
		portIsolation { network.portIsolation() }
		stp { network.stp() }
		usage { usage }
		vdsmName { network.vdsmName() }
		dataCenterVo { network.dataCenter().fromDataCenterToIdentifiedVo() }
		dnsNameServers {
			if (network.dnsResolverConfigurationPresent()){
				network.dnsResolverConfiguration().nameServers().toDnsVos()
			} else emptyList()
		}
		vlan { if (network.vlanPresent()) network.vlan().idAsInteger() else 0}
		vnicProfileVos { network.vnicProfiles().fromVnicProfilesToIdentifiedVos() }
	}
}



fun Network.toDcNetworkMenu(): NetworkVo {
	val network = this@toDcNetworkMenu
	return NetworkVo.builder {
		id { network.id() }
		name { network.name() }
		description { network.description() }
		comment { network.comment() }
		mtu { network.mtu().toInt() }
		portIsolation { network.portIsolation() }
		stp { network.stp() }
		usage { network.usages().toUsageVo() }
		vdsmName { network.vdsmName() }
		dataCenterVo { network.dataCenter().fromDataCenterToIdentifiedVo() }
		openStackNetworkVo {
			if(network.externalProviderPresent()) network.externalProvider().toOpenStackNetworkVo()
			else null
		}
		vlan { if (network.vlanPresent()) network.vlan().idAsInteger() else 0}
		vnicProfileVos { network.vnicProfiles().fromVnicProfilesToIdentifiedVos() }
	}
}
fun List<Network>.toDcNetworkMenus(): List<NetworkVo> =
	this@toDcNetworkMenus.map { it.toDcNetworkMenu() }


fun Network.toClusterNetworkMenu(): NetworkVo {
	val network = this@toClusterNetworkMenu
	// TODO 할당을 어떻게 나타낼거냐
	return NetworkVo.builder {
		id { network.id() }
		name { network.name() }
		description { network.description() }
		portIsolation { network.portIsolation() }
		status { network.status().toNetworkStatusB() }
		usage { network.usages().toUsageVo() }
		vlan { if(network.vlanPresent()) network.vlan().idAsInteger() else null }
		required { if(network.requiredPresent()) network.required() else false }
	}
}
fun List<Network>.toClusterNetworkMenus(): List<NetworkVo> =
	this@toClusterNetworkMenus.map { it.toClusterNetworkMenu() }

// region: builder
/**
 * 네트워크 빌더
 * external provider 선택시 vlan, portisolation=false 선택되면 안됨
 * VnicProfile은 기본생성만 /qos는 제외항목, 네트워크필터도 vdsm으로 고정(?)
 */
fun NetworkVo.toNetworkBuilder(): NetworkBuilder {
	val builder = NetworkBuilder()
		.dataCenter(DataCenterBuilder().id(dataCenterVo.id).build())
		.name(name)
		.description(description)
		.comment(comment)
		.mtu(mtu)  // 제한수가 있음
		.portIsolation(portIsolation)

	if (usage.vm == true) {
		builder.usages(NetworkUsage.VM)
	}
	if (vlan != 0) {
		builder.vlan(VlanBuilder().id((vlan)))
		// TODO: vlan 값이 0일 때 ovirt에서는 경고문구를 띄어줄 떄가 있다. 20번 ovrirtmgmt 참고
	}
	/*builder.vlan(
		VlanBuilder().apply {
			id(network.vlan)
		}
	)
	*/
	/*
	NOTE: 사용불가 되지 않는 기능
	if (dnsNameServers.isNotEmpty()) {
		builder.dnsResolverConfiguration(
			DnsResolverConfigurationBuilder().nameServers(dnsNameServers).build()
		)
	}
	*/
	log.info("NetworkVo: {}", this)
	return builder
}

// 필요 name, datacenter_id
fun NetworkVo.toAddNetwork(): Network = toNetworkBuilder()
	.build()

fun NetworkVo.toEditNetwork(): Network = toNetworkBuilder()
	.id(id)
	.build()

fun NetworkVo.toAddClusterAttach(conn: Connection, networkId: String) {
	val network = conn.findNetwork(networkId)
		.getOrNull() ?: throw ErrorPattern.NETWORK_NOT_FOUND.toException()

	clusterVos.forEach { clusterVo ->
		attachNetworkToCluster(conn, clusterVo, networkId)
	}
}

private fun attachNetworkToCluster(conn: Connection, clusterVo: ClusterVo, networkId: String) {
	val cluster = conn.findCluster(clusterVo.id)
		.getOrNull() ?: throw ErrorPattern.CLUSTER_NOT_FOUND.toException()
	log.info("{} attach", clusterVo.name)
	conn.addNetworkFromCluster(
		clusterVo.id,
		NetworkBuilder().id(networkId).required(clusterVo.required).build()
	).getOrNull()
}


// 클러스터 연결.할당 (attach 가 되어잇어야 required 선택가능)
// 선택되면 clusterVo(id, required=t/f)
// 이게 ext에 들어가려면 cluster의 개수,  networkid, clusterid, cluster required(tf)
//fun NetworkVo.toAddClusterAttach(conn: Connection, networkId: String) {
//	conn.findNetwork(networkId)
//		.getOrNull() ?: throw ErrorPattern.NETWORK_NOT_FOUND.toException()
//
//	// TODO:HELP 반환값을 어떻게 할지 의문
//	if (this@toAddClusterAttach.clusterVos.isNotEmpty()) {
//		this@toAddClusterAttach.clusterVos.forEach { clusterVo ->
//			conn.findCluster(clusterVo.id)
//				.getOrNull() ?: throw ErrorPattern.CLUSTER_NOT_FOUND.toException()
//			conn.addNetworkFromCluster(
//				clusterVo.id,
//				NetworkBuilder().id(networkId).required(clusterVo.required).build()
//			).getOrNull()
//		}
//	}
//}

// 네트워크 레이블
fun NetworkVo.toAddNetworkLabel(conn: Connection, networkId: String) {
	if (openStackNetworkVo.id.isEmpty() && networkLabel.isNotEmpty()) {
		conn.addNetworkLabelFromNetwork(
			networkId,
			NetworkLabelBuilder().id(networkLabel).build()
		)
	}
}
// endregion
