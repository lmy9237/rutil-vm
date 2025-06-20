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
				val NORMAL		= locKr?.get(AuditLogSeverity.normal.localizationKey)?.toString() ?: ""
				val WARNING		= locKr?.get(AuditLogSeverity.warning.localizationKey)?.toString() ?: ""
				val ERROR		= locKr?.get(AuditLogSeverity.error.localizationKey)?.toString() ?: ""
				val ALERT		= locKr?.get(AuditLogSeverity.alert.localizationKey)?.toString() ?: ""
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
				val DATA 							= locKr?.get(DiskContentType.data.localizationKey)?.toString() ?: ""
				val OVF_STORE 						= locKr?.get(DiskContentType.ovf_store.localizationKey)?.toString() ?: ""
				val MEMORY_DUMP_VOLUME 				= locKr?.get(DiskContentType.memory_dump_volume.localizationKey)?.toString() ?: ""
				val MEMORY_METADATA_VOLUME 			= locKr?.get(DiskContentType.memory_metadata_volume.localizationKey)?.toString() ?: ""
				val ISO 							= locKr?.get(DiskContentType.iso.localizationKey)?.toString() ?: ""
				val HOSTED_ENGINE 					= locKr?.get(DiskContentType.hosted_engine.localizationKey)?.toString() ?: ""
				val HOSTED_ENGINE_SANLOCK 			= locKr?.get(DiskContentType.hosted_engine_sanlock.localizationKey)?.toString() ?: ""
				val HOSTED_ENGINE_METADATA 			= locKr?.get(DiskContentType.hosted_engine_metadata.localizationKey)?.toString() ?: ""
				val HOSTED_ENGINE_CONFIGURATION 	= locKr?.get(DiskContentType.hosted_engine_configuration.localizationKey)?.toString() ?: ""
				val BACKUP_SCRATCH 					= locKr?.get(DiskContentType.backup_scratch.localizationKey)?.toString() ?: ""
				val UNKNOWN 						= locKr?.get(DiskContentType.unknown.localizationKey)?.toString() ?: ""
			}
			object EN {
				val DATA 							= locEn?.get(DiskContentType.data.localizationKey)?.toString() ?: ""
				val OVF_STORE 						= locEn?.get(DiskContentType.ovf_store.localizationKey)?.toString() ?: ""
				val MEMORY_DUMP_VOLUME 				= locEn?.get(DiskContentType.memory_dump_volume.localizationKey)?.toString() ?: ""
				val MEMORY_METADATA_VOLUME 			= locEn?.get(DiskContentType.memory_metadata_volume.localizationKey)?.toString() ?: ""
				val ISO 							= locEn?.get(DiskContentType.iso.localizationKey)?.toString() ?: ""
				val HOSTED_ENGINE 					= locEn?.get(DiskContentType.hosted_engine.localizationKey)?.toString() ?: ""
				val HOSTED_ENGINE_SANLOCK 			= locEn?.get(DiskContentType.hosted_engine_sanlock.localizationKey)?.toString() ?: ""
				val HOSTED_ENGINE_METADATA 			= locEn?.get(DiskContentType.hosted_engine_metadata.localizationKey)?.toString() ?: ""
				val HOSTED_ENGINE_CONFIGURATION 	= locEn?.get(DiskContentType.hosted_engine_configuration.localizationKey)?.toString() ?: ""
				val BACKUP_SCRATCH 					= locEn?.get(DiskContentType.backup_scratch.localizationKey)?.toString() ?: ""
				val UNKNOWN 						= locEn?.get(DiskContentType.unknown.localizationKey)?.toString() ?: ""
			}
		}
		//endregion

		//region: DiskInterfaceL
		object DiskInterfaceL {
			object KR {
				val IDE								= locKr?.get(DiskInterface.ide.localizationKey)?.toString() ?: ""
				val VirtIO_SCSI						= locKr?.get(DiskInterface.virtio_scsi.localizationKey)?.toString() ?: ""
				val VirtIO							= locKr?.get(DiskInterface.virtio.localizationKey)?.toString() ?: ""
				val SPAPR_VSCSI						= locKr?.get(DiskInterface.spapr_vscsi.localizationKey)?.toString() ?: ""
				val SATA							= locKr?.get(DiskInterface.sata.localizationKey)?.toString() ?: ""
			}
			object EN {
				val IDE								= locEn?.get(DiskInterface.ide.localizationKey)?.toString() ?: ""
				val VirtIO_SCSI						= locEn?.get(DiskInterface.virtio_scsi.localizationKey)?.toString() ?: ""
				val VirtIO							= locEn?.get(DiskInterface.virtio.localizationKey)?.toString() ?: ""
				val SPAPR_VSCSI						= locEn?.get(DiskInterface.spapr_vscsi.localizationKey)?.toString() ?: ""
				val SATA							= locEn?.get(DiskInterface.sata.localizationKey)?.toString() ?: ""
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


		//region: FipsModeL
		object FipsModeL {
			object KR {
				val undefined		= locKr?.get(FipsModeB.undefined.localizationKey)?.toString() ?: ""
				val enabled			= locKr?.get(FipsModeB.enabled.localizationKey)?.toString() ?: ""
				val disabled		= locKr?.get(FipsModeB.disabled.localizationKey)?.toString() ?: ""
			}
			object EN {
				val undefined		= locEn?.get(FipsModeB.undefined.localizationKey)?.toString() ?: ""
				val enabled			= locEn?.get(FipsModeB.enabled.localizationKey)?.toString() ?: ""
				val disabled		= locEn?.get(FipsModeB.disabled.localizationKey)?.toString() ?: ""
			}
		}
		//endregion: FipsModeL

		//region: MigrationBandwidthLimitTypeL
		object MigrationBandwidthLimitTypeL {
			object KR {
				val auto				= locKr?.get(MigrationBandwidthLimitType.auto.localizationKey)?.toString() ?: ""
				val hypervisor_default	= locKr?.get(MigrationBandwidthLimitType.hypervisor_default.localizationKey)?.toString() ?: ""
				val custom				= locKr?.get(MigrationBandwidthLimitType.custom.localizationKey)?.toString() ?: ""
			}
			object EN {
				val auto				= locEn?.get(MigrationBandwidthLimitType.auto.localizationKey)?.toString() ?: ""
				val hypervisor_default	= locEn?.get(MigrationBandwidthLimitType.hypervisor_default.localizationKey)?.toString() ?: ""
				val custom				= locEn?.get(MigrationBandwidthLimitType.custom.localizationKey)?.toString() ?: ""
			}
		}
		//endregion: MigrationBandwidthLimitTypeL


		//region: MigrationSupportL
		object MigrationSupportL {
			object KR {
				val migratable 		= locKr?.get(MigrationSupport.migratable.localizationKey)?.toString() ?: ""
				val user_migratable	= locKr?.get(MigrationSupport.user_migratable.localizationKey)?.toString() ?: ""
				val pinned 			= locKr?.get(MigrationSupport.pinned.localizationKey)?.toString() ?: ""
			}
			object EN {
				val migratable 		= locEn?.get(MigrationSupport.migratable.localizationKey)?.toString() ?: ""
				val user_migratable = locEn?.get(MigrationSupport.user_migratable.localizationKey)?.toString() ?: ""
				val pinned			= locEn?.get(MigrationSupport.pinned.localizationKey)?.toString() ?: ""
			}
		}
		//endregion: MigrationSupportL


		//region: MigrateOnErrorBL
		object MigrateOnErrorL {
			object KR {
				val do_not_migrate				= locKr?.get(MigrateOnErrorB.do_not_migrate.localizationKey)?.toString() ?: ""
				val migrate						= locKr?.get(MigrateOnErrorB.migrate.localizationKey)?.toString() ?: ""
				val migrate_highly_available	= locKr?.get(MigrateOnErrorB.migrate_highly_available.localizationKey)?.toString() ?: ""
			}
			object EN {
				val do_not_migrate				= locEn?.get(MigrateOnErrorB.do_not_migrate.localizationKey)?.toString() ?: ""
				val migrate						= locEn?.get(MigrateOnErrorB.migrate.localizationKey)?.toString() ?: ""
				val migrate_highly_available	= locEn?.get(MigrateOnErrorB.migrate_highly_available.localizationKey)?.toString() ?: ""
			}
		}
		//endregion: MigrateOnErrorBL


		//region ProviderTypeL
		object ProviderTypeL {
			object KR {
				val OPENSTACK_NETWORK	= locKr?.get(ProviderType.openstack_network.localizationKey)?.toString() ?: ""
				val FOREMAN 			= locKr?.get(ProviderType.foreman.localizationKey).toString() ?: ""
				val OPENSTACK_IMAGE		= locKr?.get(ProviderType.openstack_image.localizationKey)?.toString() ?: ""
				val OPENSTACK_VOLUME	= locKr?.get(ProviderType.openstack_volume.localizationKey)?.toString() ?: ""
				val VMWARE				= locKr?.get(ProviderType.vmware.localizationKey)?.toString() ?: ""
				val EXTERNAL_NETWORK	= locKr?.get(ProviderType.external_network.localizationKey)?.toString() ?: ""
				val KVM					= locKr?.get(ProviderType.kvm.localizationKey)?.toString() ?: ""
				val XEN					= locKr?.get(ProviderType.xen.localizationKey)?.toString() ?: ""
				val KUBEVIRT			= locKr?.get(ProviderType.kubevirt.localizationKey)?.toString() ?: ""
			}
			object EN {
				val OPENSTACK_NETWORK	= locEn?.get(ProviderType.openstack_network.localizationKey)?.toString() ?: ""
				val FOREMAN 			= locEn?.get(ProviderType.foreman.localizationKey)?.toString() ?: ""
				val OPENSTACK_IMAGE		= locEn?.get(ProviderType.openstack_image.localizationKey)?.toString() ?: ""
				val OPENSTACK_VOLUME	= locEn?.get(ProviderType.openstack_volume.localizationKey)?.toString() ?: ""
				val VMWARE				= locEn?.get(ProviderType.vmware.localizationKey)?.toString() ?: ""
				val EXTERNAL_NETWORK	= locEn?.get(ProviderType.external_network.localizationKey)?.toString() ?: ""
				val KVM					= locEn?.get(ProviderType.kvm.localizationKey)?.toString() ?: ""
				val XEN					= locEn?.get(ProviderType.xen.localizationKey)?.toString() ?: ""
				val KUBEVIRT			= locEn?.get(ProviderType.kubevirt.localizationKey)?.toString() ?: ""
			}
		}
		//endregion: ProviderTypeL

		//region: QuotaEnforcementTypeL
		object QuotaEnforcementTypeL {
			object KR {
				val disabled 			= locKr?.get(QuotaEnforcementType.disabled.localizationKey)?.toString() ?: ""
				val enabled				= locKr?.get(QuotaEnforcementType.enabled.localizationKey)?.toString() ?: ""
				val audit				= locKr?.get(QuotaEnforcementType.audit.localizationKey)?.toString() ?: ""
			}
			object EN {
				val disabled 			= locEn?.get(QuotaEnforcementType.disabled.localizationKey)?.toString() ?: ""
				val enabled				= locEn?.get(QuotaEnforcementType.enabled.localizationKey)?.toString() ?: ""
				val audit				= locEn?.get(QuotaEnforcementType.audit.localizationKey)?.toString() ?: ""
			}
		}
		//endregion: QuotaEnforcementTypeL

		//region: SELinuxModeL
		object SELinuxModeL {
			object KR {
				val enforcing 		= locKr?.get(SELinuxModeB.enforcing.localizationKey)?.toString() ?: ""
				val permissive		= locKr?.get(SELinuxModeB.permissive.localizationKey)?.toString() ?: ""
			 	val disabled 		= locKr?.get(SELinuxModeB.disabled.localizationKey)?.toString() ?: ""
			}
			object EN {
				val enforcing 		= locEn?.get(SELinuxModeB.enforcing.localizationKey)?.toString() ?: ""
				val permissive		= locEn?.get(SELinuxModeB.permissive.localizationKey)?.toString() ?: ""
				val disabled 		= locEn?.get(SELinuxModeB.disabled.localizationKey)?.toString() ?: ""
			}
		}
		//endregion: SELinuxModeL


		//region: StorageDomainTypeL
		object StorageDomainTypeL {
			object KR {
				val master				 		= locKr?.get(StorageDomainTypeB.master.localizationKey)?.toString() ?: ""
				val data				 		= locKr?.get(StorageDomainTypeB.data.localizationKey)?.toString() ?: ""
				val iso					 		= locKr?.get(StorageDomainTypeB.iso.localizationKey)?.toString() ?: ""
				val import_export		 		= locKr?.get(StorageDomainTypeB.import_export.localizationKey)?.toString() ?: ""
				val image				 		= locKr?.get(StorageDomainTypeB.image.localizationKey)?.toString() ?: ""
				// val volume					= locKr?.get(StorageDomainTypeB.volume.localizationKey)?.toString() ?: ""
				// val unknown					= locKr?.get(StorageDomainTypeB.unknown.localizationKey)?.toString() ?: ""
				val managed_block_storage		= locKr?.get(StorageDomainTypeB.managed_block_storage.localizationKey)?.toString() ?: ""
				// val unmanaged				= locKr?.get(StorageDomainTypeB.unmanaged.localizationKey)?.toString() ?: ""
			}
			object EN {
				val master				 		= locEn?.get(StorageDomainTypeB.master.localizationKey)?.toString() ?: ""
				val data				 		= locEn?.get(StorageDomainTypeB.data.localizationKey)?.toString() ?: ""
				val iso					 		= locEn?.get(StorageDomainTypeB.iso.localizationKey)?.toString() ?: ""
				val import_export		 		= locEn?.get(StorageDomainTypeB.import_export.localizationKey)?.toString() ?: ""
				val image				 		= locEn?.get(StorageDomainTypeB.image.localizationKey)?.toString() ?: ""
				// val volume					= locEn?.get(StorageDomainTypeB.volume.localizationKey)?.toString() ?: ""
				// val unknown					= locEn?.get(StorageDomainTypeB.unknown.localizationKey)?.toString() ?: ""
				val managed_block_storage		= locEn?.get(StorageDomainTypeB.managed_block_storage.localizationKey)?.toString() ?: ""
				// val unmanaged				= locEn?.get(StorageDomainTypeB.unmanaged.localizationKey)?.toString() ?: ""
			}
		}
		//endregion: StorageDomainTypeL


		//region: StoragePoolStatusL
		object StoragePoolStatusL {
			object KR {
				val uninitialized				= locKr?.get(StoragePoolStatus.uninitialized.localizationKey)?.toString() ?: ""
				val up							= locKr?.get(StoragePoolStatus.up.localizationKey)?.toString() ?: ""
				val maintenance					= locKr?.get(StoragePoolStatus.maintenance.localizationKey)?.toString() ?: ""
				val not_operational				= locKr?.get(StoragePoolStatus.not_operational.localizationKey)?.toString() ?: ""
				val non_responsive				= locKr?.get(StoragePoolStatus.non_responsive.localizationKey)?.toString() ?: ""
				val contend						= locKr?.get(StoragePoolStatus.contend.localizationKey)?.toString() ?: ""
			}
			object EN {
				val uninitialized				= locEn?.get(StoragePoolStatus.uninitialized.localizationKey)?.toString() ?: ""
				val up							= locEn?.get(StoragePoolStatus.up.localizationKey)?.toString() ?: ""
				val maintenance					= locEn?.get(StoragePoolStatus.maintenance.localizationKey)?.toString() ?: ""
				val not_operational				= locEn?.get(StoragePoolStatus.not_operational.localizationKey)?.toString() ?: ""
				val non_responsive				= locEn?.get(StoragePoolStatus.non_responsive.localizationKey)?.toString() ?: ""
				val contend						= locEn?.get(StoragePoolStatus.contend.localizationKey)?.toString() ?: ""
			}
		}
		//endregion: StoragePoolStatusL

		//region: SwitchTypeL
		object SwitchTypeL {
			object KR {
				val legacy 			= locKr?.get(SwitchTypeB.legacy.localizationKey)?.toString() ?: ""
				val ovs				= locKr?.get(SwitchTypeB.ovs.localizationKey)?.toString() ?: ""
			}
			object EN {
				val legacy 			= locEn?.get(SwitchTypeB.legacy.localizationKey)?.toString() ?: ""
				val ovs				= locEn?.get(SwitchTypeB.ovs.localizationKey)?.toString() ?: ""
			}
		}
		//endregion: SwitchTypeL

		//region: VdsStatusL
		object VdsStatusL {
			object KR {
				val unassigned						= locKr?.get(VdsStatus.unassigned.localizationKey)?.toString() ?: ""
				val down							= locKr?.get(VdsStatus.down.localizationKey)?.toString() ?: ""
				val maintenance                     = locKr?.get(VdsStatus.maintenance.localizationKey)?.toString() ?: ""
				val up                              = locKr?.get(VdsStatus.up.localizationKey)?.toString() ?: ""
				val non_responsive                  = locKr?.get(VdsStatus.non_responsive.localizationKey)?.toString() ?: ""
				val error                           = locKr?.get(VdsStatus.error.localizationKey)?.toString() ?: ""
				val installing                      = locKr?.get(VdsStatus.installing.localizationKey)?.toString() ?: ""
				val install_failed                  = locKr?.get(VdsStatus.install_failed.localizationKey)?.toString() ?: ""
				val reboot                          = locKr?.get(VdsStatus.reboot.localizationKey)?.toString() ?: ""
				val preparing_for_maintenance       = locKr?.get(VdsStatus.preparing_for_maintenance.localizationKey)?.toString() ?: ""
				val non_operational                 = locKr?.get(VdsStatus.non_operational.localizationKey)?.toString() ?: ""
				val pending_approval                = locKr?.get(VdsStatus.pending_approval.localizationKey)?.toString() ?: ""
				val initializing                    = locKr?.get(VdsStatus.initializing.localizationKey)?.toString() ?: ""
				val connecting                      = locKr?.get(VdsStatus.connecting.localizationKey)?.toString() ?: ""
				val installing_os                   = locKr?.get(VdsStatus.installing_os.localizationKey)?.toString() ?: ""
				val kdumping                        = locKr?.get(VdsStatus.kdumping.localizationKey)?.toString() ?: ""
			}
			object EN {
				val unassigned						= locEn?.get(VdsStatus.unassigned.localizationKey)?.toString() ?: ""
				val down							= locEn?.get(VdsStatus.down.localizationKey)?.toString() ?: ""
				val maintenance                     = locEn?.get(VdsStatus.maintenance.localizationKey)?.toString() ?: ""
				val up                              = locEn?.get(VdsStatus.up.localizationKey)?.toString() ?: ""
				val non_responsive                  = locEn?.get(VdsStatus.non_responsive.localizationKey)?.toString() ?: ""
				val error                           = locEn?.get(VdsStatus.error.localizationKey)?.toString() ?: ""
				val installing                      = locEn?.get(VdsStatus.installing.localizationKey)?.toString() ?: ""
				val install_failed                  = locEn?.get(VdsStatus.install_failed.localizationKey)?.toString() ?: ""
				val reboot                          = locEn?.get(VdsStatus.reboot.localizationKey)?.toString() ?: ""
				val preparing_for_maintenance       = locEn?.get(VdsStatus.preparing_for_maintenance.localizationKey)?.toString() ?: ""
				val non_operational                 = locEn?.get(VdsStatus.non_operational.localizationKey)?.toString() ?: ""
				val pending_approval                = locEn?.get(VdsStatus.pending_approval.localizationKey)?.toString() ?: ""
				val initializing                    = locEn?.get(VdsStatus.initializing.localizationKey)?.toString() ?: ""
				val connecting                      = locEn?.get(VdsStatus.connecting.localizationKey)?.toString() ?: ""
				val installing_os                   = locEn?.get(VdsStatus.installing_os.localizationKey)?.toString() ?: ""
				val kdumping                        = locEn?.get(VdsStatus.kdumping.localizationKey)?.toString() ?: ""

			}
		}
		//endregion: VdsStatusL

		//region: VdsSpmStatusL
		object VdsSpmStatusL {
			object KR {
				val none 			= locKr?.get(VdsSpmStatus.none.localizationKey)?.toString() ?: ""
				val contending		= locKr?.get(VdsSpmStatus.contending.localizationKey)?.toString() ?: ""
				val spm 			= locKr?.get(VdsSpmStatus.spm.localizationKey)?.toString() ?: ""
			}
			object EN {
				val none 			= locEn?.get(VdsSpmStatus.none.localizationKey)?.toString() ?: ""
				val contending		= locEn?.get(VdsSpmStatus.contending.localizationKey)?.toString() ?: ""
				val spm 			= locEn?.get(VdsSpmStatus.spm.localizationKey)?.toString() ?: ""
			}
		}
		//endregion: VdsSpmStatusL


		//region: VmStatusL
		object VmStatusL {
			object KR {
				val down					= locKr?.get(VmStatusB.down.localizationKey)?.toString() ?: ""
				val image_illegal			= locKr?.get(VmStatusB.image_illegal.localizationKey)?.toString() ?: ""
				val image_locked			= locKr?.get(VmStatusB.image_locked.localizationKey)?.toString() ?: ""
				val migrating_from			= locKr?.get(VmStatusB.migrating_from.localizationKey)?.toString() ?: ""
				val migrating_to			= locKr?.get(VmStatusB.migrating_to.localizationKey)?.toString() ?: ""
				val not_responding			= locKr?.get(VmStatusB.not_responding.localizationKey)?.toString() ?: ""
				val paused			        = locKr?.get(VmStatusB.paused.localizationKey)?.toString() ?: ""
				val powering_down			= locKr?.get(VmStatusB.powering_down.localizationKey)?.toString() ?: ""
				val reboot_in_progress		= locKr?.get(VmStatusB.reboot_in_progress.localizationKey)?.toString() ?: ""
				val restoring_state			= locKr?.get(VmStatusB.restoring_state.localizationKey)?.toString() ?: ""
				val powering_up			    = locKr?.get(VmStatusB.powering_up.localizationKey)?.toString() ?: ""
				val saving_state			= locKr?.get(VmStatusB.saving_state.localizationKey)?.toString() ?: ""
				val suspended			    = locKr?.get(VmStatusB.suspended.localizationKey)?.toString() ?: ""
				val unassigned			    = locKr?.get(VmStatusB.unassigned.localizationKey)?.toString() ?: ""
				val unknown			        = locKr?.get(VmStatusB.unknown.localizationKey)?.toString() ?: ""
				val up			            = locKr?.get(VmStatusB.up.localizationKey)?.toString() ?: ""
				val wait_for_launch			= locKr?.get(VmStatusB.wait_for_launch.localizationKey)?.toString() ?: ""
			}
			object EN {
				val down					= locEn?.get(VmStatusB.down.localizationKey)?.toString() ?: ""
				val image_illegal			= locEn?.get(VmStatusB.image_illegal.localizationKey)?.toString() ?: ""
				val image_locked			= locEn?.get(VmStatusB.image_locked.localizationKey)?.toString() ?: ""
				val migrating_from			= locEn?.get(VmStatusB.migrating_from.localizationKey)?.toString() ?: ""
				val migrating_to			= locEn?.get(VmStatusB.migrating_to.localizationKey)?.toString() ?: ""
				val not_responding			= locEn?.get(VmStatusB.not_responding.localizationKey)?.toString() ?: ""
				val paused			        = locEn?.get(VmStatusB.paused.localizationKey)?.toString() ?: ""
				val powering_down			= locEn?.get(VmStatusB.powering_down.localizationKey)?.toString() ?: ""
				val reboot_in_progress		= locEn?.get(VmStatusB.reboot_in_progress.localizationKey)?.toString() ?: ""
				val restoring_state			= locEn?.get(VmStatusB.restoring_state.localizationKey)?.toString() ?: ""
				val powering_up			    = locEn?.get(VmStatusB.powering_up.localizationKey)?.toString() ?: ""
				val saving_state			= locEn?.get(VmStatusB.saving_state.localizationKey)?.toString() ?: ""
				val suspended			    = locEn?.get(VmStatusB.suspended.localizationKey)?.toString() ?: ""
				val unassigned			    = locEn?.get(VmStatusB.unassigned.localizationKey)?.toString() ?: ""
				val unknown			        = locEn?.get(VmStatusB.unknown.localizationKey)?.toString() ?: ""
				val up			            = locEn?.get(VmStatusB.up.localizationKey)?.toString() ?: ""
				val wait_for_launch			= locEn?.get(VmStatusB.wait_for_launch.localizationKey)?.toString() ?: ""
			}
		}
		//endregion: VmStatusL

		//region: VmTemplateStatusL
		object VmTemplateStatusL {
			object KR {
				val ok						= locKr?.get(VmTemplateStatusB.ok.localizationKey)?.toString() ?: ""
				val locked					= locKr?.get(VmTemplateStatusB.ok.localizationKey)?.toString() ?: ""
				val illegal					= locKr?.get(VmTemplateStatusB.ok.localizationKey)?.toString() ?: ""
			}
			object EN {
				val ok						= locEn?.get(VmTemplateStatusB.ok.localizationKey)?.toString() ?: ""
				val locked					= locEn?.get(VmTemplateStatusB.ok.localizationKey)?.toString() ?: ""
				val illegal					= locEn?.get(VmTemplateStatusB.ok.localizationKey)?.toString() ?: ""
			}
		}
		//endregion: VmTemplateStatusL

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

	fun findLocalizedName4AuditLogSeverity(type: AuditLogSeverity, loc: String = "kr"): String = when(type) {
		AuditLogSeverity.normal ->	if (loc == "kr") AuditLogSeverityL.KR.NORMAL else type.name
		AuditLogSeverity.warning -> if (loc == "kr") AuditLogSeverityL.KR.WARNING else type.name
		AuditLogSeverity.error ->	if (loc == "kr") AuditLogSeverityL.KR.ERROR else type.name
		AuditLogSeverity.alert ->	if (loc == "kr") AuditLogSeverityL.KR.ALERT else type.name
		else -> if (loc == "kr") "알 수 없음" else "Unknown"
	}

	fun findLocalizedName4ProviderType(type: ProviderType, loc: String = "kr"): String = when(type) {
		ProviderType.openstack_network ->	if (loc == "kr") ProviderTypeL.KR.OPENSTACK_NETWORK	else ProviderTypeL.EN.OPENSTACK_NETWORK
		ProviderType.foreman -> 			if (loc == "kr") ProviderTypeL.KR.FOREMAN 			else ProviderTypeL.EN.FOREMAN
		ProviderType.openstack_image -> 	if (loc == "kr") ProviderTypeL.KR.OPENSTACK_IMAGE	else ProviderTypeL.EN.OPENSTACK_IMAGE
		ProviderType.openstack_volume ->	if (loc == "kr") ProviderTypeL.KR.OPENSTACK_VOLUME	else ProviderTypeL.EN.OPENSTACK_VOLUME
		ProviderType.external_network -> 	if (loc == "kr") ProviderTypeL.KR.EXTERNAL_NETWORK	else ProviderTypeL.EN.EXTERNAL_NETWORK
		ProviderType.vmware -> 				if (loc == "kr") ProviderTypeL.KR.VMWARE			else ProviderTypeL.EN.VMWARE
		ProviderType.kvm ->					if (loc == "kr") ProviderTypeL.KR.KVM				else ProviderTypeL.EN.KVM
		ProviderType.xen ->					if (loc == "kr") ProviderTypeL.KR.XEN				else ProviderTypeL.EN.XEN
		ProviderType.kubevirt ->			if (loc == "kr") ProviderTypeL.KR.KUBEVIRT			else ProviderTypeL.EN.KUBEVIRT
	}

	fun findLocalizedName4BiosType(type: BiosTypeB, loc: String = "kr"): String = when(type) {
		BiosTypeB.i440fx_sea_bios ->		if (loc == "kr") BiosTypeL.KR.i440fx_sea_bios		else BiosTypeL.EN.i440fx_sea_bios
		BiosTypeB.q35_sea_bios -> 			if (loc == "kr") BiosTypeL.KR.q35_sea_bios 			else BiosTypeL.EN.q35_sea_bios
		BiosTypeB.cluster_default,			// TODO: 지금은 이 값으로 그냥 고정이지만 실제로 어디서 구하는지 찾아야 함
		BiosTypeB.q35_ovmf -> 				if (loc == "kr") BiosTypeL.KR.q35_ovmf				else BiosTypeL.EN.q35_ovmf
		BiosTypeB.q35_secure_boot ->		if (loc == "kr") BiosTypeL.KR.q35_secure_boot		else BiosTypeL.EN.q35_secure_boot
		else -> if (loc == "kr") "알 수 없음" else "Unknown"
	}

	fun findLocalizedName4DiskContentType(type: DiskContentType, loc: String = "kr"): String = when(type) {
		DiskContentType.data -> 							if (loc == "kr") DiskContentTypeL.KR.DATA else DiskContentTypeL.EN.DATA
		DiskContentType.ovf_store -> 						if (loc == "kr") DiskContentTypeL.KR.OVF_STORE else DiskContentTypeL.EN.OVF_STORE
		DiskContentType.memory_dump_volume -> 				if (loc == "kr") DiskContentTypeL.KR.MEMORY_DUMP_VOLUME else DiskContentTypeL.EN.MEMORY_DUMP_VOLUME
		DiskContentType.memory_metadata_volume -> 			if (loc == "kr") DiskContentTypeL.KR.MEMORY_METADATA_VOLUME else DiskContentTypeL.EN.MEMORY_METADATA_VOLUME
		DiskContentType.iso -> 								if (loc == "kr") DiskContentTypeL.KR.ISO else DiskContentTypeL.EN.ISO
		DiskContentType.hosted_engine -> 					if (loc == "kr") DiskContentTypeL.KR.HOSTED_ENGINE else DiskContentTypeL.EN.HOSTED_ENGINE
		DiskContentType.hosted_engine_sanlock -> 			if (loc == "kr") DiskContentTypeL.KR.HOSTED_ENGINE_SANLOCK else DiskContentTypeL.EN.HOSTED_ENGINE_SANLOCK
		DiskContentType.hosted_engine_metadata -> 			if (loc == "kr") DiskContentTypeL.KR.HOSTED_ENGINE_METADATA else DiskContentTypeL.EN.HOSTED_ENGINE_METADATA
		DiskContentType.hosted_engine_configuration -> 		if (loc == "kr") DiskContentTypeL.KR.HOSTED_ENGINE_CONFIGURATION else DiskContentTypeL.EN.HOSTED_ENGINE_CONFIGURATION
		DiskContentType.backup_scratch -> 					if (loc == "kr") DiskContentTypeL.KR.BACKUP_SCRATCH else DiskContentTypeL.EN.BACKUP_SCRATCH
		DiskContentType.unknown -> 							if (loc == "kr") DiskContentTypeL.KR.UNKNOWN else DiskContentTypeL.EN.UNKNOWN
	}

	fun findLocalizedName4DiskInterface(type: DiskInterface, loc: String = "kr"): String =
		when(type) {
			DiskInterface.ide -> 			if (loc == "kr") DiskInterfaceL.KR.IDE else DiskInterfaceL.EN.IDE
			DiskInterface.virtio_scsi -> 	if (loc == "kr") DiskInterfaceL.KR.VirtIO_SCSI else DiskInterfaceL.EN.VirtIO_SCSI
			DiskInterface.virtio -> 		if (loc == "kr") DiskInterfaceL.KR.VirtIO else DiskInterfaceL.EN.VirtIO
			DiskInterface.spapr_vscsi -> 	if (loc == "kr") DiskInterfaceL.KR.SPAPR_VSCSI else DiskInterfaceL.EN.SPAPR_VSCSI
			DiskInterface.sata -> 			if (loc == "kr") DiskInterfaceL.KR.SATA else DiskInterfaceL.EN.SATA
		}

	fun findLocalizedName4DisplayType(type: DisplayTypeB, loc: String = "kr"): String = when(type) {
		DisplayTypeB.cirrus ->					if (loc == "kr") DisplayTypeL.KR.cirrus else DisplayTypeL.EN.cirrus
		DisplayTypeB.qxl ->						if (loc == "kr") DisplayTypeL.KR.qxl else DisplayTypeL.EN.qxl
		DisplayTypeB.vga ->						if (loc == "kr") DisplayTypeL.KR.vga else DisplayTypeL.EN.vga
		DisplayTypeB.bochs -> 					if (loc == "kr") DisplayTypeL.KR.bochs else DisplayTypeL.EN.bochs
		DisplayTypeB.none ->					if (loc == "kr") DisplayTypeL.KR.none else DisplayTypeL.EN.none
	}

	fun findLocalizedName4FipsMode(type: FipsModeB, loc: String = "kr"): String = when(type) {
		FipsModeB.undefined ->					if (loc == "kr") FipsModeL.KR.undefined else FipsModeL.EN.undefined
		FipsModeB.enabled ->					if (loc == "kr") FipsModeL.KR.enabled else FipsModeL.EN.enabled
		FipsModeB.disabled ->					if (loc == "kr") FipsModeL.KR.disabled else FipsModeL.EN.disabled
	}

	fun findLocalizedName4MigrationBandwidthLimitType(type: MigrationBandwidthLimitType, loc: String = "kr"): String = when(type) {
		MigrationBandwidthLimitType.auto ->					if (loc == "kr") MigrationBandwidthLimitTypeL.KR.auto else MigrationBandwidthLimitTypeL.EN.auto
		MigrationBandwidthLimitType.custom ->				if (loc == "kr") MigrationBandwidthLimitTypeL.KR.custom else MigrationBandwidthLimitTypeL.EN.custom
		MigrationBandwidthLimitType.hypervisor_default ->	if (loc == "kr") MigrationBandwidthLimitTypeL.KR.hypervisor_default else MigrationBandwidthLimitTypeL.EN.hypervisor_default
	}

	fun findLocalizedName4MigrationSupport(type: MigrationSupport, loc: String = "kr"): String = when(type) {
		MigrationSupport.migratable ->				if (loc == "kr") MigrationSupportL.KR.migratable else MigrationSupportL.EN.migratable
		MigrationSupport.user_migratable ->			if (loc == "kr") MigrationSupportL.KR.user_migratable else MigrationSupportL.EN.user_migratable
		MigrationSupport.pinned -> 					if (loc == "kr") MigrationSupportL.KR.pinned else MigrationSupportL.EN.pinned
		else -> if (loc == "kr") "알 수 없음" else "Unknown"
	}

	fun findLocalizedName4MigrateOnErrorB(type: MigrateOnErrorB, loc: String = "kr"): String = when(type) {
		MigrateOnErrorB.do_not_migrate ->				if (loc == "kr") MigrateOnErrorL.KR.do_not_migrate else MigrateOnErrorL.EN.do_not_migrate
		MigrateOnErrorB.migrate ->		                if (loc == "kr") MigrateOnErrorL.KR.migrate else MigrateOnErrorL.EN.migrate
		MigrateOnErrorB.migrate_highly_available ->		if (loc == "kr") MigrateOnErrorL.KR.migrate_highly_available else MigrateOnErrorL.EN.migrate_highly_available
	}

	fun findLocalizedName4QuotaEnforcementType(type: QuotaEnforcementType, loc: String = "kr"): String = when(type) {
		QuotaEnforcementType.disabled -> 				if (loc == "kr") QuotaEnforcementTypeL.KR.disabled else QuotaEnforcementTypeL.EN.disabled
		QuotaEnforcementType.audit -> 					if (loc == "kr") QuotaEnforcementTypeL.KR.audit else QuotaEnforcementTypeL.EN.audit
		QuotaEnforcementType.enabled ->					if (loc == "kr") QuotaEnforcementTypeL.KR.enabled else QuotaEnforcementTypeL.EN.enabled
	}

	fun findLocalizedName4SELinuxMode(type: SELinuxModeB, loc: String = "kr"): String = when(type) {
		SELinuxModeB.enforcing ->			if (loc == "kr") SELinuxModeL.KR.enforcing else SELinuxModeL.KR.enforcing
		SELinuxModeB.permissive ->			if (loc == "kr") SELinuxModeL.KR.permissive else SELinuxModeL.KR.permissive
		SELinuxModeB.disabled ->			if (loc == "kr") SELinuxModeL.KR.disabled else SELinuxModeL.KR.disabled
	}

	fun findLocalizedName4StorageDomainType(type: StorageDomainTypeB, loc: String = "kr"): String = when(type) {
		StorageDomainTypeB.master ->				 	if (loc == "kr") StorageDomainTypeL.KR.master else StorageDomainTypeL.EN.master
		StorageDomainTypeB.data ->				 		if (loc == "kr") StorageDomainTypeL.KR.data else StorageDomainTypeL.EN.data
		StorageDomainTypeB.iso ->					 	if (loc == "kr") StorageDomainTypeL.KR.iso else StorageDomainTypeL.EN.iso
		StorageDomainTypeB.import_export ->		 		if (loc == "kr") StorageDomainTypeL.KR.import_export else StorageDomainTypeL.EN.import_export
		StorageDomainTypeB.image ->				 		if (loc == "kr") StorageDomainTypeL.KR.image else StorageDomainTypeL.EN.image
		// StorageDomainTypeB.volume ->					if (loc == "kr") StorageDomainTypeL.KR.volume else StorageDomainTypeL.EN.volume
		// StorageDomainTypeB.unknown -> 				if (loc == "kr") StorageDomainTypeL.KR.unknown else StorageDomainTypeL.EN.unknown
		StorageDomainTypeB.managed_block_storage ->		if (loc == "kr") StorageDomainTypeL.KR.managed_block_storage else StorageDomainTypeL.EN.managed_block_storage
		// StorageDomainTypeB.unmanaged ->				if (loc == "kr") StorageDomainTypeL.KR.unmanaged else StorageDomainTypeL.EN.unmanaged
		else -> if (loc == "kr") "알 수 없음" else "Unknown"
	}

	fun findLocalizedName4StoragePoolStatus(type: StoragePoolStatus, loc: String = "kr"): String = when(type) {
		StoragePoolStatus.uninitialized -> 				if (loc == "kr") StoragePoolStatusL.KR.uninitialized else StoragePoolStatusL.EN.uninitialized
		StoragePoolStatus.up -> 						if (loc == "kr") StoragePoolStatusL.KR.up else StoragePoolStatusL.EN.up
		StoragePoolStatus.maintenance -> 				if (loc == "kr") StoragePoolStatusL.KR.maintenance else StoragePoolStatusL.EN.maintenance
		StoragePoolStatus.not_operational -> 			if (loc == "kr") StoragePoolStatusL.KR.not_operational else StoragePoolStatusL.EN.not_operational
		StoragePoolStatus.non_responsive -> 			if (loc == "kr") StoragePoolStatusL.KR.non_responsive else StoragePoolStatusL.EN.non_responsive
		StoragePoolStatus.contend -> 				    if (loc == "kr") StoragePoolStatusL.KR.contend else StoragePoolStatusL.EN.contend
	}

	fun findLocalizedName4VmStatusB(type: VmStatusB, loc: String = "kr"): String = when(type) {
		VmStatusB.down ->			        if (loc == "kr") VmStatusL.KR.down else VmStatusL.EN.down
		VmStatusB.image_illegal ->			if (loc == "kr") VmStatusL.KR.image_illegal else VmStatusL.EN.image_illegal
		VmStatusB.image_locked ->			if (loc == "kr") VmStatusL.KR.image_locked else VmStatusL.EN.image_locked
		VmStatusB.migrating_from ->			if (loc == "kr") VmStatusL.KR.migrating_from else VmStatusL.EN.migrating_from
		VmStatusB.migrating_to ->			if (loc == "kr") VmStatusL.KR.migrating_to else VmStatusL.EN.migrating_to
		VmStatusB.not_responding ->			if (loc == "kr") VmStatusL.KR.not_responding else VmStatusL.EN.not_responding
		VmStatusB.paused ->			        if (loc == "kr") VmStatusL.KR.paused else VmStatusL.EN.paused
		VmStatusB.powering_down ->			if (loc == "kr") VmStatusL.KR.powering_down else VmStatusL.EN.powering_down
		VmStatusB.reboot_in_progress ->		if (loc == "kr") VmStatusL.KR.reboot_in_progress else VmStatusL.EN.reboot_in_progress
		VmStatusB.restoring_state ->		if (loc == "kr") VmStatusL.KR.restoring_state else VmStatusL.EN.restoring_state
		VmStatusB.powering_up ->			if (loc == "kr") VmStatusL.KR.powering_up else VmStatusL.EN.powering_up
		VmStatusB.saving_state ->			if (loc == "kr") VmStatusL.KR.saving_state else VmStatusL.EN.saving_state
		VmStatusB.suspended ->			    if (loc == "kr") VmStatusL.KR.suspended else VmStatusL.EN.suspended
		VmStatusB.unassigned ->			    if (loc == "kr") VmStatusL.KR.unassigned else VmStatusL.EN.unassigned
		VmStatusB.up ->			            if (loc == "kr") VmStatusL.KR.up else VmStatusL.EN.up
		VmStatusB.wait_for_launch ->		if (loc == "kr") VmStatusL.KR.wait_for_launch else VmStatusL.EN.wait_for_launch
		VmStatusB.unknown ->				if (loc == "kr") VmStatusL.KR.unknown else VmStatusL.EN.unknown
	}

	fun findLocalizedName4SwitchType(type: SwitchTypeB, loc: String = "kr"): String = when(type) {
		SwitchTypeB.legacy -> 		if (loc == "kr") SwitchTypeL.KR.legacy else SwitchTypeL.EN.legacy
		SwitchTypeB.ovs ->			if (loc == "kr") SwitchTypeL.KR.ovs else SwitchTypeL.EN.ovs
	}

	fun findLocalizedName4VdsStatus(type: VdsStatus, loc: String = "kr"): String = when(type) {
		VdsStatus.unassigned ->                     if (loc == "kr") VdsStatusL.KR.unassigned else VdsStatusL.EN.unassigned
		VdsStatus.down ->                           if (loc == "kr") VdsStatusL.KR.down else VdsStatusL.EN.down
		VdsStatus.maintenance ->                    if (loc == "kr") VdsStatusL.KR.maintenance else VdsStatusL.EN.maintenance
		VdsStatus.up ->                             if (loc == "kr") VdsStatusL.KR.up else VdsStatusL.EN.up
		VdsStatus.non_responsive ->                 if (loc == "kr") VdsStatusL.KR.non_responsive else VdsStatusL.EN.non_responsive
		VdsStatus.error ->                          if (loc == "kr") VdsStatusL.KR.error else VdsStatusL.EN.error
		VdsStatus.installing ->                     if (loc == "kr") VdsStatusL.KR.installing else VdsStatusL.EN.installing
		VdsStatus.install_failed ->                 if (loc == "kr") VdsStatusL.KR.install_failed else VdsStatusL.EN.install_failed
		VdsStatus.reboot ->							if (loc == "kr") VdsStatusL.KR.reboot else VdsStatusL.EN.reboot
		VdsStatus.preparing_for_maintenance ->		if (loc == "kr") VdsStatusL.KR.preparing_for_maintenance else VdsStatusL.EN.preparing_for_maintenance
		VdsStatus.non_operational ->                if (loc == "kr") VdsStatusL.KR.non_operational else VdsStatusL.EN.non_operational
		VdsStatus.pending_approval ->               if (loc == "kr") VdsStatusL.KR.pending_approval else VdsStatusL.EN.pending_approval
		VdsStatus.initializing ->                   if (loc == "kr") VdsStatusL.KR.initializing else VdsStatusL.EN.initializing
		VdsStatus.connecting ->                     if (loc == "kr") VdsStatusL.KR.connecting else VdsStatusL.EN.connecting
		VdsStatus.installing_os ->                  if (loc == "kr") VdsStatusL.KR.installing_os else VdsStatusL.EN.installing_os
		VdsStatus.kdumping ->                       if (loc == "kr") VdsStatusL.KR.kdumping else VdsStatusL.EN.kdumping
		else -> if (loc == "kr") "알 수 없음" else "Unknown"
	}

	fun findLocalizedName4VdsSpmStatus(type: VdsSpmStatus, loc: String = "kr"): String = when(type) {
		VdsSpmStatus.none ->			if (loc == "kr") VdsSpmStatusL.KR.none else VdsSpmStatusL.EN.none
		VdsSpmStatus.contending ->		if (loc == "kr") VdsSpmStatusL.KR.contending else VdsSpmStatusL.EN.contending
		VdsSpmStatus.spm ->				if (loc == "kr") VdsSpmStatusL.KR.spm else VdsSpmStatusL.EN.spm
	}

	fun findLocalizedName4VmTemplateStatusB(type: VmTemplateStatusB, loc: String = "kr"): String = when(type) {
		VmTemplateStatusB.ok ->				if (loc == "kr") VmTemplateStatusL.KR.ok else VmTemplateStatusL.EN.ok
		VmTemplateStatusB.locked ->			if (loc == "kr") VmTemplateStatusL.KR.locked else VmTemplateStatusL.EN.locked
		VmTemplateStatusB.illegal ->		if (loc == "kr") VmTemplateStatusL.KR.illegal else VmTemplateStatusL.EN.illegal
		else -> if (loc == "kr") "알 수 없음" else "Unknown"
	}

	fun findLocalizedName4VmType(type: VmTypeB, loc: String = "kr"): String = when(type) {
		VmTypeB.desktop ->				if (loc == "kr") VmTypeL.KR.Desktop else VmTypeL.EN.Desktop
		VmTypeB.server ->				if (loc == "kr") VmTypeL.KR.Server else VmTypeL.EN.Server
		VmTypeB.high_performance ->		if (loc == "kr") VmTypeL.KR.HighPerformance else VmTypeL.EN.HighPerformance
		else -> if (loc == "kr") "알 수 없음" else "Unknown"
	}

	fun findLocalizedName4VmEntityType(type: VmEntityType, loc: String = "kr"): String = when(type) {
		VmEntityType.VM ->						if (loc == "kr") VmEntityTypeL.KR.VM else VmEntityTypeL.EN.VM
		VmEntityType.TEMPLATE ->				if (loc == "kr") VmEntityTypeL.KR.TEMPLATE else VmEntityTypeL.EN.TEMPLATE
		VmEntityType.INSTANCE_TYPE ->			if (loc == "kr") VmEntityTypeL.KR.INSTANCE_TYPE else VmEntityTypeL.EN.INSTANCE_TYPE
		VmEntityType.IMAGE_TYPE -> 				if (loc == "kr") VmEntityTypeL.KR.IMAGE_TYPE else VmEntityTypeL.EN.IMAGE_TYPE
		else -> if (loc == "kr") "알 수 없음" else "Unknown"
	}
}
