package com.itinfo.rutilvm.api.model.common

import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.util.ovirt.findAllAttachedStorageDomainsFromDataCenter
import com.itinfo.rutilvm.util.ovirt.findAllClustersFromDataCenter
import com.itinfo.rutilvm.util.ovirt.findAllNetworksFromDataCenter

import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.types.Cluster
import org.ovirt.engine.sdk4.types.DataCenter
import org.ovirt.engine.sdk4.types.DataCenterStatus
import org.ovirt.engine.sdk4.types.Network
import org.ovirt.engine.sdk4.types.NetworkStatus
import org.ovirt.engine.sdk4.types.StorageDomain
import org.ovirt.engine.sdk4.types.StorageDomainStatus
import java.io.Serializable

class TreeNavigationalDataCenter (
    id: String = "",
	name: String = "",
	status: DataCenterStatus? = null,
    val clusters: List<TreeNavigational<Unit>> = listOf(),
    val networks: List<TreeNavigational<NetworkStatus>> = listOf(),
    val storageDomains: List<TreeNavigational<StorageDomainStatus>> = listOf(),
): TreeNavigational<DataCenterStatus>(TreeNavigationalType.DATACENTER, id, name, status), Serializable {
    override fun toString(): String =
        gson.toJson(this)

    class Builder {
        private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
        private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bStatus: DataCenterStatus? = null;fun status(block: () -> DataCenterStatus?) { bStatus = block() }
        private var bClusters: List<TreeNavigational<Unit>> = listOf(); fun clusters(block: () -> List<TreeNavigational<Unit>>?) { bClusters = block() ?: listOf() }
        private var bNetworks: List<TreeNavigational<NetworkStatus>> = listOf(); fun networks(block: () -> List<TreeNavigational<NetworkStatus>>?) { bNetworks = block() ?: listOf() }
        private var bStorageDomains: List<TreeNavigational<StorageDomainStatus>> = listOf(); fun storageDomains(block: () -> List<TreeNavigational<StorageDomainStatus>>?) { bStorageDomains = block() ?: listOf() }
        fun build(): TreeNavigationalDataCenter = TreeNavigationalDataCenter(bId, bName, bStatus, bClusters, bNetworks, bStorageDomains)
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
		status { this@toNavigationalWithClusters.status() }
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
        conn.findAllAttachedStorageDomainsFromDataCenter(this@toNavigationalWithStorageDomains.id(), follow = "disks")
            .getOrDefault(listOf())

    return TreeNavigationalDataCenter.builder {
        id { this@toNavigationalWithStorageDomains.id() }
        name { this@toNavigationalWithStorageDomains.name() }
        storageDomains { storageDomains.fromDisksToTreeNavigationals(conn) }
    }
}
fun List<DataCenter>.toNavigationalsWithStorageDomains(conn: Connection): List<TreeNavigationalDataCenter> =
    this@toNavigationalsWithStorageDomains.map { it.toNavigationalWithStorageDomains(conn) }

