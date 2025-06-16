package com.itinfo.rutilvm.api.ovirt.business

import java.io.Serializable
import java.util.concurrent.ConcurrentHashMap

/**
 * [MigrationSupport]
 * 마이그레이션 유형 (가상머신 대상)
 *
 * @author 이찬희 (@chanhi2000)
 */
enum class MigrationSupport(
	override val value: Int,
	val code: String,
): Identifiable, Serializable {
	MIGRATABLE(0, "migratable"),
	IMPLICITLY_NON_MIGRATABLE(1, "implicitly_non_migratable"),
	PINNED_TO_HOST(2, "pinned_to_host"),
	UNKNOWN(-1, "unknown");

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
		@JvmStatic fun forCode(value: String? = "migratable"): MigrationSupport = codeMapping[value?.lowercase()] ?: MIGRATABLE
	}
}
