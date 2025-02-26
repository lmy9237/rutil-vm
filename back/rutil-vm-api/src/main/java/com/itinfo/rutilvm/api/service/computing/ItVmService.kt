package com.itinfo.rutilvm.api.service.computing

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.model.*
import com.itinfo.rutilvm.api.model.computing.*
import com.itinfo.rutilvm.api.model.network.*
import com.itinfo.rutilvm.api.model.setting.PermissionVo
import com.itinfo.rutilvm.api.model.setting.toPermissionVos
import com.itinfo.rutilvm.api.model.storage.*
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.util.ovirt.*
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern

import org.ovirt.engine.sdk4.builders.*
import org.ovirt.engine.sdk4.types.*
import org.springframework.stereotype.Service
import java.util.*
import kotlin.Error


interface ItVmService {
	/**
	 * [ItVmService.findAll]
	 * 가상머신 목록
	 *
	 * @return List<[VmVo]> 가상머신 목록
	 */
	@Throws(Error::class)
	fun findAll(): List<VmVo>
	/**
	 * [ItVmService.findOne]
	 * 가상머신 정보
	 *
	 * @param vmId [String] 가상머신 Id
	 * @return [VmVo]
	 */
	@Throws(Error::class)
	fun findOne(vmId: String): VmVo?
	/**
	 * [ItVmService.findEditOne]
	 * 가상머신 편집
	 *
	 * @param vmId [String] 가상머신 Id
	 * @return [VmVo]
	 */
	@Throws(Error::class)
	fun findEditOne(vmId: String): VmCreateVo?

	/**
	 * [ItVmService.add]
	 * 가상머신 생성
	 *
	 * @param vmCreateVo [VmCreateVo]
	 * @return [VmCreateVo]
	 */
	@Throws(Error::class)
	fun add(vmCreateVo: VmCreateVo): VmCreateVo?
	/**
	 * [ItVmService.update]
	 * 가상머신 편집
	 *
	 * @param vmCreateVo [VmCreateVo]
	 * @return [VmVo]
	 */
	@Throws(Error::class)
	fun update(vmCreateVo: VmCreateVo): VmCreateVo?
	/**
	 * [ItVmService.remove]
	 * 가상머신 삭제
	 *
	 * @param vmId [String] 가상머신 Id
	 * @param diskDelete [Boolean] disk 삭제여부, disk가 true면 디스크 삭제하라는 말
	 * @return [Boolean]
	 * detachOnly => true==가상머신만 삭제/ false==가상머신+디스크 삭제
	 */
	@Throws(Error::class)
	fun remove(vmId: String, diskDelete: Boolean): Boolean

	/**
	 * [ItVmService.findAllApplicationsFromVm]
	 * 가상머신 어플리케이션
	 *
	 * @param vmId [String] 가상머신 Id
	 */
	@Throws(Error::class)
	fun findAllApplicationsFromVm(vmId: String): List<IdentifiedVo>
	/**
	 * [ItVmService.findAllHostDevicesFromVm]
	 * 가상머신 호스트 장치
	 *
	 * @param vmId [String] 가상머신 Id
	 */
	@Throws(Error::class)
	fun findAllHostDevicesFromVm(vmId: String): List<HostDeviceVo>
	/**
	 * [ItVmService.findAllEventsFromVm]
	 * 가상머신 이벤트
	 *
	 * @param vmId [String] 가상머신 Id
	 */
	@Throws(Error::class)
	fun findAllEventsFromVm(vmId: String): List<EventVo>

	/**
	 * [ItVmService.findGuestFromVm]
	 * 가상머신 게스트 정보
	 *
	 * @param vmId [String] 가상머신 Id
	 */
	@Deprecated("필요없음")
	@Throws(Error::class)
	fun findGuestFromVm(vmId: String): GuestInfoVo?
	/**
	 * [ItVmService.findAllPermissionsFromVm]
	 * 가상머신 권한
	 *
	 * @param vmId [String] 가상머신 Id
	 */
	@Deprecated("필요없음")
	@Throws(Error::class)
	fun findAllPermissionsFromVm(vmId: String): List<PermissionVo>
}

