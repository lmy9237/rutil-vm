package com.itinfo.rutilvm.api.xml

import com.fasterxml.jackson.annotation.JsonAnySetter
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement
import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.common.parseEnhanced2LDT
import com.itinfo.rutilvm.api.ovirt.business.BiosTypeB
import com.itinfo.rutilvm.api.ovirt.business.CpuPinningPolicyB
import com.itinfo.rutilvm.api.ovirt.business.DiskInterfaceB
import com.itinfo.rutilvm.api.ovirt.business.DisplayTypeB
import com.itinfo.rutilvm.api.ovirt.business.GraphicsTypeB
import com.itinfo.rutilvm.api.ovirt.business.UsbPolicy
import com.itinfo.rutilvm.api.ovirt.business.VmOsType
import com.itinfo.rutilvm.api.ovirt.business.VmResumeBehavior
import com.itinfo.rutilvm.api.ovirt.business.VmTypeB
import com.itinfo.rutilvm.api.ovirt.business.VolumeFormat
import com.itinfo.rutilvm.api.ovirt.business.VolumeType
import org.slf4j.LoggerFactory
import org.w3c.dom.Node
import java.io.Serializable
import java.math.BigInteger
import java.text.SimpleDateFormat
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

private val log = LoggerFactory.getLogger(OvfEnvelope::class.java)

private const val NS_XSI = "http://www.w3.org/2001/XMLSchema-instance"
private const val NS_OVF = "http://schemas.dmtf.org/ovf/envelope/1/"
private const val NS_RASD = "http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ResourceAllocationSettingData"
private const val NS_VSSD = "http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_VirtualSystemSettingData"

private const val OVIRT_OVF_DATE_FORMAT = "yyyy/MM/dd HH:mm:ss"
private val ovfDf = SimpleDateFormat(OVIRT_OVF_DATE_FORMAT)
private val ovfDtf = DateTimeFormatter.ofPattern(OVIRT_OVF_DATE_FORMAT)

@JsonIgnoreProperties(ignoreUnknown = true)
data class OvfFile(
	@field:JacksonXmlProperty(isAttribute=true, localName="href", namespace=NS_OVF)			val href: String? = "",
	@field:JacksonXmlProperty(isAttribute=true, localName="id", namespace=NS_OVF)			val id: String? = "",
	@field:JacksonXmlProperty(isAttribute=true, localName="size", namespace=NS_OVF)			val size: Long? = 0L,
	@field:JacksonXmlProperty(isAttribute=true, localName="description", namespace=NS_OVF)	val description: String? = "",
	@field:JacksonXmlProperty(isAttribute=true, localName="disk_storage_type", namespace=NS_OVF)	val diskStorageType: String? = "",
	@field:JacksonXmlProperty(isAttribute=true, localName="cinder_volume_type", namespace=NS_OVF)	val cinderVolumeType: String? = "",
): Serializable {
	class Builder {
		private var bHref: String? = "";fun href(block: () -> String?) { bHref = block() ?: "" }
		private var bId: String? = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bSize: Long? = 0L;fun size(block: () -> Long?) { bSize = block() ?: 0L }
		private var bDescription: String? = "";fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bDiskStorageType: String? = "";fun diskStorageType(block: () -> String?) { bDiskStorageType = block() ?: "" }
		private var bCinderVolumeType: String? = "";fun cinderVolumeType(block: () -> String?) { bCinderVolumeType = block() ?: "" }
		fun build(): OvfFile = OvfFile(bHref, bId, bSize, bDescription, bDiskStorageType, bCinderVolumeType)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): OvfFile = Builder().apply(block).build()
	}
}

@JsonIgnoreProperties(ignoreUnknown = true)
data class OvfNetwork(
	@field:JacksonXmlProperty(isAttribute=true, localName="name", namespace=NS_OVF)		val name: String? = "",
): Serializable {
	class Builder {
		private var bName: String? = "";fun name(block: () -> String?) { bName = block() ?: "" }
		fun build(): OvfNetwork = OvfNetwork(bName)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): OvfNetwork = Builder().apply(block).build()
	}
}

fun Node.toOvfNetworks(): List<OvfNetwork> = this@toOvfNetworks.childNodes.toList().filter {
	!it.nodeName.contains("#text") &&
	it.nodeName.contains("Network")
}.mapIndexed { i, e ->
	val networkName = e.attributes.getNamedItem("ovf:name").textContent
	OvfNetwork.builder {
		name { networkName }
	}
}

@JsonIgnoreProperties(ignoreUnknown = true)
data class OvfDisk(
	@field:JacksonXmlProperty(isAttribute=true, localName="diskId", namespace=NS_OVF)				val diskId: String? = "",
	@field:JacksonXmlProperty(isAttribute=true, localName="size", namespace=NS_OVF)					val size: Int? = 0,
	@field:JacksonXmlProperty(isAttribute=true, localName="actual_size", namespace=NS_OVF)			val actualSize: Int? = 0,
	@field:JacksonXmlProperty(isAttribute=true, localName="vm_snapshot_id", namespace=NS_OVF)		val vmSnapshotId: String? = "",
	@field:JacksonXmlProperty(isAttribute=true, localName="parentRef", namespace=NS_OVF)			val parentRef: String? = "",
	@field:JacksonXmlProperty(isAttribute=true, localName="fileRef", namespace=NS_OVF)				val fileRef: String? = "",
	@field:JacksonXmlProperty(isAttribute=true, localName="format", namespace=NS_OVF)				private val _format: String? = "",
	@field:JacksonXmlProperty(isAttribute=true, localName="volume-format", namespace=NS_OVF)		private val _volumeFormat: String? = "",
	@field:JacksonXmlProperty(isAttribute=true, localName="volume-type", namespace=NS_OVF)			private val _volumeType: String? = "",
	@field:JacksonXmlProperty(isAttribute=true, localName="disk-interface", namespace=NS_OVF)		private val _diskInterface: String? = "",
	@field:JacksonXmlProperty(isAttribute=true, localName="read-only", namespace=NS_OVF)			val readOnly: Boolean? = false,
	@field:JacksonXmlProperty(isAttribute=true, localName="shareable", namespace=NS_OVF)			val shareable: Boolean? = false,
	@field:JacksonXmlProperty(isAttribute=true, localName="boot", namespace=NS_OVF)					val boot: Boolean? = false,
	@field:JacksonXmlProperty(isAttribute=true, localName="pass-discard", namespace=NS_OVF)			val passDiscard: Boolean? = false,
	@field:JacksonXmlProperty(isAttribute=true, localName="incremental-backup", namespace=NS_OVF)	val incrementalBackup: Boolean? = false,
	@field:JacksonXmlProperty(isAttribute=true, localName="disk-alias", namespace=NS_OVF)			val diskAlias: String? = "",
	@field:JacksonXmlProperty(isAttribute=true, localName="disk-description", namespace=NS_OVF)		val diskDescription: String? = "",
	@field:JacksonXmlProperty(isAttribute=true, localName="wipe-after-delete", namespace=NS_OVF)	val wipeAfterDelete: Boolean? = null,

	/*
	@field:JacksonXmlProperty(isAttribute=true, localName="capacity", namespace=NS_OVF)
	val capacity: String? = "", // Can be Long if you parse units

	@field:JacksonXmlProperty(isAttribute=true, localName="capacityAllocationUnits", namespace=NS_OVF)
	val capacityAllocationUnits: String? = "",
	*/
): Serializable {
	val volumeFormat: VolumeFormat?						get() = VolumeFormat.forCode(_volumeFormat)
	val volumeType: VolumeType?							get() = VolumeType.forCode(_volumeType)
	val diskInterface: DiskInterfaceB?					get() = DiskInterfaceB.forDescription(_diskInterface)
	override fun toString(): String =
		gson.toJson(this@OvfDisk)

	class Builder {
		private var bDiskId: String? = "";fun diskId(block: () -> String?) { bDiskId = block() ?: "" }
		private var bSize: Int? = 0;fun size(block: () -> Int?) { bSize = block() ?: 0 }
		private var bActualSize: Int? = 0;fun actualSize(block: () -> Int?) { bActualSize = block() ?: 0 }
		private var bVmSnapshotId: String? = "";fun vmSnapshotId(block: () -> String?) { bVmSnapshotId = block() ?: "" }
		private var bParentRef: String? = "";fun parentRef(block: () -> String?) { bParentRef = block() ?: "" }
		private var bFileRef: String? = "";fun fileRef(block: () -> String?) { bFileRef = block() ?: "" }
		private var bFormat: String? = "";fun format(block: () -> String?) { bFormat = block() ?: "" }
		private var bVolumeFormat: String? = "";fun volumeFormat(block: () -> String?) { bVolumeFormat = block() ?: "" }
		private var bVolumeType: String? = "";fun volumeType(block: () -> String?) { bVolumeType = block() ?: "" }
		private var bDiskInterface: String? = "";fun diskInterface(block: () -> String?) { bDiskInterface = block() ?: "" }
		private var bReadOnly: Boolean? = false;fun readOnly(block: () -> Boolean?) { bReadOnly = block() ?: false }
		private var bShareable: Boolean? = false;fun shareable(block: () -> Boolean?) { bShareable = block() ?: false }
		private var bBoot: Boolean? = false;fun boot(block: () -> Boolean?) { bBoot = block() ?: false }
		private var bPassDiscard: Boolean? = false;fun passDiscard(block: () -> Boolean?) { bPassDiscard = block() ?: false }
		private var bIncrementalBackup: Boolean? = false;fun incrementalBackup(block: () -> Boolean?) { bIncrementalBackup = block() ?: false }
		private var bDiskAlias: String? = "";fun diskAlias(block: () -> String?) { bDiskAlias = block() ?: "" }
		private var bDiskDescription: String? = "";fun diskDescription(block: () -> String?) { bDiskDescription = block() ?: "" }
		private var bWipeAfterDelete: Boolean? = null;fun wipeAfterDelete(block: () -> Boolean?) { bWipeAfterDelete = block() }
		private var bCapacity: String? = "";fun capacity(block: () -> String?) { bCapacity = block() ?: "" }
		private var bCapacityAllocationUnits: String? = "";fun capacityAllocationUnits(block: () -> String?) { bCapacityAllocationUnits = block() ?: "" }
		fun build(): OvfDisk = OvfDisk(bDiskId, bSize, bActualSize, bVmSnapshotId, bParentRef, bFileRef, bFormat, bVolumeFormat, bVolumeType, bDiskInterface, bReadOnly, bShareable, bBoot, bPassDiscard, bIncrementalBackup, bDiskAlias, bDiskDescription, bWipeAfterDelete/*, bCapacity, bCapacityAllocationUnits*/)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): OvfDisk = Builder().apply(block).build()
	}
}

fun Node.toOvfDisks(): List<OvfDisk> = this@toOvfDisks.childNodes.toList().filter {
	it.nodeName.contains("Disk")
}.mapIndexed { i, e ->
	val diskId = e.attributes.getNamedItem("ovf:diskId").textContent
	val diskSize = e.attributes.getNamedItem("ovf:size").textContent
	val diskActualSize = e.attributes.getNamedItem("ovf:actual_size").textContent
	val diskVmSnapshotId = e.attributes.getNamedItem("ovf:vm_snapshot_id").textContent
	val diskParentRef = e.attributes.getNamedItem("ovf:parentRef").textContent
	val diskFileRef = e.attributes.getNamedItem("ovf:fileRef").textContent
	val diskFormat = e.attributes.getNamedItem("ovf:format").textContent
	val diskVolumeFormat = e.attributes.getNamedItem("ovf:volume-format").textContent
	val diskVolumeType = e.attributes.getNamedItem("ovf:volume-type").textContent
	val diskDiskInterface = e.attributes.getNamedItem("ovf:disk-interface").textContent
	val diskReadOnly = e.attributes.getNamedItem("ovf:read-only").textContent
	val diskShareable = e.attributes.getNamedItem("ovf:shareable").textContent
	val diskBoot = e.attributes.getNamedItem("ovf:boot").textContent
	val diskPassDiscard = e.attributes.getNamedItem("ovf:pass-discard").textContent
	val diskIncrementalBackup = e.attributes.getNamedItem("ovf:incremental-backup").textContent
	val diskDiskAlias = e.attributes.getNamedItem("ovf:disk-alias").textContent
	val diskDiskDescription = e.attributes.getNamedItem("ovf:disk-description").textContent
	val diskWipeAfterDelete = e.attributes.getNamedItem("ovf:wipe-after-delete").textContent
	OvfDisk.builder {
		diskId { diskId }
		size { diskSize.toInt() }
		actualSize { diskActualSize.toInt() }
		vmSnapshotId { diskVmSnapshotId }
		parentRef { diskParentRef }
		fileRef { diskFileRef }
		format { diskFormat }
		volumeFormat { diskVolumeFormat }
		volumeType { diskVolumeType }
		diskInterface { diskDiskInterface }
		readOnly { diskReadOnly.toBoolean() }
		shareable { diskShareable.toBoolean() }
		boot { diskBoot.toBoolean() }
		passDiscard { diskPassDiscard.toBoolean() }
		incrementalBackup { diskIncrementalBackup.toBoolean() }
		diskAlias { diskDiskAlias }
		diskDescription { diskDiskDescription }
		wipeAfterDelete { diskWipeAfterDelete.toBoolean() }
	}
}

