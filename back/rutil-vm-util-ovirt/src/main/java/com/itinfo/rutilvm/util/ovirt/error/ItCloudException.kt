package com.itinfo.rutilvm.util.ovirt.error

import org.ovirt.engine.sdk4.Error

open class ItCloudException(
	message: String = "IT클라우드 예외 발생",
): RuntimeException(message) {
}

fun Error.toItCloudException(msg: String = ""): ItCloudException = when {
	this.message?.contains("4[0-9][0-9]".toRegex()) == true -> ItCloudException(msg.ifEmpty { this.localizedMessage.messageTransform() })
	else -> ItCloudException(msg.ifEmpty { this.localizedMessage.messageTransform() })
}

fun String.messageTransform(): String =
	this.replace("\"".toRegex(), "\'")