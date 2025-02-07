package com.itinfo.rutilvm.license.enc

import com.itinfo.rutilvm.common.LoggerDelegate
import org.slf4j.Logger
import java.util.*
import javax.crypto.Cipher
import javax.crypto.spec.SecretKeySpec

/**
 * [EncUtil]
 * 복호화 유틸
 */
class EncUtil {

	companion object {
		@Volatile private var INSTANCE: EncUtil? = null
		@JvmStatic fun getInstance(): EncUtil = INSTANCE ?: synchronized(this) {
			INSTANCE ?: build().also { INSTANCE = it }
		}
		private fun build(): EncUtil {
			return EncUtil()
		}
		private val log: Logger by LoggerDelegate()
	}

	private val encKey = "ITCLOUD_RUTIL_VM_AES_PRIVATE_KEY" // aes256

	fun encrypt(data: String): String {
		val secretKey = SecretKeySpec(encKey.toByteArray(), "AES")
		val cipher = Cipher.getInstance("AES")
		cipher.init(Cipher.ENCRYPT_MODE, secretKey)

		val encodeValue = cipher.doFinal(data.toByteArray())
		return Base64.getEncoder().encodeToString(encodeValue)
	}

}