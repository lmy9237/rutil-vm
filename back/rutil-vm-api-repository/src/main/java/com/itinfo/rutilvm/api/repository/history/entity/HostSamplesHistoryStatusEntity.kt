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

private val log = LoggerFactory.getLogger(HostSamplesHistoryStatusEntity::class.java)

/**
 * [HostSamplesHistoryStatusEntity]
 *
 * @property historyDatetime [LocalDateTime]
 * @property avgMemoryUsage [Int]
 * @property avgCpuUsage [Int]
 */
@Entity
@Table(name="host_samples_history", schema="public")
class HostSamplesHistoryStatusEntity(
	@Id
	val historyDatetime: LocalDateTime = LocalDateTime.MIN,
	val avgMemoryUsage: Int = -1,
	val avgCpuUsage: Int = -1,
): Serializable {
	override fun toString(): String = gson.toJson(this)

	class Builder {
		private var bHistoryDatetime: LocalDateTime = LocalDateTime.MIN;fun historyDatetime(block: () -> LocalDateTime?) { bHistoryDatetime = block() ?: LocalDateTime.MIN }
		private var bAvgMemoryUsage: Int = 0;fun avgMemoryUsage(block: () -> Int?) { bAvgMemoryUsage = block() ?: 0 }
		private var bAvgCpuUsage: Int = 0;fun avgCpuUsage(block: () -> Int?) { bAvgCpuUsage = block() ?: 0 }
		fun build(): HostSamplesHistoryStatusEntity = HostSamplesHistoryStatusEntity(bHistoryDatetime, bAvgMemoryUsage, bAvgCpuUsage)
	}

	companion object {
		inline fun builder(block: HostSamplesHistoryStatusEntity.Builder.() -> Unit): HostSamplesHistoryStatusEntity = HostSamplesHistoryStatusEntity.Builder().apply(block).build()
	}
}
