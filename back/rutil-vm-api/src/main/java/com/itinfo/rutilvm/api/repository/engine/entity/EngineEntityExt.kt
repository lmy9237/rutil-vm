package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.api.model.auth.UserSessionVo
import com.itinfo.rutilvm.api.model.computing.TemplateVo
import com.itinfo.rutilvm.api.model.computing.VmVo
import com.itinfo.rutilvm.api.model.storage.DiskAttachmentVo
import com.itinfo.rutilvm.api.model.storage.DiskImageVo
import com.itinfo.rutilvm.api.model.storage.toUnregisterdDisk
import com.itinfo.rutilvm.api.ovirt.business.BiosType
import com.itinfo.rutilvm.common.toDate
import com.itinfo.rutilvm.common.toLocalDateTime
import com.itinfo.rutilvm.common.toUUID
import com.itinfo.rutilvm.util.ovirt.cpuTopologyAll
import org.ovirt.engine.sdk4.types.Disk
import org.ovirt.engine.sdk4.types.DisplayType
import org.ovirt.engine.sdk4.types.Template
import org.ovirt.engine.sdk4.types.Vm

fun DiskVmElementEntity.toVmDisk(): DiskImageVo {
	return DiskImageVo.builder {

	}
}

//region: EngineSessionsEntity
fun EngineSessionsEntity.toUserSession(): UserSessionVo {
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

fun List<EngineSessionsEntity>.toUserSessions(): List<UserSessionVo> = this.map { it.toUserSession() }
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
		status { vm?.status()?.value() }
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
	return this@toUnregisteredTemplates.map { it.toUnregisteredTemplate(itemById[it.id?.entityGuid.toString()]) }
}
//endregion: UnregisteredOvfOfEntities
