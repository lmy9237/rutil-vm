package com.itinfo.rutilvm.util.ovirt

import com.itinfo.rutilvm.api.ovirt.business.model.Term
import com.itinfo.rutilvm.api.ovirt.business.model.logSuccess
import com.itinfo.rutilvm.api.ovirt.business.model.logSuccessWithin
import com.itinfo.rutilvm.api.ovirt.business.model.logFail
import com.itinfo.rutilvm.api.ovirt.business.model.logFailWithin

import com.itinfo.rutilvm.util.ovirt.error.*

import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.services.DiskProfileService
import org.ovirt.engine.sdk4.services.DiskProfilesService
import org.ovirt.engine.sdk4.types.DiskProfile

private fun Connection.srvDiskProfiles(): DiskProfilesService =
	systemService.diskProfilesService()

fun Connection.findAllDiskProfiles(): Result<List<DiskProfile>> = runCatching {
	this.srvDiskProfiles().list().send().profile()
}.onSuccess {
	Term.DISK_PROFILE.logSuccess("목록조회")
}.onFailure {
	Term.DISK_PROFILE.logFail("목록조회")
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvDiskProfile(diskProfileId: String): DiskProfileService =
	this.srvDiskProfiles().diskProfileService(diskProfileId)

fun Connection.findDiskProfile(diskProfileId: String): Result<DiskProfile?> = runCatching {
	this.srvDiskProfile(diskProfileId).get().send().profile()
}.onSuccess {
	Term.DISK_PROFILE.logSuccess("상세조회")
}.onFailure {
	Term.DISK_PROFILE.logFail("상세조회")
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.addDiskProfile(diskProfile: DiskProfile): Result<DiskProfile?> = runCatching {
	val diskProfileAdd: DiskProfile? =
		this.srvDiskProfiles().add().profile(diskProfile).send().profile()

	diskProfileAdd ?: throw ErrorPattern.DISK_PROFILE_NOT_FOUND.toError()
}.onSuccess {
	Term.DISK_PROFILE.logSuccess("생성")
}.onFailure {
	Term.DISK_PROFILE.logFail("생성", it)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.updateDiskProfile(diskProfile: DiskProfile): Result<DiskProfile?> = runCatching {
	val diskProfileUpdate: DiskProfile? =
		this.srvDiskProfile(diskProfile.id()).update().profile(diskProfile).send().profile()

	diskProfileUpdate ?: throw ErrorPattern.DISK_PROFILE_NOT_FOUND.toError()
}.onSuccess {
	Term.DISK_PROFILE.logSuccess("편집")
}.onFailure {
	Term.DISK_PROFILE.logFail("편집", it)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.removeDiskProfile(diskProfileId: String): Result<Boolean> = runCatching {
	if(this.findDiskProfile(diskProfileId).isFailure){
		throw ErrorPattern.DISK_PROFILE_NOT_FOUND.toError()
	}
	this.srvDiskProfile(diskProfileId).remove().send()
	true
}.onSuccess {
	Term.DISK_PROFILE.logSuccess("삭제")
}.onFailure {
	Term.DISK_PROFILE.logFail("삭제", it)
	throw if (it is Error) it.toItCloudException() else it
}
