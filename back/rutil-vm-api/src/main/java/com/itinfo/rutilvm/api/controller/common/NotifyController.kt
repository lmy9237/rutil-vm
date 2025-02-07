package com.itinfo.rutilvm.api.controller.common

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.service.common.ItWsNotifyService
import com.itinfo.rutilvm.api.socket.WSMessage
import com.itinfo.rutilvm.api.socket.WSMessageTag

import io.swagger.annotations.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestParam

@Controller
@Api(tags = ["Notify"])
class NotifyController {
	@Autowired private lateinit var wsNotify: ItWsNotifyService

	@ApiOperation(
		httpMethod="POST",
		value="알림메세지 송신 (테스트용)",
		notes="/topic/public으로 알림메세지를 송신한다."
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="title", value="제목", dataTypeClass=String::class, required=true, paramType="query", defaultValue=""),
		ApiImplicitParam(name="content", value="내용", dataTypeClass=String::class, required=true, paramType="query", defaultValue=""),
		ApiImplicitParam(name="tag", value="유형", dataTypeClass=String::class, required=true, paramType="query", defaultValue="SUCCESS"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "성공"),
	)
	@PostMapping("/api/v1/notify/send")
	fun sendVia(
		@RequestParam title: String = "",
		@RequestParam content: String = "",
		@RequestParam tag: String = "SUCCESS",
	): ResponseEntity<WSMessage> {
		log.debug("sendVia ... title: {}, content: {}, tag: {}", title, content, tag)
		val msg: WSMessage = WSMessage.builder {
			title { title }
			content { content }
			tag { WSMessageTag.findByCode(tag) }
		}
		wsNotify.notify(msg)
		return ResponseEntity.ok(msg)
	}

	@MessageMapping("/notify")	/* 클라이언트 입장에서 메세지 보내는 곳 (e.g. stompClient.send('/app/notify', {}, JSON.stringify(chatMessage))) */
	@SendTo("/topic/public")	/* 클라이언트 입장에서 메세지 보이는 곳 (e.g. stompClient.subscribe('/topic/public', () => { ... }) */
	fun sendMessage(wsMessage: WSMessage): WSMessage = wsMessage

	companion object {
		private val log by LoggerDelegate()
	}
}