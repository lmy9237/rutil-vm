package com.itinfo.rutilvm.api.controller.computing

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.model.computing.DashBoardVo
import com.itinfo.rutilvm.api.repository.history.dto.HostUsageDto
import com.itinfo.rutilvm.api.repository.history.dto.LineDto
import com.itinfo.rutilvm.api.repository.history.dto.StorageUsageDto
import com.itinfo.rutilvm.api.repository.history.dto.UsageDto
import com.itinfo.rutilvm.api.service.computing.ItGraphService

import io.swagger.annotations.Api
import io.swagger.annotations.ApiOperation
import org.springframework.beans.factory.annotation.Autowired
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
	@GetMapping
	@ResponseBody
	fun dashboard(): ResponseEntity<DashBoardVo> {
		log.info("----- 대시보드")
		return ResponseEntity.ok(graph.getDashboard())
	}

	@ApiOperation(
		httpMethod="GET",
		value="호스트 사용정보",
		notes="호스트 cpu, memory 사용정보를 조회한다"
	)
	@GetMapping("/cpumemory")
	@ResponseBody
	fun totalCpuMemory(): ResponseEntity<HostUsageDto> {
		log.info("----- cpu, memory")
		return ResponseEntity.ok(graph.totalCpuMemory())
	}

	@ApiOperation(
		httpMethod="GET",
		value="스토리지 총 사용량 정보",
		notes="스토리지 총 사용량 정보를 조회한다"
	)
	@GetMapping("/storage")
	@ResponseBody
	fun totalStorage(): ResponseEntity<StorageUsageDto> {
		log.info("----- storage")
		return ResponseEntity.ok(graph.totalStorage())
	}

//	@ApiOperation(
//		httpMethod="GET",
//		value="호스트 cpu, memory 물결그래프 정보",
//		notes="스토리지 총 사용량 정보를 조회한다"
//	)
//	@GetMapping("/totalCpuMemory")
//	@ResponseBody
//	fun totalCpuMemoryList(): ResponseEntity<List<HostUsageDto>> {
//		log.info("----- totalCpuMemoryList")
//		return ResponseEntity.ok(graph.totalCpuMemoryList())
//	}

	@ApiOperation(
		httpMethod="GET",
		value="VM의 CPU 총 사용량 정보",
		notes="VM의 CPU 총 사용량 정보를 조회한다"
	)
	@GetMapping("/vmCpu")
	@ResponseBody
	fun vmCpuChart(): ResponseEntity<List<UsageDto>> {
		log.info("----- vmCpuChart")
		return ResponseEntity.ok(graph.vmCpuChart())
	}

	@ApiOperation(
		httpMethod="GET",
		value="VM의 메모리 총 사용량 정보",
		notes="VM의 메모리 총 사용량 정보를 조회한다"
	)
	@GetMapping("/vmMemory")
	@ResponseBody
	fun vmMemoryChart(): ResponseEntity<List<UsageDto>> {
		log.info("----- vmMemoryChart")
		return ResponseEntity.ok(graph.vmMemoryChart())
	}

	@ApiOperation(
		httpMethod="GET",
		value="스토리지도메인 메모리 총 사용량 정보",
		notes="스토리지도메인의 메모리 총 사용량 정보를 조회한다"
	)
	@GetMapping("/storageMemory")
	@ResponseBody
	fun storageChart(): ResponseEntity<List<UsageDto>> {
		log.info("----- storageChart")
		return ResponseEntity.ok(graph.storageChart())
	}

	@ApiOperation(
		httpMethod="GET",
		value="Host Per 그래프",
		notes="Host의 Per 그래프"
	)
	@GetMapping("/hostPerList")
	@ResponseBody
	fun hostPerChart(): ResponseEntity<List<HostUsageDto>> {
		log.info("----- hostPerChart")
		return ResponseEntity.ok(graph.hostPerChart())
	}

	@ApiOperation(
		httpMethod="GET",
		value="StorageDomain Per 그래프",
		notes="StorageDomain Per 그래프"
	)
	@GetMapping("/storageDomainPerList")
	@ResponseBody
	fun storageDomainPerList(): ResponseEntity<List<StorageUsageDto>> {
		log.info("----- storageDomainPerList")
		return ResponseEntity.ok(graph.domainPerChart())
	}

	@ApiOperation(
		httpMethod="GET",
		value="VM cpu Per 그래프",
		notes="VM의 cpu Per 그래프"
	)
	@GetMapping("/vmCpuPerList")
	@ResponseBody
	fun vmCpuPerChart(): ResponseEntity<List<LineDto>> {
		log.info("----- vmCpuPerChart")
		return ResponseEntity.ok(graph.vmCpuPerChart())
	}

	@ApiOperation(
		httpMethod="GET",
		value="VM memory Per 그래프",
		notes="VM의 memory Per 그래프"
	)
	@GetMapping("/vmMemoryPerList")
	@ResponseBody
	fun vmMemoryPerChart(): ResponseEntity<List<LineDto>> {
		log.info("----- vmMemoryPerChart")
		return ResponseEntity.ok(graph.vmMemoryPerChart())
	}

//	@ApiOperation(
//		httpMethod="GET",
//		value="VM network Per 그래프",
//		notes="VM의 network Per 그래프"
//	)
//	@GetMapping("/vmNetworkPerList")
//	@ResponseBody
//	fun vmNetworkPerChart(): ResponseEntity<List<LineDto>> {
//		log.info("----- vmNetworkPerChart")
//		return ResponseEntity.ok(graph.vmNetworkPerChart())
//	}


	@ApiOperation(
		httpMethod="GET",
		value="VM의 Metric 그래프",
		notes="VM의 Metric 그래프"
	)
	@GetMapping("/vmMetricList")
	@ResponseBody
	fun vmMetricList(): ResponseEntity<List<UsageDto>> {
		log.info("----- vmMetricList")
		return ResponseEntity.ok(graph.vmMetricChart())
	}

	@ApiOperation(
		httpMethod="GET",
		value="storage의 Metric 그래프",
		notes="storage의 Metric 그래프"
	)
	@GetMapping("/storageMetricList")
	@ResponseBody
	fun storageMetricChart(): ResponseEntity<List<UsageDto>> {
		log.info("----- storageMetricChart")
		return ResponseEntity.ok(graph.storageMetricChart())
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
