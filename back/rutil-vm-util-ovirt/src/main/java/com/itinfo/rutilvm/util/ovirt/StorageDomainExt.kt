package com.itinfo.rutilvm.util.ovirt

import com.itinfo.rutilvm.api.ovirt.business.model.Term
import com.itinfo.rutilvm.api.ovirt.business.model.logSuccess
import com.itinfo.rutilvm.api.ovirt.business.model.logSuccessWithin
import com.itinfo.rutilvm.api.ovirt.business.model.logFail
import com.itinfo.rutilvm.api.ovirt.business.model.logFailWithin

import com.itinfo.rutilvm.util.ovirt.error.*

import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.builders.ClusterBuilder
import org.ovirt.engine.sdk4.builders.VmBuilder
import org.ovirt.engine.sdk4.services.*
import org.ovirt.engine.sdk4.types.*

private fun Connection.srvStorageDomains(): StorageDomainsService =
	this.systemService.storageDomainsService()

fun Connection.findAllStorageDomains(searchQuery: String = "", follow: String = ""): Result<List<StorageDomain>> = runCatching {
	this.srvStorageDomains().list().apply {
		if (searchQuery.isNotEmpty()) search(searchQuery)
		if (follow.isNotEmpty()) follow(follow)
	}.send().storageDomains()

}.onSuccess {
	Term.STORAGE_DOMAIN.logSuccess("목록조회")
}.onFailure {
	Term.STORAGE_DOMAIN.logFail("목록조회", it)
	throw if (it is Error) it.toItCloudException(Term.STORAGE_DOMAIN, "목록조회") else it
}

private fun Connection.srvStorageDomain(storageDomainId: String, follow: String = ""): StorageDomainService =
	this.srvStorageDomains().storageDomainService(storageDomainId)

fun Connection.findStorageDomain(storageDomainId: String, follow: String = ""): Result<StorageDomain> = runCatching {
	this.srvStorageDomain(storageDomainId).get().apply{
		if (follow.isNotEmpty()) follow(follow)
	}.send().storageDomain()

}.onSuccess {
	Term.STORAGE_DOMAIN.logSuccess("상세조회")
}.onFailure {
	Term.STORAGE_DOMAIN.logFail("상세조회", it)
	throw if (it is Error) it.toItCloudException(Term.STORAGE_DOMAIN, "상세조회", storageDomainId) else it
}


fun Connection.addStorageDomain(storageDomain: StorageDomain, dataCenterId: String): Result<StorageDomain?> = runCatching {
	log.info("addStorageDomain--- dataCenterId: {}", dataCenterId)
	if (this.findAllStorageDomains().getOrDefault(emptyList())
			.nameDuplicateStorageDomain(storageDomain.name())) {
		throw ErrorPattern.STORAGE_DOMAIN_DUPLICATE.toError()
	}
	val storageAdded: StorageDomain? =
		this.srvStorageDomains().add().storageDomain(storageDomain).send().storageDomain()

	// 스토리지 도메인이 생성되지 않았을 경우 예외 처리
	storageAdded ?: throw ErrorPattern.STORAGE_DOMAIN_NOT_FOUND.toError()

	// 스토리지 도메인을 데이터센터에 붙이는 작업
	this.attachStorageDomainToDataCenter(dataCenterId, storageAdded.id())

	storageAdded
}.onSuccess {
	Term.STORAGE_DOMAIN.logSuccess("생성")
}.onFailure {
	Term.STORAGE_DOMAIN.logFail("생성", it)
	throw if (it is Error) it.toItCloudException(Term.STORAGE_DOMAIN, "생성") else it
}

fun Connection.importStorageDomain(storageDomain: StorageDomain, dataCenterId: String): Result<StorageDomain?> = runCatching {
	log.info("importStorageDomain--- dataCenterId: {}", dataCenterId)
	val storageImported: StorageDomain? =
		this.srvStorageDomains().add().storageDomain(storageDomain).send().storageDomain()

	// 스토리지 도메인이 생성되지 않았을 경우 예외 처리
	storageImported ?: throw ErrorPattern.STORAGE_DOMAIN_NOT_FOUND.toError()

	// 스토리지 도메인을 데이터센터에 붙이는 작업
	this.attachStorageDomainToDataCenter(dataCenterId, storageImported.id())
	// this.srvAttachedStorageDomainFromDataCenter(dataCenterId, storageImported.id()).deactivate().send()

	storageImported
}.onSuccess {
	Term.STORAGE_DOMAIN.logSuccess("가져오기")
}.onFailure {
	Term.STORAGE_DOMAIN.logFail("가져오기", it)
	throw if (it is Error) it.toItCloudException(Term.STORAGE_DOMAIN, "가져오기") else it
}

