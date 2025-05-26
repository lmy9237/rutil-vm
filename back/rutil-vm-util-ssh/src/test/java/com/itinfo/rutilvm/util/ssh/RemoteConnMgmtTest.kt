package com.itinfo.rutilvm.util.ssh

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.util.ssh.model.RemoteConnMgmt
import com.itinfo.rutilvm.util.ssh.model.toInsecureSession
import com.jcraft.jsch.JSch
import com.jcraft.jsch.Logger
import com.jcraft.jsch.Session
import org.hamcrest.CoreMatchers.`is`
import org.hamcrest.CoreMatchers.notNullValue
import org.hamcrest.MatcherAssert.assertThat
import org.junit.jupiter.api.BeforeEach

import org.junit.jupiter.api.Test

/**
 * [RemoteConnMgmtTest]
 * SSH연결 테스트
 *
 * @author 이찬희 (chanhi2000)
 * @since 2025.02.24
 */
class RemoteConnMgmtTest {

	@BeforeEach
	fun setup() {
		JSch.setLogger(object : Logger {
			override fun isEnabled(level: Int): Boolean = true
			override fun log(level: Int, message: String) {
				when(level) {
					Logger.INFO -> log.info("com.jcraft.jsch: {}", message)
					Logger.WARN -> log.warn("com.jcraft.jsch: {}", message)
					Logger.FATAL, Logger.ERROR -> log.error("com.jcraft.jsch: {}", message)
					else -> log.debug("com.jcraft.jsch: {}", message)
				}

			}
		})
	}

	@Test
	fun should_insecurelyConnect() {
		log.debug("should_insecurelyConnect ... ")
		val sessionEngine: Session? = DEFAULT_REMOTE_CONN_ENGINE.toInsecureSession()
		assertThat(sessionEngine, `is`(notNullValue()))
		assertThat(sessionEngine?.isConnected, `is`(true))

		// val resourcePath = this.javaClass.classLoader.getResource("id_rsa_host01")?.toURI() ?: throw IllegalStateException("id_rsa not found in resources")
		// val sessionHost: Session? = DEFAULT_REMOTE_CONN_HOST01.toInsecureSession2(resourcePath.toString().replace("file:/", ""))
		/*
		val sessionHost: Session? = DEFAULT_REMOTE_CONN_HOST01.toInsecureSession()
		assertThat(sessionHost, `is`(notNullValue()))
		assertThat(sessionHost?.isConnected, `is`(true))
		*/
	}
	companion object {
		private val log by LoggerDelegate()
		private val DEFAULT_REMOTE_CONN_ENGINE = RemoteConnMgmt.builder {
			host { "192.168.0.55" }
			port { 22 }
			id { "root" }
			prvKey { //  /etc/pki/ovirt-engine/keys/engine_id_rsa
				"""
Bag Attributes
	localKeyID: D9 45 F4 E3 DB F2 3E F8 3F 38 70 5D C6 4B 51 F0 40 A0 5B 4B
Key Attributes: <No Attributes>
-----BEGIN PRIVATE KEY-----
MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC5vUQayNUslENs
V2Bjcr94/C+AvqnGpP1JAxCZtvb8aL8wPW7PmazkPeKKnGiXooG1rOAGSdORWzNL
3vXix/u5In4d2uw8J/0eW/tIGfQ2KR9GKhR6SJeTSFTh9medM4619x4RFu5wAyBf
ESpS3qBSb3ateGyvNR03DbclxZsrtWJC0FiQIGqBT8ln0FflWeb1Bl1HWsZb541M
wV58ohfXha1fH2yh64rJQw84o3YoQijIvOPxlS+4hnlvH1v5FbSKGZzJWdM5uxGq
dL/yPDZQTQXD/ifpeUcu4GkpC0bre/hR4IVtZ9xXkP7/l6ggSryRpWhHcAuBZCgQ
B2oAHgD5AgMBAAECggEBAIeFi02nv7LZMyC32EJ3lTFngBmGBEZGV/CP5eriTu/4
VZeTG2kqDbYzWTodyUrqbY3rZ0HvWAk07Aat1eb0V7zLaA3MkJWL7+nY303Kch+a
fZEqXuqiUMZL/nMo4I0Y80Xd2vhJLQxZm6MB2UnB2mSLo6IKvfJQ5NIolbtfpUqL
vCAvv4Ya/mdSsJ+Mc5VdK6gN/4kzr+ZGJHzfgIjcptHSzdI8viyLgmnGx92tI/wV
MpXGMeCBV+LTRs16wLxjQQvpOshUp18Xh2K9I4l4Tz8LFOAcLsGDVDRGESkGODlL
cXux9HGryrfLHjZUd5c8ee6kjPoBwetBP7X2L/58tOkCgYEA8U8vmbjEQE9cwMyk
zY+LeuHupoMR9fiFFP7MQlU0WJLnxewHuuEb+fM9k8eM+U5skdpJIJICsZmtgaxF
aCAw8GP0uivdOggTrseVUsAkz4vtIPL82DoWz4pqffYpdZxxl8EMx7DC61cRFLeI
wJS+2hGcqzNc+DeaH/sGJJPzOGsCgYEAxQwFDXylMkRGOrcA0rIkSfng/cVZPmfT
88D8VHCuc+3eWmAzsQ+eMzynpUiF+TsMyuu0+6WfkyjMj2H2tgnu1YVJkIkf4AYd
AMYsqtLMLdcL2llbQiRcbhJ/a0ttLTu0eretE5Q727UZmLSuBotSOwhTBxLGZqkI
5kMUMO+YVSsCgYEAwplcRrh1M3OM1kJySP+QuPlIjum2a0kOcZ8FNB0oSKG33an5
leCBwjFBoFJVwptW/MwvGuAE4hqPjLpTgqQrM0E4k4ZaMrlevh1fs0sWpHUwNtkd
xHYb/SSfupLwXlNaW8ooN0W5+zXMpYtY8g1CV/PKB1o1iEq2tUGnc4oIo58CgYBc
VlibzFhBaPscEpvhIDefLuh/IxbCBretFzdnfnJRwxsacNBoXbA9xGOvMYAOndxN
zwy9jAxuUoUhf7+z6I2yI0ao44k7WsIGlddiqWui444bYRpBsXZa4nIxXmQn+T2G
8EG71hAC0ifPhoOyb2E2Zp05yFOO0hFojfCNSgmxhwKBgQDwsittWc1OSUvmFNfz
weCK7trIV0zuTiIUXeYchTzSqhGz5vIZU+KSt9sGllfrzEvTHbkVIa1D8v1saFuB
QYtSTmsZUR6/m7G/c5wo2va0OWGY7kbCRYnZLttjM3Ny5mXg6ZfZH1EeXBjhNOhj
WajFFSz6JqxQudsaQGlcEFZfGA==
-----END PRIVATE KEY-----
""".trimIndent()
			}
		}
		private val DEFAULT_REMOTE_CONN_HOST01 = RemoteConnMgmt.builder {
			host { "rutilvm-dev.host02" }
			port { 22 }
			id { "root" }
			prvKey { """-----BEGIN PRIVATE KEY-----
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
IDJQcgrKRuzfRDuOgUMOi70nXyaeNw==
-----END PRIVATE KEY-----

""".trimIndent() }
		}
	}
}
