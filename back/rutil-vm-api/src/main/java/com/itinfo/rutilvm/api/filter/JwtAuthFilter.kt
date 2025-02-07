package com.itinfo.rutilvm.api.filter

import com.fasterxml.jackson.databind.ObjectMapper
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.model.response.Res
import com.itinfo.rutilvm.api.service.auth.ItOvirtUserService
import com.itinfo.rutilvm.api.service.auth.JwtUtil
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.filter.OncePerRequestFilter
import javax.servlet.FilterChain
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

class JwtAuthFilter (
	// private val tokenProvider: TokenProvider,
	// private val refreshTokenRepository: RefreshTokenRepository,
): OncePerRequestFilter() {
	@Autowired private lateinit var jwtUtil: JwtUtil

	// HTTP 요청이 오면 WAS(tomcat)가 HttpServletRequest, HttpServletResponse 객체를 만들어 줍니다.
	// 만든 인자 값을 받아옵니다.
	// 요청이 들어오면 diFilterInternal 이 딱 한번 실행된다.
	override fun doFilterInternal(
		request: HttpServletRequest,
		response: HttpServletResponse,
		filterChain: FilterChain
	) {
		log.info("doFilterInternal ... ")
		// WebSecurityConfig 에서 보았던 UsernamePasswordAuthenticationFilter 보다 먼저 동작을 하게 됩니다.
		// Access / Refresh 헤더에서 토큰을 가져옴.
		val accessToken = jwtUtil.getHeaderToken(request, "Access")
		val refreshToken = jwtUtil.getHeaderToken(request, "Refresh")
		if (accessToken == null) {
			log.warn("doFilterInternal ... NO accessToken FOUND!")
			return
		}
		// 어세스 토큰값이 유효하다면 setAuthentication를 통해
		// security context에 인증 정보저장
		if (jwtUtil.tokenValidation(accessToken)) {
			applyAuthentication(jwtUtil.getEmailFromToken(accessToken))
		} else if (refreshToken != null) {
			// 리프레시 토큰 검증 && 리프레시 토큰 DB에서  토큰 존재유무 확인
			val isRefreshToken = jwtUtil.refreshTokenValidation(refreshToken)
			// 리프레시 토큰이 유효하고 리프레시 토큰이 DB와 비교했을때 똑같다면
			if (isRefreshToken) {
				val loginId = jwtUtil.getEmailFromToken(refreshToken)   // 리프레시 토큰으로 아이디 정보 가져오기
				val newAccessToken = jwtUtil.createToken(loginId, "Access") // 새로운 어세스 토큰 발급
				jwtUtil.setHeaderAccessToken(response, newAccessToken) // 헤더에 어세스 토큰 추가
				applyAuthentication(jwtUtil.getEmailFromToken(newAccessToken)) // Security context에 인증 정보 넣기
			} else {
				jwtExceptionHandler(response, "RefreshToken Expired", HttpStatus.BAD_REQUEST)
				return
			}
		}
		filterChain.doFilter(request, response)
	}

	// SecurityContext 에 Authentication 객체를 저장합니다.
	fun applyAuthentication(username: String) {
		val authentication: Authentication? = jwtUtil.createAuthentication(username)
		// security가 만들어주는 securityContextHolder 그 안에 authentication을 넣어줍니다.
		// security가 securitycontextholder에서 인증 객체를 확인하는데
		// jwtAuthfilter에서 authentication을 넣어주면 UsernamePasswordAuthenticationFilter 내부에서 인증이 된 것을 확인하고 추가적인 작업을 진행하지 않습니다.
		SecurityContextHolder.getContext().authentication = authentication
	}

	// Jwt 예외처리
	fun jwtExceptionHandler(response: HttpServletResponse, msg: String?, status: HttpStatus) {
		response.status = status.value()
		response.contentType = "application/json"
		try {
			val json = ObjectMapper().writeValueAsString(Res.fail<Any>(status.value(), msg))
			response.writer.write(json)
		} catch (e: Exception) {
			log.error(e.message)
		}
	}

	companion object {
		private val log by LoggerDelegate()
	}
}