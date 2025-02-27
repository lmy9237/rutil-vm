package com.itinfo.rutilvm.api.repository.aaarepository

import com.itinfo.rutilvm.api.configuration.AAADatasourceConfig
import com.itinfo.rutilvm.common.LoggerDelegate
import org.junit.jupiter.api.BeforeEach
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest

import org.springframework.test.context.ContextConfiguration

/**
 * [SettingsRepositoryTest]
 * [SettingsRepository] JPA 테스트
 *
 * @author 이찬희 (@chanhi2000)
 * @since 2025-02-27
 */
@DataJpaTest
@ContextConfiguration(classes = [AAADatasourceConfig::class])
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class SettingsRepositoryTest {
	@Autowired private lateinit var settings: SettingsRepository
	@BeforeEach
	fun setup() {
		log.info("setup ...")
		/* 각 테스트 구성에 필요한 요소 인스턴스 정의 및 처리 */
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
