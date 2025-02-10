package com.itinfo.rutilvm.api.filter

import com.itinfo.rutilvm.api.filter.GlobalFilter.Companion
import com.itinfo.rutilvm.common.LoggerDelegate
import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component
import javax.servlet.Filter
import javax.servlet.FilterChain
import javax.servlet.ServletRequest
import javax.servlet.ServletResponse
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

@Order(-1)
@Component
class CORSFilter: Filter {
	override fun doFilter(
		req: ServletRequest?,
		res: ServletResponse?,
		chain: FilterChain?
	) {
		log.debug("doFilter ... ")
		val request = req as? HttpServletRequest
		val response = res as? HttpServletResponse

//		response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));
		response?.setHeader("Access-Control-Allow-Origin", "*") // * = all domainName
		response?.setHeader("Access-Control-Allow-Credentials", "true") // allow CrossDomain to use Origin Domain
		response?.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT")
		response?.setHeader("Access-Control-Max-Age", "3600") // Preflight cache duration in browser

//		response.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-With, remember-me");
		response?.setHeader("Access-Control-Allow-Headers", "*") // all header

		log.info("doFilter ... CORSFilter APPLIED!")
		chain?.doFilter(req, res)
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
