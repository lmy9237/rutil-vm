package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.model.auth.UserSessionVo
import com.itinfo.rutilvm.api.model.computing.EventVo
import com.itinfo.rutilvm.api.model.computing.SnapshotVo
import com.itinfo.rutilvm.api.model.computing.TemplateVo
import com.itinfo.rutilvm.api.model.computing.VmVo
import com.itinfo.rutilvm.api.model.fromDataCenterToIdentifiedVo
import com.itinfo.rutilvm.api.model.storage.DiskAttachmentVo
import com.itinfo.rutilvm.api.model.storage.DiskImageVo

import com.itinfo.rutilvm.api.model.storage.StorageDomainVo
import com.itinfo.rutilvm.api.model.storage.toDomainSize
import com.itinfo.rutilvm.api.model.storage.toStorageVo
import com.itinfo.rutilvm.api.ovirt.business.DiskContentType
import com.itinfo.rutilvm.api.ovirt.business.DiskStatus
import com.itinfo.rutilvm.api.ovirt.business.DiskStorageType
import com.itinfo.rutilvm.api.ovirt.business.StorageDomainStatus
import com.itinfo.rutilvm.api.ovirt.business.StorageDomainType
import com.itinfo.rutilvm.api.ovirt.business.StoragePoolStatus
import com.itinfo.rutilvm.api.ovirt.business.StorageType
import com.itinfo.rutilvm.api.ovirt.business.VmStatusB

import com.itinfo.rutilvm.api.ovirt.business.findStatus
import com.itinfo.rutilvm.api.repository.history.dto.UsageDto
import com.itinfo.rutilvm.common.toDate
import com.itinfo.rutilvm.common.toLocalDateTime
import com.itinfo.rutilvm.util.ovirt.cpuTopologyAll
import org.ovirt.engine.sdk4.types.Disk
import org.ovirt.engine.sdk4.types.DisplayType
import org.ovirt.engine.sdk4.types.Template
import org.ovirt.engine.sdk4.types.Vm
import org.springframework.data.domain.Page

//region: AuditLogEntity
fun AuditLogEntity.toEventVo(): EventVo = EventVo.builder {
	id { this@toEventVo.auditLogId.toString() }
	severity { this@toEventVo.severity }
	description { this@toEventVo.message }
	time { this@toEventVo.logTime }
	code { this@toEventVo.logType }
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
		sharable { entity.shareable }
		virtualSize { entity.size }
		actualSize { entity.actualSize }
		status { DiskStatus.forValue(entity.imagestatus) }
		contentType { DiskContentType.forValue(entity.diskContentType) }
		storageType { DiskStorageType.forValue(entity.diskStorageType) }
		sparse { entity.volumeType == 2 }
		description { entity.description }
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
		status { StorageDomainStatus.forValue(status) }
		// storagePoolStatus { StoragePoolStatus.forValue(storageDomainSharedStatus) }
		storageType { StorageType.forValue(storageType) }
		storageDomainType { StorageDomainType.forValue(storageDomainType) }
		// storageVo { storage().toStorageVo() }
		// master { master() }
		hostedEngine { isHostedEngineStorage }
		comment { storageComment }
		size { usedDiskSize?.add(availableDiskSize) }
		usedSize { usedDiskSize }
		availableSize { availableDiskSize }
		dataCenterVo { IdentifiedVo.builder {
			id { storagePoolId.toString() }
			name { storagePoolName }
		} }
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
		biosType {
			vm?.bios()?.type()?.toString()
			// BiosType.forValue(this@toUnregisteredVm.ovf?.virtualSystem?.biosType)?.name
		}
		cpuArc { vm?.cpu()?.architecture() }
		cpuTopologyCnt { vm.cpuTopologyAll() }
		cpuTopologyCore { vm?.cpu()?.topology()?.coresAsInteger() }
		cpuTopologySocket { vm?.cpu()?.topology()?.socketsAsInteger() }
		cpuTopologyThread { vm?.cpu()?.topology()?.threadsAsInteger() }
		cpuPinningPolicy {
			"${this@toUnregisteredVm.ovf?.virtualSystem?.cpuPinningPolicy}"
			// vm?.cpuPinningPolicy()?.value()
		}
		creationTime {
			// NOTE: 환산에 문제가 있는것으로 판단. 값이 좀 이상함 Locale 때문에 차이가 생김
			// ovf?.virtualSystem?.creationDate?.toDate()
			vm?.creationTime().toLocalDateTime()
		}
		monitor { if (vm?.displayPresent() == true) vm.display().monitorsAsInteger() else 0 }
		displayType { if (vm?.displayPresent() == true) vm.display().type() else DisplayType.VNC }
		ha { vm?.highAvailability()?.enabled() }
		haPriority { vm?.highAvailability()?.priorityAsInteger() }
		memorySize { vm?.memory() }
		memoryGuaranteed { vm?.memoryPolicy()?.guaranteed() }
		memoryMax { vm?.memoryPolicy()?.max() }
		osType { vm?.os()?.type() }
		optimizeOption { vm?.type()?.value() }
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
		status { template?.status() }
		// templateVo { tmp?.fromTemplateToIdentifiedVo() }
		biosType {
			template?.bios()?.type()?.toString()
			// BiosType.forValue(this@toUnregisteredVm.ovf?.virtualSystem?.biosType)?.name
		}
		cpuArc { template?.cpu()?.architecture() }
		// cpuTopologyCnt { template.cpuTopologyAll() }
		cpuTopologyCore { template?.cpu()?.topology()?.coresAsInteger() }
		cpuTopologySocket { template?.cpu()?.topology()?.socketsAsInteger() }
		cpuTopologyThread { template?.cpu()?.topology()?.threadsAsInteger() }
		cpuPinningPolicy {
			"${this@toUnregisteredTemplate.ovf?.virtualSystem?.cpuPinningPolicy}"
			// vm?.cpuPinningPolicy()?.value()
		}
		creationTime {
			// NOTE: 환산에 문제가 있는것으로 판단. 값이 좀 이상함 Locale 때문에 차이가 생김
			// ovf?.virtualSystem?.creationDate?.toDate()
			template?.creationTime()
		}
		monitor { if (template?.displayPresent() == true) template.display().monitorsAsInteger() else 0 }
		displayType { if (template?.displayPresent() == true) template.display().type() else DisplayType.VNC }
		ha { template?.highAvailability()?.enabled() }
		haPriority { template?.highAvailability()?.priorityAsInteger() }
		memorySize { template?.memory() }
		memoryGuaranteed { template?.memoryPolicy()?.guaranteed() }
		memoryMax { template?.memoryPolicy()?.max() }
		osType { template?.os()?.type() }
		optimizeOption { template?.type()?.value() }
		usb { if(template?.usbPresent() == true) template.usb()?.enabled() else false }
		diskAttachmentVos { disksFromOvf.toDiskAttachmentIdentifiedVos() }
	}
}

