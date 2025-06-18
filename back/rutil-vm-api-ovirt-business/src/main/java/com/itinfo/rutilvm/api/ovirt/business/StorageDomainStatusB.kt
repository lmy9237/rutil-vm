package com.itinfo.rutilvm.api.ovirt.business

import java.io.Serializable
import java.util.concurrent.ConcurrentHashMap

enum class StorageDomainStatusB(
	override val value: Int,
): Identifiable, Serializable {
	unknown(0),
	uninitialized(1),
	unattached(2),
	active(3),
	inactive(4),
	locked(5),
	maintenance(6),
	preparing_for_maintenance(7),
	detaching(8),
	activating(9);

	override fun toString(): String = code
	val code: String
		get() = this@StorageDomainStatusB.name.uppercase()

	companion object {
		private val valueMapping: MutableMap<Int, StorageDomainStatusB> = ConcurrentHashMap<Int, StorageDomainStatusB>()
		private val codeMapping: MutableMap<String, StorageDomainStatusB> = ConcurrentHashMap<String, StorageDomainStatusB>()

		init {
			values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}

		val allStorageDomainStatusTypes: List<StorageDomainStatusB> = StorageDomainStatusB.values().filterNot {
			it == unknown
		}

		@JvmStatic fun forValue(value: Int?): StorageDomainStatusB = valueMapping[value ?: unknown.value] ?: unknown
		@JvmStatic fun forCode(code: String?): StorageDomainStatusB = codeMapping[code ?: unknown.code] ?: unknown
	}
}
