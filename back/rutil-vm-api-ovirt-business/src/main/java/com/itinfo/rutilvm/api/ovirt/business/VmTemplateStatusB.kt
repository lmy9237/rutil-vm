package com.itinfo.rutilvm.api.ovirt.business

import java.io.Serializable
import java.util.concurrent.ConcurrentHashMap

/**
 * [VmTemplateStatusB]
 * 가상머신 탬플릿 상태
 *
 * @author 이찬희 (@chanhi2000)
 */
enum class VmTemplateStatusB(
	override val value: Int,
): Identifiable, Serializable {
	unknown(-1),
	ok(0),
	locked(1),
	illegal(2);

	override fun toString(): String = code
	val code: String
		get() = this@VmTemplateStatusB.name.uppercase()

	private val loc: Localization
		get() = Localization.getInstance()
	val localizationKey: String
		get() = "${VmTemplateStatusB::class.java.simpleName}.${this.name}"
	val kr: String
		get() = loc.findLocalizedName4VmTemplateStatusB(this, "kr")
	val en: String
		get() = loc.findLocalizedName4VmTemplateStatusB(this, "en")

	companion object {
		private val valueMapping: MutableMap<Int, VmTemplateStatusB> = ConcurrentHashMap<Int, VmTemplateStatusB>()
		private val codeMapping: MutableMap<String, VmTemplateStatusB> = ConcurrentHashMap<String, VmTemplateStatusB>()

		init {
			values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}
		val allVmTemplatesStatuses: List<VmTemplateStatusB> = VmTemplateStatusB.values().filterNot {
			it == unknown
		}
		@JvmStatic fun forValue(value: Int?): VmTemplateStatusB = valueMapping[value ?: unknown.value] ?: unknown
		@JvmStatic fun forCode(code: String?): VmTemplateStatusB = codeMapping[code ?: unknown.code] ?: unknown
	}
}
