package com.itinfo.rutilvm.api.ovirt.business

import com.itinfo.rutilvm.api.ovirt.business.model.Term
import java.util.concurrent.ConcurrentHashMap

/**
 * [ActionType]
 * 작업유형
 *
 * @author 이찬희 (@chanhi2000)
 */
enum class ActionType(
	override val value: Int,
	val term: Term, // RutilVM 응용에서 추가
	val actionGroup: ActionGroup? = null,
	val isActionMonitored: Boolean? = true,
	val quotaDependency: QuotaDependency? = null,
	val quotaDependentAsInternalCommand: Boolean = false,
): Identifiable {
	Unknown(0, Term.UNKNOWN, null,true, QuotaDependency.NONE),

	// Vm Commands
	AddVm(1, Term.VM, ActionGroup.CREATE_VM, true, QuotaDependency.BOTH),
	AddVmFromTemplate(2, Term.VM, ActionGroup.CREATE_VM, true, QuotaDependency.BOTH),
	AddVmFromScratch(3, Term.VM, ActionGroup.CREATE_VM, true, QuotaDependency.BOTH),
	AddUnmanagedVms(54, Term.VM, null, true, QuotaDependency.NONE),
	RemoveVm(4, Term.VM, ActionGroup.DELETE_VM, true, QuotaDependency.STORAGE),
	UpdateVm(5, Term.VM, ActionGroup.EDIT_VM_PROPERTIES, true, QuotaDependency.CLUSTER),
	RebootVm(6, Term.VM, ActionGroup.REBOOT_VM, true, QuotaDependency.NONE),
	ResetVm(70, Term.VM, ActionGroup.RESET_VM, true, QuotaDependency.NONE),
	StopVm(7, Term.VM, ActionGroup.STOP_VM, true, QuotaDependency.BOTH),
	ShutdownVm(8, Term.VM, ActionGroup.SHUT_DOWN_VM, true, QuotaDependency.CLUSTER),
	ChangeDisk(9, Term.VM, ActionGroup.CHANGE_VM_CD, true, QuotaDependency.NONE),
	HibernateVm(11, Term.VM, ActionGroup.HIBERNATE_VM, true, QuotaDependency.NONE),
	RunVm(12, Term.VM, ActionGroup.RUN_VM, true, QuotaDependency.CLUSTER),
	RunVmOnce(13, Term.VM, ActionGroup.RUN_VM, true, QuotaDependency.BOTH),
	MigrateVm(14, Term.VM, ActionGroup.MIGRATE_VM, true, QuotaDependency.NONE),
	MigrateVmToServer(16, Term.VM, ActionGroup.MIGRATE_VM, true, QuotaDependency.NONE),
	MigrateMultipleVms(66, Term.VM, ActionGroup.MIGRATE_VM, false, QuotaDependency.NONE),
	ReorderVmNics(17, Term.VM, ActionGroup.CREATE_VM, false, QuotaDependency.NONE),
	VmLogon(18, Term.VM, ActionGroup.CONNECT_TO_VM, true, QuotaDependency.NONE),
	SetVmTicket(22, Term.VM, ActionGroup.CONNECT_TO_VM, false, QuotaDependency.NONE),
	ExportVm(23, Term.VM, ActionGroup.IMPORT_EXPORT_VM, true, QuotaDependency.NONE),
	ExportVmTemplate(24, Term.VM, ActionGroup.IMPORT_EXPORT_VM, true, QuotaDependency.NONE),
	RestoreStatelessVm(25, Term.VM, null, true, QuotaDependency.NONE),
	ExportVmToOva(26, Term.VM, ActionGroup.IMPORT_EXPORT_VM, true, QuotaDependency.NONE),
	CreateOva(27, Term.VM, null, true, QuotaDependency.NONE),
	AddVmInterface(28, Term.VM, ActionGroup.CONFIGURE_VM_NETWORK, false, QuotaDependency.NONE),
	RemoveVmInterface(29, Term.VM, ActionGroup.CONFIGURE_VM_NETWORK, false, QuotaDependency.NONE),
	UpdateVmInterface(30, Term.VM, ActionGroup.CONFIGURE_VM_NETWORK, false, QuotaDependency.NONE),
	VmInterfacesModify(260, Term.VM, ActionGroup.CONFIGURE_VM_NETWORK, false, QuotaDependency.NONE),
	AddDisk(31, Term.VM, ActionGroup.CONFIGURE_VM_STORAGE, true, QuotaDependency.STORAGE),
	RegisterDisk(32, Term.VM, ActionGroup.CONFIGURE_VM_STORAGE, true, QuotaDependency.STORAGE),
	ExtractOva(33, Term.VM, null, true, QuotaDependency.NONE),
	UpdateDisk(34, Term.VM, ActionGroup.CONFIGURE_VM_STORAGE, true, QuotaDependency.STORAGE),
	ExportVmTemplateToOva(35, Term.VM, ActionGroup.IMPORT_EXPORT_VM, true, QuotaDependency.NONE),
	AttachDiskToVm(180, Term.VM, ActionGroup.CONFIGURE_VM_STORAGE, false, QuotaDependency.NONE),
	DetachDiskFromVm(181, Term.VM, ActionGroup.CONFIGURE_VM_STORAGE, false, QuotaDependency.NONE),
	HotPlugDiskToVm(182, Term.VM, ActionGroup.CONFIGURE_VM_STORAGE, false, QuotaDependency.NONE),
	HotUnPlugDiskFromVm(183, Term.VM, ActionGroup.CONFIGURE_VM_STORAGE, false, QuotaDependency.NONE),
	HotSetNumberOfCpus(184, Term.VM, ActionGroup.EDIT_VM_PROPERTIES, false, QuotaDependency.CLUSTER, true),
	VmSlaPolicy(185, Term.VM, ActionGroup.EDIT_VM_PROPERTIES, false, QuotaDependency.NONE),
	HotSetAmountOfMemory(186, Term.VM, ActionGroup.EDIT_VM_PROPERTIES, false, QuotaDependency.CLUSTER, true),
	ImportVm(36, Term.VM, ActionGroup.IMPORT_EXPORT_VM, true, QuotaDependency.STORAGE),
	RemoveVmFromImportExport(37, Term.VM, ActionGroup.DELETE_VM, true, QuotaDependency.NONE),
	RemoveVmTemplateFromImportExport(38, Term.VM, ActionGroup.DELETE_TEMPLATE, true, QuotaDependency.NONE),
	ImportVmTemplate(39, Term.VM, ActionGroup.IMPORT_EXPORT_VM, true, QuotaDependency.STORAGE),
	ImportVmTemplateFromOva(64, Term.VM, ActionGroup.IMPORT_EXPORT_VM, true, QuotaDependency.STORAGE),
	AddDiskToTemplate(65, Term.VM, ActionGroup.CONFIGURE_VM_STORAGE, true, QuotaDependency.STORAGE),
	ChangeVMCluster(40, Term.VM, ActionGroup.EDIT_VM_PROPERTIES, false, QuotaDependency.NONE),
	CancelMigrateVm(41, Term.VM, ActionGroup.MIGRATE_VM, false, QuotaDependency.NONE),
	ActivateDeactivateVmNic(42, Term.VM, null, true, QuotaDependency.NONE),
	AddVmFromSnapshot(52, Term.VM, ActionGroup.CREATE_VM, true, QuotaDependency.BOTH),
	CloneVm(53, Term.VM, ActionGroup.CREATE_VM, true, QuotaDependency.BOTH),
	CloneVmNoCollapse(56, Term.VM, ActionGroup.CREATE_VM, true, QuotaDependency.BOTH),
	ImportVmFromConfiguration(43, Term.VM, ActionGroup.IMPORT_EXPORT_VM, true, QuotaDependency.STORAGE),
	UpdateVmVersion(44, Term.VM, null, true, QuotaDependency.NONE),
	ImportVmTemplateFromConfiguration(45, Term.VM, ActionGroup.IMPORT_EXPORT_VM, true, QuotaDependency.STORAGE),
	ProcessDownVm(46, Term.VM, null, true, QuotaDependency.NONE),
	ConvertVm(47, Term.VM, null, true, QuotaDependency.NONE),
	ImportVmFromExternalProvider(48, Term.VM, ActionGroup.IMPORT_EXPORT_VM, true, QuotaDependency.STORAGE),
	ImportVmFromOva(49, Term.VM, ActionGroup.IMPORT_EXPORT_VM, true, QuotaDependency.STORAGE),
	ConvertOva(50, Term.VM, null, true, QuotaDependency.NONE),
	CancelConvertVm(51, Term.VM, ActionGroup.IMPORT_EXPORT_VM, true, QuotaDependency.NONE),
	ImportVmFromExternalUrl(55, Term.VM, ActionGroup.IMPORT_EXPORT_VM, true, QuotaDependency.NONE),
	ImportVmTemplateFromExternalUrl(57, Term.VM, ActionGroup.IMPORT_EXPORT_VM, true, QuotaDependency.NONE),
	AddVmNicFilterParameter(60, Term.VM, ActionGroup.CONFIGURE_VM_NETWORK, false, QuotaDependency.NONE),
	AddVmNicFilterParameterLive(600, Term.VM, ActionGroup.CONFIGURE_VM_NETWORK, false, QuotaDependency.NONE),
	UpdateVmNicFilterParameter(61, Term.VM, ActionGroup.CONFIGURE_VM_NETWORK, false, QuotaDependency.NONE),
	UpdateVmNicFilterParameterLive(610, Term.VM, ActionGroup.CONFIGURE_VM_NETWORK, false, QuotaDependency.NONE),
	RemoveVmNicFilterParameter(62, Term.VM, ActionGroup.CONFIGURE_VM_NETWORK, false, QuotaDependency.NONE),
	RemoveVmNicFilterParameterLive(620, Term.VM, ActionGroup.CONFIGURE_VM_NETWORK, false, QuotaDependency.NONE),
	UpdateConvertedVm(63, Term.VM, null, true, QuotaDependency.NONE),
	RemoveUnregisteredVmTemplate(67, Term.VM, ActionGroup.DELETE_TEMPLATE, true, QuotaDependency.NONE),
	RemoveUnregisteredVm(68, Term.VM, ActionGroup.DELETE_VM, true, QuotaDependency.NONE),
	MeasureVolume(69, Term.VM, null, false, QuotaDependency.NONE),
	ScreenshotVm(71, Term.VM, ActionGroup.CONNECT_TO_VM, true, QuotaDependency.NONE),

	SealVm(255, Term.VM,null, true, QuotaDependency.NONE),

	// VdsCommands
	AddVds(101, Term.HOST, ActionGroup.CREATE_HOST, true, QuotaDependency.NONE),
	UpdateVds(102, Term.HOST, ActionGroup.EDIT_HOST_CONFIGURATION, false, QuotaDependency.NONE),
	RemoveVds(103, Term.HOST, ActionGroup.DELETE_HOST, false, QuotaDependency.NONE),
	RestartVds(104, Term.HOST, ActionGroup.MANIPULATE_HOST, true, QuotaDependency.NONE),
	VdsNotRespondingTreatment(105, Term.HOST, null, true, QuotaDependency.NONE),
	MaintenanceVds(106, Term.HOST, null, true, QuotaDependency.NONE),
	MaintenanceNumberOfVdss(107, Term.HOST, ActionGroup.MANIPULATE_HOST, false, QuotaDependency.NONE),
	ActivateVds(108, Term.HOST, ActionGroup.MANIPULATE_HOST, true, QuotaDependency.NONE),
	InstallVdsInternal(109, Term.HOST, null, true, QuotaDependency.NONE),
	ClearNonResponsiveVdsVms(110, Term.HOST, null, true, QuotaDependency.NONE),
	SshHostReboot(111, Term.HOST, ActionGroup.MANIPULATE_HOST, true, QuotaDependency.NONE),
	ApproveVds(112, Term.HOST, ActionGroup.CREATE_HOST, true, QuotaDependency.NONE),
	HandleVdsCpuFlagsOrClusterChanged(114, Term.HOST, null, true, QuotaDependency.NONE),
	InitVdsOnUp(115, Term.HOST, null, true, QuotaDependency.NONE),
	SetNonOperationalVds(117, Term.HOST, null, true, QuotaDependency.NONE),
	AddVdsSpmId(119, Term.HOST, null, true, QuotaDependency.NONE),
	ForceSelectSPM(120, Term.HOST, null, true, QuotaDependency.NONE),

	// Fencing (including RestartVds above)
	StartVds(121, Term.HOST, ActionGroup.MANIPULATE_HOST, true, QuotaDependency.NONE),
	StopVds(122, Term.HOST, ActionGroup.MANIPULATE_HOST, true, QuotaDependency.NONE),
	HandleVdsVersion(124, Term.HOST, null, true, QuotaDependency.NONE),
	ChangeVDSCluster(125, Term.HOST, ActionGroup.EDIT_HOST_CONFIGURATION, false, QuotaDependency.NONE),
	RefreshHostCapabilities(126, Term.HOST, ActionGroup.MANIPULATE_HOST, false, QuotaDependency.NONE),
	VdsPowerDown(128, Term.HOST, ActionGroup.MANIPULATE_HOST, true, QuotaDependency.NONE),
	InstallVds(130, Term.HOST, ActionGroup.EDIT_HOST_CONFIGURATION, false, QuotaDependency.NONE),
	VdsKdumpDetection(132, Term.HOST, null, true, QuotaDependency.NONE),
	AddFenceAgent(133, Term.HOST, ActionGroup.EDIT_HOST_CONFIGURATION, true, QuotaDependency.NONE),
	RemoveFenceAgent(134, Term.HOST, ActionGroup.EDIT_HOST_CONFIGURATION, true, QuotaDependency.NONE),
	UpdateFenceAgent(135, Term.HOST, ActionGroup.EDIT_HOST_CONFIGURATION, true, QuotaDependency.NONE),
	RemoveFenceAgentsByVdsId(136, Term.HOST, ActionGroup.EDIT_HOST_CONFIGURATION, true, QuotaDependency.NONE),
	UpgradeHost(137, Term.HOST, ActionGroup.EDIT_HOST_CONFIGURATION, false, QuotaDependency.NONE),
	UpgradeHostInternal(138, Term.HOST, null, true, QuotaDependency.NONE),
	HostEnrollCertificate(139, Term.HOST, ActionGroup.EDIT_HOST_CONFIGURATION, false, QuotaDependency.NONE),
	HostEnrollCertificateInternal(140, Term.HOST, null, true, QuotaDependency.NONE),
	HostUpgradeCheck(141, Term.HOST, ActionGroup.EDIT_HOST_CONFIGURATION, false, QuotaDependency.NONE),
	HostUpgradeCheckInternal(142, Term.HOST, null, true, QuotaDependency.NONE),

	// Network
	AddNetwork(154, Term.NETWORK, ActionGroup.CREATE_STORAGE_POOL_NETWORK, true, QuotaDependency.NONE),
	RemoveNetwork(155, Term.NETWORK, ActionGroup.CONFIGURE_STORAGE_POOL_NETWORK, true, QuotaDependency.NONE),
	UpdateNetwork(156, Term.NETWORK, ActionGroup.CONFIGURE_STORAGE_POOL_NETWORK, true, QuotaDependency.NONE),
	CommitNetworkChanges(157, Term.NETWORK, ActionGroup.CONFIGURE_HOST_NETWORK, true, QuotaDependency.NONE),
	ImportExternalNetwork(158, Term.NETWORK, ActionGroup.CREATE_STORAGE_POOL_NETWORK, false, QuotaDependency.NONE),
	InternalImportExternalNetwork(159, Term.NETWORK, null, true, QuotaDependency.NONE),

	// VnicProfile Commands
	AddVnicProfile(160, Term.VNIC_PROFILE, ActionGroup.CREATE_NETWORK_VNIC_PROFILE, false, QuotaDependency.NONE),
	UpdateVnicProfile(161, Term.VNIC_PROFILE, ActionGroup.CONFIGURE_NETWORK_VNIC_PROFILE, false, QuotaDependency.NONE),
	RemoveVnicProfile(162, Term.VNIC_PROFILE, ActionGroup.DELETE_NETWORK_VNIC_PROFILE, false, QuotaDependency.NONE),

	// Network labels
	LabelNetwork(163, Term.NIC, ActionGroup.CONFIGURE_STORAGE_POOL_NETWORK, false, QuotaDependency.NONE),
	UnlabelNetwork(164, Term.NIC, ActionGroup.CONFIGURE_STORAGE_POOL_NETWORK, false, QuotaDependency.NONE),
	LabelNic(165, Term.NIC, ActionGroup.CONFIGURE_HOST_NETWORK, false, QuotaDependency.NONE),
	UnlabelNic(166, Term.NIC, ActionGroup.CONFIGURE_HOST_NETWORK, false, QuotaDependency.NONE),
	PropagateNetworksToClusterHosts(167, Term.NIC, null, true, QuotaDependency.NONE),

	// SR-IOV
	UpdateHostNicVfsConfig(175, Term.HOST_NIC, ActionGroup.CONFIGURE_HOST_NETWORK, false, QuotaDependency.NONE),
	AddVfsConfigNetwork(168, Term.HOST_NIC, ActionGroup.CONFIGURE_HOST_NETWORK, false, QuotaDependency.NONE),
	RemoveVfsConfigNetwork(169, Term.HOST_NIC, ActionGroup.CONFIGURE_HOST_NETWORK, false, QuotaDependency.NONE),
	AddVfsConfigLabel(173, Term.HOST_NIC, ActionGroup.CONFIGURE_HOST_NETWORK, false, QuotaDependency.NONE),
	RemoveVfsConfigLabel(174, Term.HOST_NIC, ActionGroup.CONFIGURE_HOST_NETWORK, false, QuotaDependency.NONE),

	// NUMA
	AddVmNumaNodes(170, Term.VM, ActionGroup.EDIT_VM_PROPERTIES, false, QuotaDependency.NONE),
	UpdateVmNumaNodes(171, Term.VM, ActionGroup.EDIT_VM_PROPERTIES, false, QuotaDependency.NONE),
	RemoveVmNumaNodes(172, Term.VM, ActionGroup.EDIT_VM_PROPERTIES, false, QuotaDependency.NONE),
	SetVmNumaNodes(176, Term.VM, ActionGroup.EDIT_VM_PROPERTIES, false, QuotaDependency.NONE),

	// VmTemplatesCommand
	AddVmTemplate(201, Term.TEMPLATE, ActionGroup.CREATE_TEMPLATE, true, QuotaDependency.BOTH),
	UpdateVmTemplate(202, Term.TEMPLATE, ActionGroup.EDIT_TEMPLATE_PROPERTIES, true, QuotaDependency.CLUSTER),
	RemoveVmTemplate(203, Term.TEMPLATE, ActionGroup.DELETE_TEMPLATE, true, QuotaDependency.STORAGE),
	AddVmTemplateInterface(220, Term.TEMPLATE, ActionGroup.CONFIGURE_TEMPLATE_NETWORK, false, QuotaDependency.NONE),
	RemoveVmTemplateInterface(221, Term.TEMPLATE, ActionGroup.CONFIGURE_TEMPLATE_NETWORK, false, QuotaDependency.NONE),
	UpdateVmTemplateInterface(222, Term.TEMPLATE, ActionGroup.CONFIGURE_TEMPLATE_NETWORK, false, QuotaDependency.NONE),
	AddVmTemplateFromSnapshot(240, Term.TEMPLATE, ActionGroup.CREATE_TEMPLATE, true, QuotaDependency.BOTH),
	SealVmTemplate(252, Term.TEMPLATE, null, true, QuotaDependency.NONE),

	// ImagesCommands
	TryBackToSnapshot(204, Term.SNAPSHOT,  null, true, QuotaDependency.NONE),
	RestoreFromSnapshot(205, Term.SNAPSHOT,  null, true, QuotaDependency.STORAGE),
	CreateSnapshotForVm(206, Term.SNAPSHOT, ActionGroup.MANIPULATE_VM_SNAPSHOTS, true, QuotaDependency.STORAGE),
	CreateSnapshot(207, Term.SNAPSHOT, null, true, QuotaDependency.STORAGE),
	CreateSnapshotFromTemplate(208, Term.SNAPSHOT,  null, true, QuotaDependency.STORAGE),
	CreateImageTemplate(209, Term.SNAPSHOT, null, true, QuotaDependency.STORAGE),
	RemoveSnapshot(210, Term.SNAPSHOT, ActionGroup.MANIPULATE_VM_SNAPSHOTS, true, QuotaDependency.STORAGE),
	RemoveImage(211, Term.DISK, null, true, QuotaDependency.STORAGE),
	RemoveAllVmImages(212, Term.DISK, null, true, QuotaDependency.STORAGE),
	AddImageFromScratch(213, Term.DISK, null, true, QuotaDependency.STORAGE),
	RemoveTemplateSnapshot(215, Term.SNAPSHOT, null, true, QuotaDependency.STORAGE),
	RemoveAllVmTemplateImageTemplates(216, Term.TEMPLATE, null, true, QuotaDependency.STORAGE),
	TryBackToAllSnapshotsOfVm(223, Term.SNAPSHOT, ActionGroup.MANIPULATE_VM_SNAPSHOTS, true, QuotaDependency.NONE),
	RestoreAllSnapshots(224, Term.SNAPSHOT, ActionGroup.MANIPULATE_VM_SNAPSHOTS, true, QuotaDependency.STORAGE),
	CopyImageGroup(225, Term.DISK, null, true, QuotaDependency.STORAGE),
	MoveOrCopyDisk(228, Term.DISK, null, true, QuotaDependency.STORAGE),
	CreateCloneOfTemplate(229, Term.TEMPLATE, null, true, QuotaDependency.STORAGE),
	RemoveDisk(230, Term.DISK, null, true, QuotaDependency.STORAGE),
	MoveImageGroup(231, Term.DISK, null, true, QuotaDependency.STORAGE),
	AmendVolume(233, Term.DISK, ActionGroup.EDIT_DISK_PROPERTIES, true, QuotaDependency.NONE),
	RemoveMemoryVolumes(234, Term.DISK, null, true, QuotaDependency.NONE),
	RemoveDiskSnapshots(235, Term.SNAPSHOT, ActionGroup.MANIPULATE_VM_SNAPSHOTS, true, QuotaDependency.NONE),
	RemoveSnapshotSingleDiskLive(236, Term.SNAPSHOT, null, true, QuotaDependency.STORAGE),
	Merge(237, Term.SNAPSHOT, null, true, QuotaDependency.STORAGE),
	MergeStatus(238, Term.SNAPSHOT, null, true, QuotaDependency.NONE),
	DestroyImage(239, Term.DISK, null, true, QuotaDependency.STORAGE),
	MergeExtend(241, Term.SNAPSHOT, null, true, QuotaDependency.STORAGE),
	SparsifyImage(244, Term.DISK, ActionGroup.SPARSIFY_DISK, true, QuotaDependency.NONE),
	AmendImageGroupVolumes(245, Term.DISK, ActionGroup.EDIT_DISK_PROPERTIES, true, QuotaDependency.NONE),
	ColdMergeSnapshotSingleDisk(246, Term.SNAPSHOT, null, true, QuotaDependency.STORAGE),
	PrepareMerge(247, Term.SNAPSHOT, null, true, QuotaDependency.STORAGE),
	ColdMerge(248, Term.SNAPSHOT, null, true, QuotaDependency.STORAGE),
	FinalizeMerge(249, Term.SNAPSHOT, null, true, QuotaDependency.STORAGE),
	CreateAllTemplateDisks(250, Term.DISK, null, true, QuotaDependency.NONE),
	CreateAllTemplateDisksFromSnapshot(251, Term.DISK, null, true, QuotaDependency.NONE),
	UpdateVolume(253, Term.DISK, null, true, QuotaDependency.NONE),
	UpdateAllTemplateDisks(254, Term.DISK, null, true, QuotaDependency.NONE),
	CreateSnapshotDisk(256, Term.SNAPSHOT, ActionGroup.MANIPULATE_VM_SNAPSHOTS, true, QuotaDependency.NONE),
	CreateLiveSnapshotForVm(257, Term.SNAPSHOT, ActionGroup.MANIPULATE_VM_SNAPSHOTS, true, QuotaDependency.NONE),
	AnsibleImageMeasure(258, Term.DISK, null, true, QuotaDependency.NONE),
	AnsiblePackOva(259, Term.DISK, null, true, QuotaDependency.NONE),
	ConvertDisk(261, Term.DISK, ActionGroup.EDIT_DISK_PROPERTIES, true, QuotaDependency.NONE),

	// VmPoolCommands
	AddVmPool(304, Term.VM_POOL, ActionGroup.CREATE_VM_POOL, true, QuotaDependency.BOTH),
	UpdateVmPool(305, Term.VM_POOL, ActionGroup.EDIT_VM_POOL_CONFIGURATION, true, QuotaDependency.STORAGE),
	RemoveVmPool(307, Term.VM_POOL, ActionGroup.DELETE_VM_POOL, true, QuotaDependency.NONE),
	DetachUserFromVmFromPool(312, Term.VM_POOL, null, true, QuotaDependency.NONE),
	AddVmToPool(313, Term.VM_POOL, null, true, QuotaDependency.NONE),
	RemoveVmFromPool(314, Term.VM_POOL, ActionGroup.EDIT_VM_POOL_CONFIGURATION, false, QuotaDependency.NONE),
	AttachUserToVmFromPoolAndRun(318, Term.VM_POOL, ActionGroup.VM_POOL_BASIC_OPERATIONS, true, QuotaDependency.CLUSTER),

	// UserAndGroupsCommands
	LogoutSession(408, Term.USER, null,false, QuotaDependency.NONE),
	RemoveUser(409, Term.USER, ActionGroup.MANIPULATE_USERS, false, QuotaDependency.NONE),
	TerminateSession(410, Term.USER, null,false, QuotaDependency.NONE),
	TerminateSessionsForToken(411, Term.USER, null,false, QuotaDependency.NONE),
	RemoveGroup(415, Term.USER, ActionGroup.MANIPULATE_USERS, false, QuotaDependency.NONE),
	AddUser(419, Term.USER, ActionGroup.MANIPULATE_USERS, false, QuotaDependency.NONE),
	AddGroup(420, Term.USER, ActionGroup.MANIPULATE_USERS, false, QuotaDependency.NONE),
	LoginOnBehalf(424, Term.USER, null,false, QuotaDependency.NONE),
	CreateUserSession(425, Term.USER, ActionGroup.LOGIN, false, QuotaDependency.NONE),

	// UserProfile
	UpdateUserProfileProperty(427, Term.USER, ActionGroup.EDIT_PROFILE, false, QuotaDependency.NONE),
	RemoveUserProfileProperty(428, Term.USER, ActionGroup.EDIT_PROFILE, false, QuotaDependency.NONE),
	AddUserProfileProperty(429, Term.USER, ActionGroup.EDIT_PROFILE, false, QuotaDependency.NONE),

	// Tags
	AddTag(501, Term.TAG, null, false, QuotaDependency.NONE),
	RemoveTag(502, Term.TAG, null, false, QuotaDependency.NONE),
	UpdateTag(503, Term.TAG, null, false, QuotaDependency.NONE),
	MoveTag(504, Term.TAG, null, false, QuotaDependency.NONE),
	AttachUserToTag(505, Term.TAG, null, false, QuotaDependency.NONE),
	DetachUserFromTag(506, Term.TAG, null, false, QuotaDependency.NONE),
	AttachUserGroupToTag(507, Term.TAG, null, false, QuotaDependency.NONE),
	DetachUserGroupFromTag(508, Term.TAG, null, false, QuotaDependency.NONE),
	AttachVmsToTag(509, Term.TAG, null, false, QuotaDependency.NONE),
	DetachVmFromTag(510, Term.TAG, null, false, QuotaDependency.NONE),
	AttachVdsToTag(511, Term.TAG, null, false, QuotaDependency.NONE),
	DetachVdsFromTag(512, Term.TAG, null, false, QuotaDependency.NONE),
	UpdateTagsVmMapDefaultDisplayType(515, Term.TAG, null, false, QuotaDependency.NONE),
	AttachTemplatesToTag(516, Term.TAG, null, false, QuotaDependency.NONE),
	DetachTemplateFromTag(517, Term.TAG, null, false, QuotaDependency.NONE),

	// Quota
	AddQuota(601, Term.QUOTA, ActionGroup.CONFIGURE_QUOTA, false, QuotaDependency.NONE),
	UpdateQuota(602, Term.QUOTA, ActionGroup.CONFIGURE_QUOTA, false, QuotaDependency.NONE),
	RemoveQuota(603, Term.QUOTA, ActionGroup.CONFIGURE_QUOTA, false, QuotaDependency.NONE),
	ChangeQuotaForDisk(604, Term.QUOTA, ActionGroup.CONSUME_QUOTA, false, QuotaDependency.STORAGE),

	// bookmarks
	AddBookmark(701, Term.BOOKMARK, ActionGroup.BOOKMARK_MANAGEMENT, false, QuotaDependency.NONE),
	RemoveBookmark(702, Term.BOOKMARK, ActionGroup.BOOKMARK_MANAGEMENT, false, QuotaDependency.NONE),
	UpdateBookmark(703, Term.BOOKMARK, ActionGroup.BOOKMARK_MANAGEMENT, false, QuotaDependency.NONE),

	// Cluster
	AddCluster(704, Term.CLUSTER, ActionGroup.CREATE_CLUSTER, false, QuotaDependency.NONE),
	UpdateCluster(705, Term.CLUSTER, ActionGroup.EDIT_CLUSTER_CONFIGURATION, false, QuotaDependency.NONE),
	RemoveCluster(706, Term.CLUSTER, ActionGroup.DELETE_CLUSTER, false, QuotaDependency.NONE),
	AttachNetworkToClusterInternal(707, Term.CLUSTER, null, false, QuotaDependency.NONE),
	AttachNetworkToCluster(708, Term.CLUSTER, ActionGroup.ASSIGN_CLUSTER_NETWORK, false, QuotaDependency.NONE),
	DetachNetworkToCluster(709, Term.CLUSTER, ActionGroup.ASSIGN_CLUSTER_NETWORK, false, QuotaDependency.NONE),
	DetachNetworkFromClusterInternal(710, Term.CLUSTER, null, false, QuotaDependency.NONE),
	UpdateNetworkOnCluster(711, Term.CLUSTER, ActionGroup.CONFIGURE_CLUSTER_NETWORK, false, QuotaDependency.NONE),

	ManageNetworkClusters(712, Term.CLUSTER, ActionGroup.ASSIGN_CLUSTER_NETWORK, true, QuotaDependency.NONE),
	StartClusterUpgrade(713, Term.CLUSTER, ActionGroup.EDIT_CLUSTER_CONFIGURATION, false, QuotaDependency.NONE),
	FinishClusterUpgrade(714, Term.CLUSTER, ActionGroup.EDIT_CLUSTER_CONFIGURATION, false, QuotaDependency.NONE),
	UpdateClusterUpgrade(715, Term.CLUSTER, ActionGroup.EDIT_CLUSTER_CONFIGURATION, false, QuotaDependency.NONE),

	/**
	 * MultiLevelAdministration
	 */
	AddPermission(800, Term.PERMISSION, ActionGroup.MANIPULATE_PERMISSIONS, false, QuotaDependency.NONE),
	RemovePermission(801, Term.PERMISSION, ActionGroup.MANIPULATE_PERMISSIONS, false, QuotaDependency.NONE),
	UpdateRole(803, Term.ROLE, ActionGroup.MANIPULATE_ROLES, false, QuotaDependency.NONE),
	RemoveRole(804, Term.ROLE, ActionGroup.MANIPULATE_ROLES, false, QuotaDependency.NONE),
	AttachActionGroupsToRole(805, Term.ROLE, ActionGroup.MANIPULATE_ROLES, false, QuotaDependency.NONE),
	DetachActionGroupsFromRole(806, Term.ROLE, ActionGroup.MANIPULATE_ROLES, false, QuotaDependency.NONE),
	AddRoleWithActionGroups(809, Term.ROLE, ActionGroup.MANIPULATE_ROLES, false, QuotaDependency.NONE),
	AddSystemPermission(811, Term.USER, ActionGroup.MANIPULATE_PERMISSIONS, false, QuotaDependency.NONE),
	RemoveSystemPermission(812, Term.USER, ActionGroup.MANIPULATE_PERMISSIONS, false, QuotaDependency.NONE),

	/**
	 * Storages handling
	 */
	AddLocalStorageDomain(916, Term.STORAGE_DOMAIN, ActionGroup.CREATE_STORAGE_DOMAIN, true, QuotaDependency.NONE),
	AddNFSStorageDomain(902, Term.STORAGE_DOMAIN, ActionGroup.CREATE_STORAGE_DOMAIN, true, QuotaDependency.NONE),
	UpdateStorageDomain(903, Term.STORAGE_DOMAIN, ActionGroup.EDIT_STORAGE_DOMAIN_CONFIGURATION, false, QuotaDependency.NONE),
	RemoveStorageDomain(904, Term.STORAGE_DOMAIN, ActionGroup.DELETE_STORAGE_DOMAIN, true, QuotaDependency.NONE),
	ForceRemoveStorageDomain(905, Term.STORAGE_DOMAIN, ActionGroup.DELETE_STORAGE_DOMAIN, true, QuotaDependency.NONE),
	AttachStorageDomainToPool(906, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_STORAGE_DOMAIN, true, QuotaDependency.NONE),
	DetachStorageDomainFromPool(907, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_STORAGE_DOMAIN, true, QuotaDependency.NONE),
	ActivateStorageDomain(908, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_STORAGE_DOMAIN, true, QuotaDependency.NONE),
	ConnectDomainToStorage(912, Term.STORAGE_DOMAIN,  null, true, QuotaDependency.NONE),
	DeactivateStorageDomain(909, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_STORAGE_DOMAIN, true, QuotaDependency.NONE),
	AddSANStorageDomain(910, Term.STORAGE_DOMAIN, ActionGroup.CREATE_STORAGE_DOMAIN, true, QuotaDependency.NONE),
	ExtendSANStorageDomain(911, Term.STORAGE_DOMAIN, ActionGroup.EDIT_STORAGE_DOMAIN_CONFIGURATION, true, QuotaDependency.NONE),
	ReconstructMasterDomain(913, Term.STORAGE_DOMAIN,  null, true, QuotaDependency.NONE),
	DeactivateStorageDomainWithOvfUpdate(914, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_STORAGE_DOMAIN, true, QuotaDependency.NONE),
	ProcessOvfUpdateForStorageDomain(1902, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_STORAGE_DOMAIN, true, QuotaDependency.NONE),
	CreateOvfVolumeForStorageDomain(1903, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_STORAGE_DOMAIN, true, QuotaDependency.NONE),
	RecoveryStoragePool(915, Term.DATACENTER, ActionGroup.CREATE_STORAGE_POOL, true, QuotaDependency.NONE),
	RefreshLunsSize(917, Term.STORAGE_DOMAIN, ActionGroup.EDIT_STORAGE_DOMAIN_CONFIGURATION, true, QuotaDependency.NONE),
	MoveStorageDomainDevice(918, Term.STORAGE_DOMAIN, ActionGroup.EDIT_STORAGE_DOMAIN_CONFIGURATION, true, QuotaDependency.NONE),
	ReduceStorageDomain(919, Term.STORAGE_DOMAIN, ActionGroup.EDIT_STORAGE_DOMAIN_CONFIGURATION, true, QuotaDependency.NONE),
	RemoveDeviceFromSANStorageDomain(920, Term.STORAGE_DOMAIN, ActionGroup.EDIT_STORAGE_DOMAIN_CONFIGURATION, true, QuotaDependency.NONE),
	ReduceSANStorageDomainDevices(921, Term.STORAGE_DOMAIN, ActionGroup.EDIT_STORAGE_DOMAIN_CONFIGURATION, true, QuotaDependency.NONE),
	AddEmptyStoragePool(950, Term.DATACENTER, ActionGroup.CREATE_STORAGE_POOL, false, QuotaDependency.NONE),
	AddStoragePoolWithStorages(951, Term.DATACENTER, ActionGroup.CREATE_STORAGE_POOL, true, QuotaDependency.NONE),
	RemoveStoragePool(957, Term.DATACENTER, ActionGroup.DELETE_STORAGE_POOL, true, QuotaDependency.NONE),
	UpdateStoragePool(958, Term.DATACENTER, ActionGroup.EDIT_STORAGE_POOL_CONFIGURATION, true, QuotaDependency.NONE),
	FenceVdsManualy(959, Term.HOST, ActionGroup.MANIPULATE_HOST, false, QuotaDependency.NONE),
	AddExistingFileStorageDomain(960, Term.STORAGE_DOMAIN, ActionGroup.CREATE_STORAGE_DOMAIN, true, QuotaDependency.NONE),
	AddExistingBlockStorageDomain(961, Term.STORAGE_DOMAIN, ActionGroup.CREATE_STORAGE_DOMAIN, true, QuotaDependency.NONE),
	AddStorageServerConnection(1000, Term.STORAGE_DOMAIN, ActionGroup.CREATE_STORAGE_DOMAIN, true, QuotaDependency.NONE),
	UpdateStorageServerConnection(1001, Term.STORAGE_DOMAIN, ActionGroup.CREATE_STORAGE_DOMAIN, true, QuotaDependency.NONE),
	DisconnectStorageServerConnection(1002, Term.STORAGE_DOMAIN, ActionGroup.CREATE_STORAGE_DOMAIN, true, QuotaDependency.NONE),
	RemoveStorageServerConnection(1003, Term.STORAGE_DOMAIN, ActionGroup.CREATE_STORAGE_DOMAIN, true, QuotaDependency.NONE),
	ConnectHostToStoragePoolServers(1004, Term.HOST,  null, true, QuotaDependency.NONE),
	DisconnectHostFromStoragePoolServers(1005, Term.HOST, null, true, QuotaDependency.NONE),
	ConnectStorageToVds(1006, Term.STORAGE_DOMAIN, ActionGroup.CREATE_STORAGE_DOMAIN, true, QuotaDependency.NONE),
	SetStoragePoolStatus(1007, Term.DATACENTER,  null, true, QuotaDependency.NONE),
	ConnectAllHostsToLun(1008, Term.HOST,  null, true, QuotaDependency.NONE),
	AddPosixFsStorageDomain(1009, Term.STORAGE_DOMAIN, ActionGroup.CREATE_STORAGE_DOMAIN, true, QuotaDependency.NONE),
	LiveMigrateDisk(1010, Term.DISK,  null, true, QuotaDependency.NONE),
	MoveDisk(1012, Term.DISK, null,false, QuotaDependency.NONE),
	ExtendImageSize(1013, Term.DISK, null,false, QuotaDependency.STORAGE),
	ImportRepoImage(1014, Term.DISK, ActionGroup.CREATE_DISK, true, QuotaDependency.STORAGE),
	ExportRepoImage(1015, Term.DISK,  null, true, QuotaDependency.NONE),
	AttachStorageConnectionToStorageDomain(1016, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_STORAGE_DOMAIN, true, QuotaDependency.NONE),
	DetachStorageConnectionFromStorageDomain(1017, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_STORAGE_DOMAIN, true, QuotaDependency.NONE),
	SyncLunsInfoForBlockStorageDomain(1018, Term.STORAGE_DOMAIN, null,false, QuotaDependency.NONE),
	UpdateStorageServerConnectionExtension(1019, Term.STORAGE_DOMAIN, ActionGroup.CREATE_STORAGE_DOMAIN, true, QuotaDependency.NONE),
	RemoveStorageServerConnectionExtension(1020, Term.STORAGE_DOMAIN, ActionGroup.CREATE_STORAGE_DOMAIN, true, QuotaDependency.NONE),
	AddStorageServerConnectionExtension(1021, Term.STORAGE_DOMAIN, ActionGroup.CREATE_STORAGE_DOMAIN, true, QuotaDependency.NONE),
	RefreshVolume(1022, Term.DISK,  null, true, QuotaDependency.NONE),
	TransferDiskImage(1024, Term.DISK, ActionGroup.EDIT_DISK_PROPERTIES, false, QuotaDependency.STORAGE),
	TransferImageStatus(1025, Term.DISK, ActionGroup.EDIT_DISK_PROPERTIES, false, QuotaDependency.NONE),
	ScanStorageForUnregisteredDisks(1026, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_STORAGE_DOMAIN, true, QuotaDependency.NONE),
	CreateImagePlaceholder(1028, Term.DISK,    null, true, QuotaDependency.NONE),
	SyncImageGroupData(1029, Term.DISK,  null, true, QuotaDependency.NONE),
	CreateVolumeContainer(1030, Term.DISK,  null, true, QuotaDependency.STORAGE),
	DownloadImage(1031, Term.DISK,  null, true, QuotaDependency.STORAGE),
	CloneImageGroupVolumesStructure(1032, Term.DISK,  null, true, QuotaDependency.STORAGE),
	CopyData(1033, Term.DISK,  null, true, QuotaDependency.STORAGE),
	CopyImageGroupVolumesData(1034, Term.DISK,  null, true, QuotaDependency.STORAGE),
	CopyImageGroupWithData(1035, Term.DISK,  null, true, QuotaDependency.STORAGE),
	CopyManagedBlockDisk(1050,  Term.DISK, null, true, QuotaDependency.NONE),
	GlusterStorageSync(1036, Term.STORAGE_DOMAIN,  null, true, QuotaDependency.NONE),
	GlusterStorageGeoRepSyncInternal(1037, Term.STORAGE_DOMAIN,  null, true, QuotaDependency.NONE),
	ScheduleGlusterStorageSync(1038, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_VOLUME, true, QuotaDependency.NONE),
	FenceVolumeJob(1039, Term.DISK,  null, true, QuotaDependency.STORAGE),
	ReduceImage(1046, Term.DISK, ActionGroup.REDUCE_DISK, true, QuotaDependency.NONE),
	SwitchMasterStorageDomain(1048, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_STORAGE_DOMAIN, true, QuotaDependency.NONE),
	CleanFinishedTasks(1049, Term.HOST, ActionGroup.MANIPULATE_HOST, true, QuotaDependency.NONE),

	// Leases
	AddVmLease(1040, Term.LEASE,  null, true, QuotaDependency.NONE),
	RemoveVmLease(1041, Term.LEASE,  null, true, QuotaDependency.NONE),
	GetVmLeaseInfo(1047, Term.LEASE,  null, true, QuotaDependency.NONE),
	AddExternalLease(1051, Term.LEASE,  null, true, QuotaDependency.NONE),
	RemoveExternalLease(1052, Term.LEASE,  null, true, QuotaDependency.NONE),
	FenceLeaseJob(1053, Term.LEASE,  null, true, QuotaDependency.NONE),

	// Sync luns
	SyncAllStorageDomainsLuns(1042, Term.STORAGE_DOMAIN,  null, true, QuotaDependency.NONE),
	SyncDirectLuns(1043, Term.STORAGE_DOMAIN, ActionGroup.CONFIGURE_VM_STORAGE, false, QuotaDependency.NONE),
	SyncAllUsedLuns(1044, Term.STORAGE_DOMAIN,  null, true, QuotaDependency.NONE),
	SyncStorageDomainsLuns(1045, Term.STORAGE_DOMAIN,  null, true, QuotaDependency.NONE),

	// Event Notification
	AddEventSubscription(1100, Term.EVENT, null, false, QuotaDependency.NONE),
	RemoveEventSubscription(1101, Term.EVENT, null, false, QuotaDependency.NONE),

	// Config
	ReloadConfigurations(1301, Term.HOST, ActionGroup.CONFIGURE_ENGINE, false, QuotaDependency.NONE),

	// Gluster
	CreateGlusterVolume(1400, Term.STORAGE_DOMAIN, ActionGroup.CREATE_GLUSTER_VOLUME, true, QuotaDependency.NONE),
	SetGlusterVolumeOption(1401, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_VOLUME, true, QuotaDependency.NONE),
	StartGlusterVolume(1402, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_VOLUME, true, QuotaDependency.NONE),
	StopGlusterVolume(1403, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_VOLUME, true, QuotaDependency.NONE),
	ResetGlusterVolumeOptions(1404, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_VOLUME, true, QuotaDependency.NONE),
	DeleteGlusterVolume(1405, Term.STORAGE_DOMAIN, ActionGroup.DELETE_GLUSTER_VOLUME, true, QuotaDependency.NONE),
	GlusterVolumeRemoveBricks(1406, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_VOLUME, true, QuotaDependency.NONE),
	StartRebalanceGlusterVolume(1407, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_VOLUME, true, QuotaDependency.NONE),
	ReplaceGlusterVolumeBrick(1408, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_VOLUME, true, QuotaDependency.NONE),
	AddBricksToGlusterVolume(1409, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_VOLUME, true, QuotaDependency.NONE),
	StartGlusterVolumeProfile(1410, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_VOLUME, true, QuotaDependency.NONE),
	StopGlusterVolumeProfile(1411, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_VOLUME, true, QuotaDependency.NONE),
	RemoveGlusterServer(1412, Term.HOST, ActionGroup.DELETE_HOST, true, QuotaDependency.NONE),
	AddGlusterFsStorageDomain(1413, Term.STORAGE_DOMAIN, ActionGroup.CREATE_STORAGE_DOMAIN, true, QuotaDependency.NONE),
	EnableGlusterHook(1414, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_HOOK, true, QuotaDependency.NONE),
	DisableGlusterHook(1415, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_HOOK, true, QuotaDependency.NONE),
	UpdateGlusterHook(1416, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_HOOK, true, QuotaDependency.NONE),
	AddGlusterHook(1417, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_HOOK, true, QuotaDependency.NONE),
	RemoveGlusterHook(1418, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_HOOK, true, QuotaDependency.NONE),
	RefreshGlusterHooks(1419, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_HOOK, true, QuotaDependency.NONE),
	ManageGlusterService(1420, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_SERVICE, true, QuotaDependency.NONE),
	StopRebalanceGlusterVolume(1421, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_VOLUME, false, QuotaDependency.NONE),
	StartRemoveGlusterVolumeBricks(1422, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_VOLUME, true, QuotaDependency.NONE),
	StopRemoveGlusterVolumeBricks(1423, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_VOLUME, false, QuotaDependency.NONE),
	CommitRemoveGlusterVolumeBricks(1424, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_VOLUME, false, QuotaDependency.NONE),
	RefreshGlusterVolumeDetails(1425, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_VOLUME, true, QuotaDependency.NONE),
	RefreshGeoRepSessions(1426, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_VOLUME, true, QuotaDependency.NONE),
	StopGeoRepSession(1427, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_VOLUME, true, QuotaDependency.NONE),
	DeleteGeoRepSession(1428, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_VOLUME, true, QuotaDependency.NONE),
	StartGlusterVolumeGeoRep(1429, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_VOLUME, true, QuotaDependency.NONE),
	ResumeGeoRepSession(1430, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_VOLUME, true, QuotaDependency.NONE),
	PauseGlusterVolumeGeoRepSession(1431, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_VOLUME, true, QuotaDependency.NONE),
	SetGeoRepConfig(1432, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_VOLUME, true, QuotaDependency.NONE),
	ResetDefaultGeoRepConfig(1433, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_VOLUME, true, QuotaDependency.NONE),
	DeleteGlusterVolumeSnapshot(1434, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_VOLUME, true, QuotaDependency.NONE),
	DeleteAllGlusterVolumeSnapshots(1435, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_VOLUME, true, QuotaDependency.NONE),
	ActivateGlusterVolumeSnapshot(1436, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_VOLUME, true, QuotaDependency.NONE),
	DeactivateGlusterVolumeSnapshot(1437, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_VOLUME, true, QuotaDependency.NONE),
	RestoreGlusterVolumeSnapshot(1438, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_VOLUME, true, QuotaDependency.NONE),
	UpdateGlusterVolumeSnapshotConfig(1439, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_VOLUME, true, QuotaDependency.NONE),
	SyncStorageDevices(1440, Term.HOST, ActionGroup.MANIPULATE_HOST, true, QuotaDependency.NONE),
	CreateGlusterVolumeSnapshot(1441, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_VOLUME, true, QuotaDependency.NONE),
	ScheduleGlusterVolumeSnapshot(1442, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_VOLUME, true, QuotaDependency.NONE),
	RescheduleGlusterVolumeSnapshot(1443, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_VOLUME, true, QuotaDependency.NONE),
	CreateBrick(1444, Term.HOST, ActionGroup.MANIPULATE_HOST, true, QuotaDependency.NONE),
	CreateGlusterVolumeGeoRepSession(1445, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_VOLUME, true, QuotaDependency.NONE),
	SetupGlusterGeoRepMountBrokerInternal(1446, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_VOLUME, true, QuotaDependency.NONE),
	UpdateGlusterHostPubKeyToSlaveInternal(1447, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_VOLUME, true, QuotaDependency.NONE),
	DisableGlusterCliSnapshotScheduleInternal(1448, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_VOLUME, true, QuotaDependency.NONE),
	SetUpPasswordLessSSHInternal(1449, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_VOLUME, true, QuotaDependency.NONE),
	ResetGlusterVolumeBrick(1455, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_VOLUME, true, QuotaDependency.NONE),
	SyncHealClusterVolumes(1456, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_GLUSTER_VOLUME, true, QuotaDependency.NONE),

	// Scheduling Policy
	AddClusterPolicy(1450, Term.DATACENTER, ActionGroup.EDIT_STORAGE_POOL_CONFIGURATION, false, QuotaDependency.NONE),
	EditClusterPolicy(1451, Term.DATACENTER, ActionGroup.EDIT_STORAGE_POOL_CONFIGURATION, false, QuotaDependency.NONE),
	RemoveClusterPolicy(1452, Term.DATACENTER, ActionGroup.EDIT_STORAGE_POOL_CONFIGURATION, false, QuotaDependency.NONE),
	RemoveExternalPolicyUnit(1453, Term.DATACENTER, ActionGroup.EDIT_STORAGE_POOL_CONFIGURATION, false, QuotaDependency.NONE),

	// Gluster events continued...
	AddGlusterWebhookInternal(1454, Term.STORAGE_DOMAIN,  null, true, QuotaDependency.NONE),

	// External events
	AddExternalEvent(1500, Term.EVENT, ActionGroup.INJECT_EXTERNAL_EVENTS, true, QuotaDependency.NONE),

	// Providers
	AddProvider(1600, Term.NETWORK_PROVIDER, null, false, QuotaDependency.NONE),
	UpdateProvider(1601, Term.NETWORK_PROVIDER, null, false, QuotaDependency.NONE),
	RemoveProvider(1602, Term.NETWORK_PROVIDER, null, false, QuotaDependency.NONE),
	TestProviderConnectivity(1603, Term.NETWORK_PROVIDER, null, false, QuotaDependency.NONE),
	ImportProviderCertificate(1604, Term.NETWORK_PROVIDER, null,false, QuotaDependency.NONE),
	AddNetworkOnProvider(1605, Term.NETWORK_PROVIDER, ActionGroup.CREATE_STORAGE_POOL_NETWORK, false, QuotaDependency.NONE),
	AddNetworkWithSubnetOnProvider(1608, Term.NETWORK_PROVIDER, ActionGroup.CREATE_STORAGE_POOL_NETWORK, false, QuotaDependency.NONE),
	AddSubnetToProvider(1606, Term.NETWORK_PROVIDER, null, false, QuotaDependency.NONE),
	RemoveSubnetFromProvider(1607, Term.NETWORK_PROVIDER, null, false, QuotaDependency.NONE),
	SyncNetworkProvider(1609, Term.NETWORK_PROVIDER, null, false, QuotaDependency.NONE),
	AutodefineExternalNetwork(1610, Term.NETWORK_PROVIDER, null, false, QuotaDependency.NONE),

	AddWatchdog(1700, Term.VM, ActionGroup.EDIT_VM_PROPERTIES, true, QuotaDependency.NONE),
	UpdateWatchdog(1701, Term.VM, ActionGroup.EDIT_VM_PROPERTIES, true, QuotaDependency.NONE),
	RemoveWatchdog(1702, Term.VM, ActionGroup.EDIT_VM_PROPERTIES, true, QuotaDependency.NONE),

	AddNetworkQoS(1750, Term.NETWORK, ActionGroup.CONFIGURE_STORAGE_POOL_NETWORK, false, QuotaDependency.NONE),
	UpdateNetworkQoS(1751, Term.NETWORK, ActionGroup.CONFIGURE_STORAGE_POOL_NETWORK, false, QuotaDependency.NONE),
	RemoveNetworkQoS(1752, Term.NETWORK, ActionGroup.CONFIGURE_STORAGE_POOL_NETWORK, false, QuotaDependency.NONE),
	// qos
	AddStorageQos(1753, Term.QOS, ActionGroup.EDIT_STORAGE_POOL_CONFIGURATION, false, QuotaDependency.NONE),
	UpdateStorageQos(1754, Term.QOS, ActionGroup.EDIT_STORAGE_POOL_CONFIGURATION, false, QuotaDependency.NONE),
	RemoveStorageQos(1755, Term.QOS, ActionGroup.EDIT_STORAGE_POOL_CONFIGURATION, false, QuotaDependency.NONE),
	AddCpuQos(1756, Term.QOS, ActionGroup.EDIT_STORAGE_POOL_CONFIGURATION, false, QuotaDependency.NONE),
	UpdateCpuQos(1757, Term.QOS, ActionGroup.EDIT_STORAGE_POOL_CONFIGURATION, false, QuotaDependency.NONE),
	RemoveCpuQos(1758, Term.QOS, ActionGroup.EDIT_STORAGE_POOL_CONFIGURATION, false, QuotaDependency.NONE),
	AddHostNetworkQos(1770, Term.QOS, ActionGroup.EDIT_STORAGE_POOL_CONFIGURATION, false, QuotaDependency.NONE),
	UpdateHostNetworkQos(1771, Term.QOS, ActionGroup.EDIT_STORAGE_POOL_CONFIGURATION, false, QuotaDependency.NONE),
	RemoveHostNetworkQos(1772, Term.QOS, ActionGroup.EDIT_STORAGE_POOL_CONFIGURATION, false, QuotaDependency.NONE),
	// disk profiles
	AddDiskProfile(1760, Term.DISK_PROFILE, ActionGroup.CREATE_STORAGE_DISK_PROFILE, false, QuotaDependency.NONE),
	UpdateDiskProfile(1761, Term.DISK_PROFILE, ActionGroup.CONFIGURE_STORAGE_DISK_PROFILE, false, QuotaDependency.NONE),
	RemoveDiskProfile(1762, Term.DISK_PROFILE, ActionGroup.DELETE_STORAGE_DISK_PROFILE, false, QuotaDependency.NONE),
	// cpu profiles
	AddCpuProfile(1763, Term.VM, ActionGroup.CREATE_CPU_PROFILE, false, QuotaDependency.NONE),
	UpdateCpuProfile(1764, Term.VM, ActionGroup.UPDATE_CPU_PROFILE, false, QuotaDependency.NONE),
	RemoveCpuProfile(1765, Term.VM, ActionGroup.DELETE_CPU_PROFILE, false, QuotaDependency.NONE),

	// External Tasks
	AddExternalJob(1800, Term.JOB, ActionGroup.INJECT_EXTERNAL_TASKS, false, QuotaDependency.NONE),
	EndExternalJob(1801, Term.JOB, ActionGroup.INJECT_EXTERNAL_TASKS, false, QuotaDependency.NONE),
	ClearExternalJob(1802, Term.JOB, ActionGroup.INJECT_EXTERNAL_TASKS, false, QuotaDependency.NONE),
	AddExternalStep(1803, Term.JOB, ActionGroup.INJECT_EXTERNAL_TASKS, false, QuotaDependency.NONE),
	EndExternalStep(1804, Term.JOB, ActionGroup.INJECT_EXTERNAL_TASKS, false, QuotaDependency.NONE),

	//Internal Tasks
	AddInternalJob(1850, Term.JOB, null, false, QuotaDependency.NONE),
	AddInternalStep(1851, Term.JOB, null, false, QuotaDependency.NONE),

	UpdateMomPolicy(1900, Term.HOST, ActionGroup.MANIPULATE_HOST, false, QuotaDependency.NONE),
	UploadStream(1901, Term.STORAGE_DOMAIN, null, true,  QuotaDependency.NONE),
	RetrieveImageData(1905, Term.STORAGE_DOMAIN, null, true,  QuotaDependency.NONE),
	ProcessOvfUpdateForStoragePool(1906, Term.DATACENTER,  null, true, QuotaDependency.NONE),
	UpdateOvfStoreForStorageDomain(1907, Term.STORAGE_DOMAIN, ActionGroup.MANIPULATE_STORAGE_DOMAIN, true, QuotaDependency.NONE),

	// Affinity Groups
	AddAffinityGroup(1950, Term.AFFINITY_GROUP, ActionGroup.MANIPULATE_AFFINITY_GROUPS, false, QuotaDependency.NONE),
	EditAffinityGroup(1951, Term.AFFINITY_GROUP, ActionGroup.MANIPULATE_AFFINITY_GROUPS, false, QuotaDependency.NONE),
	RemoveAffinityGroup(1952, Term.AFFINITY_GROUP, ActionGroup.MANIPULATE_AFFINITY_GROUPS, false, QuotaDependency.NONE),
	AddVmToAffinityGroup(1953, Term.AFFINITY_GROUP, ActionGroup.MANIPULATE_AFFINITY_GROUPS, false, QuotaDependency.NONE),
	RemoveVmFromAffinityGroup(1954, Term.AFFINITY_GROUP, ActionGroup.MANIPULATE_AFFINITY_GROUPS, false, QuotaDependency.NONE),
	AddHostToAffinityGroup(1955, Term.AFFINITY_GROUP, ActionGroup.MANIPULATE_AFFINITY_GROUPS, false, QuotaDependency.NONE),
	RemoveHostFromAffinityGroup(1956, Term.AFFINITY_GROUP, ActionGroup.MANIPULATE_AFFINITY_GROUPS, false, QuotaDependency.NONE),
	AddVmLabelToAffinityGroup(1957, Term.AFFINITY_GROUP, ActionGroup.MANIPULATE_AFFINITY_GROUPS, false, QuotaDependency.NONE),
	RemoveVmLabelFromAffinityGroup(1958, Term.AFFINITY_GROUP, ActionGroup.MANIPULATE_AFFINITY_GROUPS, false, QuotaDependency.NONE),
	AddHostLabelToAffinityGroup(1959, Term.AFFINITY_GROUP, ActionGroup.MANIPULATE_AFFINITY_GROUPS, false, QuotaDependency.NONE),
	RemoveHostLabelFromAffinityGroup(1960, Term.AFFINITY_GROUP, ActionGroup.MANIPULATE_AFFINITY_GROUPS, false, QuotaDependency.NONE),

	// ISCSI Bonds
	AddIscsiBond(2000, Term.DATACENTER, ActionGroup.EDIT_STORAGE_POOL_CONFIGURATION, false, QuotaDependency.NONE),
	EditIscsiBond(2001, Term.DATACENTER, ActionGroup.EDIT_STORAGE_POOL_CONFIGURATION, false, QuotaDependency.NONE),
	RemoveIscsiBond(2002, Term.DATACENTER, ActionGroup.EDIT_STORAGE_POOL_CONFIGURATION, false, QuotaDependency.NONE),

	SetHaMaintenance(2050, Term.HOST, ActionGroup.MANIPULATE_HOST, false, QuotaDependency.NONE),

	// Rng crud
	AddRngDevice(2150, Term.VM, ActionGroup.EDIT_VM_PROPERTIES, true, QuotaDependency.NONE),
	UpdateRngDevice(2151, Term.VM, ActionGroup.EDIT_VM_PROPERTIES, true, QuotaDependency.NONE),
	RemoveRngDevice(2152, Term.VM, ActionGroup.EDIT_VM_PROPERTIES, true, QuotaDependency.NONE),

	// Graphics Device CRUD
	AddGraphicsDevice(2250, Term.USER, ActionGroup.EDIT_VM_PROPERTIES, false, QuotaDependency.NONE),
	UpdateGraphicsDevice(2251, Term.USER, ActionGroup.EDIT_VM_PROPERTIES, false, QuotaDependency.NONE),
	RemoveGraphicsDevice(2252, Term.USER, ActionGroup.EDIT_VM_PROPERTIES, false, QuotaDependency.NONE),
	AddGraphicsAndVideoDevices(2253, Term.USER, ActionGroup.EDIT_VM_PROPERTIES, false, QuotaDependency.NONE),
	RemoveGraphicsAndVideoDevices(2254, Term.USER, ActionGroup.EDIT_VM_PROPERTIES, false, QuotaDependency.NONE),

	// Vm Host Device CRUD
	AddVmHostDevices(2350, Term.VM, ActionGroup.EDIT_ADMIN_VM_PROPERTIES, false, QuotaDependency.NONE),
	RemoveVmHostDevices(2351, Term.VM, ActionGroup.EDIT_ADMIN_VM_PROPERTIES, false, QuotaDependency.NONE),

	// Vm devices
	HotUnplugMemory(2400, Term.VM, ActionGroup.EDIT_VM_PROPERTIES, false, QuotaDependency.NONE),
	HotUnplugMemoryWithoutVmUpdate(2401, Term.VM, ActionGroup.EDIT_VM_PROPERTIES, false, QuotaDependency.NONE),
	SaveVmExternalData(2402, Term.VM, null, false, QuotaDependency.NONE),

	// Mediated devices
	AddMdev(2450, Term.USER, ActionGroup.EDIT_VM_PROPERTIES, false, QuotaDependency.NONE),
	UpdateMdev(2451, Term.USER, ActionGroup.EDIT_VM_PROPERTIES, false, QuotaDependency.NONE),
	RemoveMdev(2452, Term.USER, ActionGroup.EDIT_VM_PROPERTIES, false, QuotaDependency.NONE),

	// Audit Log
	RemoveAuditLogById(2100, Term.EVENT, null, false, QuotaDependency.NONE),
	ClearAllAuditLogEvents(2101, Term.EVENT, null, false, QuotaDependency.NONE),
	DisplayAllAuditLogEvents(2102, Term.EVENT, null, false, QuotaDependency.NONE),
	ClearAllAuditLogAlerts(2103, Term.EVENT, null, false, QuotaDependency.NONE),
	DisplayAllAuditLogAlerts(2104, Term.EVENT, null, false, QuotaDependency.NONE),

	SetSesssionSoftLimit(3000, Term.USER, null, false, QuotaDependency.NONE),

	// Mac Pool
	AddMacPool(3100, Term.MAC_POOL, ActionGroup.CREATE_MAC_POOL, false, QuotaDependency.NONE),
	UpdateMacPool(3101, Term.MAC_POOL, ActionGroup.EDIT_MAC_POOL, false, QuotaDependency.NONE),
	RemoveMacPool(3102, Term.MAC_POOL, ActionGroup.DELETE_MAC_POOL, false, QuotaDependency.NONE),

	// Cinder
	AddCinderDisk(3200, Term.VM, ActionGroup.CONFIGURE_VM_STORAGE, true, QuotaDependency.STORAGE),
	RemoveCinderDisk(3201, Term.VM,  null, true, QuotaDependency.STORAGE),
	ExtendCinderDisk(3202, Term.VM, ActionGroup.CONFIGURE_VM_STORAGE, true, QuotaDependency.STORAGE),
	RemoveAllVmCinderDisks(3203, Term.VM,  null, true, QuotaDependency.STORAGE),
	CloneSingleCinderDisk(3204, Term.VM, ActionGroup.CONFIGURE_VM_STORAGE, true, QuotaDependency.STORAGE),
	RegisterCinderDisk(3206, Term.VM, ActionGroup.CONFIGURE_VM_STORAGE, false, QuotaDependency.NONE),
	CreateCinderSnapshot(3207, Term.VM, ActionGroup.CONFIGURE_VM_STORAGE, false, QuotaDependency.STORAGE),
	RemoveCinderSnapshotDisk(3208, Term.VM, ActionGroup.CONFIGURE_VM_STORAGE, false, QuotaDependency.STORAGE),
	AddLibvirtSecret(3209, Term.VM, null,false, QuotaDependency.NONE),
	UpdateLibvirtSecret(3210, Term.VM, null,false, QuotaDependency.NONE),
	RemoveLibvirtSecret(3211, Term.VM, null,false, QuotaDependency.NONE),
	TryBackToCinderSnapshot(3212, Term.VM, ActionGroup.CONFIGURE_VM_STORAGE, false, QuotaDependency.STORAGE),
	RestoreFromCinderSnapshot(3214, Term.VM, ActionGroup.CONFIGURE_VM_STORAGE, false, QuotaDependency.STORAGE),
	RestoreAllCinderSnapshots(3215, Term.VM, ActionGroup.CONFIGURE_VM_STORAGE, false, QuotaDependency.STORAGE),
	RemoveAllCinderSnapshotDisks(3216, Term.VM, ActionGroup.CONFIGURE_VM_STORAGE, false, QuotaDependency.STORAGE),
	FreezeVm(3217, Term.VM, ActionGroup.CONFIGURE_VM_STORAGE, true, QuotaDependency.NONE),
	ThawVm(3218, Term.VM, ActionGroup.CONFIGURE_VM_STORAGE, true, QuotaDependency.NONE),
	RemoveCinderDiskVolume(3219, Term.VM,  null, true, QuotaDependency.STORAGE),

	// Managed Block Storage
	AddManagedBlockStorageDomain(3230, Term.STORAGE_DOMAIN, ActionGroup.CREATE_STORAGE_DOMAIN, false, QuotaDependency.NONE),
	AddManagedBlockStorageDisk(3231, Term.VM, ActionGroup.CONFIGURE_VM_STORAGE, true, QuotaDependency.NONE),
	RemoveManagedBlockStorageDisk(3232, Term.VM, ActionGroup.CONFIGURE_VM_STORAGE, true, QuotaDependency.NONE),
	ConnectManagedBlockStorageDevice(3233, Term.VM, ActionGroup.CONFIGURE_VM_STORAGE, true, QuotaDependency.NONE),
	SaveManagedBlockStorageDiskDevice(3234, Term.VM, ActionGroup.CONFIGURE_VM_STORAGE, true, QuotaDependency.NONE),
	DisconnectManagedBlockStorageDevice(3235, Term.VM, ActionGroup.CONFIGURE_VM_STORAGE, true, QuotaDependency.NONE),
	GetConnectionInfoForManagedBlockStorageDisk(3236, Term.VM, ActionGroup.CONFIGURE_VM_STORAGE, true, QuotaDependency.NONE),
	ExtendManagedBlockStorageDiskSize(3237, Term.VM, ActionGroup.CONFIGURE_VM_STORAGE, true, QuotaDependency.NONE),
	GetManagedBlockStorageStats(3238, Term.VM, ActionGroup.CONFIGURE_VM_STORAGE, true, QuotaDependency.NONE),
	CloneSingleManagedBlockDisk(3239, Term.VM, ActionGroup.CONFIGURE_VM_STORAGE, true, QuotaDependency.NONE),
	RemoveAllManagedBlockStorageDisks(3240, Term.VM, ActionGroup.CONFIGURE_VM_STORAGE, true, QuotaDependency.NONE),
	CreateManagedBlockStorageDiskSnapshot(3241, Term.VM, ActionGroup.CONFIGURE_VM_STORAGE, true, QuotaDependency.NONE),
	RemoveManagedBlockStorageSnapshot(3242, Term.VM, ActionGroup.CONFIGURE_VM_STORAGE, true, QuotaDependency.NONE),
	TryBackToManagedBlockSnapshot(3243, Term.VM, ActionGroup.CONFIGURE_VM_STORAGE, true, QuotaDependency.NONE),
	RestoreAllManagedBlockSnapshots(3244, Term.VM, ActionGroup.CONFIGURE_VM_STORAGE, true, QuotaDependency.NONE),

	// Unmanaged clusters
	AddUnmanagedStorageDomain(3245, Term.STORAGE_DOMAIN,  null, true, QuotaDependency.NONE),

	// Incremental Backup
	StartVmBackup(3300, Term.VM, ActionGroup.BACKUP_DISK, false, QuotaDependency.NONE),
	StopVmBackup(3301, Term.VM, ActionGroup.BACKUP_DISK, false, QuotaDependency.NONE),
	DeleteVmCheckpoint(3302, Term.VM, ActionGroup.BACKUP_DISK, false, QuotaDependency.NONE),
	RedefineVmCheckpoint(3303, Term.VM, ActionGroup.BACKUP_DISK, false, QuotaDependency.NONE),
	AddVolumeBitmap(3304, Term.VM, ActionGroup.BACKUP_DISK, false, QuotaDependency.NONE),
	CreateScratchDisk(3305, Term.VM, ActionGroup.BACKUP_DISK, false, QuotaDependency.NONE),
	CreateScratchDisks(3306, Term.VM, ActionGroup.BACKUP_DISK, false, QuotaDependency.NONE),
	RemoveScratchDisks(3307, Term.VM, ActionGroup.BACKUP_DISK, false, QuotaDependency.NONE),
	RemoveVolumeBitmap(3308, Term.VM, ActionGroup.BACKUP_DISK, false, QuotaDependency.NONE),
	ClearVolumeBitmaps(3309, Term.VM, ActionGroup.BACKUP_DISK, false, QuotaDependency.NONE),
	DeleteAllVmCheckpoints(3310, Term.VM, ActionGroup.BACKUP_DISK, false, QuotaDependency.NONE),
	HybridBackup(3311, Term.VM, ActionGroup.BACKUP_DISK, true,QuotaDependency.NONE),

	// Host Devices
	RefreshHostDevices(4000, Term.HOST, ActionGroup.MANIPULATE_HOST, false, QuotaDependency.NONE),
	RefreshHost(4001, Term.HOST, ActionGroup.MANIPULATE_HOST, false, QuotaDependency.NONE),

	// Network Attachments
	HostSetupNetworks(5200, Term.NETWORK, ActionGroup.CONFIGURE_HOST_NETWORK, true, QuotaDependency.NONE),
	AddNetworkAttachment(5201, Term.NETWORK, ActionGroup.CONFIGURE_HOST_NETWORK, true, QuotaDependency.NONE),
	UpdateNetworkAttachment(5202, Term.NETWORK, ActionGroup.CONFIGURE_HOST_NETWORK, true, QuotaDependency.NONE),
	RemoveNetworkAttachment(5203, Term.NETWORK, ActionGroup.CONFIGURE_HOST_NETWORK, true, QuotaDependency.NONE),
	PersistentHostSetupNetworks(5204, Term.NETWORK, null, true, QuotaDependency.NONE),
	SyncAllHostNetworks(5205, Term.NETWORK, ActionGroup.CONFIGURE_HOST_NETWORK, true, QuotaDependency.NONE),
	SyncAllClusterNetworks(5206, Term.NETWORK, ActionGroup.CONFIGURE_HOST_NETWORK, true, QuotaDependency.NONE),
	CopyHostNetworks(5207, Term.NETWORK, ActionGroup.CONFIGURE_HOST_NETWORK, true, QuotaDependency.NONE),

	// Hosted Engine
	ImportHostedEngineStorageDomain(6000, Term.HOST, null,false, QuotaDependency.NONE),

	/* Scheduling enabled `Label` actions are currently tied to the same
	   permissions as Tags as they have similar semantics and follow
	   almost the same rules.

	   TODO: change the action group as soon as the intended permissions change too
	*/
	AddLabel(6100, Term.TAG, ActionGroup.TAG_MANAGEMENT, false, QuotaDependency.NONE),
	RemoveLabel(6101, Term.TAG, ActionGroup.TAG_MANAGEMENT, false, QuotaDependency.NONE),
	UpdateLabel(6102, Term.TAG, ActionGroup.TAG_MANAGEMENT, false, QuotaDependency.NONE),

	// Scheduling and balancing
	BalanceVm(6200, Term.VM, ActionGroup.MIGRATE_VM, true, QuotaDependency.NONE),

	// CoCo
	RunAsyncAction(7000, Term.UNKNOWN,  null, true, QuotaDependency.NONE),

	// API:
	AddDeprecatedApiEvent(8000, Term.UNKNOWN, null,false, QuotaDependency.NONE),

	// KubeVirt
	AddVmToKubevirt(9000, Term.VM, ActionGroup.CREATE_VM, true, QuotaDependency.NONE);
	/**
	 * The QuotaDependency marks on which kind of quota regulated resources each command is dependant.
	 * i.e. - Creating new Disk is dependant of Storage resources. Running a VM is dependant of VDS (cluster) resources.
	 *
	 * NONE - indicates no dependency of any quota regulated resources.
	 *
	 * !!! Notice !!! - marking your command with QuotaDependency is not enough. In order to avoid Exceptions and
	 * Quota consumption errors, the command must implement the correct interface: STORAGE=>QuotaStorageDependant,
	 * VDS=>QuotaVdsDependant, BOTH=>QuotaStorageDependant and QuotaVdsDependant
	 */
	enum class QuotaDependency {
		NONE,
		STORAGE,
		CLUSTER,
		BOTH
	}

	override fun toString(): String = code
	val code: String
		get() = this@ActionType.name.uppercase()

	val localizationKey: String		get() = "${ActionType::class.java.simpleName}.${this.name}"
	private val loc: Localization	get() = Localization.getInstance()
	val en: String					get() = loc.findLocalizedName4ActionType(this, "en")
	val kr: String					get() = loc.findLocalizedName4ActionType(this, "kr")
	companion object {
		private val valueMapping: MutableMap<Int, ActionType> = ConcurrentHashMap<Int, ActionType>()
		private val codeMapping: MutableMap<String, ActionType> = ConcurrentHashMap<String, ActionType>()

		init {
			values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}

		val allActionTypes: List<ActionType> = ActionType.values().toList()
		val actionTypes4PeriodicRemoval: List<ActionType> = listOf(ScreenshotVm, RunAsyncAction)
		@JvmStatic fun forValue(value: Int?): ActionType = valueMapping[value ?: Unknown.value] ?: Unknown
		@JvmStatic fun forCode(value: String?): ActionType = codeMapping[value ?: Unknown.code] ?: Unknown
	}


}
