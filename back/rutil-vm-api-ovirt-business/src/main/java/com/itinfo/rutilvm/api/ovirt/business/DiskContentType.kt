package com.itinfo.rutilvm.api.ovirt.business

import java.io.Serializable
import java.util.concurrent.ConcurrentHashMap

enum class DiskContentType(
	override val value: Int,
	val storageValue: String,
): Identifiable, Serializable {
	`data`(0, "DATA"),
	ovf_store(1, "OVFS"),
	memory_dump_volume(2, "MEMD"),
	memory_metadata_volume(3, "MEMM"),
	iso(4, "ISOF"),
	hosted_engine(5, "HEVD"),
	hosted_engine_sanlock(6, "HESD"),
	hosted_engine_metadata(7, "HEMD"),
	hosted_engine_configuration(8, "HECI"),
	backup_scratch(9, "SCRD"),
	unknown(-1, "UNKNOWN");

	override fun toString(): String = code
	val code: String
		get() = this@DiskContentType.name.uppercase()

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
		private val codeMapping: MutableMap<String, DiskContentType> = ConcurrentHashMap<String, DiskContentType>()
		private val storageMapping: MutableMap<String, DiskContentType> = ConcurrentHashMap<String, DiskContentType>()
		init {
			values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
				storageMapping[it.storageValue] = it
			}
			storageMapping[LEGACY_DISK_TYPE] = `data`
		}

		val allDiskContentTypes: List<DiskContentType> = DiskContentType.values().filterNot {
			it == unknown
		}

		@JvmStatic fun forValue(value: Int?): DiskContentType = valueMapping[value ?: -1] ?: unknown
		@JvmStatic fun forCode(code: String?): DiskContentType = codeMapping[code ?: unknown.code] ?: unknown
		@JvmStatic fun forStorageValue(code: String?): DiskContentType = storageMapping[code ?: unknown.code] ?: unknown
	}
}

