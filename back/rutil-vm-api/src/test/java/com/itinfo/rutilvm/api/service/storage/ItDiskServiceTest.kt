package com.itinfo.rutilvm.api.service.storage

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.model.computing.VmVo
import com.itinfo.rutilvm.api.model.storage.DiskImageVo
import com.itinfo.rutilvm.api.model.storage.DiskProfileVo
import com.itinfo.rutilvm.api.model.storage.StorageDomainVo
import org.apache.commons.fileupload.FileItem
import org.apache.commons.fileupload.disk.DiskFileItem
import org.apache.commons.io.IOUtils
import org.hamcrest.MatcherAssert.assertThat
import org.hamcrest.Matchers.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.web.multipart.MultipartFile
import org.springframework.web.multipart.commons.CommonsMultipartFile
import java.io.File
import java.io.FileInputStream
import java.io.IOException
import java.io.InputStream
import java.math.BigInteger
import java.nio.file.Files

/**
 * [ItDiskServiceTest]
 * [ItDiskService]에 대한 단위테스트
 * 디스크 서비스 테스트
 *
 * @author chlee
 * @author deh22
 * @since 2024.09.30
 */
@SpringBootTest
class ItDiskServiceTest {
    @Autowired
    private lateinit var service: ItDiskService

    private lateinit var dataCenterId: String
    private lateinit var clusterId: String // Default
    private lateinit var networkId: String // ovirtmgmt(dc: Default)
    private lateinit var host01: String // host01
    private lateinit var domainId: String // host01
    private lateinit var diskId: String // host01

    @BeforeEach
    fun setup() {
        dataCenterId = "023b0a26-3819-11ef-8d02-00163e6c8feb"
        clusterId = "023c79d8-3819-11ef-bf08-00163e6c8feb"
        networkId = "00000000-0000-0000-0000-000000000009"
        host01 = "671e18b2-964d-4cc6-9645-08690c94d249"
        domainId = "213b1a0a-b0c0-4d10-95a4-7aafed4f76b9"
        diskId = "ebe58983-3c96-473a-9553-98bee3606f0e"
    }


    /**
     * [should_findAll]
     * [ItDiskService.findAll] 의 단위테스트
     *
     * @see [ItDiskService.findAll]
     */
    @Test
    fun should_findAll() {
        log.debug("should_findAll ... ")
        val start = System.currentTimeMillis()
        val result: List<DiskImageVo> =
            service.findAll()
        val end = System.currentTimeMillis()

        log.info("수행시간: {}", end-start)
        assertThat(result, `is`(not(nullValue())))
        result.forEach { println(it) }
    }


    /**
     * [should_findOne]
     * [ItDiskService.findOne] 의 단위테스트
     *
     * @see [ItDiskService.findOne]
     */
    @Test
    fun should_findOne() {
        log.debug("should_findOne ... ")
		val result: DiskImageVo? =
			service.findOne("be01dab8-93a1-4e69-a712-2ac3bc3fba85")

		assertThat(result, `is`(not(nullValue())))
		println(result)
    }

    /**
     * [should_findAllDomainsFromDataCenter]
     * [ItDiskService.findAllDomainsFromDataCenter] 의 단위테스트
     *
     * @see [ItDiskService.findAllDomainsFromDataCenter]
     */
    @Test
    fun should_findAllDomainsFromDataCenter() {
        log.info("should_findAllDomainsFromDataCenter ... ")
        val result: List<StorageDomainVo> =
            service.findAllDomainsFromDataCenter(dataCenterId)

        assertThat(result, `is`(not(nullValue())))
        assertThat(result.size, `is`(2))
        result.forEach { println(it) }
    }

    /**
     * [should_findAllDiskProfilesFromStorageDomain]
     * [ItDiskService.findAllDomainsFromDataCenter] 의 단위테스트
     *
     * @see [ItDiskService.findAllDiskProfilesFromStorageDomain]
     */
    @Test
    fun should_findAllDiskProfilesFromStorageDomain() {
        log.info("should_findAllDiskProfilesFromStorageDomain ... ")
        val result: List<DiskProfileVo> =
            service.findAllDiskProfilesFromStorageDomain(domainId)

        assertThat(result, `is`(not(nullValue())))
        result.forEach { println(it) }
        assertThat(result.size, `is`(1))
    }

