package com.itinfo.rutilvm.util.ovirt

import com.itinfo.rutilvm.api.ovirt.business.model.Term
import com.itinfo.rutilvm.api.ovirt.business.model.logSuccess
import com.itinfo.rutilvm.api.ovirt.business.model.logSuccessWithin
import com.itinfo.rutilvm.api.ovirt.business.model.logFail
import com.itinfo.rutilvm.api.ovirt.business.model.logFailWithin
import com.itinfo.rutilvm.common.suspendRunCatching

import com.itinfo.rutilvm.util.ovirt.error.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.TimeoutCancellationException
import kotlinx.coroutines.delay
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withContext
import kotlinx.coroutines.withTimeout

import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.builders.*
import org.ovirt.engine.sdk4.services.*
import org.ovirt.engine.sdk4.types.*
import java.math.BigInteger
import java.util.concurrent.TimeoutException

fun Connection.srvVms(): VmsService =
	this.systemService.vmsService()

fun Connection.findAllVms(searchQuery: String?="", follow: String?=""): Result<List<Vm>> = runCatching {
	this.srvVms().list().allContent(true).apply {
		if (searchQuery?.isEmpty() == false) search(searchQuery)
		if (follow?.isEmpty() == false) follow(follow)
	}.caseSensitive(false).send().vms()
}.onSuccess {
	Term.VM.logSuccess("목록조회")
}.onFailure {
	Term.VM.logFail("목록조회", it)
	throw if (it is Error) it.toItCloudException(Term.VM, "목록조회") else it
}

fun Connection.srvVm(vmId: String?=""): VmService =
	this.srvVms().vmService(vmId)

fun Connection.findVm(vmId: String?="", follow: String?=""): Result<Vm?> = suspendRunCatching {
	this.srvVm(vmId).get().apply {
		follow(follow)
	}.send().vm()
}.onSuccess {
	Term.VM.logSuccess("상세조회", vmId)
}.onFailure {
	Term.VM.logFail("상세조회", it, vmId)
	throw if (it is Error) it.toItCloudException(Term.VM, "상세조회", vmId) else it
}


fun Connection.startVm(
	vmId: String?="",
	usingInitialization: Vm?=null
): Result<Boolean> = runCatching {
	val vm: Vm? = checkVm(vmId)

	val diskAttachments = this.findAllDiskAttachmentsFromVm(vmId).getOrDefault(listOf())
	if (!diskAttachments.any { it.bootable() }) {
		log.error("가상머신 디스크 중 부팅 가능한 디스크가 없음")
		throw ErrorPattern.DISK_ATTACHMENT_NOT_BOOTABLE.toError()
	}
	if (vm?.status() == VmStatus.UP) {
		// log.error("가상머신 상태가 up인 상태")
		throw ErrorPattern.VM_STATUS_UP.toError()
	}
	this.srvVm(vmId).start().apply {
		/*
		useInitialization(true) // windows는 _SysPrep_
		vm(vm)
		*/
	}.send()
	// this.expectVmStatus(vmId, VmStatus.UP)
	true
}.onSuccess {
	Term.VM.logSuccess("시작", vmId)
}.onFailure {
	Term.VM.logFail("시작", it, vmId)
	throw if (it is Error) it.toItCloudException(Term.VM, "시작", vmId) else it
}

fun Connection.startOnceVm(vm: Vm, windowGuest: Boolean): Result<Boolean> = runCatching {
	val diskAttachments = this.findAllDiskAttachmentsFromVm(vm.id()).getOrDefault(listOf())
	if (!diskAttachments.any { it.bootable() }) {
		log.error("부팅 가능한 디스크가 없음")
		throw ErrorPattern.DISK_ATTACHMENT_NOT_BOOTABLE.toError()
	}
	if (vm.status() == VmStatus.UP){
		throw ErrorPattern.VM_STATUS_UP.toError()
	}

	log.debug("startOnceVm ... cdrom[0].id: {}", vm.cdroms().first()?.id())

	this.srvVm(vm.id()).start()
		.useSysprep(windowGuest)
		.volatile_(true)
		.vm(vm)
		.send()

	/**/
	true
}.onSuccess {
	Term.VM.logSuccess("한번 시작", vm.id())
}.onFailure {
	Term.VM.logFail("한번 시작", it, vm.id())
	throw if (it is Error) it.toItCloudException(Term.VM, "한번 시작", vm.id()) else it
}

