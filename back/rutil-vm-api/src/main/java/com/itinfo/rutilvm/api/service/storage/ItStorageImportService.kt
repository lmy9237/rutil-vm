package com.itinfo.rutilvm.api.service.storage

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.model.*
import com.itinfo.rutilvm.api.model.computing.*
import com.itinfo.rutilvm.api.model.storage.*
import com.itinfo.rutilvm.api.repository.engine.UnregisteredDiskRepository
import com.itinfo.rutilvm.api.repository.engine.UnregisteredOvfOfEntitiesRepository
import com.itinfo.rutilvm.api.repository.engine.entity.UnregisteredDiskEntity
import com.itinfo.rutilvm.api.repository.engine.entity.UnregisteredOvfOfEntities
import com.itinfo.rutilvm.api.repository.engine.entity.toUnregisteredDiskImageVos
import com.itinfo.rutilvm.api.repository.engine.entity.toUnregisteredVms
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.common.toUUID
import com.itinfo.rutilvm.util.ovirt.*

import org.ovirt.engine.sdk4.builders.*
import org.ovirt.engine.sdk4.services.*
import org.ovirt.engine.sdk4.types.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.util.*

import javax.net.ssl.*
import kotlin.Error

interface ItStorageImportService {
	/**
	 * [ItStorageImportService.findAllUnregisteredVmsFromStorageDomain]
	 * 스토리지도메인 - 가상머신 가져오기 목록
	 *
	 * @param storageDomainId [String] 스토리지 도메인 Id
	 * @return List<[VmVo]> 가상머신 목록
	 */
	@Throws(Error::class)
	fun findAllUnregisteredVmsFromStorageDomain(storageDomainId: String): List<VmVo>
	/**
	 * [ItStorageImportService.registeredVmFromStorageDomain]
	 * 스토리지도메인 - 가상머신 가져오기
	 *
	 * @param storageDomainId [String] 스토리지 도메인 Id
	 * @param vmVo [VmVo] 가상머신
	 * @param partialAllow [Boolean] 부분허용
	 * @param relocation [Boolean] 불량 MAC 재배치
	 * @return [Boolean]
	 */
	@Throws(Error::class)
	fun registeredVmFromStorageDomain(storageDomainId: String, vmVo: VmVo, partialAllow: Boolean, relocation: Boolean): Boolean
	/**
	 * [ItStorageImportService.removeUnregisteredVmFromStorageDomain]
	 * 스토리지 도메인 가상머신 가져오기 삭제
	 *
	 * @param storageDomainId [String] 스토리지 도메인 Id
	 * @param vmId [String] 가상머신 Id
	 * @return [Boolean]
	 */
	@Throws(Error::class)
	fun removeUnregisteredVmFromStorageDomain(storageDomainId: String, vmId: String): Boolean

	/**
	 * [ItStorageImportService.findAllUnregisteredTemplatesFromStorageDomain]
	 * 스토리지도메인 - 템플릿 가져오기 목록
	 *
	 * @param storageDomainId [String] 스토리지 도메인 Id
	 * @return List<[TemplateVo]> 템플릿 목록
	 */
	@Throws(Error::class)
	fun findAllUnregisteredTemplatesFromStorageDomain(storageDomainId: String): List<TemplateVo>
	/**
	 * [ItStorageImportService.registeredTemplateFromStorageDomain]
	 * 스토리지도메인 - 템플릿 가져오기
	 *
	 * @param storageDomainId [String] 스토리지 도메인 Id
	 * @param templateVo [TemplateVo] 템플릿
	 * @return [Boolean]
	 */
	@Throws(Error::class)
	fun registeredTemplateFromStorageDomain(storageDomainId: String, templateVo: TemplateVo): Boolean
	/**
	 * [ItStorageImportService.removeUnregisteredTemplateFromStorageDomain]
	 * 스토리지 도메인 템플릿 가져오기 삭제
	 *
	 * @param storageDomainId [String] 스토리지 도메인 Id
	 * @param templateId [String] 템플릿 Id
	 * @return [Boolean]
	 */
	@Throws(Error::class)
	fun removeUnregisteredTemplateFromStorageDomain(storageDomainId: String, templateId: String): Boolean

