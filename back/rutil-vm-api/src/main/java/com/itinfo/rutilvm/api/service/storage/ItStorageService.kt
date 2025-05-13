package com.itinfo.rutilvm.api.service.storage

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.model.computing.*
import com.itinfo.rutilvm.api.model.storage.*
import com.itinfo.rutilvm.api.repository.engine.DetailedDiskSnapshot
import com.itinfo.rutilvm.api.repository.engine.DiskVmElementRepository
import com.itinfo.rutilvm.api.repository.engine.ImageRepository
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.common.toUUID
import com.itinfo.rutilvm.util.ovirt.*
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern

import org.ovirt.engine.sdk4.builders.*
import org.ovirt.engine.sdk4.types.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

import kotlin.Error

interface ItStorageService {
	/**
	 * [ItStorageService.findAll]
	 * 전체 스토리지 도메인 목록
	 *
	 * @return List<[StorageDomainVo]> 스토리지 도메인 목록
	 */
	@Throws(Error::class)
	fun findAll(): List<StorageDomainVo>
	/**
	 * [ItStorageService.findOne]
	 * 데이터센터 - 스토리지 도메인 정보
	 *
	 * @param storageDomainId [String] 스토리지 도메인 Id
	 * @return [StorageDomainVo]?
	 */
	@Throws(Error::class)
	fun findOne(storageDomainId: String): StorageDomainVo?

	/**
	 * [ItStorageService.add]
	 * 도메인 생성
	 *
	 * @param storageDomainVo [StorageDomainVo]
	 * @return [StorageDomainVo]?
	 */
	@Throws(Error::class)
	fun add(storageDomainVo: StorageDomainVo): StorageDomainVo?
	/**
	 * [ItStorageService.import]
	 * 도메인 가져오기
	 *
	 * @param storageDomainVo [StorageDomainVo]
	 * @return [StorageDomainVo]?
	 */
	@Throws(Error::class)
	fun import(storageDomainVo: StorageDomainVo): StorageDomainVo?
	/**
	 * [ItStorageService.update]
	 * 도메인 편집(관리)
	 *
	 * @param storageDomainVo [StorageDomainVo]
	 * @return [StorageDomainVo]?
	 */
	@Throws(Error::class)
	fun update(storageDomainVo: StorageDomainVo): StorageDomainVo?
	/**
	 * [ItStorageService.remove]
	 * 도메인 삭제
	 *
	 * @param storageDomainId [String] 스토리지 도메인 Id
	 * @param format [Boolean]
	 * @param hostName [String] 호스트 이름이 들어가야 삭제가능
	 * @return [Boolean]
	 */
	@Throws(Error::class)
	fun remove(storageDomainId: String, format: Boolean, hostName: String?): Boolean
	/**
	 * [ItStorageService.destroy]
	 * 도메인 파괴
	 *
	 * @param storageDomainId [String] 스토리지 도메인 Id
	 * @return [Boolean]
	 */
	@Throws(Error::class)
	fun destroy(storageDomainId: String): Boolean
	/**
	 * [ItStorageService.updateOvfFromStorageDomain]
	 * 도메인 ovf 업데이트
	 *
	 * @param storageDomainId [String] 스토리지 도메인 Id
	 * @return [Boolean]
	 */
	@Throws(Error::class)
	fun updateOvfFromStorageDomain(storageDomainId: String): Boolean
	/**
	 * [ItStorageService.refreshLunFromStorageDomain]
	 * 도메인 디스크 검사
	 *
	 * @param storageDomainId [String] 스토리지 도메인 Id
	 * @return [Boolean]
	 */
	@Throws(Error::class)
	fun refreshLunFromStorageDomain(storageDomainId: String): Boolean

