package com.itinfo.rutilvm.api.model.computing

import com.itinfo.rutilvm.common.gson
import org.ovirt.engine.sdk4.types.*
import java.io.Serializable

class OsVo (
    val id: String = "",
    val name: String = "",
    val description: String = "",
	val architecture: Architecture = Architecture.UNDEFINED,
): Serializable {
    override fun toString(): String = gson.toJson(this)

    class Builder {
		private var bId: String = ""; fun id(block: () -> String?) { bId = block() ?: ""}
		private var bName: String = ""; fun name(block: () -> String?) { bName = block() ?: ""}
		private var bDescription: String = ""; fun description(block: () -> String?) { bDescription = block() ?: ""}
		private var bArchitecture: Architecture = Architecture.UNDEFINED; fun architecture(block: () -> Architecture?) { bArchitecture = block() ?: Architecture.UNDEFINED}

        fun build(): OsVo = OsVo(bId, bName, bDescription, bArchitecture, )
    }

    companion object{
        inline fun builder(block: Builder.() -> Unit): OsVo = Builder().apply(block).build()
    }
}

fun OperatingSystemInfo.toOsVo(): OsVo = OsVo.builder {
	id { this@toOsVo.id() }
	name { this@toOsVo.name() }
	description { this@toOsVo.description() }
	architecture { this@toOsVo.architecture() }
}
fun List<OperatingSystemInfo>.toOsVos(): List<OsVo> =
	this@toOsVos.map { it.toOsVo() }
