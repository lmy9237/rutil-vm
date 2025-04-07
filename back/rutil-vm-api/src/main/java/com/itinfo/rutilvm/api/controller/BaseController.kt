package com.itinfo.rutilvm.api.controller

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.error.IdNotFoundException
import com.itinfo.rutilvm.api.error.InvalidRequestException
import com.itinfo.rutilvm.api.error.ItemNotFoundException
import com.itinfo.rutilvm.api.error.ResourceLockedException
import com.itinfo.rutilvm.api.model.response.Res
import com.itinfo.rutilvm.api.model.response.toRes
import com.itinfo.rutilvm.util.ovirt.error.FailureType
import com.itinfo.rutilvm.util.ovirt.error.ItCloudException

import io.swagger.annotations.Api
import org.ovirt.engine.sdk4.Error
import org.postgresql.util.PSQLException
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
	@ExceptionHandler(InvalidRequestException::class, PSQLException::class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	fun handleInvalidRequest(e: Throwable): ResponseEntity<Res<Any?>> {
		log.error("handleInvalidRequest ... e: {}", e::class.simpleName)
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
		return HttpStatus.LOCKED.toResponseEntity(e.localizedMessage)
	}

	@ExceptionHandler(Error::class, ItCloudException::class)
	@ResponseStatus(HttpStatus.NOT_FOUND)
	fun handleOvirtError(e: Throwable): ResponseEntity<Res<Any?>> {
		log.error("handleOvirtError ... e: {}", e::class.simpleName)
		val rawMessage = e.message ?: ""
		val refinedMessage = Regex("""Fault detail is ['"]\[(.*?)]['"]""").find(rawMessage)?.groupValues?.get(1)
			?: rawMessage
		val resultMessage = "실패: 알수없는 이, 이유: $refinedMessage"

		return when {
			e.message?.contains("${FailureType.NOT_FOUND.code}".toRegex()) == true -> HttpStatus.NOT_FOUND.toResponseEntity(resultMessage)
			e.message?.contains("${FailureType.BAD_REQUEST.code}".toRegex()) == true -> HttpStatus.BAD_REQUEST.toResponseEntity(resultMessage)
			else -> HttpStatus.INTERNAL_SERVER_ERROR.toResponseEntity(e.localizedMessage)
		}
	}

	companion object {
		private val log by LoggerDelegate()
	}
}

fun HttpStatus.toResponseEntity(msg: String = ""): ResponseEntity<Res<Any?>> =
	ResponseEntity(this@toResponseEntity.toRes(msg), this@toResponseEntity)
