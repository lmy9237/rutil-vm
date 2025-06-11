package com.itinfo.rutilvm.api.ovirt.business

import java.io.Serializable
import java.util.concurrent.ConcurrentHashMap

enum class VmStatusB(
	override val value: Int,
	val code: String,
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
		get() = this@VmStatusB.code

	val notRunning: Boolean /* '실행 중'이 아닌 상태 */
		get() = this@VmStatusB == Down ||
			this@VmStatusB == Suspended ||
			this@VmStatusB == ImageLocked ||
			this@VmStatusB == ImageIllegal

	val qualified2Migrate: Boolean /* 마이그레이션이 가능한 상태 */
		get() = this@VmStatusB == Up ||
			this@VmStatusB == PoweringUp ||
			this@VmStatusB == Paused ||
			this@VmStatusB == RebootInProgress

	val qualified4SnapshotMerge: Boolean /* 스냅샷 머지 가능한 상태 */
		get() = qualified4LiveSnapshotMerge || this@VmStatusB == Down

	val qualified4LiveSnapshotMerge: Boolean /* 라이브 스냅샷 머지 가능한 상태 */
		get() = this@VmStatusB == Up ||
			this@VmStatusB == PoweringUp ||
			this@VmStatusB == Paused ||
			this@VmStatusB == RebootInProgress

	val qualified4VmBackup: Boolean /* 가상머신 백업 가능한 상태 */
		get() = this@VmStatusB == Up ||
			this@VmStatusB == Down
	val qualified4ConsoleConnect: Boolean /* 콘솔로 가상머신 접근 가능한 상태 */
		get() = this@VmStatusB == PoweringUp ||
			this@VmStatusB == Up ||
			this@VmStatusB == RebootInProgress ||
			this@VmStatusB == PoweringDown ||
			this@VmStatusB == Paused ||
			this@VmStatusB == MigratingFrom ||
			this@VmStatusB == SavingState
	val runningOrPaused: Boolean /* 가상머신이 '실행 중'이거나 '일시정지' 인 상태*/
		get() = this@VmStatusB.running ||
			this@VmStatusB == Paused ||
			this@VmStatusB.hibernating ||
			this@VmStatusB == RestoringState
	val running: Boolean /* '실행 중' 인 상태 */
		get() = this@VmStatusB == Up ||
			this@VmStatusB == PoweringDown ||
			this@VmStatusB == PoweringUp ||
			this@VmStatusB == MigratingFrom ||
			this@VmStatusB == MigratingTo ||
			this@VmStatusB == WaitForLaunch ||
			this@VmStatusB == RebootInProgress
	val upOrPaused: Boolean
		get() = this@VmStatusB == Up ||
			this@VmStatusB == Paused

	val starting: Boolean
		get() = this@VmStatusB == WaitForLaunch ||
			this@VmStatusB == PoweringUp

	val startingOrUp: Boolean
		get() = this@VmStatusB == Up ||
			this@VmStatusB.starting

	val hibernating: Boolean /* '수면 중' 인 상태 */
		get() = this@VmStatusB == SavingState

	val downOrSuspended: Boolean
		get() = this@VmStatusB == Down ||
			this@VmStatusB == Suspended

	val qualified4QosChange: Boolean
		get() = this@VmStatusB == Up

	val guestCpuRunning: Boolean
		get() = this@VmStatusB == Up ||
			this@VmStatusB == PoweringUp

	val poweringUpOrMigrating: Boolean
		get() = when(this@VmStatusB) {
			WaitForLaunch, PoweringUp, Paused, RebootInProgress, MigratingTo
			, MigratingFrom, RestoringState -> true
			else -> false
		}

	val migrating: Boolean
		get() = this@VmStatusB == MigratingFrom ||
			this@VmStatusB == MigratingTo


	companion object {
		private val valueMapping: MutableMap<Int, VmStatusB> = ConcurrentHashMap<Int, VmStatusB>()
		private val codeMapping: MutableMap<String, VmStatusB> = ConcurrentHashMap<String, VmStatusB>()

		init {
			values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
			}
		}

		val allVmStatuses: List<VmStatusB> = VmStatusB.values().filterNot {
			it == Unassigned
		}

		@JvmStatic fun forValue(value: Int? = -1): VmStatusB = valueMapping[value] ?: Unknown
		@JvmStatic fun forCode(code: String? = "UNKNOWN"): VmStatusB = codeMapping[code?.uppercase()] ?: Unknown
	}
}
