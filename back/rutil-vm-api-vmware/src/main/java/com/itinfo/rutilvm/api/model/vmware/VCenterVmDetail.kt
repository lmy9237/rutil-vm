package com.itinfo.rutilvm.api.model.vmware

import com.google.gson.annotations.SerializedName
import com.itinfo.rutilvm.common.gson
import java.io.Serializable

/**
 * [VCenterVmDetail]
 * VMWare 용 Vm 상세정보
 *
 * @author 이찬희 (@chanhi2000)
 */
class VCenterVmDetail(
	@SerializedName("id") var id: String? = "",
	@SerializedName("name") val name: String? = "",
	@SerializedName("instant_clone_frozen") val instantCloneFrozen: Boolean? = false,
	@SerializedName("guest_OS") val guestOS: String? = "",
	@SerializedName("identity") val identity: VCenterIdentity? = null,
	@SerializedName("power_state") val powerState: String? = "",
	@SerializedName("boot") val boot: VCenterBoot? = null,
	@SerializedName("boot_devices") val bootDevices: List<VCenterBootDevice>? = emptyList(),
	@SerializedName("cdroms") val cdroms: Map<String, VCenterCdrom>? = emptyMap(),
	@SerializedName("cpu") val cpu: VCenterCpu? = null,
	@SerializedName("disks") val disks: Map<String, VCenterDisk>? = emptyMap(),
	@SerializedName("floppies") val floppies: Map<String, VCenterFloppy>? = emptyMap(),
	@SerializedName("hardware") val hardware: VCenterHardware? = null,
	@SerializedName("memory") val memory: VCenterMemory? = null,
	@SerializedName("nics") val nics: Map<String, VCenterNicDetail>? = emptyMap(),
	@SerializedName("parallel_ports") val parallelPorts: Map<String, VCenterParallelPort>? = emptyMap(),
	@SerializedName("sata_adapters") val sataAdapters: Map<String, VCenterSataAdapter>? = emptyMap(),
	@SerializedName("scsi_adapters") val scsiAdapters: Map<String, VCenterScsiAdapter>? = emptyMap(),
	@SerializedName("serial_ports") val serialPorts: Map<String, VCenterSerialPort>? = emptyMap()
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bId: String? = ""; fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String? = ""; fun name(block: () -> String?) { bName = block() ?: "" }
		private var bInstantCloneFrozen: Boolean? = false; fun instantCloneFrozen(block: () -> Boolean?) { bInstantCloneFrozen = block() ?: false }
		private var bGuestOS: String? = ""; fun guestOS(block: () -> String?) { bGuestOS = block() ?: "" }
		private var bPowerState: String? = ""; fun powerState(block: () -> String?) { bPowerState = block() ?: "" }
		private var bIdentity: VCenterIdentity? = null; fun identity(block: () -> VCenterIdentity?) { bIdentity = block() }
		private var bBoot: VCenterBoot? = null; fun boot(block: () -> VCenterBoot?) { bBoot = block() }
		private var bBootDevices: List<VCenterBootDevice>? = emptyList(); fun bootDevices(block: () -> List<VCenterBootDevice>?) { bBootDevices = block() ?: emptyList() }
		private var bCdroms: Map<String, VCenterCdrom>? = emptyMap(); fun cdroms(block: () -> Map<String, VCenterCdrom>?) { bCdroms = block() ?: emptyMap() }
		private var bCpu: VCenterCpu? = null; fun cpu(block: () -> VCenterCpu?) { bCpu = block() }
		private var bDisks: Map<String, VCenterDisk>? = emptyMap(); fun disks(block: () -> Map<String, VCenterDisk>?) { bDisks = block() ?: emptyMap() }
		private var bFloppies: Map<String, VCenterFloppy>? = emptyMap(); fun floppies(block: () -> Map<String, VCenterFloppy>?) { bFloppies = block() ?: emptyMap() }
		private var bHardware: VCenterHardware? = null; fun hardware(block: () -> VCenterHardware?) { bHardware = block() }
		private var bMemory: VCenterMemory? = null; fun memory(block: () -> VCenterMemory?) { bMemory = block() }
		private var bNics: Map<String, VCenterNicDetail>? = emptyMap(); fun nics(block: () -> Map<String, VCenterNicDetail>?) { bNics = block() ?: emptyMap()}
		private var bParallelPorts: Map<String, VCenterParallelPort>? = emptyMap(); fun parallelPorts(block: () -> Map<String, VCenterParallelPort>?) { bParallelPorts = block() ?: emptyMap() }
		private var bSataAdapters: Map<String, VCenterSataAdapter>? = emptyMap(); fun sataAdapters(block: () -> Map<String, VCenterSataAdapter>?) { bSataAdapters = block() ?: emptyMap() }
		private var bScsiAdapters: Map<String, VCenterScsiAdapter>? = emptyMap(); fun scsiAdapters(block: () -> Map<String, VCenterScsiAdapter>?) { bScsiAdapters = block() ?: emptyMap() }
		private var bSerialPorts: Map<String, VCenterSerialPort>? = emptyMap(); fun serialPorts(block: () -> Map<String, VCenterSerialPort>?) { bSerialPorts = block() ?: emptyMap() }

		fun build(): VCenterVmDetail = VCenterVmDetail(bId, bName, bInstantCloneFrozen, bGuestOS, bIdentity, bPowerState, bBoot, bBootDevices, bCdroms, bCpu, bDisks, bFloppies, bHardware, bMemory, bNics, bParallelPorts, bSataAdapters, bScsiAdapters, bSerialPorts)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): VCenterVmDetail = Builder().apply(block).build()
	}
}

