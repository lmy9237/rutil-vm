package com.itinfo.rutilvm.api.repository.history

import com.itinfo.rutilvm.api.repository.history.entity.VmInterfaceSamplesHistoryEntity

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface VmInterfaceSamplesHistoryRepository : JpaRepository<VmInterfaceSamplesHistoryEntity, Int> {
	fun findFirstByVmInterfaceIdOrderByHistoryDatetimeDesc(vnInterfaceId: UUID): VmInterfaceSamplesHistoryEntity

	@Query(
		value =
			"""
				with rankednetworkusage as (
					select 
						vic.vm_id,
						vi.*,
						sum((vi.receive_rate_percent + vi.transmit_rate_percent) / 2) over (partition by vic.vm_id) as network_usage_per,
						row_number() over (partition by vic.vm_id order by vi.history_datetime desc) as rn
					from vm_interface_samples_history vi
					join vm_interface_configuration vic on vic.vm_interface_id = vi.vm_interface_id
					where vi.receive_rate_percent is not null 
					  and vi.transmit_rate_percent is not null
					  and cast(extract(minute from vi.history_datetime) as integer) % 10 = 0
				)
				select *
				from rankednetworkusage
				where rn <= 10
				order by vm_id, history_datetime desc
			""",
		nativeQuery = true
	)
	fun findVmNetworkMetricListChart(): List<VmInterfaceSamplesHistoryEntity>

}
