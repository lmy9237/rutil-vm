package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.AuditLogEntity
import org.springframework.data.jpa.domain.Specification
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
AND ale.auditLogId IN :auditLogIds
""")
	fun removeEventsByIds(
		@Param("auditLogIds") auditLogIds: List<Long>
	): Int // Returns the number of deleted entities
}


object AuditLogSpecification {

	// A builder function that combines all individual specifications.
	fun build(
		minSeverity: Int?,
		startDate: LocalDateTime?,
		/*vmName: String?,
		vmId: UUID? ,
		logTypeName: String?,
		messageContains: String?,
		endDate: LocalDateTime?*/
	): Specification<AuditLogEntity> {
		return Specification.where(severityGreaterThanEqualTo(minSeverity))
			.and(logTimeAfter(startDate))
			/*.and(hasVmName(vmName))
			.and(hasVmId(vmId))
			.and(hasLogTypeName(logTypeName))
			.and(messageContains(messageContains))
			.and(logTimeBefore(endDate))*/
	}

	private fun severityGreaterThanEqualTo(minSeverity: Int?): Specification<AuditLogEntity>? {
		return minSeverity?.let {
			Specification { root, _, cb ->
				cb.greaterThanOrEqualTo(root.get("severityValue"), it)
			}
		}
	}

	private fun hasVmName(vmName: String?): Specification<AuditLogEntity>? {
		return vmName?.let {
			// The 'root' is the entity (AuditLogEntity), 'cb' is the CriteriaBuilder
			Specification { root, _, cb ->
				cb.equal(root.get<String>("vmName"), it)
			}
		}
	}

	private fun hasVmId(vmId: UUID?): Specification<AuditLogEntity>? {
		return vmId?.let {
			Specification { root, _, cb ->
				cb.equal(root.get<UUID>("vmId"), it)
			}
		}
	}

	private fun hasLogTypeName(logTypeName: String?): Specification<AuditLogEntity>? {
		return logTypeName?.let {
			Specification { root, _, cb ->
				cb.equal(root.get<String>("logTypeName"), it)
			}
		}
	}

	private fun messageContains(text: String?): Specification<AuditLogEntity>? {
		return text?.let {
			Specification { root, _, cb ->
				// Using 'like' for partial matching, ignoring case
				cb.like(cb.lower(root.get("message")), "%${it.lowercase()}%")
			}
		}
	}

	private fun logTimeAfter(startDate: LocalDateTime?): Specification<AuditLogEntity>? {
		return startDate?.let {
			Specification { root, _, cb ->
				cb.greaterThanOrEqualTo(root.get("logTime"), it)
			}
		}
	}

	private fun logTimeBefore(endDate: LocalDateTime?): Specification<AuditLogEntity>? {
		return endDate?.let {
			Specification { root, _, cb ->
				cb.lessThanOrEqualTo(root.get("logTime"), it)
			}
		}
	}
}
