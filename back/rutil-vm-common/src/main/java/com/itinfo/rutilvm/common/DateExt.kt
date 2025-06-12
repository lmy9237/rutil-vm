package com.itinfo.rutilvm.common

import java.sql.Timestamp
import java.text.SimpleDateFormat
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.time.format.DateTimeParseException
import java.util.*
import kotlin.math.abs

const val OVIRT_API_DATE_FORMAT = "yyyy. MM. dd. HH:mm:ss"
val ovirtDf = SimpleDateFormat(OVIRT_API_DATE_FORMAT)
val rutilApiQueryDf = SimpleDateFormat("yyyyMMdd")
val ovirtDtf = DateTimeFormatter.ofPattern(OVIRT_API_DATE_FORMAT)
val rutilApiQueryDtf = DateTimeFormatter.BASIC_ISO_DATE // yyyyMMdd

@Throws(DateTimeParseException::class)
fun SimpleDateFormat.formatEnhanced(date: Date?): String =
	if (date == null) "" else this.format(date)

fun SimpleDateFormat.formatEnhancedFromLDT(ldt: LocalDateTime?): String =
	if (ldt == null) "" else formatEnhanced(Timestamp.valueOf(ldt))

@Throws(DateTimeParseException::class)
fun DateTimeFormatter.parseEnhanced2LDT(date: String?=""): LocalDateTime? =
	if (date.isNullOrEmpty()) null else LocalDateTime.parse(date, this@parseEnhanced2LDT)

fun LocalDateTime?.toDate(): Date? = Timestamp.valueOf(this@toDate)

fun Date?.toLocalDateTime(): LocalDateTime? = try {
	this@toLocalDateTime?.toInstant()
		?.atZone(ZoneId.systemDefault())
		?.toLocalDateTime()
} catch (e: DateTimeParseException) {

	null
}

fun Date.differenceInMillis(otherDate: Date): Long {
	return abs(this.time - otherDate.time)
}
