package com.itinfo.rutilvm.api.service.auth

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.repository.aaarepository.entity.OvirtUser
import com.itinfo.rutilvm.api.model.auth.UserVo

import org.hamcrest.MatcherAssert.assertThat
import org.hamcrest.Matchers.*
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

/**
 * [ItOvirtUserServiceTest]
 * [ItOvirtUserService]에 대한 단위테스트
 *
 * @author chanhi2000
 * @since 2024.09.04
 */
@SpringBootTest
class ItOvirtUserServiceTest {
	@Autowired private lateinit var ovirtUser: ItOvirtUserService

	@Test
	fun should_findAll(){
		log.info("should_findAll ... ")
		val result: List<UserVo> =
			ovirtUser.findAll()

		assertThat(result, `is`(not(nullValue())))
		assertThat(result.size, `is`(2))
	}

	@Test
	fun should_findOne(){
		log.info("should_findOne ... ")
		val userName = "rutil"
//		val result: OvirtUser =
//			ovirtUser.findOne(userName)
//
//		assertThat(result, `is`(not(nullValue())))
//		assertThat(result.name, `is`(userName))
	}

	@Test
	fun should_findFullDetailByName(){
		log.info("should_findFullDetailByName ... ")
		val userName = "rutil"
		val result: UserVo? =
			ovirtUser.findFullDetailByName(userName)

		assertThat(result, `is`(not(nullValue())))
		assertThat(result?.username, `is`(userName))
	}

	@Test
	fun should_findEncryptedValue(){
		log.info("should_findEncryptedValue ... ")
		val userName = "rutil"
		val result = ovirtUser.findEncryptedValue(userName)

		assertThat(result, `is`(not(nullValue())))
		log.debug(result)
	}

	@Test
	fun should_authenticateUser(){
		log.info("should_authenticateUser ... ")
//		val userName = "rutil"
//		val result =
//			ovirtUser.authenticateUser(userName, password)
//
//		assertThat(result, `is`(not(nullValue())))
//		assertThat(result, `is`(true))
	}




	@Test
	fun test_user_add(){
		val result: UserVo =
			UserVo.builder {
				username { "rutilRutil" }
			}

		assertThat(result, `is`(not(nullValue())))
		assertThat(result.username, `is`("rutilRutil"))
	}


//	@Test
//	fun should_changePassword() {
//		val username = "rutil"
//		val currentPw = "rutil!@#"
//		val newPw = "rutil@123"
//
////		val userBefore: OvirtUser = ovirtUser.findOne(username)
////		assertThat(userBefore, `is`(not(nullValue())))
////		assertThat(userBefore.password, `is`(not(nullValue())))
////		assertThat(userBefore.passwordValidTo, `is`(not(nullValue())))
//
//		val userAfter: OvirtUser = ovirtUser.changePassword(username, currentPw, newPw)
//		assertThat(userAfter, `is`(not(nullValue())))
//		assertThat(userAfter.password, `is`(not(nullValue())))
//		assertThat(userAfter.passwordValidTo, `is`(not(nullValue())))
//
//		val isPwValid: Boolean = ovirtUser.authenticate(username, newPw)
//		assertThat(isPwValid, `is`(true))
//	}


	companion object {
		private val log by LoggerDelegate()
	}
}