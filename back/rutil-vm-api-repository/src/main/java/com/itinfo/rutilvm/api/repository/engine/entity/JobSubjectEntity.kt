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
data class JobSubjectEntityId(
	@Column(name = "job_id", nullable = true)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	var jobId: UUID? = null, // Nullable for JPA no-arg constructor, but will be set

	@Column(name = "entity_id", nullable = true)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	var entityId: UUID? = null // Nullable for JPA no-arg constructor, but will be set
) : Serializable {
}

@Entity
@Table(name = "job_subject_entity")
data class JobSubjectEntity(
	@EmbeddedId
	var id: JobSubjectEntityId = JobSubjectEntityId(),

	@ManyToOne(fetch = FetchType.LAZY)
	@MapsId("jobId") // Maps the 'jobId' attribute of JobSubjectEntityId
	@JoinColumn(name = "job_id", referencedColumnName = "job_id", nullable = true, insertable = false, updatable = false)
	var job: JobEntity? = null,

	// entity_id is part of the composite key, already mapped in JobSubjectEntityId
	// We expose it as a direct property for convenience if needed, mapping to the ID's field.
	// This makes it easier to set/get entityId directly on the JobSubjectEntity object.
	@Column(name = "entity_id", nullable = true, insertable = false, updatable = false)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val entityId: UUID? = null, // Read-only from the ID

	@Column(name = "entity_type", length = 32, nullable = false)
	var entityType: String // Consider an Enum here
) {
	// Constructor to easily create instances
	constructor(job: JobEntity, entityId: UUID, entityType: String) : this(
		id = JobSubjectEntityId(job.jobId, entityId),
		job = job,
		entityId = entityId,
		entityType = entityType
	)

	override fun equals(other: Any?): Boolean {
		if (this === other) return true
		if (javaClass != other?.javaClass) return false
		other as JobSubjectEntity
		return id == other.id
	}

	override fun hashCode(): Int =
		id.hashCode()

	override fun toString(): String =
		gson.toJson(this)
}
