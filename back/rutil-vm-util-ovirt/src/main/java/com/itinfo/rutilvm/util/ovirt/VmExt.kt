package com.itinfo.rutilvm.util.ovirt

import com.itinfo.rutilvm.util.ovirt.error.*

import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.builders.*
import org.ovirt.engine.sdk4.services.*
import org.ovirt.engine.sdk4.types.*
import java.math.BigInteger

fun Connection.srvVms(): VmsService =
	this.systemService.vmsService()

fun Connection.findAllVms(searchQuery: String = "", follow: String = ""): Result<List<Vm>> = runCatching {
	this.srvVms().list().allContent(true).apply {
		if (searchQuery.isNotEmpty()) search(searchQuery)
		if (follow.isNotEmpty()) follow(follow)
	}.caseSensitive(false).send().vms()

}.onSuccess {
	Term.VM.logSuccess("목록조회")
}.onFailure {
	Term.VM.logFail("목록조회", it)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.srvVm(vmId: String): VmService =
	this.srvVms().vmService(vmId)

fun Connection.findVm(vmId: String, follow: String = ""): Result<Vm?> = runCatching {
	this.srvVm(vmId).get().apply {
		if (follow.isNotEmpty()) follow(follow)
	}.send().vm()

}.onSuccess {
	Term.VM.logSuccess("상세조회", vmId)
}.onFailure {
	Term.VM.logFail("상세조회", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}


fun Connection.startVm(vmId: String): Result<Boolean> = runCatching {
	val vm: Vm = checkVm(vmId)

	val diskAttachments = this.findAllDiskAttachmentsFromVm(vmId).getOrDefault(listOf())
	if (!diskAttachments.any { it.bootable() }) {
		log.error("가상머신 디스크중 부팅가능한 디스크가 없음")
		throw ErrorPattern.DISK_ATTACHMENT_NOT_BOOTABLE.toError()
	}
	if(vm.status() == VmStatus.UP){
		// log.error("가상머신 상태가 up인 상태")
		throw ErrorPattern.VM_STATUS_UP.toError()
	}
	this.srvVm(vmId).start().send()
	// this.expectVmStatus(vmId, VmStatus.UP)
	true

}.onSuccess {
	Term.VM.logSuccess("시작", vmId)
}.onFailure {
	Term.VM.logFail("시작", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.stopVm(vmId: String): Result<Boolean> = runCatching {
	val vm: Vm = checkVm(vmId)
	if(vm.status() == VmStatus.DOWN){
		log.error("가상머신 상태가 Down인 상태")
		throw ErrorPattern.VM_STATUS_ERROR.toError()
	}

	this.srvVm(vmId).stop().send()
	// this.expectVmStatus(vmId, VmStatus.DOWN)
	true

}.onSuccess {
	Term.VM.logSuccess("전원끄기", vmId)
}.onFailure {
	Term.VM.logFail("전원끄기", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.suspendVm(vmId: String): Result<Boolean> = runCatching {
	val vm: Vm = checkVm(vmId)
	this.srvVm(vmId).suspend().send()
	// this.expectVmStatus(vmId, VmStatus.SUSPENDED)
	true
}.onSuccess {
	Term.VM.logSuccess("일시정지", vmId)
}.onFailure {
	Term.VM.logFail("일시정지", it, vmId)
	throw if (it is Error)
		if (it.message?.contains("409|review".toRegex()) == true)
			ErrorPattern.VM_CONFLICT_WHILE_PREVIEWING_SNAPSHOT.toError()
		else
			it.toItCloudException()
	else it
}

// TODO: 종료되지 않고 다시 올라올때가 잇음, expectVmStatus대신 다른 함수 써야 할지 확인 필요
fun Connection.shutdownVm(vmId: String): Result<Boolean> = runCatching {
	val vm: Vm = checkVm(vmId)

	this.srvVm(vmId).shutdown().send()
	// this.expectVmStatus(vmId, VmStatus.DOWN)
	true

}.onSuccess {
	Term.VM.logSuccess("종료", vmId)
}.onFailure {
	Term.VM.logFail("종료", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.rebootVm(vmId: String): Result<Boolean> = runCatching {
	checkVmExists(vmId)
	this.srvVm(vmId).reboot().send()
	// this.expectVmStatus(vmId, VmStatus.UP)
	true

}.onSuccess {
	Term.VM.logSuccess("재부팅", vmId)
}.onFailure {
	Term.VM.logFail("재부팅", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.resetVm(vmId: String): Result<Boolean> = runCatching {
	checkVmExists(vmId)
	this.srvVm(vmId).reset().send()
	// this.expectVmStatus(vmId, VmStatus.UP)
	true

}.onSuccess {
	Term.VM.logSuccess("재설정", vmId)
}.onFailure {
	Term.VM.logFail("재설정", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}


fun Connection.addVm(
	vm: Vm,
	diskAttachments: List<DiskAttachment>?,
	nics: List<Nic>?,
	connId: String?,
): Result<Vm?> = runCatching {
	if (this.findAllVms().getOrDefault(listOf()).nameDuplicateVm(vm.name())) {
		throw ErrorPattern.VM_DUPLICATE.toError()
	}

	val vmAdded: Vm =
		this.srvVms().add().vm(vm).send().vm() ?: throw ErrorPattern.VM_NOT_FOUND.toError()

	diskAttachments?.takeIf { it.isNotEmpty() }?.let { addMultipleDiskAttachmentsToVm(vmAdded.id(), it) }
	nics?.takeIf { it.isNotEmpty() }?.let { addMultipleNicsToVm(vmAdded.id(), it) }
	connId?.takeIf { it.isNotEmpty() }?.let { addCdromFromVm(vmAdded.id(), it) }


	// // 디스크 연결 조건 확인 및 실행
	// if (!diskAttachments.isNullOrEmpty()) {
	// 	this.addMultipleDiskAttachmentsToVm(vmAdded.id(), diskAttachments)
	// }
	// // NIC 추가 조건 확인 및 실행
	// if (!nics.isNullOrEmpty()) {
	// 	this.addMultipleNicsToVm(vmAdded.id(), nics)
	// }
	// // ISO 설정 조건 확인 및 실행
	// if (connId != null) {
	// 	this.addCdromFromVm(vmAdded.id(), connId)
	// }

	vmAdded
}.onSuccess {
	Term.VM.logSuccess("생성", it.id())
}.onFailure {
	Term.VM.logFail("생성", it)
	throw if (it is Error) it.toItCloudException() else it
}


fun Connection.updateVm(
	vm: Vm,
	diskAttachments: List<DiskAttachment>?,
	nics: List<Nic>?,
	connId: String?
): Result<Vm?> = runCatching {
	if (this.findAllVms().getOrDefault(listOf()).nameDuplicateVm(vm.name(), vm.id())) {
		throw ErrorPattern.VM_DUPLICATE.toError()
	}

	val vmUpdated: Vm =
		this.srvVm(vm.id()).update().vm(vm).send().vm() ?: throw ErrorPattern.VM_NOT_FOUND.toError()

	diskAttachments?.takeIf { it.isNotEmpty() }?.let { addMultipleDiskAttachmentsToVm(vmUpdated.id(), it) }
	nics?.takeIf { it.isNotEmpty() }?.let { addMultipleNicsToVm(vmUpdated.id(), it) }


	// if (!diskAttachments.isNullOrEmpty()) {
	// 	this.addMultipleDiskAttachmentsToVm(vmUpdated.id(), diskAttachments)
	// }
	// if (!nics.isNullOrEmpty()) {
	// 	this.addMultipleNicsToVm(vmUpdated.id(), nics)
	// }

	val cdrom: Cdrom = this.srvVmCdromsFromVm(vmUpdated.id()).list().send().cdroms().first()

	// ISO 설정 조건 확인 및 실행

	// cdrom에 값 자체가 없다면
	if (connId != null && !cdrom.filePresent()) {
		this.addCdromFromVm(vmUpdated.id(), connId)
	}else if(connId != null && cdrom.filePresent() && cdrom.file().id() != connId ){
		this.updateCdromFromVm(vmUpdated.id(), cdrom.file().id(), connId)
	}
	// !cdrom.file().id().equals(connId)

	vmUpdated
}.onSuccess {
	Term.VM.logSuccess("편집", it.id())
}.onFailure {
	Term.VM.logFail("편집", it)
	throw if (it is Error) it.toItCloudException() else it
}

// diskDelete 디스크 삭제 여부
fun Connection.removeVm(vmId: String, diskDelete: Boolean = false): Result<Boolean> = runCatching {
	val vm: Vm = checkVm(vmId)
	if (vm.deleteProtected()) throw ErrorPattern.VM_PROTECTED.toError()
	if(vm.status() == VmStatus.UP) {
		log.debug("가상머신이 실행중인 상태")
		throw ErrorPattern.VM_STATUS_UP.toError()
	}

	this.srvVm(vmId).remove().detachOnly(!diskDelete).send()
	this.expectVmDeleted(vmId)
}.onSuccess {
	Term.VM.logSuccess("삭제", vmId)
}.onFailure {
	Term.VM.logFail("삭제", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}

@Throws(InterruptedException::class)
fun Connection.expectVmDeleted(vmId: String, timeout: Long = 60000L, interval: Long = 1000L): Boolean {
	val startTime = System.currentTimeMillis()
	while (true) {
		val vms: List<Vm> = this.findAllVms().getOrDefault(listOf())
		val vmToRemove = vms.firstOrNull() { it.id() == vmId } // vm이 어느것이라도 매치되는것이 있다면
		if (vmToRemove == null) {// !(매치되는것이 있다)
			Term.VM.logSuccess("삭제")
			return true
		} else if (System.currentTimeMillis() - startTime > timeout){
			log.error("{} {} 삭제 시간 초과", Term.VM.desc, vmToRemove.name())
			return false
		}
		log.debug("{} 삭제 진행중 ... ", Term.VM.desc)
		Thread.sleep(interval)
	}
}

fun Connection.exportVm(
	vmId: String,
	hostName: String,
	directory: String,
	fileName: String
): Result<Boolean> = runCatching {
	this@exportVm.srvVm(vmId)
		.exportToPathOnHost()
		.host(HostBuilder().name(hostName))
		.directory(directory)
		.filename("$fileName.ova")
		.send()
	true
}.onSuccess {
	Term.VM.logSuccess("내보내기", vmId)
}.onFailure {
	Term.VM.logFail("내보내기", it, vmId)
	throw if (it is Error) it.toItCloudException() else it

}

fun Connection.migrationVm(vmId: String, clusterId: String, affinityClosure: Boolean): Result<Boolean> = runCatching {
	checkVmExists(vmId)
	val cluster = checkCluster(clusterId)
	this.srvVm(vmId).migrate().cluster(cluster).migrateVmsInAffinityClosure(affinityClosure).send()

	// TODO: 상태값에 대한 주석
	// val updatedVm = checkVm(vmId)
	// updatedVm.host().id() == host.id()
	true
}.onSuccess {
	Term.VM.logSuccess("마이그레이션", vmId)
}.onFailure {
	Term.VM.logFail("마이그레이션", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.migrationVmToHost(vmId: String, hostId: String, affinityClosure: Boolean): Result<Boolean> = runCatching {
	checkVmExists(vmId)
	val host = checkHost(hostId)
	this.srvVm(vmId).migrate().host(host).migrateVmsInAffinityClosure(affinityClosure).send()

	// TODO: 상태값에 대한 주석
	// val updatedVm = checkVm(vmId)
	// updatedVm.host().id() == host.id()
	true
}.onSuccess {
	Term.VM.logSuccess("마이그레이션", vmId)
}.onFailure {
	Term.VM.logFail("마이그레이션", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}



fun Connection.cancelMigrationVm(vmId: String): Result<Boolean> = runCatching {
	checkVmExists(vmId)

	this.srvVm(vmId).cancelMigration().send()
	true
}.onSuccess {
	Term.VM.logSuccess("마이그레이션 취소", vmId)
}.onFailure {
	Term.VM.logFail("마이그레이션 취소", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvVmCdromsFromVm(vmId: String): VmCdromsService =
	this.srvVm(vmId).cdromsService()

fun Connection.findAllVmCdromsFromVm(vmId: String): Result<List<Cdrom>> = runCatching {
	checkVmExists(vmId)

	this.srvVmCdromsFromVm(vmId).list().send().cdroms()
}.onSuccess {
	Term.VM.logSuccessWithin(Term.CD_ROM, "목록조회", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.CD_ROM, "목록조회", it, vmId)
	throw if (it is Error) it.toItCloudException() else it

}

private fun Connection.srvVmCdromFromVm(vmId: String, cdromId: String): VmCdromService =
	this.srvVmCdromsFromVm(vmId).cdromService(cdromId)

fun Connection.findVmCdromFromVm(vmId: String, cdromId: String): Result<Cdrom?> = runCatching {
	checkVmExists(vmId)

	this.srvVmCdromFromVm(vmId, cdromId).get().send().cdrom()
}.onSuccess {
	Term.VM.logSuccessWithin(Term.CD_ROM, "상세조회", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.CD_ROM, "상세조회", it, vmId)
	throw if (it is Error) it.toItCloudException() else it

}

fun Connection.addCdromFromVm(vmId: String, cdromId: String): Result<Cdrom> = runCatching {
	checkVmExists(vmId)
	this.srvVmCdromsFromVm(vmId).add()
		.cdrom(CdromBuilder().file(FileBuilder().id(cdromId))).send().cdrom()

}.onSuccess {
	Term.VM.logSuccessWithin(Term.CD_ROM, "생성", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.CD_ROM, "생성", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.updateCdromFromVm(vmId: String, cdromId: String, newCdromId: String): Result<Cdrom?> = runCatching {
	val vm = checkVm(vmId)

	// current는 실행중인 가상머신에서 바로 변경할때 가능
	this.srvVmCdromFromVm(vmId, cdromId).update()
		.cdrom(CdromBuilder().file(FileBuilder().id(newCdromId))).current(vm.status() == VmStatus.UP).send().cdrom()

}.onSuccess {
	Term.VM.logSuccessWithin(Term.CD_ROM, "편집", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.CD_ROM, "편집", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvNicsFromVm(vmId: String): VmNicsService =
	this.srvVm(vmId).nicsService()

fun Connection.findAllNicsFromVm(vmId: String, follow: String = ""): Result<List<Nic>> = runCatching {
	checkVmExists(vmId)

	this.srvNicsFromVm(vmId).list().apply {
		if (follow.isNotEmpty()) follow(follow)
	}.send().nics()
}.onSuccess {
	Term.VM.logSuccessWithin(Term.NIC, "목록조회", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.NIC, "목록조회", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.srvNicFromVm(vmId: String, nicId: String): VmNicService =
	this.srvNicsFromVm(vmId).nicService(nicId)

fun Connection.findNicFromVm(vmId: String, nicId: String, follow: String = ""): Result<Nic?> = runCatching {
	checkVmExists(vmId)

	this.srvNicFromVm(vmId, nicId).get().apply {
		if (follow.isNotEmpty()) follow(follow)
	}.send().nic()
}.onSuccess {
	Term.VM.logSuccessWithin(Term.NIC, "목록조회", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.NIC, "목록조회", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.addNicFromVm(vmId: String, nic: Nic): Result<Nic?> = runCatching {
	// 기존 nic와 이름 중복 검사
	val existingNics = this.findAllNicsFromVm(vmId).getOrDefault(listOf())
	if (existingNics.nameDuplicateVmNic(nic.name())) {
		throw ErrorPattern.NIC_DUPLICATE.toError()
		// return FailureType.DUPLICATE.toResult(Term.NIC.desc)
	}

	if (nic.macPresent() && nic.mac().addressPresent() && nic.mac().address().isNotEmpty()) {
		if (existingNics.any { it.mac().address() == nic.mac().address() })
			return FailureType.DUPLICATE.toResult("mac 주소")
		// TODO
	}

	srvNicsFromVm(vmId).add().nic(nic).send().nic()
}.onSuccess {
	Term.VM.logSuccessWithin(Term.NIC, "생성", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.NIC, "생성", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.addMultipleNicsToVm(vmId: String, nics: List<Nic>): Result<Boolean> = runCatching {
	// nic 에 vnicprofile 아이디가 있는 경우만
	val validNics = nics.filter { it.vnicProfile().id().isNotEmpty() }
	if (validNics.isEmpty()) return@runCatching true

	val results = validNics.map { addNicFromVm(vmId, it) }
	val allSuccessful = results.all { it.isSuccess }

	if (!allSuccessful) {
		val failedResults = results.filter { it.isFailure }
		log.warn("일부 NIC 생성 실패: ${failedResults.size}개")
	}
	allSuccessful
}.onSuccess {
	Term.VM.logSuccessWithin(Term.NIC, "생성 여러개", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.NIC, "생성 여러개", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.updateNicFromVm(vmId: String, nic: Nic): Result<Nic?> = runCatching {
	if (this.findAllNicsFromVm(vmId).getOrDefault(listOf())
			.nameDuplicateVmNic(nic.name(), nic.id())) {
		throw ErrorPattern.NIC_DUPLICATE.toError()
	}

	srvNicFromVm(vmId, nic.id()).update().nic(nic).send().nic()
}.onSuccess {
	Term.VM.logSuccessWithin(Term.NIC, "편집", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.NIC, "편집", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.updateMultipleNicsFromVm(vmId: String, nics: List<Nic>): Result<Boolean> = runCatching {
	val validNics = nics.filter { it.vnicProfile().id().isNotEmpty() }
	if (validNics.isEmpty()) return@runCatching true

	val results = nics.map { updateNicFromVm(vmId, it) }
	val allSuccessful = results.all { it.isSuccess }

	if (!allSuccessful) {
		val failedResults = results.filter { it.isFailure }
		log.warn("일부 NIC 편집 실패: ${failedResults.size}개")
	}
	allSuccessful
}.onSuccess {
	Term.VM.logSuccessWithin(Term.NIC, "편집 여러개", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.NIC, "편집 여러개", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.removeNicFromVm(vmId: String, nicId: String): Result<Boolean> = runCatching {
	val vm = checkVm(vmId)

	val nic = this@removeNicFromVm.findNicFromVm(vmId, nicId)
		.getOrNull() ?: throw ErrorPattern.NIC_NOT_FOUND.toError()

	if (vm.status() == VmStatus.UP && nic.linked())
		throw ErrorPattern.NIC_UNLINKED_REQUIRED.apply {
			this.additional = "NIC 연결분리 필요"
		}.toError()
	srvNicFromVm(vmId, nic.id()).remove().send()
	true
}.onSuccess {
	Term.VM.logSuccessWithin(Term.NIC, "제거", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.NIC, "제거", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.removeMultipleNicsFromVm(vmId: String, nics: List<Nic>): Result<Boolean> = runCatching {
	val validNics = nics.filter { it.vnicProfile().id().isNotEmpty() }
	if (validNics.isEmpty()) return@runCatching true

	val results = nics.map { removeNicFromVm(vmId, it.id()) }
	val allSuccessful = results.all { it.isSuccess }

	if (!allSuccessful) {
		val failedResults = results.filter { it.isFailure }
		log.warn("일부 NIC 삭제 실패: ${failedResults.size}개")
	}
	allSuccessful
}.onSuccess {
	Term.VM.logSuccessWithin(Term.NIC, "편집 여러개", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.NIC, "편집 여러개", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}

fun List<Nic>.nameDuplicateVmNic(name: String, id: String? = null): Boolean =
	this.filter { it.id() != id }.any { it.name() == name }


fun Connection.srvReportedDevicesFromVm(vmId: String): VmReportedDevicesService =
	this.srvVm(vmId).reportedDevicesService()

fun Connection.findAllReportedDevicesFromVm(vmId: String): Result<List<ReportedDevice>> = runCatching {
	this.srvReportedDevicesFromVm(vmId).list().send().reportedDevice()
}.onSuccess {
	Term.VM.logSuccessWithin(Term.VM, "보고된 디바이스 목록조회", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.VM, "보고된 디바이스 목록조회", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}


fun Connection.srvReportedDevicesFromVmNics(vmId: String, nicId: String): VmReportedDevicesService =
	this.srvNicFromVm(vmId, nicId).reportedDevicesService()

fun Connection.findAllReportedDevicesFromVmNic(vmId: String, nicId: String): Result<List<ReportedDevice>> = runCatching {
	this.srvReportedDevicesFromVmNics(vmId, nicId).list().send().reportedDevice()
}.onSuccess {
	Term.VM.logSuccessWithin(Term.NIC, "보고된 디바이스 목록조회", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.NIC, "보고된 디바이스 목록조회", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.srvReportedDeviceFromVmNic(vmId: String, nicId: String, rpId: String): VmReportedDeviceService =
	this.srvReportedDevicesFromVmNics(vmId, nicId).reportedDeviceService(rpId)

fun Connection.findReportedDeviceFromVmNic(vmId: String, nicId: String, rpId: String): Result<ReportedDevice?> = runCatching {
	this.srvReportedDeviceFromVmNic(vmId, nicId, rpId).get().send().reportedDevice()
}.onSuccess {
	Term.VM.logSuccessWithin(Term.NIC, "상세조회", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.NIC, "상세조회", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}


private fun Connection.srvAllDiskAttachmentsFromVm(vmId: String): DiskAttachmentsService =
	this.srvVm(vmId).diskAttachmentsService()

fun Connection.findAllDiskAttachmentsFromVm(vmId: String, follow: String = ""): Result<List<DiskAttachment>> = runCatching {
	checkVmExists(vmId)

	this.srvAllDiskAttachmentsFromVm(vmId).list().apply {
		if(follow.isNotEmpty()) follow(follow)
	}.send().attachments()

}.onSuccess {
	Term.VM.logSuccessWithin(Term.DISK_ATTACHMENT, "목록조회", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.DISK_ATTACHMENT, "목록조회", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.srvDiskAttachmentFromVm(vmId: String, diskAttachmentId: String): DiskAttachmentService =
	this.srvVm(vmId).diskAttachmentsService().attachmentService(diskAttachmentId)

fun Connection.findDiskAttachmentFromVm(vmId: String, diskAttachmentId: String, follow: String = ""): Result<DiskAttachment?> = runCatching {
	checkVmExists(vmId)

	this.srvDiskAttachmentFromVm(vmId, diskAttachmentId).get().apply {
		if (follow.isNotEmpty()) follow(follow)
	}.send().attachment()

}.onSuccess {
	Term.VM.logSuccessWithin(Term.DISK_ATTACHMENT, "상세조회", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.DISK_ATTACHMENT, "상세조회", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.addDiskAttachmentToVm(vmId: String, diskAttachment: DiskAttachment): Result<DiskAttachment> = runCatching {
	checkVmExists(vmId)

	val diskAttachAdded: DiskAttachment? =
		this.srvAllDiskAttachmentsFromVm(vmId).add().attachment(diskAttachment).send().attachment()

	// 가상머신 생성되고 자동 활성화`
	// if (diskAttachAdded != null && diskAttachAdded.idPresent()) {
	// 	this.activeDiskAttachmentToVm(vmId, diskAttachAdded.id())
	// }
	diskAttachAdded ?: throw ErrorPattern.DISK_ATTACHMENT_NOT_FOUND.toError()
}.onSuccess {
	Term.VM.logSuccessWithin(Term.DISK_ATTACHMENT, "붙이기", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.DISK_ATTACHMENT,"붙이기", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.addMultipleDiskAttachmentsToVm(vmId: String, diskAttachments: List<DiskAttachment>): Result<Boolean> = runCatching {
	checkVmExists(vmId)

	val results = diskAttachments.map { this.addDiskAttachmentToVm(vmId, it) }
	val allSuccessful = results.all { it.isSuccess }

	if (!allSuccessful) {
		val failedResults = results.filter { it.isFailure }
		log.warn("일부 DiskAttachment 생성 실패: ${failedResults.size}개")
	}
	allSuccessful
}.onSuccess {
	Term.VM.logSuccessWithin(Term.DISK_ATTACHMENT, "여러 개 붙이기", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.DISK_ATTACHMENT, "여러 개 붙이기", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.updateDiskAttachmentToVm(vmId: String, diskAttachment: DiskAttachment): Result<DiskAttachment> = runCatching {
	checkVmExists(vmId)

	if(this.findDiskAttachmentFromVm(vmId, diskAttachment.id()).isFailure){
		throw ErrorPattern.DISK_ATTACHMENT_ID_NOT_FOUND.toError()
	}
	val diskAttachUpdated: DiskAttachment? =
		this.srvDiskAttachmentFromVm(vmId, diskAttachment.id()).update().diskAttachment(diskAttachment).send().diskAttachment()

	diskAttachUpdated ?: throw ErrorPattern.DISK_ATTACHMENT_NOT_FOUND.toError()
}.onSuccess {
	Term.VM.logSuccessWithin(Term.DISK_ATTACHMENT, "붙이기", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.DISK_ATTACHMENT,"붙이기", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.updateMultipleDiskAttachmentsToVm(vmId: String, diskAttachments: List<DiskAttachment>): Result<Boolean> = runCatching {
	checkVmExists(vmId)

	val results = diskAttachments.map { this.updateDiskAttachmentToVm(vmId, it) }
	val allSuccessful = results.all { it.isSuccess }

	if (!allSuccessful) {
		val failedResults = results.filter { it.isFailure }
		log.warn("일부 DiskAttachment 편집 실패: ${failedResults.size}개")
	}
	allSuccessful
}.onSuccess {
	Term.VM.logSuccessWithin(Term.DISK_ATTACHMENT, "여러 개 붙이기", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.DISK_ATTACHMENT, "여러 개 붙이기", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.removeDiskAttachmentToVm(
	vmId: String,
	diskAttachmentId: String,
	detachOnly: Boolean
): Result<Boolean> = runCatching {
	checkVmExists(vmId)

	val dah: DiskAttachment = this.findDiskAttachmentFromVm(vmId, diskAttachmentId)
		.getOrNull() ?: throw ErrorPattern.DISK_ATTACHMENT_ID_NOT_FOUND.toError()

	if(dah.active()){
		throw ErrorPattern.DISK_ATTACHMENT_ACTIVE_INVALID.toError()
	}
	// DiskAttachment 삭제 요청 및 결과 확인
	this.srvDiskAttachmentFromVm(vmId, diskAttachmentId).remove().detachOnly(detachOnly).send()

	true
}.onSuccess {
	Term.VM.logSuccessWithin(Term.DISK_ATTACHMENT, "삭제", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.DISK_ATTACHMENT, "삭제", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}


fun Connection.activeDiskAttachmentToVm(vmId: String, diskAttachmentId: String): Result<Boolean> = runCatching {
	checkVmExists(vmId)

	val diskStatus: DiskAttachment = this.findDiskAttachmentFromVm(vmId, diskAttachmentId)
		.getOrNull() ?: throw ErrorPattern.DISK_ATTACHMENT_ID_NOT_FOUND.toError()

	if (diskStatus.active()) {
		log.error("이미 활성화 상태: $diskAttachmentId")
		throw ErrorPattern.DISK_ATTACHMENT_ACTIVE_INVALID.toError()
	}

	val diskAttachment = DiskAttachmentBuilder().id(diskAttachmentId).active(true).build()
	this.updateDiskAttachmentToVm(vmId, diskAttachment)
		.getOrNull() ?: throw ErrorPattern.DISK_ATTACHMENT_NOT_FOUND.toError()

	// expectDiskStatus(vmId, diskAttachmentId, true)
	true
}.onSuccess {
	Term.VM.logSuccessWithin(Term.DISK_ATTACHMENT, "활성화", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.DISK_ATTACHMENT, "활성화 실패", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.deactivateDiskAttachmentToVm(vmId: String, diskAttachmentId: String): Result<Boolean> = runCatching {
	checkVmExists(vmId)
	val diskStatus: DiskAttachment = this.findDiskAttachmentFromVm(vmId, diskAttachmentId)
		.getOrNull() ?: throw ErrorPattern.DISK_ATTACHMENT_ID_NOT_FOUND.toError()

	if (!diskStatus.active()) {
		log.error("이미 비활성화 상태: $diskAttachmentId")
		throw ErrorPattern.DISK_ATTACHMENT_ACTIVE_INVALID.toError()
	}

	val diskAttachment = DiskAttachmentBuilder().id(diskAttachmentId).active(false).build()
	this.updateDiskAttachmentToVm(vmId, diskAttachment)
		.getOrNull() ?: throw ErrorPattern.DISK_ATTACHMENT_NOT_FOUND.toError()

	// expectDiskStatus(vmId, diskAttachmentId, false)
	true
}.onSuccess {
	Term.VM.logSuccessWithin(Term.DISK_ATTACHMENT, "비활성화", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.DISK_ATTACHMENT, "비활성화 실패", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}

// acitve가 true면 활성화, false면 비활성화를 요구
@Throws(InterruptedException::class)
fun Connection.expectDiskStatus(vmId: String, diskAttachmentId: String, activeStatus: Boolean, interval: Long = 1000L, timeout: Long = 90000L): Boolean {
	val startTime = System.currentTimeMillis()
	while(true){
		val diskAttachment: DiskAttachment = this.findDiskAttachmentFromVm(vmId, diskAttachmentId)
			.getOrNull() ?: throw ErrorPattern.DISK_ATTACHMENT_ID_NOT_FOUND.toError()
		val status = diskAttachment.active()
		if (status == activeStatus) {
			log.error("디스크 {} {} 완료", diskAttachmentId, status)
			throw ErrorPattern.DISK_ATTACHMENT_ACTIVE_INVALID.toError()
		} else if (System.currentTimeMillis() - startTime > timeout) {
			log.error("디스크 {} 상태 시간 초과", activeStatus)
			return false
		}
		log.info("디스크 상태: {}", status)
		Thread.sleep(interval)
	}
}


private fun Connection.srvVmGraphicsConsolesFromVm(vmId: String): VmGraphicsConsolesService =
	this.srvVm(vmId).graphicsConsolesService()

fun Connection.findAllVmGraphicsConsolesFromVm(vmId: String): Result<List<GraphicsConsole>> = runCatching {
	this.srvVmGraphicsConsolesFromVm(vmId).list().current(true).send().consoles()
}.onSuccess {
	Term.VM.logSuccessWithin(Term.CONSOLE, "목록조회", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.CONSOLE, "목록조회", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvVmGraphicsConsoleFromVm(vmId: String, graphicsConsoleId: String): VmGraphicsConsoleService =
	this.srvVmGraphicsConsolesFromVm(vmId).consoleService(graphicsConsoleId)

fun Connection.findVmGraphicsConsoleFromVm(vmId: String, graphicsConsoleId: String): Result<GraphicsConsole?> = runCatching {
	this.srvVmGraphicsConsoleFromVm(vmId, graphicsConsoleId).get().send().console()
}.onSuccess {
	Term.VM.logSuccessWithin(Term.CONSOLE, "상세조회", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.CONSOLE, "상세조회", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.findTicketFromVmGraphicsConsole(vmId: String, graphicsConsoleId: String, expiry: BigInteger? = null): Result<Ticket?> = runCatching {
	this.srvVmGraphicsConsoleFromVm(vmId, graphicsConsoleId).ticket().apply {
		if (expiry!=null) ticket(TicketBuilder()
			.expiry(expiry)
			.build())
	}.send().ticket()
}.onSuccess {
	Term.CONSOLE.logSuccessWithin(Term.TICKET, "발행", vmId)
}.onFailure {
	Term.CONSOLE.logFailWithin(Term.TICKET, "발행", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvStatisticsFromVm(vmId: String): StatisticsService =
	this.srvVm(vmId).statisticsService()

fun Connection.findAllStatisticsFromVm(vmId: String): Result<List<Statistic>> = runCatching {
	this.srvStatisticsFromVm(vmId).list().send().statistics()

}.onSuccess {
	Term.VM.logSuccessWithin(Term.STATISTIC, "STATISTIC 목록조회", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.VM, "STATISTIC 목록조회", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvStatisticsFromVmNic(vmId: String, nicId: String): StatisticsService =
	this.srvVm(vmId).nicsService().nicService(nicId).statisticsService()

fun Connection.findAllStatisticsFromVmNic(vmId: String, nicId: String): Result<List<Statistic>> = runCatching {
	checkVmExists(vmId)

	this.srvStatisticsFromVmNic(vmId, nicId).list().send().statistics()
}.onSuccess {
	Term.VM.logSuccessWithin(Term.NIC, "통계 목록조회", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.NIC, "통계 목록조회", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvAffinityLabelsFromVm(vmId: String): AssignedAffinityLabelsService =
	this.srvVm(vmId).affinityLabelsService()

fun Connection.findAllAffinityLabelsFromVm(vmId: String): Result<List<AffinityLabel>> = runCatching {
	this.srvAffinityLabelsFromVm(vmId).list().send().label()
}.onSuccess {
	Term.VM.logSuccessWithin(Term.AFFINITY_LABEL, "목록조회", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.AFFINITY_LABEL, "목록조회", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.srvNicNetworkFilterParametersFromVm(vmId: String, nicId: String): NicNetworkFilterParametersService =
	this.srvNicFromVm(vmId, nicId).networkFilterParametersService()

fun Connection.findAllNicNetworkFilterParametersFromVm(vmId: String, nicId: String): Result<List<NetworkFilterParameter>> = runCatching {
	this.srvNicNetworkFilterParametersFromVm(vmId, nicId).list().send().parameters()
}.onSuccess {
	Term.VM.logSuccessWithin(Term.NIC, "NFP 목록조회", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.NIC, "NFP 목록조회", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.addNicNetworkFilterParameterFromVm(vmId: String, nicId: String, nfp: NetworkFilterParameter): Result<NetworkFilterParameter> = runCatching {
	this.srvNicNetworkFilterParametersFromVm(vmId, nicId).add().parameter(nfp).send().parameter()
}.onSuccess {
	Term.VM.logSuccessWithin(Term.NIC, "NFP 생성", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.NIC, "NFP 생성", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}


private fun Connection.srvApplicationsFromVm(vmId: String): VmApplicationsService =
	this.srvVm(vmId).applicationsService()

fun Connection.findAllApplicationsFromVm(vmId: String, follow: String = ""): Result<List<Application>> = runCatching {
	checkVmExists(vmId)

	this.srvApplicationsFromVm(vmId).list().apply {
		if (follow.isNotEmpty()) follow(follow)
	}.send().applications()

}.onSuccess {
	Term.VM.logSuccessWithin(Term.APPLICATION, "목록조회", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.APPLICATION, "목록조회", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvHostDevicesFromVm(vmId: String): VmHostDevicesService =
	this.srvVm(vmId).hostDevicesService()

fun Connection.findAllHostDevicesFromVm(vmId: String): Result<List<HostDevice>> = runCatching {
	this.srvHostDevicesFromVm(vmId).list().send().device()
}.onSuccess {
	Term.VM.logSuccessWithin(Term.HOST_DEVICES, "목록조회", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.HOST_DEVICES, "목록조회", it, vmId)
	throw if (it is Error) it.toItCloudException() else it

}

private fun Connection.srvAllAssignedPermissionsFromVm(vmId: String): AssignedPermissionsService =
	this.srvVm(vmId).permissionsService()

fun Connection.findAllAssignedPermissionsFromVm(vmId: String): Result<List<Permission>> = runCatching {
	checkVmExists(vmId)

	this.srvAllAssignedPermissionsFromVm(vmId).list().send().permissions()
}.onSuccess {
	Term.VM.logSuccessWithin(Term.PERMISSION, "목록조회", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.PERMISSION, "목록조회", it, vmId)
	throw if (it is Error) it.toItCloudException() else it

}


fun List<Vm>.nameDuplicateVm(name: String, id: String? = null): Boolean =
	this.filter { it.id() != id }.any { it.name() == name }

/**
 * 가상머신 상태확인
 *
 * @param vmId 가상머신 아이디
 * @param expectStatus 변경되야하는 가상머신 상태
 * @param interval 대기 초
 * @param timeout 총 대기시간
 * @return 200/404
 * @throws InterruptedException
 */
@Throws(InterruptedException::class)
fun Connection.expectVmStatus(vmId: String, expectStatus: VmStatus, interval: Long = 1000L, timeout: Long = 90000L): Boolean {
	val startTime = System.currentTimeMillis()
	while (true) {
		val currentVm: Vm? = this.findVm(vmId).getOrNull()
		val status = currentVm?.status()
		if (status == expectStatus) {
			log.info("vm {} 완료...", expectStatus)
			return true
		} else if (System.currentTimeMillis() - startTime > timeout) {
			log.error("vm {} 전환 시간 초과", expectStatus)
			return false
		}
		log.info("가상머신 상태: {}", status)
		Thread.sleep(interval)
	}
}
