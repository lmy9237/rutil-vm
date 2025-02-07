package com.itinfo.rutilvm.common

import com.google.gson.*
import com.google.gson.reflect.TypeToken

import java.lang.reflect.Type
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

val gson: Gson = GsonBuilder()
	.registerTypeAdapter(LocalDateTime::class.java, GsonLocalDateTimeAdapter())
	.setPrettyPrinting()
	.disableHtmlEscaping()
	.create()

inline fun <reified T> Gson.fromJson(json: String) =
	fromJson<T>(json, object : TypeToken<T>() {}.type)

class GsonLocalDateTimeAdapter() : JsonSerializer<LocalDateTime>, JsonDeserializer<LocalDateTime> {
	override fun serialize(localDateTime: LocalDateTime?, srcType: Type?, context: JsonSerializationContext?): JsonElement
		= JsonPrimitive(DateTimeFormatter.ISO_LOCAL_DATE_TIME.format(localDateTime))

	override fun deserialize(json: JsonElement?, typeOfT: Type?, context: JsonDeserializationContext?): LocalDateTime =
		LocalDateTime.parse(json?.asString, DateTimeFormatter.ISO_LOCAL_DATE_TIME)
}