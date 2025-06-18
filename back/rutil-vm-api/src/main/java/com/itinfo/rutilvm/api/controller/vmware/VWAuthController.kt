package com.itinfo.rutilvm.api.controller.vmware

import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.model.auth.PasswordPrompt
import com.itinfo.rutilvm.api.model.vmware.VWSessionId
import com.itinfo.rutilvm.api.model.vmware.VWPromptAuth
import com.itinfo.rutilvm.api.service.ItVWAuthService
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern

import io.swagger.annotations.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*

@Controller
@Api(tags = ["VMWare", "Auth"])
@RequestMapping("/api/v1/vw/auth")
class VWAuthController {
	@Autowired private lateinit var iVWAuth: ItVWAuthService

	@ApiOperation(
		httpMethod="POST",
		value="아이디/비밀번호 검증",
		notes="사용자의 아이디/비밀번호가 맞는지 확인한다.")
	@ApiImplicitParams(
		ApiImplicitParam(name="vwPromptAuth", value="VMWare 사용자 인증 요청", dataTypeClass=VWPromptAuth::class, required=true, paramType="body"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "성공"),
		ApiResponse(code = 404, message = "찾을 수 없는 사용자")
	)
	@PostMapping()
	fun validate(
		@RequestBody(required=true) vwPromptAuth: VWPromptAuth,
	): ResponseEntity<VWSessionId> {
		log.info("vw/auth, username: {},  password: {}", vwPromptAuth.username, vwPromptAuth.password)
		if (vwPromptAuth.username.isEmpty())
			throw ErrorPattern.OVIRTUSER_ID_NOT_FOUND.toException()
		if (vwPromptAuth.password.isEmpty())
			throw ErrorPattern.OVIRTUSER_REQUIRED_VALUE_EMPTY.toException()

		val res: VWSessionId = iVWAuth.createSession(vwPromptAuth)
		return ResponseEntity.ok(res)
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
