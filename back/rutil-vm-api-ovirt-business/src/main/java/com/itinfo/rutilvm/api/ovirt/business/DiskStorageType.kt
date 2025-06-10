package com.itinfo.rutilvm.api.ovirt.business

import java.io.Serializable
import java.util.concurrent.ConcurrentHashMap

enum class DiskStorageType(
	override val value: Int,
	val storageValue: String,
): Identifiable, Serializable {
	IMAGE(0, "IMAGE"),
	CINDER(1, "CINDER"),
	LUN(2, "LUN"),
	MANAGED_BLOCK_STORAGE(3, "MANAGED_BLOCK_STORAGE"),
	UNKNOWN(-1, "UNKNOWN");

	val label: String
		get() = this@DiskStorageType.name.lowercase()

	val isInternal: Boolean
		get() = this@DiskStorageType == IMAGE ||
			this@DiskStorageType == CINDER ||
			this@DiskStorageType == MANAGED_BLOCK_STORAGE

	companion object {
		private val valueMapping: MutableMap<Int, DiskStorageType> = ConcurrentHashMap<Int, DiskStorageType>()
		private val storageMapping: MutableMap<String, DiskStorageType> = ConcurrentHashMap<String, DiskStorageType>()

		init {
			values().forEach { valueMapping[it.value] = it }
		}

		val allContentTypes: List<DiskStorageType> = DiskStorageType.values().filterNot {
			it == UNKNOWN
		}

		@JvmStatic fun forValue(value: Int?=-1): DiskStorageType = valueMapping[value] ?: UNKNOWN
		@JvmStatic fun forStorageValue(value: String="IMAGE"): DiskStorageType = storageMapping[value] ?: IMAGE

	}
}
