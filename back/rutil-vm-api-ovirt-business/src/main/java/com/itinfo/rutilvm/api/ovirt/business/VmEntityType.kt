package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

enum class VmEntityType() {
	VM,
	TEMPLATE,
	INSTANCE_TYPE,
	IMAGE_TYPE,
	UNKNOWN;

	val isVmType: Boolean
		get() = this@VmEntityType == VM

	val isTemplateType: Boolean
		get() = this == TEMPLATE ||
			this == INSTANCE_TYPE ||
			this == IMAGE_TYPE;

	val localizationKey: String
		get() = "${VmEntityType::class.java.simpleName}.${this.name}"
	private val loc: Localization
		get() = Localization.getInstance()

	val en: String
		get() = loc.findLocalizedName4VmEntityType(this, "en")
	val kr: String
		get() = loc.findLocalizedName4VmEntityType(this, "kr")

	companion object {
		private val valueMapping: MutableMap<String, VmEntityType> = ConcurrentHashMap<String, VmEntityType>()

		init {
			VmEntityType.values().forEach { valueMapping[it.name] = it }
		}

		val allVmEntityTypes: List<VmEntityType> = VmEntityType.values().filterNot {
			it == UNKNOWN
		}

		@JvmStatic fun forValue(value: String?): VmEntityType = valueMapping[value ?: "UNKNOWN"] ?: UNKNOWN
	}
}
