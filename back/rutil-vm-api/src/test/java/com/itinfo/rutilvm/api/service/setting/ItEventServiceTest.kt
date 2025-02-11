package com.itinfo.rutilvm.api.service.setting

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.model.computing.EventVo
import org.hamcrest.MatcherAssert.assertThat
import org.hamcrest.Matchers.*
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

/**
* [ItEventServiceTest]
* [ItEventService]에 대한 단위테스트
*
* @author chanhi2000
* @author deh22
* @since 2024.09.26
*/
@SpringBootTest
class ItEventServiceTest {
   @Autowired private lateinit var service: ItEventService

   /**
    * [should_findAll]
    * [ItEventService.findAll]에 대한 단위테스트
    *
    * @see ItEventService.findAll
    */
   @Test
   fun should_findAll() {
       log.debug("should_findAll ... ")
       val result: List<EventVo> =
           service.findAll()

       assertThat(result, `is`(not(nullValue())))
       assertThat(result.size, `is`(1000))
   }


   companion object {
       private val log by LoggerDelegate()
   }

}
