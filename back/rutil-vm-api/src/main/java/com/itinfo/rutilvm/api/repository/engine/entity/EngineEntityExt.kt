package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.model.auth.UserSessionVo
import com.itinfo.rutilvm.api.model.computing.ClusterVo
import com.itinfo.rutilvm.api.model.computing.DataCenterVo
import com.itinfo.rutilvm.api.model.computing.EventVo
import com.itinfo.rutilvm.api.model.computing.HostHwVo
import com.itinfo.rutilvm.api.model.computing.HostSwVo
import com.itinfo.rutilvm.api.model.computing.HostVo
import com.itinfo.rutilvm.api.model.computing.HostedEngineVo
import com.itinfo.rutilvm.api.model.computing.SnapshotVo
import com.itinfo.rutilvm.api.model.computing.SshVo
import com.itinfo.rutilvm.api.model.computing.TemplateVo
import com.itinfo.rutilvm.api.model.computing.VmIconVo
import com.itinfo.rutilvm.api.model.computing.VmVo
import com.itinfo.rutilvm.api.model.fromClusterToIdentifiedVo
import com.itinfo.rutilvm.api.model.fromVnicProfilesToIdentifiedVos
import com.itinfo.rutilvm.api.model.network.NetworkVo
import com.itinfo.rutilvm.api.model.network.BondingVo
import com.itinfo.rutilvm.api.model.network.DnsVo
import com.itinfo.rutilvm.api.model.network.HostNicVo
import com.itinfo.rutilvm.api.model.network.IpVo
import com.itinfo.rutilvm.api.model.network.NetworkFilterVo
import com.itinfo.rutilvm.api.model.network.NicVo
import com.itinfo.rutilvm.api.model.network.OpenStackNetworkVo
import com.itinfo.rutilvm.api.model.network.UsageVo
import com.itinfo.rutilvm.api.model.network.VnicProfileVo
import com.itinfo.rutilvm.api.model.setting.ExternalHostProviderVo
import com.itinfo.rutilvm.api.model.setting.ProviderVo
import com.itinfo.rutilvm.api.model.setting.toProviderPropertyVo

import com.itinfo.rutilvm.api.model.storage.DiskAttachmentVo
import com.itinfo.rutilvm.api.model.storage.DiskImageVo

import com.itinfo.rutilvm.api.model.storage.StorageDomainVo
import com.itinfo.rutilvm.api.ovirt.business.CpuPinningPolicyB
import com.itinfo.rutilvm.api.ovirt.business.SnapshotType
import com.itinfo.rutilvm.api.ovirt.business.StoragePoolStatus
import com.itinfo.rutilvm.api.ovirt.business.findArchitectureType
import com.itinfo.rutilvm.api.ovirt.business.findBiosTypeB
import com.itinfo.rutilvm.api.ovirt.business.findGraphicsTypeB
import com.itinfo.rutilvm.api.ovirt.business.findStatus
import com.itinfo.rutilvm.api.ovirt.business.findTemplateStatus
import com.itinfo.rutilvm.api.ovirt.business.findVmOsType
import com.itinfo.rutilvm.api.ovirt.business.toBootDevices
import com.itinfo.rutilvm.api.ovirt.business.toVmTypeB
import com.itinfo.rutilvm.api.repository.history.dto.UsageDto
import com.itinfo.rutilvm.common.toDate
import com.itinfo.rutilvm.common.toLocalDateTime
import com.itinfo.rutilvm.util.ovirt.cpuTopologyAll
import com.itinfo.rutilvm.util.ovirt.cpuTopologyAll4Template
import com.itinfo.rutilvm.util.ovirt.findCluster
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.types.Disk
import org.ovirt.engine.sdk4.types.NetworkStatus.NON_OPERATIONAL
import org.ovirt.engine.sdk4.types.NetworkStatus.OPERATIONAL
import org.ovirt.engine.sdk4.types.Template
import org.ovirt.engine.sdk4.types.Vm
import org.ovirt.engine.sdk4.builders.PropertyBuilder
import org.ovirt.engine.sdk4.types.Property
import org.ovirt.engine.sdk4.types.VnicPassThroughMode
import org.springframework.data.domain.Page
import java.util.Date

//region: AuditLogEntity
fun AuditLogEntity.toEventVo(): EventVo = EventVo.builder {
	id { this@toEventVo.auditLogId.toString() }
	severity { this@toEventVo.severity }
	description { this@toEventVo.message }
	time { this@toEventVo.logTime }
	logType { this@toEventVo.auditLogType }
	correlationId { this@toEventVo.correlationId }
}
fun List<AuditLogEntity>.toEventVos(): List<EventVo> =
	this@toEventVos.map { it.toEventVo() }
fun Page<AuditLogEntity>.toEventVosPage(): Page<EventVo> =
	this@toEventVosPage.map { it.toEventVo() }
//endregion: AuditLogEntity


//region: DiskVmElementEntity
fun DiskVmElementEntity.toVmDisk(): DiskImageVo {
	return DiskImageVo.builder {

	}
}
//endregion: DiskVmElementEntity

//region: AllDiskEntity
fun AllDiskEntity.toDiskEntity(): DiskImageVo {
	val entity = this@toDiskEntity
	return DiskImageVo.builder {
		id { entity.diskId.toString() }
		alias { entity.diskAlias }
		description { entity.diskDescription }
		sharable { entity.shareable }
		virtualSize { entity.size }
		actualSize { entity.actualSize }
		status { entity.diskImageStatus }
		contentType { entity.diskContentType }
		storageType { entity.diskStorageType }
		sparse { entity.volumeType == 2 }
		dateCreated { entity.creationDate }
		dataCenterVo {
			IdentifiedVo.builder {
				id { entity.storagePoolId.toString() }
			}
		}
		diskProfileVo {
			IdentifiedVo.builder {
				id { entity.diskProfileId }
				name { entity.diskProfileName }
			}
		}
		storageDomainVo {
			IdentifiedVo.builder {
				id { entity.storageId }
				name { entity.storageName }
			}
		}
		type { entity.entityType }
		imageTransferPhase { entity.imageTransferPhase }
		imageTransferType { entity.imageTransferType }
		imageTransferBytesSent { entity.imageTransferBytesSent }
		imageTransferBytesTotal { entity.imageTransferBytesTotal }
		connectVm {
			if(entity.entityType == "VM") {
				IdentifiedVo.builder {
					name { entity.vmNames }
				}
			}
			else null
		}
		connectTemplate {
			if(entity.entityType == "TEMPLATE") {
				IdentifiedVo.builder {
					name { entity.vmNames }
				}
			}
			else null
		}
	}
}
fun List<AllDiskEntity>.toDiskEntities(): List<DiskImageVo> =
	this@toDiskEntities.map { it.toDiskEntity() }

//endregion: AllDiskEntity

//region: StorageDomainEntity
fun StorageDomainEntity.toStorageDomainEntity(): StorageDomainVo {
	return StorageDomainVo.builder {
		id { id.toString() }
		name { storageName }
		description { storageDescription }
		status { status }
		storagePoolStatus { StoragePoolStatus.forValue(storageDomainSharedStatus) }
		storageType { storageType }
		storageDomainType { storageDomainType }
		// storageVo { storage().toStorageVo() }
		// master { master() }
		storageFormat { storageDomainFormatType.toString() }
		hostedEngine { isHostedEngineStorage }
		comment { storageComment }
		size { usedDiskSize?.add(availableDiskSize) }
		usedSize { usedDiskSize }
		availableSize { availableDiskSize }
		dataCenterVo { IdentifiedVo.builder {
			id { storagePoolId.toString() }
			name { storagePoolName }
		}}
	}
}
fun List<StorageDomainEntity>.toStorageDomainEntities(): List<StorageDomainVo> =
	this@toStorageDomainEntities.map { it.toStorageDomainEntity() }
