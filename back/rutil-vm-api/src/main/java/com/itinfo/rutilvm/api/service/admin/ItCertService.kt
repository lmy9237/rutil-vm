package com.itinfo.rutilvm.api.service.admin

import com.itinfo.rutilvm.api.cert.CertManager
import com.itinfo.rutilvm.api.cert.toCertManager
import com.itinfo.rutilvm.api.configuration.CertConfig
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.util.cert.model.CertType
import com.itinfo.rutilvm.util.cert.model.CertType.ENGINE_CA
import com.itinfo.rutilvm.util.cert.model.CertType.ENGINE_SERVER
import com.itinfo.rutilvm.util.cert.model.CertType.VDSM
import com.itinfo.rutilvm.util.cert.model.CertType.VDSM_CA
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

interface ItCertService {
	/**
	 * [ItCertService.findAll]
	 * oVirt 관련 인증서 전체 조회
	 */
	fun findAll(): List<CertManager>
	/**
	 * [ItCertService.findOne]
	 * oVirt 관련 인증서 상세 조회
	 */
	fun findOne(id: Int): CertManager?
}


@Service
class CertServiceImpl(

): BaseService(), ItCertService {
	@Autowired private lateinit var certConfig: CertConfig

	override fun findAll(): List<CertManager> {
		log.info("findAll ...")
		val certs: List<CertManager> = certConfig.allCertManagers()
		return certs
	}

	override fun findOne(id: Int): CertManager? {
		log.info("findOne ... id: {}", id)
		val cert: CertManager? = findAll().firstOrNull { it.id == id }
		/*
		val cert: CertManager? = when(val certType: CertType = CertType.findById(id)) {
			VDSM, VDSM_CA -> certType.toCertManager(certConfig.conn4VDSM())
			ENGINE_SERVER, ENGINE_CA -> certType.toCertManager(certConfig.conn4Engine())
			else -> null
		}
		*/
		return cert
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
