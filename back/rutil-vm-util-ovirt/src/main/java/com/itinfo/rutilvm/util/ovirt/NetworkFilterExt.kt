package com.itinfo.rutilvm.util.ovirt

import com.itinfo.rutilvm.api.ovirt.business.model.Term
import com.itinfo.rutilvm.api.ovirt.business.model.logSuccess
import com.itinfo.rutilvm.api.ovirt.business.model.logSuccessWithin
import com.itinfo.rutilvm.api.ovirt.business.model.logFail
import com.itinfo.rutilvm.api.ovirt.business.model.logFailWithin


import com.itinfo.rutilvm.util.ovirt.error.*

import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.services.NetworkFilterService
import org.ovirt.engine.sdk4.services.NetworkFiltersService
import org.ovirt.engine.sdk4.types.NetworkFilter

private fun Connection.srvNetworkFilters(): NetworkFiltersService =
	this.systemService.networkFiltersService()

fun Connection.findAllNetworkFilters(follow: String = ""): Result<List<NetworkFilter>> = runCatching {
	this.srvNetworkFilters().list().apply {
		if (follow.isNotEmpty()) follow(follow)
	}.send().filters()

	// if (follow.isNotEmpty())
	// 	this.srvNetworkFilters().list().follow(follow).send().filters()
	// else
	// 	this.srvNetworkFilters().list().send().filters()
}.onSuccess {
	Term.NETWORK_FILTER.logSuccess("목록조회")
}.onFailure {
	Term.NETWORK_FILTER.logFail("목록조회", it)
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvNetworkFilter(networkFilterId: String): NetworkFilterService =
	this.srvNetworkFilters().networkFilterService(networkFilterId)

fun Connection.findNetworkFilter(networkFilterId: String): Result<NetworkFilter?> = runCatching {
	this.srvNetworkFilter(networkFilterId).get().send().networkFilter()
}.onSuccess {
	Term.NETWORK_FILTER.logSuccess("상세조회", networkFilterId)
}.onFailure {
	Term.NETWORK_FILTER.logFail("상세조회", it, networkFilterId)
	throw if (it is Error) it.toItCloudException() else it
}
