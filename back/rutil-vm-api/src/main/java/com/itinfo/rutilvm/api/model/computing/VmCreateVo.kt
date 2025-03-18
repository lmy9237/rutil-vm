package com.itinfo.rutilvm.api.model.computing

import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.api.model.*
import com.itinfo.rutilvm.api.model.network.*
import com.itinfo.rutilvm.api.model.storage.*
import com.itinfo.rutilvm.util.ovirt.*
import org.ovirt.engine.sdk4.Connection

import org.ovirt.engine.sdk4.builders.*
import org.ovirt.engine.sdk4.types.*
import org.slf4j.LoggerFactory
import java.io.Serializable
import java.math.BigInteger

private val log = LoggerFactory.getLogger(VmCreateVo::class.java)

/**
 * [VmCreateVo]
 *
 * @property id [String]
 * @property name [String]
 * @property description [String]
 * @property comment [String]
 * @property osSystem [String]
 * @property osType [String] //chipsetFirmwareType
 * @property optimizeOption [String]
 * @property memorySize [BigInteger]
 * @property memoryMax [BigInteger]
 * @property memoryActual [BigInteger]
 * @property cpuTopologyCnt [Int]
 * @property cpuTopologyCore [Int]
 * @property cpuTopologySocket [Int]
 * @property cpuTopologyThread [Int]
 // * @property timeOffset [String]
 * @property cloudInit [Boolean]
 * @property script [String]
 * @property migrationMode [String]
 * @property migrationPolicy [String]
 * @property migrationEncrypt [InheritableBoolean]
 * @property parallelMigration [String]
 * @property ha [Boolean]
 * @property priority [Int]
 * @property bootingMenu [Boolean]
 * @property firstDevice [String]
 * @property secDevice [String]
 * @property deviceList List<[String]>
 * @property hostInCluster [Boolean]
 * @property hostVos List<[IdentifiedVo]>
 * @property storageDomainVo [IdentifiedVo]
 * @property cpuProfileVo [IdentifiedVo]
 * @property connVo [IdentifiedVo]
 * @property dataCenterVo [IdentifiedVo]
 * @property clusterVo [IdentifiedVo]
 * @property templateVo [IdentifiedVo]
 * @property nicVos List<[NicVo]>
 * @property diskAttachmentVos List<[DiskAttachmentVo]>
 */
