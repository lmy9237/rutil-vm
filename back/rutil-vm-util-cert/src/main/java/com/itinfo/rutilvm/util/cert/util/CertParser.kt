package com.itinfo.rutilvm.util.cert.util

import com.itinfo.rutilvm.common.LoggerDelegate
import java.io.ByteArrayInputStream
import java.security.cert.CertificateFactory
import java.security.cert.X509Certificate
import kotlin.jvm.Throws

/**
 * [CertParser]
 * 인증서 분석 유틸
 *
 * @author 이찬희 (@chanhi2000)
 * @since 2025-03-11
 */
class CertParser {
	companion object {
		private val log by LoggerDelegate()
		@Volatile private var INSTANCE: CertParser? = null
		@JvmStatic fun getInstance(): CertParser = INSTANCE ?: synchronized(this) {
			INSTANCE ?: build().also { INSTANCE = it }
		}
		private fun build(): CertParser = CertParser()

	}

	fun parseCertificate(certData: ByteArray?): X509Certificate? = try {
		log.debug("parseCertificate ... ")
		val cf = CertificateFactory.getInstance("X.509")
		val bais = ByteArrayInputStream(certData)
		cf.generateCertificate(bais) as? X509Certificate
	} catch (e: NullPointerException) {
		log.error("something went WRONG ... reason: {}", e.localizedMessage)
		null
	}
}
