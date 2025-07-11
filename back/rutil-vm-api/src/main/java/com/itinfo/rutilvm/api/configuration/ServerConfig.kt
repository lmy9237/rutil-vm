package com.itinfo.rutilvm.api.configuration

import com.itinfo.rutilvm.api.ovirt.AdminConnectionService
import com.itinfo.rutilvm.common.LoggerDelegate
import org.apache.catalina.Context
import org.apache.catalina.connector.Connector
import org.apache.tomcat.util.descriptor.web.SecurityCollection
import org.apache.tomcat.util.descriptor.web.SecurityConstraint
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory
import org.springframework.boot.web.servlet.server.ServletWebServerFactory
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import kotlin.jvm.Throws

@Configuration
class ServerConfig() {
	@Autowired private lateinit var iAdminConn: AdminConnectionService

	/**
	 * [ServerConfig.makeFirstConnection]
	 * 단일 Session유지를 위한 첫 연결시도
	 *
	 */
	@Bean
	fun makeFirstConnection() {
		log.debug("makeFirstConnection ... ")
		iAdminConn.getConnection()
	}

    @Bean
    @Throws(Exception::class)
    fun servletContainer(): ServletWebServerFactory {
		log.debug("servletContainer ... ")
        val tomcat = object : TomcatServletWebServerFactory() {
            override fun postProcessContext(context: Context) {
                val securityConstraint = SecurityConstraint().apply {
                    userConstraint = "CONFIDENTIAL"
                }
                val collection = SecurityCollection().apply {
                    addPattern("/*")
                }
                securityConstraint.addCollection(collection)
                context.addConstraint(securityConstraint)
            }
        }
        tomcat.addAdditionalTomcatConnectors(redirectConnector())
        return tomcat
    }

    private fun redirectConnector(): Connector {
		log.debug("redirectConnector ... ")
        val connector = Connector(TomcatServletWebServerFactory.DEFAULT_PROTOCOL)
        connector.scheme = "http"
        connector.port = 8080
        connector.secure = false
        connector.redirectPort = 8443
        return connector
    }

	companion object {
		private val log by LoggerDelegate()
	}
}
