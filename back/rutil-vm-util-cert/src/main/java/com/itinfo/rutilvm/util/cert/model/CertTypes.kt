package com.itinfo.rutilvm.util.cert.model

import java.util.concurrent.ConcurrentHashMap

/**
 * [HostCertType]
 * 호스트 관련 인증서 유형
 *
 * @author 이찬희 (@chanhi2000)
 * @since 2025-03-11
 */
enum class HostCertType(override val alias: String, override val path: String) : CertType {
	VDSM("VDSM Certificate", "/etc/pki/vdsm/certs/vdsmcert.pem"),
	/* VDSM("VDSM Certificate Key", "/etc/pki/vdsm/keys/vdsmkey.pem"), */
	/* VDSM_CA("VDSM CA Certificate", "/etc/pki/vdsm/certs/cacert.pem"), */
	UNKNOWN("", "");

	companion object {
		private val findMap: MutableMap<String, CertType> = ConcurrentHashMap<String, CertType>()
		init {
			HostCertType.values().forEach { findMap[it.alias] = it }
		}
		@JvmStatic fun findByAlias(alias: String): CertType = findMap.entries.firstOrNull { it.value.alias == alias }?.value ?: UNKNOWN
	}
}

/**
 * [EngineCertType]
 * ovirt-engine 관련 인증서 유형
 *
 * @author 이찬희 (@chanhi2000)
 * @since 2025-03-11
 */
enum class EngineCertType(override val alias: String, override val path: String) : CertType {
	ENGINE("Engine Certificate", "/etc/pki/ovirt-engine/certs/apache.cer"),
	ENGINE_SERVER("Engine Server Certificate",  "/etc/pki/ovirt-engine/certs/engine.cer"),
	ENGINE_CA("Engine CA Certificate", "/etc/pki/ovirt-engine/ca.pem"),
	ENGINE_PK("Engine Private Key", "/etc/pki/ovirt-engine/keys/engine_id_rsa"),
	UNKNOWN("", "");

	companion object {
		private val findMap: MutableMap<String, CertType> = ConcurrentHashMap<String, CertType>()
		init {
			EngineCertType.values().forEach { findMap[it.alias] = it }
		}
		val allCerts: List<EngineCertType> = EngineCertType.values().filterNot {
			it == UNKNOWN || it == ENGINE_PK
		}
		@JvmStatic fun findByAlias(alias: String): CertType = findMap.entries.firstOrNull { it.value.alias == alias }?.value ?: UNKNOWN
	}
}

// 참고: VDSM_CA의 값과 ENGINE_CA 값이 출력기준으로 같다
interface CertType {
	val alias: String
	val path: String
}
