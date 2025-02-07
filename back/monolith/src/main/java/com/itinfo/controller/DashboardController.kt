package com.itinfo.controller

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.model.DataCenterVo
import com.itinfo.model.EventVo
import com.itinfo.model.HostDetailVo
import com.itinfo.service.DashboardService
import com.itinfo.service.HostsService
import com.itinfo.service.VirtualMachinesService

import io.swagger.annotations.*

import org.json.simple.JSONObject

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.RestController

/**
 * [DashboardController]
 * 대시보드
 *
 * @author chlee
 * @since 2023.12.24
 */
@Api(value = "DashboardController", tags = ["dashboard"])
@RestController
@RequestMapping("v2/dashboard")
class DashboardController {
	@Autowired private lateinit var dashboardService: DashboardService
	@Autowired private lateinit var virtualMachinesService: VirtualMachinesService
	@Autowired private lateinit var hostsService: HostsService

	@Deprecated(
		message="not used"
		, replaceWith = ReplaceWith("retrieveDataCenterStatus", "KarajanDashboardController")
		, level = DeprecationLevel.WARNING
	)
	@ApiOperation(httpMethod="GET", value="retrieveDataCenterStatus", notes="데이터센터 상태 조회")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/dataCenter")
	@ResponseBody
	fun retrieveDataCenterStatus(): JSONObject {
		log.info("... retrieveDataCenterStatus")
		val dcv: DataCenterVo =
			dashboardService.retrieveDataCenterStatus()
		return asJsonResponse(dcv)
	}

	@ApiOperation(httpMethod="GET", value="retrieveEvents", notes="이벤트 목록 조회")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/events")
	@ResponseBody
	fun retrieveEvents(): JSONObject {
		log.info("... retrieveEvents")
		val events: List<EventVo> =
			dashboardService.retrieveEvents()
		return asJsonResponse(events)
	}

	@ApiOperation(httpMethod="GET", value="retrieveVms", notes="VM 상태 조회")
	@ApiImplicitParams(
		ApiImplicitParam(name="status", value="VM 상태", paramType="query", dataTypeClass=String::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/vms")
	@ResponseBody
	fun retrieveVms(
		@RequestParam(name="status") status: String?
	): JSONObject {
		log.info("... retrieveVms('$status')")
		// TODO: status에 따라 값 출력
		val vms = virtualMachinesService.retrieveVmsAll()
		val vmsTop =
			if (vms.isNotEmpty())
				virtualMachinesService.retrieveVmsTop(vms)
			else
				listOf()
		return asJsonResponse(vmsTop)
	}

	@ApiOperation(httpMethod="GET", value="retrieveHosts", notes="호스트 목록 조회")
	@ApiImplicitParams(
		ApiImplicitParam(name="status", value="호스트 상태", defaultValue="all", paramType="query", dataTypeClass=String::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping(value=["/hosts"])
	@ResponseBody
	fun retrieveHosts(
		@RequestParam(name="status") status: String?
	): JSONObject {
		log.info("... retrieveHosts('$status')")
		val hosts: List<HostDetailVo> =
			hostsService.retrieveHostsInfo(status ?: "all")
		val hostsTop =
			if (hosts.isNotEmpty())
				hostsService.retrieveHostsTop(hosts)
			else
				listOf()
		return asJsonResponse(hostsTop)
	}
	
	companion object {
		private val log by LoggerDelegate()
	}
}