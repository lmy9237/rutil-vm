package com.itinfo.rutilvm.api.ovirt.business

import java.io.Serializable
import java.util.concurrent.ConcurrentHashMap

enum class DiskStatus(
	override val value: Int,
	val statusValue: String,
): Identifiable, Serializable {
	unassigned(0, "Unassigned"),
	ok(1, "ok"),
	locked(2, "locked"),
	illegal(4,"illegal");

	override fun toString(): String = code
	val code: String
		get() = this@DiskStatus.name.uppercase()

	companion object {
		private val valueMapping: MutableMap<Int, DiskStatus> = ConcurrentHashMap<Int, DiskStatus>()
		private val codeMapping: MutableMap<String, DiskStatus> = ConcurrentHashMap<String, DiskStatus>()

		init {
			values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}

		val allContentTypes: List<DiskStatus> = DiskStatus.values().filterNot {
			it == unassigned
		}

		@JvmStatic fun forValue(value: Int?): DiskStatus = valueMapping[value ?: unassigned.value] ?: unassigned
		@JvmStatic fun forCode(value: String?): DiskStatus = codeMapping[value ?: unassigned.code] ?: unassigned
	}
}
