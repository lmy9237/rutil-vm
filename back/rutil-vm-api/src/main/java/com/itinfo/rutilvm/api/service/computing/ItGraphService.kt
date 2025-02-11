package com.itinfo.rutilvm.api.service.computing

import com.itinfo.rutilvm.api.configuration.PropertiesConfig
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.model.computing.*
import com.itinfo.rutilvm.api.repository.history.*
import com.itinfo.rutilvm.api.repository.history.dto.*
import com.itinfo.rutilvm.api.repository.history.entity.*
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.util.ovirt.*
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern
import org.ovirt.engine.sdk4.types.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import java.math.BigDecimal
import java.util.*

interface ItGraphService {

	fun getDataCenters(): SizeVo
	/**
	 * 전체 사용량 정보 개수 (전체, up, down)
	 * 데이터센터, 클러스터, 호스트, 가상머신, 스토리지 도메인, 이벤트
	 * @return [DashBoardVo]
	 */
	fun getDashboard(): DashBoardVo
	/**
	 * 전체 사용량 - Host (CPU, Memory  % )
	 * 원 그래프
	 * 5분마다 한번씩 불려지게 해야함
	 *
	 * @return [HostUsageDto] 호스트 cpu, memory 사용량
	 */
	fun totalCpuMemory(): HostUsageDto
	/**
	 * 전체 사용량 - Storage %
	 * 원 그래프
	 * 5분마다 한번씩 불려지게 해야함
	 *
	 * @return [StorageUsageDto] 스토리지 사용량
	 */
	fun totalStorage(): StorageUsageDto

	/**
	 * 가상머신 cpu 사용량 3
	 * 막대그래프
	 * @return List<[UsageDto]>
	 */
	fun vmCpuChart(): List<UsageDto>
	/**
	 * 가상머신 memory 사용량 3
	 * 막대그래프
	 * @return List<[UsageDto]>
	 */
	fun vmMemoryChart(): List<UsageDto>
	/**
	 * 스토리지 도메인 memory 사용량 3
	 * 막대그래프
	 * @return List<[UsageDto]>
	 */
	fun storageChart(): List<UsageDto>

	/**
	 * 가상머신 cpu 사용량 top3
	 * 선그래프
	 * @return List<[LineDto]>
	 */
	fun vmCpuPerChart(): List<LineDto>
	/**
	 * 가상머신 memory 사용량 top3
	 * 선그래프
	 * @return List<[LineDto]>
	 */
	fun vmMemoryPerChart(): List<LineDto>
	/**
	 * 가상머신 memory 사용량 top3
	 * 선그래프
	 * @return List<[LineDto]>
	 */
	fun vmNetworkPerChart(): List<LineDto>
	/**
	 * 전체 가상머신 cpu/memory 사용량
	 * 매트릭
	 * @return List<[UsageDto]>
	 */
	fun vmMetricChart(): List<UsageDto>
	/**
	 * 스토리지 도메인 사용량
	 * 매트릭
	 * @return List<[UsageDto]>
	 */
	fun storageMetricChart(): List<UsageDto>

	/**
	 * 전체 사용량(CPU, Memory %) 선 그래프
	 * @param hostId 호스트 id
	 * @return 10분마다 그래프에 찍히게?
	 */
	fun totalHostCpuMemoryList(hostId: UUID, limit: Int): List<HostUsageDto>

	// 호스트 사용량 top3
	fun hostCpuChart(): List<UsageDto>
	fun hostMemoryChart(): List<UsageDto>
	// 호스트 목록 - 그래프
	fun hostPercent(hostId: String, hostNicId: String): UsageDto
	// 가상머신 목록 - 그래프
	fun vmPercent(vmId: String, vmNicId: String): UsageDto

}