@JsonIgnoreProperties(ignoreUnknown = true)
data class OvfReferences(
	@field:JacksonXmlElementWrapper(useWrapping = false)
	@field:JacksonXmlProperty(localName="File", namespace=NS_OVF)
	val files: List<OvfFile>? = emptyList()
): Serializable {
	override fun toString(): String =
		gson.toJson(this@OvfReferences)

	class Builder {
		private var bFiles: List<OvfFile>? = listOf();fun files(block: () -> List<OvfFile>?) { bFiles = block() ?: emptyList()}
		fun build(): OvfReferences = OvfReferences(bFiles)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): OvfReferences = Builder().apply(block).build()
	}
}

fun Node.toOvfFiles(): List<OvfFile> = this@toOvfFiles.childNodes.toList().filter {
	!it.nodeName.contains("#text") &&
	it.nodeName.contains("File")
}.mapIndexed { i, e ->
	val fileHref = e.attributes.getNamedItem("ovf:href").textContent
	val fileId = e.attributes.getNamedItem("ovf:id").textContent
	val fileSize = e.attributes.getNamedItem("ovf:size").textContent
	val fileDescription = e.attributes.getNamedItem("ovf:description").textContent
	val fileDiskStorageType = e.attributes.getNamedItem("ovf:disk_storage_type").textContent
	val fileCinderVolumeType = e.attributes.getNamedItem("ovf:cinder_volume_type").textContent
	OvfFile.builder {
		href { fileHref }
		id { fileId }
		size { fileSize.toLong() }
		description { fileDescription }
		diskStorageType { fileDiskStorageType }
		cinderVolumeType { fileCinderVolumeType }
	}
}

@JsonIgnoreProperties(ignoreUnknown = true)
data class OvfNetworkSection(
	@field:JacksonXmlElementWrapper(useWrapping = false)
	@field:JacksonXmlProperty(localName="Network", namespace=NS_OVF)
	val networks: List<OvfNetwork>? = emptyList()
): Serializable {
	override fun toString(): String =
		gson.toJson(this@OvfNetworkSection)

	class Builder {
		private var bNetworks: List<OvfNetwork>? = emptyList();fun networks(block: () -> List<OvfNetwork>?) { bNetworks = block() ?: emptyList() }
		fun build(): OvfNetworkSection = OvfNetworkSection(bNetworks)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): OvfNetworkSection = Builder().apply(block).build()
	}
}

@JsonIgnoreProperties(ignoreUnknown=true)
data class OvfDiskSection(
	@field:JacksonXmlElementWrapper(useWrapping = false)
	@field:JacksonXmlProperty(localName="Disk")
	val disks: List<OvfDisk>? = arrayListOf()
): Serializable {
	override fun toString(): String =
		gson.toJson(this@OvfDiskSection)

	class Builder {
		private var bDisks: List<OvfDisk>? = emptyList();fun disks(block: () -> List<OvfDisk>?) { bDisks = block() ?: emptyList() }
		fun build(): OvfDiskSection = OvfDiskSection(bDisks)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): OvfDiskSection = Builder().apply(block).build()
	}
}

@JsonIgnoreProperties(ignoreUnknown=true)
data class OvfDomainsSection(
	@field:JacksonXmlElementWrapper(useWrapping=false)
	@field:JacksonXmlProperty(localName="User")
	val user: OvfUser? = null
): Serializable {

}

@JsonIgnoreProperties(ignoreUnknown=true)
data class OvfUser(
	@field:JacksonXmlElementWrapper(useWrapping=false)
	@field:JacksonXmlProperty(localName="UserDomain")
	val userDomain: String? = ""
): Serializable {

}

@JsonIgnoreProperties(ignoreUnknown = true)
sealed class RasdItem (
	@field:JacksonXmlProperty(localName="InstanceID", namespace=NS_RASD)	val instanceId: String? = "", // Unique ID for this item within the VM
	@field:JacksonXmlProperty(localName="ResourceType", namespace=NS_RASD)	private val _resourceType: Int = 0, // DMTF standard resource type (e.g., 3=CPU, 4=Memory, 17=Disk, 10=Ethernet)
	/*
	@field:JacksonXmlProperty(localName="ElementName", namespace=NS_RASD)
	val elementName: String? = "",

	//region CPU specific (if ResourceType == 3)
	@field:JacksonXmlProperty(localName="num_of_sockets", namespace=NS_RASD)
	val numOfSockets: Int? = null,
	@field:JacksonXmlProperty(localName="cpu_per_socket", namespace=NS_RASD)
	val cpuPerSocket: Int? = null,
	@field:JacksonXmlProperty(localName="threads_per_cpu", namespace=NS_RASD)
	val threadsPerCpu: Int? = null,
	@field:JacksonXmlProperty(localName="max_num_of_vcpus", namespace=NS_RASD)
	val maxNumOfVcpus: Int? = null,
	@field:JacksonXmlProperty(localName="VirtualQuantity", namespace=NS_RASD)
	val virtualQuantity: Long? = null, // For CPU (cores), Memory (MB), Video (heads)
	//endregion

	//region Memory specific (if ResourceType == 4)
	@field:JacksonXmlProperty(localName="AllocationUnits", namespace=NS_RASD)
	val allocationUnits: String? = "", // e.g., "MegaBytes"
	//endregion

	//region Disk specific (if ResourceType == 17)
	@field:JacksonXmlProperty(localName="HostResource", namespace=NS_RASD)
	val hostResource: String? = "", // e.g., "ovf:/disk/disk-id" or "image-uuid/disk-uuid" in oVirt
	@field:JacksonXmlProperty(localName="Parent", namespace=NS_RASD)
	val parent: String? = "",
	@field:JacksonXmlProperty(localName="Template", namespace=NS_RASD)
	val template: String? = "", // Template disk ID
	@field:JacksonXmlProperty(localName="ApplicationList", namespace=NS_RASD)
	val applicationList: String? = "",
	@field:JacksonXmlProperty(localName="StorageId", namespace=NS_RASD)
	val storageId: String? = "", // Storage Domain UUID
	@field:JacksonXmlProperty(localName="StoragePoolId", namespace=NS_RASD)
	val storagePoolId: String? = "", // Data Center UUID
	@field:JacksonXmlProperty(localName="CreationDate", namespace=NS_RASD)
	val deviceCreationDate: String? = "", // Note: OvfContent also has CreationDate
	@field:JacksonXmlProperty(localName="LastModified", namespace=NS_RASD)
	val deviceLastModified: String? = "",
	@field:JacksonXmlProperty(localName="last_modified_date", namespace=NS_RASD)
	val deviceLastModifiedDateOvirt: String? = "",
	//endregion

	//region Network specific (if ResourceType == 10)
	@field:JacksonXmlProperty(localName="OtherResourceType", namespace=NS_RASD)
	val otherResourceType: String? = "",
	@field:JacksonXmlProperty(localName="ResourceSubType", namespace=NS_RASD)
	val resourceSubType: String? = "",
	@field:JacksonXmlProperty(localName="Connection", namespace=NS_RASD)
	val connection: String? = "", // Network name
	@field:JacksonXmlProperty(localName="Linked", namespace=NS_RASD)
	val linked: Boolean? = null,
	@field:JacksonXmlProperty(localName="Name", namespace=NS_RASD) // Typically for NICs
	val deviceName: String? = "", // e.g. "nic1"
	@field:JacksonXmlProperty(localName="MACAddress", namespace=NS_RASD)
	val macAddress: String? = "",
	@field:JacksonXmlProperty(localName="speed", namespace=NS_RASD)
	val speed: Int? = null,
	//endregion

	//region USB Controller (if ResourceType == 23)
	@field:JacksonXmlProperty(localName="UsbPolicy", namespace=NS_RASD)
	val usbPolicy: String? = "",
	//endregion

	//region Video Controller (if ResourceType == 20)
	@field:JacksonXmlProperty(localName="SinglePciQxl", namespace=NS_RASD)
	val singlePciQxl: Boolean? = null,
	//endregion

	//region Common non-namespaced child elements of <Item>
	@field:JacksonXmlProperty(localName="Type")
	val itemType: String? = "", // e.g. "disk", "interface", "video", "controller"
	@field:JacksonXmlProperty(localName="Device")
	val itemDevice: String? = "", // e.g. "disk", "bridge", "vga", "pci"
	@field:JacksonXmlProperty(localName="Address", namespace=NS_RASD) // Address is RASD
	val address: String? = "",
	@field:JacksonXmlProperty(localName="BootOrder")
	val bootOrder: Int? = null,
	@field:JacksonXmlProperty(localName="IsPlugged")
	val isPlugged: Boolean? = null,
	@field:JacksonXmlProperty(localName="IsReadOnly")
	val isReadOnly: Boolean? = null,
	@field:JacksonXmlProperty(localName="Alias")
	val alias: String? = "",
	@field:JacksonXmlProperty(localName="SpecParams")
	val specParams: RasdSpecParams? = null*/
	//endregion
	// Add other RASD properties as needed
): Serializable {
	override fun toString(): String =
		gson.toJson(this@RasdItem)
}

/**
 * [RasdItemTypeUnknown]
 * 알수 없는 Type에 대한 나열
 *
 * @author 이찬희 (@chanhi2000)
 */
class RasdItemTypeUnknown(
	instanceId: String?,
): RasdItem(instanceId, -1), Serializable {
	override fun toString(): String =
		gson.toJson(this@RasdItemTypeUnknown)

	class Builder {
		private var bInstanceId: String? = "";fun instanceId(block: () -> String?) { bInstanceId = block() ?: "" }
		fun build(): RasdItemTypeUnknown = RasdItemTypeUnknown(bInstanceId)
	}

	companion object {
		inline fun builder(block: RasdItemTypeUnknown.Builder.() -> Unit): RasdItemTypeUnknown = RasdItemTypeUnknown.Builder().apply(block).build()
	}
}

/**
 * [RasdItemType0]
 * Type0: 디바이스 모음?
 *
 * @author 이찬희 (@chanhi2000)
 */
class RasdItemType0(
	instanceId: String?,
	val type: String? = "", // controller, channel, disk, graphics video ...
	val device: String? = "", // channel.unix, disk.cdrom, grpahics.vnc, video.vga ...
	val address: String? = "", // in UUID form
	val bootOrder: Int? = 0,
	val isPlugged: Boolean? = true,
	val isReadOnly: Boolean? = false,
	val alias: String? = "",
): RasdItem(instanceId, 0), Serializable { // TODO: RasdItemDevice로 인터페이스 구성
	override fun toString(): String =
		gson.toJson(this@RasdItemType0)

	// TODO: SpecParams에 대한 값 정리
	class Builder {
		private var bInstanceId: String? = "";fun instanceId(block: () -> String?) { bInstanceId = block() ?: "" }
		private var bType: String? = "";fun type(block: () -> String?) { bType = block() ?: "" }
		private var bDevice: String? = "";fun device(block: () -> String?) { bDevice = block() ?: "" }
		private var bAddress: String? = "";fun address(block: () -> String?) { bAddress = block() ?: "" }
		private var bBootOrder: Int? = 0;fun bootOrder(block: () -> Int?) { bBootOrder = block() ?: 0 }
		private var bIsPlugged: Boolean? = true;fun isPlugged(block: () -> Boolean?) { bIsPlugged = block() ?: true }
		private var bIsReadOnly: Boolean? = false;fun isReadOnly(block: () -> Boolean?) { bIsReadOnly = block() ?: false }
		private var bAlias: String? = "";fun alias(block: () -> String?) { bAlias = block() ?: "" }
		fun build(): RasdItemType0 = RasdItemType0(bInstanceId, bType, bDevice, bAddress, bBootOrder, bIsPlugged, bIsReadOnly, bAlias)
	}

	companion object {
		inline fun builder(block: RasdItemType0.Builder.() -> Unit): RasdItemType0 = RasdItemType0.Builder().apply(block).build()
	}
}

/**
 * [RasdItemType3]
 * Type3: 가상머신 CPU정보
 *
 * @author 이찬희 (@chanhi2000)
 */
