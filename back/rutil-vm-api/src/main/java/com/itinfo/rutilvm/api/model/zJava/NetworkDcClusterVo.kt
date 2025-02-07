package com.itinfo.rutilvm.api.model.zJava/*
package com.itinfo.rutilvm.api.model.network.java

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.itcloud.gson
import com.itinfo.itcloud.model.computing.ClusterVo;
import com.itinfo.itcloud.model.computing.DataCenterVo;
import com.itinfo.rutilvm.util.ovirt.findAllClustersFromDataCenter
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.types.Cluster
import org.ovirt.engine.sdk4.types.DataCenter
import org.slf4j.LoggerFactory
import java.io.Serializable

private val log = LoggerFactory.getLogger(NetworkDcClusterVo::class.java)

*/
/**
 * [NetworkDcClusterVo]
 *
 * dataCenterVo [DataCenterVo] 
 * clusterVos List<[ClusterVo]> 
 *//*

@Deprecated("사용안함")
class NetworkDcClusterVo(
    val dataCenterVo: DataCenterVo = DataCenterVo(),
    val clusterVos: List<ClusterVo> = listOf(),
) : Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bDataCenterVo: DataCenterVo = DataCenterVo();fun dataCenterVo(block: () -> DataCenterVo?) { bDataCenterVo = block() ?: DataCenterVo() }
    	private var bClusterVos: List<ClusterVo> = listOf();fun clusterVos(block: () -> List<ClusterVo>?) { bClusterVos = block() ?: listOf() }
		fun build(): NetworkDcClusterVo = NetworkDcClusterVo(bDataCenterVo, bClusterVos)
	}

	companion object {
		private val log by LoggerDelegate()
		inline fun builder(block: Builder.() -> Unit): NetworkDcClusterVo =
			Builder().apply(block).build()
	}
}

fun DataCenter.toNetworkDcClusterVo(conn: Connection): NetworkDcClusterVo {
	log.debug("DataCenter.toNetworkDcClusterVo ... ")
	val clusters: List<Cluster> =
		conn.findAllClustersFromDataCenter(this.id())
			.getOrDefault(listOf())

	return NetworkDcClusterVo.builder {
		dataCenterVo {
			DataCenterVo.builder {
				id { this@toNetworkDcClusterVo.id() }
				name { this@toNetworkDcClusterVo.name() }
			}
		}
		clusterVos {
			clusters.map { cluster: Cluster ->
				ClusterVo.builder {
					id { cluster.id() }
					name { cluster.name() }
				}
			}
		}
	}
}

fun List<DataCenter>.toNetworkDcClusterVos(conn: Connection): List<NetworkDcClusterVo> =
	this@toNetworkDcClusterVos.map { it.toNetworkDcClusterVo(conn) }*/
