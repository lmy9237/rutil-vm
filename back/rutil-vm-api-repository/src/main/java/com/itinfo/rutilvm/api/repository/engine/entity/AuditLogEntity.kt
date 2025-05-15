package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.common.gson

import org.hibernate.annotations.Type
import org.slf4j.LoggerFactory
import java.io.Serializable
import java.time.LocalDateTime
import java.util.UUID
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table

private val log = LoggerFactory.getLogger(AuditLogEntity::class.java)

/**
 * [AuditLogEntity]
 *
 * @property auditLogId [Int]
 * @property userId [UUID]
 * @property userName [String]
 * @property vmId [UUID]
 * @property vmName [String]
 * @property vmTemplateId [UUID]
 * @property vmTemplateName [String]
 * @property vdsId [UUID]
 * @property vdsName [String]
 * @property logTime [LocalDateTime]
 * @property logTypeName [String]
 * @property logType [Int]
 * @property severity [Int]
 * @property message [String]
 * @property processed [Boolean]
 * @property storagePoolId [UUID]
 * @property storagePoolName [String]
 * @property storageDomainId [UUID]
 * @property storageDomainName [String]
 * @property clusterId [UUID]
 * @property clusterName [String]
 * @property correlationId [String]
 * @property jobId [UUID]
 * @property quotaId [UUID]
 * @property quotaName [String]
 * @property glusterVolumeId [UUID]
 * @property glusterVolumeName [String]
 * @property origin [String]
 * @property customEventId [Int]
 * @property eventFloodInSec [Int]
 * @property customData [String]
 * @property deleted [Boolean]
 * @property callStack [String]
 * @property brickId [UUID]
 * @property brickPath [String]
 * @property customId [String]
 */
