package com.itinfo.rutilvm.api.ovirt.business

import java.io.Serializable
import java.util.concurrent.ConcurrentHashMap

enum class OriginType(
	override val value: Int,
	val code: String,
): Identifiable, Serializable {
	RHEV(0, "RHEV"),
	VMWARE(1, "VMWARE"),
	XEN(2, "XEN"),
	OVIRT(3, "OVIRT"),
	// VMs that externally run on the host (not created by the engine)
	EXTERNAL(4, "EXTERNAL"),
	// VMs that were created by the hosted engine setup
	HOSTED_ENGINE(5, "HOSTED_ENGINE"),
	// managed means we allow limited provisioning on this VM by the engine
	MANAGED_HOSTED_ENGINE(6, "MANAGED_HOSTED_ENGINE"),
	KVM(7, "KVM"),
	PHYSICAL_MACHINE(8, "PHYSICAL_MACHINE"),
	HYPERV(9, "HYPERV"),
	KUBEVIRT(10, "KUBEVIRT");

	val label: String
		get() = this@OriginType.name.lowercase()

	companion object {
		private val valueMapping: MutableMap<Int, OriginType> = ConcurrentHashMap<Int, OriginType>()
		private val codeMapping: MutableMap<String, OriginType> = ConcurrentHashMap<String, OriginType>()

		init {
			values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
			}
		}
		@JvmStatic fun forValue(value: Int?): OriginType = valueMapping[value ?: 3] ?: OVIRT
		@JvmStatic fun forCode(value: String?): OriginType = codeMapping[value?.uppercase() ?: "OVIRT"] ?: OVIRT
	}
}
