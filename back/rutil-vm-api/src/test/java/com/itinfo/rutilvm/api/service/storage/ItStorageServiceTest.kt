package com.itinfo.rutilvm.service.storage

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.itcloud.model.IdentifiedVo
import com.itinfo.itcloud.model.computing.*
import com.itinfo.itcloud.model.setting.PermissionVo
import com.itinfo.itcloud.model.storage.DiskImageVo
import com.itinfo.itcloud.model.storage.DiskProfileVo
import com.itinfo.itcloud.model.storage.HostStorageVo
import com.itinfo.itcloud.model.storage.StorageDomainVo
import org.apache.commons.fileupload.FileItem
import org.apache.commons.fileupload.disk.DiskFileItem
import org.apache.commons.io.IOUtils

import org.hamcrest.MatcherAssert.assertThat
import org.hamcrest.Matchers.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.ovirt.engine.sdk4.types.Host
import org.ovirt.engine.sdk4.types.StorageDomainType
import org.ovirt.engine.sdk4.types.StorageType

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.web.multipart.MultipartFile
import org.springframework.web.multipart.commons.CommonsMultipartFile

import java.io.File
import java.io.FileInputStream
import java.io.IOException
import java.io.InputStream
import java.nio.file.Files

/**
 * [ItStorageServiceTest]
 * 스토리지 서비스 테스트
 *
 * @author chlee
 * @since 2024.07.15
 */
@SpringBootTest
class ItStorageServiceTest {
	@Autowired private lateinit var service: ItStorageService

	private lateinit var dataCenterId: String
	private lateinit var clusterId: String // Default
	private lateinit var networkId: String // ovirtmgmt(dc: Default)
	private lateinit var host01: String // host01
	private lateinit var domainId: String // hosted=engin
	private lateinit var nfs: String // hosted=engin

	@BeforeEach
	fun setup() {
		dataCenterId = "3c55243c-8b5a-11ef-b1b1-00163e466494"
		clusterId = "023c79d8-3819-11ef-bf08-00163e6c8feb"
		networkId = "00000000-0000-0000-0000-000000000009"
		host01 = "671e18b2-964d-4cc6-9645-08690c94d249"
		domainId = "213b1a0a-b0c0-4d10-95a4-7aafed4f76b9"
		nfs = "06faa572-f1ac-4874-adcc-9d26bb74a54d"
	}


	/**
	 * [should_findAll]
	 * [ItStorageService.findAll] 의 단위테스트
	 *
	 * @see [ItStorageService.findAll]
	 */
	@Test
	fun should_findAll() {
		log.debug("should_findAllDomains ... ")
		val result: List<StorageDomainVo> =
			service.findAll()

		assertThat(result, `is`(not(nullValue())))
		result.forEach { println(it) }
//		assertThat(result.size, `is`(2))
	}


	/**
	 * [should_findOne]
	 * [ItStorageService.findOne] 의 단위테스트
	 *
	 * @see [ItStorageService.findOne]
	 */
	@Test
	fun should_findOne() {
		log.debug("should_findOne ... ")
		val result: StorageDomainVo? =
			service.findOne(domainId)

		assertThat(result, `is`(not(nullValue())))
		assertThat(result?.id, `is`(domainId))
		println(result)
	}


	/**
	 * [should_add_data_nfs]
	 * [ItStorageService.add] 의 단위테스트
	 *
	 * @see [ItStorageService.add]
	 */
//	@Test
//	fun should_add_data_nfs() {
//		log.debug("should_add_data_nfs ... ")
//		val storage: StorageDomainVo = StorageDomainVo.builder {
//			name { "test02" }
//			domainType { StorageDomainType.DATA }
//			description { "test add data-nfs" }
//			warning { 10 }
//			spaceBlocker { 5 }
//			dataCenterVo { IdentifiedVo.builder { id { "92dedc62-7bdd-11ef-9270-00163e2fda35" } } }
//			hostVo { IdentifiedVo.builder { name { "on45-host01" } } }
//			storageType { StorageType.NFS }
//			storageAddress { "192.168.0.160" }
//			storagePath { "/nfstest02" }
//		}
//
//		val result: StorageDomainVo? =
//			service.add(storage)
//
//		assertThat(result, `is`(not(nullValue())))
//		assertThat(result?.storageType, `is`(StorageType.NFS))
//		assertThat(result?.name, `is`("test02"))
//	}

