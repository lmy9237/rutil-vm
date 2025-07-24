package com.itinfo.rutilvm.util.ovirt

// QOS 주석처리
/*private fun Connection.srvQossFromDataCenter(dataCenterId: String): QossService =
	this.srvDataCenter(dataCenterId).qossService()

fun Connection.findAllQossFromDataCenter(dataCenterId: String): Result<List<Qos>> = runCatching {
	this.srvQossFromDataCenter(dataCenterId).list().send().qoss()
}.onSuccess {
	Term.DATACENTER.logSuccessWithin(Term.QOS,"목록조회", dataCenterId)
}.onFailure {
	Term.DATACENTER.logFailWithin(Term.QOS,"목록조회", it, dataCenterId)
	throw if (it is Error) it.toItCloudException() else it
}*/

/*private fun Connection.srvQuotasFromDataCenter(dataCenterId: String): QuotasService =
	this.srvDataCenter(dataCenterId).quotasService()*/

/*fun Connection.findAllQuotasFromDataCenter(dataCenterId: String): Result<List<Quota>> = runCatching {
	this.srvQuotasFromDataCenter(dataCenterId).list().send().quotas()
}.onSuccess {
	Term.DATACENTER.logSuccessWithin(Term.QUOTA, "목록조회", dataCenterId)
}.onFailure {
	Term.DATACENTER.logFailWithin(Term.QUOTA, "목록조회", it, dataCenterId)
	throw if (it is Error) it.toItCloudException() else it
}*/

/*fun Connection.addQuotaFromDataCenter(dataCenterId: String, quota: Quota): Result<Quota?> = runCatching {
	this.srvQuotasFromDataCenter(dataCenterId).add().quota(quota).send().quota()
}.onSuccess {
	Term.DATACENTER.logSuccessWithin(Term.QUOTA,"생성", dataCenterId)
}.onFailure {
	Term.DATACENTER.logFailWithin(Term.QUOTA,"생성", it, dataCenterId)
	throw if (it is Error) it.toItCloudException() else it
}*/

/*private fun Connection.srvQuotaFromDataCenter(dataCenterId: String, quotaId: String): QuotaService =
	this.srvQuotasFromDataCenter(dataCenterId).quotaService(quotaId)*/

/*fun Connection.findQuotaFromDataCenter(dataCenterId: String, quotaId: String): Result<Quota?> = runCatching {
	this.srvQuotaFromDataCenter(dataCenterId, quotaId).get().send().quota()
}.onSuccess {
	Term.DATACENTER.logSuccessWithin(Term.QUOTA, "상세조회", dataCenterId)
}.onFailure {
	Term.DATACENTER.logFailWithin(Term.QUOTA, "상세조회", it, dataCenterId)
	throw if (it is Error) it.toItCloudException() else it
}*/

/*private fun Connection.srvQuotaClusterLimitsFromDataCenter(dataCenterId: String, quotaId: String): QuotaClusterLimitsService =
	this.srvQuotaFromDataCenter(dataCenterId, quotaId).quotaClusterLimitsService()*/

/*fun Connection.findAllQuotaClusterLimitsFromDataCenter(dataCenterId: String, quotaId: String): Result<List<QuotaClusterLimit>> = runCatching {
	this.srvQuotaClusterLimitsFromDataCenter(dataCenterId, quotaId).list().send().limits()
}.onSuccess {
	Term.DATACENTER.logSuccessWithin(Term.CLUSTER_QUOTA_LIMIT, "목록조회", dataCenterId)
}.onFailure {
	Term.DATACENTER.logFailWithin(Term.CLUSTER_QUOTA_LIMIT, "목록조회", it, dataCenterId)
	throw if (it is Error) it.toItCloudException() else it
}*/

/*private fun Connection.srvQuotaStorageLimitsFromDataCenter(dataCenterId: String, quotaId: String): QuotaStorageLimitsService =
	this.srvQuotaFromDataCenter(dataCenterId, quotaId).quotaStorageLimitsService()

fun Connection.findAllQuotaStorageLimitsFromDataCenter(dataCenterId: String, quotaId: String): List<QuotaStorageLimit> =
	this.srvQuotaStorageLimitsFromDataCenter(dataCenterId, quotaId).list().send().limits()

private fun Connection.srvPermissionsFromDataCenter(dataCenterId: String): AssignedPermissionsService =
	this.srvDataCenter(dataCenterId).permissionsService()
fun Connection.findAllPermissionsFromDataCenter(dataCenterId: String): Result<List<Permission>> = runCatching {
	checkDataCenter(dataCenterId)

	this.srvPermissionsFromDataCenter(dataCenterId).list().send().permissions() ?: emptyList()
}.onSuccess {
	Term.DATACENTER.logSuccessWithin(Term.PERMISSION, "목록조회", dataCenterId)
}.onFailure {
	Term.DATACENTER.logFailWithin(Term.PERMISSION, "목록조회", it, dataCenterId)
	throw if (it is Error) it.toItCloudException() else it
}
*/
