package com.itinfo.configuration

import org.springframework.context.annotation.Configuration
import org.springframework.scheduling.annotation.EnableScheduling
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker
import org.springframework.web.socket.config.annotation.StompEndpointRegistry
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer

@Configuration
@EnableWebSocketMessageBroker
@EnableScheduling
class WebSocketConfig: WebSocketMessageBrokerConfigurer {
    override fun registerStompEndpoints(registry: StompEndpointRegistry) {
        // super.registerStompEndpoints(registry)
        registry.addEndpoint("/topic").setAllowedOrigins("*").withSockJS()
    }
}