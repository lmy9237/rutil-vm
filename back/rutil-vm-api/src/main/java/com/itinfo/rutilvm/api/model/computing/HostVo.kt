package com.itinfo.rutilvm.api.model.computing

import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.api.ovirtDf
import com.itinfo.rutilvm.api.model.*
import com.itinfo.rutilvm.api.model.network.HostNicVo
import com.itinfo.rutilvm.api.model.network.toHostNicVos
import com.itinfo.rutilvm.api.model.network.toSlaveHostNicVos
import com.itinfo.rutilvm.api.repository.history.dto.UsageDto
import com.itinfo.rutilvm.api.repository.history.entity.HostConfigurationEntity
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
 * @property seLinux [SeLinuxMode] SeLinuxMode(disabled, enforcing, permissive)
 * @property hostedEngine [Boolean] Hosted Engine 이동 여부 [ 금장, 은장, null ]
 * @property hostedEngineVM [Boolean] Hosted Engine VM 여부 [ 금장, 은장, null ]
 * @property spmPriority [Int] spm 우선순위
 * @property spmStatus [SpmStatus] spm 상태
 * @property sshFingerPrint [String] ssh
 * @property sshPort [Int]
 * @property sshPublicKey[String]
 * @property sshName [String] 사용자 이름 (생성시 표시)
 * @property sshPassWord [String] 암호 (생성시)
 * @property status [HostStatus]
 * @property transparentPage [Boolean] 자동으로 페이지를 크게
 * @property vmTotalCnt [Int] summary
 * @property vmActiveCnt [Int] summary
 * @property vmSizeVo [SizeVo]
 * @property vmMigratingCnt [Int] summary
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
 * @property vmVos List<[VmVo]>
 * @property usageDto [UsageDto]
 */
