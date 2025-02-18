package com.itinfo.rutilvm.api.model.computing

import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.api.model.*
import com.itinfo.rutilvm.api.model.network.*
import com.itinfo.rutilvm.api.model.storage.*
import com.itinfo.rutilvm.api.repository.history.dto.UsageDto
import com.itinfo.rutilvm.util.ovirt.*
import org.ovirt.engine.sdk4.Connection

import org.ovirt.engine.sdk4.builders.*
import org.ovirt.engine.sdk4.types.*
import org.slf4j.LoggerFactory
import java.io.Serializable
import java.math.BigInteger
import java.util.Date

private val log = LoggerFactory.getLogger(VmCreateVo::class.java)

/**
 * [VmCreateVo]
 *
 * @property id [String]
 * @property name [String]
 * @property description [String]
 * @property comment [String]
 * @property osSystem [String]
 * @property chipsetFirmwareType [String]
 * @property optimizeOption [String]
 * @property memorySize [BigInteger]
 * @property memoryMax [BigInteger]
 * @property memoryActual [BigInteger]
 * @property cpuTopologyCnt [Int]
 * @property cpuTopologyCore [Int]
 * @property cpuTopologySocket [Int]
 * @property cpuTopologyThread [Int]
 * @property timeOffset [String]
 * @property cloudInit [Boolean]
 * @property script [String]
 * @property migrationMode [String]
 * @property migrationPolicy [String]
 * @property migrationEncrypt [InheritableBoolean]
 * @property parallelMigration [String]
 * @property ha [Boolean]
 * @property priority [Int]
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
 * @property diskAttachmentVos List<[DiskAttachmentVo]>
 * @property nicVos List<[NicVo]>
 */
class VmCreateVo (
    val id: String = "",
    val name: String = "",
	val description: String = "",
	val comment: String = "",
	val osSystem: String = "",
	val chipsetFirmwareType: String = "",
	val optimizeOption: String = "",
	val memorySize: BigInteger = BigInteger.ZERO,
	val memoryMax: BigInteger = BigInteger.ZERO,
	val memoryActual: BigInteger = BigInteger.ZERO,
    val cpuTopologyCnt: Int = 0,
    val cpuTopologyCore: Int = 0,
    val cpuTopologySocket: Int = 0,
    val cpuTopologyThread: Int = 0,
    val timeOffset: String = "Asia/Seoul",
    val cloudInit: Boolean = false,
    val script: String = "",
    val migrationMode: String = "",
    val migrationPolicy: String = "",
    val migrationEncrypt: InheritableBoolean = InheritableBoolean.INHERIT,
    val parallelMigration: String = "",
    val ha: Boolean = false,
    val priority: Int = 0,
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
	val diskAttachmentVos: List<DiskAttachmentVo> = listOf(),
	val nicVos: List<NicVo> = listOf(),
): Serializable {
    override fun toString(): String =
        gson.toJson(this)

    class Builder {
		private var bId: String = ""; fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String = ""; fun name(block: () -> String?) { bName = block() ?: "" }
		private var bDescription: String = ""; fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bComment: String = ""; fun comment(block: () -> String?) { bComment = block() ?: "" }
		private var bOsSystem: String = ""; fun osSystem(block: () -> String?) { bOsSystem = block() ?: "" }
		private var bChipsetFirmwareType: String = ""; fun chipsetFirmwareType(block: () -> String?) { bChipsetFirmwareType = block() ?: "" }
		private var bOptimizeOption: String = ""; fun optimizeOption(block: () -> String?) { bOptimizeOption = block() ?: "" }
		private var bMemorySize: BigInteger = BigInteger.ZERO; fun memorySize(block: () -> BigInteger?) { bMemorySize = block() ?: BigInteger.ZERO }
		private var bMemoryMax: BigInteger = BigInteger.ZERO; fun memoryMax(block: () -> BigInteger?) { bMemoryMax = block() ?: BigInteger.ZERO }
		private var bMemoryActual: BigInteger = BigInteger.ZERO; fun memoryActual(block: () -> BigInteger?) { bMemoryActual = block() ?: BigInteger.ZERO }
		private var bCpuTopologyCnt: Int = 0; fun cpuTopologyCnt(block: () -> Int?) { bCpuTopologyCnt = block() ?: 0 }
		private var bCpuTopologyCore: Int = 0; fun cpuTopologyCore(block: () -> Int?) { bCpuTopologyCore = block() ?: 0 }
		private var bCpuTopologySocket: Int = 0; fun cpuTopologySocket(block: () -> Int?) { bCpuTopologySocket = block() ?: 0 }
		private var bCpuTopologyThread: Int = 0; fun cpuTopologyThread(block: () -> Int?) { bCpuTopologyThread = block() ?: 0 }
		private var bTimeOffset: String = "Asia/Seoul"; fun timeOffset(block: () -> String?) { bTimeOffset = block() ?: "Asia/Seoul" }
		private var bCloudInit: Boolean = false; fun cloudInit(block: () -> Boolean?) { bCloudInit = block() ?: false }
		private var bScript: String = ""; fun script(block: () -> String?) { bScript = block() ?: "" }
		private var bMigrationMode: String = ""; fun migrationMode(block: () -> String?) { bMigrationMode = block() ?: "" }
		private var bMigrationPolicy: String = ""; fun migrationPolicy(block: () -> String?) { bMigrationPolicy = block() ?: "" }
		private var bMigrationEncrypt: InheritableBoolean = InheritableBoolean.INHERIT; fun migrationEncrypt(block: () -> InheritableBoolean?) { bMigrationEncrypt = block() ?: InheritableBoolean.INHERIT }
		private var bParallelMigration: String = ""; fun parallelMigration(block: () -> String?) { bParallelMigration = block() ?: "" }
		private var bHa: Boolean = false; fun ha(block: () -> Boolean?) { bHa = block() ?: false }
		private var bPriority: Int = 0; fun priority(block: () -> Int?) { bPriority = block() ?: 0 }
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
		private var bDiskAttachmentVos: List<DiskAttachmentVo> = listOf(); fun diskAttachmentVos(block: () -> List<DiskAttachmentVo>?) { bDiskAttachmentVos = block() ?: listOf() }
		private var bNicVos: List<NicVo> = listOf(); fun nicVos(block: () -> List<NicVo>?) { bNicVos = block() ?: listOf() }

		fun build(): VmCreateVo = VmCreateVo()
    }

    companion object {
        inline fun builder(block: VmCreateVo.Builder.() -> Unit): VmCreateVo = Builder().apply(block).build()
    }
}

