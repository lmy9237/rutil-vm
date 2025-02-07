package com.itinfo.rutilvm.license.common

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.util.PropertiesHelper

import org.slf4j.Logger
import java.util.Properties

/**
 * [LicenseHelper]
 * 라이센스 정보처리 핼퍼
 *
 * @author ...
 * @since 2024.06.28
 */
class LicenseHelper {
    private var licenseProp: Properties? = null

    val dateV: String
        get() = licenseProp?.get(LicensePropertiesPolicy.KEY_DATE).toString()
    val companyV: String
        get() = licenseProp?.get(LicensePropertiesPolicy.KEY_COMPANY).toString()
    val authV: String
        get() = licenseProp?.get(LicensePropertiesPolicy.KEY_AUTH).toString()

    companion object {
        private const val PROP_LICENSE_FULL_PATH = "properties/license.properties"

        private val propH: PropertiesHelper = PropertiesHelper.getInstance()
        @Volatile private var INSTANCE: LicenseHelper? = null
        @JvmStatic fun getInstance(): LicenseHelper = INSTANCE ?: synchronized(this) {
            INSTANCE ?: build().also { INSTANCE = it }
        }
        private fun build(): LicenseHelper {
            log.debug("build ... ")
            val licH = LicenseHelper()
            licH.licenseProp = propH.loadProperties(PROP_LICENSE_FULL_PATH)
            return licH
        }
        private val log: Logger by LoggerDelegate()
    }
}