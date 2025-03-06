package com.itinfo.rutilvm.api.ovirt.business

import com.itinfo.rutilvm.api.ovirt.business.ProviderType.EXTERNAL_NETWORK
import com.itinfo.rutilvm.api.ovirt.business.ProviderType.FOREMAN
import com.itinfo.rutilvm.api.ovirt.business.ProviderType.KUBEVIRT
import com.itinfo.rutilvm.api.ovirt.business.ProviderType.KVM
import com.itinfo.rutilvm.api.ovirt.business.ProviderType.OPENSTACK_IMAGE
import com.itinfo.rutilvm.api.ovirt.business.ProviderType.OPENSTACK_NETWORK
import com.itinfo.rutilvm.api.ovirt.business.ProviderType.OPENSTACK_VOLUME
import com.itinfo.rutilvm.api.ovirt.business.ProviderType.VMWARE
import com.itinfo.rutilvm.api.ovirt.business.ProviderType.XEN
import com.itinfo.rutilvm.util.PropertiesHelper
import java.util.*

/**
 * [Localization]
 * 로컬화 용어 관리
 *
 * @author 이찬희 (@chanhi2000)
 * @since 2025-03-06
 */
class Localization {
	companion object {
		private const val PROP_LOC_EN_FULL_PATH = "localization.en.properties"
		private const val PROP_LOC_KR_FULL_PATH = "localization.kr.properties"
		private var locKr: Properties? = null
		private var locEn: Properties? = null

		private val propH: PropertiesHelper = PropertiesHelper.getInstance()
		@Volatile private var INSTANCE: Localization? = null
		@JvmStatic fun getInstance(): Localization = INSTANCE ?: synchronized(this) {
			INSTANCE ?: build().also { INSTANCE = it }
		}
		fun build(): Localization {
			val locH = Localization()
			locEn = propH.loadProperties(PROP_LOC_EN_FULL_PATH)
			locKr = propH.loadProperties(PROP_LOC_KR_FULL_PATH)
			return locH
		}

		//region ProviderType
		object ProviderTypeL {
			object EN {
				fun findBy(type: ProviderType): String =
					when(type) {
						ProviderType.OPENSTACK_NETWORK -> OPENSTACK_NETWORK
						ProviderType.FOREMAN -> FOREMAN
						ProviderType.OPENSTACK_IMAGE -> OPENSTACK_IMAGE
						ProviderType.OPENSTACK_VOLUME -> OPENSTACK_VOLUME
						ProviderType.VMWARE -> VMWARE
						ProviderType.EXTERNAL_NETWORK -> EXTERNAL_NETWORK
						ProviderType.KVM -> KVM
						ProviderType.XEN -> XEN
						ProviderType.KUBEVIRT -> KUBEVIRT
					}
				val OPENSTACK_NETWORK	= locEn?.get(ProviderType.OPENSTACK_NETWORK.localizationKey)?.toString() ?: ""
				val FOREMAN 			= locEn?.get(ProviderType.FOREMAN.localizationKey)?.toString() ?: ""
				val OPENSTACK_IMAGE		= locEn?.get(ProviderType.OPENSTACK_IMAGE.localizationKey)?.toString() ?: ""
				val OPENSTACK_VOLUME	= locEn?.get(ProviderType.OPENSTACK_VOLUME.localizationKey)?.toString() ?: ""
				val VMWARE				= locEn?.get(ProviderType.VMWARE.localizationKey)?.toString() ?: ""
				val EXTERNAL_NETWORK	= locEn?.get(ProviderType.EXTERNAL_NETWORK.localizationKey)?.toString() ?: ""
				val KVM					= locEn?.get(ProviderType.KVM.localizationKey)?.toString() ?: ""
				val XEN					= locEn?.get(ProviderType.XEN.localizationKey)?.toString() ?: ""
				val KUBEVIRT			= locEn?.get(ProviderType.KUBEVIRT.localizationKey)?.toString() ?: ""
			}
			object KR {
				val OPENSTACK_NETWORK	= locKr?.get(ProviderType.OPENSTACK_NETWORK.localizationKey)?.toString() ?: ""
				val FOREMAN 			= locKr?.get(ProviderType.FOREMAN.localizationKey).toString() ?: ""
				val OPENSTACK_IMAGE		= locKr?.get(ProviderType.OPENSTACK_IMAGE.localizationKey)?.toString() ?: ""
				val OPENSTACK_VOLUME	= locKr?.get(ProviderType.OPENSTACK_VOLUME.localizationKey)?.toString() ?: ""
				val VMWARE				= locKr?.get(ProviderType.VMWARE.localizationKey)?.toString() ?: ""
				val EXTERNAL_NETWORK	= locKr?.get(ProviderType.EXTERNAL_NETWORK.localizationKey)?.toString() ?: ""
				val KVM					= locKr?.get(ProviderType.KVM.localizationKey)?.toString() ?: ""
				val XEN					= locKr?.get(ProviderType.XEN.localizationKey)?.toString() ?: ""
				val KUBEVIRT			= locKr?.get(ProviderType.KUBEVIRT.localizationKey)?.toString() ?: ""
			}
		}
		//endregion
	}

	fun findProviderTypeLocalizedName(providerType: ProviderType, loc: String = "kr"): String =
		when(providerType) {
			OPENSTACK_NETWORK ->	if (loc == "kr") ProviderTypeL.KR.OPENSTACK_NETWORK	else ProviderTypeL.EN.OPENSTACK_NETWORK
			FOREMAN -> 				if (loc == "kr") ProviderTypeL.KR.FOREMAN 			else ProviderTypeL.EN.FOREMAN
			OPENSTACK_IMAGE -> 		if (loc == "kr") ProviderTypeL.KR.OPENSTACK_IMAGE	else ProviderTypeL.EN.OPENSTACK_IMAGE
			OPENSTACK_VOLUME ->		if (loc == "kr") ProviderTypeL.KR.OPENSTACK_VOLUME	else ProviderTypeL.EN.OPENSTACK_VOLUME
			VMWARE -> 				if (loc == "kr") ProviderTypeL.KR.VMWARE			else ProviderTypeL.EN.VMWARE
			EXTERNAL_NETWORK -> 	if (loc == "kr") ProviderTypeL.KR.EXTERNAL_NETWORK	else ProviderTypeL.EN.EXTERNAL_NETWORK
			KVM ->					if (loc == "kr") ProviderTypeL.KR.KVM				else ProviderTypeL.EN.KVM
			XEN ->					if (loc == "kr") ProviderTypeL.KR.XEN				else ProviderTypeL.EN.XEN
			KUBEVIRT ->				if (loc == "kr") ProviderTypeL.KR.KUBEVIRT			else ProviderTypeL.EN.KUBEVIRT
		}
}

val loc: Localization
	get() = Localization.getInstance()
