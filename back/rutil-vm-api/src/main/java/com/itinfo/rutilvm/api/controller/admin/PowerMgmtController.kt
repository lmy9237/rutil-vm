package com.itinfo.rutilvm.api.controller.admin

import com.itinfo.rutilvm.api.RutilVmApplication
import com.itinfo.rutilvm.api.controller.BaseController
import com.itinfo.rutilvm.common.LoggerDelegate
import io.swagger.annotations.Api
import io.swagger.annotations.ApiImplicitParams
import io.swagger.annotations.ApiOperation
import io.swagger.annotations.ApiResponse
import io.swagger.annotations.ApiResponses
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping

@Controller
@Api(tags = ["Power Management"])
@RequestMapping("/api/v1/admin")
class PowerMgmtController : BaseController() {
	@ApiOperation(
		httpMethod="POST",
		value="백엔드 (안전하게) 종료",
		notes="백엔드 (안전하게) 종료 - 실험용"
	)
	@ApiImplicitParams(
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "성공"),
		ApiResponse(code = 404, message = "찾을 수 없는 요청")
	)
	@PostMapping("/shutdown")
	fun shutdown(): ResponseEntity<Boolean> {
		log.debug("shutdown ... ")
		RutilVmApplication.shutdown()
		return ResponseEntity.ok(true)
	}
	@ApiOperation(
		httpMethod="POST",
		value="백엔드 (안전하게) 재기동",
		notes="백엔드 (안전하게) 재기동"
	)
	@ApiImplicitParams(
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "성공"),
		ApiResponse(code = 404, message = "찾을 수 없는 요청")
	)
	@PostMapping("/reboot")
	fun reboot(): ResponseEntity<Boolean> {
		log.debug("reboot ... ")
		RutilVmApplication.reboot()
		return ResponseEntity.ok(true)
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
