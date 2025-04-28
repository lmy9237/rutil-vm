package com.itinfo.rutilvm.common

/**
 * @name [Long].[toTimeElapsedKr]
 * 소요시간을 양에 따라 분, 시간 또는 일로 표시
 *
 * @return 일, 시간, 분 형식
 */
fun Long.toTimeElapsedKr(): String {
	val days = this / (60 * 60 * 24)
	val hours = (this % (60 * 60 * 24)) / (60 * 60)
	val minutes = ((this % (60 * 60 * 24)) % (60 * 60)) / 60

	return if (days > 0)    "${days}일"
	else if (hours > 0)     "${hours}시간"
	else if (minutes > 0)   "${minutes}분"
	else                    ""
}
