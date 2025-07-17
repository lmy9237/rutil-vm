package com.itinfo.rutilvm.api.ovirt.business

import java.io.Serializable
import java.util.concurrent.ConcurrentHashMap

/**
 * [VolumeFormat]
 * 디스크 볼륨 포멧
 *
 * @author 이찬희 (@chanhi2000)
 */
enum class VolumeFormat(
	override val value: Int
): Identifiable, Serializable {
	unused0(0), unused1(1), unused(2),
	unassigned(3),
	cow(4),
	raw(5);

	override fun toString(): String = this@VolumeFormat.code
	val code: String
		get() = this@VolumeFormat.name.lowercase()


	companion object {
		private val valueMapping: MutableMap<Int, VolumeFormat> = ConcurrentHashMap<Int, VolumeFormat>()
		private val codeMapping: MutableMap<String, VolumeFormat> = ConcurrentHashMap<String, VolumeFormat>()

		init {
			VolumeFormat.values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}

		@JvmStatic fun forValue(value: Int?): VolumeFormat? = valueMapping[value ?: unassigned.value] ?: unassigned
		@JvmStatic fun forCode(code: String?): VolumeFormat? = codeMapping[code ?: unassigned.code] ?: unassigned
		val allVolumeFormats: List<VolumeFormat> = VolumeFormat.values().toList()
	}

}
