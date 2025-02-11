package com.itinfo.rutilvm.api.service.computing

import com.itinfo.rutilvm.common.LoggerDelegate
import org.hamcrest.MatcherAssert.assertThat
import org.hamcrest.Matchers.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

/**
 * [ItHostOperationServiceTest]
 * [ItHostOperationService]에 대한 단위 테스트
 *
 * @author chanhi2000
 * @author deh22
 * @since 2024.09.24
 */
@SpringBootTest
class ItHostOperationServiceTest {
    @Autowired private lateinit var service: ItHostOperationService

    private lateinit var host01: String // host01
    private lateinit var host05: String

    @BeforeEach
    fun setup() {
        host01 = "671e18b2-964d-4cc6-9645-08690c94d249"
        host05 = "70457998-0298-4e25-92ac-c74446bd19e9"
    }

    /**
     * [should_deactivate]
     * [ItHostOperationService.deactivate]에 대한 단위테스트
     * 유지보수
     *
     * @see ItHostOperationService.deactivate
     */
    @Test
    fun should_deactivate() {
        log.debug("should_deactivate ...")
        val result: Boolean =
            service.deactivate(host05)

        assertThat(result, `is`(not(nullValue())))
        assertThat(result, `is`(true))
    }

    /**
     * [should_deactivateMultiple]
     * [ItHostOperationService.deactivateMultiple]에 대한 단위테스트
     * 유지보수
     *
     * @see ItHostOperationService.deactivateMultiple
     */
    @Test
    fun should_deactivateMultiple() {
        log.debug("should_deactivateMultiple ...")
        val hostIds: List<String> = listOf("c1954e17-3c86-4428-a4d0-0d845808bad1")

        val result: Map<String, String> =
            service.deactivateMultiple(hostIds)

        assertThat(result, `is`(not(nullValue())))
        print(result)
    }

    /**
     * [should_activate]
     * [ItHostOperationService.activate]에 대한 단위테스트
     * 활성
     *
     * @see [ItHostOperationService.activate]
     */
    @Test
    fun should_activate() {
        log.debug("should_activate ...")
        val result: Boolean =
            service.activate(host05)

        assertThat(result, `is`(not(nullValue())))
        assertThat(result, `is`(true))
    }

    /**
     * [ItHostOperationService.refresh]에 대한 단위테스트
     * 기능 새로고침
     *
     * @see [ItHostOperationService.refresh]
     */
//    @Test
//    fun should_refresh() {
//        log.debug("should_refresh ...")
//        val result: Boolean =
//            service.refresh(host05)
//
//        assertThat(result, `is`(not(nullValue())))
//        assertThat(result, `is`(true))
//    }

    /**
     * [should_restart]
     * [ItHostOperationService.restart]에 대한 단위테스트
     * 재시작
     * 실행되지만 유저명과 암호 입력 문제 있음
     *
     * @see [ItHostOperationService.restart]
     */
    @Test
    fun should_restart() {
        log.debug("should_restart ...")
        val result: Boolean =
            service.restart(host05)

        assertThat(result, `is`(not(nullValue())))
        assertThat(result, `is`(true))
    }

    companion object {
        private val log by LoggerDelegate()
    }
}
