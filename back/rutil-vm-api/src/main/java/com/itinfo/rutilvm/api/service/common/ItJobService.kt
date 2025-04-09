package com.itinfo.rutilvm.api.service.common

import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.model.common.JobVo
import com.itinfo.rutilvm.api.model.common.toJobVo
import com.itinfo.rutilvm.api.model.common.toJobVos
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern
import com.itinfo.rutilvm.util.ovirt.findAllJobs
import com.itinfo.rutilvm.util.ovirt.findJob
import org.ovirt.engine.sdk4.types.Job
import org.springframework.stereotype.Service

interface ItJobService {
	/**
	 * [ItJobService.findAll]
	 * 작업 목록
	 *
	 * @return List<[JobVo]> 작업 목록
	 */
	@Throws(Error::class)
	fun findAll(): List<JobVo>
	/**
	 * [ItJobService.findOne]
	 * 작업 상세
	 *
	 * @param jobId [String]
	 *
	 * @return [JobVo] 작업
	 */
	@Throws(Error::class)
	fun findOne(jobId: String): JobVo
}

@Service
class JobServiceImpl(

) : BaseService(), ItJobService {
	@Throws(Error::class)
	override fun findAll(): List<JobVo> {
		log.info("findAll ...")
		val res: List<Job> = conn.findAllJobs(follow="steps").getOrDefault(listOf())
		return res.toJobVos()
	}

	@Throws(Error::class)
	override fun findOne(jobId: String): JobVo {
		log.info("findOne ... jobId: {}", jobId)
		val res: Job = conn.findJob(jobId).getOrNull() ?: throw ErrorPattern.JOB_NOT_FOUND.toException()
		return res.toJobVo()
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
