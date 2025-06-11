package com.itinfo.rutilvm.api.ovirt.business

import java.io.Serializable
import java.util.concurrent.ConcurrentHashMap

enum class VmStatus(
	override val value: Int,
	val description: String,
): Identifiable, Serializable {
	Unassigned(-1, "UNASSIGNED"),
	Down(0, "DOWN"),
	Up(1, "UP"),
	PoweringUp(2, "POWERING_UP"),
	Paused(4, "PAUSED"),
	MigratingFrom(5, "MIGRATING_FROM"),
	MigratingTo(6, "MIGRATING_TO"),
	Unknown(7, "UNKNOWN"),
	NotResponding(8, "NOT_RESPONDING"),
	WaitForLaunch(9, "WAIT_FOR_LAUNCH"),
	RebootInProgress(10, "REBOOT_IN_PROGRESS"),
	SavingState(11, "SAVING_STATE"),
	RestoringState(12, "RESTORING_STATE"),
	Suspended(13, "SUSPENDED"),
	ImageIllegal(14, "IMAGE_ILLEGAL"),
	ImageLocked(15, "IMAGE_LOCKED"),
	PoweringDown(16, "POWERING_DOWN");

	val label: String
		get() = this@VmStatus.description.lowercase()


	companion object {
		private val valueMapping: MutableMap<Int, VmStatus> = ConcurrentHashMap<Int, VmStatus>()
		private val descriptionMapping: MutableMap<String, VmStatus> = ConcurrentHashMap<String, VmStatus>()

		init {
			values().forEach {
				valueMapping[it.value] = it
				descriptionMapping[it.description.lowercase()] = it
			}
		}

		val allContentTypes: List<VmStatus> = VmStatus.values().filterNot {
			it == Unassigned
		}

		@JvmStatic fun forValue(value: Int? = -1): VmStatus = valueMapping[value] ?: Unassigned
		@JvmStatic fun forDescription(value: String = "Unassigned"): VmStatus = descriptionMapping[value.lowercase()] ?: Unassigned
	}
}
