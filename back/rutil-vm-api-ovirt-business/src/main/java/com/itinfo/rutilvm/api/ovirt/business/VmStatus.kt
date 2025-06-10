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
	PoweringUp(2, "POWERINGUP"),
	Paused(4, "PAUSED"),
	MigratingFrom(5, "MIGRATINGFROM"),
	MigratingTo(6, "MIGRATINGTO"),
	Unknown(7, "UNKNOWN"),
	NotResponding(8, "NOTRESPONDING"),
	WaitForLaunch(9, "WAITFORLAUNCH"),
	RebootInProgress(10, "REBOOTINPROGRESS"),
	SavingState(11, "SAVINGSTATE"),
	RestoringState(12, "RESTORINGSTATE"),
	Suspended(13, "SUSPENDED"),
	ImageIllegal(14, "IMAGEILLEGAL"),
	ImageLocked(15, "IMAGELOCKED"),
	PoweringDown(16, "POWERINGDOWN");

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
