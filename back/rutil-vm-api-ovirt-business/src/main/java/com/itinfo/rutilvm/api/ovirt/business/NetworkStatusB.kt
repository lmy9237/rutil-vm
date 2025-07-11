package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

/**
 * [NetworkStatusB]
 * 네트워크 상태
 *
 * @author 이찬희 (@chanhi2000)
 */
enum class NetworkStatusB(
	override val value: Int
): Identifiable {
	non_operational(0),
	operational(1);

	override fun toString(): String = code
	val code: String					get() = this@NetworkStatusB.name.uppercase()

	val localizationKey: String			get() = "${NetworkStatusB::class.java.simpleName}.${this.name}"
	private val loc: Localization		get() = Localization.getInstance()
	val en: String						get() = loc.findLocalizedName4NetworkStatus(this, "en")
	val kr: String						get() = loc.findLocalizedName4NetworkStatus(this, "kr")

	companion object {
		private val valueMapping: MutableMap<Int, NetworkStatusB> = ConcurrentHashMap<Int, NetworkStatusB>()
		private val codeMapping: MutableMap<String, NetworkStatusB> = ConcurrentHashMap<String, NetworkStatusB>()

		init {
			values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}
		@JvmStatic fun forValue(value: Int?): NetworkStatusB = valueMapping[value ?: non_operational.value] ?: non_operational
		@JvmStatic fun forCode(value: String?): NetworkStatusB = codeMapping[value ?: non_operational.code] ?: non_operational
		val allNetworkStatuses: List<NetworkStatusB> = NetworkStatusB.values().filterNot {
			it == non_operational
		}
	}
}
