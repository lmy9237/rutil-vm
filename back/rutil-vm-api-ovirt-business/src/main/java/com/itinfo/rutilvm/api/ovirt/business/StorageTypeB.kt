package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

/**
 * [StorageTypeB]
 * 스토리지 유형
 *
 * @author 이찬희 (@chanhi2000)
 */
enum class StorageTypeB(
	override val value: Int,
): Identifiable {
	unknown(0),
	nfs(1),
	fcp(2),
	iscsi(3),
	localfs(4),
	posixfs(6),
	glusterfs(7),
	glance(8),
	cinder(9),
	managed_block_storage(10),
	unmanaged(11);

	override fun toString(): String = code
	val code: String
		get() = this@StorageTypeB.name.uppercase()

	companion object {
		private val valueMapping: MutableMap<Int, StorageTypeB> = ConcurrentHashMap<Int, StorageTypeB>()
		private val codeMapping: MutableMap<String, StorageTypeB> = ConcurrentHashMap<String, StorageTypeB>()

		init {
			StorageTypeB.values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}
		val allStorageTypes: List<StorageTypeB> = StorageTypeB.values().filterNot {
			it == unknown
		}

		@JvmStatic fun forValue(value: Int?): StorageTypeB = valueMapping[value ?: unknown.value] ?: unknown
		@JvmStatic fun forCode(code: String?): StorageTypeB = codeMapping[code ?: unknown.code] ?: unknown
	}
}
