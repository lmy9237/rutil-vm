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
): Identifiable, Serializable {
	migratable(0),
	implicitly_non_migratable(1),
	pinned_to_host(2),
	unknown(-1);

	override fun toString(): String = code
	val code: String
		get() = this@MigrationSupport.name.uppercase()

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
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}

		val allMigrationSupports: List<MigrationSupport> = MigrationSupport.values().filterNot {
			it == unknown
		}
		@JvmStatic fun forValue(value: Int?): MigrationSupport = valueMapping[value ?: migratable.value] ?: migratable
		@JvmStatic fun forCode(value: String?): MigrationSupport = codeMapping[value ?: migratable.code] ?: migratable
	}
}
