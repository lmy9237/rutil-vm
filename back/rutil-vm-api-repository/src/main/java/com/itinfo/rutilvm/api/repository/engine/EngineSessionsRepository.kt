package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.EngineSessionsEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface EngineSessionsRepository : JpaRepository<EngineSessionsEntity, Int> {
	fun findAllByUserNameOrderByIdDesc(userName: String): List<EngineSessionsEntity>
}
