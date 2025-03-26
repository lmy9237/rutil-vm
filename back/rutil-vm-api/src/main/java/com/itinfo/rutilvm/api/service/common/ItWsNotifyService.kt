package com.itinfo.rutilvm.api.service.common

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.api.socket.WSMessage

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Service

interface ItWsNotifyService {
	fun notify(wsMessage: WSMessage)
}

@Service
class NotifyServiceImpl(

): BaseService(), ItWsNotifyService {
	// @Autowired private lateinit var msgTemplate: SimpMessagingTemplate

	override fun notify(wsMessage: WSMessage) {
		sendMessage(wsMessage)
	}

	private fun sendMessage(msg: WSMessage, destination: String = "/topic/public") {
		log.debug("sendMessage('{}', '{}') ...",msg, destination)
		/*
		if (destination.contains("reload")) {
			msgTemplate.convertAndSend(destination, "")
			return
		}
		msgTemplate.convertAndSend(destination, msg)
		*/
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