//endregion: StorageDomainEntity


//region: EngineSessionsEntity
fun EngineSessionsEntity.toUserSessionVo(): UserSessionVo {
	return UserSessionVo.builder {
		id { id }
		userId { userId }
		userName { userName }
		sourceIp { sourceIp }
		authzName { authzName }
		sessionStartTime { null }
		sessionLastActiveTime { null }
		// TODO: sessionLastActiveTime, sessionStartTime 값 찾아 넣기
	}
}
fun List<EngineSessionsEntity>.toUserSessionVos(): List<UserSessionVo> =
	this@toUserSessionVos.map { it.toUserSessionVo() }
//endregion: EngineSessionsEntity


//region: StoragePoolEntity
fun StoragePoolEntity.toDataCenterVo(): DataCenterVo = DataCenterVo.builder {
	id { this@toDataCenterVo.id.toString() }
	name { this@toDataCenterVo.name }
	comment { this@toDataCenterVo.freeTextComment }
	description { this@toDataCenterVo.description }
	storageType { this@toDataCenterVo.isLocal }
	version { this@toDataCenterVo.compatibilityVersion }
	versionMajor { this@toDataCenterVo.majorVersion }
	versionMinor { this@toDataCenterVo.minorVersion }
	status { this@toDataCenterVo.status }
	// domainStatus {  }
	// storageDomainVos {  }
	clusterCnt { this@toDataCenterVo.clusters?.size ?: 0 }
	clusterVos { this@toDataCenterVo.clusters?.toClusterVosFromClusterViewEntities() }
	quotaMode { this@toDataCenterVo.quotaEnforcementType }
}
fun Collection<StoragePoolEntity>.toDataCenterVos(): List<DataCenterVo> =
	this@toDataCenterVos.map { it.toDataCenterVo() }

fun StoragePoolEntity.toIdentifiedVoFromStoragePoolEntity(): IdentifiedVo = IdentifiedVo.builder {
	id { this@toIdentifiedVoFromStoragePoolEntity.id.toString() }
	name { this@toIdentifiedVoFromStoragePoolEntity.name }
}
fun Collection<StoragePoolEntity>.toIdentifiedVosFromStoragePoolEntities(): List<IdentifiedVo> =
	this@toIdentifiedVosFromStoragePoolEntities.map { it.toIdentifiedVoFromStoragePoolEntity() }
//endregion: StoragePoolEntity

//region: ClusterViewEntity
fun ClusterViewEntity.toClusterVoFromClusterViewEntity(): ClusterVo = ClusterVo.builder {
	id { this@toClusterVoFromClusterViewEntity.clusterId.toString() }
	name { this@toClusterVoFromClusterViewEntity.name }
	description { this@toClusterVoFromClusterViewEntity.description }
	comment { this@toClusterVoFromClusterViewEntity.freeTextComment }
	// isConnected { this@toClusterVoFromClusterViewEntity. }
	ballooningEnabled { this@toClusterVoFromClusterViewEntity.enableBalloon }
	biosType { this@toClusterVoFromClusterViewEntity.biosType }
	cpuArc { this@toClusterVoFromClusterViewEntity.architecture }
	cpuType { this@toClusterVoFromClusterViewEntity.cpuName }
	errorHandling { this@toClusterVoFromClusterViewEntity.migrateOnError }
	fipsMode { this@toClusterVoFromClusterViewEntity.fipsMode }
	firewallType { this@toClusterVoFromClusterViewEntity.firewallType }
	glusterService { this@toClusterVoFromClusterViewEntity.glusterService }
	haReservation { this@toClusterVoFromClusterViewEntity.haReservation }
	logMaxMemory { this@toClusterVoFromClusterViewEntity.logMaxMemoryUsedThreshold?.toLong() }
	logMaxMemoryType { this@toClusterVoFromClusterViewEntity.logMaxMemoryUsedThresholdType }
	memoryOverCommit { this@toClusterVoFromClusterViewEntity.maxVdsMemoryOverCommit }
	migrationPolicy { this@toClusterVoFromClusterViewEntity.isAutoConverge }
	bandwidth { this@toClusterVoFromClusterViewEntity.migrationBandwidthLimitType }
	encrypted { this@toClusterVoFromClusterViewEntity.isMigrateEncrypted }
	switchType { this@toClusterVoFromClusterViewEntity.switchType }
	threadsAsCores { this@toClusterVoFromClusterViewEntity.countThreadsAsCores }
	version { this@toClusterVoFromClusterViewEntity.compatibilityVersion }
	virtService { this@toClusterVoFromClusterViewEntity.virtService }
	networkProvider { this@toClusterVoFromClusterViewEntity.defaultNetworkProviderId != null }
	dataCenterVo { this@toClusterVoFromClusterViewEntity.storagePool?.toIdentifiedVoFromStoragePoolEntity() }
	hostVos { this@toClusterVoFromClusterViewEntity.hosts?.toHostVosFromVdsEntities() }
	// networkVo { this@toClusterVoFromClusterViewEntity }
	// hostSize { this@toClusterVoFromClusterViewEntity.hosts.size ?: 0 }
	// required { this@toClusterVoFromClusterViewEntity }
	// vmVos { this@toClusterVoFromClusterViewEntity.vms?.toVmVosFromVmEntities() }
}
fun Collection<ClusterViewEntity>.toClusterVosFromClusterViewEntities(): List<ClusterVo> =
	this@toClusterVosFromClusterViewEntities.map { it.toClusterVoFromClusterViewEntity() }

fun ClusterViewEntity.toIdentifiedVoFromClusterViewEntity(): IdentifiedVo = IdentifiedVo.builder {
	id { this@toIdentifiedVoFromClusterViewEntity.clusterId.toString() }
	name { this@toIdentifiedVoFromClusterViewEntity.name }
}
fun Collection<ClusterViewEntity>.toIdentifiedVosFromClusterViewEntities(): List<IdentifiedVo> =
	this@toIdentifiedVosFromClusterViewEntities.map { it.toIdentifiedVoFromClusterViewEntity() }
//endregion: ClusterViewEntity

