package com.itinfo.rutilvm.api.model.computing

import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.api.model.*
import com.itinfo.rutilvm.api.model.network.*
import com.itinfo.rutilvm.api.ovirt.business.ArchitectureType
import com.itinfo.rutilvm.util.ovirt.*
import com.itinfo.rutilvm.api.ovirt.business.BiosTypeB
import com.itinfo.rutilvm.api.ovirt.business.FipsModeB
import com.itinfo.rutilvm.api.ovirt.business.FirewallTypeB
import com.itinfo.rutilvm.api.ovirt.business.MigrateOnErrorB
import com.itinfo.rutilvm.api.ovirt.business.model.TreeNavigatable
import com.itinfo.rutilvm.api.ovirt.business.model.TreeNavigatableType
import com.itinfo.rutilvm.api.ovirt.business.toArchitecture
import com.itinfo.rutilvm.api.ovirt.business.toArchitectureType
import com.itinfo.rutilvm.api.ovirt.business.toBiosType
import com.itinfo.rutilvm.api.ovirt.business.toBiosTypeB
import com.itinfo.rutilvm.api.ovirt.business.toFirewallTypeB
import com.itinfo.rutilvm.api.ovirt.business.toMigrateOnError
import com.itinfo.rutilvm.api.ovirt.business.toMigrateOnErrorB

import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.builders.ClusterBuilder
import org.ovirt.engine.sdk4.builders.CpuBuilder
import org.ovirt.engine.sdk4.builders.DataCenterBuilder
import org.ovirt.engine.sdk4.builders.ErrorHandlingBuilder
import org.ovirt.engine.sdk4.builders.FencingPolicyBuilder
import org.ovirt.engine.sdk4.builders.NetworkBuilder
import org.ovirt.engine.sdk4.builders.SkipIfConnectivityBrokenBuilder
import org.ovirt.engine.sdk4.builders.SkipIfSdActiveBuilder
import org.ovirt.engine.sdk4.builders.VersionBuilder
import org.ovirt.engine.sdk4.types.*
import org.slf4j.LoggerFactory
import java.io.Serializable

private val log = LoggerFactory.getLogger(ClusterVo::class.java)

/**
 * [ClusterVo]
 * 클러스터
 *
 * @property id [String]
 * @property name [String]
 * @property description [String]
 * @property comment [String]
 * @property isConnected [Boolean]
 * @property ballooningEnabled [Boolean]
 * @property biosType [BiosType] 칩셋/펌웨어 유형
 * @property cpuArc [Architecture] cpu 아키텍쳐 cpu().architecture()
 * @property cpuType [String] cpu 유형 cpu().type()
 * @property errorHandling [MigrateOnErrorB] 복구정책 <error_handling> <on_error>migrate_highly_available</on_error> </error_handling>
 * @property fipsMode [FipsModeB] FIPS 모드
 * @property firewallType [FirewallType] 방화벽 유형
 * @property glusterService [Boolean] Gluster 서비스 활성화
 * @property haReservation [Boolean]
 * @property logMaxMemory [Long] 로그의 최대 메모리 한계
 * @property logMaxMemoryType [LogMaxMemoryUsedThresholdType] 로그의 최대 메모리 타입 (absolute_value_in_mb, percentage)
 * @property memoryOverCommit [Int]
 * @property migrationPolicy [InheritableBoolean] 마이그레이션 정책 migration-auto_coverage
 * @property bandwidth [MigrationBandwidthAssignmentMethod]  마이그레이션 대역폭
 * @property encrypted [InheritableBoolean]  마이그레이션 추가속성- 암호화 사용
 * @property switchType [SwitchType] 스위치 유형
 * @property threadsAsCores [Boolean]
 * @property version [String]
 * @property virtService [Boolean] virt 서비스 활성화
 * @property networkProvider [Boolean] 네트워크 공급자 여부 (clusters/id/externalnetworkproviders 에 포함되는지)
 * @property dataCenterVo [IdentifiedVo]
 * @property networkVo [NetworkVo] // 관리네트워크
 * @property hostSize [SizeVo]
 * @property vmSize [SizeVo]
 * @property hostVos List<[IdentifiedVo]>
 * @property networkVos List<[IdentifiedVo]>
 * @property templateVos List<[IdentifiedVo]>
 * @property required [Boolean]
 **/
