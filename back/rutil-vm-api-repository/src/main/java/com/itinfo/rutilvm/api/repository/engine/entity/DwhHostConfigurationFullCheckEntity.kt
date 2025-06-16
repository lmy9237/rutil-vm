package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.common.gson
import org.hibernate.annotations.Immutable
import org.hibernate.annotations.Type
import java.time.LocalDateTime
import java.util.UUID
import java.io.Serializable
import javax.persistence.Id
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Table

/**
 *
 * [DwhHostConfigurationFullCheckEntity]
 * oVirt 4.5.5의 `dwh_host_configuration_full_check_view` 뷰에 대한 엔티티
 *
 * @property hostId [UUID] 호스트 ID (기본 키)
 * @property hostUniqueId [UUID] 호스트 고유 ID
 * @property hostName [String] 호스트 이름
 * @property clusterId [UUID] 클러스터 ID
 * @property hostType [Short] 호스트 타입
 * @property fqdnOrIp [String] FQDN 또는 IP 주소
 * @property memorySizeMb [Int] 메모리 크기 (MB)
 * @property swapSizeMb [Int] 스왑 크기 (MB)
 * @property cpuModel [String] CPU 모델
 * @property numberOfCores [Short] 코어 수
 * @property numberOfSockets [Short] 소켓 수
 * @property cpuSpeedMh [Double] CPU 속도 (MHz)
 * @property hostOs [String] 호스트 OS
 * @property kernelVersion [String] 커널 버전
 * @property kvmVersion [String] KVM 버전
 * @property libvirtVersion [String] Libvirt 버전
 * @property vdsmVersion [String] VDSM 버전
 * @property vdsmPort [Int] VDSM 포트
 * @property numberOfThreads [Short] 스레드 수
 * @property hardwareManufacturer [String] 하드웨어 제조업체
 * @property hardwareProductName [String] 하드웨어 제품 이름
 * @property hardwareVersion [String] 하드웨어 버전
 * @property hardwareSerialNumber [String] 하드웨어 시리얼 넘버
 * @property createDate [LocalDateTime] 생성일
 * @property updateDate [LocalDateTime] 수정일
 */
@Entity
@Immutable
@Table(name = "dwh_host_configuration_full_check_view")
class DwhHostConfigurationFullCheckEntity(
	@Id
	@Column(name = "host_id", unique = true, nullable = false)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val hostId: UUID? = null,
	val hostUniqueId: UUID? = null, // vds_unique_id는 nullable일 수 있으므로 nullable 처리
	val hostName: String = "",
	val clusterId: UUID? = null,
	val hostType: Short? = null,
	val fqdnOrIp: String = "",
	val memorySizeMb: Int? = null,
	val swapSizeMb: Int? = null,
	val cpuModel: String = "",
	val numberOfCores: Short? = null,
	val numberOfSockets: Short? = null,
	val cpuSpeedMh: Double? = null,
	val hostOs: String = "",
	val kernelVersion: String = "",
	val kvmVersion: String = "",
	val libvirtVersion: String = "",
	val vdsmVersion: String = "",
	val vdsmPort: Int? = null,
	val numberOfThreads: Short? = null,
	val hardwareManufacturer: String = "",
	val hardwareProductName: String = "",
	val hardwareVersion: String = "",
	val hardwareSerialNumber: String = "",
	val createDate: LocalDateTime? = null,
	val updateDate: LocalDateTime? = null,

) : Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder() { // host_id는 필수 값이므로 Builder 생성 시 받도록 합니다.
		private var bHostId: UUID? = null; fun hostId(block: () -> UUID?) { bHostId = block() }
		private var bHostUniqueId: UUID? = null; fun hostUniqueId(block: () -> UUID?) { bHostUniqueId = block() }
		private var bHostName: String = ""; fun hostName(block: () -> String?) { bHostName = block() ?: "" }
		private var bClusterId: UUID? = null; fun clusterId(block: () -> UUID?) { bClusterId = block() }
		private var bHostType: Short? = null; fun hostType(block: () -> Short?) { bHostType = block() }
		private var bFqdnOrIp: String = ""; fun fqdnOrIp(block: () -> String?) { bFqdnOrIp = block() ?: "" }
		private var bMemorySizeMb: Int? = null; fun memorySizeMb(block: () -> Int?) { bMemorySizeMb = block() }
		private var bSwapSizeMb: Int? = null; fun swapSizeMb(block: () -> Int?) { bSwapSizeMb = block() }
		private var bCpuModel: String = ""; fun cpuModel(block: () -> String?) { bCpuModel = block() ?: "" }
		private var bNumberOfCores: Short? = null; fun numberOfCores(block: () -> Short?) { bNumberOfCores = block() }
		private var bNumberOfSockets: Short? = null; fun numberOfSockets(block: () -> Short?) { bNumberOfSockets = block() }
		private var bCpuSpeedMh: Double? = null; fun cpuSpeedMh(block: () -> Double?) { bCpuSpeedMh = block() }
		private var bHostOs: String = ""; fun hostOs(block: () -> String?) { bHostOs = block() ?: "" }
		private var bKernelVersion: String = ""; fun kernelVersion(block: () -> String?) { bKernelVersion = block() ?: "" }
		private var bKvmVersion: String = ""; fun kvmVersion(block: () -> String?) { bKvmVersion = block() ?: "" }
		private var bLibvirtVersion: String = ""; fun libvirtVersion(block: () -> String?) { bLibvirtVersion = block() ?: "" }
		private var bVdsmVersion: String = ""; fun vdsmVersion(block: () -> String?) { bVdsmVersion = block() ?: "" }
		private var bVdsmPort: Int? = null; fun vdsmPort(block: () -> Int?) { bVdsmPort = block() }
		private var bNumberOfThreads: Short? = null; fun numberOfThreads(block: () -> Short?) { bNumberOfThreads = block() }
		private var bHardwareManufacturer: String = ""; fun hardwareManufacturer(block: () -> String?) { bHardwareManufacturer = block() ?: "" }
		private var bHardwareProductName: String = ""; fun hardwareProductName(block: () -> String?) { bHardwareProductName = block() ?: "" }
		private var bHardwareVersion: String = ""; fun hardwareVersion(block: () -> String?) { bHardwareVersion = block() ?: "" }
		private var bHardwareSerialNumber: String = ""; fun hardwareSerialNumber(block: () -> String?) { bHardwareSerialNumber = block() ?: "" }
		private var bCreateDate: LocalDateTime? = null; fun createDate(block: () -> LocalDateTime?) { bCreateDate = block() }
		private var bUpdateDate: LocalDateTime? = null; fun updateDate(block: () -> LocalDateTime?) { bUpdateDate = block() }

		fun build(): DwhHostConfigurationFullCheckEntity = DwhHostConfigurationFullCheckEntity( bHostId, bHostUniqueId, bHostName, bClusterId, bHostType, bFqdnOrIp, bMemorySizeMb, bSwapSizeMb, bCpuModel, bNumberOfCores, bNumberOfSockets, bCpuSpeedMh, bHostOs, bKernelVersion, bKvmVersion, bLibvirtVersion, bVdsmVersion, bVdsmPort, bNumberOfThreads, bHardwareManufacturer, bHardwareProductName, bHardwareVersion, bHardwareSerialNumber, bCreateDate, bUpdateDate,)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): DwhHostConfigurationFullCheckEntity = Builder().apply(block).build()
	}
}
