package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.api.ovirt.business.ArchitectureType
import com.itinfo.rutilvm.api.ovirt.business.BiosTypeB
import com.itinfo.rutilvm.api.ovirt.business.CpuPinningPolicyB
import com.itinfo.rutilvm.api.ovirt.business.GraphicsTypeB
import com.itinfo.rutilvm.api.ovirt.business.MigrationSupport
import com.itinfo.rutilvm.api.ovirt.business.OriginType
import com.itinfo.rutilvm.api.ovirt.business.TemplateStatusB
import com.itinfo.rutilvm.api.ovirt.business.UsbPolicy
import com.itinfo.rutilvm.api.ovirt.business.VmOsType
import com.itinfo.rutilvm.api.ovirt.business.VmResumeBehavior
import com.itinfo.rutilvm.api.ovirt.business.VmStatusB
import com.itinfo.rutilvm.api.ovirt.business.VmTypeB
import com.itinfo.rutilvm.common.gson
import org.hibernate.annotations.Immutable
import org.hibernate.annotations.Type
import java.time.LocalDateTime
import java.util.UUID
import java.io.Serializable
import java.math.BigInteger
import javax.persistence.Id
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.Table
import kotlin.math.pow

/**
 *
 * [VmTemplateEntity]
 * oVirt 4.5.5의 `vm_templates_view` 뷰에 대한 엔티티
 *
 * @property vmtGuid [UUID] VM 템플릿 GUID (기본 키)
 * @property name [String] 템플릿 이름
 * @property memSizeMb [Int] 메모리 크기 (MB)
 * @property maxMemorySizeMb [Int] 최대 메모리 크기 (MB)
 * @property numOfIoThreads [Int] I/O 스레드 수
 * @property dwhOsInfo [DwhOsinfoEntity] 운영체제 정보
 * @property creationDate [LocalDateTime] 생성일
 * @property childCount [Int] 하위 개체 수
 * @property numOfSockets [Int] 소켓 수
 * @property cpuPerSocket [Int] 소켓당 CPU 수
 * @property threadsPerCpu [Int] CPU당 스레드 수
 * @property numOfCpus [Int] 총 CPU 수
 * @property description [String] 설명
 * @property freeTextComment [String] 자유 텍스트 코멘트
 * @property clusterId [UUID] 클러스터 ID
 * @property numOfMonitors [Int] 모니터 수
 * @property allowConsoleReconnect [Boolean] 콘솔 재연결 허용 여부
 * @property status [Int] 템플릿 상태
 * @property _usbPolicy [Int] USB 정책
 * @property timeZone [String] 시간대
 * @property clusterName [String] 클러스터 이름
 * @property clusterCompatibilityVersion [String] 클러스터 호환성 버전
 * @property trustedService [Boolean] 신뢰할 수 있는 서비스 여부
 * @property clusterBiosType [Int] 클러스터 BIOS 타입
 * @property _vmType [Int] 가상머신 유형
 * @property niceLevel [Int] Nice 레벨
 * @property cpuShares [Int] CPU 점유율
 * @property storagePoolId [UUID] 스토리지 풀 ID
 * @property storagePoolName [String] 스토리지 풀 이름
 * @property quotaEnforcementType [Int] 할당량 적용 타입
 * @property defaultBootSequence [Int] 기본 부트 시퀀스
 * @property _defaultDisplayType [Int] 기본 디스플레이 타입
 * @property priority [Int] 우선순위
 * @property autoStartup [Boolean] 자동 시작 여부
 * @property leaseSdId [UUID] 리스 스토리지 도메인 ID
 * @property isStateless [Boolean] 스테이트리스 여부
 * @property isSmartcardEnabled [Boolean] 스마트카드 활성화 여부
 * @property isDeleteProtected [Boolean] 삭제 방지 여부
 * @property ssoMethod [String] SSO 메소드
 * @property isoPath [String] ISO 경로
 * @property origin [Int] 출처
 * @property initrdUrl [String] Initrd URL
 * @property kernelUrl [String] 커널 URL
 * @property kernelParams [String] 커널 파라미터
 * @property quotaId [UUID] 할당량 ID
 * @property quotaName [String] 할당량 이름
 * @property dbGeneration [BigInteger] DB 생성 번호
 * @property hostCpuFlags [Boolean] 호스트 CPU 플래그 사용 여부
 * @property _migrationSupport [Int] 마이그레이션 지원
 * @property dedicatedVmForVds [UUID] 전용 VDS를 위한 VM ID
 * @property isDisabled [Boolean] 비활성화 여부
 * @property tunnelMigration [Boolean] 터널 마이그레이션 여부
 * @property vncKeyboardLayout [String] VNC 키보드 레이아웃
 * @property minAllocatedMem [Int] 최소 할당 메모리 (MB)
 * @property isRunAndPause [Boolean] 실행 및 일시 중지 가능 여부
 * @property createdByUserId [UUID] 생성 사용자 ID
 * @property entityType [String] 엔티티 타입
 * @property migrationDowntime [Int] 마이그레이션 다운타임 (밀리초)
 * @property _architecture [Int] 아키텍처
 * @property templateVersionNumber [Int] 템플릿 버전 번호
 * @property baseTemplateId [UUID] 기본 템플릿 ID
 * @property templateVersionName [String] 템플릿 버전 이름
 * @property serialNumberPolicy [Int] 시리얼 넘버 정책
 * @property customSerialNumber [String] 사용자 정의 시리얼 넘버
 * @property isBootMenuEnabled [Boolean] 부트 메뉴 활성화 여부
 * @property isSpiceFileTransferEnabled [Boolean] Spice 파일 전송 활성화 여부
 * @property isSpiceCopyPasteEnabled [Boolean] Spice 복사/붙여넣기 활성화 여부
 * @property cpuProfileId [UUID] CPU 프로파일 ID
 * @property isAutoConverge [Boolean] 자동 컨버징 여부
 * @property isMigrateCompressed [Boolean] 압축 마이그레이션 여부
 * @property isMigrateEncrypted [Boolean] 암호화 마이그레이션 여부
 * @property predefinedProperties [String] 사전 정의 속성
 * @property userdefinedProperties [String] 사용자 정의 속성
 * @property customEmulatedMachine [String] 사용자 정의 에뮬레이트 머신
 * @property biosType [Int] BIOS 타입
 * @property customCpuName [String] 사용자 정의 CPU 이름
 * @property smallIcon [VmIconEntity] 작은 아이콘
 * @property largeIcon [VmIconEntity] 큰 아이콘
 * @property iconDefaults [VmIconDefaultsEntity] 운영체제에 따른 기본 아이콘
 * @property migrationPolicyId [UUID] 마이그레이션 정책 ID
 * @property consoleDisconnectAction [String] 콘솔 연결 해제 액션
 * @property _resumeBehavior [String] 재개 동작
 * @property customCompatibilityVersion [String] 사용자 정의 호환성 버전
 * @property multiQueuesEnabled [Boolean] 다중 큐 활성화 여부
 * @property virtioScsiMultiQueues [Int] Virtio SCSI 다중 큐 수
 * @property useTscFrequency [Boolean] TSC 주파수 사용 여부
 * @property isTemplateSealed [Boolean] 템플릿 봉인 여부
 * @property cpuPinning [String] CPU 피닝
 * @property balloonEnabled [Boolean] 벌룬 활성화 여부
 * @property consoleDisconnectActionDelay [Int] 콘솔 연결 해제 지연 시간 (초)
 * @property cpuPinningPolicy [Int] CPU 피닝 정책
 * @property parallelMigrations [Int] 병렬 마이그레이션 수
 */
