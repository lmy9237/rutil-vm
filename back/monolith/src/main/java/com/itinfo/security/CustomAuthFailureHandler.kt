package com.itinfo.security

import com.itinfo.ItInfoConstant
import com.itinfo.rutilvm.common.LoggerDelegate

import org.springframework.security.core.AuthenticationException
import org.springframework.security.web.authentication.AuthenticationFailureHandler

import java.io.IOException
import javax.servlet.ServletException
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse


class CustomAuthFailureHandler : AuthenticationFailureHandler {

	@Throws(IOException::class, ServletException::class)
	override fun onAuthenticationFailure(
		request: HttpServletRequest,
		response: HttpServletResponse,
		authenticationException: AuthenticationException
	) {
		log.error("...  onAuthenticationFailure('${authenticationException.message}')")
		response.status = when(authenticationException.message) {
			ItInfoConstant.CONNECTION_TIME_OUT -> ItInfoConstant.STATUS_CONNECTION_TIME_OUT
			ItInfoConstant.READ_TIME_OUT -> ItInfoConstant.STATUS_READ_TIME_OUT
			ItInfoConstant.PASSWORD_ERROR -> ItInfoConstant.STATUS_PASSWORD_ERROR
			ItInfoConstant.ACCESS_DENIED_LOCKED -> ItInfoConstant.STATUS_ACCESS_DENIED_LOCKED
			ItInfoConstant.LOGIN_ATTEMPT_EXCEED -> ItInfoConstant.STATUS_LOGIN_ATTEMPT_EXCEED
			else -> ItInfoConstant.STATUS_ERROR
		}.also { log.debug("... onAuthenticationFailure('${authenticationException.message}')=$it") }
		request.getRequestDispatcher("/login").forward(request, response)
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
