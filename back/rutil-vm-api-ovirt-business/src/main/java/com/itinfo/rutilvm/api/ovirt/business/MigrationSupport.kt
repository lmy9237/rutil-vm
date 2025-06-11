package com.itinfo.rutilvm.api.ovirt.business

import java.io.Serializable
import java.util.concurrent.ConcurrentHashMap

enum class MigrationSupport(
	override val value: Int,
	val description: String,
): Identifiable, Serializable {
	MIGRATABLE(0, "MIGRATABLE"),
	IMPLICITLY_NON_MIGRATABLE(1, "IMPLICITLY_NON_MIGRATABLE"),
	PINNED_TO_HOST(2, "PINNED_TO_HOST");

	val label: String
		get() = this@MigrationSupport.description.lowercase()


	companion object {
		private val valueMapping: MutableMap<Int, MigrationSupport> = ConcurrentHashMap<Int, MigrationSupport>()
		private val descriptionMapping: MutableMap<String, MigrationSupport> = ConcurrentHashMap<String, MigrationSupport>()

		init {
			values().forEach {
				valueMapping[it.value] = it
				descriptionMapping[it.description.lowercase()] = it
			}
		}

		val allContentTypes: List<MigrationSupport> = MigrationSupport.values().filterNot {
			it == MIGRATABLE
		}

		@JvmStatic fun forValue(value: Int? = -1): MigrationSupport = valueMapping[value] ?: MIGRATABLE
		@JvmStatic fun forDescription(value: String = "MIGRATABLE"): MigrationSupport = descriptionMapping[value.lowercase()] ?: MIGRATABLE
	}
}