class VmCreateVo (
    val id: String = "",
    val name: String = "",
	val description: String = "",
	val comment: String = "",
	val osSystem: String = "",
	val osType: String = "",
	val optimizeOption: String = "",
	val memorySize: BigInteger = BigInteger.ZERO,
	val memoryMax: BigInteger = BigInteger.ZERO,
	val memoryActual: BigInteger = BigInteger.ZERO,
    val cpuTopologyCnt: Int = 0,
    val cpuTopologyCore: Int = 0,
    val cpuTopologySocket: Int = 0,
    val cpuTopologyThread: Int = 0,
    // val timeOffset: String = "Asia/Seoul",
    val cloudInit: Boolean = false,
    val script: String = "",
    val migrationMode: String = "",
    val migrationPolicy: String = "",
    val migrationEncrypt: InheritableBoolean = InheritableBoolean.INHERIT,
    val parallelMigration: String = "",
    val ha: Boolean = false,
    val priority: Int = 0,
	val bootingMenu: Boolean = false,
    val firstDevice: String = "",
    val secDevice: String = "",
    val deviceList: List<String> = listOf(),
	val hostInCluster: Boolean = false,
	val hostVos: List<IdentifiedVo> = listOf(),
    val storageDomainVo: IdentifiedVo = IdentifiedVo(),
    val cpuProfileVo: IdentifiedVo = IdentifiedVo(),
    val connVo: IdentifiedVo = IdentifiedVo(),
	val dataCenterVo: IdentifiedVo = IdentifiedVo(),
	val clusterVo: IdentifiedVo = IdentifiedVo(),
	val templateVo: IdentifiedVo = IdentifiedVo(),
	val nicVos: List<NicVo> = listOf(),
	val diskAttachmentVos: List<DiskAttachmentVo> = listOf(),
): Serializable {
    override fun toString(): String =
        gson.toJson(this)

    class Builder {
		private var bId: String = ""; fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String = ""; fun name(block: () -> String?) { bName = block() ?: "" }
		private var bDescription: String = ""; fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bComment: String = ""; fun comment(block: () -> String?) { bComment = block() ?: "" }
		private var bOsSystem: String = ""; fun osSystem(block: () -> String?) { bOsSystem = block() ?: "" }
		private var bOsType: String = ""; fun osType(block: () -> String?) { bOsType = block() ?: "" }
		private var bOptimizeOption: String = ""; fun optimizeOption(block: () -> String?) { bOptimizeOption = block() ?: "" }
		private var bMemorySize: BigInteger = BigInteger.ZERO; fun memorySize(block: () -> BigInteger?) { bMemorySize = block() ?: BigInteger.ZERO }
		private var bMemoryMax: BigInteger = BigInteger.ZERO; fun memoryMax(block: () -> BigInteger?) { bMemoryMax = block() ?: BigInteger.ZERO }
		private var bMemoryActual: BigInteger = BigInteger.ZERO; fun memoryActual(block: () -> BigInteger?) { bMemoryActual = block() ?: BigInteger.ZERO }
		private var bCpuTopologyCnt: Int = 0; fun cpuTopologyCnt(block: () -> Int?) { bCpuTopologyCnt = block() ?: 0 }
		private var bCpuTopologyCore: Int = 0; fun cpuTopologyCore(block: () -> Int?) { bCpuTopologyCore = block() ?: 0 }
		private var bCpuTopologySocket: Int = 0; fun cpuTopologySocket(block: () -> Int?) { bCpuTopologySocket = block() ?: 0 }
		private var bCpuTopologyThread: Int = 0; fun cpuTopologyThread(block: () -> Int?) { bCpuTopologyThread = block() ?: 0 }
		// private var bTimeOffset: String = "Asia/Seoul"; fun timeOffset(block: () -> String?) { bTimeOffset = block() ?: "Asia/Seoul" }
		private var bCloudInit: Boolean = false; fun cloudInit(block: () -> Boolean?) { bCloudInit = block() ?: false }
		private var bScript: String = ""; fun script(block: () -> String?) { bScript = block() ?: "" }
		private var bMigrationMode: String = ""; fun migrationMode(block: () -> String?) { bMigrationMode = block() ?: "" }
		private var bMigrationPolicy: String = ""; fun migrationPolicy(block: () -> String?) { bMigrationPolicy = block() ?: "" }
		private var bMigrationEncrypt: InheritableBoolean = InheritableBoolean.INHERIT; fun migrationEncrypt(block: () -> InheritableBoolean?) { bMigrationEncrypt = block() ?: InheritableBoolean.INHERIT }
		private var bParallelMigration: String = ""; fun parallelMigration(block: () -> String?) { bParallelMigration = block() ?: "" }
		private var bHa: Boolean = false; fun ha(block: () -> Boolean?) { bHa = block() ?: false }
		private var bPriority: Int = 0; fun priority(block: () -> Int?) { bPriority = block() ?: 0 }
		private var bBootingMenu: Boolean = false; fun bootingMenu(block: () -> Boolean?) { bBootingMenu = block() ?: false }
		private var bFirstDevice: String = ""; fun firstDevice(block: () -> String?) { bFirstDevice = block() ?: "" }
		private var bSecDevice: String = ""; fun secDevice(block: () -> String?) { bSecDevice = block() ?: "" }
		private var bDeviceList: List<String> = listOf(); fun deviceList(block: () -> List<String>?) { bDeviceList = block() ?: listOf() }
		private var bHostInCluster: Boolean = false; fun hostInCluster(block: () -> Boolean?) { bHostInCluster = block() ?: false }
		private var bHostVos: List<IdentifiedVo> = listOf(); fun hostVos(block: () -> List<IdentifiedVo>?) { bHostVos = block() ?: listOf() }
		private var bStorageDomainVo: IdentifiedVo = IdentifiedVo(); fun storageDomainVo(block: () -> IdentifiedVo?) { bStorageDomainVo = block() ?: IdentifiedVo() }
		private var bCpuProfileVo: IdentifiedVo = IdentifiedVo(); fun cpuProfileVo(block: () -> IdentifiedVo?) { bCpuProfileVo = block() ?: IdentifiedVo() }
		private var bConnVo: IdentifiedVo = IdentifiedVo(); fun connVo(block: () -> IdentifiedVo?) { bConnVo = block() ?: IdentifiedVo() }
		private var bDataCenterVo: IdentifiedVo = IdentifiedVo(); fun dataCenterVo(block: () -> IdentifiedVo?) { bDataCenterVo = block() ?: IdentifiedVo() }
		private var bClusterVo: IdentifiedVo = IdentifiedVo(); fun clusterVo(block: () -> IdentifiedVo?) { bClusterVo = block() ?: IdentifiedVo() }
		private var bTemplateVo: IdentifiedVo = IdentifiedVo(); fun templateVo(block: () -> IdentifiedVo?) { bTemplateVo = block() ?: IdentifiedVo() }
		private var bNicVos: List<NicVo> = listOf(); fun nicVos(block: () -> List<NicVo>?) { bNicVos = block() ?: listOf() }
		private var bDiskAttachmentVos: List<DiskAttachmentVo> = listOf(); fun diskAttachmentVos(block: () -> List<DiskAttachmentVo>?) { bDiskAttachmentVos = block() ?: listOf() }

		fun build(): VmCreateVo = VmCreateVo(bId, bName, bDescription, bComment, bOsSystem, bOsType, bOptimizeOption, bMemorySize, bMemoryMax, bMemoryActual, bCpuTopologyCnt, bCpuTopologyCore, bCpuTopologySocket, bCpuTopologyThread, /*bTimeOffset,*/ bCloudInit, bScript, bMigrationMode, bMigrationPolicy, bMigrationEncrypt, bParallelMigration, bHa, bPriority, bBootingMenu, bFirstDevice, bSecDevice, bDeviceList, bHostInCluster, bHostVos, bStorageDomainVo, bCpuProfileVo, bConnVo, bDataCenterVo, bClusterVo, bTemplateVo, bNicVos, bDiskAttachmentVos, )
    }

    companion object {
        inline fun builder(block: VmCreateVo.Builder.() -> Unit): VmCreateVo = Builder().apply(block).build()
    }
}

