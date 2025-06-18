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
): Identifiable {
	unknown(-1),
	desktop(0),
	server(1),
	high_performance(2);

	override fun toString(): String = this@VmTypeB.code
	val code: String
		get() = this@VmTypeB.name.uppercase()

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
		val allVmTypes: List<VmTypeB> = VmTypeB.values().toList().filter {
			it != unknown
		}

		@JvmStatic fun forValue(value: Int?): VmTypeB = valueMapping[value ?: server.value] ?: server
		@JvmStatic fun forCode(code: String?): VmTypeB = codeMapping[code?.uppercase() ?: server.code] ?: server

	}
}
