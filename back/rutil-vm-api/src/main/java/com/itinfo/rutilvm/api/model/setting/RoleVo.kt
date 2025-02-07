 package com.itinfo.rutilvm.api.model.setting

import com.itinfo.rutilvm.common.gson

import org.slf4j.LoggerFactory
import java.io.Serializable

private val log = LoggerFactory.getLogger(RoleVo::class.java)
/**
 * [RoleVo]
 * 
 * @property id [String]
 * @property name [String]
 * @property description [String]
 * @property isAdministrative [Boolean]
 * @property isMutable [Boolean]
 */
class RoleVo(
	val id: String = "",
	val name: String = "",
	val description: String = "",
	val isAdministrative: Boolean = false,
	val isMutable: Boolean = false,

    // link - permits
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bDescription: String = "";fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bIsAdministrative: Boolean = false;fun isAdministrative(block: () -> Boolean?) { bIsAdministrative = block() ?: false }
		private var bIsMutable: Boolean = false;fun isMutable(block: () -> Boolean?) { bIsMutable = block() ?: false }
		fun build(): RoleVo = RoleVo(bId, bName, bDescription, bIsAdministrative, bIsMutable)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): RoleVo = Builder().apply(block).build()
	}
}