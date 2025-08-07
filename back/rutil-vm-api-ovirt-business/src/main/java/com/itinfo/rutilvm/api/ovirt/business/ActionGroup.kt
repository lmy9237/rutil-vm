package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

/**
 * [ActionGroup]
 * 작업그룹 유형
 *
 * @author 이찬희 (@chanhi2000)
 */
enum class ActionGroup(
	override val value: Int,
	val roleType: RoleTypeB,
	val allowsViewingChildren: Boolean,
	val applicationMode: ApplicationMode? = null,
): Identifiable {
	// vm actions groups
	CREATE_VM(1, RoleTypeB.user, false, ApplicationMode.VirtOnly),
	DELETE_VM(2, RoleTypeB.user, true, ApplicationMode.VirtOnly),
	EDIT_VM_PROPERTIES(3, RoleTypeB.user, true, ApplicationMode.VirtOnly),
	REBOOT_VM(17, RoleTypeB.user, true, ApplicationMode.VirtOnly),
	RESET_VM(23, RoleTypeB.user, true, ApplicationMode.VirtOnly),
	STOP_VM(18, RoleTypeB.user, true, ApplicationMode.VirtOnly),
	SHUT_DOWN_VM(19, RoleTypeB.user, true, ApplicationMode.VirtOnly),
	HIBERNATE_VM(21, RoleTypeB.user, true, ApplicationMode.VirtOnly),
	RUN_VM(22, RoleTypeB.user, true, ApplicationMode.VirtOnly),
	CHANGE_VM_CD(5, RoleTypeB.user, true, ApplicationMode.VirtOnly),
	MIGRATE_VM(6, RoleTypeB.user, true, ApplicationMode.VirtOnly),
	CONNECT_TO_SERIAL_CONSOLE(1664, RoleTypeB.user, true, ApplicationMode.VirtOnly),
	/**
	 * Connect to the console of a virtual machine, but only if no user
	 * has connected before:
	 */
	CONNECT_TO_VM(7, RoleTypeB.user, true, ApplicationMode.VirtOnly),

	IMPORT_EXPORT_VM(8, RoleTypeB.admin, true, ApplicationMode.VirtOnly),
	CONFIGURE_VM_NETWORK(9, RoleTypeB.user, true, ApplicationMode.VirtOnly),
	CONFIGURE_VM_STORAGE(10, RoleTypeB.user, true, ApplicationMode.VirtOnly),
	MOVE_VM(11, RoleTypeB.user, true, ApplicationMode.VirtOnly),
	MANIPULATE_VM_SNAPSHOTS(12, RoleTypeB.user, true, ApplicationMode.VirtOnly),

	/**
	 * Connect to the console of a virtual machine even if a different
	 * user was connected before:
	 */
	RECONNECT_TO_VM(13, RoleTypeB.user, true, ApplicationMode.VirtOnly),

	CHANGE_VM_CUSTOM_PROPERTIES(14, RoleTypeB.admin, true, ApplicationMode.VirtOnly),
	/**
	 * Admin role can specify destinationVdsId to override default target host.
	 */
	EDIT_ADMIN_VM_PROPERTIES(15, RoleTypeB.admin, true, ApplicationMode.VirtOnly),

	CREATE_INSTANCE(16, RoleTypeB.user, false, ApplicationMode.VirtOnly),

	// host (vds) actions groups
	CREATE_HOST(100, RoleTypeB.admin, true),
	EDIT_HOST_CONFIGURATION(101, RoleTypeB.admin, true),
	DELETE_HOST(102, RoleTypeB.admin, true),
	MANIPULATE_HOST(103, RoleTypeB.admin, true),
	CONFIGURE_HOST_NETWORK(104, RoleTypeB.admin, true),
	// templates actions groups
	CREATE_TEMPLATE(200, RoleTypeB.user, false, ApplicationMode.VirtOnly),
	EDIT_TEMPLATE_PROPERTIES(201, RoleTypeB.user, true, ApplicationMode.VirtOnly),
	DELETE_TEMPLATE(202, RoleTypeB.user, true, ApplicationMode.VirtOnly),
	COPY_TEMPLATE(203, RoleTypeB.user, true, ApplicationMode.VirtOnly),
	CONFIGURE_TEMPLATE_NETWORK(204, RoleTypeB.user, true, ApplicationMode.VirtOnly),
	EDIT_ADMIN_TEMPLATE_PROPERTIES(205, RoleTypeB.admin, true, ApplicationMode.VirtOnly),
	// vm pools actions groups
	CREATE_VM_POOL(300, RoleTypeB.user, false, ApplicationMode.VirtOnly),
	EDIT_VM_POOL_CONFIGURATION(301, RoleTypeB.user, true, ApplicationMode.VirtOnly),
	DELETE_VM_POOL(302, RoleTypeB.user, true, ApplicationMode.VirtOnly),
	VM_POOL_BASIC_OPERATIONS(303, RoleTypeB.user, true, ApplicationMode.VirtOnly),
	// clusters actions groups
	CREATE_CLUSTER(400, RoleTypeB.admin, true),
	EDIT_CLUSTER_CONFIGURATION(401, RoleTypeB.admin, true),
	DELETE_CLUSTER(402, RoleTypeB.admin, true),
	CONFIGURE_CLUSTER_NETWORK(403, RoleTypeB.admin, true),
	ASSIGN_CLUSTER_NETWORK(404, RoleTypeB.admin, true),

	// users and MLA actions groups
	MANIPULATE_USERS(500, RoleTypeB.admin, true),
	MANIPULATE_ROLES(501, RoleTypeB.admin, true),
	MANIPULATE_PERMISSIONS(502, RoleTypeB.user, true),
	ADD_USERS_AND_GROUPS_FROM_DIRECTORY(503, RoleTypeB.user, true),
	EDIT_PROFILE(504, RoleTypeB.user, true),

	// storage domains actions groups
	CREATE_STORAGE_DOMAIN(600, RoleTypeB.admin, true, ApplicationMode.VirtOnly),
	EDIT_STORAGE_DOMAIN_CONFIGURATION(601, RoleTypeB.admin, true, ApplicationMode.VirtOnly),
	DELETE_STORAGE_DOMAIN(602, RoleTypeB.admin, true, ApplicationMode.VirtOnly),
	MANIPULATE_STORAGE_DOMAIN(603, RoleTypeB.admin, true, ApplicationMode.VirtOnly),
	// storage pool actions groups
	CREATE_STORAGE_POOL(700, RoleTypeB.admin, true, ApplicationMode.VirtOnly),
	DELETE_STORAGE_POOL(701, RoleTypeB.admin, true, ApplicationMode.VirtOnly),
	EDIT_STORAGE_POOL_CONFIGURATION(702, RoleTypeB.admin, true, ApplicationMode.VirtOnly),
	CONFIGURE_STORAGE_POOL_NETWORK(703, RoleTypeB.admin, true),
	CREATE_STORAGE_POOL_NETWORK(704, RoleTypeB.admin, true),
	DELETE_STORAGE_POOL_NETWORK(705, RoleTypeB.admin, true),

	// engine generic
	CONFIGURE_ENGINE(800, RoleTypeB.admin, true),

	// Quota
	CONFIGURE_QUOTA(900, RoleTypeB.admin, true, ApplicationMode.VirtOnly),
	CONSUME_QUOTA(901, RoleTypeB.user, true, ApplicationMode.VirtOnly),

	// Gluster
	CREATE_GLUSTER_VOLUME(1000, RoleTypeB.admin, true, ApplicationMode.GlusterOnly),
	MANIPULATE_GLUSTER_VOLUME(1001, RoleTypeB.admin, true, ApplicationMode.GlusterOnly),
	DELETE_GLUSTER_VOLUME(1002, RoleTypeB.admin, true, ApplicationMode.GlusterOnly),
	MANIPULATE_GLUSTER_HOOK(1003, RoleTypeB.admin, true, ApplicationMode.GlusterOnly),
	MANIPULATE_GLUSTER_SERVICE(1004, RoleTypeB.admin, true, ApplicationMode.GlusterOnly),

	// Disks action groups
	CREATE_DISK(1100, RoleTypeB.user, false, ApplicationMode.VirtOnly),
	ATTACH_DISK(1101, RoleTypeB.user, true, ApplicationMode.VirtOnly),
	EDIT_DISK_PROPERTIES(1102, RoleTypeB.user, true, ApplicationMode.VirtOnly),
	CONFIGURE_DISK_STORAGE(1103, RoleTypeB.user, true, ApplicationMode.VirtOnly),
	DELETE_DISK(1104, RoleTypeB.user, true, ApplicationMode.VirtOnly),
	CONFIGURE_SCSI_GENERIC_IO(1105, RoleTypeB.admin, true, ApplicationMode.VirtOnly),
	ACCESS_IMAGE_STORAGE(1106, RoleTypeB.user, false, ApplicationMode.VirtOnly),
	DISK_LIVE_STORAGE_MIGRATION(1107, RoleTypeB.user, true, ApplicationMode.VirtOnly),
	SPARSIFY_DISK(1108, RoleTypeB.user, true, ApplicationMode.VirtOnly),
	REDUCE_DISK(1109, RoleTypeB.admin, true, ApplicationMode.VirtOnly),
	BACKUP_DISK(1110, RoleTypeB.admin, true, ApplicationMode.VirtOnly),

	// VNIC Profiles
	CONFIGURE_NETWORK_VNIC_PROFILE(1203, RoleTypeB.admin, true, ApplicationMode.VirtOnly),
	CREATE_NETWORK_VNIC_PROFILE(1204, RoleTypeB.admin, true, ApplicationMode.VirtOnly),
	DELETE_NETWORK_VNIC_PROFILE(1205, RoleTypeB.admin, true, ApplicationMode.VirtOnly),

	// Login action group
	LOGIN(1300, RoleTypeB.user, false),

	// Inject external events action group
	INJECT_EXTERNAL_EVENTS(1400, RoleTypeB.admin, false),

	// Inject external tasks action group
	INJECT_EXTERNAL_TASKS(1500, RoleTypeB.admin, false),

	// Tag management action group
	TAG_MANAGEMENT(1301, RoleTypeB.admin, false),

	// Bookmark management action group
	BOOKMARK_MANAGEMENT(1302, RoleTypeB.admin, false),

	// Event notification management action group
	EVENT_NOTIFICATION_MANAGEMENT(1303, RoleTypeB.admin, false),

	// audit log management action group
	AUDIT_LOG_MANAGEMENT(1304, RoleTypeB.admin, false),

	// affinity group CRUD commands
	MANIPULATE_AFFINITY_GROUPS(1550, RoleTypeB.admin, true, ApplicationMode.VirtOnly),

	// disk profiles
	CONFIGURE_STORAGE_DISK_PROFILE(1560, RoleTypeB.admin, true, ApplicationMode.VirtOnly),
	CREATE_STORAGE_DISK_PROFILE(1561, RoleTypeB.admin, true, ApplicationMode.VirtOnly),
	DELETE_STORAGE_DISK_PROFILE(1562, RoleTypeB.admin, true, ApplicationMode.VirtOnly),
	ATTACH_DISK_PROFILE(1563, RoleTypeB.user, true, ApplicationMode.VirtOnly),

	// MAC pool actions groups
	CREATE_MAC_POOL(1660, RoleTypeB.admin, true, ApplicationMode.VirtOnly),
	EDIT_MAC_POOL(1661, RoleTypeB.admin, true, ApplicationMode.VirtOnly),
	DELETE_MAC_POOL(1662, RoleTypeB.admin, true, ApplicationMode.VirtOnly),
	CONFIGURE_MAC_POOL(1663, RoleTypeB.admin, true, ApplicationMode.VirtOnly),

	// cpu profiles
	DELETE_CPU_PROFILE(1665, RoleTypeB.admin, true, ApplicationMode.VirtOnly),
	UPDATE_CPU_PROFILE(1666, RoleTypeB.admin, true, ApplicationMode.VirtOnly),
	CREATE_CPU_PROFILE(1667, RoleTypeB.admin, true, ApplicationMode.VirtOnly),
	ASSIGN_CPU_PROFILE(1668, RoleTypeB.admin, true, ApplicationMode.VirtOnly);

	override fun toString(): String = code
	val code: String
		get() = this@ActionGroup.name.uppercase()

	val localizationKey: String		get() = "${ActionGroup::class.java.simpleName}.${this.name}"
	private val loc: Localization	get() = Localization.getInstance()
	val en: String					get() = loc.findLocalizedName4ActionGroup(this, "en")
	val kr: String					get() = loc.findLocalizedName4ActionGroup(this, "kr")
	companion object {
		private val valueMapping: MutableMap<Int, ActionGroup> = ConcurrentHashMap<Int, ActionGroup>()
		private val codeMapping: MutableMap<String, ActionGroup> = ConcurrentHashMap<String, ActionGroup>()

		init {
			values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}

		val allActionGroups: List<ActionGroup> = ActionGroup.values().toList()
		@JvmStatic fun forValue(value: Int?): ActionGroup = valueMapping[value ?: LOGIN.value] ?: LOGIN
		@JvmStatic fun forCode(value: String?): ActionGroup = codeMapping[value ?: LOGIN.code] ?: LOGIN
	}
}