@Entity
@Immutable
@Table(name = "vm_templates_view")
class VmTemplateEntity(
	@Id
	@Column(name = "vmt_guid", unique = true, nullable = false)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val vmtGuid: UUID? = null,
	val name: String = "",
	val memSizeMb: BigInteger? = BigInteger.ZERO,
	val maxMemorySizeMb: BigInteger? = BigInteger.ZERO,
	val numOfIoThreads: Int? = -1,
	// val os: Int? = null,
	val dwhOsInfo: DwhOsinfoEntity? = null,
	val creationDate: LocalDateTime? = null,
	val childCount: Int? = null,
	val numOfSockets: Int? = null,
	val cpuPerSocket: Int? = null,
	val threadsPerCpu: Int? = null,
	val numOfCpus: Int? = null,
	val description: String = "",
	val freeTextComment: String = "",
	val clusterId: UUID? = null,
	val numOfMonitors: Int? = null,
	val allowConsoleReconnect: Boolean? = null,
	@Column(name="status", nullable=true)
	private val _status: Int? = -1,
	@Column(name="usb_policy", nullable=true)
	private val _usbPolicy: Int? = null,
	val timeZone: String = "",
	val clusterName: String = "",
	val clusterCompatibilityVersion: String = "",
	val trustedService: Boolean? = null,
	val clusterBiosType: Int? = null,
	@Column(name="vm_type", nullable=false)
	private val _vmType: Int? = null,
	val niceLevel: Int? = null,
	val cpuShares: Int? = null,
	val storagePoolId: UUID? = null,
	val storagePoolName: String = "",
	val quotaEnforcementType: Int? = null,
	val defaultBootSequence: Int? = null,
	@Column(name="default_display_type", nullable=true)
	val _defaultDisplayType: Int? = null,
	val priority: Int? = null,
	val autoStartup: Boolean? = null,
	val leaseSdId: UUID? = null,
	val isStateless: Boolean? = null,
	val isSmartcardEnabled: Boolean? = null,
	val isDeleteProtected: Boolean? = null,
	val ssoMethod: String = "",
	val isoPath: String = "",
	@Column(name="origin", nullable=false)
	private val _origin: Int? = null,
	val initrdUrl: String = "",
	val kernelUrl: String = "",
	val kernelParams: String = "",
	val quotaId: UUID? = null,
	val quotaName: String = "",
	val dbGeneration: BigInteger? = null,
	val hostCpuFlags: Boolean? = null,
	@Column(name="migration_support", nullable=true)
	private val _migrationSupport: Int? = null,
	val dedicatedVmForVds: UUID? = null,
	val isDisabled: Boolean? = null,
	val tunnelMigration: Boolean? = null,
	val vncKeyboardLayout: String = "",
	val minAllocatedMem: Int? = null,
	val isRunAndPause: Boolean? = null,
	val createdByUserId: UUID? = null,
	val entityType: String = "",
	val migrationDowntime: Int? = null,
	@Column(name="architecture", nullable=true)
	private val _architecture: Int? = null,
	val templateVersionNumber: Int? = null,
	val baseTemplateId: UUID? = null,
	val templateVersionName: String = "",
	val serialNumberPolicy: Int? = null,
	val customSerialNumber: String = "",
	val isBootMenuEnabled: Boolean? = null,
	val isSpiceFileTransferEnabled: Boolean? = null,
	val isSpiceCopyPasteEnabled: Boolean? = null,
	val cpuProfileId: UUID? = null,
	val isAutoConverge: Boolean? = null,
	val isMigrateCompressed: Boolean? = null,
	val isMigrateEncrypted: Boolean? = null,
	val predefinedProperties: String = "",
	val userdefinedProperties: String = "",
	val customEmulatedMachine: String = "",
	@Column(name="bios_type", nullable=true)
	private val _biosType: Int? = null,
	val customCpuName: String = "",
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(
		name="small_icon_id",
		referencedColumnName="id",
		insertable=false,
		updatable=false
	)
	val smallIcon: VmIconEntity? = null,
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(
		name="large_icon_id",
		referencedColumnName="id",
		insertable=false,
		updatable=false
	)
	val largeIcon: VmIconEntity? = null,
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(
		name="os",
		referencedColumnName="os_id",
		insertable=false,
		updatable=false
	)
	val iconDefaults: VmIconDefaultsEntity? = null,
	val migrationPolicyId: UUID? = null,
	val consoleDisconnectAction: String = "",
	@Column(name="resume_behavior", nullable=true)
	private val _resumeBehavior: String = "",
	val customCompatibilityVersion: String = "",
	val multiQueuesEnabled: Boolean? = null,
	val virtioScsiMultiQueues: Int? = null,
	val useTscFrequency: Boolean? = null,
	val isTemplateSealed: Boolean? = null,
	val cpuPinning: String = "",
	val balloonEnabled: Boolean? = null,
	val consoleDisconnectActionDelay: Int? = null,
	@Column(name="cpu_pinning_policy", nullable=true)
	private val _cpuPinningPolicy: Int? = null,
	val parallelMigrations: Int? = null,

) : Serializable {
	override fun toString(): String =
		gson.toJson(this)
	val status: TemplateStatusB?
		get() = TemplateStatusB.forValue(_status)

	val biosType: BiosTypeB
		get() = BiosTypeB.forValue(_biosType)

	val vmType: VmTypeB? /* a.k.a. 최적화 옵션 (optmizationOption) */
		get() = VmTypeB.forValue(_vmType)

	val osType: VmOsType?
		get() = dwhOsInfo?.toVmOsType()

	val architecture: ArchitectureType?
		get() = ArchitectureType.forValue(_architecture)

	val memSize: BigInteger?
		get() = memSizeMb?.times(MEGABYTE_2_BYTE)

	val maxMemorySize: BigInteger?
		get() = maxMemorySizeMb?.times(MEGABYTE_2_BYTE)

	val cpuPinningPolicy: CpuPinningPolicyB?
		get() = CpuPinningPolicyB.forValue(_cpuPinningPolicy)

	val defaultDisplayType: GraphicsTypeB?
		get() = GraphicsTypeB.forValue(_defaultDisplayType)

	val migrationSupport: MigrationSupport?
		get() = MigrationSupport.forValue(_migrationSupport)

	val vmResumeBehavior: VmResumeBehavior?
		get() = VmResumeBehavior.forCode(_resumeBehavior)

	val usbPolicy: UsbPolicy?
		get() = UsbPolicy.forValue(_usbPolicy)

	val originType: OriginType?
		get() = OriginType.forValue(_origin)
	val origin: Int?
		get() = originType?.value
	val isHostedEngineVm: Boolean
		get() = originType == OriginType.managed_hosted_engine

	val virtioScsiMultiQueuesEnabled: Boolean?
		get() = (virtioScsiMultiQueues ?: 0) > 0

	val effectiveSmallIcon: VmIconEntity?
		get() = this.iconDefaults?.smallIcon ?: this.smallIcon

	val effectiveLargeIcon: VmIconEntity?
		get() = this.iconDefaults?.largeIcon ?: this.largeIcon

	class Builder {
		private var bVmtGuid: UUID? = null; fun vmtGuid(block: () -> UUID?) { bVmtGuid = block() }
		private var bName: String = ""; fun name(block: () -> String?) { bName = block() ?: "" }
		private var bMemSizeMb: BigInteger? = BigInteger.ZERO; fun memSizeMb(block: () -> BigInteger?) { bMemSizeMb = block() ?: BigInteger.ZERO }
		private var bMaxMemorySizeMb: BigInteger? = BigInteger.ZERO; fun maxMemorySizeMb(block: () -> BigInteger?) { bMaxMemorySizeMb = block() ?: BigInteger.ZERO }
		private var bNumOfIoThreads: Int? = -1; fun numOfIoThreads(block: () -> Int?) { bNumOfIoThreads = block() }
		// private var bOs: Int? = null; fun os(block: () -> Int?) { bOs = block() }
		private var bDwhOsInfo: DwhOsinfoEntity? = null;fun dwhOsInfo(block: () -> DwhOsinfoEntity?) { bDwhOsInfo = block() }
		private var bCreationDate: LocalDateTime? = null; fun creationDate(block: () -> LocalDateTime?) { bCreationDate = block() }
		private var bChildCount: Int? = null; fun childCount(block: () -> Int?) { bChildCount = block() }
		private var bNumOfSockets: Int? = null; fun numOfSockets(block: () -> Int?) { bNumOfSockets = block() }
		private var bCpuPerSocket: Int? = null; fun cpuPerSocket(block: () -> Int?) { bCpuPerSocket = block() }
		private var bThreadsPerCpu: Int? = null; fun threadsPerCpu(block: () -> Int?) { bThreadsPerCpu = block() }
		private var bNumOfCpus: Int? = null; fun numOfCpus(block: () -> Int?) { bNumOfCpus = block() }
		private var bDescription: String = ""; fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bFreeTextComment: String = ""; fun freeTextComment(block: () -> String?) { bFreeTextComment = block() ?: "" }
		private var bClusterId: UUID? = null; fun clusterId(block: () -> UUID?) { bClusterId = block() }
		private var bNumOfMonitors: Int? = null; fun numOfMonitors(block: () -> Int?) { bNumOfMonitors = block() }
		private var bAllowConsoleReconnect: Boolean? = null; fun allowConsoleReconnect(block: () -> Boolean?) { bAllowConsoleReconnect = block() }
		private var bStatus: TemplateStatusB? = TemplateStatusB.unknown; fun status(block: () -> TemplateStatusB?) { bStatus = block()?: TemplateStatusB.unknown }
		private var bUsbPolicy: Int? = null; fun usbPolicy(block: () -> Int?) { bUsbPolicy = block() }
		private var bTimeZone: String = ""; fun timeZone(block: () -> String?) { bTimeZone = block() ?: "" }
		private var bClusterName: String = ""; fun clusterName(block: () -> String?) { bClusterName = block() ?: "" }
		private var bClusterCompatibilityVersion: String = ""; fun clusterCompatibilityVersion(block: () -> String?) { bClusterCompatibilityVersion = block() ?: "" }
		private var bTrustedService: Boolean? = null; fun trustedService(block: () -> Boolean?) { bTrustedService = block() }
		private var bClusterBiosType: Int? = null; fun clusterBiosType(block: () -> Int?) { bClusterBiosType = block() }
		private var bVmType: Int? = null; fun vmType(block: () -> Int?) { bVmType = block() }
		private var bNiceLevel: Int? = null; fun niceLevel(block: () -> Int?) { bNiceLevel = block() }
		private var bCpuShares: Int? = null; fun cpuShares(block: () -> Int?) { bCpuShares = block() }
		private var bStoragePoolId: UUID? = null; fun storagePoolId(block: () -> UUID?) { bStoragePoolId = block() }
		private var bStoragePoolName: String = ""; fun storagePoolName(block: () -> String?) { bStoragePoolName = block() ?: "" }
		private var bQuotaEnforcementType: Int? = null; fun quotaEnforcementType(block: () -> Int?) { bQuotaEnforcementType = block() }
		private var bDefaultBootSequence: Int? = null; fun defaultBootSequence(block: () -> Int?) { bDefaultBootSequence = block() }
		private var bDefaultDisplayType: Int? = null; fun defaultDisplayType(block: () -> Int?) { bDefaultDisplayType = block() }
		private var bPriority: Int? = null; fun priority(block: () -> Int?) { bPriority = block() }
		private var bAutoStartup: Boolean? = null; fun autoStartup(block: () -> Boolean?) { bAutoStartup = block() }
		private var bLeaseSdId: UUID? = null; fun leaseSdId(block: () -> UUID?) { bLeaseSdId = block() }
		private var bIsStateless: Boolean? = null; fun isStateless(block: () -> Boolean?) { bIsStateless = block() }
		private var bIsSmartcardEnabled: Boolean? = null; fun isSmartcardEnabled(block: () -> Boolean?) { bIsSmartcardEnabled = block() }
		private var bIsDeleteProtected: Boolean? = null; fun isDeleteProtected(block: () -> Boolean?) { bIsDeleteProtected = block() }
		private var bSsoMethod: String = ""; fun ssoMethod(block: () -> String?) { bSsoMethod = block() ?: "" }
		private var bIsoPath: String = ""; fun isoPath(block: () -> String?) { bIsoPath = block() ?: "" }
		private var bOrigin: Int? = null; fun origin(block: () -> Int?) { bOrigin = block() }
		private var bInitrdUrl: String = ""; fun initrdUrl(block: () -> String?) { bInitrdUrl = block() ?: "" }
		private var bKernelUrl: String = ""; fun kernelUrl(block: () -> String?) { bKernelUrl = block() ?: "" }
		private var bKernelParams: String = ""; fun kernelParams(block: () -> String?) { bKernelParams = block() ?: "" }
		private var bQuotaId: UUID? = null; fun quotaId(block: () -> UUID?) { bQuotaId = block() }
		private var bQuotaName: String = ""; fun quotaName(block: () -> String?) { bQuotaName = block() ?: "" }
		private var bDbGeneration: BigInteger? = null; fun dbGeneration(block: () -> BigInteger?) { bDbGeneration = block() }
		private var bHostCpuFlags: Boolean? = null; fun hostCpuFlags(block: () -> Boolean?) { bHostCpuFlags = block() }
		private var bMigrationSupport: Int? = null; fun migrationSupport(block: () -> Int?) { bMigrationSupport = block() }
		private var bDedicatedVmForVds: UUID? = null; fun dedicatedVmForVds(block: () -> UUID?) { bDedicatedVmForVds = block() }
		private var bIsDisabled: Boolean? = null; fun isDisabled(block: () -> Boolean?) { bIsDisabled = block() }
		private var bTunnelMigration: Boolean? = null; fun tunnelMigration(block: () -> Boolean?) { bTunnelMigration = block() }
		private var bVncKeyboardLayout: String = ""; fun vncKeyboardLayout(block: () -> String?) { bVncKeyboardLayout = block() ?: "" }
		private var bMinAllocatedMem: Int? = null; fun minAllocatedMem(block: () -> Int?) { bMinAllocatedMem = block() }
		private var bIsRunAndPause: Boolean? = null; fun isRunAndPause(block: () -> Boolean?) { bIsRunAndPause = block() }
		private var bCreatedByUserId: UUID? = null; fun createdByUserId(block: () -> UUID?) { bCreatedByUserId = block() }
		private var bEntityType: String = ""; fun entityType(block: () -> String?) { bEntityType = block() ?: "" }
		private var bMigrationDowntime: Int? = null; fun migrationDowntime(block: () -> Int?) { bMigrationDowntime = block() }
		private var bArchitecture: Int? = null; fun architecture(block: () -> Int?) { bArchitecture = block() }
		private var bTemplateVersionNumber: Int? = null; fun templateVersionNumber(block: () -> Int?) { bTemplateVersionNumber = block() }
		private var bBaseTemplateId: UUID? = null; fun baseTemplateId(block: () -> UUID?) { bBaseTemplateId = block() }
		private var bTemplateVersionName: String = ""; fun templateVersionName(block: () -> String?) { bTemplateVersionName = block() ?: "" }
		private var bSerialNumberPolicy: Int? = null; fun serialNumberPolicy(block: () -> Int?) { bSerialNumberPolicy = block() }
		private var bCustomSerialNumber: String = ""; fun customSerialNumber(block: () -> String?) { bCustomSerialNumber = block() ?: "" }
		private var bIsBootMenuEnabled: Boolean? = null; fun isBootMenuEnabled(block: () -> Boolean?) { bIsBootMenuEnabled = block() }
		private var bIsSpiceFileTransferEnabled: Boolean? = null; fun isSpiceFileTransferEnabled(block: () -> Boolean?) { bIsSpiceFileTransferEnabled = block() }
		private var bIsSpiceCopyPasteEnabled: Boolean? = null; fun isSpiceCopyPasteEnabled(block: () -> Boolean?) { bIsSpiceCopyPasteEnabled = block() }
		private var bCpuProfileId: UUID? = null; fun cpuProfileId(block: () -> UUID?) { bCpuProfileId = block() }
		private var bIsAutoConverge: Boolean? = null; fun isAutoConverge(block: () -> Boolean?) { bIsAutoConverge = block() }
		private var bIsMigrateCompressed: Boolean? = null; fun isMigrateCompressed(block: () -> Boolean?) { bIsMigrateCompressed = block() }
		private var bIsMigrateEncrypted: Boolean? = null; fun isMigrateEncrypted(block: () -> Boolean?) { bIsMigrateEncrypted = block() }
		private var bPredefinedProperties: String = ""; fun predefinedProperties(block: () -> String?) { bPredefinedProperties = block() ?: "" }
		private var bUserdefinedProperties: String = ""; fun userdefinedProperties(block: () -> String?) { bUserdefinedProperties = block() ?: "" }
		private var bCustomEmulatedMachine: String = ""; fun customEmulatedMachine(block: () -> String?) { bCustomEmulatedMachine = block() ?: "" }
		private var bBiosType: Int? = null; fun biosType(block: () -> Int?) { bBiosType = block() }
		private var bCustomCpuName: String = ""; fun customCpuName(block: () -> String?) { bCustomCpuName = block() ?: "" }
		private var bSmallIcon: VmIconEntity? = null; fun smallIconId(block: () -> VmIconEntity?) { bSmallIcon = block() }
		private var bLargeIcon: VmIconEntity? = null; fun largeIconId(block: () -> VmIconEntity?) { bLargeIcon = block() }
		private var bIconDefaults: VmIconDefaultsEntity? = null; fun iconDefaults(block: () -> VmIconDefaultsEntity?) { bIconDefaults = block() }
		private var bMigrationPolicyId: UUID? = null; fun migrationPolicyId(block: () -> UUID?) { bMigrationPolicyId = block() }
		private var bConsoleDisconnectAction: String = ""; fun consoleDisconnectAction(block: () -> String?) { bConsoleDisconnectAction = block() ?: "" }
		private var bResumeBehavior: String = ""; fun resumeBehavior(block: () -> String?) { bResumeBehavior = block() ?: "" }
		private var bCustomCompatibilityVersion: String = ""; fun customCompatibilityVersion(block: () -> String?) { bCustomCompatibilityVersion = block() ?: "" }
		private var bMultiQueuesEnabled: Boolean? = null; fun multiQueuesEnabled(block: () -> Boolean?) { bMultiQueuesEnabled = block() }
		private var bVirtioScsiMultiQueues: Int? = null; fun virtioScsiMultiQueues(block: () -> Int?) { bVirtioScsiMultiQueues = block() }
		private var bUseTscFrequency: Boolean? = null; fun useTscFrequency(block: () -> Boolean?) { bUseTscFrequency = block() }
		private var bIsTemplateSealed: Boolean? = null; fun isTemplateSealed(block: () -> Boolean?) { bIsTemplateSealed = block() }
		private var bCpuPinning: String = ""; fun cpuPinning(block: () -> String?) { bCpuPinning = block() ?: "" }
		private var bBalloonEnabled: Boolean? = null; fun balloonEnabled(block: () -> Boolean?) { bBalloonEnabled = block() }
		private var bConsoleDisconnectActionDelay: Int? = null; fun consoleDisconnectActionDelay(block: () -> Int?) { bConsoleDisconnectActionDelay = block() }
		private var bCpuPinningPolicy: Int? = null; fun cpuPinningPolicy(block: () -> Int?) { bCpuPinningPolicy = block() }
		private var bParallelMigrations: Int? = null; fun parallelMigrations(block: () -> Int?) { bParallelMigrations = block() }

		fun build(): VmTemplateEntity = VmTemplateEntity(bVmtGuid, bName, bMemSizeMb, bMaxMemorySizeMb, bNumOfIoThreads, bDwhOsInfo, bCreationDate, bChildCount, bNumOfSockets, bCpuPerSocket, bThreadsPerCpu, bNumOfCpus, bDescription, bFreeTextComment, bClusterId, bNumOfMonitors, bAllowConsoleReconnect, bStatus?.value, bUsbPolicy, bTimeZone, bClusterName, bClusterCompatibilityVersion, bTrustedService, bClusterBiosType, bVmType, bNiceLevel, bCpuShares, bStoragePoolId, bStoragePoolName, bQuotaEnforcementType, bDefaultBootSequence, bDefaultDisplayType, bPriority, bAutoStartup, bLeaseSdId, bIsStateless, bIsSmartcardEnabled, bIsDeleteProtected, bSsoMethod, bIsoPath, bOrigin, bInitrdUrl, bKernelUrl, bKernelParams, bQuotaId, bQuotaName, bDbGeneration, bHostCpuFlags, bMigrationSupport, bDedicatedVmForVds, bIsDisabled, bTunnelMigration, bVncKeyboardLayout, bMinAllocatedMem, bIsRunAndPause, bCreatedByUserId, bEntityType, bMigrationDowntime, bArchitecture, bTemplateVersionNumber, bBaseTemplateId, bTemplateVersionName, bSerialNumberPolicy, bCustomSerialNumber, bIsBootMenuEnabled, bIsSpiceFileTransferEnabled, bIsSpiceCopyPasteEnabled, bCpuProfileId, bIsAutoConverge, bIsMigrateCompressed, bIsMigrateEncrypted, bPredefinedProperties, bUserdefinedProperties, bCustomEmulatedMachine, bBiosType, bCustomCpuName, bSmallIcon, bLargeIcon, bIconDefaults, bMigrationPolicyId, bConsoleDisconnectAction, bResumeBehavior, bCustomCompatibilityVersion, bMultiQueuesEnabled, bVirtioScsiMultiQueues, bUseTscFrequency, bIsTemplateSealed, bCpuPinning, bBalloonEnabled, bConsoleDisconnectActionDelay, bCpuPinningPolicy, bParallelMigrations,)
	}

	companion object {
		val MEGABYTE_2_BYTE: BigInteger = BigInteger.valueOf(2.0.pow(20.0).toLong()) // 2^20승
		inline fun builder(block: Builder.() -> Unit): VmTemplateEntity = Builder().apply(block).build()
	}
}
