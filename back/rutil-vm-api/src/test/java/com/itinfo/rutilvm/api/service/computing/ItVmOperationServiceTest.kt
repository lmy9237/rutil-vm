package com.itinfo.rutilvm.api.service.computing

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.model.computing.UltimateConsoleVo
import com.itinfo.rutilvm.api.model.computing.VmExportVo
import org.hamcrest.MatcherAssert.assertThat
import org.hamcrest.Matchers.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
class ItVmOperationServiceTest {
   @Autowired private lateinit var service: ItVmOperationService

   private lateinit var dataCenterId: String
   private lateinit var clusterId: String // Default
   private lateinit var networkId: String // ovirtmgmt(dc: Default)
   private lateinit var host02: String // host02.ititinfo.local
   private lateinit var host01: String // host01
   private lateinit var hostVm: String // hostVm
   private lateinit var apm: String // hostVm

   @BeforeEach
   fun setup() {
       dataCenterId = "023b0a26-3819-11ef-8d02-00163e6c8feb"
       clusterId = "023c79d8-3819-11ef-bf08-00163e6c8feb"
       networkId = "00000000-0000-0000-0000-000000000009"
       host01 = "671e18b2-964d-4cc6-9645-08690c94d249"
       host02 = "0d7ba24e-452f-47fe-a006-f4702aa9b37f"
       hostVm = "c2ae1da5-ce4f-46df-b337-7c471bea1d8d"
       apm = "fceb0fe4-2927-4340-a970-401fe55781e6"
   }


   /**
    * [should_startVm]
    * [ItVmOperationService.start]에 대한 단위테스트
    *
    * @see ItVmOperationService.start
    */
   @Test
   fun should_startVm() {
       log.debug("should_start_Vm ... ")
       val result: Boolean =
           service.start("cc15993e-41cf-464f-94c4-9da562c7b0d1")

       assertThat(result, `is`(not(nullValue())))
       assertThat(result, `is`(true))
   }

   /**
    * [should_pause_Vm]
    * [ItVmOperationService.pause]에 대한 단위테스트
    *
    * @see ItVmOperationService.pause
    */
   @Test
   fun should_pause_Vm() {
       log.debug("should_pause_Vm ... ")
       val result: Boolean =
           service.pause("cc15993e-41cf-464f-94c4-9da562c7b0d1")

       assertThat(result, `is`(not(nullValue())))
       assertThat(result, `is`(true))
   }

   /**
    * [should_powerOff_Vm]
    * [ItVmOperationService.powerOff]에 대한 단위테스트
    *
    * @see ItVmOperationService.powerOff
    */
   @Test
   fun should_powerOff_Vm() {
       log.debug("should_powerOff_Vm ... ")
       val result: Boolean =
           service.powerOff("cc15993e-41cf-464f-94c4-9da562c7b0d1")

       assertThat(result, `is`(not(nullValue())))
       assertThat(result, `is`(true))
   }

   /**
    * [should_shutdown_Vm]
    * [ItVmOperationService.shutdown]에 대한 단위테스트
    *
    * @see ItVmOperationService.shutdown
    */
   @Test
   fun should_shutdown_Vm() {
       log.debug("should_shutdown_Vm ... ")
       val result: Boolean =
           service.shutdown(apm)

       assertThat(result, `is`(not(nullValue())))
       assertThat(result, `is`(true))
   }

   /**
    * [should_reboot_Vm]
    * [ItVmOperationService.reboot]에 대한 단위테스트
    *
    * @see ItVmOperationService.reboot
    */
   @Test
   fun should_reboot_Vm() {
       log.debug("should_reboot_Vm ... ")
       val result: Boolean =
           service.reboot(apm)

       assertThat(result, `is`(not(nullValue())))
       assertThat(result, `is`(true))
   }

   /**
    * [should_reset_Vm]
    * [ItVmOperationService.reset]에 대한 단위테스트
    *
    * @see ItVmOperationService.reset
    */
   @Test
   fun should_reset_Vm() {
       log.debug("should_reset_Vm ... ")
       val result: Boolean =
           service.reset(apm)

       assertThat(result, `is`(not(nullValue())))
       assertThat(result, `is`(true))
   }

   /**
    * [should_migrateHostList]
    * [ItVmOperationService.migrateHostList]에 대한 단위테스트
    *
    * @see ItVmOperationService.migrateHostList
    */
   @Test
   fun should_migrateHostList() {
       log.debug("should_migrateHostList ... ")
       val result: List<IdentifiedVo> =
           service.migrateHostList(apm)

       assertThat(result, `is`(not(nullValue())))
       result.forEach { println(it) }
   }

   /**
    * [should_migrateVm]
    * [ItVmOperationService.migrate]에 대한 단위테스트
    *
    * @see ItVmOperationService.migrate
    */
   @Test
   fun should_migrateVm() {
       log.debug("should_migrate_Vm ... ")
       val result: Boolean =
           service.migrate(apm, host02)

       assertThat(result, `is`(not(nullValue())))
       assertThat(result, `is`(true))
   }

   /**
    * [should_exportOvaVm]
    * [ItVmOperationService.exportOva]에 대한 단위테스트
    *
    * @see ItVmOperationService.exportOva
    */
   // TODO 테스트를 하려면 설치되는 host에 cmd로 접속하여 지정 디렉토리에 파일이 있는지 확인해야함
   //  => 파일확인은 불가능
   @Test
   fun should_exportOvaVm() {
       log.debug("should_exportOvaVm ... ")
       val exportVo: VmExportVo = VmExportVo.builder {
           vmVo { IdentifiedVo.builder { id { apm } } }
           hostVo { IdentifiedVo.builder { name { "host02.ititinfo.local" } } }
           directory { "/root" }
           fileName { "exporth2" }
       }
       val result: Boolean =
           service.exportOva(apm, exportVo)

       assertThat(result, `is`(not(nullValue())))
       assertThat(result, `is`(true))
   }

   /**
    * [should_findConsole]
    * [ItVmOperationService.console]에 대한 단위테스트
    *
    * @see ItVmOperationService.console
    */
   @Test
   fun should_findConsole() {
       log.debug("should_findConsole ... ")
       val result: UltimateConsoleVo? =
           service.console("9181fa0b-d031-4dbd-a031-6de2e2913eb6")

       assertThat(result, `is`(not(nullValue())))
       print(result)
   }



   companion object {
       private val log by LoggerDelegate()
   }
}
