package com.itinfo.rutilvm.api.service.computing

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.model.computing.HostStorageVo
import com.itinfo.rutilvm.api.model.computing.toHostStorageVos
import com.itinfo.rutilvm.api.model.storage.IscsiDetailVo
import com.itinfo.rutilvm.api.model.storage.LogicalUnitVo
import com.itinfo.rutilvm.api.model.storage.StorageDomainVo
import com.itinfo.rutilvm.api.model.storage.toBlockLogicalUnitVos
import com.itinfo.rutilvm.api.model.storage.toDiscoverIscsiDetailVo
import com.itinfo.rutilvm.api.model.storage.toStorageDomainInfoVos
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.util.ovirt.*

import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.types.HostStorage
import org.ovirt.engine.sdk4.types.LogicalUnit
import org.ovirt.engine.sdk4.types.StorageDomain
import org.ovirt.engine.sdk4.types.StorageType
import org.springframework.stereotype.Service

interface ItHostStorageService {
	/**
	 * [ItHostStorageService.findAllFromHost]
	 * 도메인 생성 -
	 *
	 * @param hostId [String] 호스트 Id
	 * @return List<[HostStorageVo]>
	 */
	@Throws(Error::class)
	fun findAllFromHost(hostId: String): List<HostStorageVo>
	/**
	 * [ItHostStorageService.findAllIscsiFromHost]
	 * 도메인 생성 - iSCSI 유형 대상 LUN 목록
	 * 이미 검색을 통해 등록이 된 스토리지?
	 *
	 * @param hostId [String] 호스트 Id
	 * @return List<[HostStorageVo]>
	 */
	@Throws(Error::class)
	fun findAllIscsiFromHost(hostId: String): List<HostStorageVo>
	/**
	 * [ItHostStorageService.findAllFibreFromHost]
	 * 도메인 생성 - Fibre Channel 유형 대상 LUN 목록
	 * 타입이 tcp로 뜸
	 *
	 * @param hostId [String] 호스트 Id
	 * @return List<[HostStorageVo]>
	 */
	@Throws(Error::class)
	fun findAllFibreFromHost(hostId: String): List<HostStorageVo>

	/**
	 * [ItHostStorageService.findImportIscsiFromHost]
	 * 도메인 가져오기 - iSCSI 유형 대상 LUN 목록
	 *
	 * @param hostId [String] 호스트 Id
	 * @param iscsiDetailVo [IscsiDetailVo]
	 * @return List<[LogicalUnitVo]>
	 */
	@Throws(Error::class)
	fun findImportIscsiFromHost(hostId: String, iscsiDetailVo: IscsiDetailVo): List<LogicalUnitVo>
	/**
	 * [ItHostStorageService.findUnregisterDomainFromHost]
	 * 도메인 가져오기 - iSCSI 유형 대상 LUN 목록
	 *
	 * @param hostId [String] 호스트 Id
	 * @return List<[StorageDomainVo]>
	 */
	@Throws(Error::class)
	fun findUnregisterDomainFromHost(hostId: String): List<StorageDomainVo>
}

@Service
class ItHostStorageServiceImpl(
): BaseService(), ItHostStorageService {

	@Throws(Error::class)
	override fun findAllFromHost(hostId: String): List<HostStorageVo> {
		log.info("findAllFromHost... hostId: {}", hostId)
		val res: List<HostStorage> = conn.findAllHostStoragesFromHost(hostId).getOrDefault(emptyList())
		return res.toHostStorageVos()
	}

	@Throws(Error::class)
	override fun findAllIscsiFromHost(hostId: String): List<HostStorageVo> {
		log.info("findAllIscsiFromHost... hostId: {}", hostId)
		val res: List<HostStorage> = conn.findAllHostStoragesFromHost(hostId).getOrDefault(emptyList())
			.filter { it.type() == StorageType.ISCSI }
		return res.toHostStorageVos()
	}

	@Throws(Error::class)
	override fun findAllFibreFromHost(hostId: String): List<HostStorageVo> {
		log.info("findAllFibreFromHost... hostId: {}", hostId)
		val res: List<HostStorage> = conn.findAllHostStoragesFromHost(hostId).getOrDefault(emptyList())
			.filter { it.type() == StorageType.FCP }
		return res.toHostStorageVos()
	}

	@Throws(Error::class)
	override fun findImportIscsiFromHost(hostId: String, iscsiDetailVo: IscsiDetailVo): List<LogicalUnitVo> {
		log.info("findImportIscsiFromHost... hostId: {}", hostId)
		val res: List<LogicalUnit> = conn.discoverIscsiFromHost(hostId, iscsiDetailVo.toDiscoverIscsiDetailVo()).getOrDefault(emptyList())
			.map { it.logicalUnits() }.flatten()
		return res.toBlockLogicalUnitVos()
	}

	@Throws(Error::class)
	override fun findUnregisterDomainFromHost(hostId: String): List<StorageDomainVo> {
		log.info("findUnregisterDomainFromHost... hostId: {}", hostId)
		val res: List<StorageDomain> = conn.unRegisteredStorageDomainsFromHost(hostId).getOrDefault(emptyList())
		return res.toStorageDomainInfoVos(conn)
	}

    companion object {
        private val log by LoggerDelegate()
    }
}
