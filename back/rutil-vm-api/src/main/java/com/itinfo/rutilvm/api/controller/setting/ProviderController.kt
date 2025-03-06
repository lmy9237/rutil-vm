package com.itinfo.rutilvm.api.controller.setting

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.controller.BaseController
import com.itinfo.rutilvm.api.model.setting.ProviderVo
import com.itinfo.rutilvm.api.service.setting.ItProviderService
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
@Api(tags = ["Providers"])
@RequestMapping("/api/v1/providers")
class ProviderController: BaseController() {
	@Autowired private lateinit var iProvider: ItProviderService

	@ApiOperation(
		httpMethod="GET",
		value="공급자 목록 조회",
		notes="전체 공급자 목록을 조회한다"
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun events(): ResponseEntity<List<ProviderVo>> {
		log.info("/providers ... 이벤트 목록")
		return ResponseEntity.ok(iProvider.findAll())
	}


	companion object {
		private val log by LoggerDelegate()
	}
}