//region: NetworkEntity
fun NetworkEntity.toNetworkVoFromNetworkEntity(): NetworkVo = NetworkVo.builder {
	id { this@toNetworkVoFromNetworkEntity.id.toString() }
	name { this@toNetworkVoFromNetworkEntity.name }
	description { this@toNetworkVoFromNetworkEntity.description }
	comment { this@toNetworkVoFromNetworkEntity.freeTextComment }
	mtu { this@toNetworkVoFromNetworkEntity.mtu }
	portIsolation { this@toNetworkVoFromNetworkEntity.portIsolation }
	stp { this@toNetworkVoFromNetworkEntity.stp }
	usage { this@toNetworkVoFromNetworkEntity.networkCluster?.toUsageVo(this@toNetworkVoFromNetworkEntity.vmNetwork) }
	vlan { this@toNetworkVoFromNetworkEntity.vlanId }
	status { this@toNetworkVoFromNetworkEntity.status }
	vdsmName { this@toNetworkVoFromNetworkEntity.vdsmName }
	dataCenterVo { this@toNetworkVoFromNetworkEntity.storagePool?.toIdentifiedVoFromStoragePoolEntity() }
	clusterVo { this@toNetworkVoFromNetworkEntity.networkCluster?.cluster?.toIdentifiedVoFromClusterViewEntity() }
	openStackNetworkVo {
		OpenStackNetworkVo.builder {
			id { this@toNetworkVoFromNetworkEntity.providerNetworkExternalId }

		}
	}
	required { this@toNetworkVoFromNetworkEntity.networkCluster?.required }
	dnsNameServers { this@toNetworkVoFromNetworkEntity.dnsConfiguration?.nameServers?.toDnsVosFromNameServerEntities() }
	vnicProfileVos { this@toNetworkVoFromNetworkEntity.vnicProfiles.toIdentifiedVosFromVnicProfileEntities() }
}
fun List<NetworkEntity>.toNetworkVosFromNetworkEntities(): List<NetworkVo> =
	this@toNetworkVosFromNetworkEntities.map { it.toNetworkVoFromNetworkEntity() }
fun NetworkEntity.toIdentifiedVoFromNetworkEntity(): IdentifiedVo = IdentifiedVo.builder {
	id { this@toIdentifiedVoFromNetworkEntity.id.toString() }
	name { this@toIdentifiedVoFromNetworkEntity.name }
}
//endregion: NetworkEntity

//region: NetworkClusterEntity
fun NetworkClusterEntity.toUsageVo(vm: Boolean?=false): UsageVo = UsageVo.builder {
	vm { vm }
	display { this@toUsageVo.isDisplay }
	migration { this@toUsageVo.migration }
	management { this@toUsageVo.management }
	defaultRoute { this@toUsageVo.defaultRoute }
	gluster { this@toUsageVo.isGluster }
}
//endregion: NetworkClusterEntity

//region: NetworkClusterViewEntity
fun NetworkClusterViewEntity.toClusterVoFromNetworkClusterViewEntity(): NetworkVo = NetworkVo.builder {
	id { networkId.toString() }
	name { networkName }
	clusterVo {
		IdentifiedVo.builder {
			id { clusterId.toString() }
			name { clusterName }
		}
	}
	required { this@toClusterVoFromNetworkClusterViewEntity.required }
	// isConnected { isConnected }
	status { this@toClusterVoFromNetworkClusterViewEntity.status }
	display { isDisplay }
}
fun List<NetworkClusterViewEntity>.toClusterVoFromNetworkClusterViewEntities(): List<NetworkVo> =
	this@toClusterVoFromNetworkClusterViewEntities.map { it.toClusterVoFromNetworkClusterViewEntity() }
//endregion: NetworkClusterViewEntity

//region: NameServerEntity
fun NameServerEntity.toDnsVoFromNameServerEntity(): DnsVo = DnsVo.builder {
	position { this@toDnsVoFromNameServerEntity.position }
	address { this@toDnsVoFromNameServerEntity.address }
}
fun List<NameServerEntity>.toDnsVosFromNameServerEntities(): List<DnsVo> =
	this@toDnsVosFromNameServerEntities.map { it.toDnsVoFromNameServerEntity() }
//endregion: NameServerEntity

//region: NetworkFilterEntity
fun NetworkFilterEntity.toNetworkFilterVoFromNetworkFilterEntity(): NetworkFilterVo = NetworkFilterVo.builder {
	id { this@toNetworkFilterVoFromNetworkFilterEntity.filterId.toString() }
	name { this@toNetworkFilterVoFromNetworkFilterEntity.filterName }
	value { this@toNetworkFilterVoFromNetworkFilterEntity.version }
}
fun Collection<NetworkFilterEntity>.toNetworkFilterVosFromNetworkFilterEntities(): List<NetworkFilterVo> =
	this@toNetworkFilterVosFromNetworkFilterEntities.map { it.toNetworkFilterVoFromNetworkFilterEntity() }
//region: NetworkFilterEntity

//region: UnregisteredDiskEntity
fun UnregisteredDiskEntity.toUnregisteredDiskImageVo(disk: Disk?=null): DiskImageVo =
	DiskImageVo.builder {
		id { this@toUnregisteredDiskImageVo.id.diskId.toString() }
		alias { this@toUnregisteredDiskImageVo.diskAlias }
		sharable { disk?.shareable() }
		virtualSize { this@toUnregisteredDiskImageVo.size }
		actualSize { this@toUnregisteredDiskImageVo.actualSize }
		sparse { this@toUnregisteredDiskImageVo.sparse }
		description { this@toUnregisteredDiskImageVo.diskDescription }
		dateCreated { this@toUnregisteredDiskImageVo.creationDate }
	}

fun List<UnregisteredDiskEntity>.toUnregisteredDiskImageVos(disks: List<Disk>): List<DiskImageVo> {
	val itemById: Map<String, Disk> =
		disks.associateBy { it.id() }
	return this.map { it.toUnregisteredDiskImageVo(itemById[it.id.toString()]) }
}
//endregion: UnregisteredDiskEntity


