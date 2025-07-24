package com.itinfo.rutilvm.util.ovirt

import com.itinfo.rutilvm.api.ovirt.business.model.Term
import com.itinfo.rutilvm.api.ovirt.business.model.logSuccess
import com.itinfo.rutilvm.api.ovirt.business.model.logSuccessWithin
import com.itinfo.rutilvm.api.ovirt.business.model.logFail
import com.itinfo.rutilvm.api.ovirt.business.model.logFailWithin

import com.itinfo.rutilvm.util.ovirt.error.*

import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.builders.Builders
import org.ovirt.engine.sdk4.services.*
import org.ovirt.engine.sdk4.types.*


private fun Connection.srvNetworks(): NetworksService =
	this.systemService.networksService()

fun Connection.findAllNetworks(searchQuery: String = "", follow: String = ""): Result<List<Network>> = runCatching {
	this.srvNetworks().list().apply {
		if(searchQuery.isNotEmpty()) search(searchQuery)
		if (follow.isNotEmpty()) follow(follow)
	}.send().networks()

}.onSuccess {
	Term.NETWORK.logSuccess("목록조회")
}.onFailure {
	Term.NETWORK.logFail("목록조회", it)
	throw if (it is Error) it.toItCloudException(Term.NETWORK, "목록조회") else it
}

fun Connection.srvNetwork(networkId: String?=""): NetworkService =
	this.srvNetworks().networkService(networkId)

fun Connection.findNetwork(networkId: String?="", follow: String?=""): Result<Network?> = runCatching {
	this.srvNetwork(networkId).get().apply {
		if (follow?.isEmpty() == false) follow(follow)
	}.send().network()

}.onSuccess {
	Term.NETWORK.logSuccess("상세조회", networkId)
}.onFailure {
	Term.NETWORK.logFail("상세조회", it, networkId)
	throw if (it is Error) it.toItCloudException(Term.NETWORK, "상세조회", networkId) else it
}

fun Connection.addNetwork(network: Network): Result<Network?> = runCatching {
	val networkAdded: Network? =
		this.srvNetworks().add().network(network).send().network()

	networkAdded ?: throw ErrorPattern.NETWORK_NOT_FOUND.toError()
}.onSuccess {
	Term.NETWORK.logSuccess("생성")
}.onFailure {
	Term.NETWORK.logFail("생성", it)
	throw if (it is Error) it.toItCloudException(Term.NETWORK, "생성") else it
}

fun Connection.updateNetwork(network: Network): Result<Network?> = runCatching {
	val networkUpdated: Network? =
		this.srvNetwork(network.id()).update().network(network).async(true).send().network()

	networkUpdated ?: throw ErrorPattern.NETWORK_NOT_FOUND.toError()
}.onSuccess {
	Term.NETWORK.logSuccess("편집", it.id())
}.onFailure {
	Term.NETWORK.logFail("편집", it)
	throw if (it is Error) it.toItCloudException(Term.NETWORK, "편집", network.id()) else it
}

fun Connection.removeNetwork(networkId: String): Result<Boolean> = runCatching {
	checkNetworkExists(networkId)
	this.srvNetwork(networkId).remove().send()
	true

}.onSuccess {
	Term.NETWORK.logSuccess("삭제", networkId)
}.onFailure {
	Term.NETWORK.logFail("삭제", it, networkId)
	throw if (it is Error) it.toItCloudException(Term.NETWORK, "삭제", networkId) else it
}

fun Connection.srvVnicProfilesFromNetwork(networkId: String): AssignedVnicProfilesService =
	this.srvNetwork(networkId).vnicProfilesService()

fun Connection.findAllVnicProfilesFromNetwork(networkId: String, follow: String = ""): Result<List<VnicProfile>> = runCatching {
	checkNetworkExists(networkId)

	this.srvVnicProfilesFromNetwork(networkId).list().apply {
		if (follow.isNotEmpty()) follow(follow)
	}.send().profiles()

}.onSuccess {
	Term.NETWORK.logSuccessWithin(Term.VNIC_PROFILE, "목록조회", networkId)
}.onFailure {
	Term.NETWORK.logFailWithin(Term.VNIC_PROFILE, "목록조회", it, networkId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.NETWORK, Term.VNIC_PROFILE,"목록조회", networkId) else it
}

