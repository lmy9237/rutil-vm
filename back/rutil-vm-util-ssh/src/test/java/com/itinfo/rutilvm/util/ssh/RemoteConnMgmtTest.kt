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
		val sessionHost: Session? = DEFAULT_REMOTE_CONN_HOST01.toInsecureSession()
		assertThat(sessionHost, `is`(notNullValue()))
		assertThat(sessionHost?.isConnected, `is`(true))
	}
	companion object {
		private val log by LoggerDelegate()
		private val DEFAULT_REMOTE_CONN_ENGINE = RemoteConnMgmt.builder {
			host { "192.168.0.70" }
			port { 22 }
			id { "root" }
			prvKey { //  /etc/pki/ovirt-engine/keys/engine_id_rsa
"""
Bag Attributes
    localKeyID: 6D F8 D7 A1 01 70 31 78 1E 7B FA 56 CB 1D 9A 59 E2 28 CF B1
Key Attributes: <No Attributes>
-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDQ0cNriXz0gpre
UW0C4vUPVeQBr3Z5/sB34W8KBO1D4gZ2G91FzT3kmLw6pcsEE0kIIX6hMnPXHD0/
ipazEOwvgmglkqq12lx5+KrA/zf1niI0hmoIJadxmk5EbX8qeacscXHPPKJoNKxc
slmZ+q1hQzNlLNGjylSQWnBZAGKpzqbI11jT3puKfJIF7lgRm1zWU4o6O4TU7S5/
TqvPjx/kpXZkQbNggJcUKnDN9trYFVKQ5fKMMYFottoaHRDf5LODa1Nz9lKuPDt8
EV8vT9bB4HiKBs9ofm8jTCroGmh8LeLHQGGKkLl0cPzHOw0dj0vTe+Ta2YhjbSdi
dUcOP6XtAgMBAAECggEAHpXKuLJ/kdSbWFq2y8hwOlnLNo/7m2y7xhNHz0Dfe6Tc
a2ozY6jnGtdgInrsHGGyvbUiNfwMyYICWo8y+XFOFrtUA8TSqiYci2TnpbL8AEa0
HdteJmlVeCcwtYcQLCl7WeAX2lG4O+kTIdShmRMFWAyet3/0CLh24FnOwMp0qQgu
jsDpxPrDw1+C7vTMaGlXOEeeV2X2PfhIgJfCvfWnLTM5Ricl4vr9QHmuF3Z+iDIW
hG7WxCXKSVVzhddIXxY0FgkEY3pvHmP+KZPGAyHTMDss7M7rr30PXq1A6v2RRyjf
kJ1tncNBtXw/Hq9/Fcbr25EK6ioEZv5qEWUf1qX+pQKBgQD+Mgxo6bmMHpedRkBm
Dmw8Q1Pb2+dgyurAcCxk8ADJ/zbHRHwXxcM5zA5UswoZV+OpBrYZ9Fkt+ZXtghcV
Xu9q9mAwHta4vUM5F1kZ6p85/ijRoDTle5uaht54OYcaqo+OIjlRhnhXIJlTrANJ
P6OFgyusgyTm+Tb1tNsw9LRunwKBgQDSTUCkY75Bouf2JlZaau9YAOGU2GnOU0h6
W2bIHvBQwMBOfZxE5g66Bo7hRMDpU5YNv+qUiHf1J4BgwhYVyjr+IwebOaHJH80f
lM54cxKItSVrVZGS6y+dmVhLEIvGqlSR/32TTfkWl9nHKiLjmKI0Eng2H58erlSR
o88gKQQ78wKBgEo8y6sIN4xYkub30W7831dqQl9/hb+bA5xYJl8ESPa1doYT1joL
I80Jb1YFQ/nK1U5UC3LhDfqDXeoTiDJRm5KdidID76ncfHl7/CW5g+8n7zvpkglD
ZFpo8SgjhPWgwnQ8QokwwIyRlLX/Eqad01/2wxaK5ogeWJLB0xIlJVz5AoGAU8zq
3FbOopMKwcBnGqKP+05mlYxjJQ90yyUO4OHLOzKDrwNIuP+/kIs6djOSd6eSHKqE
DGoQ+wShmGzephIuzcQhrM4bVOyyLUp7t+2KziT44zt2xcen8rH/R/Iw8JpBFuhr
Hr6saj9aTY3R10WkJQHTGyYgnvYyxtIyoAsYH9cCgYBTc+9v/ND+crQIUDD0hPA1
HDZMBxOmzZg7BuVqPWEvsEEG8oqf1Oy7hWd2xfhpN7tn17uje/JjJjTnyn8ajoAK
ipvhV0xU/ByB2lXLwj3WDN7BcGRxJtcU+yZmB8rATDSrs5Y8GfJkfB/BgMZPNPdm
PUc+B4CsVFpbybj8iBf+RQ==
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