fun VmCreateVo.toVmBuilder(): VmBuilder = VmBuilder().apply {
	toVmInfoBuilder(this)
	toVmSystemBuilder(this)
	toVmInitBuilder(this)
	toVmHostBuilder(this)
	toVmHaBuilder(this)
	toVmBootBuilder(this)
}

fun VmCreateVo.toAddVmBuilder(): Vm = toVmBuilder().build()

fun VmCreateVo.toEditVmBuilder(): Vm = toVmBuilder().id(this.id).build()

fun VmCreateVo.toVmInfoBuilder(vmBuilder: VmBuilder): VmBuilder = vmBuilder.apply {
	cluster(ClusterBuilder().id(clusterVo.id).build())
	template(TemplateBuilder().id(templateVo.id).build())
	bios(BiosBuilder().type(BiosType.fromValue(chipsetFirmwareType)))
	type(VmType.fromValue(optimizeOption))
	name(this@toVmInfoBuilder.name)
	description(description)
	comment(comment)
	timeZone(TimeZoneBuilder().name(timeOffset))
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
			.timezone(timeOffset)
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
		lease(StorageDomainLeaseBuilder().storageDomain(StorageDomainBuilder().id(storageDomainVo.id)))
	}
}

fun VmCreateVo.toVmBootBuilder(vmBuilder: VmBuilder): VmBuilder = vmBuilder.apply {
	val bootDeviceList = mutableListOf(BootDevice.fromValue(firstDevice))
	if (secDevice.isNotEmpty()) bootDeviceList.add(BootDevice.fromValue(secDevice))
	os(OperatingSystemBuilder()
		.type(osSystem)
		.boot(BootBuilder().devices(bootDeviceList)))
}

/**
 * vm 전부 모아둔것...
 */
fun Vm.toVmCreateVo(conn: Connection): VmCreateVo {
    val vm = this@toVmCreateVo
    val cluster: Cluster? = conn.findCluster(vm.cluster().id()).getOrNull()
    val dataCenter: DataCenter? = cluster?.dataCenter()?.id()?.let { conn.findDataCenter(it).getOrNull() }
    val nics: List<Nic> = conn.findAllNicsFromVm(vm.id()).getOrDefault(listOf())
    val template: Template? = conn.findTemplate(vm.template().id()).getOrNull()
    val cdrom: Cdrom? = conn.findAllVmCdromsFromVm(vm.id()).getOrNull()?.firstOrNull()
    val disk: Disk? = cdrom?.file()?.id()?.let { conn.findDisk(it).getOrNull() }
    val diskAttachments: List<DiskAttachment> = conn.findAllDiskAttachmentsFromVm(vm.id()).getOrDefault(listOf())

    return VmCreateVo.builder {
        id { vm.id() }
        name { vm.name() }
		description { vm.description() }
		comment { vm.comment() }
        nicVos { nics.toVmNics(conn, vm.id()) }
        diskAttachmentVos { diskAttachments.toDiskAttachmentVos(conn) }
        dataCenterVo { dataCenter?.fromDataCenterToIdentifiedVo() }
        clusterVo { cluster?.fromClusterToIdentifiedVo() }
        templateVo { template?.fromTemplateToIdentifiedVo() }
        osSystem { vm.os().type() }
        chipsetFirmwareType { vm.bios().type().toString() }
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
        timeOffset { vm.timeZone().name() }
        cloudInit { vm.initializationPresent() }
        script { if (vm.initializationPresent()) vm.initialization().customScript() else "" }
        hostInCluster { !vm.placementPolicy().hostsPresent() }
       	hostVos {
           if (vm.placementPolicy().hostsPresent()){ vm.placementPolicy().hosts().map {it}.fromHostsToIdentifiedVos() }
           else listOf()
       	}
        migrationMode { vm.placementPolicy().affinity().value() }
        migrationEncrypt { vm.migration().encrypted() }
        ha { vm.highAvailability().enabled() }
        storageDomainVo { if (vm.leasePresent()) conn.findStorageDomain(vm.lease().storageDomain().id()).getOrNull()?.fromStorageDomainToIdentifiedVo() else null }
        priority { vm.highAvailability().priorityAsInteger() }
        cpuProfileVo { conn.findCpuProfile(vm.cpuProfile().id()).getOrNull()?.fromCpuProfileToIdentifiedVo() }
        firstDevice { vm.os().boot().devices().first().value() }
        secDevice {
            if (vm.os().boot().devices().size > 1) vm.os().boot().devices()[1].value()
            else null
        }
        connVo { disk?.fromDiskToIdentifiedVo() }
    }
}

