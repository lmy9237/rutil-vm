package com.itinfo.rutilvm.api.model.computing

import com.itinfo.rutilvm.common.formatEnhanced
import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.common.ovirtDf
import com.itinfo.rutilvm.api.model.*
import com.itinfo.rutilvm.api.model.network.HostNicVo
import com.itinfo.rutilvm.api.model.network.toHostNicVos
import com.itinfo.rutilvm.api.model.network.toSlaveHostNicVos
import com.itinfo.rutilvm.api.ovirt.business.SELinuxModeB
import com.itinfo.rutilvm.api.ovirt.business.VdsSpmStatus
import com.itinfo.rutilvm.api.ovirt.business.VdsStatus
import com.itinfo.rutilvm.api.ovirt.business.toSELinuxModeB
import com.itinfo.rutilvm.api.ovirt.business.toVdsSpmStatus
import com.itinfo.rutilvm.api.ovirt.business.toVdsStatus
import com.itinfo.rutilvm.api.repository.history.dto.UsageDto
import com.itinfo.rutilvm.api.repository.history.entity.HostConfigurationEntity
import com.itinfo.rutilvm.common.toTimeElapsedKr
import com.itinfo.rutilvm.util.ovirt.*

import org.slf4j.LoggerFactory
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.builders.*
import org.ovirt.engine.sdk4.types.*
import java.io.Serializable
import java.math.BigInteger
import java.util.*

private val log = LoggerFactory.getLogger(HostVo::class.java)

/**
 * [HostVo]
 * 호스트
 *
 * @property id [String]
 * @property name [String]
 * @property comment [String]
 * @property address [String]  호스트 ip
 * @property devicePassThrough [Boolean]
 * @property hostedActive [Boolean] 활성여부
 * @property hostedScore [Int] 점수
 * @property iscsi [String]
 * @property kdump  [KdumpStatus]   kdumpStatus(disabled, enabled, unknown)
 * @property ksm [Boolean]  hosted engine
 * @property seLinux [SELinuxModeB] SeLinuxMode(disabled, enforcing, permissive)
 * @property hostedEngine [HostedEngineVo] Hosted Engine 이동 여부 [ 금장, 은장, null ]
 * @property hostedEngineVM [Boolean] Hosted Engine VM 여부 [ 금장, 은장, null ]
 * @property spmPriority [Int] spm 우선순위
 * @property spmStatus [VdsSpmStatus] spm 상태
 * @property status [VdsStatus] 호스트 상태
 * @property transparentPage [Boolean] 자동으로 페이지를 크게
 * @property vmTotalCnt [Int] 총 가상머신 ㅅ
 * @property vmActiveCnt [Int] 실행 중인 가상머신 수
 * @property vmSizeVo [SizeVo]
 * @property vmMigratingCnt [Int] 마이그레이션 중인 가상머신 수
 * @property vgpu [String]   VgpuPlacement
 * 전원관리는 항상 비활성상태
 * <statistics>
 * @property memoryTotal [BigInteger]
 * @property memoryUsed [BigInteger]
 * @property memoryFree [BigInteger]
 * @property memoryMax [BigInteger] 새 가상머신 최대여유메모리
 * @property memoryShared [BigInteger] 공유 메모리
 * @property swapTotal [BigInteger]
 * @property swapUsed [BigInteger]
 * @property swapFree [BigInteger]
 * @property hugePage2048Free [Int] Huge Pages (size: free/total) 2048:0/0, 1048576:0/0
 * @property hugePage2048Total [Int]
 * @property hugePage1048576Free [Int]
 * @property hugePage1048576Total [Int]
 * @property bootingTime [String]
 * @property hostHwVo [HostHwVo] 호스트 하드웨어
 * @property hostSwVo [HostSwVo] 호스트 소프트웨어
 * @property clusterVo [ClusterVo]
 * @property dataCenterVo [DataCenterVo]
 * @property hostNicVos List<[HostNicVo]>
 * @property vmVos List<[IdentifiedVo]>
 * @property usageDto [UsageDto]
 */
