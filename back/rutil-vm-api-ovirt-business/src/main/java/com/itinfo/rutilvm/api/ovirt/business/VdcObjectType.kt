package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

enum class VdcObjectType(
	val value: Int,
	val vdcObjectTranslation: String,
) {
	unknown(-1, "Unknown"),
	// For internal use only. Used to mark the host used for execution of a Step.
	execution_host(-100, "Execution Host"),
	// bottom is an object which all the objects in the system are its parents
	// useful to denote we want all objects when checking for permissions
	Bottom(0, "Bottom"),
	System(1, "System"),
	VM(2, "VM"),
	VDS(3, "Host"),
	VmTemplate(4, "Template"),
	VmPool(5, "VM Pool"),
	AdElements(6, "AdElements"),
	Tags(7, "Tag"),
	Bookmarks(8, "Bookmark"),
	Cluster(9, "Cluster"),
	MultiLevelAdministration(10, "MultiLevelAdministration"),
	Storage(11, "Storage"),
	EventNotification(12, "EventNotification"),
	ImportExport(13, "ImportExport"),
	StoragePool(14, "Data Center"),
	User(15, "User"),
	Role(16, "Role"),
	Quota(17, "Quota"),
	GlusterVolume(18, "Gluster Volume"),
	Disk(19, "Disk"),
	Network(20, "Network"),
	Snapshot(21, "Snapshot"),
	Event(22, "Event"),
	GlusterHook(23, "GlusterHook"),
	PROVIDER(24, "Provider"),
	GlusterService(25, "GlusterService"),
	ExternalTask(26, "ExternalTask"),
	VnicProfile(27, "Vnic Profile"),
	MacPool(28, "MAC Pool"),
	DiskProfile(29, "Disk Profile"),
	CpuProfile(30, "Cpu Profile");

	override fun toString(): String = code
	val code: String
		get() = this@VdcObjectType.name.uppercase()

	companion object {
		private const val INTERNAL_ENTITY_VALUE = -100
		private val valueMapping: MutableMap<Int, VdcObjectType> = ConcurrentHashMap<Int, VdcObjectType>()
		private val codeMapping: MutableMap<String, VdcObjectType> = ConcurrentHashMap<String, VdcObjectType>()

		init {
			values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}
		@JvmStatic fun forValue(value: Int?): VdcObjectType = valueMapping[value ?: unknown.value] ?: unknown
		@JvmStatic fun forCode(code: String?): VdcObjectType = codeMapping[code ?: unknown.code] ?: unknown
	}
}
