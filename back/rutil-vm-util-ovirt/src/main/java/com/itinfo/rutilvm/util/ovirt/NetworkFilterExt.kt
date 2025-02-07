package com.itinfo.rutilvm.util.ovirt

import com.itinfo.rutilvm.util.ovirt.error.*

import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.services.NetworkFilterService
import org.ovirt.engine.sdk4.services.NetworkFiltersService
import org.ovirt.engine.sdk4.types.NetworkFilter

private fun Connection.srvNetworkFilters(): NetworkFiltersService =
	this.systemService.networkFiltersService()

fun Connection.findAllNetworkFilters(follow: String = ""): Result<List<NetworkFilter>> = runCatching {
	if (follow.isNotEmpty())
		this@findAllNetworkFilters.srvNetworkFilters().list().follow(follow).send().filters()
	else
		this@findAllNetworkFilters.srvNetworkFilters().list().send().filters()
}.onSuccess {
	Term.NETWORK_FILTER.logSuccess("목록조회")
}.onFailure {
	Term.NETWORK_FILTER.logFail("목록조회", it)
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvNetworkFilter(networkFilterId: String): NetworkFilterService =
	this@srvNetworkFilter.srvNetworkFilters().networkFilterService(networkFilterId)

fun Connection.findNetworkFilter(networkFilterId: String): Result<NetworkFilter?> = runCatching {
	this@findNetworkFilter.srvNetworkFilter(networkFilterId).get().send().networkFilter()
}.onSuccess {
	Term.NETWORK_FILTER.logSuccess("상세조회", networkFilterId)
}.onFailure {
	Term.NETWORK_FILTER.logFail("상세조회", it, networkFilterId)
	throw if (it is Error) it.toItCloudException() else it
}