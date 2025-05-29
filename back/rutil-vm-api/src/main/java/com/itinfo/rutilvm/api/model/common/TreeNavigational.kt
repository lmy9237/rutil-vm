package com.itinfo.rutilvm.api.model.common

import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.util.ovirt.Term

import org.ovirt.engine.sdk4.types.Disk
import org.ovirt.engine.sdk4.types.DiskStatus
import org.ovirt.engine.sdk4.types.Network
import org.ovirt.engine.sdk4.types.NetworkStatus
import org.ovirt.engine.sdk4.types.Template
import org.ovirt.engine.sdk4.types.TemplateStatus
import org.ovirt.engine.sdk4.types.Vm
import org.ovirt.engine.sdk4.types.VmStatus
import java.io.Serializable

open class TreeNavigational<out T: Any?>(
	val type: TreeNavigationalType? = TreeNavigationalType.UNKNOWN,
	val id: String? = "",
	val name: String? = "",
	val status: T? = null,
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder<T> {
		private var bType: TreeNavigationalType? = TreeNavigationalType.UNKNOWN;fun type(block: () -> TreeNavigationalType?) { bType = block() ?: TreeNavigationalType.UNKNOWN }
		private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bStatus: T? = null; fun status(block: () -> T?) { bStatus = block() }
		fun build(): TreeNavigational<T> = TreeNavigational(bType, bId, bName, bStatus)
	}
	companion object {
		 inline fun <reified T> builder(block: TreeNavigational.Builder<T>.() -> Unit): TreeNavigational<T> = TreeNavigational.Builder<T>().apply(block).build()
	}
}

enum class TreeNavigationalType(
	val term: Term,
) {
	DATACENTER(Term.DATACENTER),
	CLUSTER(Term.CLUSTER),
	STORAGE_DOMAIN(Term.STORAGE_DOMAIN),
	DISK(Term.DISK),
	VM(Term.VM),
	TEMPLATE(Term.TEMPLATE),
	HOST(Term.HOST),
	NETWORK(Term.NETWORK),
	UNKNOWN(Term.UNKNOWN);
}

//region: Disk
fun Disk.toNavigationalWithStorageDomains(): TreeNavigational<DiskStatus> = TreeNavigational.builder {
	type { TreeNavigationalType.DISK }
	id { this@toNavigationalWithStorageDomains.id() }
	name { this@toNavigationalWithStorageDomains.name() }
	status { this@toNavigationalWithStorageDomains.status() }
}
fun List<Disk>.fromDisksToTreeNavigationals(): List<TreeNavigational<DiskStatus>> =
	this@fromDisksToTreeNavigationals.map { it.toNavigationalWithStorageDomains() }
//endregion

//region: Vm
fun Vm.toNavigationalWithStorageDomains(): TreeNavigational<VmStatus> = TreeNavigational.builder {
	type { TreeNavigationalType.VM }
	id { this@toNavigationalWithStorageDomains.id() }
	name { this@toNavigationalWithStorageDomains.name() }
	status { this@toNavigationalWithStorageDomains.status() }
}
fun List<Vm>.fromVmsToTreeNavigationals(): List<TreeNavigational<VmStatus>> =
	this@fromVmsToTreeNavigationals.map { it.toNavigationalWithStorageDomains() }
//endregion

//region: Template
fun Template.fromTemplateToTreeNavigational(): TreeNavigational<TemplateStatus> = TreeNavigational.builder {
	type { TreeNavigationalType.TEMPLATE }
	id { this@fromTemplateToTreeNavigational.id() }
	name { this@fromTemplateToTreeNavigational.name() }
	status { this@fromTemplateToTreeNavigational.status() }
}

fun List<Template>.fromTemplateToTreeNavigationals(): List<TreeNavigational<TemplateStatus>> =
	this@fromTemplateToTreeNavigationals.map { it.fromTemplateToTreeNavigational() }
//endregion

//region: Network
fun Network.toNavigationalWithStorageDomains(): TreeNavigational<NetworkStatus> = TreeNavigational.builder {
	type { TreeNavigationalType.NETWORK }
	id { this@toNavigationalWithStorageDomains.id() }
	name { this@toNavigationalWithStorageDomains.name() }
	status { this@toNavigationalWithStorageDomains.status() }
}
fun List<Network>.fromNetworksToTreeNavigationals(): List<TreeNavigational<NetworkStatus>> =
	this@fromNetworksToTreeNavigationals.map { it.toNavigationalWithStorageDomains() }
//endregion
