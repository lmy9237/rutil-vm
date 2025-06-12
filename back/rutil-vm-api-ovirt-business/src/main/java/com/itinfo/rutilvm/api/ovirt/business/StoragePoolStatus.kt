package com.itinfo.rutilvm.api.ovirt.business

import java.io.Serializable
import java.util.concurrent.ConcurrentHashMap

enum class StoragePoolStatus(
	override val value: Int,
	val statusValue: String,
): Identifiable, Serializable {
	UNINITIALIZED(0, "uninitialized"),
	UP(1, "up"),
	MAINTENANCE(2, "maintenance"),
	NOT_OPERATIONAL(3, "not_operational"),
	NON_RESPONSIVE(4, "non_responsive"),
	CONTEND(5, "contend");

	val label: String
		get() = this@StoragePoolStatus.statusValue.uppercase()


	companion object {
		private val valueMapping: MutableMap<Int, StoragePoolStatus> = ConcurrentHashMap<Int, StoragePoolStatus>()
		private val storageMapping: MutableMap<String, StoragePoolStatus> = ConcurrentHashMap<String, StoragePoolStatus>()

		init {
			values().forEach {
				valueMapping[it.value] = it
				storageMapping[it.statusValue.lowercase()] = it
			}
		}

		val allStoragePoolStatus: List<StoragePoolStatus> = StoragePoolStatus.values().filterNot {
			it == UNINITIALIZED
		}

		@JvmStatic fun forValue(value: Int? = -1): StoragePoolStatus = valueMapping[value] ?: UNINITIALIZED
		@JvmStatic fun forStatusValue(value: String = "uninitialized"): StoragePoolStatus = storageMapping[value.lowercase()] ?: UNINITIALIZED
	}
}
