package com.itinfo.service.engine

import com.google.gson.Gson
import com.google.gson.GsonBuilder
import com.itinfo.rutilvm.common.LoggerDelegate

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Component

@Component
class WebsocketService {
	private val gson: Gson
		get() = GsonBuilder().create()

	@Autowired private lateinit var template: SimpMessagingTemplate

	fun notify(vo: Any) {
		sendMessage("/topic/notify", gson.toJson(vo))
	}

	fun reload(vo: Any, target: String) {
		sendMessage("/topic/$target/reload", gson.toJson(vo))
	}

	fun custom(vo: Any, topic: String) {
		sendMessage("/topic/$topic", gson.toJson(vo))
	}

	fun sendMessage(dest: String, msg: String) {
		log.debug("sendMessage('$dest', '$msg') ...",)
		if (dest.contains("reload")) {
			template.convertAndSend(dest, "")
			return
		}
		template.convertAndSend(dest, msg)
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
