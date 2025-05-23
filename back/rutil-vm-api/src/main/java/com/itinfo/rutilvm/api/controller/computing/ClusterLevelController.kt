package com.itinfo.rutilvm.api.controller.computing

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.controller.BaseController
import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.model.computing.*
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern
import com.itinfo.rutilvm.api.model.network.NetworkVo
import com.itinfo.rutilvm.api.model.network.VnicProfileVo
import com.itinfo.rutilvm.api.service.computing.ItClusterLevelService
import com.itinfo.rutilvm.api.service.computing.ItClusterService

import io.swagger.annotations.*
import org.ovirt.engine.sdk4.types.Architecture
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*

@Controller
@Api(tags = ["Computing", "Cluster Level"])
@RequestMapping("/api/v1/computing/clusterlevels")
class ClusterLevelController {
	@Autowired private lateinit var iClusterLevel: ItClusterLevelService

	@ApiOperation(
		httpMethod="GET",
		value="클러스터 항목 별 목록 조회",
		notes="클러스터 항목 별 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="category", value="클러스터 레벨 항목", dataTypeClass=String::class, required=false, paramType="query", example="arch,id"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun findAll(
		@RequestParam(required=false) category: String?="",
	): ResponseEntity<out Any> {
		log.info("/computing/clusterlevels?category={} ... 클러스터 레벨 항목 별 목록", category)
		return ResponseEntity.ok(when (category) {
			"arch" -> iClusterLevel.findAllCpuTypesByArchitecture()
			"id" -> iClusterLevel.findAllIds()
			else -> iClusterLevel.findAll()
		})
	}

	@ApiOperation(
		httpMethod="GET",
		value="클러스터 레벨 상세조회",
		notes="선택된 클러스터 레벨의 상세정보를 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="levelId", value="클러스터레벨 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{levelId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun findOne(
		@PathVariable(required = true) levelId: String
	): ResponseEntity<ClusterLevelVo?> {
		log.info("/computing/clusterlevels/{} ... 클러스터레벨 상세정보", levelId)
		return ResponseEntity.ok(iClusterLevel.findOne(levelId))
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
