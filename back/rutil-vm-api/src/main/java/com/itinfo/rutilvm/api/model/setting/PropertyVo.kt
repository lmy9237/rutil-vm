package com.itinfo.rutilvm.api.model.setting

import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.api.model.IdentifiedVo

import org.ovirt.engine.sdk4.types.Property
import java.io.Serializable

class PropertyVo(
    val name: String = "",
    val value: String = ""
): Serializable {
    override fun toString(): String =
        gson.toJson(this)

    class Builder {
        private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
        private var bValue: String = "";fun value(block: () -> String?) { bValue= block() ?: "" }

        fun build(): PropertyVo = PropertyVo(bId, bValue)
    }
    companion object {
        inline fun builder(block: PropertyVo.Builder.() -> Unit): PropertyVo = PropertyVo.Builder().apply(block).build()
    }
}

fun Property.toPropertyVo() = PropertyVo.builder {
    id { this@toPropertyVo.name() }
    value { this@toPropertyVo.value() }
}

fun List<Property>.toPropertyVos() =
    this@toPropertyVos.map { it.toPropertyVo() }