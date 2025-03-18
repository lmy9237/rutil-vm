package com.itinfo.rutilvm.api.service.computing

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.model.network.NicVo
import org.hamcrest.MatcherAssert.assertThat
import org.hamcrest.Matchers.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.ovirt.engine.sdk4.types.NicInterface
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

/**
* [ItVmNicServiceTest]
* [ItVmNicService]에 대한 단위테스트
*
* @author chanhi2000
* @author deh22
* @since 2024.09.26
*/
@SpringBootTest
class ItVmNicServiceTest {
   @Autowired private lateinit var service: ItVmNicService

   private lateinit var vmId: String // hostVm
   private lateinit var nicId: String

   @BeforeEach
   fun setup() {
	   vmId = "097ca683-1477-4af3-9595-6bb34451bcb2" // HostedEngine
	   nicId = "0e2c6f67-3081-4e8a-a7f9-730a54aa69ac" // vnet0
   }

   /**
    * [should_findAllNicsFromVm]
    * [ItVmNicService.findAllFromVm]에 대한 단위테스트
    *
    * @see [ItVmNicService.findAllFromVm]
    */
   @Test
   fun should_findAllNicsFromVm() {
       log.debug("should_findAllNicsFromVm ...")
       val result: List<NicVo> =
           service.findAllFromVm(vmId)

       assertThat(result, `is`(not(nullValue())))
       result.forEach { println(it) }
   }

   /**
    * [should_findNicFromVm]
    * [ItVmNicService.findOneFromVm]에 대한 단위테스트
    *
    * @see [ItVmNicService.findOneFromVm]
    */
   @Test
   fun should_findNicFromVm() {
       log.debug("should_findNicFromVm ...")
       val result: NicVo? =
           service.findOneFromVm(vmId, nicId)

       assertThat(result, `is`(not(nullValue())))
       println(result)
       assertThat(result?.name, `is`("nic3"))
   }

   /**
    * [should_addNicFromVm]
    * [ItVmNicService.addFromVm]에 대한 단위테스트
    *
    * @see ItVmNicService.addFromVm
    */
   @Test
   fun should_addNicFromVm() {
       log.debug("should_addNicFromVm ... ")
       val addVmNic: NicVo = NicVo.builder {
           name { "nic4" }
           vnicProfileVo { IdentifiedVo.builder { id { "0000000a-000a-000a-000a-000000000398" } } }
           interface_ { NicInterface.VIRTIO  }
           linked { true }
           plugged { true }
           macAddress { null } // 기본은 없음
       }

       val addResult: NicVo? =
           service.addFromVm(vmId, addVmNic)

       assertThat(addResult?.id, `is`(not(nullValue())))
       assertThat(addResult?.vnicProfileVo?.id, `is`(addVmNic.vnicProfileVo.id))
       assertThat(addResult?.interface_, `is`(addVmNic.interface_))
       assertThat(addResult?.linked, `is`(addVmNic.linked))
       assertThat(addResult?.plugged, `is`(addVmNic.plugged))
//        assertThat(addResult?.macAddress, `is`(addVmNic.macAddress))
   }

   /**
    * [should_updateNicFromVm]
    * [ItVmNicService.updateFromVm]에 대한 단위테스트
    *
    * @see ItVmNicService.updateFromVm
    */
   @Test
   fun should_updateNicFromVm() {
       log.debug("should_updateFromVm ... ")
       val nicId = "4b2ee465-599e-423d-9ada-5ea298f7c0a4"

       val updateVmNic: NicVo = NicVo.builder {
           id { nicId }
           name { "nic3" }
           vnicProfileVo { IdentifiedVo.builder { id { "483053ac-bac5-48d8-8927-12f96f3d1c2b" } } }
           interface_ { NicInterface.VIRTIO  }
           linked { false }
           plugged { false }
       }

       val updateResult: NicVo? =
           service.updateFromVm(vmId, updateVmNic)

       assertThat(updateResult?.id, `is`(not(nullValue())))
       assertThat(updateResult?.vnicProfileVo?.id, `is`(updateVmNic.vnicProfileVo.id))
       assertThat(updateResult?.interface_, `is`(updateVmNic.interface_))
       assertThat(updateResult?.linked, `is`(updateVmNic.linked))
       assertThat(updateResult?.plugged, `is`(updateVmNic.plugged))
   }

   /**
    * [should_removeNicFromVm]
    * [ItVmNicService.removeFromVm]에 대한 단위테스트
    *
    * @see ItVmNicService.removeFromVm
    */
   @Test
   fun should_removeNicFromVm() {
       log.debug("should_removeNicFromVm ... ")
       val nicId = "4b2ee465-599e-423d-9ada-5ea298f7c0a4"
       val removeResult: Boolean =
           service.removeFromVm(vmId, nicId)

       assertThat(removeResult, `is`(true))
   }

   companion object {
       private val log by LoggerDelegate()
   }
}
