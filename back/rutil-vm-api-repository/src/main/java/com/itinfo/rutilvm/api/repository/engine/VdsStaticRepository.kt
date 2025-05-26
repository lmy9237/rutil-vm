package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.VdsStaticEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface VdsStaticRepository : JpaRepository<VdsStaticEntity, UUID> {
	fun findByHostNameAndClusterId(hostName: String, clusterId: UUID): VdsStaticEntity?
	fun findByVdsNameAndClusterId(vdsName: String, clusterId: UUID): VdsStaticEntity?
}

