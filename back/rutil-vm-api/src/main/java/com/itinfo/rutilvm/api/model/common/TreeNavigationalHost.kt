package com.itinfo.rutilvm.api.model.common

import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.util.ovirt.findAllVms
import com.itinfo.rutilvm.util.ovirt.findAllVmsFromHost

import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.types.Host
import org.ovirt.engine.sdk4.types.Vm
import java.io.Serializable

class TreeNavigationalHost (
    id: String = "",
    name: String = "",
    val vms: List<TreeNavigational> = listOf(),
    val templates: List<TreeNavigational> = listOf()
): TreeNavigational(TreeNavigationalType.HOST, id, name), Serializable {
    override fun toString(): String =
        gson.toJson(this)

    class Builder {
        private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
        private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
        private var bVms: List<TreeNavigational> = listOf(); fun vms(block: () -> List<TreeNavigational>?) { bVms = block() ?: listOf() }
        private var bTemplates: List<TreeNavigational> = listOf(); fun templates(block: () -> List<TreeNavigational>?) { bTemplates = block() ?: listOf() }
        fun build(): TreeNavigationalHost = TreeNavigationalHost(bId, bName, bVms, bTemplates)
    }
    companion object {
        inline fun builder(block: TreeNavigationalHost.Builder.() -> Unit): TreeNavigationalHost = TreeNavigationalHost.Builder().apply(block).build()
    }
}

fun Host.toNavigationalWithStorageDomains(conn: Connection): TreeNavigationalHost {
    val vms: List<Vm> = conn.findAllVmsFromHost(this@toNavigationalWithStorageDomains.id(), " status = poweringup or status = up or status = savingstate or status = restoringstate or status = poweringdown").getOrDefault(listOf())

    return TreeNavigationalHost.builder {
        id { this@toNavigationalWithStorageDomains.id() }
        name { this@toNavigationalWithStorageDomains.name() }
        vms { vms.fromVmsToTreeNavigationals() }
    }
}
fun List<Host>.fromDisksToTreeNavigationals(conn: Connection): List<TreeNavigationalHost> =
    this@fromDisksToTreeNavigationals.map { it.toNavigationalWithStorageDomains(conn) }