fun Connection.stopVm(vmId: String): Result<Boolean> = runCatching {
	val vm: Vm? = checkVm(vmId)
	if (vm?.status() == VmStatus.DOWN){
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
	throw if (it is Error) it.toItCloudException(Term.VM, "전원끄기", vmId) else it
}

fun Connection.suspendVm(vmId: String): Result<Boolean> = runCatching {
	val vm: Vm? = checkVm(vmId)
	this.srvVm(vmId).suspend().send()
	// this.expectVmStatus(vmId, VmStatus.SUSPENDED)
	true
}.onSuccess {
	Term.VM.logSuccess("일시정지", vmId)
}.onFailure {
	Term.VM.logFail("일시정지", it, vmId)
	throw if (it is Error)
		if (it.message?.contains("review".toRegex()) == true)
			ErrorPattern.VM_CONFLICT_WHILE_PREVIEWING_SNAPSHOT.toError()
		else
			it.toItCloudException(Term.VM, "일시정지", vmId) else it
}

// TODO: 종료되지 않고 다시 올라올때가 잇음, expectVmStatus대신 다른 함수 써야 할지 확인 필요
fun Connection.shutdownVm(vmId: String): Result<Boolean> = runCatching {
	val vm: Vm? = checkVm(vmId)
	this.srvVm(vmId).shutdown().send()
	// this.expectVmStatus(vmId, VmStatus.DOWN)
	true

}.onSuccess {
	Term.VM.logSuccess("종료", vmId)
}.onFailure {
	Term.VM.logFail("종료", it, vmId)
	throw if (it is Error) it.toItCloudException(Term.VM, "종료", vmId) else it
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
	throw if (it is Error) it.toItCloudException(Term.VM, "재부팅", vmId) else it
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
	throw if (it is Error) it.toItCloudException(Term.VM, "재설정", vmId) else it
}

fun Connection.detachVm(vmId: String): Result<Boolean> = runCatching {
	checkVmExists(vmId)
	this.srvVm(vmId).detach().send()
	true
}.onSuccess {
	Term.VM.logSuccess("분리", vmId)
}.onFailure {
	Term.VM.logFail("분리", it, vmId)
	throw if (it is Error) it.toItCloudException(Term.VM, "분리", vmId) else it
}

fun Connection.addVm(vm: Vm, cdromFileId: String?=""): Result<Vm?> = runCatching {
	if (this.findAllVms().getOrDefault(listOf()).nameDuplicateVm(vm.name())) {
		throw ErrorPattern.VM_DUPLICATE.toError()
	}

	val vmAdded: Vm =
		this.srvVms().add().vm(vm).send().vm() ?: throw ErrorPattern.VM_NOT_FOUND.toError()

	if (!cdromFileId.isNullOrEmpty()){
		this.srvVmCdromsFromVm(vmAdded.id())
			.add()
			.cdrom(CdromBuilder().file(FileBuilder().id(cdromFileId)))
			.send()
			.cdrom()
	}

	vmAdded
}.onSuccess {
	Term.VM.logSuccess("생성", it.id())
}.onFailure {
	Term.VM.logFail("생성", it)
	throw if (it is Error) it.toItCloudException(Term.VM, "생성") else it
}

fun Connection.updateVm(vm: Vm, cdromFileId: String?=""): Result<Vm?> = runCatching {
	if (this.findAllVms().getOrDefault(listOf()).nameDuplicateVm(vm.name(), vm.id())) {
		throw ErrorPattern.VM_DUPLICATE.toError()
	}
	val vmUpdated: Vm =
		this.srvVm(vm.id()).update().vm(vm).send().vm() ?: throw ErrorPattern.VM_NOT_FOUND.toError()


	if (!cdromFileId.isNullOrEmpty()){
		this.srvVmCdromsFromVm(vmUpdated.id())
			.add()
			.cdrom(CdromBuilder().file(FileBuilder().id(cdromFileId)))
			.send()
			.cdrom()
	}

	vmUpdated
}.onSuccess {
	Term.VM.logSuccess("편집", it.id())
}.onFailure {
	Term.VM.logFail("편집", it)
	throw if (it is Error) it.toItCloudException(Term.VM, "편집") else it
}

// diskDelete 디스크 삭제 여부
fun Connection.removeVm(vmId: String, diskDelete: Boolean = false): Result<Boolean> = runCatching {
	val vm: Vm? = checkVm(vmId)
	if (vm?.deleteProtected() == true) throw ErrorPattern.VM_PROTECTED.toError()
	if (vm?.status() == VmStatus.UP) {
		log.info("가상머신({})이 실행중인 상태", vm.id())
		throw ErrorPattern.VM_STATUS_UP.toError()
	}

	this.srvVm(vmId).remove().detachOnly(!diskDelete).send()
	this.expectVmDeleted(vmId)
}.onSuccess {
	Term.VM.logSuccess("삭제", vmId)
}.onFailure {
	Term.VM.logFail("삭제", it, vmId)
	throw if (it is Error) it.toItCloudException(Term.VM, "삭제") else it
}

/*
fun Connection.takeVmScreenshot(vmId: String): Result<ByteArray> = runCatching {
	val vm: Vm = checkVm(vmId)
	if (vm.status() !== VmStatus.UP) {
		throw ErrorPattern.VM_STATUS_ERROR.toError()
	}
	this.srvVm(vmId).screenshot()
		.send()
		.toString()
}.onSuccess {
	Term.VM.logSuccess("스크린샷", vmId)
}.onFailure {
	Term.VM.logFail("스크린샷", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}
*/

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
			log.error("{} {} 삭제 시간 초과", Term.VM.description, vmToRemove.name())
			return false
		}
		log.debug("{} 삭제 진행중 ... ", Term.VM.description)
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
	throw if (it is Error) it.toItCloudException(Term.VM, "내보내기", vmId) else it
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
	throw if (it is Error) it.toItCloudException(Term.VM, "마이그레이션", vmId) else it
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
	throw if (it is Error) it.toItCloudException(Term.VM, "마이그레이션 취소", vmId) else it
}

