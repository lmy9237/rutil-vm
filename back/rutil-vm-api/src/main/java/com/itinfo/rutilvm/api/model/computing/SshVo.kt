package com.itinfo.rutilvm.api.model.computing

import com.itinfo.rutilvm.common.gson
import org.ovirt.engine.sdk4.builders.SshBuilder
import org.ovirt.engine.sdk4.types.Ssh
import org.ovirt.engine.sdk4.types.SshAuthenticationMethod
import org.slf4j.LoggerFactory
import java.io.Serializable
import java.math.BigInteger

private val log = LoggerFactory.getLogger(HostVo::class.java)

/**
 * [SshVo]
 * (호스트용) SSH 정보
 *
 * @property id [String]
 * @property name [String]
 */
class SshVo(
	val id: String? = "",
	val name: String? = "",
	val port: BigInteger? = BigInteger.ZERO,
	val fingerprint: String? = "",
	val publicKey: String? = "",
	val rootPassword: String? = "",
	val authenticationMethod: SshAuthenticationMethod? = SshAuthenticationMethod.PUBLICKEY,
): Serializable {

	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bId: String? = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String? = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bPort: BigInteger? = BigInteger.ZERO;fun port(block: () -> BigInteger?) { bPort = block() ?: BigInteger.ZERO }
		private var bFingerprint: String? = "";fun fingerprint(block: () -> String?) { bFingerprint = block() ?: "" }
		private var bPublicKey: String? = "";fun publicKey(block: () -> String?) { bPublicKey = block() ?: "" }
		private var bRootPassword: String? = "";fun rootPassword(block: () -> String?) { bRootPassword = block() ?: "" }
		private var bAuthenticationMethod: SshAuthenticationMethod? = SshAuthenticationMethod.PUBLICKEY;fun authenticationMethod(block: () -> SshAuthenticationMethod?) { block() ?: SshAuthenticationMethod.PUBLICKEY }
		fun build(): SshVo = SshVo(bId, bName, bPort, bFingerprint, bPublicKey, bRootPassword)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): SshVo = Builder().apply(block).build()
	}
}

fun Ssh?.toSshVo(): SshVo = SshVo.builder {
	id { if (this@toSshVo?.idPresent() == true) id() else "" }
	name { if (this@toSshVo?.namePresent() == true) name() else "" }
	port { if (this@toSshVo?.portPresent() == true) port() else BigInteger.ZERO }
	fingerprint { if (this@toSshVo?.fingerprintPresent() == true) fingerprint() else "" }
	publicKey { if (this@toSshVo?.publicKeyPresent() == true) publicKey() else "" }
	rootPassword {
		if (this@toSshVo?.userPresent() == true && this@toSshVo.user()?.passwordPresent() == true)
			user().password()
		else ""
	}
	authenticationMethod { if (this@toSshVo?.authenticationMethodPresent() == true) authenticationMethod() else SshAuthenticationMethod.PUBLICKEY }
}

fun SshVo.toSsh(): Ssh = SshBuilder().apply {
	if (!id.isNullOrEmpty()) id(id)
	if (!name.isNullOrEmpty()) name(name)
	if (port != null && port != BigInteger.ZERO) port(port)
	if (!fingerprint.isNullOrEmpty()) fingerprint(fingerprint)
	if (!publicKey.isNullOrEmpty()) publicKey(publicKey)
	if (authenticationMethod != null) authenticationMethod(authenticationMethod)
}.build()
