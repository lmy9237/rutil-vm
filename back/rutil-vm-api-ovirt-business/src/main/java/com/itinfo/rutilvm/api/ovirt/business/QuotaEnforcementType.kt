package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

/**
 * [QuotaEnforcementType]
 * 스토리지 풀 (a.k.a. 데이터센터) 쿼터 모드
 *
 * @author 이찬희 (@chanhi2000)
 */
enum class QuotaEnforcementType(
	override val value: Int,
): Identifiable {
	disabled(0),
	audit(1), // soft_enforcement
	enabled(2); // hard_enforcement

	override fun toString(): String = code
	val code: String
		get() = this@QuotaEnforcementType.name.uppercase()

	val localizationKey: String
		get() = "${QuotaEnforcementType::class.java.simpleName}.${this.name}"
	private val loc: Localization
		get() = Localization.getInstance()
	val en: String
		get() = loc.findLocalizedName4QuotaEnforcementType(this, "en")
	val kr: String
		get() = loc.findLocalizedName4QuotaEnforcementType(this, "kr")

	companion object {
		private val valueMapping: MutableMap<Int, QuotaEnforcementType> = ConcurrentHashMap<Int, QuotaEnforcementType>()
		private val codeMapping: MutableMap<String, QuotaEnforcementType> = ConcurrentHashMap<String, QuotaEnforcementType>()

		init {
			values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}

		val allQuotaEnforcementTypes: List<QuotaEnforcementType> = QuotaEnforcementType.values().toList()

		@JvmStatic fun forValue(value: Int?): QuotaEnforcementType = valueMapping[value ?: disabled.value] ?: disabled
		@JvmStatic fun forCode(value: String?): QuotaEnforcementType = codeMapping[value ?: disabled.code] ?: disabled
	}
}
