package com.itinfo.rutilvm.api.model.network

import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.model.computing.*
import com.itinfo.rutilvm.api.model.fromDataCenterToIdentifiedVo
import com.itinfo.rutilvm.api.model.fromVnicProfilesToIdentifiedVos
import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.util.ovirt.*
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern

import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.builders.DataCenterBuilder
import org.ovirt.engine.sdk4.builders.NetworkBuilder
import org.ovirt.engine.sdk4.builders.NetworkLabelBuilder
import org.ovirt.engine.sdk4.builders.OpenStackNetworkProviderBuilder
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
 * @property datacenterVo [IdentifiedVo]
// * @property networkClusterVo []
 * @property openStackNetworkVo [OpenStackNetworkVo] 네트워크 공급자(한개만 있음) (생성시 여부(boolean)으로 처리,추가)
 *
 * 네트워크 생성시 필요
 * @property vlan [Int] vlan 태그 (태그 자체는 활성화를 해야 입력란이 생김)
// * @proprety dnsList List<[String]> DNS 서버는 애매함
 *
 * 클러스터에서 출력될 내용
 * @property status [NetworkStatus] 네트워크 상태
 * @property display [Boolean] 클러스터-네트워크 관리
 * @property networkLabel [String] 네트워크 레이블
 * @property clusterVo [IdentifiedVo]
 * @property attached [Boolean] 할당 -> cluster-network-cluster<> 생성되고 아니면 cluster-network 에서 제외
 * @property required [Boolean] 클러스터-네트워크 관리 -> 필수(t,f)
 *
 * @property vnicProfileVos List<[IdentifiedVo]> vnicProfile
 * @property clusterVos List<[ClusterVo]> clusters  // networks clusters
 *
 */
