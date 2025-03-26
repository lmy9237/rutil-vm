package com.itinfo.rutilvm.api.configuration

import com.itinfo.rutilvm.api.socket.TcpWebsocketHandler
import com.itinfo.rutilvm.common.LoggerDelegate
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.socket.WebSocketSession
import org.springframework.web.socket.config.annotation.EnableWebSocket
import org.springframework.web.socket.config.annotation.WebSocketConfigurer
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry

@Configuration
@EnableWebSocket
open class WebSocketNotifyConfig(

): WebSocketConfigurer {
	@Autowired private lateinit var propConfig: PropertiesConfig
	@Autowired private lateinit var tcpWebSocketHandler: TcpWebsocketHandler
	private val sessions: Map<String, WebSocketSession> = hashMapOf()

	@Bean
	open fun findAllSessions(): Map<String, WebSocketSession> = sessions

	override fun registerWebSocketHandlers(registry: WebSocketHandlerRegistry) {
		registry.addHandler(tcpWebSocketHandler, "/ws/**")
		// registry.addHandler(tcpWebSocketHandler, "/ws/{target}")
			.setAllowedOrigins(*propConfig.corsAllowedOriginsFull.toTypedArray())
	}

	/*
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

			}
			.withSockJS()
			*/
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
	*/
	companion object {
		private val log by LoggerDelegate()
	}
}
