package com.itinfo.rutilvm.api.service.computing

import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.model.computing.OsVo
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.model.computing.SnapshotVo
import com.itinfo.rutilvm.api.model.network.NicVo
import com.itinfo.rutilvm.api.service.network.ItVnicProfileService
import com.itinfo.rutilvm.api.service.network.ItVnicProfileServiceTest
import com.itinfo.rutilvm.api.service.network.ItVnicProfileServiceTest.Companion
import org.hamcrest.MatcherAssert.assertThat
import org.hamcrest.Matchers.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

/**
 * [ItEtcServiceTest]
 * [ItEtcService]에 대한 단위테스트
 *
 * @author chanhi2000
 * @author deh22
 * @since 2025.02.18
 */
@SpringBootTest
class ItEtcServiceTest {
    @Autowired private lateinit var service: ItEtcService

	/**
	 * [should_findAllOsSystem]
	 * [ItEtcService.findAllOsSystem]에 대한 단위테스트
	 *
	 * @see ItEtcService.findAllOsSystem
	 */
	@Test
	fun should_findAllOsSystem() {
		log.debug("should_findAllOsSystem ... ")
		val result: List<OsVo> =
			service.findAllOsSystem()

		assertThat(result, `is`(not(nullValue())))
		result.forEach { println(it) }
	}

	/**
	 * [should_findAllOsSystemFromArc]
	 * [ItEtcService.findAllOsSystemFromArc]에 대한 단위테스트
	 *
	 * @see ItEtcService.findAllOsSystemFromArc
	 */
	@Test
	fun should_findAllOsSystemFromArc() {
		log.debug("should_findAllOsSystemFromArc ...")
		val result: List<OsVo> =
			service.findAllOsSystemFromArc("x86_64")

		assertThat(result, `is`(not(nullValue())))
		result.forEach { println(it) }
	}

	/**
	 * [should_findAllOsSystemFromCluster]
	 * [ItEtcService.findAllOsSystemFromCluster]에 대한 단위테스트
	 *
	 * @see ItEtcService.findAllOsSystemFromCluster
	 */
	@Test
	fun should_findAllOsSystemFromCluster() {
		log.debug("should_findAllOsSystemFromCluster ...")
		val result: List<OsVo> =
			service.findAllOsSystemFromCluster("67672e4c-c451-11ef-9d66-00163e5ae8d1")

		assertThat(result, `is`(not(nullValue())))
		result.forEach { println(it) }
		print(result.size)
	}


	/**
	 * [should_findAllNetworkFilters]
	 * [ItEtcService.findAllNetworkFilters]에 대한 단위테스트
	 *
	 * @see ItEtcService.findAllNetworkFilters
	 */
	@Test
	fun should_findAllNetworkFilters() {
		log.debug("findAllNetworkFilters ... ")
		val result: List<IdentifiedVo> =
			service.findAllNetworkFilters()

		assertThat(result, `is`(not(nullValue())))
		result.forEach { println(it) }
//        assertThat(result.size, `is`(9))
	}

    companion object {
        private val log by LoggerDelegate()
    }
}
