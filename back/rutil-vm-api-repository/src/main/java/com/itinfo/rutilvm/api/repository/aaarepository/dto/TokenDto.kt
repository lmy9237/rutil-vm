package com.itinfo.rutilvm.api.repository.aaarepository.dto

import com.itinfo.rutilvm.common.gson

import java.io.Serializable


data class TokenDto(
	val accessToken: String,
	val refreshToken: String
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bAccessToken: String = "";fun accessToken(block: () -> String?) { bAccessToken = block() ?: "" }
		private var bRefreshToken: String = "";fun refreshToken(block: () -> String?) { bRefreshToken = block() ?: "" }
		fun build(): TokenDto = TokenDto(bAccessToken, bRefreshToken)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): TokenDto = Builder().apply(block).build()
	}
}
