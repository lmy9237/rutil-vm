package com.itinfo.rutilvm.api.model.computing;

import com.itinfo.rutilvm.api.formatEnhanced
import com.itinfo.rutilvm.util.ovirt.findBios
import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.api.model.Os
import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.model.fromClusterToIdentifiedVo
import com.itinfo.rutilvm.api.model.fromDataCenterToIdentifiedVo
import com.itinfo.rutilvm.api.model.network.NicVo
import com.itinfo.rutilvm.api.model.storage.DiskAttachmentVo
import com.itinfo.rutilvm.api.ovirtDf
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
 *
 * @property id [String] template Id
 * @property name [String]
 * @property status [TemplateStatus] TemplateStatus
 */
class TemplateVo(
	val id: String = "",
	val name: String = "",
	val description: String = "",
	val comment: String = "",
	val chipsetFirmwareType: String = "",
	val cpuArc: Architecture = Architecture.UNDEFINED,
	val cpuTopologyCnt: Int = 0,
	val cpuTopologyCore: Int = 0,
	val cpuTopologySocket: Int = 0,
	val cpuTopologyThread: Int = 0,
	val cpuPinningPolicy: String = "",
	val cpuShare: Int = 0,
	private val _creationTime: Date? = null,
	val deleteProtected: Boolean = false,
	val monitor: Int = 0,
	val ha: Boolean = false,
	val priority: Int = 0,
	val ioThreadCnt: Int = 0,
	val memorySize: BigInteger = BigInteger.ZERO,
	val memoryBalloon: Boolean = false,
	val memoryActual: BigInteger = BigInteger.ZERO,
	val memoryMax: BigInteger = BigInteger.ZERO,
	val migrationMode: String = "",
	val migrationPolicy: String = "",
	val migrationEncrypt: InheritableBoolean = InheritableBoolean.INHERIT,
	val parallelMigration: String = "",
	val multiQue: Boolean = false,
	val origin: String = "",
	val osSystem: String = "",
	val deviceList: List<String> = listOf(),
	val firstDevice: String = "",
	val secDevice: String = "",
	val placement: String = "",
	val startPaused: Boolean = false,
	val stateless: Boolean = false,
	val timeZone: String = "",
	val optimizeOption: String = "",
	val usb: Boolean = false,
	val virtSCSIEnable: Boolean = false,
	val status: TemplateStatus = TemplateStatus.LOCKED,
	val versionName: String = "",
	val versionNum: Int = 0,
	val baseTemplate: IdentifiedVo = IdentifiedVo(),
	val clusterVo: IdentifiedVo = IdentifiedVo(),
	val dataCenterVo: IdentifiedVo = IdentifiedVo(),
	val vmVo: IdentifiedVo = IdentifiedVo(),
	val cpuProfileVo: IdentifiedVo = IdentifiedVo(),
	val nicVos: List<NicVo> = listOf(),
	val diskAttachmentVos: List<DiskAttachmentVo> = listOf(),
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	val creationTime: String
		get() = ovirtDf.formatEnhanced(_creationTime)

	class Builder {
		private var bId: String = ""; fun id(block: () -> String?) { bId = block() ?: ""}
		private var bName: String = ""; fun name(block: () -> String?) { bName = block() ?: ""}
		private var bDescription: String = ""; fun description(block: () -> String?) { bDescription = block() ?: ""}
		private var bComment: String = ""; fun comment(block: () -> String?) { bComment = block() ?: ""}
		private var bChipsetFirmwareType: String = ""; fun chipsetFirmwareType(block: () -> String?) { bChipsetFirmwareType = block() ?: ""}
		private var bCpuArc: Architecture = Architecture.UNDEFINED; fun cpuArc(block: () -> Architecture?) { bCpuArc = block() ?: Architecture.UNDEFINED}
		private var bCpuTopologyCnt: Int = 0; fun cpuTopologyCnt(block: () -> Int?) { bCpuTopologyCnt = block() ?: 0}
		private var bCpuTopologyCore: Int = 0; fun cpuTopologyCore(block: () -> Int?) { bCpuTopologyCore = block() ?: 0}
		private var bCpuTopologySocket: Int = 0; fun cpuTopologySocket(block: () -> Int?) { bCpuTopologySocket = block() ?: 0}
		private var bCpuTopologyThread: Int = 0; fun cpuTopologyThread(block: () -> Int?) { bCpuTopologyThread = block() ?: 0}
		private var bCpuPinningPolicy: String = ""; fun cpuPinningPolicy(block: () -> String?) { bCpuPinningPolicy = block() ?: ""}
		private var bCpuShare: Int = 0; fun cpuShare(block: () -> Int?) { bCpuShare = block() ?: 0}
		private var bCreationTime: Date? = null; fun creationTime(block: () -> Date?) { bCreationTime = block() }
		private var bDeleteProtected: Boolean = false; fun deleteProtected(block: () -> Boolean?) { bDeleteProtected = block() ?: false}
		private var bMonitor: Int = 0; fun monitor(block: () -> Int?) { bMonitor = block() ?: 0}
		private var bHa: Boolean = false; fun ha(block: () -> Boolean?) { bHa = block() ?: false}
		private var bPriority: Int = 0; fun priority(block: () -> Int?) { bPriority = block() ?: 0}
		private var bIoThreadCnt: Int = 0; fun ioThreadCnt(block: () -> Int?) { bIoThreadCnt = block() ?: 0}
		private var bMemorySize: BigInteger = BigInteger.ZERO; fun memorySize(block: () -> BigInteger?) { bMemorySize = block() ?: BigInteger.ZERO}
		private var bMemoryBalloon: Boolean = false; fun memoryBalloon(block: () -> Boolean?) { bMemoryBalloon = block() ?: false}
		private var bMemoryActual: BigInteger = BigInteger.ZERO; fun memoryActual(block: () -> BigInteger?) { bMemoryActual = block() ?: BigInteger.ZERO}
		private var bMemoryMax: BigInteger = BigInteger.ZERO; fun memoryMax(block: () -> BigInteger?) { bMemoryMax = block() ?: BigInteger.ZERO}
		private var bMigrationMode: String = ""; fun migrationMode(block: () -> String?) { bMigrationMode = block() ?: ""}
		private var bMigrationPolicy: String = ""; fun migrationPolicy(block: () -> String?) { bMigrationPolicy = block() ?: ""}
		private var bMigrationEncrypt: InheritableBoolean = InheritableBoolean.INHERIT; fun migrationEncrypt(block: () -> InheritableBoolean?) { bMigrationEncrypt = block() ?: InheritableBoolean.INHERIT}
		private var bParallelMigration: String = ""; fun parallelMigration(block: () -> String?) { bParallelMigration = block() ?: ""}
		private var bMultiQue: Boolean = false; fun multiQue(block: () -> Boolean?) { bMultiQue = block() ?: false}
		private var bOrigin: String = ""; fun origin(block: () -> String?) { bOrigin = block() ?: ""}
		private var bOsSystem: String = ""; fun osSystem(block: () -> String?) { bOsSystem = block() ?: ""}
		private var bDeviceList: List<String> = listOf(); fun deviceList(block: () -> List<String>?) { bDeviceList = block() ?: listOf() }
		private var bFirstDevice: String = ""; fun firstDevice(block: () -> String?) { bFirstDevice = block() ?: ""}
		private var bSecDevice: String = ""; fun secDevice(block: () -> String?) { bSecDevice = block() ?: ""}
		private var bPlacement: String = ""; fun placement(block: () -> String?) { bPlacement = block() ?: ""}
		private var bStartPaused: Boolean = false; fun startPaused(block: () -> Boolean?) { bStartPaused = block() ?: false}
		private var bStateless: Boolean = false; fun stateless(block: () -> Boolean?) { bStateless = block() ?: false}
		private var bTimeZone: String = ""; fun timeZone(block: () -> String?) { bTimeZone = block() ?: ""}
		private var bOptimizeOption: String = ""; fun optimizeOption(block: () -> String?) { bOptimizeOption = block() ?: ""}
		private var bUsb: Boolean = false; fun usb(block: () -> Boolean?) { bUsb = block() ?: false}
		private var bVirtSCSIEnable: Boolean = false; fun virtSCSIEnable(block: () -> Boolean?) { bVirtSCSIEnable = block() ?: false}
		private var bStatus: TemplateStatus = TemplateStatus.LOCKED; fun status(block: () -> TemplateStatus?) { bStatus = block() ?: TemplateStatus.LOCKED}
		private var bVersionName: String = ""; fun versionName(block: () -> String?) { bVersionName = block() ?: ""}
		private var bVersionNum: Int = 0; fun versionNum(block: () -> Int?) { bVersionNum = block() ?: 0}
		private var bBaseTemplate: IdentifiedVo = IdentifiedVo(); fun baseTemplate(block: () -> IdentifiedVo?) { bBaseTemplate = block() ?: IdentifiedVo()}
		private var bClusterVo: IdentifiedVo = IdentifiedVo(); fun clusterVo(block: () -> IdentifiedVo?) { bClusterVo = block() ?: IdentifiedVo()}
		private var bDataCenterVo: IdentifiedVo = IdentifiedVo(); fun dataCenterVo(block: () -> IdentifiedVo?) { bDataCenterVo = block() ?: IdentifiedVo()}
		private var bVmVo: IdentifiedVo = IdentifiedVo(); fun vmVo(block: () -> IdentifiedVo?) { bVmVo = block() ?: IdentifiedVo()}
		private var bCpuProfileVo: IdentifiedVo = IdentifiedVo(); fun cpuProfileVo(block: () -> IdentifiedVo?) { bCpuProfileVo = block() ?: IdentifiedVo()}
		private var bNicVos: List<NicVo> = listOf(); fun nicVos(block: () -> List<NicVo>?) { bNicVos = block() ?: listOf() }
		private var bDiskAttachmentVos: List<DiskAttachmentVo> = listOf(); fun diskAttachmentVos(block: () -> List<DiskAttachmentVo>?) { bDiskAttachmentVos = block() ?: listOf() }
		fun build(): TemplateVo = TemplateVo(bId,bName,bDescription,bComment,bChipsetFirmwareType,bCpuArc,bCpuTopologyCnt,bCpuTopologyCore,bCpuTopologySocket,bCpuTopologyThread,bCpuPinningPolicy,bCpuShare,bCreationTime,bDeleteProtected,bMonitor,bHa,bPriority,bIoThreadCnt,bMemorySize,bMemoryBalloon,bMemoryActual,bMemoryMax,bMigrationMode,bMigrationPolicy,bMigrationEncrypt,bParallelMigration,bMultiQue,bOrigin,bOsSystem,bDeviceList,bFirstDevice,bSecDevice,bPlacement,bStartPaused,bStateless,bTimeZone,bOptimizeOption,bUsb,bVirtSCSIEnable,bStatus,bVersionName,bVersionNum,bBaseTemplate,bClusterVo,bDataCenterVo,bVmVo,bCpuProfileVo,bNicVos,bDiskAttachmentVos,)
	}

	companion object {
		const val DEFAULT_BLANK_TEMPLATE_ID = "00000000-0000-0000-0000-000000000000" /* Blank 탬플릿 (기본적으로 생성 됨) */
		inline fun builder(block: TemplateVo.Builder.() -> Unit): TemplateVo = TemplateVo.Builder().apply(block).build()
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
		versionName { if (template.versionPresent()) template.version().versionName() else "" }
		versionNum { if (template.versionPresent()) template.version().versionNumberAsInteger() else 0 }
		creationTime { template.creationTime() }
		osSystem { if (template.osPresent()) Os.findByCode(template.os().type()).fullName else null }
		chipsetFirmwareType { if (template.bios().typePresent()) template.bios().type().findBios() else null }
		optimizeOption { template.type().value() } // 최적화 옵션 template.type().findVmType()
		memorySize { template.memory() }
		cpuTopologyCore { template.cpu().topology().coresAsInteger() }
		cpuTopologySocket { template.cpu().topology().socketsAsInteger() }
		cpuTopologyThread { template.cpu().topology().threadsAsInteger() }
		cpuTopologyCnt {
			template.cpu().topology().coresAsInteger() *
			template.cpu().topology().socketsAsInteger() *
			template.cpu().topology().threadsAsInteger()
		}
		monitor { if(template.displayPresent()) template.display().monitorsAsInteger() else 0 }
		ha { template.highAvailability().enabled() }
		priority { template.highAvailability().priorityAsInteger() }
		usb { template.usb().enabled() }
		clusterVo { cluster?.fromClusterToIdentifiedVo() }
	}
}

