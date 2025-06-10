package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

enum class VolumeType(
	override val value: Int,
	val description: String,
): Identifiable {
	Unassigned(0, "Unassigned"),
	Preallocated(1, "Preallocated"),	// 사전 할당 ()
	Sparse(2, "Sparse");			// 씬 프로비져닝 (Thin Provisioning)

	companion object {
		private val valueMapping: MutableMap<Int, VolumeType> = ConcurrentHashMap<Int, VolumeType>()
		private val descriptionMapping: MutableMap<String, VolumeType> = ConcurrentHashMap<String, VolumeType>()

		init {
			VolumeType.values().forEach {
				valueMapping[it.value] = it
				descriptionMapping[it.description.lowercase()] = it
			}
		}

		val allVolumeTypes: List<VolumeType> = VolumeType.values().filterNot {
			it == VolumeType.Unassigned
		}

		@JvmStatic fun forValue(value: Int? = -1): VolumeType = valueMapping[value] ?: VolumeType.Unassigned
		@JvmStatic fun forDescription(value: String = "Unassigned"): VolumeType = descriptionMapping[value.lowercase()] ?: VolumeType.Unassigned
	}
}
