package com.itinfo.rutilvm.util.ovirt

import com.itinfo.rutilvm.api.ovirt.business.model.Term
import com.itinfo.rutilvm.api.ovirt.business.model.logSuccess
import com.itinfo.rutilvm.api.ovirt.business.model.logSuccessWithin
import com.itinfo.rutilvm.api.ovirt.business.model.logFail
import com.itinfo.rutilvm.api.ovirt.business.model.logFailWithin

import com.itinfo.rutilvm.util.ovirt.error.*

import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.builders.StorageDomainBuilder
import org.ovirt.engine.sdk4.services.*
import org.ovirt.engine.sdk4.types.*

fun Connection.srvDataCenters(): DataCentersService =
	this.systemService.dataCentersService()

fun Connection.findAllDataCenters(searchQuery: String = "", follow: String = ""): Result<List<DataCenter>> = runCatching {
	this.srvDataCenters().list().apply {
		if (searchQuery.isNotEmpty()) search(searchQuery)
		if (follow.isNotEmpty()) follow(follow)
	}.send().dataCenters()

}.onSuccess {
	Term.DATACENTER.logSuccess("목록조회")
}.onFailure {
	Term.DATACENTER.logFail("목록조회", it)
	throw if (it is Error) it.toItCloudException(Term.DATACENTER, "목록조회") else it
}

fun Connection.srvDataCenter(dataCenterId: String): DataCenterService =
	this.srvDataCenters().dataCenterService(dataCenterId)

fun Connection.findDataCenter(datacenterId: String, follow: String = ""): Result<DataCenter?> = runCatching {
	this.srvDataCenter(datacenterId).get().apply {
		if(follow.isNotEmpty()) follow(follow)
	}.send().dataCenter()

}.onSuccess {
	Term.DATACENTER.logSuccess("상세조회")
}.onFailure {
	Term.DATACENTER.logFail("상세조회", it)
	throw if (it is Error) it.toItCloudException(Term.DATACENTER, "상세조회", datacenterId) else it
}

fun Connection.addDataCenter(datacenter: DataCenter): Result<DataCenter?> = runCatching {
	if (this.findAllDataCenters().getOrDefault(emptyList())
			.nameDuplicateDataCenter(datacenter.name())) {
		throw ErrorPattern.DATACENTER_DUPLICATE.toError()
	}
	val dataCenterAdded: DataCenter? =
		this.srvDataCenters().add().dataCenter(datacenter).send().dataCenter()

	dataCenterAdded ?: throw ErrorPattern.DATACENTER_NOT_FOUND.toError()
}.onSuccess {
	Term.DATACENTER.logSuccess("생성")
}.onFailure {
	Term.DATACENTER.logFail("생성", it)
	throw if (it is Error) it.toItCloudException(Term.DATACENTER, "생성") else it
}

fun Connection.updateDataCenter(datacenter: DataCenter): Result<DataCenter?> = runCatching {
	if (this.findAllDataCenters().getOrDefault(emptyList())
			.nameDuplicateDataCenter(datacenter.name(), datacenter.id())) {
		throw ErrorPattern.DATACENTER_DUPLICATE.toError()
	}
    val dataCenterUpdated: DataCenter? =
		this.srvDataCenter(datacenter.id()).update().dataCenter(datacenter).send().dataCenter()

	dataCenterUpdated ?: throw ErrorPattern.DATACENTER_NOT_FOUND.toError()
}.onSuccess {
	Term.DATACENTER.logSuccess("편집")
}.onFailure {
	Term.DATACENTER.logFail("편집", it)
	throw if (it is Error) it.toItCloudException(Term.DATACENTER, "편집", datacenter.id()) else it
}

fun Connection.removeDataCenter(datacenterId: String): Result<Boolean> = runCatching {
	val dataCenter = checkDataCenter(datacenterId)
	this.srvDataCenter(dataCenter.id()).remove().force(true).send()
	// this.expectDataCenterDeleted(dataCenterId)
	true
}.onSuccess {
	Term.DATACENTER.logSuccess("삭제")
}.onFailure {
	Term.DATACENTER.logFail("삭제", it)
	throw if (it is Error) it.toItCloudException(Term.DATACENTER, "삭제", datacenterId) else it
}


fun Connection.srvClustersFromDataCenter(datacenterId: String): ClustersService =
	this.srvDataCenter(datacenterId).clustersService()

fun Connection.findAllClustersFromDataCenter(dataCenterId: String, follow: String = ""): Result<List<Cluster>> = runCatching {
	this.srvClustersFromDataCenter(dataCenterId).list().apply {
		if(follow.isNotEmpty()) follow(follow)
	}.send().clusters()

}.onSuccess {
	Term.DATACENTER.logSuccessWithin(Term.CLUSTER,"목록조회", dataCenterId)
}.onFailure {
	Term.DATACENTER.logFailWithin(Term.CLUSTER,"목록조회", it, dataCenterId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.DATACENTER, Term.CLUSTER, "목록조회", dataCenterId) else it
}

