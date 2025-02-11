package com.itinfo.rutilvm.api.service.network

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.model.computing.TemplateVo
import com.itinfo.rutilvm.api.model.computing.VmVo
import com.itinfo.rutilvm.api.model.network.VnicProfileVo
import org.hamcrest.MatcherAssert.assertThat
import org.hamcrest.Matchers.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

/**
 * [ItVnicProfileServiceTest]
 * [ItVnicProfileService]에 대한 단위테스트
 *
 * @author chanhi2000
 * @author deh22
 * @since 2024.09.26
 */
@SpringBootTest
class ItVnicProfileServiceTest {
    @Autowired private lateinit var service: ItVnicProfileService

    private lateinit var dataCenterId: String
    private lateinit var clusterId: String // Default
    private lateinit var networkId: String // Default
    private lateinit var vnic: String // hostVm

    @BeforeEach
    fun setup() {
        dataCenterId = "023b0a26-3819-11ef-8d02-00163e6c8feb"
        clusterId = "023c79d8-3819-11ef-bf08-00163e6c8feb"
        networkId = "00000000-0000-0000-0000-000000000009"
        vnic = "0000000a-000a-000a-000a-000000000398"
    }

    /**
     * [should_findAll]
     * [ItVnicProfileService.findAll]에 대한 단위테스트
     *
     * @see ItVnicProfileService.findAll
     */
    @Test
    fun should_findAll() {
        log.debug("findAll ... ")
        val result: List<VnicProfileVo> =
            service.findAll()

        assertThat(result, `is`(not(nullValue())))
        result.forEach { println(it) }
        assertThat(result.size, `is`(9))
    }

    /**
     * [should_findAllVnicProfilesFromNetwork]
     * [ItVnicProfileService.findAllFromNetwork]에 대한 단위테스트
     *
     * @see ItVnicProfileService.findAllFromNetwork
     */
    @Test
    fun should_findAllVnicProfilesFromNetwork() {
        log.debug("findAllVnicProfilesFromNetwork ... ")
        val result: List<VnicProfileVo> =
            service.findAllFromNetwork(networkId)

        assertThat(result, `is`(not(nullValue())))
        result.forEach { println(it) }
        assertThat(result.size, `is`(1))
    }

    /**
     * [should_findOne]
     * [ItVnicProfileService.findOne]에 대한 단위테스트
     *
     * @see ItVnicProfileService.findOne
     */
    @Test
    fun should_findOne() {
        log.debug("should_findVnicProfile ... ")
        val result: VnicProfileVo? =
            service.findOne(vnic)

        assertThat(result, `is`(not(nullValue())))
        println(result)
        assertThat(result?.name, `is`("ovirtmgmt"))
    }

    /**
     * [should_findAllNetworkFilters]
     * [ItVnicProfileService.findAllNetworkFilters]에 대한 단위테스트
     *
     * @see ItVnicProfileService.findAllNetworkFilters
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

    /**
     * [should_add_update_and_remove_network]
     * [ItVnicProfileService.add]에 대한 단위테스트
     *
     * @see ItVnicProfileService.add
     * @see ItVnicProfileService.update
     * @see ItVnicProfileService.remove
     */
    @Test
    fun should_add_update_and_remove_network() {
        log.debug("add ... ")
        val addVnic: VnicProfileVo = VnicProfileVo.builder {
            name { "xvx" }
            networkVo { IdentifiedVo.builder { id { networkId } } }
            description { "" }
            migration { true }
        }

        val addResult: VnicProfileVo? =
            service.add(addVnic)

        assertThat(addResult, `is`(not(nullValue())))
        assertThat(addResult?.name, `is`(addVnic.name))
        assertThat(addResult?.description, `is`(addVnic.description))

        log.debug("update... ")
        val updateVnic: VnicProfileVo = VnicProfileVo.builder {
            id { addResult?.id }
            name { "xxx" }
            networkVo { IdentifiedVo.builder { id { networkId } } }
            description { "" }
            migration { true }
        }

        val updateResult: VnicProfileVo? =
            service.update(updateVnic)

        assertThat(updateResult, `is`(not(nullValue())))
        assertThat(updateResult?.name, `is`(updateVnic.name))
        assertThat(updateResult?.description, `is`(addVnic.description))

        log.debug("remove... ")
        val removeResult: Boolean =
            updateResult?.let { service.remove(it.id) } == true

        assertThat(removeResult, `is`(true))
    }


    /**
     * [should_findAllVmsFromVnicProfile]
     * [ItVnicProfileService.findAllVmsFromVnicProfile]에 대한 단위테스트
     *
     * @see ItVnicProfileService.findAllVmsFromVnicProfile
     */
    @Test
    fun should_findAllVmsFromVnicProfile() {
        log.debug("findAllVmsFromVnicProfile ... ")
        val result: List<VmVo> =
            service.findAllVmsFromVnicProfile(vnic)

        assertThat(result, `is`(not(nullValue())))
        result.forEach { println(it) }
        println(result.size)
    }

    /**
     * [should_findAllTemplatesFromVnicProfile]
     * [ItVnicProfileService.findAllTemplatesFromVnicProfile]에 대한 단위테스트
     *
     * @see ItVnicProfileService.findAllTemplatesFromVnicProfile
     */
    @Test
    fun should_findAllTemplatesFromVnicProfile() {
        log.debug("findAllTemplatesFromVnicProfile ... ")
        val result: List<TemplateVo> =
            service.findAllTemplatesFromVnicProfile(vnic)

        assertThat(result, `is`(not(nullValue())))
        result.forEach { println(it) }
        println(result.size)
    }

    companion object {
        private val log by LoggerDelegate()
    }

}
