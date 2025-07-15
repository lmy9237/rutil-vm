package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

/**
 * [InterfaceStatus]
 * (호스트/NIC) 인터페이스 상태
 *
 * @author 이찬희 (@chanhi2000)
 */
enum class InterfaceStatus(
	override val value: Int
): Identifiable {
	none(0),
	up(1),
	down(2);

	override fun toString(): String = code
	val code: String
		get() = this@InterfaceStatus.name.uppercase()

	companion object {
		private val valueMapping: MutableMap<Int, InterfaceStatus> = ConcurrentHashMap<Int, InterfaceStatus>()
		private val codeMapping: MutableMap<String, InterfaceStatus> = ConcurrentHashMap<String, InterfaceStatus>()
		init {
			InterfaceStatus.values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}
		@JvmStatic fun forValue(value: Int?): InterfaceStatus = valueMapping[value ?: none.value] ?: none
		@JvmStatic fun forCode(code: String?): InterfaceStatus = codeMapping[code ?: none.code] ?: none
		val allInterfaceStatuses: List<InterfaceStatus> = InterfaceStatus.values().toList()
	}
}
