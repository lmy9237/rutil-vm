package com.itinfo.rutilvm.api.model.setting

import com.itinfo.rutilvm.common.gson

import org.slf4j.LoggerFactory
import java.io.Serializable

private val log = LoggerFactory.getLogger(GroupVo::class.java)
/**
 * [GroupVo]
 * 
 * @property id [String]
 * @property name [String]
 * @property nameSpace [String]
 * @property roleVo [RoleVo]
 * link - roles, permissions, tags
 */
class GroupVo(
	val id: String = "",
	val name: String = "",
	val nameSpace: String = "",
	val roleVo: RoleVo = RoleVo(),
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
	    private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
	    private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
	    private var bNameSpace: String = "";fun nameSpace(block: () -> String?) { bNameSpace = block() ?: "" }
    	private var bRoleVo: RoleVo = RoleVo();fun roleVo(block: () -> RoleVo?) { bRoleVo = block() ?: RoleVo() }
		fun build(): GroupVo = GroupVo(bId, bName, bNameSpace, bRoleVo)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): GroupVo = Builder().apply(block).build()
	}
}