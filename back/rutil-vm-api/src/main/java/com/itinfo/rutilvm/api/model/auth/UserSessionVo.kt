package com.itinfo.rutilvm.api.model.auth

import com.itinfo.rutilvm.common.gson

import java.io.Serializable
import java.util.*

class UserSessionVo(
	val id: Long = 0L,
	val userName: String = "",
	val userId: UUID? = null,
	val sourceIp: String = "",
	val authzName: String = "",
	val sessionStartTime: Date? = null,
	val sessionLastActiveTime: Date? = null,
): Serializable {
	override fun toString(): String = gson.toJson(this)

	class Builder {
		private var bId: Long = 0;fun id(block: () -> Long?) { bId = block() ?: 0 }
		private var bUserName: String = "";fun userName(block: () -> String?) { bUserName = block() ?: "" }
		private var bUserId: UUID? = null;fun userId(block: () -> UUID?) { bUserId = block() }
		private var bSourceIp: String = "";fun sourceIp(block: () -> String?) { bSourceIp = block() ?: "" }
		private var bAuthzName: String = "";fun authzName(block: () -> String?) { bAuthzName = block() ?: "" }
		private var bSessionStartTime: Date? = null;fun sessionStartTime(block: () -> Date?) { bSessionStartTime = block() }
		private var bSessionLastActiveTime: Date? = null;fun sessionLastActiveTime(block: () -> Date?) { bSessionLastActiveTime = block() }
		fun build(): UserSessionVo = UserSessionVo(bId, bUserName, bUserId, bSourceIp, bAuthzName, bSessionStartTime, bSessionLastActiveTime)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): UserSessionVo = Builder().apply(block).build()
	}
}

