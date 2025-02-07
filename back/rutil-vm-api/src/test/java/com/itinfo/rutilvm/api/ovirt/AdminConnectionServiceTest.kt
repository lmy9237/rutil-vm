package com.itinfo.rutilvm.ovirt

import com.itinfo.rutilvm.common.LoggerDelegate
import org.junit.jupiter.api.Test
import org.hamcrest.MatcherAssert.assertThat
import org.hamcrest.Matchers.`is`
import org.hamcrest.Matchers.not
import org.hamcrest.Matchers.nullValue
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

/**
 * [AdminConnectionServiceTest]
 * [AdminConnectionService]에 대한 단위테스트
 *
 * @author chanhi2000
 * @since 2024.03.05
 */
@SpringBootTest
class AdminConnectionServiceTest {
	@Autowired
	private lateinit var service: AdminConnectionService

	/**
	 * [should_getConnection]
	 * [AdminConnectionService.getConnection]에 대한 단위테스트
	 * 
	 * @see AdminConnectionService.getConnection
	 */
	@Test
	fun should_getConnection() {
		log.debug("should_getConnection ... ")
		assertThat(service, `is`(not(nullValue())))
		// TODO: 메소드의 결과값에 대한 검증처리
	}
	
	companion object {
		private val log by LoggerDelegate()
	}
}