package com.itinfo.rutilvm.api.model.computing;

import com.itinfo.rutilvm.common.formatEnhanced
import com.itinfo.rutilvm.util.ovirt.findBios
import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.api.model.Os
import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.model.fromClusterToIdentifiedVo
import com.itinfo.rutilvm.api.model.fromDataCenterToIdentifiedVo
import com.itinfo.rutilvm.api.model.network.NicVo
import com.itinfo.rutilvm.api.model.storage.DiskAttachmentVo
import com.itinfo.rutilvm.api.model.storage.toAddTemplateDisk
import com.itinfo.rutilvm.api.model.storage.toDiskAttachmentsToTemplate
import com.itinfo.rutilvm.common.ovirtDf
import com.itinfo.rutilvm.util.ovirt.findAllDiskAttachmentsFromTemplate
import com.itinfo.rutilvm.util.ovirt.findCluster
import com.itinfo.rutilvm.util.ovirt.findDataCenter

import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.builders.*
import org.ovirt.engine.sdk4.types.*
import org.slf4j.LoggerFactory
import java.io.Serializable
import java.math.BigInteger
import java.util.Date

private val log = LoggerFactory.getLogger(TemplateVo::class.java)

/**
 * [TemplateVo]
 */
class TemplateVo(
	val id: String = "",
	val name: String = "",
	val description: String = "",
	val comment: String = "",
	val status: TemplateStatus = TemplateStatus.OK,
	val optimizeOption: String = "", // VmType
	val biosBootMenu: Boolean = false,
	val biosType: String = "", // chipsetFirmwareType
	val osType: String = "",
	val cpuArc: Architecture = Architecture.UNDEFINED,
	val cpuTopologyCnt: Int = 0,
	val cpuTopologyCore: Int = 0,
	val cpuTopologySocket: Int = 0,
	val cpuTopologyThread: Int = 0,
	val cpuPinningPolicy: String = "",
	val memorySize: BigInteger = BigInteger.ZERO,
	val memoryGuaranteed: BigInteger = BigInteger.ZERO,
	val memoryMax: BigInteger = BigInteger.ZERO,
	val ha: Boolean = false,
	val haPriority: Int = 0,
	val ioThreadCnt: Int = 0,
	val timeOffset: String = "Etc/GMT",
	val cloudInit: Boolean = false,
	val script: String = "",
	val placementPolicy: VmAffinity = VmAffinity.MIGRATABLE,
	val migrationMode: String = "",
	val migrationPolicy: String = "",
	val migrationAutoConverge: InheritableBoolean = InheritableBoolean.INHERIT,
	val migrationCompression: InheritableBoolean = InheritableBoolean.INHERIT,
	val migrationEncrypt: InheritableBoolean = InheritableBoolean.INHERIT,
	val migrationParallelPolicy: InheritableBoolean = InheritableBoolean.INHERIT,
	val parallelMigration: String = "",
	val storageErrorResumeBehaviour: VmStorageErrorResumeBehaviour = VmStorageErrorResumeBehaviour.AUTO_RESUME,
	val virtioScsiMultiQueueEnabled: Boolean = false,
	val firstDevice: String = "",
	val secDevice: String = "",
	val deviceList: List<String> = listOf(),
	val monitor: Int = 0,
	val displayType: DisplayType = DisplayType.VNC,
	val guestArc: String = "",
	val guestOsType: String = "",
	val guestDistribution: String = "",
	val guestKernelVer: String = "",
	val guestTimeZone: String = "",
	val deleteProtected: Boolean = false,
	val startPaused: Boolean = false,
	val usb: Boolean = false,
	val hostedEngineVm: Boolean = false,
	val fqdn: String = "",
	val nextRun: Boolean = false,
	val runOnce: Boolean = false,
	val upTime: String = "",
	private val _creationTime: Date? = null,
	private val _startTime: Date? = null,
	private val _stopTime: Date? = null,
	val ipv4: List<String> = listOf(),
	val ipv6: List<String> = listOf(),
	val hostInCluster: Boolean = false,
	val hostVos: List<IdentifiedVo> = listOf(),
	val storageDomainVo: IdentifiedVo = IdentifiedVo(),
	val cpuProfileVo: IdentifiedVo = IdentifiedVo(),
	val cdRomVo: IdentifiedVo = IdentifiedVo(),
	val dataCenterVo: IdentifiedVo = IdentifiedVo(),
	val clusterVo: IdentifiedVo = IdentifiedVo(),
	val hostVo: IdentifiedVo = IdentifiedVo(),
	val snapshotVos: List<IdentifiedVo> = listOf(),
	val hostDeviceVos: List<IdentifiedVo> = listOf(),
	val nicVos: List<NicVo> = listOf(),
	val diskAttachmentVos: List<DiskAttachmentVo> = listOf(),
	val vmVo: IdentifiedVo = IdentifiedVo(),
	val originTemplateVo: IdentifiedVo = IdentifiedVo(),
	val versionName: String = "",           // <version><version_name>
	val versionNumber: Int = 0,             // <version><version_number>
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	val creationTime: String
		get() = ovirtDf.formatEnhanced(_creationTime)
	val startTime: String
		get() = ovirtDf.formatEnhanced(_startTime)
	val stopTime: String
		get() = ovirtDf.formatEnhanced(_stopTime)

	class Builder {

		private var bId: String = ""; fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String = ""; fun name(block: () -> String?) { bName = block() ?: "" }
		private var bDescription: String = ""; fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bComment: String = ""; fun comment(block: () -> String?) { bComment = block() ?: "" }
		private var bStatus: TemplateStatus = TemplateStatus.OK; fun status(block: () -> TemplateStatus?) { bStatus = block() ?: TemplateStatus.OK }
		private var bOptimizeOption: String = ""; fun optimizeOption(block: () -> String?) { bOptimizeOption = block() ?: "" }
		private var bBiosBootMenu: Boolean = false; fun biosBootMenu(block: () -> Boolean?) { bBiosBootMenu = block() ?: false }
		private var bBiosType: String = ""; fun biosType(block: () -> String?) { bBiosType = block() ?: "" }
		private var bOsType: String = ""; fun osType(block: () -> String?) { bOsType = block() ?: "" }
		private var bCpuArc: Architecture = Architecture.UNDEFINED; fun cpuArc(block: () -> Architecture?) { bCpuArc = block() ?: Architecture.UNDEFINED }
		private var bCpuTopologyCnt: Int = 0; fun cpuTopologyCnt(block: () -> Int?) { bCpuTopologyCnt = block() ?: 0 }
		private var bCpuTopologyCore: Int = 0; fun cpuTopologyCore(block: () -> Int?) { bCpuTopologyCore = block() ?: 0 }
		private var bCpuTopologySocket: Int = 0; fun cpuTopologySocket(block: () -> Int?) { bCpuTopologySocket = block() ?: 0 }
		private var bCpuTopologyThread: Int = 0; fun cpuTopologyThread(block: () -> Int?) { bCpuTopologyThread = block() ?: 0 }
		private var bCpuPinningPolicy: String = ""; fun cpuPinningPolicy(block: () -> String?) { bCpuPinningPolicy = block() ?: "" }
		private var bMemorySize: BigInteger = BigInteger.ZERO; fun memorySize(block: () -> BigInteger?) { bMemorySize = block() ?: BigInteger.ZERO }
		private var bMemoryGuaranteed: BigInteger = BigInteger.ZERO; fun memoryGuaranteed(block: () -> BigInteger?) { bMemoryGuaranteed = block() ?: BigInteger.ZERO }
		private var bMemoryMax: BigInteger = BigInteger.ZERO; fun memoryMax(block: () -> BigInteger?) { bMemoryMax = block() ?: BigInteger.ZERO }
		private var bHa: Boolean = false; fun ha(block: () -> Boolean?) { bHa = block() ?: false }
		private var bHaPriority: Int = 0; fun haPriority(block: () -> Int?) { bHaPriority = block() ?: 0 }
		private var bIoThreadCnt: Int = 0; fun ioThreadCnt(block: () -> Int?) { bIoThreadCnt = block() ?: 0 }
		private var bTimeOffset: String = ""; fun timeOffset(block: () -> String?) { bTimeOffset = block() ?: "" }
		private var bCloudInit: Boolean = false; fun cloudInit(block: () -> Boolean?) { bCloudInit = block() ?: false }
		private var bScript: String = ""; fun script(block: () -> String?) { bScript = block() ?: "" }
		private var bPlacementPolicy: VmAffinity = VmAffinity.MIGRATABLE; fun placementPolicy(block: () -> VmAffinity?) { bPlacementPolicy = block() ?: VmAffinity.MIGRATABLE }
		private var bMigrationMode: String = ""; fun migrationMode(block: () -> String?) { bMigrationMode = block() ?: "" }
		private var bMigrationPolicy: String = ""; fun migrationPolicy(block: () -> String?) { bMigrationPolicy = block() ?: "" }
		private var bMigrationAutoConverge: InheritableBoolean = InheritableBoolean.INHERIT; fun migrationAutoConverge(block: () -> InheritableBoolean?) { bMigrationAutoConverge = block() ?: InheritableBoolean.INHERIT }
		private var bMigrationCompression: InheritableBoolean = InheritableBoolean.INHERIT; fun migrationCompression(block: () -> InheritableBoolean?) { bMigrationCompression = block() ?: InheritableBoolean.INHERIT }
		private var bMigrationEncrypt: InheritableBoolean = InheritableBoolean.INHERIT; fun migrationEncrypt(block: () -> InheritableBoolean?) { bMigrationEncrypt = block() ?: InheritableBoolean.INHERIT }
		private var bMigrationParallelPolicy: InheritableBoolean = InheritableBoolean.INHERIT; fun migrationParallelPolicy(block: () -> InheritableBoolean?) { bMigrationParallelPolicy = block() ?: InheritableBoolean.INHERIT }
		private var bParallelMigration: String = ""; fun parallelMigration(block: () -> String?) { bParallelMigration = block() ?: "" }
		private var bStorageErrorResumeBehaviour: VmStorageErrorResumeBehaviour = VmStorageErrorResumeBehaviour.AUTO_RESUME; fun storageErrorResumeBehaviour(block: () -> VmStorageErrorResumeBehaviour?) { bStorageErrorResumeBehaviour = block() ?: VmStorageErrorResumeBehaviour.AUTO_RESUME }
		private var bVirtioScsiMultiQueueEnabled: Boolean = false; fun virtioScsiMultiQueueEnabled(block: () -> Boolean?) { bVirtioScsiMultiQueueEnabled = block() ?: false }
		private var bFirstDevice: String = ""; fun firstDevice(block: () -> String?) { bFirstDevice = block() ?: "" }
		private var bSecDevice: String = ""; fun secDevice(block: () -> String?) { bSecDevice = block() ?: "" }
		private var bDeviceList: List<String> = listOf(); fun deviceList(block: () -> List<String>?) { bDeviceList = block() ?: listOf() }
		private var bMonitor: Int = 0; fun monitor(block: () -> Int?) { bMonitor = block() ?: 0 }
		private var bDisplayType: DisplayType = DisplayType.VNC; fun displayType(block: () -> DisplayType?) { bDisplayType = block() ?: DisplayType.VNC }
		private var bGuestArc: String = ""; fun guestArc(block: () -> String?) { bGuestArc = block() ?: "" }
		private var bGuestOsType: String = ""; fun guestOsType(block: () -> String?) { bGuestOsType = block() ?: "" }
		private var bGuestDistribution: String = ""; fun guestDistribution(block: () -> String?) { bGuestDistribution = block() ?: "" }
		private var bGuestKernelVer: String = ""; fun guestKernelVer(block: () -> String?) { bGuestKernelVer = block() ?: "" }
		private var bGuestTimeZone: String = ""; fun guestTimeZone(block: () -> String?) { bGuestTimeZone = block() ?: "" }
		private var bDeleteProtected: Boolean = false; fun deleteProtected(block: () -> Boolean?) { bDeleteProtected = block() ?: false }
		private var bStartPaused: Boolean = false; fun startPaused(block: () -> Boolean?) { bStartPaused = block() ?: false }
		private var bUsb: Boolean = false; fun usb(block: () -> Boolean?) { bUsb = block() ?: false }
		private var bHostedEngineVm: Boolean = false; fun hostedEngineVm(block: () -> Boolean?) { bHostedEngineVm = block() ?: false }
		private var bFqdn: String = ""; fun fqdn(block: () -> String?) { bFqdn = block() ?: "" }
		private var bNextRun: Boolean = false; fun nextRun(block: () -> Boolean?) { bNextRun = block() ?: false }
		private var bRunOnce: Boolean = false; fun runOnce(block: () -> Boolean?) { bRunOnce = block() ?: false }
		private var bUpTime: String = ""; fun upTime(block: () -> String?) { bUpTime = block() ?: "" }
		private var bCreationTime: Date? = null; fun creationTime(block: () -> Date?) { bCreationTime = block() }
		private var bStartTime: Date? = null; fun startTime(block: () -> Date?) { bStartTime = block() }
		private var bStopTime: Date? = null; fun stopTime(block: () -> Date?) { bStopTime = block() }
		private var bIpv4: List<String> = listOf(); fun ipv4(block: () -> List<String>?) { bIpv4 = block() ?: listOf() }
		private var bIpv6: List<String> = listOf(); fun ipv6(block: () -> List<String>?) { bIpv6 = block() ?: listOf() }
		private var bHostInCluster: Boolean = false; fun hostInCluster(block: () -> Boolean?) { bHostInCluster = block() ?: false }
		private var bHostVos: List<IdentifiedVo> = listOf(); fun hostVos(block: () -> List<IdentifiedVo>?) { bHostVos = block() ?: listOf() }
		private var bStorageDomainVo: IdentifiedVo = IdentifiedVo(); fun storageDomainVo(block: () -> IdentifiedVo?) { bStorageDomainVo = block() ?: IdentifiedVo() }
		private var bCpuProfileVo: IdentifiedVo = IdentifiedVo(); fun cpuProfileVo(block: () -> IdentifiedVo?) { bCpuProfileVo = block() ?: IdentifiedVo() }
		private var bCdRomVo: IdentifiedVo = IdentifiedVo(); fun cdRomVo(block: () -> IdentifiedVo?) { bCdRomVo = block() ?: IdentifiedVo() }
		private var bDataCenterVo: IdentifiedVo = IdentifiedVo(); fun dataCenterVo(block: () -> IdentifiedVo?) { bDataCenterVo = block() ?: IdentifiedVo() }
		private var bClusterVo: IdentifiedVo = IdentifiedVo(); fun clusterVo(block: () -> IdentifiedVo?) { bClusterVo = block() ?: IdentifiedVo() }
		private var bHostVo: IdentifiedVo = IdentifiedVo(); fun hostVo(block: () -> IdentifiedVo?) { bHostVo = block() ?: IdentifiedVo() }
		private var bSnapshotVos: List<IdentifiedVo> = listOf(); fun snapshotVos(block: () -> List<IdentifiedVo>?) { bSnapshotVos = block() ?: listOf() }
		private var bHostDeviceVos: List<IdentifiedVo> = listOf(); fun hostDeviceVos(block: () -> List<IdentifiedVo>?) { bHostDeviceVos = block() ?: listOf() }
		private var bNicVos: List<NicVo> = listOf(); fun nicVos(block: () -> List<NicVo>?) { bNicVos = block() ?: listOf() }
		private var bDiskAttachmentVos: List<DiskAttachmentVo> = listOf(); fun diskAttachmentVos(block: () -> List<DiskAttachmentVo>?) { bDiskAttachmentVos = block() ?: listOf() }
		private var bVmVo: IdentifiedVo = IdentifiedVo(); fun vmVo(block: () -> IdentifiedVo?) { bVmVo = block() ?: IdentifiedVo() }
		private var bOriginTemplateVo: IdentifiedVo = IdentifiedVo(); fun originTemplateVo(block: () -> IdentifiedVo?) { bOriginTemplateVo = block() ?: IdentifiedVo() }
		private var bVersionName: String = ""; fun versionName(block: () -> String?) { bVersionName = block() ?: "" }
		private var bVersionNumber: Int = 0; fun versionNumber(block: () -> Int?) { bVersionNumber = block() ?: 0 }

		fun build(): TemplateVo = TemplateVo(bId, bName, bDescription, bComment, bStatus, bOptimizeOption, bBiosBootMenu, bBiosType, bOsType, bCpuArc, bCpuTopologyCnt, bCpuTopologyCore, bCpuTopologySocket, bCpuTopologyThread, bCpuPinningPolicy, bMemorySize, bMemoryGuaranteed, bMemoryMax, bHa, bHaPriority, bIoThreadCnt, bTimeOffset, bCloudInit, bScript, bPlacementPolicy, bMigrationMode, bMigrationPolicy, bMigrationAutoConverge, bMigrationCompression, bMigrationEncrypt, bMigrationParallelPolicy, bParallelMigration, bStorageErrorResumeBehaviour, bVirtioScsiMultiQueueEnabled, bFirstDevice, bSecDevice, bDeviceList, bMonitor, bDisplayType, bGuestArc, bGuestOsType, bGuestDistribution, bGuestKernelVer, bGuestTimeZone, bDeleteProtected, bStartPaused, bUsb, bHostedEngineVm, bFqdn, bNextRun, bRunOnce, bUpTime, bCreationTime, bStartTime, bStopTime, bIpv4, bIpv6, bHostInCluster, bHostVos, bStorageDomainVo, bCpuProfileVo, bCdRomVo, bDataCenterVo, bClusterVo, bHostVo, bSnapshotVos, bHostDeviceVos, bNicVos, bDiskAttachmentVos, bVmVo, bOriginTemplateVo, bVersionName, bVersionNumber)
	}

	companion object {
		const val DEFAULT_BLANK_TEMPLATE_ID = "00000000-0000-0000-0000-000000000000" /* Blank 탬플릿 (기본적으로 생성 됨) */
		inline fun builder(block: Builder.() -> Unit): TemplateVo = TemplateVo.Builder().apply(block).build()
	}
}

