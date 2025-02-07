package com.itinfo.security

import com.itinfo.ItInfoConstant
import com.itinfo.rutilvm.common.LoggerDelegate

import com.itinfo.service.SystemPropertiesService
import com.itinfo.service.UsersService

import org.apache.commons.lang3.exception.ExceptionUtils

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.web.authentication.WebAuthenticationDetails

import org.springframework.security.core.Authentication
import org.springframework.security.core.AuthenticationException
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority



class CustomAuthProvider : AuthenticationProvider {
	@Autowired private lateinit var usersService: UsersService
	@Autowired private lateinit var systemPropertiesService: SystemPropertiesService
	@Autowired private lateinit var securityConnectionService: SecurityConnectionService

	@Throws(AuthenticationException::class)
	override fun authenticate(authentication: Authentication): Authentication {
		log.info("... authenticate('$authentication')")
		val userId = "${authentication.principal}".also { log.debug("userid: '$it'") }
		val passwd = "${authentication.credentials}".decodeBase64().also { log.debug("passwd: '$it'") }
		val retrievePasswd = usersService.login(userId).also { log.debug("retrievePasswd: $it") }
		val wad = authentication.details as WebAuthenticationDetails
		val userIPAddress = wad.remoteAddress
//		usersService.initLoginCount(userId)

		try {
			// 생략: oVirt안에 그런 기능이 없음
			/*
			val blockTime = usersService.fetchUser(userId)?.blockTime.also {
				log.debug("blockTime: $it")
				if (!it.isNullOrBlank() && !SecurityUtils.compareTime(it))
					throw BadCredentialsException("loginAttemptExceed")
			}
			*/

			log.info("validating password ...")
			if (passwd.validatePassword(retrievePasswd)) {
				log.info("VALID PASSWORD !!!")
				val systemProperties = systemPropertiesService.retrieveSystemProperties()
				securityConnectionService.user = systemProperties.id
				securityConnectionService.password = systemProperties.password
				log.info("Login successful [ userId : ${systemProperties.id} ] [ request ip : $userIPAddress ]")
			} else {
				log.warn("FAILED!!!")
				usersService.fetchUser(userId)?.let { user ->
					// 생략: 로그인 시도 실패 시 회수 증가
					// 사유: oVirt안에 그런 기능이 없음
					/*
					user.loginCount += 1
					usersService.updateLoginCount(user)
					if (systemPropertiesService.retrieveSystemProperties().loginLimit <= user.loginCount)
						usersService.setBlockTime(user)
					*/
				}
				log.error("Login fail [ userId :  $userId ] [ request ip : $userIPAddress ]")
				throw BadCredentialsException(ItInfoConstant.PASSWORD_ERROR)
			}

			val roles: List<GrantedAuthority> = listOf(SimpleGrantedAuthority("USER"))
			val result = UsernamePasswordAuthenticationToken(userId, passwd, roles).apply {
				details = CustomUserDetails.custerUserDetails {
					userid { userId }
					passwd { passwd }
					url { securityConnectionService.url }
				}.also { log.debug("returning ... $it") }
			}
			return result
		} catch (e: Exception) {
			log.error(e.localizedMessage)
			val exception = ExceptionUtils.getStackTrace(e)
			var message: String? = authenticationExceptionMessage(exception)
			if (!message.equals(ItInfoConstant.CONNECTION_TIME_OUT, ignoreCase = true)) message = e.message
			throw BadCredentialsException(message)
		}
	}

	override fun supports(authentication: Class<*>): Boolean =
		authentication == UsernamePasswordAuthenticationToken::class.java


	fun authenticationExceptionMessage(exception: String): String =
		if ((exception.indexOf("org.apache.http.conn.HttpHostConnectException") > 0))
			ItInfoConstant.CONNECTION_TIME_OUT
		else
			""

	companion object {
		private val log by LoggerDelegate()
	}
}
