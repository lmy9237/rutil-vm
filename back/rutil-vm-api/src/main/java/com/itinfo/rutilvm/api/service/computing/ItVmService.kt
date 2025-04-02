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
	 * @return List<[VmViewVo]> 가상머신 목록
	 */
	@Throws(Error::class)
	fun findAll(): List<VmViewVo>
	/**
	 * [ItVmService.findOne]
	 * 가상머신 정보
	 *
	 * @param vmId [String] 가상머신 Id
	 * @return [VmViewVo]
	 */
	@Throws(Error::class)
	fun findOne(vmId: String): VmViewVo?
	/**
	 * [ItVmService.findEditOne]
	 * 가상머신 편집
	 *
	 * @param vmId [String] 가상머신 Id
	 * @return [VmCreateVo]
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
	 * @param vmUpdateVo [VmCreateVo]
	 * @return [VmCreateVo]
	 */
	@Throws(Error::class)
	fun update(vmUpdateVo: VmCreateVo): VmCreateVo?
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

	// /**
	//  * [ItVmService.addVmwareInfo]
	//  * 가상머신 가져오기- vmware 정보등록
	//  *
	//  * @param
	//  * @return
	//  */
	// @Throws(Error::class)
	// fun addVmwareInfo(externalVo: ExternalVo): ExternalVo?
	/**
	 * [ItVmService.importExternalVm]
	 * 가상머신 가져오기 (Vmware)
	 *
	 * @param externalVo [ExternalVo]
	 * @return [ExternalVo]
	 *
	 * ExternalHostProviders 를 이용해 외부 공급자를 추가하고 조회하는 방식같음
	 *
	 * POST /externalvmimports
	 * <external_vm_import>
	 *   <vm>
	 *     <name>my_vm</name>
	 *   </vm>
	 *   <cluster id="360014051136c20574f743bdbd28177fd" />
	 *   <storage_domain id="8bb5ade5-e988-4000-8b93-dbfc6717fe50" />
	 *   <name>vm_name_as_is_in_vmware</name>
	 *   <sparse>true</sparse>
	 *   <username>vmware_user</username>
	 *   <password>123456</password>
	 *   <provider>VMWARE</provider>
	 *   <url>vpx://wmware_user@vcenter-host/DataCenter/Cluster/esxi-host?no_verify=1</url>
	 *   <drivers_iso id="virtio-win-1.6.7.iso" />
	 * </external_vm_import>
	 */
	@Throws(Error::class)
	fun importExternalVm(externalVmVo: ExternalVmVo): ExternalVmVo?

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
	override fun findAll(): List<VmViewVo> {
		log.info("findAll ... ")
		// cluster.datacenter,statistics,reporteddevices
		val res: List<Vm> = conn.findAllVms(follow = "cluster.datacenter,reporteddevices").getOrDefault(emptyList())
		// val res: List<Vm> = conn.findVms()
		// return res.toVmsMenu(conn) // 3.92
		return res.toVmMenus(conn) // 3.86
	}

	@Throws(Error::class)
	override fun findOne(vmId: String): VmViewVo? {
		log.info("findOne ... vmId : {}", vmId)
		val res: Vm? = conn.findVm(vmId, follow = "cluster.datacenter,reporteddevices,diskattachments,cdroms,statistics").getOrNull()
		return res?.toVmViewVo(conn)
	}

	@Throws(Error::class)
	override fun findEditOne(vmId: String): VmCreateVo? {
		log.info("findEditOne ... vmId : {}", vmId)
		val res: Vm? = conn.findVm(vmId, follow = "cluster.datacenter,nics.vnicprofile.network,diskattachments,cdroms,statistics").getOrNull()
		return res?.toVmCreateVo(conn)
	}


	@Throws(Error::class)
	override fun add(vmCreateVo: VmCreateVo): VmCreateVo? {
		if(vmCreateVo.diskAttachmentVos.filter { it.bootable }.size > 1){
			log.error("부팅가능한 디스크는 한개만")
			throw ErrorPattern.VM_VO_INVALID.toException()
		}
		log.info("vmCreateVo {}", vmCreateVo)
		log.info("cd  {} {}", vmCreateVo.connVo.id, vmCreateVo.connVo.name)

		val res: Vm? = conn.addVm(
			vmCreateVo.toAddVmBuilder(),
			vmCreateVo.diskAttachmentVos.takeIf { it.isNotEmpty() }?.toAddVmDiskAttachmentList(),
			vmCreateVo.nicVos.map { it.toVmNicBuilder() }.takeIf { it.isNotEmpty() }, // NIC가 있는 경우만 전달
			vmCreateVo.connVo.id.takeIf { it.isNotEmpty() }  // ISO 설정이 있는 경우만 전달
		).getOrNull()
		return res?.toVmCreateVo(conn)
	}

	// 서비스에서 디스크 목록과 nic 목록을 분류(분류만)
	// 가상머신이 down 상태가 아니라면 편집 불가능
	@Throws(Error::class)
	override fun update(vmUpdateVo: VmCreateVo): VmCreateVo? {
		// log.info("update ... ")
		log.info("bios {}, fromValue: {}, valueOf: ", vmUpdateVo.osType, BiosType.fromValue(vmUpdateVo.osType))
		log.info("update ... vmCreateVo: {}", vmUpdateVo)

		if(vmUpdateVo.diskAttachmentVos.filter { it.bootable }.size > 1){
			log.error("디스크 부팅가능은 한개만 가능")
			throw ErrorPattern.VM_VO_INVALID.toException()
		}

		// 기존 디스크 목록 조회
		val existDiskAttachments: List<DiskAttachment> = conn.findAllDiskAttachmentsFromVm(vmUpdateVo.id).getOrDefault(emptyList())

		// 기존 디스크 ID 목록 생성
		val existDiskIds = existDiskAttachments.map { it.disk().id() }.toSet()

		// 새로운 디스크 목록에서 기존에 존재하지 않는 디스크만 필터링
		val newDisks = vmUpdateVo.diskAttachmentVos.filter { it.diskImageVo.id !in existDiskIds }

		// 기존 nic 목록 조회
		val existNics: List<Nic> = conn.findAllNicsFromVm(vmUpdateVo.id).getOrDefault(emptyList())

		// 기존 nic ID 목록 생성
		val existNicIds = existNics.map { it.id() }.toSet()

		// 새로운 NIC 중 ID가 없는 NIC는 생성 대상
		val newNics = vmUpdateVo.nicVos.filter { it.id.isEmpty() }

		// 기존 NIC 중 vmUpdateVo.nicVos에 없는 NIC는 삭제 대상
		val newNicIds = vmUpdateVo.nicVos.mapNotNull { it.id.takeIf { id -> id.isNotEmpty() } }.toSet()
		val deleteNics = existNics.filter { it.id() !in newNicIds }

		// NIC 삭제 처리
		// TODO: 에러처리 고도화 필요

		deleteNics.forEach { nic ->
			conn.removeNicFromVm(vmUpdateVo.id, nic.id())
			log.info("nic 삭제: {}", nic.name())
		}

		val res: Vm? = conn.updateVm(
			vmUpdateVo.toEditVmBuilder(),
			newDisks.takeIf { it.isNotEmpty() }?.toAddVmDiskAttachmentList(),
			newNics.map { it.toVmNicBuilder() }.takeIf { it.isNotEmpty() },
			vmUpdateVo.connVo.id.takeIf { it.isNotEmpty() }
		).getOrNull()
		return res?.toVmCreateVo(conn)
	}

	// diskDelete(detachOnly)가 false 면 디스크는 삭제 안함, true면 삭제
	@Throws(Error::class)
	override fun remove(vmId: String, diskDelete: Boolean): Boolean {
		log.info("remove ...  vmId: {}", vmId)
		val res: Result<Boolean> = conn.removeVm(vmId, diskDelete)
		return res.isSuccess
	}

	// @Throws(Error::class)
	// override fun addVmwareInfo(externalVo: ExternalVo): ExternalVo? {
	// 	log.info("addVmwareInfo ...  externalVo: {}", externalVo)
	// 	val res: ExternalHostProvider? = conn.addExternalHostProvider(
	// 		externalVo.toExternalHostProviderBuilder()
	// 	).getOrNull()
	// 	return res?.toExternalHostProvider()
	// }

	// 외부 가상머신 가져오기 (vmware)
	@Throws(Error::class)
	override fun importExternalVm(externalVmVo: ExternalVmVo): ExternalVmVo? {
		log.info("importExternalVm ...  externalVmVo: {}", externalVmVo)
		val res: ExternalVmImport? = conn.addExternalVmImport(
			externalVmVo.toExternalVmImportBuilder()
		).getOrNull()
		return res?.toExternalVmImport()
	}

	@Throws(Error::class)
	override fun findAllApplicationsFromVm(vmId: String): List<IdentifiedVo> {
		log.info("findAllApplicationsFromVm ... vmId: {}", vmId)
		val res: List<Application> = conn.findAllApplicationsFromVm(vmId).getOrDefault(emptyList())
		return res.fromApplicationsToIdentifiedVos()
	}

	@Throws(Error::class)
	override fun findAllHostDevicesFromVm(vmId: String): List<HostDeviceVo> {
		log.info("findAllHostDevicesFromVm ... vmId: {}", vmId)
		val res: List<HostDevice> = conn.findAllHostDevicesFromVm(vmId).getOrDefault(emptyList())
		return res.toHostDeviceVos()
	}

	// 호스트 장치 추가

	@Throws(Error::class)
	override fun findAllEventsFromVm(vmId: String): List<EventVo> {
		log.info("findAllEventsFromVm ... vmId: {}", vmId)
		val vm: Vm = conn.findVm(vmId)
			.getOrNull() ?: throw ErrorPattern.VM_NOT_FOUND.toException()
		val res: List<Event> = conn.findAllEvents().getOrDefault(emptyList())
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
		val res: List<Permission> = conn.findAllAssignedPermissionsFromVm(vmId).getOrDefault(emptyList())
		return res.toPermissionVos(conn)
	}


	companion object {
		private val log by LoggerDelegate()
	}
}