private const val DEFAULT_ID_CDROM = "00000000-0000-0000-0000-000000000000" // CD-ROM은 어느환경에서 하나만 존재하는 것으로 확인

private fun Connection.srvVmCdromsFromVm(vmId: String?): VmCdromsService =
	this.srvVm(vmId).cdromsService()

fun Connection.findAllCdromsFromVm(vmId: String?=""): Result<List<Cdrom>> = runCatching {
	checkVmExists(vmId)
	this.srvVmCdromsFromVm(vmId)
		.list()
		.send()
		.cdroms()
}.onSuccess {
	Term.VM.logSuccessWithin(Term.CD_ROM, "목록조회", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.CD_ROM, "목록조회", it, vmId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.VM, Term.CD_ROM, "목록조회", vmId) else it
}

private fun Connection.srvVmCdromFromVm(vmId: String?=""): VmCdromService =
	this.srvVmCdromsFromVm(vmId).cdromService(DEFAULT_ID_CDROM)

fun Connection.findCdromFromVm(
	vmId: String?="",
	current: Boolean?=false
): Result<Cdrom?> = runCatching {
	val vm = checkVm(vmId)
	this.srvVmCdromFromVm(vmId)
		.get()
		.current(current)
		.send()
		.cdrom()
}.onSuccess {
	Term.VM.logSuccessWithin(Term.CD_ROM, "상세조회", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.CD_ROM, "상세조회", it, vmId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.VM, Term.CD_ROM, "상세조회", vmId) else it
}

fun Connection.addCdromFromVm(vmId: String?="", cdromFileId: String?=""): Result<Cdrom?> = runCatching {
	checkVmExists(vmId)
	this.srvVmCdromsFromVm(vmId).add().apply {
		cdrom(
			CdromBuilder()
				.file(FileBuilder().id(cdromFileId))
		)
	}.send().cdrom()
}.onSuccess {
	Term.VM.logSuccessWithin(Term.CD_ROM, "생성", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.CD_ROM, "생성", it, vmId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.VM, Term.CD_ROM, "생성", vmId) else it
}

fun Connection.updateCdromFromVm(vmId: String?="", newCdromId: String?="", current:Boolean?=false): Result<Cdrom?> = runCatching {
	val vm = checkVm(vmId)
	// current는 실행중인 가상머신에서 바로 변경할때 가능
	this.srvVmCdromFromVm(vmId).update().apply {
		cdrom(CdromBuilder().file(FileBuilder().id(newCdromId)))
		current(current) // 실행 중일 때 즉시 반영
	}.send().cdrom()
}.onSuccess {
	Term.VM.logSuccessWithin(Term.CD_ROM, "편집", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.CD_ROM, "편집", it, vmId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.VM, Term.CD_ROM, "편집", vmId, newCdromId) else it
}

fun Connection.removeCdromFromVm(vmId: String?="", current:Boolean?=false): Result<Boolean?> = runCatching {
	val vm = checkVm(vmId)
	this.srvVmCdromFromVm(vmId).update().apply {
		cdrom(CdromBuilder().file(FileBuilder().id("").build()).build())    // null로 할당
		current(current)
	}.send().cdrom()
	true
}.onSuccess {
	Term.VM.logSuccessWithin(Term.CD_ROM, "삭제", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.CD_ROM, "삭제", it, vmId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.VM, Term.CD_ROM, "삭제", vmId) else it
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
	throw if (it is Error) it.toItCloudExceptionWithin(Term.VM, Term.NIC, "목록조회", vmId) else it
}

fun Connection.srvNicFromVm(vmId: String, nicId: String): VmNicService =
	this.srvNicsFromVm(vmId).nicService(nicId)

