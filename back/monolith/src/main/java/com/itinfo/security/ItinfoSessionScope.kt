package com.itinfo.security

import org.springframework.context.annotation.Scope
import org.springframework.context.annotation.ScopedProxyMode


/**
 * [ItinfoSessionScope]
 * ?
 *
 * @author chlee
 * @since 2023.12.07
 */
@Scope(value = "session", proxyMode = ScopedProxyMode.TARGET_CLASS)
@Deprecated(message = "not used")
class ItinfoSessionScope(
	var userid: String = "",
	var passwd: String = ""
)