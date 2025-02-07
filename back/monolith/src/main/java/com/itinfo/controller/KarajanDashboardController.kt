package com.itinfo.controller

import com.itinfo.ItInfoConstant
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.model.InstanceTypeVo
import com.itinfo.model.karajan.ConsolidationVo
import com.itinfo.model.karajan.KarajanVo
import com.itinfo.model.karajan.WorkloadVo
import com.itinfo.service.KarajanDashboardService
import com.itinfo.service.engine.WorkloadPredictionService

import io.swagger.annotations.*

import org.json.simple.JSONObject

import org.ovirt.engine.sdk4.types.VmStatus

import org.springframework.beans.factory.annotation.Autowired

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("symphony")
@Api(value="KarajanDashboardController", tags=["karajan-dashboard"])
class KarajanDashboardController {
	@Autowired private lateinit var karajanDashboardService: KarajanDashboardService
	@Autowired private lateinit var workloadPredictionService: WorkloadPredictionService

	@ApiOperation(httpMethod="GET", value="retrieveDataCenterStatus", notes="데이터 센터 상태 조회")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/retrieveDataCenterStatus")
	@ResponseBody
	fun retrieveDataCenterStatus(): JSONObject {
		log.info("... retrieveDataCenterStatus")
		val karajan: KarajanVo =
			karajanDashboardService.retrieveDataCenterStatus()
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = karajan
		}
	}

	@ApiOperation(httpMethod="GET", value="consolidateVm", notes="???") // TODO: 확인 필요
	@ApiImplicitParams(
		ApiImplicitParam(name="clusterId", value="클러스터 ID", paramType="query", dataTypeClass=String::class)
	)
	@ApiResponses(ApiResponse(code=200, message="OK"))
	@GetMapping("/consolidateVm")
	@ResponseBody
	fun consolidateVm(
		@RequestParam(name="clusterId") clusterId: String
	): JSONObject {
		log.info("... consolidateVm('$clusterId')")
		val consolidated: List<ConsolidationVo> =
			karajanDashboardService.consolidateVm(clusterId)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = consolidated
		}
	}

	@ApiOperation(httpMethod="POST", value="relocateVms", notes="VM 재배치") // TODO: 확인 필요
	@ApiImplicitParams(
		ApiImplicitParam(name="consolidations", value="???", required=true, paramType="body", dataTypeClass=Array<ConsolidationVo>::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/relocateVms")
	@ResponseBody
	fun relocateVms(
		@RequestBody consolidations: List<ConsolidationVo>,
	): JSONObject {
		log.info("... relocateVms[${consolidations.size}]")
		karajanDashboardService.relocateVms(consolidations)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = "OK"
		}
	}

	@ApiOperation(httpMethod="GET", value="migrateVm", notes="VM 이관") // TODO: 확인 필요
	@ApiImplicitParams(
		ApiImplicitParam(name="hostId", value="호스트 ID", required=true, paramType="query", dataTypeClass= String::class),
		ApiImplicitParam(name="vmId", value="VM ID", required=true, paramType="query", dataTypeClass= String::class),
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/migrateVm")
	@ResponseBody
	fun migrateVm(
		@RequestParam(name="hostId") hostId: String,
		@RequestParam(name="vmId") vmId: String
	): JSONObject {
		log.info("... migrateVm('$hostId', $vmId)")
		val result = karajanDashboardService.migrateVm(hostId, vmId)
		if (result.equals(VmStatus.MIGRATING.value(), ignoreCase = true))
			karajanDashboardService.publishVmStatus(hostId, vmId)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = result
		}
	}

	@ApiOperation(httpMethod="GET", value="getWorkload", notes="???") // TODO: 확인 필요
	@ApiImplicitParams
	@ApiResponses(ApiResponse(code=200, message="OK"))
	@GetMapping("/workload")
	@ResponseBody
	fun getWorkload(): JSONObject {
		log.info("... getWorkload")
		val workload: WorkloadVo =
			workloadPredictionService.getWorkload()
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = workload
		}
	}
	
	companion object {
		private val log by LoggerDelegate()
	}
}