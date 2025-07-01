package com.itinfo.rutilvm.api.configuration
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;

import javax.net.ssl.SSLContext

import org.apache.http.client.HttpClient
import org.apache.http.config.Registry
import org.apache.http.config.RegistryBuilder
import org.apache.http.conn.socket.ConnectionSocketFactory
import org.apache.http.conn.socket.PlainConnectionSocketFactory
import org.apache.http.conn.ssl.NoopHostnameVerifier
import org.apache.http.conn.ssl.SSLConnectionSocketFactory
import org.apache.http.impl.client.HttpClientBuilder
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager
import org.apache.http.ssl.SSLContexts
import org.apache.http.ssl.TrustStrategy
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;
import java.security.cert.X509Certificate

@Configuration
public class RestTemplateConfig {

	@Bean
	@Throws(KeyManagementException::class, NoSuchAlgorithmException::class, KeyStoreException::class)
	fun httpClient(): HttpClient {
		// 모든 인증서를 신뢰하도록 설정한다
		val acceptingTrustStrategy: TrustStrategy = TrustStrategy { chain, authType -> true }
		val sslContext: SSLContext = SSLContexts.custom().loadTrustMaterial(null, acceptingTrustStrategy).build();

		// Https 인증 요청시 호스트네임 유효성 검사를 진행하지 않게 한다.
		val sslsf: SSLConnectionSocketFactory =SSLConnectionSocketFactory(sslContext, NoopHostnameVerifier.INSTANCE);
		val socketFactoryRegistry: Registry<ConnectionSocketFactory> = RegistryBuilder.create<ConnectionSocketFactory>()
			.register("https", sslsf)
			.register("http", PlainConnectionSocketFactory()).build();

		val connectionManager: PoolingHttpClientConnectionManager = PoolingHttpClientConnectionManager(socketFactoryRegistry);
		val httpClientBuilder: HttpClientBuilder = HttpClientBuilder.create()
		httpClientBuilder.setConnectionManager(connectionManager);
		return httpClientBuilder.build()
	}

	@Bean
	fun factory(httpClient: HttpClient): HttpComponentsClientHttpRequestFactory
		= HttpComponentsClientHttpRequestFactory().apply {
			setConnectTimeout(3000)
			setHttpClient(httpClient)
		}

	@Bean
	fun restTemplate(factory: HttpComponentsClientHttpRequestFactory): RestTemplate?
		= RestTemplate(factory)

}
