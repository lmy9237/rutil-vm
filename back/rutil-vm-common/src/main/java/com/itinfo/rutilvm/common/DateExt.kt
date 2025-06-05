package com.itinfo.rutilvm.common

import java.sql.Timestamp
import java.text.SimpleDateFormat
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.*
import kotlin.math.abs

const val OVIRT_API_DATE_FORMAT = "yyyy. MM. dd. HH:mm:ss"
val ovirtDf = SimpleDateFormat(OVIRT_API_DATE_FORMAT)
val ovirtDtf = DateTimeFormatter.ofPattern(OVIRT_API_DATE_FORMAT)

fun SimpleDateFormat.formatEnhanced(date: Date?): String =
	if (date == null) "" else this.format(date)

fun SimpleDateFormat.formatEnhancedFromLDT(ldt: LocalDateTime?): String =
	if (ldt == null) "" else formatEnhanced(Timestamp.valueOf(ldt))

fun DateTimeFormatter.parseEnhanced2LDT(date: String?=""): LocalDateTime? =
	if (date.isNullOrEmpty()) null else LocalDateTime.parse(date, this@parseEnhanced2LDT)

fun LocalDateTime?.toDate(): Date? = Timestamp.valueOf(this@toDate)
fun Date?.toLocalDateTime(): LocalDateTime? = this?.toInstant()?.atZone(ZoneId.systemDefault())?.toLocalDateTime()

fun Date.differenceInMillis(otherDate: Date): Long {
	return abs(this.time - otherDate.time)
}