fun Template.toTemplateIdName(): TemplateVo = TemplateVo.builder {
	id { this@toTemplateIdName.id() }
	name { this@toTemplateIdName.name() }
}
fun List<Template>.toTemplateIdNames(): List<TemplateVo> =
	this@toTemplateIdNames.map { it.toTemplateIdName() }


fun Template.toTemplateMenu(conn: Connection): TemplateVo {
	val cluster: Cluster? =
		if(this@toTemplateMenu.clusterPresent()) conn.findCluster(this@toTemplateMenu.cluster().id()).getOrNull()
		else null
	val dataCenter: DataCenter? = cluster?.dataCenter()?.let { conn.findDataCenter(it.id()).getOrNull() }

	return TemplateVo.builder {
		id { this@toTemplateMenu.id() }
		name { this@toTemplateMenu.name() }
		comment { this@toTemplateMenu.comment() }
		description { this@toTemplateMenu.description() }
		creationTime { this@toTemplateMenu.creationTime() }
		status { this@toTemplateMenu.status() }
		clusterVo { cluster?.fromClusterToIdentifiedVo() }
		dataCenterVo { dataCenter?.fromDataCenterToIdentifiedVo() }
	}
}
fun List<Template>.toTemplateMenus(conn: Connection): List<TemplateVo> =
	this@toTemplateMenus.map { it.toTemplateMenu(conn) }


