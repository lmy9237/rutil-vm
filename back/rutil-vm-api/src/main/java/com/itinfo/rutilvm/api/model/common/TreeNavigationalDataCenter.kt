package com.itinfo.rutilvm.api.model.common

import com.itinfo.rutilvm.api.model.network.toNetworkVos
import com.itinfo.rutilvm.api.ovirt.business.NetworkStatusB
import com.itinfo.rutilvm.api.ovirt.business.model.TreeNavigatableType
import com.itinfo.rutilvm.api.repository.engine.AllDisksRepository
import com.itinfo.rutilvm.api.repository.engine.NetworkRepository
import com.itinfo.rutilvm.api.repository.engine.VmRepository
import com.itinfo.rutilvm.api.repository.engine.entity.NetworkEntity
import com.itinfo.rutilvm.api.repository.engine.entity.toNetworkVosFromNetworkEntities
import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.common.toUUID
import com.itinfo.rutilvm.util.ovirt.findAllAttachedStorageDomainsFromDataCenter
import com.itinfo.rutilvm.util.ovirt.findAllClustersFromDataCenter
import com.itinfo.rutilvm.util.ovirt.findAllStorageDomains

import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.types.Cluster
import org.ovirt.engine.sdk4.types.DataCenter
import org.ovirt.engine.sdk4.types.DataCenterStatus
import org.ovirt.engine.sdk4.types.StorageDomain
import org.ovirt.engine.sdk4.types.StorageDomainStatus
import java.io.Serializable

class TreeNavigationalDataCenter (
    id: String = "",
	name: String = "",
	status: DataCenterStatus? = null,
    val clusters: List<TreeNavigational<Unit>> = emptyList(),
    val networks: List<TreeNavigatable<NetworkStatusB>> = emptyList(),
    val storageDomains: List<TreeNavigatable<StorageDomainStatus>> = emptyList(),
): TreeNavigational<DataCenterStatus>(TreeNavigatableType.DATACENTER, id, name, status), Serializable {
    override fun toString(): String =
        gson.toJson(this)

    class Builder {
        private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
        private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bStatus: DataCenterStatus? = null;fun status(block: () -> DataCenterStatus?) { bStatus = block() }
        private var bClusters: List<TreeNavigational<Unit>> = emptyList(); fun clusters(block: () -> List<TreeNavigational<Unit>>?) { bClusters = block() ?: emptyList() }
        private var bNetworks: List<TreeNavigatable<NetworkStatusB>> = emptyList(); fun networks(block: () -> List<TreeNavigatable<NetworkStatusB>>?) { bNetworks = block() ?: emptyList() }
        private var bStorageDomains: List<TreeNavigatable<StorageDomainStatus>> = emptyList(); fun storageDomains(block: () -> List<TreeNavigatable<StorageDomainStatus>>?) { bStorageDomains = block() ?: emptyList() }
        fun build(): TreeNavigationalDataCenter = TreeNavigationalDataCenter(bId, bName, bStatus, bClusters, bNetworks, bStorageDomains)
    }
    companion object {
        inline fun builder(block: TreeNavigationalDataCenter.Builder.() -> Unit): TreeNavigationalDataCenter = TreeNavigationalDataCenter.Builder().apply(block).build()
    }
}

fun DataCenter.toNavigationalFromDataCenter4Clusters(
	conn: Connection?=null,
	rVms: VmRepository?=null
): TreeNavigationalDataCenter {
    val clusters: List<Cluster> = conn?.findAllClustersFromDataCenter(this.id())
		?.getOrDefault(emptyList())
		?: emptyList()

    return TreeNavigationalDataCenter.builder {
        id { this@toNavigationalFromDataCenter4Clusters.id() }
        name { this@toNavigationalFromDataCenter4Clusters.name() }
		status { this@toNavigationalFromDataCenter4Clusters.status() }
        clusters { clusters.toNavigationalsFromClusters(conn, rVms) }
    }
}
fun List<DataCenter>.toNavigationalsFromDataCenter4Clusters(
	conn: Connection?=null,
	rVms: VmRepository?=null
): List<TreeNavigationalDataCenter> = this@toNavigationalsFromDataCenter4Clusters.map {
	it.toNavigationalFromDataCenter4Clusters(conn, rVms)
}

fun DataCenter.toNavigationalFromNetwork(
	conn: Connection?,
	rNetworks: NetworkRepository?=null,
): TreeNavigationalDataCenter {
    /*
    val networks: List<Network> =
        conn?.findAllNetworksFromDataCenter(this.id())
			?.getOrDefault(emptyList())
			?: emptyList()
	*/
	val networksFound: List<NetworkEntity> =
		rNetworks?.findAllByDatacenterId(this@toNavigationalFromNetwork.id().toUUID())
			?: emptyList()

    return TreeNavigationalDataCenter.builder {
        id { this@toNavigationalFromNetwork.id() }
        name { this@toNavigationalFromNetwork.name() }
        networks { networksFound.toNetworkVosFromNetworkEntities() }
    }
}

fun List<DataCenter>.toNavigationalsFromNetworks(
	conn: Connection?,
	rNetworks: NetworkRepository?=null,
): List<TreeNavigationalDataCenter> = this@toNavigationalsFromNetworks.map {
	it.toNavigationalFromNetwork(conn, rNetworks)
}

fun DataCenter.toNavigationalFromDataCenter4StorageDomains(
	conn: Connection?=null,
	// rStorageDomains: StorageDomainRepository?=null,
	rAllDisks: AllDisksRepository?=null,
): TreeNavigationalDataCenter {
	/*
	val storageDomainsFound: List<StorageDomainEntity> = rStorageDomains?.findAllByOrderByStorageNameAsc() ?: emptyList()
	return storageDomainsFound.toStorageDomainVosFromStorageDomainEntities()
	*/

	val storageDomains: List<StorageDomain> =
		// conn?.findAllStorageDomains(this@toNavigationalFromDataCenter4StorageDomains.id(), follow = "disks")
		conn?.findAllAttachedStorageDomainsFromDataCenter(this@toNavigationalFromDataCenter4StorageDomains.id(), follow = "disks")
			?.getOrDefault(emptyList())
			?: emptyList()

    return TreeNavigationalDataCenter.builder {
        id { this@toNavigationalFromDataCenter4StorageDomains.id() }
        name { this@toNavigationalFromDataCenter4StorageDomains.name() }
        storageDomains { storageDomains.toTreeNavigationalsFromStorageDomain(conn, rAllDisks) }
    }
}

fun List<DataCenter>.toNavigationalsFromDataCenters4StorageDomains(
	conn: Connection?,
	rAllDisks: AllDisksRepository?=null,
): List<TreeNavigationalDataCenter> = this@toNavigationalsFromDataCenters4StorageDomains.map {
	it.toNavigationalFromDataCenter4StorageDomains(conn, rAllDisks)
}