fun Connection.findAllHostsFromDataCenter(datacenterId: String): Result<List<Host>> = runCatching {
	this.findAllHosts(follow = "cluster").getOrDefault(emptyList())
		.filter { it.clusterPresent() && it.cluster().dataCenter().id() == datacenterId }

}.onSuccess {
	Term.DATACENTER.logSuccessWithin(Term.HOST,"목록조회", datacenterId)
}.onFailure {
	Term.DATACENTER.logFailWithin(Term.HOST,"목록조회", it, datacenterId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.DATACENTER, Term.HOST, "목록조회", datacenterId) else it
}

fun Connection.findAllVmsFromDataCenter(datacenterId: String): Result<List<Vm>> = runCatching {
	this.findAllVms(follow = "cluster.datacenter,reporteddevices").getOrDefault(emptyList())
		.filter { it.cluster().dataCenter().id() == datacenterId }

}.onSuccess {
	Term.DATACENTER.logSuccessWithin(Term.VM,"목록조회", datacenterId)
}.onFailure {
	Term.DATACENTER.logFailWithin(Term.VM,"목록조회", it, datacenterId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.DATACENTER, Term.VM, "목록조회", datacenterId) else it
}

fun Connection.srvNetworksFromFromDataCenter(dataCenterId: String): DataCenterNetworksService =
	this.srvDataCenter(dataCenterId).networksService()

fun Connection.findAllNetworksFromDataCenter(datacenterId: String): Result<List<Network>> = runCatching {
	this.srvNetworksFromFromDataCenter(datacenterId).list().send().networks()

}.onSuccess {
	Term.DATACENTER.logSuccessWithin(Term.NETWORK,"목록조회", datacenterId)
}.onFailure {
	Term.DATACENTER.logFailWithin(Term.NETWORK,"목록조회", it, datacenterId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.DATACENTER, Term.NETWORK, "목록조회", datacenterId) else it
}


fun Connection.srvAllAttachedStorageDomainsFromDataCenter(dataCenterId: String): AttachedStorageDomainsService =
	this.srvDataCenter(dataCenterId).storageDomainsService()

fun Connection.findAllAttachedStorageDomainsFromDataCenter(datacenterId: String, follow: String = ""): Result<List<StorageDomain>> = runCatching {
	this.srvAllAttachedStorageDomainsFromDataCenter(datacenterId).list().apply {
		if (follow.isNotEmpty()) follow(follow)
	}.send().storageDomains()

}.onSuccess {
	Term.DATACENTER.logSuccessWithin(Term.STORAGE_DOMAIN,"목록조회", datacenterId)
}.onFailure {
	Term.DATACENTER.logFailWithin(Term.STORAGE_DOMAIN,"목록조회", it, datacenterId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.DATACENTER, Term.STORAGE_DOMAIN, "목록조회", datacenterId) else it
}

fun Connection.srvAttachedStorageDomainFromDataCenter(dataCenterId: String, storageDomainId: String): AttachedStorageDomainService =
	this.srvAllAttachedStorageDomainsFromDataCenter(dataCenterId).storageDomainService(storageDomainId)

fun Connection.findAttachedStorageDomainFromDataCenter(datacenterId: String, storagedomainId: String): Result<StorageDomain?> = runCatching {
	srvAttachedStorageDomainFromDataCenter(datacenterId, storagedomainId).get().send().storageDomain()

}.onSuccess {
	Term.DATACENTER.logSuccessWithin(Term.STORAGE_DOMAIN,"상세조회", datacenterId)
}.onFailure {
	Term.DATACENTER.logFailWithin(Term.STORAGE_DOMAIN,"상세조회", it, datacenterId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.DATACENTER, Term.STORAGE_DOMAIN, "상세조회", datacenterId, storagedomainId) else it
}


fun Connection.attachStorageDomainToDataCenter(datacenterId: String, storagedomainId: String): Result<Boolean> = runCatching {
	this.srvAllAttachedStorageDomainsFromDataCenter(datacenterId)
		.add().storageDomain(StorageDomainBuilder().id(storagedomainId).build()).send()

	true
}.onSuccess {
	Term.DATACENTER.logSuccessWithin(Term.STORAGE_DOMAIN,"연결", storagedomainId)
}.onFailure {
	Term.DATACENTER.logSuccessWithin(Term.STORAGE_DOMAIN,"연결", storagedomainId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.DATACENTER, Term.STORAGE_DOMAIN, "연결", datacenterId, storagedomainId) else it
}

