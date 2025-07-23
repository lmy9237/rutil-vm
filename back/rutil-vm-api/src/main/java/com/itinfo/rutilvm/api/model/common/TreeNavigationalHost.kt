package com.itinfo.rutilvm.api.model.common

import com.itinfo.rutilvm.api.model.computing.VmVo
import com.itinfo.rutilvm.api.ovirt.business.VmStatusB
import com.itinfo.rutilvm.api.ovirt.business.model.TreeNavigatableType
import com.itinfo.rutilvm.api.repository.engine.VmRepository
import com.itinfo.rutilvm.api.repository.engine.entity.VmEntity
import com.itinfo.rutilvm.api.repository.engine.entity.toVmVosFromVmEntities
import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.common.toUUID
import com.itinfo.rutilvm.util.ovirt.findAllVmsFromHost

import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.types.Host
import org.ovirt.engine.sdk4.types.HostStatus
import org.ovirt.engine.sdk4.types.TemplateStatus
import org.ovirt.engine.sdk4.types.Vm
import java.io.Serializable

class TreeNavigationalHost (
    id: String = "",
    name: String = "",
	status: HostStatus? = null,
    val vms: List<VmVo> = listOf(),
    val templates: List<TreeNavigational<TemplateStatus>> = listOf()
): TreeNavigational<HostStatus>(TreeNavigatableType.HOST, id, name, status), Serializable {
    override fun toString(): String =
        gson.toJson(this)

    class Builder {
        private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bStatus: HostStatus? = null;fun status(block: () -> HostStatus?) { bStatus = block() }
        private var bVms: List<VmVo> = listOf(); fun vms(block: () -> List<VmVo>?) { bVms = block() ?: listOf() }
        private var bTemplates: List<TreeNavigational<TemplateStatus>> = listOf(); fun templates(block: () -> List<TreeNavigational<TemplateStatus>>?) { bTemplates = block() ?: listOf() }
        fun build(): TreeNavigationalHost = TreeNavigationalHost(bId, bName, bStatus, bVms, bTemplates)
    }
    companion object {
        inline fun builder(block: TreeNavigationalHost.Builder.() -> Unit): TreeNavigationalHost = TreeNavigationalHost.Builder().apply(block).build()
    }
}

fun Host.toNavigationalFromHost(conn: Connection?, rVm: VmRepository?=null): TreeNavigationalHost {
    val res: List<Vm> = conn?.findAllVmsFromHost(this@toNavigationalFromHost.id(), " status = poweringup or status = up or status = savingstate or status = restoringstate or status = poweringdown")
		?.getOrDefault(emptyList())
		?: emptyList()

	val vms: List<VmEntity> = rVm?.findAllByRunOnVdsWithSnapshotsOrderByVmNameAsc(this@toNavigationalFromHost.id().toUUID())
		?.filter {
			//it.status?.runningOrPaused == true ||
			it.status == VmStatusB.powering_up ||
			it.status == VmStatusB.reboot_in_progress ||
			it.status == VmStatusB.up ||
			it.status == VmStatusB.saving_state ||
			it.status == VmStatusB.restoring_state ||
			it.status == VmStatusB.powering_down
		} ?: emptyList()

	return TreeNavigationalHost.builder {
        id { this@toNavigationalFromHost.id() }
        name { this@toNavigationalFromHost.name() }
		status { this@toNavigationalFromHost.status() }
        vms { vms.toVmVosFromVmEntities(res) }
    }
}
fun List<Host>.toNavigationalsFromHosts(conn: Connection?, rVm: VmRepository?=null): List<TreeNavigationalHost> =
    this@toNavigationalsFromHosts.map { it.toNavigationalFromHost(conn, rVm) }
