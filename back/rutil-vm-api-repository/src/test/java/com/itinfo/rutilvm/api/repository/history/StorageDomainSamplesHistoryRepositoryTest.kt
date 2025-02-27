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
 * [StorageDomainSamplesHistoryRepositoryTest]
 * [StorageDomainSamplesHistoryRepository] JPA 테스트
 *
 * @author 이찬희 (@chanhi2000)
 * @since 2025-02-27
 */
@DataJpaTest
@ContextConfiguration(classes = [HistoryDatasourceConfig::class])
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class StorageDomainSamplesHistoryRepositoryTest {
	@Autowired private lateinit var storageDomainSamplesHistory: StorageDomainSamplesHistoryRepository

	@BeforeEach
	fun setup() {
		log.info("setup ...")
		/* 각 테스트 구성에 필요한 요소 인스턴스 정의 및 처리 */
	}

	@Test
	@DisplayName("@StorageDomainSamplesHistoryRepository#findFirstByStorageDomainIdOrderByHistoryDatetimeDesc() 테스트")
	fun should_findFirstByStorageDomainIdOrderByHistoryDatetimeDesc() {
		log.info("should_findFirstByStorageDomainIdOrderByHistoryDatetimeDesc .... ")
		// TODO: 기본구현
		/* Given */
		/* When */
		/* Then */
	}

	@Test
	@DisplayName("@StorageDomainSamplesHistoryRepository#findStorageChart() 테스트")
	fun should_findStorageChart() {
		log.info("should_findStorageChart .... ")
		// TODO: 기본구현
		/* Given */
		/* When */
		/* Then */
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
