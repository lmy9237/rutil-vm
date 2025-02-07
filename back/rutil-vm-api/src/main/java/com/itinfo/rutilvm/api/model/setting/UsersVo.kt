package com.itinfo.rutilvm.api.model.setting

import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.model.fromDomainToIdentifiedVo
import com.itinfo.rutilvm.api.model.storage.DiskProfileVo

import org.ovirt.engine.sdk4.types.User
import org.slf4j.LoggerFactory
import java.io.Serializable

private val log = LoggerFactory.getLogger(UsersVo::class.java)

/**
 *  설정 - 사용자
 *
 * @property id [String]
 * @property name [String]
 * @property lastName [String]
 * @property description [String]
 * @property email [String]
 * @property nameSpace [String]
 * @property principal [String]
 * @property userName [String]
 * @property userOptions List<[PropertyVo]>
 * @property domain [IdentifiedVo]
 * @property password [String]
 */
class UsersVo(
    val id: String = "",
    val name: String = "",
    val lastName: String = "",
    val description: String = "",
    val email: String = "",
    val nameSpace: String = "",
    val principal: String = "",
    val userName: String = "",
    val userOptions: List<PropertyVo> = listOf(),
    val domain: IdentifiedVo = IdentifiedVo(),
//    val password: String = ""

): Serializable {
    override fun toString(): String =
        gson.toJson(this)

    class Builder {
        private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
        private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
        private var bLastName: String = ""; fun lastName(block: () -> String?) { bLastName = block() ?: "" }
        private var bDescription: String = ""; fun description(block: () -> String?) { bDescription = block() ?: "" }
        private var bEmail: String = ""; fun email(block: () -> String?) { bEmail = block() ?: "" }
        private var bNameSpace: String = ""; fun nameSpace(block: () -> String?) { bNameSpace = block() ?: "" }
        private var bPrincipal: String = ""; fun principal(block: () -> String?) { bPrincipal = block() ?: "" }
        private var bUserName: String = ""; fun userName(block: () -> String?) { bUserName = block() ?: "" }
        private var bUserOptionVo: List<PropertyVo> = listOf(); fun userOptions(block: () -> List<PropertyVo>?) { bUserOptionVo = block() ?: listOf() }
        private var bDomain: IdentifiedVo = IdentifiedVo(); fun domain(block: () -> IdentifiedVo?) { bDomain = block() ?: IdentifiedVo() }
//        private var bPassword: String = ""; fun password(block: () -> String?) { bPassword = block() ?: "" }

        fun build(): UsersVo = UsersVo(bId, bName, bLastName, bDescription, bEmail, bNameSpace, bPrincipal, bUserName, bUserOptionVo, bDomain, /*bPassword*/ )
    }
    companion object {
        inline fun builder(block: UsersVo.Builder.() -> Unit): UsersVo = UsersVo.Builder().apply(block).build()
    }
}

fun User.toUserMenu(): UsersVo {
    return UsersVo.builder {
        id { this@toUserMenu.id() }
        name { this@toUserMenu.name() }
        email { this@toUserMenu.email() }
        lastName { this@toUserMenu.lastName() }
        nameSpace { this@toUserMenu.namespace() }
        principal { this@toUserMenu.principal() }
        userName { this@toUserMenu.userName() }
        userOptions { this@toUserMenu.userOptions().toPropertyVos() }
        domain { this@toUserMenu.domain().fromDomainToIdentifiedVo() }
    }
}
fun List<User>.toUsersMenu(): List<UsersVo> =
    this@toUsersMenu.map { it.toUserMenu() }

