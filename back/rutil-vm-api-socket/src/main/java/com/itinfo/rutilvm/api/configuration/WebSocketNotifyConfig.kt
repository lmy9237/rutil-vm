package com.itinfo.rutilvm.api.configuration

import org.springframework.context.annotation.Configuration
import org.springframework.messaging.simp.config.MessageBrokerRegistry
import org.springframework.scheduling.annotation.EnableScheduling
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker
import org.springframework.web.socket.config.annotation.StompEndpointRegistry
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer


@Configuration
@EnableWebSocketMessageBroker
open class WebSocketNotifyConfig(

): WebSocketMessageBrokerConfigurer {


	override fun configureMessageBroker(registry: MessageBrokerRegistry) {
		registry.enableSimpleBroker("/topic")
		registry.setApplicationDestinationPrefixes("/app")
		// super.configureMessageBroker(registry)
	}
	override fun registerStompEndpoints(registry: StompEndpointRegistry) {
		// super.registerStompEndpoints(registry)
		registry.addEndpoint("/ws")
			.setAllowedOrigins("http://localhost:3000")
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
}