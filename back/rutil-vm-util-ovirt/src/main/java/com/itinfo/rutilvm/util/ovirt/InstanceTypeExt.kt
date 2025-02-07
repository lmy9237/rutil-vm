package com.itinfo.rutilvm.util.ovirt

import com.itinfo.rutilvm.util.ovirt.error.*

import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.services.InstanceTypeNicsService
import org.ovirt.engine.sdk4.services.InstanceTypeService
import org.ovirt.engine.sdk4.services.InstanceTypesService
import org.ovirt.engine.sdk4.types.InstanceType
import org.ovirt.engine.sdk4.types.Nic

private fun Connection.srvInstanceTypes(): InstanceTypesService =
	systemService.instanceTypesService()

fun Connection.findAllInstanceTypes(searchQuery: String = ""): Result<List<InstanceType>> = runCatching {
	if(searchQuery.isNotEmpty())
		srvInstanceTypes().list().search(searchQuery).send().instanceType()
	else
		srvInstanceTypes().list().send().instanceType()
}.onSuccess {
	Term.INSTANCE_TYPE.logSuccess("목록조회")
}.onFailure {
	Term.INSTANCE_TYPE.logFail("목록조회", it)
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvInstanceType(instanceTypeId: String): InstanceTypeService =
	this.srvInstanceTypes().instanceTypeService(instanceTypeId)

fun Connection.findInstanceType(instanceTypeId: String): Result<InstanceType> = runCatching {
	this.srvInstanceType(instanceTypeId).get().send().instanceType()
}.onSuccess {
	Term.INSTANCE_TYPE.logSuccess("상세조회", instanceTypeId)
}.onFailure {
	Term.INSTANCE_TYPE.logFail("상세조회", it, instanceTypeId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.addInstanceType(instanceType: InstanceType): Result<InstanceType?> = runCatching {
	this.srvInstanceTypes().add().instanceType(instanceType).send().instanceType()
}.onSuccess {
	Term.INSTANCE_TYPE.logSuccess("생성", it.id())
}.onFailure {
	Term.INSTANCE_TYPE.logFail("생성", it)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.updateInstanceType(instanceType: InstanceType): Result<InstanceType?> = runCatching {
	this.srvInstanceType(instanceType.id()).update().send().instanceType()
}.onSuccess {
	Term.INSTANCE_TYPE.logSuccess("편집", it.id())
}.onFailure {
	Term.INSTANCE_TYPE.logFail("편집", it)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.removeInstanceType(instanceTypeId: String): Result<Boolean> = runCatching {
	this.srvInstanceType(instanceTypeId).remove().send()
	true
}.onSuccess {
	Term.INSTANCE_TYPE.logSuccess("제거", instanceTypeId)
}.onFailure {
	Term.INSTANCE_TYPE.logFail("제거", it, instanceTypeId)
	throw if (it is Error) it.toItCloudException() else it
}


private fun Connection.srvNicsFromInstanceType(instanceTypeId: String): InstanceTypeNicsService =
	this.srvInstanceType(instanceTypeId).nicsService()

fun Connection.addNicForInstanceType(instanceTypeId: String, nic: Nic): Result<Nic?> = runCatching {
	this.srvNicsFromInstanceType(instanceTypeId).add().nic(nic).send().nic()
}.onSuccess {
	Term.INSTANCE_TYPE.logSuccessWithin(Term.NIC, "생성", instanceTypeId)
}.onFailure {
	Term.INSTANCE_TYPE.logFailWithin(Term.NIC, "생성", it, instanceTypeId)
	throw if (it is Error) it.toItCloudException() else it
}