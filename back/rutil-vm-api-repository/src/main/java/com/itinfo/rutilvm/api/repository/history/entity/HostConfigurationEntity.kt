package com.itinfo.rutilvm.api.repository.history.entity

import com.itinfo.rutilvm.common.gson

import org.slf4j.LoggerFactory
import java.io.Serializable
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID
import org.hibernate.annotations.Type

private val log = LoggerFactory.getLogger(HostConfigurationEntity::class.java)

/**
 * [HostConfigurationEntity]
 *
 * @property historyId [Int]
 * @property hostId [UUID]
 * @property hostUniqueId [String]
 * @property hostName [String]
 * @property clusterId [UUID]
 * @property hostType [Int]
 * @property fqdnOrIp [String]
 * @property memorySizeMb [Int]
 * @property swapSizeMb [Int]
 * @property cpuModel [String]
 * @property numberOfCores [Int]
 * @property hostOs [String]
 * @property kernelVersion [String]
 * @property kvmVersion [String]
 * @property vdsmVersion [String]
 * @property vdsmPort [Int]
 * @property clusterConfigurationVersion [Int]
 * @property createDate [LocalDateTime]
 * @property updateDate [LocalDateTime]
 * @property deleteDate [LocalDateTime]
 * @property numberOfSockets [Int]
 * @property cpuSpeedMh [BigDecimal]
 * @property threadsPerCore [Int]
 * @property hardwareManufacturer [String]
 * @property hardwareProductName [String]
 * @property hardwareVersion [String]
 * @property hardwareSerialNumber [String]
 * @property numberOfThreads [Int]
 */
