package com.itinfo.rutilvm.api.socket

import com.itinfo.rutilvm.common.gson

import org.slf4j.LoggerFactory
import java.io.Serializable
import java.time.LocalDateTime
import java.util.concurrent.ConcurrentHashMap

private val log = LoggerFactory.getLogger(WSMessage::class.java)

class WSMessage(
	val title: String = "",
	val content: String = "",
	val tag: WSMessageTag? = WSMessageTag.UNKNOWN,
	val date: LocalDateTime? = LocalDateTime.now(),
): Serializable {
	val symbol: String?
		get() = tag?.symbol

    override fun toString(): String =
        gson.toJson(this)

	class Builder {
		private var bTitle: String = "";fun title(block: () -> String?) { bTitle = block() ?: "" }
		private var bContent: String = "";fun content(block: () -> String?) { bContent = block() ?: "" }
		private var bTag: WSMessageTag? = WSMessageTag.UNKNOWN;fun tag(block: () -> WSMessageTag?) { bTag = block() ?: WSMessageTag.UNKNOWN }
		private var bLocalDateTime: LocalDateTime? = LocalDateTime.now();fun localDateTime(block: () -> LocalDateTime?) { bLocalDateTime = block() ?: LocalDateTime.now() }
		fun build(): WSMessage = WSMessage(bTitle, bContent, bTag, bLocalDateTime)
    }

    companion object {
        inline fun builder(block: WSMessage.Builder.() -> Unit): WSMessage = WSMessage.Builder().apply(block).build()

    }
}

enum class WSMessageTag(
	val symbol: String,
) {
	SUCCESS("✅"),
	ERROR("💀"),
	WARNING("⚠"),
	UNKNOWN("💔");

	companion object {
		private val findMap: MutableMap<String, WSMessageTag> = ConcurrentHashMap<String, WSMessageTag>()
		init {
			WSMessageTag.values().forEach { findMap[it.name.lowercase()] = it }
		}
		@JvmStatic fun findByCode(name: String): WSMessageTag? = findMap[name.lowercase()]
	}
}