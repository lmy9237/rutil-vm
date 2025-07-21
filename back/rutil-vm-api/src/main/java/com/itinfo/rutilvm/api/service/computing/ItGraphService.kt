package com.itinfo.rutilvm.api.service.computing

import com.itinfo.rutilvm.api.configuration.PropertiesConfig
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.model.computing.*
import com.itinfo.rutilvm.api.repository.engine.StorageDomainRepository
import com.itinfo.rutilvm.api.repository.engine.VdsInterfaceStatisticsRepository
import com.itinfo.rutilvm.api.repository.engine.VdsRepository
import com.itinfo.rutilvm.api.repository.engine.VdsStatisticsRepository
import com.itinfo.rutilvm.api.repository.engine.entity.VdsEntity
import com.itinfo.rutilvm.api.repository.engine.entity.VdsStatisticsEntity
import com.itinfo.rutilvm.api.repository.history.*
import com.itinfo.rutilvm.api.repository.history.dto.*
import com.itinfo.rutilvm.api.repository.history.entity.*
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.common.toUUID
import com.itinfo.rutilvm.util.ovirt.*
import org.jboss.jandex.TypeTarget.Usage
import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.types.*
import org.ovirt.engine.sdk4.types.StorageDomainType.EXPORT
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import java.util.*
import kotlin.jvm.Throws

interface ItGraphService {
	/**
	 * [ItGraphService.getDashboard]
	 *
	 * 전체 사용량 정보 개수 (전체, up, down)
	 * 데이터센터, 클러스터, 호스트, 가상머신, 스토리지 도메인, 이벤트
	 * @return [DashboardVo]
	 */
	fun getDashboard(): DashboardVo
	/**
	 * [ItGraphService.totalHostUsage]
	 *
	 * 전체 사용량 - Host (CPU, Memory  % )
	 * 원 그래프
	 * 5분마다 한번씩 불려지게 해야함
	 *
	 * @return [HostUsageDto] 호스트 cpu, memory 사용량
	 */
	fun totalHostUsage(): HostUsageDto
	/**
	 * [ItGraphService.totalStorageUsage]
	 * 전체 사용량 - Storage %
	 * 원 그래프
	 * 5분마다 한번씩 불려지게 해야함
	 *
	 * @return [StorageUsageDto] 스토리지 사용량
	 */
	fun totalStorageUsage(): StorageUsageDto

	/**
	 * [ItGraphService.vmCpuUsageBarData]
	 * 가상머신 cpu 사용량 3
	 * 막대그래프
	 * @return List<[UsageDto]>
	 */
	fun vmCpuUsageBarData(): List<UsageDto>
	/**
	 * [ItGraphService.vmMemoryUsageBarData]
	 * 가상머신 memory 사용량 3
	 * 막대그래프
	 * @return List<[UsageDto]>
	 */
	fun vmMemoryUsageBarData(): List<UsageDto>
	/**
	 * [ItGraphService.storageUsageBarData]
	 * 스토리지 도메인 사용량 3
	 * 막대그래프
	 * @return List<[UsageDto]>
	 */
	fun storageUsageBarData(): List<UsageDto>

	/**
	 * [ItGraphService.hostCpuMemAvgLineData]
	 * 호스트 cpu, memory 사용량 (전체 호스트 평균값)
	 * 선그래프
	 * @return List<[HostUsageDto]>
	 */
	fun hostCpuMemAvgLineData(): List<HostUsageDto>
	/**
	 * [ItGraphService.storageAvgLineData]
	 * 스토리지 사용량
	 * 선그래프
	 * @return List<[StorageUsageDto]>
	 */
	fun storageAvgLineData(): List<StorageUsageDto>

	/**
	 * [ItGraphService.hostHourlyUsageLineData]
	 * 호스트 한개의 cpu, memory, network 사용량
	 * 1시간 별로 출력
	 * 선그래프
	 * @return List<[HostUsageDto]>
	 */
	fun hostHourlyUsageLineData(hostId: String): List<UsageDto>

	/**
	 * [ItGraphService.vmCpuMetricData]
	 * 전체 가상머신 cpu 사용량
	 * 매트릭
	 * @return List<[UsageDto]>
	 */
	fun vmCpuMetricData(): List<UsageDto>
	/**
	 * [ItGraphService.vmMemoryMetricData]
	 * 전체 가상머신 memory 사용량
	 * 매트릭
	 * @return List<[UsageDto]>
	 */
	fun vmMemoryMetricData(): List<UsageDto>
	/**
	 * [ItGraphService.storageMetricData]
	 * 스토리지 도메인 사용량
	 * 매트릭
	 * @return List<[UsageDto]>
	 */
	fun storageMetricData(): List<UsageDto>
	// 호스트 목록 - 그래프
	fun hostPercent(hostId: String): UsageDto

