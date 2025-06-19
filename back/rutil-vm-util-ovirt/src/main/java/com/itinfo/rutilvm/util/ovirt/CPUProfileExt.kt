package com.itinfo.rutilvm.util.ovirt

import com.itinfo.rutilvm.api.ovirt.business.model.Term
import com.itinfo.rutilvm.api.ovirt.business.model.logSuccess
import com.itinfo.rutilvm.api.ovirt.business.model.logFail

import com.itinfo.rutilvm.util.ovirt.error.*

import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.services.AssignedCpuProfilesService
import org.ovirt.engine.sdk4.services.CpuProfileService
import org.ovirt.engine.sdk4.services.CpuProfilesService
import org.ovirt.engine.sdk4.types.CpuProfile

private fun Connection.srvCpuProfiles(): CpuProfilesService =
	systemService.cpuProfilesService()

fun Connection.findAllCpuProfiles(): Result<List<CpuProfile>> = runCatching {
	this.srvCpuProfiles().list().send().profile()
}.onSuccess {
	Term.CPU_PROFILE.logSuccess("목록조회")
}.onFailure {
	Term.CPU_PROFILE.logFail("목록조회", it)
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvCpuProfilesFromCluster(clusterId: String): AssignedCpuProfilesService =
	this.srvCluster(clusterId).cpuProfilesService()

fun Connection.findAllCpuProfilesFromCluster(clusterId: String): Result<List<CpuProfile>> = runCatching {
	checkClusterExists(clusterId)
	this.srvCluster(clusterId).cpuProfilesService().list().send().profiles()
}.onSuccess {
	Term.CPU_PROFILE.logSuccess("목록조회")
}.onFailure {
	Term.CPU_PROFILE.logFail("목록조회", it)
	throw if (it is Error) it.toItCloudException() else it
}


private fun Connection.srvCpuProfile(cpuProfileId: String): CpuProfileService =
	this.systemService.cpuProfilesService().profileService(cpuProfileId)

fun Connection.findCpuProfile(cpuProfileId: String): Result<CpuProfile?> = runCatching {
	this.srvCpuProfile(cpuProfileId).get().send().profile()
}.onSuccess {
	Term.CPU_PROFILE.logSuccess("상세조회")
}.onFailure {
	Term.CPU_PROFILE.logFail("상세조회", it)
	throw if (it is Error) it.toItCloudException() else it
}
