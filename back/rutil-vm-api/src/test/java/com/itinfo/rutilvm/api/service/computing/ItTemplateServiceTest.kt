package com.itinfo.rutilvm.api.service.computing

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.model.computing.TemplateVo
import com.itinfo.rutilvm.api.model.computing.VmViewVo
import com.itinfo.rutilvm.api.model.computing.EventVo
import com.itinfo.rutilvm.api.model.network.NicVo
import com.itinfo.rutilvm.api.model.storage.DiskAttachmentVo
import com.itinfo.rutilvm.api.model.storage.StorageDomainVo
//import com.itinfo.itcloud.service.computing.ItClusterServiceTest.Companion
import org.junit.jupiter.api.Test
import org.hamcrest.MatcherAssert.assertThat
import org.hamcrest.Matchers.`is`
import org.hamcrest.Matchers.not
import org.hamcrest.Matchers.nullValue
import org.junit.jupiter.api.BeforeEach
import org.ovirt.engine.sdk4.types.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

/**
 * [ItTemplateServiceTest]
 * [ItTemplateService]에 대한 단위테스트
 *
 * @author chanhi2000
 * @author deh22
 * @since 2024.10.06
 */
@SpringBootTest
class ItTemplateServiceTest {
	@Autowired private lateinit var service: ItTemplateService

	private lateinit var origin: String
	private lateinit var clusterId: String
	private lateinit var tempId: String
	private lateinit var vmId: String

	@BeforeEach
	fun setup() {
		origin = "00000000-0000-0000-0000-000000000000"
		clusterId = "d20bd210-89f1-11ef-afa2-00163e2f0226"
		tempId = "69feada9-7d26-43a4-8f79-4c04110316dd"
		vmId = "bf404563-ff9e-4dcc-aa87-61e873de961d"
	}

	/**
	 * [should_findAll]
	 * [ItTemplateService.findAll]에 대한 단위테스트
	 *
	 * @see [ItTemplateService.findAll]
	 */
	@Test
	fun should_findAll(){
		log.debug("should_findAll")
		val result: List<TemplateVo> =
			service.findAll()

		assertThat(result, `is`(not(nullValue())))
		result.forEach { println(it) }
		assertThat(result.size, `is`(2))
	}

	/**
	 * [should_findAll]
	 * [ItTemplateService.findOne]에 대한 단위테스트
	 *
	 * @see [ItTemplateService.findOne]
	 */
	@Test
	fun should_findOne(){
		log.debug("should_findOne")
		val result: TemplateVo? =
			service.findOne(tempId)

		assertThat(result, `is`(not(nullValue())))
		println(result)
	}

	/**
	 * [should_findAllDiskAttachmentsFromVm]
	 * [ItTemplateService.findAllDiskAttachmentsFromVm]에 대한 단위테스트
	 *
	 * @see [ItTemplateService.findAllDiskAttachmentsFromVm]
	 */
	@Test
	fun should_findAllDiskAttachmentsFromVm(){
		log.debug("should_findAllDiskAttachmentsFromVm")
		val result: List<DiskAttachmentVo> =
			service.findAllDiskAttachmentsFromVm(vmId)

		assertThat(result, `is`(not(nullValue())))
		result.forEach { println(it) }
		assertThat(result.size, `is`(2))
	}

