package com.itinfo.rutilvm.api.controller.auth

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.ItCloudOutput
import com.itinfo.rutilvm.api.configuration.PropertiesConfig
import com.itinfo.rutilvm.api.repository.aaarepository.entity.OvirtUser
import com.itinfo.rutilvm.api.controller.BaseController
import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.model.auth.UserVo
import com.itinfo.rutilvm.api.model.auth.PasswordPrompt
import com.itinfo.rutilvm.api.model.auth.ResetPasswordPrompt
import com.itinfo.rutilvm.api.model.setting.PermissionVo
import com.itinfo.rutilvm.api.service.auth.ItOvirtUserService
import com.itinfo.rutilvm.api.service.auth.ItPermissionService
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
		return ResponseEntity.ok(res.isNotEmpty())
	}

	@ApiOperation(
		httpMethod="POST",
		value="계정생성",
		notes="사용자의 계정정보를 생성한다."
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="userVo", value="ovirt 사용자 정보", dataTypeClass=UserVo::class, required=true, paramType="body"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "성공"),
		ApiResponse(code = 401, message = "인증 불량"),
		ApiResponse(code = 403, message = "중복된 ID의 사용자")
	)
	@PostMapping
	fun add(
		@RequestBody(required=true) userVo: UserVo,
	):  ResponseEntity<UserVo?> {
		log.info("add ... userVo: {}", userVo)
		if (userVo.username.isEmpty())			throw ErrorPattern.OVIRTUSER_REQUIRED_VALUE_EMPTY.toException()
		if (userVo.password.isEmpty())	        throw ErrorPattern.OVIRTUSER_REQUIRED_VALUE_EMPTY.toException()
		if (userVo.firstName.isEmpty())	        throw ErrorPattern.OVIRTUSER_REQUIRED_VALUE_EMPTY.toException()
		if (userVo.surName.isEmpty())	        throw ErrorPattern.OVIRTUSER_REQUIRED_VALUE_EMPTY.toException()
		val res: UserVo? = ovirtUser.add(userVo)
		return ResponseEntity.ok(res)
	}


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
		ApiImplicitParam(name="username", value="oVirt 사용자 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name="resetPassword", value="oVirt 사용자 비밀번호 변경 서식", dataTypeClass=ResetPasswordPrompt::class, required=true, paramType="body"),
		ApiImplicitParam(name="force", value="비밀번호 강제변경여부", dataTypeClass=Boolean::class, required=false, paramType="query"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "성공"),
		ApiResponse(code = 401, message = "인증 불량"),
		ApiResponse(code = 404, message = "찾을 수 없는 사용자")
	)
	@PutMapping("{username}/password")
	fun password(
		@PathVariable(required=true) username: String = "",
		@RequestBody(required=true) resetPassword: ResetPasswordPrompt? = null,
		@RequestParam(required=false) force: Boolean = false,
	):  ResponseEntity<OvirtUser> {
		log.info("password ... username: {}", username)
		if (username.isEmpty())					throw ErrorPattern.OVIRTUSER_ID_NOT_FOUND.toException()
		if (resetPassword?.pwCurrent.isNullOrEmpty())		throw ErrorPattern.OVIRTUSER_REQUIRED_VALUE_EMPTY.toException()
		if (!force && resetPassword?.pwCurrent.isNullOrEmpty())	throw ErrorPattern.OVIRTUSER_REQUIRED_VALUE_EMPTY.toException()
		val res: OvirtUser = ovirtUser.updatePassword(username, resetPassword, force)
		return ResponseEntity.ok(res)
	}

	@ApiOperation(
		httpMethod="PUT",
		value="사용자 상세정보 변경",
		notes="사용자 상세정보 변경"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="username", value="ovirt 사용자 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name="userVo", value="사용자 정보", dataTypeClass=UserVo::class, required=true, paramType="body"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "성공"),
		ApiResponse(code = 401, message = "인증 불량"),
		ApiResponse(code = 404, message = "찾을 수 없는 사용자")
	)
	@PutMapping("{username}")
	fun update(
		@PathVariable(required=true) username: String = "",
		@RequestBody(required=true) userVo: UserVo? = null,
	):  ResponseEntity<UserVo?> {
		log.info("update ... username: {}", username)
		if (username.isEmpty())					throw ErrorPattern.OVIRTUSER_ID_NOT_FOUND.toException()
		if (userVo == null)						throw ErrorPattern.OVIRTUSER_REQUIRED_VALUE_EMPTY.toException()
		val res: UserVo? = ovirtUser.update(username, userVo)
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