	/**
	 * [ItStorageService.findAllVmsFromStorageDomain]
	 * 스토리지도메인 - 가상머신 목록
	 *
	 * @param storageDomainId [String] 스토리지 도메인 Id
	 * @return List<[VmViewVo]> 가상머신 목록
	 */
	@Throws(Error::class)
	fun findAllVmsFromStorageDomain(storageDomainId: String): List<VmViewVo>
	/**
	 * [ItStorageService.findAllUnregisteredVmsFromStorageDomain]
	 * 스토리지도메인 - 가상머신 가져오기 목록
	 *
	 * @param storageDomainId [String] 스토리지 도메인 Id
	 * @return List<[VmViewVo]> 가상머신 목록
	 */
	@Throws(Error::class)
	fun findAllUnregisteredVmsFromStorageDomain(storageDomainId: String): List<VmViewVo>
	/**
	 * [ItStorageService.registeredVmFromStorageDomain]
	 * 스토리지도메인 - 가상머신 가져오기
	 *
	 * @param storageDomainId [String] 스토리지 도메인 Id
 	 * @param vmViewVo [VmViewVo] 가상머신
 	 * @param allowPart [Boolean] 부분허용
 	 * @param badMac [Boolean] 불량 MAC 재배치
	 * @return [Boolean]
	 */
	@Throws(Error::class)
	fun registeredVmFromStorageDomain(storageDomainId: String, vmViewVo: VmViewVo, allowPart: Boolean, badMac: Boolean): Boolean
	/**
	 * [ItStorageService.removeUnregisteredVmFromStorageDomain]
	 * 스토리지 도메인 가상머신 가져오기 삭제
	 *
	 * @param storageDomainId [String] 스토리지 도메인 Id
	 * @param vmId [String] 가상머신 Id
	 * @return [Boolean]
	 */
	@Throws(Error::class)
	fun removeUnregisteredVmFromStorageDomain(storageDomainId: String, vmId: String): Boolean
	/**
	 * [ItStorageService.findAllTemplatesFromStorageDomain]
	 * 스토리지도메인 - 템플릿 목록
	 *
	 * @param storageDomainId [String] 스토리지 도메인 Id
	 * @return List<[TemplateVo]> 템플릿 목록
	 */
	@Throws(Error::class)
	fun findAllTemplatesFromStorageDomain(storageDomainId: String): List<TemplateVo>
	/**
	 * [ItStorageService.findAllTemplatesFromStorageDomain]
	 * 스토리지도메인 - 템플릿 가져오기 목록
	 *
	 * @param storageDomainId [String] 스토리지 도메인 Id
	 * @return List<[TemplateVo]> 템플릿 목록
	 */
	@Throws(Error::class)
	fun findAllUnregisteredTemplatesFromStorageDomain(storageDomainId: String): List<TemplateVo>
	/**
	 * [ItStorageService.registeredTemplateFromStorageDomain]
	 * 스토리지도메인 - 템플릿 가져오기
	 *
	 * @param storageDomainId [String] 스토리지 도메인 Id
	 * @param templateVo [TemplateVo] 템플릿
	 * @return [Boolean]
	 */
	@Throws(Error::class)
	fun registeredTemplateFromStorageDomain(storageDomainId: String, templateVo: TemplateVo): Boolean
	/**
	 * [ItStorageService.removeUnregisteredTemplateFromStorageDomain]
	 * 스토리지 도메인 템플릿 가져오기 삭제
	 *
	 * @param storageDomainId [String] 스토리지 도메인 Id
	 * @param templateId [String] 템플릿 Id
	 * @return [Boolean]
	 */
	@Throws(Error::class)
	fun removeUnregisteredTemplateFromStorageDomain(storageDomainId: String, templateId: String): Boolean
	/**
	 * [ItStorageService.findAllDisksFromStorageDomain]
	 * 스토리지 도메인 - 디스크 목록
	 *
	 * @param storageDomainId [String] 스토리지 도메인 Id
	 * @return List<[DiskImageVo]> 디스크 목록
	 */
	@Throws(Error::class)
	fun findAllDisksFromStorageDomain(storageDomainId: String): List<DiskImageVo>
	/**
	 * [ItStorageService.findAllUnregisteredDisksFromStorageDomain]
	 * 스토리지 도메인 - 디스크 불러오기 목록
	 *
	 * @param storageDomainId [String] 스토리지 도메인 Id
	 * @return List<[DiskImageVo]> 디스크 목록
	 */
	@Throws(Error::class)
	fun findAllUnregisteredDisksFromStorageDomain(storageDomainId: String): List<DiskImageVo>
	/**
	 * [ItStorageService.registeredDiskFromStorageDomain]
	 * 스토리지 도메인 - 디스크 불러오기 - 가져오기
	 *
	 * @param storageDomainId [String] 스토리지 도메인 Id
	 // * @param diskImageVo [DiskImageVo] 디스크
	 * @return [Boolean]
	 */
	@Throws(Error::class)
	fun registeredDiskFromStorageDomain(storageDomainId: String, diskId: String): Boolean
	/**
	 * [ItStorageService.removeUnregisteredDiskFromStorageDomain]
	 * 스토리지 도메인 디스크 가져오기 삭제
	 *
	 * @param storageDomainId [String] 스토리지 도메인 Id
	 * @param diskId [String] 디스크 Id
	 * @return [Boolean]
	 */
	@Throws(Error::class)
	fun removeUnregisteredDiskFromStorageDomain(storageDomainId: String, diskId: String): Boolean
	/**
	 * [ItStorageService.findAllDiskSnapshotsFromStorageDomain]
	 * 스토리지 도메인 - 디스크 스냅샷 목록
	 *
	 * @param storageDomainId [String] 스토리지 도메인 Id
	 * @return List<[SnapshotDiskVo]> 디스크 스냅샷 목록
	 */
	@Throws(Error::class)
	fun findAllDiskSnapshotsFromStorageDomain(storageDomainId: String): List<SnapshotDiskVo>
	/**
	 * [ItStorageService.findAllDiskProfilesFromStorageDomain]
	 * 스토리지 도메인 - 디스크 프로파일 목록
	 *
	 * @param storageDomainId [String] 스토리지 도메인 Id
	 * @return List<[DiskProfileVo]> 디스크 프로파일 목록
	 */
	@Throws(Error::class)
	fun findAllDiskProfilesFromStorageDomain(storageDomainId: String): List<DiskProfileVo>
//	/**
//	 * [ItStorageService.addDiskProfileFromStorageDomain]
//	 * 스토리지 도메인 - 디스크 프로파일 생성
//	 *
//	 * @param diskProfileVo [DiskProfileVo]
//	 * @return [DiskProfileVo]
//	 */
//	@Throws(Error::class)
//	fun addDiskProfileFromStorageDomain(diskProfileVo: DiskProfileVo): DiskProfileVo?
//	/**
//	 * [ItStorageService.updateDiskProfileFromStorageDomain]
//	 * 스토리지 도메인 - 디스크 프로파일 편집
//	 *
//	 * @param diskProfileVo [DiskProfileVo]
//	 * @return [DiskProfileVo]
//	 */
//	@Throws(Error::class)
//	fun updateDiskProfileFromStorageDomain(diskProfileVo: DiskProfileVo): DiskProfileVo?
//	/**
//	 * [ItStorageService.removeDiskProfileFromStorageDomain]
//	 * 스토리지 도메인 - 디스크 프로파일 삭제
//	 *
//	 * @param diskProfileId [String]
//	 * @return [Boolean]
//	 */
//	@Throws(Error::class)
//	fun removeDiskProfileFromStorageDomain(diskProfileId: String): Boolean

