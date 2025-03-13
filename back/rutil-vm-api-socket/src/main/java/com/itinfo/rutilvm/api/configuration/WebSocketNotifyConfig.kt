package com.itinfo.rutilvm.api.configuration

import com.itinfo.rutilvm.common.LoggerDelegate
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Configuration
import org.springframework.messaging.simp.config.MessageBrokerRegistry
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker
import org.springframework.web.socket.config.annotation.StompEndpointRegistry
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer

@Configuration
@EnableWebSocketMessageBroker
open class WebSocketNotifyConfig(

): WebSocketMessageBrokerConfigurer {
	@Autowired private lateinit var propConfig: PropertiesConfig

	override fun configureMessageBroker(registry: MessageBrokerRegistry) {
		registry.enableSimpleBroker("/topic")
		registry.setApplicationDestinationPrefixes("/app")
		// super.configureMessageBroker(registry)
	}
	override fun registerStompEndpoints(registry: StompEndpointRegistry) {
		// super.registerStompEndpoints(registry)
		registry.addEndpoint("/ws")
			.setAllowedOrigins(*propConfig.corsAllowedOriginsFull.toTypedArray())
			/*.setHandshakeHandler { request, response, wsHandler, attributes ->
				log.info("registerStompEndpoints ... onHandshake")

			}*/
			.withSockJS()
		/*
		npm i sockjs-client

		...

		var stompClient = null;

        function connect() {
			var socket = new SockJS('/ws');
			stompClient = Stomp.over(socket);
			stompClient.connect({}, function (frame) {
				console.log('Connected: ' + frame);
				stompClient.subscribe('/topic/public', function (message) {
					showMessage(JSON.parse(message.body));
				});
			});
		}
		*/
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
