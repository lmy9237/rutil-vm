package com.itinfo.rutilvm.util.ovirt

import com.itinfo.rutilvm.api.ovirt.business.model.Term
import com.itinfo.rutilvm.api.ovirt.business.model.logSuccess
import com.itinfo.rutilvm.api.ovirt.business.model.logSuccessWithin
import com.itinfo.rutilvm.api.ovirt.business.model.logFail
import com.itinfo.rutilvm.api.ovirt.business.model.logFailWithin

import com.itinfo.rutilvm.util.ovirt.error.*


import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.builders.DiskBuilder
import org.ovirt.engine.sdk4.builders.ImageTransferBuilder
import org.ovirt.engine.sdk4.internal.containers.ImageContainer
import org.ovirt.engine.sdk4.internal.containers.ImageTransferContainer
import org.ovirt.engine.sdk4.services.*
import org.ovirt.engine.sdk4.types.*

private fun Connection.srvAllDisks(): DisksService =
	systemService.disksService()

fun Connection.findAllDisks(searchQuery: String = ""): Result<List<Disk>> = runCatching {
	this.srvAllDisks().list().apply {
		if (searchQuery.isNotEmpty()) search(searchQuery).caseSensitive(false)
	}.send().disks()
}.onSuccess {
	Term.DISK.logSuccess("목록조회")
}.onFailure {
	Term.DISK.logFail("목록조회")
	throw if (it is Error) it.toItCloudException(Term.DISK, "목록조회") else it
}

fun Connection.srvDisk(diskId: String): DiskService =
	srvAllDisks().diskService(diskId)

fun Connection.findDisk(diskId: String, follow: String = ""): Result<Disk?> = runCatching {
	this.srvDisk(diskId).get().allContent(true).apply {
		if (follow.isNotEmpty()) follow(follow)
	}.send().disk()
}.onSuccess {
	Term.DISK.logSuccess("상세조회")
}.onFailure {
	Term.DISK.logFail("상세조회", target = diskId)
	throw if (it is Error) it.toItCloudException(Term.DISK, "상세조회", diskId) else it
}

fun Connection.findAllStorageDomainsFromDisk(diskId: String): Result<List<StorageDomain>> = runCatching {
	val disk = checkDisk(diskId)

	val storageDomains: List<StorageDomain> = disk.storageDomains().mapNotNull {
		this.findStorageDomain(it.id()).getOrNull()
	}

	storageDomains
}.onSuccess {
	Term.DISK.logSuccessWithin(Term.STORAGE_DOMAIN, "목록조회")
}.onFailure {
	Term.DISK.logFailWithin(Term.STORAGE_DOMAIN,"목록조회")
	throw if (it is Error) it.toItCloudException(Term.DISK, "목록조회", diskId) else it
}

fun List<Disk>.nameDuplicateDisk(diskName: String, diskId: String? = null): Boolean =
	this.filter { it.id() != diskId }.any { it.name() == diskName }

fun Connection.addDisk(disk: Disk): Result<Disk?> = runCatching {
	// if (this.findAllDisks().getOrDefault(emptyList())
	// 		.nameDuplicateDisk(disk.name())) {
	// 	throw ErrorPattern.CLUSTER_DUPLICATE.toError()
	// }
	val diskAdded: Disk? = if (disk.storageType() == DiskStorageType.LUN)
		this.srvAllDisks().addLun().disk(disk).send().disk() // FCP 유형에 대한 디스크 처리
	else
		this.srvAllDisks().add().disk(disk).send().disk()

	diskAdded ?: throw ErrorPattern.DISK_NOT_FOUND.toError()
}.onSuccess {
	Term.DISK.logSuccess("생성")
}.onFailure {
	Term.DISK.logFail("생성")
	throw if (it is Error) it.toItCloudException(Term.DISK, "생성") else it
}

