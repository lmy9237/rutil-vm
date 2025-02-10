package com.itinfo.rutilvm.api.configuration

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.util.BasicConfiguration

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Import
import org.springframework.http.HttpMethod
import springfox.bean.validators.configuration.BeanValidatorPluginsConfiguration
import springfox.documentation.builders.PathSelectors
import springfox.documentation.builders.RequestHandlerSelectors
import springfox.documentation.builders.ResponseBuilder
import springfox.documentation.service.*
import springfox.documentation.spi.DocumentationType
import springfox.documentation.spi.service.contexts.SecurityContext
import springfox.documentation.spring.web.plugins.Docket


// @EnableWebMvc
@Configuration
@Import(BeanValidatorPluginsConfiguration::class)
class SwaggerConfig {

	private val basicConf
		get() = BasicConfiguration.getInstance()


    @Bean
    fun api(): Docket {
        log.debug("... api")
        return Docket(DocumentationType.SWAGGER_2)
            // .ignoredParameterTypes(AutheticationPrincipal::class)
            // .consumes(getConsumeContentTypes())
            // .produces(getProduceContentTypes())
            .useDefaultResponseMessages(false)
            .globalResponses(HttpMethod.POST, arrayList) // getArrayList()함수에서 정의한 응답메시지 사용
            .select()
            .apis(RequestHandlerSelectors.basePackage("com.itinfo.rutilvm.api.controller"))
            .paths(PathSelectors.any())
            .build()
            .apiInfo(apiInfo())
    }

    private fun apiInfo(): ApiInfo {
        return ApiInfo(
			basicConf.appName,
            "${basicConf.appName} API",
			basicConf.appVersion,
            "Terms of Service",
            Contact("ititcloud", "https://github.com/ititcloud", "itcloud@ititinfo.com"),
            "Apache 2.0", "http://www.apache.org/licenses/LICENSE-2.0", emptyList()
        )
    }

    private val arrayList: List<Response>
        get() = arrayListOf(
            ResponseBuilder().code("500").description("이상한요청").build(),
            ResponseBuilder().code("403").description("황당한요청").build(),
            ResponseBuilder().code("401").description("비인증된접근").build()
        )

    private fun securityContext(): SecurityContext =
         SecurityContext.builder()
            .securityReferences(defaultAuth())
            .build()

    private fun defaultAuth(): List<SecurityReference> =
        listOf(
            SecurityReference(
                "Authorization",
                arrayOf(AuthorizationScope("global", "accessEverything"))
            )
        )

    private fun apiKey(): ApiKey =
        ApiKey("Authorization", "X-AUTH-TOKEN", "header")

    private fun getConsumeContentTypes(): Set<String> =
        setOf(
            "application/json;charset=UTF-8",
            "application/x-www-form-urlencoded"
        )

    private fun getProduceContentTypes(): Set<String> =
        setOf("application/json;charset=UTF-8")

    companion object {
        private val log by LoggerDelegate()
    }
}