    /**
     * [should_add]
     * [ItDiskService.add] 의 단위테스트
     *
     * @see [ItDiskService.add]
     */
    @Test
    fun should_add() {
        log.info("should_add... ")
        val storageDomainVo = IdentifiedVo.builder { id { domainId } }
        val diskProfileVo = IdentifiedVo.builder { id { "71ba3cf0-7062-4bff-9b36-e9141857d148" } }

        val addDisk =
            DiskImageVo.builder {
                alias { "a3q" }
                size { BigInteger.valueOf(2) }
                description { "test" }
                storageDomainVo { storageDomainVo }
				diskProfileVo { diskProfileVo }
                sparse { false } // false 사전할당
                wipeAfterDelete { false }
                sharable { false }
                backup { true }
            }

        val addResult: DiskImageVo? =
            service.add(addDisk)

        assertThat(addResult, `is`(not(nullValue())))
        assertThat(addResult?.alias, `is`(addDisk.alias))
    }


    /**
     * [should_update]
     * [ItDiskService.update] 의 단위테스트
     *
     * @see [ItDiskService.update]
     */
    @Test
    fun should_update() {
        log.info("should_update... ")
        val storageDomainVo = IdentifiedVo.builder { id { domainId } }
        val diskProfileVo = IdentifiedVo.builder { id { "71ba3cf0-7062-4bff-9b36-e9141857d148" } }

        val updateDisk =
            DiskImageVo.builder {
                id { "9ef14870-677c-4046-ba7e-c8e399d5f423" }
                alias { "sfasd" }
                size {  BigInteger.valueOf(2) }
                appendSize {  BigInteger.valueOf(2) }
                description { "test" }
                storageDomainVo { storageDomainVo }
				diskProfileVo { diskProfileVo }
                wipeAfterDelete { false }
                sharable { false }
                backup { true }
            }

        val updateResult: DiskImageVo? =
            service.update(updateDisk)

        assertThat(updateResult, `is`(not(nullValue())))
//        assertThat(updateResult?.alias, `is`(updateDisk.alias))
    }

    /**
     * [should_remove]
     * [ItDiskService.remove] 의 단위테스트
     *
     * @see [ItDiskService.remove]
     */
    @Test
    fun should_remove() {
        log.info("should_remove ... ")
        val diskId = "9ef14870-677c-4046-ba7e-c8e399d5f423"
        val result: Boolean =
            service.remove(diskId)

        assertThat(result, `is`(not(nullValue())))
        assertThat(result, `is`(true))
    }

    /**
     * [should_removeMultiple]
     * [ItDiskService.removeMultiple] 의 단위테스트
     *
     * @see [ItDiskService.removeMultiple]
     */
    @Test
    fun should_removeMultiple() {
        log.info("should_removeMultiple ... ")
        val diskIdList: List<String> = listOf(
            "f43101ba-bc2a-4e74-96ab-9b29052b44ff",
            "e9927ebd-b818-4a33-aa99-06a0f5394c2b",
            "42045e39-56df-4dc5-b8e2-501e28c3a2b9"
        )

        val result: List<Boolean> =
            service.removeMultiple(diskIdList)

        assertThat(result, `is`(not(nullValue())))
        println(result)
    }


    /**
     * [should_findAllStorageDomainsToMoveFromDisk]
     * [ItDiskService.findAllStorageDomainsToMoveFromDisk] 의 단위테스트
     *
     * @see [ItDiskService.findAllStorageDomainsToMoveFromDisk]
     */
    @Test
    fun should_findAllStorageDomainsToMoveFromDisk(){
        log.info("should_findAllStorageDomainsToMoveFromDisk ... ")
        val diskId2 = "7513bdfd-be31-402a-b023-4dc94bc5a9dc"
        val result: List<StorageDomainVo> =
            service.findAllStorageDomainsToMoveFromDisk(diskId2)

        assertThat(result, `is`(not(nullValue())))
        result.forEach { println(it) }
        assertThat(result.size, `is`(1))
    }

    /**
     * [should_move]
     * [ItDiskService.move] 의 단위테스트
     *
     * @see [ItDiskService.move]
     */
    @Test
    fun should_move() {
        val diskId = "f6896f27-7ba6-4d0d-b204-1a6aa2c16d86"
        val domainId2 = "213b1a0a-b0c0-4d10-95a4-7aafed4f76b9"
        val result: Boolean =
            service.move(diskId, domainId2)

        assertThat(result, `is`(not(nullValue())))
        assertThat(result, `is`(true))
    }

