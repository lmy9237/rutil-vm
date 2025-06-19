package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

/**
 * [FirewallTypeB]
 * 방화벽 유형
 *
 * @author 이찬희 (@chanhi2000)
 */
enum class FirewallTypeB(
	override val value: Int
): Identifiable {
	iptables(0),
	firewalld(1);

	override fun toString(): String = code
	val code: String
		get() = this@FirewallTypeB.name.uppercase()

	val localizationKey: String
		get() = "${FirewallTypeB::class.java.simpleName}.${this.name}"

	companion object {
		private val valueMapping: MutableMap<Int, FirewallTypeB> = ConcurrentHashMap<Int, FirewallTypeB>()
		private val codeMapping: MutableMap<String, FirewallTypeB> = ConcurrentHashMap<String, FirewallTypeB>()
		init {
			FirewallTypeB.values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}
		@JvmStatic fun forValue(value: Int?): FirewallTypeB = valueMapping[value ?: firewalld.value] ?: firewalld
		@JvmStatic fun forCode(code: String?): FirewallTypeB = codeMapping[code ?: firewalld.code] ?: firewalld
		val allFireTypes: List<FirewallTypeB> = FirewallTypeB.values().toList()
	}
}
