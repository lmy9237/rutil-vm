package com.itinfo.rutilvm.util.ssh.model

import com.google.gson.Gson
import com.google.gson.GsonBuilder
import com.jcraft.jsch.JSch
import com.jcraft.jsch.Session
import java.io.Serializable
import java.util.*

private val gson: Gson =
	GsonBuilder()
		.setPrettyPrinting()
		.create()

/**
 * [RemoteConnMgmt]
 * SSH 연결 유형
 *
 * @since 2025.02.20
 * @author chanhi2000
 */
open class RemoteConnMgmt(
	val host: String = "",
	val port: Int = 0,
	val id: String = "",
	val pw: String = "",
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bHost: String = "";fun host(block: () -> String?) { bHost = block() ?: "" }
		private var bPort: Int = 0;fun port(block: () -> Int?) { bPort = block() ?: 0 }
		private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bPw: String = "";fun pw(block: () -> String?) { bPw = block() ?: "" }
		fun build(): RemoteConnMgmt = RemoteConnMgmt(bHost, bPort, bId, bPw)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): RemoteConnMgmt = Builder().apply(block).build()
		fun forVDSM(host: String, port: Int, id: String, pw: String): RemoteConnMgmt = builder {
			host { host }
			port { port }
			id { id }
			pw { pw }
		}
		fun forEngine(host: String, port: Int, id: String, pw: String): RemoteConnMgmt = builder {
			host { host }
			port { port }
			id { id }
			pw { pw }
		}
	}
}

fun RemoteConnMgmt.toInsecureSession(): Session? {
	val jsch = JSch()
	val session: Session? = jsch.getSession(id, host, port)
	session?.setPassword(pw)
	// Disable host key checking for simplicity (not recommended for production)
	session?.setConfig(Properties().apply {
		put("StrictHostKeyChecking", "no")
	})
	return session?.also {
		it.connect()
	}
}