fun Connection.srvVnicProfileFromNetwork(networkId: String, vnicProfileId: String): AssignedVnicProfileService =
	this.srvVnicProfilesFromNetwork(networkId).profileService(vnicProfileId)

fun Connection.findVnicProfileFromNetwork(networkId: String, vnicProfileId: String): Result<VnicProfile?> = runCatching {
	checkNetworkExists(networkId)

	this.srvVnicProfileFromNetwork(networkId, vnicProfileId).get().send().profile()
}.onSuccess {
	Term.NETWORK.logSuccessWithin(Term.VNIC_PROFILE, "상세조회", networkId)
}.onFailure {
	Term.NETWORK.logFailWithin(Term.VNIC_PROFILE, "상세조회", it, networkId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.NETWORK, Term.VNIC_PROFILE, "상세조회", networkId) else it
}


private fun Connection.srvNetworkLabelsFromNetwork(networkId: String): NetworkLabelsService =
	this.srvNetwork(networkId).networkLabelsService()

fun Connection.findAllNetworkLabelsFromNetwork(networkId: String): Result<List<NetworkLabel>> = runCatching {
	this.srvNetworkLabelsFromNetwork(networkId).list().send().labels()

}.onSuccess {
	Term.NETWORK.logSuccessWithin(Term.NETWORK_LABEL, "목록조회", networkId)
}.onFailure {
	Term.NETWORK.logFailWithin(Term.NETWORK_LABEL, "상세조회", it, networkId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.NETWORK, Term.NETWORK_LABEL, "상세조회", networkId) else it
}

fun Connection.addNetworkLabelFromNetwork(networkId: String, networkLabel: NetworkLabel): Result<NetworkLabel> = runCatching {
	this.srvNetworkLabelsFromNetwork(networkId).add().label(networkLabel).send().label()

}.onSuccess {
	Term.NETWORK.logSuccessWithin(Term.NETWORK_LABEL, "생성", networkLabel.name())
	// log.info("{} 내 {} 생성 완료 ... {}", Term.NETWORK, Term.NETWORK_LABEL, networkLabel.name())
} .onFailure {
	Term.NETWORK.logFailWithin(Term.NETWORK_LABEL, "생성", it, networkLabel.name())
	// log.error("{} 내 {} 생성 실패... {}", Term.NETWORK, Term.NETWORK_LABEL, it.localizedMessage)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.NETWORK, Term.NETWORK_LABEL, "생성", networkId) else it
}

private fun Connection.srvNetworkLabelFromNetwork(networkId: String, networkLabelId: String): NetworkLabelService =
	this.srvNetworkLabelsFromNetwork(networkId).labelService(networkLabelId)

fun Connection.removeNetworkLabelFromNetwork(networkId: String, networkLabelId: String): Result<Boolean> = runCatching {
	this.srvNetworkLabelFromNetwork(networkId, networkLabelId).remove().send()
	true

}.onSuccess {
	Term.NETWORK.logSuccessWithin(Term.NETWORK_LABEL, "삭제", networkId)
}.onFailure {
	Term.NETWORK.logFailWithin(Term.NETWORK_LABEL, "삭제", it, networkId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.NETWORK, Term.NETWORK_LABEL, "삭제", networkId, networkLabelId) else it
}

// private fun Connection.srvPermissionsFromNetwork(networkId: String): AssignedPermissionsService =
// 	this.srvNetwork(networkId).permissionsService()
//
// fun Connection.findAllPermissionsFromNetwork(networkId: String, follow: String = ""): Result<List<Permission>> = runCatching {
// 	checkNetworkExists(networkId)
//
// 	this.srvPermissionsFromNetwork(networkId).list().apply {
// 		if (follow.isNotEmpty()) follow(follow)
// 	}.send().permissions()
//
// }.onSuccess {
// 	Term.NETWORK.logSuccessWithin(Term.PERMISSION, "목록조회", networkId)
// }.onFailure {
// 	Term.NETWORK.logFailWithin(Term.PERMISSION, "목록조회", it, networkId)
// 	throw if (it is Error) it.toItCloudException() else it
// }