class RasdItemType3(
	instanceId: String?,
	val caption: String? = "",
	val description: String? = "",
	val numOfSockets: Int? = 1,
	val cpuPerSocket: Int? = 4,
	val threadsPerCpu: Int? = 2,
	val maxNumOfVcpus: Int? = 1,
): RasdItem(instanceId, 3), Serializable {
	val virtualQuantity: Int? /* 가상화 값? */		get() =
		numOfSockets
			?.times(cpuPerSocket ?: 1)
			?.times(threadsPerCpu ?: 1)

	override fun toString(): String =
		gson.toJson(this@RasdItemType3)

	class Builder {
		private var bInstanceId: String? = "";fun instanceId(block: () -> String?) { bInstanceId = block() ?: "" }
		private var bCaption: String? = "";fun caption(block: () -> String?) { bCaption = block() ?: "" }
		private var bDescription: String? = "";fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bNumOfSockets: Int? = 1;fun numOfSockets(block: () -> Int?) { bNumOfSockets = block() ?: 1 }
		private var bCpuPerSocket: Int? = 4;fun cpuPerSocket(block: () -> Int?) { bCpuPerSocket = block() ?: 4 }
		private var bThreadsPerCpu: Int? = 2;fun threadsPerCpu(block: () -> Int?) { bThreadsPerCpu = block() ?: 2 }
		private var bMaxNumOfVcpus: Int? = 1;fun maxNumOfVcpus(block: () -> Int?) { bMaxNumOfVcpus = block() ?: 1 }
		fun build(): RasdItemType3 = RasdItemType3(bInstanceId, bCaption, bDescription, bNumOfSockets, bCpuPerSocket, bThreadsPerCpu, bMaxNumOfVcpus)
	}

	companion object {
		inline fun builder(block: RasdItemType3.Builder.() -> Unit): RasdItemType3 = RasdItemType3.Builder().apply(block).build()
	}
}

/**
 * [RasdItemType4]
 * Type4: 메모리
 *
 * @author 이찬희 (@chanhi2000)
 */
class RasdItemType4(
	instanceId: String?,
	val caption: String? = "",
	val description: String? = "",
	val allocationUnits: String? = "MegaBytes",
	val virtualQuantity: Int? = 4096,
): RasdItem(instanceId, 4), Serializable {

	override fun toString(): String =
		gson.toJson(this@RasdItemType4)

	class Builder {
		private var bInstanceId: String? = "";fun instanceId(block: () -> String?) { bInstanceId = block() ?: "" }
		private var bCaption: String? = "";fun caption(block: () -> String?) { bCaption = block() ?: "" }
		private var bDescription: String? = "";fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bAllocationUnits: String? = "MegaBytes";fun allocationUnits(block: () -> String?) { bAllocationUnits = block() ?: "MegaBytes" }
		private var bVirtualQuantity: Int? = 4;fun virtualQuantity(block: () -> Int?) { bVirtualQuantity = block() ?: 4096 }
		fun build(): RasdItemType4 = RasdItemType4(bInstanceId, bCaption, bDescription, bAllocationUnits, bVirtualQuantity)
	}

	companion object {
		inline fun builder(block: RasdItemType4.Builder.() -> Unit): RasdItemType4 = RasdItemType4.Builder().apply(block).build()
	}
}

/**
 * [RasdItemType10]
 * Type10: NIC
 *
 * @author 이찬희 (@chanhi2000)
 */
class RasdItemType10(
	instanceId: String?,
	val caption: String? = "",
	val otherResourceType: String? = "ovirtmgmt", // TODO: 뭔지모름
	val resourceSubType: Int? = 3, // TODO: 뭔지모름
	val connection: String? = "ovirtmgmt",  // TODO: 뭔지모름
	val linked: Boolean? = false,
	val name: String? = "",
	val elementName: String? = "",
	val macAddress: String? = "",
	val speed: Int? = 10000,
	val type: String? = DEFAULT_TYPE, // controller, channel, disk, graphics video ...
	val device: String? = DEFAULT_DEVICE, // channel.unix, disk.cdrom, grpahics.vnc, video.vga ...
	val address: String? = "", // in UUID form
	val bootOrder: Int? = 0,
	val isPlugged: Boolean? = true,
	val isReadOnly: Boolean? = false,
	val alias: String? = "",
): RasdItem(instanceId, 10), Serializable { // TODO: RasdItemDevice 인터페이스로 처리
	override fun toString(): String =
		gson.toJson(this@RasdItemType10)

	class Builder {
		private var bInstanceId: String? = "";fun instanceId(block: () -> String?) { bInstanceId = block() ?: "" }
		private var bCaption: String? = "";fun caption(block: () -> String?) { bCaption = block() ?: "" }
		private var bOtherResourceType: String? = "";fun otherResourceType(block: () -> String?) { bOtherResourceType = block() ?: "" }
		private var bResourceSubType: Int? = 3;fun resourceSubType(block: () -> Int?) { bResourceSubType = block() ?: 3 }
		private var bConnection: String? = "";fun connection(block: () -> String?) { bConnection = block() ?: "" }
		private var bLinked: Boolean? = true;fun linked(block: () -> Boolean?) { bLinked = block() ?: true }
		private var bName: String? = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bElementName: String? = "";fun elementName(block: () -> String?) { bElementName = block() ?: "" }
		private var bMacAddress: String? = "";fun macAddress(block: () -> String?) { bMacAddress = block() ?: "" }
		private var bSpeed: Int? = 10000;fun speed(block: () -> Int?) { bSpeed = block() ?: 10000 }
		private var bType: String? = DEFAULT_TYPE;fun type(block: () -> String?) { bType = block() ?: DEFAULT_TYPE }
		private var bDevice: String? = DEFAULT_DEVICE;fun device(block: () -> String?) { bDevice = block() ?: DEFAULT_DEVICE }
		private var bAddress: String? = "";fun address(block: () -> String?) { bAddress = block() ?: "" }
		private var bBootOrder: Int? = 0;fun bootOrder(block: () -> Int?) { bBootOrder = block() ?: 0 }
		private var bIsPlugged: Boolean? = true;fun isPlugged(block: () -> Boolean?) { bIsPlugged = block() ?: true }
		private var bIsReadOnly: Boolean? = false;fun isReadOnly(block: () -> Boolean?) { bIsReadOnly = block() ?: false }
		private var bAlias: String? = "";fun alias(block: () -> String?) { bAlias = block() ?: "" }
		fun build(): RasdItemType10 = RasdItemType10(bInstanceId, bCaption, bOtherResourceType, bResourceSubType, bConnection, bLinked, bName, bElementName, bMacAddress, bSpeed, bType, bDevice, bAddress, bBootOrder, bIsPlugged, bIsReadOnly, bAlias)
	}

	companion object {
		const val DEFAULT_DEVICE = "bridge"
		const val DEFAULT_TYPE = "interface"
		inline fun builder(block: RasdItemType10.Builder.() -> Unit): RasdItemType10 = RasdItemType10.Builder().apply(block).build()
	}
}

/**
 * [RasdItemType15]
 * Type15: CD-ROM 장치
 *
 * @author 이찬희 (@chanhi2000)
 */
class RasdItemType15(
	instanceId: String?,
	val caption: String? = "",
	val type: String? = DEFAULT_TYPE, // controller, channel, disk, graphics video ...
	val device: String? = DEFAULT_DEVICE, // channel.unix, disk.cdrom, grpahics.vnc, video.vga ...
	val address: String? = "", // in UUID form
	val bootOrder: Int? = 0,
	val isPlugged: Boolean? = true,
	val isReadOnly: Boolean? = false,
	val alias: String? = "",
): RasdItem(instanceId, 15), Serializable { // TODO: RasdItemDevice 인터페이스로 처리

	override fun toString(): String =
		gson.toJson(this@RasdItemType15)

	class Builder {
		private var bInstanceId: String? = "";fun instanceId(block: () -> String?) { bInstanceId = block() ?: "" }
		private var bCaption: String? = "";fun caption(block: () -> String?) { bCaption = block() ?: "" }
		private var bType: String? = DEFAULT_TYPE;fun type(block: () -> String?) { bType = block() ?: DEFAULT_TYPE }
		private var bDevice: String? = DEFAULT_DEVICE;fun device(block: () -> String?) { bDevice = block() ?: DEFAULT_DEVICE }
		private var bAddress: String? = "";fun address(block: () -> String?) { bAddress = block() ?: "" }
		private var bBootOrder: Int? = 0;fun bootOrder(block: () -> Int?) { bBootOrder = block() ?: 0 }
		private var bIsPlugged: Boolean? = true;fun isPlugged(block: () -> Boolean?) { bIsPlugged = block() ?: true }
		private var bIsReadOnly: Boolean? = false;fun isReadOnly(block: () -> Boolean?) { bIsReadOnly = block() ?: false }
		private var bAlias: String? = "";fun alias(block: () -> String?) { bAlias = block() ?: "" }
		fun build(): RasdItemType15 = RasdItemType15(bInstanceId, bCaption, bType, bDevice, bAddress, bBootOrder, bIsPlugged, bIsReadOnly, bAlias)
	}

	companion object {
		const val DEFAULT_TYPE = "disk"
		const val DEFAULT_DEVICE = "cdrom"
		inline fun builder(block: RasdItemType15.Builder.() -> Unit): RasdItemType15 = RasdItemType15.Builder().apply(block).build()
	}
}

/**
 * [RasdItemType17]
 * Type17: 디스크?
 *
 * @author 이찬희 (@chanhi2000)
 */
class RasdItemType17(
	instanceId: String?,
	val caption: String? = "",
	val hostResource: String? = "",
	val parentId: String? = "",	// 부모 ID (디스크로 추측)
	val templateId: String? = "",	// 템플릿 ID
	private val _applications: String? = "", // TODO: 내용물이 뭔지 몰라 스킵
	val storageId: String? = "",
	val storagePoolId: String? = null,
	private val _creationDate: String? = null,
	private val _lastModified: String? = null,
	private val _lastModifiedDate: String? = "",
	val type: String? = DEFAULT_DEVICE_TYPE, // controller, channel, disk, graphics video ...
	val device: String? = DEFAULT_DEVICE_TYPE, // channel.unix, disk.cdrom, grpahics.vnc, video.vga ...
	val address: String? = "", // in UUID form
	val bootOrder: Int? = 0,
	val isPlugged: Boolean? = true,
	val isReadOnly: Boolean? = false,
	val alias: String? = "",
): RasdItem(instanceId, 17), Serializable { // TODO: RasdItemDevice 인터페이스로 처리
	val applications: List<String>				get() = _applications?.split(",") ?: emptyList()
	val creationDate: LocalDateTime?			get() = ovfDtf.parseEnhanced2LDT(_creationDate)
	val lastModified: LocalDateTime?			get() = ovfDtf.parseEnhanced2LDT(_lastModified)
	val lastModifiedDate: LocalDateTime?		get() = ovfDtf.parseEnhanced2LDT(_lastModifiedDate)

	override fun toString(): String =
		gson.toJson(this@RasdItemType17)

	class Builder {
		private var bInstanceId: String? = "";fun instanceId(block: () -> String?) { bInstanceId = block() ?: "" }
		private var bCaption: String? = "";fun caption(block: () -> String?) { bCaption = block() ?: "" }
		private var bHostResource: String? = "";fun hostResource(block: () -> String?) { bHostResource = block() ?: "" }
		private var bParentId: String? = "";fun parentId(block: () -> String?) { bParentId = block() ?: "" }
		private var bTemplateId: String? = "";fun templateId(block: () -> String?) { bTemplateId = block() ?: "" }
		private var bApplications: String? = "";fun applications(block: () -> String?) { bApplications = block() ?: "" }
		private var bStorageId: String? = "";fun storageId(block: () -> String?) { bStorageId = block() ?: "" }
		private var bStoragePoolId: String? = "";fun storagePoolId(block: () -> String?) { bStoragePoolId = block() ?: "" }
		private var bCreationDate: String? = null;fun creationDate(block: () -> String?) { bCreationDate = block() }
		private var bLastModified: String? = null;fun lastModified(block: () -> String?) { bLastModified = block() }
		private var bLastModifiedDate: String? = null;fun lastModifiedDate(block: () -> String?) { bLastModifiedDate = block() }
		private var bType: String? = DEFAULT_DEVICE_TYPE;fun type(block: () -> String?) { bType = block() ?: DEFAULT_DEVICE_TYPE }
		private var bDevice: String? = DEFAULT_DEVICE_TYPE;fun device(block: () -> String?) { bDevice = block() ?: DEFAULT_DEVICE_TYPE }
		private var bAddress: String? = "";fun address(block: () -> String?) { bAddress = block() ?: "" }
		private var bBootOrder: Int? = 0;fun bootOrder(block: () -> Int?) { bBootOrder = block() ?: 0 }
		private var bIsPlugged: Boolean? = true;fun isPlugged(block: () -> Boolean?) { bIsPlugged = block() ?: true }
		private var bIsReadOnly: Boolean? = false;fun isReadOnly(block: () -> Boolean?) { bIsReadOnly = block() ?: false }
		private var bAlias: String? = "";fun alias(block: () -> String?) { bAlias = block() ?: "" }
		fun build(): RasdItemType17 = RasdItemType17(bInstanceId, bCaption, bHostResource, bParentId, bTemplateId, bApplications, bStorageId, bStoragePoolId, bCreationDate, bLastModified, bLastModifiedDate, bType, bDevice, bAddress, bBootOrder, bIsPlugged, bIsReadOnly, bAlias)
	}

	companion object {
		const val DEFAULT_DEVICE_TYPE = "disk"
		inline fun builder(block: RasdItemType17.Builder.() -> Unit): RasdItemType17 = RasdItemType17.Builder().apply(block).build()
	}
}

