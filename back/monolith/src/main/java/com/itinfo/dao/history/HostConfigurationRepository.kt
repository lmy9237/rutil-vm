package com.itinfo.dao.history

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository
import java.util.UUID


@Repository
interface HostConfigurationRepository: JpaRepository<HostConfiguration, Int> {
	fun findByHostIdOrderByHistoryIdDesc(hostId: UUID): List<HostConfiguration> // COMPUTE-CLUSTER.retrieveHostSw
}