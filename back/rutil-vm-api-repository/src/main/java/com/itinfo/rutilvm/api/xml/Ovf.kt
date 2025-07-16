package com.itinfo.rutilvm.api.xml

import com.fasterxml.jackson.annotation.JsonAnySetter
import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.databind.DeserializationContext
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement
import com.fasterxml.jackson.dataformat.xml.deser.FromXmlParser
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.common.parseEnhanced2LDT
import com.itinfo.rutilvm.api.ovirt.business.BiosTypeB
import com.itinfo.rutilvm.api.ovirt.business.CpuPinningPolicyB
import com.itinfo.rutilvm.api.ovirt.business.VmOsType
import org.slf4j.LoggerFactory
import org.w3c.dom.Node
import java.io.Serializable
import java.text.SimpleDateFormat
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.time.format.DateTimeParseException
import javax.xml.namespace.QName

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
	@field:JacksonXmlProperty(isAttribute=true, localName="href", namespace=NS_OVF)
	val href: String? = "",

	@field:JacksonXmlProperty(isAttribute=true, localName="id", namespace=NS_OVF)
	val id: String? = "",

	@field:JacksonXmlProperty(isAttribute=true, localName="size", namespace=NS_OVF)
	val size: Long? = 0L,

	@field:JacksonXmlProperty(isAttribute=true, localName="description", namespace=NS_OVF)
	val description: String? = "",

	@field:JacksonXmlProperty(isAttribute=true, localName="disk_storage_type", namespace=NS_OVF)
	val diskStorageType: String? = "",

	@field:JacksonXmlProperty(isAttribute=true, localName="cinder_volume_type", namespace=NS_OVF)
	val cinderVolumeType: String? = "",
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
	@field:JacksonXmlProperty(isAttribute=true, localName="name", namespace=NS_OVF)
	val name: String? = "",
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
	@field:JacksonXmlProperty(isAttribute=true, localName="diskId", namespace=NS_OVF)
	val diskId: String? = "",

	@field:JacksonXmlProperty(isAttribute=true, localName="size", namespace=NS_OVF)
	val size: Int? = 0,

	@field:JacksonXmlProperty(isAttribute=true, localName="actual_size", namespace=NS_OVF)
	val actualSize: Int? = 0,

	@field:JacksonXmlProperty(isAttribute=true, localName="vm_snapshot_id", namespace=NS_OVF)
	val vmSnapshotId: String? = "",

	@field:JacksonXmlProperty(isAttribute=true, localName="parentRef", namespace=NS_OVF)
	val parentRef: String? = "",

	@field:JacksonXmlProperty(isAttribute=true, localName="fileRef", namespace=NS_OVF)
	val fileRef: String? = "",

	@field:JacksonXmlProperty(isAttribute=true, localName="format", namespace=NS_OVF)
	val format: String? = "",

	@field:JacksonXmlProperty(isAttribute=true, localName="volume-type", namespace=NS_OVF)
	val volumeType: String? = "",

	@field:JacksonXmlProperty(isAttribute=true, localName="disk-interface", namespace=NS_OVF)
	val diskInterface: String? = "",

	@field:JacksonXmlProperty(isAttribute=true, localName="read-only", namespace=NS_OVF)
	val readOnly: Boolean? = false,

	@field:JacksonXmlProperty(isAttribute=true, localName="shareable", namespace=NS_OVF)
	val shareable: Boolean? = false,

	@field:JacksonXmlProperty(isAttribute=true, localName="boot", namespace=NS_OVF)
	val boot: Boolean? = false,

	@field:JacksonXmlProperty(isAttribute=true, localName="pass-discard", namespace=NS_OVF)
	val passDiscard: Boolean? = false,

	@field:JacksonXmlProperty(isAttribute=true, localName="incremental-backup", namespace=NS_OVF)
	val incrementalBackup: Boolean? = false,

	@field:JacksonXmlProperty(isAttribute=true, localName="disk-alias", namespace=NS_OVF)
	val diskAlias: String? = "",

	@field:JacksonXmlProperty(isAttribute=true, localName="disk-description", namespace=NS_OVF)
	val diskDescription: String? = "",

	@field:JacksonXmlProperty(isAttribute=true, localName="wipe-after-delete", namespace=NS_OVF)
	val wipeAfterDelete: Boolean? = null,

	/*
	@field:JacksonXmlProperty(isAttribute=true, localName="capacity", namespace=NS_OVF)
	val capacity: String? = "", // Can be Long if you parse units

	@field:JacksonXmlProperty(isAttribute=true, localName="capacityAllocationUnits", namespace=NS_OVF)
	val capacityAllocationUnits: String? = "",
	*/
): Serializable {
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
		fun build(): OvfDisk = OvfDisk(bDiskId, bSize, bActualSize, bVmSnapshotId, bParentRef, bFileRef, bFormat, bVolumeFormat, bDiskInterface, bReadOnly, bShareable, bBoot, bPassDiscard, bIncrementalBackup, bDiskAlias, bDiskDescription, bWipeAfterDelete/*, bCapacity, bCapacityAllocationUnits*/)
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
		volumeFormat { diskVolumeType }
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
class RasdItem (
	@field:JacksonXmlProperty(localName="Caption")
	var caption: String? = "" // Caption for the device

	/*
	@field:JacksonXmlProperty(localName="InstanceID", namespace=NS_RASD)
	val instanceID: String? = "", // Unique ID for this item within the VM

	@field:JacksonXmlProperty(localName="Description", namespace=NS_RASD)
	val description: String? = "", // Description of the resource


	@field:JacksonXmlProperty(localName="ResourceType", namespace=NS_RASD)
	val resourceType: Int? = null, // DMTF standard resource type (e.g., 3=CPU, 4=Memory, 17=Disk, 10=Ethernet)

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
}

class OvfVirtualHardwareSectionDeserializer: com.fasterxml.jackson.databind.deser.std.StdDeserializer<OvfVirtualHardwareSection>(OvfVirtualHardwareSection::class.java) {
	override fun deserialize(
		p: JsonParser?,
		ctxt: DeserializationContext?
	): OvfVirtualHardwareSection? {
		val objectMapper = ObjectMapper().registerKotlinModule()
		val node = p?.readValueAsTree<JsonNode>()
		val node2 = (ctxt?.parser as? FromXmlParser)?.codec?.readTree<JsonNode>(p)

		val infoNode: JsonNode? = node?.findValue("Info")
		val infoNode2: JsonNode? = node2?.findValue("Info")
		val systemNode: JsonNode? = node?.findValue("System")
		val systemNode2: JsonNode? = node2?.findValue("System")
		val virtualSystemTypeNode: JsonNode? = systemNode?.findValue("VirtualSystemType")
		val virtualSystemTypeNode2: JsonNode? = systemNode2?.findValue("VirtualSystemType")
		val itemsNode: JsonNode? = node?.findValue("Item")
		val itemsNode2: JsonNode? = node2?.findValue("Item")

		val iterator: Iterator<String>? = node?.fieldNames()
		while (iterator?.hasNext() == true) {
			val fieldName: String = iterator.next()
			val fieldValue: String = node.get(fieldName).asText()
			log.debug("name is [{}], text is [{}]", fieldName, fieldValue);
		}

		log.debug("[1] info: {}, system: {}, system.virtualSystemType: {}, itemsNode: {}", infoNode?.asText(), systemNode?.asText(), virtualSystemTypeNode?.asText(), itemsNode?.size())
		log.debug("[2] info: {}, system: {}, system.virtualSystemType: {}, itemsNode: {}", infoNode2?.asText(), systemNode2?.asText(), virtualSystemTypeNode2?.asText(), itemsNode2?.size())

		// log.debug("items.size: {} itemsNode: {}", items.size)
		// val items: String? = node?.has("Item")
		// log.debug("items: {}", items)
		val hasItems: Boolean = node?.has("Item") == true
		/*val items: List<RasdItem> = Arrays.stream(objectMapper.treeToValue(itemsNode, Array<RasdItem>::class.java)).toList()
		log.debug("hasItems: {}, items: {}", hasItems, items)*/

		return OvfVirtualHardwareSection.builder {
			info { infoNode?.asText() }
			system {
				OvfSystem.builder {
					virtualSystemType { virtualSystemTypeNode?.asText() }
				}
			}
			items {
				listOf()
			}
		}
	}
}

