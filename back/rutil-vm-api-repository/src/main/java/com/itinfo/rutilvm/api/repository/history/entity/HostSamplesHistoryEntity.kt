package com.itinfo.rutilvm.api.repository.history.entity

import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.api.repository.history.dto.HostUsageDto
import com.itinfo.rutilvm.api.repository.history.dto.UsageDto

import org.hibernate.annotations.Type
import org.slf4j.LoggerFactory
import java.io.Serializable
import java.time.LocalDateTime
import java.util.*
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table

private val log = LoggerFactory.getLogger(HostSamplesHistoryEntity::class.java)

/**
 * [HostSamplesHistoryEntity]
 *
 * @property historyId [Int]
 * @property hostId [UUID]
 * @property historyDatetime [LocalDateTime]
 * @property memoryUsagePercent [Int]
 * @property cpuUsagePercent [Int]
 * @property ksmCpuPercent [Int]
 * @property activeVms [Int]
 * @property totalVms [Int]
 * @property totalVmsVcpus [Int]
 * @property cpuLoad [Int]
 * @property systemCpuUsagePercent [Int]
 * @property userCpuUsagePercent [Int]
 * @property hostStatus [Int]
 * @property swapUsedMb [Int]
 * @property hostConfigurationVersion [Int]
 * @property ksmSharedMemoryMb [Int]
 * @property secondsInStatus [Int]
 */
@Entity
@Table(name="host_samples_history", schema="public")
class HostSamplesHistoryEntity(
	@Id
	@Column(unique = true, nullable = false)
	val historyId: Int = -1,

	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val hostId: UUID? = null,

	val historyDatetime: LocalDateTime = LocalDateTime.MIN,
	val memoryUsagePercent: Int? = null,
	val cpuUsagePercent: Int? = null,

	val ksmCpuPercent: Int? = null,
	val activeVms: Int? = null,
	val totalVms: Int? = null,
	val totalVmsVcpus: Int? = null,
	val cpuLoad: Int = 0,
	val systemCpuUsagePercent: Int? = null,
	val userCpuUsagePercent: Int? = null,
	val hostStatus: Int = 0,
	val swapUsedMb: Int = 0,
	val hostConfigurationVersion: Int = 0,
	val ksmSharedMemoryMb: Int = 0,
	val secondsInStatus: Int = 0,
): Serializable {
	override fun toString(): String = gson.toJson(this)

	class Builder {
		private var bHistoryId: Int = -1;fun historyId(block: () -> Int?) { bHistoryId = block() ?: -1 }
		private var bHostId: UUID? = null;fun hostId(block: () -> UUID?) { bHostId = block() }
		private var bHistoryDatetime: LocalDateTime = LocalDateTime.MIN;fun historyDatetime(block: () -> LocalDateTime?) { bHistoryDatetime = block() ?: LocalDateTime.MIN }
		private var bMemoryUsagePercent: Int = 0;fun memoryUsagePercent(block: () -> Int?) { bMemoryUsagePercent = block() ?: 0 }
		private var bCpuUsagePercent: Int = 0;fun cpuUsagePercent(block: () -> Int?) { bCpuUsagePercent = block() ?: 0 }
		private var bKsmCpuPercent: Int = 0;fun ksmCpuPercent(block: () -> Int?) { bKsmCpuPercent = block() ?: 0 }
		private var bActiveVms: Int = 0;fun activeVms(block: () -> Int?) { bActiveVms = block() ?: 0 }
		private var bTotalVms: Int = 0;fun totalVms(block: () -> Int?) { bTotalVms = block() ?: 0 }
		private var bTotalVmsVcpus: Int = 0;fun totalVmsVcpus(block: () -> Int?) { bTotalVmsVcpus = block() ?: 0 }
		private var bCpuLoad: Int = 0;fun cpuLoad(block: () -> Int?) { bCpuLoad = block() ?: 0 }
		private var bSystemCpuUsagePercent: Int = 0;fun systemCpuUsagePercent(block: () -> Int?) { bSystemCpuUsagePercent = block() ?: 0 }
		private var bUserCpuUsagePercent: Int = 0;fun userCpuUsagePercent(block: () -> Int?) { bUserCpuUsagePercent = block() ?: 0 }
		private var bHostStatus: Int = 0;fun hostStatus(block: () -> Int?) { bHostStatus = block() ?: 0 }
		private var bSwapUsedMb: Int = 0;fun swapUsedMb(block: () -> Int?) { bSwapUsedMb = block() ?: 0 }
		private var bHostConfigurationVersion: Int = 0;fun hostConfigurationVersion(block: () -> Int?) { bHostConfigurationVersion = block() ?: 0 }
		private var bKsmSharedMemoryMb: Int = 0;fun ksmSharedMemoryMb(block: () -> Int?) { bKsmSharedMemoryMb = block() ?: 0 }
		private var bSecondsInStatus: Int = 0;fun secondsInStatus(block: () -> Int?) { bSecondsInStatus = block() ?: 0 }
		fun build(): HostSamplesHistoryEntity = HostSamplesHistoryEntity(bHistoryId, bHostId, bHistoryDatetime, bMemoryUsagePercent, bCpuUsagePercent, bKsmCpuPercent, bActiveVms, bTotalVms, bTotalVmsVcpus, bCpuLoad, bSystemCpuUsagePercent, bUserCpuUsagePercent, bHostStatus, bSwapUsedMb, bHostConfigurationVersion, bKsmSharedMemoryMb, bSecondsInStatus)
	}

	companion object {
		inline fun builder(block: HostSamplesHistoryEntity.Builder.() -> Unit): HostSamplesHistoryEntity = HostSamplesHistoryEntity.Builder().apply(block).build()
	}
}

/**
 * [HostSamplesHistoryEntity.totalCpuMemory]
 * 전체 사용량 - 원 그래프 %
 * 호스트 당 사용률 검색
 * @return 호스트 cpu, memory %
 */
fun HostSamplesHistoryEntity.totalCpuMemory(): HostUsageDto {
	return HostUsageDto.builder {
		historyDatetime { historyDatetime }
		totalCpuUsagePercent { cpuUsagePercent?.toDouble() }
		totalMemoryUsagePercent { memoryUsagePercent?.toDouble() }
	}
}


/**
 * 전체 사용량 - 선 그래프 GB
 * 호스트 사용률 전체 출력
 * 근데 10분마다 한번씩 나오는거면 최대 10개로 제한해서 한시간 내의 정보만 보여주면 되는거 아닌가?
 * @return 호스트 1분마다의 cpu,memory 값
 */
fun HostSamplesHistoryEntity.totalUsage(): HostUsageDto {
	return HostUsageDto.builder {
		hostId { hostId.toString() }
		historyDatetime { historyDatetime }
		totalCpuUsagePercent { cpuUsagePercent?.toDouble() }
		totalMemoryUsagePercent { memoryUsagePercent?.toDouble() }
	}
}

// 호스트 각각 현재 사용량 보여주는 거
fun HostSamplesHistoryEntity.getUsage(): UsageDto {
	return UsageDto.builder {
		id { hostId.toString() }
		cpuPercent { cpuUsagePercent }
		memoryPercent { memoryUsagePercent }
	}
}	