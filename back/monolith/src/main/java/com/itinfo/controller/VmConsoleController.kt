package com.itinfo.controller

import com.itinfo.ItInfoConstant
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.model.VmConsoleVo
import com.itinfo.service.VmConsoleService

import io.swagger.annotations.*

import org.json.simple.JSONObject

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.RestController


@RestController
@RequestMapping("vmConsole")
@Api(value="VmConsoleController", tags=["vm-console"])
class VmConsoleController {
	@Autowired private lateinit var vmConsoleService: VmConsoleService

	@ApiOperation(httpMethod="POST", value="ConsoleConnectionInformation", notes="VM Console 연결 시도")
	@ApiImplicitParams(
		ApiImplicitParam(name="vmConsoleVo", value="VM Console 정보", paramType="body", dataTypeClass=VmConsoleVo::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/ticket")
	@ResponseBody
	fun consoleConnectionInformation(
		@RequestBody vmConsoleVo: VmConsoleVo
	): JSONObject {
		var _vmConsoleVo: VmConsoleVo? = vmConsoleVo
		log.info("consoleConnectionInformation ...")
		val json = JSONObject()
		try {
			_vmConsoleVo = vmConsoleService.getDisplayTicket(vmConsoleVo)
		} catch (e: Exception) {
			json[ItInfoConstant.RESULT_KEY] = "error"
		}
		json[ItInfoConstant.RESULT_KEY] = _vmConsoleVo
		return json
	}

	@ApiOperation(httpMethod="POST", value="ConsoleConnectionInformation2", notes="VM Console 연결 시도2")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("/ticket2")
	@ResponseBody
	fun consoleConnectionInformation2(): JSONObject {
		log.info("consoleConnectionInformation2 ...")
		var _vo = VmConsoleVo().apply {
			type = "vnc"
			vmName = "nested-host"
		}
		_vo = vmConsoleService.getDisplayTicket(_vo) ?: VmConsoleVo()
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = _vo
		}
	}
	
	companion object {
		private val log by LoggerDelegate()
	}
}