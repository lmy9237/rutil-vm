package com.itinfo.rutilvm.api.ovirt.business

import java.io.Serializable
import java.util.concurrent.ConcurrentHashMap

enum class TemplateStatus(
	override val value: Int,
	val code: String,
): Identifiable, Serializable {
	Unknown(-1, "UNKNOWN"),
	OK(0, "OK"),
	Locked(1, "LOCKED"),
	Illegal(2, "ILLEGAL");

	val label: String
		get() = this@TemplateStatus.code

	companion object {
		private val valueMapping: MutableMap<Int, TemplateStatus> = ConcurrentHashMap<Int, TemplateStatus>()
		private val codeMapping: MutableMap<String, TemplateStatus> = ConcurrentHashMap<String, TemplateStatus>()

		init {
			values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
			}
		}

		val allVmStatuses: List<TemplateStatus> = TemplateStatus.values().filterNot {
			it == Unknown
		}

		@JvmStatic fun forValue(value: Int? = -1): TemplateStatus = valueMapping[value] ?: Unknown
		@JvmStatic fun forCode(code: String? = Unknown.name.uppercase()): TemplateStatus = codeMapping[code?.uppercase()] ?: Unknown
	}
}
