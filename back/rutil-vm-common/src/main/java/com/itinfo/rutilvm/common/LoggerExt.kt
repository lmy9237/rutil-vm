package com.itinfo.rutilvm.common

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import kotlin.properties.ReadOnlyProperty
import kotlin.reflect.KProperty


/**
 * [LoggerDelegate]
 * 프로퍼티 설정 유틸
 * 
 * @author chlee
 * @since 2023.08.07
 */
class LoggerDelegate: ReadOnlyProperty<Any?, Logger> {
    private var logger: Logger? = null
    override fun getValue(thisRef: Any?, property: KProperty<*>): Logger
        = logger ?: createLogger(thisRef!!.javaClass)

    companion object {
        private fun <T> createLogger(clazz: Class<T>): Logger =
            LoggerFactory.getLogger(clazz)
    }
}

inline fun <reified T> T.log(): Logger {
    if (T::class.isCompanion) {
        return LoggerFactory.getLogger(T::class.java.enclosingClass)
    }
    return LoggerFactory.getLogger(T::class.java)
}