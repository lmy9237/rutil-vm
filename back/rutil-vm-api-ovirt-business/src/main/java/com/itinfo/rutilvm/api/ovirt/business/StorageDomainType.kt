package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

enum class StorageDomainType(
	override val value: Int,
	val description: String,
): Identifiable {
	MASTER(0, "master"),
	DATA(1, "data"),
	ISO(2, "iso"),
	IMPORT_EXPORT(3, "import_export"),
	IMAGE(4, "image"),
	VOLUME(5, "volume"),
	UNKNOWN(6, "unknown"),
	MANAGED_BLOCK_STORAGE(7, "managed_block_storage"),
	UNMANAGED(8, "unmanaged");

	companion object {
		private val valueMapping: MutableMap<Int, StorageDomainType> = ConcurrentHashMap<Int, StorageDomainType>()
		private val descriptionMapping: MutableMap<String, StorageDomainType> = ConcurrentHashMap<String, StorageDomainType>()

		init {
			StorageDomainType.values().forEach {
				valueMapping[it.value] = it
				descriptionMapping[it.description.lowercase()] = it
			}
		}

		val allStorageDomainTypes: List<StorageDomainType> = StorageDomainType.values().filterNot {
			it == StorageDomainType.UNKNOWN
		}

		@JvmStatic fun forValue(value: Int? = -1): StorageDomainType = valueMapping[value] ?: UNKNOWN
		@JvmStatic fun forDescription(value: String = "UNKNOWN"): StorageDomainType = descriptionMapping[value.lowercase()] ?: UNKNOWN
	}
}
