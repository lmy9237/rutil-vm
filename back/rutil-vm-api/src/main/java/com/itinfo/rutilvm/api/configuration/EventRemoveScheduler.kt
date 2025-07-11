package com.itinfo.rutilvm.api.configuration

import com.itinfo.rutilvm.api.ovirt.business.AuditLogType
import com.itinfo.rutilvm.api.repository.engine.AuditLogRepository
import com.itinfo.rutilvm.api.repository.engine.entity.AuditLogEntity
import com.itinfo.rutilvm.common.LoggerDelegate
import org.postgresql.util.PSQLException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

/**
 * [EventRemoveScheduler]
 * oVirt 이벤트 제거처리 스케쥴러
 *
 * @since 2025-07-10
 * @author 이찬희 (@chanhi2000)
 */
@Component
class EventRemoveScheduler {
	@Autowired private lateinit var rAuditLogs: AuditLogRepository

	@Scheduled(fixedDelay = 5 * 60 * 1000) // 5분 단위
	@Throws(PSQLException::class, Error::class)
	@Transactional("engineTransactionManager")
	open fun removeEventsInSchedule(): Boolean {
		log.info("removeEventsInSchedule ... RUNNING!")
		val events2RemoveFound: List<AuditLogEntity> =
			rAuditLogs.findAllByLogTypes(AuditLogType.CODES_REMOVE_IN_SCHEDULE).toList()
		log.debug("removeJobsInSchedule ... events2RemoveFound: {}", events2RemoveFound.size)
		if (events2RemoveFound.isEmpty()) {
			log.info("removeJobsInSchedule ... NO job found. Abort RUNNING!")
			return true
		}
		try {
			val res: Int = rAuditLogs.removeAllByLogType(AuditLogType.CODES_REMOVE_IN_SCHEDULE)
			log.info("removeEventsInSchedule ... SUCCESS: ${events2RemoveFound.size}")
			return res == events2RemoveFound.size
		} catch (e: IllegalArgumentException) {
			e.printStackTrace()
			log.error("removeEventsInSchedule ... FAILED: ${events2RemoveFound.size}")
			return false
		}
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
