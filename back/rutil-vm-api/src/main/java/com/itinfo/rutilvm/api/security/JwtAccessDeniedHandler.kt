package com.itinfo.rutilvm.api.security

import org.springframework.security.web.access.AccessDeniedHandler
import org.springframework.stereotype.Component
import org.springframework.security.access.AccessDeniedException
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

@Component
class JwtAccessDeniedHandler : AccessDeniedHandler {
	override fun handle(
		request: HttpServletRequest?,
		response: HttpServletResponse?,
		accessDeniedException: AccessDeniedException?
	) {
		response?.sendError(HttpServletResponse.SC_FORBIDDEN)
	}
}