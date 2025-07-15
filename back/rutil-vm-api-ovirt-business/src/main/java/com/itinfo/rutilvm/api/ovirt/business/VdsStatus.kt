package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

/**
 * [VdsStatus]
 * 호스트 상태 값 유형
 *
 * @author 이찬희 (@chanhi2000)
 */
enum class VdsStatus(
	override val value: Int,
) : Identifiable {
	unassigned(0),
	down(1),
	maintenance(2),
	up(3),
	non_responsive(4),
	error(5),
	installing(6),
	install_failed(7),
	reboot(8),
	preparing_for_maintenance(9),
	non_operational(10),
	pending_approval(11),
	initializing(12),
	connecting(13),
	installing_os(14),
	kdumping(15),
	unknown(-1);

	override fun toString(): String = code
	val code: String
		get() = this@VdsStatus.name.uppercase()

	val isEligibleForCheckUpdates: Boolean
		get() = this == up ||
			this == non_operational

	val isEligibleForOnDemandCheckUpdates: Boolean
		get() = this == up ||
			this == non_operational ||
			this == maintenance

	val isEligibleForClusterCpuConfigurationChange: Boolean
		get() = this == up ||
			this == preparing_for_maintenance

	val isEligibleForHostMonitoring: Boolean
		get() = this != installing &&
				this != install_failed &&
				this != reboot &&
				this != maintenance &&
				this != pending_approval &&
				this != installing_os &&
				this != down &&
				this != kdumping

	val localizationKey: String				get() = "${VdsStatus::class.java.simpleName}.${this.name}"
	private val loc: Localization			get() = Localization.getInstance()
	val en: String							get() = loc.findLocalizedName4VdsStatus(this, "en")
	val kr: String							get() = loc.findLocalizedName4VdsStatus(this, "kr")

	companion object {
		private val valueMapping: MutableMap<Int, VdsStatus> = ConcurrentHashMap<Int, VdsStatus>()
		private val codeMapping: MutableMap<String, VdsStatus> = ConcurrentHashMap<String, VdsStatus>()

		init {
			VdsStatus.values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}
		@JvmStatic fun forValue(value: Int?): VdsStatus = valueMapping[value ?: unknown.value] ?: unknown
		@JvmStatic fun forCode(code: String?): VdsStatus = codeMapping[code ?: unknown.code] ?: unknown
		val allVdsStatuses: List<VdsStatus> = VdsStatus.values().toList()
	}
}