class ClusterVo(
	override val id: String = "",
    override val name: String = "",
	override val status: Unit? = null,
    val description: String = "",
    val comment: String = "",
    val isConnected: Boolean = false,
    val ballooningEnabled: Boolean = false,
    val biosType: BiosTypeB? = BiosTypeB.cluster_default,
    val cpuArc: ArchitectureType? = ArchitectureType.undefined,
    val cpuType: String = "",
    val errorHandling: MigrateOnErrorB? = MigrateOnErrorB.do_not_migrate,   /* MigrateOnError */
    val fipsMode: FipsModeB? = FipsModeB.undefined,
    val firewallType: FirewallTypeB? = FirewallTypeB.firewalld,
    val glusterService: Boolean = false,
    val haReservation: Boolean = false,
    val logMaxMemory: Long = 0L,
    val logMaxMemoryType: LogMaxMemoryUsedThresholdType = LogMaxMemoryUsedThresholdType.PERCENTAGE,
    val memoryOverCommit: Int = 0,
    val migrationPolicy: InheritableBoolean = InheritableBoolean.INHERIT,
    val bandwidth: MigrationBandwidthAssignmentMethod = MigrationBandwidthAssignmentMethod.AUTO,
    val encrypted: InheritableBoolean = InheritableBoolean.INHERIT,
    val switchType: SwitchType = SwitchType.LEGACY,
    val threadsAsCores: Boolean = false,
    val version: String = "",
    val virtService: Boolean = false,
    val networkProvider: Boolean = false,
	val dataCenterVo: IdentifiedVo = IdentifiedVo(),
    val networkVo: NetworkVo = NetworkVo(), // 관리네트워크
    val hostSize: SizeVo = SizeVo(),
    val vmSize: SizeVo = SizeVo(),
    val hostVos: List<IdentifiedVo> = listOf(),
    val networkVos: List<IdentifiedVo> = listOf(), // 관리 네트워크가 핵심, 다른 네트워크 존재가능
    val templateVos: List<IdentifiedVo> = listOf(),
	val required: Boolean = false,
): Serializable, TreeNavigatable<Unit> {
	override val type: TreeNavigatableType = TreeNavigatableType.CLUSTER // 네트워크 생성시 필수 지정
	val biosTypeCode: String		get() = biosType?.code ?: BiosTypeB.cluster_default.code
	val biosTypeEn: String			get() = biosType?.en ?: "N/A"
	val biosTypeKr: String			get() = biosType?.kr ?: "알 수 없음"
	val cpuArcCode: String			get() = cpuArc?.code ?: ArchitectureType.undefined.code
	val errorHandlingCode: String	get() = errorHandling?.code ?: MigrateOnErrorB.do_not_migrate.code
	val errorHandlingEn: String		get() = errorHandling?.en ?: "N/A"
	val errorHandlingKr: String		get() = errorHandling?.kr ?: "알 수 없음"
	val fipsModeCode: String		get() = fipsMode?.code ?: FipsModeB.undefined.code
	val fipsModeEn: String			get() = fipsMode?.en ?: "N/A"
	val fipsModeKr: String			get() = fipsMode?.kr ?: "알 수 없음"

	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bDescription: String = "";fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bComment: String = "";fun comment(block: () -> String?) { bComment = block() ?: "" }
		private var bIsConnected: Boolean = false; fun isConnected(block: () -> Boolean?) { bIsConnected = block() ?: false }
		private var bBallooningEnabled: Boolean = false; fun ballooningEnabled(block: () -> Boolean?) { bBallooningEnabled = block() ?: false }
		private var bBiosType: BiosTypeB? = BiosTypeB.cluster_default; fun biosType(block: () -> BiosTypeB?) { bBiosType = block() ?: BiosTypeB.cluster_default }
		private var bCpuArc: ArchitectureType? = ArchitectureType.undefined; fun cpuArc(block: () -> ArchitectureType?) { bCpuArc = block() ?: ArchitectureType.undefined }
		private var bCpuType: String = ""; fun cpuType(block: () -> String?) { bCpuType = block() ?: "" }
		private var bErrorHandling: MigrateOnErrorB? = MigrateOnErrorB.do_not_migrate; fun errorHandling(block: () -> MigrateOnErrorB?) { bErrorHandling = block() ?: MigrateOnErrorB.do_not_migrate }
		private var bFipsMode: FipsModeB? = FipsModeB.undefined; fun fipsMode(block: () -> FipsModeB?) { bFipsMode = block() ?: FipsModeB.undefined }
		private var bFirewallType: FirewallTypeB? = FirewallTypeB.firewalld; fun firewallType(block: () -> FirewallTypeB?) { bFirewallType = block() ?: FirewallTypeB.firewalld}
		private var bGlusterService: Boolean = false; fun glusterService(block: () -> Boolean?) { bGlusterService = block() ?: false }
		private var bHaReservation: Boolean = false; fun haReservation(block: () -> Boolean?) { bHaReservation = block() ?: false }
		private var bLogMaxMemory: Long = 0L; fun logMaxMemory(block: () -> Long?) { bLogMaxMemory = block() ?: 0L }
		private var bLogMaxMemoryType: LogMaxMemoryUsedThresholdType = LogMaxMemoryUsedThresholdType.PERCENTAGE; fun logMaxMemoryType(block: () -> LogMaxMemoryUsedThresholdType?) { bLogMaxMemoryType = block() ?: LogMaxMemoryUsedThresholdType.PERCENTAGE }
		private var bMemoryOverCommit: Int = 0; fun memoryOverCommit(block: () -> Int?) { bMemoryOverCommit = block() ?: 0 }
		private var bMigrationPolicy: InheritableBoolean = InheritableBoolean.INHERIT; fun migrationPolicy(block: () -> InheritableBoolean?) { bMigrationPolicy = block() ?: InheritableBoolean.INHERIT }
		private var bBandwidth: MigrationBandwidthAssignmentMethod = MigrationBandwidthAssignmentMethod.AUTO; fun bandwidth(block: () -> MigrationBandwidthAssignmentMethod?) { bBandwidth = block() ?: MigrationBandwidthAssignmentMethod.AUTO }
		private var bEncrypted: InheritableBoolean = InheritableBoolean.INHERIT; fun encrypted(block: () -> InheritableBoolean?) { bEncrypted = block() ?: InheritableBoolean.INHERIT }
		private var bSwitchType: SwitchType = SwitchType.LEGACY; fun switchType(block: () -> SwitchType?) { bSwitchType = block() ?: SwitchType.LEGACY }
		private var bThreadsAsCores: Boolean = false; fun threadsAsCores(block: () -> Boolean?) { bThreadsAsCores = block() ?: false }
		private var bVersion: String = ""; fun version(block: () -> String?) { bVersion = block() ?: "" }
		private var bVirtService: Boolean = false; fun virtService(block: () -> Boolean?) { bVirtService = block() ?: false }
		private var bNetworkProvider: Boolean = false; fun networkProvider(block: () -> Boolean?) { bNetworkProvider = block() ?: false }
		private var bDataCenterVo: IdentifiedVo = IdentifiedVo(); fun dataCenterVo(block: () -> IdentifiedVo?) { bDataCenterVo = block() ?: IdentifiedVo() }
		private var bNetworkVo: NetworkVo = NetworkVo(); fun networkVo(block: () -> NetworkVo?) { bNetworkVo = block() ?: NetworkVo() }
		private var bHostSize: SizeVo = SizeVo(); fun hostSize(block: () -> SizeVo?) { bHostSize = block() ?: SizeVo() }
		private var bVmSize: SizeVo = SizeVo(); fun vmSize(block: () -> SizeVo?) { bVmSize = block() ?: SizeVo() }
		private var bHostVos: List<IdentifiedVo> = listOf();fun hostVos(block: () -> List<IdentifiedVo>?) { bHostVos = block() ?: listOf() }
		private var bNetworkVos: List<IdentifiedVo> = listOf();fun networkVos(block: () -> List<IdentifiedVo>?) { bNetworkVos = block() ?: listOf() }
		private var bTemplateVos: List<IdentifiedVo> = listOf();fun templateVos(block: () -> List<IdentifiedVo>?) { bTemplateVos = block() ?: listOf() }
		private var bRequired: Boolean = false; fun required(block: () -> Boolean?) { bRequired = block() ?: false }

		fun build(): ClusterVo = ClusterVo(bId, bName, null, bDescription, bComment, bIsConnected, bBallooningEnabled, bBiosType, bCpuArc, bCpuType, bErrorHandling, bFipsMode, bFirewallType, bGlusterService, bHaReservation, bLogMaxMemory, bLogMaxMemoryType, bMemoryOverCommit, bMigrationPolicy, bBandwidth, bEncrypted, bSwitchType, bThreadsAsCores, bVersion, bVirtService, bNetworkProvider, bDataCenterVo, bNetworkVo, bHostSize, bVmSize, bHostVos, bNetworkVos, bTemplateVos, /*bNetworkProperty, bAttached, */bRequired)
	}

	companion object {
		inline fun builder(block: ClusterVo.Builder.() -> Unit): ClusterVo = ClusterVo.Builder().apply(block).build()
	}
}