class RasdItemDeserializer: com.fasterxml.jackson.databind.deser.std.StdDeserializer<RasdItem>(RasdItem::class.java) {
	private val qCaption = QName(NS_RASD, "Caption")

	override fun deserialize(
		p: JsonParser?,
		ctxt: DeserializationContext?
	): RasdItem? {
		val codec = p?.codec as ObjectMapper
		val node: JsonNode?  = codec.readTree<JsonNode>(p)
		// val node2 = (ctxt?.parser as? FromXmlParser)?.codec?.readTree<JsonNode>(p)

		val itemsNode: JsonNode? = node?.findParent("Item")

		/*val iterator: Iterator<String>? = node?.fieldNames();
		while (iterator?.hasNext() == true) {
			val fieldName: String = iterator.next()
			val fieldValue: String = node.get(fieldName).asText()
			log.debug("name is [{}], text is [{}]", fieldName, fieldValue);
		}*/

		val value: String? = node?.asText()
		log.debug("[1] itemsNode: {}, value: {}", itemsNode?.asText(), value)
		log.debug("[2] itemsNode: {}, value: {}", itemsNode?.asText(), value)

		// .at(JsonPointer.compile("/Caption/"))
		var caption: String? = null
		/*
		var eventType = staxParser?.eventType

		while (eventType != XMLStreamConstants.END_DOCUMENT) {
			if (eventType == XMLStreamConstants.START_ELEMENT) {
				val currentQName = staxParser?.name
				val elementText = staxParser?.elementText // Consumes the element text and moves to END_ELEMENT
				log.debug("{}: {}", currentQName?.localPart, elementText)
				when (currentQName) {
					qCaption -> caption = elementText
				}
			} else if (eventType == XMLStreamConstants.END_ELEMENT) {
				// If we reach the end tag of the <Item> itself, we are done with this RasdItem
				if (staxParser?.localName == "Item") { // Or the actual local name of your RasdItem element
					break
				}
			}
			eventType = staxParser?.next()
		}
		*/
		return RasdItem(caption)
	}
}

