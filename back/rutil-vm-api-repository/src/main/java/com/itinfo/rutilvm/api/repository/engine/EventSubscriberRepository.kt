package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.EventSubscriberEntity
import com.itinfo.rutilvm.api.repository.engine.entity.EventSubscriberEntityId
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface EventSubscriberRepository : JpaRepository<EventSubscriberEntity, EventSubscriberEntityId> {
	fun findByIdSubscriberId(subscriberId: UUID): List<EventSubscriberEntity>
	fun findByIdEventUpNameAndActiveTrue(eventUpName: String): List<EventSubscriberEntity>
}
