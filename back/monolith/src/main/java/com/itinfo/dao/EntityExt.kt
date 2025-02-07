package com.itinfo.dao

import com.google.gson.Gson
import com.google.gson.GsonBuilder
import com.itinfo.rutilvm.common.GsonLocalDateTimeAdapter
import org.slf4j.LoggerFactory
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.UUID


private val log = LoggerFactory.getLogger("com.itinfo.dao.EntityExt")

private const val dateformatBasic: String = "yyyyMMddHH24mm"

val LocalDateTime.toFormatted: String
	get() = DateTimeFormatter.ofPattern(dateformatBasic).format(this)

val gson: Gson
	get() = GsonBuilder()
		.registerTypeAdapter(LocalDateTime::class.java, GsonLocalDateTimeAdapter())
		// .setPrettyPrinting()
		.create()

fun String.toUUID(): UUID
	= UUID.fromString(this).also {log.debug("from $this to $it") }

fun List<String>.toUUIDs(): List<UUID>
	= this.map { it.toUUID() }