	/**
	 * [should_import]
	 * [ItStorageService.import] 의 단위테스트
	 *
	 * @see [ItStorageService.import]
	 */
	@Test
	fun should_import() {
		log.debug("should_import ... ")
	}

	/**
	 * [should_update]
	 * [ItStorageService.update] 의 단위테스트
	 *
	 * @see [ItStorageService.update]
	 */
	@Test
	fun should_update() {
		log.debug("should_update")
	}

	/**
	 * [should_remove]
	 * [ItStorageService.remove] 의 단위테스트
	 *
	 * @see [ItStorageService.remove]
	 */
//	@Test
//	fun should_remove() {
//		log.debug("should_remove ... ")
//		val result: Boolean =
//			service.remove("ead3bea8-0f10-435f-9acb-242dfa14010a")
//
//		assertThat(result, `is`(not(nullValue())))
//		assertThat(result, `is`(false))
//	}

	/**
	 * [should_destroy]
	 * [ItStorageService.destroy] 의 단위테스트
	 *
	 * @see [ItStorageService.destroy]
	 */
	@Test
	fun should_destroy() {
		log.debug("should_destroy ... ")
	}


	/**
	 * [should_findAllDataCentersFromStorageDomain]
	 * [ItStorageService.findAllDataCentersFromStorageDomain] 의 단위테스트
	 *
	 * @see [ItStorageService.findAllDataCentersFromStorageDomain]
	 */
	@Test
	fun should_findAllDataCentersFromStorageDomain() {
		log.debug("should_findAllDataCentersFromStorageDomain ... ")
		val result: List<DataCenterVo> =
			service.findAllDataCentersFromStorageDomain("2741d400-55c1-4c44-8631-53d34e8050e8")

		assertThat(result, `is`(not(nullValue())))
		result.forEach { println(it) }
//		print(result)
//		assertThat(result.size, `is`(1))
	}


	/**
	 * [should_attachFromDataCenter]
	 * [ItStorageService.attachFromDataCenter] 의 단위테스트
	 *
	 * @see [ItStorageService.attachFromDataCenter]
	 */
	@Test
	fun should_attachFromDataCenter() {
		log.debug("should_attachFromDataCenter ... ")
		val dataCenterId = "92dedc62-7bdd-11ef-9270-00163e2fda35"
		val storageDomainId = "ead3bea8-0f10-435f-9acb-242dfa14010a"

		val result: Boolean =
			service.attachFromDataCenter(dataCenterId, storageDomainId)

		assertThat(result, `is`(not(nullValue())))
		assertThat(result, `is`(true))
	}

	/**
	 * [should_detachFromDataCenter]
	 * [ItStorageService.detachFromDataCenter] 의 단위테스트
	 *
	 * @see [ItStorageService.detachFromDataCenter]
	 */
	@Test
	fun should_detachFromDataCenter() {
		log.debug("should_detachFromDataCenter ... ")
		val dataCenterId = "92dedc62-7bdd-11ef-9270-00163e2fda35"
		val storageDomainId = "ead3bea8-0f10-435f-9acb-242dfa14010a"

		val result: Boolean =
			service.detachFromDataCenter(dataCenterId, storageDomainId)

		assertThat(result, `is`(not(nullValue())))
		assertThat(result, `is`(true))
	}

	/**
	 * [should_activateFromDataCenter]
	 * [ItStorageService.activateFromDataCenter] 의 단위테스트
	 *
	 * @see [ItStorageService.activateFromDataCenter]
	 */
	@Test
	fun should_activateFromDataCenter() {
		log.debug("should_activateFromDataCenter ... ")
		val dataCenterId = "92dedc62-7bdd-11ef-9270-00163e2fda35"
		val storageDomainId = "ead3bea8-0f10-435f-9acb-242dfa14010a"

		val result: Boolean =
			service.activateFromDataCenter(dataCenterId, storageDomainId)

		assertThat(result, `is`(not(nullValue())))
		assertThat(result, `is`(true))
	}