// 클러스터 id & name
fun Cluster.toClusterIdName(): ClusterVo = ClusterVo.builder {
	id { this@toClusterIdName.id() }
	name { this@toClusterIdName.name() }
}
fun List<Cluster>.toClustersIdName(): List<ClusterVo> =
	this@toClustersIdName.map { it.toClusterIdName() }

// 클러스터 목록
fun Cluster.toClusterMenu(conn: Connection): ClusterVo {
	val cluster = this@toClusterMenu
	val dataCenter =
		if (cluster.dataCenterPresent()) { conn.findDataCenter(cluster.dataCenter().id()).getOrNull() }
		else { null }
	return ClusterVo.builder {
		id { cluster.id() }
		name { cluster.name() }
		description { cluster.description() }
		comment { cluster.comment() }
		cpuArc { cluster.cpu()?.architecture()?.toArchitectureType() }
		cpuType { if(cluster.cpuPresent()) cluster.cpu().type().toString() else null }
		version { cluster.version().major().toString() + "." + cluster.version().minor() }
		dataCenterVo { dataCenter?.fromDataCenterToIdentifiedVo() }
		hostSize { cluster.findHostCntFromCluster(conn) }
		vmSize { cluster.findVmCntFromCluster(conn) }
	}
}
fun List<Cluster>.toClustersMenu(conn: Connection): List<ClusterVo> =
	this@toClustersMenu.map { it.toClusterMenu(conn) }


