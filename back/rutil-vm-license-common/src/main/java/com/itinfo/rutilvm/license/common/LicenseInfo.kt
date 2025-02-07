package com.itinfo.rutilvm.license.common

import com.itinfo.rutilvm.common.LoggerDelegate
import org.slf4j.Logger
import java.io.Serializable

/**
 * [LicenseInfo]
 * 라이센스 정보
 * 
 * @author ...
 * @since 2024.06.28
 */
data class LicenseInfo(
    val date: String = "",
    val company: String = "",
    val auth: String = "",
): Serializable {

    companion object {
        private val licH: LicenseHelper = LicenseHelper.getInstance()
        private val log: Logger by LoggerDelegate()
        fun refresh(): LicenseInfo = with(licH) {
            log.debug("refresh ... ")
            val newLicenseInfo = LicenseInfo(dateV, companyV, authV)
            return newLicenseInfo
        }
    }
}

fun a() {
    val a = LicenseInfo.refresh()
}