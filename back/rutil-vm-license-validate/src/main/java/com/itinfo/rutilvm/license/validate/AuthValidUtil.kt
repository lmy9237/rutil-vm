package com.itinfo.rutilvm.license.validate

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.license.common.LicenseInfo
import com.itinfo.rutilvm.license.dec.DecUtil
import com.itinfo.rutilvm.license.enc.EncUtil
import org.slf4j.Logger
import java.time.LocalDate
import java.time.format.DateTimeFormatter


/**
 * [AuthValidUtil]
 * AUTH 검증 유틸
 */
class AuthValidUtil {

	companion object {
		@Volatile private var INSTANCE: AuthValidUtil? = null
		@JvmStatic fun getInstance(): AuthValidUtil = INSTANCE ?: synchronized(this) {
			INSTANCE ?: build().also { INSTANCE = it }
		}
		private fun build(): AuthValidUtil {
			return AuthValidUtil()
		}
		private val log: Logger by LoggerDelegate()
	}

	private val enc = EncUtil.getInstance()
	private val dec = DecUtil.getInstance()

	fun validate(auth: String): Boolean {
		val licenseInfo = LicenseInfo.refresh()
		val encryptAuth = enc.encrypt(auth)
		val decryptAuth = dec.decrypt(encryptAuth)
		return licenseInfo.auth == decryptAuth
	}


	fun expired(): Boolean{
		val dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")
		val dateProperties = LocalDate.parse(LicenseInfo.refresh().date, dateFormatter)
		val nowDate = LocalDate.now()

		return dateProperties.isAfter(nowDate)
	}
}
