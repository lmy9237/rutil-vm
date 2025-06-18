package com.itinfo.rutilvm.api.ovirt.business

import java.io.Serializable
import java.util.concurrent.ConcurrentHashMap

enum class VmEntityType(

): Serializable {
	VM,
	TEMPLATE,
	INSTANCE_TYPE,
	IMAGE_TYPE,
	UNKNOWN;

	override fun toString(): String = code
	val code: String
		get() = this@VmEntityType.name.uppercase()

	val isVmType: Boolean
		get() = this@VmEntityType == VM

	val isTemplateType: Boolean
		get() = this == TEMPLATE ||
			this == INSTANCE_TYPE ||
			this == IMAGE_TYPE

	val localizationKey: String
		get() = "${VmEntityType::class.java.simpleName}.${this.name}"
	private val loc: Localization
		get() = Localization.getInstance()

	val en: String
		get() = loc.findLocalizedName4VmEntityType(this, "en")
	val kr: String
		get() = loc.findLocalizedName4VmEntityType(this, "kr")

	companion object {
		private val codeMapping: MutableMap<String, VmEntityType> = ConcurrentHashMap<String, VmEntityType>()

		init {
			VmEntityType.values().forEach {
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}

		val allVmEntityTypes: List<VmEntityType> = VmEntityType.values().filterNot {
			it == UNKNOWN
		}

		@JvmStatic fun forCode(code: String?): VmEntityType = codeMapping[code?.uppercase() ?: UNKNOWN.code] ?: UNKNOWN
	}
}