@Service
class VmServiceImpl(

) : BaseService(), ItVmService {

	@Throws(Error::class)
	override fun findAll(): List<VmVo> {
		log.info("findAll ... ")
		val res: List<Vm> = conn.findVms()
		return res.toVmsMenu(conn)
	}

	@Throws(Error::class)
	override fun findOne(vmId: String): VmVo? {
		log.info("findOne ... vmId : {}", vmId)
		val res: Vm? = conn.findVm(vmId).getOrNull()
		return res?.toVmVo(conn)
	}

	@Throws(Error::class)
	override fun findEditOne(vmId: String): VmCreateVo? {
		log.info("findEditOne ... vmId : {}", vmId)
		val res: Vm? = conn.findVm(vmId).getOrNull()
		return res?.toVmCreateVo(conn)
	}


	@Throws(Error::class)
	override fun add(vmCreateVo: VmCreateVo): VmCreateVo? {
		log.info("add ... vmCreateVo: {}", VmCreateVo)
		if(vmCreateVo.diskAttachmentVos.filter { it.bootable }.size > 1){
			log.error("부팅가능한 디스크는 한개만")
			throw ErrorPattern.VM_VO_INVALID.toException()
		}

		val res: Vm? = conn.addVm(
			vmCreateVo.toAddVmBuilder(),
			vmCreateVo.diskAttachmentVos.takeIf { it.isNotEmpty() }?.toAddVmDiskAttachmentList(),
			vmCreateVo.nicVos.map { it.toVmNicBuilder() }.takeIf { it.isNotEmpty() }, // NIC가 있는 경우만 전달
			vmCreateVo.connVo.id.takeIf { it.isNotEmpty() }  // ISO 설정이 있는 경우만 전달
		).getOrNull()
		return res?.toVmCreateVo(conn)
	}

	// 서비스에서 디스크 목록과 nic 목록을 분류(분류만)
	@Throws(Error::class)
	override fun update(vmCreateVo: VmCreateVo): VmCreateVo? {
		// 가상머신이 down 상태가 아니라면 편집 불가능
		log.info("update ... vmCreateVo: {}", vmCreateVo)
		if(vmCreateVo.diskAttachmentVos.filter { it.bootable }.size > 1){
			log.error("디스크 부팅가능은 한개만 가능")
			throw ErrorPattern.VM_VO_INVALID.toException()
		}

		// 기존 디스크 목록 조회
		val existDiskAttachments: List<DiskAttachment> =
			conn.findAllDiskAttachmentsFromVm(vmCreateVo.id).getOrDefault(listOf())
		existDiskAttachments.forEach {
			println("기존: " + it.disk().alias() + ", " + it.disk().id() + ", ")
		}
		vmCreateVo.diskAttachmentVos.forEach {
			println("들어오는: " + it.diskImageVo.alias + ", " + it.diskImageVo.id + ", " + it.shouldUpdateDisk)
		}

		val addDisks = mutableListOf<DiskAttachment>()
		val updateDisks = mutableListOf<DiskAttachment>()

		// 1. 업데이트 및 추가할 디스크 처리
		vmCreateVo.diskAttachmentVos.forEach { diskAttachmentVo ->
			when {
				// 새로운 디스크이고 shouldUpdateDisk가 true라면 추가
				diskAttachmentVo.diskImageVo.id.isEmpty() && !diskAttachmentVo.shouldUpdateDisk -> {
					log.info("새로운 디스크 생성: {}", diskAttachmentVo.diskImageVo.alias)
					addDisks.add(diskAttachmentVo.toAddDiskAttachment())
				}
				// // 기존 디스크이고 업데이트가 필요하면 업데이트 수행
				// diskAttachmentVo.diskImageVo.id.isNotEmpty() && diskAttachmentVo.shouldUpdateDisk -> {
				// 	log.info("디스크 업데이트: {}", diskAttachmentVo.diskImageVo.alias)
				// 	conn.updateDiskAttachmentToVm(vmCreateVo.id, diskAttachmentVo.toEditDiskAttachment())
				// }
				// 기존에 없던 디스크를 VM에 연결
				existDiskAttachments.none { it.id() == diskAttachmentVo.diskImageVo.id && !diskAttachmentVo.shouldUpdateDisk } -> {
					log.info("기존 디스크 연결: {}", diskAttachmentVo.diskImageVo.alias)
					addDisks.add(diskAttachmentVo.toAttachDisk())
				}
			}
		}

		// 2. 기존 디스크 중, vmCreateVo에 없는 경우 삭제
		existDiskAttachments.filter { existDisk ->
			vmCreateVo.diskAttachmentVos.none { it.diskImageVo.id == existDisk.id() }
		}.forEach { existDisk ->
			log.info("디스크 삭제: {} ", existDisk.id())
			// 디스크가 활성화 상태라면 삭제가 되지않음. 비활성화 처리
			// 비활성화 처리 기다리고 삭제

			// [2025-02-27 00:45:16] -ERROR 4280 --- com.itinfo.rutilvm.util.ovirt.SystemServiceHelper           .logFailWithin(Term.kt:89) : 실패: 가상머신 내 디스크 결합 삭제 ... 4883e4be-bf83-45b5-8260-956e7ab0824c, 이유: Fault reason is "Operation Failed". Fault detail is "[Cannot remove Virtual Disk: The following disks are locked: ${diskAliases}. Please try again in a few minutes.]". HTTP response code is "409". HTTP response message is "Conflict".
			conn.deactivateDiskAttachmentToVm(vmCreateVo.id, existDisk.id())
			conn.removeDiskAttachmentToVm(vmCreateVo.id, existDisk.id(), detachOnly = false)
		}

		// 기존 nic 목록
		val existNics: List<Nic> = conn.findAllNicsFromVm(vmCreateVo.id).getOrDefault(listOf())
		val addNics = mutableListOf<Nic>()

		vmCreateVo.nicVos.forEach { nicVo ->
			when {
				nicVo.vnicProfileVo.id.isNotEmpty() -> {
					log.info("새로운 nic 생성: {}", nicVo.name)
					addNics.add(nicVo.toVmNicBuilder())
				}
			}
		}
		// // nic에 없으면 삭제
		// vmCreateVo.nicVos.filter { nicVo ->
		// 	existNics.none { it.id() == nicVo.id }
		// }.forEach { nicVo ->
		// 	log.info("nic 삭제: {}", nicVo.name)
		// 	conn.removeNicFromVm(vmCreateVo.id, nicVo.id)
		// }


		val res: Vm? = conn.updateVm(
			vmCreateVo.toEditVmBuilder(),
			addDisks,
			addNics,
			vmCreateVo.connVo.id.takeIf { it.isNotEmpty() }
		).getOrNull()
		return res?.toVmCreateVo(conn)
	}

	// diskDelete가 detachOnly
	// diskDelete가 false 면 디스크는 삭제 안함, true면 삭제
	@Throws(Error::class)
	override fun remove(vmId: String, diskDelete: Boolean): Boolean {
		log.info("remove ...  vmId: {}", vmId)
		val res: Result<Boolean> = conn.removeVm(vmId, diskDelete)
		return res.isSuccess
	}

	@Throws(Error::class)
	override fun findAllApplicationsFromVm(vmId: String): List<IdentifiedVo> {
		log.info("findAllApplicationsFromVm ... vmId: {}", vmId)
		val res: List<Application> = conn.findAllApplicationsFromVm(vmId).getOrDefault(listOf())
		return res.fromApplicationsToIdentifiedVos()
	}

	@Throws(Error::class)
	override fun findAllHostDevicesFromVm(vmId: String): List<HostDeviceVo> {
		log.info("findAllHostDevicesFromVm ... vmId: {}", vmId)
		val res: List<HostDevice> = conn.findAllHostDevicesFromVm(vmId).getOrDefault(listOf())
		return res.toHostDeviceVos()
	}

	@Throws(Error::class)
	override fun findAllEventsFromVm(vmId: String): List<EventVo> {
		log.info("findAllEventsFromVm ... vmId: {}", vmId)
		val vm: Vm = conn.findVm(vmId)
			.getOrNull() ?: throw ErrorPattern.VM_NOT_FOUND.toException()
		val res: List<Event> = conn.findAllEvents()
			.getOrDefault(listOf())
			.filter { it.vmPresent() && it.vm().name() == vm.name() }
		return res.toEventVos()
	}

	@Deprecated("필요없음")
	@Throws(Error::class)
	override fun findGuestFromVm(vmId: String): GuestInfoVo? {
		log.info("findGuestFromVm ... vmId: {}", vmId)
		val res: Vm = conn.findVm(vmId)
			.getOrNull() ?: throw ErrorPattern.VM_NOT_FOUND.toException()
		if (!res.guestOperatingSystemPresent()) {
			log.warn("게스트 운영 체제 정보가 없습니다.")
			return null
		}
		return res.toGuestInfoVo()
	}

	@Deprecated("필요없음")
	@Throws(Error::class)
	override fun findAllPermissionsFromVm(vmId: String): List<PermissionVo> {
		log.info("findAllPermissionsFromVm ... vmId: {}", vmId)
		val res: List<Permission> = conn.findAllAssignedPermissionsFromVm(vmId).getOrDefault(listOf())
		return res.toPermissionVos(conn)
	}


	companion object {
		private val log by LoggerDelegate()
	}
}
