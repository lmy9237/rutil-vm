package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

/**
 * [DisplayType]
 * 가상머신 디스플레이 유형
 *
 * @see VmDeviceType
 */
enum class DisplayType(
	val defaultVmDeviceType: VmDeviceType?,
) {
	cirrus(VmDeviceType.CIRRUS),
	qxl(VmDeviceType.QXL),
	vga(VmDeviceType.VGA),
	bochs(VmDeviceType.BOCHS),
	none(null); // For Headless VM, this type means that the VM will run without any display (VIDEO) device

	val value: Int
		get() = this@DisplayType.ordinal

	val localizationKey: String
		get() = "${DisplayType::class.java.simpleName}.${this.name}"

	private val loc: Localization
		get() = Localization.getInstance()
	val en: String
		get() = loc.findLocalizedName4DisplayType(this, "en")
	val kr: String
		get() = loc.findLocalizedName4DisplayType(this, "kr")

	companion object {
		private val valueMapping: MutableMap<Int, DisplayType> = ConcurrentHashMap<Int, DisplayType>()
		init {
			DisplayType.values().forEach { valueMapping[it.value] = it }
		}
		@JvmStatic fun forValue(value: Int): DisplayType = valueMapping[value] ?: none

		val allDisplayTypes: List<DisplayType> = DisplayType.values().toList()
	}
}
