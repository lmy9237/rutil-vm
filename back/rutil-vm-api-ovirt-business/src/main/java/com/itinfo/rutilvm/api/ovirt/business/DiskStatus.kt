package com.itinfo.rutilvm.api.ovirt.business

import java.io.Serializable
import java.util.concurrent.ConcurrentHashMap

enum class DiskStatus(
	override val value: Int,
	val statusValue: String,
): Identifiable, Serializable {
	Unassigned(0, "Unassigned"),
	OK(1, "ok"),
	LOCKED(2, "locked"),
	ILLEGAL(4,"illegal");

	val label: String
		get() = this@DiskStatus.statusValue.uppercase()


	companion object {
		private val valueMapping: MutableMap<Int, DiskStatus> = ConcurrentHashMap<Int, DiskStatus>()
		private val storageMapping: MutableMap<String, DiskStatus> = ConcurrentHashMap<String, DiskStatus>()

		init {
			values().forEach {
				valueMapping[it.value] = it
				storageMapping[it.statusValue.lowercase()] = it
			}
		}

		val allContentTypes: List<DiskStatus> = DiskStatus.values().filterNot {
			it == Unassigned
		}

		@JvmStatic fun forValue(value: Int? = -1): DiskStatus = valueMapping[value] ?: Unassigned
		@JvmStatic fun forStorageValue(value: String = "Unassigned"): DiskStatus = storageMapping[value.lowercase()] ?: Unassigned
	}
}