//region: UnregisteredOvfOfEntities
fun UnregisteredOvfOfEntities.toUnregisteredVm(vm: Vm?=null): VmVo {
	// val tmp = conn.findTemplate(vm.template().id()).getOrNull()
	return VmVo.builder {
		id { this@toUnregisteredVm.id?.entityGuid.toString() }
		name { this@toUnregisteredVm.ovf?.virtualSystem?.name }
		description { this@toUnregisteredVm.ovf?.virtualSystem?.description }
		comment { this@toUnregisteredVm.ovf?.virtualSystem?.comment }
		status { vm?.findStatus() }
		// templateVo { tmp?.fromTemplateToIdentifiedVo() }
		optimizeOption { vm?.type()?.toVmTypeB() }
		nextRun { vm?.nextRunConfigurationExists() }
		biosType { vm?.bios()?.findBiosTypeB() }
		biosBootMenu { vm?.bios()?.bootMenu()?.enabled() }
		osType { vm?.os()?.findVmOsType() }
		cpuArc { vm?.cpu()?.findArchitectureType() }
		cpuTopologyCnt { vm.cpuTopologyAll() }
		cpuTopologyCore { vm?.cpu()?.topology()?.coresAsInteger() }
		cpuTopologySocket { vm?.cpu()?.topology()?.socketsAsInteger() }
		cpuTopologyThread { vm?.cpu()?.topology()?.threadsAsInteger() }
		cpuPinningPolicy {
			this@toUnregisteredVm.ovf?.virtualSystem?.cpuPinningPolicy
		}
		creationTime {
			// NOTE: 환산에 문제가 있는것으로 판단. 값이 좀 이상함 Locale 때문에 차이가 생김
			// ovf?.virtualSystem?.creationDate?.toDate()
			vm?.creationTime().toLocalDateTime()
		}
		monitor { if (vm?.displayPresent() == true) vm.display().monitorsAsInteger() else 0 }
		// displayType { }
		videoType { vm?.display().findGraphicsTypeB() }
		ha { vm?.highAvailability()?.enabled() }
		haPriority { vm?.highAvailability()?.priorityAsInteger() }
		memorySize { vm?.memory() }
		memoryGuaranteed { vm?.memoryPolicy()?.guaranteed() }
		memoryMax { vm?.memoryPolicy()?.max() }
		usb { if(vm?.usbPresent() == true) vm.usb()?.enabled() else false }
		diskAttachmentVos { disksFromOvf.toDiskAttachmentIdentifiedVos() }
	}
}
fun UnregisteredOvfOfEntities.toUnregisteredTemplate(template: Template?=null): TemplateVo {
	// val tmp = conn.findTemplate(vm.template().id()).getOrNull()
	return TemplateVo.builder {
		id { this@toUnregisteredTemplate.id?.entityGuid.toString() }
		name { this@toUnregisteredTemplate.ovf?.virtualSystem?.name }
		description { this@toUnregisteredTemplate.ovf?.virtualSystem?.description }
		comment { this@toUnregisteredTemplate.ovf?.virtualSystem?.comment }
		status { template?.findTemplateStatus() }
		// templateVo { tmp?.fromTemplateToIdentifiedVo() }
		biosType { template?.bios()?.findBiosTypeB() }
		cpuArc { template?.cpu()?.findArchitectureType() }
		cpuTopologyCnt { template.cpuTopologyAll4Template() }
		cpuTopologyCore { template?.cpu()?.topology()?.coresAsInteger() }
		cpuTopologySocket { template?.cpu()?.topology()?.socketsAsInteger() }
		cpuTopologyThread { template?.cpu()?.topology()?.threadsAsInteger() }
		cpuPinningPolicy {
			CpuPinningPolicyB.forCode("${this@toUnregisteredTemplate.ovf?.virtualSystem?.cpuPinningPolicy}")
			// template?.cpuPinningPolicy()?.value()
		}
		creationTime {
			// NOTE: 환산에 문제가 있는것으로 판단. 값이 좀 이상함 Locale 때문에 차이가 생김
			// ovf?.virtualSystem?.creationDate?.toDate()
			template?.creationTime().toLocalDateTime()
		}
		monitor { if (template?.displayPresent() == true) template.display().monitorsAsInteger() else 0 }
		// displayType {  }
		videoType { template?.display().findGraphicsTypeB() }
		ha { template?.highAvailability()?.enabled() }
		haPriority { template?.highAvailability()?.priorityAsInteger() }
		memorySize { template?.memory() }
		memoryGuaranteed { template?.memoryPolicy()?.guaranteed() }
		memoryMax { template?.memoryPolicy()?.max() }
		osType { template?.os()?.findVmOsType() }
		optimizeOption { template?.type()?.toVmTypeB() }
		usb { if (template?.usbPresent() == true) template.usb()?.enabled() else false }
		diskAttachmentVos { disksFromOvf.toDiskAttachmentIdentifiedVos() }
	}
}

fun com.itinfo.rutilvm.api.xml.OvfDisk.toDiskAttachmentIdentifiedVo(): DiskAttachmentVo = DiskAttachmentVo.builder {
	id { this@toDiskAttachmentIdentifiedVo.diskId }
	diskImageVo {
		DiskImageVo.builder {
			id { this@toDiskAttachmentIdentifiedVo.diskId }
			alias { this@toDiskAttachmentIdentifiedVo.diskAlias }
			description{ this@toDiskAttachmentIdentifiedVo.diskDescription }
			sparse{ this@toDiskAttachmentIdentifiedVo.volumeType == "Sparse" }
			actualSize { this@toDiskAttachmentIdentifiedVo.actualSize?.toBigInteger() }
			size { this@toDiskAttachmentIdentifiedVo.size?.toBigInteger() }
		}
	}
}

fun Collection<com.itinfo.rutilvm.api.xml.OvfDisk>.toDiskAttachmentIdentifiedVos(): List<DiskAttachmentVo> =
	this@toDiskAttachmentIdentifiedVos.map { it.toDiskAttachmentIdentifiedVo() }

fun Collection<UnregisteredOvfOfEntities>.toUnregisteredVms(vms: List<Vm>): List<VmVo> {
	val itemById: Map<String, Vm> =
		vms.associateBy { it.id() }
	return this@toUnregisteredVms.map { it.toUnregisteredVm(itemById[it.id?.entityGuid.toString()]) }
}

fun Collection<UnregisteredOvfOfEntities>.toUnregisteredTemplates(templates: List<Template>): List<TemplateVo> {
	val itemById: Map<String, Template> =
		templates.associateBy { it.id() }
	return this@toUnregisteredTemplates.map {
		it.toUnregisteredTemplate(itemById[it.id?.entityGuid.toString()])
	}
}
//endregion: UnregisteredOvfOfEntities

