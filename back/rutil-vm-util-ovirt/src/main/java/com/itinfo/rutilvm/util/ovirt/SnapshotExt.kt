package com.itinfo.rutilvm.util.ovirt

import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern
import com.itinfo.rutilvm.util.ovirt.error.toError
import com.itinfo.rutilvm.util.ovirt.error.toItCloudException
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.services.SnapshotDisksService
import org.ovirt.engine.sdk4.services.SnapshotNicsService
import org.ovirt.engine.sdk4.services.SnapshotService
import org.ovirt.engine.sdk4.services.SnapshotsService
import org.ovirt.engine.sdk4.types.Disk
import org.ovirt.engine.sdk4.types.Nic
import org.ovirt.engine.sdk4.types.Snapshot
import org.ovirt.engine.sdk4.types.SnapshotStatus
import org.ovirt.engine.sdk4.types.Vm

private fun Connection.srvSnapshotsFromVm(vmId: String): SnapshotsService =
	this.srvVm(vmId).snapshotsService()

fun Connection.findAllSnapshotsFromVm(vmId: String, follow: String = ""): Result<List<Snapshot>> = runCatching {
	checkVmExists(vmId)

	srvSnapshotsFromVm(vmId).list().apply {
		if (follow.isNotEmpty()) follow(follow)
	}.send().snapshots()

}.onSuccess {
	Term.VM.logSuccessWithin(Term.SNAPSHOT, "목록조회", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.SNAPSHOT, "목록조회", it, vmId)
	throw if (it is Error) it.toItCloudException() else it}

private fun Connection.srvSnapshotFromVm(vmId: String, snapshotId: String): SnapshotService =
	this.srvSnapshotsFromVm(vmId).snapshotService(snapshotId)

fun Connection.findSnapshotFromVm(vmId: String, snapshotId: String, follow: String = ""): Result<Snapshot?> = runCatching {
	checkVmExists(vmId)

	this.srvSnapshotFromVm(vmId, snapshotId).get().apply {
		if (follow.isNotEmpty()) follow(follow)
	}.send().snapshot()
}.onSuccess {
	Term.VM.logSuccessWithin(Term.SNAPSHOT, "상세조회", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.SNAPSHOT, "상세조회", it, vmId)
	throw if (it is Error) it.toItCloudException() else it

}

