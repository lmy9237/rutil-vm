package com.itinfo.rutilvm.api.ovirt.business

import java.io.Serializable
import java.util.concurrent.ConcurrentHashMap

/**
 * [VmInterfaceType]
 * NIC 유형
 *
 * @author 이찬희 (@chanhi2000)
 */
enum class VmInterfaceType(
	override val value: Int,
	val description: String,
	val internalName: String,
	val speed: Int,
): Identifiable, Serializable {
	@Deprecated("This needs to cleaned up. We are leaving it in place to support import of VMs created using previous versions.")
	rtl8139_virtio(0, "Dual mode rtl8139, VirtIO", "rtl8139_pv", 1000),
	rtl8139(1, "rtl8139", "rtl8139", 100),
	e1000(2, "e1000", "e1000", 1000),
	virtio(3, "VirtIO", "pv", 10000),
	spapr_vlan(4, "sPAPR VLAN", "spapr-vlan", 1000),
	pci_passthrough(5, "PCI Passthrough", "pci-passthorugh", 1000),
	e1000e(6, "e1000e", "e1000e", 1000);

	val localizationKey: String				get() = "${VmInterfaceType::class.java.simpleName}.${this.name}"
	private val loc: Localization			get() = Localization.getInstance()
	/*val en: String							get() = loc.findLocalizedName4VmInterfaceType(this, "en")
	val kr: String							get() = loc.findLocalizedName4VmInterfaceType(this, "kr")*/

	override fun toString(): String = code
	val code: String
		get() = this@VmInterfaceType.name.uppercase()

	companion object {
		private val valueMapping: MutableMap<Int, VmInterfaceType> = ConcurrentHashMap<Int, VmInterfaceType>()
		private val codeMapping: MutableMap<String, VmInterfaceType> = ConcurrentHashMap<String, VmInterfaceType>()
		init {
			values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}
		@JvmStatic fun forValue(value: Int?): VmInterfaceType = valueMapping[value ?: virtio.code] ?: virtio
		@JvmStatic fun forCode(code: String?): VmInterfaceType = codeMapping[code ?: virtio.code] ?: virtio
		val allVmInterfaceTypes: List<VmInterfaceType> = VmInterfaceType.values().toList()
	}
}
