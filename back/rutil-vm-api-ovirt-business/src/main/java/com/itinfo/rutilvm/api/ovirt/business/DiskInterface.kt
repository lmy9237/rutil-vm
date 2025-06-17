package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

/**
 * [DiskInterface]
 * 디스크 인터페이스 유형
 *
 * @author 이찬희 (@chanhi2000)
 */
enum class DiskInterface(
) {
	IDE,
	VirtIO_SCSI,
	VirtIO,
	SPAPR_VSCSI,
	SATA;

	val localizationKey: String
		get() = "${DiskInterface::class.java.simpleName}.${this.name}"
	private val loc: Localization
		get() = Localization.getInstance()
	val en: String
		get() = loc.findLocalizedName4DiskInterface(this, "en")
	val kr: String
		get() = loc.findLocalizedName4DiskInterface(this, "kr")

	companion object {
		private val codeMapping: MutableMap<String, DiskInterface> = ConcurrentHashMap<String, DiskInterface>()

		init {
			values().forEach {
				codeMapping[it.name.lowercase()] = it
			}
		}

		val allDiskInterfaces: List<DiskInterface> = DiskInterface.values().toList()

		@JvmStatic fun forCode(value: String? = "IDE"): DiskInterface? = codeMapping[value?.lowercase() ?: "IDE"]
	}
}
