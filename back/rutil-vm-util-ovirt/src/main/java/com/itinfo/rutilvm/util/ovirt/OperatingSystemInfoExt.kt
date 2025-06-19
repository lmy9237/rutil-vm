package com.itinfo.rutilvm.util.ovirt

import com.itinfo.rutilvm.api.ovirt.business.model.Term
import com.itinfo.rutilvm.api.ovirt.business.model.logSuccess
import com.itinfo.rutilvm.api.ovirt.business.model.logFail

import com.itinfo.rutilvm.util.ovirt.error.*

import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.services.OperatingSystemsService
import org.ovirt.engine.sdk4.types.OperatingSystemInfo

private fun Connection.srvOperatingSystems(): OperatingSystemsService =
	systemService.operatingSystemsService()

fun Connection.findAllOperatingSystems(): Result<List<OperatingSystemInfo>> = runCatching {
	this.srvOperatingSystems().list().send().operatingSystem()
}.onSuccess {
	Term.OPERATING_SYSTEM.logSuccess("목록조회")
}.onFailure {
	Term.OPERATING_SYSTEM.logFail("목록조회", it)
	throw if (it is Error) it.toItCloudException() else it
}
