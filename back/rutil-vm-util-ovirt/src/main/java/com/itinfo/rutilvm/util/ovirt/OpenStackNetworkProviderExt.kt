package com.itinfo.rutilvm.util.ovirt

import com.itinfo.rutilvm.util.ovirt.error.*

import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.builders.DataCenterBuilder
import org.ovirt.engine.sdk4.services.OpenstackNetworkProviderService
import org.ovirt.engine.sdk4.services.OpenstackNetworkProvidersService
import org.ovirt.engine.sdk4.services.OpenstackNetworkService
import org.ovirt.engine.sdk4.types.OpenStackNetwork
import org.ovirt.engine.sdk4.types.OpenStackNetworkProvider

/**
 * 외부 공급자는 한개만 있어서 이것만 쓸수 있음
 */
private fun Connection.srvOpenStackNetworkProviders(): OpenstackNetworkProvidersService =
	systemService.openstackNetworkProvidersService()

fun Connection.findAllOpenStackNetworkProviders(follow: String = ""): Result<List<OpenStackNetworkProvider>> = runCatching {
	if (follow.isNotEmpty())
		this.srvOpenStackNetworkProviders().list().follow(follow).send().providers()
	else
		this.srvOpenStackNetworkProviders().list().send().providers()
}.onSuccess {
	Term.OPEN_STACK_NETWORK_PROVIDER.logSuccess("목록조회")
}.onFailure {
	Term.OPEN_STACK_NETWORK_PROVIDER.logFail("목록조회", it)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.srvOpenStackNetworkProvider(networkProviderId: String): OpenstackNetworkProviderService =
	this.srvOpenStackNetworkProviders().providerService(networkProviderId)


fun Connection.findOpenStackNetworkProviderFirst(): Result<OpenStackNetworkProvider> = runCatching {
	this.srvOpenStackNetworkProviders().list().send().providers().first()
}.onSuccess {
	Term.OPEN_STACK_NETWORK_PROVIDER.logSuccess("상세조회")
}.onFailure {
	Term.OPEN_STACK_NETWORK_PROVIDER.logFail("상세조회", it)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.findOpenStackProviderFirstId(): String =
	systemService.openstackNetworkProvidersService().list().send().providers().first().id()


fun Connection.srvOpenStackNetwork(openstackNetworkId: String): OpenstackNetworkService =
	systemService.openstackNetworkProvidersService().providerService(this.findOpenStackProviderFirstId()).networksService().networkService(openstackNetworkId)


fun Connection.importOpenStackNetwork(openstackNetworkId: String, dataCenterId: String): Result<Boolean> = runCatching {
	this.srvOpenStackNetwork(openstackNetworkId).import_().dataCenter(DataCenterBuilder().id(dataCenterId).build()).send()

	true
}.onSuccess {
	Term.OPEN_STACK_NETWORK_PROVIDER.logSuccess("가져오기")
}.onFailure {
	Term.OPEN_STACK_NETWORK_PROVIDER.logFail("가져오기", it)
	throw if (it is Error) it.toItCloudException() else it
}


fun Connection.findOpenStackNetworkProvider(networkProviderId: String): Result<OpenStackNetworkProvider> = runCatching {
	this.srvOpenStackNetworkProvider(networkProviderId).get().send().provider()
}.onSuccess {
	Term.OPEN_STACK_NETWORK_PROVIDER.logSuccess("상세조회")
}.onFailure {
	Term.OPEN_STACK_NETWORK_PROVIDER.logFail("상세조회", it)
	throw if (it is Error) it.toItCloudException() else it
}


fun Connection.findAllOpenStackNetworksFromNetworkProvider(networkProviderId: String): Result<List<OpenStackNetwork>> = runCatching {
	if(this.findOpenStackNetworkProvider(networkProviderId).isFailure){
		throw ErrorPattern.NETWORK_NOT_FOUND.toError()
	}
	this.srvOpenStackNetworkProvider(networkProviderId).networksService().list().send().networks()
}.onSuccess {
	Term.OPEN_STACK_NETWORK_PROVIDER.logSuccess("목록")
}.onFailure {
	Term.OPEN_STACK_NETWORK_PROVIDER.logFail("목록", it)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.findOpenStackNetworkFromNetworkProvider(networkProviderId: String, openstackNetworkId: String): Result<OpenStackNetwork> = runCatching {
	if(this.findOpenStackNetworkProvider(networkProviderId).isFailure){
		throw ErrorPattern.NETWORK_NOT_FOUND.toError()
	}
	this.srvOpenStackNetworkProvider(networkProviderId).networksService().networkService(openstackNetworkId).get().send().network()
}.onSuccess {
	Term.OPEN_STACK_NETWORK_PROVIDER.logSuccess("목록")
}.onFailure {
	Term.OPEN_STACK_NETWORK_PROVIDER.logFail("목록", it)
	throw if (it is Error) it.toItCloudException() else it
}