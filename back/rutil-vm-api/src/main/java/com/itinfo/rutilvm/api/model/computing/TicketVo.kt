package com.itinfo.rutilvm.api.model.computing

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.common.gson

import org.ovirt.engine.sdk4.types.Ticket
import java.io.Serializable
import java.math.BigInteger

/**
 * [TicketVo]
 * 그래픽 콘솔을 사용하기 위한 발행할 티캣
 *
 * @property expiry [BigInteger] Time to live for the ticket in seconds.
 * @property value [String] 가상머신 접근 ticket.
 *
 */
class TicketVo(
	val expiry: BigInteger = BigInteger.ZERO,
	val value: String = "",
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bExpiry: BigInteger = BigInteger.ZERO;fun expiry(block: () -> BigInteger?) { bExpiry = block() ?: BigInteger.ZERO }
		private var bValue: String = "";fun value(block: () -> String?) { bValue = block() ?: "" }
		fun build(): TicketVo = TicketVo(bExpiry, bValue)
	}

	companion object {
		private val log by LoggerDelegate()
		inline fun builder(block: TicketVo.Builder.() -> Unit): TicketVo = TicketVo.Builder().apply(block).build()
	}
}

fun Ticket.toTicketVo(): TicketVo = TicketVo.builder {
	expiry { if(this@toTicketVo.expiryPresent()) this@toTicketVo.expiry() else null }
	value { if(this@toTicketVo.valuePresent()) this@toTicketVo.value() else null }
}
