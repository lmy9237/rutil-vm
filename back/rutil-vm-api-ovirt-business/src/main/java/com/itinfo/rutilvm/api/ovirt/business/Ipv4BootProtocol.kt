package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

/**
 * [Ipv4BootProtocol]
 * Ipv4 부트 프로토콜 유형
 *
 * @author 이찬희 (@chanhi2000)
 */
enum class Ipv4BootProtocol(
	override val value: Int
): Identifiable {
	none(0),
	dhcp(1),
	static(2);

	override fun toString(): String = code
	val code: String
		get() = this@Ipv4BootProtocol.name.uppercase()

	companion object {
		private val valueMapping: MutableMap<Int, Ipv4BootProtocol> = ConcurrentHashMap<Int, Ipv4BootProtocol>()
		private val codeMapping: MutableMap<String, Ipv4BootProtocol> = ConcurrentHashMap<String, Ipv4BootProtocol>()
		init {
			values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}
		@JvmStatic fun forValue(value: Int?): Ipv4BootProtocol? = valueMapping[value ?: none.code] ?: none
		@JvmStatic fun forCode(code: String?): Ipv4BootProtocol? = codeMapping[code ?: none.code] ?: none
	}
}
