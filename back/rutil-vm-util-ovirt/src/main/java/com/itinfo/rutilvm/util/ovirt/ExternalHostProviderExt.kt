package com.itinfo.rutilvm.util.ovirt

import com.itinfo.rutilvm.api.ovirt.business.model.Term
import com.itinfo.rutilvm.api.ovirt.business.model.logSuccess
import com.itinfo.rutilvm.api.ovirt.business.model.logFail

import com.itinfo.rutilvm.util.ovirt.error.*

import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.services.ExternalHostProviderService
import org.ovirt.engine.sdk4.services.ExternalHostProvidersService
import org.ovirt.engine.sdk4.types.ExternalHostProvider
import org.ovirt.engine.sdk4.types.ExternalProvider

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

fun Connection.addExternalHostProvider(externalHostProvider: ExternalHostProvider): Result<ExternalHostProvider?> = runCatching {
	val externalAdd = this.srvExternalHostProviders().add().provider(externalHostProvider).send().provider()

	externalAdd ?: throw ErrorPattern.EXTERNAL_HOST_PROVIDER_NOT_FOUND.toError()
}.onSuccess {
	Term.EXTERNAL_HOST_PROVIDER.logSuccess("생성", it.id())
}.onFailure {
	Term.EXTERNAL_HOST_PROVIDER.logFail("생성", it)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.testConnectivityExternalHostProvider(externalHostProviderId: String): Result<Boolean> = runCatching {
	this.srvExternalHostProvider(externalHostProviderId).testConnectivity().send().toString()
	log.info("host test {}", this.srvExternalHostProvider(externalHostProviderId).testConnectivity().send().toString())
	true
}.onSuccess {
	Term.EXTERNAL_HOST_PROVIDER.logSuccess("상세조회")
}.onFailure {
	Term.EXTERNAL_HOST_PROVIDER.logFail("상세조회")
	throw if (it is Error) it.toItCloudException() else it
}


fun Connection.findAllExternalHostProvider(): Result<List<ExternalProvider>> = runCatching {
	this.srvExternalHostProviders().list().send().providers()
}.onSuccess {
	Term.EXTERNAL_HOST_PROVIDER.logSuccess("목록조회")
}.onFailure {
	Term.EXTERNAL_HOST_PROVIDER.logFail("목록조회")
	throw if (it is Error) it.toItCloudException() else it
}