fun Connection.findNicFromVm(vmId: String, nicId: String, follow: String = ""): Result<Nic?> = runCatching {
	checkVmExists(vmId)

	this.srvNicFromVm(vmId, nicId).get().apply {
		if (follow.isNotEmpty()) follow(follow)
	}.send().nic()
}.onSuccess {
	Term.VM.logSuccessWithin(Term.NIC, "상세조회", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.NIC, "상세조회", it, vmId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.VM, Term.NIC, "상세조회", vmId, nicId) else it
}

fun Connection.addNicFromVm(vmId: String, nic: Nic): Result<Nic?> = runCatching {
	// 기존 nic와 이름 중복 검사
	val existingNics = this.findAllNicsFromVm(vmId).getOrDefault(listOf())
	if (existingNics.nameDuplicateVmNic(nic.name())) {
		/* TODO:
		 * 탬플릿으로 새 가상머신 생성 했을 때, 기존 NIC가 있었을 떄, 변경없이 진행하면, 가상머신 생성 때 이미 nic가 추가된 상태로
		 * 진행하여, 새로 추가되는 개념으로 가지 않음. 왜 그러는지 확인 필요
		 **/
		throw ErrorPattern.NIC_DUPLICATE.toError()
		// return FailureType.DUPLICATE.toResult(Term.NIC.desc)
	}

	if (nic.macPresent() &&
		nic.mac().addressPresent() &&
		nic.mac().address().isNotEmpty()
	) {
		if (existingNics.any { it.mac().address() == nic.mac().address() })
			return FailureType.DUPLICATE.toResult("mac 주소")
		// TODO
	}

	srvNicsFromVm(vmId).add().nic(nic).send().nic()
}.onSuccess {
	Term.VM.logSuccessWithin(Term.NIC, "생성", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.NIC, "생성", it, vmId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.VM, Term.NIC, "생성", vmId) else it
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
	Term.VM.logSuccessWithin(Term.NIC, "여러건 생성", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.NIC, "여러건 생성", it, vmId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.VM, Term.NIC, "여러건 생성", vmId) else it
}

fun Connection.updateNicFromVm(
	vmId: String,
	nic: Nic
): Result<Nic?> = runCatching {
	/*
	runBlocking {
		srv.deactivate().send()
		delay(3000)
		srv.update()
			.nic(nic)
			.send().nic()
		delay(3000)
		srv.activate().send()
	}
	*/
	if (this@updateNicFromVm.findAllNicsFromVm(vmId)
			.getOrDefault(listOf())
			.nameDuplicateVmNic(nic.name(), nic.id())) {
		throw ErrorPattern.NIC_DUPLICATE.toError()
	}

	val srv = this@updateNicFromVm.srvNicFromVm(vmId, nic.id())
	// --- 2. Check VM Status
	val vm = findVm(vmId
		// ,"host" // TODO: follow 값이 실행 중일 때거나 또다른 상태일때만 이 조회가 유효하게 나옴
	).getOrNull()
		?: throw ErrorPattern.VM_NOT_FOUND.toError()
	// TODO: 변경 할 NIC가 현재 가상머신이 있는 호스트의 네트워크에도 존재하는지 확인필요
	// 이 조건에 부합하지 않을 결우, 이 문구가 발생
	//
	// "Failed to deactivate VM Network Interface"
	if (vm.status() != VmStatus.DOWN) {
		// --- PATH A: VM is OFF - Simple Update ---
		log.warn("vm NOT DOWN! {}.", nic.id())
		throw ErrorPattern.VM_STATUS_ERROR.toError()
		// TODO: 더 정확하고 나은 에러 유형 생성
	}
	srv.update().nic(nic).send().nic()

	/*else {
		// --- PATH B: VM is RUNNING - Full Deactivate/Update/Activate Dance ---
		log.info("VM is running. Performing hot-update for NIC {}.", nic.id())
		// Step 2.1: Deactivate
		log.info("updateNicFromVm ... deactivate NIC {}, plugged: {}", nic.id(), nic.plugged())
		if (nic.plugged())
			srv.deactivate().async(true).send()

		pollNicStatus(vm.id(), nic.id(), false)

		// Step 2.2: Update
		log.info("updateNicFromVm ... updateNic NIC {}", nic.id())
		val updatedNic = srv.update().nic(nic).send().nic()

		// Step 2.3: Activate
		log.info("updateNicFromVm ... activate NIC {}", updatedNic.id())
		srv.activate().send()
		pollNicStatus(vm.id(), nic.id(), true)

		// Return the final state of the NIC after all operations
		srv.get().send().nic()
	}*/
}.onSuccess {
	Term.VM.logSuccessWithin(Term.NIC, "편집", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.NIC, "편집", it, vmId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.VM, Term.NIC, "편집", vmId, nic.id()) else it
}

