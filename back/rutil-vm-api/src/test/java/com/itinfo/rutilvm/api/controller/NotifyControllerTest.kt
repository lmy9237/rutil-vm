package com.itinfo.rutilvm.controller

import com.itinfo.rutilvm.api.socket.WSMessage
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.messaging.converter.MappingJackson2MessageConverter
import org.springframework.messaging.simp.stomp.StompFrameHandler
import org.springframework.messaging.simp.stomp.StompHeaders
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter
import org.springframework.web.socket.WebSocketHttpHeaders
import org.springframework.web.socket.client.standard.StandardWebSocketClient
import org.springframework.web.socket.messaging.WebSocketStompClient
import java.lang.reflect.Type
import java.util.concurrent.BlockingQueue
import java.util.concurrent.LinkedBlockingDeque
import java.util.concurrent.TimeUnit

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class NotifyControllerTest {
	@Autowired lateinit var restTemplate: TestRestTemplate

	private val url = "ws://localhost:8080/ws"

	@Test
	fun `test send message through WebSocket`() {
		val stompClient = WebSocketStompClient(StandardWebSocketClient())
		stompClient.messageConverter = MappingJackson2MessageConverter()

		val stompHeaders = WebSocketHttpHeaders()
		val stompSession = stompClient.connect(url, stompHeaders, object : StompSessionHandlerAdapter() {}).get(1, TimeUnit.SECONDS)

		val messageQueue: BlockingQueue<WSMessage> = LinkedBlockingDeque()

		stompSession.subscribe("/topic/public", object : StompFrameHandler {
			override fun getPayloadType(stompHeaders: StompHeaders): Type = WSMessage::class.java

			override fun handleFrame(stompHeaders: StompHeaders, payload: Any?) {
				messageQueue.offer(payload as WSMessage)
			}
		})

		val wsMessage = WSMessage("Test message")
		stompSession.send("/app/notify", wsMessage)

		val receivedMessage = messageQueue.poll(1, TimeUnit.SECONDS)

		assertNotNull(receivedMessage)
		assertEquals(wsMessage, receivedMessage)
	}
}