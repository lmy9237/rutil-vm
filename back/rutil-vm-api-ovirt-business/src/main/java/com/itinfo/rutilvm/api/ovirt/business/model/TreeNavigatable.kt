package com.itinfo.rutilvm.api.ovirt.business.model

import java.io.Serializable

interface TreeNavigatable<T: Any> {
	val type: TreeNavigatableType
	val id: String?
	val name: String?
	val status: T?
}

enum class TreeNavigatableType(
	val term: Term,
): Serializable {
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
