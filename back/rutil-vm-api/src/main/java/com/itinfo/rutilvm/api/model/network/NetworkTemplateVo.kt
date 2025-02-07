package com.itinfo.rutilvm.api.model.network

import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.util.ovirt.findCluster

import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.types.Cluster
import org.ovirt.engine.sdk4.types.Nic
import org.ovirt.engine.sdk4.types.Template
import java.io.Serializable
import org.ovirt.engine.sdk4.types.TemplateStatus
import org.slf4j.LoggerFactory

private val log = LoggerFactory.getLogger(NetworkTemplateVo::class.java)

/**
 * [NetworkTemplateVo]
 *
 * @property name [String] 
 * // @property version [Int] 
 * @property status [TemplateStatus] 
 * @property clusterName [String] 
 * @property nicId [String] 
 * @property nicName [String] 
 */
class NetworkTemplateVo(
	val id: String = "",
	val name: String = "",
	// val version: Int = 0,
	val status: TemplateStatus = TemplateStatus.ILLEGAL,
	val clusterName: String = "",
	val nicId: String = "",
	val nicName: String = "",
) : Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
		// private var bVersion: Int = 0;fun version(block: () -> Int?) { bVersion = block() ?: 0 }
		private var bStatus: TemplateStatus = TemplateStatus.ILLEGAL;fun status(block: () -> TemplateStatus?) { bStatus = block() ?: TemplateStatus.ILLEGAL }
		private var bClusterName: String = "";fun clusterName(block: () -> String?) { bClusterName = block() ?: "" }
		private var bNicId: String = "";fun nicId(block: () -> String?) { bNicId = block() ?: "" }
		private var bNicName: String = "";fun nicName(block: () -> String?) { bNicName = block() ?: "" }
		fun build(): NetworkTemplateVo = NetworkTemplateVo(bId, bName, /* bVersion,*/ bStatus, bClusterName, bNicId, bNicName)
	}

	companion object {
		inline fun builder(block: NetworkTemplateVo.Builder.() -> Unit): NetworkTemplateVo =
			NetworkTemplateVo.Builder().apply(block).build()
	}
}

fun Template.toNetworkTemplateVo(conn: Connection, nic: Nic): NetworkTemplateVo {
	val cluster: Cluster? =
		conn.findCluster(this@toNetworkTemplateVo.cluster().id())
			.getOrNull()
	return NetworkTemplateVo.builder {
		id { this@toNetworkTemplateVo.id() }
		name { this@toNetworkTemplateVo.name() }
		status { this@toNetworkTemplateVo.status() }
		clusterName { cluster?.name() }
		nicId { nic.id() }
		nicName { nic.name() }
	}
}
