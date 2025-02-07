package com.itinfo.rutilvm.api.model.computing

import com.itinfo.rutilvm.common.gson

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.io.Serializable

/**
 * @property version [String] 프로그램 버전
 * @property bootTime [String] 부팅시간(업타임) vm hosted_vm creation time
 */
@Component
class RutilVo(
    @Value("\${application.version}")
    val version: String = "",
    val bootTime: String = "",
):Serializable {
    override fun toString(): String =
        gson.toJson(this)

    class Builder {
        private var bVersion: String = ""; fun version(block: () -> String?) { bVersion = block() ?: ""}
        private var bBootTime: String = ""; fun bootTime(block: () -> String?) { bBootTime = block() ?: ""}
        fun build(): RutilVo = RutilVo(bVersion, bBootTime)
    }

    companion object {
        inline fun builder(block: RutilVo.Builder.() -> Unit): RutilVo = RutilVo.Builder().apply(block).build()
    }
}
