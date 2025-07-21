package com.itinfo.rutilvm.api.controller.computing

import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.model.computing.DashboardVo
import com.itinfo.rutilvm.api.repository.history.dto.HostUsageDto
import com.itinfo.rutilvm.api.repository.history.dto.LineDto
import com.itinfo.rutilvm.api.repository.history.dto.StorageUsageDto
import com.itinfo.rutilvm.api.repository.history.dto.UsageDto
import com.itinfo.rutilvm.api.repository.history.dto.UsagePerDto
import com.itinfo.rutilvm.api.service.computing.ItGraphService
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern

import io.swagger.annotations.Api
import io.swagger.annotations.ApiOperation
import io.swagger.annotations.ApiResponse
import io.swagger.annotations.ApiResponses
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*

@Controller
@Api(tags = ["Computing", "Graph"])
@RequestMapping("/api/v1/dashboard")
class GraphController {
	@Autowired private lateinit var graph: ItGraphService

	@ApiOperation(
		httpMethod="GET",
		value="대시보드 정보",
		notes="대시보드 정보를 조회한다"
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun dashboard(): ResponseEntity<DashboardVo> {
		log.info("/dashboard ... 대시보드 정보")
		return ResponseEntity.ok(graph.getDashboard())
	}

	@ApiOperation(
		httpMethod="GET",
		value="호스트 총 사용량 정보",
		notes="호스트 사용 중인 cpu, memory 사용정보를 조회한다"
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/hosts/usage")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun totalHostUsage(): ResponseEntity<HostUsageDto> {
		log.info("/dashboard/host/usage ... 호스트 총 사용량 정보 ")
		return ResponseEntity.ok(graph.totalHostUsage())
	}

	@ApiOperation(
		httpMethod="GET",
		value="스토리지 총 사용량 정보",
		notes="스토리지 총 사용량 정보를 조회한다"
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/storages/usage")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun totalStorageUsage(): ResponseEntity<StorageUsageDto> {
		log.info("/dashboard/storage/usage ... 스토리지 총 사용량 정보 ")
		return ResponseEntity.ok(graph.totalStorageUsage())
	}

	@ApiOperation(
		httpMethod="GET",
		value="VM의 CPU 총 사용량 정보",
		notes="VM의 CPU 총 사용량 정보를 조회한다"
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/vms/usage/cpu")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun vmCpuChart(): ResponseEntity<List<UsageDto>> {
		log.info("/dashboard/vms/usage/cpu ... ")
		return ResponseEntity.ok(graph.vmCpuUsageBarData())
	}

	@ApiOperation(
		httpMethod="GET",
		value="VM의 메모리 총 사용량 정보",
		notes="VM의 메모리 총 사용량 정보를 조회한다"
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/vms/usage/memory")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun vmMemoryChart(): ResponseEntity<List<UsageDto>> {
		log.info("/dashboard/vms/usage/memory ... ")
		return ResponseEntity.ok(graph.vmMemoryUsageBarData())
	}

	@ApiOperation(
		httpMethod="GET",
		value="스토리지도메인 메모리 총 사용량 정보",
		notes="스토리지도메인의 메모리 총 사용량 정보를 조회한다"
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/storages/usage/memory")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun storageChart(): ResponseEntity<List<UsageDto>> {
		log.info("/dashboard/storages/usage/memory ... ")
		return ResponseEntity.ok(graph.storageUsageBarData())
	}

	@ApiOperation(
		httpMethod="GET",
		value="Hosts Per 그래프",
		notes="Hosts 의 Per 그래프"
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/hosts/usage/avg")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun hostsPerChart(): ResponseEntity<List<HostUsageDto>> {
		log.info("/dashboard/hosts/usage/avg ... ")
		return ResponseEntity.ok(graph.hostCpuMemAvgLineData())
	}

	@ApiOperation(
		httpMethod="GET",
		value="StorageDomain Per 그래프",
		notes="StorageDomain Per 그래프"
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/storages/usage/avg")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun storageDomainPerList(): ResponseEntity<List<StorageUsageDto>> {
		log.info("/dashboard/storages/usage/avg ... ")
		return ResponseEntity.ok(graph.storageAvgLineData())
	}

	@ApiOperation(
		httpMethod="GET",
		value="Host Per 그래프",
		notes="Host 의 Per 그래프"
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/hosts/{hostId}/usage")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun hostPerChart(
		@PathVariable hostId: String? = null
	): ResponseEntity<List<UsageDto>> {
		log.info("/dashboard/hosts/{}/usage ... ", hostId)
		if (hostId.isNullOrEmpty())
			throw ErrorPattern.HOST_ID_NOT_FOUND.toException()
		return ResponseEntity.ok(graph.hostHourlyUsageLineData(hostId))
	}

	/*@ApiOperation(
		httpMethod="GET",
		value="VM cpu Per 그래프",
		notes="VM의 cpu Per 그래프"
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/vmCpuPerList")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun vmCpuPerChart(): ResponseEntity<List<LineDto>> {
		log.info("----- vmCpuPerChart")
		return ResponseEntity.ok(graph.vmCpuPerChart())
	}*/

	/*@ApiOperation(
		httpMethod="GET",
		value="VM memory Per 그래프",
		notes="VM의 memory Per 그래프"
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/vmMemoryPerList")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun vmMemoryPerChart(): ResponseEntity<List<LineDto>> {
		log.info("----- vmMemoryPerChart")
		return ResponseEntity.ok(graph.vmMemoryPerChart())
	}*/

	@ApiOperation(
		httpMethod="GET",
		value="VM의 CPU Metric 그래프",
		notes="VM의 CPU Metric 그래프"
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/vms/metric/cpu")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun vmCpuMetricChart(): ResponseEntity<List<UsageDto>> {
		log.info("/dashboard/vms/metric/cpu ... ")
		return ResponseEntity.ok(graph.vmCpuMetricData())
	}

	@ApiOperation(
		httpMethod="GET",
		value="VM의 Memory Metric 그래프",
		notes="VM의 Memory Metric 그래프"
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/vms/metric/memory")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun vmMemoryMetricChart(): ResponseEntity<List<UsageDto>> {
		log.info("/dashboard/vms/metric/memory ... ")
		return ResponseEntity.ok(graph.vmMemoryMetricData())
	}

	@ApiOperation(
		httpMethod="GET",
		value="storage 의 Metric 그래프",
		notes="storage  Metric 그래프"
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/storages/metric")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun storageMetricChart(): ResponseEntity<List<UsageDto>> {
		log.info("/dashboard/storages/metric ... ")
		return ResponseEntity.ok(graph.storageMetricData())
	}

	@ApiOperation(
		httpMethod="GET",
		value="DataCenter 사용량",
		notes="DataCenter 사용량"
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/datacenters/{dataCenterId}/usage")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun datacentersUsage(
		@PathVariable dataCenterId: String? = null
	): ResponseEntity<UsagePerDto> {
		log.info("/datacenters/{}/usage ... ", dataCenterId)
		if (dataCenterId.isNullOrEmpty())
			throw ErrorPattern.DATACENTER_ID_NOT_FOUND.toException()
		return ResponseEntity.ok(graph.dataCenterUsage(dataCenterId))
	}

	@ApiOperation(
		httpMethod="GET",
		value="Cluster 사용량",
		notes="Cluster 사용량"
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/clusters/{clusterId}/usage")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun clustersUsage(
		@PathVariable clusterId: String? = null
	): ResponseEntity<UsagePerDto> {
		log.info("/clusters/{}/usage ... ", clusterId)
		if (clusterId.isNullOrEmpty())
			throw ErrorPattern.CLUSTER_ID_NOT_FOUND.toException()
		return ResponseEntity.ok(graph.clusterUsage(clusterId))
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
