package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

/**
 * [SwitchTypeB]
 * 네트워크 스위치 유형
 *
 * @author 이찬희 (@chanhi2000)
 */
enum class SwitchTypeB(

) {
	legacy,
	ovs;

	val localizationKey: String				get() = "${SwitchTypeB::class.java.simpleName}.${this.name}"
	private val loc: Localization			get() = Localization.getInstance()
	val en: String							get() = loc.findLocalizedName4SwitchType(this, "en")
	val kr: String							get() = loc.findLocalizedName4SwitchType(this, "kr")

	override fun toString(): String = code
	val code: String
		get() = this@SwitchTypeB.name.uppercase()

	companion object {
		// private val valueMapping: MutableMap<Int, SwitchTypeB> = ConcurrentHashMap<Int, SwitchTypeB>()
		private val codeMapping: MutableMap<String, SwitchTypeB> = ConcurrentHashMap<String, SwitchTypeB>()
		init {
			values().forEach {
				// valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}
		// @JvmStatic fun forValue(value: Int?): SwitchTypeB = valueMapping[value ?: auto.code] ?: auto
		@JvmStatic fun forCode(code: String?): SwitchTypeB = codeMapping[code ?: legacy.code] ?: legacy
		val allSwitchTypes: List<SwitchTypeB> = SwitchTypeB.values().toList()
	}

}
