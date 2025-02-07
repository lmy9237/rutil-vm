package com.itinfo.service

import com.itinfo.model.PermissionVo
import com.itinfo.model.RoleVo
import com.itinfo.model.UserVo

/**
 * [SystemPermissionsService]
 * 시스템 권한 관리 서비스
 *
 * @author chlee
 * @since 2023.12.07
 */
interface SystemPermissionsService {
	/**
	 * [SystemPermissionsService.fetchSystemPermissions]
	 */
	fun fetchSystemPermissions(): List<PermissionVo>

	/**
	 * [SystemPermissionsService.fetchRoles]
	 */
	fun fetchRoles(): List<RoleVo>

	/**
	 * [SystemPermissionsService.addSystemPermissions]
	 */
	fun addSystemPermissions(users: List<UserVo>)

	/**
	 * [SystemPermissionsService.removeSystemPermissions]
	 */
	fun removeSystemPermissions(permissions: List<PermissionVo>)
}
