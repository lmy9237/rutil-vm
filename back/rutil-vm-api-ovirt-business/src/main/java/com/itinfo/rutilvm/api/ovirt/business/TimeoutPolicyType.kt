package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

/**
 * [TimeoutPolicyType]
 * 디스크 이미지 전송 Timeout 정책유형
 *
 * @author 이찬희
 */
enum class TimeoutPolicyType(
	override val value: Int,
): Identifiable {
	legacy(0),
	pause(1),
	cancel(2);

	override fun toString(): String = code
	val code: String
		get() = this@TimeoutPolicyType.name.uppercase()

	val localizationKey: String
		get() = "${TimeoutPolicyType::class.java.simpleName}.${this.name}"

	companion object {
		private val valueMapping: MutableMap<Int, TimeoutPolicyType> = ConcurrentHashMap<Int, TimeoutPolicyType>()
		private val codeMapping: MutableMap<String, TimeoutPolicyType> = ConcurrentHashMap<String, TimeoutPolicyType>()
		init {
			TimeoutPolicyType.values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}
		@JvmStatic fun forValue(value: Int?): TimeoutPolicyType = valueMapping[value ?: legacy.value] ?: legacy
		@JvmStatic fun forCode(code: String?): TimeoutPolicyType = codeMapping[code ?: legacy.code] ?: legacy
		val alTimeoutPolicyTypes: List<TimeoutPolicyType> = TimeoutPolicyType.values().toList()
	}
}
