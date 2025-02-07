package com.itinfo.rutilvm.common

import org.slf4j.LoggerFactory
import java.io.Closeable

private val log = LoggerFactory.getLogger("com.itinfo.rutilvm.common.CloseableExt")

/**
 * [Closeable.doClose]
 * 연결제거
 */
fun Closeable?.doClose() = try {
	this?.close()
} catch (e: Exception) {
	log.error(e.localizedMessage)
}

fun List<Closeable?>.doCloseAll() = this.forEach { it.doClose() }