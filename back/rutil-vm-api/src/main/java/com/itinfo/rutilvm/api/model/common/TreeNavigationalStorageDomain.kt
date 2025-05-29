package com.itinfo.rutilvm.api.model.common

import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.util.ovirt.findAllDisksFromStorageDomain

import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.types.Disk
import org.ovirt.engine.sdk4.types.DiskStatus
import org.ovirt.engine.sdk4.types.StorageDomain
import org.ovirt.engine.sdk4.types.StorageDomainStatus
import java.io.Serializable

class TreeNavigationalStorageDomain (
    id: String = "",
    name: String = "",
	status: StorageDomainStatus? = null,
    val disks: List<TreeNavigational<DiskStatus>> = listOf()
): TreeNavigational<StorageDomainStatus>(TreeNavigationalType.STORAGE_DOMAIN, id, name, status), Serializable {
    override fun toString(): String =
        gson.toJson(this)

    class Builder {
        private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
        private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bStatus: StorageDomainStatus? = null;fun status(block: () -> StorageDomainStatus?) { bStatus = block() }
        private var bDisks: List<TreeNavigational<DiskStatus>> = listOf(); fun disks(block: () -> List<TreeNavigational<DiskStatus>>?) { bDisks = block() ?: listOf() }
        fun build(): TreeNavigationalStorageDomain = TreeNavigationalStorageDomain(bId, bName, bStatus, bDisks)
    }
    companion object {
        inline fun builder(block: TreeNavigationalStorageDomain.Builder.() -> Unit): TreeNavigationalStorageDomain = TreeNavigationalStorageDomain.Builder().apply(block).build()
    }
}

fun StorageDomain.toNavigationalWithStorageDomains(/*conn: Connection*/): TreeNavigationalStorageDomain {
    // 디스크 목록 출력삭제
//    val disks: List<Disk> =
//        conn.findAllDisksFromStorageDomain(this@toNavigationalWithStorageDomains.id())
//            .getOrDefault(listOf())

    return TreeNavigationalStorageDomain.builder {
        id { this@toNavigationalWithStorageDomains.id() }
        name { this@toNavigationalWithStorageDomains.name() }
//        disks { disks.fromDisksToTreeNavigationals() }
    }
}

fun List<StorageDomain>.fromDisksToTreeNavigationals(/*conn: Connection*/): List<TreeNavigationalStorageDomain> =
    this@fromDisksToTreeNavigationals.map { it.toNavigationalWithStorageDomains(/*conn*/) }