	/**
	 * [should_maintenanceFromDataCenter]
	 * [ItStorageService.maintenanceFromDataCenter] 의 단위테스트
	 *
	 * @see [ItStorageService.maintenanceFromDataCenter]
	 */
	@Test
	fun should_maintenanceFromDataCenter() {
		log.debug("should_maintenanceFromDataCenter ... ")
		val dataCenterId = "92dedc62-7bdd-11ef-9270-00163e2fda35"
		val storageDomainId = "ead3bea8-0f10-435f-9acb-242dfa14010a"

		val result: Boolean =
			service.maintenanceFromDataCenter(dataCenterId, storageDomainId)

		assertThat(result, `is`(not(nullValue())))
		assertThat(result, `is`(true))
	}



	/**
	 * [should_findAllVmsFromStorageDomain]
	 * [ItStorageService.findAllVmsFromStorageDomain] 의 단위테스트
	 *
	 * @see [ItStorageService.findAllVmsFromStorageDomain]
	 */
	@Test
	fun should_findAllVmsFromStorageDomain() {
		log.debug("should_findAllVmsFromStorageDomain ... ")
		val result: List<VmVo> =
			service.findAllVmsFromStorageDomain("ed8f0c7f-89d9-459e-8a84-3388dfade338")

		assertThat(result, `is`(not(nullValue())))
		result.forEach { println(it) }
//		assertThat(result.size, `is`(3))
	}

	/**
	 * [should_findAllTemplatesFromStorageDomain]
	 * [ItStorageService.findAllTemplatesFromStorageDomain] 의 단위테스트
	 *
	 * @see [ItStorageService.findAllTemplatesFromStorageDomain]
	 */
	@Test
	fun should_findAllTemplatesFromStorageDomain() {
		log.debug("should_findAllTemplatesFromStorageDomain ... ")
		val result: List<TemplateVo> =
			service.findAllTemplatesFromStorageDomain("072fbaa1-08f3-4a40-9f34-a5ca22dd1d74")

		assertThat(result, `is`(not(nullValue())))
		result.forEach { println(it) }
		assertThat(result.size, `is`(0))
	}



	/**
	 * [should_findAllDisksFromStorageDomain]
	 * [ItStorageService.findAllDisksFromStorageDomain] 의 단위테스트
	 *
	 * @see [ItStorageService.findAllDisksFromStorageDomain]
	 */
	@Test
	fun should_findAllDisksFromStorageDomain() {
		log.debug("should_findAllDisksFromStorageDomain ... ")
		val start = System.currentTimeMillis()
		val result: List<DiskImageVo> =
			service.findAllDisksFromStorageDomain(domainId)
		val end = System.currentTimeMillis()

//        log.info("수행시간: {}", end-start)
		assertThat(result, `is`(not(nullValue())))
		result.forEach { println(it) }
		assertThat(result.size, `is`(15))
	}

	/**
	 * [should_findAllDiskSnapshotsFromStorageDomain]
	 * [ItStorageService.findAllDiskSnapshotsFromStorageDomain] 의 단위테스트
	 *
	 * @see [ItStorageService.findAllDiskSnapshotsFromStorageDomain]
	 */
	@Test
	fun should_findAllDiskSnapshotsFromStorageDomain() {
		log.debug("should_findAllDiskSnapshotsFromStorageDomain ... ")
		val result: List<SnapshotDiskVo> =
			service.findAllDiskSnapshotsFromStorageDomain(domainId)

		assertThat(result, `is`(not(nullValue())))
		result.forEach { println(it) }
		assertThat(result.size, `is`(3))
	}


	/**
	 * [should_findAllEventsFromStorageDomain]
	 * [ItStorageService.findAllEventsFromStorageDomain] 의 단위테스트
	 *
	 * @see [ItStorageService.findAllEventsFromStorageDomain]
	 */
	@Test
	fun should_findAllEventsFromStorageDomain() {
		log.debug("should_findAllEventsFromStorageDomain ... ")
		val result: List<EventVo> =
			service.findAllEventsFromStorageDomain(domainId)

		assertThat(result, `is`(not(nullValue())))
		assertThat(result.size, `is`(26))
		println(result.size)
	}


	companion object {
		private val log by LoggerDelegate()
	}
}