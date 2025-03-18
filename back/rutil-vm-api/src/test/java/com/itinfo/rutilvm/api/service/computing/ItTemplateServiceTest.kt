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
	private lateinit var tempId: String
	private lateinit var vmId: String

	@BeforeEach
	fun setup() {
		origin = TemplateVo.DEFAULT_BLANK_TEMPLATE_ID
		tempId = "1b6d1021-7fae-4e96-9e54-994d6d66d0f4"
		vmId = "097ca683-1477-4af3-9595-6bb34451bcb2"
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
	fun should_findAllDiskAttachmentsFromVm() {
		log.debug("should_findAllDiskAttachmentsFromVm")
		val result: List<DiskAttachmentVo> =
			service.findAllDiskAttachmentsFromVm(vmId)

		assertThat(result, `is`(not(nullValue())))
		result.forEach { println(it) }
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
