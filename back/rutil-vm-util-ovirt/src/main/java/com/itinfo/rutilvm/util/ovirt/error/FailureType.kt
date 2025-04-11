package com.itinfo.rutilvm.util.ovirt.error

import com.itinfo.rutilvm.util.ovirt.log
import java.util.concurrent.ConcurrentHashMap

enum class FailureType(
	val code: Int,
	val message: String,
) {
	BAD_REQUEST(400, "요청 불량"),
	UNAUTHORIZED(401, "비인증된 접근"),
	FORBIDDEN(403, "불허용 요청"),
	NOT_FOUND(404, "찾을 수 없는"),
	ID_NOT_FOUND(404, "ID 없음"),
	METHOD_NOT_ALLOWED(405, "허용되지 않는 처리"),
	REQUIRED_VALUE_EMPTY(404, "값 없음"),
	DUPLICATE(409, "이름 중복"),
	CONFLICT(409, "충돌"),
	CONFLICT_ACTIVE(409, "충돌: 활성화 된 상태"),
	CONFLICT_INACTIVE(409, "충돌: 비활성화 된 상태"),
	PRECONDITION_FAILED(412, "전제조건 통과 실패"),
	UNPROCESSABLE_CONTENT(422, "다룰 수 없는 컨텐츠"),
	LOCKED(423, "메서드의 소스 또는 대상 리소스가 잠김"),
	UNKNOWN(499, "알 수 없는 오류"),

	INTERNAL_SERVER_ERROR(500, "서버 에러입니다. 서버 팀에 연락주세요!");
	companion object {
		private val findMap: MutableMap<Int, FailureType> = ConcurrentHashMap<Int, FailureType>()
		init {
			values().forEach { findMap[it.code] = it }
		}
		@JvmStatic fun findByCode(code: Int): FailureType = findMap[code] ?: UNKNOWN
	}
}

fun FailureType.toError(target: String): Error {
	log.error("toError ... target: {}", this@toError.message)
	return when(this@toError) {
		FailureType.NOT_FOUND, FailureType.UNAUTHORIZED -> Error("${this@toError.message} $target")
		FailureType.DUPLICATE, FailureType.UNPROCESSABLE_CONTENT -> Error("$target ${this@toError.message}")
		else -> Error(this@toError.message)
	}
}

inline fun <reified T> Error.toFailure(): Result<T> {
	return Result.failure(this@toFailure)
}

inline fun <reified T> FailureType.toResult(target: String) = this@toResult.toError(target).toFailure<T>()
