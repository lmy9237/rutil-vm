package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

private val loc: Localization
	get() = Localization.getInstance()

	/**
 * [VolumeType]
 * 디스크 볼륨 유형 (할당정책과 관련있음)
 *
 * @author chanhi2000
 */
enum class VolumeType(
	override val value: Int,
	val description: String,
): Identifiable {
	Unassigned(0, ""),
	Preallocated(1, ""),	// 사전 할당 ()
	Sparse(2, "");			// 씬 프로비져닝 (Thin Provisioning)

	companion object {
		private val findMap: MutableMap<Int, VolumeType> = ConcurrentHashMap<Int, VolumeType>()
		init {
			VolumeType.values().forEach { findMap[it.value] = it }
		}
		@JvmStatic fun forValue(value: Int?=null): VolumeType? = findMap[value] ?: Unassigned
	}
}
