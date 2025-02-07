package com.itinfo.configuration

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.service.engine.WorkloadPredictionService
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
	basePackages=["com.itinfo.dao.history"],
	entityManagerFactoryRef = "historyEntityManager",
	transactionManagerRef = "historyTransactionManager"
)
class HistoryDatasourceConfig {

	// castanets-core-context.xml
	// query-postgresql-context.xml
	@Bean(name=["historyEntityManager"])
	fun historyEntityManager(builder: EntityManagerFactoryBuilder): LocalContainerEntityManagerFactoryBean {
		return builder.dataSource(historyDataSource())
			.packages("com.itinfo.dao.history")
			.build().apply {
				setJpaProperties(Properties().apply {
					put("hibernate.physical_naming_strategy", CamelCaseToUnderscoresNamingStrategy::class.java.canonicalName)
				})
			}
	}

	@Bean
	fun historyTransactionManager(
		@Qualifier("historyEntityManager") entityManagerFactoryBean: LocalContainerEntityManagerFactoryBean
	): PlatformTransactionManager {
		return JpaTransactionManager(entityManagerFactoryBean.getObject()!!)
	}

	@Bean
	fun customWorkloadPredictionService(): WorkloadPredictionService {
		log.info("... customWorkloadPredictionService")
		return WorkloadPredictionService(queryGetVmWorkload()).apply {
			jdbcTemplate = historyJdbcTemplate()
		}
	}

	@Bean
	fun queryGetVmWorkload(): String {
		log.info("... queryGetVmWorkload")
		return """
		SELECT
			HISTORY_DATETIME AT TIME ZONE 'ASIA/SEOUL' AS HISTORY_DATETIME
			, COALESCE(CPU_USAGE_PERCENT, 0) AS CPU_USAGE_PERCENT
			, COALESCE(MEMORY_USAGE_PERCENT, 0) AS MEMORY_USAGE_PERCENT
			, ROUND(COALESCE(MEMORY_USAGE_PERCENT, 0) * CAST(? AS FLOAT) / 100) AS MEMORY_USAGE
		FROM
			VM_SAMPLES_HISTORY
		WHERE 1=1
		AND VM_ID:::TEXT = ?
		AND	(HISTORY_DATETIME <![CDATA[ > ]]> CURRENT_DATE -1 AND HISTORY_DATETIME <![CDATA[ < ]]> CURRENT_DATE)
		ORDER BY HISTORY_DATETIME DESC
		""".trimIndent()
	}

	@Bean
	fun historyJdbcTemplate(): JdbcTemplate {
		log.debug("... historyJdbcTemplate")
		return JdbcTemplate(historyDataSource())
	}

	@Bean
	@Primary
	@ConfigurationProperties("spring.datasource.history")
	fun historyDataSourceProperties(): DataSourceProperties {
		log.info("historyDataSourceProperties ...")
		return DataSourceProperties()
	}

	@Bean
	@Throws(SQLException::class)
	fun historyDataSource(): DataSource {
		log.debug("... historyDataSource")
		return historyDataSourceProperties()
			.initializeDataSourceBuilder()
			.type(HikariDataSource::class.java)
			.build()
//			.driverClassName("org.postgresql.Driver")
//			.url("jdbc:postgresql://192.168.0.80:5432/engine")
//			.username("okestro")
//			.password("okestro2018")
//			.build()
	}

	companion object {
		private val log by LoggerDelegate()
	}
}