package com.itinfo.rutilvm.api.model.auth

import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.api.security.CustomUserDetails

import org.ovirt.engine.sdk4.builders.Builders
import org.ovirt.engine.sdk4.types.Permission
import org.ovirt.engine.sdk4.types.User
import java.io.Serializable

class UserVo(
	var username: String = "",
	var password: String = "",
	var administrative: Boolean = false,
	var firstName: String = "",
	var surName: String = "",
	var namespace: String = "",
	var email: String = "",
	var authProvider: String = "",
	var principal: String = "",
	var roleId: String = "",
//	var loginCount: Int = 0,
//	var blockTime: String = "",
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bUsername: String = "";fun username(block: () -> String?) { bUsername = block() ?: "" }
		private var bPassword: String = "";fun password(block: () -> String?) { bPassword = block() ?: "" }
		private var bAdministrative: Boolean = false;fun administrative(block: () -> Boolean?) { bAdministrative = block() ?: false }
		private var bFirstName: String = "";fun firstName(block: () -> String?) { bFirstName = block() ?: "" }
		private var bLastName: String = "";fun lastName(block: () -> String?) { bLastName = block() ?: "" }
		private var bNamespace: String = "";fun namespace(block: () -> String?) { bNamespace = block() ?: "" }
		private var bEmail: String = "";fun email(block: () -> String?) { bEmail = block() ?: "" }
		private var bAuthProvider: String = "";fun authProvider(block: () -> String?) { bAuthProvider = block() ?: "" }
		private var bPrincipal: String = "";fun principal(block: () -> String?) { bPrincipal = block() ?: "" }
		private var bRoleId: String = "";fun roleId(block: () -> String?) { bRoleId = block() ?: "" }
//		private var bLoginCount: Int = 0;fun loginCount(block: () -> Int?) { bLoginCount = block() ?: 0 }
//		private var bBlockTime: String = "";fun blockTime(block: () -> String?) { bBlockTime = block() ?: "" }
		fun build(): UserVo = UserVo(bUsername, bPassword, bAdministrative, bFirstName, bLastName, bNamespace, bEmail, bAuthProvider, bPrincipal)
	}
	companion object {
		@JvmStatic inline fun builder(block: Builder.() -> Unit): UserVo = Builder().apply(block).build()
	}
}

fun UserVo.toCustomUserDetails(): CustomUserDetails = CustomUserDetails.custerUserDetails {
	userid { this@toCustomUserDetails.username }
	passwd { this@toCustomUserDetails.password }
}

fun UserVo.user2Add(): User = Builders.user()
	.principal(principal)
	.userName("$username@internal-authz")
	.domain(Builders.domain().name("internal-authz"))
	.build()

fun UserVo.permission2Add(): Permission = Builders.permission()
	.role(Builders.role().id(roleId))
	.user(Builders.user().id(username))
	.build()

fun User.toUserVo(): UserVo = UserVo.builder {
	username { this@toUserVo.userName() }
	lastName { this@toUserVo.lastName() }
}