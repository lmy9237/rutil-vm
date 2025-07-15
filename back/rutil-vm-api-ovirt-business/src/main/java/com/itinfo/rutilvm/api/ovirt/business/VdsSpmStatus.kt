package com.itinfo.rutilvm.api.ovirt.business

import java.io.Serializable
import java.util.concurrent.ConcurrentHashMap

/**
 * [VdsSpmStatus]
 * 호스트 SPM 상태
 *
 * @author 이찬희 (@chanhi2000)
 */
enum class VdsSpmStatus(
	override val value: Int
): Identifiable, Serializable {
	none(0),
	contending(1),
	spm(2);

	override fun toString(): String = code
	val code: String
		get() = this@VdsSpmStatus.name.uppercase()

	val localizationKey: String			get() = "${VdsSpmStatus::class.java.simpleName}.${this.name}"
	private val loc: Localization		get() = Localization.getInstance()
	val en: String						get() = loc.findLocalizedName4VdsSpmStatus(this, "en")
	val kr: String						get() = loc.findLocalizedName4VdsSpmStatus(this, "kr")

	companion object {
		private val valueMapping: MutableMap<Int, VdsSpmStatus> = ConcurrentHashMap<Int, VdsSpmStatus>()
		private val codeMapping: MutableMap<String, VdsSpmStatus> = ConcurrentHashMap<String, VdsSpmStatus>()
		init {
			VdsSpmStatus.values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}
		@JvmStatic fun forValue(value: Int?): VdsSpmStatus = valueMapping[value ?: none.value] ?: none
		@JvmStatic fun forCode(code: String?): VdsSpmStatus = codeMapping[code ?: none.code] ?: none
	}
}
