package com.itinfo.rutilvm.api.repository.engine.entity

import com.fasterxml.jackson.annotation.JsonAnySetter
import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement
import com.itinfo.rutilvm.common.parseEnhanced2LDT
import org.slf4j.LoggerFactory
import java.io.Serializable
import java.text.SimpleDateFormat
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.time.format.DateTimeParseException

// For handling namespaces (often tricky with OVF)
// You might need to experiment with jackson-module-jaxb-annotations if namespaces are complex
// or configure the XmlMapper to be namespace-unaware for simplicity if possible.

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
): Serializable

@JsonIgnoreProperties(ignoreUnknown = true)
data class OvfNetwork(
	@field:JacksonXmlProperty(isAttribute=true, localName="name", namespace=NS_OVF)
	val name: String? = "",
): Serializable

@JsonIgnoreProperties(ignoreUnknown = true)
data class OvfDisk(
	@field:JacksonXmlProperty(isAttribute=true, localName="diskId", namespace=NS_OVF) // or just localName if namespace handling is simplified
	val diskId: String? = "",

	@field:JacksonXmlProperty(isAttribute=true, localName="disk-alias", namespace=NS_OVF) // or just localName if namespace handling is simplified
	val diskAlias: String? = "",

	@field:JacksonXmlProperty(isAttribute=true, localName="fileRef", namespace=NS_OVF)
	val fileRef: String? = "",

	@field:JacksonXmlProperty(isAttribute=true, localName="format", namespace=NS_OVF)
	val format: String? = "",

	@field:JacksonXmlProperty(isAttribute=true, localName="capacity", namespace=NS_OVF)
	val capacity: String? = "", // Can be Long if you parse units

	@field:JacksonXmlProperty(isAttribute=true, localName="capacityAllocationUnits", namespace=NS_OVF)
	val capacityAllocationUnits: String? = "",

	@field:JacksonXmlProperty(isAttribute=true, localName="volume-format", namespace=NS_OVF)
	val ovirtVolumeFormat: String? = "",

	@field:JacksonXmlProperty(isAttribute=true, localName="actual_size", namespace=NS_OVF)
	val ovirtActualSize: String? = "", // Can be Long if you parse units

	@field:JacksonXmlProperty(isAttribute=true, localName="wipe-after-delete", namespace=NS_OVF)
	val wipeAfterDelete: Boolean? = null

): Serializable

@JsonIgnoreProperties(ignoreUnknown = true)
data class OvfReferences(
	@field:JacksonXmlElementWrapper(useWrapping = false)
	@field:JacksonXmlProperty(localName="File", namespace=NS_OVF)
	val files: List<OvfFile>? = listOf()
): Serializable

@JsonIgnoreProperties(ignoreUnknown = true)
data class OvfNetworkSection(
	@field:JacksonXmlElementWrapper(useWrapping = false)
	@field:JacksonXmlProperty(localName="Network", namespace=NS_OVF)
	val networks: List<OvfNetwork>? = listOf()
): Serializable

@JsonIgnoreProperties(ignoreUnknown = true)
data class OvfDiskSection(
	@field:JacksonXmlElementWrapper(useWrapping = false)
	@field:JacksonXmlProperty(localName="Disk")
	val disks: List<OvfDisk>? = listOf()
): Serializable {
}
@JsonIgnoreProperties(ignoreUnknown = true)
data class RasdItem(
	@field:JacksonXmlProperty(localName="Caption", namespace=NS_RASD)
	val caption: String? = "", // Caption for the device

	@field:JacksonXmlProperty(localName="Description", namespace=NS_RASD)
	val description: String? = "", // Description of the resource

	@field:JacksonXmlProperty(localName="InstanceID", namespace=NS_RASD)
	val instanceID: String? = "", // Unique ID for this item within the VM

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
	val specParams: RasdSpecParams? = null
	//endregion
	// Add other RASD properties as needed
): Serializable

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
) : Serializable

@JsonIgnoreProperties(ignoreUnknown = true)
data class OvfOperatingSystemSection(
	@field:JacksonXmlProperty(localName="Description") // OS Type, e.g. "other", "rhel7_x64"
	val osTypeDescription: String? = ""
): OvfSectionBase(), Serializable

@JsonIgnoreProperties(ignoreUnknown = true)
data class OvfVirtualHardwareSection(
	@field:JacksonXmlProperty(localName="System", namespace=NS_OVF) // System is child of Section
	val system: OvfSystem? = null,

	/*@field:JacksonXmlElementWrapper(useWrapping=false)
	@field:JacksonXmlProperty(localName="Item")
	val items: List<RasdItem>? = listOf()*/
	// Add other VirtualHardwareSection properties
): OvfSectionBase(), Serializable

