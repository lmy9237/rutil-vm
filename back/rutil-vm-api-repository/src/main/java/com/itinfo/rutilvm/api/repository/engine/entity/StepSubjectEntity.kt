package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.common.gson
import org.hibernate.annotations.Type
import org.slf4j.LoggerFactory
import java.time.LocalDateTime
import java.util.UUID
import java.io.Serializable
import java.math.BigInteger
// Or jakarta.persistence.* for newer Spring Boot
import javax.persistence.Column
import javax.persistence.Embeddable
import javax.persistence.EmbeddedId
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.JoinTable
import javax.persistence.ManyToMany
import javax.persistence.ManyToOne
import javax.persistence.MapsId
import javax.persistence.OneToMany
import javax.persistence.Table

private val log = LoggerFactory.getLogger(JobSubjectEntity::class.java)

@Embeddable
data class StepSubjectEntityId(
	@Column(name = "step_id", nullable = true)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	var stepId: UUID? = null,

	@Column(name = "entity_id", nullable = true)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	var entityId: UUID? = null,

	@Column(name = "entity_type", length = 32, nullable = false)
	var entityType: String? = null // Consider an Enum
) : Serializable {
}

@Entity
@Table(name = "step_subject_entity")
data class StepSubjectEntity(
	@EmbeddedId
	var id: StepSubjectEntityId = StepSubjectEntityId(),

	@ManyToOne(fetch = FetchType.LAZY)
	@MapsId("stepId") // Maps the 'stepId' attribute of StepSubjectEntityId
	@JoinColumn(name = "step_id", referencedColumnName = "step_id", nullable = false, insertable = false, updatable = false)
	var step: StepEntity? = null,

	// entity_id is part of the composite key, already mapped in StepSubjectEntityId
	@Column(name = "entity_id", nullable = false, insertable = false, updatable = false)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val entityId: UUID? = null, // Read-only from the ID

	// entity_type is part of the composite key, already mapped in StepSubjectEntityId
	@Column(name = "entity_type", length = 32, nullable = false, insertable = false, updatable = false)
	val entityType: String? = null, // Read-only from the ID. Consider an Enum here

	@Column(name = "step_entity_weight")
	var stepEntityWeight: Short? = null
) {
	// Constructor to easily create instances
	constructor(step: StepEntity, entityId: UUID, entityType: String, weight: Short? = null) : this(
		id = StepSubjectEntityId(step.stepId, entityId, entityType),
		step = step,
		entityId = entityId, // Set convenience property
		entityType = entityType, // Set convenience property
		stepEntityWeight = weight
	)

	override fun toString(): String =
		gson.toJson(this)

	override fun equals(other: Any?): Boolean {
		if (this === other) return true
		if (javaClass != other?.javaClass) return false
		other as StepSubjectEntity
		return id == other.id
	}

	override fun hashCode(): Int =
		id.hashCode()


}