// 도메인 관리(편집)
fun Connection.updateStorageDomain(storageDomainId: String, storageDomain: StorageDomain): Result<StorageDomain?> = runCatching {
	if (this.findAllStorageDomains().getOrDefault(emptyList())
			.nameDuplicateStorageDomain(storageDomain.name(), storageDomainId)) {
		throw ErrorPattern.STORAGE_DOMAIN_DUPLICATE.toError()
	}
	val storageDomainUpdated: StorageDomain? =
		this.srvStorageDomain(storageDomainId).update().storageDomain(storageDomain).send().storageDomain()

	storageDomainUpdated ?: throw ErrorPattern.STORAGE_DOMAIN_NOT_FOUND.toError()

}.onSuccess {
	Term.STORAGE_DOMAIN.logSuccess("편집", storageDomainId)
}.onFailure {
	Term.STORAGE_DOMAIN.logFail("편집", it, storageDomainId)
	throw if (it is Error) it.toItCloudException(Term.STORAGE_DOMAIN, "편집", storageDomainId) else it
}

fun Connection.removeStorageDomain(storageDomainId: String, format: Boolean, hostName: String?): Result<Boolean> = runCatching {
	checkStorageDomainExists(storageDomainId)

	if (format && hostName == null) {
		throw ErrorPattern.STORAGE_DOMAIN_DELETE_INVALID.toError()
	}

	val removal = this.srvStorageDomain(storageDomainId).remove().destroy(false).format(format)
	if (hostName != null) {
		removal.host(hostName)
	}
	removal.send()
	true

}.onSuccess {
	Term.STORAGE_DOMAIN.logSuccess("삭제", storageDomainId)
}.onFailure {
	Term.STORAGE_DOMAIN.logFail("삭제", it, storageDomainId)
	throw if (it is Error) it.toItCloudException(Term.STORAGE_DOMAIN, "삭제", storageDomainId) else it
}

fun Connection.destroyStorageDomain(storageDomainId: String): Result<Boolean> = runCatching {
	checkStorageDomainExists(storageDomainId)
	this.srvStorageDomain(storageDomainId).remove()
		.destroy(true)
		.send()
	true
}.onSuccess {
	Term.STORAGE_DOMAIN.logSuccess("파괴", storageDomainId)
}.onFailure {
	Term.STORAGE_DOMAIN.logFail("파괴", it, storageDomainId)
	throw if (it is Error) it.toItCloudException(Term.STORAGE_DOMAIN, "파괴", storageDomainId) else it
}

fun Connection.updateOvfStorageDomain(storageDomainId: String): Result<Boolean> = runCatching {
	checkStorageDomainExists(storageDomainId)

	this.srvStorageDomain(storageDomainId).updateOvfStore().send()
	true

}.onSuccess {
	Term.STORAGE_DOMAIN.logSuccess("ovf 업데이트", storageDomainId)
}.onFailure {
	Term.STORAGE_DOMAIN.logFail("ovf 업데이트", it, storageDomainId)
	throw if (it is Error) it.toItCloudException(Term.STORAGE_DOMAIN, "ovf 업데이트", storageDomainId) else it
}

fun Connection.refreshLunStorageDomain(storageDomainId: String): Result<Boolean> = runCatching {
	checkStorageDomainExists(storageDomainId)

	this.srvStorageDomain(storageDomainId).refreshLuns().send()
	true

}.onSuccess {
	Term.STORAGE_DOMAIN.logSuccess("디스크 검사", storageDomainId)
}.onFailure {
	Term.STORAGE_DOMAIN.logFail("디스크 검사", it, storageDomainId)
	throw if (it is Error) it.toItCloudException(Term.STORAGE_DOMAIN, "디스크 검사", storageDomainId) else it
}

