package com.itinfo.rutilvm.api.service.computing

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.model.computing.DashBoardVo
import com.itinfo.rutilvm.api.model.computing.SizeVo
import com.itinfo.rutilvm.api.repository.history.dto.HostUsageDto
import com.itinfo.rutilvm.api.repository.history.dto.LineDto
import com.itinfo.rutilvm.api.repository.history.dto.StorageUsageDto
import com.itinfo.rutilvm.api.repository.history.dto.UsageDto
import org.hamcrest.MatcherAssert.assertThat
import org.hamcrest.Matchers.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import java.util.*

@SpringBootTest
class ItGraphServiceTest {
    @Autowired private lateinit var service: ItGraphService

    private lateinit var hostVm: String // hostVm

    @BeforeEach
    fun setup() {
        hostVm = "932fd5bb-e06c-4d3a-91fc-48c926eee484"
    }

    /**
     * [should_getDataCenters]
     * [ItGraphService.getDataCenters]에 대한 단위테스트
     *
     * @see ItGraphService.getDataCenters
     **/
    @Test
    fun should_getDataCenters() {
        log.debug("should_getDataCenters ... ")
        val result: SizeVo =
            service.getDataCenters()

        assertThat(result, `is`(not(nullValue())))
        println(result)
    }

    /**
     * [should_getDashboard]
     * [ItGraphService.getDashboard]에 대한 단위테스트
     *
     * @see ItGraphService.getDashboard
     **/
    @Test
    fun should_getDashboard() {
        log.debug("should_getDashboard ... ")
        val result: DashBoardVo =
            service.getDashboard()

        assertThat(result, `is`(not(nullValue())))
        println(result)
    }

    /**
     * [should_totalCpuMemory]
     * [ItGraphService.totalCpuMemory]에 대한 단위테스트
     *
     * @see ItGraphService.totalCpuMemory
     **/
    @Test
    fun should_totalCpuMemory() {
        log.debug("should_totalCpuMemory ... ")
        val result: HostUsageDto =
            service.totalCpuMemory()

        assertThat(result, `is`(not(nullValue())))
        println(result)
    }

    /**
     * [should_totalStorage]
     * [ItGraphService.totalStorage]에 대한 단위테스트
     *
     * @see ItGraphService.totalStorage
     **/
    @Test
    fun should_totalStorage() {
        log.debug("should_totalStorage ... ")
        val result: StorageUsageDto =
            service.totalStorage()

        assertThat(result, `is`(not(nullValue())))
        println(result)
    }

    /**
     * [should_vmCpuChart]
     * [ItGraphService.vmCpuChart]에 대한 단위테스트
     *
     * @see ItGraphService.vmCpuChart
     **/
    @Test
    fun should_vmCpuChart() {
        log.debug("should_vmCpuChart ... ")
        val result: List<UsageDto> =
            service.vmCpuChart()

        assertThat(result, `is`(not(nullValue())))
        println(result)
    }

    /**
     * [should_vmMemoryChart]
     * [ItGraphService.vmMemoryChart]에 대한 단위테스트
     *
     * @see ItGraphService.vmMemoryChart
     **/
    @Test
    fun should_vmMemoryChart() {
        log.debug("should_vmMemoryChart ... ")
        val result: List<UsageDto> =
            service.vmMemoryChart()

        assertThat(result, `is`(not(nullValue())))
        println(result)
    }

    /**
     * [should_storageChart]
     * [ItGraphService.storageChart]에 대한 단위테스트
     *
     * @see ItGraphService.storageChart
     **/
    @Test
    fun should_storageChart() {
        log.debug("should_storageChart... ")
        val result: List<UsageDto> =
            service.storageChart()

        assertThat(result, `is`(not(nullValue())))
        println(result)
    }

    /**
     * [should_vmCpuPerChart]
     * [ItGraphService.vmCpuPerChart]에 대한 단위테스트
     *
     * @see ItGraphService.vmMemoryChart
     **/
    @Test
    fun should_vmCpuPerChart() {
        log.debug("should_vmCpuPerChart ... ")
        val result: List<LineDto> =
            service.vmCpuPerChart()

        assertThat(result, `is`(not(nullValue())))
        println(result)
    }

