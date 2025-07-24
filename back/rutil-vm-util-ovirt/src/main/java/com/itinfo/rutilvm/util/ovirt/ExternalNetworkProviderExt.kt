package com.itinfo.rutilvm.util.ovirt

import com.itinfo.rutilvm.api.ovirt.business.model.Term
import com.itinfo.rutilvm.api.ovirt.business.model.logFail
import com.itinfo.rutilvm.api.ovirt.business.model.logSuccess
import com.itinfo.rutilvm.util.ovirt.error.toItCloudException
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.services.ClusterExternalProvidersService
import org.ovirt.engine.sdk4.types.ExternalProvider

private fun Connection.srvExternalNetworkProviders(clusterId: String): ClusterExternalProvidersService =
	this.srvCluster(clusterId).externalNetworkProvidersService()

fun Connection.findAllExternalNetworkProviders(clusterId: String): Result<List<ExternalProvider>> = runCatching {
	srvExternalNetworkProviders(clusterId).list().send().providers()

}.onSuccess {
	Term.EXTERNAL_NETWORK_PROVIDER.logSuccess("목록조회")
}.onFailure {
	Term.EXTERNAL_NETWORK_PROVIDER.logFail("목록조회", it)
	throw if (it is Error) it.toItCloudException(Term.EXTERNAL_NETWORK_PROVIDER, "목록조회") else it
}
