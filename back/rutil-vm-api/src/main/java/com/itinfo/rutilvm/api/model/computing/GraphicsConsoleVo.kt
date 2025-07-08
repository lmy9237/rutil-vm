package com.itinfo.rutilvm.api.model.computing

import com.itinfo.rutilvm.api.error.ItemNotFoundException
import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.model.toIdentifiedVoFromVm
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.common.gson
import org.ovirt.engine.sdk4.types.GraphicsConsole
import org.ovirt.engine.sdk4.types.GraphicsType
import java.io.Serializable
import java.math.BigInteger

/**
 * [GraphicsConsoleVo]
 * 그래픽콘솔
 *
 * @property address [String]
 * @property port [String]
 * @property tlsPort [String]
 * @property type [GraphicsType]
 * @property password [String]
 **/
class GraphicsConsoleVo(
	val id: String = "",
	val address: String = "",
	val port: BigInteger = BigInteger.ZERO,
	val tlsPort: BigInteger = BigInteger.ZERO,
	val type: GraphicsType = GraphicsType.VNC,
	val vmVo: IdentifiedVo? = null,
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bAddress: String = "";fun address(block: () -> String?) { bAddress = block() ?: "" }
		private var bPort: BigInteger = BigInteger.ZERO;fun port(block: () -> BigInteger?) { bPort = block() ?: BigInteger.ZERO }
		private var bTlsPort: BigInteger = BigInteger.ZERO;fun tlsPort(block: () -> BigInteger?) { bTlsPort = block() ?: BigInteger.ZERO }
		private var bType: GraphicsType = GraphicsType.VNC;fun type(block: () -> GraphicsType?) { bType = block() ?: GraphicsType.VNC }
		private var bVmVo: IdentifiedVo? = null;fun vmVo(block: () -> IdentifiedVo?) { bVmVo = block() }
		fun build(): GraphicsConsoleVo = GraphicsConsoleVo(bId, bAddress, bPort, bTlsPort, bType, bVmVo)
	}

	companion object {
		private val log by LoggerDelegate()
		private const val DEFAULT_PORT = 5600
		private const val DEFAULT_TLS_PORT = 5699
		inline fun builder(block: GraphicsConsoleVo.Builder.() -> Unit): GraphicsConsoleVo = GraphicsConsoleVo.Builder().apply(block).build()
	}
}

@Throws(ItemNotFoundException::class)
fun GraphicsConsole.toGraphicsConsoleVo(): GraphicsConsoleVo {
	val vmVoIdentified: IdentifiedVo? =
		if (this@toGraphicsConsoleVo.vmPresent()) vm().toIdentifiedVoFromVm()
		else null
	return GraphicsConsoleVo.builder {
		id { if (this@toGraphicsConsoleVo.idPresent()) id() else null }
		address { if (this@toGraphicsConsoleVo.addressPresent()) this@toGraphicsConsoleVo.address() else null }
		port { if (this@toGraphicsConsoleVo.portPresent()) this@toGraphicsConsoleVo.port() else null }
		tlsPort { if (this@toGraphicsConsoleVo.tlsPortPresent()) this@toGraphicsConsoleVo.tlsPort() else null }
		type { if (this@toGraphicsConsoleVo.protocolPresent()) this@toGraphicsConsoleVo.protocol() else null }
		vmVo { vmVoIdentified }
	}
}

@Throws(ItemNotFoundException::class)
fun List<GraphicsConsole>.toGraphicsConsoleVos(): List<GraphicsConsoleVo> =
	this.map { it.toGraphicsConsoleVo() }

