package com.itinfo.rutilvm.util.ovirt

import com.itinfo.rutilvm.util.ovirt.error.*

import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.services.GroupService
import org.ovirt.engine.sdk4.services.GroupsService
import org.ovirt.engine.sdk4.types.Group

private fun Connection.srvGroups(): GroupsService =
	this.systemService.groupsService()

fun Connection.findAllGroups(follow: String): Result<List<Group>> = runCatching {
	this.srvGroups().list().apply {
		if (follow.isNotEmpty()) follow(follow)
	}.send().groups()
	// if (follow.isNotEmpty())
	// 	this.srvGroups().list().follow(follow).send().groups()
	// else
	// 	this.srvGroups().list().send().groups()
}.onSuccess {
	Term.GROUP.logSuccess("목록조회")
}.onFailure {
	Term.GROUP.logFail("목록조회", it)
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvGroup(groupId: String): GroupService =
	this.srvGroups().groupService(groupId)

fun Connection.findGroup(groupId: String): Result<Group?> = runCatching {
	this.srvGroup(groupId).get().send().get()
}.onSuccess {
	Term.GROUP.logSuccess("상세조회", groupId)
}.onFailure {
	Term.GROUP.logFail("상세조회", it, groupId)
	throw if (it is Error) it.toItCloudException() else it
}
