package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.DnsResolverConfigurationEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface DnsResolverConfigurationRepository : JpaRepository<DnsResolverConfigurationEntity, UUID> {
}
