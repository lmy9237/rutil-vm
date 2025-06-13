package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.ovirt.business.AuditLogSeverity
import com.itinfo.rutilvm.api.repository.engine.entity.AuditLogEntity
import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.common.toUUID
import org.springframework.data.jpa.domain.Specification
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor // For complex queries
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.io.Serializable
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

data class AuditLogSpecificationParam(
	val minSeverity: String? = null,
	val datacenterId: String? = null,
	val clusterId: String? = null,
	val hostId: String? = null,
	val vmId: String? = null,
	val templateId: String? = null,
	val storageDomainId: String? = null,
	val startDate: LocalDateTime? = null,
): Serializable {
	val minSeverityCode: Int
		get() = AuditLogSeverity.forCode(minSeverity).value

	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bMinSeverity: String? = null;fun minSeverity(block: () -> String?) { bMinSeverity = block() }
		private var bDatacenterId: String? = null;fun datacenterId(block: () -> String?) { bDatacenterId = block() }
		private var bClusterId: String? = null;fun clusterId(block: () -> String?) { bClusterId = block() }
		private var bHostId: String? = null;fun hostId(block: () -> String?) { bHostId = block() }
		private var bVmId: String? = null;fun vmId(block: () -> String?) { bVmId = block() }
		private var bTemplateId: String? = null;fun templateId(block: () -> String?) { bTemplateId = block() }
		private var bStorageDomainId: String? = null;fun storageDomainId(block: () -> String?) { bStorageDomainId = block() }
		private var bStartDate: LocalDateTime? = null;fun startDate(block: () -> LocalDateTime?) { bStartDate = block() }

		fun build(): AuditLogSpecificationParam = AuditLogSpecificationParam(bMinSeverity, bDatacenterId, bClusterId, bHostId, bVmId, bTemplateId, bStorageDomainId, bStartDate)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): AuditLogSpecificationParam = Builder().apply(block).build()
	}
}

object AuditLogSpecification {
	fun build(
		param: AuditLogSpecificationParam
	): Specification<AuditLogEntity> = build(
		param.minSeverityCode,
		param.datacenterId,
		param.clusterId,
		param.hostId,
		param.vmId,
		param.templateId,
		param.storageDomainId,
		param.startDate
	)
	// A builder function that combines all individual specifications.
	fun build(
		minSeverity: Int?,
		datacenterId: String?,
		clusterId: String?,
		hostId: String?,
		vmId: String?,
		templateId: String?,
		storageDomainId: String?,
		startDate: LocalDateTime?,
		/*vmName: String?,
		vmId: UUID? ,
		logTypeName: String?,
		messageContains: String?,
		endDate: LocalDateTime?*/
	): Specification<AuditLogEntity> =
		Specification.where(severityGreaterThanEqualTo(minSeverity))
			.and(hasDatacenterId(datacenterId))
			.and(hasClusterId(clusterId))
			.and(hasHostId(hostId))
			.and(hasVmId(vmId))
			.and(hasTemplateId(templateId))
			.and(hasStorageDomainId(storageDomainId))
			.and(logTimeAfter(startDate))
			/*.and(hasVmName(vmName))
			.and(hasLogTypeName(logTypeName))
			.and(messageContains(messageContains))
			.and(logTimeBefore(endDate))*/

	private fun severityGreaterThanEqualTo(minSeverity: Int?): Specification<AuditLogEntity>? {
		return minSeverity?.let {
			Specification { root, _, cb ->
				cb.greaterThanOrEqualTo(root.get("severityValue"), it)
			}
		}
	}

	private fun hasDatacenterId(datacenterId: String?): Specification<AuditLogEntity>? =
		datacenterId?.let {
			Specification { root, _, cb ->
				cb.equal(root.get<UUID>("storagePoolId"), it.toUUID())
			}
		}

	private fun hasClusterId(clusterId: String?): Specification<AuditLogEntity>? =
		clusterId?.let {
			Specification { root, _, cb ->
				cb.equal(root.get<UUID>("clusterId"), it.toUUID())
			}
		}

	private fun hasHostId(hostId: String?): Specification<AuditLogEntity>? =
		hostId?.let {
			Specification { root, _, cb ->
				cb.equal(root.get<UUID>("vdsId"), it.toUUID())
			}
		}

	private fun hasVmId(vmId: String?): Specification<AuditLogEntity>? {
		return vmId?.let {
			Specification { root, _, cb ->
				cb.equal(root.get<UUID>("vmId"), it.toUUID())
			}
		}
	}

	private fun hasTemplateId(templateId: String?): Specification<AuditLogEntity>? {
		return templateId?.let {
			Specification { root, _, cb ->
				cb.equal(root.get<UUID>("vmTemplateId"), it.toUUID())
			}
		}
	}

	private fun hasStorageDomainId(storageDomainId: String?): Specification<AuditLogEntity>? {
		return storageDomainId?.let {
			Specification { root, _, cb ->
				cb.equal(root.get<UUID>("storageDomainId"), it.toUUID())
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
