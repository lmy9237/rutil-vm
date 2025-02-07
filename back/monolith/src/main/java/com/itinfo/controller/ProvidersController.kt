package com.itinfo.controller

import com.itinfo.ItInfoConstant
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.model.ProviderVo
import com.itinfo.service.ProvidersService

import io.swagger.annotations.*

import org.json.simple.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.RestController

/**
 * [ProvidersController]
 * ?
 *
 * @author chlee
 * @since 2023.12.24
 */
@RestController
@RequestMapping("admin")
@Api(value = "ProvidersController", tags = ["providers"])
class ProvidersController {
	@Autowired private lateinit var providersService: ProvidersService

	@ApiOperation(httpMethod = "GET", value = "retrieveUsers", notes = "사용자 목록 조회")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/retrieveProviders")
	@ResponseBody
	fun retrieveUsers(): JSONObject {
		log.info("... retrieveUsers")
		val providers: List<ProviderVo> =
			providersService.retrieveProviders()
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = providers
		}
	}

	companion object {
		private val log by LoggerDelegate()
	}
}