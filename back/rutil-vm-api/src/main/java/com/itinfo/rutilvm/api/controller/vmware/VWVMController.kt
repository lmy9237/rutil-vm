package com.itinfo.rutilvm.api.controller.vmware

import com.itinfo.rutilvm.api.controller.BaseController
import com.itinfo.rutilvm.api.controller.computing.VmController
import com.itinfo.rutilvm.api.model.auth.PasswordPrompt
import com.itinfo.rutilvm.api.model.computing.VmVo
import com.itinfo.rutilvm.api.model.vmware.VCenterVm
import com.itinfo.rutilvm.api.service.ItVWVmService
import com.itinfo.rutilvm.api.service.computing.ItVmService
import com.itinfo.rutilvm.common.LoggerDelegate

import io.swagger.annotations.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*

@Controller
@Api(tags = ["VMWare", "VM"])
@RequestMapping("/api/v1/vw/vms")
class VWVMController: BaseController() {
	@Autowired private lateinit var iVWVms: ItVWVmService

	@ApiOperation(
		httpMethod="GET",
		value="VMWare 가상머신 목록 조회",
		notes="VMWare REST API를 통해 전체 가상머신 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="sessionId", value="VMWare 유효 세션 ID", dataTypeClass=String::class, required=true, paramType="query"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun vms(
		@RequestParam(required=true) sessionId: String
	): ResponseEntity<List<VCenterVm>> {
		log.info("vw/vms ... 가상머신 목록: sessionId: {}", sessionId)
		return ResponseEntity.ok(iVWVms.findAll(sessionId))
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
