package com.itinfo.rutilvm.api.model.computing

import com.itinfo.rutilvm.common.formatEnhanced
import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.common.ovirtDf

import org.ovirt.engine.sdk4.types.Event
import org.ovirt.engine.sdk4.types.LogSeverity
import org.slf4j.LoggerFactory
import java.io.Serializable
import java.util.Date

private val log = LoggerFactory.getLogger(EventVo::class.java)

/**
 * [EventVo]
 * 이벤트
 *
 * @property id [String]  이벤트
 * @property name [String]  이벤트에 해당하는 이름?
 * @property severity [LogSeverity] LogSeverity(Alert, Error, Normal, warning)
 * @property description [String]
 * @property time [String]
 * @property code [Long]
 * @property correlationId [String]
 *
 **/
class EventVo(
	val id: String = "",
	val name: String = "",
    val severity: LogSeverity = LogSeverity.NORMAL,
    val description: String = "",
	private val _time: Date? = null,
    val code: Long = 0L,
	val correlationId: String = ""
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	val time: String
		get() = ovirtDf.formatEnhanced(_time)

	class Builder {
		private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bSeverity: LogSeverity = LogSeverity.NORMAL;fun severity(block: () -> LogSeverity?) { bSeverity = block() ?: LogSeverity.NORMAL }
		private var bDescription: String = "";fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bTime: Date? = null;fun time(block: () -> Date?) { bTime = block() }
		private var bCode: Long = 0L;fun code(block: () -> Long?) { bCode = block() ?: 0L }
		private var bCorrelationId: String = "";fun correlationId(block: () -> String?) { bCorrelationId = block() ?: "" }
		fun build(): EventVo = EventVo(bId, bName, bSeverity, bDescription, bTime, bCode, bCorrelationId)
	}

	companion object {
		inline fun builder(block: EventVo.Builder.() -> Unit): EventVo = EventVo.Builder().apply(block).build()
	}
}

fun Event.toEventVo(): EventVo {
	return EventVo.builder {
		id { this@toEventVo.id() }
		severity { this@toEventVo.severity() }
		description { this@toEventVo.description() }
		time { this@toEventVo.time() }
		code { this@toEventVo.codeAsLong() }
		correlationId { this@toEventVo.correlationId()?: "" }
	}
}
fun List<Event>.toEventVos(): List<EventVo> =
	this@toEventVos.map { it.toEventVo() }
