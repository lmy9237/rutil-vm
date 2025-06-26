package com.itinfo.rutilvm.api.controller.setting

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.controller.BaseController
import com.itinfo.rutilvm.api.controller.storage.DiskController
import com.itinfo.rutilvm.api.controller.storage.DiskController.Companion
import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.model.setting.ProviderVo
import com.itinfo.rutilvm.api.model.storage.DiskImageVo
import com.itinfo.rutilvm.api.service.setting.ItProviderService
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern
import io.swagger.annotations.Api
import io.swagger.annotations.ApiImplicitParam
import io.swagger.annotations.ApiImplicitParams
import io.swagger.annotations.ApiOperation
import io.swagger.annotations.ApiResponse
import io.swagger.annotations.ApiResponses
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
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
	fun providers(): ResponseEntity<List<ProviderVo>> {
		log.info("/providers ... 공급자 목록")
		return ResponseEntity.ok(iProvider.findAll())
	}

	@ApiOperation(
		httpMethod="GET",
		value="공급자의 정보 상세조회",
		notes="선택된 공급자의 정보를 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "providerId", value = "공급자 ID", dataTypeClass = String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{providerId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun provider(
		@PathVariable providerId: String? = null,
	): ResponseEntity<ProviderVo> {
		if (providerId == null)
			throw ErrorPattern.DISK_ID_NOT_FOUND.toException()
		log.info("/providers/{} ... 공급자", providerId)
		return ResponseEntity.ok(iProvider.findOne(providerId))
	}


	companion object {
		private val log by LoggerDelegate()
	}
}