class HostVo (
    val id: String = "",
    val name: String = "",
    val comment: String = "",
    val address: String = "",
    val devicePassThrough: Boolean = false,
    val iscsi: String = "",
    val kdump: KdumpStatus = KdumpStatus.UNKNOWN,
    val ksm: Boolean = false,
    val seLinux: SELinuxModeB? = SELinuxModeB.disabled,
	val hostedEngine: HostedEngineVo? = null,
	val hostedEngineVM: Boolean = false,
    val spmPriority: Int = 0,
    val spmStatus: VdsSpmStatus? = VdsSpmStatus.none,
	val ssh: SshVo? = SshVo(),
    val status: VdsStatus? = VdsStatus.non_responsive,
    val transparentPage: Boolean = false,
    val vmMigratingCnt: Int = 0,
    val vgpu: String = "", /*VgpuPlacement*/
    val memoryTotal: BigInteger = BigInteger.ZERO,
    val memoryUsed: BigInteger = BigInteger.ZERO,
    val memoryFree: BigInteger = BigInteger.ZERO,
    val memoryMax: BigInteger = BigInteger.ZERO,
    val memoryShared: BigInteger = BigInteger.ZERO,
    val swapTotal: BigInteger = BigInteger.ZERO,
    val swapUsed: BigInteger = BigInteger.ZERO,
    val swapFree: BigInteger = BigInteger.ZERO,
    val hugePage2048Free: Int = 0,
    val hugePage2048Total: Int = 0,
    val hugePage1048576Free: Int = 0,
    val hugePage1048576Total: Int = 0,
	private val _bootingTime: Date? = null,
	val hostHwVo: HostHwVo = HostHwVo(),
    val hostSwVo: HostSwVo = HostSwVo(),
    val clusterVo: IdentifiedVo = IdentifiedVo(),
    val dataCenterVo: IdentifiedVo = IdentifiedVo(),
    val vmSizeVo: SizeVo = SizeVo(),
    val vmVos: List<VmVo> = listOf(),
    val hostNicVos: List<HostNicVo> = listOf(),
    val usageDto: UsageDto = UsageDto(),
	// val certificate: HCertificateVo = HCertificateVo(),

): Serializable {
	val seLinuxCode: String				get() = seLinux?.code ?: SELinuxModeB.disabled.code
	val seLinuxEn: String				get() = seLinux?.en ?: "N/A"
	val seLinuxKr: String				get() = seLinux?.kr ?: "알 수 없음"
	val spmStatusCode: String			get() = spmStatus?.code ?: VdsSpmStatus.none.code
	val spmStatusEn: String				get() = spmStatus?.en ?: "N/A"
	val spmStatusKr: String				get() = spmStatus?.kr ?: "알 수 없음"
	val statusCode: String				get() = status?.code ?: VdsStatus.non_responsive.code
	val statusEn: String				get() = status?.en ?: "N/A"
	val statusKr: String				get() = status?.kr ?: "알 수 없음"

	val bootingTime: String				get() = ovirtDf.formatEnhanced(_bootingTime)
	val uptimeInMilli: Long				get() = Date().time - (_bootingTime?.time ?: 0L)
	val isHostedEngine: Boolean			get() = hostedEngine != null
	val hostedActive: Boolean			get() = hostedEngine?.active == true
	val hostedConfigured: Boolean		get() = hostedEngine?.configured == true
	val hostedScore: Int				get() = hostedEngine?.score ?: 0
	val isGlobalMaintenance: Boolean	get() = hostedEngine?.globalMaintenance == true
	val isLocalMaintenance: Boolean		get() = hostedEngine?.localMaintenance == true

	val upTime: String
		get() = if (
			status == VdsStatus.installing ||
			status == VdsStatus.initializing ||
			status == VdsStatus.installing_os ||
			status == VdsStatus.install_failed ||
			status == VdsStatus.connecting ||
			status == VdsStatus.non_responsive ||
			status == VdsStatus.reboot
		) "N/A" else uptimeInMilli.div(1000L).toTimeElapsedKr()

	override fun toString(): String =
		gson.toJson(this)

    class Builder {
        private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: ""}
        private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: ""}
        private var bComment: String = "";fun comment(block: () -> String?) { bComment = block() ?: ""}
        private var bAddress: String = "";fun address(block: () -> String?) { bAddress = block() ?: ""}
        private var bDevicePassThrough: Boolean = false;fun devicePassThrough(block: () -> Boolean?) { bDevicePassThrough = block() ?: false}
        // private var bHostedActive: Boolean = false;fun hostedActive(block: () -> Boolean?) { bHostedActive = block() ?: false }
		// private var bHostedScore: Int = 0;fun hostedScore(block: () -> Int?) { bHostedScore = block() ?: 0 }
        private var bIscsi: String = "";fun iscsi(block: () -> String?) { bIscsi = block() ?: ""}
        private var bKdump: KdumpStatus = KdumpStatus.UNKNOWN;fun kdump(block: () -> KdumpStatus?) { bKdump = block() ?: KdumpStatus.UNKNOWN}
        private var bKsm: Boolean = false;fun ksm(block: () -> Boolean?) { bKsm = block() ?: false }
        private var bSeLinux: SELinuxModeB? = SELinuxModeB.disabled;fun seLinux(block: () -> SELinuxModeB?) { bSeLinux = block() ?: SELinuxModeB.disabled }
        private var bHostedEngine: HostedEngineVo? = null;fun hostedEngine(block: () -> HostedEngineVo?) { bHostedEngine = block() }
        private var bHostedEngineVM: Boolean = false;fun hostedEngineVM(block: () -> Boolean?) { bHostedEngineVM = block() ?: false }
        private var bSpmPriority: Int = 0;fun spmPriority(block: () -> Int?) { bSpmPriority = block() ?: 0 }
        private var bSpmStatus: VdsSpmStatus? = VdsSpmStatus.none;fun spmStatus(block: () -> VdsSpmStatus?) { bSpmStatus = block() ?: VdsSpmStatus.none }
        private var bSsh: SshVo? = null;fun ssh(block: () -> SshVo?) { bSsh = block() }
        private var bStatus: VdsStatus? = VdsStatus.non_responsive;fun status(block: () -> VdsStatus?) { bStatus = block() ?: VdsStatus.non_responsive }
        private var bTransparentPage: Boolean = false;fun transparentPage(block: () -> Boolean?) { bTransparentPage = block() ?: false }
        private var bVmMigratingCnt: Int = 0;fun vmMigratingCnt(block: () -> Int?) { bVmMigratingCnt = block() ?: 0 }
        private var bVgpu: String = "";fun vgpu(block: () -> String?) { bVgpu = block() ?: "" }
        private var bMemoryTotal: BigInteger = BigInteger.ZERO;fun memoryTotal(block: () -> BigInteger?) { bMemoryTotal = block() ?: BigInteger.ZERO}
        private var bMemoryUsed: BigInteger = BigInteger.ZERO;fun memoryUsed(block: () -> BigInteger?) { bMemoryUsed = block() ?: BigInteger.ZERO}
        private var bMemoryFree: BigInteger = BigInteger.ZERO;fun memoryFree(block: () -> BigInteger?) { bMemoryFree = block() ?: BigInteger.ZERO}
        private var bMemoryMax: BigInteger = BigInteger.ZERO;fun memoryMax(block: () -> BigInteger?) { bMemoryMax = block() ?: BigInteger.ZERO}
        private var bMemoryShared: BigInteger = BigInteger.ZERO;fun memoryShared(block: () -> BigInteger?) { bMemoryShared = block() ?: BigInteger.ZERO}
        private var bSwapTotal: BigInteger = BigInteger.ZERO;fun swapTotal(block: () -> BigInteger?) { bSwapTotal = block() ?: BigInteger.ZERO}
        private var bSwapUsed: BigInteger = BigInteger.ZERO;fun swapUsed(block: () -> BigInteger?) { bSwapUsed = block() ?: BigInteger.ZERO}
        private var bSwapFree: BigInteger = BigInteger.ZERO;fun swapFree(block: () -> BigInteger?) { bSwapFree = block() ?: BigInteger.ZERO}
        private var bHugePage2048Free: Int = 0;fun hugePage2048Free(block: () -> Int?) { bHugePage2048Free = block() ?: 0}
        private var bHugePage2048Total: Int = 0;fun hugePage2048Total(block: () -> Int?) { bHugePage2048Total = block() ?: 0}
        private var bHugePage1048576Free: Int = 0;fun hugePage1048576Free(block: () -> Int?) { bHugePage1048576Free = block() ?: 0}
        private var bHugePage1048576Total: Int = 0;fun hugePage1048576Total(block: () -> Int?) { bHugePage1048576Total = block() ?: 0}
        private var bBootingTime: Date? = null;fun bootingTime(block: () -> Date?) { bBootingTime = block()}
        private var bHostHwVo: HostHwVo = HostHwVo();fun hostHwVo(block: () -> HostHwVo?) { bHostHwVo = block() ?: HostHwVo() }
        private var bHostSwVo: HostSwVo = HostSwVo();fun hostSwVo(block: () -> HostSwVo?) { bHostSwVo = block() ?: HostSwVo()}
        private var bClusterVo: IdentifiedVo = IdentifiedVo();fun clusterVo(block: () -> IdentifiedVo?) { bClusterVo = block() ?: IdentifiedVo() }
        private var bDataCenterVo: IdentifiedVo = IdentifiedVo();fun dataCenterVo(block: () -> IdentifiedVo?) { bDataCenterVo = block() ?: IdentifiedVo() }
        private var bVmSizeVo: SizeVo = SizeVo();fun vmSizeVo(block: () -> SizeVo?) { bVmSizeVo = block() ?: SizeVo() }
        private var bVmVos: List<VmVo> = listOf();fun vmVos(block: () -> List<VmVo>?) { bVmVos = block() ?: listOf() }
        private var bHostNicVos: List<HostNicVo> = listOf();fun hostNicVos(block: () -> List<HostNicVo>?) { bHostNicVos = block() ?: listOf() }
        private var bUsageDto: UsageDto = UsageDto();fun usageDto(block: () -> UsageDto?) { bUsageDto = block() ?: UsageDto() }

        fun build(): HostVo = HostVo(bId, bName, bComment, bAddress, bDevicePassThrough, bIscsi, bKdump, bKsm, bSeLinux, bHostedEngine, bHostedEngineVM, bSpmPriority, bSpmStatus, bSsh, bStatus, bTransparentPage, bVmMigratingCnt, bVgpu, bMemoryTotal, bMemoryUsed, bMemoryFree, bMemoryMax, bMemoryShared, bSwapTotal, bSwapUsed, bSwapFree, bHugePage2048Free, bHugePage2048Total, bHugePage1048576Free, bHugePage1048576Total, bBootingTime, bHostHwVo, bHostSwVo, bClusterVo, bDataCenterVo, bVmSizeVo, bVmVos, bHostNicVos, bUsageDto,)
    }
    companion object {
        inline fun builder(block: HostVo.Builder.() -> Unit): HostVo = HostVo.Builder().apply(block).build()
    }
}

