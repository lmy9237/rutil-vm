package com.itinfo.rutilvm.api.model.computing

import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.api.model.*
import com.itinfo.rutilvm.api.model.network.*
import com.itinfo.rutilvm.api.model.storage.*
import com.itinfo.rutilvm.api.ovirtDf
import com.itinfo.rutilvm.api.repository.history.dto.UsageDto
import com.itinfo.rutilvm.api.repository.history.dto.toVmUsage
import com.itinfo.rutilvm.util.ovirt.*
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern
import com.itinfo.rutilvm.util.ovirt.error.toError

import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.builders.*
import org.ovirt.engine.sdk4.types.*
import org.slf4j.LoggerFactory
import java.io.Serializable
import java.math.BigInteger
import java.util.Date

private val log = LoggerFactory.getLogger(VmVo::class.java)

/**
 * [VmVo]
 *
 * @property id [String] 가상머신 Id
 * @property name [String]
 * @property status [String]
 * @property upTime [String]
 * @property creationTime [Date]
 *
 * <statistic>
 * @property memoryInstalled [BigInteger]
 * @property memoryUsed [BigInteger]
 * @property memoryBuffered [BigInteger]
 * @property memoryCached [BigInteger]
 * @property memoryFree [BigInteger]
 * @property memoryUnused [BigInteger]
 *
 * @property fqdn [String]
 * @property ipv4 List<[String]>
 * @property ipv6 List<[String]>
 * @property hostEngineVm [Boolean] 금장/은장 vm().origin() == "managed_hosted_engine"
 * @property placement [String] 호스트에 부착 여부 ( 호스트에 고정, 호스트에서 실행중, 호스트에서 고정 및 실행)
 * @property hostVo [HostVo]  실행 호스트 정보 (현재 실행되고 있는 호스트의 정보)
 * @property snapshotVos List<[IdentifiedVo]>
 * @property nicVos List<[NicVo]>
 *
 *
 * <일반>
 * @property dataCenterVo [IdentifiedVo]	따지고보면 생성창에서 보여주는 역할만 하는거 같음
 * @property clusterVo [IdentifiedVo]
 * @property templateVo [IdentifiedVo]
 *
 * @property description [String] 설명
 * @property comment [String]
 * @property osSystem [String]  // TODO model-OS
 * @property chipsetFirmwareType [String] bios.type
 * @property optimizeOption [String]        최적화 옵션
 * @property stateless [Boolean]			상태 비저장
 * @property startPaused [Boolean]			일시정지 모드에서 시작
 * @property deleteProtected [Boolean]  	삭제 방지
 * @property diskAttachmentVos List<[DiskAttachmentVo]>	인스턴스 이미지 (디스크 연결+생성)  // 전체 출력용 같이
 * @property vnicProfileVos List<[VnicProfileVo]>	vnic 프로파일 (vnic Profile id를 받아서
 * @property diskAttachmentVo [DiskAttachmentVo]  가상머신 디스크 한개만 붙일때
 *
 * <시스템, System>
 * @property memorySize [BigInteger] 		메모리 크기
 * @property memoryMax [BigInteger] 		최대 메모리
 * @property memoryActual [BigInteger]	할당할 실제 메모리
 * @property cpuArc [Architecture] cpu().architecture()
 * @property cpuTopologyCnt [Int]  총 가상 CPU  (게스트 cpu 수, CPU 코어수 (2:1:1) 토폴로지에서 모아서 하기)
 * @property cpuTopologyCore [Int]  가상 소켓
 * @property cpuTopologySocket [Int]  가상 소켓 당 코어
 * @property cpuTopologyThread [Int]  코어당 스레드
// * @property userEmulation [String] 사용자 정의 에뮬레이션 시스템
// * @property userCpu [String] 		사용자 정의 CPU
// * @property userVersion [String] 	사용자 정의 호환 버전
 * @property instanceType [String] 	인스턴스 유형 (none, large, medium, small, tiny, xlarge)
 * @property timeOffset [String] 	하드웨어 클럭의 시간 오프셋 기본값으로 하면됨 greenwich standard time, kst

 * <초기실행, Init>
 * @property cloudInit [Boolean]
 * @property hostName [String] ???
 * @property timeStandard [String]   // ??
 * 인증
 * 네트워크
 * @property script [String] 사용자 지정 스크립트
 *
 * <콘솔>
 * 기본설정 -> 그래픽 프로토콜(vnc)
 * @property monitor [Int]
 * @property usb [Boolean]
 *
 * <호스트>
 * @property hostInCluster [Boolean] 클러스터 내의 호스트 true-클러스터 내 호스트, false-특정
 * @property hostVos List<[HostVo]> 클러스터 내의 호스트 false -> 특정 호스트 선택 (호스트는 여러개 존재한다)
 * @property migrationMode [String] 마이그레이션 모드(placement_policy<affinity>) VmAffinity (MIGRATABLE, USER_MIGRATABLE, PINNED)
 * @property migrationPolicy [String] 마이그레이션 정책  migration_downtime
 * @property migrationEncrypt [InheritableBoolean] 마이그레이션 암호화 사용     FALSE("false"),INHERIT("inherit"), TRUE("true");
 * @property parallelMigration [String] Parallel Migrations
// * @property numOfVmMigrations [String] Number of VM Migration Connections
 *
 * <고가용성>
 * @property ha [Boolean]  					고가용성
 * @property storageDomainVo [IdentifiedVo] 가상 머신 임대 대상 스토리지 도메인
 * @property resumeOperation [String]		재개 동작
 * @property priority [Int]					(true/false는 프론트에서)고가용성 HighAvailability 우선순위 (낮음:1, 중간:50, 높음:100 )
 * @property watchDogModel [String]			워치독 모델 WatchdogModel.I6300ESB
 * @property watchDogAction [WatchdogAction] 워치독 작업
 *
 * <리소스 할당>
 * AutoPinningPolicy(adjust, disabled, existing)
 * CpuPinningPolicy(dedicated, manual(안됨), none, resize_and_pin_numa);
 * CpuShare(비활성화, 비활성화됨(0), 낮음(512), 중간(1024), 높음(2048), 사용자 지정)
 * @property cpuProfileVo [IdentifiedVo] 			CPU 프로파일
 * @property cpuShare [Int] 				CPU 공유
 * @property cpuPinningPolicy [String] 		CPU Pinning Policy
 * // @property cpuPinningTopology [String]	피닝 토폴로지  // ????
 * @property memoryBalloon [Boolean] 		메모리 balloon 활성화
 * @property ioThreadCnt [Int] 				I/O 스레드 활성화
 * @property multiQue [Boolean] 			멀티 큐 사용
 * @property virtSCSIEnable [Boolean] 		VirtIO-SCSI 활성화
 * @property virtIoCnt [String] 			VirtIO-SCSI Multi Queues
 *
 * <부트 옵션>
 * CDROM("cdrom"), HD("hd"), NETWORK("network");
 * @property firstDevice [String]
 * @property secDevice [String]
 * @property deviceList List<[String]>
 * @property connVo [IdentifiedVo] cd/dvd 연결되면 뜰 iso id (사실 디스크 id)
 * @property bootingMenu [Boolean]
 *
 * @property usageDto [UsageDto] cpu, memory, network 사용량
 *
 */
