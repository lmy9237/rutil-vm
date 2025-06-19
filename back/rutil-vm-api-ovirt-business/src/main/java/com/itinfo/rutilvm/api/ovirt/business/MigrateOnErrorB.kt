package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

/**
 * [MigrateOnErrorB]
 * (마이그레이션) 복구정책
 *
 * @author 이찬희 (@chanhi2000)
 */
enum class MigrateOnErrorB(
	override val value: Int
): Identifiable {
    do_not_migrate(0),
    migrate(1),
    migrate_highly_available(2);

	override fun toString(): String = code
	val code: String
		get() = this@MigrateOnErrorB.name.uppercase()

	val localizationKey: String
		get() = "${MigrateOnErrorB::class.java.simpleName}.${this.name}"

	private val loc: Localization
		get() = Localization.getInstance()
	val en: String
		get() = loc.findLocalizedName4MigrateOnErrorB(this, "en")
	val kr: String
		get() = loc.findLocalizedName4MigrateOnErrorB(this,"kr")

	companion object {
		private val valueMapping: MutableMap<Int, MigrateOnErrorB> = ConcurrentHashMap<Int, MigrateOnErrorB>()
		private val codeMapping: MutableMap<String, MigrateOnErrorB> = ConcurrentHashMap<String, MigrateOnErrorB>()
		init {
			MigrateOnErrorB.values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}
		@JvmStatic fun forValue(value: Int?): MigrateOnErrorB = valueMapping[value ?: do_not_migrate.value] ?: do_not_migrate
		@JvmStatic fun forCode(code: String?): MigrateOnErrorB = codeMapping[code ?: do_not_migrate.code] ?: do_not_migrate
		val allMigrateOnErrors: List<MigrateOnErrorB> = MigrateOnErrorB.values().toList().filter {
			it != do_not_migrate
		}
	}
}
