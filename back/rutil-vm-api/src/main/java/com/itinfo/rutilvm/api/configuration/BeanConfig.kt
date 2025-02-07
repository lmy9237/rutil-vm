package com.itinfo.rutilvm.api.configuration

import com.itinfo.rutilvm.common.LoggerDelegate

import com.zaxxer.hikari.HikariConfig

import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter
import org.springframework.web.filter.HiddenHttpMethodFilter

@Configuration
class BeanConfig: HikariConfig() {

	// @Autowired private lateinit var applicationContext: ApplicationContext
	@Bean
	fun entityManagerFactoryBuilder(): EntityManagerFactoryBuilder {
		log.info("... entityManagerFactoryBuilder")
		return EntityManagerFactoryBuilder(HibernateJpaVendorAdapter(), hashMapOf<String,Any>(), null)
	}

//	@Bean
//	fun hiddenHttpMethodFilter(): HiddenHttpMethodFilter {
//		return HiddenHttpMethodFilter()
//	}

	companion object {
		private val log by LoggerDelegate()
	}
}