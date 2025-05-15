package com.itinfo.rutilvm.api.service.setting

import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.model.computing.EventVo
import com.itinfo.rutilvm.api.model.computing.toEventVos
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern
import com.itinfo.rutilvm.util.ovirt.findAllEvents
import com.itinfo.rutilvm.util.ovirt.removeEvent

import org.ovirt.engine.sdk4.types.Event
import org.ovirt.engine.sdk4.types.LogSeverity
import org.springframework.stereotype.Service

interface ItEventService {
    /**
     * [ItEventService.findAll]
     * 이벤트 목록
     *
     * @return List<[EventVo]> 이벤트 목록
     */
    @Throws(Error::class)
    fun findAll(severityThreshold: String?, pageNo: Int?, size: Int?): List<EventVo>
	/**
	 * [ItEventService.remove]
	 * 이벤트 제거
	 *
	 * @return List<[EventVo]> 이벤트 목록
	 */
	@Throws(Error::class)
	fun remove(eventIds2Remove: List<String>): Boolean
}
@Service
class EventServiceImpl (

): BaseService(), ItEventService {

    @Throws(Error::class)
    override fun findAll(
		severityThreshold: String?,
		pageNo: Int?,
		size: Int?
	): List<EventVo> {
		val max: Int = size ?: 1000
		var searchQuery = "${if (severityThreshold != null) "severity >= $severityThreshold " else ""}sortby time desc"
		if (pageNo != null) searchQuery += " page $pageNo"
		log.info("findAll ... max: {}, searchQuery: {}", max, searchQuery)
        val res: List<Event> =
			conn.findAllEvents(searchQuery = searchQuery, max = max.toString())
                .getOrDefault(listOf())
        return res.toEventVos()
    }

	@Throws(Error::class)
	override fun remove(eventIds2Remove: List<String>): Boolean {
		log.info("findAll ... eventIds2Remove.size: {}", eventIds2Remove.size)
		var res = false
		for (id in eventIds2Remove) {
			res = conn.removeEvent(id).getOrNull() ?: false
			if (!res) throw ErrorPattern.EVENT_VO_INVALID.toException() // TODO: 상세한 예외 필요
		}
		return res
	}

	companion object {
        private val log by LoggerDelegate()
    }
}
