package com.itinfo.dao.history

import com.itinfo.dao.gson
import com.itinfo.dao.toFormatted
import com.itinfo.model.StorageDomainUsageVo
import com.itinfo.model.StorageVo

import java.io.Serializable
import java.util.UUID
import java.time.LocalDateTime
import javax.persistence.Entity
import javax.persistence.Table
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Column
import javax.persistence.Id

/**
 * [StorageDomainHourlyHistory]
 * ovirt_engine_history 엔티티: STORAGE_DOMAIN_HOURLY_HISTORY
 *
 * STORAGE-DOMAINS-SQL > STORAGE-DOMAINS
 * @see com.itinfo.model.StorageDomainUsageVo
 */
@Entity
@Table(name = "STORAGE_DOMAIN_HOURLY_HISTORY")
data class StorageDomainHourlyHistory(
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(unique = true, nullable = false)
	val historyId: Int,
	var historyDatetime: LocalDateTime,
	@org.hibernate.annotations.Type(type="org.hibernate.type.PostgresUUIDType")
	var storageDomainId: UUID,

	@Column(nullable=true)
	var availableDiskSizeGb: Int? = 0,

	@Column(nullable=true)
	var usedDiskSizeGb: Int? = 0,

	@Column(nullable=true)
	var storageConfigurationVersion: Int? = 0,

	var storageDomainStatus: Int,
	var minutesInStatus: Int,
): Serializable {
	override fun toString(): String = gson.toJson(this)
}

fun StorageDomainHourlyHistory.toStorageDomainUsageVo(): StorageDomainUsageVo = StorageDomainUsageVo.storageDomainUsageVo {
	storageDomainId { this@toStorageDomainUsageVo.storageDomainId.toString() }
	availableDiskSizeGb { this@toStorageDomainUsageVo.availableDiskSizeGb }
	usedDiskSizeGb { this@toStorageDomainUsageVo.usedDiskSizeGb }
	storageDomainStatus { this@toStorageDomainUsageVo.storageDomainStatus }
	historyDatetime {this@toStorageDomainUsageVo.historyDatetime.toFormatted }
}

fun List<StorageDomainHourlyHistory>.toStorageDomainUsageVos(): List<StorageDomainUsageVo> =
	this.map { it.toStorageDomainUsageVo() }

class StorageDomainHourlyHistoryDashboard(
	val historyDatetime: String,
	val availableDiskSizeGb: Double,
	val usedDiskSizeGb: Double
): Serializable {
	class Builder {
		private var bHistoryDatetime: String = "";fun historyDatetime(block: () -> String?) { bHistoryDatetime = block() ?: "" }
		private var bAvailableDiskSizeGb: Double = 0.0;fun availableDiskSizeGb(block: () -> Double?) { bAvailableDiskSizeGb = block() ?: 0.0 }
		private var bUsedDiskSizeGb: Double = 0.0;fun usedDiskSizeGb(block: () -> Double?) { bUsedDiskSizeGb = block() ?: 0.0 }
		fun build(): StorageDomainHourlyHistoryDashboard = StorageDomainHourlyHistoryDashboard(bHistoryDatetime, bAvailableDiskSizeGb, bUsedDiskSizeGb)
	}
	companion object {
		@JvmStatic inline fun storageDomainHourlyHistoryDashboard(block: Builder.() -> Unit): StorageDomainHourlyHistoryDashboard = Builder().apply(block).build()
	}
}

fun List<StorageDomainHourlyHistory>.toDashboardStatistics(): List<StorageDomainHourlyHistoryDashboard> =
	this.sortedByDescending { it.historyDatetime }
		.take(360)
		.groupBy { it.historyDatetime }
		.map {
			return@map StorageDomainHourlyHistoryDashboard.storageDomainHourlyHistoryDashboard {
				historyDatetime { it.key.toFormatted }
				availableDiskSizeGb { it.value.mapNotNull { p -> p.availableDiskSizeGb }.average() }
				usedDiskSizeGb { it.value.mapNotNull { p -> p.usedDiskSizeGb }.average() }
			}
		}
/*
DASHBOARD.retrieveStorages

	SELECT 
		EXTRACT(EPOCH FROM HISTORY_DATETIME AT TIME ZONE 'ASIA/SEOUL') * 1000 AS HISTORY_DATETIME
		, SUM(AVAILABLE_DISK_SIZE_GB) AS AVAILABLE_DISK_SIZE_GB
		, SUM(USED_DISK_SIZE_GB) AS USED_DISK_SIZE_GB
	FROM 
		STORAGE_DOMAIN_HOURLY_HISTORY 
	WHERE 1=1 
	AND STORAGE_DOMAIN_ID::TEXT IN (:storageDomainIds)
	AND STORAGE_DOMAIN_STATUS = '1'
	GROUP BY HISTORY_DATETIME 
	ORDER BY HISTORY_DATETIME DESC
	LIMIT 360
*/

fun StorageDomainHourlyHistoryDashboard.toStorageVo(): StorageVo = StorageVo.storageVo {
	storageDomainId { "" }
	historyDatetime { this@toStorageVo.historyDatetime }
	availableDiskSizeGb { this@toStorageVo.availableDiskSizeGb.toInt() }
	usedDiskSizeGb { this@toStorageVo.usedDiskSizeGb.toInt() }
	storageDomainStatus { 0 }
}

fun List<StorageDomainHourlyHistoryDashboard>.toStorageVos(): List<StorageVo> =
	this.map { it.toStorageVo() }