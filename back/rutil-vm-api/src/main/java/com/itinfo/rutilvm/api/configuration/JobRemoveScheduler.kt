package com.itinfo.rutilvm.api.configuration

import com.itinfo.rutilvm.api.repository.engine.JobsRepository
import com.itinfo.rutilvm.api.repository.engine.entity.JobEntity
import com.itinfo.rutilvm.common.LoggerDelegate
import org.postgresql.util.PSQLException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

/**
 * [JobRemoveScheduler]
 * oVirt 최근작업 제거처리 스케쥴러
 *
 * @since 2025-07-10
 * @author 이찬희 (@chanhi2000)
 */
@Component
class JobRemoveScheduler {
	@Autowired private lateinit var rJobs: JobsRepository

	@Scheduled(fixedDelay = 5 * 60 * 1000) // 5분 단위
	@Throws(PSQLException::class, Error::class)
	@Transactional("engineTransactionManager")
	open fun removeJobsInSchedule(): Boolean {
		log.info("removeJobsInSchedule ... RUNNING!")
		val jobs2RemoveFound: List<JobEntity> =
			rJobs.findAllByActionType(JobEntity.Companion.ACTION_TYPE_EXCLUDE).toList()
		log.debug("removeJobsInSchedule ... jobs2RemoveFound: {}", jobs2RemoveFound.size)
		if (jobs2RemoveFound.isEmpty()) {
			log.info("removeJobsInSchedule ... NO job found. Abort RUNNING!")
			return true
		}
		try {
			val res: Int = rJobs.removeByIds(jobs2RemoveFound.mapNotNull { it.jobId })
			log.info("removeJobsInSchedule ... SUCCESS: ${jobs2RemoveFound.size}")
			return res == jobs2RemoveFound.size
		} catch (e: IllegalArgumentException) {
			e.printStackTrace()
			log.error("removeJobsInSchedule ... FAILED: ${jobs2RemoveFound.size}")
			return false
		}
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
