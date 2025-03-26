package com.itinfo.rutilvm.api.socket

import com.itinfo.rutilvm.common.LoggerDelegate

import org.springframework.stereotype.Component
import org.springframework.web.socket.TextMessage
import org.springframework.web.socket.WebSocketSession
import org.springframework.web.socket.handler.TextWebSocketHandler
import java.awt.AWTException
import java.io.IOException

@Component
open class ItWebSocketNotifyHandler : TextWebSocketHandler() {
	// @Autowired private lateinit var wsNotify: ItWsNotifyService

	override fun handleTextMessage(session: WebSocketSession, message: TextMessage) = try {
		log.info("handleTextMessage ... message: {}", message)
		while(session.isOpen) {
			session.sendMessage(TextMessage("helloVNC!"))
		}
		// val payload = message.payload
		// val chatMessage: ChatMessage = Util.Chat.resolvePayload(payload)
		// chatService.handleAction(chatMessage.getRoomId(), session, chatMessage)
	} catch (e: IOException) {
		log.error(e.localizedMessage)
	} catch (e: AWTException) {
		log.error(e.localizedMessage)
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
