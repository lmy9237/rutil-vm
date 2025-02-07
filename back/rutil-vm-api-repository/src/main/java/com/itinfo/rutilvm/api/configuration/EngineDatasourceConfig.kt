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
	basePackages=["com.itinfo.rutilvm.api.repository.engine"],
	entityManagerFactoryRef = "engineEntityManager",
	transactionManagerRef = "engineTransactionManager"
)
open class EngineDatasourceConfig {

	@Bean(name=["engineEntityManager"])
	open fun engineEntityManager(builder: EntityManagerFactoryBuilder): LocalContainerEntityManagerFactoryBean {
		log.debug("... engineEntityManager")
		return builder.dataSource(engineDataSource())
			.packages("com.itinfo.rutilvm.api.repository.engine.entity")
			.build().apply {
				setJpaProperties(Properties().apply {
					put("hibernate.physical_naming_strategy", CamelCaseToUnderscoresNamingStrategy::class.java.canonicalName)
				})
			}
	}

	@Bean
	open fun engineTransactionManager(
		@Qualifier("engineEntityManager") entityManagerFactoryBean: LocalContainerEntityManagerFactoryBean
	): PlatformTransactionManager {
		return JpaTransactionManager(entityManagerFactoryBean.getObject()!!)
	}

	@Bean
	open fun engineJdbcTemplate(): JdbcTemplate {
		log.debug("... engineJdbcTemplate")
		return JdbcTemplate(engineDataSource())
	}

	@Bean
	@Primary
	@ConfigurationProperties("spring.datasource.engine")
	open fun engineDataSourceProperties(): DataSourceProperties {
		log.info("engineDataSourceProperties ...")
		return DataSourceProperties()
	}

	@Bean
	@Throws(SQLException::class)
	open fun engineDataSource(): DataSource {
		log.debug("... engineDataSource")
		return engineDataSourceProperties()
			.initializeDataSourceBuilder()
			.type(HikariDataSource::class.java)
			.build()
	}

	companion object {
		private val log by LoggerDelegate()
	}
}