fun Connection.updateDisk(disk: Disk): Result<Disk?> = runCatching {
	// if (this.findAllDisks().getOrDefault(emptyList())
	// 		.nameDuplicateDisk(disk.name())) {
	// 	throw ErrorPattern.CLUSTER_DUPLICATE.toError()
	// }

	val diskUpdated: Disk? =
		this.srvDisk(disk.id()).update().disk(disk).send().disk()

	diskUpdated ?: throw ErrorPattern.DISK_NOT_FOUND.toError()
}.onSuccess {
	Term.DISK.logSuccess("편집")
}.onFailure {
	Term.DISK.logFail("편집")
	throw if (it is Error) it.toItCloudException(Term.DISK, "편집", disk.id()) else it
}

fun Connection.removeDisk(diskId: String): Result<Boolean> = runCatching {
	checkDiskExists(diskId)
	this.srvDisk(diskId).remove().send()
	// this.expectDiskDeleted(diskId)
	true
}.onSuccess {
	Term.DISK.logSuccess("삭제")
}.onFailure {
	Term.DISK.logFail("삭제")
	throw if (it is Error) it.toItCloudException(Term.DISK, "편집", diskId) else it
}

fun Connection.expectDiskDeleted(diskId: String, interval: Long = 1000L, timeout: Long = 60000L): Boolean {
	val startTime = System.currentTimeMillis()
	while (true) {
		val disks: List<Disk> =
			this.findAllDisks().getOrDefault(listOf())
		val diskToRemove: Disk? = disks.firstOrNull() {it.id() == diskId}
		if (diskToRemove == null) { // !(매치되는것이 있다)
			Term.DISK.logSuccess("삭제")
			return true
		} else if (System.currentTimeMillis() - startTime > timeout) {
			log.error("{} {} 삭제 실패 ... 시간 초과", Term.DISK.description, diskToRemove)
			return false
		}
		log.debug("{} 삭제 진행중 ... ", Term.DISK.description)
		Thread.sleep(interval)
	}
}


fun Connection.moveDisk(diskId: String, domainId: String): Result<Boolean> = runCatching {
	checkDiskExists(diskId)
	val storageDomain = checkStorageDomain(domainId)

	this.srvDisk(diskId).move().storageDomain(storageDomain).send()

	// if (!expectDiskStatus(diskId)) {
	// 	log.error("디스크 이동 실패 ... 시간 초과")
	// 	return Result.failure(Error("디스크 이동 실패 ... 시간 초과"))
	// }
	true
}.onSuccess {
	Term.DISK.logSuccess("이동")
}.onFailure {
	Term.DISK.logFail("이동")
	throw if (it is Error) it.toItCloudException(Term.DISK, "이동", diskId) else it
}

// 근데 복사시 복사대상이 되는 디스크도 같이 Lock 걸리고 같이 잠김
fun Connection.copyDisk(diskId: String, diskAlias: String, domainId: String): Result<Boolean> = runCatching {
	val disk = checkDisk(diskId)
	val storageDomain = checkStorageDomain(domainId)

	this.srvDisk(diskId).copy().disk(DiskBuilder().id(diskId).alias(diskAlias)).storageDomain(storageDomain).send()
	/*
	if (!expectDiskStatus(disk.id())) {
		log.error("디스크 복사 실패 ... 시간 초과")
		return Result.failure(Error("시간 초과"))
	}
	*/
	true
}.onSuccess {
	Term.DISK.logSuccess("복사")
}.onFailure {
	Term.DISK.logFail("복사")
	throw if (it is Error) it.toItCloudException(Term.DISK, "복사", diskId) else it
}

fun Connection.refreshLunDisk(diskId: String, hostId: String): Result<Boolean> = runCatching {
	checkDiskExists(diskId)
	val host = checkHost(hostId)
	this.srvDisk(diskId).refreshLun().host(host).send()
	true

}.onSuccess {
	Term.DISK.logSuccessWithin(Term.HOST, "Lun 새로고침")
}.onFailure {
	Term.DISK.logFailWithin(Term.HOST, "Lun 새로고침")
	throw if (it is Error) it.toItCloudExceptionWithin(Term.DISK, Term.HOST,"복사", diskId, hostId) else it
}