class HostVo (
    val id: String = "",
    val name: String = "",
    val comment: String = "",
    val address: String = "",
    val devicePassThrough: Boolean = false,
    val hostedActive: Boolean = false,
    val hostedScore: Int = 0,
    val iscsi: String = "",
    val kdump: KdumpStatus = KdumpStatus.UNKNOWN,
    val ksm: Boolean = false,
    val seLinux: SeLinuxMode = SeLinuxMode.DISABLED,
    val hostedEngine: Boolean = false,
    val hostedEngineVM: Boolean = false,
    val spmPriority: Int = 0,
    val spmStatus: SpmStatus = SpmStatus.NONE,
    val sshFingerPrint: String = "",
    val sshPort: Int = 0,
    val sshPublicKey: String = "",
    val sshName: String = "",
    val sshPassWord: String = "",
    val status: HostStatus = HostStatus.NON_RESPONSIVE,
    val transparentPage: Boolean = false,
    val vmSizeVo: SizeVo = SizeVo(),
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
    val bootingTime: String = "",
    val hostHwVo: HostHwVo = HostHwVo(),
    val hostSwVo: HostSwVo = HostSwVo(),
    val clusterVo: IdentifiedVo = IdentifiedVo(),
    val dataCenterVo: IdentifiedVo = IdentifiedVo(),
    val hostNicVos: List<HostNicVo> = listOf(),
    val vmVos: List<IdentifiedVo> = listOf(),
    val usageDto: UsageDto = UsageDto(),

): Serializable{
    override fun toString(): String = gson.toJson(this)

    class Builder{
        private var bId: String = ""; fun id(block: () -> String?) { bId = block() ?: ""}
        private var bName: String = ""; fun name(block: () -> String?) { bName = block() ?: ""}
        private var bComment: String = ""; fun comment(block: () -> String?) { bComment = block() ?: ""}
        private var bAddress: String = ""; fun address(block: () -> String?) { bAddress = block() ?: ""}
        private var bDevicePassThrough: Boolean = false; fun devicePassThrough(block: () -> Boolean?) { bDevicePassThrough = block() ?: false}
        private var bHostedActive: Boolean = false; fun hostedActive(block: () -> Boolean?) { bHostedActive = block() ?: false }
        private var bHostedScore: Int = 0; fun hostedScore(block: () -> Int?) { bHostedScore = block() ?: 0 }
        private var bIscsi: String = ""; fun iscsi (block: () -> String?) { bIscsi = block() ?: ""}
        private var bKdump: KdumpStatus = KdumpStatus.UNKNOWN; fun kdump (block: () -> KdumpStatus?) { bKdump = block() ?: KdumpStatus.UNKNOWN}
        private var bKsm: Boolean = false; fun ksm(block: () -> Boolean?) { bKsm = block() ?: false }
        private var bSeLinux: SeLinuxMode = SeLinuxMode.DISABLED; fun seLinux(block: () -> SeLinuxMode?) { bSeLinux = block() ?: SeLinuxMode.DISABLED }
        private var bHostedEngine: Boolean = false; fun hostedEngine(block: () -> Boolean?) { bHostedEngine = block() ?: false }
        private var bHostedEngineVM: Boolean = false; fun hostedEngineVM(block: () -> Boolean?) { bHostedEngineVM = block() ?: false }
        private var bSpmPriority: Int = 0; fun spmPriority(block: () -> Int?) { bSpmPriority = block() ?: 0 }
        private var bSpmStatus: SpmStatus = SpmStatus.NONE; fun spmStatus(block: () -> SpmStatus?) { bSpmStatus = block() ?: SpmStatus.NONE }
        private var bSshFingerPrint: String = ""; fun sshFingerPrint(block: () -> String?) { bSshFingerPrint = block() ?: "" }
        private var bSshPort: Int = 0; fun sshPort(block: () -> Int?) { bSshPort = block() ?: 0 }
        private var bSshPublicKey: String = ""; fun sshPublicKey(block: () -> String?) { bSshPublicKey = block() ?: "" }
        private var bSshName: String = ""; fun sshName(block: () -> String?) { bSshName = block() ?: "" }
        private var bSshPassWord: String = ""; fun sshPassWord(block: () -> String?) { bSshPassWord = block() ?: "" }
        private var bStatus: HostStatus = HostStatus.NON_RESPONSIVE; fun status(block: () -> HostStatus?) { bStatus = block() ?: HostStatus.NON_RESPONSIVE }
        private var bTransparentPage: Boolean = false; fun transparentPage(block: () -> Boolean?) { bTransparentPage = block() ?: false }
//        private var bVmTotalCnt: Int = 0; fun vmTotalCnt(block: () -> Int?) { bVmTotalCnt = block() ?: 0 }
//        private var bVmActiveCnt: Int = 0; fun vmActiveCnt(block: () -> Int?) { bVmActiveCnt = block() ?: 0 }
        private var bVmSizeVo: SizeVo = SizeVo(); fun vmSizeVo(block: () -> SizeVo?) { bVmSizeVo = block() ?: SizeVo() }
        private var bVmMigratingCnt: Int = 0; fun vmMigratingCnt(block: () -> Int?) { bVmMigratingCnt = block() ?: 0 }
        private var bVgpu: String = ""; fun vgpu(block: () -> String?) { bVgpu = block() ?: "" }
        private var bMemoryTotal: BigInteger = BigInteger.ZERO; fun memoryTotal (block: () -> BigInteger?) { bMemoryTotal = block() ?: BigInteger.ZERO}
        private var bMemoryUsed: BigInteger = BigInteger.ZERO; fun memoryUsed (block: () -> BigInteger?) { bMemoryUsed = block() ?: BigInteger.ZERO}
        private var bMemoryFree: BigInteger = BigInteger.ZERO; fun memoryFree (block: () -> BigInteger?) { bMemoryFree = block() ?: BigInteger.ZERO}
        private var bMemoryMax: BigInteger = BigInteger.ZERO; fun memoryMax (block: () -> BigInteger?) { bMemoryMax = block() ?: BigInteger.ZERO}
        private var bMemoryShared: BigInteger = BigInteger.ZERO; fun memoryShared (block: () -> BigInteger?) { bMemoryShared = block() ?: BigInteger.ZERO}
        private var bSwapTotal: BigInteger = BigInteger.ZERO; fun swapTotal (block: () -> BigInteger?) { bSwapTotal = block() ?: BigInteger.ZERO}
        private var bSwapUsed: BigInteger = BigInteger.ZERO; fun swapUsed (block: () -> BigInteger?) { bSwapUsed = block() ?: BigInteger.ZERO}
        private var bSwapFree: BigInteger = BigInteger.ZERO; fun swapFree (block: () -> BigInteger?) { bSwapFree = block() ?: BigInteger.ZERO}
        private var bHugePage2048Free: Int = 0; fun hugePage2048Free(block: () -> Int?) { bHugePage2048Free = block() ?: 0}
        private var bHugePage2048Total: Int = 0; fun hugePage2048Total(block: () -> Int?) { bHugePage2048Total = block() ?: 0}
        private var bHugePage1048576Free: Int = 0; fun hugePage1048576Free(block: () -> Int?) { bHugePage1048576Free = block() ?: 0}
        private var bHugePage1048576Total: Int = 0; fun hugePage1048576Total(block: () -> Int?) { bHugePage1048576Total = block() ?: 0}
        private var bBootingTime: String = ""; fun bootingTime (block: () -> String?) { bBootingTime = block() ?: ""}
        private var bHostHwVo: HostHwVo = HostHwVo(); fun hostHwVo(block: () -> HostHwVo?) { bHostHwVo = block() ?: HostHwVo() }
        private var bHostSwVo: HostSwVo = HostSwVo(); fun hostSwVo(block: () -> HostSwVo?) { bHostSwVo = block() ?: HostSwVo()}
        private var bClusterVo: IdentifiedVo = IdentifiedVo(); fun clusterVo(block: () -> IdentifiedVo?) { bClusterVo = block() ?: IdentifiedVo() }
        private var bDataCenterVo: IdentifiedVo = IdentifiedVo(); fun dataCenterVo(block: () -> IdentifiedVo?) { bDataCenterVo = block() ?: IdentifiedVo() }
        private var bHostNicVos: List<HostNicVo> = listOf(); fun hostNicVos(block: () -> List<HostNicVo>?) { bHostNicVos = block() ?: listOf() }
        private var bVmVos: List<IdentifiedVo> = listOf(); fun vmVos(block: () -> List<IdentifiedVo>?) { bVmVos = block() ?: listOf() }
        private var bUsageDto: UsageDto = UsageDto(); fun usageDto(block: () -> UsageDto?) { bUsageDto = block() ?: UsageDto() }

        fun build(): HostVo = HostVo(bId, bName, bComment, bAddress, bDevicePassThrough, bHostedActive, bHostedScore, bIscsi, bKdump, bKsm, bSeLinux, bHostedEngine, bHostedEngineVM, bSpmPriority, bSpmStatus, bSshFingerPrint, bSshPort, bSshPublicKey, bSshName, bSshPassWord, bStatus, bTransparentPage, /*bVmTotalCnt, bVmActiveCnt,*/ bVmSizeVo, bVmMigratingCnt, bVgpu, bMemoryTotal, bMemoryUsed, bMemoryFree, bMemoryMax, bMemoryShared, bSwapTotal, bSwapUsed, bSwapFree, bHugePage2048Free, bHugePage2048Total, bHugePage1048576Free, bHugePage1048576Total, bBootingTime, bHostHwVo, bHostSwVo, bClusterVo, bDataCenterVo, bHostNicVos, bVmVos, bUsageDto)
    }
    companion object {
        inline fun builder(block: HostVo.Builder.() -> Unit): HostVo = HostVo.Builder().apply(block).build()
    }
}

