package com.itinfo.rutilvm.api.ovirt.business

import java.io.Serializable
import java.util.concurrent.ConcurrentHashMap

/**
 * [DiskStatusB]
 * 디스크 상태
 *
 * @author 이찬희
 */
enum class DiskStatusB(
	override val value: Int,
	val statusValue: String,
): Identifiable, Serializable {
	unassigned(0, "Unassigned"),
	ok(1, "ok"),
	locked(2, "locked"),
	illegal(4,"illegal");

	override fun toString(): String = code
	val code: String
		get() = this@DiskStatusB.name.uppercase()

	companion object {
		private val valueMapping: MutableMap<Int, DiskStatusB> = ConcurrentHashMap<Int, DiskStatusB>()
		private val codeMapping: MutableMap<String, DiskStatusB> = ConcurrentHashMap<String, DiskStatusB>()

		init {
			values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}

		@JvmStatic fun forValue(value: Int?): DiskStatusB = valueMapping[value ?: unassigned.value] ?: unassigned
		@JvmStatic fun forCode(value: String?): DiskStatusB = codeMapping[value ?: unassigned.code] ?: unassigned
		val allContentTypes: List<DiskStatusB> = DiskStatusB.values().filterNot { it == unassigned }
	}
}
