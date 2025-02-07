package com.itinfo.rutilvm.util.ovirt

import com.itinfo.rutilvm.util.ovirt.error.*

import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.services.OpenstackVolumeProviderService
import org.ovirt.engine.sdk4.services.OpenstackVolumeProvidersService
import org.ovirt.engine.sdk4.types.OpenStackVolumeProvider

private fun Connection.srvOpenStackVolumeProviders(): OpenstackVolumeProvidersService =
	this.systemService.openstackVolumeProvidersService()

fun Connection.findAllOpenStackVolumeProviders(): Result<List<OpenStackVolumeProvider>> = runCatching {
	this.srvOpenStackVolumeProviders().list().send().providers()
}.onSuccess {
	Term.OPEN_STACK_VOLUME_PROVIDER.logSuccess("목록조회")
}.onFailure {
	Term.OPEN_STACK_VOLUME_PROVIDER.logFail("목록조회", it)
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvOpenStackVolumeProvider(openStackVolumeProviderId: String): OpenstackVolumeProviderService =
	this.srvOpenStackVolumeProviders().providerService(openStackVolumeProviderId)

fun Connection.findOpenStackVolumeProvider(openStackVolumeProviderId: String): Result<OpenStackVolumeProvider?> = runCatching {
	this.srvOpenStackVolumeProvider(openStackVolumeProviderId).get().send().provider()
}.onSuccess {
	Term.OPEN_STACK_VOLUME_PROVIDER.logSuccess("상세조회")
}.onFailure {
	Term.OPEN_STACK_VOLUME_PROVIDER.logFail("상세조회", it)
	throw if (it is Error) it.toItCloudException() else it
}