/**
 * 호스트 id&name
 */
fun Host.toHostIdName(): HostVo = HostVo.builder {
    id { this@toHostIdName.id() }
    name { this@toHostIdName.name() }
}
fun List<Host>.toHostsIdName(): List<HostVo> =
    this@toHostsIdName.map { it.toHostIdName() }

/**
 * 호스트 메뉴 목록
 *
 * @param conn [Connection]
 * @param usageDto [UsageDto]? 호스트 사용량
 * @return [HostVo]
 */
fun Host.toHostMenu(conn: Connection, usageDto: UsageDto?): HostVo {
    val host = this@toHostMenu
    val cluster: Cluster? = if(host.clusterPresent()) conn.findCluster(host.cluster().id()).getOrNull() else null
    val dataCenter: DataCenter? = cluster?.dataCenter()?.id()?.let { conn.findDataCenter(it).getOrNull() }
    val hostedVm = conn.isHostedEngineVm(host.id())

    return HostVo.builder {
        id { host.id() }
        name { host.name() }
        comment { host.comment() }
        status { host.status() }
        ksm { host.ksm().enabled() }
        hostedEngine { host.hostedEnginePresent() }
        hostedEngineVM { hostedVm }
        address { host.address() }
        clusterVo { cluster?.fromClusterToIdentifiedVo() }
        dataCenterVo { dataCenter?.fromDataCenterToIdentifiedVo() }
        vmSizeVo { host.findVmCntFromHost() }
        usageDto { usageDto }
        spmStatus { host.spm().status() }
    }
}

