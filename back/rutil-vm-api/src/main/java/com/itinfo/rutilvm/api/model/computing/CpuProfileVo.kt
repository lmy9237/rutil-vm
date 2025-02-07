package com.itinfo.rutilvm.api.model.computing

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.common.gson

import org.ovirt.engine.sdk4.types.CpuProfile
import java.io.Serializable

/**
 * [CpuProfileVo]
 * cpu profile
 *
 * @property id [String] 
 * @property name [String] 
 * @property description [String] 
 * @property qosName [String]
 */
class CpuProfileVo(
	val id: String = "",
	val name: String = "",
	val description: String = "",
	val qosName: String = "",
): Serializable {
	override fun toString(): String =
		gson.toJson(this)
		
	class Builder {
		private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bDescription: String = "";fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bQosName: String = "";fun qosName(block: () -> String?) { bQosName = block() ?: "" }
		fun build(): CpuProfileVo = CpuProfileVo(bId, bName, bDescription, bQosName)
	}

	companion object {
		private val log by LoggerDelegate()
		inline fun builder(block: CpuProfileVo.Builder.() -> Unit): CpuProfileVo = CpuProfileVo.Builder().apply(block).build()
	}
}

fun CpuProfile.toCpuProfileVo(): CpuProfileVo = CpuProfileVo.builder {
	id { this@toCpuProfileVo.id() }
	name { this@toCpuProfileVo.name() }
}

fun List<CpuProfile>.toCpuProfileVos(): List<CpuProfileVo> =
	this@toCpuProfileVos.map { it.toCpuProfileVo() }