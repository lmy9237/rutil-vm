package com.itinfo.rutilvm.api.service.computing

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.model.*
import com.itinfo.rutilvm.api.model.computing.*
import com.itinfo.rutilvm.api.model.network.*
import com.itinfo.rutilvm.api.model.storage.*
import com.itinfo.rutilvm.api.repository.engine.VmDeviceRepository
import com.itinfo.rutilvm.api.repository.engine.VmRepository
import com.itinfo.rutilvm.api.repository.engine.VmStaticRepository
import com.itinfo.rutilvm.api.repository.engine.entity.VmDeviceEntity
import com.itinfo.rutilvm.api.repository.engine.entity.VmEntity
import com.itinfo.rutilvm.api.repository.engine.entity.VmStaticEntity
import com.itinfo.rutilvm.api.repository.engine.entity.toVmVoFromVmEntity
import com.itinfo.rutilvm.api.repository.engine.entity.toVmVosFromVmEntities
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.common.toUUID
import com.itinfo.rutilvm.util.ovirt.*
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern
import com.itinfo.rutilvm.util.ovirt.error.ItCloudException
import kotlinx.coroutines.delay

import org.ovirt.engine.sdk4.types.*
import org.postgresql.util.PSQLException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
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
	suspend fun update(vmVo: VmVo): VmVo?
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
	 * [ItVmService.findCdromFromVm]
	 * 가상머신 내 CD-ROM 조회
	 *
	 * @param vmId [String] 가상머신 ID
	 * @param current [Boolean] 임시용 여부
	 *
	 * @return [IdentifiedVo] 조회 결과
	 */
	@Throws(Error::class)
	fun findCdromFromVm(vmId: String?, current: Boolean?): IdentifiedVo
	/**
	 * [ItVmService.updateCdromFromVm]
	 * 가상머신 삭제
	 *
	 * @param vmId [String] 가상머신 ID
	 * @param cdromFileId [String] CD-ROM 파일 ID
	 * @param current [Boolean] 임시용 여부
	 *
	 * @return [Boolean] 처리결과
	 */
	@Throws(Error::class)
	fun updateCdromFromVm(vmId: String?, cdromFileId: String?, current: Boolean?): Boolean
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
	@Autowired private lateinit var rVmStatics: VmStaticRepository
	@Autowired private lateinit var rVmDevices: VmDeviceRepository

	@Throws(Error::class)
	override fun findAll(): List<VmVo> {
		log.info("findAll ... ")
		// val vms: List<Vm> = conn.findAllVms(follow = "cluster.datacenter,reporteddevices,snapshots")
		// 	.getOrDefault(emptyList()) // TODO: 다 연결 됐을때 제거
		// return res.toVmMenus(conn) // 3.86
		val res: List<VmEntity> = rVms.findAllWithSnapshotsOrderByVmNameAsc()
		return res.toVmVosFromVmEntities()
		// return res.toVmVosFromVmEntities(vms) // TODO: 다 연결 됐을때 제거
	}

	@Throws(Error::class)
	override fun findOne(vmId: String): VmVo? {
		log.info("findOne ... vmId : {}", vmId)
		val vm: Vm? = conn.findVm(vmId, follow = "cluster.datacenter,reporteddevices,nics,diskattachments,cdroms,statistics")
			.getOrNull()
		val res: VmEntity? = rVms.findByIdWithSnapshots(vmId.toUUID())
		return res?.toVmVoFromVmEntity(vm)
	}

	@Throws(PSQLException::class, Error::class)
	@Transactional("engineTransactionManager")
	override fun add(vmVo: VmVo): VmVo? {
		log.info("add ... vmVo: {}", vmVo)

		// 부팅디스크는 한개 이상일때 오류
		if (vmVo.diskAttachmentVos.filter { it.bootable }.size > 1){
			throw ErrorPattern.DISK_BOOT_OPTION.toException()
		}

		// 가상머신 생성
		val res: Vm? = conn.addVm(
			vmVo.toAddVm(), vmVo.cdRomVo.id
		).getOrNull()
			?: throw ErrorPattern.VM_NOT_FOUND.toException()
			// TODO: 변경실패 에러유형 필요

		val vmStaticFound: VmStaticEntity = rVmStatics.findByVmGuid(res?.id()?.toUUID())
			?: throw ErrorPattern.VM_NOT_FOUND.toException()
		val vmDeviceFound: VmDeviceEntity = rVmDevices.findByVmIdAndType(res?.id()?.toUUID(), "video")
			?: throw ErrorPattern.VM_NOT_FOUND.toException()
			// TODO: 가상머신 기기 에러유형 필요
			// ?: throw ErrorPattern.VM_DEVICE_NOT_FOUND.toException()

		if (res != null) {
			// nic 생성
			if(vmVo.nicVos.isNotEmpty()){
				vmVo.nicVos.forEach {
					conn.addNicFromVm(res.id(), it.toAddVmNic())
				}
			}
			// 디스크 생성
			if(vmVo.diskAttachmentVos.isNotEmpty()){
				vmVo.diskAttachmentVos.forEach {
					log.info("vmVo.diskAttachmentVos: {}", it.diskImageVo.alias)
					if (it.diskImageVo.id.isEmpty()) { // 디스크 생성
						conn.addDiskAttachmentToVm(res.id(), it.toAddDiskAttachment())
					} else { // 디스크 연결
						conn.addDiskAttachmentToVm(res.id(), it.toAttachDisk())
					}
				}
			}
			// 부트옵션
			// if(vmVo.cdRomVo.id.isNotEmpty()){
			// 	conn.addCdromFromVm(res.id(), vmVo.cdRomVo.id)
			// }
			// 그래픽/비디오 유형
			log.debug("add ... vmVo.displayType: {}", vmVo.displayType)
			vmStaticFound.defaultDisplayType = vmVo.displayType
			val vmStaticSaved = rVmStatics.save(vmStaticFound)
			log.debug("add ... vmStaticSaved.defaultDisplayType: {}", vmStaticSaved.defaultDisplayType)
			vmDeviceFound.device = vmVo.displayType?.name
			val vmDeviceSaved = rVmDevices.save(vmDeviceFound)
			log.debug("add ... vmStaticSaved.device: {}", vmDeviceSaved.device)
		}
		return res?.toVmVo(conn).apply {
			this@apply?.displayType = vmStaticFound.defaultDisplayType
		}
	}

	@Throws(PSQLException::class, Error::class)
	@Transactional("engineTransactionManager")
	override suspend fun update(vmVo: VmVo): VmVo? {
		log.info("update ... vmVo: {}", vmVo)

		// 디스크 부팅옵션 검사
		if (vmVo.diskAttachmentVos.count { it.bootable } > 1) {
			throw ErrorPattern.DISK_BOOT_OPTION.toException()
		}

		// VM 정보 업데이트 (메인 정보만)
		val updatedVm: Vm = conn.updateVm(
			vmVo.toEditVm(), vmVo.cdRomVo.id
		).getOrNull() ?: throw ErrorPattern.VM_NOT_FOUND.toException()
			// TODO: 변경실패 에러유형 필요

		val vmStaticFound: VmStaticEntity = rVmStatics.findByVmGuid(vmVo.id.toUUID())
			?: throw ErrorPattern.VM_NOT_FOUND.toException()
		val vmDeviceFound: VmDeviceEntity = rVmDevices.findByVmIdAndType(vmVo.id.toUUID(), "video")
			?: throw ErrorPattern.VM_NOT_FOUND.toException()
			// TODO: 가상머신 기기 에러유형 필요
			// ?: throw ErrorPattern.VM_DEVICE_NOT_FOUND.toException()

		log.info("현재 VM 상태: ${updatedVm.status()}")

		try {
			updateNics(vmVo)	// nic 편집
		} catch (e: ItCloudException) {
			log.error("nic 편집 문제발생 ... {}", e.localizedMessage)
		}
		try {

			updateDisks(vmVo)	// 디스크 편집
		} catch (e: ItCloudException) {
			log.error("디스크 편집 문제발생 ... {}", e.localizedMessage)
		}

		// 그래픽/비디오 유형
		log.debug("update ... vmVo.displayType: {}", vmVo.displayType)
		vmStaticFound.defaultDisplayType = vmVo.displayType
		val vmStaticSaved = rVmStatics.save(vmStaticFound)
		log.debug("update ... vmStaticSaved.defaultDisplayType: {}", vmStaticSaved.defaultDisplayType)
		vmDeviceFound.device = vmVo.displayType?.name
		val vmDeviceSaved = rVmDevices.save(vmDeviceFound)
		log.debug("update ... vmStaticSaved.device: {}", vmDeviceSaved.device)

		// 상태가 UP 될 때까지 대기
		delay(1200L)
		// Thread.sleep(1200)
		updateCdrom(updatedVm.id(), vmVo.cdRomVo.id, false)
		return updatedVm.toVmVo(conn).apply {
			this@apply.displayType = vmStaticFound.defaultDisplayType
		}
	}

	// diskDelete(detachOnly)가 false 면 디스크는 삭제 안함, true면 삭제
	@Throws(Error::class)
	override fun remove(vmId: String, diskDelete: Boolean): Boolean {
		log.info("remove ...  vmId: {}", vmId)
		val res: Result<Boolean> = conn.removeVm(vmId, diskDelete)
		return res.isSuccess
	}

	@Throws(Error::class)
	override fun findCdromFromVm(
		vmId: String?,
		current: Boolean?
	): IdentifiedVo {
		log.info("findCdromFromVm ... vmId: {}, current: {}", vmId, current)
		val res: Cdrom = conn.findCdromFromVm(vmId, current)
			.getOrNull() ?: throw ErrorPattern.CD_ROM_NOT_FOUND.toException()
		return res.toIdentifiedVoFromCdrom()
	}

	override fun updateCdromFromVm(
		vmId: String?,
		cdromFileId: String?,
		current: Boolean?,
	): Boolean {
		log.info("updateCdFromVm ... vmId: {}, cdromFileId: {}, current: {}", vmId, cdromFileId, current)
		return updateCdrom(vmId, cdromFileId, current)
	}

	private fun updateCdrom(
		vmId: String?="",
		cdromFileId: String?="",
		current: Boolean?=false
	): Boolean {
		val cdrom: Cdrom = conn.findCdromFromVm(vmId, current)
			.getOrNull() ?: throw ErrorPattern.CD_ROM_NOT_FOUND.toException()

		return try {
			when {
				(cdrom.filePresent().not()) && cdromFileId?.isEmpty() == false -> {
					log.info("updateCdrom ... CD-ROM 추가 cdromFileId: {}", cdromFileId)
					val cdromAdded = conn.addCdromFromVm(vmId, cdromFileId).getOrElse {
						throw RuntimeException("CDROM 추가 실패: isoId=$cdromFileId", it)
					}
					return cdromAdded?.idPresent() == true &&
						cdromAdded.filePresent() &&
						cdromAdded.file().id() == cdromFileId
				}
				cdrom.filePresent() && cdromFileId?.isEmpty() == false && cdrom.file().id() != cdromFileId -> {
					log.info("updateCdrom ... CD-ROM 변경 {} -> {}", cdrom.file().id(), cdromFileId)
					val cdromUpdated = conn.updateCdromFromVm(vmId, cdromFileId, current).getOrElse {
						throw RuntimeException("CDROM 변경 실패: cdromFileId=$cdromFileId", it)
					}
					val cdromFileIdUpdated: String? = cdromUpdated?.file()?.id()
					log.info("updateCdrom ... CD-ROM 변경 결과 cdromFileIdUpdated: $cdromFileIdUpdated")
					return cdromFileIdUpdated?.isNotEmpty() == true
				}
				cdrom.filePresent() && cdromFileId?.isEmpty() == true -> {
					log.info("updateCdrom ... CD-ROM 삭제 cdromFileId: $cdromFileId")
					return conn.removeCdromFromVm(vmId, current).getOrElse {
						throw RuntimeException("CDROM 삭제 실패: cdromFileId=${cdrom.id()}", it)
					} == true
				}
				else -> {
					log.info("updateCdrom ... CD-ROM 변경사항 없음")
					true
				}
			}
		} catch (e: Exception) {
			throw RuntimeException("CDROM 처리 중 오류 발생", e)
		}
	}

	private fun updateNics(vmVo: VmVo) {
		val existNics = conn.findAllNicsFromVm(vmVo.id).getOrElse {
			throw RuntimeException("NIC 목록 조회 실패", it)
		}

		val changeNics = vmVo.nicVos
		val changeNicsMap = changeNics.associateBy { it.id }

		val nicsToDelete = existNics.filter { !changeNicsMap.containsKey(it.id()) }
		val nicsToAdd = changeNics.filter { it.id?.isEmpty() == true }

		nicsToDelete.forEach {
			conn.removeNicFromVm(vmVo.id, it.id()).getOrElse {
				throw RuntimeException("NIC 삭제 실패 ${it.message}", it)
			}
		}

		nicsToAdd.forEach {
			conn.addNicFromVm(vmVo.id, it.toAddVmNic()).getOrElse {
				throw RuntimeException("NIC 추가 실패 ${it.message}", it)
			}
		}
	}


	private fun updateDisks(vmVo: VmVo) {
		val existDisks = conn.findAllDiskAttachmentsFromVm(vmVo.id).getOrDefault(emptyList())
		val existDisksMap = existDisks.associateBy { it.disk().id() }
		val changeDisks = vmVo.diskAttachmentVos
		val changeDisksMap = changeDisks.associateBy { it.diskImageVo.id }

		val disksToDelete = existDisks.filter { !changeDisksMap.containsKey(it.disk().id()) }
		val disksToAdd = changeDisks.filter { it.diskImageVo.id.isNullOrEmpty() || !existDisksMap.containsKey(it.diskImageVo.id) }
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

		disksToDelete.forEach {
			log.info("diskDelete: {}", it.disk().name())
			conn.removeDiskAttachmentToVm(vmVo.id, it.id(), true) // false가 완전삭제
		}
		disksToAdd.forEach {
			log.info("disksToAdd: {}", it.diskImageVo.alias)
			if (it.diskImageVo.id.isEmpty()) { // 디스크 생성
				conn.addDiskAttachmentToVm(vmVo.id, it.toAddDiskAttachment())
			} else { // 디스크 연결
				conn.addDiskAttachmentToVm(vmVo.id, it.toAttachDisk())
			}
		}

		disksToUpdate.forEach {
			log.info("disksToUpdate: {}", it.diskImageVo.alias)
			conn.updateDiskAttachmentToVm(vmVo.id, it.toEditDiskAttachment())
		}
	}


	@Throws(Error::class)
	override fun findAllApplicationsFromVm(vmId: String): List<IdentifiedVo> {
		log.info("findAllApplicationsFromVm ... vmId: {}", vmId)
		val res: List<Application> = conn.findAllApplicationsFromVm(vmId)
			.getOrDefault(emptyList())
		return res.toIdentifiedVosFromApplications()
	}

	@Throws(Error::class)
	override fun findAllHostDevicesFromVm(vmId: String): List<HostDeviceVo> {
		log.info("findAllHostDevicesFromVm ... vmId: {}", vmId)
		val res: List<HostDevice> = conn.findAllHostDevicesFromVm(vmId)
			.getOrDefault(emptyList())
		return res.toHostDeviceVos()
	}

	@Throws(Error::class)
	override fun findAllEventsFromVm(vmId: String): List<EventVo> {
		log.info("findAllEventsFromVm ... vmId: {}", vmId)
		val vm: Vm = conn.findVm(vmId)
			.getOrNull() ?: throw ErrorPattern.VM_NOT_FOUND.toException()
		val res: List<Event> = conn.findAllEvents("sortby time desc")
			.getOrDefault(emptyList())
			.filter { it.vmPresent() && it.vm().name() == vm.name() }
		return res.toEventVos()
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
