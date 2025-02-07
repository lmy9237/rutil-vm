package com.itinfo.rutilvm.api.model.zJava/*
package com.itinfo.rutilvm.api.model.network

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.itcloud.gson
import org.ovirt.engine.sdk4.types.Cluster
import org.ovirt.engine.sdk4.types.Network
import org.ovirt.engine.sdk4.types.NetworkUsage
import java.io.Serializable

*/
/**
 * [NetworkClusterVo]
 * cluster
 * @property id [String] network id
 * @property name [String]
 * @property description [String]
 * @property version [String]
 *
 * @property networkVo [NetworkVo]
 * 
 * network
 * @property isConnected [Boolean]
 * @property required [Boolean]
 * @property status [String]
 *
 * @property networkUsageVo [NetworkUsageVo]
 *//*
@Deprecated("사용안함")
class NetworkClusterVo(
	val id: String = "",
	val name: String = "",
	val description: String = "",
	val version: String = "",

	val isConnected: Boolean = false,
	val required: Boolean = false,
	val status: String = "",

	val usageVo: UsageVo = UsageVo(),
) : Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bDescription: String = "";fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bVersion: String = "";fun version(block: () -> String?) { bVersion = block() ?: "" }
		private var bIsConnected: Boolean = false;fun isConnected(block: () -> Boolean?) { bIsConnected = block() ?: false }
		private var bRequired: Boolean = false;fun required(block: () -> Boolean?) { bRequired = block() ?: false }
		private var bStatus: String = "";fun status(block: () -> String?) { bStatus = block() ?: "" }
		private var bUsageVo: UsageVo = UsageVo();fun usageVo(block: () -> UsageVo?) { bUsageVo = block() ?: UsageVo() }
		fun build(): NetworkClusterVo = NetworkClusterVo(bId, bName, bDescription, bVersion, bIsConnected, bRequired, bStatus, bNetworkUsageVo)
	}

	companion object {
		private val log by LoggerDelegate()
		inline fun builder(block: NetworkClusterVo.Builder.() -> Unit): NetworkClusterVo =
			NetworkClusterVo.Builder().apply(block).build()
	}
}

fun Network.toNetworkClusterVo(cluster: Cluster): NetworkClusterVo {
	return NetworkClusterVo.builder {
		id { cluster.id() }
		name { cluster.name() }
		version { "${cluster.version().major()}.${cluster.version().minor()}" }
		description { cluster.description() }
		status { this@toNetworkClusterVo.status().value() }
		required { this@toNetworkClusterVo.required() }
		networkUsageVo { this@toNetworkClusterVo.toNetworkUsageVo() }
	}
}

fun List<Network>.toNetworkClusterVos(cluster: Cluster): List<NetworkClusterVo> =
	this@toNetworkClusterVos.map { it.toNetworkClusterVo(cluster) }*/
