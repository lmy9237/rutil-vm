package com.itinfo.rutilvm.api.configuration

import com.itinfo.rutilvm.common.LoggerDelegate

import com.zaxxer.hikari.HikariDataSource
import org.hibernate.cfg.Environment
import org.hibernate.boot.model.naming.CamelCaseToUnderscoresNamingStrategy
import org.hibernate.dialect.PostgreSQL10Dialect
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
	basePackages=["com.itinfo.rutilvm.api.repository.history"],
	entityManagerFactoryRef = "historyEntityManager",
	transactionManagerRef = "historyTransactionManager"
)
open class HistoryDatasourceConfig {

	@Bean(name = ["historyEntityManager"])
	open fun historyEntityManager(builder: EntityManagerFactoryBuilder): LocalContainerEntityManagerFactoryBean {
		log.debug("... historyEntityManager")
		return builder
			.dataSource(historyDataSource())
			.packages("com.itinfo.rutilvm.api.repository.history.entity") // entity 클래스 패키지
			.build().apply {
				setJpaProperties(Properties().apply {
					put(Environment.DIALECT, PostgreSQL10Dialect::class.java.canonicalName)
					put(Environment.PHYSICAL_NAMING_STRATEGY, CamelCaseToUnderscoresNamingStrategy::class.java.canonicalName)
				})
			}
	}

	@Bean
	open fun historyTransactionManager(
		@Qualifier("historyEntityManager") entityManagerFactoryBean: LocalContainerEntityManagerFactoryBean
	): PlatformTransactionManager {
		return JpaTransactionManager(entityManagerFactoryBean.getObject()!!)
	}

	@Bean
	open fun historyJdbcTemplate(): JdbcTemplate {
		log.debug("... historyJdbcTemplate")
		return JdbcTemplate(historyDataSource())
	}

	@Bean
	@Primary
	@ConfigurationProperties("spring.datasource.history")
	open fun historyDataSourceProperties(): DataSourceProperties {
		log.info("historyDataSourceProperties ...")
		return DataSourceProperties()
	}

	@Bean
	@Throws(SQLException::class)
	open fun historyDataSource(): DataSource {
		log.debug("... historyDataSource")
		return historyDataSourceProperties()
			.initializeDataSourceBuilder()
			.type(HikariDataSource::class.java)
			.build()
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
