package com.itinfo.rutilvm.api.controller.setting

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.controller.BaseController
import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.model.setting.ExternalHostProviderVo
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
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
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
	fun providers(): ResponseEntity<List<ExternalHostProviderVo>> {
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
	): ResponseEntity<ExternalHostProviderVo> {
		if (providerId == null)
			throw ErrorPattern.EXTERNAL_HOST_PROVIDER_ID_NOT_FOUND.toException()
		log.info("/providers/{} ... 공급자", providerId)
		return ResponseEntity.ok(iProvider.findOne(providerId))
	}

	@ApiOperation(
		httpMethod="POST",
		value="공급자 생성",
		notes="공급자 이미지를 생성한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "externalHostProviderVo", value = "공급자이미지", dataTypeClass = ExternalHostProviderVo::class, required=true, paramType="body"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED")
	)
	@PostMapping
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun add(
		@RequestBody externalHostProviderVo: ExternalHostProviderVo? = null,
	): ResponseEntity<ExternalHostProviderVo?> {
		if (externalHostProviderVo == null)
			throw ErrorPattern.EXTERNAL_HOST_PROVIDER_VO_INVALID.toException()
		log.info("/providers ... 공급자 생성")
		return ResponseEntity.ok(iProvider.add(externalHostProviderVo))
	}

	@ApiOperation(
		httpMethod="PUT",
		value="공급자 편집",
		notes="공급자 이미지를 편집한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "externalHostProviderId", value = "공급자이미지 ID", dataTypeClass = String::class, required=true, paramType="path"),
		ApiImplicitParam(name = "externalHostProviderVo", value = "공급자이미지", dataTypeClass = ExternalHostProviderVo::class, required=true, paramType="body"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED")
	)
	@PutMapping("/{externalHostProviderId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun edit(
		@PathVariable externalHostProviderId: String? = null,
		@RequestBody externalHostProviderVo: ExternalHostProviderVo?
	): ResponseEntity<ExternalHostProviderVo?> {
		if (externalHostProviderId == null)
			throw ErrorPattern.EXTERNAL_HOST_PROVIDER_ID_NOT_FOUND.toException()
		if (externalHostProviderVo == null)
			throw ErrorPattern.EXTERNAL_HOST_PROVIDER_VO_INVALID.toException()
		log.info("/providers/{} ... 공급자 편집", externalHostProviderId)
		return ResponseEntity.ok(iProvider.update(externalHostProviderVo))
	}

	@ApiOperation(
		httpMethod="DELETE",
		value="공급자 삭제",
		notes="공급자 이미지를 삭제한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "ExternalHostProviderId", value = "공급자이미지 ID", dataTypeClass = String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@DeleteMapping("/{externalHostProviderId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun remove(
		@PathVariable externalHostProviderId: String? = null,
	): ResponseEntity<Boolean> {
		if (externalHostProviderId == null)
			throw ErrorPattern.EXTERNAL_HOST_PROVIDER_ID_NOT_FOUND.toException()
		log.info("/providers/{} ... 공급자 삭제", externalHostProviderId)
		return ResponseEntity.ok(iProvider.remove(externalHostProviderId))
	}


	companion object {
		private val log by LoggerDelegate()
	}
}
