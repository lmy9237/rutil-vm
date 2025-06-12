package com.itinfo.rutilvm.api.ovirt.business

import java.io.Serializable
import java.util.concurrent.ConcurrentHashMap

enum class StorageDomainStatus(
	override val value: Int,
	val statusValue: String,
): Identifiable, Serializable {
	UNKNOWN(0, "unknown"),
	UNINITIALIZED(1, "uninitialized"),
	UNATTACHED(2, "unattached"),
	ACTIVE(3, "active"),
	INACTIVE(4, "inactive"),
	LOCKED(5, "locked"),
	MAINTENANCE(6, "maintenance"),
	PREPARING_FOR_MAINTENANCE(7, "preparing_for_maintenance"),
	DETACHING(8, "detaching"),
	ACTIVATING(9, "activating");

	val label: String
		get() = this@StorageDomainStatus.statusValue.uppercase()


	companion object {
		private val valueMapping: MutableMap<Int, StorageDomainStatus> = ConcurrentHashMap<Int, StorageDomainStatus>()
		private val storageMapping: MutableMap<String, StorageDomainStatus> = ConcurrentHashMap<String, StorageDomainStatus>()

		init {
			values().forEach {
				valueMapping[it.value] = it
				storageMapping[it.statusValue.lowercase()] = it
			}
		}

		val allContentTypes: List<StorageDomainStatus> = StorageDomainStatus.values().filterNot {
			it == UNKNOWN
		}

		// @JvmStatic fun forValue(value: Int? = -1): StorageDomainStatus = valueMapping[value] ?: UNKNOWN
		@JvmStatic
		fun forValue(value: Int?): StorageDomainStatus {
			if (value == null) return UNATTACHED
			return valueMapping[value] ?: UNATTACHED
		}

		@JvmStatic
		fun forStatusValue(value: String?): StorageDomainStatus {
			return if (value.isNullOrBlank()) {
				UNATTACHED
			} else {
				storageMapping[value.lowercase()] ?: UNATTACHED
			}
		}

	}
}
