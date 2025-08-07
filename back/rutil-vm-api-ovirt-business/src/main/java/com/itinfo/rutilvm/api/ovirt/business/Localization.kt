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
		//region: ActionGroupL
		object ActionGroupL {
			object KR {
				val ACCESS_IMAGE_STORAGE 					= locKr?.get(ActionGroup.ACCESS_IMAGE_STORAGE.localizationKey)?.toString() ?: ""
				val ADD_USERS_AND_GROUPS_FROM_DIRECTORY     = locKr?.get(ActionGroup.ADD_USERS_AND_GROUPS_FROM_DIRECTORY.localizationKey)?.toString() ?: ""
				val ASSIGN_CLUSTER_NETWORK                  = locKr?.get(ActionGroup.ASSIGN_CLUSTER_NETWORK.localizationKey)?.toString() ?: ""
				val ASSIGN_CPU_PROFILE                      = locKr?.get(ActionGroup.ASSIGN_CPU_PROFILE.localizationKey)?.toString() ?: ""
				val ATTACH_DISK                             = locKr?.get(ActionGroup.ATTACH_DISK.localizationKey)?.toString() ?: ""
				val ATTACH_DISK_PROFILE                     = locKr?.get(ActionGroup.ATTACH_DISK_PROFILE.localizationKey)?.toString() ?: ""
				val AUDIT_LOG_MANAGEMENT                    = locKr?.get(ActionGroup.AUDIT_LOG_MANAGEMENT.localizationKey)?.toString() ?: ""
				val BACKUP_DISK                             = locKr?.get(ActionGroup.BACKUP_DISK.localizationKey)?.toString() ?: ""
				val BOOKMARK_MANAGEMENT                     = locKr?.get(ActionGroup.BOOKMARK_MANAGEMENT.localizationKey)?.toString() ?: ""
				val CHANGE_VM_CD                            = locKr?.get(ActionGroup.CHANGE_VM_CD.localizationKey)?.toString() ?: ""
				val CHANGE_VM_CUSTOM_PROPERTIES             = locKr?.get(ActionGroup.CHANGE_VM_CUSTOM_PROPERTIES.localizationKey)?.toString() ?: ""
				val CONFIGURE_CLUSTER_NETWORK               = locKr?.get(ActionGroup.CONFIGURE_CLUSTER_NETWORK.localizationKey)?.toString() ?: ""
				val CONFIGURE_DISK_STORAGE                  = locKr?.get(ActionGroup.CONFIGURE_DISK_STORAGE.localizationKey)?.toString() ?: ""
				val CONFIGURE_ENGINE                        = locKr?.get(ActionGroup.CONFIGURE_ENGINE.localizationKey)?.toString() ?: ""
				val CONFIGURE_HOST_NETWORK                  = locKr?.get(ActionGroup.CONFIGURE_HOST_NETWORK.localizationKey)?.toString() ?: ""
				val CONFIGURE_MAC_POOL                      = locKr?.get(ActionGroup.CONFIGURE_MAC_POOL.localizationKey)?.toString() ?: ""
				val CONFIGURE_NETWORK_VNIC_PROFILE          = locKr?.get(ActionGroup.CONFIGURE_NETWORK_VNIC_PROFILE.localizationKey)?.toString() ?: ""
				val CONFIGURE_SCSI_GENERIC_IO               = locKr?.get(ActionGroup.CONFIGURE_SCSI_GENERIC_IO.localizationKey)?.toString() ?: ""
				val CONFIGURE_STORAGE_DISK_PROFILE          = locKr?.get(ActionGroup.CONFIGURE_STORAGE_DISK_PROFILE.localizationKey)?.toString() ?: ""
				val CONFIGURE_STORAGE_POOL_NETWORK          = locKr?.get(ActionGroup.CONFIGURE_STORAGE_POOL_NETWORK.localizationKey)?.toString() ?: ""
				val CONFIGURE_TEMPLATE_NETWORK              = locKr?.get(ActionGroup.CONFIGURE_TEMPLATE_NETWORK.localizationKey)?.toString() ?: ""
				val CONFIGURE_VM_NETWORK                    = locKr?.get(ActionGroup.CONFIGURE_VM_NETWORK.localizationKey)?.toString() ?: ""
				val CONFIGURE_VM_STORAGE                    = locKr?.get(ActionGroup.CONFIGURE_VM_STORAGE.localizationKey)?.toString() ?: ""
				val CONNECT_TO_SERIAL_CONSOLE               = locKr?.get(ActionGroup.CONNECT_TO_SERIAL_CONSOLE.localizationKey)?.toString() ?: ""
				val CONNECT_TO_VM                           = locKr?.get(ActionGroup.CONNECT_TO_VM.localizationKey)?.toString() ?: ""
				val COPY_TEMPLATE                           = locKr?.get(ActionGroup.COPY_TEMPLATE.localizationKey)?.toString() ?: ""
				val CREATE_CLUSTER                          = locKr?.get(ActionGroup.CREATE_CLUSTER.localizationKey)?.toString() ?: ""
				val CREATE_CPU_PROFILE                      = locKr?.get(ActionGroup.CREATE_CPU_PROFILE.localizationKey)?.toString() ?: ""
				val CREATE_DISK                             = locKr?.get(ActionGroup.CREATE_DISK.localizationKey)?.toString() ?: ""
				val CREATE_GLUSTER_VOLUME                   = locKr?.get(ActionGroup.CREATE_GLUSTER_VOLUME.localizationKey)?.toString() ?: ""
				val CREATE_HOST                             = locKr?.get(ActionGroup.CREATE_HOST.localizationKey)?.toString() ?: ""
				val CREATE_INSTANCE                         = locKr?.get(ActionGroup.CREATE_INSTANCE.localizationKey)?.toString() ?: ""
				val CREATE_MAC_POOL                         = locKr?.get(ActionGroup.CREATE_MAC_POOL.localizationKey)?.toString() ?: ""
				val CREATE_NETWORK_VNIC_PROFILE             = locKr?.get(ActionGroup.CREATE_NETWORK_VNIC_PROFILE.localizationKey)?.toString() ?: ""
				val CREATE_STORAGE_DISK_PROFILE             = locKr?.get(ActionGroup.CREATE_STORAGE_DISK_PROFILE.localizationKey)?.toString() ?: ""
				val CREATE_STORAGE_DOMAIN                   = locKr?.get(ActionGroup.CREATE_STORAGE_DOMAIN.localizationKey)?.toString() ?: ""
				val CREATE_STORAGE_POOL                     = locKr?.get(ActionGroup.CREATE_STORAGE_POOL.localizationKey)?.toString() ?: ""
				val CREATE_STORAGE_POOL_NETWORK             = locKr?.get(ActionGroup.CREATE_STORAGE_POOL_NETWORK.localizationKey)?.toString() ?: ""
				val CREATE_TEMPLATE                         = locKr?.get(ActionGroup.CREATE_TEMPLATE.localizationKey)?.toString() ?: ""
				val CREATE_VM                               = locKr?.get(ActionGroup.CREATE_VM.localizationKey)?.toString() ?: ""
				val CREATE_VM_POOL                          = locKr?.get(ActionGroup.CREATE_VM_POOL.localizationKey)?.toString() ?: ""
				val DELETE_CLUSTER                          = locKr?.get(ActionGroup.DELETE_CLUSTER.localizationKey)?.toString() ?: ""
				val DELETE_CPU_PROFILE                      = locKr?.get(ActionGroup.DELETE_CPU_PROFILE.localizationKey)?.toString() ?: ""
				val DELETE_DISK                             = locKr?.get(ActionGroup.DELETE_DISK.localizationKey)?.toString() ?: ""
				val DELETE_GLUSTER_VOLUME                   = locKr?.get(ActionGroup.DELETE_GLUSTER_VOLUME.localizationKey)?.toString() ?: ""
				val DELETE_HOST                             = locKr?.get(ActionGroup.DELETE_HOST.localizationKey)?.toString() ?: ""
				val DELETE_MAC_POOL                         = locKr?.get(ActionGroup.DELETE_MAC_POOL.localizationKey)?.toString() ?: ""
				val DELETE_NETWORK_VNIC_PROFILE             = locKr?.get(ActionGroup.DELETE_NETWORK_VNIC_PROFILE.localizationKey)?.toString() ?: ""
				val DELETE_STORAGE_DISK_PROFILE             = locKr?.get(ActionGroup.DELETE_STORAGE_DISK_PROFILE.localizationKey)?.toString() ?: ""
				val DELETE_STORAGE_DOMAIN                   = locKr?.get(ActionGroup.DELETE_STORAGE_DOMAIN.localizationKey)?.toString() ?: ""
				val DELETE_STORAGE_POOL                     = locKr?.get(ActionGroup.DELETE_STORAGE_POOL.localizationKey)?.toString() ?: ""
				val DELETE_STORAGE_POOL_NETWORK             = locKr?.get(ActionGroup.DELETE_STORAGE_POOL_NETWORK.localizationKey)?.toString() ?: ""
				val DELETE_TEMPLATE                         = locKr?.get(ActionGroup.DELETE_TEMPLATE.localizationKey)?.toString() ?: ""
				val DELETE_VM                               = locKr?.get(ActionGroup.DELETE_VM.localizationKey)?.toString() ?: ""
				val DELETE_VM_POOL                          = locKr?.get(ActionGroup.DELETE_VM_POOL.localizationKey)?.toString() ?: ""
				val DISK_LIVE_STORAGE_MIGRATION             = locKr?.get(ActionGroup.DISK_LIVE_STORAGE_MIGRATION.localizationKey)?.toString() ?: ""
				val EDIT_ADMIN_TEMPLATE_PROPERTIES          = locKr?.get(ActionGroup.EDIT_ADMIN_TEMPLATE_PROPERTIES.localizationKey)?.toString() ?: ""
				val EDIT_ADMIN_VM_PROPERTIES                = locKr?.get(ActionGroup.EDIT_ADMIN_VM_PROPERTIES.localizationKey)?.toString() ?: ""
				val EDIT_CLUSTER_CONFIGURATION              = locKr?.get(ActionGroup.EDIT_CLUSTER_CONFIGURATION.localizationKey)?.toString() ?: ""
				val EDIT_DISK_PROPERTIES                    = locKr?.get(ActionGroup.EDIT_DISK_PROPERTIES.localizationKey)?.toString() ?: ""
				val EDIT_HOST_CONFIGURATION                 = locKr?.get(ActionGroup.EDIT_HOST_CONFIGURATION.localizationKey)?.toString() ?: ""
				val EDIT_MAC_POOL                           = locKr?.get(ActionGroup.EDIT_MAC_POOL.localizationKey)?.toString() ?: ""
				val EDIT_STORAGE_DOMAIN_CONFIGURATION       = locKr?.get(ActionGroup.EDIT_STORAGE_DOMAIN_CONFIGURATION.localizationKey)?.toString() ?: ""
				val EDIT_STORAGE_POOL_CONFIGURATION         = locKr?.get(ActionGroup.EDIT_STORAGE_POOL_CONFIGURATION.localizationKey)?.toString() ?: ""
				val EDIT_TEMPLATE_PROPERTIES                = locKr?.get(ActionGroup.EDIT_TEMPLATE_PROPERTIES.localizationKey)?.toString() ?: ""
				val EDIT_VM_POOL_CONFIGURATION              = locKr?.get(ActionGroup.EDIT_VM_POOL_CONFIGURATION.localizationKey)?.toString() ?: ""
				val EDIT_VM_PROPERTIES                      = locKr?.get(ActionGroup.EDIT_VM_PROPERTIES.localizationKey)?.toString() ?: ""
				val EVENT_NOTIFICATION_MANAGEMENT           = locKr?.get(ActionGroup.EVENT_NOTIFICATION_MANAGEMENT.localizationKey)?.toString() ?: ""
				val HIBERNATE_VM                            = locKr?.get(ActionGroup.HIBERNATE_VM.localizationKey)?.toString() ?: ""
				val IMPORT_EXPORT_VM                        = locKr?.get(ActionGroup.IMPORT_EXPORT_VM.localizationKey)?.toString() ?: ""
				val LOGIN                                   = locKr?.get(ActionGroup.LOGIN.localizationKey)?.toString() ?: ""
				val MANIPULATE_AFFINITY_GROUPS              = locKr?.get(ActionGroup.MANIPULATE_AFFINITY_GROUPS.localizationKey)?.toString() ?: ""
				val MANIPULATE_GLUSTER_HOOK                 = locKr?.get(ActionGroup.MANIPULATE_GLUSTER_HOOK.localizationKey)?.toString() ?: ""
				val MANIPULATE_GLUSTER_SERVICE              = locKr?.get(ActionGroup.MANIPULATE_GLUSTER_SERVICE.localizationKey)?.toString() ?: ""
				val MANIPULATE_GLUSTER_VOLUME               = locKr?.get(ActionGroup.MANIPULATE_GLUSTER_VOLUME.localizationKey)?.toString() ?: ""
				val MANIPULATE_HOST                         = locKr?.get(ActionGroup.MANIPULATE_HOST.localizationKey)?.toString() ?: ""
				val MANIPULATE_PERMISSIONS                  = locKr?.get(ActionGroup.MANIPULATE_PERMISSIONS.localizationKey)?.toString() ?: ""
				val MANIPULATE_ROLES                        = locKr?.get(ActionGroup.MANIPULATE_ROLES.localizationKey)?.toString() ?: ""
				val MANIPULATE_STORAGE_DOMAIN               = locKr?.get(ActionGroup.MANIPULATE_STORAGE_DOMAIN.localizationKey)?.toString() ?: ""
				val MANIPULATE_USERS                        = locKr?.get(ActionGroup.MANIPULATE_USERS.localizationKey)?.toString() ?: ""
				val MANIPULATE_VM_SNAPSHOTS                 = locKr?.get(ActionGroup.MANIPULATE_VM_SNAPSHOTS.localizationKey)?.toString() ?: ""
				val MIGRATE_VM                              = locKr?.get(ActionGroup.MIGRATE_VM.localizationKey)?.toString() ?: ""
				val MOVE_VM                                 = locKr?.get(ActionGroup.MOVE_VM.localizationKey)?.toString() ?: ""
				val REBOOT_VM                               = locKr?.get(ActionGroup.REBOOT_VM.localizationKey)?.toString() ?: ""
				val RECONNECT_TO_VM                         = locKr?.get(ActionGroup.RECONNECT_TO_VM.localizationKey)?.toString() ?: ""
				val RESET_VM                                = locKr?.get(ActionGroup.RESET_VM.localizationKey)?.toString() ?: ""
				val RUN_VM                                  = locKr?.get(ActionGroup.RUN_VM.localizationKey)?.toString() ?: ""
				val SHUT_DOWN_VM                            = locKr?.get(ActionGroup.SHUT_DOWN_VM.localizationKey)?.toString() ?: ""
				val SPARSIFY_DISK                           = locKr?.get(ActionGroup.SPARSIFY_DISK.localizationKey)?.toString() ?: ""
				val STOP_VM                                 = locKr?.get(ActionGroup.STOP_VM.localizationKey)?.toString() ?: ""
				val TAG_MANAGEMENT                          = locKr?.get(ActionGroup.TAG_MANAGEMENT.localizationKey)?.toString() ?: ""
				val UPDATE_CPU_PROFILE                      = locKr?.get(ActionGroup.UPDATE_CPU_PROFILE.localizationKey)?.toString() ?: ""
				val VM_POOL_BASIC_OPERATIONS                = locKr?.get(ActionGroup.VM_POOL_BASIC_OPERATIONS.localizationKey)?.toString() ?: ""
			}
			object EN {
				val ACCESS_IMAGE_STORAGE 					= locEn?.get(ActionGroup.ACCESS_IMAGE_STORAGE.localizationKey)?.toString() ?: ""
				val ADD_USERS_AND_GROUPS_FROM_DIRECTORY     = locEn?.get(ActionGroup.ADD_USERS_AND_GROUPS_FROM_DIRECTORY.localizationKey)?.toString() ?: ""
				val ASSIGN_CLUSTER_NETWORK                  = locEn?.get(ActionGroup.ASSIGN_CLUSTER_NETWORK.localizationKey)?.toString() ?: ""
				val ASSIGN_CPU_PROFILE                      = locEn?.get(ActionGroup.ASSIGN_CPU_PROFILE.localizationKey)?.toString() ?: ""
				val ATTACH_DISK                             = locEn?.get(ActionGroup.ATTACH_DISK.localizationKey)?.toString() ?: ""
				val ATTACH_DISK_PROFILE                     = locEn?.get(ActionGroup.ATTACH_DISK_PROFILE.localizationKey)?.toString() ?: ""
				val AUDIT_LOG_MANAGEMENT                    = locEn?.get(ActionGroup.AUDIT_LOG_MANAGEMENT.localizationKey)?.toString() ?: ""
				val BACKUP_DISK                             = locEn?.get(ActionGroup.BACKUP_DISK.localizationKey)?.toString() ?: ""
				val BOOKMARK_MANAGEMENT                     = locEn?.get(ActionGroup.BOOKMARK_MANAGEMENT.localizationKey)?.toString() ?: ""
				val CHANGE_VM_CD                            = locEn?.get(ActionGroup.CHANGE_VM_CD.localizationKey)?.toString() ?: ""
				val CHANGE_VM_CUSTOM_PROPERTIES             = locEn?.get(ActionGroup.CHANGE_VM_CUSTOM_PROPERTIES.localizationKey)?.toString() ?: ""
				val CONFIGURE_CLUSTER_NETWORK               = locEn?.get(ActionGroup.CONFIGURE_CLUSTER_NETWORK.localizationKey)?.toString() ?: ""
				val CONFIGURE_DISK_STORAGE                  = locEn?.get(ActionGroup.CONFIGURE_DISK_STORAGE.localizationKey)?.toString() ?: ""
				val CONFIGURE_ENGINE                        = locEn?.get(ActionGroup.CONFIGURE_ENGINE.localizationKey)?.toString() ?: ""
				val CONFIGURE_HOST_NETWORK                  = locEn?.get(ActionGroup.CONFIGURE_HOST_NETWORK.localizationKey)?.toString() ?: ""
				val CONFIGURE_MAC_POOL                      = locEn?.get(ActionGroup.CONFIGURE_MAC_POOL.localizationKey)?.toString() ?: ""
				val CONFIGURE_NETWORK_VNIC_PROFILE          = locEn?.get(ActionGroup.CONFIGURE_NETWORK_VNIC_PROFILE.localizationKey)?.toString() ?: ""
				val CONFIGURE_SCSI_GENERIC_IO               = locEn?.get(ActionGroup.CONFIGURE_SCSI_GENERIC_IO.localizationKey)?.toString() ?: ""
				val CONFIGURE_STORAGE_DISK_PROFILE          = locEn?.get(ActionGroup.CONFIGURE_STORAGE_DISK_PROFILE.localizationKey)?.toString() ?: ""
				val CONFIGURE_STORAGE_POOL_NETWORK          = locEn?.get(ActionGroup.CONFIGURE_STORAGE_POOL_NETWORK.localizationKey)?.toString() ?: ""
				val CONFIGURE_TEMPLATE_NETWORK              = locEn?.get(ActionGroup.CONFIGURE_TEMPLATE_NETWORK.localizationKey)?.toString() ?: ""
				val CONFIGURE_VM_NETWORK                    = locEn?.get(ActionGroup.CONFIGURE_VM_NETWORK.localizationKey)?.toString() ?: ""
				val CONFIGURE_VM_STORAGE                    = locEn?.get(ActionGroup.CONFIGURE_VM_STORAGE.localizationKey)?.toString() ?: ""
				val CONNECT_TO_SERIAL_CONSOLE               = locEn?.get(ActionGroup.CONNECT_TO_SERIAL_CONSOLE.localizationKey)?.toString() ?: ""
				val CONNECT_TO_VM                           = locEn?.get(ActionGroup.CONNECT_TO_VM.localizationKey)?.toString() ?: ""
				val COPY_TEMPLATE                           = locEn?.get(ActionGroup.COPY_TEMPLATE.localizationKey)?.toString() ?: ""
				val CREATE_CLUSTER                          = locEn?.get(ActionGroup.CREATE_CLUSTER.localizationKey)?.toString() ?: ""
				val CREATE_CPU_PROFILE                      = locEn?.get(ActionGroup.CREATE_CPU_PROFILE.localizationKey)?.toString() ?: ""
				val CREATE_DISK                             = locEn?.get(ActionGroup.CREATE_DISK.localizationKey)?.toString() ?: ""
				val CREATE_GLUSTER_VOLUME                   = locEn?.get(ActionGroup.CREATE_GLUSTER_VOLUME.localizationKey)?.toString() ?: ""
				val CREATE_HOST                             = locEn?.get(ActionGroup.CREATE_HOST.localizationKey)?.toString() ?: ""
				val CREATE_INSTANCE                         = locEn?.get(ActionGroup.CREATE_INSTANCE.localizationKey)?.toString() ?: ""
				val CREATE_MAC_POOL                         = locEn?.get(ActionGroup.CREATE_MAC_POOL.localizationKey)?.toString() ?: ""
				val CREATE_NETWORK_VNIC_PROFILE             = locEn?.get(ActionGroup.CREATE_NETWORK_VNIC_PROFILE.localizationKey)?.toString() ?: ""
				val CREATE_STORAGE_DISK_PROFILE             = locEn?.get(ActionGroup.CREATE_STORAGE_DISK_PROFILE.localizationKey)?.toString() ?: ""
				val CREATE_STORAGE_DOMAIN                   = locEn?.get(ActionGroup.CREATE_STORAGE_DOMAIN.localizationKey)?.toString() ?: ""
				val CREATE_STORAGE_POOL                     = locEn?.get(ActionGroup.CREATE_STORAGE_POOL.localizationKey)?.toString() ?: ""
				val CREATE_STORAGE_POOL_NETWORK             = locEn?.get(ActionGroup.CREATE_STORAGE_POOL_NETWORK.localizationKey)?.toString() ?: ""
				val CREATE_TEMPLATE                         = locEn?.get(ActionGroup.CREATE_TEMPLATE.localizationKey)?.toString() ?: ""
				val CREATE_VM                               = locEn?.get(ActionGroup.CREATE_VM.localizationKey)?.toString() ?: ""
				val CREATE_VM_POOL                          = locEn?.get(ActionGroup.CREATE_VM_POOL.localizationKey)?.toString() ?: ""
				val DELETE_CLUSTER                          = locEn?.get(ActionGroup.DELETE_CLUSTER.localizationKey)?.toString() ?: ""
				val DELETE_CPU_PROFILE                      = locEn?.get(ActionGroup.DELETE_CPU_PROFILE.localizationKey)?.toString() ?: ""
				val DELETE_DISK                             = locEn?.get(ActionGroup.DELETE_DISK.localizationKey)?.toString() ?: ""
				val DELETE_GLUSTER_VOLUME                   = locEn?.get(ActionGroup.DELETE_GLUSTER_VOLUME.localizationKey)?.toString() ?: ""
				val DELETE_HOST                             = locEn?.get(ActionGroup.DELETE_HOST.localizationKey)?.toString() ?: ""
				val DELETE_MAC_POOL                         = locEn?.get(ActionGroup.DELETE_MAC_POOL.localizationKey)?.toString() ?: ""
				val DELETE_NETWORK_VNIC_PROFILE             = locEn?.get(ActionGroup.DELETE_NETWORK_VNIC_PROFILE.localizationKey)?.toString() ?: ""
				val DELETE_STORAGE_DISK_PROFILE             = locEn?.get(ActionGroup.DELETE_STORAGE_DISK_PROFILE.localizationKey)?.toString() ?: ""
				val DELETE_STORAGE_DOMAIN                   = locEn?.get(ActionGroup.DELETE_STORAGE_DOMAIN.localizationKey)?.toString() ?: ""
				val DELETE_STORAGE_POOL                     = locEn?.get(ActionGroup.DELETE_STORAGE_POOL.localizationKey)?.toString() ?: ""
				val DELETE_STORAGE_POOL_NETWORK             = locEn?.get(ActionGroup.DELETE_STORAGE_POOL_NETWORK.localizationKey)?.toString() ?: ""
				val DELETE_TEMPLATE                         = locEn?.get(ActionGroup.DELETE_TEMPLATE.localizationKey)?.toString() ?: ""
				val DELETE_VM                               = locEn?.get(ActionGroup.DELETE_VM.localizationKey)?.toString() ?: ""
				val DELETE_VM_POOL                          = locEn?.get(ActionGroup.DELETE_VM_POOL.localizationKey)?.toString() ?: ""
				val DISK_LIVE_STORAGE_MIGRATION             = locEn?.get(ActionGroup.DISK_LIVE_STORAGE_MIGRATION.localizationKey)?.toString() ?: ""
				val EDIT_ADMIN_TEMPLATE_PROPERTIES          = locEn?.get(ActionGroup.EDIT_ADMIN_TEMPLATE_PROPERTIES.localizationKey)?.toString() ?: ""
				val EDIT_ADMIN_VM_PROPERTIES                = locEn?.get(ActionGroup.EDIT_ADMIN_VM_PROPERTIES.localizationKey)?.toString() ?: ""
				val EDIT_CLUSTER_CONFIGURATION              = locEn?.get(ActionGroup.EDIT_CLUSTER_CONFIGURATION.localizationKey)?.toString() ?: ""
				val EDIT_DISK_PROPERTIES                    = locEn?.get(ActionGroup.EDIT_DISK_PROPERTIES.localizationKey)?.toString() ?: ""
				val EDIT_HOST_CONFIGURATION                 = locEn?.get(ActionGroup.EDIT_HOST_CONFIGURATION.localizationKey)?.toString() ?: ""
				val EDIT_MAC_POOL                           = locEn?.get(ActionGroup.EDIT_MAC_POOL.localizationKey)?.toString() ?: ""
				val EDIT_STORAGE_DOMAIN_CONFIGURATION       = locEn?.get(ActionGroup.EDIT_STORAGE_DOMAIN_CONFIGURATION.localizationKey)?.toString() ?: ""
				val EDIT_STORAGE_POOL_CONFIGURATION         = locEn?.get(ActionGroup.EDIT_STORAGE_POOL_CONFIGURATION.localizationKey)?.toString() ?: ""
				val EDIT_TEMPLATE_PROPERTIES                = locEn?.get(ActionGroup.EDIT_TEMPLATE_PROPERTIES.localizationKey)?.toString() ?: ""
				val EDIT_VM_POOL_CONFIGURATION              = locEn?.get(ActionGroup.EDIT_VM_POOL_CONFIGURATION.localizationKey)?.toString() ?: ""
				val EDIT_VM_PROPERTIES                      = locEn?.get(ActionGroup.EDIT_VM_PROPERTIES.localizationKey)?.toString() ?: ""
				val EVENT_NOTIFICATION_MANAGEMENT           = locEn?.get(ActionGroup.EVENT_NOTIFICATION_MANAGEMENT.localizationKey)?.toString() ?: ""
				val HIBERNATE_VM                            = locEn?.get(ActionGroup.HIBERNATE_VM.localizationKey)?.toString() ?: ""
				val IMPORT_EXPORT_VM                        = locEn?.get(ActionGroup.IMPORT_EXPORT_VM.localizationKey)?.toString() ?: ""
				val LOGIN                                   = locEn?.get(ActionGroup.LOGIN.localizationKey)?.toString() ?: ""
				val MANIPULATE_AFFINITY_GROUPS              = locEn?.get(ActionGroup.MANIPULATE_AFFINITY_GROUPS.localizationKey)?.toString() ?: ""
				val MANIPULATE_GLUSTER_HOOK                 = locEn?.get(ActionGroup.MANIPULATE_GLUSTER_HOOK.localizationKey)?.toString() ?: ""
				val MANIPULATE_GLUSTER_SERVICE              = locEn?.get(ActionGroup.MANIPULATE_GLUSTER_SERVICE.localizationKey)?.toString() ?: ""
				val MANIPULATE_GLUSTER_VOLUME               = locEn?.get(ActionGroup.MANIPULATE_GLUSTER_VOLUME.localizationKey)?.toString() ?: ""
				val MANIPULATE_HOST                         = locEn?.get(ActionGroup.MANIPULATE_HOST.localizationKey)?.toString() ?: ""
				val MANIPULATE_PERMISSIONS                  = locEn?.get(ActionGroup.MANIPULATE_PERMISSIONS.localizationKey)?.toString() ?: ""
				val MANIPULATE_ROLES                        = locEn?.get(ActionGroup.MANIPULATE_ROLES.localizationKey)?.toString() ?: ""
				val MANIPULATE_STORAGE_DOMAIN               = locEn?.get(ActionGroup.MANIPULATE_STORAGE_DOMAIN.localizationKey)?.toString() ?: ""
				val MANIPULATE_USERS                        = locEn?.get(ActionGroup.MANIPULATE_USERS.localizationKey)?.toString() ?: ""
				val MANIPULATE_VM_SNAPSHOTS                 = locEn?.get(ActionGroup.MANIPULATE_VM_SNAPSHOTS.localizationKey)?.toString() ?: ""
				val MIGRATE_VM                              = locEn?.get(ActionGroup.MIGRATE_VM.localizationKey)?.toString() ?: ""
				val MOVE_VM                                 = locEn?.get(ActionGroup.MOVE_VM.localizationKey)?.toString() ?: ""
				val REBOOT_VM                               = locEn?.get(ActionGroup.REBOOT_VM.localizationKey)?.toString() ?: ""
				val RECONNECT_TO_VM                         = locEn?.get(ActionGroup.RECONNECT_TO_VM.localizationKey)?.toString() ?: ""
				val RESET_VM                                = locEn?.get(ActionGroup.RESET_VM.localizationKey)?.toString() ?: ""
				val RUN_VM                                  = locEn?.get(ActionGroup.RUN_VM.localizationKey)?.toString() ?: ""
				val SHUT_DOWN_VM                            = locEn?.get(ActionGroup.SHUT_DOWN_VM.localizationKey)?.toString() ?: ""
				val SPARSIFY_DISK                           = locEn?.get(ActionGroup.SPARSIFY_DISK.localizationKey)?.toString() ?: ""
				val STOP_VM                                 = locEn?.get(ActionGroup.STOP_VM.localizationKey)?.toString() ?: ""
				val TAG_MANAGEMENT                          = locEn?.get(ActionGroup.TAG_MANAGEMENT.localizationKey)?.toString() ?: ""
				val UPDATE_CPU_PROFILE                      = locEn?.get(ActionGroup.UPDATE_CPU_PROFILE.localizationKey)?.toString() ?: ""
				val VM_POOL_BASIC_OPERATIONS                = locEn?.get(ActionGroup.VM_POOL_BASIC_OPERATIONS.localizationKey)?.toString() ?: ""
			}
		}
		//region: ActionTypeL
		object ActionTypeL {
			object KR {
				val ActivateDeactivateVmNic						= locKr?.get(ActionType.ActivateDeactivateVmNic.localizationKey)?.toString() ?: ""
				val ActivateGlusterVolumeSnapshot				= locKr?.get(ActionType.ActivateGlusterVolumeSnapshot.localizationKey)?.toString() ?: ""
				val ActivateStorageDomain						= locKr?.get(ActionType.ActivateStorageDomain.localizationKey)?.toString() ?: ""
				val ActivateVds									= locKr?.get(ActionType.ActivateVds.localizationKey)?.toString() ?: ""
				// val AddBond										= locKr?.get(ActionType.AddBond.localizationKey)?.toString() ?: ""
				val AddBricksToGlusterVolume					= locKr?.get(ActionType.AddBricksToGlusterVolume.localizationKey)?.toString() ?: ""
				val AddCluster									= locKr?.get(ActionType.AddCluster.localizationKey)?.toString() ?: ""
				val AddDisk										= locKr?.get(ActionType.AddDisk.localizationKey)?.toString() ?: ""
				val AddEmptyStoragePool							= locKr?.get(ActionType.AddEmptyStoragePool.localizationKey)?.toString() ?: ""
				val AddEventSubscription						= locKr?.get(ActionType.AddEventSubscription.localizationKey)?.toString() ?: ""
				val AddGlusterHook					 			= locKr?.get(ActionType.AddGlusterHook.localizationKey)?.toString() ?: ""
				val AddLibvirtSecret							= locKr?.get(ActionType.AddLibvirtSecret.localizationKey)?.toString() ?: ""
				val AddLocalStorageDomain						= locKr?.get(ActionType.AddLocalStorageDomain.localizationKey)?.toString() ?: ""
				val AddNFSStorageDomain							= locKr?.get(ActionType.AddNFSStorageDomain.localizationKey)?.toString() ?: ""
				val AddNetwork									= locKr?.get(ActionType.AddNetwork.localizationKey)?.toString() ?: ""
				val AddPermission								= locKr?.get(ActionType.AddPermission.localizationKey)?.toString() ?: ""
				val AddQuota									= locKr?.get(ActionType.AddQuota.localizationKey)?.toString() ?: ""
				// val AddRoleWithActions							= locKr?.get(ActionType.AddRoleWithActions.localizationKey)?.toString() ?: ""
				val AddSANStorageDomain							= locKr?.get(ActionType.AddSANStorageDomain.localizationKey)?.toString() ?: ""
				val AddStoragePoolWithStorages					= locKr?.get(ActionType.AddStoragePoolWithStorages.localizationKey)?.toString() ?: ""
				val AddStorageServerConnection					= locKr?.get(ActionType.AddStorageServerConnection.localizationKey)?.toString() ?: ""
				val AddSubnetToProvider							= locKr?.get(ActionType.AddSubnetToProvider.localizationKey)?.toString() ?: ""
				val AddVds										= locKr?.get(ActionType.AddVds.localizationKey)?.toString() ?: ""
				val AddVm										= locKr?.get(ActionType.AddVm.localizationKey)?.toString() ?: ""
				// val AddVmAndAttachToUser						= locKr?.get(ActionType.AddVmAndAttachToUser.localizationKey)?.toString() ?: ""
				val AddVmFromScratch							= locKr?.get(ActionType.AddVmFromScratch.localizationKey)?.toString() ?: ""
				val AddVmInterface								= locKr?.get(ActionType.AddVmInterface.localizationKey)?.toString() ?: ""
				val AddVmPool									= locKr?.get(ActionType.AddVmPool.localizationKey)?.toString() ?: ""
				val AddVmTemplate								= locKr?.get(ActionType.AddVmTemplate.localizationKey)?.toString() ?: ""
				val AddVmTemplateInterface						= locKr?.get(ActionType.AddVmTemplateInterface.localizationKey)?.toString() ?: ""
				val AddVmToPool									= locKr?.get(ActionType.AddVmToPool.localizationKey)?.toString() ?: ""
				val AddVnicProfile								= locKr?.get(ActionType.AddVnicProfile.localizationKey)?.toString() ?: ""
				val ApproveVds									= locKr?.get(ActionType.ApproveVds.localizationKey)?.toString() ?: ""
				// val AttachActionToRole							= locKr?.get(ActionType.AttachActionToRole.localizationKey)?.toString() ?: ""
				val AttachDiskToVm								= locKr?.get(ActionType.AttachDiskToVm.localizationKey)?.toString() ?: ""
				val AttachNetworkToCluster						= locKr?.get(ActionType.AttachNetworkToCluster.localizationKey)?.toString() ?: ""
				// val AttachNetworkToVdsInterface					= locKr?.get(ActionType.AttachNetworkToVdsInterface.localizationKey)?.toString() ?: ""
				val AttachStorageDomainToPool					= locKr?.get(ActionType.AttachStorageDomainToPool.localizationKey)?.toString() ?: ""
				// val AttachUserToVmFromPool						= locKr?.get(ActionType.AttachUserToVmFromPool.localizationKey)?.toString() ?: ""
				val AttachUserToVmFromPoolAndRun				= locKr?.get(ActionType.AttachUserToVmFromPoolAndRun.localizationKey)?.toString() ?: ""
				// val AttachVmPoolToAdGroup						= locKr?.get(ActionType.AttachVmPoolToAdGroup.localizationKey)?.toString() ?: ""
				// val AttachVmPoolToUser							= locKr?.get(ActionType.AttachVmPoolToUser.localizationKey)?.toString() ?: ""
				// val AttachVmToAdGroup							= locKr?.get(ActionType.AttachVmToAdGroup.localizationKey)?.toString() ?: ""
				// val AttachVmToUser								= locKr?.get(ActionType.AttachVmToUser.localizationKey)?.toString() ?: ""
				val AttachVmsToTag								= locKr?.get(ActionType.AttachVmsToTag.localizationKey)?.toString() ?: ""
				val ChangeDisk									= locKr?.get(ActionType.ChangeDisk.localizationKey)?.toString() ?: ""
				val CommitNetworkChanges						= locKr?.get(ActionType.CommitNetworkChanges.localizationKey)?.toString() ?: ""
				val ConnectStorageToVds							= locKr?.get(ActionType.ConnectStorageToVds.localizationKey)?.toString() ?: ""
				val CreateBrick									= locKr?.get(ActionType.CreateBrick.localizationKey)?.toString() ?: ""
				val CreateGlusterVolume							= locKr?.get(ActionType.CreateGlusterVolume.localizationKey)?.toString() ?: ""
				val CreateGlusterVolumeGeoRepSession			= locKr?.get(ActionType.CreateGlusterVolumeGeoRepSession.localizationKey)?.toString() ?: ""
				val CreateGlusterVolumeSnapshot					= locKr?.get(ActionType.CreateGlusterVolumeSnapshot.localizationKey)?.toString() ?: ""
				val DeactivateGlusterVolumeSnapshot				= locKr?.get(ActionType.DeactivateGlusterVolumeSnapshot.localizationKey)?.toString() ?: ""
				val DeactivateStorageDomain						= locKr?.get(ActionType.DeactivateStorageDomain.localizationKey)?.toString() ?: ""
				val DeleteAllGlusterVolumeSnapshots				= locKr?.get(ActionType.DeleteAllGlusterVolumeSnapshots.localizationKey)?.toString() ?: ""
				val DeleteGeoRepSession							= locKr?.get(ActionType.DeleteGeoRepSession.localizationKey)?.toString() ?: ""
				val DeleteGlusterVolume							= locKr?.get(ActionType.DeleteGlusterVolume.localizationKey)?.toString() ?: ""
				val DeleteGlusterVolumeSnapshot					= locKr?.get(ActionType.DeleteGlusterVolumeSnapshot.localizationKey)?.toString() ?: ""
				// val DetachActionFromRole						= locKr?.get(ActionType.DetachActionFromRole.localizationKey)?.toString() ?: ""
				val DetachDiskFromVm							= locKr?.get(ActionType.DetachDiskFromVm.localizationKey)?.toString() ?: ""
				// val DetachNetworkFromVdsInterface				= locKr?.get(ActionType.DetachNetworkFromVdsInterface.localizationKey)?.toString() ?: ""
				val DetachNetworkToCluster						= locKr?.get(ActionType.DetachNetworkToCluster.localizationKey)?.toString() ?: ""
				val DetachStorageDomainFromPool					= locKr?.get(ActionType.DetachStorageDomainFromPool.localizationKey)?.toString() ?: ""
				val DetachUserFromVmFromPool					= locKr?.get(ActionType.DetachUserFromVmFromPool.localizationKey)?.toString() ?: ""
				// val DetachVmFromAdGroup							= locKr?.get(ActionType.DetachVmFromAdGroup.localizationKey)?.toString() ?: ""
				val DetachVmFromTag								= locKr?.get(ActionType.DetachVmFromTag.localizationKey)?.toString() ?: ""
				// val DetachVmFromUser							= locKr?.get(ActionType.DetachVmFromUser.localizationKey)?.toString() ?: ""
				// val DetachVmPoolFromAdGroup						= locKr?.get(ActionType.DetachVmPoolFromAdGroup.localizationKey)?.toString() ?: ""
				// val DetachVmPoolFromUser						= locKr?.get(ActionType.DetachVmPoolFromUser.localizationKey)?.toString() ?: ""
				val DisableGlusterHook							= locKr?.get(ActionType.DisableGlusterHook.localizationKey)?.toString() ?: ""
				val EnableGlusterHook							= locKr?.get(ActionType.EnableGlusterHook.localizationKey)?.toString() ?: ""
				val ExportVm					 				= locKr?.get(ActionType.ExportVm.localizationKey)?.toString() ?: ""
				val ExportVmTemplate							= locKr?.get(ActionType.ExportVmTemplate.localizationKey)?.toString() ?: ""
				val ExtendSANStorageDomain						= locKr?.get(ActionType.ExtendSANStorageDomain.localizationKey)?.toString() ?: ""
				val FenceVdsManualy								= locKr?.get(ActionType.FenceVdsManualy.localizationKey)?.toString() ?: ""
				val ForceRemoveStorageDomain					= locKr?.get(ActionType.ForceRemoveStorageDomain.localizationKey)?.toString() ?: ""
				// val GlusterHostAdd					 			= locKr?.get(ActionType.GlusterHostAdd.localizationKey)?.toString() ?: ""
				val GlusterVolumeRemoveBricks					= locKr?.get(ActionType.GlusterVolumeRemoveBricks.localizationKey)?.toString() ?: ""
				val HibernateVm									= locKr?.get(ActionType.HibernateVm.localizationKey)?.toString() ?: ""
				val ImportVm									= locKr?.get(ActionType.ImportVm.localizationKey)?.toString() ?: ""
				val ImportVmTemplate							= locKr?.get(ActionType.ImportVmTemplate.localizationKey)?.toString() ?: ""
				val LiveMigrateDisk								= locKr?.get(ActionType.LiveMigrateDisk.localizationKey)?.toString() ?: ""
				// val LoginAdminUser								= locKr?.get(ActionType.LoginAdminUser.localizationKey)?.toString() ?: ""
				val MaintenanceNumberOfVdss						= locKr?.get(ActionType.MaintenanceNumberOfVdss.localizationKey)?.toString() ?: ""
				val ManageGlusterService						= locKr?.get(ActionType.ManageGlusterService.localizationKey)?.toString() ?: ""
				// val MergeSnapshot								= locKr?.get(ActionType.MergeSnapshot.localizationKey)?.toString() ?: ""
				val MigrateVm									= locKr?.get(ActionType.MigrateVm.localizationKey)?.toString() ?: ""
				val MigrateVmToServer							= locKr?.get(ActionType.MigrateVmToServer.localizationKey)?.toString() ?: ""
				val MoveDisk									= locKr?.get(ActionType.MoveDisk.localizationKey)?.toString() ?: ""
				val MoveOrCopyDisk				 				= locKr?.get(ActionType.MoveOrCopyDisk.localizationKey)?.toString() ?: ""
				val PauseGlusterVolumeGeoRepSession				= locKr?.get(ActionType.PauseGlusterVolumeGeoRepSession.localizationKey)?.toString() ?: ""
				// val PauseVm										= locKr?.get(ActionType.PauseVm.localizationKey)?.toString() ?: ""
				val ProcessOvfUpdateForStorageDomain			= locKr?.get(ActionType.ProcessOvfUpdateForStorageDomain.localizationKey)?.toString() ?: ""
				val RecoveryStoragePool							= locKr?.get(ActionType.RecoveryStoragePool.localizationKey)?.toString() ?: ""
				val RefreshGeoRepSessions						= locKr?.get(ActionType.RefreshGeoRepSessions.localizationKey)?.toString() ?: ""
				// val RefreshGlusterHook							= locKr?.get(ActionType.RefreshGlusterHook.localizationKey)?.toString() ?: ""
				val RefreshHostCapabilities						= locKr?.get(ActionType.RefreshHostCapabilities.localizationKey)?.toString() ?: ""
				// val RemoveAdGroup								= locKr?.get(ActionType.RemoveAdGroup.localizationKey)?.toString() ?: ""
				// val RemoveBond					 				= locKr?.get(ActionType.RemoveBond.localizationKey)?.toString() ?: ""
				val RemoveCluster								= locKr?.get(ActionType.RemoveCluster.localizationKey)?.toString() ?: ""
				val RemoveDisk					 				= locKr?.get(ActionType.RemoveDisk.localizationKey)?.toString() ?: ""
				val RemoveEventSubscription						= locKr?.get(ActionType.RemoveEventSubscription.localizationKey)?.toString() ?: ""
				val RemoveGlusterHook							= locKr?.get(ActionType.RemoveGlusterHook.localizationKey)?.toString() ?: ""
				val RemoveNetwork								= locKr?.get(ActionType.RemoveNetwork.localizationKey)?.toString() ?: ""
				val RemovePermission							= locKr?.get(ActionType.RemovePermission.localizationKey)?.toString() ?: ""
				val RemoveQuota									= locKr?.get(ActionType.RemoveQuota.localizationKey)?.toString() ?: ""
				val RemoveRole									= locKr?.get(ActionType.RemoveRole.localizationKey)?.toString() ?: ""
				val RemoveStorageDomain							= locKr?.get(ActionType.RemoveStorageDomain.localizationKey)?.toString() ?: ""
				val RemoveStoragePool							= locKr?.get(ActionType.RemoveStoragePool.localizationKey)?.toString() ?: ""
				val RemoveSubnetFromProvider					= locKr?.get(ActionType.RemoveSubnetFromProvider.localizationKey)?.toString() ?: ""
				val RemoveUser									= locKr?.get(ActionType.RemoveUser.localizationKey)?.toString() ?: ""
				val RemoveVds									= locKr?.get(ActionType.RemoveVds.localizationKey)?.toString() ?: ""
				val RemoveVm									= locKr?.get(ActionType.RemoveVm.localizationKey)?.toString() ?: ""
				val RemoveVmFromImportExport					= locKr?.get(ActionType.RemoveVmFromImportExport.localizationKey)?.toString() ?: ""
				val RemoveVmFromPool							= locKr?.get(ActionType.RemoveVmFromPool.localizationKey)?.toString() ?: ""
				val RemoveVmInterface							= locKr?.get(ActionType.RemoveVmInterface.localizationKey)?.toString() ?: ""
				val RemoveVmPool								= locKr?.get(ActionType.RemoveVmPool.localizationKey)?.toString() ?: ""
				val RemoveVmTemplate							= locKr?.get(ActionType.RemoveVmTemplate.localizationKey)?.toString() ?: ""
				val RemoveVmTemplateFromImportExport			= locKr?.get(ActionType.RemoveVmTemplateFromImportExport.localizationKey)?.toString() ?: ""
				val RemoveVmTemplateInterface					= locKr?.get(ActionType.RemoveVmTemplateInterface.localizationKey)?.toString() ?: ""
				val RemoveVnicProfile							= locKr?.get(ActionType.RemoveVnicProfile.localizationKey)?.toString() ?: ""
				val ReplaceGlusterVolumeBrick					= locKr?.get(ActionType.ReplaceGlusterVolumeBrick.localizationKey)?.toString() ?: ""
				val RescheduleGlusterVolumeSnapshot				= locKr?.get(ActionType.RescheduleGlusterVolumeSnapshot.localizationKey)?.toString() ?: ""
				val ResetGlusterVolumeBrick						= locKr?.get(ActionType.ResetGlusterVolumeBrick.localizationKey)?.toString() ?: ""
				val ResetGlusterVolumeOptions					= locKr?.get(ActionType.ResetGlusterVolumeOptions.localizationKey)?.toString() ?: ""
				val RestartVds									= locKr?.get(ActionType.RestartVds.localizationKey)?.toString() ?: ""
				val RestoreAllSnapshots							= locKr?.get(ActionType.RestoreAllSnapshots.localizationKey)?.toString() ?: ""
				val RestoreGlusterVolumeSnapshot				= locKr?.get(ActionType.RestoreGlusterVolumeSnapshot.localizationKey)?.toString() ?: ""
				val ResumeGeoRepSession							= locKr?.get(ActionType.ResumeGeoRepSession.localizationKey)?.toString() ?: ""
				val RunVm										= locKr?.get(ActionType.RunVm.localizationKey)?.toString() ?: ""
				val RunVmOnce									= locKr?.get(ActionType.RunVmOnce.localizationKey)?.toString() ?: ""
				val ScheduleGlusterVolumeSnapshot				= locKr?.get(ActionType.ScheduleGlusterVolumeSnapshot.localizationKey)?.toString() ?: ""
				val SetGlusterVolumeOption						= locKr?.get(ActionType.SetGlusterVolumeOption.localizationKey)?.toString() ?: ""
				// val SetupNetworks								= locKr?.get(ActionType.SetupNetworks.localizationKey)?.toString() ?: ""
				val ShutdownVm									= locKr?.get(ActionType.ShutdownVm.localizationKey)?.toString() ?: ""
				val StartGlusterVolume							= locKr?.get(ActionType.StartGlusterVolume.localizationKey)?.toString() ?: ""
				val StartGlusterVolumeGeoRep					= locKr?.get(ActionType.StartGlusterVolumeGeoRep.localizationKey)?.toString() ?: ""
				val StartGlusterVolumeProfile					= locKr?.get(ActionType.StartGlusterVolumeProfile.localizationKey)?.toString() ?: ""
				val StartRebalanceGlusterVolume					= locKr?.get(ActionType.StartRebalanceGlusterVolume.localizationKey)?.toString() ?: ""
				val StartVds									= locKr?.get(ActionType.StartVds.localizationKey)?.toString() ?: ""
				val StopGeoRepSession							= locKr?.get(ActionType.StopGeoRepSession.localizationKey)?.toString() ?: ""
				val StopGlusterVolume							= locKr?.get(ActionType.StopGlusterVolume.localizationKey)?.toString() ?: ""
				val StopGlusterVolumeProfile					= locKr?.get(ActionType.StopGlusterVolumeProfile.localizationKey)?.toString() ?: ""
				val StopVds										= locKr?.get(ActionType.StopVds.localizationKey)?.toString() ?: ""
				val StopVm										= locKr?.get(ActionType.StopVm.localizationKey)?.toString() ?: ""
				val SyncStorageDevices							= locKr?.get(ActionType.SyncStorageDevices.localizationKey)?.toString() ?: ""
				val TryBackToAllSnapshotsOfVm					= locKr?.get(ActionType.TryBackToAllSnapshotsOfVm.localizationKey)?.toString() ?: ""
				val UpdateCluster								= locKr?.get(ActionType.UpdateCluster.localizationKey)?.toString() ?: ""
				val UpdateDisk									= locKr?.get(ActionType.UpdateDisk.localizationKey)?.toString() ?: ""
				// val UpdateDisplayToCluster						= locKr?.get(ActionType.UpdateDisplayToCluster.localizationKey)?.toString() ?: ""
				val UpdateGlusterHook							= locKr?.get(ActionType.UpdateGlusterHook.localizationKey)?.toString() ?: ""
				// val UpdateGlusterVolumeSnapshotConfigCommand	= locKr?.get(ActionType.UpdateGlusterVolumeSnapshotConfigCommand.localizationKey)?.toString() ?: ""
				val UpdateLibvirtSecret							= locKr?.get(ActionType.UpdateLibvirtSecret.localizationKey)?.toString() ?: ""
				val UpdateNetwork								= locKr?.get(ActionType.UpdateNetwork.localizationKey)?.toString() ?: ""
				// val UpdateNetworkToVdsInterface					= locKr?.get(ActionType.UpdateNetworkToVdsInterface.localizationKey)?.toString() ?: ""
				// val UpdateProfile								= locKr?.get(ActionType.UpdateProfile.localizationKey)?.toString() ?: ""
				val UpdateQuota									= locKr?.get(ActionType.UpdateQuota.localizationKey)?.toString() ?: ""
				val UpdateRole									= locKr?.get(ActionType.UpdateRole.localizationKey)?.toString() ?: ""
				val UpdateStorageDomain							= locKr?.get(ActionType.UpdateStorageDomain.localizationKey)?.toString() ?: ""
				val UpdateStoragePool							= locKr?.get(ActionType.UpdateStoragePool.localizationKey)?.toString() ?: ""
				val UpdateVds									= locKr?.get(ActionType.UpdateVds.localizationKey)?.toString() ?: ""
				val UpdateVm									= locKr?.get(ActionType.UpdateVm.localizationKey)?.toString() ?: ""
				// val UpdateVmConsoleData							= locKr?.get(ActionType.UpdateVmConsoleData.localizationKey)?.toString() ?: ""
				val UpdateVmInterface							= locKr?.get(ActionType.UpdateVmInterface.localizationKey)?.toString() ?: ""
				val UpdateVmPool								= locKr?.get(ActionType.UpdateVmPool.localizationKey)?.toString() ?: ""
				val UpdateVmTemplate							= locKr?.get(ActionType.UpdateVmTemplate.localizationKey)?.toString() ?: ""
				val UpdateVmTemplateInterface					= locKr?.get(ActionType.UpdateVmTemplateInterface.localizationKey)?.toString() ?: ""
				// val UploadDiskImage								= locKr?.get(ActionType.UploadDiskImage.localizationKey)?.toString() ?: ""
				// val UploadImageStatus							= locKr?.get(ActionType.UploadImageStatus.localizationKey)?.toString() ?: ""
			}
			object EN {
				val ActivateDeactivateVmNic						= locEn?.get(ActionType.ActivateDeactivateVmNic.localizationKey)?.toString() ?: ""
				val ActivateGlusterVolumeSnapshot				= locEn?.get(ActionType.ActivateGlusterVolumeSnapshot.localizationKey)?.toString() ?: ""
				val ActivateStorageDomain						= locEn?.get(ActionType.ActivateStorageDomain.localizationKey)?.toString() ?: ""
				val ActivateVds									= locEn?.get(ActionType.ActivateVds.localizationKey)?.toString() ?: ""
				// val AddBond										= locEn?.get(ActionType.AddBond.localizationKey)?.toString() ?: ""
				val AddBricksToGlusterVolume					= locEn?.get(ActionType.AddBricksToGlusterVolume.localizationKey)?.toString() ?: ""
				val AddCluster									= locEn?.get(ActionType.AddCluster.localizationKey)?.toString() ?: ""
				val AddDisk										= locEn?.get(ActionType.AddDisk.localizationKey)?.toString() ?: ""
				val AddEmptyStoragePool							= locEn?.get(ActionType.AddEmptyStoragePool.localizationKey)?.toString() ?: ""
				val AddEventSubscription						= locEn?.get(ActionType.AddEventSubscription.localizationKey)?.toString() ?: ""
				val AddGlusterHook					 			= locEn?.get(ActionType.AddGlusterHook.localizationKey)?.toString() ?: ""
				val AddLibvirtSecret							= locEn?.get(ActionType.AddLibvirtSecret.localizationKey)?.toString() ?: ""
				val AddLocalStorageDomain						= locEn?.get(ActionType.AddLocalStorageDomain.localizationKey)?.toString() ?: ""
				val AddNFSStorageDomain							= locEn?.get(ActionType.AddNFSStorageDomain.localizationKey)?.toString() ?: ""
				val AddNetwork									= locEn?.get(ActionType.AddNetwork.localizationKey)?.toString() ?: ""
				val AddPermission								= locEn?.get(ActionType.AddPermission.localizationKey)?.toString() ?: ""
				val AddQuota									= locEn?.get(ActionType.AddQuota.localizationKey)?.toString() ?: ""
				// val AddRoleWithActions							= locEn?.get(ActionType.AddRoleWithActions.localizationKey)?.toString() ?: ""
				val AddSANStorageDomain							= locEn?.get(ActionType.AddSANStorageDomain.localizationKey)?.toString() ?: ""
				val AddStoragePoolWithStorages					= locEn?.get(ActionType.AddStoragePoolWithStorages.localizationKey)?.toString() ?: ""
				val AddStorageServerConnection					= locEn?.get(ActionType.AddStorageServerConnection.localizationKey)?.toString() ?: ""
				val AddSubnetToProvider							= locEn?.get(ActionType.AddSubnetToProvider.localizationKey)?.toString() ?: ""
				val AddVds										= locEn?.get(ActionType.AddVds.localizationKey)?.toString() ?: ""
				val AddVm										= locEn?.get(ActionType.AddVm.localizationKey)?.toString() ?: ""
				// val AddVmAndAttachToUser						= locEn?.get(ActionType.AddVmAndAttachToUser.localizationKey)?.toString() ?: ""
				val AddVmFromScratch							= locEn?.get(ActionType.AddVmFromScratch.localizationKey)?.toString() ?: ""
				val AddVmInterface								= locEn?.get(ActionType.AddVmInterface.localizationKey)?.toString() ?: ""
				val AddVmPool									= locEn?.get(ActionType.AddVmPool.localizationKey)?.toString() ?: ""
				val AddVmTemplate								= locEn?.get(ActionType.AddVmTemplate.localizationKey)?.toString() ?: ""
				val AddVmTemplateInterface						= locEn?.get(ActionType.AddVmTemplateInterface.localizationKey)?.toString() ?: ""
				val AddVmToPool									= locEn?.get(ActionType.AddVmToPool.localizationKey)?.toString() ?: ""
				val AddVnicProfile								= locEn?.get(ActionType.AddVnicProfile.localizationKey)?.toString() ?: ""
				val ApproveVds									= locEn?.get(ActionType.ApproveVds.localizationKey)?.toString() ?: ""
				// val AttachActionToRole							= locEn?.get(ActionType.AttachActionToRole.localizationKey)?.toString() ?: ""
				val AttachDiskToVm								= locEn?.get(ActionType.AttachDiskToVm.localizationKey)?.toString() ?: ""
				val AttachNetworkToCluster						= locEn?.get(ActionType.AttachNetworkToCluster.localizationKey)?.toString() ?: ""
				// val AttachNetworkToVdsInterface					= locEn?.get(ActionType.AttachNetworkToVdsInterface.localizationKey)?.toString() ?: ""
				val AttachStorageDomainToPool					= locEn?.get(ActionType.AttachStorageDomainToPool.localizationKey)?.toString() ?: ""
				// val AttachUserToVmFromPool						= locEn?.get(ActionType.AttachUserToVmFromPool.localizationKey)?.toString() ?: ""
				val AttachUserToVmFromPoolAndRun				= locEn?.get(ActionType.AttachUserToVmFromPoolAndRun.localizationKey)?.toString() ?: ""
				// val AttachVmPoolToAdGroup						= locEn?.get(ActionType.AttachVmPoolToAdGroup.localizationKey)?.toString() ?: ""
				// val AttachVmPoolToUser							= locEn?.get(ActionType.AttachVmPoolToUser.localizationKey)?.toString() ?: ""
				// val AttachVmToAdGroup							= locEn?.get(ActionType.AttachVmToAdGroup.localizationKey)?.toString() ?: ""
				// val AttachVmToUser								= locEn?.get(ActionType.AttachVmToUser.localizationKey)?.toString() ?: ""
				val AttachVmsToTag								= locEn?.get(ActionType.AttachVmsToTag.localizationKey)?.toString() ?: ""
				val ChangeDisk									= locEn?.get(ActionType.ChangeDisk.localizationKey)?.toString() ?: ""
				val CommitNetworkChanges						= locEn?.get(ActionType.CommitNetworkChanges.localizationKey)?.toString() ?: ""
				val ConnectStorageToVds							= locEn?.get(ActionType.ConnectStorageToVds.localizationKey)?.toString() ?: ""
				val CreateBrick									= locEn?.get(ActionType.CreateBrick.localizationKey)?.toString() ?: ""
				val CreateGlusterVolume							= locEn?.get(ActionType.CreateGlusterVolume.localizationKey)?.toString() ?: ""
				val CreateGlusterVolumeGeoRepSession			= locEn?.get(ActionType.CreateGlusterVolumeGeoRepSession.localizationKey)?.toString() ?: ""
				val CreateGlusterVolumeSnapshot					= locEn?.get(ActionType.CreateGlusterVolumeSnapshot.localizationKey)?.toString() ?: ""
				val DeactivateGlusterVolumeSnapshot				= locEn?.get(ActionType.DeactivateGlusterVolumeSnapshot.localizationKey)?.toString() ?: ""
				val DeactivateStorageDomain						= locEn?.get(ActionType.DeactivateStorageDomain.localizationKey)?.toString() ?: ""
				val DeleteAllGlusterVolumeSnapshots				= locEn?.get(ActionType.DeleteAllGlusterVolumeSnapshots.localizationKey)?.toString() ?: ""
				val DeleteGeoRepSession							= locEn?.get(ActionType.DeleteGeoRepSession.localizationKey)?.toString() ?: ""
				val DeleteGlusterVolume							= locEn?.get(ActionType.DeleteGlusterVolume.localizationKey)?.toString() ?: ""
				val DeleteGlusterVolumeSnapshot					= locEn?.get(ActionType.DeleteGlusterVolumeSnapshot.localizationKey)?.toString() ?: ""
				// val DetachActionFromRole						= locEn?.get(ActionType.DetachActionFromRole.localizationKey)?.toString() ?: ""
				val DetachDiskFromVm							= locEn?.get(ActionType.DetachDiskFromVm.localizationKey)?.toString() ?: ""
				// val DetachNetworkFromVdsInterface				= locEn?.get(ActionType.DetachNetworkFromVdsInterface.localizationKey)?.toString() ?: ""
				val DetachNetworkToCluster						= locEn?.get(ActionType.DetachNetworkToCluster.localizationKey)?.toString() ?: ""
				val DetachStorageDomainFromPool					= locEn?.get(ActionType.DetachStorageDomainFromPool.localizationKey)?.toString() ?: ""
				val DetachUserFromVmFromPool					= locEn?.get(ActionType.DetachUserFromVmFromPool.localizationKey)?.toString() ?: ""
				// val DetachVmFromAdGroup							= locEn?.get(ActionType.DetachVmFromAdGroup.localizationKey)?.toString() ?: ""
				val DetachVmFromTag								= locEn?.get(ActionType.DetachVmFromTag.localizationKey)?.toString() ?: ""
				// val DetachVmFromUser							= locEn?.get(ActionType.DetachVmFromUser.localizationKey)?.toString() ?: ""
				// val DetachVmPoolFromAdGroup						= locEn?.get(ActionType.DetachVmPoolFromAdGroup.localizationKey)?.toString() ?: ""
				// val DetachVmPoolFromUser						= locEn?.get(ActionType.DetachVmPoolFromUser.localizationKey)?.toString() ?: ""
				val DisableGlusterHook							= locEn?.get(ActionType.DisableGlusterHook.localizationKey)?.toString() ?: ""
				val EnableGlusterHook							= locEn?.get(ActionType.EnableGlusterHook.localizationKey)?.toString() ?: ""
				val ExportVm					 				= locEn?.get(ActionType.ExportVm.localizationKey)?.toString() ?: ""
				val ExportVmTemplate							= locEn?.get(ActionType.ExportVmTemplate.localizationKey)?.toString() ?: ""
				val ExtendSANStorageDomain						= locEn?.get(ActionType.ExtendSANStorageDomain.localizationKey)?.toString() ?: ""
				val FenceVdsManualy								= locEn?.get(ActionType.FenceVdsManualy.localizationKey)?.toString() ?: ""
				val ForceRemoveStorageDomain					= locEn?.get(ActionType.ForceRemoveStorageDomain.localizationKey)?.toString() ?: ""
				// val GlusterHostAdd					 			= locEn?.get(ActionType.GlusterHostAdd.localizationKey)?.toString() ?: ""
				val GlusterVolumeRemoveBricks					= locEn?.get(ActionType.GlusterVolumeRemoveBricks.localizationKey)?.toString() ?: ""
				val HibernateVm									= locEn?.get(ActionType.HibernateVm.localizationKey)?.toString() ?: ""
				val ImportVm									= locEn?.get(ActionType.ImportVm.localizationKey)?.toString() ?: ""
				val ImportVmTemplate							= locEn?.get(ActionType.ImportVmTemplate.localizationKey)?.toString() ?: ""
				val LiveMigrateDisk								= locEn?.get(ActionType.LiveMigrateDisk.localizationKey)?.toString() ?: ""
				// val LoginAdminUser								= locEn?.get(ActionType.LoginAdminUser.localizationKey)?.toString() ?: ""
				val MaintenanceNumberOfVdss						= locEn?.get(ActionType.MaintenanceNumberOfVdss.localizationKey)?.toString() ?: ""
				val ManageGlusterService						= locEn?.get(ActionType.ManageGlusterService.localizationKey)?.toString() ?: ""
				// val MergeSnapshot								= locEn?.get(ActionType.MergeSnapshot.localizationKey)?.toString() ?: ""
				val MigrateVm									= locEn?.get(ActionType.MigrateVm.localizationKey)?.toString() ?: ""
				val MigrateVmToServer							= locEn?.get(ActionType.MigrateVmToServer.localizationKey)?.toString() ?: ""
				val MoveDisk									= locEn?.get(ActionType.MoveDisk.localizationKey)?.toString() ?: ""
				val MoveOrCopyDisk				 				= locEn?.get(ActionType.MoveOrCopyDisk.localizationKey)?.toString() ?: ""
				val PauseGlusterVolumeGeoRepSession				= locEn?.get(ActionType.PauseGlusterVolumeGeoRepSession.localizationKey)?.toString() ?: ""
				// val PauseVm										= locEn?.get(ActionType.PauseVm.localizationKey)?.toString() ?: ""
				val ProcessOvfUpdateForStorageDomain			= locEn?.get(ActionType.ProcessOvfUpdateForStorageDomain.localizationKey)?.toString() ?: ""
				val RecoveryStoragePool							= locEn?.get(ActionType.RecoveryStoragePool.localizationKey)?.toString() ?: ""
				val RefreshGeoRepSessions						= locEn?.get(ActionType.RefreshGeoRepSessions.localizationKey)?.toString() ?: ""
				// val RefreshGlusterHook							= locEn?.get(ActionType.RefreshGlusterHook.localizationKey)?.toString() ?: ""
				val RefreshHostCapabilities						= locEn?.get(ActionType.RefreshHostCapabilities.localizationKey)?.toString() ?: ""
				// val RemoveAdGroup								= locEn?.get(ActionType.RemoveAdGroup.localizationKey)?.toString() ?: ""
				// val RemoveBond					 				= locEn?.get(ActionType.RemoveBond.localizationKey)?.toString() ?: ""
				val RemoveCluster								= locEn?.get(ActionType.RemoveCluster.localizationKey)?.toString() ?: ""
				val RemoveDisk					 				= locEn?.get(ActionType.RemoveDisk.localizationKey)?.toString() ?: ""
				val RemoveEventSubscription						= locEn?.get(ActionType.RemoveEventSubscription.localizationKey)?.toString() ?: ""
				val RemoveGlusterHook							= locEn?.get(ActionType.RemoveGlusterHook.localizationKey)?.toString() ?: ""
				val RemoveNetwork								= locEn?.get(ActionType.RemoveNetwork.localizationKey)?.toString() ?: ""
				val RemovePermission							= locEn?.get(ActionType.RemovePermission.localizationKey)?.toString() ?: ""
				val RemoveQuota									= locEn?.get(ActionType.RemoveQuota.localizationKey)?.toString() ?: ""
				val RemoveRole									= locEn?.get(ActionType.RemoveRole.localizationKey)?.toString() ?: ""
				val RemoveStorageDomain							= locEn?.get(ActionType.RemoveStorageDomain.localizationKey)?.toString() ?: ""
				val RemoveStoragePool							= locEn?.get(ActionType.RemoveStoragePool.localizationKey)?.toString() ?: ""
				val RemoveSubnetFromProvider					= locEn?.get(ActionType.RemoveSubnetFromProvider.localizationKey)?.toString() ?: ""
				val RemoveUser									= locEn?.get(ActionType.RemoveUser.localizationKey)?.toString() ?: ""
				val RemoveVds									= locEn?.get(ActionType.RemoveVds.localizationKey)?.toString() ?: ""
				val RemoveVm									= locEn?.get(ActionType.RemoveVm.localizationKey)?.toString() ?: ""
				val RemoveVmFromImportExport					= locEn?.get(ActionType.RemoveVmFromImportExport.localizationKey)?.toString() ?: ""
				val RemoveVmFromPool							= locEn?.get(ActionType.RemoveVmFromPool.localizationKey)?.toString() ?: ""
				val RemoveVmInterface							= locEn?.get(ActionType.RemoveVmInterface.localizationKey)?.toString() ?: ""
				val RemoveVmPool								= locEn?.get(ActionType.RemoveVmPool.localizationKey)?.toString() ?: ""
				val RemoveVmTemplate							= locEn?.get(ActionType.RemoveVmTemplate.localizationKey)?.toString() ?: ""
				val RemoveVmTemplateFromImportExport			= locEn?.get(ActionType.RemoveVmTemplateFromImportExport.localizationKey)?.toString() ?: ""
				val RemoveVmTemplateInterface					= locEn?.get(ActionType.RemoveVmTemplateInterface.localizationKey)?.toString() ?: ""
				val RemoveVnicProfile							= locEn?.get(ActionType.RemoveVnicProfile.localizationKey)?.toString() ?: ""
				val ReplaceGlusterVolumeBrick					= locEn?.get(ActionType.ReplaceGlusterVolumeBrick.localizationKey)?.toString() ?: ""
				val RescheduleGlusterVolumeSnapshot				= locEn?.get(ActionType.RescheduleGlusterVolumeSnapshot.localizationKey)?.toString() ?: ""
				val ResetGlusterVolumeBrick						= locEn?.get(ActionType.ResetGlusterVolumeBrick.localizationKey)?.toString() ?: ""
				val ResetGlusterVolumeOptions					= locEn?.get(ActionType.ResetGlusterVolumeOptions.localizationKey)?.toString() ?: ""
				val RestartVds									= locEn?.get(ActionType.RestartVds.localizationKey)?.toString() ?: ""
				val RestoreAllSnapshots							= locEn?.get(ActionType.RestoreAllSnapshots.localizationKey)?.toString() ?: ""
				val RestoreGlusterVolumeSnapshot				= locEn?.get(ActionType.RestoreGlusterVolumeSnapshot.localizationKey)?.toString() ?: ""
				val ResumeGeoRepSession							= locEn?.get(ActionType.ResumeGeoRepSession.localizationKey)?.toString() ?: ""
				val RunVm										= locEn?.get(ActionType.RunVm.localizationKey)?.toString() ?: ""
				val RunVmOnce									= locEn?.get(ActionType.RunVmOnce.localizationKey)?.toString() ?: ""
				val ScheduleGlusterVolumeSnapshot				= locEn?.get(ActionType.ScheduleGlusterVolumeSnapshot.localizationKey)?.toString() ?: ""
				val SetGlusterVolumeOption						= locEn?.get(ActionType.SetGlusterVolumeOption.localizationKey)?.toString() ?: ""
				// val SetupNetworks								= locEn?.get(ActionType.SetupNetworks.localizationKey)?.toString() ?: ""
				val ShutdownVm									= locEn?.get(ActionType.ShutdownVm.localizationKey)?.toString() ?: ""
				val StartGlusterVolume							= locEn?.get(ActionType.StartGlusterVolume.localizationKey)?.toString() ?: ""
				val StartGlusterVolumeGeoRep					= locEn?.get(ActionType.StartGlusterVolumeGeoRep.localizationKey)?.toString() ?: ""
				val StartGlusterVolumeProfile					= locEn?.get(ActionType.StartGlusterVolumeProfile.localizationKey)?.toString() ?: ""
				val StartRebalanceGlusterVolume					= locEn?.get(ActionType.StartRebalanceGlusterVolume.localizationKey)?.toString() ?: ""
				val StartVds									= locEn?.get(ActionType.StartVds.localizationKey)?.toString() ?: ""
				val StopGeoRepSession							= locEn?.get(ActionType.StopGeoRepSession.localizationKey)?.toString() ?: ""
				val StopGlusterVolume							= locEn?.get(ActionType.StopGlusterVolume.localizationKey)?.toString() ?: ""
				val StopGlusterVolumeProfile					= locEn?.get(ActionType.StopGlusterVolumeProfile.localizationKey)?.toString() ?: ""
				val StopVds										= locEn?.get(ActionType.StopVds.localizationKey)?.toString() ?: ""
				val StopVm										= locEn?.get(ActionType.StopVm.localizationKey)?.toString() ?: ""
				val SyncStorageDevices							= locEn?.get(ActionType.SyncStorageDevices.localizationKey)?.toString() ?: ""
				val TryBackToAllSnapshotsOfVm					= locEn?.get(ActionType.TryBackToAllSnapshotsOfVm.localizationKey)?.toString() ?: ""
				val UpdateCluster								= locEn?.get(ActionType.UpdateCluster.localizationKey)?.toString() ?: ""
				val UpdateDisk									= locEn?.get(ActionType.UpdateDisk.localizationKey)?.toString() ?: ""
				// val UpdateDisplayToCluster						= locEn?.get(ActionType.UpdateDisplayToCluster.localizationKey)?.toString() ?: ""
				val UpdateGlusterHook							= locEn?.get(ActionType.UpdateGlusterHook.localizationKey)?.toString() ?: ""
				// val UpdateGlusterVolumeSnapshotConfigCommand	= locEn?.get(ActionType.UpdateGlusterVolumeSnapshotConfigCommand.localizationKey)?.toString() ?: ""
				val UpdateLibvirtSecret							= locEn?.get(ActionType.UpdateLibvirtSecret.localizationKey)?.toString() ?: ""
				val UpdateNetwork								= locEn?.get(ActionType.UpdateNetwork.localizationKey)?.toString() ?: ""
				// val UpdateNetworkToVdsInterface					= locEn?.get(ActionType.UpdateNetworkToVdsInterface.localizationKey)?.toString() ?: ""
				// val UpdateProfile								= locEn?.get(ActionType.UpdateProfile.localizationKey)?.toString() ?: ""
				val UpdateQuota									= locEn?.get(ActionType.UpdateQuota.localizationKey)?.toString() ?: ""
				val UpdateRole									= locEn?.get(ActionType.UpdateRole.localizationKey)?.toString() ?: ""
				val UpdateStorageDomain							= locEn?.get(ActionType.UpdateStorageDomain.localizationKey)?.toString() ?: ""
				val UpdateStoragePool							= locEn?.get(ActionType.UpdateStoragePool.localizationKey)?.toString() ?: ""
				val UpdateVds									= locEn?.get(ActionType.UpdateVds.localizationKey)?.toString() ?: ""
				val UpdateVm									= locEn?.get(ActionType.UpdateVm.localizationKey)?.toString() ?: ""
				// val UpdateVmConsoleData							= locEn?.get(ActionType.UpdateVmConsoleData.localizationKey)?.toString() ?: ""
				val UpdateVmInterface							= locEn?.get(ActionType.UpdateVmInterface.localizationKey)?.toString() ?: ""
				val UpdateVmPool								= locEn?.get(ActionType.UpdateVmPool.localizationKey)?.toString() ?: ""
				val UpdateVmTemplate							= locEn?.get(ActionType.UpdateVmTemplate.localizationKey)?.toString() ?: ""
				val UpdateVmTemplateInterface					= locEn?.get(ActionType.UpdateVmTemplateInterface.localizationKey)?.toString() ?: ""
				// val UploadDiskImage								= locEn?.get(ActionType.UploadDiskImage.localizationKey)?.toString() ?: ""
				// val UploadImageStatus							= locEn?.get(ActionType.UploadImageStatus.localizationKey)?.toString() ?: ""
			}
		}


		//region: AuditLogTypeL
		object AuditLogTypeL {
			object KR {

			}
			object EB {

			}
		}
		//endregion: AuditLogTypeL

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

		//region: CpuPinningPolicyL
		object CpuPinningPolicyL {
			object KR {
				val none					= locKr?.get(CpuPinningPolicyB.none.localizationKey)?.toString() ?: ""
				val manual					= locKr?.get(CpuPinningPolicyB.manual.localizationKey)?.toString() ?: ""
				val resize_and_pin_numa		= locKr?.get(CpuPinningPolicyB.resize_and_pin_numa.localizationKey)?.toString() ?: ""
				val dedicated			    = locKr?.get(CpuPinningPolicyB.dedicated.localizationKey)?.toString() ?: ""
				val isolate_threads			= locKr?.get(CpuPinningPolicyB.isolate_threads.localizationKey)?.toString() ?: ""
			}
			object EN {
				val none					= locEn?.get(CpuPinningPolicyB.none.localizationKey)?.toString() ?: ""
				val manual					= locEn?.get(CpuPinningPolicyB.manual.localizationKey)?.toString() ?: ""
				val resize_and_pin_numa		= locEn?.get(CpuPinningPolicyB.resize_and_pin_numa.localizationKey)?.toString() ?: ""
				val dedicated			    = locEn?.get(CpuPinningPolicyB.dedicated.localizationKey)?.toString() ?: ""
				val isolate_threads			= locEn?.get(CpuPinningPolicyB.isolate_threads.localizationKey)?.toString() ?: ""
			}
		}
		//endregion: CpuPinningPolicyL

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
				val DATA 							= locKr?.get(DiskContentTypeB.data.localizationKey)?.toString() ?: ""
				val OVF_STORE 						= locKr?.get(DiskContentTypeB.ovf_store.localizationKey)?.toString() ?: ""
				val MEMORY_DUMP_VOLUME 				= locKr?.get(DiskContentTypeB.memory_dump_volume.localizationKey)?.toString() ?: ""
				val MEMORY_METADATA_VOLUME 			= locKr?.get(DiskContentTypeB.memory_metadata_volume.localizationKey)?.toString() ?: ""
				val ISO 							= locKr?.get(DiskContentTypeB.iso.localizationKey)?.toString() ?: ""
				val HOSTED_ENGINE 					= locKr?.get(DiskContentTypeB.hosted_engine.localizationKey)?.toString() ?: ""
				val HOSTED_ENGINE_SANLOCK 			= locKr?.get(DiskContentTypeB.hosted_engine_sanlock.localizationKey)?.toString() ?: ""
				val HOSTED_ENGINE_METADATA 			= locKr?.get(DiskContentTypeB.hosted_engine_metadata.localizationKey)?.toString() ?: ""
				val HOSTED_ENGINE_CONFIGURATION 	= locKr?.get(DiskContentTypeB.hosted_engine_configuration.localizationKey)?.toString() ?: ""
				val BACKUP_SCRATCH 					= locKr?.get(DiskContentTypeB.backup_scratch.localizationKey)?.toString() ?: ""
				val UNKNOWN 						= locKr?.get(DiskContentTypeB.unknown.localizationKey)?.toString() ?: ""
			}
			object EN {
				val DATA 							= locEn?.get(DiskContentTypeB.data.localizationKey)?.toString() ?: ""
				val OVF_STORE 						= locEn?.get(DiskContentTypeB.ovf_store.localizationKey)?.toString() ?: ""
				val MEMORY_DUMP_VOLUME 				= locEn?.get(DiskContentTypeB.memory_dump_volume.localizationKey)?.toString() ?: ""
				val MEMORY_METADATA_VOLUME 			= locEn?.get(DiskContentTypeB.memory_metadata_volume.localizationKey)?.toString() ?: ""
				val ISO 							= locEn?.get(DiskContentTypeB.iso.localizationKey)?.toString() ?: ""
				val HOSTED_ENGINE 					= locEn?.get(DiskContentTypeB.hosted_engine.localizationKey)?.toString() ?: ""
				val HOSTED_ENGINE_SANLOCK 			= locEn?.get(DiskContentTypeB.hosted_engine_sanlock.localizationKey)?.toString() ?: ""
				val HOSTED_ENGINE_METADATA 			= locEn?.get(DiskContentTypeB.hosted_engine_metadata.localizationKey)?.toString() ?: ""
				val HOSTED_ENGINE_CONFIGURATION 	= locEn?.get(DiskContentTypeB.hosted_engine_configuration.localizationKey)?.toString() ?: ""
				val BACKUP_SCRATCH 					= locEn?.get(DiskContentTypeB.backup_scratch.localizationKey)?.toString() ?: ""
				val UNKNOWN 						= locEn?.get(DiskContentTypeB.unknown.localizationKey)?.toString() ?: ""
			}
		}
		//endregion

		//region: DiskInterfaceL
		object DiskInterfaceL {
			object KR {
				val IDE								= locKr?.get(DiskInterfaceB.ide.localizationKey)?.toString() ?: ""
				val VirtIO_SCSI						= locKr?.get(DiskInterfaceB.virtio_scsi.localizationKey)?.toString() ?: ""
				val VirtIO							= locKr?.get(DiskInterfaceB.virtio.localizationKey)?.toString() ?: ""
				val SPAPR_VSCSI						= locKr?.get(DiskInterfaceB.spapr_vscsi.localizationKey)?.toString() ?: ""
				val SATA							= locKr?.get(DiskInterfaceB.sata.localizationKey)?.toString() ?: ""
			}
			object EN {
				val IDE								= locEn?.get(DiskInterfaceB.ide.localizationKey)?.toString() ?: ""
				val VirtIO_SCSI						= locEn?.get(DiskInterfaceB.virtio_scsi.localizationKey)?.toString() ?: ""
				val VirtIO							= locEn?.get(DiskInterfaceB.virtio.localizationKey)?.toString() ?: ""
				val SPAPR_VSCSI						= locEn?.get(DiskInterfaceB.spapr_vscsi.localizationKey)?.toString() ?: ""
				val SATA							= locEn?.get(DiskInterfaceB.sata.localizationKey)?.toString() ?: ""
			}
		}
		//endregion: DiskInterfaceL


		//region: DiskStorageTypeL
		object DiskStorageTypeL {
			object KR {
				val image                   = locKr?.get(DiskStorageType.image.localizationKey)?.toString() ?: ""
				val cinder                  = locKr?.get(DiskStorageType.cinder.localizationKey)?.toString() ?: ""
				val lun                     = locKr?.get(DiskStorageType.lun.localizationKey)?.toString() ?: ""
				val managed_block_storage	= locKr?.get(DiskStorageType.managed_block_storage.localizationKey)?.toString() ?: ""
				val unknown                 = locKr?.get(DiskStorageType.unknown.localizationKey)?.toString() ?: ""
			}
			object EN {
				val image                   = locEn?.get(DiskStorageType.image.localizationKey)?.toString() ?: ""
				val cinder                  = locEn?.get(DiskStorageType.cinder.localizationKey)?.toString() ?: ""
				val lun                     = locEn?.get(DiskStorageType.lun.localizationKey)?.toString() ?: ""
				val managed_block_storage	= locEn?.get(DiskStorageType.managed_block_storage.localizationKey)?.toString() ?: ""
				val unknown                 = locEn?.get(DiskStorageType.unknown.localizationKey)?.toString() ?: ""
			}

		}
		//endregion: DiskStorageTypeL

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


		//region: ImageTransferPhaseL
		object ImageTransferPhaseL {
			object KR {
				val unknown				= locKr?.get(ImageTransferPhaseB.unknown.localizationKey)?.toString() ?: ""
				val initializing		= locKr?.get(ImageTransferPhaseB.initializing.localizationKey)?.toString() ?: ""
				val transferring		= locKr?.get(ImageTransferPhaseB.transferring.localizationKey)?.toString() ?: ""
				val resuming			= locKr?.get(ImageTransferPhaseB.resuming.localizationKey)?.toString() ?: ""
				val paused_system		= locKr?.get(ImageTransferPhaseB.paused_system.localizationKey)?.toString() ?: ""
				val paused_user			= locKr?.get(ImageTransferPhaseB.paused_user.localizationKey)?.toString() ?: ""
				val cancelled_system	= locKr?.get(ImageTransferPhaseB.cancelled_system.localizationKey)?.toString() ?: ""
				val finalizing_success	= locKr?.get(ImageTransferPhaseB.finalizing_success.localizationKey)?.toString() ?: ""
				val finalizing_failure	= locKr?.get(ImageTransferPhaseB.finalizing_failure.localizationKey)?.toString() ?: ""
				val finished_success	= locKr?.get(ImageTransferPhaseB.finished_success.localizationKey)?.toString() ?: ""
				val finished_failure	= locKr?.get(ImageTransferPhaseB.finished_failure.localizationKey)?.toString() ?: ""
				val cancelled_user		= locKr?.get(ImageTransferPhaseB.cancelled_user.localizationKey)?.toString() ?: ""
				val finalizing_cleanup	= locKr?.get(ImageTransferPhaseB.finalizing_cleanup.localizationKey)?.toString() ?: ""
				val finished_cleanup	= locKr?.get(ImageTransferPhaseB.finished_cleanup.localizationKey)?.toString() ?: ""
			}
			object EN {
				val unknown				= locEn?.get(ImageTransferPhaseB.unknown.localizationKey)?.toString() ?: ""
				val initializing		= locEn?.get(ImageTransferPhaseB.initializing.localizationKey)?.toString() ?: ""
				val transferring		= locEn?.get(ImageTransferPhaseB.transferring.localizationKey)?.toString() ?: ""
				val resuming			= locEn?.get(ImageTransferPhaseB.resuming.localizationKey)?.toString() ?: ""
				val paused_system		= locEn?.get(ImageTransferPhaseB.paused_system.localizationKey)?.toString() ?: ""
				val paused_user			= locEn?.get(ImageTransferPhaseB.paused_user.localizationKey)?.toString() ?: ""
				val cancelled_system	= locEn?.get(ImageTransferPhaseB.cancelled_system.localizationKey)?.toString() ?: ""
				val finalizing_success	= locEn?.get(ImageTransferPhaseB.finalizing_success.localizationKey)?.toString() ?: ""
				val finalizing_failure	= locEn?.get(ImageTransferPhaseB.finalizing_failure.localizationKey)?.toString() ?: ""
				val finished_success	= locEn?.get(ImageTransferPhaseB.finished_success.localizationKey)?.toString() ?: ""
				val finished_failure	= locEn?.get(ImageTransferPhaseB.finished_failure.localizationKey)?.toString() ?: ""
				val cancelled_user		= locEn?.get(ImageTransferPhaseB.cancelled_user.localizationKey)?.toString() ?: ""
				val finalizing_cleanup	= locEn?.get(ImageTransferPhaseB.finalizing_cleanup.localizationKey)?.toString() ?: ""
				val finished_cleanup	= locEn?.get(ImageTransferPhaseB.finished_cleanup.localizationKey)?.toString() ?: ""
			}
		}
		//endregion: ImageTransferPhaseL


		//region: ImageTransferTypeL
		object ImageTransferTypeL {
			object KR {
				val unknown		= locKr?.get(ImageTransferType.unknown.localizationKey)?.toString() ?: ""
				val download	= locKr?.get(ImageTransferType.download.localizationKey)?.toString() ?: ""
				val upload		= locKr?.get(ImageTransferType.upload.localizationKey)?.toString() ?: ""
			}
			object EN {
				val unknown		= locEn?.get(ImageTransferType.unknown.localizationKey)?.toString() ?: ""
				val download	= locEn?.get(ImageTransferType.download.localizationKey)?.toString() ?: ""
				val upload		= locEn?.get(ImageTransferType.upload.localizationKey)?.toString() ?: ""
			}
		}
		//endregion: ImageTransferTypeL


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

		//region: NetworkStatusL
		object NetworkStatusL {
			object KR {
				val NON_OPERATIONAL =	locKr?.get(NetworkStatusB.non_operational.localizationKey)?.toString() ?: ""
				val OPERATIONAL =		locKr?.get(NetworkStatusB.operational.localizationKey)?.toString() ?: ""
			}
			object EN {
				val NON_OPERATIONAL =	locEn?.get(NetworkStatusB.non_operational.localizationKey)?.toString() ?: ""
				val OPERATIONAL =		locEn?.get(NetworkStatusB.operational.localizationKey)?.toString() ?: ""
			}
		}
		//endregion: NetworkStatusL

		//region ProviderTypeL
		object ProviderTypeL {
			object KR {
				val OPENSTACK_NETWORK	= locKr?.get(ProviderTypeB.openstack_network.localizationKey)?.toString() ?: ""
				val FOREMAN 			= locKr?.get(ProviderTypeB.foreman.localizationKey)?.toString() ?: ""
				val OPENSTACK_IMAGE		= locKr?.get(ProviderTypeB.openstack_image.localizationKey)?.toString() ?: ""
				val OPENSTACK_VOLUME	= locKr?.get(ProviderTypeB.openstack_volume.localizationKey)?.toString() ?: ""
				val VMWARE				= locKr?.get(ProviderTypeB.vmware.localizationKey)?.toString() ?: ""
				val EXTERNAL_NETWORK	= locKr?.get(ProviderTypeB.external_network.localizationKey)?.toString() ?: ""
				val KVM					= locKr?.get(ProviderTypeB.kvm.localizationKey)?.toString() ?: ""
				val XEN					= locKr?.get(ProviderTypeB.xen.localizationKey)?.toString() ?: ""
				val KUBEVIRT			= locKr?.get(ProviderTypeB.kubevirt.localizationKey)?.toString() ?: ""
			}
			object EN {
				val OPENSTACK_NETWORK	= locEn?.get(ProviderTypeB.openstack_network.localizationKey)?.toString() ?: ""
				val FOREMAN 			= locEn?.get(ProviderTypeB.foreman.localizationKey)?.toString() ?: ""
				val OPENSTACK_IMAGE		= locEn?.get(ProviderTypeB.openstack_image.localizationKey)?.toString() ?: ""
				val OPENSTACK_VOLUME	= locEn?.get(ProviderTypeB.openstack_volume.localizationKey)?.toString() ?: ""
				val VMWARE				= locEn?.get(ProviderTypeB.vmware.localizationKey)?.toString() ?: ""
				val EXTERNAL_NETWORK	= locEn?.get(ProviderTypeB.external_network.localizationKey)?.toString() ?: ""
				val KVM					= locEn?.get(ProviderTypeB.kvm.localizationKey)?.toString() ?: ""
				val XEN					= locEn?.get(ProviderTypeB.xen.localizationKey)?.toString() ?: ""
				val KUBEVIRT			= locEn?.get(ProviderTypeB.kubevirt.localizationKey)?.toString() ?: ""
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

		//region: RoleTypeL
		object RoleTypeL {
			object KR {
				val admin = locKr?.get(RoleTypeB.admin.localizationKey)?.toString() ?: ""
				val user = locKr?.get(RoleTypeB.user.localizationKey)?.toString() ?: ""
			}
			object EN {
				val admin = locEn?.get(RoleTypeB.admin.localizationKey)?.toString() ?: ""
				val user = locEn?.get(RoleTypeB.user.localizationKey)?.toString() ?: ""
			}
		}
		//endregion: RoleTypeL

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

	fun findLocalizedName4ActionGroup(type: ActionGroup, loc: String = "kr"): String = when(type) {
		ActionGroup.ACCESS_IMAGE_STORAGE -> 				if (loc == "kr") ActionGroupL.KR.ACCESS_IMAGE_STORAGE else ActionGroupL.EN.ACCESS_IMAGE_STORAGE
		ActionGroup.ADD_USERS_AND_GROUPS_FROM_DIRECTORY -> 	if (loc == "kr") ActionGroupL.KR.ADD_USERS_AND_GROUPS_FROM_DIRECTORY else ActionGroupL.EN.ADD_USERS_AND_GROUPS_FROM_DIRECTORY
		ActionGroup.ASSIGN_CLUSTER_NETWORK -> 				if (loc == "kr") ActionGroupL.KR.ASSIGN_CLUSTER_NETWORK else ActionGroupL.EN.ASSIGN_CLUSTER_NETWORK
		ActionGroup.ASSIGN_CPU_PROFILE -> 					if (loc == "kr") ActionGroupL.KR.ASSIGN_CPU_PROFILE else ActionGroupL.EN.ASSIGN_CPU_PROFILE
		ActionGroup.ATTACH_DISK -> 							if (loc == "kr") ActionGroupL.KR.ATTACH_DISK else ActionGroupL.EN.ATTACH_DISK
		ActionGroup.ATTACH_DISK_PROFILE -> 					if (loc == "kr") ActionGroupL.KR.ATTACH_DISK_PROFILE else ActionGroupL.EN.ATTACH_DISK_PROFILE
		ActionGroup.AUDIT_LOG_MANAGEMENT -> 				if (loc == "kr") ActionGroupL.KR.AUDIT_LOG_MANAGEMENT else ActionGroupL.EN.AUDIT_LOG_MANAGEMENT
		ActionGroup.BACKUP_DISK -> 							if (loc == "kr") ActionGroupL.KR.BACKUP_DISK else ActionGroupL.EN.BACKUP_DISK
		ActionGroup.BOOKMARK_MANAGEMENT -> 					if (loc == "kr") ActionGroupL.KR.BOOKMARK_MANAGEMENT else ActionGroupL.EN.BOOKMARK_MANAGEMENT
		ActionGroup.CHANGE_VM_CD -> 						if (loc == "kr") ActionGroupL.KR.CHANGE_VM_CD else ActionGroupL.EN.CHANGE_VM_CD
		ActionGroup.CHANGE_VM_CUSTOM_PROPERTIES -> 			if (loc == "kr") ActionGroupL.KR.CHANGE_VM_CUSTOM_PROPERTIES else ActionGroupL.EN.CHANGE_VM_CUSTOM_PROPERTIES
		ActionGroup.CONFIGURE_CLUSTER_NETWORK -> 			if (loc == "kr") ActionGroupL.KR.CONFIGURE_CLUSTER_NETWORK else ActionGroupL.EN.CONFIGURE_CLUSTER_NETWORK
		ActionGroup.CONFIGURE_DISK_STORAGE -> 				if (loc == "kr") ActionGroupL.KR.CONFIGURE_DISK_STORAGE else ActionGroupL.EN.CONFIGURE_DISK_STORAGE
		ActionGroup.CONFIGURE_ENGINE -> 					if (loc == "kr") ActionGroupL.KR.CONFIGURE_ENGINE else ActionGroupL.EN.CONFIGURE_ENGINE
		ActionGroup.CONFIGURE_HOST_NETWORK -> 				if (loc == "kr") ActionGroupL.KR.CONFIGURE_HOST_NETWORK else ActionGroupL.EN.CONFIGURE_HOST_NETWORK
		ActionGroup.CONFIGURE_MAC_POOL -> 					if (loc == "kr") ActionGroupL.KR.CONFIGURE_MAC_POOL else ActionGroupL.EN.CONFIGURE_MAC_POOL
		ActionGroup.CONFIGURE_NETWORK_VNIC_PROFILE -> 		if (loc == "kr") ActionGroupL.KR.CONFIGURE_NETWORK_VNIC_PROFILE else ActionGroupL.EN.CONFIGURE_NETWORK_VNIC_PROFILE
		ActionGroup.CONFIGURE_SCSI_GENERIC_IO -> 			if (loc == "kr") ActionGroupL.KR.CONFIGURE_SCSI_GENERIC_IO else ActionGroupL.EN.CONFIGURE_SCSI_GENERIC_IO
		ActionGroup.CONFIGURE_STORAGE_DISK_PROFILE -> 		if (loc == "kr") ActionGroupL.KR.CONFIGURE_STORAGE_DISK_PROFILE else ActionGroupL.EN.CONFIGURE_STORAGE_DISK_PROFILE
		ActionGroup.CONFIGURE_STORAGE_POOL_NETWORK -> 		if (loc == "kr") ActionGroupL.KR.CONFIGURE_STORAGE_POOL_NETWORK else ActionGroupL.EN.CONFIGURE_STORAGE_POOL_NETWORK
		ActionGroup.CONFIGURE_TEMPLATE_NETWORK -> 			if (loc == "kr") ActionGroupL.KR.CONFIGURE_TEMPLATE_NETWORK else ActionGroupL.EN.CONFIGURE_TEMPLATE_NETWORK
		ActionGroup.CONFIGURE_VM_NETWORK -> 				if (loc == "kr") ActionGroupL.KR.CONFIGURE_VM_NETWORK else ActionGroupL.EN.CONFIGURE_VM_NETWORK
		ActionGroup.CONFIGURE_VM_STORAGE -> 				if (loc == "kr") ActionGroupL.KR.CONFIGURE_VM_STORAGE else ActionGroupL.EN.CONFIGURE_VM_STORAGE
		ActionGroup.CONNECT_TO_SERIAL_CONSOLE -> 			if (loc == "kr") ActionGroupL.KR.CONNECT_TO_SERIAL_CONSOLE else ActionGroupL.EN.CONNECT_TO_SERIAL_CONSOLE
		ActionGroup.CONNECT_TO_VM -> 						if (loc == "kr") ActionGroupL.KR.CONNECT_TO_VM else ActionGroupL.EN.CONNECT_TO_VM
		ActionGroup.COPY_TEMPLATE -> 						if (loc == "kr") ActionGroupL.KR.COPY_TEMPLATE else ActionGroupL.EN.COPY_TEMPLATE
		ActionGroup.CREATE_CLUSTER -> 						if (loc == "kr") ActionGroupL.KR.CREATE_CLUSTER else ActionGroupL.EN.CREATE_CLUSTER
		ActionGroup.CREATE_CPU_PROFILE -> 					if (loc == "kr") ActionGroupL.KR.CREATE_CPU_PROFILE else ActionGroupL.EN.CREATE_CPU_PROFILE
		ActionGroup.CREATE_DISK -> 							if (loc == "kr") ActionGroupL.KR.CREATE_DISK else ActionGroupL.EN.CREATE_DISK
		ActionGroup.CREATE_GLUSTER_VOLUME -> 				if (loc == "kr") ActionGroupL.KR.CREATE_GLUSTER_VOLUME else ActionGroupL.EN.CREATE_GLUSTER_VOLUME
		ActionGroup.CREATE_HOST -> 							if (loc == "kr") ActionGroupL.KR.CREATE_HOST else ActionGroupL.EN.CREATE_HOST
		ActionGroup.CREATE_INSTANCE -> 						if (loc == "kr") ActionGroupL.KR.CREATE_INSTANCE else ActionGroupL.EN.CREATE_INSTANCE
		ActionGroup.CREATE_MAC_POOL -> 						if (loc == "kr") ActionGroupL.KR.CREATE_MAC_POOL else ActionGroupL.EN.CREATE_MAC_POOL
		ActionGroup.CREATE_NETWORK_VNIC_PROFILE -> 			if (loc == "kr") ActionGroupL.KR.CREATE_NETWORK_VNIC_PROFILE else ActionGroupL.EN.CREATE_NETWORK_VNIC_PROFILE
		ActionGroup.CREATE_STORAGE_DISK_PROFILE -> 			if (loc == "kr") ActionGroupL.KR.CREATE_STORAGE_DISK_PROFILE else ActionGroupL.EN.CREATE_STORAGE_DISK_PROFILE
		ActionGroup.CREATE_STORAGE_DOMAIN -> 				if (loc == "kr") ActionGroupL.KR.CREATE_STORAGE_DOMAIN else ActionGroupL.EN.CREATE_STORAGE_DOMAIN
		ActionGroup.CREATE_STORAGE_POOL -> 					if (loc == "kr") ActionGroupL.KR.CREATE_STORAGE_POOL else ActionGroupL.EN.CREATE_STORAGE_POOL
		ActionGroup.CREATE_STORAGE_POOL_NETWORK -> 			if (loc == "kr") ActionGroupL.KR.CREATE_STORAGE_POOL_NETWORK else ActionGroupL.EN.CREATE_STORAGE_POOL_NETWORK
		ActionGroup.CREATE_TEMPLATE -> 						if (loc == "kr") ActionGroupL.KR.CREATE_TEMPLATE else ActionGroupL.EN.CREATE_TEMPLATE
		ActionGroup.CREATE_VM -> 							if (loc == "kr") ActionGroupL.KR.CREATE_VM else ActionGroupL.EN.CREATE_VM
		ActionGroup.CREATE_VM_POOL -> 						if (loc == "kr") ActionGroupL.KR.CREATE_VM_POOL else ActionGroupL.EN.CREATE_VM_POOL
		ActionGroup.DELETE_CLUSTER -> 						if (loc == "kr") ActionGroupL.KR.DELETE_CLUSTER else ActionGroupL.EN.DELETE_CLUSTER
		ActionGroup.DELETE_CPU_PROFILE -> 					if (loc == "kr") ActionGroupL.KR.DELETE_CPU_PROFILE else ActionGroupL.EN.DELETE_CPU_PROFILE
		ActionGroup.DELETE_DISK -> 							if (loc == "kr") ActionGroupL.KR.DELETE_DISK else ActionGroupL.EN.DELETE_DISK
		ActionGroup.DELETE_GLUSTER_VOLUME -> 				if (loc == "kr") ActionGroupL.KR.DELETE_GLUSTER_VOLUME else ActionGroupL.EN.DELETE_GLUSTER_VOLUME
		ActionGroup.DELETE_HOST -> 							if (loc == "kr") ActionGroupL.KR.DELETE_HOST else ActionGroupL.EN.DELETE_HOST
		ActionGroup.DELETE_MAC_POOL -> 						if (loc == "kr") ActionGroupL.KR.DELETE_MAC_POOL else ActionGroupL.EN.DELETE_MAC_POOL
		ActionGroup.DELETE_NETWORK_VNIC_PROFILE -> 			if (loc == "kr") ActionGroupL.KR.DELETE_NETWORK_VNIC_PROFILE else ActionGroupL.EN.DELETE_NETWORK_VNIC_PROFILE
		ActionGroup.DELETE_STORAGE_DISK_PROFILE -> 			if (loc == "kr") ActionGroupL.KR.DELETE_STORAGE_DISK_PROFILE else ActionGroupL.EN.DELETE_STORAGE_DISK_PROFILE
		ActionGroup.DELETE_STORAGE_DOMAIN -> 				if (loc == "kr") ActionGroupL.KR.DELETE_STORAGE_DOMAIN else ActionGroupL.EN.DELETE_STORAGE_DOMAIN
		ActionGroup.DELETE_STORAGE_POOL -> 					if (loc == "kr") ActionGroupL.KR.DELETE_STORAGE_POOL else ActionGroupL.EN.DELETE_STORAGE_POOL
		ActionGroup.DELETE_STORAGE_POOL_NETWORK -> 			if (loc == "kr") ActionGroupL.KR.DELETE_STORAGE_POOL_NETWORK else ActionGroupL.EN.DELETE_STORAGE_POOL_NETWORK
		ActionGroup.DELETE_TEMPLATE -> 						if (loc == "kr") ActionGroupL.KR.DELETE_TEMPLATE else ActionGroupL.EN.DELETE_TEMPLATE
		ActionGroup.DELETE_VM -> 							if (loc == "kr") ActionGroupL.KR.DELETE_VM else ActionGroupL.EN.DELETE_VM
		ActionGroup.DELETE_VM_POOL -> 						if (loc == "kr") ActionGroupL.KR.DELETE_VM_POOL else ActionGroupL.EN.DELETE_VM_POOL
		ActionGroup.DISK_LIVE_STORAGE_MIGRATION -> 			if (loc == "kr") ActionGroupL.KR.DISK_LIVE_STORAGE_MIGRATION else ActionGroupL.EN.DISK_LIVE_STORAGE_MIGRATION
		ActionGroup.EDIT_ADMIN_TEMPLATE_PROPERTIES -> 		if (loc == "kr") ActionGroupL.KR.EDIT_ADMIN_TEMPLATE_PROPERTIES else ActionGroupL.EN.EDIT_ADMIN_TEMPLATE_PROPERTIES
		ActionGroup.EDIT_ADMIN_VM_PROPERTIES -> 			if (loc == "kr") ActionGroupL.KR.EDIT_ADMIN_VM_PROPERTIES else ActionGroupL.EN.EDIT_ADMIN_VM_PROPERTIES
		ActionGroup.EDIT_CLUSTER_CONFIGURATION -> 			if (loc == "kr") ActionGroupL.KR.EDIT_CLUSTER_CONFIGURATION else ActionGroupL.EN.EDIT_CLUSTER_CONFIGURATION
		ActionGroup.EDIT_DISK_PROPERTIES -> 				if (loc == "kr") ActionGroupL.KR.EDIT_DISK_PROPERTIES else ActionGroupL.EN.EDIT_DISK_PROPERTIES
		ActionGroup.EDIT_HOST_CONFIGURATION -> 				if (loc == "kr") ActionGroupL.KR.EDIT_HOST_CONFIGURATION else ActionGroupL.EN.EDIT_HOST_CONFIGURATION
		ActionGroup.EDIT_MAC_POOL -> 						if (loc == "kr") ActionGroupL.KR.EDIT_MAC_POOL else ActionGroupL.EN.EDIT_MAC_POOL
		ActionGroup.EDIT_STORAGE_DOMAIN_CONFIGURATION -> 	if (loc == "kr") ActionGroupL.KR.EDIT_STORAGE_DOMAIN_CONFIGURATION else ActionGroupL.EN.EDIT_STORAGE_DOMAIN_CONFIGURATION
		ActionGroup.EDIT_STORAGE_POOL_CONFIGURATION -> 		if (loc == "kr") ActionGroupL.KR.EDIT_STORAGE_POOL_CONFIGURATION else ActionGroupL.EN.EDIT_STORAGE_POOL_CONFIGURATION
		ActionGroup.EDIT_TEMPLATE_PROPERTIES -> 			if (loc == "kr") ActionGroupL.KR.EDIT_TEMPLATE_PROPERTIES else ActionGroupL.EN.EDIT_TEMPLATE_PROPERTIES
		ActionGroup.EDIT_VM_POOL_CONFIGURATION -> 			if (loc == "kr") ActionGroupL.KR.EDIT_VM_POOL_CONFIGURATION else ActionGroupL.EN.EDIT_VM_POOL_CONFIGURATION
		ActionGroup.EDIT_VM_PROPERTIES -> 					if (loc == "kr") ActionGroupL.KR.EDIT_VM_PROPERTIES else ActionGroupL.EN.EDIT_VM_PROPERTIES
		ActionGroup.EVENT_NOTIFICATION_MANAGEMENT -> 		if (loc == "kr") ActionGroupL.KR.EVENT_NOTIFICATION_MANAGEMENT else ActionGroupL.EN.EVENT_NOTIFICATION_MANAGEMENT
		ActionGroup.HIBERNATE_VM -> 						if (loc == "kr") ActionGroupL.KR.HIBERNATE_VM else ActionGroupL.EN.HIBERNATE_VM
		ActionGroup.IMPORT_EXPORT_VM -> 					if (loc == "kr") ActionGroupL.KR.IMPORT_EXPORT_VM else ActionGroupL.EN.IMPORT_EXPORT_VM
		ActionGroup.LOGIN -> 								if (loc == "kr") ActionGroupL.KR.LOGIN else ActionGroupL.EN.LOGIN
		ActionGroup.MANIPULATE_AFFINITY_GROUPS -> 			if (loc == "kr") ActionGroupL.KR.MANIPULATE_AFFINITY_GROUPS else ActionGroupL.EN.MANIPULATE_AFFINITY_GROUPS
		ActionGroup.MANIPULATE_GLUSTER_HOOK -> 				if (loc == "kr") ActionGroupL.KR.MANIPULATE_GLUSTER_HOOK else ActionGroupL.EN.MANIPULATE_GLUSTER_HOOK
		ActionGroup.MANIPULATE_GLUSTER_SERVICE -> 			if (loc == "kr") ActionGroupL.KR.MANIPULATE_GLUSTER_SERVICE else ActionGroupL.EN.MANIPULATE_GLUSTER_SERVICE
		ActionGroup.MANIPULATE_GLUSTER_VOLUME -> 			if (loc == "kr") ActionGroupL.KR.MANIPULATE_GLUSTER_VOLUME else ActionGroupL.EN.MANIPULATE_GLUSTER_VOLUME
		ActionGroup.MANIPULATE_HOST -> 						if (loc == "kr") ActionGroupL.KR.MANIPULATE_HOST else ActionGroupL.EN.MANIPULATE_HOST
		ActionGroup.MANIPULATE_PERMISSIONS -> 				if (loc == "kr") ActionGroupL.KR.MANIPULATE_PERMISSIONS else ActionGroupL.EN.MANIPULATE_PERMISSIONS
		ActionGroup.MANIPULATE_ROLES -> 					if (loc == "kr") ActionGroupL.KR.MANIPULATE_ROLES else ActionGroupL.EN.MANIPULATE_ROLES
		ActionGroup.MANIPULATE_STORAGE_DOMAIN -> 			if (loc == "kr") ActionGroupL.KR.MANIPULATE_STORAGE_DOMAIN else ActionGroupL.EN.MANIPULATE_STORAGE_DOMAIN
		ActionGroup.MANIPULATE_USERS -> 					if (loc == "kr") ActionGroupL.KR.MANIPULATE_USERS else ActionGroupL.EN.MANIPULATE_USERS
		ActionGroup.MANIPULATE_VM_SNAPSHOTS -> 				if (loc == "kr") ActionGroupL.KR.MANIPULATE_VM_SNAPSHOTS else ActionGroupL.EN.MANIPULATE_VM_SNAPSHOTS
		ActionGroup.MIGRATE_VM -> 							if (loc == "kr") ActionGroupL.KR.MIGRATE_VM else ActionGroupL.EN.MIGRATE_VM
		ActionGroup.MOVE_VM -> 								if (loc == "kr") ActionGroupL.KR.MOVE_VM else ActionGroupL.EN.MOVE_VM
		ActionGroup.REBOOT_VM -> 							if (loc == "kr") ActionGroupL.KR.REBOOT_VM else ActionGroupL.EN.REBOOT_VM
		ActionGroup.RECONNECT_TO_VM -> 						if (loc == "kr") ActionGroupL.KR.RECONNECT_TO_VM else ActionGroupL.EN.RECONNECT_TO_VM
		ActionGroup.RESET_VM -> 							if (loc == "kr") ActionGroupL.KR.RESET_VM else ActionGroupL.EN.RESET_VM
		ActionGroup.RUN_VM -> 								if (loc == "kr") ActionGroupL.KR.RUN_VM else ActionGroupL.EN.RUN_VM
		ActionGroup.SHUT_DOWN_VM -> 						if (loc == "kr") ActionGroupL.KR.SHUT_DOWN_VM else ActionGroupL.EN.SHUT_DOWN_VM
		ActionGroup.SPARSIFY_DISK -> 						if (loc == "kr") ActionGroupL.KR.SPARSIFY_DISK else ActionGroupL.EN.SPARSIFY_DISK
		ActionGroup.STOP_VM -> 								if (loc == "kr") ActionGroupL.KR.STOP_VM else ActionGroupL.EN.STOP_VM
		ActionGroup.TAG_MANAGEMENT -> 						if (loc == "kr") ActionGroupL.KR.TAG_MANAGEMENT else ActionGroupL.EN.TAG_MANAGEMENT
		ActionGroup.UPDATE_CPU_PROFILE -> 					if (loc == "kr") ActionGroupL.KR.UPDATE_CPU_PROFILE else ActionGroupL.EN.UPDATE_CPU_PROFILE
		ActionGroup.VM_POOL_BASIC_OPERATIONS -> 			if (loc == "kr") ActionGroupL.KR.VM_POOL_BASIC_OPERATIONS else ActionGroupL.EN.VM_POOL_BASIC_OPERATIONS
		else -> if (loc == "kr") "알 수 없음" else "Unknown"
	}

	fun findLocalizedName4ActionType(type: ActionType, loc: String="kr"): String = when(type) {
		ActionType.ActivateDeactivateVmNic ->						if (loc == "kr") ActionTypeL.KR.ActivateDeactivateVmNic else ActionTypeL.EN.ActivateDeactivateVmNic
		ActionType.ActivateGlusterVolumeSnapshot ->					if (loc == "kr") ActionTypeL.KR.ActivateGlusterVolumeSnapshot else ActionTypeL.EN.ActivateGlusterVolumeSnapshot
		ActionType.ActivateStorageDomain -> 						if (loc == "kr") ActionTypeL.KR.ActivateStorageDomain else ActionTypeL.EN.ActivateStorageDomain
		ActionType.ActivateVds ->									if (loc == "kr") ActionTypeL.KR.ActivateVds else ActionTypeL.EN.ActivateVds
		// ActionType.AddBond ->										if (loc == "kr") ActionTypeL.KR.AddBond else ActionTypeL.EN.AddBond
		ActionType.AddBricksToGlusterVolume -> 						if (loc == "kr") ActionTypeL.KR.AddBricksToGlusterVolume else ActionTypeL.EN.AddBricksToGlusterVolume
		ActionType.AddCluster -> 									if (loc == "kr") ActionTypeL.KR.AddCluster else ActionTypeL.EN.AddCluster
		ActionType.AddDisk -> 										if (loc == "kr") ActionTypeL.KR.AddDisk else ActionTypeL.EN.AddDisk
		ActionType.AddEmptyStoragePool -> 							if (loc == "kr") ActionTypeL.KR.AddEmptyStoragePool else ActionTypeL.EN.AddEmptyStoragePool
		ActionType.AddEventSubscription ->							if (loc == "kr") ActionTypeL.KR.AddEventSubscription else ActionTypeL.EN.AddEventSubscription
		ActionType.AddGlusterHook ->								if (loc == "kr") ActionTypeL.KR.AddGlusterHook else ActionTypeL.EN.AddGlusterHook
		ActionType.AddLibvirtSecret ->								if (loc == "kr") ActionTypeL.KR.AddLibvirtSecret else ActionTypeL.EN.AddLibvirtSecret
		ActionType.AddLocalStorageDomain ->							if (loc == "kr") ActionTypeL.KR.AddLocalStorageDomain else ActionTypeL.EN.AddLocalStorageDomain
		ActionType.AddNFSStorageDomain ->							if (loc == "kr") ActionTypeL.KR.AddNFSStorageDomain else ActionTypeL.EN.AddNFSStorageDomain
		ActionType.AddNetwork ->									if (loc == "kr") ActionTypeL.KR.AddNetwork else ActionTypeL.EN.AddNetwork
		ActionType.AddPermission ->									if (loc == "kr") ActionTypeL.KR.AddPermission else ActionTypeL.EN.AddPermission
		ActionType.AddQuota ->										if (loc == "kr") ActionTypeL.KR.AddQuota else ActionTypeL.EN.AddQuota
		// ActionType.AddRoleWithActions ->							if (loc == "kr") ActionTypeL.KR.AddRoleWithActions else ActionTypeL.EN.AddRoleWithActions
		ActionType.AddSANStorageDomain ->							if (loc == "kr") ActionTypeL.KR.AddSANStorageDomain else ActionTypeL.EN.AddSANStorageDomain
		ActionType.AddStoragePoolWithStorages ->					if (loc == "kr") ActionTypeL.KR.AddStoragePoolWithStorages else ActionTypeL.EN.AddStoragePoolWithStorages
		ActionType.AddStorageServerConnection ->					if (loc == "kr") ActionTypeL.KR.AddStorageServerConnection else ActionTypeL.EN.AddStorageServerConnection
		ActionType.AddSubnetToProvider ->							if (loc == "kr") ActionTypeL.KR.AddSubnetToProvider else ActionTypeL.EN.AddSubnetToProvider
		ActionType.AddVds ->										if (loc == "kr") ActionTypeL.KR.AddVds else ActionTypeL.EN.AddVds
		ActionType.AddVm ->											if (loc == "kr") ActionTypeL.KR.AddVm else ActionTypeL.EN.AddVm
		// ActionType.AddVmAndAttachToUser ->							if (loc == "kr") ActionTypeL.KR.AddVmAndAttachToUser else ActionTypeL.EN.AddVmAndAttachToUser
		ActionType.AddVmFromScratch ->								if (loc == "kr") ActionTypeL.KR.AddVmFromScratch else ActionTypeL.EN.AddVmFromScratch
		ActionType.AddVmInterface ->								if (loc == "kr") ActionTypeL.KR.AddVmInterface else ActionTypeL.EN.AddVmInterface
		ActionType.AddVmPool ->										if (loc == "kr") ActionTypeL.KR.AddVmPool else ActionTypeL.EN.AddVmPool
		ActionType.AddVmTemplate ->									if (loc == "kr") ActionTypeL.KR.AddVmTemplate else ActionTypeL.EN.AddVmTemplate
		ActionType.AddVmTemplateInterface ->						if (loc == "kr") ActionTypeL.KR.AddVmTemplateInterface else ActionTypeL.EN.AddVmTemplateInterface
		ActionType.AddVmToPool ->									if (loc == "kr") ActionTypeL.KR.AddVmToPool else ActionTypeL.EN.AddVmToPool
		ActionType.AddVnicProfile ->								if (loc == "kr") ActionTypeL.KR.AddVnicProfile else ActionTypeL.EN.AddVnicProfile
		ActionType.ApproveVds ->									if (loc == "kr") ActionTypeL.KR.ApproveVds else ActionTypeL.EN.ApproveVds
		// ActionType.AttachActionToRole ->							if (loc == "kr") ActionTypeL.KR.AttachActionToRole else ActionTypeL.EN.AttachActionToRole
		ActionType.AttachDiskToVm ->								if (loc == "kr") ActionTypeL.KR.AttachDiskToVm else ActionTypeL.EN.AttachDiskToVm
		ActionType.AttachNetworkToCluster ->						if (loc == "kr") ActionTypeL.KR.AttachNetworkToCluster else ActionTypeL.EN.AttachNetworkToCluster
		// ActionType.AttachNetworkToVdsInterface ->					if (loc == "kr") ActionTypeL.KR.AttachNetworkToVdsInterface else ActionTypeL.EN.AttachNetworkToVdsInterface
		ActionType.AttachStorageDomainToPool ->						if (loc == "kr") ActionTypeL.KR.AttachStorageDomainToPool else ActionTypeL.EN.AttachStorageDomainToPool
		// ActionType.AttachUserToVmFromPool ->						if (loc == "kr") ActionTypeL.KR.AttachUserToVmFromPool else ActionTypeL.EN.AttachUserToVmFromPool
		ActionType.AttachUserToVmFromPoolAndRun ->					if (loc == "kr") ActionTypeL.KR.AttachUserToVmFromPoolAndRun else ActionTypeL.EN.AttachUserToVmFromPoolAndRun
		// ActionType.AttachVmPoolToAdGroup ->							if (loc == "kr") ActionTypeL.KR.AttachVmPoolToAdGroup else ActionTypeL.EN.AttachVmPoolToAdGroup
		// ActionType.AttachVmPoolToUser ->							if (loc == "kr") ActionTypeL.KR.AttachVmPoolToUser else ActionTypeL.EN.AttachVmPoolToUser
		// ActionType.AttachVmToAdGroup ->								if (loc == "kr") ActionTypeL.KR.AttachVmToAdGroup else ActionTypeL.EN.AttachVmToAdGroup
		// ActionType.AttachVmToUser ->								if (loc == "kr") ActionTypeL.KR.AttachVmToUser else ActionTypeL.EN.AttachVmToUser
		ActionType.AttachVmsToTag ->								if (loc == "kr") ActionTypeL.KR.AttachVmsToTag else ActionTypeL.EN.AttachVmsToTag
		ActionType.ChangeDisk ->									if (loc == "kr") ActionTypeL.KR.ChangeDisk else ActionTypeL.EN.ChangeDisk
		ActionType.CommitNetworkChanges ->							if (loc == "kr") ActionTypeL.KR.CommitNetworkChanges else ActionTypeL.EN.CommitNetworkChanges
		ActionType.ConnectStorageToVds ->							if (loc == "kr") ActionTypeL.KR.ConnectStorageToVds else ActionTypeL.EN.ConnectStorageToVds
		ActionType.CreateBrick ->									if (loc == "kr") ActionTypeL.KR.CreateBrick else ActionTypeL.EN.CreateBrick
		ActionType.CreateGlusterVolume ->							if (loc == "kr") ActionTypeL.KR.CreateGlusterVolume else ActionTypeL.EN.CreateGlusterVolume
		ActionType.CreateGlusterVolumeGeoRepSession ->				if (loc == "kr") ActionTypeL.KR.CreateGlusterVolumeGeoRepSession else ActionTypeL.EN.CreateGlusterVolumeGeoRepSession
		ActionType.CreateGlusterVolumeSnapshot ->					if (loc == "kr") ActionTypeL.KR.CreateGlusterVolumeSnapshot else ActionTypeL.EN.CreateGlusterVolumeSnapshot
		ActionType.DeactivateGlusterVolumeSnapshot ->				if (loc == "kr") ActionTypeL.KR.DeactivateGlusterVolumeSnapshot else ActionTypeL.EN.DeactivateGlusterVolumeSnapshot
		ActionType.DeactivateStorageDomain ->						if (loc == "kr") ActionTypeL.KR.DeactivateStorageDomain else ActionTypeL.EN.DeactivateStorageDomain
		ActionType.DeleteAllGlusterVolumeSnapshots ->				if (loc == "kr") ActionTypeL.KR.DeleteAllGlusterVolumeSnapshots else ActionTypeL.EN.DeleteAllGlusterVolumeSnapshots
		ActionType.DeleteGeoRepSession ->							if (loc == "kr") ActionTypeL.KR.DeleteGeoRepSession else ActionTypeL.EN.DeleteGeoRepSession
		ActionType.DeleteGlusterVolume ->							if (loc == "kr") ActionTypeL.KR.DeleteGlusterVolume else ActionTypeL.EN.DeleteGlusterVolume
		ActionType.DeleteGlusterVolumeSnapshot ->					if (loc == "kr") ActionTypeL.KR.DeleteGlusterVolumeSnapshot else ActionTypeL.EN.DeleteGlusterVolumeSnapshot
		// ActionType.DetachActionFromRole ->							if (loc == "kr") ActionTypeL.KR.DetachActionFromRole else ActionTypeL.EN.DetachActionFromRole
		ActionType.DetachDiskFromVm ->								if (loc == "kr") ActionTypeL.KR.DetachDiskFromVm else ActionTypeL.EN.DetachDiskFromVm
		// ActionType.DetachNetworkFromVdsInterface ->					if (loc == "kr") ActionTypeL.KR.DetachNetworkFromVdsInterface else ActionTypeL.EN.DetachNetworkFromVdsInterface
		ActionType.DetachNetworkToCluster ->						if (loc == "kr") ActionTypeL.KR.DetachNetworkToCluster else ActionTypeL.EN.DetachNetworkToCluster
		ActionType.DetachStorageDomainFromPool ->					if (loc == "kr") ActionTypeL.KR.DetachStorageDomainFromPool else ActionTypeL.EN.DetachStorageDomainFromPool
		ActionType.DetachUserFromVmFromPool ->						if (loc == "kr") ActionTypeL.KR.DetachUserFromVmFromPool else ActionTypeL.EN.DetachUserFromVmFromPool
		// ActionType.DetachVmFromAdGroup ->							if (loc == "kr") ActionTypeL.KR.DetachVmFromAdGroup else ActionTypeL.EN.DetachVmFromAdGroup
		ActionType.DetachVmFromTag ->								if (loc == "kr") ActionTypeL.KR.DetachVmFromTag else ActionTypeL.EN.DetachVmFromTag
		// ActionType.DetachVmFromUser ->								if (loc == "kr") ActionTypeL.KR.DetachVmFromUser else ActionTypeL.EN.DetachVmFromUser
		// ActionType.DetachVmPoolFromAdGroup ->						if (loc == "kr") ActionTypeL.KR.DetachVmPoolFromAdGroup else ActionTypeL.EN.DetachVmPoolFromAdGroup
		// ActionType.DetachVmPoolFromUser ->							if (loc == "kr") ActionTypeL.KR.DetachVmPoolFromUser else ActionTypeL.EN.DetachVmPoolFromUser
		ActionType.DisableGlusterHook ->							if (loc == "kr") ActionTypeL.KR.DisableGlusterHook else ActionTypeL.EN.DisableGlusterHook
		ActionType.EnableGlusterHook ->								if (loc == "kr") ActionTypeL.KR.EnableGlusterHook else ActionTypeL.EN.EnableGlusterHook
		ActionType.ExportVm ->										if (loc == "kr") ActionTypeL.KR.ExportVm else ActionTypeL.EN.ExportVm
		ActionType.ExportVmTemplate ->								if (loc == "kr") ActionTypeL.KR.ExportVmTemplate else ActionTypeL.EN.ExportVmTemplate
		ActionType.ExtendSANStorageDomain ->						if (loc == "kr") ActionTypeL.KR.ExtendSANStorageDomain else ActionTypeL.EN.ExtendSANStorageDomain
		ActionType.FenceVdsManualy ->								if (loc == "kr") ActionTypeL.KR.FenceVdsManualy else ActionTypeL.EN.FenceVdsManualy
		ActionType.ForceRemoveStorageDomain ->						if (loc == "kr") ActionTypeL.KR.ForceRemoveStorageDomain else ActionTypeL.EN.ForceRemoveStorageDomain
		// ActionType.GlusterHostAdd ->								if (loc == "kr") ActionTypeL.KR.GlusterHostAdd else ActionTypeL.EN.GlusterHostAdd
		ActionType.GlusterVolumeRemoveBricks ->						if (loc == "kr") ActionTypeL.KR.GlusterVolumeRemoveBricks else ActionTypeL.EN.GlusterVolumeRemoveBricks
		ActionType.HibernateVm ->									if (loc == "kr") ActionTypeL.KR.HibernateVm else ActionTypeL.EN.HibernateVm
		ActionType.ImportVm ->										if (loc == "kr") ActionTypeL.KR.ImportVm else ActionTypeL.EN.ImportVm
		ActionType.ImportVmTemplate ->								if (loc == "kr") ActionTypeL.KR.ImportVmTemplate else ActionTypeL.EN.ImportVmTemplate
		ActionType.LiveMigrateDisk ->								if (loc == "kr") ActionTypeL.KR.LiveMigrateDisk else ActionTypeL.EN.LiveMigrateDisk
		// ActionType.LoginAdminUser ->								if (loc == "kr") ActionTypeL.KR.LoginAdminUser else ActionTypeL.EN.LoginAdminUser
		ActionType.MaintenanceNumberOfVdss ->						if (loc == "kr") ActionTypeL.KR.MaintenanceNumberOfVdss else ActionTypeL.EN.MaintenanceNumberOfVdss
		ActionType.ManageGlusterService ->							if (loc == "kr") ActionTypeL.KR.ManageGlusterService else ActionTypeL.EN.ManageGlusterService
		// ActionType.MergeSnapshot ->									if (loc == "kr") ActionTypeL.KR.MergeSnapshot else ActionTypeL.EN.MergeSnapshot
		ActionType.MigrateVm ->										if (loc == "kr") ActionTypeL.KR.MigrateVm else ActionTypeL.EN.MigrateVm
		ActionType.MigrateVmToServer ->								if (loc == "kr") ActionTypeL.KR.MigrateVmToServer else ActionTypeL.EN.MigrateVmToServer
		ActionType.MoveDisk ->										if (loc == "kr") ActionTypeL.KR.MoveDisk else ActionTypeL.EN.MoveDisk
		ActionType.MoveOrCopyDisk ->								if (loc == "kr") ActionTypeL.KR.MoveOrCopyDisk else ActionTypeL.EN.MoveOrCopyDisk
		ActionType.PauseGlusterVolumeGeoRepSession ->				if (loc == "kr") ActionTypeL.KR.PauseGlusterVolumeGeoRepSession else ActionTypeL.EN.PauseGlusterVolumeGeoRepSession
		// ActionType.PauseVm ->										if (loc == "kr") ActionTypeL.KR.PauseVm else ActionTypeL.EN.PauseVm
		ActionType.ProcessOvfUpdateForStorageDomain ->				if (loc == "kr") ActionTypeL.KR.ProcessOvfUpdateForStorageDomain else ActionTypeL.EN.ProcessOvfUpdateForStorageDomain
		ActionType.RecoveryStoragePool ->							if (loc == "kr") ActionTypeL.KR.RecoveryStoragePool else ActionTypeL.EN.RecoveryStoragePool
		ActionType.RefreshGeoRepSessions ->							if (loc == "kr") ActionTypeL.KR.RefreshGeoRepSessions else ActionTypeL.EN.RefreshGeoRepSessions
		// ActionType.RefreshGlusterHook ->							if (loc == "kr") ActionTypeL.KR.RefreshGlusterHook else ActionTypeL.EN.RefreshGlusterHook
		ActionType.RefreshHostCapabilities ->						if (loc == "kr") ActionTypeL.KR.RefreshHostCapabilities else ActionTypeL.EN.RefreshHostCapabilities
		// ActionType.RemoveAdGroup ->									if (loc == "kr") ActionTypeL.KR.RemoveAdGroup else ActionTypeL.EN.RemoveAdGroup
		// ActionType.RemoveBond ->									if (loc == "kr") ActionTypeL.KR.RemoveBond else ActionTypeL.EN.RemoveBond
		ActionType.RemoveCluster ->									if (loc == "kr") ActionTypeL.KR.RemoveCluster else ActionTypeL.EN.RemoveCluster
		ActionType.RemoveDisk ->									if (loc == "kr") ActionTypeL.KR.RemoveDisk else ActionTypeL.EN.RemoveDisk
		ActionType.RemoveEventSubscription ->						if (loc == "kr") ActionTypeL.KR.RemoveEventSubscription else ActionTypeL.EN.RemoveEventSubscription
		ActionType.RemoveGlusterHook ->								if (loc == "kr") ActionTypeL.KR.RemoveGlusterHook else ActionTypeL.EN.RemoveGlusterHook
		ActionType.RemoveNetwork ->									if (loc == "kr") ActionTypeL.KR.RemoveNetwork else ActionTypeL.EN.RemoveNetwork
		ActionType.RemovePermission ->								if (loc == "kr") ActionTypeL.KR.RemovePermission else ActionTypeL.EN.RemovePermission
		ActionType.RemoveQuota ->									if (loc == "kr") ActionTypeL.KR.RemoveQuota else ActionTypeL.EN.RemoveQuota
		ActionType.RemoveRole ->									if (loc == "kr") ActionTypeL.KR.RemoveRole else ActionTypeL.EN.RemoveRole
		ActionType.RemoveStorageDomain ->							if (loc == "kr") ActionTypeL.KR.RemoveStorageDomain else ActionTypeL.EN.RemoveStorageDomain
		ActionType.RemoveStoragePool ->								if (loc == "kr") ActionTypeL.KR.RemoveStoragePool else ActionTypeL.EN.RemoveStoragePool
		ActionType.RemoveSubnetFromProvider ->						if (loc == "kr") ActionTypeL.KR.RemoveSubnetFromProvider else ActionTypeL.EN.RemoveSubnetFromProvider
		ActionType.RemoveUser ->									if (loc == "kr") ActionTypeL.KR.RemoveUser else ActionTypeL.EN.RemoveUser
		ActionType.RemoveVds ->										if (loc == "kr") ActionTypeL.KR.RemoveVds else ActionTypeL.EN.RemoveVds
		ActionType.RemoveVm ->										if (loc == "kr") ActionTypeL.KR.RemoveVm else ActionTypeL.EN.RemoveVm
		ActionType.RemoveVmFromImportExport ->						if (loc == "kr") ActionTypeL.KR.RemoveVmFromImportExport else ActionTypeL.EN.RemoveVmFromImportExport
		ActionType.RemoveVmFromPool ->								if (loc == "kr") ActionTypeL.KR.RemoveVmFromPool else ActionTypeL.EN.RemoveVmFromPool
		ActionType.RemoveVmInterface ->								if (loc == "kr") ActionTypeL.KR.RemoveVmInterface else ActionTypeL.EN.RemoveVmInterface
		ActionType.RemoveVmPool ->									if (loc == "kr") ActionTypeL.KR.RemoveVmPool else ActionTypeL.EN.RemoveVmPool
		ActionType.RemoveVmTemplate ->								if (loc == "kr") ActionTypeL.KR.RemoveVmTemplate else ActionTypeL.EN.RemoveVmTemplate
		ActionType.RemoveVmTemplateFromImportExport ->				if (loc == "kr") ActionTypeL.KR.RemoveVmTemplateFromImportExport else ActionTypeL.EN.RemoveVmTemplateFromImportExport
		ActionType.RemoveVmTemplateInterface ->						if (loc == "kr") ActionTypeL.KR.RemoveVmTemplateInterface else ActionTypeL.EN.RemoveVmTemplateInterface
		ActionType.RemoveVnicProfile ->								if (loc == "kr") ActionTypeL.KR.RemoveVnicProfile else ActionTypeL.EN.RemoveVnicProfile
		ActionType.ReplaceGlusterVolumeBrick ->						if (loc == "kr") ActionTypeL.KR.ReplaceGlusterVolumeBrick else ActionTypeL.EN.ReplaceGlusterVolumeBrick
		ActionType.RescheduleGlusterVolumeSnapshot ->				if (loc == "kr") ActionTypeL.KR.RescheduleGlusterVolumeSnapshot else ActionTypeL.EN.RescheduleGlusterVolumeSnapshot
		ActionType.ResetGlusterVolumeBrick ->						if (loc == "kr") ActionTypeL.KR.ResetGlusterVolumeBrick else ActionTypeL.EN.ResetGlusterVolumeBrick
		ActionType.ResetGlusterVolumeOptions ->						if (loc == "kr") ActionTypeL.KR.ResetGlusterVolumeOptions else ActionTypeL.EN.ResetGlusterVolumeOptions
		ActionType.RestartVds ->									if (loc == "kr") ActionTypeL.KR.RestartVds else ActionTypeL.EN.RestartVds
		ActionType.RestoreAllSnapshots ->							if (loc == "kr") ActionTypeL.KR.RestoreAllSnapshots else ActionTypeL.EN.RestoreAllSnapshots
		ActionType.RestoreGlusterVolumeSnapshot ->					if (loc == "kr") ActionTypeL.KR.RestoreGlusterVolumeSnapshot else ActionTypeL.EN.RestoreGlusterVolumeSnapshot
		ActionType.ResumeGeoRepSession ->							if (loc == "kr") ActionTypeL.KR.ResumeGeoRepSession else ActionTypeL.EN.ResumeGeoRepSession
		ActionType.RunVm ->											if (loc == "kr") ActionTypeL.KR.RunVm else ActionTypeL.EN.RunVm
		ActionType.RunVmOnce ->										if (loc == "kr") ActionTypeL.KR.RunVmOnce else ActionTypeL.EN.RunVmOnce
		ActionType.ScheduleGlusterVolumeSnapshot ->					if (loc == "kr") ActionTypeL.KR.ScheduleGlusterVolumeSnapshot else ActionTypeL.EN.ScheduleGlusterVolumeSnapshot
		ActionType.SetGlusterVolumeOption ->						if (loc == "kr") ActionTypeL.KR.SetGlusterVolumeOption else ActionTypeL.EN.SetGlusterVolumeOption
		// ActionType.SetupNetworks ->									if (loc == "kr") ActionTypeL.KR.SetupNetworks else ActionTypeL.EN.SetupNetworks
		ActionType.ShutdownVm ->									if (loc == "kr") ActionTypeL.KR.ShutdownVm else ActionTypeL.EN.ShutdownVm
		ActionType.StartGlusterVolume ->							if (loc == "kr") ActionTypeL.KR.StartGlusterVolume else ActionTypeL.EN.StartGlusterVolume
		ActionType.StartGlusterVolumeGeoRep ->						if (loc == "kr") ActionTypeL.KR.StartGlusterVolumeGeoRep else ActionTypeL.EN.StartGlusterVolumeGeoRep
		ActionType.StartGlusterVolumeProfile ->						if (loc == "kr") ActionTypeL.KR.StartGlusterVolumeProfile else ActionTypeL.EN.StartGlusterVolumeProfile
		ActionType.StartRebalanceGlusterVolume ->					if (loc == "kr") ActionTypeL.KR.StartRebalanceGlusterVolume else ActionTypeL.EN.StartRebalanceGlusterVolume
		ActionType.StartVds ->										if (loc == "kr") ActionTypeL.KR.StartVds else ActionTypeL.EN.StartVds
		ActionType.StopGeoRepSession ->								if (loc == "kr") ActionTypeL.KR.StopGeoRepSession else ActionTypeL.EN.StopGeoRepSession
		ActionType.StopGlusterVolume ->								if (loc == "kr") ActionTypeL.KR.StopGlusterVolume else ActionTypeL.EN.StopGlusterVolume
		ActionType.StopGlusterVolumeProfile ->						if (loc == "kr") ActionTypeL.KR.StopGlusterVolumeProfile else ActionTypeL.EN.StopGlusterVolumeProfile
		ActionType.StopVds ->										if (loc == "kr") ActionTypeL.KR.StopVds else ActionTypeL.EN.StopVds
		ActionType.StopVm ->										if (loc == "kr") ActionTypeL.KR.StopVm else ActionTypeL.EN.StopVm
		ActionType.SyncStorageDevices ->							if (loc == "kr") ActionTypeL.KR.SyncStorageDevices else ActionTypeL.EN.SyncStorageDevices
		ActionType.TryBackToAllSnapshotsOfVm ->						if (loc == "kr") ActionTypeL.KR.TryBackToAllSnapshotsOfVm else ActionTypeL.EN.TryBackToAllSnapshotsOfVm
		ActionType.UpdateCluster ->									if (loc == "kr") ActionTypeL.KR.UpdateCluster else ActionTypeL.EN.UpdateCluster
		ActionType.UpdateDisk ->									if (loc == "kr") ActionTypeL.KR.UpdateDisk else ActionTypeL.EN.UpdateDisk
		// ActionType.UpdateDisplayToCluster ->						if (loc == "kr") ActionTypeL.KR.UpdateDisplayToCluster else ActionTypeL.EN.UpdateDisplayToCluster
		ActionType.UpdateGlusterHook ->								if (loc == "kr") ActionTypeL.KR.UpdateGlusterHook else ActionTypeL.EN.UpdateGlusterHook
		// ActionType.UpdateGlusterVolumeSnapshotConfigCommand -> 		if (loc == "kr") ActionTypeL.KR.UpdateGlusterVolumeSnapshotConfigCommand else ActionTypeL.EN.UpdateGlusterVolumeSnapshotConfigCommand
		ActionType.UpdateLibvirtSecret ->							if (loc == "kr") ActionTypeL.KR.UpdateLibvirtSecret else ActionTypeL.EN.UpdateLibvirtSecret
		ActionType.UpdateNetwork ->									if (loc == "kr") ActionTypeL.KR.UpdateNetwork else ActionTypeL.EN.UpdateNetwork
		// ActionType.UpdateNetworkToVdsInterface ->					if (loc == "kr") ActionTypeL.KR.UpdateNetworkToVdsInterface else ActionTypeL.EN.UpdateNetworkToVdsInterface
		// ActionType.UpdateProfile ->									if (loc == "kr") ActionTypeL.KR.UpdateProfile else ActionTypeL.EN.UpdateProfile
		ActionType.UpdateQuota ->									if (loc == "kr") ActionTypeL.KR.UpdateQuota else ActionTypeL.EN.UpdateQuota
		ActionType.UpdateRole ->									if (loc == "kr") ActionTypeL.KR.UpdateRole else ActionTypeL.EN.UpdateRole
		ActionType.UpdateStorageDomain ->							if (loc == "kr") ActionTypeL.KR.UpdateStorageDomain else ActionTypeL.EN.UpdateStorageDomain
		ActionType.UpdateStoragePool ->								if (loc == "kr") ActionTypeL.KR.UpdateStoragePool else ActionTypeL.EN.UpdateStoragePool
		ActionType.UpdateVds ->										if (loc == "kr") ActionTypeL.KR.UpdateVds else ActionTypeL.EN.UpdateVds
		ActionType.UpdateVm ->										if (loc == "kr") ActionTypeL.KR.UpdateVm else ActionTypeL.EN.UpdateVm
		// ActionType.UpdateVmConsoleData ->							if (loc == "kr") ActionTypeL.KR.UpdateVmConsoleData else ActionTypeL.EN.UpdateVmConsoleData
		ActionType.UpdateVmInterface ->								if (loc == "kr") ActionTypeL.KR.UpdateVmInterface else ActionTypeL.EN.UpdateVmInterface
		ActionType.UpdateVmPool ->									if (loc == "kr") ActionTypeL.KR.UpdateVmPool else ActionTypeL.EN.UpdateVmPool
		ActionType.UpdateVmTemplate ->								if (loc == "kr") ActionTypeL.KR.UpdateVmTemplate else ActionTypeL.EN.UpdateVmTemplate
		ActionType.UpdateVmTemplateInterface ->						if (loc == "kr") ActionTypeL.KR.UpdateVmTemplateInterface else ActionTypeL.EN.UpdateVmTemplateInterface
		// ActionType.UploadDiskImage ->								if (loc == "kr") ActionTypeL.KR.UploadDiskImage else ActionTypeL.EN.UploadDiskImage
		// ActionType.UploadImageStatus ->								if (loc == "kr") ActionTypeL.KR.UploadImageStatus else ActionTypeL.EN.UploadImageStatus
		else -> if (loc == "kr") "알 수 없음" else "Unknown"
	}

	fun findLocalizedName4AuditLogSeverity(type: AuditLogSeverity, loc: String = "kr"): String = when(type) {
		AuditLogSeverity.normal ->		if (loc == "kr") AuditLogSeverityL.KR.NORMAL else type.name
		AuditLogSeverity.warning -> 	if (loc == "kr") AuditLogSeverityL.KR.WARNING else type.name
		AuditLogSeverity.error ->		if (loc == "kr") AuditLogSeverityL.KR.ERROR else type.name
		AuditLogSeverity.alert ->		if (loc == "kr") AuditLogSeverityL.KR.ALERT else type.name
		else -> if (loc == "kr") "알 수 없음" else "Unknown"
	}

	fun findLocalizedName4AuditLogType(type: AuditLogType, loc: String="kr"): String = when(type) {

		else -> if (loc == "kr") "알 수 없음" else "Unknown"
	}

	fun findLocalizedName4CpuPinningPolicy(type: CpuPinningPolicyB, loc: String = "kr"): String = when(type) {
		CpuPinningPolicyB.none ->					if (loc == "kr") CpuPinningPolicyL.KR.none else CpuPinningPolicyL.EN.none
		CpuPinningPolicyB.manual -> 				if (loc == "kr") CpuPinningPolicyL.KR.manual else CpuPinningPolicyL.EN.manual
		CpuPinningPolicyB.resize_and_pin_numa ->	if (loc == "kr") CpuPinningPolicyL.KR.resize_and_pin_numa else CpuPinningPolicyL.EN.resize_and_pin_numa
		CpuPinningPolicyB.dedicated ->       		if (loc == "kr") CpuPinningPolicyL.KR.dedicated else CpuPinningPolicyL.EN.dedicated
		CpuPinningPolicyB.isolate_threads -> 		if (loc == "kr") CpuPinningPolicyL.KR.isolate_threads else CpuPinningPolicyL.EN.isolate_threads
	}

	fun findLocalizedName4ProviderType(type: ProviderTypeB, loc: String = "kr"): String = when(type) {
		ProviderTypeB.openstack_network ->		if (loc == "kr") ProviderTypeL.KR.OPENSTACK_NETWORK	else ProviderTypeL.EN.OPENSTACK_NETWORK
		ProviderTypeB.foreman -> 				if (loc == "kr") ProviderTypeL.KR.FOREMAN 			else ProviderTypeL.EN.FOREMAN
		ProviderTypeB.openstack_image -> 		if (loc == "kr") ProviderTypeL.KR.OPENSTACK_IMAGE	else ProviderTypeL.EN.OPENSTACK_IMAGE
		ProviderTypeB.openstack_volume ->		if (loc == "kr") ProviderTypeL.KR.OPENSTACK_VOLUME	else ProviderTypeL.EN.OPENSTACK_VOLUME
		ProviderTypeB.external_network -> 		if (loc == "kr") ProviderTypeL.KR.EXTERNAL_NETWORK	else ProviderTypeL.EN.EXTERNAL_NETWORK
		ProviderTypeB.vmware -> 				if (loc == "kr") ProviderTypeL.KR.VMWARE			else ProviderTypeL.EN.VMWARE
		ProviderTypeB.kvm ->					if (loc == "kr") ProviderTypeL.KR.KVM				else ProviderTypeL.EN.KVM
		ProviderTypeB.xen ->					if (loc == "kr") ProviderTypeL.KR.XEN				else ProviderTypeL.EN.XEN
		ProviderTypeB.kubevirt ->				if (loc == "kr") ProviderTypeL.KR.KUBEVIRT			else ProviderTypeL.EN.KUBEVIRT
	}

	fun findLocalizedName4NetworkStatus(type: NetworkStatusB, loc: String = "kr"): String = when(type) {
		NetworkStatusB.non_operational ->		if (loc == "kr") NetworkStatusL.KR.NON_OPERATIONAL else NetworkStatusL.EN.NON_OPERATIONAL
		NetworkStatusB.operational ->			if (loc == "kr") NetworkStatusL.KR.OPERATIONAL else NetworkStatusL.EN.OPERATIONAL
	}

	fun findLocalizedName4BiosType(type: BiosTypeB, loc: String = "kr"): String = when(type) {
		BiosTypeB.i440fx_sea_bios ->		if (loc == "kr") BiosTypeL.KR.i440fx_sea_bios		else BiosTypeL.EN.i440fx_sea_bios
		BiosTypeB.q35_sea_bios -> 			if (loc == "kr") BiosTypeL.KR.q35_sea_bios 			else BiosTypeL.EN.q35_sea_bios
		BiosTypeB.cluster_default,			// TODO: 지금은 이 값으로 그냥 고정이지만 실제로 어디서 구하는지 찾아야 함
		BiosTypeB.q35_ovmf -> 				if (loc == "kr") BiosTypeL.KR.q35_ovmf				else BiosTypeL.EN.q35_ovmf
		BiosTypeB.q35_secure_boot ->		if (loc == "kr") BiosTypeL.KR.q35_secure_boot		else BiosTypeL.EN.q35_secure_boot
		// else -> if (loc == "kr") "알 수 없음" else "Unknown"
	}

	fun findLocalizedName4DiskContentType(type: DiskContentTypeB, loc: String = "kr"): String = when(type) {
		DiskContentTypeB.data -> 							if (loc == "kr") DiskContentTypeL.KR.DATA else DiskContentTypeL.EN.DATA
		DiskContentTypeB.ovf_store -> 						if (loc == "kr") DiskContentTypeL.KR.OVF_STORE else DiskContentTypeL.EN.OVF_STORE
		DiskContentTypeB.memory_dump_volume -> 				if (loc == "kr") DiskContentTypeL.KR.MEMORY_DUMP_VOLUME else DiskContentTypeL.EN.MEMORY_DUMP_VOLUME
		DiskContentTypeB.memory_metadata_volume -> 			if (loc == "kr") DiskContentTypeL.KR.MEMORY_METADATA_VOLUME else DiskContentTypeL.EN.MEMORY_METADATA_VOLUME
		DiskContentTypeB.iso -> 								if (loc == "kr") DiskContentTypeL.KR.ISO else DiskContentTypeL.EN.ISO
		DiskContentTypeB.hosted_engine -> 					if (loc == "kr") DiskContentTypeL.KR.HOSTED_ENGINE else DiskContentTypeL.EN.HOSTED_ENGINE
		DiskContentTypeB.hosted_engine_sanlock -> 			if (loc == "kr") DiskContentTypeL.KR.HOSTED_ENGINE_SANLOCK else DiskContentTypeL.EN.HOSTED_ENGINE_SANLOCK
		DiskContentTypeB.hosted_engine_metadata -> 			if (loc == "kr") DiskContentTypeL.KR.HOSTED_ENGINE_METADATA else DiskContentTypeL.EN.HOSTED_ENGINE_METADATA
		DiskContentTypeB.hosted_engine_configuration -> 		if (loc == "kr") DiskContentTypeL.KR.HOSTED_ENGINE_CONFIGURATION else DiskContentTypeL.EN.HOSTED_ENGINE_CONFIGURATION
		DiskContentTypeB.backup_scratch -> 					if (loc == "kr") DiskContentTypeL.KR.BACKUP_SCRATCH else DiskContentTypeL.EN.BACKUP_SCRATCH
		DiskContentTypeB.unknown -> 							if (loc == "kr") DiskContentTypeL.KR.UNKNOWN else DiskContentTypeL.EN.UNKNOWN
	}

	fun findLocalizedName4DiskInterface(type: DiskInterfaceB, loc: String = "kr"): String = when(type) {
		DiskInterfaceB.ide -> 			if (loc == "kr") DiskInterfaceL.KR.IDE else DiskInterfaceL.EN.IDE
		DiskInterfaceB.virtio_scsi -> 	if (loc == "kr") DiskInterfaceL.KR.VirtIO_SCSI else DiskInterfaceL.EN.VirtIO_SCSI
		DiskInterfaceB.virtio -> 		if (loc == "kr") DiskInterfaceL.KR.VirtIO else DiskInterfaceL.EN.VirtIO
		DiskInterfaceB.spapr_vscsi -> 	if (loc == "kr") DiskInterfaceL.KR.SPAPR_VSCSI else DiskInterfaceL.EN.SPAPR_VSCSI
		DiskInterfaceB.sata -> 			if (loc == "kr") DiskInterfaceL.KR.SATA else DiskInterfaceL.EN.SATA
	}

	fun findLocalizedName4DiskStorageType(type: DiskStorageType, loc: String = "kr"): String = when(type) {
		DiskStorageType.image ->                    if (loc == "kr") DiskStorageTypeL.KR.image else DiskStorageTypeL.EN.image
		DiskStorageType.cinder ->                   if (loc == "kr") DiskStorageTypeL.KR.cinder else DiskStorageTypeL.EN.cinder
		DiskStorageType.lun ->                      if (loc == "kr") DiskStorageTypeL.KR.lun else DiskStorageTypeL.EN.lun
		DiskStorageType.managed_block_storage ->	if (loc == "kr") DiskStorageTypeL.KR.managed_block_storage else DiskStorageTypeL.EN.managed_block_storage
		DiskStorageType.unknown ->	                if (loc == "kr") DiskStorageTypeL.KR.unknown else DiskStorageTypeL.EN.unknown
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

	fun findLocalizedName4ImageTransferPhaseB(type: ImageTransferPhaseB, loc: String = "kr"): String = when(type) {
		ImageTransferPhaseB.unknown -> 					if (loc == "kr") ImageTransferPhaseL.KR.unknown else ImageTransferPhaseL.EN.unknown
		ImageTransferPhaseB.initializing -> 		    if (loc == "kr") ImageTransferPhaseL.KR.initializing else ImageTransferPhaseL.EN.initializing
		ImageTransferPhaseB.transferring -> 		    if (loc == "kr") ImageTransferPhaseL.KR.transferring else ImageTransferPhaseL.EN.transferring
		ImageTransferPhaseB.resuming -> 		        if (loc == "kr") ImageTransferPhaseL.KR.resuming else ImageTransferPhaseL.EN.resuming
		ImageTransferPhaseB.paused_system -> 		    if (loc == "kr") ImageTransferPhaseL.KR.paused_system else ImageTransferPhaseL.EN.paused_system
		ImageTransferPhaseB.paused_user -> 		        if (loc == "kr") ImageTransferPhaseL.KR.paused_user else ImageTransferPhaseL.EN.paused_user
		ImageTransferPhaseB.cancelled_system -> 		if (loc == "kr") ImageTransferPhaseL.KR.cancelled_system else ImageTransferPhaseL.EN.cancelled_system
		ImageTransferPhaseB.finalizing_success -> 		if (loc == "kr") ImageTransferPhaseL.KR.finalizing_success else ImageTransferPhaseL.EN.finalizing_success
		ImageTransferPhaseB.finalizing_failure -> 		if (loc == "kr") ImageTransferPhaseL.KR.finalizing_failure else ImageTransferPhaseL.EN.finalizing_failure
		ImageTransferPhaseB.finished_success -> 		if (loc == "kr") ImageTransferPhaseL.KR.finished_success else ImageTransferPhaseL.EN.finished_success
		ImageTransferPhaseB.finished_failure -> 		if (loc == "kr") ImageTransferPhaseL.KR.finished_failure else ImageTransferPhaseL.EN.finished_failure
		ImageTransferPhaseB.cancelled_user -> 		    if (loc == "kr") ImageTransferPhaseL.KR.cancelled_user else ImageTransferPhaseL.EN.cancelled_user
		ImageTransferPhaseB.finalizing_cleanup -> 		if (loc == "kr") ImageTransferPhaseL.KR.finalizing_cleanup else ImageTransferPhaseL.EN.finalizing_cleanup
		ImageTransferPhaseB.finished_cleanup -> 		if (loc == "kr") ImageTransferPhaseL.KR.finished_cleanup else ImageTransferPhaseL.EN.finished_cleanup
	}

	fun findLocalizedName4ImageTransferType(type: ImageTransferType, loc: String = "kr"): String = when(type) {
		ImageTransferType.unknown ->		if (loc == "kr") ImageTransferTypeL.KR.unknown else ImageTransferTypeL.EN.unknown
		ImageTransferType.download ->       if (loc == "kr") ImageTransferTypeL.KR.download else ImageTransferTypeL.EN.download
		ImageTransferType.upload ->         if (loc == "kr") ImageTransferTypeL.KR.upload else ImageTransferTypeL.EN.upload
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

	fun findLocalizedName4RoleType(type: RoleTypeB, loc: String = "kr"): String = when(type) {
		RoleTypeB.admin ->				if (loc == "kr") RoleTypeL.KR.admin else RoleTypeL.EN.admin
		RoleTypeB.user ->				if (loc == "kr") RoleTypeL.KR.user else RoleTypeL.EN.user
		else -> if (loc == "kr") "알 수 없음" else "Unknown"
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