@Entity
@Table(name="host_configuration", schema="public")
class HostConfigurationEntity(
	@Id
	@Column(unique = true, nullable = false)
	val historyId: Int = -1,
	
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val hostId: UUID? = null,

	val hostUniqueId: String = "",
	val hostName: String = "",

	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val clusterId: UUID? = null,

	val hostType: Int = -1,
	val fqdnOrIp: String = "",

	@Column(nullable = true)
	val memorySizeMb: Int? = null,
	@Column(nullable = true)
	val swapSizeMb: Int? = null,
	val cpuModel: String = "",
	@Column(nullable = true)
	val numberOfCores: Int? = null,
	val hostOs: String = "",
	val kernelVersion: String = "",
	val kvmVersion: String = "",
	val vdsmVersion: String = "",
	@Column(nullable = true)
	val vdsmPort: Int? = null,
	val clusterConfigurationVersion: Int = -1,
	val createDate: LocalDateTime = LocalDateTime.MIN,
	val updateDate: LocalDateTime = LocalDateTime.MIN,
	val deleteDate: LocalDateTime = LocalDateTime.MIN,
	@Column(nullable = true)
	val numberOfSockets: Int? = null,
	val cpuSpeedMh: BigDecimal = BigDecimal.ZERO,
	@Column(nullable = true)
	val threadsPerCore: Int? = null,
	val hardwareManufacturer: String = "",
	val hardwareProductName: String = "",
	val hardwareVersion: String = "",
	val hardwareSerialNumber: String = "",
	@Column(nullable = true)
	val numberOfThreads: Int? = null,
): Serializable {
	override fun toString(): String = gson.toJson(this)

	class Builder {
		private var bHistoryId: Int = -1;fun HistoryId(block: () -> Int?) { bHistoryId = block() ?: -1 }
		private var bHostId: UUID? = null;fun HostId(block: () -> UUID?) { bHostId = block() }
		private var bHostUniqueId: String = "";fun HostUniqueId(block: () -> String?) { bHostUniqueId = block() ?: "" }
		private var bHostName: String = "";fun HostName(block: () -> String?) { bHostName = block() ?: "" }
		private var bClusterId: UUID? = null;fun ClusterId(block: () -> UUID?) { bClusterId = block() }
		private var bHostType: Int = -1;fun HostType(block: () -> Int?) { bHostType = block() ?: -1 }
		private var bFqdnOrIp: String = "";fun FqdnOrIp(block: () -> String?) { bFqdnOrIp = block() ?: "" }
		private var bMemorySizeMb: Int = -1;fun MemorySizeMb(block: () -> Int?) { bMemorySizeMb = block() ?: -1 }
		private var bSwapSizeMb: Int = -1;fun SwapSizeMb(block: () -> Int?) { bSwapSizeMb = block() ?: -1 }
		private var bCpuModel: String = "";fun CpuModel(block: () -> String?) { bCpuModel = block() ?: "" }
		private var bNumberOfCores: Int = -1;fun NumberOfCores(block: () -> Int?) { bNumberOfCores = block() ?: -1 }
		private var bHostOs: String = "";fun HostOs(block: () -> String?) { bHostOs = block() ?: "" }
		private var bKernelVersion: String = "";fun KernelVersion(block: () -> String?) { bKernelVersion = block() ?: "" }
		private var bKvmVersion: String = "";fun KvmVersion(block: () -> String?) { bKvmVersion = block() ?: "" }
		private var bVdsmVersion: String = "";fun VdsmVersion(block: () -> String?) { bVdsmVersion = block() ?: "" }
		private var bVdsmPort: Int = -1;fun VdsmPort(block: () -> Int?) { bVdsmPort = block() ?: -1 }
		private var bClusterConfigurationVersion: Int = -1;fun ClusterConfigurationVersion(block: () -> Int?) { bClusterConfigurationVersion = block() ?: -1 }
		private var bCreateDate: LocalDateTime = LocalDateTime.MIN;fun CreateDate(block: () -> LocalDateTime?) { bCreateDate = block() ?: LocalDateTime.MIN }
		private var bUpdateDate: LocalDateTime = LocalDateTime.MIN;fun UpdateDate(block: () -> LocalDateTime?) { bUpdateDate = block() ?: LocalDateTime.MIN }
		private var bDeleteDate: LocalDateTime = LocalDateTime.MIN;fun DeleteDate(block: () -> LocalDateTime?) { bDeleteDate = block() ?: LocalDateTime.MIN }
		private var bNumberOfSockets: Int = -1;fun NumberOfSockets(block: () -> Int?) { bNumberOfSockets = block() ?: -1 }
		private var bCpuSpeedMh: BigDecimal = BigDecimal.ZERO;fun CpuSpeedMh(block: () -> BigDecimal?) { bCpuSpeedMh = block() ?: BigDecimal.ZERO }
		private var bThreadsPerCore: Int = -1;fun ThreadsPerCore(block: () -> Int?) { bThreadsPerCore = block() ?: -1 }
		private var bHardwareManufacturer: String = "";fun HardwareManufacturer(block: () -> String?) { bHardwareManufacturer = block() ?: "" }
		private var bHardwareProductName: String = "";fun HardwareProductName(block: () -> String?) { bHardwareProductName = block() ?: "" }
		private var bHardwareVersion: String = "";fun HardwareVersion(block: () -> String?) { bHardwareVersion = block() ?: "" }
		private var bHardwareSerialNumber: String = "";fun HardwareSerialNumber(block: () -> String?) { bHardwareSerialNumber = block() ?: "" }
		private var bNumberOfThreads: Int = -1;fun NumberOfThreads(block: () -> Int?) { bNumberOfThreads = block() ?: -1 }
		fun build(): HostConfigurationEntity = HostConfigurationEntity(bHistoryId, bHostId, bHostUniqueId, bHostName, bClusterId, bHostType, bFqdnOrIp, bMemorySizeMb, bSwapSizeMb, bCpuModel, bNumberOfCores, bHostOs, bKernelVersion, bKvmVersion, bVdsmVersion, bVdsmPort, bClusterConfigurationVersion, bCreateDate, bUpdateDate, bDeleteDate, bNumberOfSockets, bCpuSpeedMh, bThreadsPerCore, bHardwareManufacturer, bHardwareProductName, bHardwareVersion, bHardwareSerialNumber, bNumberOfThreads)
	}

	companion object {
		inline fun builder(block: HostConfigurationEntity.Builder.() -> Unit): HostConfigurationEntity = HostConfigurationEntity.Builder().apply(block).build()
	}
}

