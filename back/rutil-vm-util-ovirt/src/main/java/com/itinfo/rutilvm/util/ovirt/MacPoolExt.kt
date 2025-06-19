package com.itinfo.rutilvm.util.ovirt

import com.itinfo.rutilvm.api.ovirt.business.model.Term
import com.itinfo.rutilvm.api.ovirt.business.model.logSuccess
import com.itinfo.rutilvm.api.ovirt.business.model.logFail

import com.itinfo.rutilvm.util.ovirt.error.*

import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.services.MacPoolsService
import org.ovirt.engine.sdk4.types.MacPool

private fun Connection.srvMacPools(): MacPoolsService =
	systemService.macPoolsService()

fun Connection.findAllMacPools(): Result<List<MacPool>> = runCatching {
	this.srvMacPools().list().send().pools()
}.onSuccess {
	Term.MAC_POOL.logSuccess("목록조회")
}.onFailure {
	Term.MAC_POOL.logFail("목록조회")
	throw if (it is Error) it.toItCloudException() else it
}
