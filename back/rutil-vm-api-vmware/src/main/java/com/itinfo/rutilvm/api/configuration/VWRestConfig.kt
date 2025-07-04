package com.itinfo.rutilvm.api.configuration

import com.google.gson.GsonBuilder
import com.itinfo.rutilvm.api.model.vmware.VWSessionId
import com.itinfo.rutilvm.api.model.vmware.VCenterVm
import com.itinfo.rutilvm.api.model.vmware.VCenterVmDetail
import com.itinfo.rutilvm.common.LoggerDelegate
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import retrofit2.Call
import retrofit2.Retrofit
import retrofit2.converter.scalars.ScalarsConverterFactory
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.GET
import retrofit2.http.Header

import retrofit2.http.POST
import retrofit2.http.Path
import java.security.SecureRandom
import java.security.cert.X509Certificate
import java.util.concurrent.TimeUnit
import javax.net.ssl.SSLContext
import javax.net.ssl.TrustManager
import javax.net.ssl.X509TrustManager

/**
 * [VWRestConfig]
 * VMWare REST API 설정
 *
 * @since 2025-03-07
 * @author 이찬희 (@chanhi2000)
 */
@Configuration
open class VWRestConfig {
	@Autowired private lateinit var propConfig: PropertiesConfig

	open fun vmWareRestRetrofit(baseURL: String): Retrofit {
		val baseURLMod = when {
			baseURL.startsWith("https://", ignoreCase = true) -> baseURL
			baseURL.startsWith("http://", ignoreCase = true) -> "https://${baseURL.substring(7)}"
			else -> "https://$baseURL"
		}
		log.info("retrofit ... baseURL: {}", baseURLMod)
		return Retrofit.Builder()
			.baseUrl(baseURLMod)
			.client(vmWareRestOkHttpClient())
			.addConverterFactory(ScalarsConverterFactory.create())
			.addConverterFactory(GsonConverterFactory.create(GsonBuilder()
				.serializeNulls()
				.setPrettyPrinting()
				.create()))
			.build()
	}

	@Bean
	open fun vmWareRestOkHttpClient(): OkHttpClient {
		log.info("vmWareRestOkHttpClient ...")
		// Install the all-trusting trust manager
		val sslContext: SSLContext = SSLContext.getInstance("SSL")
		sslContext.init(null, vmWareRestTrustAllCerts(), SecureRandom())

		// Create an ssl socket factory with our all-trusting manager
		val socketFactory = sslContext.socketFactory

		return OkHttpClient.Builder()
			.sslSocketFactory(socketFactory, vmWareRestTrustAllCerts()[0] as X509TrustManager)
			.hostnameVerifier { _, _ -> true }
			.addInterceptor(httpLoggingInterceptor())
			//.addInterceptor(basicAuthInterceptor())
			.readTimeout(20, TimeUnit.SECONDS)
			.build()
	}

	@Bean
	open fun vmWareRestTrustAllCerts(): Array<TrustManager> =
		arrayOf(object : X509TrustManager {
			override fun checkClientTrusted(chain: Array<out X509Certificate>?, authType: String? ) {}
			override fun checkServerTrusted(chain: Array<out X509Certificate>?, authType: String?) {}
			override fun getAcceptedIssuers(): Array<X509Certificate> {
				return arrayOf()
			}
		})

	@Bean
	open fun httpLoggingInterceptor(): HttpLoggingInterceptor = HttpLoggingInterceptor().apply {
		this.level = HttpLoggingInterceptor.Level.BODY
	}

	/**
	 * [VMWareRestConfig.basicAuthInterceptor]
	 * VMWare REST API 기본 인증 방식 (ID/PW 결합한 암호화 된 값)
	 */
	/*
	@Bean
	open fun basicAuthInterceptor(): Interceptor = object: Interceptor {
		override fun intercept(chain: Interceptor.Chain): Response {
			val req = chain.request()
			val authenticatedReq = req.newBuilder()
				.header("Authorization", Credentials.basic(
					propConfig.vmwareApiId,
					propConfig.vmwareApiPassword
				))
				.build()
			return chain.proceed(authenticatedReq)
		}
	}*/

	companion object {
		private val log by LoggerDelegate()
	}
}

interface AuthService {
	/**
	 * [createSession]
	 * Calls /rest/com/vmware/cis/session
	 *
	 * @param authHeader [String] The resource to retrieve, e.g., "engine-certificate" or "ca-certificate".
	 *
	 * @return A Call wrapping the response as a plain String.
	 */
	@POST("/rest/com/vmware/cis/session")
	fun createSession(
		@Header("Authorization") authHeader: String,
	): Call<VWSessionId>
}

interface VCenterVMService {
	@GET("/api/vcenter/vm")
	fun findAll(
		@Header("vmware-api-session-id") sessionId: String,
	): Call<List<VCenterVm>>

	@GET("/api/vcenter/vm/{vmId}")
	fun findOne(
		@Header("vmware-api-session-id") sessionId: String,
		@Path("vmId") vmId: String,
	): Call<VCenterVmDetail?>
}