fun VmCreateVo.toVmBuilder(): VmBuilder {
	// log.info("vmCreateVo: {}", this)
	return VmBuilder().apply {
		toVmInfoBuilder(this)
		toVmSystemBuilder(this)
		toVmInitBuilder(this)
		toVmHostBuilder(this)
		toVmHaBuilder(this)
		toVmBootBuilder(this)
	}
}

fun VmCreateVo.toAddVmBuilder(): Vm =
	toVmBuilder()
		.template(TemplateBuilder().id(templateVo.id))
		.build()

fun VmCreateVo.toEditVmBuilder(): Vm =
	toVmBuilder()
		.id(this.id)
		.build()

fun VmCreateVo.toVmInfoBuilder(vmBuilder: VmBuilder): VmBuilder = vmBuilder.apply {
	name(name)
	description(description)
	comment(comment)
	cluster(ClusterBuilder().id(clusterVo.id))
	// template(TemplateBuilder().id(templateVo.id))
	bios(BiosBuilder().type(BiosType.fromValue(osType)))
	type(VmType.fromValue(optimizeOption))
	// timeZone(TimeZoneBuilder().name(timeOffset))
}

fun VmCreateVo.toVmSystemBuilder(vmBuilder: VmBuilder): VmBuilder = vmBuilder.apply {
	memory(memorySize)
	memoryPolicy(MemoryPolicyBuilder().max(memoryMax).guaranteed(memoryActual))
	cpu(CpuBuilder().topology(CpuTopologyBuilder()
		.cores(cpuTopologyCore)
		.sockets(cpuTopologySocket)
		.threads(cpuTopologyThread)
		.build()))
}

fun VmCreateVo.toVmInitBuilder(vmBuilder: VmBuilder): VmBuilder = vmBuilder.apply {
	if (cloudInit) {
		initialization(InitializationBuilder()
			// .timezone(timeOffset)
			.customScript(script))
	}
}

fun VmCreateVo.toVmHostBuilder(vmBuilder: VmBuilder): VmBuilder = vmBuilder.apply {
	val placementBuilder = VmPlacementPolicyBuilder()
	if (!hostInCluster) {
		placementBuilder.hosts(hostVos.map { HostBuilder().id(it.id).build() })
	}
	placementPolicy(placementBuilder.affinity(VmAffinity.fromValue(migrationMode)))
}

fun VmCreateVo.toVmHaBuilder(vmBuilder: VmBuilder): VmBuilder = vmBuilder.apply {
	highAvailability(HighAvailabilityBuilder().enabled(ha).priority(priority))
	if (ha) {
		lease(StorageDomainLeaseBuilder().storageDomain(StorageDomainBuilder().id(storageDomainVo.id).build()))
	}
}

