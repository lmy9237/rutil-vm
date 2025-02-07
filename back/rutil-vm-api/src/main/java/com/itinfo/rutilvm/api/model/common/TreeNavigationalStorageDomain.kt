package com.itinfo.rutilvm.api.model.common

import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.util.ovirt.findAllDisksFromStorageDomain

import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.types.Disk
import org.ovirt.engine.sdk4.types.StorageDomain
import java.io.Serializable

class TreeNavigationalStorageDomain (
    id: String = "",
    name: String = "",
    val disks: List<TreeNavigational> = listOf()
): TreeNavigational(TreeNavigationalType.STORAGE_DOMAIN, id, name), Serializable {
    override fun toString(): String =
        gson.toJson(this)

    class Builder {
        private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
        private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
        private var bDisks: List<TreeNavigational> = listOf(); fun disks(block: () -> List<TreeNavigational>?) { bDisks = block() ?: listOf() }
        fun build(): TreeNavigationalStorageDomain = TreeNavigationalStorageDomain(bId, bName, bDisks)
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