/**
 * [RasdItemType20]
 * Type20: 디스플레이 유형
 */
class RasdItemType20(
	instanceId: String?,
	val caption: String? = "",
	val virtualQuantity: Int? = 1, // 항상 1
	val singlePciQxl: Boolean? = false,
	val type: String? = DEFAULT_TYPE, // controller, channel, disk, graphics video ...
	val device: String? = DEFAULT_DEVICE, // channel.unix, disk.cdrom, grpahics.vnc, video.vga ...
	val address: String? = "", // in UUID form
	val bootOrder: Int? = 0,
	val isPlugged: Boolean? = true,
	val isReadOnly: Boolean? = false,
	val alias: String? = "",
): RasdItem(instanceId, 20), Serializable { // TODO: RasdItemDevice 인터페이스로 처리

	override fun toString(): String =
		gson.toJson(this@RasdItemType20)

	class Builder {
		private var bInstanceId: String? = "";fun instanceId(block: () -> String?) { bInstanceId = block() ?: "" }
		private var bCaption: String? = "";fun caption(block: () -> String?) { bCaption = block() ?: "" }
		private var bVirtualQuantity: Int? = 1;fun virtualQuantity(block: () -> Int?) { bVirtualQuantity = block() ?: 1 }
		private var bSinglePciQxl: Boolean? = false;fun singlePciQxl(block: () -> Boolean?) { bSinglePciQxl = block() ?: false }
		private var bType: String? = DEFAULT_TYPE;fun type(block: () -> String?) { bType = block() ?: DEFAULT_TYPE }
		private var bDevice: String? = DEFAULT_DEVICE;fun device(block: () -> String?) { bDevice = block() ?: DEFAULT_DEVICE }
		private var bAddress: String? = "";fun address(block: () -> String?) { bAddress = block() ?: "" }
		private var bBootOrder: Int? = 0;fun bootOrder(block: () -> Int?) { bBootOrder = block() ?: 0 }
		private var bIsPlugged: Boolean? = true;fun isPlugged(block: () -> Boolean?) { bIsPlugged = block() ?: true }
		private var bIsReadOnly: Boolean? = false;fun isReadOnly(block: () -> Boolean?) { bIsReadOnly = block() ?: false }
		private var bAlias: String? = "";fun alias(block: () -> String?) { bAlias = block() ?: "" }
		fun build(): RasdItemType20 = RasdItemType20(bInstanceId, bCaption, bVirtualQuantity, bSinglePciQxl, bType, bDevice, bAddress, bBootOrder, bIsPlugged, bIsReadOnly, bAlias)
	}

	companion object {
		const val DEFAULT_TYPE = "graphics"
		const val DEFAULT_DEVICE = "vnc"
		inline fun builder(block: RasdItemType20.Builder.() -> Unit): RasdItemType20 = RasdItemType20.Builder().apply(block).build()
	}
}

/**
 * [RasdItemType23]
 * Type23: USB 장치
 *
 * @author 이찬희 (@chanhi2000)
 */
class RasdItemType23(
	instanceId: String?,
	val caption: String? = "",
	private val _usbPolicy: String? = "",
): RasdItem(instanceId, 23), Serializable { // TODO: RasdItemDevice 인터페이스로 처리
	val usbPolicy: UsbPolicy?			get() = UsbPolicy.forCode(_usbPolicy)

	override fun toString(): String =
		gson.toJson(this@RasdItemType23)

	class Builder {
		private var bInstanceId: String? = "";fun instanceId(block: () -> String?) { bInstanceId = block() ?: "" }
		private var bCaption: String? = "";fun caption(block: () -> String?) { bCaption = block() ?: "" }
		private var bUsbPolicy: String? = "";fun usbPolicy(block: () -> String?) { bUsbPolicy = block() ?: "" }
		fun build(): RasdItemType23 = RasdItemType23(bInstanceId, bCaption, bUsbPolicy)
	}

	companion object {
		inline fun builder(block: RasdItemType23.Builder.() -> Unit): RasdItemType23 = RasdItemType23.Builder().apply(block).build()
	}
}

/**
 * [RasdItemType26]
 * Type26: 그래픽 프로토콜
 *
 * @author 이찬희 (@chanhi2000)
 */
class RasdItemType26(
	instanceId: String?,
	val caption: String? = "",
	val type: String? = DEFAULT_TYPE, // controller, channel, disk, graphics video ...
	val device: String? = DEFAULT_DEVICE, // channel.unix, disk.cdrom, grpahics.vnc, video.vga ...
	val address: String? = "", // in UUID form
	val bootOrder: Int? = 0,
	val isPlugged: Boolean? = true,
	val isReadOnly: Boolean? = false,
	val alias: String? = "",
): RasdItem(instanceId, 26), Serializable { // TODO: RasdItemDevice 인터페이스로 처리

	override fun toString(): String =
		gson.toJson(this@RasdItemType26)

	class Builder {
		private var bInstanceId: String? = "";fun instanceId(block: () -> String?) { bInstanceId = block() ?: "" }
		private var bCaption: String? = "";fun caption(block: () -> String?) { bCaption = block() ?: "" }
		private var bType: String? = DEFAULT_TYPE;fun type(block: () -> String?) { bType = block() ?: DEFAULT_TYPE }
		private var bDevice: String? = DEFAULT_DEVICE;fun device(block: () -> String?) { bDevice = block() ?: DEFAULT_DEVICE }
		private var bAddress: String? = "";fun address(block: () -> String?) { bAddress = block() ?: "" }
		private var bBootOrder: Int? = 0;fun bootOrder(block: () -> Int?) { bBootOrder = block() ?: 0 }
		private var bIsPlugged: Boolean? = true;fun isPlugged(block: () -> Boolean?) { bIsPlugged = block() ?: true }
		private var bIsReadOnly: Boolean? = false;fun isReadOnly(block: () -> Boolean?) { bIsReadOnly = block() ?: false }
		private var bAlias: String? = "";fun alias(block: () -> String?) { bAlias = block() ?: "" }
		fun build(): RasdItemType26 = RasdItemType26(bInstanceId, bCaption, bType, bDevice, bAddress, bBootOrder, bIsPlugged, bIsReadOnly, bAlias)
	}

	companion object {
		const val DEFAULT_DEVICE = "vnc"
		const val DEFAULT_TYPE = "graphics"
		inline fun builder(block: RasdItemType26.Builder.() -> Unit): RasdItemType26 = RasdItemType26.Builder().apply(block).build()
	}
}

fun Node.toOvfRasdItem(): RasdItem = this@toOvfRasdItem.childNodes.toList().filter {
	!it.nodeName.contains("#text")
	// it.nodeName.contains("#text")
}.associateBy(keySelector = {it.nodeName}, valueTransform = {it.textContent}).toOvfRasdItemFromMap()

fun Map<String, String>.toOvfRasdItemFromMap(): RasdItem {
	val resourceType: Int? = this@toOvfRasdItemFromMap["rasd:ResourceType"]?.toIntOrNull()
	// 현재까지 찾은 유형으로만 정리
	return when(resourceType) {
		0 -> RasdItemType0.builder {
			instanceId { this@toOvfRasdItemFromMap["rasd:InstanceId"] }
			type { this@toOvfRasdItemFromMap["Type"] }
			device { this@toOvfRasdItemFromMap["Device"] }
			address { this@toOvfRasdItemFromMap["rasd:Address"] }
			bootOrder { this@toOvfRasdItemFromMap["BootOrder"]?.toIntOrNull() }
			isPlugged { this@toOvfRasdItemFromMap["IsPlugged"].toBoolean() }
			isReadOnly { this@toOvfRasdItemFromMap["IsReadOnly"].toBoolean() }
			alias { this@toOvfRasdItemFromMap["Alias"] }
		}
		3 -> RasdItemType3.builder {
			instanceId { this@toOvfRasdItemFromMap["rasd:InstanceId"] }
			caption { this@toOvfRasdItemFromMap["rasd:Caption"] }
			description { this@toOvfRasdItemFromMap["rasd:Description"] }
			numOfSockets { this@toOvfRasdItemFromMap["rasd:num_of_sockets"]?.toIntOrNull() }
			cpuPerSocket { this@toOvfRasdItemFromMap["rasd:cpu_per_socket"]?.toIntOrNull() }
			threadsPerCpu { this@toOvfRasdItemFromMap["rasd:threads_per_cpu"]?.toIntOrNull() }
			maxNumOfVcpus { this@toOvfRasdItemFromMap["rasd:max_num_of_vcpus"]?.toIntOrNull() }
		}
		4 -> RasdItemType4.builder {
			instanceId { this@toOvfRasdItemFromMap["rasd:InstanceId"] }
			caption { this@toOvfRasdItemFromMap["rasd:Caption"] }
			description { this@toOvfRasdItemFromMap["rasd:Description"] }
			allocationUnits { this@toOvfRasdItemFromMap["rasd:AllocationUnits"] }
			virtualQuantity { this@toOvfRasdItemFromMap["rasd:VirtualQuantity"]?.toIntOrNull() }
		}
		10 -> RasdItemType10.builder {
			instanceId { this@toOvfRasdItemFromMap["rasd:InstanceId"] }
			caption { this@toOvfRasdItemFromMap["rasd:Caption"] }
			otherResourceType { this@toOvfRasdItemFromMap["rasd:OtherResourceType"] }
			resourceSubType { this@toOvfRasdItemFromMap["rasd:ResourceSubType"]?.toIntOrNull() }
			connection { this@toOvfRasdItemFromMap["rasd:Connection"] }
			linked { this@toOvfRasdItemFromMap["rasd:Linked"].toBoolean() }
			name { this@toOvfRasdItemFromMap["rasd:Name"] }
			elementName { this@toOvfRasdItemFromMap["rasd:ElementName"] }
			macAddress { this@toOvfRasdItemFromMap["rasd:MACAddress"] }
			speed { this@toOvfRasdItemFromMap["rasd:speed"]?.toIntOrNull() }
			type { this@toOvfRasdItemFromMap["Type"] }
			device { this@toOvfRasdItemFromMap["Device"] }
			address { this@toOvfRasdItemFromMap["rasd:Address"] }
			bootOrder { this@toOvfRasdItemFromMap["BootOrder"]?.toIntOrNull() }
			isPlugged { this@toOvfRasdItemFromMap["IsPlugged"].toBoolean() }
			isReadOnly { this@toOvfRasdItemFromMap["IsReadOnly"].toBoolean() }
			alias { this@toOvfRasdItemFromMap["Alias"] }
		}
		15 -> RasdItemType15.builder {
			instanceId { this@toOvfRasdItemFromMap["rasd:InstanceId"] }
			caption { this@toOvfRasdItemFromMap["rasd:Caption"] }
			type { this@toOvfRasdItemFromMap["Type"] }
			device { this@toOvfRasdItemFromMap["Device"] }
			address { this@toOvfRasdItemFromMap["rasd:Address"] }
			bootOrder { this@toOvfRasdItemFromMap["BootOrder"]?.toIntOrNull() }
			isPlugged { this@toOvfRasdItemFromMap["IsPlugged"].toBoolean() }
			isReadOnly { this@toOvfRasdItemFromMap["IsReadOnly"].toBoolean() }
			alias { this@toOvfRasdItemFromMap["Alias"] }
		}
		17 -> RasdItemType17.builder {
			instanceId { this@toOvfRasdItemFromMap["rasd:InstanceId"] }
			caption { this@toOvfRasdItemFromMap["rasd:Caption"] }
			hostResource { this@toOvfRasdItemFromMap["rasd:HostResource"] }
			parentId { this@toOvfRasdItemFromMap["rasd:Parent"] }
			templateId { this@toOvfRasdItemFromMap["rasd:Template"] }
			applications { this@toOvfRasdItemFromMap["rasd:ApplicationList"] }
			storageId { this@toOvfRasdItemFromMap["rasd:StorageId"] }
			storagePoolId { this@toOvfRasdItemFromMap["rasd:StoragePoolId"] }
			creationDate { this@toOvfRasdItemFromMap["rasd:CreationDate"] }
			lastModified { this@toOvfRasdItemFromMap["rasd:LastModified"] }
			lastModifiedDate { this@toOvfRasdItemFromMap["rasd:last_modified_date"] }
			type { this@toOvfRasdItemFromMap["Type"] }
			device { this@toOvfRasdItemFromMap["Device"] }
			address { this@toOvfRasdItemFromMap["rasd:Address"] }
			bootOrder { this@toOvfRasdItemFromMap["BootOrder"]?.toIntOrNull() }
			isPlugged { this@toOvfRasdItemFromMap["IsPlugged"].toBoolean() }
			isReadOnly { this@toOvfRasdItemFromMap["IsReadOnly"].toBoolean() }
			alias { this@toOvfRasdItemFromMap["Alias"] }
		}
		20 -> RasdItemType20.builder {
			instanceId { this@toOvfRasdItemFromMap["rasd:InstanceId"] }
			caption { this@toOvfRasdItemFromMap["rasd:Caption"] }
			virtualQuantity { this@toOvfRasdItemFromMap["rasd:VirtualQuantity"]?.toIntOrNull() }
			singlePciQxl { this@toOvfRasdItemFromMap["rasd:SinglePciQxl"].toBoolean() }
			type { this@toOvfRasdItemFromMap["Type"] }
			device { this@toOvfRasdItemFromMap["Device"] }
			address { this@toOvfRasdItemFromMap["rasd:Address"] }
			bootOrder { this@toOvfRasdItemFromMap["BootOrder"]?.toIntOrNull() }
			isPlugged { this@toOvfRasdItemFromMap["IsPlugged"].toBoolean() }
			isReadOnly { this@toOvfRasdItemFromMap["IsReadOnly"].toBoolean() }
			alias { this@toOvfRasdItemFromMap["Alias"] }
		}
		23 -> RasdItemType23.builder {
			instanceId { this@toOvfRasdItemFromMap["rasd:InstanceId"] }
			caption { this@toOvfRasdItemFromMap["rasd:Caption"] }
			usbPolicy { this@toOvfRasdItemFromMap["rasd:UsbPolicy"] }
		}
		26 -> RasdItemType26.builder {
			instanceId { this@toOvfRasdItemFromMap["rasd:InstanceId"] }
			caption { this@toOvfRasdItemFromMap["rasd:Caption"] }
			type { this@toOvfRasdItemFromMap["Type"] }
			device { this@toOvfRasdItemFromMap["Device"] }
			address { this@toOvfRasdItemFromMap["rasd:Address"] }
			bootOrder { this@toOvfRasdItemFromMap["BootOrder"]?.toIntOrNull() }
			isPlugged { this@toOvfRasdItemFromMap["IsPlugged"].toBoolean() }
			isReadOnly { this@toOvfRasdItemFromMap["IsReadOnly"].toBoolean() }
			alias { this@toOvfRasdItemFromMap["Alias"] }
		}
		else -> RasdItemTypeUnknown.builder {
			instanceId { this@toOvfRasdItemFromMap["rasd:InstanceId"] }
		}
	}
}

