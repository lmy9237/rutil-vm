package com.itinfo.rutilvm.api.ovirt.business

import java.io.Serializable
import java.util.concurrent.ConcurrentHashMap

enum class OriginType(
	override val value: Int,
): Identifiable, Serializable {
	rhev(0),
	vmware(1),
	xen(2),
	ovirt(3),
	// VMs that externally run on the host (not created by the engine)
	`external`(4),
	// VMs that were created by the hosted engine setup
	hosted_engine(5),
	// managed means we allow limited provisioning on this VM by the engine
	managed_hosted_engine(6),
	kvm(7),
	physical_machine(8),
	hyperv(9),
	kubevirt(10);

	override fun toString(): String = code
	val code: String
		get() = this@OriginType.name.uppercase()

	companion object {
		private val valueMapping: MutableMap<Int, OriginType> = ConcurrentHashMap<Int, OriginType>()
		private val codeMapping: MutableMap<String, OriginType> = ConcurrentHashMap<String, OriginType>()

		init {
			values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}
		@JvmStatic fun forValue(value: Int?): OriginType = valueMapping[value ?: ovirt.value] ?: ovirt
		@JvmStatic fun forCode(value: String?): OriginType = codeMapping[value ?: ovirt.code] ?: ovirt
	}
}
