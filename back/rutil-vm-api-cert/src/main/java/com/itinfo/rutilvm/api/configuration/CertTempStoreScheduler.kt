package com.itinfo.rutilvm.api.configuration

import com.itinfo.rutilvm.common.LoggerDelegate
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import java.io.File
import java.time.DateTimeException
import java.time.Duration
import java.time.LocalDateTime

/**
 * [CertTempStoreScheduler]
 * oVirt 관련 인증서 임시보관 처리 스케쥴러
 *
 * @since 2025-03-11
 * @author 이찬희 (@chanhi2000)
 */
@Component
open class CertTempStoreScheduler {
	@Autowired private lateinit var certConfig: CertConfig

	// @Scheduled(fixedDelay = 10 * 60 * 1000) // 10분 단위
	@Scheduled(cron = "@midnight")
	open fun downloadEngineCerts() {
		log.info("downloadEngineCerts ... ")
		val current = LocalDateTime.now()
		val dateDownloaded: LocalDateTime? = readLastUpdated()
		val durationCap: Long = 60 * 60 * 1000
		if (dateDownloaded != null &&
			Duration.between(dateDownloaded, current).toMillis() < durationCap) {
			// 이미 받았은 상태일 때 1시간이 지났을 경우 다시 다운로드
			// 아닐 때 함수 실행 강제 취소
			log.info("[ABORT] downloadEngineCerts ... < 1hr")
			return
		}
		certConfig.engineCertManagers()
		setLastUpdated(current)
	}

	private fun setLastUpdated(date: LocalDateTime): Boolean {
		log.info("recordDatetimeDownloaded ... ")
		if (!fDateDownloaded.exists())
			fDateDownloaded.createNewFile()
		fDateDownloaded.printWriter().use {
			it.print("")
			it.write(date.toString())
			it.close()
			return true
		}
	}

	private fun readLastUpdated(): LocalDateTime? {
		log.info("readLastUpdated ... ")
		try {
			if (!fDateDownloaded.exists() || fDateDownloaded.readText().isEmpty()) return null
			log.debug("readLastUpdated ... fDateDownloaded.readText(): {}", fDateDownloaded.readText())
			return LocalDateTime.parse(fDateDownloaded.readText())
		} catch (e: DateTimeException) {
			log.error("something went WRONG ... reason: {}", e.localizedMessage)
			return null
		}
	}

	private val fDateDownloaded: File
		get() = File("${certConfig.ovirtSSHCertLocation}${File.separator}${FILENAME_DATE_CERTS_DOWNLOADED}")

	companion object {
		private const val FILENAME_DATE_CERTS_DOWNLOADED = "date-certs-dw.txt"
		private val log by LoggerDelegate()
	}
}
