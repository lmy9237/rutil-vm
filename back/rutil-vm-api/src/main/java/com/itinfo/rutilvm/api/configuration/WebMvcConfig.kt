package com.itinfo.rutilvm.api.configuration

import com.itinfo.rutilvm.common.LoggerDelegate
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.ComponentScan
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.FilterType
import org.springframework.core.io.Resource
import org.springframework.data.web.PageableHandlerMethodArgumentResolver
import org.springframework.stereotype.Component
import org.springframework.stereotype.Controller
import org.springframework.stereotype.Repository
import org.springframework.stereotype.Service
import org.springframework.web.method.support.HandlerMethodArgumentResolver
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import org.springframework.web.servlet.resource.PathResourceResolver
import org.springframework.web.servlet.resource.ResourceResolverChain
import org.springframework.web.servlet.view.json.MappingJackson2JsonView
import javax.servlet.http.HttpServletRequest

@Configuration
@ComponentScan(
	basePackages = ["com.itinfo.rutilvm.api"],
	includeFilters = [
		ComponentScan.Filter(type = FilterType.ANNOTATION, classes = [Controller::class]),
		ComponentScan.Filter(type = FilterType.ANNOTATION, classes = [Service::class]),
		ComponentScan.Filter(type = FilterType.ANNOTATION, classes = [Component::class]),
		ComponentScan.Filter(type = FilterType.ANNOTATION, classes = [Repository::class]),
	]
)
class WebMvcConfig : WebMvcConfigurer {
	override fun addArgumentResolvers(
		resolvers: MutableList<HandlerMethodArgumentResolver?>
	) {
		val pageableResolver = PageableHandlerMethodArgumentResolver().apply {
			setMaxPageSize(10_000) // NOTE: Pageable을 사용할 때 최고 조회량을 설정
			// setFallbackPageable(PageRequest.of(0, 50));
		}
		resolvers.add(pageableResolver)
	}
/*
	override fun configureViewResolvers(registry: ViewResolverRegistry) {
		log.info("... configureViewResolvers")
		registry.viewResolver(jspViewResolver())
		registry.jsp("/WEB-INF/views/", ".jsp")
		// super.configureViewResolvers(registry)
	}
*/

	@Bean(name = ["jsonView"])
	fun jsonView(): MappingJackson2JsonView {
		log.info("... jsonView")
		return MappingJackson2JsonView().apply {
			contentType = "application/json;charset=UTF-8"
		}
	}

	// TODO: 의존도 파악 후 제거 여부 확인
	override fun addCorsMappings(registry: CorsRegistry) {
		registry.addMapping("/**")
			.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
			.allowedOrigins("*")
			.allowedHeaders("*")
			.maxAge(3000)
		super.addCorsMappings(registry)
	}

//	@Bean
//	fun urlBasedViewResolver(): UrlBasedViewResolver {
//		log.info("... urlBasedViewResolver")
//		return UrlBasedViewResolver().apply {
//			order = 1
//			setViewClass(TilesView::class.java)
//		}
//	}

//	@Bean
//	fun jspViewResolver(): InternalResourceViewResolver {
//		log.info("... jspViewResolver")
//		return InternalResourceViewResolver().apply {
//			setPrefix("/WEB-INF/views/")
//			setSuffix(".jsp")
//			setViewClass(JstlView::class.java)
//			order = 2
//		}
//	}

	override fun addResourceHandlers(registry: ResourceHandlerRegistry) {
		log.info("addResourceHandlers ...")
//		registry.addResourceHandler("/css/**").addResourceLocations("classpath:static/static/css/")
//		registry.addResourceHandler("/js/**").addResourceLocations("classpath:static/static/js/")
// 		registry.addResourceHandler("/externlib/**").addResourceLocations("classpath:static/externlib/")
		registry.addResourceHandler("/**").addResourceLocations(
			"classpath:/META-INF/resources/",
			"classpath:/resources/",
			"classpath:/static/",
			"classpath:/public/"
		)
		registry.addResourceHandler("/images/**")
			.addResourceLocations("classpath:/static/images/")
		registry.addResourceHandler("/images_old/**")
			.addResourceLocations("classpath:/static/images_old/")
		registry.addResourceHandler("/fonts/**")
			.addResourceLocations("classpath:/static/fonts/")
		registry.addResourceHandler("/vendors/**")
			.addResourceLocations("classpath:/static/vendors/")

		// SwaggerConfig
		registry.addResourceHandler("/v2/api-docs/**")
			.addResourceLocations("classpath:/META-INF/resources/")
		registry.addResourceHandler("/swagger-ui.html**")
			.addResourceLocations("classpath:/META-INF/resources/")
		registry.addResourceHandler("/swagger-ui/**")
			.addResourceLocations("classpath:/META-INF/resources/webjars/springfox-swagger-ui/")
		registry.addResourceHandler("/webjars/**")
			.addResourceLocations("classpath:/META-INF/resources/webjars/")

		this.serveDirectory(registry, "/", "classpath:/static/")
		super.addResourceHandlers(registry)
	}

	private fun serveDirectory(
		registry: ResourceHandlerRegistry,
		endpoint: String,
		location: String
	) {
		// implementation will come here
		// 1
		val endpointPatterns: Array<String> = if (endpoint.endsWith("/"))
			arrayOf(endpoint.substring(0, endpoint.length - 1), endpoint, "$endpoint**")
		else
			arrayOf(endpoint, "$endpoint/", "$endpoint/**")

		registry // 2
			.addResourceHandler(*endpointPatterns)
			.addResourceLocations(if (location.endsWith("/")) location else "$location/")
			.resourceChain(false) // 3
			.addResolver(object : PathResourceResolver() {
				override fun resolveResource(
					request: HttpServletRequest?,
					requestPath: String,
					locations: MutableList<out Resource>,
					chain: ResourceResolverChain
				): Resource? {
					val resource: Resource? =
						super.resolveResource(request, requestPath, locations, chain)
					if (resource != null)
						return resource
					return super.resolveResource(request, "/index.html", locations, chain)
				}
			})
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
