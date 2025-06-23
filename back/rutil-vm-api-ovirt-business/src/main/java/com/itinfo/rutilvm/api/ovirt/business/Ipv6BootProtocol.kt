package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

/**
 * [Ipv6BootProtocol]
 * ipV6 부트 프로토콜 유형
 *
 * @author 이찬희 (@chanhi2000)
 */
enum class Ipv6BootProtocol(
	override val value: Int
): Identifiable {
	none(0),
	dhcp(1),
	autoconf(2),
	poly_dhcp_autoconf(3),
	static(4);

	override fun toString(): String = code
	val code: String
		get() = this@Ipv6BootProtocol.name.uppercase()

	companion object {
		private val valueMapping: MutableMap<Int, Ipv6BootProtocol> = ConcurrentHashMap<Int, Ipv6BootProtocol>()
		private val codeMapping: MutableMap<String, Ipv6BootProtocol> = ConcurrentHashMap<String, Ipv6BootProtocol>()
		init {
			values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}
		@JvmStatic fun forValue(value: Int?): Ipv6BootProtocol? = valueMapping[value ?: none.code] ?: none
		@JvmStatic fun forCode(code: String?): Ipv6BootProtocol? = codeMapping[code ?: none.code] ?: none
	}
}
