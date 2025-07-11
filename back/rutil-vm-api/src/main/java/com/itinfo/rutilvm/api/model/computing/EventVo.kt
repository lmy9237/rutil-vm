package com.itinfo.rutilvm.api.model.computing

import com.itinfo.rutilvm.api.ovirt.business.AuditLogSeverity
import com.itinfo.rutilvm.api.ovirt.business.AuditLogType
import com.itinfo.rutilvm.api.ovirt.business.toAuditLogSeverity
import com.itinfo.rutilvm.common.formatEnhancedFromLDT
import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.common.ovirtDf
import com.itinfo.rutilvm.common.toLocalDateTime

import org.ovirt.engine.sdk4.types.Event
import org.slf4j.LoggerFactory
import java.io.Serializable
import java.time.LocalDateTime

private val log = LoggerFactory.getLogger(EventVo::class.java)

/**
 * [EventVo]
 * 이벤트
 *
 * @property id [String]  이벤트
 * @property name [String]  이벤트에 해당하는 이름?
 * @property severity [AuditLogSeverity] 이벤트 심각도
 * @property description [String]
 * @property time [String]
 * @property logType [AuditLogType] 이벤트 유형
 * @property correlationId [String]
 *
 **/
class EventVo(
	val id: String = "",
	val name: String = "",
    val severity: AuditLogSeverity? = AuditLogSeverity.unknown,
    val description: String = "",
	private val _time: LocalDateTime? = null,
	val logType: AuditLogType? = AuditLogType.unassigned,
	val correlationId: String = ""
): Serializable {

	val severityCode: String		get() = severity?.code ?: AuditLogSeverity.unknown.code
	val severityEn: String			get() = severity?.en ?: "N/A"
	val severityKr: String			get() = severity?.kr ?: "알 수 없음"
	val code: Int?					get() = logType?.value
	val time: String				get() = ovirtDf.formatEnhancedFromLDT(_time)

	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bSeverity: AuditLogSeverity? = AuditLogSeverity.unknown;fun severity(block: () -> AuditLogSeverity?) { bSeverity = block() ?: AuditLogSeverity.unknown }
		private var bDescription: String = "";fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bTime: LocalDateTime? = null;fun time(block: () -> LocalDateTime?) { bTime = block() }
		private var bLogType: AuditLogType? = AuditLogType.unassigned;fun logType(block: () -> AuditLogType?) { bLogType = block() ?: AuditLogType.unassigned }
		private var bCorrelationId: String = "";fun correlationId(block: () -> String?) { bCorrelationId = block() ?: "" }
		fun build(): EventVo = EventVo(bId, bName, bSeverity, bDescription, bTime, bLogType, bCorrelationId)
	}

	companion object {
		inline fun builder(block: EventVo.Builder.() -> Unit): EventVo = EventVo.Builder().apply(block).build()
	}
}

fun Event.toEventVo(): EventVo {
	return EventVo.builder {
		id { this@toEventVo.id() }
		severity { this@toEventVo.severity().toAuditLogSeverity() }
		description { this@toEventVo.description() }
		time { this@toEventVo.time().toLocalDateTime()}
		logType { AuditLogType.forValue(this@toEventVo.codeAsInteger()) }
		correlationId { this@toEventVo.correlationId()?: "" }
	}
}
fun List<Event>.toEventVos(): List<EventVo> =
	this@toEventVos.map { it.toEventVo() }