@Throws(InterruptedException::class)
fun Connection.expectStorageDomainDeleted(storageDomainId: String, timeout: Long = 60000L, interval: Long = 1000L): Boolean {
	val startTime = System.currentTimeMillis()
	while (true) {
		val storageDomains: List<StorageDomain> =
			this.findAllStorageDomains().getOrDefault(listOf())
		val storageDomainToRemove = storageDomains.firstOrNull() { it.id() == storageDomainId } // vm이 어느것이라도 매치되는것이 있다면
		if (storageDomainToRemove == null) {// !(매치되는것이 있다)
			Term.STORAGE_DOMAIN.logSuccess("삭제")
			return true
		} else if (System.currentTimeMillis() - startTime > timeout){
			log.error("{} {} 삭제 시간 초과", Term.STORAGE_DOMAIN.description, storageDomainToRemove.name())
			return false
		}
		log.debug("{} 삭제 진행중 ... ", Term.STORAGE_DOMAIN.description)
		Thread.sleep(interval)
	}
}

private fun Connection.srvAllFilesFromStorageDomain(storageDomainId: String): FilesService =
	this.srvStorageDomain(storageDomainId).filesService()

fun Connection.findAllFilesFromStorageDomain(storageDomainId: String): Result<List<File>> = runCatching {
	this.srvAllFilesFromStorageDomain(storageDomainId).list().send().file()

}.onSuccess {
	Term.STORAGE_DOMAIN.logSuccessWithin(Term.FILE, "목록조회", storageDomainId)
}.onFailure {
	Term.STORAGE_DOMAIN.logFailWithin(Term.FILE, "목록조회", it, storageDomainId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.STORAGE_DOMAIN, Term.FILE, "목록조회", storageDomainId) else it
}

private fun Connection.srvFileFromStorageDomain(storageDomainId: String, fileId: String): FileService =
	this.srvAllFilesFromStorageDomain(storageDomainId).fileService(fileId)

fun Connection.findFileFromStorageDomain(storageDomainId: String, fileId: String): Result<File?> = runCatching {
	this.srvFileFromStorageDomain(storageDomainId, fileId).get().send().file()

}.onSuccess {
	Term.STORAGE_DOMAIN.logSuccessWithin(Term.FILE, "상세조회", storageDomainId)
}.onFailure {
	Term.STORAGE_DOMAIN.logFailWithin(Term.FILE, "상세조회", it, storageDomainId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.STORAGE_DOMAIN, Term.FILE, "상세조회", storageDomainId, fileId) else it
}

private fun Connection.srvVmsFromStorageDomain(storageId: String): StorageDomainVmsService =
	this.srvStorageDomain(storageId).vmsService()

private fun Connection.srvVmFromStorageDomain(storageId: String, vmId: String): StorageDomainVmService =
	this.srvStorageDomain(storageId).vmsService().vmService(vmId)

fun Connection.findAllVmsFromStorageDomain(storageDomainId: String, follow: String = ""): Result<List<Vm>> = runCatching {
	checkStorageDomainExists(storageDomainId)
	this.srvVmsFromStorageDomain(storageDomainId).list().apply {
		if(follow.isNotEmpty()) follow(follow)
	}.send().vm()

}.onSuccess {
	Term.STORAGE_DOMAIN.logSuccessWithin(Term.DISK, "목록조회", storageDomainId)
}.onFailure {
	Term.STORAGE_DOMAIN.logFailWithin(Term.DISK, "목록조회", it, storageDomainId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.STORAGE_DOMAIN, Term.DISK, "목록조회", storageDomainId) else it
}

fun Connection.findAllUnregisteredVmsFromStorageDomain(storageDomainId: String, follow: String=""): Result<List<Vm>> = runCatching {
	checkStorageDomainExists(storageDomainId)
	val _follow = "storagedomain" +
		if (follow.isNotEmpty()) ",$follow"
		else ""
	this.srvVmsFromStorageDomain(storageDomainId).list().apply {
		unregistered(true)
	}.send().vm()

}.onSuccess {
	Term.STORAGE_DOMAIN.logSuccessWithin(Term.VM, "가져오기 목록조회", storageDomainId)
}.onFailure {
	Term.STORAGE_DOMAIN.logFailWithin(Term.VM, "가져오기 목록조회", it, storageDomainId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.STORAGE_DOMAIN, Term.VM, "가져오기 목록조회", storageDomainId) else it
}

