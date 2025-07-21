package com.itinfo.rutilvm.api.repository.history.dto

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.common.gson
import java.io.Serializable

class UsagePerDto (
	val totalCpuUsagePercent: Double = 0.0,
	val totalMemoryUsagePercent: Double = 0.0,
	val totalStorageUsagePercent: Double = 0.0,
	val totalCpuCore: Int = 0,
	val usedCpuCore: Int = 0,
	val totalMemoryMB: Double = 0.0,
	val usedMemoryMB: Double = 0.0,
	val totalStorageGB: Double = 0.0,
	val usedStorageGB: Double = 0.0,
): Serializable {
	override fun toString(): String = gson.toJson(this)

	class Builder {
		private var bTotalCpuUsagePercent: Double = 0.0;fun totalCpuUsagePercent(block: () -> Double?) { bTotalCpuUsagePercent = block() ?: 0.0 }
		private var bTotalMemoryUsagePercent: Double = 0.0;fun totalMemoryUsagePercent(block: () -> Double?) { bTotalMemoryUsagePercent = block() ?: 0.0 }
		private var bTotalStorageUsagePercent: Double = 0.0;fun totalStorageUsagePercent(block: () -> Double?) { bTotalStorageUsagePercent = block() ?: 0.0 }
		private var bTotalCpuCore: Int = 0; fun totalCpuCore(block: () -> Int?) { bTotalCpuCore = block() ?: 0 }
		private var bUsedCpuCore: Int = 0; fun usedCpuCore(block: () -> Int?) { bUsedCpuCore = block() ?: 0 }
		private var bTotalMemoryGB: Double = 0.0;fun totalMemoryGB(block: () -> Double?) { bTotalMemoryGB = block() ?: 0.0 }
		private var bUsedMemoryGB: Double = 0.0;fun usedMemoryGB(block: () -> Double?) { bUsedMemoryGB = block() ?: 0.0 }
		private var bTotalStorageGB: Double = 0.0;fun totalStorageGB(block: () -> Double?) { bTotalStorageGB = block() ?: 0.0 }
		private var bUsedStorageGB: Double = 0.0;fun usedStorageGB(block: () -> Double?) { bUsedStorageGB = block() ?: 0.0 }

		fun build(): UsagePerDto = UsagePerDto(bTotalCpuUsagePercent, bTotalMemoryUsagePercent, bTotalStorageUsagePercent, bTotalCpuCore, bUsedCpuCore, bTotalMemoryGB, bUsedMemoryGB, bTotalStorageGB, bUsedStorageGB,
		)
	}

	companion object {
		private val log by LoggerDelegate()
		inline fun builder(block: Builder.() -> Unit): UsagePerDto = Builder().apply(block).build()
	}
}

