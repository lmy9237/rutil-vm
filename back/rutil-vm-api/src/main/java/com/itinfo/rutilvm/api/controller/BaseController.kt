package com.itinfo.rutilvm.api.controller

import com.itinfo.rutilvm.api.error.ConflictException
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.error.IdNotFoundException
import com.itinfo.rutilvm.api.error.InvalidRequestException
import com.itinfo.rutilvm.api.error.ItemNotFoundException
import com.itinfo.rutilvm.api.error.ResourceLockedException
import com.itinfo.rutilvm.api.model.common.JobVo
import com.itinfo.rutilvm.api.model.response.Res
import com.itinfo.rutilvm.api.model.response.toRes
import com.itinfo.rutilvm.api.repository.engine.JobsRepository
import com.itinfo.rutilvm.api.service.common.ItJobService
import com.itinfo.rutilvm.util.ovirt.error.FailureType
import com.itinfo.rutilvm.util.ovirt.error.ItCloudException

import io.swagger.annotations.Api
import org.ovirt.engine.sdk4.Error
import org.postgresql.util.PSQLException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*

@Controller
@Api(tags=["Root"])
class RootController: BaseController() {
	@GetMapping("/")
	fun root(): String = "forward:index.html" // root로 강제 매핑
}

@ControllerAdvice
open class BaseController(

) {
	@Autowired private lateinit var iJob: ItJobService

	@ExceptionHandler(InvalidRequestException::class, PSQLException::class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	fun handleInvalidRequest(e: Throwable): ResponseEntity<Res<Any?>> {
		log.error("handleInvalidRequest ... e: {}", e::class.simpleName)
		iJob.addQuick(JobVo.rutilvmFail(e.localizedMessage))
		return HttpStatus.BAD_REQUEST.toResponseEntity(e.localizedMessage)
	}

	@ExceptionHandler(IdNotFoundException::class, ItemNotFoundException::class)
	@ResponseStatus(HttpStatus.NOT_FOUND)
	fun handleNotFound(e: Throwable): ResponseEntity<Res<Any?>>  {
		log.error("handleNotFound ... e: {}", e::class.simpleName)
		return HttpStatus.NOT_FOUND.toResponseEntity(e.localizedMessage)
	}

	@ExceptionHandler(ResourceLockedException::class)
	@ResponseStatus(HttpStatus.LOCKED)
	fun handleLocked(e: Throwable): ResponseEntity<Res<Any?>>  {
		log.error("handleLocked ... e: {}", e::class.simpleName)
		iJob.addQuick(JobVo.rutilvmFail(e.localizedMessage))
		return HttpStatus.LOCKED.toResponseEntity(e.localizedMessage)
	}

	@ExceptionHandler(ConflictException::class)
	@ResponseStatus(HttpStatus.CONFLICT)
	fun handleConflict(e: Throwable): ResponseEntity<Res<Any?>>  {
		log.error("handleConflict ... e: {}", e::class.simpleName)
		iJob.addQuick(JobVo.rutilvmFail(e.localizedMessage))
		return HttpStatus.CONFLICT.toResponseEntity(e.localizedMessage)
	}

	@ExceptionHandler(Error::class, ItCloudException::class)
	@ResponseStatus(HttpStatus.NOT_FOUND)
	fun handleOvirtError(e: Throwable): ResponseEntity<Res<Any?>> {
		log.error("handleOvirtError ... e::class.simpleName: {}, e.message: {}", e::class.simpleName, e.message)
		// TODO: 메시지를 효과적으로 출력하는 방법에 대한 기술 조사 필요 (e.message 의 글자량이 가끔 너무 많아서 최근작업에서 출력이 안됨)
		val rawMessage = e.localizedMessage ?: ""
		val refinedMessage =
			Regex("""Fault detail is ['"]\[(.*?)]['"]""")
				.find(rawMessage)
				?.groupValues
				?.get(1)
			?: rawMessage

		val resultMessage = "실패이유: $refinedMessage"

		if (e.message?.contains("${FailureType.NOT_FOUND.code}".toRegex()) == false)
			iJob.addQuick(JobVo.rutilvmFail(refinedMessage))
		return when {
			// ovirt-sdk 에서 예외로 분류 되는 오류
			e.message?.contains("${FailureType.NOT_FOUND.code}".toRegex()) == true -> HttpStatus.NOT_FOUND.toResponseEntity(resultMessage)
			e.message?.contains("${FailureType.BAD_REQUEST.code}".toRegex()) == true -> HttpStatus.BAD_REQUEST.toResponseEntity(resultMessage)
			e.message?.contains("${FailureType.CONFLICT.code}".toRegex()) == true -> HttpStatus.CONFLICT.toResponseEntity(resultMessage)
			else -> HttpStatus.INTERNAL_SERVER_ERROR.toResponseEntity(e.localizedMessage)
		}
	}

	companion object {
		private val log by LoggerDelegate()
	}
}

fun HttpStatus.toResponseEntity(msg: String = ""): ResponseEntity<Res<Any?>> =
	ResponseEntity(this@toResponseEntity.toRes(msg), this@toResponseEntity)