fun Connection.registeredVmFromStorageDomain(storageDomainId: String, vm: Vm, allowPart: Boolean, badMac: Boolean): Result<Boolean> = runCatching {
	checkStorageDomainExists(storageDomainId)

	this.srvVmFromStorageDomain(storageDomainId, vm.id())
		.register()
		.vm(vm)
		.allowPartialImport(allowPart) // 부분 허용 여부
		.reassignBadMacs(badMac) // 불량 MAC 재배치 여부
		// .clone_(true) // clone
		.cluster(ClusterBuilder().id(vm.cluster().id()).build())
		.send()

	this.srvVm(vm.id())
		.update()
		.vm(VmBuilder().name(vm.name()))
		.send()

	true
}.onSuccess {
	Term.STORAGE_DOMAIN.logSuccessWithin(Term.VM, "가져오기", storageDomainId)
}.onFailure {
	Term.STORAGE_DOMAIN.logFailWithin(Term.VM, "가져오기", it, storageDomainId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.STORAGE_DOMAIN, Term.VM, "가져오기", storageDomainId, vm.id()) else it
}

fun Connection.importVmFromStorageDomain(storageDomainId: String, vm: Vm): Result<Boolean> = runCatching {
	checkStorageDomainExists(storageDomainId)

	this.srvVmFromStorageDomain(storageDomainId, vm.id())
		.import_()
		.vm(vm)
		.cluster(ClusterBuilder().id(vm.cluster().id()).build())
		.send()

	true
}.onSuccess {
	Term.STORAGE_DOMAIN.logSuccessWithin(Term.VM, "가져오기 (import)", storageDomainId)
}.onFailure {
	Term.STORAGE_DOMAIN.logFailWithin(Term.VM, "가져오기 (import)", it, storageDomainId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.STORAGE_DOMAIN, Term.VM, "가져오기 (import)", storageDomainId, vm.id()) else it
}

fun Connection.removeRegisteredVmFromStorageDomain(storageDomainId: String, vmId: String): Result<Boolean> = runCatching {
	checkStorageDomainExists(storageDomainId)

	this.srvVmsFromStorageDomain(storageDomainId).vmService(vmId).remove().send()
	true

}.onSuccess {
	Term.STORAGE_DOMAIN.logSuccessWithin(Term.VM, "가져오기 삭제", storageDomainId)
}.onFailure {
	Term.STORAGE_DOMAIN.logFailWithin(Term.VM, "가져오기 삭제", it, storageDomainId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.STORAGE_DOMAIN, Term.VM, "가져오기 삭제", storageDomainId, vmId) else it
}

private fun Connection.srvDisksFromStorageDomain(storageId: String): StorageDomainDisksService =
	this.srvStorageDomain(storageId).disksService()

fun Connection.findAllDisksFromStorageDomain(storageDomainId: String, follow: String = ""): Result<List<Disk>> = runCatching {
	checkStorageDomainExists(storageDomainId)
	val _follow = "storagedomain" +
		if (follow.isNotEmpty()) ",$follow"
		else ""
	this.srvDisksFromStorageDomain(storageDomainId).list().apply {
		follow(_follow)
	}.send().disks()
}.onSuccess {
	Term.STORAGE_DOMAIN.logSuccessWithin(Term.DISK, "목록조회", storageDomainId)
}.onFailure {
	Term.STORAGE_DOMAIN.logFailWithin(Term.DISK, "목록조회", it, storageDomainId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.STORAGE_DOMAIN, Term.DISK, "목록조회", storageDomainId) else it
}

