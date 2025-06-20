package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

/**
 * [SELinuxModeB]
 * SELinux 적용 유형
 *
 * @author 이찬희 (@chanhi2000)
 */
enum class SELinuxModeB(
	override val value: Int
): Identifiable {
	enforcing(1),
	permissive(0),
	disabled(-1);

	private val loc: Localization
		get() = Localization.getInstance()
	val localizationKey: String
		get() = "${SELinuxModeB::class.java.simpleName}.${this.name}"
	val kr: String
		get() = loc.findLocalizedName4SELinuxMode(this, "kr")
	val en: String
		get() = loc.findLocalizedName4SELinuxMode(this, "en")

	override fun toString(): String = code
	val code: String
		get() = this@SELinuxModeB.name.uppercase()

	companion object {
		private val valueMapping: MutableMap<Int, SELinuxModeB> = ConcurrentHashMap<Int, SELinuxModeB>()
		private val codeMapping: MutableMap<String, SELinuxModeB> = ConcurrentHashMap<String, SELinuxModeB>()
		init {
			values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}
		@JvmStatic fun forValue(value: Int?): SELinuxModeB? = valueMapping[value ?: disabled.code] ?: disabled
		@JvmStatic fun forCode(code: String?): SELinuxModeB? = codeMapping[code ?: disabled.code] ?: disabled
	}
}
