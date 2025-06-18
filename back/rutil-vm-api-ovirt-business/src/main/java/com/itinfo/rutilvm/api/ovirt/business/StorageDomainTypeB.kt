package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

enum class StorageDomainTypeB(
	override val value: Int,
): Identifiable {
	master(0),
	`data`(1),
	iso(2),
	import_export(3),
	image(4),
	volume(5),
	unknown(6),
	managed_block_storage(7),
	unmanaged(8);

	override fun toString(): String = code
	val code: String
		get() = this@StorageDomainTypeB.name.uppercase()

	companion object {
		private val valueMapping: MutableMap<Int, StorageDomainTypeB> = ConcurrentHashMap<Int, StorageDomainTypeB>()
		private val codeMapping: MutableMap<String, StorageDomainTypeB> = ConcurrentHashMap<String, StorageDomainTypeB>()

		init {
			StorageDomainTypeB.values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}

		val allStorageDomainTypes: List<StorageDomainTypeB> = StorageDomainTypeB.values().filterNot {
			it == unknown
		}

		@JvmStatic fun forValue(value: Int?): StorageDomainTypeB = valueMapping[value ?: unknown.value] ?: unknown
		@JvmStatic fun forCode(value: String?): StorageDomainTypeB = codeMapping[value ?: unknown.code] ?: unknown
	}
}