	/**
	 * [ItStorageService.findAllEventsFromStorageDomain]
	 * 스토리지도메인 - 이벤트
	 *
	 * @param storageDomainId [String] 스토리지 도메인 Id
	 * @return List<[EventVo]>
	 */
	@Throws(Error::class)
	fun findAllEventsFromStorageDomain(storageDomainId: String): List<EventVo>
}

@Service
class StorageServiceImpl(
): BaseService(), ItStorageService {
	@Autowired private lateinit var diskVmElementRepository: DiskVmElementRepository

	@Throws(Error::class)
	override fun findAll(): List<StorageDomainVo> {
		log.info("findAll ...")
		val res: List<StorageDomain> = conn.findAllStorageDomains().getOrDefault(emptyList())
			.filter { it.storage().type() != StorageType.GLANCE }
		return res.toStorageDomainsMenu(conn)
	}

	@Throws(Error::class)
	override fun findOne(storageDomainId: String): StorageDomainVo? {
		log.info("findOne... ")
		val res: StorageDomain? = conn.findStorageDomain(storageDomainId, follow = "disks,diskprofiles").getOrNull()
		return res?.toStorageDomainInfoVo(conn)
	}

	@Throws(Error::class)
	override fun add(storageDomainVo: StorageDomainVo): StorageDomainVo? {
		log.info("add ... storageDomain name: {}", storageDomainVo.name)
		val res: StorageDomain? = conn.addStorageDomain(
			storageDomainVo.toAddStorageDomain(),
			storageDomainVo.dataCenterVo.id
		).getOrNull()
		return res?.toStorageDomainInfoVo(conn)
	}

	@Throws(Error::class)
	override fun import(storageDomainVo: StorageDomainVo): StorageDomainVo? {
		log.info("import ... storageDomain name: {}", storageDomainVo.name)

		val res: StorageDomain? = conn.importStorageDomain(
			storageDomainVo.toImportStorageDomain(),
			storageDomainVo.dataCenterVo.id
		).getOrNull()
		return res?.toStorageDomainInfoVo(conn)
	}

	@Throws(Error::class)
	override fun update(storageDomainVo: StorageDomainVo): StorageDomainVo? {
		log.info("update ... storageDomain name: {}", storageDomainVo.name)
		val res: StorageDomain? = conn.updateStorageDomain(
			storageDomainVo.id,
			storageDomainVo.toEditStorageDomain(),
		).getOrNull()
		return res?.toStorageDomainInfoVo(conn)
	}

	@Throws(Error::class)
	override fun remove(storageDomainId: String, format: Boolean, hostName: String?): Boolean {
		log.info("remove ... storageDomainId: {}", storageDomainId)
		val res: Result<Boolean> = conn.removeStorageDomain(storageDomainId, format, hostName)
		return res.isSuccess
	}

	@Throws(Error::class)
	override fun destroy(storageDomainId: String): Boolean {
		log.info("destroy ... storageDomainId: {}", storageDomainId)
		val res: Result<Boolean> = conn.destroyStorageDomain(storageDomainId)
		return res.isSuccess
	}

	@Throws(Error::class)
	override fun updateOvfFromStorageDomain(storageDomainId: String): Boolean {
		log.info("updateOvfFromStorageDomain ... storageDomainId: {}", storageDomainId)
		val res: Result<Boolean> = conn.updateOvfStorageDomain(storageDomainId)
		return res.isSuccess
	}

	@Throws(Error::class)
	override fun refreshLunFromStorageDomain(storageDomainId: String): Boolean {
		log.info("refreshLunFromStorageDomain ... storageDomainId: {}", storageDomainId)
		val res: Result<Boolean> = conn.refreshLunStorageDomain(storageDomainId)
		return res.isSuccess
	}


	@Throws(Error::class)
	override fun findAllVmsFromStorageDomain(storageDomainId: String): List<VmViewVo> {
		log.info("findAllVmsFromStorageDomain ... storageDomainId: {}", storageDomainId)
		val res: List<Vm> = conn.findAllVmsFromStorageDomain(storageDomainId).getOrDefault(emptyList())
		return res.toVmStorageDomainMenus(conn, storageDomainId)
	}

    @Throws(Error::class)
    override fun findAllUnregisteredVmsFromStorageDomain(storageDomainId: String): List<VmViewVo> {
        log.info("findAllUnregisteredVmsFromStorageDomain ... storageDomainId: {}", storageDomainId)
        val res: List<Vm> = conn.findAllUnregisteredVmsFromStorageDomain(storageDomainId).getOrDefault(emptyList())
        return res.toUnregisterdVms()
    }

	@Throws(Error::class)
	override fun registeredVmFromStorageDomain(storageDomainId: String, vmViewVo: VmViewVo, allowPart: Boolean, badMac: Boolean): Boolean {
		log.info("registeredVmFromStorageDomain ... storageDomainId: {}, vmId: {}, allowPart: {}, badMac: {}", storageDomainId, vmViewVo.id, allowPart, badMac)
		val res: Result<Boolean> = conn.registeredVmFromStorageDomain(
			storageDomainId,
			VmBuilder().id(vmViewVo.id).name(vmViewVo.name).cluster(ClusterBuilder().id(vmViewVo.clusterVo.id)).build(),
			allowPart,
			badMac
		)
		return res.isSuccess
	}

	@Throws(Error::class)
	override fun removeUnregisteredVmFromStorageDomain(storageDomainId: String, vmId: String): Boolean {
		log.info("removeUnregisteredVmFromStorageDomain ... storageDomainId: {}, vmId: {}", storageDomainId, vmId)
		val res: Result<Boolean> = conn.removeRegisteredVmFromStorageDomain(storageDomainId, vmId)
		return res.isSuccess
	}

	@Throws(Error::class)
	override fun findAllTemplatesFromStorageDomain(storageDomainId: String): List<TemplateVo> {
		log.info("findAllTemplatesFromStorageDomain ... storageDomainId: {}", storageDomainId)
		val res: List<Template> = conn.findAllTemplatesFromStorageDomain(storageDomainId).getOrDefault(emptyList())
		return res.toStorageTemplates(conn)
	}

	@Throws(Error::class)
	override fun findAllUnregisteredTemplatesFromStorageDomain(storageDomainId: String): List<TemplateVo> {
		log.info("findAllUnregisteredTemplatesFromStorageDomain ... storageDomainId: {}", storageDomainId)
		val res: List<Template> = conn.findAllUnregisteredTemplatesFromStorageDomain(storageDomainId).getOrDefault(emptyList())
		return res.toUnregisterdTemplates()
	}

	@Throws(Error::class)
	override fun registeredTemplateFromStorageDomain(storageDomainId: String, templateVo: TemplateVo): Boolean {
		log.info("registeredTemplateFromStorageDomain ... storageDomainId: {}, templateVo: {}", storageDomainId, templateVo)
		val res: Result<Boolean> = conn.registeredTemplateFromStorageDomain(
			storageDomainId,
			TemplateBuilder().id(templateVo.id).cluster(ClusterBuilder().id(templateVo.clusterVo.id)).build()
		)
		return res.isSuccess
	}

	@Throws(Error::class)
	override fun removeUnregisteredTemplateFromStorageDomain(storageDomainId: String, templateId: String): Boolean {
		log.info("removeUnregisteredTemplateFromStorageDomain ... storageDomainId: {}, templateId: {}", storageDomainId, templateId)
		val res: Result<Boolean> = conn.removeRegisteredTemplateFromStorageDomain(storageDomainId, templateId)
		return res.isSuccess
	}

	@Throws(Error::class)
	override fun findAllDisksFromStorageDomain(storageDomainId: String): List<DiskImageVo> {
		log.info("findAllDisksFromStorageDomain ... storageDomainId: {}", storageDomainId)
		val res: List<Disk> = conn.findAllDisksFromStorageDomain(storageDomainId, follow = "storagedomain").getOrDefault(emptyList())
		return res.toDomainDiskMenus(conn)
	}

    @Throws(Error::class)
    override fun findAllUnregisteredDisksFromStorageDomain(storageDomainId: String): List<DiskImageVo> {
        log.info("findAllUnregisteredDisksFromStorageDomain ... storageDomainId: {}", storageDomainId)
        val res: List<Disk> = conn.findAllUnregisteredDisksFromStorageDomain(storageDomainId)
            .getOrDefault(emptyList())
        return res.toUnregisterdDisks()
    }

	@Throws(Error::class)
	override fun registeredDiskFromStorageDomain(storageDomainId: String, diskId: String): Boolean {
		log.info("registeredDiskFromStorageDomain ... storageDomainId: {}, diskId: {}", storageDomainId, diskId)
		val res: Result<Boolean> = conn.registeredDiskFromStorageDomain(storageDomainId, diskId)
		return res.isSuccess
	}

	@Throws(Error::class)
	override fun removeUnregisteredDiskFromStorageDomain(storageDomainId: String, diskId: String): Boolean {
		log.info("removeUnregisteredDiskFromStorageDomain ... storageDomainId: {}, diskId: {}", storageDomainId, diskId)
		val res: Result<Boolean> = conn.removeRegisteredDiskFromStorageDomain(storageDomainId, diskId)
		return res.isSuccess
	}

	@Autowired private lateinit var rImage: ImageRepository

	@Throws(Error::class)
	override fun findAllDiskSnapshotsFromStorageDomain(storageDomainId: String): List<SnapshotDiskVo> {
		log.info("findAllDiskSnapshotsFromStorageDomain ... storageDomainId: {}", storageDomainId)
		val diskSnapshots: List<DiskSnapshot> = conn.findAllDiskSnapshotsFromStorageDomain(storageDomainId)
			.getOrDefault(emptyList())
		val allVms: List<Vm> = conn.findAllVms(follow = "snapshots").getOrDefault(emptyList())
		val res = diskSnapshots.filter { diskSnapshot ->
			allVms.any { vm -> conn.findSnapshotFromVm(vm.id(), diskSnapshot.snapshot().id()).getOrNull() != null }
		}
		val rDiskSnapshots: List<DetailedDiskSnapshot> = rImage.findDiskSnapshotsByStorageDomain(storageDomainId.toUUID())
		log.info("findAllDiskSnapshotsFromStorageDomain ... storageDomainId: {}, rDiskSnapshots: {}", storageDomainId, rDiskSnapshots)
		return res.toSnapshotDiskVos(rDiskSnapshots)
	}


	@Throws(Error::class)
	override fun findAllDiskProfilesFromStorageDomain(storageDomainId: String): List<DiskProfileVo> {
		log.info("findAllDiskProfilesFromStorageDomain ... storageDomainId: {}", storageDomainId)
		val res: List<DiskProfile> = conn.findAllDiskProfilesFromStorageDomain(storageDomainId)
			.getOrDefault(emptyList())
		return res.toDiskProfileVos()
	}

//	@Throws(Error::class)
//	override fun addDiskProfileFromStorageDomain(diskProfileVo: DiskProfileVo): DiskProfileVo? {
//		log.info("addDiskProfileFromStorageDomain ...")
//		val res: DiskProfile? =
//			conn.addDiskProfile(diskProfileVo.toAddDiskProfileBuilder())
//				.getOrNull()
//		return res?.toDiskProfileVo()
//	}
//
//	@Throws(Error::class)
//	override fun updateDiskProfileFromStorageDomain(diskProfileVo: DiskProfileVo): DiskProfileVo? {
//		log.info("updateDiskProfileFromStorageDomain ...")
//		val res: DiskProfile? =
//			conn.updateDiskProfile(diskProfileVo.toEditDiskProfileBuilder())
//				.getOrNull()
//		return res?.toDiskProfileVo()
//	}
//
//	@Throws(Error::class)
//	override fun removeDiskProfileFromStorageDomain(diskProfileId: String): Boolean {
//		log.info("removeDiskProfileFromStorageDomain ...")
//		val res: Result<Boolean> =
//			conn.removeDiskProfile(diskProfileId)
//		return res.isSuccess
//	}

	@Throws(Error::class)
	override fun findAllEventsFromStorageDomain(storageDomainId: String): List<EventVo> {
		log.info("findAllEventsFromStorageDomain ... storageDomainId: {}", storageDomainId)
		val storageDomain: StorageDomain = conn.findStorageDomain(storageDomainId)
			.getOrNull() ?: throw ErrorPattern.STORAGE_DOMAIN_ID_NOT_FOUND.toException()
		val res: List<Event> = conn.findAllEvents("sortby time desc").getOrDefault(emptyList())
			.filter {event ->
				event.storageDomainPresent() &&
					(event.storageDomain().idPresent() && event.storageDomain().id().equals(storageDomainId) || (event.storageDomain().namePresent() && event.storageDomain().name().equals(storageDomain.name())) )
			}
		return res.toEventVos()
	}



	companion object {
		private val log by LoggerDelegate()
	}
}