fun Connection.updateMultipleNicsFromVm(vmId: String, nics: List<Nic>): Result<Boolean> = runCatching {
	val validNics = nics.filter { it.vnicProfile().id().isNotEmpty() }
	if (validNics.isEmpty()) return@runCatching true

	val results = nics.map {
		updateNicFromVm(vmId, it)
	}
	val allSuccessful = results.all { it.isSuccess }

	if (!allSuccessful) {
		val failedResults = results.filter { it.isFailure }
		log.warn("일부 NIC 편집 실패: ${failedResults.size}개")
	}
	allSuccessful
}.onSuccess {
	Term.VM.logSuccessWithin(Term.NIC, "여러건 편집", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.NIC, "여러건 편집", it, vmId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.VM, Term.NIC, "여러건 편집", vmId) else it
}

fun Connection.removeNicFromVm(vmId: String, nicId: String): Result<Boolean> = runCatching {
	val vm = checkVm(vmId)

	val nic = this@removeNicFromVm.findNicFromVm(vmId, nicId)
		.getOrNull() ?: throw ErrorPattern.NIC_NOT_FOUND.toError()

	if (vm?.status() != VmStatus.DOWN && nic.linked())
		throw ErrorPattern.NIC_UNLINKED_REQUIRED.toError()

	srvNicFromVm(vmId, nic.id())
		.remove()
		.async(true)
		.send()
	true
}.onSuccess {
	Term.VM.logSuccessWithin(Term.NIC, "제거", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.NIC, "제거", it, vmId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.VM, Term.NIC, "제거", vmId, nicId) else it
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
	Term.VM.logSuccessWithin(Term.NIC, "여러건 제거", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.NIC, "여러건 제거", it, vmId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.VM, Term.NIC, "여러건 제거", vmId) else it
}

fun List<Nic>.nameDuplicateVmNic(name: String, id: String? = null): Boolean =
	this.filter { it.id() != id }.any { it.name() == name }

fun Connection.srvReportedDevicesFromVm(vmId: String): VmReportedDevicesService =
	this.srvVm(vmId).reportedDevicesService()

fun Connection.findAllReportedDevicesFromVm(vmId: String): Result<List<ReportedDevice>> = runCatching {
	this.srvReportedDevicesFromVm(vmId).list().send().reportedDevice()
}.onSuccess {
	Term.VM.logSuccessWithin(Term.REPORTED_DEVICE, "목록조회", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.REPORTED_DEVICE, "목록조회", it, vmId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.VM, Term.REPORTED_DEVICE, "목록조회", vmId) else it
}

fun Connection.srvReportedDevicesFromVmNics(vmId: String, nicId: String): VmReportedDevicesService =
	this.srvNicFromVm(vmId, nicId).reportedDevicesService()

fun Connection.findAllReportedDevicesFromVmNic(vmId: String, nicId: String): Result<List<ReportedDevice>> = runCatching {
	this.srvReportedDevicesFromVmNics(vmId, nicId).list().send().reportedDevice()
}.onSuccess {
	Term.VM_NIC.logSuccessWithin(Term.REPORTED_DEVICE, "목록조회", vmId)
}.onFailure {
	Term.VM_NIC.logFailWithin(Term.REPORTED_DEVICE, "목록조회", it, vmId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.VM_NIC, Term.REPORTED_DEVICE, "목록조회", vmId, nicId) else it
}

fun Connection.srvReportedDeviceFromVmNic(vmId: String, nicId: String, reportedDeviceId: String): VmReportedDeviceService =
	this.srvReportedDevicesFromVmNics(vmId, nicId).reportedDeviceService(reportedDeviceId)

fun Connection.findReportedDeviceFromVmNic(vmId: String, nicId: String, rpId: String): Result<ReportedDevice?> = runCatching {
	this.srvReportedDeviceFromVmNic(vmId, nicId, rpId).get().send().reportedDevice()
}.onSuccess {
	Term.VM.logSuccessWithin(Term.NIC, "상세조회", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.NIC, "상세조회", it, vmId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.VM, Term.REPORTED_DEVICE, "상세조회", vmId, nicId) else it
}

private fun Connection.srvAllDiskAttachmentsFromVm(vmId: String?=""): DiskAttachmentsService =
	this.srvVm(vmId).diskAttachmentsService()

