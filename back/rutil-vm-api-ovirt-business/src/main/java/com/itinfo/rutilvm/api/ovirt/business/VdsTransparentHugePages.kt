package com.itinfo.rutilvm.api.ovirt.business

import java.io.Serializable
import java.util.concurrent.ConcurrentHashMap

/**
 * [VdsTransparentHugePages]
 * 호스트 ?
 *
 * @author 이찬희 (@chanhi2000)
 */
enum class VdsTransparentHugePages(
	override val value: Int,
): Identifiable, Serializable {
	never(0),
	madvise(1),
	always(2);

	val isEnabled: Boolean
		get() = this@VdsTransparentHugePages != never

	override fun toString(): String = code
	val code: String
		get() = this@VdsTransparentHugePages.name.uppercase()

	val localizationKey: String
		get() = "${VdsTransparentHugePages::class.java.simpleName}.${this.name}"
	private val loc: Localization
		get() = Localization.getInstance()
	/*val en: String
		get() = loc.findLocalizedName4VdsTransparentHugePages(this, "en")
	val kr: String
		get() = loc.findLocalizedName4VdsTransparentHugePages(this, "kr")*/

	companion object {
		private val valueMapping: MutableMap<Int, VdsTransparentHugePages> = ConcurrentHashMap<Int, VdsTransparentHugePages>()
		private val codeMapping: MutableMap<String, VdsTransparentHugePages> = ConcurrentHashMap<String, VdsTransparentHugePages>()
		init {
			VdsTransparentHugePages.values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}
		@JvmStatic fun forValue(value: Int?): VdsTransparentHugePages = valueMapping[value ?: never.value] ?: never
		@JvmStatic fun forCode(code: String?): VdsTransparentHugePages = codeMapping[code ?: never.code] ?: never
	}
}
