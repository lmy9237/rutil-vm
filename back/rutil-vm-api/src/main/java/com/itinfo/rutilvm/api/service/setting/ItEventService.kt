package com.itinfo.rutilvm.api.service.setting

import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.model.computing.EventVo
import com.itinfo.rutilvm.api.ovirt.business.AuditLogSeverity
import com.itinfo.rutilvm.api.repository.engine.AuditLogRepository
import com.itinfo.rutilvm.api.repository.engine.AuditLogSpecification
import com.itinfo.rutilvm.api.repository.engine.AuditLogSpecificationParam
import com.itinfo.rutilvm.api.repository.engine.entity.toEventVosPage
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.common.formatEnhancedFromLDT
import com.itinfo.rutilvm.common.rutilApiQueryDf
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern
import com.itinfo.rutilvm.util.ovirt.removeEvent

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service

import java.sql.SQLException
import java.time.LocalDateTime

interface ItEventService {
	/**
	 * [ItEventService.findAll]
	 * 이벤트 목록
	 *
	 * @param pageable [Pageable] 페이징 객체
	 * @param datacenterId [String] 데이터센터 ID
	 * @param clusterId [String] 클러스터 ID
	 * @param hostId [String] 호스트 ID
	 * @param vmId [String] 가상머신 ID
	 * @param templateId [String] 탬플릿 ID
	 * @param storageDomainId [String] 스토리지도메인 ID
	 * @param minSeverity [String] 심각도 값
	 * @param startDate [LocalDateTime] 검색범위 시작시간
	 *
	 * @return List<[EventVo]> 이벤트 목록
	 */
	@Throws(SQLException::class)
	fun findAll(
		pageable: Pageable,
		param: AuditLogSpecificationParam,
	): Page<EventVo>
	/**
	 * [ItEventService.remove]
	 * 이벤트 제거
	 *
	 * @return List<[EventVo]> 이벤트 목록
	 */
	@Throws(SQLException::class)
	fun remove(eventIds2Remove: List<String>): Boolean
}

@Service
class EventServiceImpl (

): BaseService(), ItEventService {
	@Autowired private lateinit var rAuditLog: AuditLogRepository

	@Throws(SQLException::class)
    override fun findAll(
		pageable: Pageable,
		param: AuditLogSpecificationParam,
	): Page<EventVo> {
		log.info(
			"findAll ... page: {}, size: {}, datacenterId: {}, clusterId: {}, hostId: {}, vmId: {}, templateId: {}, storageDomainId: {}, severity: {}, startDate: {}",
			pageable.pageNumber, pageable.pageSize,
			param.datacenterId, param.clusterId, param.hostId, param.vmId, param.templateId, param.storageDomainId,
			param.minSeverityCode, rutilApiQueryDf.formatEnhancedFromLDT(param.startDate)
		)
		val spec = AuditLogSpecification.build(param)
		val auditLogPage = rAuditLog.findAll(spec, pageable)
		return auditLogPage.toEventVosPage()
    }

	@Throws(SQLException::class)
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
