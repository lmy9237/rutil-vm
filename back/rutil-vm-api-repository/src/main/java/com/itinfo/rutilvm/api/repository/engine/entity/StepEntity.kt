package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.common.gson
import org.hibernate.annotations.Type
import org.hibernate.annotations.UpdateTimestamp
import org.slf4j.LoggerFactory
import java.time.LocalDateTime
import java.util.UUID
import java.io.Serializable
import java.math.BigInteger
import javax.persistence.CascadeType
// Or jakarta.persistence.* for newer Spring Boot
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.JoinTable
import javax.persistence.Lob
import javax.persistence.ManyToMany
import javax.persistence.ManyToOne
import javax.persistence.OneToMany
import javax.persistence.Table

private val log = LoggerFactory.getLogger(JobEntity::class.java)

@Entity
@Table(name = "step")
data class StepEntity(
	@Id
	@Column(name = "step_id", nullable = true)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	var stepId: UUID? = null,

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "job_id", nullable = false)
	var job: JobEntity? = null, // Will be set by Job's helper method or manually

	@Column(name = "step_type", length = 32, nullable = false)
	var stepType: String, // Consider an Enum

	@Lob
	@Type(type="org.hibernate.type.TextType")
	@Column(name = "description", nullable = false)
	var description: String,

	@Column(name = "step_number", nullable = false)
	var stepNumber: Int,

	@Column(name = "status", length = 32, nullable = false)
	var status: String, // Consider an Enum

	var startTime: LocalDateTime? = null,
	var endTime: LocalDateTime? = null,

	@Column(name = "correlation_id", length = 50, nullable = false)
	var correlationId: String,

	@Column(name = "external_id")
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	var externalId: UUID? = null,

	@Column(name = "external_system_type", length = 32)
	var externalSystemType: String? = null, // Consider an Enum

	@Column(name = "is_external", columnDefinition = "boolean default false")
	var isExternal: Boolean? = false,

	@Column(name = "progress")
	var progress: Short? = null,

	// Self-referencing relationship for parent step
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "parent_step_id")
	var parentStep: StepEntity? = null,

	@OneToMany(
		mappedBy="parentStep",
		cascade=[CascadeType.ALL],
		fetch = FetchType.LAZY
	)
	var childSteps: MutableSet<StepEntity> = mutableSetOf(),

	// Relationship to StepSubjectEntity
	@OneToMany(
		mappedBy="step",
		cascade=[CascadeType.ALL], // Corresponds to ON DELETE CASCADE
		orphanRemoval=true,
		fetch=FetchType.LAZY
	)
	var subjectEntities: MutableSet<StepSubjectEntity> = mutableSetOf()
) {
	// Helper methods for bidirectional relationship management
	fun addChildStep(child: StepEntity) {
		childSteps.add(child)
		child.parentStep = this
	}

	fun removeChildStep(child: StepEntity) {
		childSteps.remove(child)
		child.parentStep = null
	}

	fun addSubjectEntity(subjectEntity: StepSubjectEntity) {
		subjectEntities.add(subjectEntity)
		subjectEntity.step = this
	}

	fun removeSubjectEntity(subjectEntity: StepSubjectEntity) {
		subjectEntities.remove(subjectEntity)
		subjectEntity.step = null
	}

	override fun equals(other: Any?): Boolean {
		if (this === other) return true
		if (javaClass != other?.javaClass) return false
		other as StepEntity
		return stepId == other.stepId
	}

	override fun hashCode(): Int =
		stepId.hashCode()


	override fun toString(): String =
		gson.toJson(this)
}
