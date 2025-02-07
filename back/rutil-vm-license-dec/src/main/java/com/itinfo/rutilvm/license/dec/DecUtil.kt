package com.itinfo.rutilvm.license.dec

import com.itinfo.rutilvm.common.LoggerDelegate
import org.slf4j.Logger
import java.util.Base64
import javax.crypto.Cipher
import javax.crypto.spec.SecretKeySpec


/**
 * [DecUtil]
 * 복호화 유틸
 */
class DecUtil {

	companion object {
		@Volatile private var INSTANCE: DecUtil? = null
		@JvmStatic fun getInstance(): DecUtil = INSTANCE ?: synchronized(this) {
			INSTANCE ?: build().also { INSTANCE = it }
		}
		private fun build(): DecUtil {
			return DecUtil()
		}
		private val log: Logger by LoggerDelegate()
	}

	private val encKey = "ITCLOUD_RUTIL_VM_AES_PRIVATE_KEY" // aes256

	fun decrypt(data: String): String {
		val secretKey = SecretKeySpec(encKey.toByteArray(), "AES")
		val cipher = Cipher.getInstance("AES")
		cipher.init(Cipher.ENCRYPT_MODE, secretKey)

		val decode = Base64.getDecoder().decode(data)
		val decodeValue = cipher.doFinal(decode)
		return String(decodeValue)
	}

}
