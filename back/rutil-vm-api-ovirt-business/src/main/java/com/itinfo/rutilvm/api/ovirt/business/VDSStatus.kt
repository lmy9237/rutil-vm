package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

/**
 * [VDSStatus]
 * 호스트 상태 값 유형
 *
 */
enum class VDSStatus(
	override val value: Int,
) : Identifiable {
	Unassigned(0),
	Down(1),
	Maintenance(2),
	Up(3),
	NonResponsive(4),
	Error(5),
	Installing(6),
	InstallFailed(7),
	Reboot(8),
	PreparingForMaintenance(9),
	NonOperational(10),
	PendingApproval(11),
	Initializing(12),
	Connecting(13),
	InstallingOS(14),
	Kdumping(15),
	Unknown(-1);

	val isEligibleForCheckUpdates: Boolean
		get() = this == Up || this == NonOperational

	val isEligibleForOnDemandCheckUpdates: Boolean
		get() = this == Up || this == NonOperational || this == Maintenance

	val isEligibleForClusterCpuConfigurationChange: Boolean
		get() = this == Up || this == PreparingForMaintenance

	val isEligibleForHostMonitoring: Boolean
		get() = this != Installing &&
				this != InstallFailed &&
				this != Reboot &&
				this != Maintenance &&
				this != PendingApproval &&
				this != InstallingOS &&
				this != Down &&
				this != Kdumping

	companion object {
		private val findMap: MutableMap<Int, VDSStatus> = ConcurrentHashMap<Int, VDSStatus>()
		init {
			VDSStatus.values().forEach { findMap[it.value] = it }
		}
		@JvmStatic fun findByValue(value: Int? = -1): VDSStatus = findMap[value] ?: Unknown
	}
}

