package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

enum class ChipsetType(
	val chipsetName: String,
) {
	I440FX("i440fx"),
	Q35("q35");

	companion object {
		private val findMap: MutableMap<String, ChipsetType> = ConcurrentHashMap<String, ChipsetType>()
		init {
			ChipsetType.values().forEach { findMap[it.chipsetName] = it }
		}
		@JvmStatic fun forValue(chipsetName: String): ChipsetType? = findMap[chipsetName]
		@JvmStatic fun fromMachineType(machineType: String): ChipsetType? {
			var defaultChipset: ChipsetType? = null

			for (element in machineType.split("-".toRegex()).dropLastWhile { it.isEmpty() }.toTypedArray()) {
				for (chipsetType in values()) {
					if (element.equals(chipsetType.chipsetName, ignoreCase = true)) {
						return chipsetType
					}
					if (element.equals("pc", ignoreCase = true)) {
						defaultChipset = I440FX
					}
				}
			}

			return defaultChipset
		}
	}
}
