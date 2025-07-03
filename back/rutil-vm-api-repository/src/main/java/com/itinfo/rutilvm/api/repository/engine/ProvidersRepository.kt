package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.ProvidersEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface ProvidersRepository : JpaRepository<ProvidersEntity, UUID> {
	fun findByName(name: String): ProvidersEntity?
}
