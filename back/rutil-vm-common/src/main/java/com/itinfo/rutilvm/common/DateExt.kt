package com.itinfo.rutilvm.common

import java.text.SimpleDateFormat
import java.util.*
import kotlin.math.abs

const val OVIRT_API_DATE_FORMAT = "yyyy. MM. dd. HH:mm:ss"
val ovirtDf = SimpleDateFormat(OVIRT_API_DATE_FORMAT)

fun SimpleDateFormat.formatEnhanced(date: Date?): String
	= if (date == null) "" else this.format(date)

fun Date.differenceInMillis(otherDate: Date): Long {
	return abs(this.time - otherDate.time)
}
