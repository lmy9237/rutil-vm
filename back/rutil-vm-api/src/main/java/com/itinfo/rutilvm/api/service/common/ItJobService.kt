package com.itinfo.rutilvm.api.service.common

import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.model.common.JobVo
import com.itinfo.rutilvm.api.model.common.toJob
import com.itinfo.rutilvm.api.model.common.toJobVo
import com.itinfo.rutilvm.api.model.common.toJobVos
import com.itinfo.rutilvm.api.repository.engine.JobsRepository
import com.itinfo.rutilvm.common.toUUID
import com.itinfo.rutilvm.util.ovirt.addJob
import com.itinfo.rutilvm.util.ovirt.endJob
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern
import com.itinfo.rutilvm.util.ovirt.findAllJobs
import com.itinfo.rutilvm.util.ovirt.findJob
import org.ovirt.engine.sdk4.types.Job
import org.postgresql.util.PSQLException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

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

	/**
	 * [ItJobService.add]
	 * (외부) 작업 생성
	 *
	 * @param job [JobVo]
	 * @return [JobVo]?
	 */
	@Throws(Error::class)
	fun add(job: JobVo): JobVo?
	/**
	 * [ItJobService.add]
	 * (외부) 작업 생성
	 *
	 * @param job [JobVo]
	 * @return [JobVo]?
	@Throws(Error::class)
	fun update(job: JobVo): JobVo
	 */
	/**
	 * [ItJobService.end]
	 * 작업 종료
	 *
	 * @param jobId [String]
	 * @return [Boolean]
	 */
	@Throws(Error::class)
	fun end(jobId: String): Boolean?

	/**
	 * [ItJobService.remove]
	 * 작업 제거
	 *
	 * @param jobId [String]
	 * @return [Boolean]
	 */
	@Throws(PSQLException::class, Error::class)
	fun remove(jobId: String): Boolean?
	/**
	 * [ItJobService.removeMany]
	 * 작업 일괄제거
	 *
	 * @param jobIds Collection<[String]>
	 * @return [Boolean]
	 */
	@Throws(PSQLException::class, Error::class)
	fun removeMany(jobIds: Collection<String>): Boolean?
}

@Service
class JobServiceImpl(

) : BaseService(), ItJobService {
	@Autowired private lateinit var rJobs: JobsRepository

	@Throws(Error::class)
	override fun findAll(): List<JobVo> {
		log.info("findAll ...")
		val res: List<Job> = conn.findAllJobs(follow = "steps").getOrDefault(listOf())
		return res.toJobVos()
	}

	@Throws(Error::class)
	override fun findOne(jobId: String): JobVo {
		log.info("findOne ... jobId: {}", jobId)
		val res: Job = conn.findJob(jobId).getOrNull() ?: throw ErrorPattern.JOB_NOT_FOUND.toException()
		return res.toJobVo()
	}

	override fun add(job: JobVo): JobVo? {
		log.info("add ... job: {}", job)
		val job2Add: Job = job.toJob()
		val res: Job? = conn.addJob(job2Add).getOrNull()
		return res?.toJobVo()
	}

	override fun end(jobId: String): Boolean? {
		log.info("end ... jobId: {}", jobId)
		val res: Boolean? = conn.endJob(jobId).getOrNull()
		return res
	}

	@Throws(PSQLException::class, Error::class)
	@Transactional("engineTransactionManager")
	override fun remove(jobId: String): Boolean? {
		log.info("remove ... jobId: {}", jobId)
		val res: Boolean? = try {
			rJobs.deleteById(jobId.toUUID())
			true
		} catch (e: IllegalArgumentException) {
			log.error("something went WRONG in remove ... reason: {}", e.localizedMessage)
			false
		}
		return res
	}

	@Throws(PSQLException::class, Error::class)
	@Transactional("engineTransactionManager")
	override fun removeMany(jobIds: Collection<String>): Boolean? {
		log.info("removeMultiple ... jobIds: {}", jobIds)
		val res: Boolean? = try {
			rJobs.deleteByIds(jobIds.map { it.toUUID() })
			true
		} catch (e: IllegalArgumentException) {
			log.error("something went WRONG in removeMultiple ... reason: {}", e.localizedMessage)
			false
		}
		return res
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
