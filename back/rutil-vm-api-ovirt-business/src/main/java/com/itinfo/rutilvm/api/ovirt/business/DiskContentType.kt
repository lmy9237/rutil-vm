package com.itinfo.rutilvm.api.ovirt.business

import java.io.Serializable
import java.util.concurrent.ConcurrentHashMap

enum class DiskContentType(
	override val value: Int,
	val storageValue: String,
): Identifiable, Serializable {
	DATA(0, "DATA"),
	OVF_STORE(1, "OVFS"),
	MEMORY_DUMP_VOLUME(2, "MEMD"),
	MEMORY_METADATA_VOLUME(3, "MEMM"),
	ISO(4, "ISOF"),
	HOSTED_ENGINE(5, "HEVD"),
	HOSTED_ENGINE_SANLOCK(6, "HESD"),
	HOSTED_ENGINE_METADATA(7, "HEMD"),
	HOSTED_ENGINE_CONFIGURATION(8, "HECI"),
	BACKUP_SCRATCH(9, "SCRD"),
	UNKNOWN(-1, "UNKNOWN");

	val localizationKey: String
		get() = "${DiskContentType::class.java.simpleName}.${this.name}"

	private val loc: Localization
		get() = Localization.getInstance()
	val en: String
		get() = loc.findLocalizedName4DiskContentType(this, "en")
	val kr: String
		get() = loc.findLocalizedName4DiskContentType(this, "kr")

	companion object {
		const val LEGACY_DISK_TYPE = "2"
		private val valueMapping: MutableMap<Int, DiskContentType> = ConcurrentHashMap<Int, DiskContentType>()
		private val storageMapping: MutableMap<String, DiskContentType> = ConcurrentHashMap<String, DiskContentType>()
		init {
			values().forEach {
				valueMapping[it.value] = it
				storageMapping[it.storageValue] = it
			}
			storageMapping[LEGACY_DISK_TYPE] = DATA
		}

		val allDiskContentTypes: List<DiskContentType> = DiskContentType.values().filterNot {
			it == UNKNOWN
		}

		@JvmStatic fun forValue(value: Int?=-1): DiskContentType = valueMapping[value] ?: UNKNOWN
		@JvmStatic fun forStorageValue(value: String? = "UNKNOWN"): DiskContentType = storageMapping[value?.uppercase()] ?: UNKNOWN
	}
}