// TODO: RasdItemType0에 넣을 예정
@JsonIgnoreProperties(ignoreUnknown = true)
data class RasdSpecParams(
	@field:JacksonXmlProperty(localName="vram")			val vram: Int? = null,
	@field:JacksonXmlProperty(localName="path")			val path: String? = "",
	@field:JacksonXmlProperty(localName="index")		val index: Int? = null,
	@field:JacksonXmlProperty(localName="model")		val model: String? = "",
	@field:JacksonXmlProperty(localName="ioThreadId")	val ioThreadId: String? = "",
	@field:JacksonXmlProperty(localName="source")		val source: String? = "",

	@JsonAnySetter
	val otherParams: MutableMap<String, String> = mutableMapOf()
) : Serializable

@JsonIgnoreProperties(ignoreUnknown = true)
data class OvfSystem(
	@field:JacksonXmlProperty(localName="VirtualSystemType", namespace=NS_VSSD)
	val virtualSystemType: String? = ""
) : Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bVirtualSystemType: String? = "";fun virtualSystemType(block: () -> String?) { bVirtualSystemType = block() ?: "" }
		fun build(): OvfSystem = OvfSystem(bVirtualSystemType)
	}

	companion object {
		inline fun builder(block: OvfSystem.Builder.() -> Unit): OvfSystem = OvfSystem.Builder().apply(block).build()
	}
}

@JsonIgnoreProperties(ignoreUnknown = true)
data class OvfOperatingSystemSection(
	@field:JacksonXmlProperty(isAttribute=true, localName="id", namespace=NS_OVF)	val id: String? = "",
	@field:JacksonXmlProperty(localName="Description")								val description: String? = VmOsType.other.name // OS Type, e.g. "other", "rhel7_x64"
): Serializable {

	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bId: String? = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bDescription: String? = "";fun description(block: () -> String?) { bDescription = block() ?: "" }
		fun build(): OvfOperatingSystemSection = OvfOperatingSystemSection(bId, bDescription)
	}

	companion object {
		inline fun builder(block: OvfOperatingSystemSection.Builder.() -> Unit): OvfOperatingSystemSection = OvfOperatingSystemSection.Builder().apply(block).build()
	}
}

fun Node.toOvfOperatingSystemSection(): OvfOperatingSystemSection {
	val nodesFound = this@toOvfOperatingSystemSection.childNodes.toList().filter {
		!it.nodeName.contains("#text")
	}
	val id: String = this@toOvfOperatingSystemSection.attributes.getNamedItem("ovf:id").textContent ?: ""
	return nodesFound
		.associateBy(keySelector = {it.nodeName}, valueTransform = {it.textContent})
		.toOvfOperatingSystemSectionFromMap(id)
}

fun Map<String, String>.toOvfOperatingSystemSectionFromMap(
	id: String? = "",
): OvfOperatingSystemSection = OvfOperatingSystemSection.builder {
	id { id } // TODO: 필요하면 할당하는 방법 찾아야 함
	description { this@toOvfOperatingSystemSectionFromMap["Description"] }
}

@JsonIgnoreProperties(ignoreUnknown = true)
data class OvfVirtualHardwareSection(
	@field:JacksonXmlProperty(localName="Info", namespace=NS_OVF)		val info: String? = "",
	@field:JacksonXmlProperty(localName="System", namespace=NS_OVF) 	val system: OvfSystem? = null,
	@field:JacksonXmlElementWrapper(useWrapping=false)
	@field:JacksonXmlProperty(localName="Item")
	val items: List<RasdItem>? = listOf()
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bInfo: String? = "";fun info(block: () -> String?) { bInfo = block() ?: "" }
		private var bSystem: OvfSystem? = null;fun system(block: () -> OvfSystem?) { bSystem = block() }
		private var bItems: List<RasdItem>? = listOf();fun items(block: () -> List<RasdItem>?) { bItems = block() ?: listOf() }
		fun build(): OvfVirtualHardwareSection = OvfVirtualHardwareSection(bInfo, bSystem, bItems)
	}

	companion object {
		inline fun builder(block: OvfVirtualHardwareSection.Builder.() -> Unit): OvfVirtualHardwareSection = OvfVirtualHardwareSection.Builder().apply(block).build()
	}
}

fun Node.toOvfVirtualHardwareSection(
	rasdItems: List<RasdItem> = emptyList(),
): OvfVirtualHardwareSection = this@toOvfVirtualHardwareSection.childNodes.toList().filter {
	!it.nodeName.contains("#text")
}.associateBy(keySelector = {it.nodeName}, valueTransform = {it.textContent}).toOvfVirtualHardwareSectionFromMap(rasdItems)

fun Map<String, String>.toOvfVirtualHardwareSectionFromMap(
	rasdItems: List<RasdItem> = emptyList(),
): OvfVirtualHardwareSection = OvfVirtualHardwareSection.builder {
	info { this@toOvfVirtualHardwareSectionFromMap["Info"] }
	system {
		OvfSystem.builder {
			virtualSystemType { this@toOvfVirtualHardwareSectionFromMap["System"]?.trim() }
		}
	}
	items { rasdItems }
}

@JsonIgnoreProperties(ignoreUnknown = true)
data class OvfSnapshotsSection(
	@field:JacksonXmlElementWrapper(useWrapping=false)
	@field:JacksonXmlProperty(localName="Snapshot")
	val snapshots: List<OvfSnapshot>? = emptyList()
): Serializable {
	override fun toString(): String =
		gson.toJson(this@OvfSnapshotsSection)

	class Builder {
		private var bSnapshots: List<OvfSnapshot>? = emptyList();fun snapshots(block: () -> List<OvfSnapshot>?) { bSnapshots = block() ?: emptyList() }
		fun build(): OvfSnapshotsSection = OvfSnapshotsSection(bSnapshots)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): OvfSnapshotsSection = Builder().apply(block).build()
	}
}

@JsonIgnoreProperties(ignoreUnknown = true)
data class OvfSnapshot(
	@field:JacksonXmlProperty(isAttribute=true, localName="id", namespace=NS_OVF)	val id: String? = "",
	@field:JacksonXmlProperty(localName="Type")										val type: String? = "", /* ACTIVE, REGULAR, ... */
	@field:JacksonXmlProperty(localName="Description")								val description: String? = "",
	@field:JacksonXmlProperty(localName="CreationDate")								private val _creationDate: String? = "",
	@field:JacksonXmlProperty(localName="ApplicationList")							val applications: String? = "",
	@field:JacksonXmlProperty(localName="VmConfiguration")							val vmConfiguration: String? = "",
) : Serializable {
	override fun toString(): String =
		gson.toJson(this@OvfSnapshot)

	class Builder {
		private var bId: String? = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bType: String? = "";fun type(block: () -> String?) { bType = block() ?: "" }
		private var bDescription: String? = "";fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bCreationDate: String? = "";fun creationDate(block: () -> String?) { bCreationDate = block() ?: "" }
		private var bApplications: String? = "";fun applications(block: () -> String?) { bApplications = block() ?: "" }
		private var bVmConfiguration: String? = "";fun vmConfiguration(block: () -> String?) { bVmConfiguration = block() ?: "" }
		fun build(): OvfSnapshot = OvfSnapshot(bId, bType, bDescription, bCreationDate, bApplications, bVmConfiguration)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): OvfSnapshot = Builder().apply(block).build()
	}
}

fun Node.toOvfSnapshot(): OvfSnapshot {
	val nodesFound = this@toOvfSnapshot.childNodes.toList().filter {
		!it.nodeName.contains("#text")
	}

	val id: String = this@toOvfSnapshot.attributes.getNamedItem("ovf:id").textContent ?: ""
	return nodesFound.associateBy(keySelector = {it.nodeName}, valueTransform = {it.textContent}).toOvfSnapshotFromMap(id)
}

