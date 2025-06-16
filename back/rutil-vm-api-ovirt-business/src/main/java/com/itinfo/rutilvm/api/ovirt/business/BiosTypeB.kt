package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

enum class BiosTypeB(
	override val value: Int,
	val chipset: ChipsetType?,
	val ovmf: Boolean,
): Identifiable {
	UNKNOWN(-1, null, false),
	I440FX_SEA_BIOS(1, ChipsetType.I440FX, false),
	Q35_SEA_BIOS(2, ChipsetType.Q35, false),
	Q35_OVMF(3, ChipsetType.Q35, true),
	Q35_SECURE_BOOT(4, ChipsetType.Q35, true);

	val localizationKey: String
		get() = "${BiosTypeB::class.java.simpleName}.${this.name}"

	private val loc: Localization
		get() = Localization.getInstance()
	val en: String
		get() = loc.findLocalizedName4BiosType(this, "en")
	val kr: String
		get() = loc.findLocalizedName4BiosType(this,"kr")

	companion object {
		private val valueMapping: MutableMap<Int, BiosTypeB> = ConcurrentHashMap<Int, BiosTypeB>()
		private val codeMapping: MutableMap<String, BiosTypeB> = ConcurrentHashMap<String, BiosTypeB>()
		init {
			BiosTypeB.values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.name] = it
			}
		}
		@JvmStatic fun forValue(value: Int?): BiosTypeB = valueMapping[value] ?: UNKNOWN
		@JvmStatic fun forCode(code: String?): BiosTypeB = codeMapping[code?.uppercase() ?: "UNKNOWN"] ?: UNKNOWN
		val allBiosTypes: List<BiosTypeB> = BiosTypeB.values().toList().filter {
			it != UNKNOWN
		}
	}
}