//region: VdsEntity
fun VdsEntity.toHostVoFromVdsEntity(): HostVo = HostVo.builder {
	id { this@toHostVoFromVdsEntity.vdsId.toString() }
	name { this@toHostVoFromVdsEntity.vdsName }
	comment { this@toHostVoFromVdsEntity.freeTextComment }
	address { this@toHostVoFromVdsEntity.hostName }
	// devicePassThrough { this@toHostVoFromVdsEntity.isHostdevEnabled }
	iscsi { this@toHostVoFromVdsEntity.iscsiInitiatorName }
	// kdump {  }
	ksm { this@toHostVoFromVdsEntity.ksmState }
	seLinux { this@toHostVoFromVdsEntity.selinuxEnforceMode }
	hostedEngine {
		HostedEngineVo.builder {
			active { this@toHostVoFromVdsEntity.haActive }
			configured { this@toHostVoFromVdsEntity.haConfigured }
			globalMaintenance { this@toHostVoFromVdsEntity.haGlobalMaintenance }
			localMaintenance { this@toHostVoFromVdsEntity.haLocalMaintenance }
			score { this@toHostVoFromVdsEntity.haScore }
		}
	}
	hostedEngineVM { this@toHostVoFromVdsEntity.hostedEngineConfigured } // TODO: 확실하지 않음
	spmPriority { this@toHostVoFromVdsEntity.vdsSpmPriority }
	spmStatus { this@toHostVoFromVdsEntity.spmStatus }
	ssh {
		SshVo.builder {
			id { this@toHostVoFromVdsEntity.sshUsername }
			name { this@toHostVoFromVdsEntity.sshUsername }
			port {  this@toHostVoFromVdsEntity.sshPort?.toBigInteger() }
			fingerprint { this@toHostVoFromVdsEntity.sshkeyfingerprint }
			publicKey { this@toHostVoFromVdsEntity.sshPublicKey }
			// rootPassword { this@toHostVoFromVdsEntity.sshPort }
			// authenticationMethod {  }
		}
	}
	status { this@toHostVoFromVdsEntity.vdsStatus }
	// transparentPage { this@toHostVoFromVdsEntity.transparentHugepagesState }
	vmMigratingCnt { this@toHostVoFromVdsEntity.vmMigrating }
	// vgpu { this@toHostVoFromVdsEntity.vgpuPlacement }
	memoryTotal { this@toHostVoFromVdsEntity.physicalMemMb?.toBigInteger() } // TODO: 값 확인필요
	memoryUsed { this@toHostVoFromVdsEntity.memCommited?.toBigInteger() } // TODO: 값 확인필요
	memoryFree { this@toHostVoFromVdsEntity.memFree?.toBigInteger() }
	// memoryMax { this@toHostVoFromVdsEntity }
	memoryShared { this@toHostVoFromVdsEntity.memShared?.toBigInteger() }
	swapTotal { this@toHostVoFromVdsEntity.swapTotal?.toBigInteger() }
	swapFree { this@toHostVoFromVdsEntity.swapFree?.toBigInteger() }
	// hugePage2048Free { }
	// hugePage2048Total { }
	// hugePage1048576Free { }
	// hugePage1048576Total { }
	bootingTime { Date(this@toHostVoFromVdsEntity.bootTime ?: 0) }
	hostHwVo {
		HostHwVo.builder {
			manufacturer { this@toHostVoFromVdsEntity.hwManufacturer }
			family { this@toHostVoFromVdsEntity.hwFamily }
			productName { this@toHostVoFromVdsEntity.hwProductName }
			serialNum { this@toHostVoFromVdsEntity.hwSerialNumber }
			uuid { this@toHostVoFromVdsEntity.hwUuid }
			hwVersion { this@toHostVoFromVdsEntity.hwVersion }
			cpuName { this@toHostVoFromVdsEntity.cpuModel }
			cpuType { this@toHostVoFromVdsEntity.cluster?.cpuName }
			cpuTopologyCore { this@toHostVoFromVdsEntity.cpuCores }
			cpuTopologySocket { this@toHostVoFromVdsEntity.cpuSockets }
			cpuTopologyThread { this@toHostVoFromVdsEntity.cpuThreads }
			// cpuTopologyAll { this@toHostVoFromVdsEntity.cpuTopology }
			// cpuOnline { this@toHostVoFromVdsEntity.onlineCpus } // JSON 값임으로 파싱 필요
		}
	}
	hostSwVo {
		HostSwVo.builder {
			osVersion { this@toHostVoFromVdsEntity.hostOs }
			osInfo { this@toHostVoFromVdsEntity.prettyName } // oVirt Node 4.5.5
			kernalVersion { this@toHostVoFromVdsEntity.kernelVersion }
			kvmVersion { this@toHostVoFromVdsEntity.kvmVersion }
			libvirtVersion { this@toHostVoFromVdsEntity.libvirtVersion }
			vdsmVersion { this@toHostVoFromVdsEntity.rpmVersion }
			spiceVersion { this@toHostVoFromVdsEntity.spiceVersion }
			glustersfsVersion { this@toHostVoFromVdsEntity.glusterVersion }
			// cephVersion { this@toHostVoFromVdsEntity }
			openVswitchVersion { this@toHostVoFromVdsEntity.openvswitchVersion }
			nmstateVersion { this@toHostVoFromVdsEntity.nmstateVersion }
		}
	}
	clusterVo { this@toHostVoFromVdsEntity.cluster?.toIdentifiedVoFromClusterViewEntity() }
	dataCenterVo { this@toHostVoFromVdsEntity.storagePool?.toIdentifiedVoFromStoragePoolEntity() }
	/*
	vmVos {
		this@toHostVoFromVdsEntity.cluster?.vms?.filter {
			it.runOnVds == this@toHostVoFromVdsEntity.vdsId
		}?.toVmVosFromVmEntities()
	}
	*/
	hostNicVos {
		this@toHostVoFromVdsEntity.nics?.toHostNicVosFromVdsInterfaceViewEntities()
	}
	// usageDto { }
}
fun Collection<VdsEntity>.toHostVosFromVdsEntities(): List<HostVo> =
	this@toHostVosFromVdsEntities.map { it.toHostVoFromVdsEntity() }
fun VdsEntity.toIdentifiedVoFromVdsEntity(): IdentifiedVo = IdentifiedVo.builder {
	id { this@toIdentifiedVoFromVdsEntity.vdsId.toString() }
	name { this@toIdentifiedVoFromVdsEntity.vdsName }
}
fun Collection<VdsEntity>.toIdentifiedVosFromVdsEntities(): List<IdentifiedVo> =
	this@toIdentifiedVosFromVdsEntities.map { it.toIdentifiedVoFromVdsEntity() }
//endregion: VdsEntity

//region: VmEntity
fun VmEntity.toVmVo(): VmVo {
	val entity = this@toVmVo

	return VmVo.builder {
		id { entity.vmGuid.toString() }
		name { entity.vmName }
		description { entity.description }
		comment { entity.freeTextComment }
		status { entity.status }
		iconSmall { entity.effectiveSmallIcon?.toVmIconVoFromVmEntity() }
		iconLarge { entity.effectiveLargeIcon?.toVmIconVoFromVmEntity() }
		creationTime { entity.creationDate }
		stopTime { entity.lastStopTime }
		timeElapsed { entity.elapsedTime?.toLong() }
		optimizeOption { entity.vmType }
		nextRun { entity.nextRunConfigExists }
		runOnce { entity.isRunOnce }
		biosType { entity.biosType }
		biosBootMenu { entity.isBootMenuEnabled }
		osType { entity.osType }
		cpuArc { entity.architecture }
		cpuTopologyCnt { entity.numOfCpus }
		cpuTopologyCore { entity.cpuPerSocket } // TODO: 이거 맞는지 모르겠음
		cpuTopologySocket { entity.numOfSockets }
		cpuTopologyThread { entity.threadsPerCpu } // TODO: 이거 맞는지 모르겠음
		cpuPinningPolicy { entity.cpuPinningPolicy }
		memorySize { entity.memSize }
		memoryGuaranteed { entity.memSize }
		memoryMax { entity.maxMemorySize }
		deleteProtected { entity.isDeleteProtected }
		monitor { entity.numOfMonitors }
		displayType { entity.defaultDisplayType }
		videoType { entity.graphicType }
		ha { entity.autoStartup }
		haPriority { entity.priority }
		ioThreadCnt { entity.numOfIoThreads } // TODO: 이거 맞는지 모르겠음
		migrationMode { entity.migrationSupport }
		migrationEncrypt { entity.isMigrateEncrypted }
		migrationAutoConverge { entity.isAutoConverge }
		migrationCompression { entity.isMigrateCompressed }
		firstDevice {
			entity.defaultBootSequence?.toBootDevices()?.firstOrNull()?.value()
		}
		secDevice {
			if ((entity.defaultBootSequence?.toBootDevices()?.size ?: 0) > 1) entity.defaultBootSequence?.toBootDevices()?.get(1)?.value()
			else null
		}
		hostInCluster { entity.dedicatedVmForVds.isNullOrEmpty() }
		startPaused { entity.isRunAndPause }
		statusDetail { entity.pauseStatus }
		storageErrorResumeBehaviour { entity.vmResumeBehavior }
		usb { entity.usbPolicy?.isEnabled }
		virtioScsiMultiQueueEnabled { entity.virtioScsiMultiQueuesEnabled }
		hostedEngineVm { entity.isHostedEngineVm }
		timeOffset { entity.timeZone }
		// isInitialized { entity.isInitialized }
		usageDto {
			UsageDto.builder {
				cpuPercent { usageCpuPercent }
				memoryPercent { usageMemPercent }
				networkPercent { usageNetworkPercent }
			}
		}
		ipv4 { listOf(entity.vmIp) }
		fqdn { entity.vmFqdn }
		cdRomVo {
			IdentifiedVo.builder {
				id {
					/*if (entity.status == VmStatusB.up)
						entity.currentCd // 임시보관 되고 있는 CD-ROM 파일을 부를 때
					else*/
						entity.isoPath
				}
			}
		}
		templateVo {
			IdentifiedVo.builder {
				id { entity.originalTemplateId.toString() }
				name { entity.originalTemplateName }
			}
		}
		hostVo {
			IdentifiedVo.builder {
				id { entity.runOnVds.toString() }
				name { entity.runOnVdsName }
			}
		}
		clusterVo {
			IdentifiedVo.builder {
				id { entity.clusterId.toString() }
				name { entity.clusterName }
			}
		}
		dataCenterVo {
			IdentifiedVo.builder {
				id { entity.storagePoolId.toString() }
				name { entity.storagePoolName }
			}
		}
		storageDomainVo {
			IdentifiedVo.builder {
				id { entity.leaseSdId.toString() }
				// name { entity. }
			}
		}
		// diskAttachmentVos {
		//
		// }
		snapshotVos { snapshots.filter {
			it.snapshotType != SnapshotType.active &&
				it.snapshotType != SnapshotType.preview
		}.toIdentifiedVosFromSnapshotEntities() }
	}
}
fun Collection<VmEntity>.toVmVosFromVmEntities(): List<VmVo> {
	return this@toVmVosFromVmEntities.map { it.toVmVo() }
}

