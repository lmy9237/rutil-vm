package com.itinfo.controller

import com.itinfo.ItInfoConstant
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.model.DataCenterVo
import com.itinfo.service.DataCenterService
import io.swagger.annotations.*

import org.json.simple.JSONObject

import org.springframework.beans.factory.annotation.Autowired

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.RestController

/**
 * [DataCenterController]
 * 데이터센터
 *
 * @author chlee
 * @since 2023.12.24
 */
@RestController
@RequestMapping("v2/dataCenters")
@Api(value="DataCenterController", tags=["data-center"])
class DataCenterController {
	@Autowired private lateinit var dataCenterService: DataCenterService

	@ApiOperation(httpMethod="GET", value="retrieveDataCentersInfo", notes="데이터 센터 목록 조회")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping
	@ResponseBody
	fun retrieveDataCentersInfo(): JSONObject {
		log.info("... retrieveDataCentersInfo")
		val dataCenters: List<DataCenterVo> =
			dataCenterService.retrieveDataCenters()
		return asJsonResponse(dataCenters)
	}
	
	companion object {
		private val log by LoggerDelegate()
	}
}