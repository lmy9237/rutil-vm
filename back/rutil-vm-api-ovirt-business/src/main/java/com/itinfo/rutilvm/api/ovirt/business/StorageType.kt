package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

enum class StorageType(
	override val value: Int,
	val description: String,
): Identifiable {
	UNKNOWN(0, "unknown"),
	NFS(1, "nfs"),
	FCP(2, "fcp"),
	ISCSI(3, "iscsi"),
	LOCALFS(4, "localfs"),
	POSIXFS(6, "posixfs"),
	GLUSTERFS(7, "glusterfs"),
	GLANCE(8, "glance"),
	CINDER(9, "cinder"),
	MANAGED_BLOCK_STORAGE(10, "managed_block_storage"),
	UNMANAGED(11, "unmanaged");

	companion object {
		private val valueMapping: MutableMap<Int, StorageType> = ConcurrentHashMap<Int, StorageType>()
		private val descriptionMapping: MutableMap<String, StorageType> = ConcurrentHashMap<String, StorageType>()

		init {
			StorageType.values().forEach {
				valueMapping[it.value] = it
				descriptionMapping[it.description.lowercase()] = it
			}
		}

		val allStorageTypes: List<StorageType> = StorageType.values().filterNot {
			it == UNKNOWN
		}

		@JvmStatic fun forValue(value: Int? = -1): StorageType = valueMapping[value] ?: UNKNOWN
		@JvmStatic fun forDescription(value: String = "UNKNOWN"): StorageType = descriptionMapping[value.uppercase()] ?: UNKNOWN
	}
}