class VmVo (
    val id: String = "",
    val name: String = "",
    val status: VmStatus = VmStatus.UNKNOWN,
    val upTime: String = "",
    val creationTime: String = "",
    val memoryInstalled: BigInteger = BigInteger.ZERO,
    val memoryUsed: BigInteger = BigInteger.ZERO,
    val memoryBuffered: BigInteger = BigInteger.ZERO,
    val memoryCached: BigInteger = BigInteger.ZERO,
    val memoryFree: BigInteger = BigInteger.ZERO,
    val memoryUnused: BigInteger = BigInteger.ZERO,
    val fqdn: String = "",
    val ipv4: List<String> = listOf(),
    val ipv6: List<String> = listOf(),
    val hostEngineVm: Boolean = false,
    val placement: String = "",
    val hostVo: IdentifiedVo = IdentifiedVo(),
    val snapshotVos: List<IdentifiedVo> = listOf(),
    val nicVos: List<NicVo> = listOf(),
    val dataCenterVo: IdentifiedVo = IdentifiedVo(),
    val clusterVo: IdentifiedVo = IdentifiedVo(),
    val templateVo: IdentifiedVo = IdentifiedVo(),
    val description: String = "",
    val comment: String = "",
    val osSystem: String = "",
    val chipsetFirmwareType: String = "",
    val optimizeOption: String = "",
    val stateless: Boolean = false,
    val startPaused: Boolean = false,
    val deleteProtected: Boolean = false,
    val diskAttachmentVos: List<DiskAttachmentVo> = listOf(),
    val vnicProfileVos: List<VnicProfileVo> = listOf(),
    val diskAttachmentVo: DiskAttachmentVo = DiskAttachmentVo(),
    val memorySize: BigInteger = BigInteger.ZERO,
    val memoryMax: BigInteger = BigInteger.ZERO,
    val memoryActual: BigInteger = BigInteger.ZERO,
    val cpuArc: Architecture = Architecture.UNDEFINED,
    val cpuTopologyCnt: Int = 0,
    val cpuTopologyCore: Int = 0,
    val cpuTopologySocket: Int = 0,
    val cpuTopologyThread: Int = 0,
//    val userEmulation: String = "",
//    val userCpu: String = "",
//    val userVersion: String = "",
    val instanceType: String = "",
    val timeOffset: String = "",
    val cloudInit: Boolean = false,
    val hostName: String = "",
    val timeStandard: String = "",
    val script: String = "",
    val monitor: Int = 0,
    val usb: Boolean = false,
    val hostInCluster: Boolean = false,
    val hostVos: List<IdentifiedVo> = listOf(),
    val migrationMode: String = "",
    val migrationPolicy: String = "",
    val migrationEncrypt: InheritableBoolean = InheritableBoolean.INHERIT,
    val parallelMigration: String = "",
    val ha: Boolean = false,
    val storageDomainVo: IdentifiedVo = IdentifiedVo(),
    val resumeOperation: String = "",
    val priority: Int = 0,
    val watchDogModel: String = "",
    val watchDogAction: WatchdogAction = WatchdogAction.NONE,
    val cpuProfileVo: IdentifiedVo = IdentifiedVo(),
    val cpuShare: Int = 0,
    val cpuPinningPolicy: String = "",
    val memoryBalloon: Boolean = false,
    val ioThreadCnt: Int = 0,
    val multiQue: Boolean = false,
    val virtSCSIEnable: Boolean = false,
    val virtIoCnt: String = "",
    val firstDevice: String = "",
    val secDevice: String = "",
    val deviceList: List<String> = listOf(),
    val connVo: IdentifiedVo = IdentifiedVo(),
    val bootingMenu: Boolean = false,
    val usageDto: UsageDto = UsageDto(),
): Serializable {
    override fun toString(): String =
        gson.toJson(this)

    val statusDetail: String
        get() = status.findVmStatus()

    class Builder {
        private var bId: String = ""; fun id(block: () -> String?) { bId = block() ?: ""}
        private var bName: String = ""; fun name(block: () -> String?) { bName = block() ?: ""}
        private var bStatus: VmStatus = VmStatus.UNKNOWN; fun status(block: () -> VmStatus?) { bStatus = block() ?: VmStatus.UNKNOWN }
        private var bUpTime: String = ""; fun upTime(block: () -> String?) { bUpTime = block() ?: "" }
        private var bCreationTime: String = ""; fun creationTime(block: () -> String?) { bCreationTime = block() ?: "" }
        private var bMemoryInstalled: BigInteger = BigInteger.ZERO; fun memoryInstalled(block: () -> BigInteger?) { bMemoryInstalled = block() ?: BigInteger.ZERO }
        private var bMemoryUsed: BigInteger = BigInteger.ZERO; fun memoryUsed(block: () -> BigInteger?) { bMemoryUsed = block() ?: BigInteger.ZERO }
        private var bMemoryBuffered: BigInteger = BigInteger.ZERO; fun memoryBuffered(block: () -> BigInteger?) { bMemoryBuffered = block() ?: BigInteger.ZERO }
        private var bMemoryCached: BigInteger = BigInteger.ZERO; fun memoryCached(block: () -> BigInteger?) { bMemoryCached = block() ?: BigInteger.ZERO }
        private var bMemoryFree: BigInteger = BigInteger.ZERO; fun memoryFree(block: () -> BigInteger?) { bMemoryFree = block() ?: BigInteger.ZERO }
        private var bMemoryUnused: BigInteger = BigInteger.ZERO; fun memoryUnused(block: () -> BigInteger?) { bMemoryUnused = block() ?: BigInteger.ZERO }
        private var bFqdn: String = ""; fun fqdn(block: () -> String?) { bFqdn = block() ?: "" }
        private var bIpv4: List<String> = listOf(); fun ipv4(block: () -> List<String>?) { bIpv4 = block() ?: listOf() }
        private var bIpv6: List<String> = listOf(); fun ipv6(block: () -> List<String>?) { bIpv6 = block() ?: listOf() }
        private var bHostEngineVm: Boolean = false; fun hostEngineVm(block: () -> Boolean?) { bHostEngineVm = block() ?: false }
        private var bPlacement: String = ""; fun placement(block: () -> String?) { bPlacement = block() ?: "" }
        private var bHostVo: IdentifiedVo = IdentifiedVo(); fun hostVo(block: () -> IdentifiedVo?) { bHostVo = block() ?: IdentifiedVo() }
        private var bSnapshotVos: List<IdentifiedVo> = listOf(); fun snapshotVos(block: () -> List<IdentifiedVo>?) { bSnapshotVos = block() ?: listOf() }
        private var bNicVos: List<NicVo> = listOf(); fun nicVos(block: () -> List<NicVo>?) { bNicVos = block() ?: listOf() }
        private var bDataCenterVo: IdentifiedVo = IdentifiedVo(); fun dataCenterVo(block: () -> IdentifiedVo?) { bDataCenterVo = block() ?: IdentifiedVo() }
        private var bClusterVo: IdentifiedVo = IdentifiedVo(); fun clusterVo(block: () -> IdentifiedVo?) { bClusterVo = block() ?: IdentifiedVo() }
        private var bTemplateVo: IdentifiedVo = IdentifiedVo(); fun templateVo(block: () -> IdentifiedVo?) { bTemplateVo = block() ?: IdentifiedVo() }
        private var bDescription: String = ""; fun description(block: () -> String?) { bDescription = block() ?: "" }
        private var bComment: String = ""; fun comment(block: () -> String?) { bComment = block() ?: "" }
        private var bOsSystem: String = ""; fun osSystem(block: () -> String?) { bOsSystem = block() ?: "" }
        private var bChipsetFirmwareType: String = ""; fun chipsetFirmwareType(block: () -> String?) { bChipsetFirmwareType = block() ?: "" }
        private var bOptimizeOption: String = ""; fun optimizeOption(block: () -> String?) { bOptimizeOption = block() ?: "" }
        private var bStateless: Boolean = false; fun stateless(block: () -> Boolean?) { bStateless = block() ?: false }
        private var bStartPaused: Boolean = false; fun startPaused(block: () -> Boolean?) { bStartPaused = block() ?: false }
        private var bDeleteProtected: Boolean = false; fun deleteProtected(block: () -> Boolean?) { bDeleteProtected = block() ?: false }
        private var bDiskAttachmentVos: List<DiskAttachmentVo> = listOf(); fun diskAttachmentVos(block: () -> List<DiskAttachmentVo>?) { bDiskAttachmentVos = block() ?: listOf() }
        private var bVnicProfileVos: List<VnicProfileVo> = listOf(); fun vnicProfileVos(block: () -> List<VnicProfileVo>?) { bVnicProfileVos = block() ?: listOf() }
        private var bDiskAttachmentVo: DiskAttachmentVo = DiskAttachmentVo(); fun diskAttachmentVo(block: () -> DiskAttachmentVo?) { bDiskAttachmentVo = block() ?: DiskAttachmentVo() }
        private var bMemorySize: BigInteger = BigInteger.ZERO; fun memorySize(block: () -> BigInteger?) { bMemorySize = block() ?: BigInteger.ZERO }
        private var bMemoryMax: BigInteger = BigInteger.ZERO; fun memoryMax(block: () -> BigInteger?) { bMemoryMax = block() ?: BigInteger.ZERO }
        private var bMemoryActual: BigInteger = BigInteger.ZERO; fun memoryActual(block: () -> BigInteger?) { bMemoryActual = block() ?: BigInteger.ZERO }
        private var bCpuArc: Architecture = Architecture.UNDEFINED; fun cpuArc(block: () -> Architecture?) { bCpuArc = block() ?: Architecture.UNDEFINED }
        private var bCpuTopologyCnt: Int = 0; fun cpuTopologyCnt(block: () -> Int?) { bCpuTopologyCnt = block() ?: 0 }
        private var bCpuTopologyCore: Int = 0; fun cpuTopologyCore(block: () -> Int?) { bCpuTopologyCore = block() ?: 0 }
        private var bCpuTopologySocket: Int = 0; fun cpuTopologySocket(block: () -> Int?) { bCpuTopologySocket = block() ?: 0 }
        private var bCpuTopologyThread: Int = 0; fun cpuTopologyThread(block: () -> Int?) { bCpuTopologyThread = block() ?: 0 }
//        private var bUserEmulation: String = ""; fun userEmulation(block: () -> String?) { bUserEmulation = block() ?: "" }
//        private var bUserCpu: String = ""; fun userCpu(block: () -> String?) { bUserCpu = block() ?: "" }
//        private var bUserVersion: String = ""; fun userVersion(block: () -> String?) { bUserVersion = block() ?: "" }
        private var bInstanceType: String = ""; fun instanceType(block: () -> String?) { bInstanceType = block() ?: "" }
        private var bTimeOffset: String = ""; fun timeOffset(block: () -> String?) { bTimeOffset = block() ?: "" }
        private var bCloudInit: Boolean = false; fun cloudInit(block: () -> Boolean?) { bCloudInit = block() ?: false }
        private var bHostName: String = ""; fun hostName(block: () -> String?) { bHostName = block() ?: "" }
        private var bTimeStandard: String = ""; fun timeStandard(block: () -> String?) { bTimeStandard = block() ?: "" }
        private var bScript: String = ""; fun script(block: () -> String?) { bScript = block() ?: "" }
        private var bMonitor: Int = 0; fun monitor(block: () -> Int?) { bMonitor = block() ?: 0 }
        private var bUsb: Boolean = false; fun usb(block: () -> Boolean?) { bUsb = block() ?: false }
        private var bHostInCluster: Boolean = false; fun hostInCluster(block: () -> Boolean?) { bHostInCluster = block() ?: false }
        private var bHostVos: List<IdentifiedVo> = listOf(); fun hostVos(block: () -> List<IdentifiedVo>?) { bHostVos = block() ?: listOf() }
        private var bMigrationMode: String = ""; fun migrationMode(block: () -> String?) { bMigrationMode = block() ?: "" }
        private var bMigrationPolicy: String = ""; fun migrationPolicy(block: () -> String?) { bMigrationPolicy = block() ?: "" }
        private var bMigrationEncrypt: InheritableBoolean = InheritableBoolean.INHERIT; fun migrationEncrypt(block: () -> InheritableBoolean?) { bMigrationEncrypt = block() ?: InheritableBoolean.INHERIT }
        private var bParallelMigration: String = ""; fun parallelMigration(block: () -> String?) { bParallelMigration = block() ?: "" }
        private var bHa: Boolean = false; fun ha(block: () -> Boolean?) { bHa = block() ?: false }
        private var bStorageDomainVo: IdentifiedVo = IdentifiedVo(); fun storageDomainVo(block: () -> IdentifiedVo?) { bStorageDomainVo = block() ?: IdentifiedVo() }
        private var bResumeOperation: String = ""; fun resumeOperation(block: () -> String?) { bResumeOperation = block() ?: "" }
        private var bPriority: Int = 0; fun priority(block: () -> Int?) { bPriority = block() ?: 0 }
        private var bWatchDogModel: String = ""; fun watchDogModel(block: () -> String?) { bWatchDogModel = block() ?: "" }
        private var bWatchDogAction: WatchdogAction = WatchdogAction.NONE; fun watchDogAction(block: () -> WatchdogAction?) { bWatchDogAction = block() ?: WatchdogAction.NONE }
        private var bCpuProfileVo: IdentifiedVo = IdentifiedVo(); fun cpuProfileVo(block: () -> IdentifiedVo?) { bCpuProfileVo = block() ?: IdentifiedVo() }
        private var bCpuShare: Int = 0; fun cpuShare(block: () -> Int?) { bCpuShare = block() ?: 0 }
        private var bCpuPinningPolicy: String = ""; fun cpuPinningPolicy(block: () -> String?) { bCpuPinningPolicy = block() ?: "" }
        private var bMemoryBalloon: Boolean = false; fun memoryBalloon(block: () -> Boolean?) { bMemoryBalloon = block() ?: false }
        private var bIoThreadCnt: Int = 0; fun ioThreadCnt(block: () -> Int?) { bIoThreadCnt = block() ?: 0 }
        private var bMultiQue: Boolean = false; fun multiQue(block: () -> Boolean?) { bMultiQue = block() ?: false }
        private var bVirtSCSIEnable: Boolean = false; fun virtSCSIEnable(block: () -> Boolean?) { bVirtSCSIEnable = block() ?: false }
        private var bVirtIoCnt: String = ""; fun virtIoCnt(block: () -> String?) { bVirtIoCnt = block() ?: "" }
        private var bFirstDevice: String = ""; fun firstDevice(block: () -> String?) { bFirstDevice = block() ?: "" }
        private var bSecDevice: String = ""; fun secDevice(block: () -> String?) { bSecDevice = block() ?: "" }
        private var bDeviceList: List<String> = listOf(); fun deviceList(block: () -> List<String>?) { bDeviceList = block() ?: listOf() }
        private var bConnVo: IdentifiedVo = IdentifiedVo(); fun connVo(block: () -> IdentifiedVo?) { bConnVo = block() ?: IdentifiedVo() }
        private var bBootingMenu: Boolean = false; fun bootingMenu(block: () -> Boolean?) { bBootingMenu = block() ?: false }
        private var bUsageDto: UsageDto = UsageDto(); fun usageDto(block: () -> UsageDto?) { bUsageDto = block() ?: UsageDto() }

        fun build(): VmVo = VmVo(bId, bName, bStatus, bUpTime, bCreationTime, bMemoryInstalled, bMemoryUsed, bMemoryBuffered, bMemoryCached, bMemoryFree, bMemoryUnused, bFqdn, bIpv4, bIpv6, bHostEngineVm, bPlacement, bHostVo, bSnapshotVos, bNicVos, bDataCenterVo, bClusterVo, bTemplateVo, bDescription, bComment, bOsSystem, bChipsetFirmwareType, bOptimizeOption, bStateless, bStartPaused, bDeleteProtected, bDiskAttachmentVos, bVnicProfileVos, bDiskAttachmentVo, bMemorySize, bMemoryMax, bMemoryActual, bCpuArc, bCpuTopologyCnt, bCpuTopologyCore, bCpuTopologySocket, bCpuTopologyThread, /*bUserEmulation, bUserCpu, bUserVersion,*/ bInstanceType, bTimeOffset, bCloudInit, bHostName, bTimeStandard, bScript, bMonitor, bUsb, bHostInCluster, bHostVos, bMigrationMode, bMigrationPolicy, bMigrationEncrypt, bParallelMigration, bHa, bStorageDomainVo, bResumeOperation, bPriority, bWatchDogModel, bWatchDogAction, bCpuProfileVo, bCpuShare, bCpuPinningPolicy, bMemoryBalloon, bIoThreadCnt, bMultiQue, bVirtSCSIEnable, bVirtIoCnt, bFirstDevice, bSecDevice, bDeviceList, bConnVo, bBootingMenu, bUsageDto)
    }

    companion object {
        inline fun builder(block: VmVo.Builder.() -> Unit): VmVo = VmVo.Builder().apply(block).build()
    }
}

