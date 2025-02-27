package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.configuration.EngineDatasourceConfig
import com.itinfo.rutilvm.common.LoggerDelegate
import org.junit.jupiter.api.BeforeEach
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.test.context.ContextConfiguration

/**
 * [EngineSessionsRepositoryTest]
 * [EngineSessionsRepository] JPA 테스트
 *
 * @author 이찬희 (@chanhi2000)
 * @since 2025-02-27
 */
@DataJpaTest
@ContextConfiguration(classes = [EngineDatasourceConfig::class])
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class EngineSessionsRepositoryTest {
	@Autowired private lateinit var engineSessions: EngineSessionsRepository
	@BeforeEach
	fun setup() {
		log.info("setup ...")
		/* 각 테스트 구성에 필요한 요소 인스턴스 정의 및 처리 */
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
