package com.itinfo.rutilvm.api.model.setting

import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.api.model.IdentifiedVo
import java.io.Serializable

/**
 * [UserOptionVo]
 *
 * @property id [String]
 * @property name [String]
 * @property content [String]
 * @property userVo [IdentifiedVo]
 */
class UserOptionVo(
    val id: String = "",
    val name: String = "",
    val content: String = "",
    val userVo: IdentifiedVo = IdentifiedVo()
): Serializable {
    override fun toString(): String =
        gson.toJson(this)

    class Builder {
        private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
        private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
        private var bContent: String = ""; fun content(block: () -> String?) { bContent = block() ?: "" }
        private var bUserVo: IdentifiedVo = IdentifiedVo(); fun userVo(block: () -> IdentifiedVo?) { bUserVo = block() ?: IdentifiedVo() }

        fun build(): UserOptionVo = UserOptionVo(bId, bName, bContent, bUserVo)
    }
    companion object {
        inline fun builder(block: UserOptionVo.Builder.() -> Unit): UserOptionVo = UserOptionVo.Builder().apply(block).build()
    }
}

