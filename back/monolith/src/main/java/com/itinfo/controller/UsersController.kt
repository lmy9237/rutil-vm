package com.itinfo.controller

import com.itinfo.ItInfoConstant
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.model.UserVo
import com.itinfo.security.validatePassword
import com.itinfo.service.UsersService

import io.swagger.annotations.*

import org.json.simple.JSONObject
import org.postgresql.util.PSQLException

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("admin/users")
@Api(value="UsersController", tags=["users"])
class UsersController {
	@Autowired private lateinit var usersService: UsersService

	@ApiOperation(httpMethod="GET", value="retrieveUsers", notes="사용자 목록 조회")
	@ApiImplicitParams
	@ApiResponses(ApiResponse(code=200, message="OK"))
	@GetMapping("/retrieveUsers")
	@ResponseBody
	fun retrieveUsers(): JSONObject {
		log.info("... retrieveUsers")
		val users: List<UserVo> = try {
			usersService.fetchUsers()
		} catch (e: PSQLException) {
			log.error(e.localizedMessage)
			listOf()
		}
		// TODO: 예외가 발생했을 경우 에러메세지 보내기
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = users
		}
	}

	@ApiOperation(httpMethod="GET", value="retrieveUser", notes="사용자 상세 조회")
	@ApiImplicitParams(
		ApiImplicitParam(name="id", value="사용자 ID", paramType="query", dataTypeClass=String::class)
	)
	@ApiResponses(ApiResponse(code=200, message="OK"))
	@GetMapping("/retrieveUser")
	@ResponseBody
	fun retrieveUser(
		@RequestParam(name="id") id: String
	): JSONObject {
		log.info("... retrieveUser('$id')")
		val user: UserVo? = try {
			usersService.fetchUser(id)
		} catch (e: PSQLException) {
			log.error(e.localizedMessage)
			null
		}
		// TODO: 예외가 발생했을 경우 에러메세지 보내기 (관리자에게 문의)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = user
		}
	}

	@ApiOperation(httpMethod="POST", value="removeUsers", notes="사용자 삭제")
	@ApiImplicitParams(
		ApiImplicitParam(name="users", value="사용자 (여러개)", paramType="body", dataTypeClass=Array<UserVo>::class)
	)
	@ApiResponses(ApiResponse(code=200, message="OK"))
	@PostMapping("/removeUsers")
	@ResponseBody
	fun removeUsers(
		@RequestBody users: List<UserVo>
	): JSONObject {
		log.info("... removeUsers[${users.size}]")
		val count: Int = try {
			usersService.removeUsers(users)
		} catch (e: PSQLException) {
			log.error(e.localizedMessage)
			-1
		}
		// TODO: 예외가 발생했을 경우 에러메세지 보내기 (관리자에게 문의)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = count
		}
	}

	@ApiOperation(httpMethod="POST", value="updateUser", notes="사용자 정보 편집")
	@ApiImplicitParams(
		ApiImplicitParam(name="user", value="편집할 사용자 정보", paramType="body", dataTypeClass=UserVo::class)
	)
	@ApiResponses(ApiResponse(code=200, message="OK"))
	@PostMapping("/updateUser")
	@ResponseBody
	fun updateUser(@RequestBody user: UserVo): JSONObject {
		log.info("... updateUser")
		val count: Int = try {
			usersService.updateUser(user)
		} catch (e: PSQLException) {
			log.error(e.localizedMessage)
			-1
		}
		// TODO: 예외가 발생했을 경우 에러메세지 보내기 (관리자에게 문의)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = count
		}
	}

	@ApiOperation(httpMethod="POST", value="addUser", notes="사용자 등록")
	@ApiImplicitParams(
		ApiImplicitParam(name="user", value="등록할 사용자 정보", paramType="body", dataTypeClass=UserVo::class)
	)
	@ApiResponses(ApiResponse(code=200, message="OK"))
	@PostMapping("/addUser")
	@ResponseBody
	fun addUser(
		@RequestBody user: UserVo
	): JSONObject {
		log.info("... addUser")
		// if (Base64.isArrayByteBase64(user.password.toByteArray()))
		//		user.password = user.password.decodeBase64()
		log.debug("user's password")
		val _count: Int =
			if (usersService.isExistUser(user)) 0
			else usersService.addUser(user)

		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = _count
		}
	}

	@ApiOperation(httpMethod="POST", value="updatePassword", notes="사용자 비밀번호 갱신")
	@ApiImplicitParams(
		ApiImplicitParam(name="user", value="갱신할 사용자 정보", paramType="body", dataTypeClass=UserVo::class)
	)
	@ApiResponses(ApiResponse(code=200, message="OK"))
	@PostMapping("/updatePassword")
	@ResponseBody
	fun updatePassword(
		@RequestBody user: UserVo
	): JSONObject {
		log.info("... updatePassword")
		val passwordEnc = usersService.login(user.username)
//		if (Base64.isArrayByteBase64(user.password.toByteArray()))
//			user.password = user.password.decodeBase64()
		log.debug("user's password: $passwordEnc")
		// TODO: 사용자 생성법 찾아 구현
		val json = JSONObject()
		if (user.password.validatePassword(passwordEnc)) {
//			if (Base64.isArrayByteBase64(user.newPassword.toByteArray()))
//				user.newPassword = user.newPassword.decodeBase64()
			val count = usersService.updatePassword(user)
			json[ItInfoConstant.RESULT_KEY] = count
		} else {
			json[ItInfoConstant.RESULT_KEY] = "비밀번호를 정확하게 입력해 주십시오."
		}
		return json
	}
	
	companion object {
		private val log by LoggerDelegate()
	}
}