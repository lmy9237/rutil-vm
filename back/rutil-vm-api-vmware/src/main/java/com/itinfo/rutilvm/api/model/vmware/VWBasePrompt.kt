package com.itinfo.rutilvm.api.model.vmware

import com.itinfo.rutilvm.common.gson
import okhttp3.Credentials
import java.io.Serializable

sealed class VWBasePrompt(
	open val baseUrl: String,
): Serializable {
	override fun toString(): String =
		gson.toJson(this@VWBasePrompt)
}

open class VWPromptAuth(
	override val baseUrl: String,
	val username: String,
	val password: String,
): VWBasePrompt(baseUrl), Serializable {
	override fun toString(): String =
		gson.toJson(this@VWPromptAuth)

	val toCredentialBasic: String
		get() = Credentials.basic(username, password)
}

open class VWPrompt(
	override val baseUrl: String,
	val sessionId: String,
): VWBasePrompt(baseUrl), Serializable {
	override fun toString(): String =
		gson.toJson(this@VWPrompt)
}


