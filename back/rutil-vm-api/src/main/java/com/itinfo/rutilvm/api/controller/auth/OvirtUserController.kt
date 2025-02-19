package com.itinfo.rutilvm.api.controller.auth

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.ItCloudOutput
import com.itinfo.rutilvm.api.repository.aaarepository.entity.OvirtUser
import com.itinfo.rutilvm.api.controller.BaseController
import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.model.auth.UserVo
import com.itinfo.rutilvm.api.model.setting.PermissionVo
import com.itinfo.rutilvm.api.service.auth.ItOvirtUserService
import com.itinfo.rutilvm.api.service.auth.ItPermissionService
import com.itinfo.rutilvm.api.service.auth.OvirtUserServiceImpl
import com.itinfo.rutilvm.api.service.auth.OvirtUserServiceImpl.Companion
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern

import io.swagger.annotations.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*

@Controller
@Api(tags = ["User"])
@RequestMapping("/api/v1/auth/users")
class OvirtUserController: BaseController() {
	@Autowired private lateinit var ovirtUser: ItOvirtUserService
	@Autowired private lateinit var permission: ItPermissionService
/*
	@PostMapping
	fun login_check(loginDTO: LoginDTO, model: Model?, httpServletRequest: HttpServletRequest?): String {
		val name: String = userService.login(loginDTO)
		val id: String = loginDTO.getId()

		val systemPropertiesVO: SystemPropertiesVO = this.systemPropertiesService.searchSystemProperties()
		return if (systemPropertiesVO.getId() !== "" && systemPropertiesVO.getPassword() !== "" && systemPropertiesVO.getIp() !== "") {
			"redirect:dashboard"
		} else {
			"redirect:login/loginpage"
		}
	}
*/
	@ApiOperation(
		httpMethod="GET",
		value="사용자 목록조회 (테스트용)",
		notes="사용자 목록조회를 한다.")
	@ApiImplicitParams(
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "성공"),
		ApiResponse(code = 404, message = "찾을 수 없는 사용자")
	)
	@GetMapping
	fun findAll(): ResponseEntity<List<UserVo>> {
		log.info("findAll ... ")
		val res: List<UserVo> = ovirtUser.findAll()
		return ResponseEntity.ok(res)
	}

	@ApiOperation(
		httpMethod="GET",
		value="사용자 단일/상세조회 (테스트용)",
		notes="사용자 단일/상세조회 한다.")
	@ApiImplicitParams(
		ApiImplicitParam(name="username", value="ovirt 사용자 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name="exposeDetail", value="상세정보 표출여부", dataTypeClass=Boolean::class, required=false, paramType="query", defaultValue="false"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "성공"),
		ApiResponse(code = 404, message = "찾을 수 없는 사용자")
	)
	@GetMapping("/{username}")
	fun findOne(
		@PathVariable username: String = "",
		@RequestParam(required=false, defaultValue="false") exposeDetail: String? = "false",
	): ResponseEntity<UserVo?> {
		log.info("findOne ... username: {}, exposeDetail: {}", username, exposeDetail)
		// val res: UserVo? = ovirtUser.findOne(username) // 안됨
		val bExposeDetail: Boolean = exposeDetail?.toBoolean() ?: false
		val res: UserVo? =
			if (bExposeDetail) ovirtUser.findFullDetailByName(username)
			else  ovirtUser.findOne(username)
		return ResponseEntity.ok(res)
	}


	@ApiOperation(
		httpMethod="POST",
		value="아이디/비밀번호 검증",
		notes="사용자의 아이디/비밀번호가 맞는지 확인한다.")
	@ApiImplicitParams(
		ApiImplicitParam(name="username", value="ovirt 사용자 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name="passwordPrompt", value="ovirt 사용자 비밀번호", dataTypeClass=PasswordPrompt::class, required=true, paramType="body"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "성공"),
		ApiResponse(code = 404, message = "찾을 수 없는 사용자")
	)
	@PostMapping("/{username}")
	fun validate(
		@PathVariable username: String = "",
		@RequestBody(required=true) passwordPrompt: PasswordPrompt,
	): ResponseEntity<Boolean> {
		log.info("validate ... username: {}, password: {}", username, passwordPrompt.password)

		if (username.isEmpty()) throw ErrorPattern.OVIRTUSER_ID_NOT_FOUND.toException()
		if (passwordPrompt.password.isEmpty()) throw ErrorPattern.OVIRTUSER_REQUIRED_VALUE_EMPTY.toException()

		val res: HttpHeaders = ovirtUser.authenticate(username, passwordPrompt.password)
		return ResponseEntity(res.isNotEmpty(), res, HttpStatus.OK)
	}
	data class PasswordPrompt(val password: String = "")


	@ApiOperation(
		httpMethod="POST",
		value="계정생성",
		notes="사용자의 계정정보를 생성한다."
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="userCreatePrompt", value="ovirt 사용자 정보", dataTypeClass=UserCreatePrompt::class, required=true, paramType="body"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "성공"),
		ApiResponse(code = 401, message = "인증 불량"),
		ApiResponse(code = 403, message = "중복된 ID의 사용자")
	)
	@PostMapping
	fun add(
		@RequestBody(required=true) userCreatePrompt: UserCreatePrompt,
	):  ResponseEntity<UserVo?> {
		log.info("add ... username: {}", userCreatePrompt.username)
		if (userCreatePrompt.username.isEmpty())			throw ErrorPattern.OVIRTUSER_REQUIRED_VALUE_EMPTY.toException()
		if (userCreatePrompt.password.isEmpty())	        throw ErrorPattern.OVIRTUSER_REQUIRED_VALUE_EMPTY.toException()
		val res: UserVo? = ovirtUser.add(userCreatePrompt.username, userCreatePrompt.password)
		return ResponseEntity.ok(res)
	}
	data class UserCreatePrompt(val username: String = "", val password: String = "")


	@ApiOperation(
		httpMethod="GET",
		value="사용자 권한목록 조회",
		notes="사용자의 권한목록을 조회한다."
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="username", value="ovirt 사용자 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "성공"),
	)
	@GetMapping("/{username}/permissions")
	fun findAllPermissionsFromUser(
		@PathVariable(required=true) username: String = "",
	): ResponseEntity<List<PermissionVo>> {
		log.info("findAllPermissions ... uuid: {}", username)
		if (username.isEmpty())					throw ErrorPattern.OVIRTUSER_ID_NOT_FOUND.toException()
		val res: List<PermissionVo> = permission.findAllFromUser(username)
		return ResponseEntity.ok(res)
	}


	@ApiOperation(
		httpMethod="POST",
		value="사용자 권한등록 (테스트용)",
		notes="사용자의 권한를 등록한다."
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="username", value="ovirt 사용자 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name="permissionName", value="사용자 권한", dataTypeClass=String::class, required=true, paramType="query", defaultValue="SuperUser"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "성공"),
		ApiResponse(code = 401, message = "인증 불량"),
		ApiResponse(code = 403, message = "중복된 ID의 사용자")
	)
	@PostMapping("users/{username}/permissions")
	fun addPermission(
		@PathVariable(required=true) username: String = "",
		@RequestParam(required=false) permissionName: String? = "SuperUser",
	): ResponseEntity<PermissionVo?> {
		log.info("addPermission ... uuid: {}", username)
		if (username.isEmpty())					throw ErrorPattern.OVIRTUSER_ID_NOT_FOUND.toException()
		if (permissionName.isNullOrEmpty())	    throw ErrorPattern.OVIRTUSER_REQUIRED_VALUE_EMPTY.toException()
		val res: PermissionVo? = permission.addFromUser(username, permissionName)
		return ResponseEntity.ok(res)
	}

	@ApiOperation(
		httpMethod="PUT",
		value="비밀번호 변경",
		notes="비밀번호 변경"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="username", value="ovirt 사용자 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name="currentPassword", value="ovirt 사용자 기존 비밀번호", dataTypeClass=String::class, required=true, paramType="query"),
		ApiImplicitParam(name="newPassword", value="ovirt 사용자 신규 비밀번호", dataTypeClass=String::class, required=true, paramType="query"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "성공"),
		ApiResponse(code = 401, message = "인증 불량"),
		ApiResponse(code = 404, message = "찾을 수 없는 사용자")
	)
	@PutMapping("{username}")
	fun changePassword(
		@PathVariable(required=true) username: String = "",
		@RequestParam(required=true) currentPassword: String? = null,
		@RequestParam(required=true) newPassword: String? = null,
	):  ResponseEntity<OvirtUser> {
		log.info("changePassword ... username: {}", username)
		if (username.isEmpty())					throw ErrorPattern.OVIRTUSER_ID_NOT_FOUND.toException()
		if (currentPassword.isNullOrEmpty())	throw ErrorPattern.OVIRTUSER_REQUIRED_VALUE_EMPTY.toException()
		if (newPassword.isNullOrEmpty())		throw ErrorPattern.OVIRTUSER_REQUIRED_VALUE_EMPTY.toException()
		val res: OvirtUser = ovirtUser.changePassword(username, currentPassword, newPassword)
		return ResponseEntity.ok(res)
	}

	@ApiOperation(
		httpMethod="DELETE",
		value="사용자 삭제",
		notes="사용자 삭제"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="username", value="ovirt 사용자 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "성공"),
		ApiResponse(code = 401, message = "인증 불량"),
		ApiResponse(code = 404, message = "찾을 수 없는 사용자")
	)
	@DeleteMapping("{username}")
	fun remove(
		@PathVariable username: String = "",
	): ResponseEntity<Boolean> {
		log.info("remove ... username: {}", username)
		val res: Boolean = ovirtUser.remove(username)
		return ResponseEntity.ok(res)
	}

	@GetMapping("password/{input}")
	fun spitPasswordEncoded(
		@PathVariable input: String = ""
	): ResponseEntity<ItCloudOutput> {
		log.info("spitPasswordEncoded ... input: {}", input)
		val res: String = ovirtUser.findEncryptedValue(input)
		return ResponseEntity.ok(ItCloudOutput(res))
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