@JsonIgnoreProperties(ignoreUnknown = true)
data class RasdSpecParams(
	@field:JacksonXmlProperty(localName="vram")
	val vram: Int? = null,

	@field:JacksonXmlProperty(localName="path")
	val path: String? = "",

	@field:JacksonXmlProperty(localName="index")
	val index: Int? = null,

	@field:JacksonXmlProperty(localName="model")
	val model: String? = "",

	@field:JacksonXmlProperty(localName="ioThreadId")
	val ioThreadId: String? = "",

	@field:JacksonXmlProperty(localName="source")
	val source: String? = "",

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
	@field:JacksonXmlProperty(isAttribute=true, localName="id", namespace=NS_OVF)
	val id: String? = "",
	@field:JacksonXmlProperty(localName="Description") // OS Type, e.g. "other", "rhel7_x64"
	val description: String? = VmOsType.other.name
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

fun Node.toOvfOperatingSystemSection(): OvfOperatingSystemSection = this@toOvfOperatingSystemSection.childNodes.toList().filter {
	!it.nodeName.contains("#text")
}.associateBy(keySelector = {it.nodeName}, valueTransform = {it.textContent}).toOvfOperatingSystemSectionFromMap()

fun Map<String, String>.toOvfOperatingSystemSectionFromMap(): OvfOperatingSystemSection = OvfOperatingSystemSection.builder {
	id { "" } // TODO: 필요하면 할당하는 방법 찾아야 함
	description { this@toOvfOperatingSystemSectionFromMap["Description"] }
}

@JsonIgnoreProperties(ignoreUnknown = true)
data class OvfVirtualHardwareSection(
	@field:JacksonXmlProperty(localName="Info", namespace=NS_OVF)		val info: String? = "",
	@field:JacksonXmlProperty(localName="System", namespace=NS_OVF) 	val system: OvfSystem? = null,

	/*
	@field:JacksonXmlElementWrapper(useWrapping=false)
	@field:JacksonXmlProperty(localName="Item")
	val items: List<RasdItem>? = listOf()
	*/
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bInfo: String? = "";fun info(block: () -> String?) { bInfo = block() ?: "" }
		private var bSystem: OvfSystem? = null;fun system(block: () -> OvfSystem?) { bSystem = block() }
		private var bItems: List<RasdItem>? = listOf();fun items(block: () -> List<RasdItem>?) { bItems = block() ?: listOf() }
		fun build(): OvfVirtualHardwareSection = OvfVirtualHardwareSection(bInfo, bSystem, /*bItems*/)
	}

	companion object {
		inline fun builder(block: OvfVirtualHardwareSection.Builder.() -> Unit): OvfVirtualHardwareSection = OvfVirtualHardwareSection.Builder().apply(block).build()
	}
}

