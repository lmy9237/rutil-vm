package com.itinfo.rutilvm.api.model.setting

import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.api.model.IdentifiedVo
import org.ovirt.engine.sdk4.builders.PropertyBuilder

import org.ovirt.engine.sdk4.types.Property
import java.io.Serializable

class PropertyVo(
    val name: String = "",
    val value: String = ""
): Serializable {
    override fun toString(): String =
        gson.toJson(this)

    class Builder {
        private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
        private var bValue: String = "";fun value(block: () -> String?) { bValue= block() ?: "" }

        fun build(): PropertyVo = PropertyVo(bName, bValue)
    }
    companion object {
        inline fun builder(block: Builder.() -> Unit): PropertyVo = Builder().apply(block).build()
    }
}

fun Property.toPropertyVo() = PropertyVo.builder {
	name { this@toPropertyVo.name() }
    value { this@toPropertyVo.value() }
}

fun List<Property>.toPropertyVos() =
    this@toPropertyVos.map { it.toPropertyVo() }

fun PropertyVo.toPropertyBuilder(): PropertyBuilder = PropertyBuilder()
	.name(name)
	.value(value)

fun PropertyVo.toAddProperty(): Property =
	toPropertyBuilder().build()
