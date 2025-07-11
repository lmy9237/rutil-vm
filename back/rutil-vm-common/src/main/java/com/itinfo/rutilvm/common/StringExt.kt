package com.itinfo.rutilvm.common

import java.net.URLEncoder
import java.nio.charset.StandardCharsets
import java.util.UUID

fun String.toUUID(): UUID = UUID.fromString(this)
fun String.toURLEncoded(): String = URLEncoder.encode(this@toURLEncoded, StandardCharsets.UTF_8.toString())