/**
 * [Host.toIdentifiedVoFromHost]
 * 호스트 id & name
 */
fun Host.toIdentifiedVoFromHost(): IdentifiedVo = IdentifiedVo.builder {
    id { this@toIdentifiedVoFromHost.id() }
    name { this@toIdentifiedVoFromHost.name() }
}
fun Collection<Host>.toIdentifiedVosFromHosts(): List<IdentifiedVo> =
    this@toIdentifiedVosFromHosts.map { it.toIdentifiedVoFromHost() }

/**
 * 호스트 메뉴 목록
 *
 * @param conn [Connection]
 * @param usageDto [UsageDto]? 호스트 사용량
 * @return [HostVo]
 */
fun Host.toHostMenu(conn: Connection, usageDto: UsageDto?): HostVo {
    val host = this@toHostMenu
    val dataCenter: DataCenter? = host.cluster().resolveDataCenter(conn)
    val hostedVm = conn.isHostedEngineVm(host.id())
	val statistics: List<Statistic> = conn.findAllStatisticsFromHost(host.id()).getOrDefault(emptyList())

    return HostVo.builder {
        id { host.id() }
        name { host.name() }
        comment { host.comment() }
        status { host.status().toVdsStatus() }
        ksm { host.ksm().enabled() }
        hostedEngine {
			if (host.hostedEnginePresent())
				host.hostedEngine().toHostedEngineVo()
			else
				null
		}
        hostedEngineVM { hostedVm }
        address { host.address() }
		ssh { host.ssh().toSshVo() }
        clusterVo { host.cluster()?.fromClusterToIdentifiedVo() }
        dataCenterVo { dataCenter?.fromDataCenterToIdentifiedVo() }
        vmSizeVo { host.findVmCntFromHost() }
        usageDto { usageDto }
        spmStatus { host.spm().status().toVdsSpmStatus() }
		bootingTime { Date(statistics.findBootTime() * 1000) }
    }
}


