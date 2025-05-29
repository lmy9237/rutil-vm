package com.itinfo.rutilvm.api.model.common

import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.util.ovirt.findAllVms
import com.itinfo.rutilvm.util.ovirt.findAllVmsFromHost

import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.types.Host
import org.ovirt.engine.sdk4.types.HostStatus
import org.ovirt.engine.sdk4.types.TemplateStatus
import org.ovirt.engine.sdk4.types.Vm
import org.ovirt.engine.sdk4.types.VmStatus
import java.io.Serializable

class TreeNavigationalHost (
    id: String = "",
    name: String = "",
	status: HostStatus? = null,
    val vms: List<TreeNavigational<VmStatus>> = listOf(),
    val templates: List<TreeNavigational<TemplateStatus>> = listOf()
): TreeNavigational<HostStatus>(TreeNavigationalType.HOST, id, name, status), Serializable {
    override fun toString(): String =
        gson.toJson(this)

    class Builder {
        private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bStatus: HostStatus? = null;fun status(block: () -> HostStatus?) { bStatus = block() }
        private var bVms: List<TreeNavigational<VmStatus>> = listOf(); fun vms(block: () -> List<TreeNavigational<VmStatus>>?) { bVms = block() ?: listOf() }
        private var bTemplates: List<TreeNavigational<TemplateStatus>> = listOf(); fun templates(block: () -> List<TreeNavigational<TemplateStatus>>?) { bTemplates = block() ?: listOf() }
        fun build(): TreeNavigationalHost = TreeNavigationalHost(bId, bName, bStatus, bVms, bTemplates)
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
		status { this@toNavigationalWithStorageDomains.status() }
        vms { vms.fromVmsToTreeNavigationals() }
    }
}
fun List<Host>.fromDisksToTreeNavigationals(conn: Connection): List<TreeNavigationalHost> =
    this@fromDisksToTreeNavigationals.map { it.toNavigationalWithStorageDomains(conn) }
