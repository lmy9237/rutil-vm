package com.itinfo.configuration

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
	basePackages=["com.itinfo.dao.engine"],
	entityManagerFactoryRef = "engineEntityManager",
	transactionManagerRef = "engineTransactionManager"
)
class EngineDatasourceConfig {

	@Bean
	@Primary
	@ConfigurationProperties("spring.datasource.engine")
	fun engineDataSourceProperties(): DataSourceProperties {
		log.info("engineDataSourceProperties ...")
		return DataSourceProperties()
	}

	@Bean
	@Throws(SQLException::class)
	fun engineDataSource(): DataSource {
		log.debug("... engineDataSource")
		return engineDataSourceProperties()
			.initializeDataSourceBuilder()
			.type(HikariDataSource::class.java)
			.build()
//			.driverClassName("org.postgresql.Driver")
//			.url("jdbc:postgresql://192.168.0.80:5432/engine")
//			.username("okestro")
//			.password("okestro2018")
//			.build()
	}

	@Bean(name=["engineEntityManager"])
	fun engineEntityManager(builder: EntityManagerFactoryBuilder): LocalContainerEntityManagerFactoryBean {
		return builder.dataSource(engineDataSource())
			.packages("com.itinfo.dao.engine")
			.build().apply {
				setJpaProperties(Properties().apply {
					put("hibernate.physical_naming_strategy", CamelCaseToUnderscoresNamingStrategy::class.java.canonicalName)
				})
			}
	}

	@Bean
	fun engineTransactionManager(
		@Qualifier("engineEntityManager") entityManagerFactoryBean: LocalContainerEntityManagerFactoryBean
	): PlatformTransactionManager {
		return JpaTransactionManager(entityManagerFactoryBean.getObject()!!)
	}


	companion object {
		private val log by LoggerDelegate()
	}
}