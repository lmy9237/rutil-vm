package com.itinfo.rutilvm.api

import org.junit.runner.RunWith
import org.junit.jupiter.api.Test
import org.hamcrest.MatcherAssert.assertThat
import org.hamcrest.Matchers.`is`
import org.hamcrest.Matchers.not
import org.hamcrest.Matchers.nullValue
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.junit4.SpringRunner


/**
 * [RutilVmApplicationTest]
 * [RutilVmApplicationTest]기동 테스트
 */
@RunWith(SpringRunner::class)
@SpringBootTest
class RutilVmApplicationTest {

	@Test
	fun contextLoads() {
	}
}