package com.itinfo.rutilvm.api.service

import com.itinfo.rutilvm.api.configuration.AuthService
import com.itinfo.rutilvm.api.model.vmware.VMWareSessionId
import com.itinfo.rutilvm.common.LoggerDelegate
import okhttp3.Credentials
import org.springframework.stereotype.Service
import retrofit2.Response

interface ItVWAuthService {
	/**
	 * [ItVWAuthService.createSession]
	 *
	 * @param username [String]
	 * @param password [String]
	 */
	fun createSession(username: String, password: String): VMWareSessionId
}

@Service
open class VWAuthServiceImpl(
	private val authService: AuthService
): ItVWAuthService {
	@Throws(Exception::class)
	override fun createSession(username: String, password: String): VMWareSessionId {
		log.info("createSession...")
		val basicAuth: String = Credentials.basic(username, password)
		val call = authService.createSession(basicAuth)
		// Execute the call synchronously
		val response: Response<VMWareSessionId> = call.execute()
		if (response.isSuccessful) {
			return response.body() ?: throw RuntimeException("Response body is null")
		} else {
			throw RuntimeException("Failed to fetch engine SSH public key: ${response.errorBody()?.string()}")
		}
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
