package com.itinfo.rutilvm.api.repository

import java.sql.DriverManager

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.common.log
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.slf4j.Logger

/**
 * [SimpleJDBCConnectionTest]
 * 단순 JDBC 연결 테스트
 *
 * @author Chan Hee Lee (chanhi2000)
 * @since 2025.02.06
 */
class SimpleJDBCConnectionTest {

	/**
	 * [SimpleJDBCConnectionTest.should_connect]
	 */
	@Test
	@DisplayName("@SimpleJDBCConnectionTest#should_connect()")
	fun should_connect() {
		log.info("should_connect ...")
		val url = "jdbc:postgresql://192.168.0.70:5432/engine"
		val username = "rutil"
		val password = "rutil1!"

		Class.forName("org.postgresql.Driver")

		DriverManager.getConnection(url, username, password).use { conn ->
			log.info("Connection established successfully!")
			conn.close()
		}.runCatching {
			log.error("something went WRONG ... reason: ${this.log()}")
			return
		}
	}

	companion object {
		private val log: Logger by LoggerDelegate()
	}
}