package com.itinfo.rutilvm.api.model.computing

import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern
import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.model.toIdentifiedVoFromVm
import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.util.ovirt.findAllVmGraphicsConsolesFromVm
import com.itinfo.rutilvm.util.ovirt.findTicketFromVm

import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.types.*
import org.slf4j.LoggerFactory
import java.io.Serializable
import java.math.BigInteger

private val log = LoggerFactory.getLogger(AggregateConsoleVo::class.java)

/**
 * [AggregateConsoleVo]
 * 콘솔 총 정보
 *
 * @property graphicConsole [GraphicsConsoleVo]
 * @property ticket [TicketVo]
 *
 * @deprecated 사용안할 예정
 **/
class AggregateConsoleVo(
	val vm: IdentifiedVo = IdentifiedVo(),
	private val graphicConsole: GraphicsConsoleVo = GraphicsConsoleVo(),
	private val ticket: TicketVo = TicketVo()
): Serializable {
	val address: String = graphicConsole.address
	val port: BigInteger = graphicConsole.port
	val tlsPort: BigInteger = graphicConsole.tlsPort
	val type: GraphicsType = graphicConsole.type
	val token: String = ticket.value
	val tokenExpiry: BigInteger = ticket.expiry
	val consoleId: String = graphicConsole.id

	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bVm: IdentifiedVo = IdentifiedVo();fun vm(block: () -> IdentifiedVo?) { bVm = block() ?: IdentifiedVo() }
		private var bGraphicConsole: GraphicsConsoleVo = GraphicsConsoleVo();fun graphicConsole(block: () -> GraphicsConsoleVo?) { bGraphicConsole = block() ?: GraphicsConsoleVo() }
		private var bTicket: TicketVo = TicketVo();fun ticket(block: () -> TicketVo?) { bTicket = block() ?: TicketVo() }
		fun build(): AggregateConsoleVo = AggregateConsoleVo(bVm, bGraphicConsole, bTicket)
	}

	companion object {
		inline fun builder(block: AggregateConsoleVo.Builder.() -> Unit): AggregateConsoleVo = AggregateConsoleVo.Builder().apply(block).build()
	}
}

fun Vm.toAggregateConsoleVo(conn: Connection): AggregateConsoleVo {
	val graphicsConsole: GraphicsConsole =
		conn.findAllVmGraphicsConsolesFromVm(this@toAggregateConsoleVo.id()).getOrDefault(listOf()).firstOrNull()
			?: throw ErrorPattern.CONSOLE_NOT_FOUND.toException() // VmStatus가 UP 상태 일 경우 하나 이상은 있어야 정상.
	val ticket: Ticket =
		conn.findTicketFromVm(this@toAggregateConsoleVo.id()).getOrNull()
			?: throw ErrorPattern.TICKET_NOT_FOUND.toException()

	return AggregateConsoleVo.builder {
		vm { this@toAggregateConsoleVo.toIdentifiedVoFromVm() }
		graphicConsole { graphicsConsole.toGraphicsConsoleVo() }
		ticket { ticket.toTicketVo() }
	}
}

fun List<Vm>.toConsoleVos(conn: Connection): List<AggregateConsoleVo> =
	this.map { it.toAggregateConsoleVo(conn) }
