package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

/**
 * [DisplayTypeB]
 * 가상머신 디스플레이 유형
 *
 * @see VmDeviceType
 */
enum class DisplayTypeB(
	val defaultVmDeviceType: VmDeviceType?,
) {
	cirrus(VmDeviceType.CIRRUS),
	qxl(VmDeviceType.QXL),
	vga(VmDeviceType.VGA),
	bochs(VmDeviceType.BOCHS),
	none(null); // For Headless VM, this type means that the VM will run without any display (VIDEO) device

	override fun toString(): String = code
	val code: String
		get() = this@DisplayTypeB.name.uppercase()
	val value: Int
		get() = this@DisplayTypeB.ordinal

	val localizationKey: String		get() = "${DisplayTypeB::class.java.simpleName}.${this.name}"
	private val loc: Localization	get() = Localization.getInstance()
	val en: String					get() = loc.findLocalizedName4DisplayType(this, "en")
	val kr: String					get() = loc.findLocalizedName4DisplayType(this, "kr")

	companion object {
		private val valueMapping: MutableMap<Int, DisplayTypeB> = ConcurrentHashMap<Int, DisplayTypeB>()
		private val codeMapping: MutableMap<String, DisplayTypeB> = ConcurrentHashMap<String, DisplayTypeB>()
		init {
			DisplayTypeB.values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}
		@JvmStatic fun forValue(value: Int?): DisplayTypeB = valueMapping[value ?: -1] ?: none
		@JvmStatic fun forCode(code: String?): DisplayTypeB = codeMapping[code ?: none.code] ?: none
		val allDisplayTypes: List<DisplayTypeB> = DisplayTypeB.values().toList()
	}
}
