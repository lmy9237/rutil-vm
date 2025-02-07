package com.itinfo.rutilvm.service.common

import org.junit.jupiter.api.Test
import com.itinfo.itcloud.model.common.TreeNavigationalDataCenter
import org.hamcrest.MatcherAssert.assertThat
import org.hamcrest.Matchers.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
class ItTreeNavigationServiceTest {
    @Autowired private lateinit var service: ItTreeNavigationService

    @Test
    fun should_findAllNavigationalsWithClusters(){
        val result: List<TreeNavigationalDataCenter> =
            service.findAllNavigationalsWithClusters()

        assertThat(result, `is`(not(nullValue())))
        result.forEach { println(it) }
    }

    @Test
    fun should_findAllNavigationalsWithNetworks(){
        val result: List<TreeNavigationalDataCenter> =
            service.findAllNavigationalsWithNetworks()

        assertThat(result, `is`(not(nullValue())))
        result.forEach { println(it) }
    }

    @Test
    fun should_findAllNavigationalsWithStorageDomains(){
        val result: List<TreeNavigationalDataCenter> =
            service.findAllNavigationalsWithStorageDomains()

        assertThat(result, `is`(not(nullValue())))
        result.forEach { println(it) }
    }

}