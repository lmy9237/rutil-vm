package com.itinfo.rutilvm.api.controller.vmware

import com.itinfo.rutilvm.api.controller.BaseController
import com.itinfo.rutilvm.api.model.vmware.VCenterVm
import com.itinfo.rutilvm.api.model.vmware.VCenterVmDetail
import com.itinfo.rutilvm.api.model.vmware.VWPrompt
import com.itinfo.rutilvm.api.service.ItVWVmService
import com.itinfo.rutilvm.common.LoggerDelegate

import io.swagger.annotations.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*

@Controller
@Api(tags = ["VMWare", "VW-VM"])
@RequestMapping("/api/v1/vw/vms")
class VWVMController: BaseController() {
	@Autowired private lateinit var iVWVms: ItVWVmService

	@ApiOperation(
		httpMethod="POST",
		value="VMWare 가상머신 목록 조회",
		notes="VMWare REST API를 통해 전체 가상머신 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vwPrompt", value="기본 VMWare 요청 (유효 세션 ID 포함)", dataTypeClass=VWPrompt::class, required=true, paramType="body"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@PostMapping
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun vms(
		@RequestBody(required=true) vwPrompt: VWPrompt
	): ResponseEntity<List<VCenterVm>> {
		log.info("vw/vms ... 가상머신 목록: sessionId: {}", vwPrompt.sessionId)
		return ResponseEntity.ok(iVWVms.findAll(vwPrompt))
	}

	@ApiOperation(
		httpMethod="POST",
		value="VMWare 가상머신 상세조회",
		notes="VMWare REST API를 통해 전체 가상머신 상세정보을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vwPrompt", value="기본 VMWare 요청 (유효 세션 ID 포함)", dataTypeClass=VWPrompt::class, required=true, paramType="body"),
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@PostMapping("{vmId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun vm(
		@RequestBody(required=true) vwPrompt: VWPrompt,
		@PathVariable(required=true) vmId: String,
	): ResponseEntity<VCenterVmDetail?> {
		log.info("vw/vms/{} ... 가상머신 상세조회: sessionId: {}", vmId, vwPrompt.sessionId)
		return ResponseEntity.ok(iVWVms.findOne(vwPrompt, vmId))
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