/**
 * 가상머신 id&name
 */
fun Vm.toVmIdName(): VmVo = VmVo.builder {
    id { this@toVmIdName.id() }
    name { this@toVmIdName.name() }
}
fun List<Vm>.toVmsIdName(): List<VmVo> =
    this@toVmsIdName.map { it.toVmIdName() }

fun Vm.toVmMenu(conn: Connection): VmVo {
    val cluster: Cluster? = conn.findCluster(this@toVmMenu.cluster().id()).getOrNull()
    val dataCenter: DataCenter? = cluster?.dataCenter()?.id()?.let { conn.findDataCenter(it).getOrNull() }

    return VmVo.builder {
        id { this@toVmMenu.id() }
        name { this@toVmMenu.name() }
        comment { this@toVmMenu.comment() }
        creationTime {  ovirtDf.format(this@toVmMenu.creationTime()) }
        status { this@toVmMenu.status() }
        description { this@toVmMenu.description() }
        hostEngineVm { this@toVmMenu.origin() == "managed_hosted_engine" } // 엔진여부

        clusterVo { cluster?.fromClusterToIdentifiedVo() }
        dataCenterVo { dataCenter?.fromDataCenterToIdentifiedVo() }
        if (this@toVmMenu.status() == VmStatus.UP) {
            val statistics: List<Statistic> = conn.findAllStatisticsFromVm(this@toVmMenu.id())
            val nics: List<Nic> = conn.findAllNicsFromVm(this@toVmMenu.id()).getOrDefault(listOf())
            val host: Host? = conn.findHost(this@toVmMenu.host().id()).getOrNull()
            fqdn { this@toVmMenu.fqdn() }
            upTime { statistics.findVmUptime() }
            hostVo { host?.fromHostToIdentifiedVo() }
            ipv4 { nics.findVmIpv4(conn, this@toVmMenu.id()) }
            ipv6 { nics.findVmIpv6(conn, this@toVmMenu.id()) }
            usageDto { statistics.toVmUsage() }
        } else {
            fqdn { null }
            upTime { null }
            hostVo { null }
            ipv4 { null }
            ipv6 { null }
            usageDto { null }
        }
    }
}
fun List<Vm>.toVmsMenu(conn: Connection): List<VmVo> =
    this@toVmsMenu.map { it.toVmMenu(conn) }

