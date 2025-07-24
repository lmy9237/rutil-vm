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

	val jobs2RemoveVmScreenshot: List<JobEntity>
		get() = rJobs.findAllByActionType(JobEntity.Companion.ACTION_TYPE_EXCLUDE).toList()
	val jobs2RemoveRutilVmRelated: List<JobEntity>
		get() = rJobs.findAllByActionTypeAndDescriptionLike(JobEntity.Companion.ACTION_TYPE_EXTERNAL, "Not Found").toList()

	@Scheduled(fixedDelay = 5 * 60 * 1000) // 5분 단위
	@Throws(PSQLException::class, Error::class)
	@Transactional("engineTransactionManager")
	open fun removeJobsInSchedule(): Boolean {
		log.info("removeJobsInSchedule ... RUNNING!")
		val allJobs2Remove: List<JobEntity> = jobs2RemoveVmScreenshot + jobs2RemoveRutilVmRelated
		log.debug("removeJobsInSchedule ... allJobs2Remove: {}", allJobs2Remove.size)
		if (allJobs2Remove.isEmpty()) {
			log.info("removeJobsInSchedule ... NO job found. Abort RUNNING!")
			return true
		}
		try {
			val res: Int = rJobs.removeByIds(allJobs2Remove.mapNotNull { it.jobId })
			log.info("removeJobsInSchedule ... SUCCESS: ${allJobs2Remove.size}")
			return res == allJobs2Remove.size
		} catch (e: IllegalArgumentException) {
			e.printStackTrace()
			log.error("removeJobsInSchedule ... FAILED: ${allJobs2Remove.size}")
			return false
		}
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
