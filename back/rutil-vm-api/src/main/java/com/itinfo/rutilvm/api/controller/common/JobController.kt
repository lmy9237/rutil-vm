package com.itinfo.rutilvm.api.controller.common

import com.itinfo.rutilvm.api.controller.BaseController
import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.model.common.JobVo
import com.itinfo.rutilvm.api.service.common.ItJobService
import com.itinfo.rutilvm.common.LoggerDelegate
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
@Api(tags = ["Job"])
@RequestMapping("/api/v1/jobs/")
class JobController: BaseController() {
	@Autowired private lateinit var iJob: ItJobService

	@ApiOperation(
		httpMethod="GET",
		value="작업 목록 조회",
		notes="전체 작업 목록을 조회한다"
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun jobs(): ResponseEntity<List<JobVo>> {
		log.info("/jobs/ ... 호스트 목록")
		return ResponseEntity.ok(iJob.findAll())
	}

	@ApiOperation(
		httpMethod="GET",
		value = "작업 정보 상세조회",
		notes = "선택된 작업의 정보를 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="jobId", value="작업 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{jobId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun job(
		@PathVariable jobId: String? = null,
	): ResponseEntity<JobVo?> {
		if (jobId.isNullOrEmpty())
			throw ErrorPattern.JOB_ID_NOT_FOUND.toException()
		log.info("/jobs/{} ... 작업 상세정보", jobId)
		return ResponseEntity.ok(iJob.findOne(jobId))
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
