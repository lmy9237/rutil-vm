package com.itinfo.rutilvm.api.model.common

import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.util.ovirt.findAllAttachedStorageDomainsFromDataCenter
import com.itinfo.rutilvm.util.ovirt.findAllClustersFromDataCenter
import com.itinfo.rutilvm.util.ovirt.findAllNetworksFromDataCenter

import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.types.Cluster
import org.ovirt.engine.sdk4.types.DataCenter
import org.ovirt.engine.sdk4.types.Network
import org.ovirt.engine.sdk4.types.StorageDomain
import java.io.Serializable

class TreeNavigationalDataCenter (
    id: String = "",
    name: String = "",
    val clusters: List<TreeNavigational> = listOf(),
    val networks: List<TreeNavigational> = listOf(),
    val storageDomains: List<TreeNavigational> = listOf(),
): TreeNavigational(TreeNavigationalType.DATACENTER, id, name), Serializable {
    override fun toString(): String =
        gson.toJson(this)

    class Builder {
        private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
        private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
        private var bClusters: List<TreeNavigational> = listOf(); fun clusters(block: () -> List<TreeNavigational>?) { bClusters = block() ?: listOf() }
        private var bNetworks: List<TreeNavigational> = listOf(); fun networks(block: () -> List<TreeNavigational>?) { bNetworks = block() ?: listOf() }
        private var bStorageDomains: List<TreeNavigational> = listOf(); fun storageDomains(block: () -> List<TreeNavigational>?) { bStorageDomains = block() ?: listOf() }
        fun build(): TreeNavigationalDataCenter = TreeNavigationalDataCenter(bId, bName, bClusters, bNetworks, bStorageDomains)
    }
    companion object {
        inline fun builder(block: TreeNavigationalDataCenter.Builder.() -> Unit): TreeNavigationalDataCenter = TreeNavigationalDataCenter.Builder().apply(block).build()
    }
}

fun DataCenter.toNavigationalWithClusters(conn: Connection): TreeNavigationalDataCenter {
    val clusters: List<Cluster> = conn.findAllClustersFromDataCenter(this.id()).getOrDefault(listOf())

    return TreeNavigationalDataCenter.builder {
        id { this@toNavigationalWithClusters.id() }
        name { this@toNavigationalWithClusters.name() }
        clusters { clusters.toNavigationals(conn) }
    }
}
fun List<DataCenter>.toNavigationalsWithClusters(conn: Connection): List<TreeNavigationalDataCenter> =
    this@toNavigationalsWithClusters.map { it.toNavigationalWithClusters(conn) }

fun DataCenter.toNavigationalWithNetworks(conn: Connection): TreeNavigationalDataCenter {
    val networks: List<Network> =
        conn.findAllNetworksFromDataCenter(this.id()).getOrDefault(listOf())

    return TreeNavigationalDataCenter.builder {
        id { this@toNavigationalWithNetworks.id() }
        name { this@toNavigationalWithNetworks.name() }
        networks { networks.fromNetworksToTreeNavigationals() }
    }
}

fun List<DataCenter>.totoNavigationalsWithNetworks(conn: Connection): List<TreeNavigationalDataCenter> =
    this@totoNavigationalsWithNetworks.map { it.toNavigationalWithNetworks(conn) }

fun DataCenter.toNavigationalWithStorageDomains(conn: Connection): TreeNavigationalDataCenter {
    val storageDomains: List<StorageDomain> =
        conn.findAllAttachedStorageDomainsFromDataCenter(this@toNavigationalWithStorageDomains.id())
            .getOrDefault(listOf())

    return TreeNavigationalDataCenter.builder {
        id { this@toNavigationalWithStorageDomains.id() }
        name { this@toNavigationalWithStorageDomains.name() }
        storageDomains { storageDomains.fromDisksToTreeNavigationals(/*conn*/) }
    }
}
fun List<DataCenter>.toNavigationalsWithStorageDomains(conn: Connection): List<TreeNavigationalDataCenter> =
    this@toNavigationalsWithStorageDomains.map { it.toNavigationalWithStorageDomains(conn) }

