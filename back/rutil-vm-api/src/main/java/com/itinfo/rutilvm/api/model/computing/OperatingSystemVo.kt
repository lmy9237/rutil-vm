package com.itinfo.rutilvm.api.model.computing

import com.itinfo.rutilvm.api.ovirt.business.VmOsType
import com.itinfo.rutilvm.common.gson
import org.ovirt.engine.sdk4.types.*
import java.io.Serializable

class OperatingSystemVo (
    val id: String = "",
    val name: String = "",
    val description: String = "",
	val architecture: Architecture = Architecture.UNDEFINED,
): Serializable {
    override fun toString(): String =
		gson.toJson(this)

    class Builder {
		private var bId: String = ""; fun id(block: () -> String?) { bId = block() ?: ""}
		private var bName: String = ""; fun name(block: () -> String?) { bName = block() ?: ""}
		private var bDescription: String = ""; fun description(block: () -> String?) { bDescription = block() ?: ""}
		private var bArchitecture: Architecture = Architecture.UNDEFINED; fun architecture(block: () -> Architecture?) { bArchitecture = block() ?: Architecture.UNDEFINED}

        fun build(): OperatingSystemVo = OperatingSystemVo(bId, bName, bDescription, bArchitecture, )
    }

    companion object{
        inline fun builder(block: Builder.() -> Unit): OperatingSystemVo = Builder().apply(block).build()
    }
}

fun OperatingSystemInfo.toOperatingSystemVo(): OperatingSystemVo = OperatingSystemVo.builder {
	id { this@toOperatingSystemVo.id() }
	name { this@toOperatingSystemVo.name() }
	description { this@toOperatingSystemVo.description() }
	architecture { this@toOperatingSystemVo.architecture() }
}

fun List<OperatingSystemInfo>.toOperatingSystemVos(): List<OperatingSystemVo> =
	this@toOperatingSystemVos.map { it.toOperatingSystemVo() }