class VCenterIdentity(
	@SerializedName("name") val name: String? = "",
	@SerializedName("instance_uuid") val instanceUuid: String? = "",
	@SerializedName("bios_uuid") val biosUuid: String? = "",
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bName: String? = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bInstanceUuid: String? = "";fun instanceUuid(block: () -> String?) { bInstanceUuid = block() ?: "" }
		private var bBiosUuid: String? = "";fun biosUuid(block: () -> String?) { bBiosUuid = block() ?: "" }
		fun build(): VCenterIdentity = VCenterIdentity(bName, bInstanceUuid, bBiosUuid)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): VCenterIdentity = Builder().apply(block).build()
	}

}

class VCenterBoot(
	@SerializedName("delay") val delay: Int? = 0,
	@SerializedName("efi_legacy_boot") val efiLegacyBoot: Boolean? = false,
	@SerializedName("enter_setup_mode") val enterSetupMode: Boolean? = false,
	@SerializedName("network_protocol") val networkProtocol: String? = "",
	@SerializedName("retry") val retry: Boolean? = false,
	@SerializedName("retry_delay") val retryDelay: Int? = 0,
	@SerializedName("type") val type: String? = ""
): Serializable {
	override fun toString(): String =
		gson.toJson(this)
	class Builder {
		private var bDelay: Int? = 0; fun delay(block: () -> Int?) { bDelay = block() }
		private var bEfiLegacyBoot: Boolean? = false; fun efiLegacyBoot(block: () -> Boolean?) { bEfiLegacyBoot = block() }
		private var bEnterSetupMode: Boolean? = false; fun enterSetupMode(block: () -> Boolean?) { bEnterSetupMode = block() }
		private var bNetworkProtocol: String? = ""; fun networkProtocol(block: () -> String?) { bNetworkProtocol = block() }
		private var bRetry: Boolean? = false; fun retry(block: () -> Boolean?) { bRetry = block() }
		private var bRetryDelay: Int? = 0; fun retryDelay(block: () -> Int?) { bRetryDelay = block() }
		private var bType: String? = ""; fun type(block: () -> String?) { bType = block() }
		fun build(): VCenterBoot = VCenterBoot(bDelay, bEfiLegacyBoot, bEnterSetupMode, bNetworkProtocol, bRetry, bRetryDelay, bType)
	}
	companion object {
		inline fun builder(block: Builder.() -> Unit): VCenterBoot = Builder().apply(block).build()
	}
}

class VCenterBootDevice(
	@SerializedName("disks") val disks: List<String>? = emptyList(),
	@SerializedName("nic") val nic: String? = "",
	@SerializedName("type") val type: String? = ""
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bDisks: List<String>? = emptyList(); fun disks(block: () -> List<String>?) { bDisks = block() }
		private var bNic: String? = ""; fun nic(block: () -> String?) { bNic = block() }
		private var bType: String? = ""; fun type(block: () -> String?) { bType = block() }
		fun build(): VCenterBootDevice = VCenterBootDevice(bDisks, bNic, bType)
	}
	companion object {
		inline fun builder(block: Builder.() -> Unit): VCenterBootDevice = Builder().apply(block).build()
	}
}

