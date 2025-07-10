// package com.itinfo.rutilvm.api.model.computing
//
// import com.itinfo.rutilvm.common.formatEnhanced
// import com.itinfo.rutilvm.common.gson
// import com.itinfo.rutilvm.api.model.*
// import com.itinfo.rutilvm.common.ovirtDf
// import com.itinfo.rutilvm.api.repository.history.dto.UsageDto
// import com.itinfo.rutilvm.api.repository.history.dto.toVmUsage
// import com.itinfo.rutilvm.common.toTimeElapsedKr
// import com.itinfo.rutilvm.util.ovirt.findAllNicsFromVm
// import com.itinfo.rutilvm.util.ovirt.findAllStatisticsFromVm
// import com.itinfo.rutilvm.util.ovirt.findCluster
// import com.itinfo.rutilvm.util.ovirt.findDataCenter
// import com.itinfo.rutilvm.util.ovirt.findDisk
// import com.itinfo.rutilvm.util.ovirt.findHost
// import com.itinfo.rutilvm.util.ovirt.findTemplate
// import com.itinfo.rutilvm.util.ovirt.findVm
// import org.ovirt.engine.sdk4.Connection
//
// import org.ovirt.engine.sdk4.types.*
// import org.ovirt.engine.sdk4.types.IpVersion.V4
// import org.ovirt.engine.sdk4.types.IpVersion.V6
// import org.ovirt.engine.sdk4.types.SnapshotType.ACTIVE
// import org.ovirt.engine.sdk4.types.SnapshotType.PREVIEW
// import org.slf4j.LoggerFactory
// import java.io.Serializable
// import java.math.BigInteger
// import java.util.Date
//
// private val log = LoggerFactory.getLogger(VmViewVo::class.java)
//
// /**
//  * [VmViewVo]
//  *
//  * @property id [String] 가상머신 Id
//  * @property name [String]
//  * @property status [String]
//  * @property id [String]
//  * @property name [String]
//  * @property description [String]
//  * @property comment [String]
//  * @property status [VmStatus]
//  * @property biosBootMenu [Boolean]
//  * @property biosType [String]  // chipsetFirmwareType
//  * @property cpuArc [Architecture]
//  * @property cpuTopologyCnt [Int]
//  * @property cpuTopologyCore [Int]
//  * @property cpuTopologySocket [Int]
//  * @property cpuTopologyThread [Int]
//  * @property cpuPinningPolicy [String]
//  * @property creationTime [String]
//  * @property deleteProtected [Boolean]
//  * @property monitor [Int]
//  * @property displayType [DisplayType] 그래픽 프로토콜
//  * @property ha [Boolean]
//  * @property haPriority [Int]
//  * @property ioThreadCnt [Int]
//  * @property memorySize [BigInteger]
//  * @property memoryGuaranteed [BigInteger]
//  * @property memoryMax [BigInteger]
//  * @property migrationAutoConverge [InheritableBoolean]
//  * @property migrationCompression [InheritableBoolean]
//  * @property migrationEncrypt [InheritableBoolean]
//  * @property migrationParallelPolicy [InheritableBoolean]
//  * @property osBootDevices List<[String]>
//  * @property osType [String]
//  * @property placementPolicy [VmAffinity]
//  * @property startPaused [Boolean]
//  * @property storageErrorResumeBehaviour [VmStorageErrorResumeBehaviour]
//  * @property type [String]
//  * @property usb [Boolean]
//  * @property virtioScsiMultiQueueEnabled [Boolean]
//  * @property hostedEngineVm [Boolean]
//  * @property timeZone [String]   // Etc/GMT & Asia/Seoul
//  * @property fqdn [String]
//  * @property nextRun [Boolean]
//  * @property runOnce [Boolean]
//  * @property upTime [String]
//  * @property startTime [String]
//  * @property stopTime [String]
//  * @property ipv4 List<[String]>
//  * @property ipv6 List<[String]>
//  * @property usageDto [UsageDto]
//  * @property clusterVo [IdentifiedVo]
//  * @property hostVo [IdentifiedVo]
//  * @property originTemplateVo [IdentifiedVo]
//  * @property templateVo [IdentifiedVo]
//  * @property cpuProfileVo [IdentifiedVo]
//  * @property diskAttachmentVos List<[IdentifiedVo]>
//  * @property cdRomVo [IdentifiedVo]
//  * @property snapshotVos List<[IdentifiedVo]>
//  * @property hostDeviceVos List<[IdentifiedVo]>
//  * @property nicVos List<[IdentifiedVo]>
//  */
// class VmViewVo (
//     val id: String = "",
//     val name: String = "",
// 	val description: String = "",
// 	val comment: String = "",
//     val status: VmStatus = VmStatus.UNKNOWN,
// 	val biosBootMenu: Boolean = false,
// 	val biosType: String = "",
// 	val cpuArc: Architecture = Architecture.UNDEFINED,
// 	val cpuTopologyCnt: Int = 0,
// 	val cpuTopologyCore: Int = 0,
// 	val cpuTopologySocket: Int = 0,
// 	val cpuTopologyThread: Int = 0,
// 	val cpuPinningPolicy: String = "",
// 	private val _creationTime: Date? = null,
// 	val deleteProtected: Boolean = false,
// 	val monitor: Int = 0,
// 	val displayType: DisplayType = DisplayType.VNC,
// 	val ha: Boolean = false,
// 	val haPriority: Int = 0,
// 	val ioThreadCnt: Int = 0,
// 	val memorySize: BigInteger = BigInteger.ZERO,
//     val memoryGuaranteed: BigInteger = BigInteger.ZERO,
// 	val memoryMax: BigInteger = BigInteger.ZERO,
// 	val migrationAutoConverge: InheritableBoolean = InheritableBoolean.INHERIT,
// 	val migrationCompression: InheritableBoolean = InheritableBoolean.INHERIT,
// 	val migrationEncrypt: InheritableBoolean = InheritableBoolean.INHERIT,
// 	val migrationParallelPolicy: InheritableBoolean = InheritableBoolean.INHERIT,
// 	val firstDevice: String = "",
// 	val secDevice: String = "",
// 	val osType: String = "",
// 	val guestArc: String = "",
// 	val guestOsType: String = "",
// 	val guestDistribution: String = "",
// 	val guestKernelVer: String = "",
// 	val guestTimeZone: String = "",
// 	val placementPolicy: VmAffinity = VmAffinity.MIGRATABLE,
//     val startPaused: Boolean = false,
// 	val storageErrorResumeBehaviour: VmStorageErrorResumeBehaviour = VmStorageErrorResumeBehaviour.AUTO_RESUME,
// 	val type: String = "",  //VmType
// 	val usb: Boolean = false,
// 	val virtioScsiMultiQueueEnabled: Boolean = false,
// 	val hostedEngineVm: Boolean = false,
// 	val timeZone: String = "",
// 	val fqdn: String = "",
// 	val nextRun: Boolean = false,
// 	val runOnce: Boolean = false,
// 	val upTime: String = "",
// 	private val _startTime: Date? = null,
// 	private val _stopTime: Date? = null,
// 	val ipv4: List<String> = listOf(),
// 	val ipv6: List<String> = listOf(),
// 	val dataCenterVo: IdentifiedVo = IdentifiedVo(),
// 	val clusterVo: IdentifiedVo = IdentifiedVo(),
// 	val hostVo: IdentifiedVo = IdentifiedVo(),
// 	val originTemplateVo: IdentifiedVo = IdentifiedVo(),
// 	val templateVo: IdentifiedVo = IdentifiedVo(),
// 	val cpuProfileVo: IdentifiedVo = IdentifiedVo(),
// 	val diskAttachmentVos: List<IdentifiedVo> = listOf(),
//     val cdRomVo: IdentifiedVo = IdentifiedVo(),
// 	val snapshotVos: List<IdentifiedVo> = listOf(),
// 	val hostDeviceVos: List<IdentifiedVo> = listOf(),
// 	val nicVos: List<IdentifiedVo> = listOf(),
// 	val usageDto: UsageDto = UsageDto(),
// ): Serializable {
//     override fun toString(): String =
//         gson.toJson(this)
//
// 	val creationTime: String
// 		get() = ovirtDf.formatEnhanced(_creationTime)
// 	val startTime: String
// 		get() = ovirtDf.formatEnhanced(_startTime)
// 	val stopTime: String
// 		get() = ovirtDf.formatEnhanced(_stopTime)
//
//     class Builder {
// 		private var bId: String = ""; fun id(block: () -> String?) { bId = block() ?: "" }
// 		private var bName: String =  ""; fun name(block: () -> String?) { bName = block() ?: "" }
// 		private var bDescription: String = ""; fun description(block: () -> String?) { bDescription = block() ?: "" }
// 		private var bComment: String = ""; fun comment(block: () -> String?) { bComment = block() ?: "" }
// 		private var bStatus: VmStatus = VmStatus.UNKNOWN; fun status(block: () -> VmStatus?) { bStatus = block() ?: VmStatus.UNKNOWN }
// 		private var bBiosBootMenu: Boolean = false; fun biosBootMenu(block: () -> Boolean?) { bBiosBootMenu = block() ?: false }
// 		private var bBiosType: String = ""; fun biosType(block: () -> String?) { bBiosType = block() ?: "" }
// 		private var bCpuArc: Architecture = Architecture.UNDEFINED; fun cpuArc(block: () -> Architecture?) { bCpuArc = block() ?: Architecture.UNDEFINED }
// 		private var bCpuTopologyCnt: Int = 0; fun cpuTopologyCnt(block: () -> Int?) { bCpuTopologyCnt = block() ?: 0 }
// 		private var bCpuTopologyCore: Int = 0; fun cpuTopologyCore(block: () -> Int?) { bCpuTopologyCore = block() ?: 0 }
// 		private var bCpuTopologySocket: Int = 0; fun cpuTopologySocket(block: () -> Int?) { bCpuTopologySocket = block() ?: 0 }
// 		private var bCpuTopologyThread: Int = 0; fun cpuTopologyThread(block: () -> Int?) { bCpuTopologyThread = block() ?: 0 }
// 		private var bCpuPinningPolicy: String = ""; fun cpuPinningPolicy(block: () -> String?) { bCpuPinningPolicy = block() ?: "" }
// 		private var bCreationTime: Date? = null; fun creationTime(block: () -> Date?) { bCreationTime = block() }
// 		private var bDeleteProtected: Boolean = false; fun deleteProtected(block: () -> Boolean?) { bDeleteProtected = block() ?: false }
// 		private var bMonitor: Int =  0; fun monitor(block: () -> Int?) { bMonitor = block() ?: 0 }
// 		private var bDisplayType: DisplayType = DisplayType.VNC; fun displayType(block: () -> DisplayType?) { bDisplayType = block() ?: DisplayType.VNC }
// 		private var bHa: Boolean = false; fun ha(block: () -> Boolean?) { bHa = block() ?: false }
// 		private var bHaPriority: Int = 0; fun haPriority(block: () -> Int?) { bHaPriority = block() ?: 0 }
// 		private var bIoThreadCnt: Int = 0; fun ioThreadCnt(block: () -> Int?) { bIoThreadCnt = block() ?: 0 }
// 		private var bMemorySize: BigInteger = BigInteger.ZERO; fun memorySize(block: () -> BigInteger?) { bMemorySize = block() ?: BigInteger.ZERO }
// 		private var bMemoryGuaranteed: BigInteger = BigInteger.ZERO; fun memoryGuaranteed(block: () -> BigInteger?) { bMemoryGuaranteed = block() ?: BigInteger.ZERO }
// 		private var bMemoryMax: BigInteger = BigInteger.ZERO; fun memoryMax(block: () -> BigInteger?) { bMemoryMax = block() ?: BigInteger.ZERO }
// 		private var bMigrationAutoConverge: InheritableBoolean = InheritableBoolean.INHERIT; fun migrationAutoConverge(block: () -> InheritableBoolean?) { bMigrationAutoConverge = block() ?: InheritableBoolean.INHERIT }
// 		private var bMigrationCompression: InheritableBoolean = InheritableBoolean.INHERIT; fun migrationCompression(block: () -> InheritableBoolean?) { bMigrationCompression = block() ?: InheritableBoolean.INHERIT }
// 		private var bMigrationEncrypt: InheritableBoolean = InheritableBoolean.INHERIT; fun migrationEncrypt(block: () -> InheritableBoolean?) { bMigrationEncrypt = block() ?: InheritableBoolean.INHERIT }
// 		private var bMigrationParallelPolicy: InheritableBoolean = InheritableBoolean.INHERIT; fun migrationParallelPolicy(block: () -> InheritableBoolean?) { bMigrationParallelPolicy = block() ?: InheritableBoolean.INHERIT }
// 		private var bFirstDevice: String = ""; fun firstDevice(block: () -> String?) { bFirstDevice = block() ?: "" }
// 		private var bSecDevice: String = ""; fun secDevice(block: () -> String?) { bSecDevice = block() ?: "" }
// 		private var bOsType: String = ""; fun osType(block: () -> String?) { bOsType = block() ?: "" }
// 		private var bGuestArc: String = ""; fun guestArc(block: () -> String?) { bGuestArc = block() ?: "" }
// 		private var bGuestOsType: String = ""; fun guestOsType(block: () -> String?) { bGuestOsType = block() ?: "" }
// 		private var bGuestDistribution: String = ""; fun guestDistribution(block: () -> String?) { bGuestDistribution = block() ?: "" }
// 		private var bGuestKernelVer: String = ""; fun guestKernelVer(block: () -> String?) { bGuestKernelVer = block() ?: "" }
// 		private var bGuestTimeZone: String = ""; fun guestTimeZone(block: () -> String?) { bGuestTimeZone = block() ?: "" }
// 		private var bPlacementPolicy: VmAffinity = VmAffinity.MIGRATABLE; fun placementPolicy(block: () -> VmAffinity?) { bPlacementPolicy = block() ?: VmAffinity.MIGRATABLE }
// 		private var bStartPaused: Boolean = false; fun startPaused(block: () -> Boolean?) { bStartPaused = block() ?: false }
// 		private var bStorageErrorResumeBehaviour: VmStorageErrorResumeBehaviour = VmStorageErrorResumeBehaviour.AUTO_RESUME; fun storageErrorResumeBehaviour(block: () -> VmStorageErrorResumeBehaviour?) { bStorageErrorResumeBehaviour = block() ?: VmStorageErrorResumeBehaviour.AUTO_RESUME }
// 		private var bType: String =  ""; fun type(block: () -> String?) { bType = block() ?: "" }
// 		private var bUsb: Boolean =  false; fun usb(block: () -> Boolean?) { bUsb = block() ?: false }
// 		private var bVirtioScsiMultiQueueEnabled: Boolean = false; fun virtioScsiMultiQueueEnabled(block: () -> Boolean?) { bVirtioScsiMultiQueueEnabled = block() ?: false }
// 		private var bHostedEngineVm: Boolean = false; fun hostedEngineVm(block: () -> Boolean?) { bHostedEngineVm = block() ?: false }
// 		private var bTimeZone: String = ""; fun timeZone(block: () -> String?) { bTimeZone = block() ?: "" }
// 		private var bFqdn: String =  ""; fun fqdn(block: () -> String?) { bFqdn = block() ?: "" }
// 		private var bNextRun: Boolean =  false; fun nextRun(block: () -> Boolean?) { bNextRun = block() ?: false }
// 		private var bRunOnce: Boolean =  false; fun runOnce(block: () -> Boolean?) { bRunOnce = block() ?: false }
// 		private var bUpTime: String = ""; fun upTime(block: () -> String?) { bUpTime = block() ?: "" }
// 		private var bStartTime: Date? = null; fun startTime(block: () -> Date?) { bStartTime = block() }
// 		private var bStopTime: Date? = null; fun stopTime(block: () -> Date?) { bStopTime = block() }
// 		private var bIpv4: List<String> = listOf(); fun ipv4(block: () -> List<String>?) { bIpv4 = block() ?: listOf() }
// 		private var bIpv6: List<String> = listOf(); fun ipv6(block: () -> List<String>?) { bIpv6 = block() ?: listOf() }
// 		private var bDataCenterVo: IdentifiedVo = IdentifiedVo(); fun dataCenterVo(block: () -> IdentifiedVo?) { bDataCenterVo = block() ?: IdentifiedVo() }
// 		private var bClusterVo: IdentifiedVo = IdentifiedVo(); fun clusterVo(block: () -> IdentifiedVo?) { bClusterVo = block() ?: IdentifiedVo() }
// 		private var bHostVo: IdentifiedVo = IdentifiedVo(); fun hostVo(block: () -> IdentifiedVo?) { bHostVo = block() ?: IdentifiedVo() }
// 		private var bOriginTemplateVo: IdentifiedVo = IdentifiedVo(); fun originTemplateVo(block: () -> IdentifiedVo?) { bOriginTemplateVo = block() ?: IdentifiedVo() }
// 		private var bTemplateVo: IdentifiedVo = IdentifiedVo(); fun templateVo(block: () -> IdentifiedVo?) { bTemplateVo = block() ?: IdentifiedVo() }
// 		private var bCpuProfileVo: IdentifiedVo = IdentifiedVo(); fun cpuProfileVo(block: () -> IdentifiedVo?) { bCpuProfileVo = block() ?: IdentifiedVo() }
// 		private var bDiskAttachmentVos: List<IdentifiedVo> = listOf(); fun diskAttachmentVos(block: () -> List<IdentifiedVo>?) { bDiskAttachmentVos = block() ?: listOf() }
// 		private var bCdRomVo: IdentifiedVo = IdentifiedVo(); fun cdRomVo(block: () -> IdentifiedVo?) { bCdRomVo = block() ?: IdentifiedVo() }
// 		private var bSnapshotVos: List<IdentifiedVo> = listOf(); fun snapshotVos(block: () -> List<IdentifiedVo>?) { bSnapshotVos = block() ?: listOf() }
// 		private var bHostDeviceVos: List<IdentifiedVo> = listOf(); fun hostDeviceVos(block: () -> List<IdentifiedVo>?) { bHostDeviceVos = block() ?: listOf() }
// 		private var bNicVos: List<IdentifiedVo> = listOf(); fun nicVos(block: () -> List<IdentifiedVo>?) { bNicVos = block() ?: listOf() }
// 		private var bUsageDto: UsageDto = UsageDto(); fun usageDto(block: () -> UsageDto?) { bUsageDto = block() ?: UsageDto() }
//
//         fun build(): VmViewVo = VmViewVo(bId, bName, bDescription, bComment, bStatus, bBiosBootMenu, bBiosType, bCpuArc, bCpuTopologyCnt, bCpuTopologyCore, bCpuTopologySocket, bCpuTopologyThread, bCpuPinningPolicy, bCreationTime, bDeleteProtected, bMonitor, bDisplayType, bHa, bHaPriority, bIoThreadCnt, bMemorySize, bMemoryGuaranteed, bMemoryMax, bMigrationAutoConverge, bMigrationCompression, bMigrationEncrypt, bMigrationParallelPolicy, bFirstDevice, bSecDevice, bOsType, bGuestArc, bGuestOsType, bGuestDistribution, bGuestKernelVer, bGuestTimeZone, bPlacementPolicy, bStartPaused, bStorageErrorResumeBehaviour, bType, bUsb, bVirtioScsiMultiQueueEnabled, bHostedEngineVm, bTimeZone, bFqdn, bNextRun, bRunOnce, bUpTime, bStartTime, bStopTime, bIpv4, bIpv6, bDataCenterVo, bClusterVo, bHostVo, bOriginTemplateVo, bTemplateVo, bCpuProfileVo, bDiskAttachmentVos, bCdRomVo, bSnapshotVos, bHostDeviceVos, bNicVos, bUsageDto,)
//     }
//
//     companion object {
//         inline fun builder(block: VmViewVo.Builder.() -> Unit): VmViewVo = VmViewVo.Builder().apply(block).build()
//     }
// }
//
// /**
//  * 가상머신 id & name
//  */
// fun Vm.toVmIdName(): VmViewVo = VmViewVo.builder {
// 	id { this@toVmIdName.id() }
// 	name { this@toVmIdName.name() }
// }
// fun List<Vm>.toVmsIdName(): List<VmViewVo> =
// 	this@toVmsIdName.map { it.toVmIdName() }
//
//
// fun Vm.toVmStatus(): VmViewVo = VmViewVo.builder {
// 	id { this@toVmStatus.id() }
// 	name { this@toVmStatus.name() }
// 	status { this@toVmStatus.status() }
// }
// fun List<Vm>.toVmStatusList(): List<VmViewVo> =
// 	this@toVmStatusList.map { it.toVmStatus() }
//
//
// fun Vm.toVmMenu(conn: Connection): VmViewVo {
// 	val vm = this@toVmMenu
// 	val snapshots: List<IdentifiedVo> = vm.snapshots().filter { it.snapshotType() != ACTIVE && it.snapshotType() != PREVIEW }.fromSnapshotsToIdentifiedVos()
// 	return VmViewVo.builder {
// 		id { vm.id() }
// 		name { vm.name() }
// 		comment { vm.comment() }
// 		creationTime {  vm.creationTime() }
// 		status { vm.status() }
// 		description { vm.description() }
// 		nextRun { vm.nextRunConfigurationExists() }
// 		hostedEngineVm { vm.isHostedEngineVm } // 엔진여부
// 		dataCenterVo { if(vm.clusterPresent()) vm.cluster().dataCenter()?.fromDataCenterToIdentifiedVo() else IdentifiedVo() }
// 		clusterVo { if(vm.clusterPresent()) vm.cluster().fromClusterToIdentifiedVo() else IdentifiedVo() }
// 		snapshotVos { snapshots }
// 		if (vm.status() == VmStatus.UP) {
// 			val statistics: List<Statistic> = conn.findAllStatisticsFromVm(vm.id()).getOrDefault(emptyList())
// 			val host: Host? = conn.findHost(vm.host().id()).getOrNull()
// 			fqdn { vm.fqdn() }
// 			hostVo { host?.fromHostToIdentifiedVo() }
// 			ipv4 { vm.reportedDevices().findVmIpv4() }
// 			ipv6 { vm.reportedDevices().findVmIpv6() }
// 			upTime { statistics.findVmUptime() }
// 			usageDto { statistics.toVmUsage() }
// 		} else {
// 			fqdn { null }
// 			upTime { null }
// 			ipv4 { null }
// 			ipv6 { null }
// 			usageDto { null }
// 		}
// 	}
// }
// fun List<Vm>.toVmMenus(conn: Connection): List<VmViewVo> =
// 	this@toVmMenus.map { it.toVmMenu(conn) }
//
//
//
// fun Vm.toVmViewVo(conn: Connection): VmViewVo {
//     val vm = this@toVmViewVo
//     val template: Template? = conn.findTemplate(vm.template().id()).getOrNull()
//     val disk: Disk? = vm.cdroms().firstOrNull()?.file()?.id()?.let { conn.findDisk(it).getOrNull() }
// 	// val snapshots: List<Snapshot> = conn.findAllSnapshotsFromVm(vm.id()).getOrDefault(listOf())
//
//     return VmViewVo.builder {
// 		id { vm.id() }
// 		name { vm.name() }
// 		description { vm.description() }
// 		comment { vm.comment() }
// 		status { vm.status() }
// 		// biosBootMenu { vm.bios().bootMenu() }
// 		biosType { vm.bios().type().toString() }
// 		cpuArc { vm.cpu().architecture() }
// 		cpuTopologyCnt { calculateCpuTopology(vm) }
// 		cpuTopologyCore { vm.cpu().topology().coresAsInteger() }
// 		cpuTopologySocket { vm.cpu().topology().socketsAsInteger() }
// 		cpuTopologyThread { vm.cpu().topology().threadsAsInteger() }
// 		cpuPinningPolicy { vm.cpuPinningPolicy().value() }
// 		creationTime { vm.creationTime() }
// 		deleteProtected { vm.deleteProtected() }
// 		monitor { if(vm.displayPresent()) vm.display().monitorsAsInteger() else 0 }
// 		displayType { if(vm.displayPresent()) vm.display().type() else DisplayType.VNC }
// 		ha { vm.highAvailability().enabled() }
// 		haPriority { vm.highAvailability().priorityAsInteger() }
// 		ioThreadCnt  { if (vm.io().threadsPresent()) vm.io().threadsAsInteger() else 0 }
// 		memorySize { vm.memory() }
// 		memoryGuaranteed { vm.memoryPolicy().guaranteed() }
// 		memoryMax { vm.memoryPolicy().max() }
// 		migrationEncrypt { vm.migration().encrypted() }
// 		migrationAutoConverge { vm.migration().autoConverge() }
// 		migrationCompression { vm.migration().compressed() }
// 		// migrationParallelPolicy {  }
// 		firstDevice { vm.os().boot().devices().first().value() }
// 		secDevice {
// 			if (vm.os().boot().devices().size > 1)
// 				vm.os().boot().devices()[1].value()
// 			else
// 				null
// 		}
// 		osType { vm.os().type() }
// 		if(vm.guestOperatingSystemPresent()){
// 			guestArc { vm.guestOperatingSystem().architecture() }
// 			guestOsType { vm.guestOperatingSystem().family() }
// 			guestDistribution { vm.guestOperatingSystem().distribution() }
// 			guestKernelVer { vm.guestOperatingSystem().kernel().version().fullVersion() }
// 			guestTimeZone { vm.guestTimeZone().name() + " " + vm.guestTimeZone().utcOffset() }
// 		}else{
// 			guestArc { "" }
// 			guestOsType { "" }
// 			guestDistribution { "" }
// 			guestKernelVer { "" }
// 			guestTimeZone { "" }
// 		}
// 		placementPolicy { vm.placementPolicy().affinity() } //migrationMode
// 		startPaused { vm.startPaused() }
// 		storageErrorResumeBehaviour { vm.storageErrorResumeBehaviour() }
// 		type { vm.type().toString() }
// 		usb { if(vm.usbPresent()) vm.usb().enabled() else false }
// 		virtioScsiMultiQueueEnabled { vm.virtioScsiMultiQueuesEnabled() }
// 		hostedEngineVm { vm.origin() == "managed_hosted_engine" }
// 		timeZone { vm.timeZone().name() }
// 		nextRun { vm.nextRunConfigurationExists() }
// 		if (vm.status() == VmStatus.UP) {
// 			// val nics: List<Nic> = conn.findAllNicsFromVm(vm.id()).getOrDefault(listOf())
// 			val host: Host? = conn.findHost(vm.host().id()).getOrNull()
// 			fqdn { vm.fqdn() }
// 			ipv4 { vm.reportedDevices().findVmIpv4() }
// 			ipv6 { vm.reportedDevices().findVmIpv6() }
// 			hostVo { host?.fromHostToIdentifiedVo() }
// 			upTime { vm.statistics().findVmUptime() }
// 			usageDto { vm.statistics().toVmUsage() }
// 		} else {
// 			fqdn { null }
// 			upTime { null }
// 			ipv4 { null }
// 			ipv6 { null }
// 			usageDto { null }
// 		}
// 		// startTime { vm.startTime() }
// 		// stopTime { vm.stopTime() }
// 		dataCenterVo { if(vm.clusterPresent()) vm.cluster().dataCenter()?.fromDataCenterToIdentifiedVo() else IdentifiedVo() }
// 		clusterVo { if(vm.clusterPresent()) vm.cluster().fromClusterToIdentifiedVo() else IdentifiedVo() }
// 		originTemplateVo { if(vm.originalTemplatePresent()) vm.originalTemplate().fromTemplateToIdentifiedVo() else null }
// 		templateVo { vm.template().fromTemplateToIdentifiedVo() }
// 		cpuProfileVo { vm.cpuProfile().fromCpuProfileToIdentifiedVo() }
// 		diskAttachmentVos { vm.diskAttachments().fromDiskAttachmentsToIdentifiedVos() }
// 		cdRomVo { disk?.fromDiskToIdentifiedVo() }
// 		// snapshotVos { vm.snapshotVos() }
// 		// hostDeviceVos { vm.hostDeviceVos() }
// 		// nicVos { nics.fromNicsToIdentifiedVos() }
// 	}
// }
// fun List<Vm>.toVmViewVos(conn: Connection) =
// 	this@toVmViewVos.map { it.toVmViewVo(conn) }
//
// fun Vm.toTemplateVmVo(conn: Connection): VmViewVo {
// 	val vm = this@toTemplateVmVo
// 	return VmViewVo.builder {
// 		id { vm.id() }
// 		name { vm.name() }
// 		status { vm.status() }
// 		if (vm.status() == VmStatus.UP) {
// 			val statistics: List<Statistic> = conn.findAllStatisticsFromVm(vm.id()).getOrDefault(emptyList())
// 			val host: Host? = conn.findHost(vm.host().id()).getOrNull()
// 			fqdn { vm.fqdn() }
// 			upTime { statistics.findVmUptime() }
// 			ipv4 { vm.reportedDevices().findVmIpv4() }
// 			ipv6 { vm.reportedDevices().findVmIpv6() }
// 			hostVo { host?.fromHostToIdentifiedVo() }
// 		} else {
// 			fqdn { null }
// 			upTime { null }
// 			ipv4 { null }
// 			ipv6 { null }
// 			hostVo { null }
// 		}
// 	}
// }
// fun List<Vm>.toTemplateVmVos(conn: Connection) =
// 	this@toTemplateVmVos.map { it.toTemplateVmVo(conn) }
//
//
// fun Vm.toVmStorageDomainMenu(conn: Connection, storageDomainId: String): VmViewVo {
// 	val vm: Vm? = conn.findVm(this@toVmStorageDomainMenu.id(), follow = "diskattachments.disk,snapshots").getOrNull()
// 	val snapshots: List<Snapshot> = vm?.snapshots()?.filter { snapshot ->
// 		snapshot.snapshotType() != SnapshotType.ACTIVE
// 	} ?: emptyList()
//
// 	val diskAttachments: List<DiskAttachment> = vm?.diskAttachments()?.filter { diskAttachment ->
// 		diskAttachment.disk().storageDomains()?.any { it.id() == storageDomainId } == true
// 	} ?: emptyList()
//
// 	val virtualSize = diskAttachments.sumOf { it.disk().provisionedSize() }
// 	val actualSize = diskAttachments.sumOf { it.disk().totalSize() }
//
// 	return VmViewVo.builder {
// 		id { this@toVmStorageDomainMenu.id() }
// 		name { this@toVmStorageDomainMenu.name() }
// 		status { this@toVmStorageDomainMenu.status() }
// 		creationTime { this@toVmStorageDomainMenu.creationTime() }
// 		memoryGuaranteed { virtualSize }  // 원래 디스크의 가상크기 합친값
// 		memorySize { actualSize }		// 디스크 실제 값 합친값
// 		diskAttachmentVos { diskAttachments.fromDiskAttachmentsToIdentifiedVos() }
// 		snapshotVos { snapshots.fromSnapshotsToIdentifiedVos() }
// 	}
// }
// fun List<Vm>.toVmStorageDomainMenus(conn: Connection, storageDomainId: String): List<VmViewVo> =
// 	this@toVmStorageDomainMenus.map { it.toVmStorageDomainMenu(conn, storageDomainId) }
//
// fun Vm.toNetworkVm(conn: Connection): VmViewVo {
// 	val cluster: Cluster? = conn.findCluster(this@toNetworkVm.cluster().id()).getOrNull()
// 	return VmViewVo.builder {
// 		id { this@toNetworkVm.id() }
// 		name { this@toNetworkVm.name() }
// 		description { this@toNetworkVm.description() }
// 		status { this@toNetworkVm.status() }
// 		clusterVo { cluster?.fromClusterToIdentifiedVo() }
// 		if (this@toNetworkVm.status() == VmStatus.UP) {
// 			val statistics: List<Statistic> = conn.findAllStatisticsFromVm(this@toNetworkVm.id()).getOrDefault(emptyList())
// 			fqdn { this@toNetworkVm.fqdn() }
// 			upTime { statistics.findVmUptime() }
// 			ipv4 { this@toNetworkVm.reportedDevices().findVmIpv4() }
// 			ipv6 { this@toNetworkVm.reportedDevices().findVmIpv6() }
// 		} else {
// 			fqdn { null }
// 			upTime { null }
// 			ipv4 { null }
// 			ipv6 { null }
// 		}
// 	}
// }
// fun List<Vm>.toNetworkVms(conn: Connection): List<VmViewVo> =
// 	this@toNetworkVms.map { it.toNetworkVm(conn) }
//
// fun Vm.toDiskVm(conn: Connection): VmViewVo {
// 	val cluster: Cluster? = conn.findCluster(this@toDiskVm.cluster().id()).getOrNull()
// 	return VmViewVo.builder {
// 		id { this@toDiskVm.id() }
// 		name { this@toDiskVm.name() }
// 		description { this@toDiskVm.description() }
// 		status { this@toDiskVm.status() }
// 		clusterVo { cluster?.fromClusterToIdentifiedVo() }
// 		if (this@toDiskVm.status() == VmStatus.UP) {
// 			val statistics: List<Statistic> = conn.findAllStatisticsFromVm(this@toDiskVm.id()).getOrDefault(emptyList())
// 			val host: Host? = conn.findHost(this@toDiskVm.host().id()).getOrNull()
// 			fqdn { this@toDiskVm.fqdn() }
// 			upTime { statistics.findVmUptime() }
// 			ipv4 { this@toDiskVm.reportedDevices().findVmIpv4() }
// 			ipv6 { this@toDiskVm.reportedDevices().findVmIpv6() }
// 			usageDto { this@toDiskVm.statistics().toVmUsage() }
// 			hostVo { host?.fromHostToIdentifiedVo() }
// 		}
// 	}
// }
// fun List<Vm>.toDiskVms(conn: Connection): List<VmViewVo> =
// 	this@toDiskVms.map { it.toDiskVm(conn) }
//
// fun Vm.toUnregisteredVm(conn: Connection): VmViewVo {
// 	val vm = this@toUnregisteredVm
// 	val tmp = conn.findTemplate(vm.template().id()).getOrNull()
// 	return VmViewVo.builder {
// 		id { vm.id() }
// 		name { vm.name() }
// 		description { vm.description() }
// 		comment { vm.comment() }
// 		status { vm.status() }
// 		templateVo { tmp?.fromTemplateToIdentifiedVo() }
// 		biosType { vm.bios().type().toString() }
// 		cpuArc { vm.cpu().architecture() }
// 		cpuTopologyCnt { calculateCpuTopology(vm) }
// 		cpuTopologyCore { vm.cpu().topology().coresAsInteger() }
// 		cpuTopologySocket { vm.cpu().topology().socketsAsInteger() }
// 		cpuTopologyThread { vm.cpu().topology().threadsAsInteger() }
// 		cpuPinningPolicy { vm.cpuPinningPolicy().value() }
// 		creationTime { vm.creationTime() }
// 		monitor { if(vm.displayPresent()) vm.display().monitorsAsInteger() else 0 }
// 		displayType { if(vm.displayPresent()) vm.display().type() else DisplayType.VNC }
// 		ha { vm.highAvailability().enabled() }
// 		haPriority { vm.highAvailability().priorityAsInteger() }
// 		memorySize { vm.memory() }
// 		memoryGuaranteed { vm.memoryPolicy().guaranteed() }
// 		memoryMax { vm.memoryPolicy().max() }
// 		osType { vm.os().type() }
// 		type { vm.type().toString() }
// 		usb { if(vm.usbPresent()) vm.usb().enabled() else false }
// 	}
// }
// fun List<Vm>.toUnregisterdVms(conn: Connection): List<VmViewVo> =
// 	this@toUnregisterdVms.map { it.toUnregisteredVm(conn) }
//
//
// /**
//  * [Vm.toVmSystem]
//  * 스냅샷에서 사용
//  *
//  * @return
//  */
// fun Vm.toVmSystem(): VmViewVo {
// 	return VmViewVo.builder {
// 		memorySize { this@toVmSystem.memory() }
// 		memoryGuaranteed { this@toVmSystem.memoryPolicy().guaranteed() }
// 		memoryMax { this@toVmSystem.memoryPolicy().max() }
// 		cpuTopologyCnt { calculateCpuTopology(this@toVmSystem) }
// 		cpuTopologySocket { this@toVmSystem.cpu().topology().socketsAsInteger() }
// 		cpuTopologyCore { this@toVmSystem.cpu().topology().coresAsInteger() }
// 		cpuTopologyThread { this@toVmSystem.cpu().topology().threadsAsInteger() }
// 		// timeOffset { this@toVmSystem.timeZone().name() }
// 	}
// }
//
//
// /**
//  * [List<[Statistic]>.findVmUptime]
//  * Vm 업타임 구하기
//  * 이건 매개변수로 statisticList 안줘도 되는게 vm에서만 사용
//  *
//  * @return 일, 시간, 분 형식
//  */
// fun List<Statistic>.findVmUptime(): String {
// 	val time: Long = this@findVmUptime.filter {
// 		it.name() == "elapsed.time"
// 	}.map {
// 		it.values().firstOrNull()?.datum()?.toLong()
// 	}.firstOrNull() ?: 0L
// 	return time.toTimeElapsedKr()
// }
//
//
// /**
//  * [List<[Nic]>.findVmIpv4]
//  * Vm ip 알아내기
//  * vms/{id}/nic/{id}/statistic
//  * @return
//  */
// fun List<ReportedDevice>.findVmIpv4(): List<String> {
// 	return this@findVmIpv4.flatMap { report ->
// 		report.ips()?.filter { it.version() == V4 }?.map { it.address() } ?: emptyList()
// 	}.distinct()
// }
//
// /**
//  * [List<[ReportedDevice]>.findVmIpv6]
//  * Vm ip 알아내기
//  * vms/{id}/nic/{id}/statistic
//  * @param conn
//  * @return
//  */
// fun List<ReportedDevice>.findVmIpv6(): List<String> {
// 	return this@findVmIpv6.flatMap { report ->
// 		report.ips()?.filter { it.version() == V6 }?.map { it.address() } ?: emptyList()
// 	}.distinct()
// }
//
// // fun List<Nic>.findVmIpv6(conn: Connection, vmId: String): List<String> {
// // 	return this@findVmIpv6.flatMap { nic ->
// // 		val reports: List<ReportedDevice> = conn.findAllReportedDevicesFromVm(vmId).getOrDefault(listOf())
// // 		reports.flatMap { report ->
// // 			report.ips()?.filter { it.version() == V6 }?.map { it.address() } ?: emptyList()
// // 		}
// // 	}.distinct()
// // }
//
//
// // CPU Topology 계산 최적화
// fun calculateCpuTopology(vm: Vm): Int {
// 	val topology = vm.cpu().topology()
// 	return topology.coresAsInteger() * topology.socketsAsInteger() * topology.threadsAsInteger()
// }