fun VmEntity.toVmVoFromVmEntity(vm: Vm?): VmVo {
	val entity = this@toVmVoFromVmEntity
	val hosts: List<IdentifiedVo> = if (entity.dedicatedVmForVds.isNullOrEmpty()) {
		emptyList()
	} else entity.dedicatedVmForVds!!
		.split(",")
		.mapNotNull { id ->
			id.trim().takeIf { it.isNotEmpty() }?.let {
				IdentifiedVo.builder {
					id { it }
					name { "" }
				}
			}
		}


	return VmVo.builder {
		id { entity.vmGuid.toString() }
		name { entity.vmName }
		description { entity.description }
		comment { entity.freeTextComment }
		status { entity.status }
		iconSmall { entity.effectiveSmallIcon?.toVmIconVoFromVmEntity() }
		iconLarge { entity.effectiveLargeIcon?.toVmIconVoFromVmEntity() }
		creationTime { entity.creationDate }
		stopTime { entity.lastStopTime }
		timeElapsed { entity.elapsedTime?.toLong() }
		optimizeOption { entity.vmType }
		nextRun { entity.nextRunConfigExists }
		biosType { entity.biosType }
		biosBootMenu { entity.isBootMenuEnabled }
		osType { entity.osType }
		cpuArc { entity.architecture }
		cpuTopologyCnt { entity.numOfCpus }
		cpuTopologyCore { entity.cpuPerSocket } // TODO: 이거 맞는지 모르겠음
		cpuTopologySocket { entity.numOfSockets }
		cpuTopologyThread { entity.threadsPerCpu } // TODO: 이거 맞는지 모르겠음
		cpuPinningPolicy { entity.cpuPinningPolicy }
		memorySize { entity.memSize }
		memoryGuaranteed { entity.memSize }
		memoryMax { entity.maxMemorySize }
		deleteProtected { entity.isDeleteProtected }
		monitor { entity.numOfMonitors }
		displayType { entity.defaultDisplayType }
		videoType { entity.graphicType }
		ha { entity.autoStartup }
		haPriority { entity.priority }
		ioThreadCnt { entity.numOfIoThreads } // TODO: 이거 맞는지 모르겠음
		migrationMode { entity.migrationSupport }
		migrationEncrypt { entity.isMigrateEncrypted }
		migrationAutoConverge { entity.isAutoConverge }
		migrationCompression { entity.isMigrateCompressed }
		firstDevice {
			entity.defaultBootSequence?.toBootDevices()?.firstOrNull()?.value()
		}
		secDevice {
			if ((entity.defaultBootSequence?.toBootDevices()?.size ?: 0) > 1) entity.defaultBootSequence?.toBootDevices()?.get(1)?.value()
			else null
		}
		hostInCluster { entity.dedicatedVmForVds.isNullOrEmpty() }
		startPaused { entity.isRunAndPause }
		storageErrorResumeBehaviour { entity.vmResumeBehavior }
		usb { entity.usbPolicy?.isEnabled }
		virtioScsiMultiQueueEnabled { entity.virtioScsiMultiQueuesEnabled }
		hostedEngineVm { entity.isHostedEngineVm }
		timeOffset { entity.timeZone }
		usageDto {
			UsageDto.builder {
				cpuPercent { usageCpuPercent }
				memoryPercent { usageMemPercent }
				networkPercent { usageNetworkPercent }
			}
		}
		ipv4 { listOf(entity.vmIp) }
		fqdn { entity.vmFqdn }
		hostVos { hosts }
		cdRomVo {
			IdentifiedVo.builder {
				id {
					/*if (entity.status == VmStatusB.up)
						entity.currentCd // 임시보관 되고 있는 CD-ROM 파일을 부를 때
					else*/
						entity.isoPath
				}
			}
		}
		templateVo {
			IdentifiedVo.builder {
				id { entity.originalTemplateId.toString() }
				name { entity.originalTemplateName }
			}
		}
		hostVo {
			IdentifiedVo.builder {
				id { entity.runOnVds.toString() }
				name { entity.runOnVdsName }
			}
		}
		clusterVo {
			IdentifiedVo.builder {
				id { entity.clusterId.toString() }
				name { entity.clusterName }
			}
		}
		dataCenterVo {
			IdentifiedVo.builder {
				id { entity.storagePoolId.toString() }
				name { entity.storagePoolName }
			}
		}
		storageDomainVo {
			IdentifiedVo.builder {
				id { entity.leaseSdId.toString() }
				// name { entity. }
			}
		}
		snapshotVos { snapshots.filter {
			it.snapshotType != SnapshotType.active &&
			it.snapshotType != SnapshotType.preview
		}.toIdentifiedVosFromSnapshotEntities() }
	}
}

fun Collection<VmEntity>.toVmVosFromVmEntities(vms: List<Vm>? = null): List<VmVo> {  // TODO: 다 연결 되었을 때 vms없이 mapping
	val itemById: Map<String, Vm>? =
		vms?.associateBy { it.id() }
	return this@toVmVosFromVmEntities.map { it.toVmVoFromVmEntity(itemById?.get(it.vmGuid.toString())) }
}

fun VmEntity.toIdentifiedVoFromVmEntity(): IdentifiedVo = IdentifiedVo.builder {
	id { this@toIdentifiedVoFromVmEntity.vmGuid.toString() }
	name { this@toIdentifiedVoFromVmEntity.vmName }
}
fun Collection<VmEntity>.toIdentifiedVosFromVoEntities(): List<IdentifiedVo> =
	this@toIdentifiedVosFromVoEntities.map { it.toIdentifiedVoFromVmEntity() }
//endregion: VmEntity
//region: VmStaticEntity
fun VmStaticEntity.toVmVoFromVmStaticEntity(): VmVo = VmVo.builder {
	id { this@toVmVoFromVmStaticEntity.vmGuid.toString() }
	name { this@toVmVoFromVmStaticEntity.vmName }
	displayType { this@toVmVoFromVmStaticEntity.defaultDisplayType }
}
//endregion: VmStaticEntity


