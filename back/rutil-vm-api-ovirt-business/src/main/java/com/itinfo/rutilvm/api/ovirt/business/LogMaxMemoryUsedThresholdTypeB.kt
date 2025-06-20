package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

/**
 * [LogMaxMemoryUsedThresholdTypeB]
 * 클러스터용 로그 최대 메모리 한계 설정 유형
 *
 * @author 이찬희 (@chanhi2000)
 */
enum class LogMaxMemoryUsedThresholdTypeB(
	override val value: Int,
	val unit: String,
): Identifiable {
	percentage(0, "%"),			/* Percentage of total memory (총 사용량에서 퍼센트로) */
	absolute_value_in_mb(1, "MB");		/* Absolute value of memory in MB (절대사용량 MB 지정) */

	override fun toString(): String = code
	val code: String
		get() = this@LogMaxMemoryUsedThresholdTypeB.name.uppercase()

	/*
	val localizationKey: String
		get() = "${LogMaxMemoryUsedThresholdTypeB::class.java.simpleName}.${this.name}"
	private val loc: Localization
		get() = Localization.getInstance()
	val en: String
		get() = loc.findLocalizedName4LogMaxMemoryUsedThresholdType(this, "en")
	val kr: String
		get() = loc.findLocalizedName4LogMaxMemoryUsedThresholdType(this, "kr")
	*/

	companion object {
		private val valueMapping: MutableMap<Int, LogMaxMemoryUsedThresholdTypeB> = ConcurrentHashMap<Int, LogMaxMemoryUsedThresholdTypeB>()
		private val codeMapping: MutableMap<String, LogMaxMemoryUsedThresholdTypeB> = ConcurrentHashMap<String, LogMaxMemoryUsedThresholdTypeB>()
		init {
			LogMaxMemoryUsedThresholdTypeB.values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}
		@JvmStatic fun forValue(value: Int?): LogMaxMemoryUsedThresholdTypeB = valueMapping[value ?: percentage.value] ?: percentage
		@JvmStatic fun forCode(code: String?): LogMaxMemoryUsedThresholdTypeB = codeMapping[code ?: percentage.code] ?: percentage
		val allLogMaxMemoryUsedThresholdTypes: List<LogMaxMemoryUsedThresholdTypeB> = LogMaxMemoryUsedThresholdTypeB.values().toList()
	}
}
