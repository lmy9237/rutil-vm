package com.itinfo.rutilvm.api.service.setting

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.model.computing.EventVo
import com.itinfo.rutilvm.api.model.computing.toEventVos
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.util.ovirt.findAllEvents

import org.ovirt.engine.sdk4.types.Event
import org.springframework.stereotype.Service

interface ItEventService {
    /**
     * [ItEventService.findAll]
     * 이벤트 목록
     *
     * @return List<[EventVo]> 이벤트 목록
     */
    @Throws(Error::class)
    fun findAll(): List<EventVo>
}
@Service
class EventServiceImpl (

): BaseService(), ItEventService {

    @Throws(Error::class)
    override fun findAll(): List<EventVo> {
        log.info("findAll ...")
        val res: List<Event> =
            conn.findAllEvents(max = "1000")
                .getOrDefault(listOf())
        return res.toEventVos()
    }


    companion object {
        private val log by LoggerDelegate()
    }
}