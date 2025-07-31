package com.itinfo.rutilvm.common

import kotlin.coroutines.cancellation.CancellationException
import kotlinx.coroutines.delay

// Custom extension to rethrow CancellationException
inline fun <T> suspendRunCatching(block: () -> T): Result<T> {
	return try {
		Result.success(block())
	} catch (e: CancellationException) {
		throw e // Re-throw CancellationException
	} catch (e: Throwable) {
		Result.failure(e)
	}
}

suspend fun fetchDataSafely(): Result<String> {
	return suspendRunCatching {
		// Your cancellable coroutine code here
		delay(1000)
		"Data fetched successfully"
	}
}