class VCenterCdrom(
	@SerializedName("allow_guest_control") val allowGuestControl: Boolean? = false,
	@SerializedName("backing") val backing: VCenterCdromBacking? = null,
	@SerializedName("ide") val ide: VCenterIdeInfo? = null,
	@SerializedName("label") val label: String? = "",
	@SerializedName("sata") val sata: VCenterSataInfo? = null,
	@SerializedName("start_connected") val startConnected: Boolean? = false,
	@SerializedName("state") val state: String? = "",
	@SerializedName("type") val type: String? = ""
) : Serializable {
	override fun toString(): String = gson.toJson(this)
	class Builder {
		private var bAllowGuestControl: Boolean? = false; fun allowGuestControl(block: () -> Boolean?) { bAllowGuestControl = block() }
		private var bBacking: VCenterCdromBacking? = null; fun backing(block: () -> VCenterCdromBacking?) { bBacking = block() }
		private var bIde: VCenterIdeInfo? = null; fun ide(block: () -> VCenterIdeInfo?) { bIde = block() }
		private var bLabel: String? = ""; fun label(block: () -> String?) { bLabel = block() }
		private var bSata: VCenterSataInfo? = null; fun sata(block: () -> VCenterSataInfo?) { bSata = block() }
		private var bStartConnected: Boolean? = false; fun startConnected(block: () -> Boolean?) { bStartConnected = block() }
		private var bState: String? = ""; fun state(block: () -> String?) { bState = block() }
		private var bType: String? = ""; fun type(block: () -> String?) { bType = block() }
		fun build(): VCenterCdrom = VCenterCdrom(bAllowGuestControl, bBacking, bIde, bLabel, bSata, bStartConnected, bState, bType)
	}
	companion object {
		inline fun builder(block: Builder.() -> Unit): VCenterCdrom = Builder().apply(block).build()
	}
}

class VCenterCpu(
	@SerializedName("cores_per_socket") val coresPerSocket: Int? = 0,
	@SerializedName("count") val count: Int? = 0,
	@SerializedName("hot_add_enabled") val hotAddEnabled: Boolean? = false,
	@SerializedName("hot_remove_enabled") val hotRemoveEnabled: Boolean? = false
) : Serializable {
	override fun toString(): String = gson.toJson(this)
	class Builder {
		private var bCoresPerSocket: Int? = 0; fun coresPerSocket(block: () -> Int?) { bCoresPerSocket = block() }
		private var bCount: Int? = 0; fun count(block: () -> Int?) { bCount = block() }
		private var bHotAddEnabled: Boolean? = false; fun hotAddEnabled(block: () -> Boolean?) { bHotAddEnabled = block() }
		private var bHotRemoveEnabled: Boolean? = false; fun hotRemoveEnabled(block: () -> Boolean?) { bHotRemoveEnabled = block() }
		fun build(): VCenterCpu = VCenterCpu(bCoresPerSocket, bCount, bHotAddEnabled, bHotRemoveEnabled)
	}
	companion object {
		inline fun builder(block: Builder.() -> Unit): VCenterCpu = Builder().apply(block).build()
	}
}

class VCenterCdromBacking(
	@SerializedName("auto_detect") val autoDetect: Boolean? = false,
	@SerializedName("device_access_type") val deviceAccessType: String? = "",
	@SerializedName("host_device") val hostDevice: String? = "",
	@SerializedName("iso_file") val isoFile: String? = "",
	@SerializedName("type") val type: String? = ""
) : Serializable {
	override fun toString(): String = gson.toJson(this)
	class Builder {
		private var bAutoDetect: Boolean? = false; fun autoDetect(block: () -> Boolean?) { bAutoDetect = block() }
		private var bDeviceAccessType: String? = ""; fun deviceAccessType(block: () -> String?) { bDeviceAccessType = block() }
		private var bHostDevice: String? = ""; fun hostDevice(block: () -> String?) { bHostDevice = block() }
		private var bIsoFile: String? = ""; fun isoFile(block: () -> String?) { bIsoFile = block() }
		private var bType: String? = ""; fun type(block: () -> String?) { bType = block() }
		fun build(): VCenterCdromBacking = VCenterCdromBacking(bAutoDetect, bDeviceAccessType, bHostDevice, bIsoFile, bType)
	}
	companion object {
		inline fun builder(block: Builder.() -> Unit): VCenterCdromBacking = Builder().apply(block).build()
	}
}

