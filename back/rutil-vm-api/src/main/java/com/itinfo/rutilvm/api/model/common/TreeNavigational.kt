package com.itinfo.rutilvm.api.model.common

import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.util.ovirt.Term

import org.ovirt.engine.sdk4.types.Disk
import org.ovirt.engine.sdk4.types.Network
import org.ovirt.engine.sdk4.types.Template
import org.ovirt.engine.sdk4.types.Vm
import java.io.Serializable

open class TreeNavigational(
	val type: TreeNavigationalType? = TreeNavigationalType.UNKNOWN,
	val id: String? = "",
	val name: String? = ""
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bType: TreeNavigationalType? = TreeNavigationalType.UNKNOWN;fun type(block: () -> TreeNavigationalType?) { bType = block() ?: TreeNavigationalType.UNKNOWN }
		private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
		fun build(): TreeNavigational = TreeNavigational(bType, bId, bName)
	}
	companion object {
		inline fun builder(block: TreeNavigational.Builder.() -> Unit): TreeNavigational = TreeNavigational.Builder().apply(block).build()
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
fun Disk.toNavigationalWithStorageDomains(): TreeNavigational = TreeNavigational.builder {
	type { TreeNavigationalType.DISK }
	id { this@toNavigationalWithStorageDomains.id() }
	name { this@toNavigationalWithStorageDomains.name() }
}
fun List<Disk>.fromDisksToTreeNavigationals(): List<TreeNavigational> =
	this@fromDisksToTreeNavigationals.map { it.toNavigationalWithStorageDomains() }
//endregion

//region: Vm
fun Vm.toNavigationalWithStorageDomains(): TreeNavigational = TreeNavigational.builder {
	type { TreeNavigationalType.VM }
	id { this@toNavigationalWithStorageDomains.id() }
	name { this@toNavigationalWithStorageDomains.name() }
}
fun List<Vm>.fromVmsToTreeNavigationals(): List<TreeNavigational> =
	this@fromVmsToTreeNavigationals.map { it.toNavigationalWithStorageDomains() }
//endregion

//region: Template
fun Template.fromTemplateToTreeNavigational(): TreeNavigational = TreeNavigational.builder {
	type { TreeNavigationalType.TEMPLATE }
	id { this@fromTemplateToTreeNavigational.id() }
	name { this@fromTemplateToTreeNavigational.name() }
}

fun List<Template>.fromTemplateToTreeNavigationals(): List<TreeNavigational> =
	this@fromTemplateToTreeNavigationals.map { it.fromTemplateToTreeNavigational() }
//endregion

//region: Network
fun Network.toNavigationalWithStorageDomains(): TreeNavigational = TreeNavigational.builder {
	type { TreeNavigationalType.NETWORK }
	id { this@toNavigationalWithStorageDomains.id() }
	name { this@toNavigationalWithStorageDomains.name() }
}
fun List<Network>.fromNetworksToTreeNavigationals(): List<TreeNavigational> =
	this@fromNetworksToTreeNavigationals.map { it.toNavigationalWithStorageDomains() }
//endregion