/**
 * 가상머신 메뉴
 */
fun Vm.toVmVoInfo(conn: Connection): VmVo {
    val vm = this@toVmVoInfo
    val cluster: Cluster? = conn.findCluster(vm.cluster().id()).getOrNull()
    val dataCenter: DataCenter? = cluster?.dataCenter()?.id()?.let { conn.findDataCenter(it).getOrNull() }
    val nics: List<Nic> = conn.findAllNicsFromVm(vm.id()).getOrDefault(listOf())
    val host: Host? =
        if (vm.hostPresent())
            conn.findHost(vm.host().id()).getOrNull()
        else if (!vm.hostPresent() && vm.placementPolicy().hostsPresent())
            conn.findHost(vm.placementPolicy().hosts().first().id()).getOrNull()
        else
            null
    val template: Template? = conn.findTemplate(vm.template().id()).getOrNull()
    val statistics: List<Statistic> = conn.findAllStatisticsFromVm(vm.id())


    return VmVo.builder {
        id { vm.id() }
        name { vm.name() }
        description { vm.description() }
        osSystem { vm.os().type() } // 편집필요 OsVo.valueOf(vm.os().type()).findOs()
        chipsetFirmwareType { vm.bios().type().toString() }
        priority { vm.highAvailability().priorityAsInteger() }
        optimizeOption { vm.type().toString() }
        memorySize { vm.memory() }
        memoryActual { vm.memoryPolicy().guaranteed() }
        memoryInstalled { statistics.findMemory("memory.installed") }
        memoryUsed { statistics.findMemory("memory.used") }
        memoryBuffered { statistics.findMemory("memory.buffered") }
        memoryCached { statistics.findMemory("memory.cached") }
        memoryFree { statistics.findMemory("memory.free") }
        memoryUnused { statistics.findMemory("memory.unused") }
        cpuTopologyCore { vm.cpu().topology().coresAsInteger() }
        cpuTopologySocket { vm.cpu().topology().socketsAsInteger() }
        cpuTopologyThread { vm.cpu().topology().threadsAsInteger() }
        cpuTopologyCnt {
            vm.cpu().topology().coresAsInteger() *
                    vm.cpu().topology().socketsAsInteger() *
                    vm.cpu().topology().threadsAsInteger()
        }
        stateless { vm.stateless() }
        startPaused { vm.startPaused() }
        deleteProtected { vm.deleteProtected() }
        monitor { vm.display().monitorsAsInteger() }
        usb { vm.usb().enabled() }
        timeOffset { vm.timeZone().name() }
        status { vm.status() }
        hostEngineVm { vm.origin() == "managed_hosted_engine" } // 엔진여부
        upTime { statistics.findVmUptime() }
        ipv4 { nics.findVmIpv4(conn, vm.id()) }
        ipv6 { nics.findVmIpv6(conn, vm.id()) }
        fqdn { vm.fqdn() }
        hostVo { host?.fromHostToIdentifiedVo() }
        clusterVo { cluster?.fromClusterToIdentifiedVo() }
        dataCenterVo { dataCenter?.fromDataCenterToIdentifiedVo() } // 메모리, cpu, 네트워크
        templateVo { template?.fromTemplateToIdentifiedVo() }
        usageDto { statistics.toVmUsage() }
    }
}