fun Map<String, String>.toOvfSnapshotFromMap(
	id: String = "",
): OvfSnapshot = OvfSnapshot.builder {
	id { id }
	type { this@toOvfSnapshotFromMap["Type"] }
	description { this@toOvfSnapshotFromMap["Description"] }
	creationDate { this@toOvfSnapshotFromMap["CreationDate"] }
	applications { this@toOvfSnapshotFromMap["ApplicationList"] }
	vmConfiguration { this@toOvfSnapshotFromMap["VmConfiguration"] }

}
@JsonIgnoreProperties(ignoreUnknown = true)
data class OvfContent(
	/*@field:JacksonXmlProperty(isAttribute=true, localName="id", namespace=NS_OVF)	val id: String? = "",*/ // 쓸모쓸없는 값
	@field:JacksonXmlProperty(localName="Name")						val name: String? = "",
	@field:JacksonXmlProperty(localName="Description")				val description: String? = "",
	@field:JacksonXmlProperty(localName="Comment")					val comment: String? = "",
	@field:JacksonXmlProperty(localName="CreationDate")				private val _creationDate: String? = "",
	@field:JacksonXmlProperty(localName="ExportDate")				private val _exportDate: String? = "",
	@field:JacksonXmlProperty(localName="DeleteProtected")			private val deleteProtected: Boolean? = false,
	@field:JacksonXmlProperty(localName="SsoMethod")				private val ssoMethod: String? = DEFAULT_SSO_METHOD,
	@field:JacksonXmlProperty(localName="IsSmartcardEnabled")		private val isSmartcardEnabled: Boolean? = false,
	@field:JacksonXmlProperty(localName="NumOfIoThreads")			private val numOfIoThreads: Int? = 1,
	@field:JacksonXmlProperty(localName="TimeZone")					private val timeZone: String? = "",
	@field:JacksonXmlProperty(localName="default_boot_sequence")	private val defaultBootSequence: Int? = 0,
	@field:JacksonXmlProperty(localName="Generation")				private val generation: Int? = 1,
	@field:JacksonXmlProperty(localName="ClusterCompatibilityVersion")	private val clusterCompatibilityVersion: String? = DEFAULT_CLUSTER_COMPATIBILITY_VERSION,
	@field:JacksonXmlProperty(localName="VmType")					private val _vmType: Int? = 1,
	@field:JacksonXmlProperty(localName="ResumeBehavior")			private val _resumeBehavior: String? = "AUTO_RESUME",
	@field:JacksonXmlProperty(localName="MinAllocatedMem")			val minAllocatedMem: Int? = 1024,
	@field:JacksonXmlProperty(localName="IsStateless")				val isStateless: Boolean? = false,
	@field:JacksonXmlProperty(localName="IsRunAndPause")			val isRunAndPause: Boolean? = false,
	@field:JacksonXmlProperty(localName="AutoStartup")				val autoStartup: Boolean? = false,
	@field:JacksonXmlProperty(localName="Priority")					val priority: Int? = 1,
	@field:JacksonXmlProperty(localName="CreatedByUserId")			val createdByUserId: String? = "",
	@field:JacksonXmlProperty(localName="MigrationSupport")			private val _migrationSupport: Int? = 0,
	@field:JacksonXmlProperty(localName="IsBootMenuEnabled")		val isBootMenuEnabled: Boolean? = false,
	@field:JacksonXmlProperty(localName="IsSpiceFileTransferEnabled")	val isSpiceFileTransferEnabled: Boolean? = true,
	@field:JacksonXmlProperty(localName="IsSpiceCopyPasteEnabled")	val isSpiceCopyPasteEnabled: Boolean? = true,
	@field:JacksonXmlProperty(localName="AllowConsoleReconnect")	val allowConsoleReconnect: Boolean? = false,
	@field:JacksonXmlProperty(localName="ConsoleDisconnectAction")	val consoleDisconnectAction: String? = DEFAULT_CONSOLE_DISCONNECT_ACTION,
	@field:JacksonXmlProperty(localName="ConsoleDisconnectActionDelay")	val consoleDisconnectActionDelay: Int ? = 0,
	@field:JacksonXmlProperty(localName="CustomEmulatedMachine")	val customEmulatedMachine: String? = "",
	@field:JacksonXmlProperty(localName="BiosType")					private val _biosType: Int? = -1,
	@field:JacksonXmlProperty(localName="CustomCpuName")			val customCpuName: String? = "",
	@field:JacksonXmlProperty(localName="PredefinedProperties")	    val predefinedProperties: String? = "",
	@field:JacksonXmlProperty(localName="UserDefinedProperties")	val userDefinedProperties: String? = "",
	@field:JacksonXmlProperty(localName="MaxMemorySizeMb")			val maxMemorySizeMb: Int? = DEFAULT_MAX_MEMORY_SIZE_MB,
	@field:JacksonXmlProperty(localName="MultiQueuesEnabled")		val multiQueuesEnabled: Boolean? = true,
	@field:JacksonXmlProperty(localName="VirtioScsiMultiQueuesEnabled")	val	virtioScsiMultiQueuesEnabled: Boolean? = false,
	@field:JacksonXmlProperty(localName="UseHostCpu")				val useHostCpu: Boolean? = false,
	@field:JacksonXmlProperty(localName="BalloonEnabled")			val balloonEnabled: Boolean? = true,
	@field:JacksonXmlProperty(localName="CpuPinningPolicy")			private val _cpuPinningPolicy: Int? = 0,
	@field:JacksonXmlProperty(localName="ClusterName")				val clusterName: String? = "",
	@field:JacksonXmlProperty(localName="TemplateId")				val templateId: String? = "",
	@field:JacksonXmlProperty(localName="TemplateName")				val templateName: String? = "",
	@field:JacksonXmlProperty(localName="IsInitialized")			val isInitialized: Boolean? = true,
	@field:JacksonXmlProperty(localName="Origin")					private val _origin: Int? = DEFAULT_ORIGIN,
	@field:JacksonXmlProperty(localName="quota_id")					val quotaId: String? = "",
	@field:JacksonXmlProperty(localName="DefaultDisplayType")		private val _defaultDisplayType: Int? = 0,
	@field:JacksonXmlProperty(localName="TrustedService")			val trustedService: Boolean? = false,
	@field:JacksonXmlProperty(localName="OriginalTemplateId")		val originalTemplateId: String? = "",
	@field:JacksonXmlProperty(localName="OriginalTemplateName")     val originalTemplateName: String? = "",
	@field:JacksonXmlProperty(localName="UseLatestVersion")			val useLatestVersion: Boolean? = false,
	@field:JacksonXmlProperty(localName="StopTime")					private val _stopTime: String? = "",
	@field:JacksonXmlElementWrapper(useWrapping=false)
	@field:JacksonXmlProperty(localName="Section")
	var operatingSystemSection: OvfOperatingSystemSection? = null,
	var virtualHardwareSection: OvfVirtualHardwareSection? = null,
	var snapshotsSection: OvfSnapshotsSection? = null,
): Serializable {
	val vmType: VmTypeB							get() = VmTypeB.forValue(_vmType)
	val resumeBehavior: VmResumeBehavior		get() = VmResumeBehavior.forCode(_resumeBehavior)
	val osType: VmOsType?						get() = VmOsType.forCode(operatingSystemSection?.description)
	val biosType: BiosTypeB?					get() = BiosTypeB.forValue(_biosType)
	val cpuPinningPolicy: CpuPinningPolicyB?	get() = CpuPinningPolicyB.forValue(_cpuPinningPolicy)

	val creationDate: LocalDateTime?			get() = ovfDtf.parseEnhanced2LDT(_creationDate)
	val stopTime: LocalDateTime?				get() = ovfDtf.parseEnhanced2LDT(_stopTime)

	class Builder {
		// private var bId: String? = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String? = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bDescription: String? = "";fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bComment: String? = "";fun comment(block: () -> String?) { bComment = block() ?: "" }
		private var bCreationDate: String? = "";fun creationDate(block: () -> String?) { bCreationDate = block() ?: "" }
		private var bExportDate: String? = "";fun exportDate(block: () -> String?) { bExportDate = block() ?: "" }
		private var bDeleteProtected: Boolean? = false;fun deleteProtected(block: () -> Boolean?) { bDeleteProtected = block() ?: false }
		private var bSsoMethod: String? = "";fun ssoMethod(block: () -> String?) { bSsoMethod = block() ?: DEFAULT_SSO_METHOD }
		private var bIsSmartcardEnabled: Boolean? = false;fun isSmartcardEnabled(block: () -> Boolean?) { bIsSmartcardEnabled = block() ?: false }
		private var bNumOfIoThreads: Int? = 1;fun numOfIoThreads(block: () -> Int?) { bNumOfIoThreads = block() ?: 1 }
		private var bTimeZone: String? = "";fun timeZone(block: () -> String?) { bTimeZone = block() ?: "" }
		private var bDefaultBootSequence: Int? = 0;fun defaultBootSequence(block: () -> Int?) { bDefaultBootSequence = block() ?: 0 }
		private var bGeneration: Int? = 0;fun generation(block: () -> Int?) { bGeneration = block() ?: 0 }
		private var bClusterCompatibilityVersion: String? = DEFAULT_CLUSTER_COMPATIBILITY_VERSION;fun clusterCompatibilityVersion(block: () -> String?) { bClusterCompatibilityVersion = block() ?: DEFAULT_CLUSTER_COMPATIBILITY_VERSION }
		private var bVmType: Int? = 1;fun vmType(block: () -> Int?) { bVmType = block() ?: 1 }
		private var bResumeBehavior: String? = DEFAULT_RESUME_BEHAVIOR;fun resumeBehavior(block: () -> String?) { bResumeBehavior = block() ?: DEFAULT_RESUME_BEHAVIOR }
		private var bMinAllocatedMem: Int? = DEFAULT_MIN_ALLOCATED_MEM;fun minAllocatedMem(block: () -> Int?) { bMinAllocatedMem = block() ?: DEFAULT_MIN_ALLOCATED_MEM }
		private var bIsStateless: Boolean? = false;fun isStateless(block: () -> Boolean?) { bIsStateless = block() ?: false }
		private var bIsRunAndPause: Boolean? = false;fun isRunAndPause(block: () -> Boolean?) { bIsRunAndPause = block() ?: false }
		private var bAutoStartup: Boolean? = false;fun autoStartup(block: () -> Boolean?) { bAutoStartup = block() ?: false }
		private var bPriority: Int? = -1;fun priority(block: () -> Int?) { bPriority = block() ?: -1 }
		private var bCreatedByUserId: String? = "";fun createdByUserId(block: () -> String?) { bCreatedByUserId = block() ?: "" }
		private var bMigrationSupport: Int? = -1;fun migrationSupport(block: () -> Int?) { bMigrationSupport = block() ?: -1 }
		private var bIsBootMenuEnabled: Boolean? = false;fun isBootMenuEnabled(block: () -> Boolean?) { bIsBootMenuEnabled = block() ?: false }
		private var bIsSpiceFileTransferEnabled: Boolean? = false;fun isSpiceFileTransferEnabled(block: () -> Boolean?) { bIsSpiceFileTransferEnabled = block() ?: false }
		private var bIsSpiceCopyPasteEnabled: Boolean? = false;fun isSpiceCopyPasteEnabled(block: () -> Boolean?) { bIsSpiceCopyPasteEnabled = block() ?: false }
		private var bAllowConsoleReconnect: Boolean? = false;fun allowConsoleReconnect(block: () -> Boolean?) { bAllowConsoleReconnect = block() ?: false }
		private var bConsoleDisconnectAction: String? = DEFAULT_CONSOLE_DISCONNECT_ACTION;fun consoleDisconnectAction(block: () -> String?) { bConsoleDisconnectAction = block() ?: DEFAULT_CONSOLE_DISCONNECT_ACTION }
		private var bConsoleDisconnectActionDelay: Int? = -1;fun consoleDisconnectActionDelay(block: () -> Int?) { bConsoleDisconnectActionDelay = block() ?: 0 }
		private var bCustomEmulatedMachine: String? = "";fun customEmulatedMachine(block: () -> String?) { bCustomEmulatedMachine = block() ?: "" }
		private var bBiosType: Int? = -1;fun biosType(block: () -> Int?) { bBiosType = block() ?: -1 }
		private var bCustomCpuName: String? = "";fun customCpuName(block: () -> String?) { bCustomCpuName = block() ?: "" }
		private var bPredefinedProperties: String? = "";fun predefinedProperties(block: () -> String?) { bPredefinedProperties = block() ?: "" }
		private var bUserDefinedProperties: String? = "";fun userDefinedProperties(block: () -> String?) { bUserDefinedProperties = block() ?: "" }
		private var bMaxMemorySizeMb: Int? = DEFAULT_MAX_MEMORY_SIZE_MB;fun maxMemorySizeMb(block: () -> Int?) { bMaxMemorySizeMb = block() ?: DEFAULT_MAX_MEMORY_SIZE_MB }
		private var bMultiQueuesEnabled: Boolean? = true;fun multiQueuesEnabled(block: () -> Boolean?) { bMultiQueuesEnabled = block() ?: true }
		private var	bVirtioScsiMultiQueuesEnabled: Boolean? = false;fun virtioScsiMultiQueuesEnabled(block: () -> Boolean?) { bVirtioScsiMultiQueuesEnabled = block() ?: false }
		private var bUseHostCpu: Boolean? = false;fun useHostCpu(block: () -> Boolean?) { bUseHostCpu = block() ?: false }
		private var bBalloonEnabled: Boolean? = true;fun balloonEnabled(block: () -> Boolean?) { bBalloonEnabled = block() ?: true }
		private var bCpuPinningPolicy: Int? = 0;fun cpuPinningPolicy(block: () -> Int?) { bCpuPinningPolicy = block() ?: 0 }
		private var bClusterName: String? = "";fun clusterName(block: () -> String?) { bClusterName = block() ?: "" }
		private var bTemplateId: String? = "";fun templateId(block: () -> String?) { bTemplateId = block() ?: "" }
		private var bTemplateName: String? = "";fun templateName(block: () -> String?) { bTemplateName = block() ?: "" }
		private var bIsInitialized: Boolean? = true;fun isInitialized(block: () -> Boolean?) { bIsInitialized = block() ?: true }
		private var bOrigin: Int? = DEFAULT_ORIGIN;fun origin(block: () -> Int?) { bOrigin = block() ?: DEFAULT_ORIGIN }
		private var bQuotaId: String? = "";fun quotaId(block: () -> String?) { bQuotaId = block() ?: "" }
		private var bDefaultDisplayType: Int? = 0;fun defaultDisplayType(block: () -> Int?) { bDefaultDisplayType = block() ?: 0 }
		private var bTrustedService: Boolean? = false;fun trustedService(block: () -> Boolean?) { bTrustedService = block() ?: false }
		private var bOriginalTemplateId: String? = "";fun originalTemplateId(block: () -> String?) { bOriginalTemplateId = block() ?: "" }
		private var bOriginalTemplateName: String? = "";fun originalTemplateName(block: () -> String?) { bOriginalTemplateName = block() ?: "" }
		private var bUseLatestVersion: Boolean? = false;fun useLatestVersion(block: () -> Boolean?) { bUseLatestVersion = block() ?: false }
		private var bStopTime: String? = "";fun stopTime(block: () -> String?) { bStopTime = block() ?: "" }
		private var bOperatingSystemSection: OvfOperatingSystemSection? = null;fun operatingSystemSection(block: () -> OvfOperatingSystemSection?) { bOperatingSystemSection = block() }
		private var bVirtualHardwareSection: OvfVirtualHardwareSection? = null;fun virtualHardwareSection(block: () -> OvfVirtualHardwareSection?) { bVirtualHardwareSection = block() }
		private var bSnapshotSection: OvfSnapshotsSection? = null;fun snapshotSection(block: () -> OvfSnapshotsSection?) { bSnapshotSection = block() }
		fun build(): OvfContent = OvfContent(/*bId, */bName, bDescription, bComment, bCreationDate, bExportDate, bDeleteProtected, bSsoMethod, bIsSmartcardEnabled, bNumOfIoThreads, bTimeZone, bDefaultBootSequence, bGeneration, bClusterCompatibilityVersion, bVmType, bResumeBehavior, bMinAllocatedMem, bIsStateless, bIsRunAndPause, bAutoStartup, bPriority, bCreatedByUserId, bMigrationSupport, bIsBootMenuEnabled, bIsSpiceFileTransferEnabled, bIsSpiceCopyPasteEnabled, bAllowConsoleReconnect, bConsoleDisconnectAction, bConsoleDisconnectActionDelay,  bCustomEmulatedMachine, bBiosType, bCustomCpuName, bPredefinedProperties, bUserDefinedProperties, bMaxMemorySizeMb, bMultiQueuesEnabled, bVirtioScsiMultiQueuesEnabled,bUseHostCpu, bBalloonEnabled, bCpuPinningPolicy, bClusterName, bTemplateId,  bTemplateName,  bIsInitialized,  bOrigin, bQuotaId, bDefaultDisplayType, bTrustedService, bOriginalTemplateId, bOriginalTemplateName, bUseLatestVersion, bStopTime, bOperatingSystemSection, bVirtualHardwareSection, bSnapshotSection)
	}

	companion object {
		const val DEFAULT_SSO_METHOD = "guest_agent"
		const val DEFAULT_CLUSTER_COMPATIBILITY_VERSION = "4.7"
		const val DEFAULT_RESUME_BEHAVIOR = "AUTO_RESUME"
		const val DEFAULT_CONSOLE_DISCONNECT_ACTION = "LOCK_SCREEN"
		const val DEFAULT_MIN_ALLOCATED_MEM = 1024
		const val DEFAULT_MAX_MEMORY_SIZE_MB = 1024 * 4
		const val DEFAULT_ORIGIN = 3
		inline fun builder(block: Builder.() -> Unit): OvfContent = Builder().apply(block).build()
	}
}

