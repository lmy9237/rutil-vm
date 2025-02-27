package com.itinfo.rutilvm.api.repository.aaarepository

import com.itinfo.rutilvm.api.configuration.AAADatasourceConfig
import com.itinfo.rutilvm.api.repository.aaarepository.entity.OvirtUser
import com.itinfo.rutilvm.common.LoggerDelegate
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.hamcrest.MatcherAssert.assertThat
import org.hamcrest.Matchers.`is`
import org.hamcrest.Matchers.notNullValue
import org.springframework.test.context.ContextConfiguration

/**
 * [OvirtUserRepositoryTest]
 * [OvirtUserRepository] JPA 테스트
 *
 * @author 이찬희 (@chanhi2000)
 * @since 2025.02.07
 */
@DataJpaTest
@ContextConfiguration(classes = [AAADatasourceConfig::class])
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class OvirtUserRepositoryTest {
	@Autowired private lateinit var ovirtUser: OvirtUserRepository
	@BeforeEach
	fun setup() {
		log.info("setup ...")
		/* 각 테스트 구성에 필요한 요소 인스턴스 정의 및 처리 */
	}

	@Test
	@DisplayName("@OvirtUserRepository#findByName()")
	fun should_findByName() {
		log.info("should_findByName ...")
		/* Given */
		val username = "admin"

		/* When */
		val userFound: OvirtUser? = ovirtUser.findByName(username)

		/* Then */
		assertThat(userFound, `is`(notNullValue()))
		log.info("should_findByName ... userFound: {}", userFound)
		assertThat(userFound?.name, `is`(notNullValue()))
		assertThat(userFound?.name, `is`(username))
	}
	companion object {
		private val log by LoggerDelegate()
	}
}
