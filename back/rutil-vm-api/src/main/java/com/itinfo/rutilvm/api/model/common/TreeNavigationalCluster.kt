package com.itinfo.rutilvm.api.model.common

import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.util.ovirt.findAllHosts
import com.itinfo.rutilvm.util.ovirt.findAllHostsFromCluster
import com.itinfo.rutilvm.util.ovirt.findAllVms
import com.itinfo.rutilvm.util.ovirt.findAllVmsFromCluster

import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.types.Cluster
import org.ovirt.engine.sdk4.types.Host
import org.ovirt.engine.sdk4.types.Vm
import java.io.Serializable

class TreeNavigationalCluster (
    id: String = "",
    name: String = "",
    val hosts: List<TreeNavigational> = listOf(),
    val vmDowns: List<TreeNavigational> = listOf(),
): TreeNavigational(TreeNavigationalType.CLUSTER, id, name), Serializable {
    override fun toString(): String =
        gson.toJson(this)

    class Builder {
        private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
        private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
        private var bHosts: List<TreeNavigational> = listOf(); fun hosts(block: () -> List<TreeNavigational>?) { bHosts = block() ?: listOf() }
        private var bVmDowns: List<TreeNavigational> = listOf(); fun vmDowns(block: () -> List<TreeNavigational>?) { bVmDowns = block() ?: listOf() }
        fun build(): TreeNavigationalCluster = TreeNavigationalCluster(bId, bName, bHosts, bVmDowns)
    }
    companion object {
        inline fun builder(block: TreeNavigationalCluster.Builder.() -> Unit): TreeNavigationalCluster = TreeNavigationalCluster.Builder().apply(block).build()
    }
}

fun Cluster.toNavigational(conn: Connection): TreeNavigationalCluster {
    val hosts: List<Host> = conn.findAllHostsFromCluster(this@toNavigational.id()).getOrDefault(listOf())
    val vmDowns: List<Vm> = conn.findAllVmsFromCluster(this@toNavigational.id(), "status=down or status=notresponding or status=rebootinprogress or status=imagelocked or status=suspended").getOrDefault(listOf())

    return TreeNavigationalCluster.builder {
        id { this@toNavigational.id() }
        name { this@toNavigational.name() }
        hosts { hosts.fromDisksToTreeNavigationals(conn) }
        vmDowns { vmDowns.fromVmsToTreeNavigationals() }
    }
}
fun List<Cluster>.toNavigationals(conn: Connection): List<TreeNavigationalCluster> =
    this@toNavigationals.map { it.toNavigational(conn) }
