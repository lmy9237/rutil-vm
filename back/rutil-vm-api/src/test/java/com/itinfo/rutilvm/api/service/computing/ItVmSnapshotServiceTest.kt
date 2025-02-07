package com.itinfo.rutilvm.service.computing

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.itcloud.model.computing.SnapshotVo
import com.itinfo.itcloud.model.network.NicVo
import org.hamcrest.MatcherAssert.assertThat
import org.hamcrest.Matchers.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

/**
 * [ItVmSnapshotServiceTest]
 * [ItVmSnapshotService]에 대한 단위테스트
 *
 * @author chanhi2000
 * @author deh22
 * @since 2024.09.26
 */
@SpringBootTest
class ItVmSnapshotServiceTest {
    @Autowired private lateinit var service: ItVmSnapshotService

    private lateinit var hostVm: String // hostVm
    private lateinit var clone: String // apm

    @BeforeEach
    fun setup() {
        hostVm = "a57c99eb-b786-4420-b7e9-23e6503cacd9" // HostedEngine
        clone = "2d958f7b-0b0e-40a1-b542-11be90e89ac1"
    }

    /**
     * [should_findAllFromVm]
     * [ItVmSnapshotService.findAllFromVm]에 대한 단위테스트
     *
     * @see [ItVmSnapshotService.findAllFromVm]
     */
    @Test
    fun should_findAllFromVm(){
        log.debug("should_findAllFromVm")
        val result: List<SnapshotVo> =
            service.findAllFromVm(clone)

        assertThat(result, `is`(not(nullValue())))
        result.forEach { println(it) }
//        assertThat(result.size, `is`(4))
    }

    /**
     * [should_findOneFromVm]
     * [ItVmSnapshotService.findOneFromVm]에 대한 단위테스트
     *
     * @see [ItVmSnapshotService.findOneFromVm]
     */
    @Test
    fun should_findOneFromVm(){
        log.debug("should_findOneFromVm")
        val result: SnapshotVo? =
            service.findOneFromVm(clone, "58264ac4-768b-4867-aa50-e88bb4587a02")

        assertThat(result, `is`(not(nullValue())))
        println(result)
    }


    /**
     * [should_addFromVm]
     * [ItVmSnapshotService.addFromVm]에 대한 단위테스트
     *
     * @see ItVmSnapshotService.addFromVm
     */
    @Test
    fun should_addFromVm() {
        log.debug("should_addFromVm ... ")
        val addSnapshot: SnapshotVo = SnapshotVo.builder {
            description { "36" }
//            persistMemory { false } // 기본은 없음
        }

        val addResult: SnapshotVo? =
            service.addFromVm(clone, addSnapshot)

        assertThat(addResult?.id, `is`(not(nullValue())))
        assertThat(addResult?.description, `is`(addSnapshot.description))
    }

    /**
     * [should_removeFromVm]
     * [ItVmSnapshotService.removeFromVm]에 대한 단위테스트
     *
     * @see ItVmSnapshotService.removeFromVm
     */
//    @Test
//    fun should_removeFromVm() {
//        log.debug("should_removeFromVm ... ")
//        val snapshotIds: List<String> =
//            listOf(
//                "3fc86b34-b2a2-4b3f-93cb-dff3ec04d20b",
//                "d972f7cf-5539-4c2b-9553-6fbed1136b5d"
//            )
//        val removeResult: Boolean =
//            service.removeFromVm(apmTest1, snapshotIds)
//
//        assertThat(removeResult, `is`(not(nullValue())))
//        assertThat(removeResult, `is`(true))
//    }


    /**
     * [should_previewFromVm]
     * [ItVmSnapshotService.previewFromVm]에 대한 단위테스트
     *
     * @see ItVmSnapshotService.previewFromVm
     */
    @Test
    fun should_previewFromVm() {
        log.debug("should_previewFromVm ... ")
        val result: Boolean =
            service.previewFromVm(clone, "ae6daa9c-20b0-451c-864a-8186f3dbc542")

        assertThat(result, `is`(not(nullValue())))
        assertThat(result, `is`(true))
    }

    /**
     * [should_commitFromVm]
     * [ItVmSnapshotService.commitFromVm]에 대한 단위테스트
     *
     * @see ItVmSnapshotService.commitFromVm
     */
    @Test
    fun should_commitFromVm() {
        log.debug("should_commitFromVm ... ")
        val result: Boolean =
            service.commitFromVm(clone)

        assertThat(result, `is`(not(nullValue())))
        assertThat(result, `is`(true))
    }

    /**
     * [should_undoFromVm]
     * [ItVmSnapshotService.undoFromVm]에 대한 단위테스트
     *
     * @see ItVmSnapshotService.undoFromVm
     */
    @Test
    fun should_undoFromVm() {
        log.debug("should_undoFromVm ... ")
        val result: Boolean =
            service.undoFromVm(clone)

        assertThat(result, `is`(not(nullValue())))
        assertThat(result, `is`(true))
    }

    /**
     * [should_cloneFromVm]
     * [ItVmSnapshotService.cloneFromVm]에 대한 단위테스트
     *
     * @see ItVmSnapshotService.cloneFromVm
     */
    @Test
    fun should_cloneFromVm() {
        log.debug("should_cloneFromVm ... ")
        val result: Boolean =
            service.cloneFromVm(clone, "name")

        assertThat(result, `is`(not(nullValue())))
        assertThat(result, `is`(true))
    }



    companion object {
        private val log by LoggerDelegate()
    }
}