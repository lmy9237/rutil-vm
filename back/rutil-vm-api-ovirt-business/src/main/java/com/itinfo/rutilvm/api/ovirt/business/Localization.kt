package com.itinfo.rutilvm.api.ovirt.business

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
		//region: AuditLogSeverityL
		object AuditLogSeverityL {
			object KR {
				val NORMAL		= locKr?.get(AuditLogSeverity.NORMAL.localizationKey)?.toString() ?: ""
				val WARNING		= locKr?.get(AuditLogSeverity.WARNING.localizationKey)?.toString() ?: ""
				val ERROR		= locKr?.get(AuditLogSeverity.ERROR.localizationKey)?.toString() ?: ""
				val ALERT		= locKr?.get(AuditLogSeverity.ALERT.localizationKey)?.toString() ?: ""
			}
		}
		//endregion: AuditLogSeverityL


		//region: BiosTypeL
		object BiosTypeL {
			object KR {
				val i440fx_sea_bios		= locKr?.get(BiosTypeB.i440fx_sea_bios.localizationKey)?.toString() ?: ""
				val q35_sea_bios		= locKr?.get(BiosTypeB.q35_sea_bios.localizationKey)?.toString() ?: ""
				val q35_ovmf			= locKr?.get(BiosTypeB.q35_ovmf.localizationKey)?.toString() ?: ""
				val q35_secure_boot		= locKr?.get(BiosTypeB.q35_secure_boot.localizationKey)?.toString() ?: ""
			}
			object EN {
				val i440fx_sea_bios	= locEn?.get(BiosTypeB.i440fx_sea_bios.localizationKey)?.toString() ?: ""
				val q35_sea_bios	= locEn?.get(BiosTypeB.q35_sea_bios.localizationKey)?.toString() ?: ""
				val q35_ovmf		= locEn?.get(BiosTypeB.q35_ovmf.localizationKey)?.toString() ?: ""
				val q35_secure_boot	= locEn?.get(BiosTypeB.q35_secure_boot.localizationKey)?.toString() ?: ""
			}
		}
		//endregion

		//region: DiskContentTypeL
		object DiskContentTypeL {
			object KR {
				val DATA 							= locKr?.get(DiskContentType.DATA.localizationKey)?.toString() ?: ""
				val OVF_STORE 						= locKr?.get(DiskContentType.OVF_STORE.localizationKey)?.toString() ?: ""
				val MEMORY_DUMP_VOLUME 				= locKr?.get(DiskContentType.MEMORY_DUMP_VOLUME.localizationKey)?.toString() ?: ""
				val MEMORY_METADATA_VOLUME 			= locKr?.get(DiskContentType.MEMORY_METADATA_VOLUME.localizationKey)?.toString() ?: ""
				val ISO 							= locKr?.get(DiskContentType.ISO.localizationKey)?.toString() ?: ""
				val HOSTED_ENGINE 					= locKr?.get(DiskContentType.HOSTED_ENGINE.localizationKey)?.toString() ?: ""
				val HOSTED_ENGINE_SANLOCK 			= locKr?.get(DiskContentType.HOSTED_ENGINE_SANLOCK.localizationKey)?.toString() ?: ""
				val HOSTED_ENGINE_METADATA 			= locKr?.get(DiskContentType.HOSTED_ENGINE_METADATA.localizationKey)?.toString() ?: ""
				val HOSTED_ENGINE_CONFIGURATION 	= locKr?.get(DiskContentType.HOSTED_ENGINE_CONFIGURATION.localizationKey)?.toString() ?: ""
				val BACKUP_SCRATCH 					= locKr?.get(DiskContentType.BACKUP_SCRATCH.localizationKey)?.toString() ?: ""
				val UNKNOWN 						= locKr?.get(DiskContentType.UNKNOWN.localizationKey)?.toString() ?: ""
			}
			object EN {
				val DATA 							= locEn?.get(DiskContentType.DATA.localizationKey)?.toString() ?: ""
				val OVF_STORE 						= locEn?.get(DiskContentType.OVF_STORE.localizationKey)?.toString() ?: ""
				val MEMORY_DUMP_VOLUME 				= locEn?.get(DiskContentType.MEMORY_DUMP_VOLUME.localizationKey)?.toString() ?: ""
				val MEMORY_METADATA_VOLUME 			= locEn?.get(DiskContentType.MEMORY_METADATA_VOLUME.localizationKey)?.toString() ?: ""
				val ISO 							= locEn?.get(DiskContentType.ISO.localizationKey)?.toString() ?: ""
				val HOSTED_ENGINE 					= locEn?.get(DiskContentType.HOSTED_ENGINE.localizationKey)?.toString() ?: ""
				val HOSTED_ENGINE_SANLOCK 			= locEn?.get(DiskContentType.HOSTED_ENGINE_SANLOCK.localizationKey)?.toString() ?: ""
				val HOSTED_ENGINE_METADATA 			= locEn?.get(DiskContentType.HOSTED_ENGINE_METADATA.localizationKey)?.toString() ?: ""
				val HOSTED_ENGINE_CONFIGURATION 	= locEn?.get(DiskContentType.HOSTED_ENGINE_CONFIGURATION.localizationKey)?.toString() ?: ""
				val BACKUP_SCRATCH 					= locEn?.get(DiskContentType.BACKUP_SCRATCH.localizationKey)?.toString() ?: ""
				val UNKNOWN 						= locEn?.get(DiskContentType.UNKNOWN.localizationKey)?.toString() ?: ""
			}
		}
		//endregion

		//region: DiskInterfaceL
		object DiskInterfaceL {
			object KR {
				val IDE								= locKr?.get(DiskInterface.IDE.localizationKey)?.toString() ?: ""
				val VirtIO_SCSI						= locKr?.get(DiskInterface.VirtIO_SCSI.localizationKey)?.toString() ?: ""
				val VirtIO							= locKr?.get(DiskInterface.VirtIO.localizationKey)?.toString() ?: ""
				val SPAPR_VSCSI						= locKr?.get(DiskInterface.SPAPR_VSCSI.localizationKey)?.toString() ?: ""
				val SATA							= locKr?.get(DiskInterface.SATA.localizationKey)?.toString() ?: ""
			}
			object EN {
				val IDE								= locEn?.get(DiskInterface.IDE.localizationKey)?.toString() ?: ""
				val VirtIO_SCSI						= locEn?.get(DiskInterface.VirtIO_SCSI.localizationKey)?.toString() ?: ""
				val VirtIO							= locEn?.get(DiskInterface.VirtIO.localizationKey)?.toString() ?: ""
				val SPAPR_VSCSI						= locEn?.get(DiskInterface.SPAPR_VSCSI.localizationKey)?.toString() ?: ""
				val SATA							= locEn?.get(DiskInterface.SATA.localizationKey)?.toString() ?: ""
			}
		}
		//endregion: DiskInterfaceL

		//region: DisplayTypeL
		object DisplayTypeL {
			object KR {
				val cirrus							= locKr?.get(DisplayTypeB.cirrus.localizationKey)?.toString() ?: ""
				val qxl								= locKr?.get(DisplayTypeB.qxl.localizationKey)?.toString() ?: ""
				val vga								= locKr?.get(DisplayTypeB.vga.localizationKey)?.toString() ?: ""
				val bochs							= locKr?.get(DisplayTypeB.bochs.localizationKey)?.toString() ?: ""
				val none							= locKr?.get(DisplayTypeB.none.localizationKey)?.toString() ?: ""
			}
			object EN {
				val cirrus							= locEn?.get(DisplayTypeB.cirrus.localizationKey)?.toString() ?: ""
				val qxl								= locEn?.get(DisplayTypeB.qxl.localizationKey)?.toString() ?: ""
				val vga								= locEn?.get(DisplayTypeB.vga.localizationKey)?.toString() ?: ""
				val bochs							= locEn?.get(DisplayTypeB.bochs.localizationKey)?.toString() ?: ""
				val none							= locEn?.get(DisplayTypeB.none.localizationKey)?.toString() ?: ""
			}
		}
		//endregion: DisplayTypeL


		//region MigrationSupportL
		object MigrationSupportL {
			object KR {
				val MIGRATABLE = locKr?.get(MigrationSupport.MIGRATABLE.localizationKey)?.toString() ?: ""
				val IMPLICITLY_NON_MIGRATABLE = locKr?.get(MigrationSupport.IMPLICITLY_NON_MIGRATABLE.localizationKey)?.toString() ?: ""
				val PINNED_TO_HOST = locKr?.get(MigrationSupport.PINNED_TO_HOST.localizationKey)?.toString() ?: ""
			}
			object EN {
				val MIGRATABLE = locEn?.get(MigrationSupport.MIGRATABLE.localizationKey)?.toString() ?: ""
				val IMPLICITLY_NON_MIGRATABLE = locEn?.get(MigrationSupport.IMPLICITLY_NON_MIGRATABLE.localizationKey)?.toString() ?: ""
				val PINNED_TO_HOST = locEn?.get(MigrationSupport.PINNED_TO_HOST.localizationKey)?.toString() ?: ""
			}
		}
		//endregion


		//region ProviderTypeL
		object ProviderTypeL {
			object EN {
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


		//region: VmTypeL
		object VmTypeL {
			object KR {
				val Desktop = locKr?.get(VmTypeB.desktop.localizationKey)?.toString() ?: ""
				val Server = locKr?.get(VmTypeB.server.localizationKey)?.toString() ?: ""
				val HighPerformance = locKr?.get(VmTypeB.high_performance.localizationKey)?.toString() ?: ""
			}
			object EN {
				val Desktop = locEn?.get(VmTypeB.desktop.localizationKey)?.toString() ?: ""
				val Server = locEn?.get(VmTypeB.server.localizationKey)?.toString() ?: ""
				val HighPerformance = locEn?.get(VmTypeB.high_performance.localizationKey)?.toString() ?: ""
			}
		}
		//endregion:

		//region: VmEntityTypeL
		object VmEntityTypeL {
			object KR {
				val VM = locKr?.get(VmEntityType.VM.localizationKey)?.toString() ?: ""
				val TEMPLATE = locKr?.get(VmEntityType.TEMPLATE.localizationKey)?.toString() ?: ""
				val INSTANCE_TYPE = locKr?.get(VmEntityType.INSTANCE_TYPE.localizationKey)?.toString() ?: ""
				val IMAGE_TYPE = locKr?.get(VmEntityType.IMAGE_TYPE.localizationKey)?.toString() ?: ""
			}
			object EN {
				val VM = locEn?.get(VmEntityType.VM.localizationKey)?.toString() ?: ""
				val TEMPLATE = locEn?.get(VmEntityType.TEMPLATE.localizationKey)?.toString() ?: ""
				val INSTANCE_TYPE = locEn?.get(VmEntityType.INSTANCE_TYPE.localizationKey)?.toString() ?: ""
				val IMAGE_TYPE = locEn?.get(VmEntityType.IMAGE_TYPE.localizationKey)?.toString() ?: ""
			}
		}
		//endregion: VmEntityTypeL
	}

	fun findLocalizedName4AuditLogSeverity(type: AuditLogSeverity, loc: String = "kr"): String =
		when(type) {
			AuditLogSeverity.NORMAL ->	if (loc == "kr") AuditLogSeverityL.KR.NORMAL else type.name
			AuditLogSeverity.WARNING -> if (loc == "kr") AuditLogSeverityL.KR.WARNING else type.name
			AuditLogSeverity.ERROR ->	if (loc == "kr") AuditLogSeverityL.KR.ERROR else type.name
			AuditLogSeverity.ALERT ->	if (loc == "kr") AuditLogSeverityL.KR.ALERT else type.name
			else -> if (loc == "kr") "알 수 없음" else "Unknown"
		}

	fun findLocalizedName4ProviderType(type: ProviderType, loc: String = "kr"): String =
		when(type) {
			ProviderType.OPENSTACK_NETWORK ->	if (loc == "kr") ProviderTypeL.KR.OPENSTACK_NETWORK	else ProviderTypeL.EN.OPENSTACK_NETWORK
			ProviderType.FOREMAN -> 			if (loc == "kr") ProviderTypeL.KR.FOREMAN 			else ProviderTypeL.EN.FOREMAN
			ProviderType.OPENSTACK_IMAGE -> 	if (loc == "kr") ProviderTypeL.KR.OPENSTACK_IMAGE	else ProviderTypeL.EN.OPENSTACK_IMAGE
			ProviderType.OPENSTACK_VOLUME ->	if (loc == "kr") ProviderTypeL.KR.OPENSTACK_VOLUME	else ProviderTypeL.EN.OPENSTACK_VOLUME
			ProviderType.EXTERNAL_NETWORK -> 	if (loc == "kr") ProviderTypeL.KR.EXTERNAL_NETWORK	else ProviderTypeL.EN.EXTERNAL_NETWORK
			ProviderType.VMWARE -> 				if (loc == "kr") ProviderTypeL.KR.VMWARE			else ProviderTypeL.EN.VMWARE
			ProviderType.KVM ->					if (loc == "kr") ProviderTypeL.KR.KVM				else ProviderTypeL.EN.KVM
			ProviderType.XEN ->					if (loc == "kr") ProviderTypeL.KR.XEN				else ProviderTypeL.EN.XEN
			ProviderType.KUBEVIRT ->			if (loc == "kr") ProviderTypeL.KR.KUBEVIRT			else ProviderTypeL.EN.KUBEVIRT
		}

	fun findLocalizedName4BiosType(type: BiosTypeB, loc: String = "kr"): String =
		when(type) {
			BiosTypeB.i440fx_sea_bios ->		if (loc == "kr") BiosTypeL.KR.i440fx_sea_bios		else BiosTypeL.EN.i440fx_sea_bios
			BiosTypeB.q35_sea_bios -> 			if (loc == "kr") BiosTypeL.KR.q35_sea_bios 			else BiosTypeL.EN.q35_sea_bios
			BiosTypeB.q35_ovmf -> 				if (loc == "kr") BiosTypeL.KR.q35_ovmf				else BiosTypeL.EN.q35_ovmf
			BiosTypeB.q35_secure_boot ->		if (loc == "kr") BiosTypeL.KR.q35_secure_boot		else BiosTypeL.EN.q35_secure_boot
			else -> if (loc == "kr") "알 수 없음" else "Unknown"
		}
	fun findLocalizedName4DiskContentType(type: DiskContentType, loc: String = "kr"): String =
		when(type) {
			DiskContentType.DATA -> 							if (loc == "kr") DiskContentTypeL.KR.DATA else DiskContentTypeL.EN.DATA
			DiskContentType.OVF_STORE -> 						if (loc == "kr") DiskContentTypeL.KR.OVF_STORE else DiskContentTypeL.EN.OVF_STORE
			DiskContentType.MEMORY_DUMP_VOLUME -> 				if (loc == "kr") DiskContentTypeL.KR.MEMORY_DUMP_VOLUME else DiskContentTypeL.EN.MEMORY_DUMP_VOLUME
			DiskContentType.MEMORY_METADATA_VOLUME -> 			if (loc == "kr") DiskContentTypeL.KR.MEMORY_METADATA_VOLUME else DiskContentTypeL.EN.MEMORY_METADATA_VOLUME
			DiskContentType.ISO -> 								if (loc == "kr") DiskContentTypeL.KR.ISO else DiskContentTypeL.EN.ISO
			DiskContentType.HOSTED_ENGINE -> 					if (loc == "kr") DiskContentTypeL.KR.HOSTED_ENGINE else DiskContentTypeL.EN.HOSTED_ENGINE
			DiskContentType.HOSTED_ENGINE_SANLOCK -> 			if (loc == "kr") DiskContentTypeL.KR.HOSTED_ENGINE_SANLOCK else DiskContentTypeL.EN.HOSTED_ENGINE_SANLOCK
			DiskContentType.HOSTED_ENGINE_METADATA -> 			if (loc == "kr") DiskContentTypeL.KR.HOSTED_ENGINE_METADATA else DiskContentTypeL.EN.HOSTED_ENGINE_METADATA
			DiskContentType.HOSTED_ENGINE_CONFIGURATION -> 		if (loc == "kr") DiskContentTypeL.KR.HOSTED_ENGINE_CONFIGURATION else DiskContentTypeL.EN.HOSTED_ENGINE_CONFIGURATION
			DiskContentType.BACKUP_SCRATCH -> 					if (loc == "kr") DiskContentTypeL.KR.BACKUP_SCRATCH else DiskContentTypeL.EN.BACKUP_SCRATCH
			DiskContentType.UNKNOWN -> 							if (loc == "kr") DiskContentTypeL.KR.UNKNOWN else DiskContentTypeL.EN.UNKNOWN
		}

	fun findLocalizedName4DiskInterface(type: DiskInterface, loc: String = "kr"): String =
		when(type) {
			DiskInterface.IDE -> 			if (loc == "kr") DiskInterfaceL.KR.IDE else DiskInterfaceL.EN.IDE
			DiskInterface.VirtIO_SCSI -> 	if (loc == "kr") DiskInterfaceL.KR.VirtIO_SCSI else DiskInterfaceL.EN.VirtIO_SCSI
			DiskInterface.VirtIO -> 		if (loc == "kr") DiskInterfaceL.KR.VirtIO else DiskInterfaceL.EN.VirtIO
			DiskInterface.SPAPR_VSCSI -> 	if (loc == "kr") DiskInterfaceL.KR.SPAPR_VSCSI else DiskInterfaceL.EN.SPAPR_VSCSI
			DiskInterface.SATA -> 			if (loc == "kr") DiskInterfaceL.KR.SATA else DiskInterfaceL.EN.SATA
		}

	fun findLocalizedName4DisplayType(type: DisplayTypeB, loc: String = "kr"): String =
		when(type) {
			DisplayTypeB.cirrus ->					if (loc == "kr") DisplayTypeL.KR.cirrus else DisplayTypeL.EN.cirrus
			DisplayTypeB.qxl	->						if (loc == "kr") DisplayTypeL.KR.qxl else DisplayTypeL.EN.qxl
			DisplayTypeB.vga	->						if (loc == "kr") DisplayTypeL.KR.vga else DisplayTypeL.EN.vga
			DisplayTypeB.bochs -> 					if (loc == "kr") DisplayTypeL.KR.bochs else DisplayTypeL.EN.bochs
			DisplayTypeB.none ->						if (loc == "kr") DisplayTypeL.KR.none else DisplayTypeL.EN.none
		}

	fun findLocalizedName4MigrationSupport(type: MigrationSupport, loc: String = "kr"): String =
		when(type) {
			MigrationSupport.MIGRATABLE ->					if (loc == "kr") MigrationSupportL.KR.MIGRATABLE else MigrationSupportL.EN.MIGRATABLE
			MigrationSupport.IMPLICITLY_NON_MIGRATABLE ->	if (loc == "kr") MigrationSupportL.KR.IMPLICITLY_NON_MIGRATABLE else MigrationSupportL.EN.IMPLICITLY_NON_MIGRATABLE
			MigrationSupport.PINNED_TO_HOST -> 				if (loc == "kr") MigrationSupportL.KR.PINNED_TO_HOST else MigrationSupportL.EN.PINNED_TO_HOST
			else -> if (loc == "kr") "알 수 없음" else "Unknown"
		}

	fun findLocalizedName4VmType(type: VmTypeB, loc: String = "kr"): String =
		when(type) {
			VmTypeB.desktop -> 				if (loc == "kr") VmTypeL.KR.Desktop else VmTypeL.EN.Desktop
			VmTypeB.server ->				if (loc == "kr") VmTypeL.KR.Server else VmTypeL.EN.Server
			VmTypeB.high_performance -> 		if (loc == "kr") VmTypeL.KR.HighPerformance else VmTypeL.EN.HighPerformance
			else -> if (loc == "kr") "알 수 없음" else "Unknown"
		}

	fun findLocalizedName4VmEntityType(type: VmEntityType, loc: String = "kr"): String =
		when(type) {
			VmEntityType.VM ->						if (loc == "kr") VmEntityTypeL.KR.VM else VmEntityTypeL.EN.VM
			VmEntityType.TEMPLATE ->				if (loc == "kr") VmEntityTypeL.KR.TEMPLATE else VmEntityTypeL.EN.TEMPLATE
			VmEntityType.INSTANCE_TYPE ->			if (loc == "kr") VmEntityTypeL.KR.INSTANCE_TYPE else VmEntityTypeL.EN.INSTANCE_TYPE
			VmEntityType.IMAGE_TYPE -> 				if (loc == "kr") VmEntityTypeL.KR.IMAGE_TYPE else VmEntityTypeL.EN.IMAGE_TYPE
			else -> if (loc == "kr") "알 수 없음" else "Unknown"
		}

}
