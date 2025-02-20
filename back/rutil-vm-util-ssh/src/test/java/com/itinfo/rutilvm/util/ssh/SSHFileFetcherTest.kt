package com.itinfo.rutilvm.util.ssh

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.util.ssh.model.RemoteConnMgmt
import com.itinfo.rutilvm.util.ssh.model.toInsecureSession
import com.itinfo.rutilvm.util.ssh.util.SSHFileFetcher
import com.itinfo.rutilvm.util.ssh.util.SSHHelper
import com.jcraft.jsch.Session
import org.hamcrest.CoreMatchers.`is`
import org.hamcrest.CoreMatchers.notNullValue
import org.hamcrest.MatcherAssert.assertThat

import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test

/**
 * [SSHFileFetcherTest]
 * 인증서 가져오기 테스트
 *
 * @author 이찬희 (chanhi2000)
 * @since 2025.02.20
 */
class SSHFileFetcherTest {
	private lateinit var sshH: SSHHelper
	private lateinit var sshCertFetcher: SSHFileFetcher

	@BeforeEach
	fun setup() {
		log.debug("setup ... ")
		sshH = SSHHelper.getInstance()
		sshCertFetcher = SSHFileFetcher.getInstance()
	}

	/**
	 * [SSHFileFetcherTest.should_fetchSSLCertificates]
	 */
	@Test
	@DisplayName("@SSHCertFetcherTest#should_fetchSSLCertificates()")
	fun should_fetchSSLCertificates() {
		log.debug("should_fetchSSLCertificates ... ")
		assertThat(sshCertFetcher, `is`(notNullValue()))

		val connVDSM: RemoteConnMgmt = RemoteConnMgmt.forVDSM("192.168.0.71", 22, "root", "adminRoot!@#")
		val sessionVDSM: Session? = connVDSM.toInsecureSession()
		/*
		val certVDSMData: ByteArray? = sessionVDSM?.fetchFile(CertType.VDSM.path)
		assertThat(certVDSMData, `is`(notNullValue()))
		val certificateVDSM = certParser.parseCertificate(certVDSMData)
		assertThat(certificateVDSM, `is`(notNullValue()))
		log.info("Certificate Expiration Date: ${certificateVDSM?.notAfter}")

		val certVDSMCaData: ByteArray? = sessionVDSM?.fetchFile(CertType.VDSM_CA.path)
		assertThat(certVDSMCaData, `is`(notNullValue()))
		val certificateVDSMCa = certParser.parseCertificate(certVDSMCaData)
		assertThat(certificateVDSMCa, `is`(notNullValue()))
		log.info("Certificate Expiration Date: ${certificateVDSMCa?.notAfter}")

		val certData: ByteArray? = sessionVDSM?.fetchFile(CertType.VDSM.path)
		assertThat(certData, `is`(notNullValue()))
		val certificate = certParser.parseCertificate(certData)
		assertThat(certificate, `is`(notNullValue()))
		log.info("Certificate Expiration Date: ${certificate?.notAfter}")
		*/
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
