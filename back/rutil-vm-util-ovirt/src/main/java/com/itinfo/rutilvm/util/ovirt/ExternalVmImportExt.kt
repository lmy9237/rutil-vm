package com.itinfo.rutilvm.util.ovirt

import com.itinfo.rutilvm.api.ovirt.business.model.Term
import com.itinfo.rutilvm.api.ovirt.business.model.logSuccess
import com.itinfo.rutilvm.api.ovirt.business.model.logFail

import com.itinfo.rutilvm.util.ovirt.error.*

import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.services.ExternalVmImportsService
import org.ovirt.engine.sdk4.types.ExternalVmImport

private fun Connection.srvExternalVmImports(): ExternalVmImportsService =
	systemService.externalVmImportsService()

fun Connection.addExternalVmImport(externalVmImport: ExternalVmImport): Result<ExternalVmImport?> = runCatching {
	val addExternalVm = srvExternalVmImports().add().import_(externalVmImport).send()

	addExternalVm.import_()
}.onSuccess {
	Term.EXTERNAL_VM.logSuccess("생성", it.name())
}.onFailure {
	Term.EXTERNAL_VM.logFail("생성", it)
	throw if (it is Error) it.toItCloudException() else it
}
