package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.VdsInterfaceEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface VdsInterfaceRepository : JpaRepository<VdsInterfaceEntity, UUID> {
	fun findByVdsStaticVdsIdAndName(vdsId: UUID, name: String): VdsInterfaceEntity?
	fun findByVdsStaticVdsIdAndNetworkName(vdsId: UUID, networkName: String): VdsInterfaceEntity?
	fun findAllByVdsStaticVdsId(vdsId: UUID): List<VdsInterfaceEntity>
}
