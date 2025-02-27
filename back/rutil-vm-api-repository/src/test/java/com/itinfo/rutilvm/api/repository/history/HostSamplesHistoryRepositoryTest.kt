package com.itinfo.rutilvm.api.repository.history

import com.itinfo.rutilvm.api.configuration.HistoryDatasourceConfig
import com.itinfo.rutilvm.common.LoggerDelegate
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.test.context.ContextConfiguration

/**
 * [HostSamplesHistoryRepositoryTest]
 * [HostSamplesHistoryRepository] JPA 테스트
 *
 * @author 이찬희 (@chanhi2000)
 * @since 2025-02-27
 */
@DataJpaTest
@ContextConfiguration(classes = [HistoryDatasourceConfig::class])
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class HostSamplesHistoryRepositoryTest {
	@Autowired private lateinit var hostSamplesHistory: HostSamplesHistoryRepository

	@BeforeEach
	fun setup() {
		log.info("setup ...")
		/* 각 테스트 구성에 필요한 요소 인스턴스 정의 및 처리 */
	}

	@Test
	@DisplayName("@HostSamplesHistoryRepository#findFirstByHostIdOrderByHistoryDatetimeDesc() 테스트")
	fun should_findFirstByHostIdOrderByHistoryDatetimeDesc() {
		log.info("should_findFirstByHostIdOrderByHistoryDatetimeDesc .... ")
		// TODO: 기본구현
		/* Given */
		/* When */
		/* Then */
	}

	@Test
	@DisplayName("@HostSamplesHistoryRepository#findByHostIdOrderByHistoryDatetimeDesc() 테스트")
	fun should_findByHostIdOrderByHistoryDatetimeDesc() {
		log.info("should_findByHostIdOrderByHistoryDatetimeDesc .... ")
		// TODO: 기본구현
		/* Given */
		/* When */
		/* Then */
	}

	@Test
	@DisplayName("@HostSamplesHistoryRepository#findHostCpuChart() 테스트")
	fun should_findHostCpuChart() {
		log.info("should_findHostCpuChart .... ")
		// TODO: 기본구현
		/* Given */
		/* When */
		/* Then */
	}

	@Test
	@DisplayName("@HostSamplesHistoryRepository#findHostMemoryChart() 테스트")
	fun should_findHostMemoryChart() {
		log.info("should_findHostMemoryChart .... ")
		// TODO: 기본구현
		/* Given */
		/* When */
		/* Then */
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
