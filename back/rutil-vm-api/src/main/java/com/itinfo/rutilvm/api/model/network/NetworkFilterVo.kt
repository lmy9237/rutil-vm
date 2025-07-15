package com.itinfo.rutilvm.api.model.network

import com.itinfo.rutilvm.common.gson

import org.ovirt.engine.sdk4.builders.NetworkFilterParameterBuilder
import org.ovirt.engine.sdk4.types.NetworkFilter
import org.ovirt.engine.sdk4.types.NetworkFilterParameter
import org.ovirt.engine.sdk4.types.Nic
import org.slf4j.LoggerFactory
import java.io.Serializable

private val log = LoggerFactory.getLogger(NetworkFilterVo::class.java)

/**
 * [NetworkFilterVo]
 * 네트워크 필터
 *
 * @property id [String]
 * @property name [String]
 * @property value [String] // 값
 */
class NetworkFilterVo(
	val id: String = "",
	val name: String = "",
	val value: String = "",
) : Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bValue: String = "";fun value(block: () -> String?) { bValue = block() ?: "" }
		fun build(): NetworkFilterVo = NetworkFilterVo(bId, bName, bValue)
	}

	fun toNetworkFilterParameter(nic: Nic): NetworkFilterParameter = NetworkFilterParameterBuilder()
		.name(name)
		.value(value)
		.nic(nic)
		.build()

	companion object {
		inline fun builder(block: NetworkFilterVo.Builder.() -> Unit): NetworkFilterVo =
			NetworkFilterVo.Builder().apply(block).build()
	}
}

fun NetworkFilter.toNetworkFilterVo(): NetworkFilterVo = NetworkFilterVo.builder {
	id { this@toNetworkFilterVo.id() }
	name { this@toNetworkFilterVo.name() }
//	value { this@toNetworkFilterParameterVo.value() }
}

fun List<NetworkFilter>.toNetworkFilterVos(): List<NetworkFilterVo> =
	this@toNetworkFilterVos.map { it.toNetworkFilterVo() }

fun List<NetworkFilterVo>.toNetworkFilterParameters(nic: Nic): List<NetworkFilterParameter> =
	this@toNetworkFilterParameters.map { it.toNetworkFilterParameter(nic) }
