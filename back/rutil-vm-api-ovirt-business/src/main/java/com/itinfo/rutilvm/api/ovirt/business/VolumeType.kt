package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

/**
 * [VolumeType]
 * 스토리지 볼륨 유형
 *
 * @author 이찬희 (@chanhi2000)
 */
enum class VolumeType(
	override val value: Int,
): Identifiable {
	unassigned(0),
	preallocated(1),	// 사전 할당 ()
	sparse(2);			// 씬 프로비져닝 (Thin Provisioning)

	override fun toString(): String = code
	val code: String
		get() = this@VolumeType.name.uppercase()

	companion object {
		private val valueMapping: MutableMap<Int, VolumeType> = ConcurrentHashMap<Int, VolumeType>()
		private val codeMapping: MutableMap<String, VolumeType> = ConcurrentHashMap<String, VolumeType>()

		init {
			VolumeType.values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}

		@JvmStatic fun forValue(value: Int?): VolumeType? = valueMapping[value ?: unassigned.value] ?: unassigned
		@JvmStatic fun forCode(code: String?): VolumeType? = codeMapping[code ?: unassigned.code] ?: unassigned
		val allVolumeTypes: List<VolumeType> = VolumeType.values().toList()
	}
}
