package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

/**
 * [VmResumeBehavior]
 * 가상머신 시작 시 행위 유형
 *
 * @author 이찬희 (@chanhi2000)
 *
 * @see VmStorageErrorResumeBehaviour
 */
enum class VmResumeBehavior(

) {
	/**
	 * The virtual machine gets resumed automatically in the moment the storage is available
	 * again.
	 *
	 * This is the default for VMs which are not HA with a lease.
	 */
	auto_resume,
	/**
	 * Do nothing with the virtual machine.
	 */
	leave_paused,
	/**
	 * The virtual machine will be killed after a timeout (configurable on the hypervisor).
	 *
	 * This is the only option supported for highly available virtual machines
	 * with leases. The reason is that the highly available virtual machine is
	 * restarted using the infrastructure and any kind of resume risks
	 * split brains.
	 */
	kill;

	override fun toString(): String = this@VmResumeBehavior.code
	val code: String
		get() = this@VmResumeBehavior.name.uppercase()

	companion object {
		private val codeMapping: MutableMap<String, VmResumeBehavior> = ConcurrentHashMap<String, VmResumeBehavior>()

		init {
			VmResumeBehavior.values().forEach {
				codeMapping[it.code] = it
			}
		}

		val allVmResumeBehaviors: List<VmResumeBehavior> = VmResumeBehavior.values().toList()
		@JvmStatic fun forCode(value: String?): VmResumeBehavior = codeMapping[value?.uppercase() ?: auto_resume.code] ?: auto_resume
	}
}