//region: VmIconEntity
fun VmIconEntity.toVmIconVoFromVmEntity(): VmIconVo = VmIconVo.builder {
	id { this@toVmIconVoFromVmEntity.id.toString() }
	dataUrl { this@toVmIconVoFromVmEntity.dataUrl }
}
fun Collection<VmIconEntity>.toVmIconVosFromVmIconEntities(): List<VmIconVo> =
	this@toVmIconVosFromVmIconEntities.map { it.toVmIconVoFromVmEntity() }
//endregion: VmIconEntity


//region: VdsInterfaceViewEntities
fun VdsInterfaceViewEntity.toHostNicVoFromVdsInterfaceViewEntity(): HostNicVo = HostNicVo.builder {
	id { this@toHostNicVoFromVdsInterfaceViewEntity.id.toString() }
	name { this@toHostNicVoFromVdsInterfaceViewEntity.name }
	macAddress { this@toHostNicVoFromVdsInterfaceViewEntity.macAddr }
	mtu { this@toHostNicVoFromVdsInterfaceViewEntity.mtu }
	bridged { this@toHostNicVoFromVdsInterfaceViewEntity.bridged }
	status { this@toHostNicVoFromVdsInterfaceViewEntity.ifaceStatus }
	speed { this@toHostNicVoFromVdsInterfaceViewEntity.speed?.toBigInteger() }
	rxSpeed { this@toHostNicVoFromVdsInterfaceViewEntity.rxRate }
	txSpeed { this@toHostNicVoFromVdsInterfaceViewEntity.txRate }
	rxTotalSpeed { this@toHostNicVoFromVdsInterfaceViewEntity.rxTotal }
	txTotalSpeed { this@toHostNicVoFromVdsInterfaceViewEntity.txTotal }
	rxTotalError { this@toHostNicVoFromVdsInterfaceViewEntity.rxDrop } // TODO: 맞는지 모르겠음 아님 offset
	txTotalError { this@toHostNicVoFromVdsInterfaceViewEntity.txDrop } // TODO: 맞는지 모르겠음 아님 offset
	// vlan { this@toHostNicVoFromVdsInterfaceViewEntity.vlanId }
	adAggregatorId { this@toHostNicVoFromVdsInterfaceViewEntity.adAggregatorId }
	bootProtocol { this@toHostNicVoFromVdsInterfaceViewEntity.bootProtocol }
	ipv6BootProtocol { this@toHostNicVoFromVdsInterfaceViewEntity.ipv6BootProtocol }
	ip {
		IpVo.builder {
			address { this@toHostNicVoFromVdsInterfaceViewEntity.addr }
			gateway { this@toHostNicVoFromVdsInterfaceViewEntity.gateway }
			netmask { this@toHostNicVoFromVdsInterfaceViewEntity.subnet }
			// version { this@toHostNicVoFromVdsInterfaceViewEntity }
		}
	}
	ipv6 {
		IpVo.builder {
			address { this@toHostNicVoFromVdsInterfaceViewEntity.ipv6Address }
			gateway { this@toHostNicVoFromVdsInterfaceViewEntity.ipv6Gateway }
			netmask { this@toHostNicVoFromVdsInterfaceViewEntity.subnet }
			// version { this@toHostNicVoFromVdsInterfaceViewEntity }
		}
	}
	bondingVo {
		BondingVo.builder {
			/*
			activeSlaveVo {
				if (this@toBondingVo.activeSlavePresent()) {
					val activeSlaveId = this@toBondingVo.activeSlave().id()
					val nic = conn.findNicFromHost(hostId, activeSlaveId).getOrNull()
					nic?.fromHostNicToIdentifiedVo()
				} else null
			}
			optionVos {
				if (this@toBondingVo.optionsPresent()) {
					this@toBondingVo.options().toOptionVos()
				} else listOf()
			}
			slaveVos { slaves }
			*/
		}
	}
	hostVo { this@toHostNicVoFromVdsInterfaceViewEntity.host?.toIdentifiedVoFromVdsEntity() }
}
fun Collection<VdsInterfaceViewEntity>.toHostNicVosFromVdsInterfaceViewEntities(): List<HostNicVo> =
	this@toHostNicVosFromVdsInterfaceViewEntities.map { it.toHostNicVoFromVdsInterfaceViewEntity() }
//endregion: VdsInterfaceViewEntities

//region: SnapshotEntity
fun SnapshotEntity.fromSnapshotEntityToSnapshotVo(): SnapshotVo = SnapshotVo.builder {
	val entity = this@fromSnapshotEntityToSnapshotVo
	id { entity.snapshotId.toString() }
	description { entity.description }
	status { entity.status }
	date { entity.creationDate.toDate() }
	// persistMemory { entity. }
	// vmVo {  }
	// snapshotDiskVos { entity }
	// nicVos { }
	applicationVos {
		entity.appList.split(",").map {
			IdentifiedVo.builder {
				// id {  }
				// name {  }
			}
		}
	}
	// diskAttachmentVos { }
}
fun SnapshotEntity.toIdentifiedVoFromSnapshotEntity(): IdentifiedVo = IdentifiedVo.builder {
	id { this@toIdentifiedVoFromSnapshotEntity.snapshotId.toString() }
	name { this@toIdentifiedVoFromSnapshotEntity.description }
}
fun Collection<SnapshotEntity>.toIdentifiedVosFromSnapshotEntities(): List<IdentifiedVo> =
	this@toIdentifiedVosFromSnapshotEntities.map { it.toIdentifiedVoFromSnapshotEntity() }

//endregion: SnapshotEntity


//region: DwhHostConfigurationFullCheckEntity
fun DwhHostConfigurationFullCheckEntity.fromDwhHostConfigurationFullCheckToHostVo(conn: Connection): HostVo = HostVo.builder {
	val entity = this@fromDwhHostConfigurationFullCheckToHostVo
	val cluster = conn.findCluster(entity.clusterId.toString()).getOrNull()
	id { entity.hostId.toString() }
	name { entity.hostName }
	clusterVo { cluster?.fromClusterToIdentifiedVo() }
	memoryTotal { entity.memorySizeMb?.toBigInteger() }
	// comment { entity.comment }
	// status { entity.status() }
	// ksm { entity.ksm().enabled() }
	// hostedEngine {
	// 	if (entity.hostedEnginePresent())
	// 		entity.hostedEngine().toHostedEngineVo()
	// 	else
	// 		null
	// }
	// hostedEngineVM { hostedVm }
	address { entity.fqdnOrIp }
	// ssh { entity.ssh().toSshVo() }
	// clusterVo { entity.cluster()?.fromClusterToIdentifiedVo() }
	// dataCenterVo { dataCenter?.fromDataCenterToIdentifiedVo() }
	// vmSizeVo { host.findVmCntFromHost() }
	// usageDto { usageDto }
	// spmStatus { entity.spm().status() }
	// bootingTime { Date(statistics.findBootTime() * 1000) }
}


//endregion: DwhHostConfigurationFullCheckEntity

//region: VmTemplateEntity

fun VmTemplateEntity.fromVmTemplateToIdentifiedVo(): IdentifiedVo = IdentifiedVo.builder {
	id { this@fromVmTemplateToIdentifiedVo.vmtGuid.toString() }
	name { this@fromVmTemplateToIdentifiedVo.name }
}
fun List<VmTemplateEntity>.fromVmTemplateToIdentifiedVos(): List<IdentifiedVo> =
	this@fromVmTemplateToIdentifiedVos.map { it.fromVmTemplateToIdentifiedVo() }


