package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

enum class ArchitectureType(
	override val value: Int,
	val family: ArchitectureType? = null,
): Identifiable {

	// Base architectures
	undefined(0),
	x86(4),	/* Guest architecture */
	ppc(3),	/* Guest architecture */
	s390x(7),	/* Host & Guest architecture */

	// Specific architectures
	x86_64(1, x86),	/* Host & Guest architecture */
	ppc64(2, ppc),	/* Host & Guest architecture */
	ppc64le(5, ppc),	/* Guest architecture */
	ppcle(6, ppc);	/* Guest architecture */

	override fun toString(): String = code
	val code: String
		get() = this@ArchitectureType.name.uppercase()

	val hotplugMemorySizeFactorMb: Int?
		get() = when (this) {
			x86 -> ArchitectureType.HOTPLUG_MEMORY_FACTOR_X86_MB
			ppc -> ArchitectureType.HOTPLUG_MEMORY_FACTOR_PPC_MB
			else -> family?.hotplugMemorySizeFactorMb
		}

	companion object {
		const val HOTPLUG_MEMORY_FACTOR_PPC_MB: Int = 256
		const val HOTPLUG_MEMORY_FACTOR_X86_MB: Int = 128
		private val valueMapping: MutableMap<Int, ArchitectureType> = ConcurrentHashMap<Int, ArchitectureType>()
		private val codeMapping: MutableMap<String, ArchitectureType> = ConcurrentHashMap<String, ArchitectureType>()
		init {
			values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}
		@JvmStatic fun forValue(value: Int?): ArchitectureType = valueMapping[value ?: undefined.value] ?: undefined
		@JvmStatic fun forCode(code: String?): ArchitectureType = codeMapping[code ?: undefined.code] ?: undefined
		val allArchitectureTypes: List<ArchitectureType> = ArchitectureType.values().toList()
		val necessaryArchitectureTypes: List<ArchitectureType> = ArchitectureType.values().filter {
			it == undefined ||
			it == x86_64 ||
			it == ppc64 ||
			it == s390x
		}
	}
}