fun Connection.findImageTransferId4DiskImageDownload(
	diskId: String
): Result<String> = runCatching {
	// 디스크 ok 상태여야 이미지 업로드 가능
	this.expectDiskStatus(diskId)
	val imageTransfer = preparedImageTransfer(diskId, ImageTransferDirection.DOWNLOAD)
	checkImageTransferReady(imageTransfer)
	log.info("findImageTransferId4DiskImageDownload ... imageTransfer.id(): {}", imageTransfer.id())
	imageTransfer.id()
}.onSuccess {
	Term.DISK.logSuccess("파일 다운로드 준비")
}.onFailure {
	Term.DISK.logFail("파일 다운로드 준비")
	throw if (it is Error) it.toItCloudException(Term.DISK, "파일 다운로드 준비", diskId) else it
}

// 디스크 이미지 업로드하기 위해 하는 세팅
fun Connection.findImageTransferId4DiskImageUpload(
	disk: Disk
): Result<String> = runCatching {
	// 디스크 생성
	val diskUpload: Disk =
		this.addDisk(disk).getOrNull() ?: throw ErrorPattern.DISK_NOT_FOUND.toError()

	// 디스크 ok 상태여야 이미지 업로드 가능
	this.expectDiskStatus(diskUpload.id())
	val imageTransfer = preparedImageTransfer(diskUpload.id(), ImageTransferDirection.UPLOAD)
	checkImageTransferReady(imageTransfer)
	log.info("imageTransfer.id {}", imageTransfer.id())
	imageTransfer.id()
}.onSuccess {
	Term.DISK.logSuccess("파일 업로드 준비")
}.onFailure {
	Term.DISK.logFail("파일 업로드 준비")
	throw if (it is Error) it.toItCloudException(Term.DISK, "파일 업로드 준비") else it
}

private fun Connection.preparedImageTransfer(
	diskId: String,
	direction: ImageTransferDirection = ImageTransferDirection.DOWNLOAD,
): ImageTransfer {
	val imageTransfer =
		when(direction) {
			ImageTransferDirection.DOWNLOAD -> {
				val disk: Disk = this@preparedImageTransfer.findDisk(diskId)
					.getOrNull() ?: throw ErrorPattern.DISK_NOT_FOUND.toError()
				disk.toImageTransfer()
			}
			else -> ImageTransferContainer().apply {
				direction(direction)
				image(ImageContainer().apply { id(diskId) })
			}
	}
	return addImageTransfer(imageTransfer)
		.getOrNull() ?: throw ErrorPattern.IMAGE_TRANSFER_NOT_FOUND.toError()
}

private fun checkImageTransferReady(imageTransfer: ImageTransfer) {
	val startTime = System.currentTimeMillis()
	val timeout = 60_000L

	while (imageTransfer.phasePresent() && imageTransfer.phase() == ImageTransferPhase.INITIALIZING) {
		log.info("이미지 업로드 상태확인 ... {}", imageTransfer.phase())
		if (System.currentTimeMillis() - startTime > timeout) {
			throw ErrorPattern.IMAGE_TRANSFER_NOT_FOUND.toError()
		}
		Thread.sleep(1000)
	}

	if (imageTransfer.transferUrl().isNullOrEmpty()) {
		throw ErrorPattern.TRANSFER_URL_EMPTY.toError()
	}
}

private fun Connection.srvAllImageTransfer(): ImageTransfersService =
	systemService.imageTransfersService()

private fun Connection.addImageTransfer(
	imageTransferContainer: ImageTransfer
): Result<ImageTransfer?> = runCatching {
	this.srvAllImageTransfer().add().apply {
		imageTransfer(imageTransferContainer)
	}
	.send().imageTransfer()
}.onSuccess {
	Term.IMAGE_TRANSFER.logSuccess("작업추가")
}.onFailure {
	Term.IMAGE_TRANSFER.logFail("작업추가")
	throw if (it is Error) it.toItCloudException(Term.IMAGE_TRANSFER, "작업추가") else it
}

