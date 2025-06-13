package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

enum class SnapshotType(
) {
	REGULAR,
	ACTIVE,
	STATELESS,
	PREVIEW,
	NEXT_RUN,
	UNKNOWN;

	companion object {
		private val codeMapping: MutableMap<String, SnapshotType> = ConcurrentHashMap<String, SnapshotType>()
		init {
			SnapshotType.values().forEach { codeMapping[it.name] = it }
		}
		@JvmStatic fun forValue(value: String): SnapshotType = codeMapping[value] ?: UNKNOWN
	}
}
