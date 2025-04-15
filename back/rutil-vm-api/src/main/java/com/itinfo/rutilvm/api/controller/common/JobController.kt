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
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
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
	fun findOne(
		@PathVariable jobId: String? = null,
	): ResponseEntity<JobVo?> {
		if (jobId.isNullOrEmpty())
			throw ErrorPattern.JOB_ID_NOT_FOUND.toException()
		log.info("/jobs/{} ... 작업 상세정보", jobId)
		return ResponseEntity.ok(iJob.findOne(jobId))
	}

	@ApiOperation(
		httpMethod="POST",
		value = "(외부) 작업 정보 생성",
		notes = "(외부) 작업정보를 생성 한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="job", value="작업", dataTypeClass=JobVo::class, paramType="body"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK"),
		ApiResponse(code = 404, message = "NOT_FOUND")
	)
	@PostMapping
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun add(
		@RequestBody job: JobVo? = null,
	): ResponseEntity<JobVo?> {
		if (job == null)
			throw ErrorPattern.JOB_VO_INVALID.toException()
		log.info("/jobs/ ... (외부) 작업 생성\n{}", job)
		return ResponseEntity.ok(iJob.add(job))
	}

	@ApiOperation(
		httpMethod="PUT",
		value = "작업 정보 종료",
		notes = "선택된 작업의 정보를 종료한다."
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="jobId", value="작업 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@PutMapping("/{jobId}/end")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun end(
		@PathVariable jobId: String? = null,
	): ResponseEntity<Boolean?> {
		if (jobId.isNullOrEmpty())
			throw ErrorPattern.JOB_ID_NOT_FOUND.toException()
		log.info("/jobs/{}/end ... 작업 종료", jobId)
		return ResponseEntity.ok(iJob.end(jobId))
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