fun Template.toStorageTemplate(conn: Connection): TemplateVo {
	return TemplateVo.builder {
		id { this@toStorageTemplate.id() }
		name { this@toStorageTemplate.name() }
		comment { this@toStorageTemplate.comment() }
		description { this@toStorageTemplate.description() }
		creationTime { this@toStorageTemplate.creationTime() }
		status { this@toStorageTemplate.status() }
	}
}
fun List<Template>.toStorageTemplates(conn: Connection): List<TemplateVo> =
	this@toStorageTemplates.map { it.toStorageTemplate(conn) }


fun Template.toUnregisterdTemplate(): TemplateVo {
	val template = this@toUnregisterdTemplate

	return TemplateVo.builder {
		id { template.id() }
		name { template.name() }
		creationTime { template.creationTime() }
		cpuArc { template.cpu().architecture() }
		memorySize { template.memory() }
		cpuTopologyCnt {
			template.cpu().topology().coresAsInteger() *
				template.cpu().topology().socketsAsInteger() *
				template.cpu().topology().threadsAsInteger()
		}
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
		.cluster(ClusterBuilder().id(clusterVo.id))
}

fun TemplateVo.toAddTemplate(): Template {
	val diskAttachments: List<DiskAttachment> = diskAttachmentVos.map { disk ->
		DiskAttachmentBuilder()
			.disk(
				DiskBuilder()
					.id(disk.diskImageVo.id)
					.alias(disk.diskImageVo.alias)
					.format(disk.diskImageVo.format)
					.sparse(false)
					.storageDomains(*arrayOf(StorageDomainBuilder().id(disk.diskImageVo.storageDomainVo.id).build()))
					.diskProfile(DiskProfileBuilder().id(disk.diskImageVo.diskProfileVo.id).build())
					.build()
			).build()
	}
	return toTemplateBuilder()
		.vm(VmBuilder().id(vmVo.id).diskAttachments(diskAttachments).build())
		.cpuProfile(CpuProfileBuilder().id(cpuProfileVo.id))
		.build()
}

fun TemplateVo.toEditTemplate(): Template {
	return toTemplateBuilder()
		.id(id)
		.os(OperatingSystemBuilder().type(osSystem))
		.bios(BiosBuilder().type(BiosType.fromValue(chipsetFirmwareType)))
		.type(VmType.fromValue(optimizeOption))
		.build()
}

/**
 * <template>
 *   <name>mytemplate</name>
 *   <vm id="123">
 *     <disk_attachments>
 *       <disk_attachment>
 *         <disk id="456">
 *           <name>mydisk</name>
 *           <format>cow</format>
 *           <sparse>true</sparse>
 *         </disk>
 *       </disk_attachment>
 *     </disk_attachments>
 *   </vm>
 * </template>
 */

// endregion