fun Map<String, String>.toOvfContentFromMap(
	operatingSystemSection: OvfOperatingSystemSection? = null,
	virtualHardwareSection: OvfVirtualHardwareSection? = null,
	snapshotSection: OvfSnapshotsSection? = null,
): OvfContent = OvfContent.builder {
	name { this@toOvfContentFromMap["Name"] }
	description { this@toOvfContentFromMap["Description"] }
	comment { this@toOvfContentFromMap["Comment"] }
	creationDate { this@toOvfContentFromMap["CreationDate"] }
	exportDate { this@toOvfContentFromMap["ExportDate"] }
	deleteProtected { this@toOvfContentFromMap["DeleteProtected"].toBoolean() }
	ssoMethod { this@toOvfContentFromMap["SsoMethod"] }
	isSmartcardEnabled { this@toOvfContentFromMap["IsSmartcardEnabled"].toBoolean() }
	numOfIoThreads { this@toOvfContentFromMap["NumOfIoThreads"]?.toIntOrNull() }
	timeZone { this@toOvfContentFromMap["TimeZone"] }
	defaultBootSequence { this@toOvfContentFromMap["default_boot_sequence"]?.toIntOrNull() }
	generation { this@toOvfContentFromMap["Generation"]?.toIntOrNull() }
	vmType { this@toOvfContentFromMap["VmType"]?.toIntOrNull() }
	resumeBehavior { this@toOvfContentFromMap["ResumeBehavior"] }
	minAllocatedMem { this@toOvfContentFromMap["MinAllocatedMem"]?.toIntOrNull() }
	isStateless { this@toOvfContentFromMap["IsStateless"].toBoolean() }
	isRunAndPause { this@toOvfContentFromMap["IsRunAndPause"].toBoolean() }
	autoStartup { this@toOvfContentFromMap["AutoStartup"].toBoolean() }
	priority { this@toOvfContentFromMap["Priority"]?.toIntOrNull() }
	createdByUserId { this@toOvfContentFromMap["CreatedByUserId"] }
	migrationSupport { this@toOvfContentFromMap["MigrationSupport"]?.toIntOrNull() }
	isBootMenuEnabled { this@toOvfContentFromMap["IsBootMenuEnabled"].toBoolean() }
	isSpiceFileTransferEnabled { this@toOvfContentFromMap["IsSpiceFileTransferEnabled"].toBoolean() }
	isSpiceCopyPasteEnabled { this@toOvfContentFromMap["IsSpiceCopyPasteEnabled"].toBoolean() }
	allowConsoleReconnect { this@toOvfContentFromMap["AllowConsoleReconnect"].toBoolean() }
	consoleDisconnectAction { this@toOvfContentFromMap["ConsoleDisconnectAction"] }
	consoleDisconnectActionDelay { this@toOvfContentFromMap["ConsoleDisconnectActionDelay"]?.toIntOrNull() }
	customEmulatedMachine { this@toOvfContentFromMap["CustomEmulatedMachine"] }
	biosType { this@toOvfContentFromMap["BiosType"]?.toIntOrNull() }
	customCpuName { this@toOvfContentFromMap["CustomCpuName"] }
	predefinedProperties { this@toOvfContentFromMap["PredefinedProperties"] }
	userDefinedProperties { this@toOvfContentFromMap["UserDefinedProperties"] }
	cpuPinningPolicy { this@toOvfContentFromMap["CpuPinningPolicy"]?.toIntOrNull() }
	maxMemorySizeMb {  this@toOvfContentFromMap["MaxMemorySizeMb"]?.toIntOrNull() }
	multiQueuesEnabled {  this@toOvfContentFromMap["MultiQueuesEnabled"].toBoolean() }
	virtioScsiMultiQueuesEnabled {  this@toOvfContentFromMap["VirtioScsiMultiQueuesEnabled"].toBoolean() }
	useHostCpu {  this@toOvfContentFromMap["UseHostCpu"].toBoolean() }
	balloonEnabled {  this@toOvfContentFromMap["BalloonEnabled"].toBoolean() }
	cpuPinningPolicy {  this@toOvfContentFromMap["CpuPinningPolicy"]?.toIntOrNull() }
	clusterName {  this@toOvfContentFromMap["ClusterName"] }
	templateId {  this@toOvfContentFromMap["TemplateId"] }
	templateName {  this@toOvfContentFromMap["TemplateName"] }
	isInitialized {  this@toOvfContentFromMap["IsInitialized"].toBoolean() }
	origin {  this@toOvfContentFromMap["Origin"]?.toIntOrNull() }
	operatingSystemSection { operatingSystemSection }
	virtualHardwareSection { virtualHardwareSection }
	snapshotSection { snapshotSection }
}

fun Node.toOvfContent(
	operatingSystemSection: OvfOperatingSystemSection? = null,
	virtualHardwareSection: OvfVirtualHardwareSection? = null,
	snapshotSection: OvfSnapshotsSection? = null,
): OvfContent = this@toOvfContent.childNodes.toList().filter {
	!it.nodeName.contains("#text")
}.associateBy(keySelector = {it.nodeName}, valueTransform = {it.textContent}).toOvfContentFromMap(
	operatingSystemSection, virtualHardwareSection, snapshotSection
)

@JsonIgnoreProperties(ignoreUnknown = true)
@JacksonXmlRootElement(localName="Envelope", namespace=NS_OVF) // Adjust namespace if needed
data class OvfEnvelope(
	@field:JacksonXmlProperty(localName="References", namespace=NS_OVF)			val references: OvfReferences? = null,
	@field:JacksonXmlProperty(localName="NetworkSection", namespace=NS_OVF)		val networkSection: OvfNetworkSection? = null,
	@field:JacksonXmlProperty(localName="Section", namespace=NS_OVF)			val diskSection: OvfDiskSection? = null,
	@field:JacksonXmlProperty(localName="Content", namespace=NS_OVF)			val virtualSystemSection: OvfContent? = null
): Serializable {
	val allCompositeDisks: List<OvfCompositeDisk>	get() = allDisks.toCompositeDisks(disks)
	val allDisks: List<OvfDisk>						get() = diskSection?.disks ?: emptyList()
	val allFiles: List<OvfFile>						get() = references?.files ?: emptyList()
	val disksCurrent: List<OvfDisk>					get() = allDisks.filter { it.parentRef == it.fileRef }

	val allSnapshots: List<OvfSnapshot>				get() = virtualSystemSection?.snapshotsSection?.snapshots ?: emptyList()

	val vmType: VmTypeB?							get() = virtualSystemSection?.vmType
	val vmResumeBehavior: VmResumeBehavior?			get() = virtualSystemSection?.resumeBehavior
	val vmOsType: VmOsType?							get() = virtualSystemSection?.osType
	val biosType: BiosTypeB?						get() = virtualSystemSection?.biosType
	val cpuPinningPolicy: CpuPinningPolicyB?		get() = virtualSystemSection?.cpuPinningPolicy
	val priority: Int?								get() = virtualSystemSection?.priority
	val allRasdItems: List<RasdItem>				get() = virtualSystemSection?.virtualHardwareSection?.items ?: emptyList()
	private val cpu: RasdItemType3?					get() = allRasdItems.filterIsInstance<RasdItemType3>().firstOrNull()
	val numOfSockets: Int?	     					get() = cpu?.numOfSockets
	val cpuPerSocket: Int?							get() = cpu?.cpuPerSocket
	val threadsPerCpu: Int?							get() = cpu?.threadsPerCpu
	val cpuTotal: Int?								get() = cpu?.virtualQuantity
	val maxNumOfVcpus: Int?							get() = cpu?.maxNumOfVcpus

	private val memory: RasdItemType4?				get() = allRasdItems.filterIsInstance<RasdItemType4>().firstOrNull()
	val memoryInByte: BigInteger?					get() = memory?.virtualQuantity?.toLong()	/* TODO: allocationUnits 값이 "MegaByte"가 아닌 다른 단위가 있는지 확인하고 변환 방식 구현 */
																	?.times(MB_TO_BYTE)
																	?.toBigInteger()
	val memoryGuaranteedInByte: BigInteger?			get() = virtualSystemSection?.minAllocatedMem?.toLong()
																	?.times(MB_TO_BYTE)
																	?.toBigInteger()
	val memoryMaxInByte: BigInteger?				get() = virtualSystemSection?.maxMemorySizeMb?.toLong()
																	?.times(MB_TO_BYTE)
																	?.toBigInteger()
	val disks: List<RasdItemType17>					get() = allRasdItems.filterIsInstance<RasdItemType17>()
	private val display: RasdItemType20?			get() = allRasdItems.filterIsInstance<RasdItemType20>().firstOrNull()
	val displayType: DisplayTypeB?					get() = DisplayTypeB.forCode(display?.device)
	val monitor: Int?								get() = display?.virtualQuantity

	private val usb: RasdItemType23?				get() = allRasdItems.filterIsInstance<RasdItemType23>().firstOrNull()
	val usbEnabled: Boolean?						get() = usb?.usbPolicy !== UsbPolicy.disabled

	private val video: RasdItemType26?				get() = allRasdItems.filterIsInstance<RasdItemType26>().firstOrNull()
	val graphicType: GraphicsTypeB?					get() = GraphicsTypeB.forCode(video?.device)

	val ovfNics: List<RasdItemType10>				get() = allRasdItems.filterIsInstance<RasdItemType10>()

	override fun toString(): String =
		gson.toJson(this@OvfEnvelope)

	class Builder {
		private var bReferences: OvfReferences? = null;fun references(block: () -> OvfReferences?) { bReferences = block() }
		private var bNetworkSection: OvfNetworkSection? = null;fun networkSection(block: () -> OvfNetworkSection?) { bNetworkSection = block() }
		private var bDiskSection: OvfDiskSection? = null;fun diskSection(block: () -> OvfDiskSection?) { bDiskSection = block() }
		private var bVirtualSystemSection: OvfContent? = null;fun virtualSystemSection(block: () -> OvfContent?) { bVirtualSystemSection = block() }
		fun build(): OvfEnvelope = OvfEnvelope(bReferences, bNetworkSection, bDiskSection, bVirtualSystemSection)
	}

	companion object {
		const val MB_TO_BYTE: Long = 1024L * 1024L
		inline fun builder(block: Builder.() -> Unit): OvfEnvelope = Builder().apply(block).build()
	}
}

