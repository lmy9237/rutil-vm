package com.itinfo.rutilvm.util.ovirt

import com.itinfo.rutilvm.api.ovirt.business.model.Term
import com.itinfo.rutilvm.api.ovirt.business.model.logSuccess
import com.itinfo.rutilvm.api.ovirt.business.model.logFail

import com.itinfo.rutilvm.util.ovirt.error.*

import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.services.VnicProfileService
import org.ovirt.engine.sdk4.services.VnicProfilesService
import org.ovirt.engine.sdk4.types.VnicProfile

private fun Connection.srvVnicProfiles(): VnicProfilesService =
	this.systemService.vnicProfilesService()

fun Connection.findAllVnicProfiles(follow: String = ""): Result<List<VnicProfile>> = runCatching {
	this.srvVnicProfiles().list().apply {
		if(follow.isNotEmpty()) follow(follow)
	}.send().profiles()

}.onSuccess {
	Term.VNIC_PROFILE.logSuccess("목록조회")
}.onFailure {
	Term.VNIC_PROFILE.logFail("목록조회", it)
	throw if (it is Error) it.toItCloudException(Term.VNIC_PROFILE, "목록조회") else it
}

private fun Connection.srvVnicProfile(vnicProfileId: String): VnicProfileService =
	this.srvVnicProfiles().profileService(vnicProfileId)

fun Connection.findVnicProfile(vnicprofileId: String, follow: String = ""): Result<VnicProfile?> = runCatching {
	this.srvVnicProfile(vnicprofileId).get().apply {
		if(follow.isNotEmpty()) follow(follow)
	}.send().profile()

}.onSuccess {
	Term.VNIC_PROFILE.logSuccess("상세조회", vnicprofileId)
}.onFailure {
	Term.VNIC_PROFILE.logFail("상세조회", it, vnicprofileId)
	throw if (it is Error) it.toItCloudException(Term.VNIC_PROFILE, "상세조회", vnicprofileId) else it
}

fun List<VnicProfile>.nameDuplicateVnicProfileName(vnicprofileName: String, vnicprofileId: String? = null): Boolean =
	this.filter { it.id() != vnicprofileId }.any { it.name() == vnicprofileName }

fun Connection.addVnicProfileFromNetwork(networkId: String, vnicprofile: VnicProfile): Result<VnicProfile?> = runCatching {
	checkNetworkExists(networkId)

	if (this.findAllVnicProfiles().getOrDefault(listOf())
			.nameDuplicateVnicProfileName(vnicprofile.name())) {
		throw ErrorPattern.VNIC_PROFILE_DUPLICATE.toError()
	}
	this.srvVnicProfilesFromNetwork(networkId).add().profile(vnicprofile).send().profile()

}.onSuccess {
	Term.VNIC_PROFILE.logSuccess("생성")
}.onFailure {
	Term.VNIC_PROFILE.logFail("생성", it)
	throw if (it is Error) it.toItCloudException(Term.VNIC_PROFILE, "생성") else it
}

fun Connection.updateVnicProfile(vnicprofile: VnicProfile): Result<VnicProfile?> = runCatching {
	if (this.findAllVnicProfiles().getOrDefault(listOf())
			.nameDuplicateVnicProfileName(vnicprofile.name(), vnicprofile.id())) {
		throw ErrorPattern.VNIC_PROFILE_DUPLICATE.toError()
	}

	this.srvVnicProfile(vnicprofile.id()).update().profile(vnicprofile).send().profile()

}.onSuccess {
	Term.VNIC_PROFILE.logSuccess("편집", vnicprofile.id())
}.onFailure {
	Term.VNIC_PROFILE.logFail("편집", it, vnicprofile.id())
	throw if (it is Error) it.toItCloudException(Term.VNIC_PROFILE, "편집", vnicprofile.id()) else it
}

fun Connection.removeVnicProfile(vnicpofileId: String): Result<Boolean> = runCatching {
	this.srvVnicProfile(vnicpofileId).remove().send()
	true

}.onSuccess {
	Term.VNIC_PROFILE.logSuccess("삭제", vnicpofileId)
}.onFailure {
	Term.VNIC_PROFILE.logFail("삭제", it, vnicpofileId)
	throw if (it is Error) it.toItCloudException(Term.VNIC_PROFILE, "삭제", vnicpofileId) else it
}
