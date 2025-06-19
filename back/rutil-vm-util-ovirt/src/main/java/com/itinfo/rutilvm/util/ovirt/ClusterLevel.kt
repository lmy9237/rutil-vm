package com.itinfo.rutilvm.util.ovirt

import com.itinfo.rutilvm.api.ovirt.business.model.Term
import com.itinfo.rutilvm.api.ovirt.business.model.logSuccess
import com.itinfo.rutilvm.api.ovirt.business.model.logFail

import com.itinfo.rutilvm.util.ovirt.error.toItCloudException
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.services.ClusterLevelsService
import org.ovirt.engine.sdk4.services.ClusterLevelService
import org.ovirt.engine.sdk4.types.ClusterLevel

private fun Connection.srvClusterLevelsService(): ClusterLevelsService =
	systemService.clusterLevelsService()

fun Connection.findAllClusterLevels(): Result<List<ClusterLevel>> = runCatching {
	this.srvClusterLevelsService().list().send().levels()
}.onSuccess {
	Term.CLUSTER_LEVEL.logSuccess("목록조회")
}.onFailure {
	Term.CLUSTER_LEVEL.logFail("목록조회", it)
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvClusterLevelService(levelId: String): ClusterLevelService =
	systemService.clusterLevelsService().levelService(levelId)

fun Connection.findClusterLevel(levelId: String): Result<ClusterLevel?> = runCatching {
	this.srvClusterLevelService(levelId).get().send().level()
}.onSuccess {
	Term.CLUSTER_LEVEL.logSuccess("상세조회")
}.onFailure {
	Term.CLUSTER_LEVEL.logFail("상세조회", it)
	throw if (it is Error) it.toItCloudException() else it
}
