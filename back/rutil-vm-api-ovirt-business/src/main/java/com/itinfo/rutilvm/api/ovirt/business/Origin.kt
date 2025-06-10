package com.itinfo.rutilvm.api.ovirt.business

import java.io.Serializable
import java.util.concurrent.ConcurrentHashMap

enum class Origin(
	override val value: Int,
	val description: String,
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
		get() = this@Origin.name.lowercase()

	companion object {
		private val valueMapping: MutableMap<Int, Origin> = ConcurrentHashMap<Int, Origin>()
		private val descriptionMapping: MutableMap<String, Origin> = ConcurrentHashMap<String, Origin>()

		init {
			values().forEach { valueMapping[it.value] = it }
		}


		@JvmStatic fun forValue(value: Int?=-1): Origin = valueMapping[value] ?: OVIRT
		@JvmStatic fun forDescription(value: String="OVIRT"): Origin = descriptionMapping[value] ?: OVIRT

	}
}