	/**
	 * [should_add_update_and_remove_Template]
	 * [ItTemplateService.add], [ItTemplateService.update], [ItTemplateService.remove]에 대한 단위테스트
	 * 외부공급자 생성x
	 *
	 * @see ItTemplateService.add
	 * @see ItTemplateService.update
	 * @see ItTemplateService.remove
	 **/
	@Test
	fun should_add_update_and_remove_Template() {
//		log.debug("should_addTemplate ... ")
//		val diskattList: List<DiskAttachmentVo> =
//			listOf(
//				DiskAttachmentVo.builder {
//					DiskImageVo.builder {
//						id { "aeef0ca7-738b-47c1-b89c-f8584eb088d3" }
//						alias { "dev2_Disk1" }
//						format { DiskFormat.COW }
//						storageDomainVo { IdentifiedVo.builder { id { "6619591b-2cc3-4998-8dd7-810d73eb4906" } } }
//						diskProfileVo { IdentifiedVo.builder { id { "4ab9e6cc-4ba3-43ba-b5f1-a687004bfdfe" } } }
//					}
//				},
//				DiskAttachmentVo.builder {
//					DiskImageVo.builder {
//						id { "b0d2be2c-c2fb-4738-8f47-1ec47c2715f5" }
//						alias { "doc01_Disk1" }
//						format { DiskFormat.COW }
//						storageDomainVo { IdentifiedVo.builder { id { "61a08ba0-ab2e-4b68-9726-bbf578ebf1e8" } } }
//						diskProfileVo { IdentifiedVo.builder { id { "4a143c1a-538f-45d9-bab7-475d0e8bde13" } } }
//					}
//				}
//			)
//
//		val addTemplate: TemplateVo = TemplateVo.builder {
//			name { "tem-test" }
//			description { "test" }
//			comment { "t" }
//			clusterVo { IdentifiedVo.builder { id { clusterId } } }
//			cpuProfileVo { IdentifiedVo.builder { id { "58ca604e-01a7-003f-01de-000000000250" } } }
//			vmVo { IdentifiedVo.builder { vmId } }
//			diskAttachmentVos { diskattList }
//		}
//
//		val addResult: TemplateVo? =
//			service.add(vmId, addTemplate)
//
//		assertThat(addResult, `is`(not(nullValue())))
//		assertThat(addResult?.id, `is`(not(nullValue())))
//		assertThat(addResult?.name, `is`(addTemplate.name))
//		assertThat(addResult?.description, `is`(addTemplate.description))
//		assertThat(addResult?.comment, `is`(addTemplate.comment))


//		log.debug("should_updateTemplate ... ")
//		val updateTemplate: TemplateVo = TemplateVo.builder {
//			id { addResult?.id }
//			name { "testTemplate" }
//		}
//
//		val updateResult: TemplateVo? =
//			service.update(updateTemplate)
//
//		assertThat(updateResult, `is`(not(nullValue())))
//		assertThat(updateResult?.id, `is`(updateTemplate.id))
//		assertThat(updateResult?.name, `is`(updateTemplate.name))
//		assertThat(updateResult?.description, `is`(updateTemplate.description))
//		assertThat(updateResult?.comment, `is`(updateTemplate.comment))
//
		log.debug("should_removeTemplate ... ")
		val removeResult =
			 service.remove("cceb8495-1589-4dd6-88e8-67ef1d6fdb6d")

		assertThat(removeResult, `is`(true))
	}


	/**
	 * [should_findAllVmsFromTemplate]
	 * [ItTemplateService.findAllVmsFromTemplate]에 대한 단위테스트
	 *
	 * @see [ItTemplateService.findAllVmsFromTemplate]
	 */
	@Test
	fun should_findAllVmsFromTemplate(){
		log.debug("should_findAllVmsFromTemplate")
		val result: List<VmViewVo> =
			service.findAllVmsFromTemplate(tempId)

		assertThat(result, `is`(not(nullValue())))
		result.forEach { println(it) }
		assertThat(result.size, `is`(0))
	}

	/**
	 * [should_findAllNicsFromTemplate]
	 * [ItTemplateService.findAllNicsFromTemplate]에 대한 단위테스트
	 *
	 * @see [ItTemplateService.findAllNicsFromTemplate]
	 */
	@Test
	fun should_findAllNicsFromTemplate(){
		log.debug("should_findAllNicsFromTemplate")
		val result: List<NicVo> =
			service.findAllNicsFromTemplate(tempId)

		assertThat(result, `is`(not(nullValue())))
		result.forEach { println(it) }
		assertThat(result.size, `is`(1))
	}

