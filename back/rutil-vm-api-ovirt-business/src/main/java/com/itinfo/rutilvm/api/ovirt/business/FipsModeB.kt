package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

/**
 * [FipsModeB]
 * FIPS 유형
 *
 * @author 이찬희 (@chanhi2000)
 */
enum class FipsModeB(
	override val value: Int
): Identifiable {
	undefined(0),
	disabled(1),
	enabled(2);

	override fun toString(): String = code
	val code: String
		get() = this@FipsModeB.name.uppercase()

	val localizationKey: String
		get() = "${FipsModeB::class.java.simpleName}.${this.name}"
	private val loc: Localization
		get() = Localization.getInstance()
	val en: String
		get() = loc.findLocalizedName4FipsMode(this, "en")
	val kr: String
		get() = loc.findLocalizedName4FipsMode(this, "kr")

	companion object {
		private val valueMapping: MutableMap<Int, FipsModeB> = ConcurrentHashMap<Int, FipsModeB>()
		private val codeMapping: MutableMap<String, FipsModeB> = ConcurrentHashMap<String, FipsModeB>()
		init {
			FipsModeB.values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}
		@JvmStatic fun forValue(value: Int?): FipsModeB = valueMapping[value ?: undefined.value] ?: undefined
		@JvmStatic fun forCode(code: String?): FipsModeB = codeMapping[code ?: undefined.code] ?: undefined
		val allFipsModes: List<FipsModeB> = FipsModeB.values().toList()
	}
}
