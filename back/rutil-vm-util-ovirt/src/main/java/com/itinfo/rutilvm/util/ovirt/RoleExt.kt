package com.itinfo.rutilvm.util.ovirt

import com.itinfo.rutilvm.api.ovirt.business.model.Term
import com.itinfo.rutilvm.api.ovirt.business.model.logSuccess
import com.itinfo.rutilvm.api.ovirt.business.model.logFail

import com.itinfo.rutilvm.util.ovirt.error.*

import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.services.RoleService
import org.ovirt.engine.sdk4.services.RolesService
import org.ovirt.engine.sdk4.types.Role

private fun Connection.srvRoles(): RolesService =
	this.systemService.rolesService()

fun Connection.findAllRoles(follow: String = ""): Result<List<Role>> = runCatching {
	if (follow.isNotEmpty())
		srvRoles().list().follow(follow).send().roles()
	else
		srvRoles().list().send().roles()
}.onSuccess {
	Term.ROLE.logSuccess("목록조회")
}.onFailure {
	Term.ROLE.logFail("목록조회", it)
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvRole(roleId: String): RoleService =
	this.srvRoles().roleService(roleId)

fun Connection.findRole(roleId: String): Result<Role?> = runCatching {
	this.srvRole(roleId).get().send().role()
}.onSuccess {
	Term.ROLE.logSuccess("상세조회")
}.onFailure {
	Term.ROLE.logFail("상세조회", it)
	throw if (it is Error) it.toItCloudException() else it
}
