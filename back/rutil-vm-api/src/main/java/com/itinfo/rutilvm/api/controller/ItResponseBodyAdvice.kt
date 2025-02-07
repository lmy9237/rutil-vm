package com.itinfo.rutilvm.api.controller

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.model.response.Res

import org.springframework.core.MethodParameter
import org.springframework.http.MediaType
import org.springframework.http.converter.HttpMessageConverter
import org.springframework.http.server.ServerHttpRequest
import org.springframework.http.server.ServerHttpResponse
import org.springframework.http.server.ServletServerHttpResponse
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice
import javax.servlet.http.HttpServletResponse

@ControllerAdvice
class ItResponseBodyAdvice: ResponseBodyAdvice<Any> {
	override fun supports(returnType: MethodParameter,
	                      converterType: Class<out HttpMessageConverter<*>>): Boolean = true

	override fun beforeBodyWrite(
		body: Any?,
		returnType: MethodParameter,
		selectedContentType: MediaType,
		selectedConverterType: Class<out HttpMessageConverter<*>>,
		request: ServerHttpRequest,
		response: ServerHttpResponse
	): Any? {
		if (
			request.uri.path.contains("swagger") ||
			request.uri.path.contains("api-docs")
		) {
			log.info("%%%%%%%%%%%%%%%%%%%%%%%%% swagger-ui 관련 %%%%%%%%%%%%%%%%%%%%%%%%%")
			return body
		}
		/*
		if (body != null && request.uri.getQuery() != null) {
			val keyValuePair: Hashtable<String, Array<String>> = parseQueryString(request.uri.getQuery())
			if (keyValuePair.containsKey(FIELDS_QUERY_PARAM)) {
				val objectMapper: ObjectMapper = Squiggly.init(
					ObjectMapper(),
					StringUtils.arrayToCommaDelimitedString(keyValuePair.get(FIELDS_QUERY_PARAM))
				)
				return SquigglyUtils.objectify(objectMapper, body, body.getClass())
			}
		}
		*/
		val servletResponse: HttpServletResponse = (response as ServletServerHttpResponse).servletResponse
//		log.debug("{}", body)
		return when(servletResponse.status) {
			in 200 .. 299 -> {
//				log.info("... 성공")
				Res.safely<Any?> { body }
			}
			else -> {
				log.error("... 실패")
				body
			} // BaseController > @ExceptionHandler 에서 Exception 처리된 결과물 그대로 보낼 수 있게
		}
	}
	companion object {
		private val log by LoggerDelegate()
	}
}