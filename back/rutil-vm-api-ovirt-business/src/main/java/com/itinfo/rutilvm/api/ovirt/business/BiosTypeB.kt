package com.itinfo.rutilvm.api.ovirt.business

import java.io.Serializable
import java.util.concurrent.ConcurrentHashMap

enum class BiosTypeB(
	override val value: Int,
	val chipset: ChipsetType?,
	val ovmf: Boolean,
): Identifiable, Serializable {
	// CLUSTER_DEFAULT(-1, null, false),
	cluster_default(0,  null, false),
	i440fx_sea_bios(1,  ChipsetType.i440fx, false),
	q35_sea_bios(2,  ChipsetType.q35, false),
	q35_ovmf(3,  ChipsetType.q35, true),
	q35_secure_boot(4, ChipsetType.q35, true);

	override fun toString(): String = code
	val code: String
		get() = this@BiosTypeB.name.uppercase()

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
				codeMapping[it.name] = it
			}
		}
		@JvmStatic fun forValue(value: Int?): BiosTypeB = valueMapping[value ?: cluster_default.value] ?: cluster_default
		@JvmStatic fun forCode(code: String?): BiosTypeB = codeMapping[code ?: cluster_default.code] ?: cluster_default
		val allBiosTypes: List<BiosTypeB> = BiosTypeB.values().toList().filter {
			it != cluster_default
		}
	}
}