/**
 * [OvfCompositeDisk]
 *
 * [OvfDisk]와 [RasdItemType17] 정보를 병합하여 만든 자세한 디스크 정보
 *
 * @author 이찬희 (@chanhi2000)
 */
class OvfCompositeDisk(
	//region: OvfDisk
	val diskId: String? = "",
	val size: Int? = 0,
	val actualSize: Int? = 0,
	val vmSnapshotId: String? = "",
	val parentRef: String? = "",
	val fileRef: String? = "",
	val volumeFormat: VolumeFormat? = VolumeFormat.unassigned,
	val volumeType: VolumeType? = VolumeType.unassigned,
	val diskInterface: DiskInterfaceB? = DiskInterfaceB.ide,
	val readOnly: Boolean? = false,
	val shareable: Boolean? = false,
	val boot: Boolean? = false,
	val passDiscard: Boolean? = false,
	val incrementalBackup: Boolean? = false,
	val diskAlias: String? = "",
	val diskDescription: String? = "",
	val wipeAfterDelete: Boolean? = null,
	//endregion: OvfDisk
	//region: RasdItemType17
	val caption: String? = "",
	val hostResource: String? = "",
	val templateId: String? = "",	// 템플릿 ID
	val applications: String? = "", // TODO: 내용물이 뭔지 몰라 스킵
	val storageId: String? = "",
	val storagePoolId: String? = null,
	val creationDate: LocalDateTime? = null,
	val lastModified: LocalDateTime? = null,
	val lastModifiedDate: LocalDateTime? = null,
	val address: String? = "", // in UUID form
	val bootOrder: Int? = 0,
	val isPlugged: Boolean? = true,
	val isReadOnly: Boolean? = false,
	val alias: String? = "",
	//endregion: RasdItemType17
): Serializable {

	override fun toString(): String =
		gson.toJson(this@OvfCompositeDisk)

	class Builder {
		private var bDiskId: String? = "";fun diskId(block: () -> String?) { bDiskId = block() ?: "" }
		private var bSize: Int? = 0;fun size(block: () -> Int?) { bSize = block() ?: 0 }
		private var bActualSize: Int? = 0;fun actualSize(block: () -> Int?) { bActualSize = block() ?: 0 }
		private var bVmSnapshotId: String? = "";fun vmSnapshotId(block: () -> String?) { bVmSnapshotId = block() ?: "" }
		private var bParentRef: String? = "";fun parentRef(block: () -> String?) { bParentRef = block() ?: "" }
		private var bFileRef: String? = "";fun fileRef(block: () -> String?) { bFileRef = block() ?: "" }
		private var bVolumeFormat: VolumeFormat? = VolumeFormat.unassigned;fun volumeFormat(block: () -> VolumeFormat?) { bVolumeFormat = block() ?: VolumeFormat.unassigned }
		private var bVolumeType: VolumeType? = VolumeType.unassigned;fun volumeType(block: () -> VolumeType?) { bVolumeType = block() ?: VolumeType.unassigned }
		private var bDiskInterface: DiskInterfaceB? = DiskInterfaceB.ide;fun diskInterface(block: () -> DiskInterfaceB?) { bDiskInterface = block() ?: DiskInterfaceB.ide }
		private var bReadOnly: Boolean? = false;fun readOnly(block: () -> Boolean?) { bReadOnly = block() ?: false }
		private var bShareable: Boolean? = false;fun shareable(block: () -> Boolean?) { bShareable = block() ?: false }
		private var bBoot: Boolean? = false;fun boot(block: () -> Boolean?) { bBoot = block() ?: false }
		private var bPassDiscard: Boolean? = false;fun passDiscard(block: () -> Boolean?) { bPassDiscard = block() ?: false }
		private var bIncrementalBackup: Boolean? = false;fun incrementalBackup(block: () -> Boolean?) { bIncrementalBackup = block() ?: false }
		private var bDiskAlias: String? = "";fun diskAlias(block: () -> String?) { bDiskAlias = block() ?: "" }
		private var bDiskDescription: String? = "";fun diskDescription(block: () -> String?) { bDiskDescription = block() ?: "" }
		private var bWipeAfterDelete: Boolean? = null;fun wipeAfterDelete(block: () -> Boolean?) { bWipeAfterDelete = block() }
		private var bCaption: String? = "";fun caption(block: () -> String?) { bCaption = block() ?: "" }
		private var bHostResource: String? = "";fun hostResource(block: () -> String?) { bHostResource = block() ?: "" }
		private var bTemplateId: String? = "";fun templateId(block: () -> String?) { bTemplateId = block() ?: "" }
		private var bApplications: String? = "";fun applications(block: () -> String?) { bApplications = block() ?: "" }
		private var bStorageId: String? = "";fun storageId(block: () -> String?) { bStorageId = block() ?: "" }
		private var bStoragePoolId: String? = null;fun storagePoolId(block: () -> String?) { bStoragePoolId = block() ?: "" }
		private var bCreationDate: LocalDateTime? = null;fun creationDate(block: () -> LocalDateTime?) { bCreationDate = block() }
		private var bLastModified: LocalDateTime? = null;fun lastModified(block: () -> LocalDateTime?) { bLastModified = block() }
		private var bLastModifiedDate: LocalDateTime? = null;fun lastModifiedDate(block: () -> LocalDateTime?) { bLastModifiedDate = block() }
		private var bAddress: String? = "";fun address(block: () -> String?) { bAddress = block() ?: "" }
		private var bBootOrder: Int? = 0;fun bootOrder(block: () -> Int?) { bBootOrder = block() ?: 0 }
		private var bIsPlugged: Boolean? = true;fun isPlugged(block: () -> Boolean?) { bIsPlugged = block() ?: true }
		private var bIsReadOnly: Boolean? = false;fun isReadOnly(block: () -> Boolean?) { bIsReadOnly = block() ?: false }
		private var bAlias: String? = "";fun alias(block: () -> String?) { bAlias = block() ?: "" }
		fun build(): OvfCompositeDisk = OvfCompositeDisk(bDiskId, bSize, bActualSize, bVmSnapshotId, bParentRef, bFileRef, bVolumeFormat, bVolumeType, bDiskInterface, bReadOnly, bShareable, bBoot, bPassDiscard, bIncrementalBackup, bDiskAlias, bDiskDescription, bWipeAfterDelete/*, bCapacity, bCapacityAllocationUnits*/, bCaption, bHostResource, bTemplateId, bApplications, bStorageId, bStoragePoolId, bCreationDate, bLastModified, bLastModifiedDate, bAddress, bBootOrder, bIsPlugged, bIsReadOnly, bAlias)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): OvfCompositeDisk = Builder().apply(block).build()
	}
}

fun OvfDisk.toCompositeDisk(
	rasdItem: RasdItemType17? = null
): OvfCompositeDisk = OvfCompositeDisk.builder {
	diskId { this@toCompositeDisk.diskId }
	size { this@toCompositeDisk.size }
	actualSize { this@toCompositeDisk.actualSize }
	vmSnapshotId { this@toCompositeDisk.vmSnapshotId }
	parentRef { this@toCompositeDisk.parentRef }
	fileRef { this@toCompositeDisk.fileRef }
	volumeFormat { this@toCompositeDisk.volumeFormat }
	volumeType { this@toCompositeDisk.volumeType }
	diskInterface { this@toCompositeDisk.diskInterface }
	readOnly { this@toCompositeDisk.readOnly }
	shareable { this@toCompositeDisk.shareable }
	boot { this@toCompositeDisk.boot }
	passDiscard { this@toCompositeDisk.passDiscard }
	incrementalBackup { this@toCompositeDisk.incrementalBackup }
	diskAlias { this@toCompositeDisk.diskAlias }
	diskDescription { this@toCompositeDisk.diskDescription }
	wipeAfterDelete { this@toCompositeDisk.wipeAfterDelete }
	caption { rasdItem?.caption }
	hostResource { rasdItem?.hostResource }
	templateId { rasdItem?.templateId }
	applications { rasdItem?.applications?.joinToString(",") }
	storageId { rasdItem?.storageId }
	storagePoolId { rasdItem?.storagePoolId }
	creationDate { rasdItem?.creationDate }
	lastModified { rasdItem?.lastModified }
	lastModifiedDate { rasdItem?.lastModifiedDate }
	address { rasdItem?.address }
	bootOrder { rasdItem?.bootOrder }
	isPlugged { rasdItem?.isPlugged }
	isReadOnly { rasdItem?.isReadOnly }
	alias { rasdItem?.alias }
}

fun List<OvfDisk>.toCompositeDisks(
	rasdItems: List<RasdItemType17>
): List<OvfCompositeDisk> {
	val itemById: Map<String, RasdItemType17> = rasdItems.associateBy { it.instanceId ?: "" }
	return this@toCompositeDisks.map {
		it.toCompositeDisk(itemById[it.diskId])
	}
}

fun String.toOvfEnvelope(): OvfEnvelope {
	log.debug("... toOvfEnvelope")
	val reader = this@toOvfEnvelope.toXmlElement()
	val tReferences = reader.findAllNodesBy("References")
	val files: List<OvfFile> = tReferences.firstOrNull()?.toOvfFiles() ?: emptyList()
	val tNetworkSection = reader.findAllNodesBy("NetworkSection")
	val networks: List<OvfNetwork> = tNetworkSection.firstOrNull()?.toOvfNetworks() ?: emptyList()
	val tDiskSection = reader.findAllNodesBy("Section", "xsi:type", "ovf:DiskSection_Type")
	val disks: List<OvfDisk> = tDiskSection.firstOrNull()?.toOvfDisks() ?: emptyList()
	val tVmSection = reader.findAllNodesBy("Content", "xsi:type", "ovf:VirtualSystem_Type")
	val tOperatingSystemSection = reader.findAllNodesBy("Section", "xsi:type", "ovf:OperatingSystemSection_Type")
	val operatingSystemSection: OvfOperatingSystemSection? = tOperatingSystemSection.firstOrNull()?.toOvfOperatingSystemSection()
	val tVirtualHardwareSection = reader.findAllNodesBy("Section", "xsi:type", "ovf:VirtualHardwareSection_Type")
	val tRasdItems = reader.findAllNodesBy("Item")
	val rasdItems: List<RasdItem> = tRasdItems.map { it.toOvfRasdItem() }
	val virtualHardwareSection: OvfVirtualHardwareSection? = tVirtualHardwareSection.firstOrNull()?.toOvfVirtualHardwareSection(rasdItems)
	val tSnapshots = reader.findAllNodesBy("Snapshot")
	val snapshotSection: OvfSnapshotsSection? = OvfSnapshotsSection.builder {
		snapshots {
			tSnapshots.map { it.toOvfSnapshot() }
		}
	}
	val vmSection: OvfContent = tVmSection.first().toOvfContent(operatingSystemSection, virtualHardwareSection, snapshotSection)
	return OvfEnvelope.builder {
		references { OvfReferences.builder { files { files  } } }
		networkSection { OvfNetworkSection.builder { networks { networks  } } }
		diskSection { OvfDiskSection.builder { disks { disks } } }
		virtualSystemSection { vmSection }
	}
}
