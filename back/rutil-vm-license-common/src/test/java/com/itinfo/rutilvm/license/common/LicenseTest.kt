package com.itinfo.rutilvm.license.common

import com.itinfo.rutilvm.common.LoggerDelegate
import org.hamcrest.CoreMatchers.`is`
import org.hamcrest.CoreMatchers.notNullValue
import org.hamcrest.MatcherAssert.assertThat

import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test

import org.slf4j.Logger

/**
 * [LicenseTest]
 * 라이센스 테스트
 *
 * @author ...
 * @since 2024.06.28
 */
class LicenseTest {
    private lateinit var licH: LicenseHelper

    @BeforeEach
    fun setup() {
        log.debug("setup ... ")
        licH = LicenseHelper.getInstance()
    }

    /**
     * [LicenseTest.should_readLicenseProperties]
     */
    @Test
    @DisplayName("@License#readLicenseProperties()")
    fun should_readLicenseProperties() {
        log.debug("should_readLicenseProperties ... ")
        assertThat(licH, `is`(notNullValue()))
    }

    /**
     * [LicenseTest.should_refresh]
     * 1. resources/properties/license.properties 파일을 [LicenseInfo]객체에 담는 행위를 하세요.
     * 2. refresh되어서 값을 출력 후 [LicenseInfo] 값이 null이 아니도록 검증하세요
     */
    @Test
    @DisplayName("@License#refresh()")
    fun should_refresh() {
        log.debug("should_refresh ... ")
        val license: LicenseInfo = LicenseInfo.refresh()
        assertThat(license, `is`(notNullValue()))
        log.debug("licenseInfo FOUND! ... ")
        log.debug("date: ${license.date}")
        log.debug("company: ${license.company}")
        log.debug("auth: ${license.auth}")
        // TODO: 각 프로퍼티 별 assert진행

    }

    companion object {
        private val log: Logger by LoggerDelegate()
    }
}