data class VCenterDisk(
	@SerializedName("backing") val backing: VCenterDiskBacking? = null,
	@SerializedName("capacity") val capacity: Long? = 0L,
	@SerializedName("ide") val ide: VCenterIdeInfo? = null,
	@SerializedName("label") val label: String? = "",
	@SerializedName("sata") val sata: VCenterSataInfo? = null,
	@SerializedName("scsi") val scsi: VCenterScsi? = null,
	@SerializedName("type") val type: String? = ""
) : Serializable {
	override fun toString(): String =
		gson.toJson(this)
	class Builder {
		private var bBacking: VCenterDiskBacking? = null; fun backing(block: () -> VCenterDiskBacking?) { bBacking = block() }
		private var bCapacity: Long? = 0L; fun capacity(block: () -> Long?) { bCapacity = block() }
		private var bIde: VCenterIdeInfo? = null; fun ide(block: () -> VCenterIdeInfo?) { bIde = block() }
		private var bLabel: String? = ""; fun label(block: () -> String?) { bLabel = block() }
		private var bSata: VCenterSataInfo? = null; fun sata(block: () -> VCenterSataInfo?) { bSata = block() }
		private var bScsi: VCenterScsi? = null; fun scsi(block: () -> VCenterScsi?) { bScsi = block() }
		private var bType: String? = ""; fun type(block: () -> String?) { bType = block() }
		fun build(): VCenterDisk = VCenterDisk(bBacking, bCapacity, bIde, bLabel, bSata, bScsi, bType)
	}
	companion object {
		inline fun builder(block: Builder.() -> Unit): VCenterDisk = Builder().apply(block).build()
	}
}

class VCenterDiskBacking(
	@SerializedName("type") val type: String? = "",
	@SerializedName("vmdk_file") val vmdkFile: String? = ""
) : Serializable {
	override fun toString(): String =
		gson.toJson(this)
	class Builder {
		private var bType: String? = ""; fun type(block: () -> String?) { bType = block() }
		private var bVmdkFile: String? = ""; fun vmdkFile(block: () -> String?) { bVmdkFile = block() }
		fun build(): VCenterDiskBacking = VCenterDiskBacking(bType, bVmdkFile)
	}
	companion object {
		inline fun builder(block: Builder.() -> Unit): VCenterDiskBacking = Builder().apply(block).build()
	}
}

class VCenterFloppy(
	@SerializedName("allow_guest_control") val allowGuestControl: Boolean? = false,
	@SerializedName("backing") val backing: VCenterFloppyBacking? = null,
	@SerializedName("label") val label: String? = "",
	@SerializedName("start_connected") val startConnected: Boolean? = false,
	@SerializedName("state") val state: String? = ""
) : Serializable {
	override fun toString(): String =
		gson.toJson(this)
	class Builder {
		private var bAllowGuestControl: Boolean? = false; fun allowGuestControl(block: () -> Boolean?) { bAllowGuestControl = block() }
		private var bBacking: VCenterFloppyBacking? = null; fun backing(block: VCenterFloppyBacking.Builder.() -> Unit) { bBacking = VCenterFloppyBacking.builder(block) }
		private var bLabel: String? = ""; fun label(block: () -> String?) { bLabel = block() }
		private var bStartConnected: Boolean? = false; fun startConnected(block: () -> Boolean?) { bStartConnected = block() }
		private var bState: String? = ""; fun state(block: () -> String?) { bState = block() }
		fun build(): VCenterFloppy = VCenterFloppy(bAllowGuestControl, bBacking, bLabel, bStartConnected, bState)
	}
	companion object {
		inline fun builder(block: Builder.() -> Unit): VCenterFloppy = Builder().apply(block).build()
	}
}

class VCenterFloppyBacking(
	@SerializedName("auto_detect") val autoDetect: Boolean? = false,
	@SerializedName("host_device") val hostDevice: String? = "",
	@SerializedName("image_file") val imageFile: String? = "",
	@SerializedName("type") val type: String? = ""
) : Serializable {
	override fun toString(): String =
		gson.toJson(this)
	class Builder {
		private var bAutoDetect: Boolean? = false; fun autoDetect(block: () -> Boolean?) { bAutoDetect = block() }
		private var bHostDevice: String? = ""; fun hostDevice(block: () -> String?) { bHostDevice = block() }
		private var bImageFile: String? = ""; fun imageFile(block: () -> String?) { bImageFile = block() }
		private var bType: String? = ""; fun type(block: () -> String?) { bType = block() }
		fun build(): VCenterFloppyBacking = VCenterFloppyBacking(bAutoDetect, bHostDevice, bImageFile, bType)
	}
	companion object {
		inline fun builder(block: Builder.() -> Unit): VCenterFloppyBacking = Builder().apply(block).build()
	}
}

