package com.itinfo.rutilvm.api.controller.auth

import com.itinfo.rutilvm.api.model.auth.UserSessionVo
import com.itinfo.rutilvm.api.service.auth.ItOvirtUserSessionService
import com.itinfo.rutilvm.common.LoggerDelegate
import io.swagger.annotations.Api
import io.swagger.annotations.ApiImplicitParam
import io.swagger.annotations.ApiImplicitParams
import io.swagger.annotations.ApiOperation
import io.swagger.annotations.ApiResponse
import io.swagger.annotations.ApiResponses
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam

@Controller
@Api(tags = ["User Session"])
@RequestMapping("/api/v1/auth/user-sessions")
class OvirtUserSessionController {
	@Autowired private lateinit var ovirtUserSession: ItOvirtUserSessionService

	@ApiOperation(
		httpMethod="GET",
		value="활성 사용자 세션 목록조회 (테스트용)",
		notes="활성 사용자 세션 목록조회를 한다.")
	@ApiImplicitParams(
		ApiImplicitParam(name="username", value="ovirt 사용자 ID", dataTypeClass=String::class, required=false, paramType="query"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "성공"),
		ApiResponse(code = 404, message = "찾을 수 없는 활성 사용자 세션")
	)
	@GetMapping
	fun findAll(
		@RequestParam(required=false) username: String? = "",
	): ResponseEntity<List<UserSessionVo>> {
		log.info("findAll ... ")
		val res: List<UserSessionVo> = ovirtUserSession.findAll(username)
		return ResponseEntity.ok(res)
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