fun Vm.toStorageDomainVm(conn: Connection, storageDomainId: String): VmVo {
    val diskAttachments: List<DiskAttachment> = conn.findAllDiskAttachmentsFromVm(this@toStorageDomainVm.id())
        .getOrDefault(listOf())
        .filter { diskAttachment ->
            val disk = conn.findDisk(diskAttachment.disk().id()).getOrNull()
            disk?.storageDomains()?.any { it.id() == storageDomainId } == true
        }

    return VmVo.builder {
        id { this@toStorageDomainVm.id() }
        name { this@toStorageDomainVm.name() }
        status { this@toStorageDomainVm.status() }
        diskAttachmentVos { diskAttachments.toDiskAttachmentVos(conn) }
    }
}
fun List<Vm>.toStorageDomainVms(conn: Connection, storageDomainId: String): List<VmVo> =
    this@toStorageDomainVms.map { it.toStorageDomainVm(conn, storageDomainId) }

fun Vm.toNetworkNic(conn: Connection): VmVo {
    val cluster: Cluster? = conn.findCluster(this@toNetworkNic.cluster().id()).getOrNull()

    return VmVo.builder {
        id { this@toNetworkNic.id() }
        name { this@toNetworkNic.name() }
        description { this@toNetworkNic.description() }
        status { this@toNetworkNic.status() }
        clusterVo { cluster?.fromClusterToIdentifiedVo() }
    }
}


// region: Add VmBuilder

/**
 * 가상머신 빌더
 */
fun VmVo.toVmBuilder(): VmBuilder {
    val vmBuilder = VmBuilder()
    this@toVmBuilder.toVmInfoBuilder(vmBuilder)
    this@toVmBuilder.toVmSystemBuilder(vmBuilder)
    this@toVmBuilder.toVmInitBuilder(vmBuilder)
    this@toVmBuilder.toVmHostBuilder(vmBuilder)
//    this@toVmBuilder.toVmResourceBuilder(vmBuilder)
    this@toVmBuilder.toVmHaBuilder(vmBuilder)
    this@toVmBuilder.toVmBootBuilder(vmBuilder)
    log.info("vmvo: {}", this)
    return vmBuilder
}

/**
 * 가상머신 생성 빌더
 */
fun VmVo.toAddVmBuilder(): Vm =
    this@toAddVmBuilder.toVmBuilder().build()


/**
 * 가상머신 편집 빌더
 */
fun VmVo.toEditVmBuilder(): Vm =
    this@toEditVmBuilder.toVmBuilder().id(this@toEditVmBuilder.id).build()


/**
 * vm 일반정보
 */
fun VmVo.toVmInfoBuilder(vmBuilder: VmBuilder): VmBuilder {
    return vmBuilder
        .cluster(ClusterBuilder().id(this@toVmInfoBuilder.clusterVo.id).build())
        .template(TemplateBuilder().id(this@toVmInfoBuilder.templateVo.id).build()) // template지정된게 있으면
        .bios(BiosBuilder().type(BiosType.fromValue(this@toVmInfoBuilder.chipsetFirmwareType)))
        .type(VmType.fromValue(this@toVmInfoBuilder.optimizeOption))
        .name(this@toVmInfoBuilder.name)
        .description(this@toVmInfoBuilder.description)
        .comment(this@toVmInfoBuilder.comment)
        .stateless(this@toVmInfoBuilder.stateless)
        .startPaused(this@toVmInfoBuilder.startPaused)
        .deleteProtected(this@toVmInfoBuilder.deleteProtected)
}

/**
 * vm 시스템
 */
