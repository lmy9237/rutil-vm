package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.AuditLogEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor // For complex queries
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.time.LocalDateTime
import java.util.UUID

@Repository
interface AuditLogRepository : JpaRepository<AuditLogEntity, Long>, JpaSpecificationExecutor<AuditLogEntity> {
	// Custom query methods can be added here, e.g.:
	fun findByLogTimeBetween(startTime: LocalDateTime, endTime: LocalDateTime): List<AuditLogEntity>
	fun findByVmId(vmId: UUID): List<AuditLogEntity>
	fun findByLogTypeNameAndVmName(logTypeName: String, vmName: String): List<AuditLogEntity>
	fun findTop10ByOrderByLogTimeDesc(): List<AuditLogEntity>

	@Modifying
	@Query("""
DELETE FROM AuditLogEntity ale WHERE 1=1
AND ale.auditLogId IN :eventIds
""")
	fun deleteEventsByIds(
		@Param("eventIds") eventIds: List<Long>
	): Int // Returns the number of deleted entities
}
