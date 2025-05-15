package com.itinfo.rutilvm.api.repository.engine.entity

import org.hibernate.annotations.Type
import org.slf4j.LoggerFactory
import java.util.UUID
import java.io.Serializable
// Or jakarta.persistence.* for newer Spring Boot
import javax.persistence.Column
import javax.persistence.Embeddable
import javax.persistence.EmbeddedId
import javax.persistence.Entity
import javax.persistence.Table

private val log = LoggerFactory.getLogger(EventSubscriberEntity::class.java)

@Embeddable
data class EventSubscriberEntityId(
	@Column(name = "event_up_name", length = 100, nullable = false)
	var eventUpName: String = "",

	@Column(name = "subscriber_id", nullable = false)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	var subscriberId: UUID? = null, // Provide defaults for data class

	@Column(name = "method_id", length = 32, nullable = false)
	var methodId: String = "",

	@Column(name = "tag_name", length = 50, nullable = false)
	var tagName: String = AuditLogEntity.DEFAULT_ORIGIN // oVirt defaults this to empty string for PK
): Serializable {
}

@Entity
@Table(name = "event_subscriber")
data class EventSubscriberEntity(

	@EmbeddedId
	var id: EventSubscriberEntityId = EventSubscriberEntityId(),

	@Column(name = "email", length = 255)
	var email: String? = null,

	@Column(name = "active") // Assuming this column exists and is boolean
	var active: Boolean? = true // Default to true if creating, or reflect DB
)