/**
 * 호스트 상세정보
 *
 * @param conn [Connection]
 * @param hostConfigurationEntity [HostConfigurationEntity]?
 * @return [HostVo]
 */
fun Host.toHostInfo(conn: Connection, hostConfigurationEntity: HostConfigurationEntity, usageDto: UsageDto?): HostVo {
    val host = this@toHostInfo
    val statistics: List<Statistic> = conn.findAllStatisticsFromHost(this@toHostInfo.id()).getOrDefault(emptyList())
    val cluster: Cluster? = if(host.clusterPresent()) conn.findCluster(host.cluster().id()).getOrNull() else null

    return HostVo.builder {
        id { host.id() }
        name { host.name() }
        comment { host.comment() }
        status { host.status().toVdsStatus() }
        address { host.address() }
        hostedEngine { if (host.hostedEnginePresent()) host.hostedEngine().toHostedEngineVo() else null }
        iscsi { if(host.iscsiPresent()) host.iscsi().initiator() else "" }
        kdump { host.kdumpStatus() }
        ksm { host.ksm().enabled() }
        seLinux { host.seLinux().mode().toSELinuxModeB() }
		ssh { host.ssh().toSshVo() }
        spmPriority { host.spm().priorityAsInteger() }
        vgpu { host.vgpuPlacement().value() }
        transparentPage { host.transparentHugePages().enabled() }
        memoryMax { host.maxSchedulingMemory() }
        memoryTotal { statistics.findMemory("memory.total") }
        memoryUsed { statistics.findMemory("memory.used") }
        memoryFree { statistics.findMemory("memory.free") }
        memoryShared { statistics.findSpeed("memory.shared") } // 문제잇음
        swapTotal { statistics.findSpeed("swap.total") }
        swapFree { statistics.findSpeed("swap.free") }
        swapUsed { statistics.findSpeed("swap.used") }
        hugePage2048Total { statistics.findPage("hugepages.2048.total") }
        hugePage2048Free { statistics.findPage("hugepages.2048.free") }
        hugePage1048576Total { statistics.findPage("hugepages.1048576.total") }
        hugePage1048576Free { statistics.findPage("hugepages.1048576.free") }
        bootingTime { Date(statistics.findBootTime() * 1000) }
        hostHwVo { host.toHostHwVo() }
        hostSwVo { host.toHostSwVo(hostConfigurationEntity) }
		clusterVo { cluster?.fromClusterToIdentifiedVo() }
        vmSizeVo { host.findVmCntFromHost() }
		usageDto { usageDto }
    }
}