fun Connection.findAllDiskAttachmentsFromVm(vmId: String?="", follow: String?=""): Result<List<DiskAttachment>> = runCatching {
	checkVmExists(vmId)

	this.srvAllDiskAttachmentsFromVm(vmId).list().apply {
		if(follow?.isEmpty() != false) follow(follow)
	}.send().attachments()

}.onSuccess {
	Term.VM.logSuccessWithin(Term.DISK_ATTACHMENT, "목록조회", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.DISK_ATTACHMENT, "목록조회", it, vmId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.VM, Term.DISK_ATTACHMENT, "목록조회", vmId) else it
}

fun Connection.srvDiskAttachmentFromVm(vmId: String?="", diskAttachmentId: String?=""): DiskAttachmentService =
	this.srvVm(vmId).diskAttachmentsService().attachmentService(diskAttachmentId)

fun Connection.findDiskAttachmentFromVm(vmId: String?="", diskAttachmentId: String?="", follow: String?=""): Result<DiskAttachment?> = runCatching {
	checkVmExists(vmId)

	this.srvDiskAttachmentFromVm(vmId, diskAttachmentId).get().apply {
		if (follow?.isEmpty() != false) follow(follow)
	}.send().attachment()

}.onSuccess {
	Term.VM.logSuccessWithin(Term.DISK_ATTACHMENT, "상세조회", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.DISK_ATTACHMENT, "상세조회", it, vmId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.VM, Term.DISK_ATTACHMENT, "상세조회", vmId, diskAttachmentId) else it
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
	throw if (it is Error) it.toItCloudExceptionWithin(Term.VM, Term.DISK_ATTACHMENT, "붙이기", vmId, diskAttachment.id()) else it
}

fun Connection.addMultipleDiskAttachmentsToVm(
	vmId: String, diskAttachments: List<DiskAttachment>): Result<Boolean> = runCatching {
	checkVmExists(vmId)

	val results = diskAttachments.map { this.addDiskAttachmentToVm(vmId, it) }
	val allSuccessful = results.all { it.isSuccess }

	if (!allSuccessful) {
		val failedResults = results.filter { it.isFailure }
		log.warn("일부 DiskAttachment 생성 실패: ${failedResults.size}개")
	}
	allSuccessful
}.onSuccess {
	Term.VM.logSuccessWithin(Term.DISK_ATTACHMENT, "여러건 붙이기", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.DISK_ATTACHMENT, "여러건 붙이기", it, vmId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.VM, Term.DISK_ATTACHMENT, "붙이기", vmId) else it
}

fun Connection.updateDiskAttachmentToVm(
	vmId: String,
	diskAttachment: DiskAttachment
): Result<DiskAttachment> = runCatching {
	checkVmExists(vmId)

	if (this.findDiskAttachmentFromVm(vmId, diskAttachment.id()).isFailure) {
		throw ErrorPattern.DISK_ATTACHMENT_ID_NOT_FOUND.toError()
	}

	val diskAttachUpdated: DiskAttachment? = this.srvDiskAttachmentFromVm(vmId, diskAttachment.id())
			.update()
			.diskAttachment(diskAttachment)
			.send()
			.diskAttachment()

	diskAttachUpdated ?: throw ErrorPattern.DISK_ATTACHMENT_NOT_FOUND.toError()
}.onSuccess {
	Term.VM.logSuccessWithin(Term.DISK_ATTACHMENT, "편집", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.DISK_ATTACHMENT,"편집", it, vmId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.VM, Term.DISK_ATTACHMENT, "편집", vmId, diskAttachment.id()) else it
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
	Term.VM.logSuccessWithin(Term.DISK_ATTACHMENT, "여러건 편집", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.DISK_ATTACHMENT, "여러건 편집", it, vmId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.VM, Term.DISK_ATTACHMENT, "여러건 편집", vmId) else it
}

fun Connection.removeDiskAttachmentToVm(
	vmId: String,
	diskAttachmentId: String,
	detachOnly: Boolean
): Result<Boolean> = runCatching {
	checkVmExists(vmId)

	val dah: DiskAttachment = this.findDiskAttachmentFromVm(vmId, diskAttachmentId)
		.getOrNull() ?: throw ErrorPattern.DISK_ATTACHMENT_ID_NOT_FOUND.toError()

	// if(dah.active()){
	// 	throw ErrorPattern.DISK_ATTACHMENT_ACTIVE_INVALID.toError()
	// }
	// DiskAttachment 삭제 요청 및 결과 확인
	this.srvDiskAttachmentFromVm(vmId, diskAttachmentId).remove().detachOnly(detachOnly).send()
	true
}.onSuccess {
	Term.VM.logSuccessWithin(Term.DISK_ATTACHMENT, "삭제", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.DISK_ATTACHMENT, "삭제", it, vmId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.VM_NIC, Term.DISK_ATTACHMENT, "여러건 편집", vmId) else it
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
	Term.VM.logFailWithin(Term.DISK_ATTACHMENT, "활성화", it, vmId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.VM, Term.DISK_ATTACHMENT, "활성화", vmId, diskAttachmentId) else it
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
	Term.VM.logFailWithin(Term.DISK_ATTACHMENT, "비활성화", it, vmId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.VM, Term.DISK_ATTACHMENT, "비활성화", vmId, diskAttachmentId) else it
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
	this.srvVmGraphicsConsolesFromVm(vmId).list()
		.current(true)
		.send()
		.consoles()
}.onSuccess {
	Term.VM.logSuccessWithin(Term.CONSOLE, "목록조회", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.CONSOLE, "목록조회", it, vmId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.VM, Term.CONSOLE, "목록조회", vmId) else it
}

