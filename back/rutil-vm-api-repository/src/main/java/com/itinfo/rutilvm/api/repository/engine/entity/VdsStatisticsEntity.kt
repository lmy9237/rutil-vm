package com.itinfo.rutilvm.api.repository.engine.entity

import java.io.Serializable
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.*
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table

@Entity
@Table(name = "vds_statistics")
class VdsStatisticsEntity(
	@Id
	@Column(name="vds_id", nullable=false)
	val vdsId: UUID? = null,
	val cpuIdle: BigDecimal? = BigDecimal.ZERO,
	val cpuLoad: BigDecimal? = BigDecimal.ZERO,
	val cpuSys: BigDecimal? = BigDecimal.ZERO,
	val cpuUser: BigDecimal? = BigDecimal.ZERO,
	val usageMemPercent: Int? = null,
	val usageCpuPercent: Int? = null,
	val usageNetworkPercent: Int? = null,
	val memShared: Int? = null,
	val swapFree: Int? = null,
	val swapTotal: Int? = null,
	val ksmCpuPercent: Int? = null,
	val ksmPages: Int? = null,
	val ksmState: Boolean? = null,
	@Column(name="_update_date", nullable=false)
	val updateDate: LocalDateTime? = LocalDateTime.now(),
	val memFree: Int? = null,
	val haScore: Int? = null,
	val anonymousHugepages: Int? = null,
	val haConfigured: Boolean? = null,
	val haActive: Boolean? = null,
	val haGlobalMaintenance: Boolean? = null,
	val haLocalMaintenance: Boolean? = null,
	val bootTime: Int? = null,
	val cpuOverCommitTimeStamp: LocalDateTime? = LocalDateTime.now(),
	val hugepages: String? = "",
): Serializable {
	class Builder {
		private var bVdsId: UUID? = null; fun vdsId(block: () -> UUID?) { bVdsId = block() }
		private var bCpuIdle: BigDecimal? = BigDecimal.ZERO; fun cpuIdle(block: () -> BigDecimal?) { bCpuIdle = block() ?: BigDecimal.ZERO }
		private var bCpuLoad: BigDecimal? = BigDecimal.ZERO; fun cpuLoad(block: () -> BigDecimal?) { bCpuLoad = block() ?: BigDecimal.ZERO }
		private var bCpuSys: BigDecimal? = BigDecimal.ZERO; fun cpuSys(block: () -> BigDecimal?) { bCpuSys = block() ?: BigDecimal.ZERO }
		private var bCpuUser: BigDecimal? = BigDecimal.ZERO; fun cpuUser(block: () -> BigDecimal?) { bCpuUser = block() ?: BigDecimal.ZERO }
		private var bUsageMemPercent: Int? = null; fun usageMemPercent(block: () -> Int?) { bUsageMemPercent = block() }
		private var bUsageCpuPercent: Int? = null; fun usageCpuPercent(block: () -> Int?) { bUsageCpuPercent = block() }
		private var bUsageNetworkPercent: Int? = null; fun usageNetworkPercent(block: () -> Int?) { bUsageNetworkPercent = block() }
		private var bMemShared: Int? = null; fun memShared(block: () -> Int?) { bMemShared = block() }
		private var bSwapFree: Int? = null; fun swapFree(block: () -> Int?) { bSwapFree = block() }
		private var bSwapTotal: Int? = null; fun swapTotal(block: () -> Int?) { bSwapTotal = block() }
		private var bKsmCpuPercent: Int? = null; fun ksmCpuPercent(block: () -> Int?) { bKsmCpuPercent = block() }
		private var bKsmPages: Int? = null; fun ksmPages(block: () -> Int?) { bKsmPages = block() }
		private var bKsmState: Boolean? = false; fun ksmState(block: () -> Boolean?) { bKsmState = block() ?: false }
		private var bUpdateDate: LocalDateTime? = LocalDateTime.now(); fun updateDate(block: () -> LocalDateTime?) { bUpdateDate = block() }
		private var bMemFree: Int? = null; fun memFree(block: () -> Int?) { bMemFree = block() }
		private var bHaScore: Int? = null; fun haScore(block: () -> Int?) { bHaScore = block() }
		private var bAnonymousHugepages: Int? = null; fun anonymousHugepages(block: () -> Int?) { bAnonymousHugepages = block() }
		private var bHaConfigured: Boolean? = false; fun haConfigured(block: () -> Boolean?) { bHaConfigured = block() ?: false }
		private var bHaActive: Boolean? = false; fun haActive(block: () -> Boolean?) { bHaActive = block() ?: false }
		private var bHaGlobalMaintenance: Boolean? = false; fun haGlobalMaintenance(block: () -> Boolean?) { bHaGlobalMaintenance = block() ?: false }
		private var bHaLocalMaintenance: Boolean? = false; fun haLocalMaintenance(block: () -> Boolean?) { bHaLocalMaintenance = block() ?: false }
		private var bBootTime: Int? = null; fun bootTime(block: () -> Int?) { bBootTime = block() }
		private var bCpuOverCommitTimeStamp: LocalDateTime? = LocalDateTime.now(); fun cpuOverCommitTimeStamp(block: () -> LocalDateTime?) { bCpuOverCommitTimeStamp = block() ?: LocalDateTime.now() }
		private var bHugepages: String? = ""; fun hugepages(block: () -> String?){ bHugepages = block() ?: "" }

		fun build(): VdsStatisticsEntity = VdsStatisticsEntity(bVdsId, bCpuIdle, bCpuLoad, bCpuSys, bCpuUser, bUsageMemPercent, bUsageCpuPercent, bUsageNetworkPercent, bMemShared, bSwapFree, bSwapTotal, bKsmCpuPercent, bKsmPages, bKsmState, bUpdateDate, bMemFree, bHaScore, bAnonymousHugepages, bHaConfigured, bHaActive, bHaGlobalMaintenance, bHaLocalMaintenance, bBootTime, bCpuOverCommitTimeStamp, bHugepages)
	}
	companion object {
		inline fun builder(block: Builder.() -> Unit): VdsStatisticsEntity = Builder().apply(block).build()
	}
}


