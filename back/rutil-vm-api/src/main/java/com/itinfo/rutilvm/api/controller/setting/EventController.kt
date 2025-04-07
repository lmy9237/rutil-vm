package com.itinfo.rutilvm.api.controller.setting

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.controller.BaseController
import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.model.computing.EventVo
import com.itinfo.rutilvm.api.service.setting.ItEventService
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern

import io.swagger.annotations.Api
import io.swagger.annotations.ApiImplicitParam
import io.swagger.annotations.ApiImplicitParams
import io.swagger.annotations.ApiOperation
import io.swagger.annotations.ApiResponse
import io.swagger.annotations.ApiResponses
import org.ovirt.engine.sdk4.types.LogSeverity
import org.springframework.beans.factory.annotation.Autowired
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
import java.io.Serializable

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
		ApiImplicitParam(name="severityThreshold", value="심각도 상위범위", dataTypeClass=String::class, required=false, paramType="query"),
		ApiImplicitParam(name="pageNo", value="보여줄 페이지 번호", dataTypeClass=Int::class, required=false, paramType="query"),
		ApiImplicitParam(name="size", value="페이지 당 보여줄 개수", dataTypeClass=Int::class, required=false, paramType="query"),
	)
    @ApiResponses(
        ApiResponse(code = 200, message = "OK")
    )
    @GetMapping
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    fun events(
		@RequestParam(required=false) severityThreshold: String? = null,
		@RequestParam(required=false) pageNo: Int? = null,
		@RequestParam(required=false) size: Int? = 20,
	): ResponseEntity<List<EventVo>> {
        log.info("/events ... severityThreshold: {}, pageNo: {}, size: {}, 이벤트 목록", severityThreshold ?: "없음", pageNo ?: "없음", size ?: "없음")
		return ResponseEntity.ok(iEvent.findAll(severityThreshold, pageNo, size))
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
	class BodyEventIds(val eventIds: List<String>): Serializable

    companion object {
        private val log by LoggerDelegate()
    }
}
