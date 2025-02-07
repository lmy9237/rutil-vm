package com.itinfo.rutilvm.api.model.computing

import com.itinfo.rutilvm.common.gson

import org.ovirt.engine.sdk4.types.Vm
import org.slf4j.LoggerFactory
import java.io.Serializable

private val log = LoggerFactory.getLogger(GuestInfoVo::class.java)

/**
 * [GuestInfoVo]
 * 게스트 정보
 *
 * vm에 속해있는 속성들
 *
 * @property type [String] 유형 family
 * @property architecture [String]
 * @property os [String]   distribution
 * @property kernalVersion [String]
 * @property guestTime [String]
 */
class GuestInfoVo (
    val type: String = "",
    val architecture: String = "",
    val os: String = "",
    val kernalVersion: String = "",
    val guestTime: String = "",
    // 로그인된 사용자
    // 콘솔 사용자
    // 콘솔 클라이언트 ip

): Serializable {
    override fun toString(): String =
        gson.toJson(this)

    class Builder {
        private var bType: String = ""; fun type(block: () -> String?) { bType = block() ?: ""}
        private var bArchitecture: String = ""; fun architecture(block: () -> String?) { bArchitecture = block() ?: ""}
        private var bOs: String = ""; fun os(block: () -> String?) { bOs = block() ?: ""}
        private var bKernalVersion: String = ""; fun kernalVersion(block: () -> String?) { bKernalVersion = block() ?: ""}
        private var bGuestTime: String = ""; fun guestTime(block: () -> String?) { bGuestTime = block() ?: ""}
        fun build(): GuestInfoVo = GuestInfoVo(bType, bArchitecture, bOs, bKernalVersion, bGuestTime)
    }

    companion object {
        inline fun builder(block: GuestInfoVo.Builder.() -> Unit): GuestInfoVo = GuestInfoVo.Builder().apply(block).build()
    }
}

fun Vm.toGuestInfoVo(): GuestInfoVo {
    return GuestInfoVo.builder {
        architecture { this@toGuestInfoVo.guestOperatingSystem().architecture() }
        type { this@toGuestInfoVo.guestOperatingSystem().family() }
        kernalVersion { this@toGuestInfoVo.guestOperatingSystem().kernel().version().fullVersion() }
        os { "${this@toGuestInfoVo.guestOperatingSystem().distribution()} ${this@toGuestInfoVo.guestOperatingSystem().version().major()}" }
        guestTime { this@toGuestInfoVo.guestTimeZone().name() + this@toGuestInfoVo.guestTimeZone().utcOffset() }
    }
}