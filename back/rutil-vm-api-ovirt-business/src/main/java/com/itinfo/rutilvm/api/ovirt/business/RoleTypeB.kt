package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

/**
 * [RoleTypeB]
 * 역할 유형
 *
 * @author 이찬희 (@chanhi2000)
 */
enum class RoleTypeB(
	override val value: Int,
): Identifiable {
	admin(1),
	user(2);

	override fun toString(): String = code
	val code: String
		get() = this@RoleTypeB.name.uppercase()

	val localizationKey: String		get() = "${RoleTypeB::class.java.simpleName}.${this.name}"
	private val loc: Localization	get() = Localization.getInstance()
	val en: String					get() = loc.findLocalizedName4RoleType(this, "en")
	val kr: String					get() = loc.findLocalizedName4RoleType(this, "kr")
	companion object {
		private val valueMapping: MutableMap<Int, RoleTypeB> = ConcurrentHashMap<Int, RoleTypeB>()
		private val codeMapping: MutableMap<String, RoleTypeB> = ConcurrentHashMap<String, RoleTypeB>()

		init {
			values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}

		val allRoleTypes: List<RoleTypeB> = RoleTypeB.values().toList()
		@JvmStatic fun forValue(value: Int?): RoleTypeB = valueMapping[value ?: admin.value] ?: admin
		@JvmStatic fun forCode(value: String?): RoleTypeB = codeMapping[value ?: admin.code] ?: admin
	}
}
