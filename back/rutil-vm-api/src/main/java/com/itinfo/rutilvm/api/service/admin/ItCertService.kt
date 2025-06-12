package com.itinfo.rutilvm.api.service.admin

import com.itinfo.rutilvm.api.model.cert.CertManager
import com.itinfo.rutilvm.api.model.cert.toCertManagers
import com.itinfo.rutilvm.api.model.computing.HostVo
import com.itinfo.rutilvm.api.configuration.CertConfig
import com.itinfo.rutilvm.api.configuration.PkiServiceClient
import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.api.service.computing.ItHostService
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern
import com.itinfo.rutilvm.util.ssh.model.RemoteConnMgmt
import com.itinfo.rutilvm.util.ssh.model.registerRutilVMPubkey2Host
import okio.IOException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import kotlin.jvm.Throws

interface ItCertService {
	/**
	 * [ItCertService.findAll]
	 * oVirt 관련 인증서 전체 조회
	 * @return List<[CertManager]> 인증서 정보
	 */
	fun findAll(): List<CertManager>
	/**
	 * [ItCertService.findOne]
	 * oVirt 관련 인증서 상세 조회
	 *
	 * @return [CertManager] 인증서 정보
	 */
	fun findOne(alias: String, address: String): CertManager?
	/**
	 * [ItCertService.attach]
	 * oVirt 관련 인증서 연결
	 */
	@Throws(IOException::class)
	fun attach(address: String?, port: Int?, rootPassword: String?): Boolean?
	/**
	 * [ItCertService.findEngineSshPublicKey]
	 * oVirt 엔진 고유 SSH 공개키 조회
	 *
	 * @return [String] oVirt 엔진 인증서 SSH 공개키
	 **/
	@Throws(Exception::class)
	fun findEngineSshPublicKey(): String
}


@Service
class CertServiceImpl(

): BaseService(), ItCertService {
	@Autowired private lateinit var iHost: ItHostService
	@Autowired private lateinit var certConfig: CertConfig
	@Autowired private lateinit var pkiServiceClient: PkiServiceClient

	override fun findAll(): List<CertManager> {
		log.info("findAll ...")
		val hosts: List<HostVo> = iHost.findAll()
		val certs: List<CertManager> = hosts.toCertManagers(
			certConfig.ovirtSSHPrvKey,
			certConfig.ovirtSSHCertLocation,
			certConfig.jschConnectionTimeout,
		) + certConfig.engineCertManagers()
		return certs
	}

	override fun findOne(alias: String, address: String): CertManager? {
		log.info("findOne ... alias: {}, address: {}", alias, address)
		val cert: CertManager? = findAll().firstOrNull { it.alias == alias && it.address == address }
		/*
		val cert: CertManager? = when(val certType: CertType = CertType.findById(id)) {
			VDSM, VDSM_CA -> certType.toCertManager(certConfig.conn4VDSM())
			ENGINE_SERVER, ENGINE_CA -> certType.toCertManager(certConfig.conn4Engine())
			else -> null
		}
		*/
		return cert
	}

	override fun attach(address: String?, port: Int?, rootPassword: String?): Boolean? {
		log.info("attach ... address: {}, port: {}", address, port)

		if (certConfig.ovirtSSHPubkey.isNullOrEmpty())
			throw ErrorPattern.CERT_MISSING_REQUIRED_VALUE.toException("엔진 SSH 공개키 없음")
		val engineRemoteMgmt: RemoteConnMgmt? = certConfig.ovirtEngineSSH
		return engineRemoteMgmt?.registerRutilVMPubkey2Host(
			address,
			port,
			rootPassword,
			certConfig.ovirtSSHPubkey
		)?.getOrDefault(false)
	}

	override fun findEngineSshPublicKey(): String {
		log.info("findEngineSshPublicKey ... ")
		return pkiServiceClient.fetchEngineSshPublicKey()
	}

	companion object {
		private val log by LoggerDelegate()
	}
}

