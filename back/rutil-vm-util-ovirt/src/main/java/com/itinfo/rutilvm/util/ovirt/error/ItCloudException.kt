package com.itinfo.rutilvm.util.ovirt.error

import com.itinfo.rutilvm.api.ovirt.business.model.Term
import org.ovirt.engine.sdk4.Error

open class ItCloudException(
	message: String = "IT클라우드 예외 발생",
): RuntimeException(message) {
}

fun Error.toItCloudException(msg: String = ""): ItCloudException = when {
	this.message?.contains("4[0-9][0-9]".toRegex()) == true -> ItCloudException(msg.ifEmpty { this.localizedMessage.messageTransform() })
	else -> ItCloudException(msg.ifEmpty { this.localizedMessage.messageTransform() })
}

fun Error.toItCloudException(
	term: Term,
	action: String,
	targetId: String?=""): ItCloudException = toItCloudException(term.toStrongMessage(action, this@toItCloudException, targetId))
fun Error.toItCloudExceptionWithin(
	term: Term,
	withinTerm: Term,
	action: String,
	targetId: String?="",
	withinTargetId: String?="",
): ItCloudException = toItCloudException(term.toStrongMessageWithin(withinTerm, action, this@toItCloudExceptionWithin,  targetId, withinTargetId))

fun String.messageTransform(): String =
	this.replace("\"".toRegex(), "\'")