fun Connection.findAllUnregisteredDisksFromStorageDomain(storageDomainId: String, follow: String = ""): Result<List<Disk>> = runCatching {
	checkStorageDomainExists(storageDomainId)
	val _follow = "storagedomain" +
		if (follow.isNotEmpty()) ",$follow"
		else ""
	this.srvDisksFromStorageDomain(storageDomainId).list().apply {
		follow(_follow)
		.unregistered(true)
	}
	.send().disks()
}.onSuccess {
	Term.STORAGE_DOMAIN.logSuccessWithin(Term.DISK, "가져오기 목록조회", storageDomainId)
}.onFailure {
	Term.STORAGE_DOMAIN.logFailWithin(Term.DISK, "가져오기 목록조회", it, storageDomainId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.STORAGE_DOMAIN, Term.DISK, "가져오기 목록조회", storageDomainId) else it
}

/*
fun Connection.findUnregisteredDiskFromStorageDomain(storageDomainId: String, diskId: String): Result<Disk> = runCatching {
	checkStorageDomainExists(storageDomainId)

	this.srvDisksFromStorageDomain(storageDomainId)
		.diskService(diskId)
		.get()
		.unregistered(true)
		.send()
		.disk()

}.onSuccess {
	Term.STORAGE_DOMAIN.logSuccessWithin(Term.DISK, "가져오기 목록조회", storageDomainId)
}.onFailure {
	Term.STORAGE_DOMAIN.logFailWithin(Term.DISK, "가져오기 목록조회", it, storageDomainId)
	throw if (it is Error) it.toItCloudException() else it
}
*/

fun Connection.registeredDiskFromStorageDomain(storageDomainId: String, disk: Disk): Result<Disk?> = runCatching {
	val diskRegister = this.srvDisksFromStorageDomain(storageDomainId).add()
		.disk(disk)
		.unregistered(true)
		.send()
		.disk()
	diskRegister
}.onSuccess {
	Term.STORAGE_DOMAIN.logSuccessWithin(Term.DISK, "불러오기", storageDomainId)
}.onFailure {
	Term.STORAGE_DOMAIN.logFailWithin(Term.DISK, "불러오기", it, storageDomainId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.STORAGE_DOMAIN, Term.DISK, "불러오기", storageDomainId) else it
}

fun Connection.removeRegisteredDiskFromStorageDomain(storageDomainId: String, diskId: String): Result<Boolean> = runCatching {
	this.srvDisksFromStorageDomain(storageDomainId).diskService(diskId).remove().send()

	// this.srvStorageDomains().storageDomainService(storageDomainId).disksService().list().unregistered(true).send() //이거같음
	true

}.onSuccess {
	Term.STORAGE_DOMAIN.logSuccessWithin(Term.DISK, "불러오기 삭제", storageDomainId)
}.onFailure {
	Term.STORAGE_DOMAIN.logFailWithin(Term.DISK, "불러오기 삭제", it, storageDomainId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.STORAGE_DOMAIN, Term.DISK, "불러오기 삭제", storageDomainId, diskId) else it
}


private fun Connection.srvAllDiskSnapshotsFromStorageDomain(storageId: String): DiskSnapshotsService =
	this.srvStorageDomain(storageId).diskSnapshotsService()

fun Connection.findAllDiskSnapshotsFromStorageDomain(storageDomainId: String): Result<List<DiskSnapshot>> = runCatching {
	this.srvAllDiskSnapshotsFromStorageDomain(storageDomainId).list().send().snapshots()

}.onSuccess {
	Term.STORAGE_DOMAIN.logSuccessWithin(Term.DISK_SNAPSHOT, "목록조회", storageDomainId)
}.onFailure {
	Term.STORAGE_DOMAIN.logFailWithin(Term.DISK_SNAPSHOT, "목록조회", it, storageDomainId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.STORAGE_DOMAIN, Term.DISK_SNAPSHOT, "목록조회", storageDomainId) else it
}

private fun Connection.srvTemplatesFromStorageDomain(storageId: String): StorageDomainTemplatesService =
	this.srvStorageDomain(storageId).templatesService()

fun Connection.findAllTemplatesFromStorageDomain(storageDomainId: String): Result<List<Template>> = runCatching {
	this.srvTemplatesFromStorageDomain(storageDomainId).list().send().templates()

}.onSuccess {
	Term.STORAGE_DOMAIN.logSuccessWithin(Term.TEMPLATE, "목록조회", storageDomainId)
}.onFailure {
	Term.STORAGE_DOMAIN.logFailWithin(Term.TEMPLATE, "목록조회", it, storageDomainId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.TEMPLATE, Term.DISK_SNAPSHOT, "목록조회", storageDomainId) else it
}