class NetworkVo (
	val id: String = "",
	val name: String = "",
	val description: String = "",
	val comment: String = "",
	val mtu: Int = 0,
	val portIsolation: Boolean = false,
	val stp: Boolean = false,
	val usage: UsageVo = UsageVo(),
	val vdsmName: String = "",
	val datacenterVo: IdentifiedVo = IdentifiedVo(),
	val openStackNetworkVo: OpenStackNetworkVo = OpenStackNetworkVo(),
	val vlan: Int = 0,
	val status: NetworkStatus = NetworkStatus.NON_OPERATIONAL,
	val display: Boolean = false,
	val networkLabel: String = "",
	val clusterVo: IdentifiedVo = IdentifiedVo(),
	val vnicProfileVos: List<IdentifiedVo> = listOf(),
	val clusterVos: List<ClusterVo> = listOf(),
	val required: Boolean = false,
):Serializable {
	override fun toString(): String = gson.toJson(this)

	class Builder{
		private var bId: String = ""; fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String = ""; fun name(block: () -> String?) { bName = block() ?: "" }
		private var bDescription: String = ""; fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bComment: String = ""; fun comment(block: () -> String?) { bComment = block() ?: "" }
		private var bMtu: Int = 0; fun mtu( block: () -> Int?) { bMtu = block() ?: 0 }
		private var bPortIsolation: Boolean = false; fun portIsolation( block: () -> Boolean?) { bPortIsolation = block() ?: false }
		private var bStp: Boolean = false; fun stp( block: () -> Boolean?) { bStp = block() ?: false }
		private var bUsage: UsageVo = UsageVo(); fun usage(block: () -> UsageVo?) { bUsage = block() ?: UsageVo() }
		private var bVdsmName: String = ""; fun vdsmName(block: () -> String?) { bVdsmName = block() ?: "" }
		private var bDatacenterVo: IdentifiedVo = IdentifiedVo(); fun datacenterVo(block: () -> IdentifiedVo?) { bDatacenterVo = block() ?: IdentifiedVo() }
		private var bOpenStackNetworkVo: OpenStackNetworkVo = OpenStackNetworkVo(); fun openStackNetworkVo(block: () -> OpenStackNetworkVo?) { bOpenStackNetworkVo = block() ?: OpenStackNetworkVo() }
		private var bVlan: Int = 0; fun vlan(block: () -> Int?) { bVlan = block() ?: 0 }
		private var bStatus: NetworkStatus = NetworkStatus.NON_OPERATIONAL; fun status(block: () -> NetworkStatus?) { bStatus = block() ?: NetworkStatus.NON_OPERATIONAL }
		private var bDisplay: Boolean = false; fun display(block: () -> Boolean?) { bDisplay = block() ?: false }
		private var bNetworkLabel: String = ""; fun networkLabel(block: () -> String?) { bNetworkLabel = block() ?: "" }
		private var bClusterVo: IdentifiedVo = IdentifiedVo(); fun clusterVo(block: () -> IdentifiedVo?) { bClusterVo = block() ?: IdentifiedVo() }
		private var bVnicProfileVos: List<IdentifiedVo> = listOf(); fun vnicProfileVos(block: () -> List<IdentifiedVo>?) { bVnicProfileVos = block() ?: listOf() }
		private var bClusterVos: List<ClusterVo> = listOf(); fun clusterVos(block: () -> List<ClusterVo>?) { bClusterVos = block() ?: listOf() }
		private var bRequired: Boolean = false; fun required(block: () -> Boolean?) { bRequired = block() ?: false }

		fun build(): NetworkVo = NetworkVo(bId, bName, bDescription, bComment, bMtu, bPortIsolation, bStp, bUsage, bVdsmName, bDatacenterVo, bOpenStackNetworkVo, bVlan, bStatus, bDisplay, bNetworkLabel, bClusterVo, bVnicProfileVos, bClusterVos, bRequired)
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


fun Network.toNetworkMenu(conn: Connection): NetworkVo {
	val network = this@toNetworkMenu
	val dataCenter: DataCenter? = conn.findDataCenter(this@toNetworkMenu.dataCenter().id()).getOrNull()
 	return NetworkVo.builder {
		id { network.id() }
		name { network.name() }
		description { network.description() }
		comment { network.comment() }
		mtu { network.mtu().toInt() }
		portIsolation { network.portIsolation() }
		datacenterVo { dataCenter?.fromDataCenterToIdentifiedVo() }
//		openStackNetwork {
//			if (network.externalProviderPresent())
//				conn.findOpenStackNetworkProvider(network.externalProvider().id())
//					.getOrNull()
//					?.toOpenStackNetworkVo(conn)
//			else
//				null
//		}
		vlan { if (network.vlanPresent()) network.vlan().idAsInteger() else 0 }
	}
}
fun List<Network>.toNetworksMenu(conn: Connection): List<NetworkVo> =
	this@toNetworksMenu.map { it.toNetworkMenu(conn) }


fun Network.toNetworkVo(conn: Connection): NetworkVo {
	val network = this@toNetworkVo
	val vnicProfileVos: List<VnicProfile> = conn.findAllVnicProfiles().getOrDefault(listOf())
		.filter { it.network().id() == network.id() }

	val usages: MutableList<NetworkUsage>? = conn.findNetwork(network.id())
		.getOrNull()?.usages()
	val dataCenter: DataCenter? = conn.findDataCenter(network.dataCenter().id())
		.getOrNull()

	return NetworkVo.builder {
		id { network.id() }
		name { network.name() }
		description { network.description() }
		comment { network.comment() }
		mtu { network.mtu().toInt() }
		portIsolation { network.portIsolation() }
		stp { network.stp() }
		usage { usages?.toUsagesVo() }
		vdsmName { network.vdsmName() }
		datacenterVo { dataCenter?.fromDataCenterToIdentifiedVo() }
		openStackNetworkVo {
			if(network.externalProviderPresent())
				conn.findOpenStackNetworkProvider(network.externalProvider().id())
					.getOrNull()?.toOpenStackNetworkVo(conn)
			else null
		}
		vlan { if (network.vlanPresent()) network.vlan().idAsInteger() else 0}
		vnicProfileVos { vnicProfileVos.fromVnicProfilesToIdentifiedVos() }
	}
}

fun List<Network>.toNetworkVos(conn: Connection): List<NetworkVo> =
	this@toNetworkVos.map { it.toNetworkVo(conn) }


fun Network.toClusterNetworkVo(conn: Connection): NetworkVo {
	val usages: List<NetworkUsage> = this@toClusterNetworkVo.usages()
	// TODO 할당을 어떻게 나타낼거냐
	return NetworkVo.builder {
		id { this@toClusterNetworkVo.id() }
		name { this@toClusterNetworkVo.name() }
		description { this@toClusterNetworkVo.description() }
		portIsolation { this@toClusterNetworkVo.portIsolation() }
		status { this@toClusterNetworkVo.status() }
		usage { usages.toUsagesVo() }
		required { if(this@toClusterNetworkVo.requiredPresent()) this@toClusterNetworkVo.required() else false }
	}
}
fun List<Network>.toClusterNetworkVos(conn: Connection): List<NetworkVo> =
	this@toClusterNetworkVos.map { it.toClusterNetworkVo(conn) }


/**
 * 네트워크 빌더
 * external provider 선택시 vlan, portisolation=false 선택되면 안됨
 * VnicProfile은 기본생성만 /qos는 제외항목, 네트워크필터도 vdsm으로 고정(?)
 */
fun NetworkVo.toNetworkBuilder(): NetworkBuilder {
	val network = this@toNetworkBuilder

	val builder = NetworkBuilder()
		.dataCenter(DataCenterBuilder().id(network.datacenterVo.id).build())
		.name(network.name)
		.description(network.description)
		.comment(network.comment)
		.mtu(network.mtu)  // 제한수가 있음
		.portIsolation(network.portIsolation)
	if(network.usage.vm){
		builder.usages(NetworkUsage.VM)
	}
	if(network.vlan != 0){
		builder.vlan(VlanBuilder().id(network.vlan))
	}
//	.externalProvider(
//		if(network.openStackNetworkVo.id.isNotEmpty())
//			OpenStackNetworkProviderBuilder().id(network.openStackNetworkVo.id)
//		else
//			null
//	)

	log.info("NetworkVo: {}", this)
	return builder
}

// 필요 name, datacenter_id
fun NetworkVo.toAddNetworkBuilder(): Network =
	this@toAddNetworkBuilder.toNetworkBuilder().build()

fun NetworkVo.toEditNetworkBuilder(): Network =
	this@toEditNetworkBuilder.toNetworkBuilder().id(this@toEditNetworkBuilder.id).build()

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
	if (this@toAddNetworkLabel.openStackNetworkVo.id.isEmpty() && this@toAddNetworkLabel.networkLabel.isNotEmpty()) {
		conn.addNetworkLabelFromNetwork(
			networkId,
			NetworkLabelBuilder().id(this@toAddNetworkLabel.networkLabel).build()
		)
	}
}

