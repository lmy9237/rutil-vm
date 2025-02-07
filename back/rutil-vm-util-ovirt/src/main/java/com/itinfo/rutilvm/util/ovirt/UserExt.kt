package com.itinfo.rutilvm.util.ovirt

import com.itinfo.rutilvm.util.ovirt.error.*

import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.services.*
import org.ovirt.engine.sdk4.types.Permission
import org.ovirt.engine.sdk4.types.Role
import org.ovirt.engine.sdk4.types.User

private fun Connection.srvUsers(): UsersService =
	systemService().usersService()

fun Connection.findAllUsers(follow: String = ""): Result<List<User>> = runCatching {
	if (follow.isNotEmpty())
		this.srvUsers().list().follow(follow).send().users()
	else
		this.srvUsers().list().send().users()
}.onSuccess {
	Term.USER.logSuccess("목록조회")
}.onFailure {
	Term.USER.logFail("목록조회", it)
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvUser(userId: String): UserService =
	this.srvUsers().userService(userId)

fun Connection.findUser(userId: String): Result<User?> = runCatching {
	this.srvUser(userId).get().send().user()
}.onSuccess {
	Term.USER.logSuccess("상세조회")
}.onFailure {
	Term.USER.logFail("상세조회", it)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.addUser(user: User): Result<User?> = runCatching {
	this.srvUsers().add().user(user).send().user()
}.onSuccess {
	Term.USER.logSuccess("생성")
}.onFailure {
	Term.USER.logFail("생성", it)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.srvAssignedPermissionsFromUser(userId: String): AssignedPermissionsService =
	this.srvUser(userId).permissionsService()

fun Connection.findAllAssignedPermissionsFromUser(userId: String): Result<List<Permission>> = runCatching {
	this.srvAssignedPermissionsFromUser(userId).list().send().permissions()
}.onSuccess {
	Term.USER.logSuccessWithin(Term.PERMISSION, "목록조회", userId)
}.onFailure {
	Term.USER.logFailWithin(Term.PERMISSION, "목록조회", it, userId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.addPermissionFromUser(userId: String, permission: Permission): Result<Permission?> = runCatching {
	this.srvAssignedPermissionsFromUser(userId).add().permission(permission).send().permission()
}.onSuccess {
	Term.USER.logSuccessWithin(Term.PERMISSION, "생성", userId)
}.onFailure {
	Term.USER.logFailWithin(Term.PERMISSION, "생성", it, userId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.srvAssignedPermissionFromUser(userId: String, permissionId: String): PermissionService =
	this.srvAssignedPermissionsFromUser(userId).permissionService(permissionId)

fun Connection.findAssignedPermissionFromUser(userId: String, permissionId: String): Result<Permission?> = runCatching {
	this.srvAssignedPermissionFromUser(userId, permissionId).get().send().permission()
}.onSuccess {
	Term.USER.logSuccessWithin(Term.PERMISSION, "상세조회", userId)
}.onFailure {
	Term.USER.logFailWithin(Term.PERMISSION, "상세조회", it, userId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.removeAssignedPermissionFromUser(userId: String, permissionId: String): Result<Boolean> = runCatching {
	this.srvAssignedPermissionFromUser(userId, permissionId).remove().send()
	true
}.onSuccess {
	Term.USER.logSuccessWithin(Term.PERMISSION, "삭제", userId)
}.onFailure {
	Term.USER.logFailWithin(Term.PERMISSION, "삭제", it, userId)
	throw if (it is Error) it.toItCloudException() else it
}


fun Connection.srvAssignedRolesFromUser(userId: String): AssignedRolesService =
	this.srvUser(userId).rolesService()

fun Connection.findAllAssignedRolesFromUser(userId: String): Result<List<Role>> = runCatching {
	this.srvAssignedRolesFromUser(userId).list().send().roles()
}.onSuccess {
	Term.USER.logSuccessWithin(Term.ROLE, "목록조회", userId)
}.onFailure {
	Term.USER.logFailWithin(Term.ROLE, "목록조회", it, userId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.srvAssignedRoleFromUser(userId: String, roleId: String): RoleService =
	this.srvAssignedRolesFromUser(userId).roleService(roleId)

fun Connection.findAssignedRoleFromUser(userId: String, roleId: String): Result<Role?> = runCatching {
	this.srvAssignedRoleFromUser(userId, roleId).get().send().role()
}.onSuccess {
	Term.USER.logSuccessWithin(Term.PERMISSION, "상세조회", userId)
}.onFailure {
	Term.USER.logFailWithin(Term.PERMISSION, "상세조회", it, userId)
	throw if (it is Error) it.toItCloudException() else it
}