fun Connection.findAllUnregisteredTemplatesFromStorageDomain(storageDomainId: String): Result<List<Template>> = runCatching {
	this.srvTemplatesFromStorageDomain(storageDomainId).list().unregistered(true).send().templates()

}.onSuccess {
	Term.STORAGE_DOMAIN.logSuccessWithin(Term.TEMPLATE, "가져오기 목록조회", storageDomainId)
}.onFailure {
	Term.STORAGE_DOMAIN.logFailWithin(Term.TEMPLATE, "가져오기 목록조회", it, storageDomainId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.TEMPLATE, Term.DISK_SNAPSHOT, " 가져오기 목록조회", storageDomainId) else it
}

fun Connection.registeredTemplateFromStorageDomain(storageDomainId: String, template: Template): Result<Boolean> = runCatching {
	checkStorageDomainExists(storageDomainId)

	this.srvTemplatesFromStorageDomain(storageDomainId)
		.templateService(template.id())
		.register()
		.template(template)
		.cluster(template.cluster()).send()

	true
}.onSuccess {
	Term.STORAGE_DOMAIN.logSuccessWithin(Term.TEMPLATE, "가져오기", storageDomainId)
}.onFailure {
	Term.STORAGE_DOMAIN.logFailWithin(Term.TEMPLATE, "가져오기", it, storageDomainId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.TEMPLATE, Term.TEMPLATE, "가져오기", storageDomainId) else it
}

fun Connection.removeRegisteredTemplateFromStorageDomain(storageDomainId: String, templateId: String): Result<Boolean> = runCatching {
	checkStorageDomainExists(storageDomainId)

	// this.srvTemplatesFromStorageDomain(storageDomainId).templateService(templateId).remove().send()
	this.srvStorageDomains().storageDomainService(storageDomainId).templatesService().templateService(templateId).remove().send()
	true

}.onSuccess {
	Term.STORAGE_DOMAIN.logSuccessWithin(Term.VM, "가져오기 삭제", storageDomainId)
}.onFailure {
	Term.STORAGE_DOMAIN.logFailWithin(Term.VM, "가져오기 삭제", it, storageDomainId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.TEMPLATE, Term.TEMPLATE, "가져오기 삭제", storageDomainId, templateId) else it
}

fun Connection.findAllDiskProfilesFromStorageDomain(storageDomainId: String): Result<List<DiskProfile>> = runCatching {
	checkStorageDomainExists(storageDomainId)

	this.srvStorageDomain(storageDomainId).diskProfilesService().list().send().profiles()

}.onSuccess {
	Term.STORAGE_DOMAIN.logSuccessWithin(Term.DISK_PROFILE, "목록조회", storageDomainId)
}.onFailure {
	Term.STORAGE_DOMAIN.logFailWithin(Term.DISK_PROFILE, "목록조회", it, storageDomainId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.TEMPLATE, Term.DISK_PROFILE, "목록조회", storageDomainId) else it
}

// private fun Connection.srvPermissionsFromStorageDomain(sdId: String): AssignedPermissionsService =
// 	this.srvStorageDomain(sdId).permissionsService()
//
// fun Connection.findAllPermissionsFromStorageDomain(storageDomainId: String): Result<List<Permission>> = runCatching {
// 	checkStorageDomainExists(storageDomainId)
//
// 	this.srvPermissionsFromStorageDomain(storageDomainId).list().send().permissions()
//
// }.onSuccess {
// 	Term.STORAGE_DOMAIN.logSuccessWithin(Term.PERMISSION, "목록조회", storageDomainId)
// }.onFailure {
// 	Term.STORAGE_DOMAIN.logFailWithin(Term.PERMISSION, "목록조회", it, storageDomainId)
// 	throw if (it is Error) it.toItCloudException() else it
// }

fun List<StorageDomain>.nameDuplicateStorageDomain(domainName: String, domainId: String? = null): Boolean =
	this.filter { it.id() != domainId }.any { it.name() == domainName }
