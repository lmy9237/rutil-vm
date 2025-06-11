package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

/**
 * [VmType]
 * 가상머신 유형 (a.k.a. 최적화 옵션)
 *
 * @author 이찬희 (@chanhi2000)
 */
enum class VmType(
	override val value: Int,
): Identifiable {
	Desktop(0),
	Server(1),
	HighPerformance(2);

	val localizationKey: String
		get() = "${VmType::class.java.simpleName}.${this.name}"

	private val loc: Localization
		get() = Localization.getInstance()
	val en: String
		get() = loc.findLocalizedName4VmType(this, "en")
	val kr: String
		get() = loc.findLocalizedName4VmType(this, "kr")
	companion object {
		private val findMap: MutableMap<Int, VmType> = ConcurrentHashMap<Int, VmType>()
		init {
			VmType.values().forEach { findMap[it.value] = it }
		}
		@JvmStatic fun forValue(value: Int?): VmType? = findMap[value]
		val allVmTypes: List<VmType> = VmType.values().toList()
	}
}
