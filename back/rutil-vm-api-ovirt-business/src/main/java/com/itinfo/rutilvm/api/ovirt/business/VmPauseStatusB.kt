package com.itinfo.rutilvm.api.ovirt.business

import java.io.Serializable
import java.util.concurrent.ConcurrentHashMap

/**
 * [VmPauseStatusB]
 * 가상머신 일시중지 상태
 */
enum class VmPauseStatusB(
	override val value: Int,
	val error: Boolean,
): Identifiable, Serializable {
	none(0, false),
	eother(1, true),
	eio(2, true),
	enospc(3, true),
	eperm(4, true),
	noerr(5, false),
	postcopy(6, false);

	override fun toString(): String = this@VmPauseStatusB.code
	val code: String
		get() = this@VmPauseStatusB.name.lowercase()

	private val loc: Localization
		get() = Localization.getInstance()
	val localizationKey: String
		get() = "${VmPauseStatusB::class.java.simpleName}.${this.name}"
	// val kr: String
	// 	get() = loc.findLocalizedName4VmStatusB(this, "kr")
	// val en: String
	// 	get() = loc.findLocalizedName4VmStatusB(this, "en")

	companion object {
		private val valueMapping: MutableMap<Int, VmPauseStatusB> = ConcurrentHashMap<Int, VmPauseStatusB>()
		private val codeMapping: MutableMap<String, VmPauseStatusB> = ConcurrentHashMap<String, VmPauseStatusB>()

		init {
			values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}

		val allVmPauseStatuss: List<VmPauseStatusB> = VmPauseStatusB.values().toList()

		@JvmStatic fun forValue(value: Int?): VmPauseStatusB = valueMapping[value ?: none.value] ?: none
		@JvmStatic fun forCode(code: String?): VmPauseStatusB = codeMapping[code ?: none.code] ?: none
	}
}
