package com.itinfo.rutilvm.util.ovirt

import com.itinfo.rutilvm.util.ovirt.error.*

import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.services.ExternalHostProviderService
import org.ovirt.engine.sdk4.services.ExternalHostProvidersService
import org.ovirt.engine.sdk4.types.ExternalHostProvider

private fun Connection.srvExternalHostProviders(): ExternalHostProvidersService =
	systemService.externalHostProvidersService()

fun Connection.findAllExternalHostProviders(): Result<List<ExternalHostProvider>> = runCatching {
	this.srvExternalHostProviders().list().send().providers()
}.onSuccess {
	Term.EXTERNAL_HOST_PROVIDER.logSuccess("목록조회")
}.onFailure {
	Term.EXTERNAL_HOST_PROVIDER.logFail("목록조회")
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvExternalHostProvider(externalHostProviderId: String): ExternalHostProviderService =
	this.srvExternalHostProviders().providerService(externalHostProviderId)

fun Connection.findExternalHostProvider(externalHostProviderId: String): Result<ExternalHostProvider?> = runCatching {
	this.srvExternalHostProvider(externalHostProviderId).get().send().provider()
}.onSuccess {
	Term.EXTERNAL_HOST_PROVIDER.logSuccess("상세조회")
}.onFailure {
	Term.EXTERNAL_HOST_PROVIDER.logFail("상세조회")
	throw if (it is Error) it.toItCloudException() else it
}
