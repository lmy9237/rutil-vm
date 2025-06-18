package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

enum class ChipsetType(
) {
	i440fx,
	q35;

	override fun toString(): String = code
	val code: String
		get() = this@ChipsetType.name.uppercase()

	companion object {
		private val codeMapping: MutableMap<String, ChipsetType> = ConcurrentHashMap<String, ChipsetType>()
		init {
			ChipsetType.values().forEach {
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}
		@JvmStatic fun forCode(code: String): ChipsetType? = codeMapping[code]
		@JvmStatic fun fromMachineType(machineType: String): ChipsetType? {
			var defaultChipset: ChipsetType? = null

			for (element in machineType.split("-".toRegex()).dropLastWhile { it.isEmpty() }.toTypedArray()) {
				for (chipsetType in values()) {
					if (element.equals(chipsetType.code, ignoreCase = true)) {
						return chipsetType
					}
					if (element.equals("pc", ignoreCase = true)) {
						defaultChipset = i440fx
					}
				}
			}

			return defaultChipset
		}
	}
}
