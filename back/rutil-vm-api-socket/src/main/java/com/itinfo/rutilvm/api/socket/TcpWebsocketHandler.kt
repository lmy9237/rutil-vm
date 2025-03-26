package com.itinfo.rutilvm.api.socket

import com.itinfo.rutilvm.common.LoggerDelegate
import org.springframework.stereotype.Component
import org.springframework.web.socket.BinaryMessage
import org.springframework.web.socket.CloseStatus
import org.springframework.web.socket.TextMessage
import org.springframework.web.socket.WebSocketSession
import org.springframework.web.socket.handler.BinaryWebSocketHandler
import java.net.Socket
import java.nio.ByteBuffer
import java.util.concurrent.Executors

@Component
open class TcpWebsocketHandler: BinaryWebSocketHandler() {

	// Define the VNC server host and port
	// Executor for handling background I/O
	private val executor = Executors.newCachedThreadPool()

	override fun afterConnectionEstablished(session: WebSocketSession) {
		super.afterConnectionEstablished(session)
		log.info("afterConnectionEstablished ... sessionId: {}", session.id)

		val uri = session.uri ?: run {
			session.close(CloseStatus.BAD_DATA)
			return
		}

		val pathSegments = uri.path.split("/").filter { it.isNotBlank() && it != "ws"}
		// Assume the first segment is "ws", and the second (if exists) is the target.
		val targetSegment = pathSegments.firstOrNull()

		val (targetHost, targetPort) = if (targetSegment != null && targetSegment.contains(":")) {
			val parts = targetSegment.split(":")
			parts[0] to parts[1].toIntOrNull()
		} else {
			// Provide default values if target is not provided
			"192.168.0.70" to 5900
		}
		log.info("afterConnectionEstablished ... targetHost: {}, targetPort: {}", targetHost, targetPort)

		if (targetPort == null) {
			session.close(CloseStatus.BAD_DATA)
			return
		}

		// Open TCP connection in a background thread
		executor.submit {
			try {
				Socket(targetHost, targetPort).use { tcpSocket ->
					val tcpInput = tcpSocket.getInputStream()
					val buffer = ByteArray(1024)
					while (session.isOpen) {
						val bytesRead = tcpInput.read(buffer)
						if (bytesRead == -1) break
						session.sendMessage(BinaryMessage(ByteBuffer.wrap(buffer, 0, bytesRead)))
					}
				}
			} catch (ex: Exception) {
				session.close(CloseStatus.SERVER_ERROR)
			}
		}
	}

	override fun afterConnectionClosed(
		session: WebSocketSession,
		status: CloseStatus
	) {
		super.afterConnectionClosed(session, status)
		log.info("afterConnectionClosed ... session: {}, status: {}", session, status)
		// Clean up any resources or TCP connections associated with the session.
	}

	override fun handleTransportError(
		session: WebSocketSession,
		exception: Throwable
	) {
		log.error("handleTransportError ... sessionId: {}, exception: {}", session.id, exception.localizedMessage)
	}

	override fun handleTextMessage(
		session: WebSocketSession,
		message: TextMessage
	) {
		super.handleTextMessage(session, message)
		log.info("handleTextMessage ... session: {}, message: {}", session, message)
		// Here, you would write code to send this data to the VNC server's TCP socket.
		// For example, you could store the socket reference in a map per session and write to its OutputStream.
	}

	override fun supportsPartialMessages(): Boolean = false

	companion object {
		private val log by LoggerDelegate()
	}
}
