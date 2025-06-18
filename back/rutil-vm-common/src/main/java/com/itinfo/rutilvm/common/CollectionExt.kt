package com.itinfo.rutilvm.common

/**
 * [List.deepEquals]
 * 목록의 순서 및 개수가 완전 일치 하는지 체크
 *
 */
fun <T> List<T>.deepEquals(other: List<T>) =
	size == other.size && asSequence()
		.mapIndexed { i, e -> e == other[i] }
		.all { it }