fun Template.toTemplateInfo(conn: Connection): TemplateVo {
	val template = this@toTemplateInfo
	val cluster: Cluster? =
		if(template.clusterPresent()) { conn.findCluster(template.cluster().id()).getOrNull() }
		else { null }

	return TemplateVo.builder {
		id { template.id() }
		name { template.name() }
		comment { template.comment()}
		description { template.description() }
		status { template.status() }
		creationTime { template.creationTime() }
		osType { if (template.osPresent()) Os.findByCode(template.os().type()).fullName else null }
		biosType { if (template.bios().typePresent()) template.bios().type().findBios() else null }
		optimizeOption { template.type().value() } // 최적화 옵션 template.type().findVmType()
		memorySize { template.memory() }
		cpuTopologyCore { template.cpu().topology().coresAsInteger() }
		cpuTopologySocket { template.cpu().topology().socketsAsInteger() }
		cpuTopologyThread { template.cpu().topology().threadsAsInteger() }
		cpuTopologyCnt { calculateCpuTopology(template) }
		displayType { if(template.displayPresent()) template.display().type() else DisplayType.VNC }
		ha { template.highAvailability().enabled() }
		haPriority { template.highAvailability().priorityAsInteger() }
		clusterVo { cluster?.fromClusterToIdentifiedVo() }
	}
}

