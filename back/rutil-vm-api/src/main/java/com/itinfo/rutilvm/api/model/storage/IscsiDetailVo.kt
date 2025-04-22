package com.itinfo.rutilvm.api.model.storage

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.common.gson

import org.ovirt.engine.sdk4.builders.IscsiDetailsBuilder
import org.ovirt.engine.sdk4.types.IscsiDetails
import java.io.Serializable

class IscsiDetailVo(
    val address: String = "",
    val port: Int = 0,
    val portal: String = "",
    val target: String = "",
    val chapName: String = "",
    val chapPassword: Int = 0,
): Serializable {
    override fun toString(): String =
        gson.toJson(this)

    class Builder {
        private var bAddress: String = "";fun address(block: () -> String?) { bAddress = block() ?: "" }
        private var bPort: Int = 0;fun port(block: () -> Int?) { bPort = block() ?: 0 }
        private var bPortal: String = "";fun portal(block: () -> String?) { bPortal = block() ?: "" }
        private var bTarget: String = "";fun target(block: () -> String?) { bTarget = block() ?: "" }
        private var bChapName: String = "";fun chapName(block: () -> String?) { bChapName = block() ?: "" }
        private var bChapPassword: Int = 0;fun chapPassword(block: () -> Int?) { bChapPassword = block() ?: 0 }
        fun build(): IscsiDetailVo = IscsiDetailVo(bAddress, bPort, bPortal, bTarget, bChapName, bChapPassword)
    }

    companion object {
        private val log by LoggerDelegate()
        inline fun builder(block: Builder.() -> Unit): IscsiDetailVo = Builder().apply(block).build()
    }
}

fun IscsiDetails.toIscsiDetailVo(): IscsiDetailVo {
    return IscsiDetailVo.builder {
        address { this@toIscsiDetailVo.address() }
        port { this@toIscsiDetailVo.portAsInteger() }
        portal { this@toIscsiDetailVo.portal() }
        target { this@toIscsiDetailVo.target() }
    }
}
fun List<IscsiDetails>.toIscsiDetailVos(): List<IscsiDetailVo> =
    this@toIscsiDetailVos.map { it.toIscsiDetailVo() }

fun IscsiDetailVo.toDiscoverIscsiDetailVo(): IscsiDetails {
    return IscsiDetailsBuilder()
        .address(this@toDiscoverIscsiDetailVo.address)
        .port(this@toDiscoverIscsiDetailVo.port)
        .build()
}

/**
 * iscsi 로그인
 */
fun IscsiDetailVo.toLoginIscsi(): IscsiDetails {
    return IscsiDetailsBuilder()
        .target(this@toLoginIscsi.target)
        .address(this@toLoginIscsi.target)
        .port(this@toLoginIscsi.port)
        .build()
}
