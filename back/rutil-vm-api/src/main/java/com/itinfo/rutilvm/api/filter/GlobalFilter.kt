package com.itinfo.rutilvm.api.filter

import com.itinfo.rutilvm.common.LoggerDelegate

import org.springframework.web.util.ContentCachingRequestWrapper
import org.springframework.web.util.ContentCachingResponseWrapper
import java.nio.charset.StandardCharsets
import javax.servlet.Filter
import javax.servlet.FilterChain
import javax.servlet.ServletRequest
import javax.servlet.ServletResponse
import javax.servlet.annotation.WebFilter
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

@WebFilter(urlPatterns=[
	"/api/v1/**",
])
class GlobalFilter: Filter {
	override fun doFilter(
		request: ServletRequest?,
		response: ServletResponse?,
		filterChain: FilterChain?
	) {
		log.debug("doFilterInternal ... ")
		if (request == null || response == null) {
			log.debug("doFilterInternal ... req&res ALL NULL!")
			return
		}
		val req = request as HttpServletRequest
		val path = req.requestURI.substring(req.contextPath.length)

		val requestWrapper = ContentCachingRequestWrapper(request)
		val responseWrapper = ContentCachingResponseWrapper(response as HttpServletResponse)

		filterChain?.doFilter(requestWrapper, responseWrapper)
		// doFilter가 실행이 되면서 실내 내부 Spring 안으로 들어가서야
		// writeToCache 메소드가 실행이 되서 request의 내용이
		// content에 담겨 있게 되면서 읽을 수 있게 된다
		// 그렇기에 log는 doFilter 이후에 처리해 준다
		//endregion

		//region: 후처리
		val url: String = requestWrapper.requestURI
		val reqContent = String(requestWrapper.contentAsByteArray, StandardCharsets.UTF_8)
		log.info(REQUEST_MESSAGE_FORMAT, url, reqContent)

		val resContent = String(responseWrapper.contentAsByteArray, StandardCharsets.UTF_8)
		val httpStatus: Int = responseWrapper.status
		responseWrapper.copyBodyToResponse()
		log.info(RESPONSE_MESSAGE_FORMAT, httpStatus, resContent);

		/*
		val newResponse = ObjectMapper().writeValueAsString(responseWrapper.response)
		response.resetBuffer()
		response.contentType = "application/json"
		response.setContentLength(newResponse.length)
		response.outputStream.write(newResponse.toByteArray())
		response.flushBuffer()
		*/
		//endregion
	}

	companion object {
		private const val REQUEST_MESSAGE_FORMAT = "request url : {}, request body : {}"
		private const val RESPONSE_MESSAGE_FORMAT = "response status : {}, response body : \n{}"
		private val log by LoggerDelegate()
	}
}