@JsonIgnoreProperties(ignoreUnknown = true)
class OvfSnapshotsSection(
	/*@field:JacksonXmlElementWrapper(useWrapping = false)
	@field:JacksonXmlProperty(localName="Snapshot")
	val snapshots: List<OvfSnapshotItem>? = listOf()*/
): OvfSectionBase(), Serializable

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
	@field:JacksonXmlProperty(isAttribute=true, localName="id", namespace=NS_OVF)
	val id: String? = "",

	@field:JacksonXmlProperty(localName="Name")
	val name: String? = "",

	@field:JacksonXmlProperty(localName="Description")
	val description: String? = "",

	@field:JacksonXmlProperty(localName="Comment")
	val comment: String? = "",

	@field:JacksonXmlProperty(localName="CreationDate")
	private val _creationDate: String? = "",

	@field:JacksonXmlProperty(localName="DeleteProtected")
	private val deleteProtected: Boolean? = false,

	@field:JacksonXmlProperty(localName="IsSmartcardEnabled")
	private val isSmartcardEnabled: Boolean? = false,

	@field:JacksonXmlProperty(localName="BiosType")
	val biosType: Int? = -1,

	@field:JacksonXmlProperty(localName="CpuPinningPolicy")
	val cpuPinningPolicy: Int? = 0,

	@field:JacksonXmlProperty(localName="DefaultDisplayType")
	val defaultDisplayType: Int? = 0,
	// Add other sections like OperatingSystemSection, NetworkSection etc.

	// THIS IS THE KEY CHANGE:
	@field:JacksonXmlElementWrapper(useWrapping = false) // Sections are direct children
	@field:JacksonXmlProperty(localName="Section") // All are named "Section"
	val sections: List<OvfSectionBase>? = listOf(), // Jackson uses xsi:type to pick the subclass
): Serializable {

	// Optional: Convenience getters to access specific section types
	@get:JsonIgnore // Exclude from Jackson's processing
	val operatingSystemSection: OvfOperatingSystemSection?
		get() = sections?.filterIsInstance<OvfOperatingSystemSection>()?.firstOrNull()

	@get:JsonIgnore
	val virtualHardwareSection: OvfVirtualHardwareSection?
		get() = sections?.filterIsInstance<OvfVirtualHardwareSection>()?.firstOrNull()

	/*
	@get:JsonIgnore
	val snapshotsSection: OvfSnapshotsSection?
		get() = sections?.filterIsInstance<OvfSnapshotsSection>()?.firstOrNull()*/

	val biosTypeEnum: com.itinfo.rutilvm.api.ovirt.business.BiosType?
		get() = com.itinfo.rutilvm.api.ovirt.business.BiosType.forValue(biosType)

	val creationDate: LocalDateTime?
		get() = try {
			ovfDtf.parseEnhanced2LDT(_creationDate)
		} catch (e: DateTimeParseException) {
			e.printStackTrace()
			log.error("{}.creationDate parse error ... {}", OvfContent::class.simpleName, e.localizedMessage)
			null
		}
}

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonTypeInfo(
	use=JsonTypeInfo.Id.NAME,
	include=JsonTypeInfo.As.EXISTING_PROPERTY, // xsi:type is an existing attribute on the <Section> element
	property="type", // Jackson maps this to "xsi:type" attribute
	/* namespace=NS_XSI,*/ // Specify the XMLSchema-instance namespace for "type"
	visible=true // Makes the "type" (xsi:type value) accessible if needed
)
@JsonSubTypes(
	JsonSubTypes.Type(value = OvfOperatingSystemSection::class, name = "ovf:OperatingSystemSection_Type"),
	JsonSubTypes.Type(value = OvfVirtualHardwareSection::class, name = "ovf:VirtualHardwareSection_Type"),
	JsonSubTypes.Type(value = OvfSnapshotsSection::class, name = "ovf:SnapshotsSection_Type"),
	JsonSubTypes.Type(value = OvfDiskSection::class, name = "ovf:DiskSection_Type") // Include if it can appear here
)
sealed class OvfSectionBase(
	// Common attributes for all Sections
	/*
	@field:JacksonXmlProperty(isAttribute=true, localName="id", namespace=NS_OVF)
	open val ovfId: String? = null, // Renamed to avoid conflict with potential 'id' in subclasses

	@field:JacksonXmlProperty(isAttribute=true, localName="required", namespace=NS_OVF)
	open val ovfRequired: Boolean? = null,
	*/
	@field:JacksonXmlProperty(isAttribute=true, localName="type", namespace=NS_XSI) // To capture the xsi:type value
	open val xsiType: String? = null, // The actual value like "ovf:OperatingSystemSection_Type"

	@field:JacksonXmlProperty(localName="Info", namespace=NS_OVF)
	open val info: String? = null
): Serializable

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

	/*val topChainDisks: List<OvfDisk>
		get() {
			val latestDate: String = virtualSystem.
			val _disks = diskSection?.disks?.filter {

			} ?: listOf()
			return _disks
		}
	 */
}


