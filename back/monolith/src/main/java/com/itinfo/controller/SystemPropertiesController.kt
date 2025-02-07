package com.itinfo.controller

import com.itinfo.ItInfoConstant
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.util.model.SystemPropertiesVo
import com.itinfo.service.SystemPropertiesService

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
@RequestMapping("admin")
@Api(value="SystemPropertiesController", tags=["system-properties"])
class SystemPropertiesController {
	@Autowired private lateinit var systemPropertiesService: SystemPropertiesService

	@ApiOperation(httpMethod="GET", value="retrieveSystemProperties", notes="시스템 속성값 조회")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/retrieveSystemProperties")
	@ResponseBody
	fun retrieveSystemProperties(): JSONObject {
		log.info("... retrieveSystemProperties")
		val systemProperties: SystemPropertiesVo =
			systemPropertiesService.retrieveSystemProperties()
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = systemProperties
		}
	}

	@ApiOperation(httpMethod="POST", value="saveSystemProperties", notes="시스템 속성값 저장")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("/saveSystemProperties")
	@ResponseBody
	fun saveSystemProperties(
		@RequestBody systemProperties: SystemPropertiesVo,
	): JSONObject {
		log.info("... saveSystemProperties")
		val result: Int =
			systemPropertiesService.saveSystemProperties(systemProperties)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = result
		}
	}

	@ApiOperation(httpMethod="GET", value="retrieveProgramVersion", notes="프로그램 버전 조회")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/retrieveProgramVersion")
	@ResponseBody
	fun retrieveProgramVersion(): JSONObject {
		log.info("... retrieveProgramVersion")
		val result: Array<String> =
			systemPropertiesService.retrieveProgramVersion()
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = result
		}
	}
	
	companion object {
		private val log by LoggerDelegate()
	}
}