@Entity
@Table(name="audit_log", schema = "public")
class AuditLogEntity(
	@Id
	@Column(unique = true, nullable = true)
	val auditLogId: Long = 0L,
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val userId: UUID? = null,
	val userName: String = "",
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val vmId: UUID? = null,
	val vmName: String = "",
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val vmTemplateId: UUID? = null,
	val vmTemplateName: String = "",
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val vdsId: UUID? = null,
	val vdsName: String = "",
	val logTime: LocalDateTime? = null,
	val logTypeName: String = "",
	val logType: Int = 0,
	val severity: Int = 0,
	val message: String = "",
	val processed: Boolean = false,
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val storagePoolId: UUID? = null,
	val storagePoolName: String = "",
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val storageDomainId: UUID? = null,
	val storageDomainName: String = "",
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val clusterId: UUID? = null,
	val clusterName: String = "",
	val correlationId: String = "",
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val jobId: UUID? = null,
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val quotaId: UUID? = null,
	val quotaName: String = "",
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val glusterVolumeId: UUID? = null,
	val glusterVolumeName: String = "",
	val origin: String = DEFAULT_ORIGIN,
	val customEventId: Int = -1,
	val eventFloodInSec: Int = 30,
	val customData: String = "",
	val deleted: Boolean = false,
	val callStack: String = "",
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val brickId: UUID? = null,
	val brickPath: String = "",
	val customId: String = "",
): Serializable {
	override fun toString(): String = gson.toJson(this)

	class Builder {
		private var bAuditLogId: Long = 0L;fun auditLogId(block: () ->  Long?) { bAuditLogId = block() ?: 0L }
		private var bUserId: UUID? = null;fun userId(block: () ->  UUID?) { bUserId = block() }
		private var bUserName: String = "";fun userName(block: () ->  String?) { bUserName = block() ?: "" }
		private var bVmId: UUID? = null;fun vmId(block: () ->  UUID?) { bVmId = block() }
		private var bVmName: String = "";fun vmName(block: () ->  String?) { bVmName = block() ?: "" }
		private var bVmTemplateId: UUID? = null;fun vmTemplateId(block: () ->  UUID?) { bVmTemplateId = block() }
		private var bVmTemplateName: String = "";fun vmTemplateName(block: () ->  String?) { bVmTemplateName = block() ?: "" }
		private var bVdsId: UUID? = null;fun vdsId(block: () ->  UUID?) { bVdsId = block() }
		private var bVdsName: String = "";fun vdsName(block: () ->  String?) { bVdsName = block() ?: "" }
		private var bLogTime: LocalDateTime? = null;fun logTime(block: () ->  LocalDateTime?) { bLogTime = block() }
		private var bLogTypeName: String = "";fun logTypeName(block: () ->  String?) { bLogTypeName = block() ?: "" }
		private var bLogType: Int = 0;fun logType(block: () ->  Int?) { bLogType = block() ?: 0 }
		private var bSeverity: Int = 0;fun severity(block: () ->  Int?) { bSeverity = block() ?: 0 }
		private var bMessage: String = "";fun message(block: () ->  String?) { bMessage = block() ?: "" }
		private var bProcessed: Boolean = false;fun processed(block: () ->  Boolean?) { bProcessed = block() ?: false }
		private var bStoragePoolId: UUID? = null;fun storagePoolId(block: () ->  UUID?) { bStoragePoolId = block() }
		private var bStoragePoolName: String = "";fun storagePoolName(block: () ->  String?) { bStoragePoolName = block() ?: "" }
		private var bStorageDomainId: UUID? = null;fun storageDomainId(block: () ->  UUID?) { bStorageDomainId = block() }
		private var bStorageDomainName: String = "";fun storageDomainName(block: () ->  String?) { bStorageDomainName = block() ?: "" }
		private var bClusterId: UUID? = null;fun clusterId(block: () ->  UUID?) { bClusterId = block() }
		private var bClusterName: String = "";fun clusterName(block: () ->  String?) { bClusterName = block() ?: "" }
		private var bCorrelationId: String = "";fun correlationId(block: () ->  String?) { bCorrelationId = block() ?: "" }
		private var bJobId: UUID? = null;fun jobId(block: () ->  UUID?) { bJobId = block() }
		private var bQuotaId: UUID? = null;fun quotaId(block: () ->  UUID?) { bQuotaId = block() }
		private var bQuotaName: String = "";fun quotaName(block: () ->  String?) { bQuotaName = block() ?: "" }
		private var bGlusterVolumeId: UUID? = null;fun glusterVolumeId(block: () ->  UUID?) { bGlusterVolumeId = block() }
		private var bGlusterVolumeName: String = "";fun glusterVolumeName(block: () ->  String?) { bGlusterVolumeName = block() ?: "" }
		private var bOrigin: String = DEFAULT_ORIGIN;fun origin(block: () ->  String?) { bOrigin = block() ?: DEFAULT_ORIGIN }
		private var bCustomEventId: Int = -1;fun customEventId(block: () ->  Int?) { bCustomEventId = block() ?: -1 }
		private var bEventFloodInSec: Int = 30;fun eventFloodInSec(block: () ->  Int?) { bEventFloodInSec = block() ?: 30 }
		private var bCustomData: String = "";fun customData(block: () ->  String?) { bCustomData = block() ?: "" }
		private var bDeleted: Boolean = false;fun deleted(block: () ->  Boolean?) { bDeleted = block() ?: false }
		private var bCallStack: String = "";fun callStack(block: () ->  String?) { bCallStack = block() ?: "" }
		private var bBrickId: UUID? = null;fun brickId(block: () ->  UUID?) { bBrickId = block() }
		private var bBrickPath: String = "";fun brickPath(block: () ->  String?) { bBrickPath = block() ?: "" }
		private var bCustomId: String = "";fun customId(block: () ->  String?) { bCustomId = block() ?: "" }
		fun build(): AuditLogEntity = AuditLogEntity(bAuditLogId, bUserId, bUserName, bVmId, bVmName, bVmTemplateId, bVmTemplateName, bVdsId, bVdsName, bLogTime, bLogTypeName, bLogType, bSeverity, bMessage, bProcessed, bStoragePoolId, bStoragePoolName, bStorageDomainId, bStorageDomainName, bClusterId, bClusterName, bCorrelationId, bJobId, bQuotaId, bQuotaName, bGlusterVolumeId, bGlusterVolumeName, bOrigin, bCustomEventId, bEventFloodInSec, bCustomData, bDeleted, bCallStack, bBrickId, bBrickPath, bCustomId)
	}

	companion object {
		const val DEFAULT_ORIGIN = "oVirt"
		inline fun builder(block: Builder.() -> Unit): AuditLogEntity = Builder().apply(block).build()
	}
}
