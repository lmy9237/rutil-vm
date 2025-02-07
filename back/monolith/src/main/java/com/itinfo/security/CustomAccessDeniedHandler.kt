package com.itinfo.security

import com.itinfo.rutilvm.common.LoggerDelegate

import org.springframework.security.access.AccessDeniedException
import org.springframework.security.web.access.AccessDeniedHandler

import java.io.IOException
import javax.servlet.ServletException
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

class CustomAccessDeniedHandler(
	private val errorPage: String = "/WEB-INF/jsp/com/itinfo/login/accessDenied.jsp"
) : AccessDeniedHandler {

	@Throws(ServletException::class, IOException::class)
	override fun handle(
		request: HttpServletRequest,
		response: HttpServletResponse,
		e: AccessDeniedException
	) {
		log.info("..." + this.errorPage)
		log.info("    - Exception : ${e.javaClass.canonicalName}")
		log.info("    - LocalizedMessage : ${e.localizedMessage}")
		log.info("    - Message : ${e.message}")
		log.info("    - StackTrace : ${e.stackTrace}",)
		e.printStackTrace()
		request.setAttribute("errMsg", e.message)
		request.getRequestDispatcher(errorPage).forward(request, response)
	}
	
	companion object {
		private val log by LoggerDelegate()
	}
}