	/**
	 * [ItStorageImportService.findAllUnregisteredDisksFromStorageDomain]
	 * 스토리지 도메인 - 디스크 불러오기 목록
	 *
	 * @param storageDomainId [String] 스토리지 도메인 Id
	 * @return List<[DiskImageVo]> 디스크 목록
	 */
	@Throws(Error::class)
	fun findAllUnregisteredDisksFromStorageDomain(storageDomainId: String): List<DiskImageVo>
	/**
	 * [ItStorageImportService.findUnregisteredDiskFromStorageDomain]
	 * 스토리지 도메인 - 디스크 불러오기
	 *
	 * @param storageDomainId [String] 스토리지 도메인 Id
	 * @param diskId [String] 디스크 Id
	 */
	@Throws(Error::class)
	fun findUnregisteredDiskFromStorageDomain(storageDomainId: String, diskId: String): DiskImageVo?
	/**
	 * [ItStorageImportService.registeredDiskFromStorageDomain]
	 * 스토리지 도메인 - 디스크 불러오기 - 가져오기
	 *
	 * @param storageDomainId [String] 스토리지 도메인 Id
	 * @param diskImageVo [DiskImageVo] 디스크
	 * @return [DiskImageVo]
	 */
	@Throws(Error::class)
	fun registeredDiskFromStorageDomain(storageDomainId: String, diskImageVo: DiskImageVo): DiskImageVo?
	/**
	 * [ItStorageImportService.removeUnregisteredDiskFromStorageDomain]
	 * 스토리지 도메인 디스크 가져오기 삭제
	 *
	 * @param storageDomainId [String] 스토리지 도메인 Id
	 * @param diskId [String] 디스크 Id
	 * @return [Boolean]
	 */
	@Throws(Error::class)
	fun removeUnregisteredDiskFromStorageDomain(storageDomainId: String, diskId: String): Boolean
}

@Service
class StorageImportServiceImpl(
): BaseService(), ItStorageImportService {
	@Autowired private lateinit var rUnregisteredDisks: UnregisteredDiskRepository
	@Autowired private lateinit var rUnregisteredOvfOfEntities: UnregisteredOvfOfEntitiesRepository

	@Throws(Error::class)
	override fun findAllUnregisteredVmsFromStorageDomain(storageDomainId: String): List<VmVo> {
		log.info("findAllUnregisteredVmsFromStorageDomain ... storageDomainId: {}", storageDomainId)
		val res: List<Vm> = conn.findAllUnregisteredVmsFromStorageDomain(storageDomainId)
			.getOrDefault(emptyList())
		val unregisteredOvfOfEntities: List<UnregisteredOvfOfEntities> =
			rUnregisteredOvfOfEntities.findByIdStorageDomainId(storageDomainId.toUUID()).filter {
				it.entityType == "vm".uppercase()
			}
		return unregisteredOvfOfEntities.toUnregisteredVms(res)
	}

	@Throws(Error::class)
	override fun registeredVmFromStorageDomain(storageDomainId: String, vmVo: VmVo, partialAllow: Boolean, relocation: Boolean): Boolean {
		log.info("registeredVmFromStorageDomain ... storageDomainId: {}, vmId: {}, allowPart: {}, badMac: {}", storageDomainId, vmVo.id, partialAllow, relocation)
		val res: Result<Boolean> = conn.registeredVmFromStorageDomain(
			storageDomainId,
			vmVo.toRegisterVm(),
			partialAllow,
			relocation
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
			templateVo.toRegisterTemplate()
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
	override fun findAllUnregisteredDisksFromStorageDomain(storageDomainId: String): List<DiskImageVo> {
		log.info("findAllUnregisteredDisksFromStorageDomain ... storageDomainId: {}", storageDomainId)
		val unregisteredDisksFromDB: List<UnregisteredDiskEntity> =
			rUnregisteredDisks.findByStorageDomainIdWithDetails(storageDomainId.toUUID())
				.filter { it.diskToVmEntries.isEmpty() }
		val disksFound: List<Disk> = conn.findAllUnregisteredDisksFromStorageDomain(storageDomainId)
			.getOrDefault(emptyList())
		return unregisteredDisksFromDB.toUnregisteredDiskImageVos(disksFound)
	}

	@Throws(Error::class)
	override fun findUnregisteredDiskFromStorageDomain(storageDomainId: String, diskId: String): DiskImageVo? {
		log.info("findUnregisteredDiskFromStorageDomain ... storageDomainId: {}, diskId: {}", storageDomainId, diskId)
		val res: Disk? = conn.findAllUnregisteredDisksFromStorageDomain(storageDomainId)
			.getOrDefault(emptyList())
			.firstOrNull { disk -> disk.id() == diskId }
		return res?.toUnregisterdDisk()
	}

	@Throws(Error::class)
	override fun registeredDiskFromStorageDomain(storageDomainId: String, diskImageVo: DiskImageVo): DiskImageVo? {
		log.info("registeredDiskFromStorageDomain ... storageDomainId: {}, diskImageVo: {}", storageDomainId, diskImageVo)
		val res: Disk? = conn.registeredDiskFromStorageDomain(
			storageDomainId,
			diskImageVo.toRegisterDiskBuilder()
		).getOrNull()
		return res?.toDiskIdName()
	}

	@Throws(Error::class)
	override fun removeUnregisteredDiskFromStorageDomain(storageDomainId: String, diskId: String): Boolean {
		log.info("removeUnregisteredDiskFromStorageDomain ... storageDomainId: {}, diskId: {}", storageDomainId, diskId)
		val res: Result<Boolean> = conn.removeRegisteredDiskFromStorageDomain(storageDomainId, diskId)
		return res.isSuccess
	}


	companion object {
		private val log by LoggerDelegate()
	}
}
