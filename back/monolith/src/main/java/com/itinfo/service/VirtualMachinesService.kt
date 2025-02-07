package com.itinfo.service

import com.itinfo.model.*

/**
 * [VirtualMachinesService]
 * 가상머신 관리 서비스
 *
 * @author chlee
 * @since 2023.12.07
 */
interface VirtualMachinesService {
	fun createVmNic(paramVmNicVo: VmNicVo)
	fun updateVmNic(paramVmNicVo: VmNicVo)
	fun removeVmNic(paramVmNicVo: VmNicVo)
	fun startVm(vms: List<VmVo>)
	fun stopVm(vms: List<VmVo>)
	fun rebootVm(vms: List<VmVo>)
	fun suspendVm(vms: List<VmVo>)
	fun removeVm(vms: List<VmVo>)
	fun retrieveVmsAll(): List<VmVo>
	fun retrieveVms(paramString: String): List<VmVo>
	fun retrieveVmsHosts(): List<HostVo>
	fun retrieveVmsClusters(): List<ClusterVo>
	fun retrieveVm(paramString: String): VmVo
	fun retrieveVmSystem(paramString: String): VmSystemVo
	fun retrieveVmNics(paramString: String): List<VmNicVo>
	fun retrieveVmNics(paramString: String, paramVmVo: VmVo): List<VmNicVo>
	fun retrieveVmSnapshots(paramString: String): List<SnapshotVo>
	fun retrieveVmRole(paramString: String): List<Map<String, Any>>
	fun retrieveVmDevices(paramString: String): List<VmDeviceVo>
	fun retrieveVmEvents(paramString: String): List<EventVo>
	fun recommendHosts(paramVmCreateVo: VmCreateVo): List<Array<String>>
	fun retrieveDisks(): List<DiskVo>
	fun retrieveDisks(paramString: String): List<DiskVo>
	fun retrieveVmCreateInfo(): VmCreateVo
	fun retrieveVmUpdateInfo(paramString: String): VmCreateVo?
	fun retrieveVmCloneInfo(paramString1: String, paramString2: String): VmCreateVo
	fun checkDuplicateName(paramString: String): Boolean
	fun checkDuplicateDiskName(paramDiskVo: DiskVo): Boolean
	fun createVm(paramVmCreateVo: VmCreateVo)
	fun updateVm(paramVmCreateVo: VmCreateVo)
	fun cloneVm(paramVmCreateVo: VmCreateVo)
	fun retrieveDiskProfiles(): List<DiskProfileVo>
	fun createSnapshot(paramSnapshotVo: SnapshotVo)
	fun previewSnapshot(paramSnapshotVo: SnapshotVo)
	fun commitSnapshot(paramString: String)
	fun undoSnapshot(paramString: String)
	fun removeSnapshot(paramSnapshotVo: SnapshotVo)
	fun retrieveDiscs(): List<StorageDomainVo>
	fun changeDisc(vm: VmVo)
	fun retrieveVmsTop(totalVms: List<VmVo>): List<DashboardTopVo>
}