	/**
	 * [ItGraphService.dataCenterUsage]
	 * 데이터센터 일반정보 사용
	 */
	@Throws(Error::class)
	fun dataCenterUsage(dataCenterId: String): UsagePerDto
	/**
	 * [ItGraphService.clusterUsage]
	 * 클러스터 일반정보 사용
	 */
	@Throws(Error::class)
	fun clusterUsage(clusterId: String): UsagePerDto
}

@Service
class GraphServiceImpl(

): BaseService(), ItGraphService {
	@Autowired private lateinit var propConfig: PropertiesConfig
	@Autowired private lateinit var hostSamplesHistoryRepository: HostSamplesHistoryRepository
	@Autowired private lateinit var vmSamplesHistoryRepository: VmSamplesHistoryRepository
	@Autowired private lateinit var storageDomainSamplesHistoryRepository: StorageDomainSamplesHistoryRepository
	@Autowired private lateinit var storageDomainRepository: StorageDomainRepository
	@Autowired private lateinit var vdsStatisticsRepository: VdsStatisticsRepository
	@Autowired private lateinit var vdsRepository: VdsRepository


	override fun getDashboard(): DashboardVo {
		log.info("getDashboard ... ")
		return conn.toDashboardVo(propConfig)
	}

	override fun totalHostUsage(): HostUsageDto {
		log.info("totalHostUsage ... ")
		val hosts: List<Host> = conn.findAllHosts(searchQuery = "status=up").getOrDefault(listOf())

		val hostSamplesHistoryEntities: List<HostSamplesHistoryEntity> =
			hosts.map {
				hostSamplesHistoryRepository.findFirstByHostIdOrderByHistoryDatetimeDesc(it.id().toUUID())
			}
		return hosts.toHostUsageDto(conn, hostSamplesHistoryEntities)
	}

	override fun totalStorageUsage(): StorageUsageDto {
		log.info("totalStorageUsage ... ")
		val storageDomains: List<StorageDomain> = conn.findAllStorageDomains().getOrDefault(listOf())
			.filter { it.type() != EXPORT }
		return storageDomains.toStorageUsageDto()
	}

	override fun vmCpuUsageBarData(): List<UsageDto> {
		log.info("vmCpuUsageBarData ... ")
		val page: Pageable = PageRequest.of(0, 3)
		val vmSampleHistoryEntities: List<VmSamplesHistoryEntity> = vmSamplesHistoryRepository.findVmCpuChart(page)
		return vmSampleHistoryEntities.toVmCpuUsageDtos(conn)
	}

	override fun vmMemoryUsageBarData(): List<UsageDto> {
		log.info("vmMemoryUsageBarData ... ")
		val page: Pageable = PageRequest.of(0, 3)
		val vmSampleHistoryEntities: List<VmSamplesHistoryEntity> = vmSamplesHistoryRepository.findVmMemoryChart(page)
		return vmSampleHistoryEntities.toVmMemUsageDtos(conn)
	}

	override fun storageUsageBarData(): List<UsageDto> {
		log.info("storageUsageBarData ... ")
		val storageDomainSampleHistoryEntities: List<StorageDomainSamplesHistoryEntity> = storageDomainSamplesHistoryRepository.findStorageChart()
			// .filter { it.() != EXPORT }
		return storageDomainSampleHistoryEntities
			.toStorageCharts(conn)
			.sortedByDescending { it.memoryPercent }
			.take(3)
	}

	override fun hostCpuMemAvgLineData(): List<HostUsageDto> {
		log.info("hostCpuMemAvgLineData ... ")
		val rawData: List<Array<Any>> = hostSamplesHistoryRepository.findHostUsageListChart()

		return rawData.map {
			HostUsageDto(
				historyDatetime = (it[0] as java.sql.Timestamp).toLocalDateTime(),
				avgCpuUsage = (it[1] as Number).toDouble(),
				avgMemoryUsage = (it[2] as Number).toDouble()
			)
		}
	}

	override fun storageAvgLineData(): List<StorageUsageDto> {
		log.info("storageAvgLineData ... ")
		val rawData: List<Array<Any>> = storageDomainSamplesHistoryRepository.findDomainUsageListChart()

		return rawData.map {
			StorageUsageDto(
				historyDatetime = (it[0] as java.sql.Timestamp).toLocalDateTime(),
				avgDomainUsagePercent = (it[1] as Number).toDouble(),
			)
		}
	}

	override fun hostHourlyUsageLineData(hostId: String): List<UsageDto> {
		log.info("hostHourlyUsageLineData ... hostId: {}", hostId)
		val rawResult: List<Array<Any>> = hostSamplesHistoryRepository.findHostUsageWithNetwork(hostId.toUUID())
		return rawResult.toUsageDtoList()
	}

	//
	// override fun hostHourlyUsageLineData(hostId: String): List<HostUsageDto> {
	// 	log.info("hostHourlyUsageLineData ... hostId: {}", hostId)
	//
	// 	val rawData: List<Array<Any>> = hostSamplesHistoryRepository.findHostUsageById(UUID.fromString(hostId))
	//
	// 	return rawData.map {
	// 		HostUsageDto(
	// 			historyDatetime = (it[0] as java.sql.Timestamp).toLocalDateTime(),
	// 			avgCpuUsage = (it[1] as Number).toDouble(),
	// 			avgMemoryUsage = (it[2] as Number).toDouble()
	// 		)
	// 	}
	// }

	/*override fun vmCpuPerChart(): List<LineDto> {
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
	}*/

	override fun vmCpuMetricData(): List<UsageDto> {
		log.info("vmCpuMetricChart ... ")
		val vmSampleHistoryEntities: List<VmSamplesHistoryEntity> = vmSamplesHistoryRepository.findVmCpuMetricListChart()
		return vmSampleHistoryEntities.toVmUsageDtos(conn)
	}

	override fun vmMemoryMetricData(): List<UsageDto> {
		log.info("vmMemoryMetricChart ... ")
		val vmSampleHistoryEntities: List<VmSamplesHistoryEntity> = vmSamplesHistoryRepository.findVmMemoryMetricListChart()
		return vmSampleHistoryEntities.toVmUsageDtos(conn)
	}

	override fun storageMetricData(): List<UsageDto> {
		log.info("storageMetricChart ... ")
		val storageDomainSampleHistoryEntities: List<StorageDomainSamplesHistoryEntity> = storageDomainSamplesHistoryRepository.findStorageChart()
		return storageDomainSampleHistoryEntities.toStorageCharts(conn).sortedByDescending { it.memoryPercent }
	}

	// 일단 쓰는 곳 없음
	/*override fun totalHostCpuMemoryList(hostId: String, limit: Int): List<HostUsageDto> {
		log.info("totalHostCpuMemoryList ... ")
		val page: Pageable = PageRequest.of(0, limit)
		val hostSamplesHistoryEntities: List<HostSamplesHistoryEntity> =
			hostSamplesHistoryRepository.findByHostIdOrderByHistoryDatetimeDesc(UUID.fromString(hostId), page)
		val host: Host =
			conn.findAllHosts("id=$hostId").getOrDefault(listOf())
				.firstOrNull() ?: run {
				log.warn("totalCpuMemoryList ... no host FOUND!")
				return listOf()
			}
		return hostSamplesHistoryEntities.toTotalCpuMemoryUsages(host)
	}*/

	/*override fun hostCpuChart(): List<UsageDto> {
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
	}*/

	override fun hostPercent(hostId: String): UsageDto {
		val vdsStatisticsEntity: VdsStatisticsEntity = vdsStatisticsRepository.findByVdsId(hostId.toUUID())
		log.info("hostPercent ... hostId: {}", vdsStatisticsEntity.toHostUsage())

		return vdsStatisticsEntity.toHostUsage()
		// val hostSampleHistoryEntity: HostSamplesHistoryEntity =
		// 	hostSamplesHistoryRepository.findFirstByHostIdOrderByHistoryDatetimeDesc(hostId.toUUID())
		// val usageDto = hostSampleHistoryEntity.toUsageDto()
		//
		// val hostNetwork: VdsInterfaceStatisticsEntity? = vdsInterfaceStatisticsRepository.findByVdsId(hostId.toUUID())
		// usageDto.networkPercent = (hostNetwork?.rxRate?.add(hostNetwork.txRate))?.toInt()
		// return usageDto
	}

	/*override fun vmPercent(vmId: String, vmNicId: String): UsageDto {
		log.info("vmPercent ... ")
		val vmSamplesHistoryEntity =
			vmSamplesHistoryRepository.findFirstByVmIdOrderByHistoryDatetimeDesc(UUID.fromString(vmId))
		val usageDto = vmSamplesHistoryEntity.toUsageDto()
		val vmInterfaceSamplesHistoryEntity: VmInterfaceSamplesHistoryEntity =
			vmInterfaceSamplesHistoryRepository.findFirstByVmInterfaceIdOrderByHistoryDatetimeDesc(UUID.fromString(vmNicId))
		val networkRate = vmInterfaceSamplesHistoryEntity.receiveRatePercent?.toInt() ?: 0
		usageDto.networkPercent = networkRate
		return usageDto
	}
*/

	override fun dataCenterUsage(dataCenterId: String): UsagePerDto {
		log.info("dataCenterUsage ... dataCenterId: {}", dataCenterId)

		val vdsList = vdsRepository.findByStoragePoolId(dataCenterId.toUUID())
		val storageList = storageDomainRepository.findByStoragePoolId(dataCenterId.toUUID())

		return vdsList.toDataCenterUsage(storageList)
	}

	override fun clusterUsage(clusterId: String): UsagePerDto {
		log.info("clusterUsage ... clusterId: {}", clusterId)

		val vdsList = vdsRepository.findByClusterId(clusterId.toUUID())

		val storagePoolIds = vdsList.mapNotNull {
			it.storagePool?.id ?: it.storagePool?.id
		}.distinct()

		val storageList = storagePoolIds.flatMap {
			storageDomainRepository.findByStoragePoolId(it)
		}
		return vdsList.toDataCenterUsage(storageList)
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
