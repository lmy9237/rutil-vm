package com.itinfo

import com.google.gson.Gson
import com.google.gson.GsonBuilder

val gson: Gson
	get() = GsonBuilder()
		.setPrettyPrinting()
		.create()
/**
 * [ItInfoConstant]
 * 관련 상수
 *
 * @author chlee
 * @since 2023-08-08
 */
object ItInfoConstant {
	const val RESULT_KEY = "resultKey"
//	const val JSON_VIEW = "jsonView"

	const val MENU_SIZE_M = "nav-md"
	const val MENU_SIZE_S = "nav-sm"

	const val CONNECTION_TIME_OUT = "connectionTimeOut"
	const val READ_TIME_OUT = "readTimedOut"
	const val PASSWORD_ERROR = "passwordError"
	const val ACCESS_DENIED_LOCKED = "accessDeniedLocked"
	const val LOGIN_ATTEMPT_EXCEED = "loginAttemptExceed"

	const val STATUS_CONNECTION_TIME_OUT = 300
	const val STATUS_READ_TIME_OUT = 301
	const val STATUS_PASSWORD_ERROR = 302
	const val STATUS_ACCESS_DENIED_LOCKED = 303
	const val STATUS_LOGIN_ATTEMPT_EXCEED = 429
	const val STATUS_ERROR = 500
	const val STATUS_OK = 200
}

/**
 * [OvirtStatsName]
 * Ovirt 내 통계 항목 이름
 */
object OvirtStatsName {
	const val MEMORY_TOTAL = "memory.total"
	const val MEMORY_USED = "memory.used"
	const val MEMORY_FREE = "memory.free"

	const val KCM_CPU_CURRENT = "ksm.cpu.current"
	const val CPU_CURRENT_USER = "cpu.current.user"
	const val CPU_CURRENT_SYSTEM = "cpu.current.system"
	const val CPU_CURRENT_IDLE = "cpu.current.idle"

	const val DATA_CURRENT_RX_BPS = "data.current.rx.bps"
	const val DATA_CURRENT_TX_BPS = "data.current.tx.bps"
	const val DATA_TOTAL_RX = "data.total.rx"
	const val DATA_TOTAL_TX = "data.total.tx"

}