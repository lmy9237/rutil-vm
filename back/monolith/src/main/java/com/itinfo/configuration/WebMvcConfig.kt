package com.itinfo.configuration

import com.itinfo.rutilvm.common.LoggerDelegate

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.ComponentScan
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.FilterType
import org.springframework.stereotype.Component
import org.springframework.stereotype.Controller
import org.springframework.stereotype.Repository
import org.springframework.stereotype.Service
import org.springframework.web.servlet.config.annotation.DefaultServletHandlerConfigurer
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry
import org.springframework.web.servlet.config.annotation.ViewResolverRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import org.springframework.web.servlet.view.InternalResourceViewResolver
import org.springframework.web.servlet.view.JstlView
import org.springframework.web.servlet.view.UrlBasedViewResolver
import org.springframework.web.servlet.view.json.MappingJackson2JsonView
import org.springframework.web.servlet.view.tiles3.SimpleSpringPreparerFactory
import org.springframework.web.servlet.view.tiles3.TilesConfigurer
import org.springframework.web.servlet.view.tiles3.TilesView
import org.springframework.web.servlet.view.tiles3.TilesViewResolver

@Configuration
@ComponentScan(basePackages = ["com.itinfo"],
	includeFilters = [
		ComponentScan.Filter(type = FilterType.ANNOTATION, classes = [Controller::class]),
		ComponentScan.Filter(type = FilterType.ANNOTATION, classes = [Service::class]),
		ComponentScan.Filter(type = FilterType.ANNOTATION, classes = [Component::class]),
		ComponentScan.Filter(type = FilterType.ANNOTATION, classes = [Repository::class]),
	]
)
class WebMvcConfig : WebMvcConfigurer {
	override fun configureDefaultServletHandling(configurer: DefaultServletHandlerConfigurer) {
		configurer.enable() //<mvc:default-servlet-handler/>
	}

	override fun configureViewResolvers(registry: ViewResolverRegistry) {
		log.info("... configureViewResolvers")
		registry.viewResolver(jspViewResolver())
		registry.jsp("/WEB-INF/jsp/", ".jsp")
		// super.configureViewResolvers(registry)
	}

	@Bean(name=["jsonView"])
	fun jsonView(): MappingJackson2JsonView {
		log.info("... jsonView")
		return MappingJackson2JsonView().apply {
			contentType = "application/json;charset=UTF-8"
		}
	}

	@Bean
	fun urlBasedViewResolver(): UrlBasedViewResolver {
		log.info("... urlBasedViewResolver")
		return UrlBasedViewResolver().apply {
			order = 1
			setViewClass(TilesView::class.java)
		}
	}

	@Bean
	fun tilesViewResolver(): TilesViewResolver {
		log.info("... tilesViewResolver")
		return TilesViewResolver().apply {
			order = 1
		}
	}

	@Bean
	fun tilesConfigurer(): TilesConfigurer {
		log.info("... tilesConfigurer")
		return TilesConfigurer().apply {
			setDefinitions("classpath:tiles/tiles-layout.xml")
			setCheckRefresh(true)
			setPreparerFactoryClass(SimpleSpringPreparerFactory::class.java)
		}
	}

	@Bean
	fun jspViewResolver(): InternalResourceViewResolver {
		log.info("... jspViewResolver")
		return InternalResourceViewResolver().apply {
			setPrefix("/WEB-INF/jsp/")
			setSuffix(".jsp")
			setViewClass(JstlView::class.java)
			order = 2
		}
	}

	override fun addResourceHandlers(registry: ResourceHandlerRegistry) {
		log.info("addResourceHandlers ...")
		registry.addResourceHandler("/css/**").addResourceLocations("classpath:static/css/")
		// registry.addResourceHandler("/externlib/**").addResourceLocations("classpath:static/externlib/")
		registry.addResourceHandler("/images/**").addResourceLocations("classpath:static/images/")
		registry.addResourceHandler("/images_old/**").addResourceLocations("classpath:static/images_old/")
		registry.addResourceHandler("/fonts/**").addResourceLocations("classpath:static/fonts/")
		registry.addResourceHandler("/js/**").addResourceLocations("classpath:static/js/")
		registry.addResourceHandler("/vendors/**").addResourceLocations("classpath:static/vendors/")
		// SwaggerConfig
		registry.addResourceHandler("/swagger-ui.html**").addResourceLocations("classpath:/META-INF/resources/")
		registry.addResourceHandler("/swagger-ui/**").addResourceLocations("classpath:/META-INF/resources/webjars/springfox-swagger-ui/")
		registry.addResourceHandler("/webjars/**").addResourceLocations("classpath:/META-INF/resources/webjars/")
		super.addResourceHandlers(registry)
	}

	companion object {
		private val log by LoggerDelegate()
	}
}