fun Template.toStorageTemplate(conn: Connection): TemplateVo {
	val template = this@toStorageTemplate
	val disks: List<DiskAttachment> = conn.findAllDiskAttachmentsFromTemplate(template.id()).getOrDefault(emptyList());
	return TemplateVo.builder {
		id { template.id() }
		name { template.name() }
		comment { template.comment() }
		description { template.description() }
		creationTime { template.creationTime() }
		status { template.status() }
		diskAttachmentVos { disks.toDiskAttachmentsToTemplate(conn) }
	}
}
fun List<Template>.toStorageTemplates(conn: Connection): List<TemplateVo> =
	this@toStorageTemplates.map { it.toStorageTemplate(conn) }


fun Template.toUnregisterdTemplate(): TemplateVo {
	val template = this@toUnregisterdTemplate

	return TemplateVo.builder {
		id { template.id() }
		name { template.name() }
		description { template.description() }
		comment { template.comment() }
		biosType { if (template.bios().typePresent()) template.bios().type().findBios() else null }
		cpuArc { template.cpu().architecture() }
		cpuTopologyCnt { calculateCpuTopology(template) }
		cpuTopologyCore { template.cpu().topology().coresAsInteger() }
		cpuTopologySocket { template.cpu().topology().socketsAsInteger() }
		cpuTopologyThread { template.cpu().topology().threadsAsInteger() }
		osType { template.os().type() }
		optimizeOption { template.type().toString() }
		creationTime { template.creationTime() }
		displayType { if(template.displayPresent()) template.display().type() else DisplayType.VNC }
		ha { template.highAvailability().enabled() }
		haPriority { template.highAvailability().priorityAsInteger() }
		memorySize { template.memory() }
		// usb { if(template.usbPresent()) template.usb().enabled() else false }
		// stateless { template.stateless() }
	}
}
fun List<Template>.toUnregisterdTemplates() =
	this@toUnregisterdTemplates.map { it.toUnregisterdTemplate() }