// 데이터센터에서 뜰 클러스터 목록
fun Cluster.toDcClusterMenu(): ClusterVo = ClusterVo.builder {
	id { this@toDcClusterMenu.id() }
	name { this@toDcClusterMenu.name() }
	version { this@toDcClusterMenu.version().major().toString() + "." + this@toDcClusterMenu.version().minor() }
	description { this@toDcClusterMenu.description() }
}
fun List<Cluster>.toDcClustersMenu(): List<ClusterVo> =
	this@toDcClustersMenu.map { it.toDcClusterMenu() }


fun Cluster.toClusterInfo(conn: Connection): ClusterVo {
	val cluster = this@toClusterInfo
	val dataCenter =
		if(cluster.dataCenterPresent()) { conn.findDataCenter(cluster.dataCenter().id()).getOrNull() }
		else { null }
	return ClusterVo.builder {
		id { cluster.id() }
		name { cluster.name() }
		description {cluster.description() }
		comment { cluster.comment() }
		biosType { cluster.biosType().toBiosTypeB() }
		cpuArc { cluster?.cpu()?.architecture()?.toArchitectureType() }
		cpuType { if (cluster.cpuPresent()) cluster.cpu().type() else null }
		firewallType { cluster.firewallType().toFirewallTypeB() }
		haReservation { cluster.haReservation() }
		logMaxMemory { cluster.logMaxMemoryUsedThresholdAsLong() }
		logMaxMemoryType { cluster.logMaxMemoryUsedThresholdType() }
		memoryOverCommit { cluster.memoryPolicy().overCommit().percentAsInteger() }
		migrationPolicy { cluster.migration().autoConverge() }
		errorHandling { cluster.errorHandling().onError().toMigrateOnErrorB() }
		bandwidth { cluster.migration().bandwidth().assignmentMethod() }
		networkVo { cluster.networks().firstOrNull() { it.display() }?.toNetworkIdName() }
		version { cluster.version().major().toString() + "." + cluster.version().minor() }
		dataCenterVo { dataCenter?.fromDataCenterToIdentifiedVo() }
		vmSize { cluster.findVmCntFromCluster(conn) }
	}
}


