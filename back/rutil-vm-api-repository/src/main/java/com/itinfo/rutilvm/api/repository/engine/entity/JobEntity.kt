package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.common.gson
import org.hibernate.annotations.Type
import org.hibernate.annotations.UpdateTimestamp
import org.slf4j.LoggerFactory
import java.time.LocalDateTime
import java.util.UUID
import java.io.Serializable
// Or jakarta.persistence.* for newer Spring Boot
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.Lob
import javax.persistence.OneToMany
import javax.persistence.Table

private val log = LoggerFactory.getLogger(JobEntity::class.java)

/**
 * [JobEntity]
 * 작업 정보
 *
 * @property jobId [UUID]
 * @property actionType [String]
 * @property description [String]
 * @property status [String]
 * @property ownerId [UUID]
 * @property visible [Boolean]
 * @property startTime [LocalDateTime]
 * @property endTime [LocalDateTime]
 * @property lastUpdateTime [LocalDateTime]
 * @property correlationId [String]
 * @property isExternal [Boolean]
 * @property isAutoCleared [Boolean]
 * @property engineSessionSeqId [Int]
 */
@Entity
@Table(name="job", schema = "public")
class JobEntity(
	@Id
	@Column(name="job_id", unique = true, nullable = true)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val jobId: UUID? = null,
	val actionType: String? = "",
	@Lob
	@Type(type="org.hibernate.type.TextType")
	val description: String? = "",
	val status: String? = "",
	@Column(name="owner_id", unique = true, nullable = true)
	@Type(type="org.hibernate.type.PostgresUUIDType")
	val ownerId: UUID? = null,
	val visible: Boolean? = true,
	val startTime: LocalDateTime? = null,
	val endTime: LocalDateTime? = null,
	@UpdateTimestamp
	val lastUpdateTime: LocalDateTime? = null,
	val correlationId: String? = "",
	val isExternal: Boolean? = false,
	val isAutoCleared: Boolean? = true,
	val engineSessionSeqId: Int? = null,
	@OneToMany(fetch=FetchType.LAZY)
	@JoinColumn(
		name="job_id",
		referencedColumnName="job_id",
		insertable=false,
		updatable=false
	)
	val steps: MutableSet<StepEntity> = mutableSetOf(),
	/*
	@OneToMany(
		mappedBy="job",
		cascade=[CascadeType.ALL], // Corresponds to ON DELETE CASCADE
		orphanRemoval=true,
		fetch= FetchType.LAZY
	)
	val jobSubjects: MutableSet<JobSubjectEntity> = mutableSetOf()
	*/
): Serializable {
	// Helper methods for bidirectional relationship management
	fun addStep(step: StepEntity) {
		steps.add(step)
		step.job = this
	}

	fun removeStep(step: StepEntity) {
		steps.remove(step)
		step.job = null
	}

	/*
	fun addSubjectEntity(subjectEntity: JobSubjectEntity) {
		jobSubjects.add(subjectEntity)
		subjectEntity.job = this
	}

	fun removeSubjectEntity(subjectEntity: JobSubjectEntity) {
		jobSubjects.remove(subjectEntity)
		subjectEntity.job = null
	}
	*/

	override fun equals(other: Any?): Boolean {
		if (this === other) return true
		if (javaClass != other?.javaClass) return false
		other as JobEntity
		return jobId == other.jobId
	}

	override fun hashCode(): Int = jobId.hashCode()

	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bJobId: UUID? = null;fun jobId(block: () -> UUID?) { bJobId = block() }
		private var bActionType: String? = "";fun actionType(block: () -> String?) { bActionType = block() ?: "" }
		private var bDescription: String? = "";fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bStatus: String? = "";fun status(block: () -> String?) { bStatus = block() ?: "" }
		private var bOwnerId: UUID? = null;fun ownerId(block: () -> UUID?) { bOwnerId = block() }
		private var bVisible: Boolean? = true;fun visible(block: () -> Boolean?) { bVisible = block() ?: true }
		private var bStartTime: LocalDateTime? = null;fun startTime(block: () -> LocalDateTime?) { bStartTime = block() }
		private var bEndTime: LocalDateTime? = null;fun endTime(block: () -> LocalDateTime?) { bEndTime = block() }
		private var bLastUpdateTime: LocalDateTime? = null;fun lastUpdateTime(block: () -> LocalDateTime?) { bLastUpdateTime = block() }
		private var bCorrelationId: String? = "";fun correlationId(block: () -> String?) { bCorrelationId = block() ?: "" }
		private var bIsExternal: Boolean? = false;fun isExternal(block: () -> Boolean?) { bIsExternal = block() ?: false }
		private var bIsAutoCleared: Boolean? = true;fun isAutoCleared(block: () -> Boolean?) { bIsAutoCleared = block() ?: true }
		private var bEngineSessionSeqId: Int? = null;fun engineSessionSeqId(block: () -> Int?) { bEngineSessionSeqId = block() }
		fun build(): JobEntity = JobEntity(bJobId, bActionType, bDescription, bStatus, bOwnerId, bVisible, bStartTime, bEndTime, bLastUpdateTime, bCorrelationId, bIsExternal, bIsAutoCleared, bEngineSessionSeqId)
	}

	companion object {
		const val ACTION_TYPE_EXCLUDE = "ScreenshotVm"
		inline fun builder(block: Builder.() -> Unit): JobEntity = Builder().apply(block).build()
	}
}