	/**
	 * [should_addNicFromTemplate]
	 * [ItTemplateService.addNicFromTemplate]에 대한 단위테스트
	 *
	 * @see [ItTemplateService.addNicFromTemplate]
	 */
	@Test
	fun should_addNicFromTemplate(){
		log.debug("should_addNicFromTemplate... ")
		val nicVo: NicVo = NicVo.builder {
			name { "nic2" }
			vnicProfileVo { IdentifiedVo.builder { id { "0000000a-000a-000a-000a-000000000398" } } }
			interface_ { NicInterface.VIRTIO }
			linked { true }
			plugged { true }
		}
		val result: NicVo? =
			service.addNicFromTemplate(tempId, nicVo)

		assertThat(result, `is`(not(nullValue())))
	}

	/**
	 * [should_updateNicFromTemplate]
	 * [ItTemplateService.updateNicFromTemplate]에 대한 단위테스트
	 *
	 * @see [ItTemplateService.updateNicFromTemplate]
	 */
	@Test
	fun should_updateNicFromTemplate(){
		log.debug("should_updateNicFromTemplate... ")
		val nicVo: NicVo = NicVo.builder {
			id { "da30e64b-0450-4355-b5bb-30678640088c" }
			name { "nic22" }
			vnicProfileVo { IdentifiedVo.builder { id { "0000000a-000a-000a-000a-000000000398" } } }
			interface_ { NicInterface.VIRTIO }
			linked { true }
			plugged { false }
		}
		val result: NicVo? =
			service.updateNicFromTemplate(tempId, nicVo)

		assertThat(result, `is`(not(nullValue())))
		assertThat(result?.id, `is`(nicVo.id))
		assertThat(result?.name, `is`(nicVo.name))
		assertThat(result?.plugged, `is`(nicVo.plugged))
	}

	/**
	 * [should_removeNicFromTemplate]
	 * [ItTemplateService.removeNicFromTemplate]에 대한 단위테스트
	 *
	 * @see [ItTemplateService.removeNicFromTemplate]
	 */
	@Test
	fun should_removeNicFromTemplate(){
		log.debug("should_removeNicFromTemplate... ")
		val result: Boolean =
			service.removeNicFromTemplate(tempId, "da30e64b-0450-4355-b5bb-30678640088c")

		assertThat(result, `is`(not(nullValue())))
	}


	/**
	 * [should_findAllDisksFromTemplate]
	 * [ItTemplateService.findAllDisksFromTemplate]에 대한 단위테스트
	 *
	 * @see [ItTemplateService.findAllDisksFromTemplate]
	 */
	@Test
	fun should_findAllDisksFromTemplate(){
		log.debug("should_findAllDisksFromTemplate")
		val result: List<DiskAttachmentVo> =
			service.findAllDisksFromTemplate(tempId)

		assertThat(result, `is`(not(nullValue())))
		result.forEach { println(it) }
		assertThat(result.size, `is`(2))
	}

	/**
	 * [should_findAllStorageDomainsFromTemplate]
	 * [ItTemplateService.findAllStorageDomainsFromTemplate]에 대한 단위테스트
	 *
	 * @see [ItTemplateService.findAllStorageDomainsFromTemplate]
	 */
	@Test
	fun should_findAllStorageDomainsFromTemplate(){
		log.debug("should_findAllStorageDomainsFromTemplate")
		val result: List<StorageDomainVo> =
			service.findAllStorageDomainsFromTemplate(tempId)

		assertThat(result, `is`(not(nullValue())))
		result.forEach { println(it) }
		assertThat(result.size, `is`(2))
	}

	/**
	 * [should_findAllEventsFromTemplate]
	 * [ItTemplateService.findAllEventsFromTemplate]에 대한 단위테스트
	 *
	 * @see [ItTemplateService.findAllEventsFromTemplate]
	 */
	@Test
	fun should_findAllEventsFromTemplate(){
		log.debug("should_findAllEventsFromTemplate")
		val result: List<EventVo> =
			service.findAllEventsFromTemplate(tempId)

		assertThat(result, `is`(not(nullValue())))
		result.forEach { println(it) }
		assertThat(result.size, `is`(5))
	}




	companion object {
		private val log by LoggerDelegate()
	}
}