class VCenterHardware(
	@SerializedName("upgrade_error") val upgradeError: Map<String, Any>? = emptyMap(),
	@SerializedName("upgrade_policy") val upgradePolicy: String? = "",
	@SerializedName("upgrade_status") val upgradeStatus: String? = "",
	@SerializedName("upgrade_version") val upgradeVersion: String? = "",
	@SerializedName("version") val version: String? = ""
) : Serializable {
	override fun toString(): String =
		gson.toJson(this)
	class Builder {
		private var bUpgradeError: Map<String, Any>? = emptyMap(); fun upgradeError(block: () -> Map<String, Any>?) { bUpgradeError = block() }
		private var bUpgradePolicy: String? = ""; fun upgradePolicy(block: () -> String?) { bUpgradePolicy = block() }
		private var bUpgradeStatus: String? = ""; fun upgradeStatus(block: () -> String?) { bUpgradeStatus = block() }
		private var bUpgradeVersion: String? = ""; fun upgradeVersion(block: () -> String?) { bUpgradeVersion = block() }
		private var bVersion: String? = ""; fun version(block: () -> String?) { bVersion = block() }
		fun build(): VCenterHardware = VCenterHardware(bUpgradeError, bUpgradePolicy, bUpgradeStatus, bUpgradeVersion, bVersion)
	}
	companion object {
		inline fun builder(block: Builder.() -> Unit): VCenterHardware = Builder().apply(block).build()
	}
}

class VCenterMemory(
	@SerializedName("hot_add_enabled") val hotAddEnabled: Boolean? = false,
	@SerializedName("hot_add_increment_size_MiB") val hotAddIncrementSizeMiB: Long? = 0L,
	@SerializedName("hot_add_limit_MiB") val hotAddLimitMiB: Long? = 0L,
	@SerializedName("size_MiB") val sizeMiB: Long? = 0L
) : Serializable {
	override fun toString(): String =
		gson.toJson(this)
	class Builder {
		private var bHotAddEnabled: Boolean? = false; fun hotAddEnabled(block: () -> Boolean?) { bHotAddEnabled = block() }
		private var bHotAddIncrementSizeMiB: Long? = 0L; fun hotAddIncrementSizeMiB(block: () -> Long?) { bHotAddIncrementSizeMiB = block() }
		private var bHotAddLimitMiB: Long? = 0L; fun hotAddLimitMiB(block: () -> Long?) { bHotAddLimitMiB = block() }
		private var bSizeMiB: Long? = 0L; fun sizeMiB(block: () -> Long?) { bSizeMiB = block() }
		fun build(): VCenterMemory = VCenterMemory(bHotAddEnabled, bHotAddIncrementSizeMiB, bHotAddLimitMiB, bSizeMiB)
	}
	companion object {
		inline fun builder(block: Builder.() -> Unit): VCenterMemory = Builder().apply(block).build()
	}
}


class VCenterNicDetail(
	@SerializedName("allow_guest_control") val allowGuestControl: Boolean? = false,
	@SerializedName("backing") val backing: NicBacking? = null,
	@SerializedName("label") val label: String? = "",
	@SerializedName("mac_address") val macAddress: String? = "",
	@SerializedName("mac_type") val macType: String? = "",
	@SerializedName("pci_slot_number") val pciSlotNumber: Int? = 0,
	@SerializedName("start_connected") val startConnected: Boolean? = false,
	@SerializedName("state") val state: String? = "",
	@SerializedName("type") val type: String? = "",
	@SerializedName("upt_compatibility_enabled") val uptCompatibilityEnabled: Boolean? = false,
	@SerializedName("wake_on_lan_enabled") val wakeOnLanEnabled: Boolean? = false
) : Serializable {
	override fun toString(): String =
		gson.toJson(this)
	class Builder {
		private var bAllowGuestControl: Boolean? = false; fun allowGuestControl(block: () -> Boolean?) { bAllowGuestControl = block() }
		private var bBacking: NicBacking? = null; fun backing(block: NicBacking.Builder.() -> Unit) { bBacking = NicBacking.builder(block) }
		private var bLabel: String? = ""; fun label(block: () -> String?) { bLabel = block() }
		private var bMacAddress: String? = ""; fun macAddress(block: () -> String?) { bMacAddress = block() }
		private var bMacType: String? = ""; fun macType(block: () -> String?) { bMacType = block() }
		private var bPciSlotNumber: Int? = 0; fun pciSlotNumber(block: () -> Int?) { bPciSlotNumber = block() }
		private var bStartConnected: Boolean? = false; fun startConnected(block: () -> Boolean?) { bStartConnected = block() }
		private var bState: String? = ""; fun state(block: () -> String?) { bState = block() }
		private var bType: String? = ""; fun type(block: () -> String?) { bType = block() }
		private var bUptCompatibilityEnabled: Boolean? = false; fun uptCompatibilityEnabled(block: () -> Boolean?) { bUptCompatibilityEnabled = block() }
		private var bWakeOnLanEnabled: Boolean? = false; fun wakeOnLanEnabled(block: () -> Boolean?) { bWakeOnLanEnabled = block() }
		fun build(): VCenterNicDetail = VCenterNicDetail(bAllowGuestControl, bBacking, bLabel, bMacAddress, bMacType, bPciSlotNumber, bStartConnected, bState, bType, bUptCompatibilityEnabled, bWakeOnLanEnabled)
	}
	companion object {
		inline fun builder(block: Builder.() -> Unit): VCenterNicDetail = Builder().apply(block).build()
	}
}

