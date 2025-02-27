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
 * [VmInterfaceSamplesHistoryRepositoryTest]
 * [VmInterfaceSamplesHistoryRepository] JPA 테스트
 *
 * @author 이찬희 (@chanhi2000)
 * @since 2025-02-27
 */
@DataJpaTest
@ContextConfiguration(classes = [HistoryDatasourceConfig::class])
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class VmInterfaceSamplesHistoryRepositoryTest {
	@Autowired private lateinit var vmInterfaceSamplesHistory: VmInterfaceSamplesHistoryRepository

	@BeforeEach
	fun setup() {
		log.info("setup ...")
		/* 각 테스트 구성에 필요한 요소 인스턴스 정의 및 처리 */
	}

	@Test
	@DisplayName("@VmInterfaceSamplesHistoryRepository#findFirstByVmInterfaceIdOrderByHistoryDatetimeDesc() 테스트")
	fun should_findFirstByVmInterfaceIdOrderByHistoryDatetimeDesc() {
		log.info("should_findFirstByVmInterfaceIdOrderByHistoryDatetimeDesc .... ")
		// TODO: 기본구현
		/* Given */
		/* When */
		/* Then */
	}

	@Test
	@DisplayName("@VmInterfaceSamplesHistoryRepository#findVmNetworkMetricListChart() 테스트")
	fun should_findVmNetworkMetricListChart() {
		log.info("should_findVmNetworkMetricListChart .... ")
		// TODO: 기본구현
		/* Given */
		/* When */
		/* Then */
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
