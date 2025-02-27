package com.itinfo.rutilvm.api.model.network

import com.itinfo.rutilvm.common.gson

import org.ovirt.engine.sdk4.builders.OptionBuilder
import org.ovirt.engine.sdk4.types.Option
import org.slf4j.LoggerFactory
import java.io.Serializable

private val log = LoggerFactory.getLogger(OptionVo::class.java)

class OptionVo (
    val name: String = "",
    val value: String = "",
    val type: String = "",
) : Serializable {
    override fun toString(): String = gson.toJson(this)

    class Builder {
        private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
        private var bValue: String = "";fun value(block: () -> String?) { bValue = block() ?: "" }
        private var bType: String = ""; fun type(block: () -> String?) { bType = block() ?: "" }

        fun build(): OptionVo = OptionVo(bName, bValue, bType)
    }

    companion object {
        inline fun builder(block: OptionVo.Builder.() -> Unit): OptionVo = OptionVo.Builder().apply(block).build()
    }
}

fun Option.toOptionVo(): OptionVo {
    return OptionVo.builder {
        name { this@toOptionVo.name() }
        value { this@toOptionVo.value() }
        type { this@toOptionVo.type()?.takeIf { this@toOptionVo.typePresent() } }
    }
}
fun List<Option>.toOptionVos(): List<OptionVo> =
    this@toOptionVos.map { it.toOptionVo() }


// https://192.168.0.70/ovirt-engine/api/hosts/{id}/nics
fun toDefaultModeOptionBuilder(): Option {
    return OptionBuilder()
        .name("mode")
        .type("Active-Backup")
        .value("1")
        .build()
}
fun toDefaultMiimonOptionBuilder(): Option {
    return OptionBuilder()
        .name("miimon")
        .value("100")
        .build()
}
fun toDefaultPolicyOptionBuilder(): Option {
    return OptionBuilder()
        .name("xmit_hash_policy")
        .value("2")
        .build()
}

fun toDefaultOption(): List<Option> {
    return listOf(
        toDefaultModeOptionBuilder(),
        toDefaultMiimonOptionBuilder()
    )
}

fun OptionVo.toOption(): Option {
    return OptionBuilder()
        .name(this@toOption.name)
        .value(this@toOption.value)
        .build()
}
fun List<OptionVo>.toOptions(): List<Option> =
    this@toOptions.map { it.toOption() }