private fun Connection.srvVmGraphicsConsoleFromVm(vmId: String, graphicsConsoleId: String): VmGraphicsConsoleService =
	this.srvVmGraphicsConsolesFromVm(vmId).consoleService(graphicsConsoleId)

fun Connection.findVmGraphicsConsoleFromVm(vmId: String, graphicsConsoleId: String): Result<GraphicsConsole?> = runCatching {
	this.srvVmGraphicsConsoleFromVm(vmId, graphicsConsoleId).get().send().console()
}.onSuccess {
	Term.VM.logSuccessWithin(Term.CONSOLE, "상세조회", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.CONSOLE, "상세조회", it, vmId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.VM, Term.CONSOLE, "상세조회", vmId, graphicsConsoleId) else it
}

fun Connection.findTicketFromVm(vmId: String, expiry: BigInteger? = null): Result<Ticket?> = runCatching {
	this.srvVm(vmId).ticket().apply {
		if (expiry!=null) ticket(TicketBuilder()
			.expiry(expiry)
			.build())
	}.send().ticket()
}.onSuccess {
	Term.CONSOLE.logSuccessWithin(Term.TICKET, "발행", vmId)
}.onFailure {
	Term.CONSOLE.logFailWithin(Term.TICKET, "발행", it, vmId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.CONSOLE, Term.TICKET, "발행", vmId) else it
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
	throw if (it is Error) it.toItCloudExceptionWithin(Term.CONSOLE, Term.TICKET, "발행", vmId) else it
}

fun Connection.generateRemoteViewerConnectionFile(vmId: String, graphicsConsoleId: String): Result<String?> = runCatching {
	this.srvVmGraphicsConsoleFromVm(vmId, graphicsConsoleId).remoteViewerConnectionFile().send().remoteViewerConnectionFile()
}.onSuccess {
	Term.CONSOLE.logSuccessWithin(Term.REMOTE_VIEWER, "다운로드", vmId)
}.onFailure {
	Term.CONSOLE.logFailWithin(Term.REMOTE_VIEWER, "다운로드", it, vmId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.CONSOLE, Term.REMOTE_VIEWER, "다운로드", vmId, graphicsConsoleId) else it
}

private fun Connection.srvStatisticsFromVm(vmId: String): StatisticsService =
	this.srvVm(vmId).statisticsService()

fun Connection.findAllStatisticsFromVm(vmId: String): Result<List<Statistic>> = runCatching {
	this.srvStatisticsFromVm(vmId).list().send().statistics()

}.onSuccess {
	Term.VM.logSuccessWithin(Term.STATISTIC, "목록조회", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.STATISTIC,"목록조회", it, vmId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.VM, Term.STATISTIC, "목록조회", vmId) else it
}

private fun Connection.srvStatisticsFromVmNic(vmId: String, nicId: String): StatisticsService =
	this.srvVm(vmId).nicsService().nicService(nicId).statisticsService()

fun Connection.findAllStatisticsFromVmNic(vmId: String, nicId: String): Result<List<Statistic>> = runCatching {
	checkVmExists(vmId)

	this.srvStatisticsFromVmNic(vmId, nicId).list().send().statistics()
}.onSuccess {
	Term.VM_NIC.logSuccessWithin(Term.STATISTIC, "목록조회", vmId)
}.onFailure {
	Term.VM_NIC.logFailWithin(Term.STATISTIC, "목록조회", it, vmId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.VM_NIC, Term.STATISTIC, "목록조회", vmId, nicId) else it
}

private fun Connection.srvAffinityLabelsFromVm(vmId: String): AssignedAffinityLabelsService =
	this.srvVm(vmId).affinityLabelsService()

fun Connection.findAllAffinityLabelsFromVm(vmId: String): Result<List<AffinityLabel>> = runCatching {
	this.srvAffinityLabelsFromVm(vmId).list().send().label()
}.onSuccess {
	Term.VM.logSuccessWithin(Term.AFFINITY_LABEL, "목록조회", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.AFFINITY_LABEL, "목록조회", it, vmId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.VM, Term.AFFINITY_LABEL, "목록조회", vmId) else it
}

