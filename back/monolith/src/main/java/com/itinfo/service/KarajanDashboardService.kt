package com.itinfo.service

import com.itinfo.model.karajan.ConsolidationVo
import com.itinfo.model.karajan.KarajanVo

/**
 * [KarajanDashboardService]
 * Karajan Dashboard 서비스
 *
 * @author chlee
 * @since 2023.12.07
 */
interface KarajanDashboardService {
	fun retrieveDataCenterStatus(): KarajanVo
	fun consolidateVm(clusterId: String): List<ConsolidationVo>
	fun migrateVm(hostId: String, vmId: String): String
	fun publishVmStatus(hostId: String, vmId: String)
	fun relocateVms(consolidations: List<ConsolidationVo>)
}
