package com.itinfo.rutilvm.api.model.vmware

import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.common.LoggerDelegate

import java.io.Serializable

/**
 * [VWSessionId]
 * (VMWare API 로그인 후) 발급받은 Session ID 객체
 *
 * @author 이찬희 (@chanhi2000)
 */
class VWSessionId(
	val value: String = ""
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bValue:String = "";fun value(block: () -> String?) { bValue = block() ?: "" }
		fun build(): VWSessionId = VWSessionId(bValue)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): VWSessionId =  Builder().apply(block).build()
		private val log by LoggerDelegate()
	}
}
