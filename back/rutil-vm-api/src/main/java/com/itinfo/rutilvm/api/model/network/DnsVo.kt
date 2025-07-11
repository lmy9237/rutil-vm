package com.itinfo.rutilvm.api.model.network

import com.itinfo.rutilvm.common.gson
import java.io.Serializable

class DnsVo(
	val position: Short? = 0,
	val address: String = "",
): Serializable {
	override fun toString(): String = gson.toJson(this)

	class Builder {
		private var bPosition: Short? = 0;fun position(block: () -> Short?) { bPosition = block() ?: 0 }
		private var bAddress: String = "";fun address(block: () -> String?) { bAddress = block() ?: "" }
		fun build(): DnsVo = DnsVo(  bPosition, bAddress)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): DnsVo = Builder().apply(block).build()
	}
}

fun String.toDnsVo(i: Int?=0): DnsVo = DnsVo.builder {
	position { i?.toShort() }
	address { this@toDnsVo }
}
fun List<String>.toDnsVos(): List<DnsVo> = this@toDnsVos.mapIndexed { i, e -> e.toDnsVo(i) }

