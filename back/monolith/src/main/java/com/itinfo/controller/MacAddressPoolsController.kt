package com.itinfo.controller

import com.itinfo.ItInfoConstant
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.model.MacAddressPoolsVo
import com.itinfo.service.MacAddressService
import io.swagger.annotations.*

import org.json.simple.JSONObject

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.RestController


@RestController
@RequestMapping("admin")
@Api(value="MacAddressPoolsController", tags=["mac-address-pool"])
class MacAddressPoolsController {
	@Autowired private lateinit var macAddressService: MacAddressService

	@ApiOperation(httpMethod="GET", value="retrieveMacAddressPools", notes="mac address pool 목록 조회")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/retrieveMacAddressPools")
	@ResponseBody
	fun retrieveMacAddressPools(): JSONObject {
		log.info("... retrieveMacAddressPools")
		val macAddressVo: List<MacAddressPoolsVo> =
			macAddressService.retrieveMacAddressPools()
		return asJsonResponse(macAddressVo)
	}

	companion object {
		private val log by LoggerDelegate()
	}
}