// region: builder
/**
 * 템플릿 빌더
 */
fun TemplateVo.toTemplateBuilder(): TemplateBuilder {
	return TemplateBuilder()
		.name(name)
		.description(description)
		.comment(comment)
		.cluster(ClusterBuilder().id(clusterVo.id).build())
}

fun TemplateVo.toAddTemplate(): Template {
	val diskAttachments: List<DiskAttachment> = diskAttachmentVos.map { disk ->
		DiskAttachmentBuilder().disk(disk.diskImageVo.toAddTemplateDisk()).build()
	}
	return toTemplateBuilder()
		.vm(VmBuilder().id(vmVo.id).diskAttachments(diskAttachments).build())
		.cpuProfile(CpuProfileBuilder().id(cpuProfileVo.id).build())
		.build()
}

fun TemplateVo.toEditTemplate(): Template {
	return toTemplateBuilder()
		.id(id)
		.os(OperatingSystemBuilder().type(osType))
		.bios(BiosBuilder().type(BiosType.fromValue(biosType)))
		.type(VmType.fromValue(optimizeOption))
		// .stateless(stateless)
		// .startPaused(startPaused)
		// .deleteProtected(deleteProtected)
		.build()
}

fun TemplateVo.toRegisterTemplate(): Template {
	return TemplateBuilder()
		.id(this.id)
		.cluster(
			ClusterBuilder().id(this.clusterVo.id).build())
		.build()
}

// endregion

private fun calculateCpuTopology(template: Template): Int {
	val topology = template.cpu().topology()
	return topology.coresAsInteger() * topology.socketsAsInteger() * topology.threadsAsInteger()
}