class NicBacking(
	@SerializedName("connection_cookie") val connectionCookie: Long? = 0,
	@SerializedName("distributed_port") val distributedPort: String? = "",
	@SerializedName("distributed_switch_uuid") val distributedSwitchUuid: String? = "",
	@SerializedName("host_device") val hostDevice: String? = "",
	@SerializedName("network") val network: String? = "",
	@SerializedName("network_name") val networkName: String? = "",
	@SerializedName("opaque_network_id") val opaqueNetworkId: String? = "",
	@SerializedName("opaque_network_type") val opaqueNetworkType: String? = "",
	@SerializedName("type") val type: String? = "",
) : Serializable {
	override fun toString(): String =
		gson.toJson(this)
	class Builder {
		private var bConnectionCookie: Long? = 0L; fun connectionCookie(block: () -> Long?) { bConnectionCookie = block() }
		private var bDistributedPort: String? = ""; fun distributedPort(block: () -> String?) { bDistributedPort = block() }
		private var bDistributedSwitchUuid: String? = ""; fun distributedSwitchUuid(block: () -> String?) { bDistributedSwitchUuid = block() }
		private var bHostDevice: String? = ""; fun hostDevice(block: () -> String?) { bHostDevice = block() }
		private var bNetwork: String? = ""; fun network(block: () -> String?) { bNetwork = block() }
		private var bNetworkName: String? = ""; fun networkName(block: () -> String?) { bNetworkName = block() }
		private var bOpaqueNetworkId: String? = ""; fun opaqueNetworkId(block: () -> String?) { bOpaqueNetworkId = block() }
		private var bOpaqueNetworkType: String? = ""; fun opaqueNetworkType(block: () -> String?) { bOpaqueNetworkType = block() }
		private var bType: String? = ""; fun type(block: () -> String?) { bType = block() }
		fun build(): NicBacking = NicBacking(bConnectionCookie, bDistributedPort, bDistributedSwitchUuid, bHostDevice, bNetwork, bNetworkName, bOpaqueNetworkId, bOpaqueNetworkType, bType)
	}
	companion object {
		inline fun builder(block: Builder.() -> Unit): NicBacking = Builder().apply(block).build()
	}
}
class VCenterParallelPort(
	@SerializedName("allow_guest_control") val allowGuestControl: Boolean? = false,
	@SerializedName("backing") val backing: ParallelPortBacking? = null,
	@SerializedName("label") val label: String? = "",
	@SerializedName("start_connected") val startConnected: Boolean? = false,
	@SerializedName("state") val state: String? = ""
) : Serializable {
	override fun toString(): String =
		gson.toJson(this)
	class Builder {
		private var bAllowGuestControl: Boolean? = false; fun allowGuestControl(block: () -> Boolean?) { bAllowGuestControl = block() }
		private var bBacking: ParallelPortBacking? = null; fun backing(block: ParallelPortBacking.Builder.() -> Unit) { bBacking = ParallelPortBacking.builder(block) }
		private var bLabel: String? = ""; fun label(block: () -> String?) { bLabel = block() }
		private var bStartConnected: Boolean? = false; fun startConnected(block: () -> Boolean?) { bStartConnected = block() }
		private var bState: String? = ""; fun state(block: () -> String?) { bState = block() }
		fun build(): VCenterParallelPort = VCenterParallelPort(bAllowGuestControl, bBacking, bLabel, bStartConnected, bState)
	}
	companion object {
		inline fun builder(block: Builder.() -> Unit): VCenterParallelPort = Builder().apply(block).build()
	}
}

