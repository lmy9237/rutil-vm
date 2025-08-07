package com.itinfo.rutilvm.api.service.computing

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.model.*
import com.itinfo.rutilvm.api.model.computing.*
import com.itinfo.rutilvm.api.model.network.*
import com.itinfo.rutilvm.api.model.storage.*
import com.itinfo.rutilvm.api.ovirt.business.DisplayTypeB
import com.itinfo.rutilvm.api.ovirt.business.toNicInterface
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
	 * 가상머신 내 CD-ROM 편집
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
	private val vmNic: ItVmNicService,
	private val vmDisk: ItVmDiskService,
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

		validateBootDisk(vmVo.diskAttachmentVos)

		val addVm: Vm = conn.addVm(
			vmVo.toAddVm()
		).getOrNull() ?: throw ErrorPattern.VM_NOT_FOUND.toException()

		try {
			// cd rom 처리
			if(vmVo.cdRomVo.id.isNotEmpty()){
				updateCdrom(addVm.id(), vmVo.cdRomVo.id)
			}

			// 디스플레이 설정
			configureDisplayType(addVm.id(), vmVo.displayType)

			// nic 생성
			if(vmVo.nicVos.isNotEmpty()) {
				addNicsToVm(addVm.id(), vmVo.nicVos)
			}

			// 디스크 생성
			if(vmVo.diskAttachmentVos.isNotEmpty()) {
				addDisksToVm(addVm.id(), vmVo.diskAttachmentVos)
			}
		} catch (ex: Exception) {
			log.error("가상머신 구성 요소 생성 중 오류 발생", ex)
			throw ex
		}

		return addVm.toVmVo(conn).apply {
			this.displayType = vmVo.displayType
		}
	}


	@Throws(PSQLException::class, Error::class)
	@Transactional("engineTransactionManager")
	override suspend fun update(vmVo: VmVo): VmVo? {
		log.info("update ... vmVo: {}", vmVo)

		validateBootDisk(vmVo.diskAttachmentVos)

		val updatedVm: Vm = conn.updateVm(
			vmVo.toEditVm(), vmVo.cdRomVo.id
		).getOrNull() ?: throw ErrorPattern.VM_NOT_FOUND.toException()

		try {
			// cd rom 처리
			manageVmCdrom(updatedVm.id(), vmVo.cdRomVo.id)

			// 디스플레이 설정
			configureDisplayType(updatedVm.id(), vmVo.displayType)

			if(vmVo.nicVos.isNotEmpty()) {
				manageVmNics(updatedVm.id(), vmVo.nicVos)
			}

			if(vmVo.diskAttachmentVos.isNotEmpty()) {
				manageVmDisks(updatedVm.id(), vmVo.diskAttachmentVos)
			}
		} catch (ex: Exception) {
			log.error("가상머신 구성 요소 생성 중 오류 발생", ex)
			throw ex
		}
		log.info("현재 VM 상태: ${updatedVm.status()}")


		// 상태가 UP 될 때까지 대기
		delay(1200L)
		return updatedVm.toVmVo(conn).apply {
			this@apply.displayType = vmVo.displayType
		}
	}


	// region: vm add/update
	// 부팅디스크는 한개 이상일때 오류
	private fun validateBootDisk(diskAttachmentVos: List<DiskAttachmentVo>) {
		if (diskAttachmentVos.count { it.bootable } > 1) {
			throw ErrorPattern.DISK_BOOT_OPTION.toException()
		}
	}

	// 그래픽/비디오 설정 분리
	private fun configureDisplayType(vmId: String, displayTypeB: DisplayTypeB?) {
		val vmStatic = rVmStatics.findByVmGuid(vmId.toUUID())
			?: throw ErrorPattern.VM_NOT_FOUND.toException()
		val vmDevice = rVmDevices.findByVmIdAndType(vmId.toUUID(), "video")
			?: throw ErrorPattern.VM_NOT_FOUND.toException()

		log.debug("add ... vmVo.displayType: {}", displayTypeB)
		vmStatic.defaultDisplayType = displayTypeB
		log.debug("add ... vmStaticSaved.defaultDisplayType: {}", vmStatic.defaultDisplayType)
		rVmStatics.save(vmStatic)
		vmDevice.device = displayTypeB?.name
		rVmDevices.save(vmDevice)
		log.debug("add ... vmStaticSaved.device: {}", vmDevice.device)
	}

	// 디스크 생성/연결 로직 분리
	private fun addDisksToVm(vmId: String, diskVos: List<DiskAttachmentVo>) {
		diskVos.forEach { diskVo ->
			log.info("Disk alias: {}", diskVo.diskImageVo.alias)
			val attachment = if (diskVo.diskImageVo.id.isEmpty()) {
				diskVo.toAddDiskAttachment()
			} else {
				diskVo.toAttachDisk()
			}
			conn.addDiskAttachmentToVm(vmId, attachment)
		}
	}

	// NIC 생성 로직 분리
	private fun addNicsToVm(vmId: String, nicVos: List<NicVo>) {
		for (nic in nicVos) {
			conn.addNicFromVm(vmId, nic.toAddVmNic())
				.getOrElse { throw RuntimeException("NIC 추가 실패 ${it.message}", it) }
		}
	}


	private fun manageVmNics(vmId: String, nicVos: List<NicVo>) {
		log.info("manageVmNic ... vmVo.id: {}", vmId)
		val vmNicList = conn.findAllNicsFromVm(vmId).getOrElse { throw RuntimeException("NIC 목록 조회 실패", it) }
		val existingNicsMap = vmNicList.associateBy { it.id() }
		val desiredNicIds = nicVos.mapNotNull { it.id }.toSet()

		val nics2Remove = vmNicList.filter { it.id() !in desiredNicIds }
		val (nics2Add, nics2Update) = nicVos.partition { it.id.isNullOrBlank() }
			.let { (add, others) ->
				val update = others.mapNotNull { desired ->
					existingNicsMap[desired.id]?.takeIf { areNicsDifferent(it, desired) }?.let { it to desired }
				}
				add to update
			}

		nics2Remove.forEach { conn.removeNicFromVm(vmId, it.id()) }
		nics2Update.forEach { (existing, desired) ->
			conn.updateNicFromVm(vmId, desired.toEditVmNic()).getOrElse {
				throw RuntimeException("Failed to update NIC ${existing.id()}: ${it.message}", it)
			}
		}
		if (nics2Add.isNotEmpty()) addNicsToVm(vmId, nics2Add)
		/*val vmNicList = conn.findAllNicsFromVm(vmId).getOrElse {
			throw RuntimeException("NIC 목록 조회 실패", it)
		}
		// 현재 가상머신 nic 목록에서 아이디
		val existingNicsMap = vmNicList.associateBy { it.id() }

		// nicVos에서 아이디
		val desiredNicIds = nicVos.mapNotNull { it.id }.toSet()

		// 가상머신 nic에는 있지만 들어온 nicvos에는 없으면 삭제
		val nics2Remove = vmNicList.filter { it.id() !in desiredNicIds }
		val nics2Add = mutableListOf<NicVo>()
		val nics2Update = mutableListOf<Pair<Nic, NicVo>>()

		for (desiredNic in nicVos) {
			if (desiredNic.id.isNullOrBlank()) {
				nics2Add.add(desiredNic)
			} else {
				val existingNic = existingNicsMap[desiredNic.id]
				if (existingNic != null) {
					if (areNicsDifferent(existingNic, desiredNic)) {
						nics2Update.add(existingNic to desiredNic)
					}
				}
			}
		}
		log.info("manageVmNic: {} to add, {} to update, {} to remove.", nics2Add.size, nics2Update.size, nics2Remove.size)

		// 3-1: 제거
		if(nics2Remove.isNotEmpty()) {
			for (nic in nics2Remove) {
				log.info("removing NIC ... id: {}, name: {}", nic.id(), nic.name())
				conn.removeNicFromVm(vmId, nic.id())
			}
		}

		// 3-2: 편집
		if(nics2Update.isNotEmpty()) {
			for ((existing, desired) in nics2Update) {
				log.info("updating NIC: id={}, name='{}' -> '{}'", existing.id(), existing.name(), desired.name)
				conn.updateNicFromVm(
					vmId, desired.toEditVmNic()
				).getOrElse {
					throw RuntimeException("Failed to update NIC ${existing.id()}: ${it.message}", it)
				}
			}
		}

		// 3-3: 생성
		if(nics2Add.isNotEmpty()){
			addNicsToVm(vmId, nics2Add)
		}*/
	}

	private fun manageVmDisks(vmId: String, diskAttachmentVos: List<DiskAttachmentVo>) {
		val vmDiskList: List<DiskAttachment> = conn.findAllDiskAttachmentsFromVm(vmId).getOrDefault(emptyList())
		val existDisksMap = vmDiskList.associateBy { it.disk().id() }
		// val inputDiskAttachVoMap = diskAttachmentVos.associateBy { it.id }


		// 삭제 대상: 서버에는 있지만 사용자 입력에는 없는 디스크 (id 기준)
		// val disksToDelete = vmDiskList.filter { !inputDiskAttachVoMap.containsKey(it.id()) }
		val disksToDel: List<DiskAttachmentVo> = diskAttachmentVos.filter { it.detachOnly != null }
		val delDiskId = disksToDel.map { it.id }.toSet()

		val disksToUpdate: List<DiskAttachmentVo> = diskAttachmentVos
			.filter { it.diskImageVo.id.isNotEmpty() &&
				existDisksMap.containsKey(it.diskImageVo.id) &&
				!delDiskId.contains(it.id)
			}
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
		val disksToAdd: List<DiskAttachmentVo> = diskAttachmentVos
			.filter { it.diskImageVo.id.isNullOrEmpty() || !existDisksMap.containsKey(it.diskImageVo.id) }

		log.info("manageVmDisks: add:{}, update:{}, remove: {}.", disksToAdd.size, disksToUpdate.size, disksToDel.size)
		// log.info("manageVmDisks: {} to add, {} to update, {} to remove.", disksToAdd.size, disksToUpdate.size, disksToDelete.size)

		// 삭제
		// disksToDelete.forEach { attach ->
		// 	val detachOnly = inputDiskAttachVoMap[attach.id()]?.detachOnly ?: true // 기본값 단순 삭제 (false가 완전삭제)
		// 	log.info("disksToDelete: id={}, detachOnly={}", attach.id(), detachOnly)
		// 	conn.removeDiskAttachmentToVm(vmId, attach.id(), detachOnly)
		// }

		disksToDel.forEach { disk ->
			log.info("disksToDel: id={}, detachOnly={}", disk.id, disk.detachOnly)
			disk.detachOnly?.let { conn.removeDiskAttachmentToVm(vmId, disk.id, it) }
		}

		// 생성
		disksToAdd.forEach {
			log.info("disksToAdd: {}", it.diskImageVo.alias)
			if (it.diskImageVo.id.isEmpty()) { // 디스크 생성
				conn.addDiskAttachmentToVm(vmId, it.toAddDiskAttachment())
			} else { // 디스크 연결
				conn.addDiskAttachmentToVm(vmId, it.toAttachDisk())
			}
		}

		disksToUpdate.forEach {
			log.info("disksToUpdate: {}", it.diskImageVo.alias)
			conn.updateDiskAttachmentToVm(vmId, it.toEditDiskAttachment())
		}
	}

	private fun manageVmCdrom(vmId: String, cdromFileId: String = "") {
		val cdrom = conn.findCdromFromVm(vmId)
			.getOrNull() ?: throw ErrorPattern.CD_ROM_NOT_FOUND.toException()

		log.info("cdrom.filePresent() :{} cdrom: {}", cdrom.filePresent(), cdromFileId)
		try {
			when {
				// CD-ROM 새로 추가
				!cdrom.filePresent() && cdromFileId.isNotEmpty() -> {
					log.info("CD-ROM 추가: cdromFileId={}", cdromFileId)
					conn.addCdromFromVm(vmId, cdromFileId).getOrElse {
						throw RuntimeException("CDROM 추가 실패: isoId=$cdromFileId", it)
					}
				}
				// CD-ROM 변경
				cdrom.filePresent() && (cdrom.file().id() != cdromFileId && cdromFileId.isNotEmpty()) -> {
					log.info("CD-ROM 변경: {} -> {}", cdrom.file().id(), cdromFileId)
					conn.updateCdromFromVm(vmId, cdromFileId).getOrElse {
						throw RuntimeException("CDROM 변경 실패: cdromFileId=$cdromFileId", it)
					}
				}
				// CD-ROM 제거
				cdrom.filePresent() && cdromFileId.isEmpty() -> {
					log.info("CD-ROM 제거: 기존 isoId={}", cdrom.file().id())
					conn.removeCdromFromVm(vmId).getOrElse {
						throw RuntimeException("CDROM 제거 실패: cdromId=${cdrom.id()}", it)
					}
				}
			}
		} catch (e: Exception) {
			log.error("CDROM 처리 중 오류 발생", e)
			throw RuntimeException("CDROM 처리 중 오류 발생", e)
		}
	}



	/*
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
	*/

	// endregion



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
				cdrom.filePresent() && cdromFileId.isNullOrEmpty() -> {
					log.info("updateCdrom ... CD-ROM 삭제 cdromFileId: ")
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

	@Throws(Error::class)
	private fun updateNics(vmVo: VmVo) {
		log.info("updateNics ... vmVo.id: {}", vmVo.id)
		val existingNics = conn.findAllNicsFromVm(vmVo.id).getOrElse {
			throw RuntimeException("NIC 목록 조회 실패", it)
		}
		val existingNicsMap = existingNics.associateBy { it.id() }

		// Step 2: Categorize 변경사항
		val desiredNicIds = vmVo.nicVos.mapNotNull { it.id }.toSet()
		val nics2Remove = existingNics.filter {
			it.id() !in desiredNicIds
		}
		val nics2Add = mutableListOf<NicVo>()
		val nics2Update = mutableListOf<Pair<Nic, NicVo>>()
		for (desiredNic in vmVo.nicVos) {
			if (desiredNic.id.isNullOrBlank()) {
				log.debug("updateNics .... de")
				nics2Add.add(desiredNic) // 신규 NIC 추가
			} else {
				// It has an ID, so it's a potential update.
				val existingNic = existingNicsMap[desiredNic.id]
				if (existingNic != null) {
					// We found a matching NIC. Now check if its properties have changed.
					if (areNicsDifferent(existingNic, desiredNic)) {
						nics2Update.add(existingNic to desiredNic)
					}
				} else {
					// This is an inconsistent state: a desired NIC has an ID but doesn't exist on the VM.
					log.warn("Desired NIC with ID {} not found on VM {}. It will be ignored.", desiredNic.id, vmVo.id)
				}
			}
		}

		log.info("NIC Reconciliation Plan: {} to add, {} to update, {} to remove.", nics2Add.size, nics2Update.size, nics2Remove.size)

		// Step 3: Execute Operations in a safe order
		// 3-1: 제거
		for (nic in nics2Remove) {
			log.info("updateNics ... removing NIC ... id: {}, name: {}", nic.id(), nic.name())
			conn.removeNicFromVm(vmVo.id, nic.id())
		}

		// 3-2: 편집
		for ((existing, desired) in nics2Update) {
			log.info("updateNics ... updating NIC: id={}, name='{}' -> '{}'", existing.id(), existing.name(), desired.name)
			conn.updateNicFromVm( // Assuming you have a method like this
				vmVo.id,
				desired.toEditNic() // Convert your DTO to the SDK object for update
			).getOrElse {
				throw RuntimeException("Failed to update NIC ${existing.id()}: ${it.message}", it)
			}
		}

		// 3-3: 생성
		for (nic in nics2Add) {
			log.info("updateNics ... Adding nic: name={}", nic.name)
			conn.addNicFromVm(
				vmVo.id,
				nic.toAddVmNic()
			).getOrElse {
				throw RuntimeException("NIC 추가 실패 ${it.message}", it)
			}
		}
	}

	/**
	 * Compares an existing oVirt Nic with a desired NicVo to see if an update is needed.
	 * Returns true if they are different, false otherwise.
	 */
	fun areNicsDifferent(existingNic: Nic, desiredNic: NicVo): Boolean {
		// Compare each relevant property. Add more as needed.
		if (existingNic.name() != desiredNic.name) return true
		if (existingNic.vnicProfile()?.id() != desiredNic.vnicProfileVo.id) return true
		if (existingNic.interface_() != desiredNic.interface_.toNicInterface()) return true

		// Example for other properties:
		// if (existingNic.mac()?.address() != desiredNic.macAddress) return true
		// if (existingNic.isPlugged != desiredNic.isPlugged) return true

		// If all properties match, no update is needed.
		return false
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
