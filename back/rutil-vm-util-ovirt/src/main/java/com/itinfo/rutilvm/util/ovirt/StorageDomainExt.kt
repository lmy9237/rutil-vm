package com.itinfo.rutilvm.util.ovirt

import com.itinfo.rutilvm.util.ovirt.error.*

import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.builders.HostBuilder
import org.ovirt.engine.sdk4.builders.StorageDomainBuilder
import org.ovirt.engine.sdk4.services.*
import org.ovirt.engine.sdk4.types.*

private fun Connection.srvStorageDomains(): StorageDomainsService =
	this.systemService.storageDomainsService()

//private fun Connection.srvAttachStorageDomains(): AttachedStorageDomainsService =
//	this.systemService.storageDomainsService()


fun Connection.findAllStorageDomains(searchQuery: String = ""): Result<List<StorageDomain>> = runCatching {
	if (searchQuery.isNotEmpty())
		srvStorageDomains().list().search(searchQuery).send().storageDomains().filter { it.storage().type() != StorageType.GLANCE }
	else
		srvStorageDomains().list().send().storageDomains().filter { it.storage().type() != StorageType.GLANCE }
}.onSuccess {
	Term.STORAGE_DOMAIN.logSuccess("목록조회")
}.onFailure {
	Term.STORAGE_DOMAIN.logFail("목록조회", it)
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvStorageDomain(storageDomainId: String): StorageDomainService =
	this.srvStorageDomains().storageDomainService(storageDomainId)

fun Connection.findStorageDomain(storageDomainId: String): Result<StorageDomain> = runCatching {
	this.srvStorageDomain(storageDomainId).get().send().storageDomain()
}.onSuccess {
	Term.STORAGE_DOMAIN.logSuccess("상세조회")
}.onFailure {
	Term.STORAGE_DOMAIN.logFail("상세조회", it)
	throw if (it is Error) it.toItCloudException() else it
}


fun Connection.attachStorageDomainsToDataCenter(storageDomainId: String, dataCenterId: String): Result<Boolean> = runCatching {
	this.srvDataCenter(dataCenterId).storageDomainsService()
		.add()
		.storageDomain(StorageDomainBuilder().id(storageDomainId).build())
		.send().storageDomain() ?: throw ErrorPattern.DATACENTER_NOT_FOUND.toError()
	true
}.onSuccess {
	Term.DATACENTER.logSuccessWithin(Term.STORAGE_DOMAIN,"연결", storageDomainId)
}.onFailure {
	Term.DATACENTER.logSuccessWithin(Term.STORAGE_DOMAIN,"연결", storageDomainId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.detachStorageDomainsToDataCenter(storageDomainId: String, dataCenterId: String): Result<Boolean> = runCatching {
	this.srvAttachedStorageDomainFromDataCenter(dataCenterId, storageDomainId).remove().send()
	true
}.onSuccess {
	Term.DATACENTER.logSuccessWithin(Term.STORAGE_DOMAIN,"분리", storageDomainId)
}.onFailure {
	Term.DATACENTER.logSuccessWithin(Term.STORAGE_DOMAIN,"분리", storageDomainId)
	throw if (it is Error) it.toItCloudException() else it
}


fun Connection.addStorageDomain(storageDomain: StorageDomain, dataCenterId: String): Result<StorageDomain?> = runCatching {
	val storageAdded: StorageDomain? =
		this.srvStorageDomains().add().storageDomain(storageDomain).send().storageDomain()

	// 스토리지 도메인이 생성되지 않았을 경우 예외 처리
	storageAdded ?: throw ErrorPattern.STORAGE_DOMAIN_NOT_FOUND.toError()

	// 스토리지 도메인을 데이터센터에 붙이는 작업
	this.attachStorageDomainsToDataCenter(storageAdded.id(), dataCenterId)
		.onFailure { throw it }

	storageAdded
}.onSuccess {
	Term.STORAGE_DOMAIN.logSuccess("생성")
}.onFailure {
	Term.STORAGE_DOMAIN.logFail("생성", it)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.importFcpStorageDomain(storageDomain: StorageDomain): Result<StorageDomain?> = runCatching {
	val storageImported: StorageDomain? =
		this.srvStorageDomains().addBlockDomain().storageDomain(storageDomain).send().storageDomain()

	// 스토리지 도메인이 생성되지 않았을 경우 예외 처리
	storageImported ?: throw ErrorPattern.STORAGE_DOMAIN_NOT_FOUND.toError()

	// 스토리지 도메인을 데이터센터에 붙이는 작업
//	this.attachStorageDomainsToDataCenter(storageAdded.id(), dataCenterId)
//		.onFailure { throw it }

	storageImported
}.onSuccess {
	Term.STORAGE_DOMAIN.logSuccess("가져오기")
}.onFailure {
	Term.STORAGE_DOMAIN.logFail("가져오기", it)
	throw if (it is Error) it.toItCloudException() else it
}


// 도메인 관리(편집)
fun Connection.updateStorageDomain(storageDomainId: String, storageDomain: StorageDomain): Result<StorageDomain?> = runCatching {
	val storageDomainUpdated: StorageDomain? =
		this.srvStorageDomain(storageDomainId).update().storageDomain(storageDomain).send().storageDomain()

	storageDomainUpdated ?: throw ErrorPattern.STORAGE_DOMAIN_NOT_FOUND.toError()
}.onSuccess {
	Term.STORAGE_DOMAIN.logSuccess("편집", storageDomainId)
}.onFailure {
	Term.STORAGE_DOMAIN.logFail("편집", it, storageDomainId)
	throw if (it is Error) it.toItCloudException() else it
}


fun Connection.removeStorageDomain(storageDomainId: String, format: Boolean, hostName: String?): Result<Boolean> = runCatching {
	if(this.findStorageDomain(storageDomainId).isFailure) {
		throw ErrorPattern.STORAGE_DOMAIN_NOT_FOUND.toError()
	}
	log.info("hostName: $hostName")
	if (format) {
		if (hostName == null) {
			throw ErrorPattern.STORAGE_DOMAIN_DELETE_INVALID.toError()
		}
		this.srvStorageDomain(storageDomainId).remove().destroy(false).format(true).host(hostName).send()
	} else {
		this.srvStorageDomain(storageDomainId).remove().destroy(false).format(false).host(hostName).send()
	}
	this.expectStorageDomainDeleted(storageDomainId)
}.onSuccess {
	Term.STORAGE_DOMAIN.logSuccess("삭제", storageDomainId)
}.onFailure {
	Term.STORAGE_DOMAIN.logFail("삭제", it, storageDomainId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.destroyStorageDomain(storageDomainId: String): Result<Boolean> = runCatching {
	if(this.findStorageDomain(storageDomainId).isFailure) {
		throw ErrorPattern.STORAGE_DOMAIN_NOT_FOUND.toError()
	}

	this.srvStorageDomain(storageDomainId).remove().destroy(true).send()
	this.expectStorageDomainDeleted(storageDomainId)
}.onSuccess {
	Term.STORAGE_DOMAIN.logSuccess("파괴", storageDomainId)
}.onFailure {
	Term.STORAGE_DOMAIN.logFail("파괴", it, storageDomainId)
	throw if (it is Error) it.toItCloudException() else it
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
			log.error("{} {} 삭제 시간 초과", Term.STORAGE_DOMAIN.desc, storageDomainToRemove.name())
			return false
		}
		log.debug("{} 삭제 진행중 ... ", Term.STORAGE_DOMAIN.desc)
		Thread.sleep(interval)
	}
}


private fun Connection.srvAllFilesFromStorageDomain(sdId: String): FilesService =
	this.srvStorageDomain(sdId).filesService()

fun Connection.findAllFilesFromStorageDomain(storageDomainId: String): Result<List<File>> = runCatching {
	this.srvAllFilesFromStorageDomain(storageDomainId).list().send().file()
}.onSuccess {
	Term.STORAGE_DOMAIN.logSuccessWithin(Term.FILE, "목록조회", storageDomainId)
}.onFailure {
	Term.STORAGE_DOMAIN.logFailWithin(Term.FILE, "목록조회", it, storageDomainId)
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvFileFromStorageDomain(storageId: String, fileId: String): FileService =
	this.srvAllFilesFromStorageDomain(storageId).fileService(fileId)

fun Connection.findFileFromStorageDomain(storageDomainId: String, fileId: String): Result<File?> = runCatching {
	this.srvFileFromStorageDomain(storageDomainId, fileId).get().send().file()
}.onSuccess {
	Term.STORAGE_DOMAIN.logSuccessWithin(Term.FILE, "상세조회", storageDomainId)
}.onFailure {
	Term.STORAGE_DOMAIN.logFailWithin(Term.FILE, "상세조회", it, storageDomainId)
	throw if (it is Error) it.toItCloudException() else it
}


private fun Connection.srvVmsFromStorageDomain(storageId: String): StorageDomainVmsService =
	this.srvStorageDomain(storageId).vmsService()

fun Connection.findAllVmsFromStorageDomain(storageDomainId: String): Result<List<Vm>> = runCatching {
	if(this.findStorageDomain(storageDomainId).isFailure) {
		throw ErrorPattern.STORAGE_DOMAIN_NOT_FOUND.toError()
	}
	this.srvVmsFromStorageDomain(storageDomainId).list().send().vm()
}.onSuccess {
	Term.STORAGE_DOMAIN.logSuccessWithin(Term.DISK, "목록조회", storageDomainId)
}.onFailure {
	Term.STORAGE_DOMAIN.logFailWithin(Term.DISK, "목록조회", it, storageDomainId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.findAllUnregisteredVmsFromStorageDomain(storageDomainId: String): Result<List<Vm>> = runCatching {
	if(this.findStorageDomain(storageDomainId).isFailure) {
		throw ErrorPattern.STORAGE_DOMAIN_NOT_FOUND.toError()
	}
	this.srvVmsFromStorageDomain(storageDomainId).list().unregistered(true).send().vm()
}.onSuccess {
	Term.STORAGE_DOMAIN.logSuccessWithin(Term.DISK, "목록조회", storageDomainId)
}.onFailure {
	Term.STORAGE_DOMAIN.logFailWithin(Term.DISK, "목록조회", it, storageDomainId)
	throw if (it is Error) it.toItCloudException() else it
}


private fun Connection.srvDisksFromStorageDomain(storageId: String): StorageDomainDisksService =
	this.srvStorageDomain(storageId).disksService()

fun Connection.findAllDisksFromStorageDomain(storageDomainId: String): Result<List<Disk>> = runCatching {
	if(this.findStorageDomain(storageDomainId).isFailure) {
		throw ErrorPattern.STORAGE_DOMAIN_NOT_FOUND.toError()
	}
	this.srvDisksFromStorageDomain(storageDomainId).list().send().disks() ?: listOf()
}.onSuccess {
	Term.STORAGE_DOMAIN.logSuccessWithin(Term.DISK, "목록조회", storageDomainId)
}.onFailure {
	Term.STORAGE_DOMAIN.logFailWithin(Term.DISK, "목록조회", it, storageDomainId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.findAllUnregisteredDisksFromStorageDomain(storageDomainId: String): Result<List<Disk>> = runCatching {
	if(this.findStorageDomain(storageDomainId).isFailure) {
		throw ErrorPattern.STORAGE_DOMAIN_NOT_FOUND.toError()
	}
	this.srvDisksFromStorageDomain(storageDomainId).list().unregistered(true).send().disks() ?: listOf()
}.onSuccess {
	Term.STORAGE_DOMAIN.logSuccessWithin(Term.DISK, "목록조회", storageDomainId)
}.onFailure {
	Term.STORAGE_DOMAIN.logFailWithin(Term.DISK, "목록조회", it, storageDomainId)
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvAllDiskSnapshotsFromStorageDomain(storageId: String): DiskSnapshotsService =
	this.srvStorageDomain(storageId).diskSnapshotsService()

fun Connection.findAllDiskSnapshotsFromStorageDomain(storageDomainId: String): Result<List<DiskSnapshot>> = runCatching {
	this.srvAllDiskSnapshotsFromStorageDomain(storageDomainId).list().send().snapshots()
}.onSuccess {
	Term.STORAGE_DOMAIN.logSuccessWithin(Term.DISK_SNAPSHOT, "목록조회", storageDomainId)
}.onFailure {
	Term.STORAGE_DOMAIN.logFailWithin(Term.DISK_SNAPSHOT, "목록조회", it, storageDomainId)
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvTemplatesFromStorageDomain(storageId: String): StorageDomainTemplatesService =
	this.srvStorageDomain(storageId).templatesService()

fun Connection.findAllTemplatesFromStorageDomain(storageDomainId: String): Result<List<Template>> = runCatching {
	this.srvTemplatesFromStorageDomain(storageDomainId).list().send().templates()
}.onSuccess {
	Term.STORAGE_DOMAIN.logSuccessWithin(Term.TEMPLATE, "목록조회", storageDomainId)
}.onFailure {
	Term.STORAGE_DOMAIN.logFailWithin(Term.TEMPLATE, "목록조회", it, storageDomainId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.findAllUnregisteredTemplatesFromStorageDomain(storageDomainId: String): Result<List<Template>> = runCatching {
	this.srvTemplatesFromStorageDomain(storageDomainId).list().unregistered(true).send().templates()
}.onSuccess {
	Term.STORAGE_DOMAIN.logSuccessWithin(Term.TEMPLATE, "목록조회", storageDomainId)
}.onFailure {
	Term.STORAGE_DOMAIN.logFailWithin(Term.TEMPLATE, "목록조회", it, storageDomainId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.findAllDiskProfilesFromStorageDomain(storageDomainId: String): Result<List<DiskProfile>> = runCatching {
	if(this.findStorageDomain(storageDomainId).isFailure){
		throw ErrorPattern.STORAGE_DOMAIN_NOT_FOUND.toError()
	}
	this.srvStorageDomain(storageDomainId).diskProfilesService().list().send().profiles() ?: listOf()
}.onSuccess {
	Term.STORAGE_DOMAIN.logSuccessWithin(Term.DISK_PROFILE, "목록조회", storageDomainId)
}.onFailure {
	Term.STORAGE_DOMAIN.logFailWithin(Term.DISK_PROFILE, "목록조회", it, storageDomainId)
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvPermissionsFromStorageDomain(sdId: String): AssignedPermissionsService =
	this.srvStorageDomain(sdId).permissionsService()

fun Connection.findAllPermissionsFromStorageDomain(storageDomainId: String): Result<List<Permission>> = runCatching {
	if(this.findStorageDomain(storageDomainId).isFailure) {
		throw ErrorPattern.STORAGE_DOMAIN_NOT_FOUND.toError()
	}
	this.srvPermissionsFromStorageDomain(storageDomainId).list().send().permissions() ?: listOf()
}.onSuccess {
	Term.STORAGE_DOMAIN.logSuccessWithin(Term.PERMISSION, "목록조회", storageDomainId)
}.onFailure {
	Term.STORAGE_DOMAIN.logFailWithin(Term.PERMISSION, "목록조회", it, storageDomainId)
	throw if (it is Error) it.toItCloudException() else it
}
