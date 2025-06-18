package com.itinfo.rutilvm.api.ovirt.business

import java.io.Serializable
import java.util.concurrent.ConcurrentHashMap

enum class DiskStorageType(
	override val value: Int,
): Identifiable, Serializable {
	image(0),
	cinder(1),
	lun(2),
	managed_block_storage(3),
	unknown(-1);

	override fun toString(): String = code
	val code: String
		get() = this@DiskStorageType.name.uppercase()

	val isInternal: Boolean
		get() = this@DiskStorageType == image ||
			this@DiskStorageType == cinder ||
			this@DiskStorageType == managed_block_storage

	companion object {
		private val valueMapping: MutableMap<Int, DiskStorageType> = ConcurrentHashMap<Int, DiskStorageType>()
		private val codeMapping: MutableMap<String, DiskStorageType> = ConcurrentHashMap<String, DiskStorageType>()

		init {
			values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}

		val allDiskStorageTypes: List<DiskStorageType> = DiskStorageType.values().filterNot {
			it == unknown
		}

		@JvmStatic fun forValue(value: Int?): DiskStorageType = valueMapping[value ?: unknown.code] ?: unknown
		@JvmStatic fun forCode(code: String?): DiskStorageType = codeMapping[code ?: unknown.code] ?: unknown
	}
}
