package com.itinfo.rutilvm.api.ovirt.business

import java.io.Serializable
import java.util.concurrent.ConcurrentHashMap

enum class DiskContentTypeB(
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
		get() = this@DiskContentTypeB.name.uppercase()

	val localizationKey: String
		get() = "${DiskContentTypeB::class.java.simpleName}.${this.name}"
	private val loc: Localization
		get() = Localization.getInstance()
	val en: String
		get() = loc.findLocalizedName4DiskContentType(this, "en")
	val kr: String
		get() = loc.findLocalizedName4DiskContentType(this, "kr")

	companion object {
		const val LEGACY_DISK_TYPE = "2"
		private val valueMapping: MutableMap<Int, DiskContentTypeB> = ConcurrentHashMap<Int, DiskContentTypeB>()
		private val codeMapping: MutableMap<String, DiskContentTypeB> = ConcurrentHashMap<String, DiskContentTypeB>()
		private val storageMapping: MutableMap<String, DiskContentTypeB> = ConcurrentHashMap<String, DiskContentTypeB>()
		init {
			values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
				storageMapping[it.storageValue] = it
			}
			storageMapping[LEGACY_DISK_TYPE] = `data`
		}

		val allDiskContentTypes: List<DiskContentTypeB> = DiskContentTypeB.values().filterNot {
			it == unknown
		}

		@JvmStatic fun forValue(value: Int?): DiskContentTypeB = valueMapping[value ?: -1] ?: unknown
		@JvmStatic fun forCode(code: String?): DiskContentTypeB = codeMapping[code ?: unknown.code] ?: unknown
		@JvmStatic fun forStorageValue(code: String?): DiskContentTypeB = storageMapping[code ?: unknown.code] ?: unknown
	}
}