/**
 * 호스트 상세정보
 *
 * @param conn [Connection]
 * @param hostConfigurationEntity [HostConfigurationEntity]? 호스트 사용량
 * @return [HostVo]
 */
fun Host.toHostInfo(conn: Connection, hostConfigurationEntity: HostConfigurationEntity): HostVo {
    val host = this@toHostInfo
    val statistics: List<Statistic> = conn.findAllStatisticsFromHost(this@toHostInfo.id()).getOrDefault(listOf())
    val cluster: Cluster? = if(host.clusterPresent()) conn.findCluster(host.cluster().id()).getOrNull() else null

    return HostVo.builder {
        id { host.id() }
        name { host.name() }
        comment { host.comment() }
        status { host.status() }
        clusterVo { cluster?.fromClusterToIdentifiedVo() }
        address { host.address() }
        hostedEngine { host.hostedEnginePresent() }
        hostedActive { if(host.hostedEnginePresent()) host.hostedEngine().active() else false }
        hostedScore { if(host.hostedEnginePresent()) host.hostedEngine().scoreAsInteger() else 0 }
        iscsi { if(host.iscsiPresent()) host.iscsi().initiator() else "" }
        kdump { host.kdumpStatus() }
        ksm { host.ksm().enabled() }
        seLinux { host.seLinux().mode() }
        sshPort { host.ssh().portAsInteger() }
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
        bootingTime { ovirtDf.format(Date(statistics.findBootTime()* 1000)) }
        hostHwVo { host.toHostHwVo() }
        hostSwVo { host.toHostSwVo(hostConfigurationEntity) }
        vmSizeVo { host.findVmCntFromHost() }
    }
}


/**
 * 네트워크에서 호스트 볼때
 */
fun Host.toNetworkHostVo(conn: Connection): HostVo {
    val cluster: Cluster? = conn.findCluster(this@toNetworkHostVo.cluster().id()).getOrNull()
    val dataCenter: DataCenter? = cluster?.dataCenter()?.id()?.let { conn.findDataCenter(it).getOrNull() }
    val hostNics: List<HostNic> = conn.findAllHostNicsFromHost(this@toNetworkHostVo.id()).getOrDefault(listOf())

    return HostVo.builder {
        id { this@toNetworkHostVo.id() }
        name { this@toNetworkHostVo.name() }
        status { this@toNetworkHostVo.status() }
        clusterVo { cluster?.fromClusterToIdentifiedVo() }
        dataCenterVo { dataCenter?.fromDataCenterToIdentifiedVo() }
        hostNicVos { hostNics.toSlaveHostNicVos(conn) }
    }
}
fun List<Host>.toNetworkHostVos(conn: Connection): List<HostVo> =
    this@toNetworkHostVos.map { it.toNetworkHostVo(conn) }



/**
 * 호스트 빌더
 */
