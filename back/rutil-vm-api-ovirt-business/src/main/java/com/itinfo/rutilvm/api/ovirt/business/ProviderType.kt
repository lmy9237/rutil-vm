package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

/**
 * [ProviderType]
 * 제공자 유형
 *
 */
enum class ProviderType(
	override val value: Int,
	val isAuthUrlAware: Boolean,
	val isReadOnlyAware: Boolean,
	val isUnmanagedAware: Boolean,
	vararg providedTypes: VdcObjectType
) : Identifiable {
	openstack_network(0, true, true, false, VdcObjectType.Network),
	foreman(1, false, false, false, VdcObjectType.VDS),
	openstack_image(2, true, false, false, VdcObjectType.Storage),
	openstack_volume(3, true, false, false, VdcObjectType.Storage),
	vmware(4, false, false, false, VdcObjectType.VM),
	external_network(5, true, true, true, VdcObjectType.Network),
	kvm(6, false, false, false, VdcObjectType.VM),
	xen(7, false, false, false, VdcObjectType.VM),
	kubevirt(8, false, false, false, VdcObjectType.Cluster);

	override fun toString(): String = code
	val code: String
		get() = this@ProviderType.name.uppercase()

	private val loc: Localization
		get() = Localization.getInstance()
	val localizationKey: String
		get() = "${ProviderType::class.java.simpleName}.${this.name}"
	val kr: String
		get() = loc.findLocalizedName4ProviderType(this, "kr")
	val en: String
		get() = loc.findLocalizedName4ProviderType(this, "en")

	val defaultUrl: String
		get() = when(this) {
			external_network, openstack_network -> "http://localhost:9696"
			openstack_image -> "http://localhost:9292"
			vmware, kvm, xen, kubevirt -> ""
			else -> "http://localhost"
		}

	val isTypeNetwork: Boolean
		get() = this == external_network || this == openstack_network
	val isTypeOpenstack: Boolean
		get() = this == openstack_image || this == openstack_network
	val supportsAuthApiV3: Boolean
		get() = isTypeOpenstack

	companion object {
		private val valueMapping: MutableMap<Int, ProviderType> = ConcurrentHashMap<Int, ProviderType>()
		private val codeMapping: MutableMap<String, ProviderType> = ConcurrentHashMap<String, ProviderType>()
		init {
			ProviderType.values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}
		@JvmStatic fun forValue(value: Int): ProviderType? = valueMapping[value]
		@JvmStatic fun findByName(name: String): ProviderType? = valueMapping.values.firstOrNull() { it.name == name }
	}
}
