package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

enum class CpuPinningPolicyB(
	override val value: Int,
): Identifiable {
	NONE(0),
	MANUAL(1),
	RESIZE_AND_PIN_NUMA(2),
	DEDICATED(3),
	ISOLATE_THREADS(4);

	val isExclusive: Boolean
		get() = this@CpuPinningPolicyB == DEDICATED ||
			this@CpuPinningPolicyB == ISOLATE_THREADS

	companion object {
		private val valueMapping: MutableMap<Int, CpuPinningPolicyB> = ConcurrentHashMap<Int, CpuPinningPolicyB>()
		private val codeMapping: MutableMap<String, CpuPinningPolicyB> = ConcurrentHashMap<String, CpuPinningPolicyB>()

		init {
			CpuPinningPolicyB.values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.name.lowercase()] = it
			}
		}

		val allCpuPinningPolicies: List<CpuPinningPolicyB> = CpuPinningPolicyB.values().toList()
		@JvmStatic fun forValue(value: Int? = 0): CpuPinningPolicyB = valueMapping[value] ?: NONE
		@JvmStatic fun forCode(value: String?): CpuPinningPolicyB = codeMapping[value?.lowercase() ?: "none"] ?: NONE
		@JvmStatic fun compare(one: CpuPinningPolicyB, another: CpuPinningPolicyB): Int {
			if (one == another) return 0

			if (one == NONE) 		return -1
			if (another == NONE)	return 1

			// both not none
			if (one == MANUAL)		return 1
			if (another == MANUAL) 	return -1;

			// not none, not manual
			if (one == RESIZE_AND_PIN_NUMA) return 1 // automatically vm2 is exclusive
			if (another == RESIZE_AND_PIN_NUMA) return -1 // automatically vm1 is exclusive

			if (one == ISOLATE_THREADS) return 1

			// vm1 is dedicated and vm2 is isolate-threads
			return -1;
		}
	}
}