fun HostVo.toHostBuilder(): HostBuilder {
    return HostBuilder()
        .cluster(ClusterBuilder().id(this@toHostBuilder.clusterVo.id))
        .name(this@toHostBuilder.name)
        .comment(this@toHostBuilder.comment)
        .address(this@toHostBuilder.address)
        .ssh(SshBuilder().port(this@toHostBuilder.sshPort).build()) // 기본값이 22 포트 연결은 더 테스트 해봐야함(ovirt 내에서 한적은 없음)
        .rootPassword(this@toHostBuilder.sshPassWord)   // 비밀번호 잘못되면 보여줄 코드?
        .powerManagement(PowerManagementBuilder().enabled(false).build()) // 전원관리 비활성화 (기본)
//        .spm(SpmBuilder().priority(this@toHostBuilder.spmPriority))
        .vgpuPlacement(VgpuPlacement.fromValue(this@toHostBuilder.vgpu))
//        .port()
        // ssh port가 22면 .ssh() 설정하지 않아도 알아서 지정됨. port 변경을 cmd 에서만 하심
    // deployHostedEngine은 ext에서
}

/**
 * 호스트 생성 빌더
 */
fun HostVo.toAddHostBuilder(): Host =
    this@toAddHostBuilder.toHostBuilder().build()

/**
 * 호스트 편집 빌더
 */
fun HostVo.toEditHostBuilder(): Host = this@toEditHostBuilder.toHostBuilder()
    .id(this@toEditHostBuilder.id)
//    .os(OperatingSystemBuilder().customKernelCmdline("vfio_iommu_type1.allow_unsafe_interrupts=1").build()) //?
    .build()


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
        .filter { it.hostPresent() && it.host().id() == this@toHostVo.id() }
    val hostNics: List<HostNic> = conn.findAllHostNicsFromHost(this@toHostVo.id()).getOrDefault(listOf())
    val statistics: List<Statistic> = conn.findAllStatisticsFromHost(host.id()).getOrDefault(listOf())

    return HostVo.builder {
        id { host.id() }
        name { host.name() }
        comment { host.comment() }
        address { host.address() }
        devicePassThrough { host.devicePassthrough().enabled() }
        hostedEngine { host.hostedEnginePresent() }
        hostedActive { if(host.hostedEnginePresent()) host.hostedEngine().active() else false }
        hostedScore { if(host.hostedEnginePresent()) host.hostedEngine().scoreAsInteger() else 0 }
        iscsi { if(host.iscsiPresent()) host.iscsi().initiator() else "" }
        kdump { host.kdumpStatus() }
        ksm { host.ksm().enabled() }
        seLinux { host.seLinux().mode() }
        spmPriority { host.spm().priorityAsInteger() }
        spmStatus { host.spm().status() }
        sshFingerPrint { host.ssh().fingerprint() }
        sshPort { host.ssh().portAsInteger() }
        sshPublicKey { host.ssh().publicKey() }
        status { host.status() }
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
        bootingTime { ovirtDf.format(Date(statistics.findBootTime())) }
        hostHwVo { host.toHostHwVo() }
//        hostSwVo { host.toHostSwVo() }
        clusterVo { cluster?.fromClusterToIdentifiedVo() }
        dataCenterVo { dataCenter?.fromDataCenterToIdentifiedVo() }
//        hostNicVos { hostNics.fromHostNicsToIdentifiedVos() }
        hostNicVos { hostNics.toHostNicVos(conn) }
        vmVos { vms.fromVmsToIdentifiedVos() }
    }
}
fun List<Host>.toHostVos(conn: Connection): List<HostVo> =
    this@toHostVos.map { it.toHostVo(conn) }



/**
 * 해당 호스트가 hosted_engine 가상머신을 가졌는 지 여부
 * @param hostId [String]
 * @return [Boolean]
 */
fun Connection.isHostedEngineVm(hostId: String): Boolean {
    return this@isHostedEngineVm.findAllVmsFromHost(hostId)
        .getOrDefault(listOf())
        .any { it.origin() == "managed_hosted_engine" }
}
