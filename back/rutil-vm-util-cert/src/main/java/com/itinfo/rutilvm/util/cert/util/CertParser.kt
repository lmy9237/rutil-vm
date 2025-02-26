package com.itinfo.rutilvm.util.cert.util

import java.io.ByteArrayInputStream
import java.security.cert.CertificateFactory
import java.security.cert.X509Certificate
import kotlin.jvm.Throws

class CertParser {
	companion object {
		@Volatile private var INSTANCE: CertParser? = null
		@JvmStatic fun getInstance(): CertParser = INSTANCE ?: synchronized(this) {
			INSTANCE ?: build().also { INSTANCE = it }
		}
		private fun build(): CertParser = CertParser()

	}
	@Throws(NullPointerException::class)
	fun parseCertificate(certData: ByteArray?): X509Certificate? {
		val cf = CertificateFactory.getInstance("X.509")
		val bais = ByteArrayInputStream(certData)
		return cf.generateCertificate(bais) as? X509Certificate
	}
}
