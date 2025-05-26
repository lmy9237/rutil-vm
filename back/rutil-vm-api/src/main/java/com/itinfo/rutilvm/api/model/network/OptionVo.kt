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
		type { if(this@toOptionVo.typePresent()) this@toOptionVo.type() else null }
	}
}
fun List<Option>.toOptionVos(): List<OptionVo> =
    this@toOptionVos.map { it.toOptionVo() }


// TODO: BondMode 유형 생성 필요 <package org.ovirt.engine.core.common.businessentities.network>
// https://192.168.0.70/ovirt-engine/api/hosts/{id}/nics
// 사용자 정의 mode=1 miimon=100 primary=ens3f0np0
/*
* BOND0("0", "balance-rr", "(Mode 0) Round-robin", false),
  BOND1("1", "active-backup", "(Mode 1) Active-Backup", true),
  BOND2("2", "balance-xor", "(Mode 2) Load balance (balance-xor)", true),
  BOND3("3", "broadcast", "(Mode 3) Broadcast", true),
  BOND4("4", "802.3ad", "(Mode 4) Dynamic link aggregation (802.3ad)", true),
  BOND5("5", "balance-tlb", "(Mode 5) Adaptive transmit load balancing (balance-tlb)", false),
  BOND6("6", "balance-alb", "(Mode 6) Adaptive load balancing (balance-alb)", false);
**/
// option builder
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

