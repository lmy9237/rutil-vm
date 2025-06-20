package com.itinfo.rutilvm.api.ovirt.business

import java.io.Serializable
import java.util.concurrent.ConcurrentHashMap

/**
 * [StoragePoolStatus]
 * 스토리지풀 (a.k.a 데이터센터) 상태
 *
 * @author 이찬희 (@chanhi2000)
 */
enum class StoragePoolStatus(
	override val value: Int,
): Identifiable, Serializable {
	uninitialized(0),
	up(1),
	maintenance(2),
	not_operational(3),
	non_responsive(4),
	contend(5);

	override fun toString(): String = code
	val code: String
		get() = this@StoragePoolStatus.name.uppercase()

	private val loc: Localization
		get() = Localization.getInstance()
	val localizationKey: String
		get() = "${StoragePoolStatus::class.java.simpleName}.${this.name}"
	val kr: String
		get() = loc.findLocalizedName4StoragePoolStatus(this, "kr")
	val en: String
		get() = loc.findLocalizedName4StoragePoolStatus(this, "en")

	companion object {
		private val valueMapping: MutableMap<Int, StoragePoolStatus> = ConcurrentHashMap<Int, StoragePoolStatus>()
		private val codeMapping: MutableMap<String, StoragePoolStatus> = ConcurrentHashMap<String, StoragePoolStatus>()

		init {
			values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}

		val allStoragePoolStatus: List<StoragePoolStatus> = StoragePoolStatus.values().filterNot {
			it == uninitialized
		}

		@JvmStatic fun forValue(value: Int?): StoragePoolStatus = valueMapping[value ?: uninitialized.value] ?: uninitialized
		@JvmStatic fun forCode(value: String?): StoragePoolStatus = codeMapping[value ?: uninitialized.code] ?: uninitialized
	}
}
