package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

/**
 * [ImageTransferType]
 * 디스크 이미지 전송 방향 유형
 *
 * @author 이찬희 (@chanhi2000)
 */
enum class ImageTransferType(
	override val value: Int,
	val description: String,
): Identifiable {
	unknown(0, "unknown"),
	download(1, "read"),
	upload(2, "write");

	override fun toString(): String = code
	val code: String
		get() = this@ImageTransferType.name.uppercase()

	val localizationKey: String		get() = "${ImageTransferType::class.java.simpleName}.${this.name}"
	private val loc: Localization	get() = Localization.getInstance()
	val en: String					get() = loc.findLocalizedName4ImageTransferType(this, "en")
	val kr: String					get() = loc.findLocalizedName4ImageTransferType(this, "kr")

	companion object {
		private val valueMapping: MutableMap<Int, ImageTransferType> = ConcurrentHashMap<Int, ImageTransferType>()
		private val codeMapping: MutableMap<String, ImageTransferType> = ConcurrentHashMap<String, ImageTransferType>()
		init {
			ImageTransferType.values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}
		@JvmStatic fun forValue(value: Int?): ImageTransferType = valueMapping[value ?: unknown.value] ?: unknown
		@JvmStatic fun forCode(code: String?): ImageTransferType = codeMapping[code ?: unknown.code] ?: unknown
		val alImageTransferTypes: List<ImageTransferType> = ImageTransferType.values().toList()
	}

}
