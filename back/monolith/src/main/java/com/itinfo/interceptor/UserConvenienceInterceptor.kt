package com.itinfo.interceptor

import com.itinfo.ItInfoConstant
import com.itinfo.rutilvm.common.LoggerDelegate

import org.springframework.web.servlet.handler.HandlerInterceptorAdapter
import org.springframework.web.util.WebUtils

import javax.servlet.http.Cookie
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

/**
 * [UserConvenienceInterceptor]
 * 편의성 인터셉터
 *
 * @author chlee
 * @since 2023.12.07
 */
class UserConvenienceInterceptor(
	var paramName: String
) : HandlerInterceptorAdapter() {
	var userConvenienceCookie: Cookie? = null

	override fun preHandle(
		request: HttpServletRequest,
		response: HttpServletResponse,
		handler: Any
	): Boolean {
		log.debug("... preHandle")
		val menuSize = request.getParameter(paramName)
		if (WebUtils.getCookie(request, "userConvenienceCookie") != null) {
			this.userConvenienceCookie =
				WebUtils.getCookie(request, "userConvenienceCookie")?.also {
					if (menuSize != null && menuSize.equals("M", ignoreCase = true)) {
						log.debug("menuSize FOUND! > $menuSize")
						it.value =
							if (menuSize.equals("M", ignoreCase = true)) ItInfoConstant.MENU_SIZE_M
							else ItInfoConstant.MENU_SIZE_S
					}
				}
		} else if (menuSize != null) {
			if (menuSize.equals("M", ignoreCase = true)) {
				this.userConvenienceCookie = Cookie("userConvenienceCookie", ItInfoConstant.MENU_SIZE_M)
				log.info("쿠키 설정함 M")
			} else {
				this.userConvenienceCookie = Cookie("userConvenienceCookie", ItInfoConstant.MENU_SIZE_S)
			}
		} else {
			this.userConvenienceCookie = Cookie("userConvenienceCookie", ItInfoConstant.MENU_SIZE_M)
		}
		userConvenienceCookie?.maxAge = 63072000
		userConvenienceCookie?.path = "/"
		response.addCookie(this.userConvenienceCookie)
		return true
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
