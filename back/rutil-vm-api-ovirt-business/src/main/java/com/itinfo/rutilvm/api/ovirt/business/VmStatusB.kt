package com.itinfo.rutilvm.api.ovirt.business

import java.io.Serializable
import java.util.concurrent.ConcurrentHashMap

/**
 * [VmStatusB]
 * 가상머신 상태
 *
 * @author 이찬희 (@chanhi2000)
 */
enum class VmStatusB(
	override val value: Int,
): Identifiable, Serializable {
	unassigned(-1),
	down(0),
	up(1),
	powering_up(2),
	paused(4),
	migrating_from(5),
	migrating_to(6),
	unknown(7),
	not_responding(8),
	wait_for_launch(9),
	reboot_in_progress(10),
	saving_state(11),
	restoring_state(12),
	suspended(13),
	image_illegal(14),
	image_locked(15),
	powering_down(16);

	override fun toString(): String = this@VmStatusB.code
	val code: String
		get() = this@VmStatusB.name.lowercase()

	val notRunning: Boolean /* '실행 중'이 아닌 상태 */
		get() = this@VmStatusB == down ||
			this@VmStatusB == suspended ||
			this@VmStatusB == image_locked ||
			this@VmStatusB == image_illegal

	val qualified2Migrate: Boolean /* 마이그레이션이 가능한 상태 */
		get() = this@VmStatusB == up ||
			this@VmStatusB == powering_up ||
			this@VmStatusB == paused ||
			this@VmStatusB == reboot_in_progress

	val qualified4SnapshotMerge: Boolean /* 스냅샷 머지 가능한 상태 */
		get() = qualified4LiveSnapshotMerge || this@VmStatusB == down

	val qualified4LiveSnapshotMerge: Boolean /* 라이브 스냅샷 머지 가능한 상태 */
		get() = this@VmStatusB == up ||
			this@VmStatusB == powering_up ||
			this@VmStatusB == paused ||
			this@VmStatusB == reboot_in_progress

	val qualified4VmBackup: Boolean /* 가상머신 백업 가능한 상태 */
		get() = this@VmStatusB == up ||
			this@VmStatusB == down

	val qualified4ConsoleConnect: Boolean /* 콘솔로 가상머신 접근 가능한 상태 */
		get() = this@VmStatusB == powering_up ||
			this@VmStatusB == up ||
			this@VmStatusB == reboot_in_progress ||
			this@VmStatusB == powering_down ||
			this@VmStatusB == paused ||
			this@VmStatusB == migrating_from ||
			this@VmStatusB == saving_state

	val qualified4PowerDown: Boolean /* 가상머신 종료 가능한 상태*/
		get() = this@VmStatusB == up ||
			this@VmStatusB == powering_down ||
			this@VmStatusB == powering_up ||
			this@VmStatusB == suspended

	val runningOrPaused: Boolean /* 가상머신이 '실행 중'이거나 '일시정지' 인 상태*/
		get() = this@VmStatusB.running ||
			this@VmStatusB == paused ||
			this@VmStatusB.hibernating ||
			this@VmStatusB == restoring_state

	val running: Boolean /* '실행 중' 인 상태 */
		get() = this@VmStatusB == up ||
			this@VmStatusB == powering_down ||
			this@VmStatusB == powering_up ||
			this@VmStatusB == migrating_from ||
			this@VmStatusB == migrating_to ||
			this@VmStatusB == wait_for_launch ||
			this@VmStatusB == reboot_in_progress

	val upOrPaused: Boolean
		get() = this@VmStatusB == up ||
			this@VmStatusB == paused ||
			this@VmStatusB == suspended

	val starting: Boolean
		get() = this@VmStatusB == wait_for_launch ||
			this@VmStatusB == powering_up

	val startingOrUp: Boolean
		get() = this@VmStatusB == up ||
			this@VmStatusB.starting

	val hibernating: Boolean /* '수면 중' 인 상태 */
		get() = this@VmStatusB == saving_state

	val downOrSuspended: Boolean
		get() = this@VmStatusB == down ||
			this@VmStatusB == suspended

	val qualified4QosChange: Boolean
		get() = this@VmStatusB == up

	val guestCpuRunning: Boolean
		get() = this@VmStatusB == up ||
			this@VmStatusB == powering_up

	val poweringUpOrMigrating: Boolean
		get() = when(this@VmStatusB) {
			wait_for_launch, powering_up, paused, reboot_in_progress, migrating_to
			, migrating_from, restoring_state -> true
			else -> false
		}

	val migrating: Boolean
		get() = this@VmStatusB == migrating_from ||
			this@VmStatusB == migrating_to

	private val loc: Localization
		get() = Localization.getInstance()
	val localizationKey: String
		get() = "${VmStatusB::class.java.simpleName}.${this.name}"
	val kr: String
		get() = loc.findLocalizedName4VmStatusB(this, "kr")
	val en: String
		get() = loc.findLocalizedName4VmStatusB(this, "en")

	companion object {
		private val valueMapping: MutableMap<Int, VmStatusB> = ConcurrentHashMap<Int, VmStatusB>()
		private val codeMapping: MutableMap<String, VmStatusB> = ConcurrentHashMap<String, VmStatusB>()

		init {
			values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}

		val allVmStatuses: List<VmStatusB> = VmStatusB.values().toList()

		@JvmStatic fun forValue(value: Int?): VmStatusB = valueMapping[value ?: unassigned.value] ?: unassigned
		@JvmStatic fun forCode(code: String?): VmStatusB = codeMapping[code ?: unassigned.code] ?: unassigned
	}
}