fun Connection.detachStorageDomainToDataCenter(datacenterId: String, storagedomainId: String): Result<Boolean> = runCatching {
	this.srvAttachedStorageDomainFromDataCenter(datacenterId, storagedomainId).remove().send()
	this.srvDataCenter(datacenterId).cleanFinishedTasks().send()
	true
}.onSuccess {
	Term.DATACENTER.logSuccessWithin(Term.STORAGE_DOMAIN,"분리", storagedomainId)
}.onFailure {
	Term.DATACENTER.logSuccessWithin(Term.STORAGE_DOMAIN,"분리", storagedomainId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.DATACENTER, Term.STORAGE_DOMAIN, "분리", datacenterId, storagedomainId) else it
}

fun Connection.activateStorageDomainToDataCenter(datacenterId: String, storagedomainId: String): Result<Boolean> = runCatching {
	val storageDomain: StorageDomain = this.findAttachedStorageDomainFromDataCenter(datacenterId, storagedomainId)
		.getOrNull() ?: throw ErrorPattern.STORAGE_DOMAIN_NOT_FOUND.toError()

	if(storageDomain.status() == StorageDomainStatus.ACTIVE){
		throw ErrorPattern.STORAGE_DOMAIN_ACTIVE.toError()
	}
	// 활성화
	this.srvAttachedStorageDomainFromDataCenter(datacenterId, storagedomainId).activate().send()
	true

}.onSuccess {
	Term.DATACENTER.logSuccessWithin(Term.STORAGE_DOMAIN,"활성화", datacenterId)
}.onFailure {
	Term.DATACENTER.logFailWithin(Term.STORAGE_DOMAIN,"활성화", it, datacenterId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.DATACENTER, Term.STORAGE_DOMAIN, "활성화", datacenterId, storagedomainId) else it
}

fun Connection.deactivateStorageDomainToDataCenter(datacenterId: String, storagedomainId: String, ovf: Boolean): Result<Boolean> = runCatching {
	val storageDomain: StorageDomain = this.findAttachedStorageDomainFromDataCenter(datacenterId, storagedomainId)
		.getOrNull() ?: throw ErrorPattern.STORAGE_DOMAIN_NOT_FOUND.toError()

	if(storageDomain.status() == StorageDomainStatus.MAINTENANCE){
		throw ErrorPattern.STORAGE_DOMAIN_MAINTENANCE.toError()
	}

	// force == ovf 업데이트 여부
	this.srvAttachedStorageDomainFromDataCenter(datacenterId, storagedomainId).deactivate().force(ovf).send()
	log.info("cleanFinishedTasks~ ")
	this.srvDataCenter(datacenterId).cleanFinishedTasks().send()
	log.info("cleanFinishedTasks~ fin ")

	true
}.onSuccess {
	Term.DATACENTER.logSuccessWithin(Term.STORAGE_DOMAIN,"유지보수", datacenterId)
}.onFailure {
	Term.DATACENTER.logFailWithin(Term.STORAGE_DOMAIN,"유지보수", it, datacenterId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.DATACENTER, Term.STORAGE_DOMAIN, "유지보수", datacenterId, storagedomainId) else it
}


fun Connection.findAllAttachedStorageDomainDisksFromDataCenter(datacenterId: String, storageDomainId: String): Result<List<Disk>> = runCatching {
	this.srvAttachedStorageDomainFromDataCenter(datacenterId, storageDomainId).disksService().list().send().disks()

}.onSuccess {
	Term.DATACENTER.logSuccessWithin(Term.DISK,"목록조회", datacenterId)
}.onFailure {
	Term.DATACENTER.logFailWithin(Term.DISK,"목록조회", it, datacenterId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.DATACENTER, Term.DISK, "목록조회", datacenterId) else it
}

// region: 유틸

fun List<DataCenter>.nameDuplicateDataCenter(datacenterName: String, datacenterId: String? = null): Boolean =
	this.filter { it.id() != datacenterId }.any { it.name() == datacenterName }

@Throws(InterruptedException::class)
fun Connection.expectDataCenterDeleted(dataCenterId: String, timeout: Long = 60000L, interval: Long = 1000L): Boolean {
	val startTime = System.currentTimeMillis()
	while (true) {
		val datacenters: List<DataCenter> = this.findAllDataCenters().getOrDefault(emptyList())
		val datacenter2Remove = datacenters.firstOrNull() { it.id() == dataCenterId }
		if (datacenter2Remove == null) { // dataCenterToRemove 에 아무것도 없으면(삭제된상태)
			Term.DATACENTER.logSuccess("삭제")
			return true
		}
		else if (System.currentTimeMillis() - startTime > timeout) {
			log.error("{} {} 삭제 실패 ... 시간 초과", Term.DATACENTER.description, datacenter2Remove.name())
			return false
		}
		log.debug("{} 삭제 진행중 ... ", Term.DATACENTER.description)
		Thread.sleep(interval)
	}
}
// endregion

