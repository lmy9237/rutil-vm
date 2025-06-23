package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

enum class CpuPinningPolicyB(
	override val value: Int,
): Identifiable {
	none(0),
	manual(1),
	resize_and_pin_numa(2),
	dedicated(3),
	isolate_threads(4);

	override fun toString(): String = code
	val code: String
		get() = this@CpuPinningPolicyB.name.uppercase()

	val isExclusive: Boolean
		get() = this@CpuPinningPolicyB == dedicated ||
			this@CpuPinningPolicyB == isolate_threads

	private val loc: Localization
		get() = Localization.getInstance()
	val localizationKey: String
		get() = "${CpuPinningPolicyB::class.java.simpleName}.${this.name}"
	val kr: String
		get() = loc.findLocalizedName4CpuPinningPolicy(this, "kr")
	val en: String
		get() = loc.findLocalizedName4CpuPinningPolicy(this, "en")

	companion object {
		private val valueMapping: MutableMap<Int, CpuPinningPolicyB> = ConcurrentHashMap<Int, CpuPinningPolicyB>()
		private val codeMapping: MutableMap<String, CpuPinningPolicyB> = ConcurrentHashMap<String, CpuPinningPolicyB>()

		init {
			CpuPinningPolicyB.values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
			}
		}

		val allCpuPinningPolicies: List<CpuPinningPolicyB> = CpuPinningPolicyB.values().toList()
		@JvmStatic fun forValue(value: Int? = 0): CpuPinningPolicyB = valueMapping[value] ?: none
		@JvmStatic fun forCode(value: String?): CpuPinningPolicyB = codeMapping[value?.uppercase() ?: none.code] ?: none
		@JvmStatic fun compare(one: CpuPinningPolicyB, another: CpuPinningPolicyB): Int {
			if (one == another) 	return 0

			if (one == none) 		return -1
			if (another == none)	return 1

			// both not none
			if (one == manual)		return 1
			if (another == manual) 	return -1;

			// not none, not manual
			if (one == resize_and_pin_numa) return 1 // automatically vm2 is exclusive
			if (another == resize_and_pin_numa) return -1 // automatically vm1 is exclusive

			if (one == isolate_threads) return 1

			// vm1 is dedicated and vm2 is isolate-threads
			return -1;
		}
	}
}
