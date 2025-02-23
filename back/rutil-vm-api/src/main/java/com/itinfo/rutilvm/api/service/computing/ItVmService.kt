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

	@Throws(Error::class)
	override fun update(vmCreateVo: VmCreateVo): VmCreateVo? {
		log.info("update ... vmCreateVo: {}", vmCreateVo)
		if(vmCreateVo.diskAttachmentVos.filter { it.bootable }.size != 1){
			log.error("디스크 부팅가능은 한개만 가능")
			throw ErrorPattern.VM_VO_INVALID.toException()
		}

		// 가상머신이 가지고 있는 디스크 목록
		val existDiskAttachments: List<DiskAttachment> = conn.findAllDiskAttachmentsFromVm(vmCreateVo.id).getOrDefault(listOf())

		// 기존 디스크가 새 목록에 없으면 삭제
		existDiskAttachments.filter { existingDisk ->
			vmCreateVo.diskAttachmentVos.none { it.id == existingDisk.id() }
		}.map { diskAttachment ->
			log.info("디스크 삭제: {}", diskAttachment.id())
			conn.removeDiskAttachmentToVm(vmCreateVo.id, diskAttachment.id(), true)
		}

		// 기존 디스크에 존재하는데 id와 alias가 있다면 편집
		vmCreateVo.diskAttachmentVos.filter { diskAttachmentVo ->
			existDiskAttachments.any {
				it.id() == diskAttachmentVo.id && (
					it.bootable() != diskAttachmentVo.bootable ||
					it.readOnly() != diskAttachmentVo.readOnly ||
					it.interface_() != diskAttachmentVo.interface_ ||
					it.disk().alias() != diskAttachmentVo.diskImageVo.alias ||
					it.disk().description() != diskAttachmentVo.diskImageVo.description ||
					it.disk().diskProfile().id() != diskAttachmentVo.diskImageVo.diskProfileVo.id
				)
			}
		}.map { diskAttachmentVo ->
			log.info("디스크 편집: {} {}", diskAttachmentVo.diskImageVo.id, diskAttachmentVo.diskImageVo.alias)
			diskAttachmentVo.toEditDiskAttachment()
		}

		// 기존 nic목록
		val existNics: List<Nic> = conn.findAllNicsFromVm(vmCreateVo.id).getOrDefault(listOf())

		// 기존 nic에 존재하지 않는다면 삭제 (편집은 x)
		existNics.filter { existNic ->
			vmCreateVo.nicVos.none { it.id == existNic.id() }
		}.map { nic ->
			log.info("nic 삭제: {}", nic.name())
			conn.removeNicFromVm(vmCreateVo.id, nic.id())
		}

		val res: Vm? = conn.updateVm(
			vmCreateVo.toEditVmBuilder(),
			vmCreateVo.diskAttachmentVos.takeIf { it.isNotEmpty() }?.toAddVmDiskAttachmentList(),
			vmCreateVo.nicVos.map { it.toVmNicBuilder() }.takeIf { it.isNotEmpty() },
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