fun VmVo.toVmSystemBuilder(vmBuilder: VmBuilder): VmBuilder {
//	val convertMb = BigInteger.valueOf(1024).pow(2)
	// 시스템-일반 하드웨어 클럭의 시간 오프셋
	vmBuilder.timeZone(TimeZoneBuilder().name(this@toVmSystemBuilder.timeOffset))

  // 사용자 정의 값
    vmBuilder
        .memory(this@toVmSystemBuilder.memorySize/* * convertMb*/)
        .memoryPolicy(
            MemoryPolicyBuilder()
                .max(this@toVmSystemBuilder.memoryMax)
                .guaranteed(this@toVmSystemBuilder.memoryActual)
//                .ballooning(this@toVmSystemBuilder.memoryBalloon) // 리소스할당- 메모리 balloon 활성화
        )
        .cpu(
            CpuBuilder().topology(
                CpuTopologyBuilder()
                    .cores(this@toVmSystemBuilder.cpuTopologyCore)
                    .sockets(this@toVmSystemBuilder.cpuTopologySocket)
                    .threads(this@toVmSystemBuilder.cpuTopologyThread)
            )
        )

	// 인스턴스 타입이 "none"이 아니라면
//	if (this@toVmSystemBuilder.instanceType != "none") {
//		val instance: InstanceType? = conn.findAllInstanceTypes("name=${this@toVmSystemBuilder.instanceType}").getOrNull()?.first()
//		vmBuilder.instanceType(instance)
//	} else if(this@toVmSystemBuilder.instanceType == "none") {    // 사용자 정의 값
//		vmBuilder
//			.memory(this@toVmSystemBuilder.memorySize * convertMb)
//			.memoryPolicy(
//				MemoryPolicyBuilder()
//					.max(this@toVmSystemBuilder.memoryMax * convertMb)
//					.guaranteed(this@toVmSystemBuilder.memoryActual * convertMb)
//					.ballooning(this@toVmSystemBuilder.memoryBalloon) // 리소스할당- 메모리 balloon 활성화
//			)
//			.cpu(
//				CpuBuilder().topology(
//					CpuTopologyBuilder()
//						.cores(this@toVmSystemBuilder.cpuTopologyCore)
//						.sockets(this@toVmSystemBuilder.cpuTopologySocket)
//						.threads(this@toVmSystemBuilder.cpuTopologyThread)
//				)
//			)
//	}
	return vmBuilder
}

/**
 * vm 초기 실행
 */
fun VmVo.toVmInitBuilder(vmBuilder: VmBuilder): VmBuilder {
	if (this@toVmInitBuilder.cloudInit) {
		vmBuilder.initialization(
			InitializationBuilder()
				.hostName(this@toVmInitBuilder.hostName)
				.timezone(this@toVmInitBuilder.timeStandard) // Asia/Seoul
				.customScript(this@toVmInitBuilder.script)
		)
	}
	return vmBuilder
}

/**
 * vm 호스트
 */
fun VmVo.toVmHostBuilder(vmBuilder: VmBuilder): VmBuilder {
	val placementBuilder = VmPlacementPolicyBuilder()

	// 실행 호스트 - 특정 호스트(무조건 한개는 존재), 기본이 클러스터 내 호스트라 지정 필요없음
	if (!this@toVmHostBuilder.hostInCluster) {
		placementBuilder.hosts(
			// 선택된 호스트 전부 넣기
			this@toVmHostBuilder.hostVos.map { hostVo ->  HostBuilder().id(hostVo.id).build() }
		)
	}
	vmBuilder
		.placementPolicy(placementBuilder.affinity(VmAffinity.fromValue(this@toVmHostBuilder.migrationMode)))
        // 정책은 찾을 수가 없음, parallel Migrations 안보임, 암호화
//		.migration(MigrationOptionsBuilder().encrypted(this@toVmHostBuilder.migrationEncrypt).build()) // 암호화
	return vmBuilder
}

/**
 * vm 리소스 할당
 */
fun VmVo.toVmResourceBuilder(vmBuilder: VmBuilder): VmBuilder {
	return vmBuilder
		.cpuProfile(CpuProfileBuilder().id(this@toVmResourceBuilder.cpuProfileVo.id).build())
		.cpuShares(this@toVmResourceBuilder.cpuShare)
		.autoPinningPolicy(if ("RESIZE_AND_PIN_NUMA" == this@toVmResourceBuilder.cpuPinningPolicy) AutoPinningPolicy.ADJUST else AutoPinningPolicy.DISABLED)
		.cpuPinningPolicy(CpuPinningPolicy.fromValue(this@toVmResourceBuilder.cpuPinningPolicy))
		.virtioScsiMultiQueuesEnabled(this@toVmResourceBuilder.multiQue) // VirtIO-SCSI 활성화
}

/**
 * vm 고가용성
 */
fun VmVo.toVmHaBuilder(vmBuilder: VmBuilder): VmBuilder {
	vmBuilder
		.highAvailability(HighAvailabilityBuilder()
            .enabled(this@toVmHaBuilder.ha)
            .priority(this@toVmHaBuilder.priority)
        )
    if (this@toVmHaBuilder.ha) {
        vmBuilder
            .lease(StorageDomainLeaseBuilder().storageDomain(StorageDomainBuilder().id(this@toVmHaBuilder.storageDomainVo.id)))
    }
	return vmBuilder
}

/**
 * vm 부트 옵션
 */
fun VmVo.toVmBootBuilder(vmBuilder: VmBuilder): VmBuilder {
	val bootDeviceList: MutableList<BootDevice> = mutableListOf(
		BootDevice.fromValue(this@toVmBootBuilder.firstDevice), // 첫번째 장치
	)

	if (this@toVmBootBuilder.secDevice.isNotEmpty())
		bootDeviceList.add(BootDevice.fromValue(this@toVmBootBuilder.secDevice)) // 두번째 장치

	vmBuilder
		.os(
			OperatingSystemBuilder()
				.type(this@toVmBootBuilder.osSystem) // 일반 - 운영시스템 TODO 확인 필요
				.boot(BootBuilder().devices(bootDeviceList))
		)
//		.bios(new BiosBuilder ().type(BiosType.valueOf(vmVo.getChipsetType())))  // 칩셋/펌웨어
//		.bootMenu(new BootMenuBuilder ().enabled(vmVo.getVmBootVo().isBootingMenu()))
	return vmBuilder
}

// endregion


/**
 * [Vm.toVmSystem]
 *
 * @param conn [Connection]
 * @return
 */
fun Vm.toVmSystem(): VmVo {
//	val convertMb = BigInteger.valueOf(1024).pow(2)
	return VmVo.builder {
		memorySize { this@toVmSystem.memory() }
		memoryActual { this@toVmSystem.memoryPolicy().guaranteed() }
		memoryMax { this@toVmSystem.memoryPolicy().max() }
//		memoryActual { this@toVmSystemVo.memoryPolicy().guaranteed().divide(convertMb).toLong() }
//		memoryMax { this@toVmSystemVo.memoryPolicy().max().divide(convertMb).toLong() }
		cpuTopologyCnt {
			this@toVmSystem.cpu().topology().coresAsInteger() *
					this@toVmSystem.cpu().topology().socketsAsInteger() *
					this@toVmSystem.cpu().topology().threadsAsInteger()
		}
		cpuTopologySocket { this@toVmSystem.cpu().topology().socketsAsInteger() }
		cpuTopologyCore { this@toVmSystem.cpu().topology().coresAsInteger() }
		cpuTopologyThread { this@toVmSystem.cpu().topology().threadsAsInteger() }
		timeOffset { this@toVmSystem.timeZone().name() }
	}
}

/**
 * 편집 - 초기실행
 */
fun Vm.toVmInit(): VmVo {
    return VmVo.builder {
        cloudInit { this@toVmInit.initializationPresent() }
        hostName { if (this@toVmInit.initializationPresent()) this@toVmInit.initialization().hostName() else "" }
    }
}
/**
 * 편집 - 호스트
 */