/**
 * 네트워크에서 호스트 볼때
 */
fun Host.toNetworkHostMenu(conn: Connection, networkId: String): HostVo {
	val host = this@toNetworkHostMenu
	val filteredNics = host.nics().filter { it.networkPresent() && it.network().id() == networkId }
    return HostVo.builder {
        id { host.id() }
        name { host.name() }
        status { host.status().toVdsStatus() }
        clusterVo { if(host.clusterPresent()) host.cluster().fromClusterToIdentifiedVo() else IdentifiedVo()}
        dataCenterVo { if(host.clusterPresent() && host.cluster().dataCenterPresent()) host.cluster().dataCenter().fromDataCenterToIdentifiedVo() else IdentifiedVo() }
        hostNicVos { filteredNics.toSlaveHostNicVos(conn) }
    }
}
fun List<Host>.toNetworkHostMenus(conn: Connection, networkId: String): List<HostVo> =
    this@toNetworkHostMenus.map { it.toNetworkHostMenu(conn, networkId) }

/**
 * 네트워크에서 호스트 볼때
 */
fun Host.toNetworkDisConnectedHostMenu(): HostVo {
	val host = this@toNetworkDisConnectedHostMenu
    return HostVo.builder {
        id { host.id() }
        name { host.name() }
        status { host.status().toVdsStatus() }
        clusterVo { if(host.clusterPresent()) host.cluster().fromClusterToIdentifiedVo() else IdentifiedVo()}
        dataCenterVo { if(host.clusterPresent() && host.cluster().dataCenterPresent()) host.cluster().dataCenter().fromDataCenterToIdentifiedVo() else IdentifiedVo() }
    }
}
fun List<Host>.toNetworkDisConnectedHostMenus(): List<HostVo> =
    this@toNetworkDisConnectedHostMenus.map { it.toNetworkDisConnectedHostMenu() }

/**
 * 호스트 전체 출력
 */
