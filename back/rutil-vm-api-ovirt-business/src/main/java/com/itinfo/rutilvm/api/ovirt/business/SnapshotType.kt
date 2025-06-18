package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

enum class SnapshotType(
) {
	regular,
	active,
	stateless,
	preview,
	next_run,
	unknown;

	override fun toString(): String = code
	val code: String
		get() = this@SnapshotType.name.uppercase()

	companion object {
		private val codeMapping: MutableMap<String, SnapshotType> = ConcurrentHashMap<String, SnapshotType>()
		init {
			SnapshotType.values().forEach {
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}
		@JvmStatic fun forCode(value: String?): SnapshotType = codeMapping[value ?: unknown.code] ?: unknown
	}
}
