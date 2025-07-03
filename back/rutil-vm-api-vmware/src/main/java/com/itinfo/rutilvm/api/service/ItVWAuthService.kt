package com.itinfo.rutilvm.api.service

import com.itinfo.rutilvm.api.configuration.AuthService
import com.itinfo.rutilvm.api.configuration.VWRestConfig
import com.itinfo.rutilvm.api.model.vmware.VWPromptAuth
import com.itinfo.rutilvm.api.model.vmware.VWSessionId
import com.itinfo.rutilvm.common.LoggerDelegate
import okhttp3.Credentials
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import retrofit2.Response
import retrofit2.create

interface ItVWAuthService {
	/**
	 * [ItVWAuthService.createSession]
	 *
	 * @param vwPromptAuth [VWPromptAuth]
	 */
	fun createSession(vwPromptAuth: VWPromptAuth): VWSessionId
}

@Service
open class VWAuthServiceImpl(
): ItVWAuthService {
	@Autowired private lateinit var vwRestConfig: VWRestConfig

	private fun authService(baseUrl: String): AuthService =
		vwRestConfig.vmWareRestRetrofit(baseUrl).create(AuthService::class.java)

	@Throws(Exception::class)
	override fun createSession(vwPromptAuth: VWPromptAuth): VWSessionId {
		log.info("createSession...")
		val call = authService(vwPromptAuth.baseUrl)
			.createSession(vwPromptAuth.toCredentialBasic)
		// Execute the call synchronously
		val response: Response<VWSessionId> = call.execute()
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