fun Connection.srvNicNetworkFilterParametersFromVm(vmId: String, nicId: String): NicNetworkFilterParametersService =
	this.srvNicFromVm(vmId, nicId).networkFilterParametersService()

fun Connection.findAllNicNetworkFilterParametersFromVm(vmId: String, nicId: String): Result<List<NetworkFilterParameter>> = runCatching {
	this.srvNicNetworkFilterParametersFromVm(vmId, nicId).list().send().parameters()
}.onSuccess {
	Term.VM_NIC.logSuccessWithin(Term.NETWORK_FILTER, "목록조회", vmId)
}.onFailure {
	Term.VM_NIC.logFailWithin(Term.NETWORK_FILTER, "목록조회", it, vmId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.VM_NIC, Term.NETWORK_FILTER, "목록조회", vmId, nicId) else it
}

fun Connection.addNicNetworkFilterParameterFromVm(vmId: String, nicId: String, nfp: NetworkFilterParameter): Result<NetworkFilterParameter> = runCatching {
	this.srvNicNetworkFilterParametersFromVm(vmId, nicId).add().parameter(nfp).send().parameter()
}.onSuccess {
	Term.VM_NIC.logSuccessWithin(Term.NETWORK_FILTER, "생성", vmId)
}.onFailure {
	Term.VM_NIC.logFailWithin(Term.NETWORK_FILTER, "생성", it, vmId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.VM_NIC, Term.NETWORK_FILTER, "생성", vmId, nicId) else it
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
	throw if (it is Error) it.toItCloudExceptionWithin(Term.VM, Term.APPLICATION, "목록조회", vmId) else it
}

private fun Connection.srvHostDevicesFromVm(vmId: String): VmHostDevicesService =
	this.srvVm(vmId).hostDevicesService()

fun Connection.findAllHostDevicesFromVm(vmId: String): Result<List<HostDevice>> = runCatching {
	this.srvHostDevicesFromVm(vmId).list().send().device()
}.onSuccess {
	Term.VM.logSuccessWithin(Term.HOST_DEVICES, "목록조회", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.HOST_DEVICES, "목록조회", it, vmId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.VM, Term.HOST_DEVICES, "목록조회", vmId) else it

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
	throw if (it is Error) it.toItCloudExceptionWithin(Term.VM, Term.PERMISSION, "목록조회", vmId) else it
}

// CPU Topology 계산 최적화
fun Vm?.cpuTopologyAll(): Int? {
	val topology = this@cpuTopologyAll?.cpu()?.topology()
	val cores = topology?.coresAsInteger() ?: 0
	val sockets = topology?.socketsAsInteger() ?: 0
	val threads = topology?.threadsAsInteger() ?: 0
	return cores * sockets * threads
}

val Vm?.qualified4ConsoleConnect: Boolean
	get() = this@qualified4ConsoleConnect?.status() == VmStatus.UP ||
		this@qualified4ConsoleConnect?.status() == VmStatus.POWERING_UP ||
		this@qualified4ConsoleConnect?.status() == VmStatus.REBOOT_IN_PROGRESS ||
		this@qualified4ConsoleConnect?.status() == VmStatus.POWERING_DOWN ||
		this@qualified4ConsoleConnect?.status() == VmStatus.PAUSED ||
		this@qualified4ConsoleConnect?.status() == VmStatus.MIGRATING ||
		this@qualified4ConsoleConnect?.status() == VmStatus.SAVING_STATE

val Vm?.isHostedEngineVm: Boolean
	get() = this@isHostedEngineVm?.originPresent() == true &&
		this@isHostedEngineVm.origin() == "managed_hosted_engine"

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
fun Connection.pollVmStatus(vmId: String, expectStatus: VmStatus, interval: Long = 1000L, timeout: Long = 90000L): Boolean {
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

@Throws(InterruptedException::class)
fun Connection.pollNicStatus(
	vmId: String, nicId: String,
	expectPlugged: Boolean,
	interval: Long = 1000L, timeout: Long = 90000L
): Boolean {
	val startTime = System.currentTimeMillis()
	while (true) {
		val currentNic: Nic? = this.findNicFromVm(vmId, nicId).getOrNull()
		val status = currentNic?.plugged() ?: false
		if (status == expectPlugged) {
			log.info("NIC {} 완료...", expectPlugged)
			return true
		} else if (System.currentTimeMillis() - startTime > timeout) {
			log.error("NIC {} 전환 시간 초과", expectPlugged)
			return false
		}
		log.info("NIC 상태: {}", if (status) "PLUGGED" else "UNPLUGGED")
		Thread.sleep(interval)
	}
}
