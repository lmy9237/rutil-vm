package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

enum class AuditLogSeverity(
	override val value: Int,
): Identifiable {
	normal(0),
	warning(1),
	error(2),
	alert(10),
	unknown(-1);

	override fun toString(): String = code
	val code: String
		get() = this@AuditLogSeverity.name.uppercase()

	val localizationKey: String
		get() = "${AuditLogSeverity::class.java.simpleName}.${this.name}"

	private val loc: Localization
		get() = Localization.getInstance()
	val en: String
		get() = loc.findLocalizedName4AuditLogSeverity(this, "en")
	val kr: String
		get() = loc.findLocalizedName4AuditLogSeverity(this,"kr")

	companion object {
		private val valueMapping: MutableMap<Int, AuditLogSeverity> = ConcurrentHashMap<Int, AuditLogSeverity>()
		private val codeMapping: MutableMap<String, AuditLogSeverity> = ConcurrentHashMap<String, AuditLogSeverity>()
		init {
			AuditLogSeverity.values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}
		@JvmStatic fun forValue(value: Int?=-1): AuditLogSeverity = valueMapping[value] ?: unknown
		@JvmStatic fun forCode(code: String?): AuditLogSeverity = codeMapping[code ?: unknown.code] ?: unknown

		val allAuditLogSeverities: List<AuditLogSeverity> = AuditLogSeverity.values().filter {
			it != unknown
		}.toList()
	}
}