@Service
class GraphServiceImpl(

): BaseService(), ItGraphService {
	@Autowired private lateinit var propConfig: PropertiesConfig
	@Autowired private lateinit var hostSamplesHistoryRepository: HostSamplesHistoryRepository
	@Autowired private lateinit var hostInterfaceSampleHistoryRepository: HostInterfaceSampleHistoryRepository
	@Autowired private lateinit var vmSamplesHistoryRepository: VmSamplesHistoryRepository
	@Autowired private lateinit var vmInterfaceSamplesHistoryRepository: VmInterfaceSamplesHistoryRepository
	@Autowired private lateinit var storageDomainSamplesHistoryRepository: StorageDomainSamplesHistoryRepository


	override fun getDataCenters(): SizeVo {
		log.info("getDataCenters ... ")
		return conn.findDataCenterCnt()
	}

	override fun getDashboard(): DashBoardVo {
		log.info("getDashboard ... ")
		return conn.toDashboardVo(propConfig)
	}

	override fun totalCpuMemory(): HostUsageDto {
		log.info("totalCpuMemory ... ")
		val hosts: List<Host> = conn.findAllHosts(searchQuery = "status=up").getOrDefault(listOf())
		val hostSamplesHistoryEntities: List<HostSamplesHistoryEntity> =
			hosts.map { hostSamplesHistoryRepository.findFirstByHostIdOrderByHistoryDatetimeDesc(UUID.fromString(it.id())) }
		return hosts.toHostUsageDto(conn, hostSamplesHistoryEntities)
	}

	override fun totalStorage(): StorageUsageDto {
		log.info("totalStorage ... ")
		val storageDomains: List<StorageDomain> = conn.findAllStorageDomains().getOrDefault(listOf())
		return storageDomains.toStorageUsageDto(conn)
	}

	override fun vmCpuChart(): List<UsageDto> {
		log.info("vmCpuChart ... ")
		val page: Pageable = PageRequest.of(0, 3)
		val vmSampleHistoryEntities: List<VmSamplesHistoryEntity> = vmSamplesHistoryRepository.findVmCpuChart(page)
		return vmSampleHistoryEntities.toVmCpuUsageDtos(conn)
	}

	override fun vmMemoryChart(): List<UsageDto> {
		log.info("vmMemoryChart ... ")
		val page: Pageable = PageRequest.of(0, 3)
		val vmSampleHistoryEntities: List<VmSamplesHistoryEntity> = vmSamplesHistoryRepository.findVmMemoryChart(page)
		return vmSampleHistoryEntities.toVmMemUsageDtos(conn)
	}

	override fun storageChart(): List<UsageDto> {
		log.info("storageChart ... ")
		val page: Pageable = PageRequest.of(0, 3)
		val storageDomainSampleHistoryEntities: List<StorageDomainSamplesHistoryEntity> = storageDomainSamplesHistoryRepository.findStorageChart(page)
		return storageDomainSampleHistoryEntities.toStorageCharts(conn)
	}

	override fun vmCpuPerChart(): List<LineDto> {
		log.info("vmCpuPerChart ... ")
		val vmSampleHistoryEntities: List<VmSamplesHistoryEntity> = vmSamplesHistoryRepository.findVmUsageListChart()
		return vmSampleHistoryEntities.toVmCpuLineDtos(conn)
	}

	override fun vmMemoryPerChart(): List<LineDto> {
		log.info("vmMemoryPerChart ... ")
		val vmSampleHistoryEntities: List<VmSamplesHistoryEntity> = vmSamplesHistoryRepository.findVmUsageListChart()
		return vmSampleHistoryEntities.toVmMemoryLineDtos(conn)
	}

	override fun vmNetworkPerChart(): List<LineDto> {
		log.info("vmNetworkPerChart ... ")
		val vmInterfaceSampleHistoryEntities: List<VmInterfaceSamplesHistoryEntity> = vmInterfaceSamplesHistoryRepository.findVmNetworkMetricListChart()
		return vmInterfaceSampleHistoryEntities.toVmNetworkLineDtos(conn)
	}

	override fun vmMetricChart(): List<UsageDto> {
		log.info("vmMetricChart ... ")
		val vmSampleHistoryEntities: List<VmSamplesHistoryEntity> = vmSamplesHistoryRepository.findVmMetricListChart()
		return vmSampleHistoryEntities.toVmUsageDtos(conn)
	}

	override fun storageMetricChart(): List<UsageDto> {
		log.info("storageMetricChart ... ")
		val storageDomainSampleHistoryEntities: List<StorageDomainSamplesHistoryEntity> = storageDomainSamplesHistoryRepository.findStorageChart(null)
		return storageDomainSampleHistoryEntities.toStorageCharts(conn)
	}


	// 일단 쓰는 곳 없음
	override fun totalHostCpuMemoryList(hostId: UUID, limit: Int): List<HostUsageDto> {
		log.info("totalHostCpuMemoryList ... ")
		val page: Pageable = PageRequest.of(0, limit)
		val hostSamplesHistoryEntities: List<HostSamplesHistoryEntity> =
			hostSamplesHistoryRepository.findByHostIdOrderByHistoryDatetimeDesc(hostId, page)
		val host: Host =
			conn.findAllHosts("id=$hostId").getOrDefault(listOf())
				.firstOrNull() ?: run {
				log.warn("totalCpuMemoryList ... no host FOUND!")
				return listOf()
			}
		return hostSamplesHistoryEntities.toTotalCpuMemoryUsages(conn, host)
	}


	override fun hostCpuChart(): List<UsageDto> {
		log.info("hostCpuChart ... ")
		val page: Pageable = PageRequest.of(0, 3)
		val hostSampleHistoryEntities: List<HostSamplesHistoryEntity> = hostSamplesHistoryRepository.findHostCpuChart(page)
		return hostSampleHistoryEntities.toHostCpuCharts(conn)
	}

	override fun hostMemoryChart(): List<UsageDto> {
		log.info("hostMemoryChart ... ")
		val page: Pageable = PageRequest.of(0, 3)
		val hostSampleHistoryEntities: List<HostSamplesHistoryEntity> = hostSamplesHistoryRepository.findHostMemoryChart(page)
		return hostSampleHistoryEntities.toHostMemCharts(conn)
	}

	override fun hostPercent(hostId: String, hostNicId: String): UsageDto {
		log.info("hostPercent ... ")
		val hostSampleHistoryEntity: HostSamplesHistoryEntity =
			hostSamplesHistoryRepository.findFirstByHostIdOrderByHistoryDatetimeDesc(UUID.fromString(hostId))
		val usageDto = hostSampleHistoryEntity.getUsage()
		val hostInterfaceSamplesHistoryEntity: Optional<HostInterfaceSamplesHistoryEntity> =
			hostInterfaceSampleHistoryRepository.findFirstByHostInterfaceIdOrderByHistoryDatetimeDesc(UUID.fromString(hostNicId))
		val networkRate = hostInterfaceSamplesHistoryEntity
			.map { it.receiveRatePercent.toInt() } // Optional에서 값이 있으면 처리
			.orElse(0) // 값이 없으면 기본값으로 0 사용
		usageDto.networkPercent = networkRate
		return usageDto
	}

	override fun vmPercent(vmId: String, vmNicId: String): UsageDto {
		log.info("vmPercent ... ")
		val vmSamplesHistoryEntity =
			vmSamplesHistoryRepository.findFirstByVmIdOrderByHistoryDatetimeDesc(UUID.fromString(vmId))
		val usageDto = vmSamplesHistoryEntity.getUsage()
		val vmInterfaceSamplesHistoryEntity: VmInterfaceSamplesHistoryEntity =
			vmInterfaceSamplesHistoryRepository.findFirstByVmInterfaceIdOrderByHistoryDatetimeDesc(UUID.fromString(vmNicId))
		val networkRate = vmInterfaceSamplesHistoryEntity.receiveRatePercent.toInt()
		usageDto.networkPercent = networkRate
		return usageDto
	}


	companion object {
		private val log by LoggerDelegate()
	}
}