class ParallelPortBacking(
	@SerializedName("auto_detect") val autoDetect: Boolean? = false,
	@SerializedName("file") val file: String? = "",
	@SerializedName("host_device") val hostDevice: String? = "",
	@SerializedName("type") val type: String? = ""
) : Serializable {
	override fun toString(): String = gson.toJson(this)
	class Builder {
		private var bAutoDetect: Boolean? = false; fun autoDetect(block: () -> Boolean?) { bAutoDetect = block() }
		private var bFile: String? = ""; fun file(block: () -> String?) { bFile = block() }
		private var bHostDevice: String? = ""; fun hostDevice(block: () -> String?) { bHostDevice = block() }
		private var bType: String? = ""; fun type(block: () -> String?) { bType = block() }
		fun build(): ParallelPortBacking = ParallelPortBacking(bAutoDetect, bFile, bHostDevice, bType)
	}
	companion object {
		inline fun builder(block: Builder.() -> Unit): ParallelPortBacking = Builder().apply(block).build()
	}
}
class VCenterSataAdapter(
	@SerializedName("bus") val bus: Int? = 0,
	@SerializedName("label") val label: String? = "",
	@SerializedName("pci_slot_number") val pciSlotNumber: Int? = 0,
	@SerializedName("type") val type: String? = ""
) : Serializable {
	override fun toString(): String = gson.toJson(this)
	class Builder {
		private var bBus: Int? = 0; fun bus(block: () -> Int?) { bBus = block() }
		private var bLabel: String? = ""; fun label(block: () -> String?) { bLabel = block() }
		private var bPciSlotNumber: Int? = 0; fun pciSlotNumber(block: () -> Int?) { bPciSlotNumber = block() }
		private var bType: String? = ""; fun type(block: () -> String?) { bType = block() }
		fun build(): VCenterSataAdapter = VCenterSataAdapter(bBus, bLabel, bPciSlotNumber, bType)
	}
	companion object {
		inline fun builder(block: Builder.() -> Unit): VCenterSataAdapter = Builder().apply(block).build()
	}
}
class VCenterScsiAdapter(
	@SerializedName("label") val label: String? = "",
	@SerializedName("pci_slot_number") val pciSlotNumber: Int? = 0,
	@SerializedName("scsi") val scsi: VCenterScsi? = null,
	@SerializedName("sharing") val sharing: String? = "",
	@SerializedName("type") val type: String? = ""
) : Serializable {
	override fun toString(): String = gson.toJson(this)
	class Builder {
		private var bLabel: String? = ""; fun label(block: () -> String?) { bLabel = block() }
		private var bPciSlotNumber: Int? = 0; fun pciSlotNumber(block: () -> Int?) { bPciSlotNumber = block() }
		private var bScsi: VCenterScsi? = null; fun scsi(block: () -> VCenterScsi?) { bScsi = block() }
		private var bSharing: String? = ""; fun sharing(block: () -> String?) { bSharing = block() }
		private var bType: String? = ""; fun type(block: () -> String?) { bType = block() }
		fun build(): VCenterScsiAdapter = VCenterScsiAdapter(bLabel, bPciSlotNumber, bScsi, bSharing, bType)
	}
	companion object {
		inline fun builder(block: Builder.() -> Unit): VCenterScsiAdapter = Builder().apply(block).build()
	}
}
class VCenterSerialPort(
	@SerializedName("allow_guest_control") val allowGuestControl: Boolean? = false,
	@SerializedName("backing") val backing: SerialPortBacking? = null,
	@SerializedName("label") val label: String? = "",
	@SerializedName("start_connected") val startConnected: Boolean? = false,
	@SerializedName("state") val state: String? = "",
	@SerializedName("yield_on_poll") val yieldOnPoll: Boolean? = false
) : Serializable {
	override fun toString(): String = gson.toJson(this)
	class Builder {
		private var bAllowGuestControl: Boolean? = false; fun allowGuestControl(block: () -> Boolean?) { bAllowGuestControl = block() }
		private var bBacking: SerialPortBacking? = null; fun backing(block: SerialPortBacking.Builder.() -> Unit) { bBacking = SerialPortBacking.builder(block) }
		private var bLabel: String? = ""; fun label(block: () -> String?) { bLabel = block() }
		private var bStartConnected: Boolean? = false; fun startConnected(block: () -> Boolean?) { bStartConnected = block() }
		private var bState: String? = ""; fun state(block: () -> String?) { bState = block() }
		private var bYieldOnPoll: Boolean? = false; fun yieldOnPoll(block: () -> Boolean?) { bYieldOnPoll = block() }
		fun build(): VCenterSerialPort = VCenterSerialPort(bAllowGuestControl, bBacking, bLabel, bStartConnected, bState, bYieldOnPoll)
	}
	companion object {
		inline fun builder(block: Builder.() -> Unit): VCenterSerialPort = Builder().apply(block).build()
	}
}

