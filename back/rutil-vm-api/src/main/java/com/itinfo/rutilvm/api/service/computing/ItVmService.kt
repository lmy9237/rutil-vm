package com.itinfo.rutilvm.api.service.computing

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.model.*
import com.itinfo.rutilvm.api.model.computing.*
import com.itinfo.rutilvm.api.model.network.*
import com.itinfo.rutilvm.api.model.storage.*
import com.itinfo.rutilvm.api.repository.engine.VmRepository
import com.itinfo.rutilvm.api.repository.engine.entity.VmEntity
import com.itinfo.rutilvm.api.repository.engine.entity.toVmVosFromVmEntities
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.util.ovirt.*
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern

import org.ovirt.engine.sdk4.types.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.math.BigInteger
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
	 * [ItVmService.add]
	 * 가상머신 생성
	 *
	 * @param vmVo [VmVo]
	 * @return [VmVo]
	 */
	@Throws(Error::class)
	fun add(vmVo: VmVo): VmVo?
	/**
	 * [ItVmService.update]
	 * 가상머신 편집
	 *
	 * @param vmVo [VmVo]
	 * @return [VmVo]
	 */
	@Throws(Error::class)
	fun update(vmVo: VmVo): VmVo?
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
}

@Service
class VmServiceImpl(
) : BaseService(), ItVmService {
	@Autowired private lateinit var rVms: VmRepository

	@Throws(Error::class)
	override fun findAll(): List<VmVo> {
		log.info("findAll ... ")
		// val res: List<Vm> = conn.findAllVms(follow = "cluster.datacenter,reporteddevices,snapshots").getOrDefault(emptyList())
		// return res.toVmMenus(conn) // 3.86
		val res: List<VmEntity> = rVms.findAllWithSnapshotsOrderByVmNameAsc()
		return res.toVmVosFromVmEntities()
	}

	@Throws(Error::class)
	override fun findOne(vmId: String): VmVo? {
		log.info("findOne ... vmId : {}", vmId)
		val res: Vm? = conn.findVm(vmId, follow = "cluster.datacenter,reporteddevices,nics,diskattachments,cdroms,statistics").getOrNull()
		return res?.toVmVo(conn)
	}

	@Throws(Error::class)
	override fun add(vmVo: VmVo): VmVo? {
		log.info("add ... vmVo: {}", vmVo)

		// 부팅디스크는 한개 이상일때 오류
		if(vmVo.diskAttachmentVos.filter { it.bootable }.size > 1){
			throw ErrorPattern.DISK_BOOT_OPTION.toException()
		}

		// 가상머신 생성
		val res: Vm? = conn.addVm(
			vmVo.toAddVm()
		).getOrNull()


		if (res != null) {
			// 디스크 생성
			if(vmVo.diskAttachmentVos.isNotEmpty()){
				vmVo.diskAttachmentVos.forEach {
					conn.addDiskAttachmentToVm(res.id(), it.toAddDiskAttachment())
				}
			}
			// nic 생성
			if(vmVo.nicVos.isNotEmpty()){
				vmVo.nicVos.forEach {
					conn.addNicFromVm(res.id(), it.toAddVmNic())
				}
			}
			// 부트옵션
			if(vmVo.cdRomVo.id.isNotEmpty()){
				conn.addCdromFromVm(res.id(), vmVo.cdRomVo.id)
			}
		}
		return res?.toVmVo(conn)
	}

	@Throws(Error::class)
	override fun update(vmVo: VmVo): VmVo? {
		log.info("update ... vmVo: {}", vmVo)

		// 1. 디스크 부팅옵션 검사
		if (vmVo.diskAttachmentVos.count { it.bootable } > 1) {
			throw ErrorPattern.DISK_BOOT_OPTION.toException()
		}

		// 2. VM 정보 업데이트 (메인 정보만)
		val updatedVm: Vm = conn.updateVm(vmVo.toEditVm()).getOrNull() ?: return null

		// 3. 기존 디스크/네트워크 상태 조회
		val existDisks = conn.findAllDiskAttachmentsFromVm(vmVo.id).getOrDefault(emptyList())
		val existDisksMap = existDisks.associateBy { it.disk().id() }
		val changeDisks = vmVo.diskAttachmentVos
		val changeDisksMap = changeDisks.associateBy { it.diskImageVo.id }

		val existNics = conn.findAllNicsFromVm(vmVo.id).getOrDefault(emptyList())
		val changeNics = vmVo.nicVos
		val changeNicsMap = changeNics.associateBy { it.id }

		// 4. 디스크 diff (삭제/생성/수정)
		val disksToDelete = existDisks.filter { !changeDisksMap.containsKey(it.disk().id()) }
		val disksToAdd = changeDisks.filter { it.diskImageVo.id.isEmpty() || !existDisksMap.containsKey(it.diskImageVo.id) }
		val disksToUpdate = changeDisks
			.filter { it.diskImageVo.id.isNotEmpty() && existDisksMap.containsKey(it.diskImageVo.id) }
			.filter {
				val exist = existDisksMap[it.diskImageVo.id]!!
				it.diskImageVo.appendSize > BigInteger.ZERO ||
					it.diskImageVo.alias != exist.disk().alias() ||
					it.diskImageVo.description != exist.disk().description() ||
					it.diskImageVo.wipeAfterDelete != exist.disk().wipeAfterDelete() ||
					it.diskImageVo.sharable != exist.disk().shareable() ||
					it.diskImageVo.backup != (exist.disk().backup() == DiskBackup.INCREMENTAL) ||
					it.readOnly != exist.readOnly() ||
					it.bootable != exist.bootable()
			}

		// 5. NIC diff (삭제/생성)
		val nicsToDelete = existNics.filter { !changeNicsMap.containsKey(it.id()) }
		val nicsToAdd = changeNics.filter { it.id.isEmpty() }

		// 6. Disk 삭제
		disksToDelete.forEach { existDisk ->
			val detachOnly = changeDisks.find { it.diskImageVo.id == existDisk.disk().id() }?.detachOnly ?: false
			conn.removeDiskAttachmentToVm(vmVo.id, existDisk.id(), detachOnly)
		}
		// 7. Disk 생성
		disksToAdd.forEach { conn.addDiskAttachmentToVm(vmVo.id, it.toAddDiskAttachment()) }
		// 8. Disk 업데이트
		disksToUpdate.forEach { conn.updateDiskAttachmentToVm(vmVo.id, it.toEditDiskAttachment()) }

		// 9. NIC 삭제
		nicsToDelete.forEach { conn.removeNicFromVm(vmVo.id, it.id()) }
		// 10. NIC 생성
		nicsToAdd.forEach { conn.addNicFromVm(vmVo.id, it.toAddVmNic()) }

		// 11. CD-ROM 처리 (안전성, 조건 통일)
		val cdrom: Cdrom? = conn.findAllVmCdromsFromVm(updatedVm.id()).getOrNull()?.firstOrNull()
		val isoId = vmVo.cdRomVo.id

		when {
			// ISO 추가(아직 파일 없고, 새 iso 설정)
			(cdrom == null || !cdrom.filePresent()) && isoId.isNotEmpty() -> {
				log.info("CDROM 추가 iso: $isoId")
				conn.addCdromFromVm(updatedVm.id(), isoId)
			}
			// ISO 변경(파일 있고, isoId와 다르면 변경)
			cdrom != null && cdrom.filePresent() && isoId.isNotEmpty() && cdrom.file().id() != isoId -> {
				log.info("CDROM 변경 iso: $isoId")
				conn.updateCdromFromVm(updatedVm.id(), cdrom.file().id(), isoId)
			}
			// ISO 삭제(파일 있고, isoId 비어있음)
			cdrom != null && cdrom.filePresent() && isoId.isEmpty() -> {
				log.info("CDROM 삭제 iso: $isoId")
				conn.removeCdromFromVm(updatedVm.id(), cdrom.id())
			}
		}

		return updatedVm.toVmVo(conn)
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
		val res: List<Application> = conn.findAllApplicationsFromVm(vmId)
			.getOrDefault(emptyList())
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
		val res: List<Event> = conn.findAllEvents("sortby time desc").getOrDefault(emptyList())
			.filter { it.vmPresent() && it.vm().name() == vm.name() }
		return res.toEventVos()
	}


	companion object {
		private val log by LoggerDelegate()
	}
}
