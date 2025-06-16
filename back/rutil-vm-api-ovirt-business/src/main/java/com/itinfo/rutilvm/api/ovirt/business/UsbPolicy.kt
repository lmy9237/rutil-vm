package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

/**
 * [UsbPolicy]
 * USB 정책
 *
 * @author 이찬희 (@chanhi2000)
 */
enum class UsbPolicy(
	override val value: Int,
): Identifiable {
	DISABLED(1),
	ENABLED_NATIVE(2);

	val isEnabled: Boolean
		get() = this@UsbPolicy !== DISABLED

	companion object {
		private val valueMapping: MutableMap<Int, UsbPolicy> = ConcurrentHashMap<Int, UsbPolicy>()
		private val codeMapping: MutableMap<String, UsbPolicy> = ConcurrentHashMap<String, UsbPolicy>()

		const val PRE_3_1_ENABLED: String = "Enabled"
		const val PRE_3_1_DISABLED: String = "Disabled"
		const val PRE_4_1_ENABLED_LEGACY: String = "ENABLED_LEGACY"

		init {
			UsbPolicy.values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.name.lowercase()] = it
			}
		}
		val allUsbPolicies: List<UsbPolicy> = UsbPolicy.values().toList()

		@JvmStatic fun forValue(value: Int? = 1): UsbPolicy = valueMapping[value] ?: DISABLED
		@JvmStatic fun forCode(value: String? = "disabled"): UsbPolicy? = codeMapping[value?.lowercase() ?: "disabled"] ?: DISABLED
		@JvmStatic fun forStringValue(value: String? = "disabled"): UsbPolicy? {
			var retVal: UsbPolicy? = null

			if (value.equals(PRE_3_1_ENABLED, ignoreCase = true) ||
				PRE_4_1_ENABLED_LEGACY.equals(value, ignoreCase = true) ||
				value.equals(ENABLED_NATIVE.name, ignoreCase = true)
			) {
				retVal = ENABLED_NATIVE
			} else if (
				value.equals(PRE_3_1_DISABLED, ignoreCase = true) ||
				value.equals(DISABLED.name, ignoreCase = true)
			) {
				retVal = DISABLED
			}
			return retVal
		}
	}
}
