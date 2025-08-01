package com.itinfo.rutilvm.api.controller.network

import com.itinfo.rutilvm.api.controller.BaseController
import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.model.network.OpenStackNetworkVo
import com.itinfo.rutilvm.api.service.network.ItNetworkService
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern

import io.swagger.annotations.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*

@Controller
@Api(tags = ["Network", "Provider", "OpenStackNetwork"])
@RequestMapping("/api/v1/networkproviders")
class NetworkProviderController : BaseController() {
	@Autowired private lateinit var iNetwork: ItNetworkService

	@ApiOperation(
		httpMethod="GET",
		value="네트워크 공급자 목록 조회",
		notes="네트워크 공급자 목록을 조회한다 (네트워크 가져오기 창)"
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping()
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun findAll(): ResponseEntity<List<IdentifiedVo>> {
		log.info("/networkproviders ... 네트워크 공급자 목록")
		return ResponseEntity.ok(iNetwork.findAllNetworkProviders())
	}

	@ApiOperation(
		httpMethod="GET",
		value="네트워크 공급자의 네트워크 목록 조회",
		notes="네트워크 공급자가 가지고 있는 네트워크 목록을 가져온다 (네트워크 가져오기 창)"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="providerId", value="공급자 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/networkproviders/{providerId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun providers(
		@PathVariable providerId: String? = null
	): ResponseEntity<List<OpenStackNetworkVo?>> {
		if (providerId.isNullOrEmpty())
			throw ErrorPattern.NETWORK_NOT_FOUND.toException()
		log.info("/networkproviders/{} ... 네트워크 공급자의 네트워크 목록 조회", providerId)
		return ResponseEntity.ok(iNetwork.findAllOpenStackNetworksFromNetworkProvider(providerId))
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
