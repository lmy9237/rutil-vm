package com.itinfo.service.impl

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.findAllPermissions
import com.itinfo.findAllRoles

import com.itinfo.addUser
import com.itinfo.addPermission
import com.itinfo.removePermission

import com.itinfo.service.SystemPermissionsService
import com.itinfo.service.engine.ConnectionService

import com.itinfo.model.PermissionVo
import com.itinfo.model.toPermissionVos
import com.itinfo.model.permission2Add
import com.itinfo.model.RoleVo
import com.itinfo.model.toRoleVos
import com.itinfo.model.UserVo
import com.itinfo.model.user2Add

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

/**
 * [SystemPermissionsServiceImpl]
 * 시스템 권한 관리 서비스 응용
 *
 * @author chlee
 * @since 2023.12.07
 */
@Service
class SystemPermissionsServiceImpl : SystemPermissionsService {
	@Autowired private lateinit var connectionService: ConnectionService

	/**
	 * [SystemPermissionsService.fetchSystemPermissions]
	 */
	override fun fetchSystemPermissions(): List<PermissionVo> {
		log.info("... retrieveSystemPermissions")
		val c = connectionService.getConnection()
		val permissions = c.findAllPermissions()
		return permissions.toPermissionVos(c)
	}

	/**
	 * [SystemPermissionsService.fetchRoles]
	 */
	override fun fetchRoles(): List<RoleVo> {
		log.info("... retrieveRoles")
		val c = connectionService.getConnection()
		val roles = c.findAllRoles()
		return roles.toRoleVos()
	}

	/**
	 * [SystemPermissionsService.addSystemPermissions]
	 */
	override fun addSystemPermissions(users: List<UserVo>) {
		log.info("... addSystemPermissions[${users.size}]")
		val c = connectionService.getConnection()
		users.filter { it.roleId.isNotEmpty() }.forEach { user: UserVo ->
			log.debug("adding user: $user ... ")
			val user2Add = user.user2Add()
			val p2Add = user.permission2Add()
			c.addUser(user2Add)
			c.addPermission(p2Add)
		}
	}

	/**
	 * [SystemPermissionsService.removeSystemPermissions]
	 */
	override fun removeSystemPermissions(permissions: List<PermissionVo>) {
		log.info("... removeSystemPermissions[${permissions.size}]")
		val c = connectionService.getConnection()
		permissions.forEach { permission: PermissionVo ->
			log.debug("removing permission: $permission ... ")
			c.removePermission(permission.id)
		}
	}

	companion object {
		private val log by LoggerDelegate()
	}
}

