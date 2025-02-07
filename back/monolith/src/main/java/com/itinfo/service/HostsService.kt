package com.itinfo.service

import com.itinfo.model.*
import com.itinfo.model.karajan.ConsolidationVo
import com.itinfo.model.karajan.HostVo
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.types.Host
import org.ovirt.engine.sdk4.types.Vm

/**
 * [HostsService]
 * 호스트 관리 서비스
 *
 * @author chlee
 * @since 2023.12.07
 */
interface HostsService {
	fun maintenanceBeforeConsolidateVms(hosts: List<String>): List<ConsolidationVo>
	fun maintenanceStart(hosts: List<String>)
	fun maintenanceStop(hosts: List<String>)
	fun restartHost(hosts: List<String>)
	fun startHost(hosts: List<String>)
	fun stopHost(hosts: List<String>)
	fun createHost(hostCreateVo: HostCreateVo)
	fun updateHost(hostCreateVo: HostCreateVo)
	fun removeHost(hostIds: List<String>)
	fun setupHostNetwork(paramList: List<NicUsageApiVo>)
	fun modifyNicNetwork(paramNetworkAttachmentVo: NetworkAttachmentVo)
	fun retrieveCreateHostInfo(hostId: String): HostCreateVo
	fun retrieveHostsInfo(status: String): List<HostDetailVo>
	fun retrieveLunHostsInfo(status: String): List<HostDetailVo>
	fun retrieveHostDetail(hostId: String): HostDetailVo
	fun retrieveHostEvents(hostId: String): List<EventVo>
	fun getHostInfo(connection: Connection, host: Host): HostDetailVo
	fun getVmInfo(connection: Connection, vm: Vm): VmSummaryVo
	fun retrieveFanceAgentType(): List<String>
	fun connectTestFenceAgent(fenceAgentVo: FenceAgentVo): Boolean
	fun shutdownHost(hosts: List<HostVo>)
	fun retrieveHostsTop(totalHosts: List<HostDetailVo>): List<DashboardTopVo>
}
