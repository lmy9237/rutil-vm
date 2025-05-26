package com.itinfo.rutilvm.api.model.network

import com.itinfo.rutilvm.api.ovirt.business.BondMode
import com.itinfo.rutilvm.api.ovirt.business.BondModeVo
import com.itinfo.rutilvm.api.ovirt.business.toBondModeVo
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
	val bondMode: BondMode? =
		if (this.name == "mode") BondMode.forValue(this.value.toIntOrNull())
		else BondMode.UNKNOWN

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
		type { if(this@toOptionVo.typePresent()) this@toOptionVo.type() else null }
	}
}
fun List<Option>.toOptionVos(): List<OptionVo> =
    this@toOptionVos.map { it.toOptionVo() }

fun List<OptionVo>.toBondMode(): BondMode =
	BondMode.forValue(
	this@toBondMode.firstOrNull { it.name == BondMode.MODE_FOR_SEARCH }?.value?.toIntOrNull() ?: -1
	)

fun List<OptionVo>.toBondModeVo(): BondModeVo? =
	this@toBondModeVo.toBondMode()
		.toBondModeVo()

fun BondMode.asOption(): Option {
	return OptionBuilder()
		.name(BondMode.MODE_FOR_SEARCH)
		.value("${this@asOption.value}")
		.type(this@asOption.description)
		.build()
}
/*
fun toDefaultModeOptionBuilder(): Option {
    return OptionBuilder()
        .name("mode")
        .value("1")
        .type("Active-Backup")
        .build()
}
*/
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

fun OptionVo.toOption(): Option {
    return OptionBuilder()
        .name(this.name)
        .value(this.value)
        .build()
}

fun List<OptionVo>.toOptions(): List<Option> =
	this.map { it.toOption() }


fun OptionVo.toOptionInfo(): Option {
    return OptionBuilder()
        .name(this.name)
        .value(this.value)
        .build()
}
fun List<OptionVo>.toOptionInfos(): List<Option> =
    this.map { it.toOptionInfo() }

