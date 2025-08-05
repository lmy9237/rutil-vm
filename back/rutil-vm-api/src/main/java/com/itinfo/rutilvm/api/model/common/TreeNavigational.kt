package com.itinfo.rutilvm.api.model.common

import com.itinfo.rutilvm.api.model.storage.DiskImageVo
import com.itinfo.rutilvm.api.ovirt.business.DiskStatusB
import com.itinfo.rutilvm.common.gson

import com.itinfo.rutilvm.api.ovirt.business.VmStatusB
import com.itinfo.rutilvm.api.ovirt.business.VmTemplateStatusB
import com.itinfo.rutilvm.api.ovirt.business.model.TreeNavigatableType
import com.itinfo.rutilvm.api.ovirt.business.toVmTemplateStatusB
import com.itinfo.rutilvm.api.ovirt.business.toVmStatusB
import com.itinfo.rutilvm.api.repository.engine.entity.VmEntity

import org.ovirt.engine.sdk4.types.Network
import org.ovirt.engine.sdk4.types.NetworkStatus
import org.ovirt.engine.sdk4.types.Template
import org.ovirt.engine.sdk4.types.Vm
import java.io.Serializable

interface TreeNavigatable<out T: Any?> {
	val type: TreeNavigatableType?
	val id: String?
	val name: String?
	val status: T?
}

open class TreeNavigational<out T: Any?>(
	override val type: TreeNavigatableType? = TreeNavigatableType.UNKNOWN,
	override val id: String? = "",
	override val name: String? = "",
	override val status: T? = null,
): TreeNavigatable<T>, Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder<T> {
		private var bType: TreeNavigatableType? = TreeNavigatableType.UNKNOWN;fun type(block: () -> TreeNavigatableType?) { bType = block() ?: TreeNavigatableType.UNKNOWN }
		private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bStatus: T? = null; fun status(block: () -> T?) { bStatus = block() }
		fun build(): TreeNavigational<T> = TreeNavigational(bType, bId, bName, bStatus)
	}
	companion object {
		 inline fun <reified T> builder(block: TreeNavigational.Builder<T>.() -> Unit): TreeNavigational<T> = TreeNavigational.Builder<T>().apply(block).build()
	}
}

//region: Vm
fun Vm.toNavigationalFromVms(): TreeNavigational<VmStatusB> = TreeNavigational.builder {
	type { TreeNavigatableType.VM }
	id { this@toNavigationalFromVms.id() }
	name { this@toNavigationalFromVms.name() }
	status { this@toNavigationalFromVms.status().toVmStatusB() }
}
fun List<Vm>.toNavigationalsFromVms(): List<TreeNavigational<VmStatusB>> =
	this@toNavigationalsFromVms.map { it.toNavigationalFromVms() }

fun VmEntity.toNavigationalFromVmEntity(): TreeNavigational<VmStatusB> = TreeNavigational.builder {
	type { TreeNavigatableType.VM }
	id { this@toNavigationalFromVmEntity.vmGuid.toString() }
	name { this@toNavigationalFromVmEntity.vmName }
	status { this@toNavigationalFromVmEntity.status }
}
fun List<VmEntity>.toNavigationalsFromVmEntitiess(): List<TreeNavigational<VmStatusB>> =
	this@toNavigationalsFromVmEntitiess.map { it.toNavigationalFromVmEntity() }
//endregion

//region: Template
fun Template.toNavigationalFromTemplate(): TreeNavigational<VmTemplateStatusB> = TreeNavigational.builder {
	type { TreeNavigatableType.TEMPLATE }
	id { this@toNavigationalFromTemplate.id() }
	name { this@toNavigationalFromTemplate.name() }
	status { this@toNavigationalFromTemplate.status().toVmTemplateStatusB() }
}

fun List<Template>.toNavigationalsFromTemplates(): List<TreeNavigational<VmTemplateStatusB>> =
	this@toNavigationalsFromTemplates.map { it.toNavigationalFromTemplate() }
//endregion

//region: Network
fun Network.toNavigationalFromNetwork(): TreeNavigational<NetworkStatus> = TreeNavigational.builder {
	type { TreeNavigatableType.NETWORK }
	id { this@toNavigationalFromNetwork.id() }
	name { this@toNavigationalFromNetwork.name() }
	status { this@toNavigationalFromNetwork.status() }
}
fun List<Network>.toNavigationalsFromNetworks(): List<TreeNavigational<NetworkStatus>> =
	this@toNavigationalsFromNetworks.map { it.toNavigationalFromNetwork() }
//endregion
