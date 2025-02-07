package com.itinfo.rutilvm.api.repository.history

import com.itinfo.rutilvm.api.repository.history.entity.HostConfigurationEntity

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface HostConfigurationRepository : JpaRepository<HostConfigurationEntity, Int> {
	fun findFirstByHostIdOrderByUpdateDateDesc(hostId: UUID): HostConfigurationEntity
}
