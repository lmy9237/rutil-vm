package com.itinfo.controller

import com.itinfo.ItInfoConstant
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.model.PermissionVo
import com.itinfo.model.RoleVo
import com.itinfo.model.UserVo
import com.itinfo.service.SystemPermissionsService
import com.itinfo.service.UsersService

import io.swagger.annotations.*

import org.json.simple.JSONObject

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController


/**
 * [SystemPermissionsController]
 * 시스템 권한
 *
 * @author chlee
 * @since 2023.12.24
 */
@RestController
@RequestMapping("admin")
@Api(value="SystemPermissionsController", tags=["system-permissions"])
class SystemPermissionsController {
	@Autowired private lateinit var systemPermissionsService: SystemPermissionsService
	@Autowired private lateinit var usersService: UsersService


	@ApiOperation(httpMethod="GET", value="retrieveSystemPermissions", notes="시스템 권한 목록 조회")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("systemPermissions/retrieveSystemPermissions")
	fun retrieveSystemPermissions(): JSONObject {
		log.info("retrieveSystemPermissions ...")
		val permissions: List<PermissionVo> =
			systemPermissionsService.fetchSystemPermissions()
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = permissions
		}
	}

	@ApiOperation(httpMethod="GET", value="retrieveRoles", notes="역할 목록 조회")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/systemPermissions/retrieveRoles")
	fun retrieveRoles(): JSONObject {
		log.info("retrieveRoles ...")
		val roles: List<RoleVo> =
			systemPermissionsService.fetchRoles()
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = roles
		}
	}

	@ApiOperation(httpMethod="GET", value="retrieveAllUsers", notes="사용자 목록 조회")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/users/retrieveAllUsers")
	fun retrieveAllUsers(): JSONObject {
		log.info("retrieveAllUsers ...")
		val users: List<UserVo> =
			usersService.fetchUsers()
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = users
		}
	}

	@ApiOperation(httpMethod="POST", value="addSystemPermissions", notes="시스템 권한 등록")
	@ApiImplicitParams(
		ApiImplicitParam(name="users", value="등록대상 사용자", paramType="body", dataTypeClass=Array<String>::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("/systemPermissions/addSystemPermissions")
	fun addSystemPermissions(
		@RequestBody users: List<UserVo>
	): JSONObject {
		log.info("addSystemPermissions[${users.size}] ...")
		systemPermissionsService.addSystemPermissions(users)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = "OK"
		}
	}

	@ApiOperation(httpMethod="POST", value="removeSystemPermissions", notes="시스템 권한 삭제")
	@ApiImplicitParams(
		ApiImplicitParam(name="permissions", value="제거대상 권한", required=true, paramType="body", dataTypeClass=Array<PermissionVo>::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("/systemPermissions/removeSystemPermissions")
	fun removeSystemPermissions(
		@RequestBody permissions: List<PermissionVo>
	): JSONObject {
		log.info("removeSystemPermissions[${permissions.size}] ...")
		systemPermissionsService.removeSystemPermissions(permissions)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = "OK"
		}
	}
	
	companion object {
		private val log by LoggerDelegate()
	}
}