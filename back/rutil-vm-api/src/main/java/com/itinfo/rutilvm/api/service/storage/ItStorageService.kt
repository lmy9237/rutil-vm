package com.itinfo.rutilvm.api.service.storage

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.model.computing.*
import com.itinfo.rutilvm.api.model.storage.*
import com.itinfo.rutilvm.api.ovirt.business.StorageTypeB
import com.itinfo.rutilvm.api.repository.engine.AllDisksRepository
import com.itinfo.rutilvm.api.repository.engine.DetailedDiskSnapshot
import com.itinfo.rutilvm.api.repository.engine.DiskVmElementRepository
import com.itinfo.rutilvm.api.repository.engine.ImageRepository
import com.itinfo.rutilvm.api.repository.engine.StorageDomainRepository
import com.itinfo.rutilvm.api.repository.engine.VmRepository
import com.itinfo.rutilvm.api.repository.engine.entity.AllDiskEntity
import com.itinfo.rutilvm.api.repository.engine.entity.StorageDomainEntity
import com.itinfo.rutilvm.api.repository.engine.entity.toDiskEntities
import com.itinfo.rutilvm.api.repository.engine.entity.toStorageDomainEntities
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.common.toUUID
import com.itinfo.rutilvm.util.ovirt.*
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern

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
	 * [ItStorageService.findAllValidStorageDomain]
	 * 전체 스토리지 도메인 목록(glance 와 활성화된 도메인만 출력)
	 *
	 * @return List<[StorageDomainVo]> 스토리지 도메인 목록
	 */
	@Throws(Error::class)
	fun findAllValidStorageDomain(): List<StorageDomainVo>
	/**
	 * [ItStorageService.findAllNfs]
	 * 스토리지 도메인(NFS) 목록
	 *
	 * @return List<[StorageVo]> 스토리지 도메인 목록
	 */
	@Throws(Error::class)
	fun findAllNfs(): List<StorageVo>
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
	 * @return List<[VmVo]> 가상머신 목록
	 */
	@Throws(Error::class)
	fun findAllVmsFromStorageDomain(storageDomainId: String): List<VmVo>
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
	 * [ItStorageService.findAllDisksFromStorageDomain]
	 * 스토리지 도메인 - 디스크 목록
	 *
	 * @param storageDomainId [String] 스토리지 도메인 Id
	 * @return List<[DiskImageVo]> 디스크 목록
	 */
	@Throws(Error::class)
	fun findAllDisksFromStorageDomain(storageDomainId: String): List<DiskImageVo>?
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
	@Autowired private lateinit var rStorageDomains: StorageDomainRepository
	@Autowired private lateinit var rAllDisks: AllDisksRepository
	@Autowired private lateinit var rVms: VmRepository


	@Throws(Error::class)
	override fun findAll(): List<StorageDomainVo> {
		log.info("findAll ...")
		// val res: List<StorageDomain> = conn.findAllStorageDomains().getOrDefault(emptyList())
		// 	.filter { it.storage().type() != StorageType.GLANCE }
		// return res.toStorageDomainsMenu(conn)
		val res: List<StorageDomainEntity> = rStorageDomains.findAllByOrderByStorageNameAsc()
		return res
			.toStorageDomainEntities()
			.filter { it.isNotGlanceStorageType }
	}

	@Throws(Error::class)
	override fun findAllValidStorageDomain(): List<StorageDomainVo> {
		log.info("findAllValidStorageDomain ...")
		val res: List<StorageDomainEntity> = rStorageDomains.findAllByOrderByStorageNameAsc()
		return res
			.toStorageDomainEntities()
			.filter { it.isValidActiveStorageDomain }
	}

	@Throws(Error::class)
	override fun findAllNfs(): List<StorageVo> {
		log.info("findAllNfs ...")
		val res: List<StorageDomain> = conn.findAllStorageDomains().getOrDefault(emptyList())
			.filter { it.storage().type() == StorageType.NFS }
		return res.map { it.storage().toStorageVo() }
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
	override fun findAllVmsFromStorageDomain(storageDomainId: String): List<VmVo> {
		log.info("findAllVmsFromStorageDomain ... storageDomainId: {}", storageDomainId)
		val res: List<Vm> = conn.findAllVmsFromStorageDomain(storageDomainId).getOrDefault(emptyList())
		return res.toVmStorageDomainMenus(conn, storageDomainId)
		// val res: List<VmEntity> = rVms.findAllByClusterIdWithSnapshotsOrderByVmNameAsc(clusterId.toUUID())
		// return res.toVmVosFromVmEntities()
	}


	@Throws(Error::class)
	override fun findAllTemplatesFromStorageDomain(storageDomainId: String): List<TemplateVo> {
		log.info("findAllTemplatesFromStorageDomain ... storageDomainId: {}", storageDomainId)
		val res: List<Template> = conn.findAllTemplatesFromStorageDomain(storageDomainId).getOrDefault(emptyList())
		return res.toStorageTemplates(conn, storageDomainId)
	}

	@Throws(Error::class)
	override fun findAllDisksFromStorageDomain(storageDomainId: String): List<DiskImageVo>? {
		log.info("findAllDisksFromStorageDomain ... storageDomainId: {}", storageDomainId)
		// val res: List<Disk> = conn.findAllDisksFromStorageDomain(storageDomainId)
		// 	.getOrDefault(emptyList())
		// return res.toDomainDiskMenus(conn)
		val res: List<AllDiskEntity>? = rAllDisks.findByStorageId(storageDomainId)
		return res?.toDiskEntities()
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
