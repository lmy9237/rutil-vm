package com.itinfo.rutilvm.api.configuration

import org.apache.catalina.Context
import org.apache.catalina.connector.Connector
import org.apache.tomcat.util.descriptor.web.SecurityCollection
import org.apache.tomcat.util.descriptor.web.SecurityConstraint
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory
import org.springframework.boot.web.servlet.server.ServletWebServerFactory
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import kotlin.jvm.Throws

@Configuration
class ServerConfig () {

    @Bean
    @Throws(Exception::class)
    fun servletContainer(): ServletWebServerFactory {
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
        val connector = Connector(TomcatServletWebServerFactory.DEFAULT_PROTOCOL)
        connector.scheme = "http"
        connector.port = 8080
        connector.secure = false
        connector.redirectPort = 8443
        return connector

    }

}