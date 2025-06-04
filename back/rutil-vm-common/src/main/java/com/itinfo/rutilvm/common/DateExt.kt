package com.itinfo.rutilvm.common

import java.sql.Timestamp
import java.text.SimpleDateFormat
import java.time.LocalDateTime
import java.time.temporal.Temporal
import java.util.*
import kotlin.math.abs

const val OVIRT_API_DATE_FORMAT = "yyyy. MM. dd. HH:mm:ss"
val ovirtDf = SimpleDateFormat(OVIRT_API_DATE_FORMAT)

fun SimpleDateFormat.formatEnhanced(date: Date?): String =
	if (date == null) "" else this.format(date)

fun SimpleDateFormat.formatEnhancedFromLDT(ldt: LocalDateTime?): String =
	if (ldt == null) "" else formatEnhanced(Timestamp.valueOf(ldt))

fun Date.differenceInMillis(otherDate: Date): Long {
	return abs(this.time - otherDate.time)
}
