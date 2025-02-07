package com.itinfo.security

import com.itinfo.rutilvm.common.LoggerDelegate

import org.apache.commons.codec.binary.Base64

import java.io.File
import java.io.FileInputStream
import java.security.cert.Certificate
import java.security.cert.CertificateEncodingException
import java.security.cert.CertificateFactory

class PKIResources {
	companion object {
		private val log by LoggerDelegate()

		@Volatile private var caCertificate: Resource? = null
		@JvmStatic fun getCaCertificate(): Resource =
			caCertificate ?: synchronized(this) {
				caCertificate ?: initCaCertificate().also { caCertificate = it }
			}
		private fun initCaCertificate(): Resource = Resource(
			EngineLocalConfig.getInstance().getPKICACert(),
			Format.X509_PEM_CA,
			null
		)

		@Volatile private var qemuCaCertificate: Resource? = null
		@JvmStatic fun getQemuCaCertificate(): Resource =
			qemuCaCertificate ?: synchronized(this) {
				qemuCaCertificate ?: initQemuCaCertificate().also { qemuCaCertificate = it }
			}
		private fun initQemuCaCertificate() : Resource = Resource(
			EngineLocalConfig.getInstance().getPKIQemuCACert(),
			Format.X509_PEM_CA,
			null
		)

		@Volatile private var engineCertificate: Resource? = null
		@JvmStatic fun getEngineCertificate(): Resource =
			engineCertificate ?: synchronized(this) {
				engineCertificate ?: initEngineCertificate().also { engineCertificate = it }
			}

		private fun initEngineCertificate(): Resource = Resource(
			EngineLocalConfig.getInstance().getPKIEngineCert(),
			Format.X509_PEM,
			// Config.getValue(ConfigValues.SSHKeyAlias)
			null
		)

		enum class Format(
			val contentType: String,
			private val formatter: IFormatter
		): IFormatter {
			X509_PEM_CA("application/x-x509-ca-cert", formatPEM),
			X509_PEM("application/x-x509-cert", formatPEM);
			// OPENSSH_PUBKEY("text/plain", formatOpenSSH);

			override fun toString(cert: Certificate, alias: String?): String =
				formatter.toString(cert, alias)
		}

		val formatPEM = IFormatter{ cert: Certificate, _: String? ->
			try {
				return@IFormatter String.format(
					"-----BEGIN CERTIFICATE-----%1\$c" +
					"%2\$s" +
					"-----END CERTIFICATE-----%1\$c",
					'\n',
					Base64(76, byteArrayOf('\n'.code.toByte()))
						.encodeToString(cert.encoded)
				)
			} catch (e: CertificateEncodingException) {
				throw RuntimeException(e)
			}
		}
		/*
		val formatOpenSSH = IFormatter { cert: Certificate, alias: String? ->
			OpenSSHUtils.getKeyString(
				cert.publicKey,
				alias
			)
		}
		*/

		fun interface IFormatter {
			fun toString(cert: Certificate, alias: String?): String
		}
	}

	class Resource(
		_cert: File,
		var defaultFormat: Format,
		private var defaultAlias: String? = null,
	) {
		var cert: Certificate
		init {
			try {
				FileInputStream(_cert).use { `in` ->
					this.cert = CertificateFactory.getInstance("X.509").generateCertificate(`in`)
				}
			} catch (e: Exception) {
				log.error(e.localizedMessage)
				throw RuntimeException(e)
			}
		}

		fun toString(format: Format? = null, alias: String? = null): String
			= (format ?: defaultFormat).toString(cert, alias ?: defaultAlias)

		fun getContentType(format: Format? = null): String =
			(format ?: defaultFormat).contentType
	}
}