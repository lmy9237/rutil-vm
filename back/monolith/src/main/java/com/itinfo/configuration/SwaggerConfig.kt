package com.itinfo.configuration

import com.itinfo.rutilvm.common.LoggerDelegate
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import springfox.documentation.builders.PathSelectors
import springfox.documentation.builders.RequestHandlerSelectors
import springfox.documentation.builders.ResponseBuilder
import springfox.documentation.service.ApiInfo
import springfox.documentation.service.Contact
import springfox.documentation.service.Response
import springfox.documentation.spi.DocumentationType
import springfox.documentation.spring.web.plugins.Docket


// @EnableSwagger2
@Configuration
class SwaggerConfig {
	@Bean
	fun api(): Docket {
		log.debug("... api")
		return Docket(DocumentationType.SWAGGER_2)
			.consumes(getConsumeContentTypes())
			.produces(getProduceContentTypes())
			.useDefaultResponseMessages(false)
			.apiInfo(apiInfo())
			.globalResponses(HttpMethod.POST, arrayList) // getArrayList()함수에서 정의한 응답메시지 사용
			.select()
			.apis(RequestHandlerSelectors.basePackage("com.itinfo.controller"))
			.paths(PathSelectors.any())
			.build()
	}

	private fun apiInfo(): ApiInfo {
		return ApiInfo(
			"오케스트로 API",
			"오케스트로 API",
			"0.0.5",
			"Terms of service",
			Contact("chlee", "github.com/chanhi2000", "chanhi2000@gmail.com"),
			"Apache 2.0", "http://www.apache.org/licenses/LICENSE-2.0", emptyList()
		)
	}

	private fun getConsumeContentTypes(): Set<String> = hashSetOf(
		"application/json;charset=UTF-8",
		"application/x-www-form-urlencoded"
	)

	private fun getProduceContentTypes(): Set<String> = hashSetOf(
		"application/json;charset=UTF-8"
	)

	private val arrayList: List<Response>
		get() = arrayListOf(
			ResponseBuilder().code("500").description("이상한요청").build(),
			ResponseBuilder().code("403").description("황당한요청").build(),
			ResponseBuilder().code("401").description("비인증된접근").build()
		)

	companion object {
		private val log by LoggerDelegate()
	}
}