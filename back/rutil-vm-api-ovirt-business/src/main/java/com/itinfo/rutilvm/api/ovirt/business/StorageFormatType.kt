package com.itinfo.rutilvm.api.ovirt.business

import java.io.Serializable
import java.util.concurrent.ConcurrentHashMap

/**
 * [StorageFormatType]
 * 스토리지 포멧 유형
 *
 * @author 이찬희 (@chanhi2000)
 */
enum class StorageFormatType(
	val value: String
): Serializable {
	v1("0"),
	v2("2"),
	v3("3"),
	v4("4"),
	v5("5");

	override fun toString(): String = code
	val code: String
		get() = this@StorageFormatType.name.uppercase()

	companion object {
		private val valueMapping: MutableMap<String, StorageFormatType> = ConcurrentHashMap<String, StorageFormatType>()
		private val codeMapping: MutableMap<String, StorageFormatType> = ConcurrentHashMap<String, StorageFormatType>()
		val defaultSupportedVersions: Set<StorageFormatType> = hashSetOf(v1, v2, v3, v4)
		val latest: StorageFormatType = values().last()

		init {
			values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}

		val allStorageFormatTypes: List<StorageFormatType> = StorageFormatType.values().toList()

		@JvmStatic fun forValue(value: String?): StorageFormatType = valueMapping[value ?: latest.value] ?: latest
		@JvmStatic fun forCode(value: String?): StorageFormatType = codeMapping[value ?: latest.code] ?: latest
	}
}

