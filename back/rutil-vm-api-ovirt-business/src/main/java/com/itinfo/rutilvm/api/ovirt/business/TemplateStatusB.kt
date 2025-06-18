package com.itinfo.rutilvm.api.ovirt.business

import java.io.Serializable
import java.util.concurrent.ConcurrentHashMap

/**
 * [TemplateStatusB]
 * 탬플릿 상태
 *
 * @author 이찬희 (@chanhi2000)
 */
enum class TemplateStatusB(
	override val value: Int,
): Identifiable, Serializable {
	unknown(-1),
	ok(0),
	locked(1),
	illegal(2);

	override fun toString(): String = code
	val code: String
		get() = this@TemplateStatusB.name.uppercase()

	companion object {
		private val valueMapping: MutableMap<Int, TemplateStatusB> = ConcurrentHashMap<Int, TemplateStatusB>()
		private val codeMapping: MutableMap<String, TemplateStatusB> = ConcurrentHashMap<String, TemplateStatusB>()

		init {
			values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}
		val allTemplatesStatuses: List<TemplateStatusB> = TemplateStatusB.values().filterNot {
			it == unknown
		}
		@JvmStatic fun forValue(value: Int?): TemplateStatusB = valueMapping[value ?: unknown.value] ?: unknown
		@JvmStatic fun forCode(code: String?): TemplateStatusB = codeMapping[code ?: unknown.code] ?: unknown
	}
}