fun Connection.addSnapshotFromVm(vmId: String, snapshot: Snapshot): Result<Boolean> = runCatching {
	checkVmExists(vmId)

	val snapshotAdded: Snapshot? =
		this.srvSnapshotsFromVm(vmId).add().snapshot(snapshot).send().snapshot()

	// this.expectSnapshotStatusFromVm(vmId, snapshotAdded.id(), SnapshotStatus.OK)
	snapshotAdded ?: throw ErrorPattern.SNAPSHOT_NOT_FOUND.toError()
	true
}.onSuccess {
	Term.VM.logSuccessWithin(Term.SNAPSHOT, "생성", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.SNAPSHOT, "생성", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.removeSnapshotFromVm(vmId: String, snapshotId: String): Result<Boolean> = runCatching {
	this.srvSnapshotFromVm(vmId, snapshotId).remove().send()
	// if (!this@removeSnapshotFromVm.isSnapshotDeletedFromVm(vmId, snapshotId))
	// 	return Result.failure(Error("스냅샷 삭제 시간 초과"))
	true
}.onSuccess {
	Term.VM.logSuccessWithin(Term.SNAPSHOT, "삭제", snapshotId)
}.onFailure {
	Term.VM.logFailWithin(Term.SNAPSHOT, "삭제", it, snapshotId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.removeMultiSnapshotFromVm(vmId: String, snapshotIds: List<String>): Result<Boolean> = runCatching {
	val results = snapshotIds.map { removeSnapshotFromVm(vmId, it) }
	val allSuccessful = results.all { it.isSuccess }

	if (!allSuccessful) {
		val failedResults = results.filter { it.isFailure }
		log.warn("일부 스냅샷 삭제 실패: ${failedResults.size}개")
	}
	allSuccessful
}.onSuccess {
	Term.VM.logSuccessWithin(Term.SNAPSHOT, "삭제", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.SNAPSHOT, "삭제", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.previewSnapshotFromVm(vmId: String, snapshot: Snapshot/*, restoreMemory: Boolean*/): Result<Boolean> = runCatching {
	this.srvVm(vmId).previewSnapshot()/*.restoreMemory(restoreMemory)*/.snapshot(snapshot).send()
	true

}.onSuccess {
	Term.VM.logSuccessWithin(Term.SNAPSHOT, "미리보기", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.SNAPSHOT, "미리보기", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.commitSnapshotFromVm(vmId: String): Result<Boolean> = runCatching {
	this.srvVm(vmId).commitSnapshot().send()
	true

}.onSuccess {
	Term.VM.logSuccessWithin(Term.SNAPSHOT, "커밋", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.SNAPSHOT, "커밋", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.undoSnapshotFromVm(vmId: String): Result<Boolean> = runCatching {
	this.srvVm(vmId).undoSnapshot().send()
	true

}.onSuccess {
	Term.VM.logSuccessWithin(Term.SNAPSHOT, "되돌리기", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.SNAPSHOT, "되돌리기", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.cloneSnapshotFromVm(vmId: String, vm: Vm): Result<Boolean> = runCatching {
	this.srvVm(vmId).clone_().vm(vm).send()
	true

}.onSuccess {
	Term.VM.logSuccessWithin(Term.SNAPSHOT, "복제", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.SNAPSHOT, "복제", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvSnapshotDisksFromVm(vmId: String, snapshotId: String): SnapshotDisksService =
	this.srvSnapshotFromVm(vmId, snapshotId).disksService()

fun Connection.findAllSnapshotDisksFromVm(vmId: String, snapshotId: String): Result<List<Disk>> = runCatching {
	this.srvSnapshotDisksFromVm(vmId, snapshotId).list().send().disks()

}.onSuccess {
	Term.VM.logSuccessWithin(Term.SNAPSHOT, "디스크 목록조회", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.SNAPSHOT, "디스크 목록조회", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvSnapshotNicsFromVm(vmId: String, snapshotId: String): SnapshotNicsService =
	this.srvSnapshotFromVm(vmId, snapshotId).nicsService()

fun Connection.findAllSnapshotNicsFromVm(vmId: String, snapshotId: String): Result<List<Nic>> = runCatching {
	this.srvSnapshotNicsFromVm(vmId, snapshotId).list().send().nics()
}.onSuccess {
	Term.VM.logSuccessWithin(Term.SNAPSHOT, "NIC 목록조회", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.SNAPSHOT, "NIC 목록조회", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}


/**
 * [Connection.expectSnapshotStatusFromVm]
 * 스냅샷 상태
 *
 * @param expectStatus
 * @param interval
 * @param timeout
 * @return
 * @throws InterruptedException
 */
@Throws(InterruptedException::class)
fun Connection.expectSnapshotStatusFromVm(vmId: String, snapshotId: String, expectStatus: SnapshotStatus = SnapshotStatus.OK, timeout: Long = 90000L, interval: Long = 1000L): Boolean {
	val startTime = System.currentTimeMillis()
	while (true) {
		val snapshot: Snapshot? = this@expectSnapshotStatusFromVm.findSnapshotFromVm(vmId, snapshotId).getOrNull()
		val status: SnapshotStatus = snapshot?.snapshotStatus() ?: SnapshotStatus.LOCKED

		if (status == expectStatus)
			return true
		else if (System.currentTimeMillis() - startTime > timeout)
			return false

		log.info("스냅샷 상태: {}", status)
		Thread.sleep(interval)
	}
}

/**
 * [Connection.isSnapshotDeletedFromVm]
 * 스냅샷 삭제 확인
 *
 * @param snapshotId
 * @param interval
 * @param timeout
 * @return
 * @throws InterruptedException
 */
@Throws(InterruptedException::class)
fun Connection.isSnapshotDeletedFromVm(vmId: String, snapshotId: String, timeout: Long = 60000L, interval: Long = 1000L): Boolean {
	val startTime = System.currentTimeMillis()
	while (true) {
		val snapshots: List<Snapshot> = this@isSnapshotDeletedFromVm.findAllSnapshotsFromVm(vmId).getOrDefault(listOf())
		val snapshotExists: Boolean = snapshots.any { it.id() == snapshotId }
		if (!snapshotExists) {
			log.info("스냅샷이 존재하지 않음 = 삭제됨")
			return true
		} else if (System.currentTimeMillis() - startTime > timeout) {
			val desc: String = this@isSnapshotDeletedFromVm.findSnapshotFromVm(vmId, snapshotId).getOrNull()?.description() ?: ""
			log.error("스냅샷 삭제중: {}", desc)
			return false // 타임아웃
		}
		log.info("스냅샷 삭제 진행 중: $snapshotId")
		Thread.sleep(interval)
	}
}