fun VmCreateVo.toVmBootBuilder(vmBuilder: VmBuilder): VmBuilder = vmBuilder.apply {
	val bootDeviceList = mutableListOf(BootDevice.fromValue(firstDevice))
	if (secDevice.isNotEmpty()) bootDeviceList.add(BootDevice.fromValue(secDevice))
	os(OperatingSystemBuilder()
		.type(osSystem)
		.boot(BootBuilder().devices(bootDeviceList)))
	bios(BiosBuilder().bootMenu(BootMenuBuilder().enabled(bootingMenu)).build())
}


fun Vm.toVmCreateVo(conn: Connection): VmCreateVo {
    val vm = this@toVmCreateVo
    val cluster: Cluster? = conn.findCluster(vm.cluster().id()).getOrNull()
    val dataCenter: DataCenter? = cluster?.dataCenter()?.id()?.let { conn.findDataCenter(it).getOrNull() }
    val nics: List<Nic> = conn.findAllNicsFromVm(vm.id()).getOrDefault(listOf())
    val template: Template? = conn.findTemplate(vm.template().id()).getOrNull()
    val cdrom: Cdrom? = conn.findAllVmCdromsFromVm(vm.id()).getOrNull()?.firstOrNull()
    val disk: Disk? = cdrom?.file()?.id()?.let { conn.findDisk(it).getOrNull() }
    val diskAttachments: List<DiskAttachment> = conn.findAllDiskAttachmentsFromVm(vm.id()).getOrDefault(listOf())
	val storageDomain: StorageDomain? = if (vm.leasePresent()) {
		conn.findStorageDomain(vm.lease().storageDomain().id()).getOrNull()
	} else null
	val hosts = if (vm.placementPolicy().hostsPresent()) {
		vm.placementPolicy().hosts().map { it }.fromHostsToIdentifiedVos()
	} else listOf()
	val cpuProfile = conn.findCpuProfile(vm.cpuProfile().id()).getOrNull()

    return VmCreateVo.builder {
		id { vm.id() }
		name { vm.name() }
		description { vm.description() }
		comment { vm.comment() }
		osSystem { vm.os().type() }
		osType { vm.bios().type().toString() }
		optimizeOption { vm.type().toString() }
		memorySize { vm.memory() }
		memoryMax { vm.memoryPolicy().max() }
		memoryActual { vm.memoryPolicy().guaranteed() }
		cpuTopologyCnt {
			vm.cpu().topology().coresAsInteger() *
				vm.cpu().topology().socketsAsInteger() *
				vm.cpu().topology().threadsAsInteger()
		}
		cpuTopologyCore { vm.cpu().topology().coresAsInteger() }
		cpuTopologySocket { vm.cpu().topology().socketsAsInteger() }
		cpuTopologyThread { vm.cpu().topology().threadsAsInteger() }
		// timeOffset { vm.timeZone().name() }
		cloudInit { vm.initializationPresent() }
		script { if (vm.initializationPresent()) vm.initialization().customScript() else "" }
		migrationMode { vm.placementPolicy().affinity().value() }
		migrationEncrypt { vm.migration().encrypted() }
		// migrationPolicy { vm. }
		// parallelMigration { vm. }
		ha { vm.highAvailability().enabled() }
		priority { vm.highAvailability().priorityAsInteger() }
		bootingMenu { vm.bios().bootMenu().enabled() }
		firstDevice { vm.os().boot().devices().first().value() }
		secDevice {
			if (vm.os().boot().devices().size > 1) vm.os().boot().devices()[1].value()
			else null
		}
		// deviceList { vm. }
		hostInCluster { !vm.placementPolicy().hostsPresent() }
		hostVos { hosts }
		storageDomainVo { storageDomain?.fromStorageDomainToIdentifiedVo() }
		cpuProfileVo { cpuProfile?.fromCpuProfileToIdentifiedVo() }
		connVo { disk?.fromDiskToIdentifiedVo() }
		dataCenterVo { dataCenter?.fromDataCenterToIdentifiedVo() }
		clusterVo { cluster?.fromClusterToIdentifiedVo() }
		templateVo { template?.fromTemplateToIdentifiedVo() }
		nicVos { nics.toVmNics() } // TODO
		diskAttachmentVos { diskAttachments.toDiskAttachmentVos(conn) }
	}
}

