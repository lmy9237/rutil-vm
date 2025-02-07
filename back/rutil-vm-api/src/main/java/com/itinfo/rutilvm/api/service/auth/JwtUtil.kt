package com.itinfo.rutilvm.api.service.auth

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.repository.aaarepository.OvirtUserRepository
import com.itinfo.rutilvm.api.repository.aaarepository.RefreshTokenRepository
import com.itinfo.rutilvm.api.repository.aaarepository.dto.TokenDto
import com.itinfo.rutilvm.api.repository.aaarepository.entity.RefreshToken
import com.itinfo.rutilvm.api.repository.aaarepository.entity.toUserDetails

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Component
import java.security.Key
import java.util.*
import javax.annotation.PostConstruct
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse


@Component
class JwtUtil {
	@Autowired private lateinit var refreshToken: RefreshTokenRepository
	@Autowired private lateinit var ovirtUsers: OvirtUserRepository

	@PostConstruct
	fun init() {
		// bean으로 등록 되면서 딱 한번 실행이 됩니다.
		val bytes: ByteArray = Base64.getDecoder().decode(secretKey)
		key = Keys.hmacShaKeyFor(bytes)
	}

	// header 토큰을 가져오는 기능
	fun getHeaderToken(request: HttpServletRequest, type: String): String? {
		return request.getHeader(if (type == "Access") ACCESS_TOKEN else REFRESH_TOKEN)
	}

	// 토큰 생성
	fun createAllToken(username: String): TokenDto = TokenDto.builder {
		accessToken { createToken(username, "Access") }
		createToken(username, "Refresh")
	}

	fun createToken(username: String, type: String): String {
		val date = Date()
		val time = if (type == "Access") ACCESS_TIME else REFRESH_TIME
		return Jwts.builder()
			.setSubject(username)
			.setExpiration(Date(date.time+time))
			.setIssuedAt(date)
			.signWith(key, signatureAlgorithm)
			.compact()
	}

	// 토큰 검증
	fun tokenValidation(username: String): Boolean = runCatching {
		Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(username)
		return true
	}.onFailure {
		log.error(it.message)
		return false
	}.isSuccess

	// refreshToken 토큰 검증
	// db에 저장되어 있는 token과 비교
	// db에 저장한다는 것이 jwt token을 사용한다는 강점을 상쇄시킨다.
	// db 보다는 redis를 사용하는 것이 더욱 좋다. (in-memory db기 때문에 조회속도가 빠르고 주기적으로 삭제하는 기능이 기본적으로 존재합니다.)
	fun refreshTokenValidation(token: String): Boolean {
		// 1차 토큰 검증
		if (!tokenValidation(token))
			return false

		// DB에 저장한 토큰 비교
		val refreshToken: RefreshToken? = refreshToken.findByExternalId(getEmailFromToken(token))
		return token == refreshToken?.refreshToken
	}

	// 인증 객체 생성
	fun createAuthentication(username: String): Authentication? {
		val userDetails: UserDetails? = ovirtUsers.findByName(username)?.toUserDetails()
		return UsernamePasswordAuthenticationToken(userDetails, "", userDetails?.authorities)
	}

	// 토큰에서 email 가져오는 기능
	fun getEmailFromToken(token: String?): String {
		return Jwts.parserBuilder()
			.setSigningKey(key)
			.build().parseClaimsJws(token).body.subject
	}

	// 어세스 토큰 헤더 설정
	fun setHeaderAccessToken(response: HttpServletResponse, accessToken: String?) {
		response.setHeader("Access_Token", accessToken)
	}

	// 리프레시 토큰 헤더 설정
	fun setHeaderRefreshToken(response: HttpServletResponse, refreshToken: String?) {
		response.setHeader("Refresh_Token", refreshToken)
	}

	@Value("\${security.jwt.secret.key}")
	private lateinit var secretKey: String
	private lateinit var key: Key


	companion object {
		private val log by LoggerDelegate()
		private val signatureAlgorithm: SignatureAlgorithm = SignatureAlgorithm.HS256
		 const val ACCESS_TIME: Long = 60 * 1000L
		 const val REFRESH_TIME: Long = 2 * 60 * 1000L
		 const val ACCESS_TOKEN: String = "Access_Token"
		 const val REFRESH_TOKEN: String = "Refresh_Token"
	}
}