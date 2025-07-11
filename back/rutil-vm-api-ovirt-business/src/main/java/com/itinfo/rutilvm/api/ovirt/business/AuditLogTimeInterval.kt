package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

/**
 * [AuditLogTimeInterval]
 * 이벤트로그 입력 주기
 *
 * @author 이찬희 (@chanhi2000)
 */
enum class AuditLogTimeInterval(
	override val value: Int
): Identifiable {
	none(0),
	second(1),
	minute(60),
	hour(3600),
	day(86400),
	week(604800);

	override fun toString(): String = code
	val code: String
		get() = this@AuditLogTimeInterval.name.uppercase()

	companion object {
		private val valueMapping: MutableMap<Int, AuditLogTimeInterval> = ConcurrentHashMap<Int, AuditLogTimeInterval>()
		private val codeMapping: MutableMap<String, AuditLogTimeInterval> = ConcurrentHashMap<String, AuditLogTimeInterval>()
		init {
			AuditLogTimeInterval.values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}
		@JvmStatic fun forValue(value: Int?=-1): AuditLogTimeInterval = valueMapping[value] ?: none
		@JvmStatic fun forCode(code: String?): AuditLogTimeInterval = codeMapping[code ?: none.code] ?: none

		val allAuditLogSeverities: List<AuditLogTimeInterval> = AuditLogTimeInterval.values().filter {
			it != none
		}.toList()
	}
}