fun Cluster.toNetworkClusterVo(conn: Connection, networkId: String): ClusterVo{
	val network: Network? = conn.findAllNetworksFromCluster(this@toNetworkClusterVo.id())
		.getOrDefault(listOf())
		.find { it.id() == networkId }

	return ClusterVo.builder {
		id { this@toNetworkClusterVo.id() }
		name { this@toNetworkClusterVo.name() }
		description {this@toNetworkClusterVo.description() }
		isConnected { network != null }
		networkVo { network?.toClusterNetworkMenu() }
	}
}
fun Collection<Cluster>.toNetworkClusterVos(conn: Connection, networkId: String): List<ClusterVo> =
	this@toNetworkClusterVos.map { it.toNetworkClusterVo(conn, networkId) }


// 클러스터가 가진 데이터센터를 구하기(데이터센터가 없는경우도 있긴함)
fun Cluster.resolveDataCenter(conn: Connection): DataCenter? {
	return if (this.dataCenterPresent()) conn.findDataCenter(this.dataCenter().id()).getOrNull() else null
}

// region: builder

/**
 * 클러스터 빌더
 */
fun ClusterVo.toClusterBuilder(conn: Connection): ClusterBuilder {
	val builder = ClusterBuilder()
		.dataCenter(DataCenterBuilder().id(dataCenterVo.id).build()) // 필수
		.name(name) // 필수
		.description(description)
		.comment(comment)
		.managementNetwork(NetworkBuilder().id(networkVo.id).build())
		.biosType(biosType.toBiosType())
		.version(VersionBuilder().major(4).minor(7).build())
		.switchType(SwitchType.LEGACY)  // 편집에선 선택불가
		.firewallType(FirewallType.FIREWALLD)
		.virtService(true)
		.glusterService(false)
		.errorHandling(ErrorHandlingBuilder().onError(errorHandling?.toMigrateOnError()))
		.externalNetworkProviders(conn.findAllOpenStackNetworkProviders().getOrDefault(listOf()).first())// 무조건 들어가게 해뒀음
		.fencingPolicy(
			FencingPolicyBuilder()
				.skipIfConnectivityBroken(SkipIfConnectivityBrokenBuilder().enabled(true))
				.skipIfSdActive(SkipIfSdActiveBuilder().enabled(true))
		)
//		.fipsMode(FipsMode.UNDEFINED)
//		.logMaxMemoryUsedThreshold(builder.logMaxMemory)
//		.logMaxMemoryUsedThresholdType(builder.logMaxMemoryType)
	// HELP: 마이그레이션 정책 관련 설정 값 조회 기능 존재여부 확인필요
//		.migration(
//			MigrationOptionsBuilder()
//				.bandwidth(MigrationBandwidthBuilder().assignmentMethod(builder.bandwidth))
//				.encrypted(builder.encrypted)
//		)

	if (cpuArc == ArchitectureType.undefined && cpuType == "none") {
		// 아무것도 안함
	} else if (cpuArc == ArchitectureType.undefined && cpuType != "none") {
		builder.cpu(CpuBuilder().type(cpuType))
	} else {
		builder.cpu(
			CpuBuilder()
				.architecture(cpuArc.toArchitecture())
				.type(cpuType)
		)
	}

	return builder
}

/**
 * 클러스터 생성 빌더
 * 생성시 fips 모드, 호환버전, 스위치 유형, 방화벽유형, 기본네트워크 공급자, virt 서비스 활성화, gluster 서비스 활성화 기본설정
 */
fun ClusterVo.toAddCluster(conn: Connection): Cluster =
	toClusterBuilder(conn)
		.fipsMode(FipsMode.UNDEFINED)
		.build()

/**
 * 클러스터 편집 빌더
 */
fun ClusterVo.toEditCluster(conn: Connection): Cluster {
	return toClusterBuilder(conn)
		.id(id)
		.build()
}

fun IdentifiedVo.toClusterIdentified(): Cluster = ClusterBuilder()
	.id(this@toClusterIdentified.id)
	.build()


// endregion