fun OvfDisk.toDiskAttachmentIdentifiedVo(): DiskAttachmentVo = DiskAttachmentVo.builder {
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

fun List<OvfDisk>.toDiskAttachmentIdentifiedVos(): List<DiskAttachmentVo> =
	this@toDiskAttachmentIdentifiedVos.map { it.toDiskAttachmentIdentifiedVo() }

fun List<UnregisteredOvfOfEntities>.toUnregisteredVms(vms: List<Vm>): List<VmVo> {
	val itemById: Map<String, Vm> =
		vms.associateBy { it.id() }
	return this@toUnregisteredVms.map { it.toUnregisteredVm(itemById[it.id?.entityGuid.toString()]) }
}

fun List<UnregisteredOvfOfEntities>.toUnregisteredTemplates(templates: List<Template>): List<TemplateVo> {
	val itemById: Map<String, Template> =
		templates.associateBy { it.id() }
	return this@toUnregisteredTemplates.map {
		it.toUnregisteredTemplate(itemById[it.id?.entityGuid.toString()])
	}
}
//endregion: UnregisteredOvfOfEntities


//region: VmEntity
fun VmEntity.toVmVoFromVmEntity(): VmVo {
	val entity = this@toVmVoFromVmEntity
	return VmVo.builder {
		id { entity.vmGuid.toString() }
		name { entity.vmName }
		comment { entity.freeTextComment }
		creationTime { entity.creationDate }
		stopTime { entity.lastStopTime }
		timeElapsed { entity.elapsedTime?.toLong() }
		status { entity.status }
		description { entity.description }
		nextRun { entity.nextRunConfigExists }
		hostedEngineVm { entity.origin == 6 }
		usageDto {
			UsageDto.builder {
				cpuPercent { usageCpuPercent }
				memoryPercent { usageMemPercent }
				networkPercent { usageNetworkPercent }
			}
		}
		ipv4 { listOf(entity.vmIp) }
		fqdn { entity.vmHost }
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
		snapshotVos { snapshots.filter {
			it._snapshotType != com.itinfo.rutilvm.api.ovirt.business.SnapshotType.ACTIVE &&
			it._snapshotType != com.itinfo.rutilvm.api.ovirt.business.SnapshotType.PREVIEW
		}.toIdentifiedVosFromSnapshotEntities() }
	}
}

fun List<VmEntity>.toVmVosFromVmEntities(): List<VmVo> =
	this@toVmVosFromVmEntities.map { it.toVmVoFromVmEntity() }
fun VmEntity.toIdentifiedVoFromVmEntity(): IdentifiedVo = IdentifiedVo.builder {
	id { this@toIdentifiedVoFromVmEntity.vmGuid.toString() }
	name { this@toIdentifiedVoFromVmEntity.vmName }
}
fun List<VmEntity>.toIdentifiedVosFromVoEntities(): List<IdentifiedVo> =
	this@toIdentifiedVosFromVoEntities.map { it.toIdentifiedVoFromVmEntity() }
//endregion: VmEntity


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
