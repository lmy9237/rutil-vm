package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

/**
 * [DiskInterfaceB]
 * 디스크 인터페이스 유형
 *
 * @author 이찬희 (@chanhi2000)
 */
enum class DiskInterfaceB(
	val description: String
) {
	ide("IDE"),
	virtio_scsi("VirtIO_SCSI"),
	virtio("VirtIO"),
	spapr_vscsi("SPAPR_VSCSI"),
	sata("SATA");

	override fun toString(): String = code
	val code: String
		get() = this@DiskInterfaceB.name.uppercase()

	val localizationKey: String			get() = "${DiskInterfaceB::class.java.simpleName}.${this.name}"
	private val loc: Localization		get() = Localization.getInstance()
	val en: String						get() = loc.findLocalizedName4DiskInterface(this, "en")
	val kr: String						get() = loc.findLocalizedName4DiskInterface(this, "kr")

	companion object {
		private val codeMapping: MutableMap<String, DiskInterfaceB> = ConcurrentHashMap<String, DiskInterfaceB>()
		private val descriptionMapping: MutableMap<String, DiskInterfaceB> = ConcurrentHashMap<String, DiskInterfaceB>()

		init {
			values().forEach {
				codeMapping[it.code] = it
				codeMapping[it.name] = it
				descriptionMapping[it.description] = it
			}
		}
		@JvmStatic fun forCode(value: String?): DiskInterfaceB? = codeMapping[value ?: ide.code] ?: ide
		@JvmStatic fun forDescription(description: String?): DiskInterfaceB? = descriptionMapping[description ?: ide.description] ?: ide
		val allDiskInterfaces: List<DiskInterfaceB> = DiskInterfaceB.values().toList()
	}
}