fun Vm.toVmHost(): VmVo {
	return VmVo.builder {
		hostInCluster { !this@toVmHost.placementPolicy().hostsPresent() } // 클러스터내 호스트(t)인지 특정호스트(f)인지
        //TODO
//		hostVos {
//			if (this@toVmHost.placementPolicy().hostsPresent())
//				this@toVmHost.placementPolicy().hosts().map { host ->
//					conn.findHost(host.id()).getOrNull()?.fromHostToIdentifiedVo() ?: HostVo.builder {  }
//				}
//			else listOf()
//		}
		migrationMode { this@toVmHost.placementPolicy().affinity().value() }
		migrationEncrypt { this@toVmHost.migration().encrypted() }
	}
}


/**
 * 편집 - 고가용성
 */
fun Vm.toVmHa(conn: Connection): VmVo {
	return VmVo.builder {
		ha { this@toVmHa.highAvailability().enabled() }
		priority { this@toVmHa.highAvailability().priorityAsInteger() }
		storageDomainVo {
            if (this@toVmHa.leasePresent())
                conn.findStorageDomain(this@toVmHa.lease().storageDomain().id())
                    .getOrNull()?.fromStorageDomainToIdentifiedVo()
            else null
        }
		resumeOperation { this@toVmHa.storageErrorResumeBehaviour().value() } // 워치독?
		watchDogAction { WatchdogAction.NONE }
	}
}

/**
 * 편집 - 리소스 할당
 */
fun Vm.toVmResource(conn: Connection): VmVo {
	return VmVo.builder {
        cpuProfileVo { conn.findCpuProfile(this@toVmResource.cpuProfile().id()).getOrNull()?.fromCpuProfileToIdentifiedVo() }
		cpuShare { this@toVmResource.cpuSharesAsInteger() }
		cpuPinningPolicy { this@toVmResource.cpuPinningPolicy().value() }
		memoryBalloon { this@toVmResource.memoryPolicy().ballooning() }
		ioThreadCnt  { if (this@toVmResource.io().threadsPresent()) this@toVmResource.io().threadsAsInteger() else 0 }
		multiQue { this@toVmResource.multiQueuesEnabled() }
//		virtSCSIEnable { this@toVmResource.virtioScsiMultiQueuesEnabled() } // TODO:HELP virtio-scsi 활성화
		// virtio-scsi multi queues
	}
}

/**
 * 편집 - 부트 옵션
 */
fun Vm.toVmBoot(conn: Connection): VmVo {
	val cdrom: Cdrom? = conn.findAllVmCdromsFromVm(this@toVmBoot.id())
        .getOrDefault(listOf()).firstOrNull()
	val cdromFileId: String = cdrom?.file()?.id() ?: ""
	val disk: Disk? = conn.findDisk(cdromFileId).getOrNull()
	return VmVo.builder {
		firstDevice { this@toVmBoot.os().boot().devices().first().value() }
		secDevice {
			if (this@toVmBoot.os().boot().devices().size > 1)
				this@toVmBoot.os().boot().devices()[1].value()
			else
				null
		}
        connVo { disk?.fromDiskToIdentifiedVo() }
	}
}



fun Vm.toVmVoFromNetwork(conn: Connection): VmVo {
    val cluster: Cluster? = conn.findCluster(this@toVmVoFromNetwork.cluster().id()).getOrNull()
    val vmNic: List<Nic> = conn.findAllNicsFromVm(this@toVmVoFromNetwork.id()).getOrDefault(listOf())

    return VmVo.builder {
        id { this@toVmVoFromNetwork.id() }
        name { this@toVmVoFromNetwork.name() }
        status { this@toVmVoFromNetwork.status() }
        fqdn { this@toVmVoFromNetwork.fqdn() }
        description { this@toVmVoFromNetwork.description() }
        clusterVo { cluster?.fromClusterToIdentifiedVo() }
        nicVos { vmNic.toNetworkFromVms(conn, this@toVmVoFromNetwork.id()) }
    }
}
fun List<Vm>.toVmVoFromNetworks(conn: Connection): List<VmVo> =
    this@toVmVoFromNetworks.map { it.toVmVoFromNetwork(conn) }




/**
 * [List<[Statistic]>.findVmUptime]
 * Vm 업타임 구하기
 * 이건 매개변수로 statisticList 안줘도 되는게 vm에서만 사용
 *
 * @param conn
 * @return 일, 시간, 분 형식
 */
fun List<Statistic>.findVmUptime(): String {
    val time: Long = this@findVmUptime.filter {
        it.name() == "elapsed.time"
    }.map {
        it.values().firstOrNull()?.datum()?.toLong()
    }.firstOrNull() ?: 0L

    val days = time / (60 * 60 * 24)
    val hours = (time % (60 * 60 * 24)) / (60 * 60)
    val minutes = ((time % (60 * 60 * 24)) % (60 * 60)) / 60

    return if (days > 0)    "${days}일"
    else if (hours > 0)     "${hours}시간"
    else if (minutes > 0)   "${minutes}분"
    else                    ""
}


/**
 * [List<[Nic]>.findVmIpv4]
 * Vm ip 알아내기
 * vms/{id}/nic/{id}/statistic
 * @param conn
 * @return
 */
fun List<Nic>.findVmIpv4(conn: Connection, vmId: String): List<String> {
    return this@findVmIpv4.flatMap { nic ->
        val reports: List<ReportedDevice> =
            conn.findAllReportedDeviceFromVmNic(vmId, nic.id())
                .getOrDefault(listOf())
        reports.map { it.ips()[0].address() }
    }.distinct()
}
/**
 * [List<[Nic]>.findVmIpv6]
 * Vm ip 알아내기
 * vms/{id}/nic/{id}/statistic
 * @param conn
 * @return
 */
fun List<Nic>.findVmIpv6(conn: Connection, vmId: String): List<String> {
    return this@findVmIpv6.flatMap { nic ->
        val reports: List<ReportedDevice> =
            conn.findAllReportedDeviceFromVmNic(vmId, nic.id())
                .getOrDefault(listOf())
        reports.map { it.ips()[1].address() }
    }.distinct()
}

/**
 * vm cpuPercent 반환
 */
fun List<Statistic>.findCpuPercent(): Int? {
    val cpuUsageStatistic = this@findCpuPercent.firstOrNull { it.name() == "cpu.usage.history" }
    return cpuUsageStatistic?.values()?.firstOrNull()?.datum()?.toInt()
}

/**
 * vm MemoryPercent 반환
 */
fun List<Statistic>.findMemoryPercent(): Int? {
    val memoryUsageStatistic = this@findMemoryPercent.firstOrNull { it.name() == "memory.usage.history" }
    return memoryUsageStatistic?.values()?.firstOrNull()?.datum()?.toInt()
}

/**
 * vm NetworkPercent
 */