class SerialPortBacking(
	@SerializedName("auto_detect") val autoDetect: Boolean? = false,
	@SerializedName("file") val file: String? = "",
	@SerializedName("host_device") val hostDevice: String? = "",
	@SerializedName("network_location") val networkLocation: String? = "",
	@SerializedName("no_rx_loss") val noRxLoss: Boolean? = false,
	@SerializedName("pipe") val pipe: String? = "",
	@SerializedName("proxy") val proxy: String? = "",
	@SerializedName("type") val type: String? = ""
) : Serializable {
	override fun toString(): String = gson.toJson(this)
	class Builder {
		private var bAutoDetect: Boolean? = false; fun autoDetect(block: () -> Boolean?) { bAutoDetect = block() }
		private var bFile: String? = ""; fun file(block: () -> String?) { bFile = block() }
		private var bHostDevice: String? = ""; fun hostDevice(block: () -> String?) { bHostDevice = block() }
		// *** Here we apply the URL transformation logic ***
		private var bNetworkLocation: String? = ""; fun networkLocation(block: () -> String?) { bNetworkLocation = block() }
		private var bNoRxLoss: Boolean? = false; fun noRxLoss(block: () -> Boolean?) { bNoRxLoss = block() }
		private var bPipe: String? = ""; fun pipe(block: () -> String?) { bPipe = block() }
		// *** Here we apply the URL transformation logic ***
		private var bProxy: String? = ""; fun proxy(block: () -> String?) { bProxy = block() }
		private var bType: String? = ""; fun type(block: () -> String?) { bType = block() }
		fun build(): SerialPortBacking = SerialPortBacking(bAutoDetect, bFile, bHostDevice, bNetworkLocation, bNoRxLoss, bPipe, bProxy, bType)
	}
	companion object {
		inline fun builder(block: Builder.() -> Unit): SerialPortBacking = Builder().apply(block).build()
	}
}

// region: Shared/Reused Helper Classes
class VCenterIdeInfo(
	@SerializedName("master") val master: Boolean? = false,
	@SerializedName("primary") val primary: Boolean? = false
) : Serializable {
	override fun toString(): String =
		gson.toJson(this)
	class Builder {
		private var bMaster: Boolean? = false; fun master(block: () -> Boolean?) { bMaster = block() }
		private var bPrimary: Boolean? = false; fun primary(block: () -> Boolean?) { bPrimary = block() }
		fun build(): VCenterIdeInfo = VCenterIdeInfo(bMaster, bPrimary)
	}
	companion object {
		inline fun builder(block: Builder.() -> Unit): VCenterIdeInfo = Builder().apply(block).build()
	}
}

class VCenterSataInfo(
	@SerializedName("bus") val bus: Int? = 0,
	@SerializedName("unit") val unit: Int? = 0
) : Serializable {
	override fun toString(): String =
		gson.toJson(this)
	class Builder {
		private var bBus: Int? = 0; fun bus(block: () -> Int?) { bBus = block() }
		private var bUnit: Int? = 0; fun unit(block: () -> Int?) { bUnit = block() }
		fun build(): VCenterSataInfo = VCenterSataInfo(bBus, bUnit)
	}
	companion object {
		inline fun builder(block: Builder.() -> Unit): VCenterSataInfo = Builder().apply(block).build()
	}
}

class VCenterScsi(
	@SerializedName("bus") val bus: Int? = 0,
	@SerializedName("unit") val unit: Int? = 0
): Serializable {
	override fun toString(): String =
		gson.toJson(this)
	class Builder {
		private var bBus: Int? = 0; fun bus(block: () -> Int?) { bBus = block() }
		private var bUnit: Int? = 0; fun unit(block: () -> Int?) { bUnit = block() }
		fun build(): VCenterScsi = VCenterScsi(bBus, bUnit)
	}
	companion object {
		inline fun builder(block: Builder.() -> Unit): VCenterScsi = Builder().apply(block).build()
	}
}
//endregion
