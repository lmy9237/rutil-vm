package com.itinfo.rutilvm.api.ovirt.business

import com.itinfo.rutilvm.api.ovirt.business.ArchitectureType.undefined
import com.itinfo.rutilvm.api.ovirt.business.Localization.Companion.BiosTypeL
import java.util.concurrent.ConcurrentHashMap

enum class BiosType(
	override val value: Int,
	val chipset: ChipsetType,
	val ovmf: Boolean,
): Identifiable {
	I440FX_SEA_BIOS(1, ChipsetType.I440FX, false),
	Q35_SEA_BIOS(2, ChipsetType.Q35, false),
	Q35_OVMF(3, ChipsetType.Q35, true),
	Q35_SECURE_BOOT(4, ChipsetType.Q35, true);

	val localizationKey: String
		get() = "${BiosType::class.java.simpleName}.${this.name}"

	private val loc: Localization
		get() = Localization.getInstance()
	val en: String
		get() = loc.findLocalizedName4BiosType(this, "en")
	val kr: String
		get() = loc.findLocalizedName4BiosType(this,"kr")

	companion object {
		private val findMap: MutableMap<Int, BiosType> = ConcurrentHashMap<Int, BiosType>()
		init {
			BiosType.values().forEach { findMap[it.value] = it }
		}
		@JvmStatic fun forValue(value: Int): BiosType? = findMap[value]
		val allBiosTypes: List<BiosType> = BiosType.values().toList()
	}
}
