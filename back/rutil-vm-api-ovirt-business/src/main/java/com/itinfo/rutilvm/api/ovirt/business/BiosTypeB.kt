package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

enum class BiosTypeB(
	override val value: Int,
	val code: String,
	val chipset: ChipsetType?,
	val ovmf: Boolean,
): Identifiable {
	// CLUSTER_DEFAULT(-1, null, false),
	cluster_default(0, "CLUSTER_DEFAULT", null, false),
	i440fx_sea_bios(1, "I440FX_SEA_BIOS", ChipsetType.I440FX, false),
	q35_sea_bios(2, "Q35_SEA_BIOS", ChipsetType.Q35, false),
	q35_ovmf(3, "Q35_OVMF", ChipsetType.Q35, true),
	q35_secure_boot(4, "Q35_SECURE_BOOT", ChipsetType.Q35, true);

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
				codeMapping[it.code] = it
			}
		}
		@JvmStatic fun forValue(value: Int?): BiosTypeB = valueMapping[value] ?: cluster_default
		@JvmStatic fun forCode(code: String?): BiosTypeB = codeMapping[code?.uppercase() ?: "CLUSTER_DEFAULT"] ?: cluster_default
		val allBiosTypes: List<BiosTypeB> = BiosTypeB.values().toList().filter {
			it != cluster_default
		}
	}
}
