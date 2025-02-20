package com.itinfo.rutilvm.util.cert.model

import java.util.concurrent.ConcurrentHashMap

enum class CertType(val id: Int, val alias: String, val path: String) {
	VDSM(1, "VDSM Certificate", "/etc/pki/vdsm/certs/vdsmcert.pem"),
	VDSM_CA(2, "VDSM CA Certificate", "/etc/pki/vdsm/certs/cacert.pem"),
	ENGINE_SERVER(3, "Engine Server Certificate",  "/etc/pki/ovirt-engine/certs/engine.cer"),
	ENGINE_CA(4, "Engine CA Certificate", "/etc/pki/ovirt-engine/ca.pem"),
	UNKNOWN(999, "", "");

	companion object {
		private val findMap: MutableMap<Int, CertType> = ConcurrentHashMap<Int, CertType>()
		init {
			CertType.values().forEach { findMap[it.id] = it }
		}
		val vdsmCertTypes: List<CertType> = listOf(VDSM, VDSM_CA)
		val engineCertTypes: List<CertType> = listOf(ENGINE_SERVER, ENGINE_CA)

		@JvmStatic fun findById(id: Int): CertType = findMap[id] ?: UNKNOWN
		@JvmStatic fun findByAlias(alias: String): CertType = findMap.entries.firstOrNull { it.value.alias == alias }?.value ?: UNKNOWN
	}
}
