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
	disabled(1),
	enabled_native(2);

	override fun toString(): String = code
	val code: String
		get() = this@UsbPolicy.name.uppercase()

	val isEnabled: Boolean
		get() = this@UsbPolicy !== disabled

	companion object {
		private val valueMapping: MutableMap<Int, UsbPolicy> = ConcurrentHashMap<Int, UsbPolicy>()
		private val codeMapping: MutableMap<String, UsbPolicy> = ConcurrentHashMap<String, UsbPolicy>()

		const val PRE_3_1_ENABLED: String = "Enabled"
		const val PRE_3_1_DISABLED: String = "Disabled"
		const val PRE_4_1_ENABLED_LEGACY: String = "ENABLED_LEGACY"

		init {
			UsbPolicy.values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}
		val allUsbPolicies: List<UsbPolicy> = UsbPolicy.values().toList()

		@JvmStatic fun forValue(value: Int?): UsbPolicy = valueMapping[value ?: disabled.value] ?: disabled
		@JvmStatic fun forCode(value: String?): UsbPolicy? = codeMapping[value ?: disabled.code] ?: disabled
		@JvmStatic fun forStringValue(value: String?): UsbPolicy? {
			var retVal: UsbPolicy? = null

			if (value.equals(PRE_3_1_ENABLED, ignoreCase = true) ||
				PRE_4_1_ENABLED_LEGACY.equals(value, ignoreCase = true) ||
				value.equals(enabled_native.name, ignoreCase = true)
			) {
				retVal = enabled_native
			} else if (
				value.equals(PRE_3_1_DISABLED, ignoreCase = true) ||
				value.equals(disabled.name, ignoreCase = true)
			) {
				retVal = disabled
			}
			return retVal
		}
	}
}
