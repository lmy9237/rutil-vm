package com.itinfo.rutilvm.api.controller.setting

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.controller.BaseController
import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.model.computing.EventVo
import com.itinfo.rutilvm.api.repository.engine.AuditLogSpecificationParam
import com.itinfo.rutilvm.api.service.setting.ItEventService
import com.itinfo.rutilvm.common.parseEnhanced2LDT
import com.itinfo.rutilvm.common.rutilApiQueryDf
import com.itinfo.rutilvm.common.rutilApiQueryDtf
import com.itinfo.rutilvm.common.toDate
import com.itinfo.rutilvm.common.toLocalDateTime
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern

import io.swagger.annotations.Api
import io.swagger.annotations.ApiImplicitParam
import io.swagger.annotations.ApiImplicitParams
import io.swagger.annotations.ApiOperation
import io.swagger.annotations.ApiResponse
import io.swagger.annotations.ApiResponses
import springfox.documentation.annotations.ApiIgnore
import org.ovirt.engine.sdk4.types.LogSeverity
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.data.web.PageableDefault
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.ResponseStatus
import org.thymeleaf.util.DateUtils
import java.io.Serializable
import java.time.LocalDateTime
import java.time.format.DateTimeParseException
import java.util.Date

@Controller
@Api(tags = ["Events"])
@RequestMapping("/api/v1/events")
class EventController: BaseController() {
    @Autowired private lateinit var iEvent: ItEventService

    @ApiOperation(
        httpMethod="GET",
        value="이벤트 목록 조회",
        notes="전체 이벤트 목록을 조회한다"
    )
	@ApiImplicitParams(
		ApiImplicitParam(name="page", value="보여줄 페이지 번호", dataTypeClass=Int::class, required=false, paramType="query", example="0"),
		ApiImplicitParam(name="size", value="페이지 당 보여줄 개수", dataTypeClass=Int::class, required=false, paramType="query", example="20",),
		ApiImplicitParam(name="datacenterId", value="데이터센터 ID", dataTypeClass=String::class, required=false, paramType="query", example=""),
		ApiImplicitParam(name="clusterId", value="클러스터 ID", dataTypeClass=String::class, required=false, paramType="query", example=""),
		ApiImplicitParam(name="hostId", value="호스트 ID", dataTypeClass=String::class, required=false, paramType="query", example=""),
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=false, paramType="query", example=""),
		ApiImplicitParam(name="templateId", value="탬플릿 ID", dataTypeClass=String::class, required=false, paramType="query", example=""),
		ApiImplicitParam(name="storageDomainId", value="스토리지도메인 ID", dataTypeClass=String::class, required=false, paramType="query", example=""),
		ApiImplicitParam(name="minSeverity", value="심각도 상위범위", dataTypeClass=String::class, required=false, paramType="query", example="normal"),
		ApiImplicitParam(name="startDate", value="시작시간 (YYYYMMDD)", dataTypeClass=String::class, required=false, paramType="query", example=""),
	)
    @ApiResponses(
        ApiResponse(code = 200, message = "OK")
    )
    @GetMapping
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
	@Throws(DateTimeParseException::class)
    fun findAll(
		@ApiIgnore
		@PageableDefault(size=5000, sort=["logTime"], direction=Sort.Direction.DESC) pageable: Pageable,
		@RequestParam(required=false) datacenterId: String? = null,
		@RequestParam(required=false) clusterId: String? = null,
		@RequestParam(required=false) hostId: String? = null,
		@RequestParam(required=false) vmId: String? = null,
		@RequestParam(required=false) templateId: String? = null,
		@RequestParam(required=false) storageDomainId: String? = null,
		@RequestParam(required=false) minSeverity: String? = null,
		@RequestParam(required=false) startDate: String? = null,
	): ResponseEntity<List<EventVo>> {
        log.info(
			"/events ... 이벤트 목록 page: {}, size: {},\ndatacenterId: {}, clusterId: {}, hostId: {}, vmId: {}, templateId: {}, storageDomainId: {}, minSeverity: {}, startDate: {}",
			pageable.pageNumber, pageable.pageSize,
			datacenterId, clusterId, hostId, vmId, templateId, storageDomainId,
			minSeverity, startDate,
		)
		val _startDate: Date? = if (startDate == null) null else when (startDate) {
			"now", "today" -> Date().toLocalDateTime()?.minusDays(1)?.toDate()
			"recent" -> Date().toLocalDateTime()?.minusDays(5)?.toDate()
			else -> rutilApiQueryDf.parse(startDate)
		}
		return ResponseEntity.ok(
			iEvent.findAll(pageable,
				AuditLogSpecificationParam.builder {
					datacenterId { datacenterId }
					clusterId { clusterId }
					hostId { hostId }
					vmId { vmId }
					templateId { templateId }
					storageDomainId { storageDomainId }
					minSeverity { minSeverity }
					startDate { _startDate.toLocalDateTime() }
				}
			).content
		)
    }

	@ApiOperation(
		httpMethod="DELETE",
		value="이벤트 제거",
		notes="이벤트를 제거한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="eventId", value="이벤트 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@DeleteMapping("/{eventId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun remove(
		@PathVariable(required = true) eventId: String
	): ResponseEntity<Boolean> {
		log.info("/events/{} ... 이벤트 제거", eventId)
		if (eventId.isEmpty()) throw ErrorPattern.EVENT_ID_NOT_FOUND.toException()
		return ResponseEntity.ok(iEvent.remove(listOf(eventId)))
	}

	@ApiOperation(
		httpMethod="DELETE",
		value="이벤트 일괄제거",
		notes="이벤트를 일괄제거한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="eventIds2Remove", value="이벤트 ID 목록", dataTypeClass=BodyEventIds::class, required=true, paramType="body"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@DeleteMapping
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun removeMultiple(
		@RequestBody(required = true) eventIds2Remove: BodyEventIds
	): ResponseEntity<Boolean> {
		log.info("/events ... 이벤트 일괄제거 {}", eventIds2Remove)
		if (eventIds2Remove.eventIds.isEmpty()) {
			throw ErrorPattern.EVENT_ID_NOT_FOUND.toException()
		}
		return ResponseEntity.ok(iEvent.remove(eventIds2Remove.eventIds))
	}
	data class BodyEventIds(val eventIds: List<String> = listOf()): Serializable

    companion object {
        private val log by LoggerDelegate()
    }
}
