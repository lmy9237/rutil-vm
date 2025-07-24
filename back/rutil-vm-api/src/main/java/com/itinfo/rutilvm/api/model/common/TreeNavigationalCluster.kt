package com.itinfo.rutilvm.api.model.common

import com.itinfo.rutilvm.api.model.computing.VmVo
import com.itinfo.rutilvm.api.ovirt.business.VmStatusB
import com.itinfo.rutilvm.api.ovirt.business.model.TreeNavigatableType
import com.itinfo.rutilvm.api.repository.engine.VmRepository
import com.itinfo.rutilvm.api.repository.engine.entity.VmEntity
import com.itinfo.rutilvm.api.repository.engine.entity.toVmVosFromVmEntities
import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.common.toUUID
import com.itinfo.rutilvm.util.ovirt.findAllHostsFromCluster

import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.types.Cluster
import org.ovirt.engine.sdk4.types.Host
import org.ovirt.engine.sdk4.types.HostStatus
import java.io.Serializable

class TreeNavigationalCluster (
    id: String = "",
    name: String = "",
    val hosts: List<TreeNavigational<HostStatus>> = listOf(),
    val vmDowns: List<VmVo> = listOf(),
): TreeNavigational<Unit>(TreeNavigatableType.CLUSTER, id, name), Serializable {
    override fun toString(): String =
        gson.toJson(this)

    class Builder {
        private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
        private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
        private var bHosts: List<TreeNavigational<HostStatus>> = listOf(); fun hosts(block: () -> List<TreeNavigational<HostStatus>>?) { bHosts = block() ?: listOf() }
        private var bVmDowns: List<VmVo> = listOf(); fun vmDowns(block: () -> List<VmVo>?) { bVmDowns = block() ?: listOf() }
        fun build(): TreeNavigationalCluster = TreeNavigationalCluster(bId, bName, bHosts, bVmDowns)
    }
    companion object {
        inline fun builder(block: TreeNavigationalCluster.Builder.() -> Unit): TreeNavigationalCluster = TreeNavigationalCluster.Builder().apply(block).build()
    }
}

fun Cluster.toNavigationalFromCluster(conn: Connection?=null, rVm: VmRepository?=null): TreeNavigationalCluster {
    val hosts: List<Host> = conn?.findAllHostsFromCluster(this@toNavigationalFromCluster.id())
		?.getOrDefault(emptyList()) ?: emptyList()
    val vmDowns: List<VmEntity> = rVm?.findAllByClusterIdWithSnapshotsOrderByVmNameAsc(this@toNavigationalFromCluster.id().toUUID())
		?.filter {
			it.status === VmStatusB.down ||
			it.status === VmStatusB.not_responding ||
			it.status === VmStatusB.image_locked ||
			it.status === VmStatusB.image_illegal ||
			it.status === VmStatusB.wait_for_launch ||
			it.status === VmStatusB.suspended
		} ?: emptyList()
	// conn.findAllVmsFromCluster(this@toNavigational.id(), "status=down or status=notresponding or status=rebootinprogress or status=imagelocked or status=suspended").getOrDefault(listOf())

    return TreeNavigationalCluster.builder {
        id { this@toNavigationalFromCluster.id() }
        name { this@toNavigationalFromCluster.name() }
        hosts { hosts.toNavigationalsFromHosts(conn, rVm) }
        vmDowns { vmDowns.toVmVosFromVmEntities(listOf()) }
    }
}
fun List<Cluster>.toNavigationalsFromClusters(conn: Connection?, rVm: VmRepository?=null): List<TreeNavigationalCluster> =
    this@toNavigationalsFromClusters.map { it.toNavigationalFromCluster(conn, rVm) }
