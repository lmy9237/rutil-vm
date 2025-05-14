package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.NameServerEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface NameServerRepository: JpaRepository<NameServerEntity, UUID> {
	fun findByAddress(address: String): List<NameServerEntity>
}