fun Node.toOvfVirtualHardwareSection(): OvfVirtualHardwareSection = this@toOvfVirtualHardwareSection.childNodes.toList().filter {
	!it.nodeName.contains("#text")
}.associateBy(keySelector = {it.nodeName}, valueTransform = {it.textContent}).toOvfVirtualHardwareSectionFromMap()

fun Map<String, String>.toOvfVirtualHardwareSectionFromMap(): OvfVirtualHardwareSection = OvfVirtualHardwareSection.builder {
	info { this@toOvfVirtualHardwareSectionFromMap["Info"] }
	system {
		OvfSystem.builder {
			virtualSystemType { this@toOvfVirtualHardwareSectionFromMap["System"]?.trim() }
		}
	}
}

@JsonIgnoreProperties(ignoreUnknown = true)
data class OvfSnapshotsSection(
	@field:JacksonXmlProperty(isAttribute=true, localName="type", namespace=NS_XSI)
	override val xsiType: String? = "",

	/*@field:JacksonXmlElementWrapper(useWrapping=false)
	@field:JacksonXmlProperty(localName="Snapshot")
	val snapshots: List<OvfSnapshotItem>? = listOf()*/
): OvfSectionBase, Serializable {

}

@JsonIgnoreProperties(ignoreUnknown = true)
data class OvfSnapshotItem(
	@field:JacksonXmlProperty(isAttribute=true, localName="id", namespace=NS_OVF)
	val id: String? = "",

	@field:JacksonXmlProperty(localName="Type")
	val type: String? = "",

	@field:JacksonXmlProperty(localName="Description")
	val description: String? = "",

	@field:JacksonXmlProperty(localName="CreationDate")
	val creationDate: String? = "",
) : Serializable

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
	@field:JacksonXmlProperty(localName="IsBootMenuEnabled")		private val isBootMenuEnabled: Boolean? = false,
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

	@field:JacksonXmlElementWrapper(useWrapping=false)
	@field:JacksonXmlProperty(localName="Section")
	val sections: List<OvfSectionBase>? = listOf(),
): Serializable {

	@get:JsonIgnore
	val virtualHardwareSection: OvfVirtualHardwareSection?
		get() = sections?.filterIsInstance<OvfVirtualHardwareSection>()?.firstOrNull()

	@get:JsonIgnore
	val snapshotsSection: OvfSnapshotsSection?
		get() = sections?.filterIsInstance<OvfSnapshotsSection>()?.firstOrNull()

	val biosType: BiosTypeB?					get() = BiosTypeB.forValue(_biosType)
	val cpuPinningPolicy: CpuPinningPolicyB?	get() = CpuPinningPolicyB.forValue(_cpuPinningPolicy)
	val creationDate: LocalDateTime?			get() = ovfDtf.parseEnhanced2LDT(_creationDate)
	val osType: VmOsType						get() = VmOsType.forCode(operatingSystemSection?.description)

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
		fun build(): OvfContent = OvfContent(/*bId, */bName, bDescription, bComment, bCreationDate, bExportDate, bDeleteProtected, bSsoMethod, bIsSmartcardEnabled, bNumOfIoThreads, bTimeZone, bDefaultBootSequence, bGeneration, bClusterCompatibilityVersion, bVmType, bResumeBehavior, bMinAllocatedMem, bIsStateless, bIsRunAndPause, bAutoStartup, bPriority, bCreatedByUserId, bMigrationSupport, bIsBootMenuEnabled, bIsSpiceFileTransferEnabled, bIsSpiceCopyPasteEnabled, bAllowConsoleReconnect, bConsoleDisconnectAction, bConsoleDisconnectActionDelay,  bCustomEmulatedMachine, bBiosType, bCustomCpuName, bPredefinedProperties, bUserDefinedProperties, bMaxMemorySizeMb, bMultiQueuesEnabled, bVirtioScsiMultiQueuesEnabled,bUseHostCpu, bBalloonEnabled, bCpuPinningPolicy, bClusterName, bTemplateId,  bTemplateName,  bIsInitialized,  bOrigin, bQuotaId, bDefaultDisplayType, bTrustedService, bOriginalTemplateId, bOriginalTemplateName, bUseLatestVersion, bStopTime, bOperatingSystemSection)
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
}

