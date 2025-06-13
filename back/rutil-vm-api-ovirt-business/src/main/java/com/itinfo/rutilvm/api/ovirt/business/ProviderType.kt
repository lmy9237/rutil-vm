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
	OPENSTACK_NETWORK(0, true, true, false, VdcObjectType.Network),
	FOREMAN(1, false, false, false, VdcObjectType.VDS),
	OPENSTACK_IMAGE(2, true, false, false, VdcObjectType.Storage),
	OPENSTACK_VOLUME(3, true, false, false, VdcObjectType.Storage),
	VMWARE(4, false, false, false, VdcObjectType.VM),
	EXTERNAL_NETWORK(5, true, true, true, VdcObjectType.Network),
	KVM(6, false, false, false, VdcObjectType.VM),
	XEN(7, false, false, false, VdcObjectType.VM),
	KUBEVIRT(8, false, false, false, VdcObjectType.Cluster);
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
			EXTERNAL_NETWORK, OPENSTACK_NETWORK -> "http://localhost:9696"
			OPENSTACK_IMAGE -> "http://localhost:9292"
			VMWARE, KVM, XEN, KUBEVIRT -> ""
			else -> "http://localhost"
		}

	val isTypeNetwork: Boolean
		get() = this == EXTERNAL_NETWORK || this == OPENSTACK_NETWORK
	val isTypeOpenstack: Boolean
		get() = this == OPENSTACK_IMAGE || this == OPENSTACK_NETWORK
	val supportsAuthApiV3: Boolean
		get() = isTypeOpenstack

	companion object {
		private val findMap: MutableMap<Int, ProviderType> = ConcurrentHashMap<Int, ProviderType>()
		init {
			ProviderType.values().forEach { findMap[it.value] = it }
		}
		@JvmStatic fun forValue(value: Int): ProviderType? = findMap[value]
		@JvmStatic fun findByName(name: String): ProviderType? = findMap.values.firstOrNull() { it.name == name }
	}
}
