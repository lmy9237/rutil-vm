package com.itinfo.controller

import com.itinfo.ItInfoConstant
import com.itinfo.security.CustomUserDetails
import org.json.simple.JSONObject
import org.slf4j.LoggerFactory
import org.springframework.security.core.context.SecurityContextHolder

private val log =
	LoggerFactory.getLogger("com.itinfo.controller.ControllerExtKt")

inline fun <reified T: Any?> asJsonResponse(
	value: T,
	forKey: String = ItInfoConstant.RESULT_KEY,
): JSONObject {
	// log.info("... asJsonResponse($forKey : $value")
	return JSONObject().apply {
		this[forKey] = value
	}
}


val memberService: CustomUserDetails
	get() {
		log.info("... getMemberService")
		return (SecurityContextHolder.getContext().authentication.details as CustomUserDetails)
	}

private const val DEFAULT_TIME_SLEEP_IN_MILLI = 500L
private const val DEFAULT_TIME_LONG_SLEEP_IN_MILLI = 5000L

fun doSleep(timeInMilli: Long = DEFAULT_TIME_SLEEP_IN_MILLI) {
	log.info("... doSleep($timeInMilli)")
	try { Thread.sleep(timeInMilli) } catch (e: InterruptedException) { log.error(e.localizedMessage) }
}

fun doLongSleep() =
	doSleep(DEFAULT_TIME_LONG_SLEEP_IN_MILLI)
