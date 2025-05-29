package com.itinfo.rutilvm.api.model.cert

import com.itinfo.rutilvm.api.model.computing.HostVo
import com.itinfo.rutilvm.util.cert.model.CertType
import com.itinfo.rutilvm.util.cert.model.HostCertType
import com.itinfo.rutilvm.util.cert.model.HostCertType.UNKNOWN
import com.itinfo.rutilvm.util.ssh.model.RemoteConnMgmt
import org.slf4j.LoggerFactory

private val log = LoggerFactory.getLogger("com.itinfo.rutilvm.api.model.cert.CertManagerExtKt")

fun List<HostVo>.toCertManagers(
	prvKey: String? = null,
	tempDest: String = "",
	connectionTimeout: Int = RemoteConnMgmt.DEFAULT_CONNECTION_TIMEOUT,
): List<CertManager> =
	this.map { h ->
		HostCertType.values().filter { it != UNKNOWN }.map {
			log.debug("toCertManagers ... host's address: {}", h.address)
			h.toCertManager(it, prvKey, tempDest, connectionTimeout)
		}
	}.flatten().onEach {
		// 반환 전에 한번 임시저장
		val res: Boolean = it.save2Tmp().getOrNull() ?: false
		if (res) log.info("toCertManagers ... SUCCESS") else log.warn("toCertManagers ... FAILURE for {}", it.alias)
	}

fun HostVo.toCertManager(
	certType: CertType,
	prvKey: String? = null,
	tempDest: String = "",
	connectionTimeout: Int = RemoteConnMgmt.DEFAULT_CONNECTION_TIMEOUT
): CertManager = CertManager.builder {
	alias { certType.alias }
	path { certType.path }
	tempDest { tempDest }
	connInfo { toRemoteConnMgmt(prvKey, connectionTimeout) }
}

fun HostVo.toRemoteConnMgmt(
	prvKey: String? = null,
	connectionTimeout: Int = RemoteConnMgmt.DEFAULT_CONNECTION_TIMEOUT
): RemoteConnMgmt = RemoteConnMgmt.asRemoteConnMgmt("rutilvm@${address}:22", prvKey, connectionTimeout)
