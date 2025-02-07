package com.itinfo.rutilvm.api.configuration

import com.itinfo.rutilvm.common.LoggerDelegate

import com.zaxxer.hikari.HikariDataSource
import org.hibernate.boot.model.naming.CamelCaseToUnderscoresNamingStrategy
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Primary
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.orm.jpa.JpaTransactionManager
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean
import org.springframework.transaction.PlatformTransactionManager
import org.springframework.transaction.annotation.EnableTransactionManagement
import java.sql.SQLException
import java.util.*
import javax.sql.DataSource

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
	basePackages=["com.itinfo.rutilvm.api.repository.aaarepository"],
	entityManagerFactoryRef = "aaaEntityManager",
	transactionManagerRef = "aaaTransactionManager"
)
open class AAADatasourceConfig {

	@Bean(name=["aaaEntityManager"])
	open fun aaaEntityManager(builder: EntityManagerFactoryBuilder): LocalContainerEntityManagerFactoryBean {
		log.debug("... aaaEntityManager")
		return builder.dataSource(aaaDataSource())
			.packages("com.itinfo.rutilvm.api.repository.aaarepository.entity")
			.build().apply {
				setJpaProperties(Properties().apply {
					put("hibernate.physical_naming_strategy", CamelCaseToUnderscoresNamingStrategy::class.java.canonicalName)
				})
			}
	}

	@Bean
	open fun aaaTransactionManager(
		@Qualifier("aaaEntityManager") entityManagerFactoryBean: LocalContainerEntityManagerFactoryBean
	): PlatformTransactionManager {
		return JpaTransactionManager(entityManagerFactoryBean.getObject()!!)
	}

	@Bean
	open fun aaaJdbcTemplate(): JdbcTemplate {
		log.debug("... aaaJdbcTemplate")
		return JdbcTemplate(aaaDataSource())
	}

	@Bean
	@Primary
	@ConfigurationProperties("spring.datasource.aaa")
	open fun aaaDataSourceProperties(): DataSourceProperties {
		log.info("aaaDataSourceProperties ...")
		return DataSourceProperties()
	}

	@Bean
	@Throws(SQLException::class)
	open fun aaaDataSource(): DataSource {
		log.debug("... aaaDataSource")
		return aaaDataSourceProperties()
			.initializeDataSourceBuilder()
			.type(HikariDataSource::class.java)
			.build()
	}

	companion object {
		private val log by LoggerDelegate()
	}
}