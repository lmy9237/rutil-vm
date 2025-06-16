package com.itinfo.rutilvm.api.ovirt.business

import java.io.Serializable
import java.util.concurrent.ConcurrentHashMap

enum class TemplateStatusB(
	override val value: Int,
	val code: String,
): Identifiable, Serializable {
	Unknown(-1, "UNKNOWN"),
	OK(0, "OK"),
	Locked(1, "LOCKED"),
	Illegal(2, "ILLEGAL");

	val label: String
		get() = this@TemplateStatusB.code

	companion object {
		private val valueMapping: MutableMap<Int, TemplateStatusB> = ConcurrentHashMap<Int, TemplateStatusB>()
		private val codeMapping: MutableMap<String, TemplateStatusB> = ConcurrentHashMap<String, TemplateStatusB>()

		init {
			values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
			}
		}

		val allVmStatuses: List<TemplateStatusB> = TemplateStatusB.values().filterNot {
			it == Unknown
		}

		@JvmStatic fun forValue(value: Int? = -1): TemplateStatusB = valueMapping[value] ?: Unknown
		@JvmStatic fun forCode(code: String? = Unknown.name.uppercase()): TemplateStatusB = codeMapping[code?.uppercase()] ?: Unknown
	}
}
