package com.itinfo.rutilvm.api.ovirt.business

import java.io.Serializable
import java.util.concurrent.ConcurrentHashMap

enum class MigrationSupport(
	override val value: Int,
	val code: String,
): Identifiable, Serializable {
	MIGRATABLE(0, "MIGRATABLE"),
	IMPLICITLY_NON_MIGRATABLE(1, "IMPLICITLY_NON_MIGRATABLE"),
	PINNED_TO_HOST(2, "PINNED_TO_HOST"),
	UNKNOWN(-1, "UNKNOWN");

	val localizationKey: String
		get() = "${MigrationSupport::class.java.simpleName}.${this.name}"
	private val loc: Localization
		get() = Localization.getInstance()

	val en: String
		get() = loc.findLocalizedName4MigrationSupport(this, "en")
	val kr: String
		get() = loc.findLocalizedName4MigrationSupport(this, "kr")

	companion object {
		private val valueMapping: MutableMap<Int, MigrationSupport> = ConcurrentHashMap<Int, MigrationSupport>()
		private val codeMapping: MutableMap<String, MigrationSupport> = ConcurrentHashMap<String, MigrationSupport>()

		init {
			values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code.lowercase()] = it
			}
		}

		val allMigrationSupports: List<MigrationSupport> = MigrationSupport.values().filterNot {
			it == UNKNOWN
		}

		@JvmStatic fun forValue(value: Int? = -1): MigrationSupport = valueMapping[value] ?: MIGRATABLE
		@JvmStatic fun forCode(value: String? = "MIGRATABLE"): MigrationSupport = codeMapping[value?.uppercase()] ?: MIGRATABLE
	}
}
