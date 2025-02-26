package com.itinfo.rutilvm.api.model.cert

import com.itinfo.rutilvm.api.cert.CertManager
import com.itinfo.rutilvm.api.model.computing.HostVo
import com.itinfo.rutilvm.util.cert.model.CertType
import com.itinfo.rutilvm.util.cert.model.HostCertType
import com.itinfo.rutilvm.util.cert.model.HostCertType.UNKNOWN
import com.itinfo.rutilvm.util.ssh.model.RemoteConnMgmt
import org.slf4j.LoggerFactory

private val log = LoggerFactory.getLogger("com.itinfo.rutilvm.api.model.cert.CertManagerExtKt")

fun List<HostVo>.toCertManagers(prvKey: String? = null): List<CertManager> =
	this.map { h ->
		HostCertType.values().filter { it != UNKNOWN }.map {
			log.debug("toCertManagers ... host's address: {}", h.address)
			h.toCertManager(it, prvKey)
		}
	}.flatten()

fun HostVo.toCertManager(certType: CertType, prvKey: String? = null): CertManager = CertManager.builder {
	alias { certType.alias }
	path { certType.path }
	connInfo { toRemoteConnMgmt(prvKey) }
}

fun HostVo.toRemoteConnMgmt(prvKey: String? = null): RemoteConnMgmt = RemoteConnMgmt.asRemoteConnMgmt("root@${address}:22", prvKey)
