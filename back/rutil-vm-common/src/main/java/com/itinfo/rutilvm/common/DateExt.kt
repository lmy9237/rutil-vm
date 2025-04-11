package com.itinfo.rutilvm.common

import java.util.*
import kotlin.math.abs

fun Date.differenceInMillis(otherDate: Date): Long {
	return abs(this.time - otherDate.time)
}