    /**
     * [should_copy]
     * [ItDiskService.copy] 의 단위테스트
     *
     * @see [ItDiskService.copy]
     */
    @Test
    fun should_copy() {
        val diskId = "7513bdfd-be31-402a-b023-4dc94bc5a9dc"
        val domainId2 = "213b1a0a-b0c0-4d10-95a4-7aafed4f76b9"
        val storageDomainVo = IdentifiedVo.builder { id { domainId2 }}

        val image =
            DiskImageVo.builder {
                id { diskId }
                alias { "copytest" }
                storageDomainVo { storageDomainVo }
            }
        val result =
            service.copy(image)

        assertThat(result, `is`(true))
    }

    /**
     * [should_upload]
     * [ItDiskService.upload] 의 단위테스트
     *
     * @see [ItDiskService.upload]
     */
    @Test
    @Throws(IOException::class)
    fun should_upload() {
        // test환경에서는 실패할 경우 있음
        val path = "C:/Users/deh22/Documents/iso/Rocky-8.4-x86_64-minimal.iso"

        val file = File(path)
        val fileItem: FileItem = DiskFileItem(
            "file",
            Files.probeContentType(file.toPath()),
            false,
            file.name,
            file.length().toInt(),
            file.parentFile
        )
        val inputStream: InputStream = FileInputStream(file)
        val outputStream = fileItem.outputStream
        IOUtils.copy(inputStream, outputStream)
        val multipartFile: MultipartFile = CommonsMultipartFile(fileItem)

        val iVo =
            DiskImageVo.builder {
                alias { "as" }
                description { "test" }
                storageDomainVo { IdentifiedVo.builder { id { "213b1a0a-b0c0-4d10-95a4-7aafed4f76b9" } } }
				diskProfileVo { IdentifiedVo.builder { id { "71ba3cf0-7062-4bff-9b36-e9141857d148" } } }
                wipeAfterDelete { false }
                sharable { false }
            }

        val result =
            service.upload(multipartFile, iVo)

        assertThat(result, `is`(true))
    }


    /**
     * [should_findAllVmsFromDisk]
     * [ItDiskService.findAllVmsFromDisk] 의 단위테스트
     *
     * @see [ItDiskService.findAllVmsFromDisk]
     */
    @Test
    fun should_findAllVmsFromDisk() {
        log.info("should_findAllVmsFromDisk ... ")
        val diskId = "6ebde818-0b00-425d-b1c2-8a6c066140c8"
        val result: List<VmVo> =
            service.findAllVmsFromDisk(diskId)

        assertThat(result, `is`(not(nullValue())))
//		assertThat(result.size, `is`(0))
        result.forEach { println(it) }
    }



    /**
     * [should_findAllStorageDomainsFromDisk]
     * [ItDiskService.findAllStorageDomainsFromDisk] 의 단위테스트
     *
     * @see [ItDiskService.findAllStorageDomainsFromDisk]
     */
    @Test
    fun should_findAllStorageDomainsFromDisk(){
        log.info("should_findAllStorageDomainsFromDisk ... ")
        val diskId2 = "7513bdfd-be31-402a-b023-4dc94bc5a9dc"
        val result: List<StorageDomainVo> =
            service.findAllStorageDomainsFromDisk(diskId2)

        assertThat(result, `is`(not(nullValue())))
        result.forEach { println(it) }
        assertThat(result.size, `is`(1))
    }

//    /**
//     * [should_findAllPermissionsFromDisk]
//     * [ItDiskService.findAllPermissionsFromDisk] 의 단위테스트
//     *
//     * @see [ItDiskService.findAllPermissionsFromDisk]
//     */
//    @Test
//    fun should_findAllPermissionsFromDisk() {
//        log.info("should_findAllPermissionsFromDisk ... ")
//        val diskId = "6ebde818-0b00-425d-b1c2-8a6c066140c8"
//        val result: List<PermissionVo> =
//            service.findAllPermissionsFromDisk(diskId)
//
//        assertThat(result, `is`(not(nullValue())))
//        assertThat(result.size, `is`(5))
//        result.forEach { println(it) }
//    }

    companion object{
        private val log by LoggerDelegate()
    }

}
