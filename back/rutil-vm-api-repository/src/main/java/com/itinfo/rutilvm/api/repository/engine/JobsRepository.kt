package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.JobEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface JobsRepository : JpaRepository<JobEntity, UUID> {
	@Query("""
SELECT j FROM JobEntity j
LEFT JOIN FETCH j.steps AS s
WHERE 1=1
AND j.actionType = :actionType
""")
	fun findAllByActionType(actionType: String): Collection<JobEntity>
	@Query("""
SELECT j FROM JobEntity j
LEFT JOIN FETCH j.steps AS s
WHERE 1=1
AND j.jobId = :jobId
""")
	fun findByJobId(jobId: UUID?): JobEntity?
	@Modifying
	@Query("""
DELETE FROM JobEntity j WHERE 1=1
AND j.jobId IN :jobIds
	""")
	fun removeByIds(
		@Param("jobIds") jobIds: Collection<UUID>
	): Int
}
