package com.itinfo.rutilvm.api.socket

import com.itinfo.rutilvm.common.LoggerDelegate
// import com.itinfo.rutilvm.api.service.common.ItWsNotifyService

// import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import org.springframework.web.socket.TextMessage
import org.springframework.web.socket.WebSocketSession
import org.springframework.web.socket.handler.TextWebSocketHandler

@Component
class ItWebSocketNotifyHandler : TextWebSocketHandler() {
	// @Autowired private lateinit var wsNotify: ItWsNotifyService

	override fun handleTextMessage(session: WebSocketSession, message: TextMessage) {
		log.info("handleTextMessage ... message: {}", message)
		TODO("NOT IMPLEMENTED")
		// val payload = message.payload
		// val chatMessage: ChatMessage = Util.Chat.resolvePayload(payload)
		// chatService.handleAction(chatMessage.getRoomId(), session, chatMessage)
	}

	companion object {
		private val log by LoggerDelegate()
	}
}