fun VmTemplateEntity.fromVmTemplateToTemplateVo(): TemplateVo = TemplateVo.builder {
	val entity = this@fromVmTemplateToTemplateVo
	id { entity.vmtGuid.toString() }
	name { entity.name }
	comment { entity.freeTextComment }
	description { entity.description }
	status { entity.status }
	iconSmall { entity.effectiveSmallIcon?.toVmIconVoFromVmEntity() }
	iconLarge { entity.effectiveLargeIcon?.toVmIconVoFromVmEntity() }
	creationTime { entity.creationDate }
	osType { entity.osType }
	// biosType { entity.biosType } // cluster_biosType
	// optimizeOption { entity.vmType } // 최적화 옵션 entity.type().findVmType()
	// memorySize { entity.memSizeMb }
	// cpuTopologyCore { entity.per }
	// cpuArc { entity.architecture }
	cpuTopologyCnt { entity.numOfCpus }
	cpuTopologyCore { entity.cpuPerSocket } // TODO: 이거 맞는지 모르겠음
	cpuTopologySocket { entity.numOfSockets }
	cpuTopologyThread { entity.threadsPerCpu } // TODO: 이거 맞는지 모르겠음
	displayType { entity.defaultDisplayType }
	// ha {  }
	haPriority { entity.priority }
	monitor { entity.numOfMonitors }
	clusterVo {
		IdentifiedVo.builder {
			id { entity.clusterId.toString() }
			name { entity.clusterName }
		}
	}
	dataCenterVo {
		IdentifiedVo.builder {
			id { entity.storagePoolId.toString() }
			name { entity.storagePoolName }
		}
	}
}
//endregion: VmTemplateEntity

//region: VnicProfileEntity
fun VnicProfileEntity.toVnicProfileVoFromVnicProfileEntity(): VnicProfileVo = VnicProfileVo.builder {
	id { this@toVnicProfileVoFromVnicProfileEntity.id.toString() }
	name { this@toVnicProfileVoFromVnicProfileEntity.name }
	description { this@toVnicProfileVoFromVnicProfileEntity.description }
	passThrough {
		if (this@toVnicProfileVoFromVnicProfileEntity.passthrough == true)
			VnicPassThroughMode.ENABLED
		else
			VnicPassThroughMode.DISABLED
	}
	migration { this@toVnicProfileVoFromVnicProfileEntity.migratable }
	portMirroring { this@toVnicProfileVoFromVnicProfileEntity.portMirroring }
	failOVer { this@toVnicProfileVoFromVnicProfileEntity.failoverVnicProfile?.toIdentifiedVoFromVnicProfileEntity() }
	// dataCenterVo { this@toVnicProfileVoFromVnicProfileEntity.network?.storagePool?.toIdentifiedVoFromStoragePoolEntity() }
	networkVo { this@toVnicProfileVoFromVnicProfileEntity.network?.toIdentifiedVoFromNetworkEntity() }
}
fun VnicProfileEntity.toIdentifiedVoFromVnicProfileEntity(): IdentifiedVo = IdentifiedVo.builder {
	id { this@toIdentifiedVoFromVnicProfileEntity.id.toString() }
	name { this@toIdentifiedVoFromVnicProfileEntity.name }
}
fun Collection<VnicProfileEntity>?.toVnicProfileVosFromVnicProfileEntities(): List<VnicProfileVo> =
	this@toVnicProfileVosFromVnicProfileEntities?.map { it.toVnicProfileVoFromVnicProfileEntity() } ?: emptyList()
fun Collection<VnicProfileEntity>?.toIdentifiedVosFromVnicProfileEntities(): List<IdentifiedVo> =
	this@toIdentifiedVosFromVnicProfileEntities?.map { it.toIdentifiedVoFromVnicProfileEntity() } ?: emptyList()
//endregion: VnicProfileEntity

//region: VmInterfaceEntity
fun VmInterfaceEntity.toNicVoFromVmInterfaceEntity(): NicVo = NicVo.builder {
	id { this@toNicVoFromVmInterfaceEntity.id.toString() }
	name { this@toNicVoFromVmInterfaceEntity.name }
	interface_ { this@toNicVoFromVmInterfaceEntity.interfaceType }
	macAddress { this@toNicVoFromVmInterfaceEntity.macAddr }
	linked { this@toNicVoFromVmInterfaceEntity.linked }
	// plugged {  } // TODO: 값 확인 필요
	synced { this@toNicVoFromVmInterfaceEntity.synced }
	// ipv4 { this@toNicVoFromVmInterfaceEntity }
	// ipv6 { this@toNicVoFromVmInterfaceEntity }
	// guestInterfaceName { this@toNicVoFromVmInterfaceEntity. }
	// networkVo { this@toNicVoFromVmInterfaceEntity }
	vnicProfileVo { this@toNicVoFromVmInterfaceEntity.vnicProfile?.toIdentifiedVoFromVnicProfileEntity() }
	networkFilterVo { this@toNicVoFromVmInterfaceEntity.vnicProfile?.networkFilter?.toNetworkFilterVoFromNetworkFilterEntity() }
}
fun VmInterfaceEntity.toIdentifiedVoFromVmInterfaceEntity(): IdentifiedVo = IdentifiedVo.builder {

}
//endregion: VmInterfaceEntity


//region: ProviderEntity
fun ProvidersEntity.toProviderVo(): ProviderVo = ProviderVo.builder {
	id { id.toString() }
	name { name }
	description { description }
	url { url }
	providerType { providerType }
	authRequired { authRequired }
	authUsername { authUsername }
	authPassword { authPassword }
	createDate { createDate }
	updateDate { updateDate }
	customProperties { customProperties }
	tenantName { tenantName }
	pluginType { pluginType }
	authUrl { authUrl }
	additionalProperties { additionalProperties }
	readOnly { readOnly }
	isUnmanaged { isUnmanaged }
	autoSync { autoSync }
	userDomainName { userDomainName }
	projectName { projectName }
	projectDomainName { projectDomainName }
}
fun List<ProvidersEntity>.toProviderVos(): List<ProviderVo> =
	this.map { it.toProviderVo() }

fun ProvidersEntity.toExternalHostProviderVo(): ExternalHostProviderVo = ExternalHostProviderVo.builder {
	id { id.toString() }
	name { name }
	description { description }
	url { url }
	providerType { providerType }
	authRequired { authRequired }
	authUsername { authUsername }
	authPassword { authPassword }
	createDate { createDate }
	updateDate { updateDate }
	providerPropertyVo { additionalProperties?.toProviderPropertyVo() }
}
fun List<ProvidersEntity>.toExternalHostProviderVos(): List<ExternalHostProviderVo> =
	this.map { it.toExternalHostProviderVo() }


fun AdditionalProperties4Vmware.toPropertyBuildersFromAdditionalProperties4Vmware(): List<Property> {
	val props = mutableListOf<Property>()

	listOf(
		"type" to "vmware",
		"storagePoolId" to storagePoolIdFull,
		"proxyHostId" to proxyHostIdFull,
		"vCenter" to vcenter,
		"esx" to esx,
		"dataCenter" to dataCenter,
		"verifySSL" to verifySSL.toString()
	).forEach { (key, value) ->
		if (!value.isNullOrBlank()) {
			println(key + ": " + value)
			props.add(PropertyBuilder().name(key).value(value).build())
		}
	}
	props.forEach {
		println(it.name() + ": " + it.value())
	}
	return props
}



//endregion: ProviderEntity