    /**
     * [should_vmMemoryPerChart]
     * [ItGraphService.vmMemoryPerChart]에 대한 단위테스트
     *
     * @see ItGraphService.vmMemoryPerChart
     **/
    @Test
    fun should_vmMemoryPerChart() {
        log.debug("should_vmMemoryPerChart ... ")
        val result: List<LineDto> =
            service.vmMemoryPerChart()

        assertThat(result, `is`(not(nullValue())))
        println(result)
    }

    /**
     * [should_vmNetworkPerChart]
     * [ItGraphService.vmNetworkPerChart]에 대한 단위테스트
     *
     * @see ItGraphService.vmNetworkPerChart
     **/
    @Test
    fun should_vmNetworkPerChart() {
        log.debug("should_vmNetworkPerChart ... ")
        val result: List<LineDto> = service.vmNetworkPerChart()

        assertThat(result, `is`(not(nullValue())))
        println(result)
    }


    /**
     * [should_vmMetricChart]
     * [ItGraphService.vmMetricChart]에 대한 단위테스트
     *
     * @see ItGraphService.vmMetricChart
     **/
    @Test
    fun should_vmMetricChart() {
        log.debug("should_vmMetricChart ... ")
        val result: List<UsageDto> =
            service.vmCpuMetricChart()

        assertThat(result, `is`(not(nullValue())))
        println(result)
    }

    /**
     * [should_storageMetricChart]
     * [ItGraphService.storageMetricChart]에 대한 단위테스트
     *
     * @see ItGraphService.storageMetricChart
     **/
    @Test
    fun should_storageMetricChart() {
        log.debug("should_storageMetricChart ... ")
        val result: List<UsageDto> =
            service.storageMetricChart()

        assertThat(result, `is`(not(nullValue())))
        println(result)
    }




    /**
     * [should_totalHostCpuMemoryList]
     * [ItGraphService.totalHostCpuMemoryList]에 대한 단위테스트
     *
     * @see ItGraphService.totalHostCpuMemoryList
     **/
    @Test
    fun should_totalHostCpuMemoryList() {
        log.debug("should_totalCpuMemoryList ... ")
        val result: List<HostUsageDto> =
            service.totalHostCpuMemoryList(
                "e33e7f72-a2a5-4152-962a-a7ef804acbb4",
                5
            )

        assertThat(result, `is`(not(nullValue())))
        println(result)
    }

    /**
     * [should_hostCpuChart]
     * [ItGraphService.hostCpuChart]에 대한 단위테스트
     *
     * @see ItGraphService.hostCpuChart
     **/
    @Test
    fun should_hostCpuChart() {
        log.debug("should_hostCpuChart... ")
        val result: List<UsageDto> =
            service.hostCpuChart()

        assertThat(result, `is`(not(nullValue())))
        println(result)
    }

    /**
     * [should_hostMemoryChart]
     * [ItGraphService.hostMemoryChart]에 대한 단위테스트
     *
     * @see ItGraphService.hostMemoryChart
     **/
    @Test
    fun should_hostMemoryChart() {
        log.debug("should_hostMemoryChart... ")
        val result: List<UsageDto> =
            service.hostMemoryChart()

        assertThat(result, `is`(not(nullValue())))
        println(result)
    }

    /**
     * [should_hostPercent]
     * [ItGraphService.hostPercent]에 대한 단위테스트
     *
     * @see ItGraphService.hostPercent
     **/
    @Test
    fun should_hostPercent() {
        log.debug("should_hostPercent... ")
        val hostId = "1d3a2fdb-0873-4837-8eaa-28cca20ffb12"
        val hostNicId = "e28eb0dd-933a-4752-9b40-7482071c48f0"
        val result: UsageDto =
            service.hostPercent(hostId,hostNicId)

        assertThat(result, `is`(not(nullValue())))
        println(result)
    }

    /**
     * [should_vmPercent]
     * [ItGraphService.vmPercent]에 대한 단위테스트
     *
     * @see ItGraphService.vmPercent
     **/
    @Test
    fun should_vmPercent() {
        log.debug("should_vmPercent ... ")
        val vmNicId = "b1b04d65-91c3-4bb9-99ee-2f5e84ef107e"

        val result: UsageDto =
            service.vmPercent(hostVm, vmNicId)

        assertThat(result, `is`(not(nullValue())))
        println(result)
    }


    companion object{
        private val log by LoggerDelegate()
    }

}