fun List<Statistic>.findNetworkPercent(): Int? {
    val cpuUsageStatistic = this@findNetworkPercent.firstOrNull { it.name() == "network.usage.history" }
    return cpuUsageStatistic?.values()?.firstOrNull()?.datum()?.toInt()
}

/**
 * vm NetworkPercent
 */
fun List<Statistic>.findNetworkListPercent(): List<Int>? {
    val networkUsageStatistic = this@findNetworkListPercent.firstOrNull { it.name() == "network.usage.history" }
    return networkUsageStatistic?.values()?.take(10)?.map { it.datum().toInt() }
}


/**
 * vm 전부 모아둔것...
 */
fun Vm.toVmVo(conn: Connection): VmVo {
    val vm = this@toVmVo
    val cluster: Cluster? = conn.findCluster(vm.cluster().id()).getOrNull()
    val dataCenter: DataCenter? = cluster?.dataCenter()?.id()?.let { conn.findDataCenter(it).getOrNull() }
    val nics: List<Nic> = conn.findAllNicsFromVm(vm.id()).getOrDefault(listOf())
    val host: Host? =
        if (vm.hostPresent())
            conn.findHost(vm.host().id()).getOrNull()
        else if (!vm.hostPresent() && vm.placementPolicy().hostsPresent())
            conn.findHost(vm.placementPolicy().hosts().first().id()).getOrNull()
        else
            null
    val template: Template? = conn.findTemplate(vm.template().id()).getOrNull()
    val statistics: List<Statistic> = conn.findAllStatisticsFromVm(vm.id())
    val cdrom: Cdrom? = conn.findAllVmCdromsFromVm(vm.id()).getOrNull()?.firstOrNull()
    val disk: Disk? = cdrom?.file()?.id()?.let { conn.findDisk(it).getOrNull() }
    val diskAttachments: List<DiskAttachment> = conn.findAllDiskAttachmentsFromVm(vm.id()).getOrDefault(listOf())

    return VmVo.builder {
        id { vm.id() }
        name { vm.name() }
        status { vm.status() }
        upTime { statistics.findVmUptime() }
        creationTime { ovirtDf.format(vm.creationTime()) }
        memoryInstalled { statistics.findMemory("memory.installed") }
        memoryUsed { statistics.findMemory("memory.used") }
        memoryBuffered { statistics.findMemory("memory.buffered") }
        memoryCached { statistics.findMemory("memory.cached") }
        memoryFree { statistics.findMemory("memory.free") }
        memoryUnused { statistics.findMemory("memory.unused") }
        fqdn { vm.fqdn() }
        ipv4 { nics.findVmIpv4(conn, vm.id()) }
        ipv6 { nics.findVmIpv6(conn, vm.id()) }
        hostEngineVm { vm.origin() == "managed_hosted_engine" } // 엔진여부
//        placement { vm. }
        hostVo { host?.fromHostToIdentifiedVo() }
//        snapshotVos { vm. }
        nicVos { nics.toVmNics(conn, vm.id()) }
        diskAttachmentVos { diskAttachments.toDiskAttachmentVos(conn) }
        dataCenterVo { dataCenter?.fromDataCenterToIdentifiedVo() }
        clusterVo { cluster?.fromClusterToIdentifiedVo() }
        templateVo { template?.fromTemplateToIdentifiedVo() }
        description { vm.description() }
        comment { vm.comment() }
        osSystem { vm.os().type() }
        chipsetFirmwareType { vm.bios().type().toString() }
        optimizeOption { vm.type().toString() } //
        stateless { vm.stateless() }
        startPaused { vm.startPaused() }
        deleteProtected { vm.deleteProtected() }
        vnicProfileVos { vm.nics().toVnicProfileVosFromNic(conn) }
        memorySize { vm.memory() }
        memoryMax { vm.memoryPolicy().max() }
        memoryActual { vm.memoryPolicy().guaranteed() }
        cpuArc { vm.cpu().architecture() }
        cpuTopologyCnt {
            vm.cpu().topology().coresAsInteger() *
                    vm.cpu().topology().socketsAsInteger() *
                    vm.cpu().topology().threadsAsInteger()
        }
        cpuTopologyCore { vm.cpu().topology().coresAsInteger() }
        cpuTopologySocket { vm.cpu().topology().socketsAsInteger() }
        cpuTopologyThread { vm.cpu().topology().threadsAsInteger() }
//        userEmulation { vm. }
//        userCpu { vm. }
//        userVersion { vm. }
//        instanceType { vm. }
        timeOffset { vm.timeZone().name() }
        cloudInit { vm.initializationPresent() }
        hostName { if (vm.initializationPresent()) vm.initialization().hostName() else "" }
//        timeStandard { vm. }
        script { if (vm.initializationPresent()) vm.initialization().customScript() else "" }
        monitor { vm.display().monitorsAsInteger() }
        usb { vm.usb().enabled() }
        hostInCluster { !vm.placementPolicy().hostsPresent() }
//        hostVos {
//            if (vm.placementPolicy().hostsPresent()){
//                vm.placementPolicy().hosts().map { host ->
//                    conn.findHost(host.id()).getOrNull()?.toHostIdName()
//                }
//            }
//            else listOf()
//        }
        migrationMode { vm.placementPolicy().affinity().value() }
//        migrationPolicy { vm. }
        migrationEncrypt { vm.migration().encrypted() }
//        parallelMigration { vm. }
        ha { vm.highAvailability().enabled() }
        storageDomainVo { if (vm.leasePresent()) conn.findStorageDomain(vm.lease().storageDomain().id()).getOrNull()?.fromStorageDomainToIdentifiedVo() else null }
        resumeOperation { vm.storageErrorResumeBehaviour().value() }
        priority { vm.highAvailability().priorityAsInteger() }
//        watchDogModel { WatchdogAction.NONE }
        watchDogAction { WatchdogAction.NONE }
        cpuProfileVo { conn.findCpuProfile(vm.cpuProfile().id()).getOrNull()?.fromCpuProfileToIdentifiedVo() }
        cpuShare { vm.cpuSharesAsInteger() }
        cpuPinningPolicy { vm.cpuPinningPolicy().value() }
        memoryBalloon { vm.memoryPolicy().ballooning() }
        ioThreadCnt  { if (vm.io().threadsPresent()) vm.io().threadsAsInteger() else 0 }
        multiQue { vm.multiQueuesEnabled() }
//        virtIoCnt { vm. }
        firstDevice { vm.os().boot().devices().first().value() }
        secDevice {
            if (vm.os().boot().devices().size > 1)
                vm.os().boot().devices()[1].value()
            else
                null
        }
//        deviceList { vm. }
        connVo { disk?.fromDiskToIdentifiedVo() } //?
//        bootingMenu { vm. }
    }
}
fun List<Vm>.toVmVos(conn: Connection/*, graph: ItGraphService*/): List<VmVo> =
    this@toVmVos.map { it.toVmVo(conn/*, graph*/) }