fun Host.toHostVo(conn: Connection): HostVo {
    val host = this@toHostVo
    val cluster: Cluster? = if(host.clusterPresent()) conn.findCluster(host.cluster().id()).getOrNull() else null
    val dataCenter: DataCenter? = cluster?.dataCenter()?.id()?.let { conn.findDataCenter(it).getOrNull() }
    val hostedVm = conn.isHostedEngineVm(host.id())
    val vms: List<Vm> = conn.findAllVms()
        .getOrDefault(listOf())
        .filter { it.hostPresent() && it.host().id() == this.id() }
    val hostNics: List<HostNic> = conn.findAllHostNicsFromHost(this.id()).getOrDefault(listOf())
    val statistics: List<Statistic> = conn.findAllStatisticsFromHost(host.id()).getOrDefault(listOf())

    return HostVo.builder {
		id { host.id() }
		name { host.name() }
		comment { host.comment() }
		address { host.address() }
		devicePassThrough { host.devicePassthrough().enabled() }
		hostedEngine { if (host.hostedEnginePresent()) host.hostedEngine().toHostedEngineVo() else null }
		iscsi { if(host.iscsiPresent()) host.iscsi().initiator() else "" }
		kdump { host.kdumpStatus() }
		ksm { host.ksm().enabled() }
		seLinux { host.seLinux().mode().toSELinuxModeB() }
		spmPriority { host.spm().priorityAsInteger() }
		spmStatus { host.spm().status().toVdsSpmStatus() }
		ssh { host.ssh().toSshVo() }
		status { host.status().toVdsStatus() }
		transparentPage { host.transparentHugePages().enabled() }
		vmSizeVo { host.findVmCntFromHost() }
		vmMigratingCnt { host.summary().migratingAsInteger() }
		memoryTotal { statistics.findMemory("memory.total") }
		memoryUsed { statistics.findMemory("memory.used") }
		memoryFree { statistics.findMemory("memory.free") }
		memoryMax { host.maxSchedulingMemory() }
		memoryShared { statistics.findSpeed("memory.shared") } // 문제잇음
		swapTotal { statistics.findSpeed("swap.total") }
		swapFree { statistics.findSpeed("swap.free") }
		swapUsed { statistics.findSpeed("swap.used") }
		hugePage2048Total { statistics.findPage("hugepages.2048.total") }
		hugePage2048Free { statistics.findPage("hugepages.2048.free") }
		hugePage1048576Total { statistics.findPage("hugepages.1048576.total") }
		hugePage1048576Free { statistics.findPage("hugepages.1048576.free") }
		bootingTime { Date(statistics.findBootTime()) }
        hostHwVo { host.toHostHwVo() }
//      hostSwVo { host.toHostSwVo() }
		clusterVo { cluster?.fromClusterToIdentifiedVo() }
		dataCenterVo { dataCenter?.fromDataCenterToIdentifiedVo() }
//		hostNicVos { hostNics.fromHostNicsToIdentifiedVos() }
		hostNicVos { hostNics.toHostNicVos(conn) }
		vmVos { vms.toVmVos(conn) }
    }
}
fun List<Host>.toHostVos(conn: Connection): List<HostVo> =
	this@toHostVos.map { it.toHostVo(conn) }


/**
 * [Connection.isHostedEngineVm]
 * 해당 호스트가 hosted_engine 가상머신을 가졌는 지 여부
 *
 * @param hostId [String]
 * @return [Boolean]
 */
fun Connection.isHostedEngineVm(hostId: String): Boolean {
    return this@isHostedEngineVm.findAllVmsFromHost(hostId)
        .getOrDefault(listOf())
        .any { it.isHostedEngineVm }
}
// region: builder
/**
 * [HostVo.toHostBuilder]
 * 호스트 빌더
 *
 * @return [HostBuilder]
 */
fun HostVo.toHostBuilder(): HostBuilder = HostBuilder()
	.name(name)
	.comment(comment)
	.address(address)
	.cluster(ClusterBuilder().id(clusterVo.id))
	.powerManagement(PowerManagementBuilder().enabled(false).build()) // 전원관리 비활성화 (기본)
	.vgpuPlacement(VgpuPlacement.fromValue(vgpu))
//		.spm(SpmBuilder().priority(this@toHostBuilder.spmPriority))
//		.port() // ssh port가 22면 .ssh() 설정하지 않아도 알아서 지정됨. port 변경을 cmd 에서만 하심

/**
 * [HostVo.toAddHost]
 * 호스트 생성 빌더
 */
fun HostVo.toAddHost(): Host = toHostBuilder()
	.ssh(
		SshBuilder()
		.port(ssh?.port)
		.build()
	)
	.rootPassword(ssh?.rootPassword)   // 비밀번호 잘못되면 보여줄 코드?
	.build()

/**
 * 호스트 편집 빌더
 */
fun HostVo.toEditHost(): Host {
	return HostBuilder()
		.id(id)
		.name(name) // 필수값
		.comment(comment) // 필수값
		.cluster(clusterVo.toClusterIdentified()) // 필수값
//    .os(OperatingSystemBuilder().customKernelCmdline("vfio_iommu_type1.allow_unsafe_interrupts=1").build()) //?
		.build()
}

// endregion
