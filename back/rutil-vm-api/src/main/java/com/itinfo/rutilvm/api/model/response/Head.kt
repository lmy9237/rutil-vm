package com.itinfo.rutilvm.api.model.response

import com.itinfo.rutilvm.common.gson

import io.swagger.annotations.ApiModelProperty
import java.io.Serializable

/**
 * [Head]
 *
 * @property code [Int]  상태코드
 * @property message [String] 메시지
 */
data class Head(
	@ApiModelProperty(example = "상태코드") val code: Int = 400,
	@ApiModelProperty(example = "메시지") val message: String? = "실패",
): Serializable{
    override fun toString(): String =
        gson.toJson(this)

	class Builder {
		private var bCode: Int = 400;fun code(block: () -> Int?) { bCode = block() ?: 400 }
		private var bMessage: String? = "실패";fun message(block: () -> String?) { bMessage = block() ?: "실패" }
        fun build(): Head = Head(bCode, bMessage)
	}
	
    companion object {
        inline fun builder(block: Head.Builder.() -> Unit): Head = Head.Builder().apply(block).build()
		fun success(): Head = builder {
			code { 200 }
			message { "성공" }
		}
		fun fail(code: Int = 400, message: String? = ""): Head = builder {
			code { code }
			message { message }
		}
    }
}
