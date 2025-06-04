package com.itinfo.rutilvm.api.controller.common

import com.itinfo.rutilvm.api.controller.BaseController
import com.itinfo.rutilvm.api.model.common.JobVo
import com.itinfo.rutilvm.api.service.common.BiosTypeVo
import com.itinfo.rutilvm.api.service.common.ItTypeService
import com.itinfo.rutilvm.api.service.common.ItWsNotifyService
import com.itinfo.rutilvm.common.LoggerDelegate
import io.swagger.annotations.Api
import io.swagger.annotations.ApiOperation
import io.swagger.annotations.ApiResponse
import io.swagger.annotations.ApiResponses
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.ResponseStatus

@Controller
@Api(tags = ["Type"])
@RequestMapping("/api/v1/types/")
class TypeController: BaseController(){
	@Autowired private lateinit var iType: ItTypeService

	@ApiOperation(
		httpMethod="GET",
		value="BIOS 유형 (a.k.a. 칩셋옵션) 목록 조회",
		notes="BIOS 유형 목록을 조회한다"
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("bios")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun allBiosTypes(): ResponseEntity<List<BiosTypeVo>> {
		log.info("/type/bios ... BIOS 유형 (a.k.a. 칩셋옵션) 목록")
		return ResponseEntity.ok(iType.findAllBiosTypes())
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
