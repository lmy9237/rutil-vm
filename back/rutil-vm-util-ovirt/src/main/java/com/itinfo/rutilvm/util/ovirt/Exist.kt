package com.itinfo.rutilvm.util.ovirt

import com.itinfo.rutilvm.util.ovirt.error.*

import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.types.Cluster
import org.ovirt.engine.sdk4.types.DataCenter
import org.ovirt.engine.sdk4.types.Disk
import org.ovirt.engine.sdk4.types.Host
import org.ovirt.engine.sdk4.types.Network
import org.ovirt.engine.sdk4.types.StorageDomain
import org.ovirt.engine.sdk4.types.Template
import org.ovirt.engine.sdk4.types.Vm
import org.ovirt.engine.sdk4.types.VnicProfile

fun Connection.checkDataCenterExists(dataCenterId: String) {
	if (this.findDataCenter(dataCenterId).isFailure) {
		log.error("DataCenter 없음 {}", dataCenterId)
		throw ErrorPattern.DATACENTER_NOT_FOUND.toError()
	}
}
fun Connection.checkDataCenter(dataCenterId: String): DataCenter {
	return this.findDataCenter(dataCenterId)
		.getOrNull() ?: throw ErrorPattern.DATACENTER_NOT_FOUND.toError()
}

fun Connection.checkClusterExists(clusterId: String) {
	if (this.findCluster(clusterId).isFailure) {
		log.error("Cluster 없음 {}", clusterId)
		throw ErrorPattern.CLUSTER_NOT_FOUND.toError()
	}
}
fun Connection.checkCluster(clusterId: String): Cluster {
	return this.findCluster(clusterId)
		.getOrNull() ?: throw ErrorPattern.CLUSTER_NOT_FOUND.toError()
}

fun Connection.checkHostExists(hostId: String) {
	if (this.findHost(hostId).isFailure) {
		log.error("Host 없음 {}", hostId)
		throw ErrorPattern.HOST_NOT_FOUND.toError()
	}
}
fun Connection.checkHost(hostId: String): Host {
	return this.findHost(hostId)
		.getOrNull() ?: throw ErrorPattern.HOST_NOT_FOUND.toError()
}

fun Connection.checkVmExists(vmId: String) {
	if (this.findVm(vmId).isFailure) {
		log.error("Vm 없음 {}", vmId)
		throw ErrorPattern.VM_NOT_FOUND.toError()
	}
}
fun Connection.checkVm(vmId: String): Vm {
	return this.findVm(vmId)
		.getOrNull() ?: throw ErrorPattern.VM_NOT_FOUND.toError()
}

fun Connection.checkTemplateExists(templateId: String) {
	if (this.findTemplate(templateId).isFailure) {
		log.error("Template 없음 {}", templateId)
		throw ErrorPattern.TEMPLATE_NOT_FOUND.toError()
	}
}
fun Connection.checkTemplate(templateId: String): Template {
	return this.findTemplate(templateId)
		.getOrNull() ?: throw ErrorPattern.TEMPLATE_NOT_FOUND.toError()
}

fun Connection.checkNetworkExists(networkId: String) {
	if (this.findNetwork(networkId).isFailure) {
		log.error("Network 없음 {}", networkId)
		throw ErrorPattern.NETWORK_NOT_FOUND.toError()
	}
}
fun Connection.checkNetwork(networkId: String): Network {
	return this.findNetwork(networkId)
		.getOrNull() ?: throw ErrorPattern.NETWORK_NOT_FOUND.toError()
}

fun Connection.checkVnicProfileExists(vnicProfileId: String) {
	if (this.findVnicProfile(vnicProfileId).isFailure) {
		log.error("VnicProfile 없음 {}", vnicProfileId)
		throw ErrorPattern.VNIC_PROFILE_NOT_FOUND.toError()
	}
}
fun Connection.checkVnicProfile(vnicProfileId: String): VnicProfile {
	return this.findVnicProfile(vnicProfileId)
		.getOrNull() ?: throw ErrorPattern.VNIC_PROFILE_NOT_FOUND.toError()
}

fun Connection.checkStorageDomainExists(domainId: String) {
	if (this.findStorageDomain(domainId).isFailure) {
		log.error("StorageDomain 없음 {}", domainId)
		throw ErrorPattern.VNIC_PROFILE_NOT_FOUND.toError()
	}
}
fun Connection.checkStorageDomain(domainId: String): StorageDomain {
	return this.findStorageDomain(domainId)
		.getOrNull() ?: throw ErrorPattern.VNIC_PROFILE_NOT_FOUND.toError()
}

fun Connection.checkDiskExists(diskId: String) {
	if (this.findDisk(diskId).isFailure) {
		log.error("Disk 없음 {}", diskId)
		throw ErrorPattern.DISK_NOT_FOUND.toError()
	}
}
fun Connection.checkDisk(diskId: String): Disk {
	return this.findDisk(diskId)
		.getOrNull() ?: throw ErrorPattern.DISK_NOT_FOUND.toError()
}