fun Connection.cancelImageTransfer(
	imageTransferId: String
): Result<Boolean?> = runCatching {
	this.srvAllImageTransfer().imageTransferService(imageTransferId).cancel().send()
	true
}.onSuccess {
	Term.IMAGE_TRANSFER.logSuccess("작업취소")
}.onFailure {
	Term.IMAGE_TRANSFER.logFail("작업취소")
	throw if (it is Error) it.toItCloudException(Term.IMAGE_TRANSFER, "작업취소", imageTransferId) else it
}


fun Connection.srvImageTransfer(imagetransferId: String): ImageTransferService =
	this.srvAllImageTransfer().imageTransferService(imagetransferId)

private fun Connection.findAllImageTransfers(): Result<List<ImageTransfer>> = runCatching {
	this.srvAllImageTransfer().list().send().imageTransfer()
}.onSuccess {
	Term.IMAGE_TRANSFER.logSuccess("목록조회")
}.onFailure {
	Term.IMAGE_TRANSFER.logFail("목록조회")
	throw if (it is Error) it.toItCloudException(Term.IMAGE_TRANSFER, "목록조회") else it
}

fun Connection.findImageTransfer(imagetransferId: String): Result<ImageTransfer?> = runCatching {
	this.srvImageTransfer(imagetransferId).get().send().imageTransfer()
}.onSuccess {
	Term.IMAGE_TRANSFER.logSuccess("상세조회")
}.onFailure {
	Term.IMAGE_TRANSFER.logFail("상세조회")
	throw if (it is Error) it.toItCloudException(Term.IMAGE_TRANSFER, "상세조회", imagetransferId) else it
}

/**
 * [Connection.expectDiskStatus]
 * 가상머신 생성 - 디스크 생성 상태확인
 *
 * @param diskId
 * @param expectStatus
 * @param interval
 * @param timeout
 * @return
 * @throws InterruptedException
 */
@Throws(InterruptedException::class)
fun Connection.expectDiskStatus(diskId: String, expectStatus: DiskStatus = DiskStatus.OK, timeout: Long = 150000L, interval: Long = 1000L): Boolean {
	val startTime = System.currentTimeMillis()
	while (true) {
		val disk: Disk? = this@expectDiskStatus.findDisk(diskId).getOrNull()
		val status = disk?.status()
		if (status == expectStatus)
			return true
		else if (System.currentTimeMillis() - startTime > timeout)
			return false

		log.info("디스크 상태: {}", status)
		Thread.sleep(interval)
	}
}

private fun Connection.srvPermissionsFromDisk(diskId: String): AssignedPermissionsService =
	this.srvDisk(diskId).permissionsService()

fun Connection.findAllPermissionsFromDisk(diskId: String): Result<List<Permission>> = runCatching {
	checkDiskExists(diskId)

	this.srvPermissionsFromDisk(diskId).list().send().permissions()

}.onSuccess {
	Term.DISK.logSuccessWithin(Term.PERMISSION, "목록조회", diskId)
}.onFailure {
	Term.DISK.logFailWithin(Term.PERMISSION, "목록조회", it, diskId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.DISK, Term.PERMISSION,"목록조회", diskId) else it
}


fun Connection.findAllVmsFromDisk(diskId: String): Result<List<Vm>> = runCatching {
	this.findAllVms(follow = "diskattachments").getOrDefault(listOf())
		.filter { vm -> vm.diskAttachments().any { it.disk().id() == diskId } }

}.onSuccess {
	Term.DISK.logSuccessWithin(Term.VM, "목록조회", diskId)
}.onFailure {
	Term.DISK.logFailWithin(Term.VM, "목록조회", it, diskId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.DISK, Term.VM, "목록조회", diskId) else it
}


fun Disk.toImageTransfer(
	direction: ImageTransferDirection = ImageTransferDirection.DOWNLOAD,
): ImageTransfer = ImageTransferBuilder()
	.disk(this@toImageTransfer)
	.direction(direction)
	.format(this@toImageTransfer.format())
	.build()
