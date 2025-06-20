package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

/**
 * [MigrationBandwidthLimitType]
 * 마이그레이션 대역폭 제한 유형
 *
 * @author 이찬희 (@chanhi2000)
 */
enum class MigrationBandwidthLimitType(

) {
	/**
	 * <ul>
	 *     <li>If QoS of migration network is defined then
	 *     {@link org.ovirt.engine.core.common.businessentities.network.HostNetworkQos#outAverageUpperlimit}</li>
	 *     <li>Else if {@link org.ovirt.engine.core.common.businessentities.network.NetworkInterface#speed} exists for
	 *     both sending and receiving network interfaces then the network saturation constant times min of these link
	 *     speeds.
	 *     <li>Otherwise use vdsm configuration as in {@link #VDSM_CONFIG}</li>
	 * </ul>
	 */
	auto,
	/**
	 * Migration bandwidth controlled by local vdsm configuration on source host.<br/>
	 * <code>migration_progress_timeout</code> option
	 */
	hypervisor_default,
	/**
	 * User defined
	 */
	custom;

	val localizationKey: String
		get() = "${MigrationBandwidthLimitType::class.java.simpleName}.${this.name}"
	private val loc: Localization
		get() = Localization.getInstance()
	val en: String
		get() = loc.findLocalizedName4MigrationBandwidthLimitType(this, "en")
	val kr: String
		get() = loc.findLocalizedName4MigrationBandwidthLimitType(this, "kr")

	override fun toString(): String = code
	val code: String
		get() = this@MigrationBandwidthLimitType.name.uppercase()

	companion object {
		// private val valueMapping: MutableMap<Int, MigrationBandwidthLimitType> = ConcurrentHashMap<Int, MigrationBandwidthLimitType>()
		private val codeMapping: MutableMap<String, MigrationBandwidthLimitType> = ConcurrentHashMap<String, MigrationBandwidthLimitType>()
		init {
			values().forEach {
				// valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}
		// @JvmStatic fun forValue(value: Int?): MigrationBandwidthLimitType = valueMapping[value ?: auto.code] ?: auto
		@JvmStatic fun forCode(code: String?): MigrationBandwidthLimitType = codeMapping[code ?: auto.code] ?: auto
		val allMigrationBandwidthLimitTypes: List<MigrationBandwidthLimitType> = MigrationBandwidthLimitType.values().toList()
	}
}
