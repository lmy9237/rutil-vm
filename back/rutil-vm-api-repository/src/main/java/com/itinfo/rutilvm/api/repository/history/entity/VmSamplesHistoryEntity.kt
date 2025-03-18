package com.itinfo.rutilvm.api.repository.history.entity

import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.api.repository.history.dto.UsageDto

import org.hibernate.annotations.Type
import org.slf4j.LoggerFactory
import java.io.Serializable
import java.math.BigInteger
import java.time.LocalDateTime
import java.util.*
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table

private val log = LoggerFactory.getLogger(VmSamplesHistoryEntity::class.java)

/**
 * [VmSamplesHistoryEntity]
 *
 * @property historyId [Int]
 * @property historyDatetime [LocalDateTime]
 * @property vmId [UUID]
 * @property vmStatus [Int]
 * @property cpuUsagePercent [Int]
 * @property memoryUsagePercent [Int]
 * @property vmIp [String]
 * @property currentUserName [String]
 * @property currentlyRunningOnHost [UUID]
 * @property vmConfigurationVersion [Int]
 * @property currentHostConfigurationVersion [Int]
 * @property vmClientIp [String]
 * @property userLoggedInToGuest [Boolean]
 * @property userCpuUsagePercent [Int]
 * @property systemCpuUsagePercent [Int]
 * @property currentUserId [UUID]
 * @property memoryBufferedKb [BigInteger]
 * @property memoryCachedKb [BigInteger]
 * @property secondsInStatus [Int]
 */
@Entity
@Table(name="vm_samples_history", schema="public")
class VmSamplesHistoryEntity(
	@Id
    @Column(unique=true, nullable=false)
	val historyId: Int = -1,

	val historyDatetime: LocalDateTime = LocalDateTime.MIN,

	@Type(type="org.hibernate.type.PostgresUUIDType")
	val vmId: UUID? = null,

	val vmStatus: Int = -1,
	val cpuUsagePercent: Int? = -1,
	val memoryUsagePercent: Int? = -1,
	val vmIp: String = "",
	val currentUserName: String = "",

	@Type(type="org.hibernate.type.PostgresUUIDType")
	val currentlyRunningOnHost: UUID? = null,

	val vmConfigurationVersion: Int = -1,
	val currentHostConfigurationVersion: Int = -1,
	val vmClientIp: String = "",
	val userLoggedInToGuest: Boolean = false,
	val userCpuUsagePercent: Int? = -1,
	val systemCpuUsagePercent: Int? = -1,

	@Type(type="org.hibernate.type.PostgresUUIDType")
	val currentUserId: UUID? = null,

	val memoryBufferedKb: BigInteger = BigInteger.ZERO,
	val memoryCachedKb: BigInteger = BigInteger.ZERO,
	val secondsInStatus: Int = -1,
): Serializable {
	override fun toString(): String = gson.toJson(this)

	class Builder {
		private var bHistoryId: Int = -1;fun historyId(block: () -> Int?) { bHistoryId = block() ?: -1 }
		private var bHistoryDatetime: LocalDateTime = LocalDateTime.MIN;fun historyDatetime(block: () -> LocalDateTime?) { bHistoryDatetime = block() ?: LocalDateTime.MIN}
		private var bVmId: UUID? = null;fun vmId(block: () -> UUID?) { bVmId = block() }
		private var bVmStatus: Int = -1;fun vmStatus(block: () -> Int?) { bVmStatus = block() ?: -1 }
		private var bCpuUsagePercent: Int? = -1;fun cpuUsagePercent(block: () -> Int?) { bCpuUsagePercent = block() ?: -1 }
		private var bMemoryUsagePercent: Int? = -1;fun memoryUsagePercent(block: () -> Int?) { bMemoryUsagePercent = block() ?: -1 }
		private var bVmIp: String = "";fun vmIp(block: () -> String?) { bVmIp = block() ?: "" }
		private var bCurrentUserName: String = "";fun currentUserName(block: () -> String?) { bCurrentUserName = block() ?: "" }
		private var bCurrentlyRunningOnHost: UUID? = null;fun currentlyRunningOnHost(block: () -> UUID?) { bCurrentlyRunningOnHost = block() }
		private var bVmConfigurationVersion: Int = -1;fun vmConfigurationVersion(block: () -> Int?) { bVmConfigurationVersion = block() ?: -1 }
		private var bCurrentHostConfigurationVersion: Int = -1;fun currentHostConfigurationVersion(block: () -> Int?) { bCurrentHostConfigurationVersion = block() ?: -1 }
		private var bVmClientIp: String = "";fun vmClientIp(block: () -> String?) { bVmClientIp = block() ?: "" }
		private var bUserLoggedInToGuest: Boolean = false;fun userLoggedInToGuest(block: () -> Boolean?) { bUserLoggedInToGuest = block() ?: false }
		private var bUserCpuUsagePercent: Int? = -1;fun userCpuUsagePercent(block: () -> Int?) { bUserCpuUsagePercent = block() ?: -1 }
		private var bSystemCpuUsagePercent: Int? = -1;fun systemCpuUsagePercent(block: () -> Int?) { bSystemCpuUsagePercent = block() ?: -1 }
		private var bCurrentUserId: UUID? = null;fun currentUserId(block: () -> UUID?) { bCurrentUserId = block() }
		private var bMemoryBufferedKb: BigInteger = BigInteger.ZERO;fun memoryBufferedKb(block: () -> BigInteger?) { bMemoryBufferedKb = block() ?: BigInteger.ZERO }
		private var bMemoryCachedKb: BigInteger = BigInteger.ZERO;fun memoryCachedKb(block: () -> BigInteger?) { bMemoryCachedKb = block() ?: BigInteger.ZERO }
		private var bSecondsInStatus: Int = -1;fun secondsInStatus(block: () -> Int?) { bSecondsInStatus = block() ?: -1 }
		fun build(): VmSamplesHistoryEntity =
			VmSamplesHistoryEntity(
				bHistoryId,
				bHistoryDatetime,
				bVmId,
				bVmStatus,
				bCpuUsagePercent,
				bMemoryUsagePercent,
				bVmIp,
				bCurrentUserName,
				bCurrentlyRunningOnHost,
				bVmConfigurationVersion,
				bCurrentHostConfigurationVersion,
				bVmClientIp,
				bUserLoggedInToGuest,
				bUserCpuUsagePercent,
				bSystemCpuUsagePercent,
				bCurrentUserId,
				bMemoryBufferedKb,
				bMemoryCachedKb,
				bSecondsInStatus
			)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): VmSamplesHistoryEntity = Builder()
			.apply(block).build()
	}
}

// 가상머신 각각 현재 사용량 보여주는 거
fun VmSamplesHistoryEntity.getUsage(): UsageDto {
	return UsageDto.builder {
//		.id(hostId.toString())
		cpuPercent { cpuUsagePercent }
		memoryPercent { memoryUsagePercent }
	}
}
