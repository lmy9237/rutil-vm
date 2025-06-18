package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

/**
 * [VmTypeB]
 * 가상머신 유형 (a.k.a. 최적화 옵션)
 *
 * @author 이찬희 (@chanhi2000)
 */
enum class VmTypeB(
	override val value: Int,
	val code: String,
): Identifiable {
	unknown(-1, "UNKNOWN"),
	desktop(0, "DESKTOP"),
	server(1, "SERVER"),
	high_performance(2, "HIGH_PERFORMANCE");

	val localizationKey: String
		get() = "${VmTypeB::class.java.simpleName}.${this.name}"

	private val loc: Localization
		get() = Localization.getInstance()
	val en: String
		get() = loc.findLocalizedName4VmType(this, "en")
	val kr: String
		get() = loc.findLocalizedName4VmType(this, "kr")
	companion object {
		private val valueMapping: MutableMap<Int, VmTypeB> = ConcurrentHashMap<Int, VmTypeB>()
		private val codeMapping: MutableMap<String, VmTypeB> = ConcurrentHashMap<String, VmTypeB>()
		init {
			VmTypeB.values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
			}
		}
		@JvmStatic fun forValue(value: Int?): VmTypeB = valueMapping[value ?: -1] ?: unknown
		@JvmStatic fun forCode(code: String?): VmTypeB = codeMapping[code?.uppercase() ?: "UNKNOWN"] ?: unknown
		val allVmTypes: List<VmTypeB> = VmTypeB.values().toList().filter {
			it != unknown
		}
	}
}
