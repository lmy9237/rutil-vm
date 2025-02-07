package com.itinfo.rutilvm.api.model.computing

import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern
import com.itinfo.rutilvm.api.error.ItemNotFoundException
import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.util.model.SystemPropertiesVo
import com.itinfo.rutilvm.util.ovirt.findAllVmGraphicsConsolesFromVm
import com.itinfo.rutilvm.util.ovirt.findTicketFromVmGraphicsConsole

import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.types.*
import org.slf4j.LoggerFactory
import java.io.Serializable

private val log = LoggerFactory.getLogger(ConsoleVo::class.java)

/**
 * [ConsoleVo]
 * 콘솔
 * 
 * @property hostAddress [String] 
 * @property hostPort [String]
 * @property address [String] 
 * @property port [String] 
 * @property tlsPort [String] 
 * @property type [GraphicsType]
// * @property vmName [String]   ?
 * @property password [String] 
 **/
class ConsoleVo(
	val hostAddress: String = "",
	val hostPort: String = "",
	val address: String = "",
	val port: String = "",
	val tlsPort: String = "",
	val type: GraphicsType = GraphicsType.VNC,
	val password: String = "",
): Serializable {
	override fun toString(): String =
		gson.toJson(this)
		
	class Builder {
		private var bHostAddress: String = "";fun hostAddress(block: () -> String?) { bHostAddress = block() ?: "" }
		private var bHostPort: String = "";fun hostPort(block: () -> String?) { bHostPort = block() ?: "" }
		private var bAddress: String = "";fun address(block: () -> String?) { bAddress = block() ?: "" }
		private var bPort: String = "";fun port(block: () -> String?) { bPort = block() ?: "" }
		private var bTlsPort: String = "";fun tlsPort(block: () -> String?) { bTlsPort = block() ?: "" }
		private var bType: GraphicsType = GraphicsType.VNC;fun type(block: () -> GraphicsType?) { bType = block() ?: GraphicsType.VNC }
		private var bPassword: String = "";fun password(block: () -> String?) { bPassword = block() ?: "" }
		fun build(): ConsoleVo = ConsoleVo(bHostAddress, bHostPort, bAddress, bPort, bTlsPort, bType, bPassword)
	}

	companion object {
		inline fun builder(block: ConsoleVo.Builder.() -> Unit): ConsoleVo = ConsoleVo.Builder().apply(block).build()
	}
}

@Throws(ItemNotFoundException::class)
fun Vm.toConsoleVo(conn: Connection, systemPropertiesVo: SystemPropertiesVo): ConsoleVo {
	if (this@toConsoleVo.status() !== VmStatus.UP) {
		log.warn("VM 상태가 UP이 아님")
		return ConsoleVo.builder {  }
	}

	val console: GraphicsConsole =
		conn.findAllVmGraphicsConsolesFromVm(this@toConsoleVo.id())
			.firstOrNull() ?: throw ErrorPattern.CONSOLE_NOT_FOUND.toException()
	val graphicsConsoleId: String = console.id()
	val ticket: Ticket =
		conn.findTicketFromVmGraphicsConsole(this@toConsoleVo.id(), graphicsConsoleId)
			.getOrNull() ?: throw ErrorPattern.TICKET_NOT_FOUND.toException()

	return ConsoleVo.builder {
		hostAddress { systemPropertiesVo.vncIp }
		hostPort { systemPropertiesVo.vncPort }
		address { if (this@toConsoleVo.displayPresent()) this@toConsoleVo.display().address() else null }
		port { if (this@toConsoleVo.displayPresent()) this@toConsoleVo.display().port().toInt().toString() else null }
		tlsPort { (if (console.tlsPort() != null) console.tlsPort().toInt() else null).toString() }
		password { ticket.value() }
		type { GraphicsType.VNC }
	}
}