fun Node.toOvfContent(
	operatingSystemSection: OvfOperatingSystemSection? = null,
	virtualHardwareSection: OvfVirtualHardwareSection? = null,
): OvfContent = this@toOvfContent.childNodes.toList().filter {
	!it.nodeName.contains("#text")
}.associateBy(keySelector = {it.nodeName}, valueTransform = {it.textContent}).toOvfContentFromMap(operatingSystemSection, virtualHardwareSection)


@JsonIgnoreProperties(ignoreUnknown = true)
@JsonTypeInfo(
	use=JsonTypeInfo.Id.NAME,
	include=JsonTypeInfo.As.EXISTING_PROPERTY, // xsi:type is an existing attribute on the <Section> element
	property="type", // Jackson maps this to "xsi:type" attribute
	visible=true // Makes the "type" (xsi:type value) accessible if needed
	/* namespace=NS_XSI,*/ // Specify the XMLSchema-instance namespace for "type"
)
@JsonSubTypes(
	JsonSubTypes.Type(value = OvfDiskSection::class, name = "ovf:DiskSection_Type"),
	JsonSubTypes.Type(value = OvfOperatingSystemSection::class, name = "ovf:OperatingSystemSection_Type"),
	JsonSubTypes.Type(value = OvfVirtualHardwareSection::class, name = "ovf:VirtualHardwareSection_Type"),
	JsonSubTypes.Type(value = OvfSnapshotsSection::class, name = "ovf:SnapshotsSection_Type"),
	JsonSubTypes.Type(value = OvfDomainsSection::class, name = "ovf:UserDomainsSection_Type"),
)
interface OvfSectionBase : Serializable {
	// Common attributes for all Sections
	/*
	@field:JacksonXmlProperty(isAttribute=true, localName="id", namespace=NS_OVF)
	open val ovfId: String? = null, // Renamed to avoid conflict with potential 'id' in subclasses

	@field:JacksonXmlProperty(isAttribute=true, localName="required", namespace=NS_OVF)
	open val ovfRequired: Boolean? = null,
	*/
	val xsiType: String?
}

@JsonIgnoreProperties(ignoreUnknown = true)
@JacksonXmlRootElement(localName="Envelope", namespace=NS_OVF) // Adjust namespace if needed
data class OvfEnvelope(
	@field:JacksonXmlProperty(localName="References", namespace=NS_OVF)
	val references: OvfReferences? = null,

	@field:JacksonXmlProperty(localName="NetworkSection", namespace=NS_OVF)
	val networkSection: OvfNetworkSection? = null,

	@field:JacksonXmlProperty(localName="Section", namespace=NS_OVF)
	val diskSection: OvfDiskSection? = null,

	// If there can be multiple VirtualSystems (e.g. in an OVA for vApp)
	// @field:JacksonXmlElementWrapper(useWrapping = false)
	// @field:JacksonXmlProperty(localName="VirtualSystem")
	// val virtualSystems: List<OvfVirtualSystem>? = null,

	// If there's guaranteed to be only one VirtualSystem (common for single VM OVF)
	@field:JacksonXmlProperty(localName="Content", namespace=NS_OVF)
	val virtualSystem: OvfContent? = null
): Serializable {

	override fun toString(): String =
		gson.toJson(this@OvfEnvelope)
	/*
	val topChainDisks: List<OvfDisk>
		get() {
			val latestDate: String = virtualSystem.
			val _disks = diskSection?.disks?.filter {

			} ?: listOf()
			return _disks
		}
	 */

	class Builder {
		private var bReferences: OvfReferences? = null;fun references(block: () -> OvfReferences?) { bReferences = block() }
		private var bNetworkSection: OvfNetworkSection? = null;fun networkSection(block: () -> OvfNetworkSection?) { bNetworkSection = block() }
		private var bDiskSection: OvfDiskSection? = null;fun diskSection(block: () -> OvfDiskSection?) { bDiskSection = block() }
		private var bVirtualSystem: OvfContent? = null;fun virtualSystem(block: () -> OvfContent?) { bVirtualSystem = block() }
		fun build(): OvfEnvelope = OvfEnvelope(bReferences, bNetworkSection, bDiskSection)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): OvfEnvelope = Builder().apply(block).build()
	}
}


