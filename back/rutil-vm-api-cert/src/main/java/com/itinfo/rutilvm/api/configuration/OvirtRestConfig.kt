package com.itinfo.rutilvm.api.configuration

import com.itinfo.rutilvm.common.LoggerDelegate
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import retrofit2.Call
import retrofit2.Retrofit
import retrofit2.converter.scalars.ScalarsConverterFactory
import retrofit2.http.GET
import retrofit2.http.Query
import java.security.SecureRandom
import java.security.cert.X509Certificate
import java.util.concurrent.TimeUnit
import javax.net.ssl.SSLContext
import javax.net.ssl.SSLSocketFactory
import javax.net.ssl.TrustManager
import javax.net.ssl.X509TrustManager

@Configuration
open class OvirtRestConfig {

	@Bean
	open fun pkiResourceService() = retrofit().create(PkiResourceService::class.java)

	@Bean
	open fun retrofit(): Retrofit {
		log.info("retrofit ...")
		val baseUrl = "https:${ovirtIp}/ovirt-engine/services/"
		return Retrofit.Builder()
				.baseUrl(baseUrl)
				.client(okHttpClient())
				.addConverterFactory(ScalarsConverterFactory.create())
				.build()
	}

	@Value("\${application.ovirt.ip}")		private lateinit var ovirtIp: String

	@Bean
	open fun okHttpClient(): OkHttpClient {
		log.info("okHttpClient ...")
		val trustAllCerts = arrayOf<TrustManager>(object : X509TrustManager {
			override fun checkClientTrusted(chain: Array<out X509Certificate>?, authType: String? ) {}
			override fun checkServerTrusted(chain: Array<out X509Certificate>?, authType: String?) {}
			override fun getAcceptedIssuers(): Array<X509Certificate> {
				return arrayOf()
			}
		})
		// Install the all-trusting trust manager
		val sslContext: SSLContext = SSLContext.getInstance("SSL")
		sslContext.init(null, trustAllCerts, SecureRandom())

		// Create an ssl socket factory with our all-trusting manager
		val socketFactory = sslContext.socketFactory
		val interceptor = HttpLoggingInterceptor().apply {
			this.level = HttpLoggingInterceptor.Level.BODY
		}
		return OkHttpClient.Builder()
			.sslSocketFactory(socketFactory, trustAllCerts[0] as X509TrustManager)
			.hostnameVerifier { _, _ -> true }
			.addInterceptor(interceptor)
			.readTimeout(20, TimeUnit.SECONDS)
			.build()
	}

	@Bean
	open fun sslSocketFactory(): SSLSocketFactory {
		// Install the all-trusting trust manager
		val trustAllCerts = arrayOf<TrustManager>(object : X509TrustManager {
			override fun checkClientTrusted(
				chain: Array<out X509Certificate>?,
				authType: String?
			) {
			}

			override fun checkServerTrusted(
				chain: Array<out X509Certificate>?,
				authType: String?
			) {
			}

			override fun getAcceptedIssuers(): Array<X509Certificate> {
				return arrayOf()
			}
		})
		val sslContext: SSLContext = SSLContext.getInstance("SSL")
		sslContext.init(null, trustAllCerts, SecureRandom())

		// Create an ssl socket factory with our all-trusting manager
		return sslContext.socketFactory
	}

	companion object {
		private val log by LoggerDelegate()
	}
}

interface PkiResourceService {
	/**
	 * [getCertificate]
	 * Calls /ovirt-engine/services/pki-resource endpoint.
	 *
	 * @param resource [String] The resource to retrieve, e.g., "engine-certificate" or "ca-certificate".
	 * @param format [String] The format of the certificate, e.g., "OPENSSH-PUBKEY", "X509-PEM", or "X509-PEM-CA".
	 * @return A Call wrapping the response as a plain String.
	 */
	@GET("pki-resource")
	fun getCertificate(
		@Query("resource") resource: String,
		@Query("format") format: String
	): Call<String>
}
