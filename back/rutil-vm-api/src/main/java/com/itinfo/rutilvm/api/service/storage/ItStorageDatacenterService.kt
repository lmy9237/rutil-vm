package com.itinfo.rutilvm.api.service.storage

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.model.computing.*
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.util.ovirt.*
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern

import org.ovirt.engine.sdk4.types.*
import org.springframework.stereotype.Service

import kotlin.Error

interface ItStorageDatacenterService {
	/**
	 * [ItStorageDatacenterService.findAllDataCentersFromStorageDomain]
	 * 스토리지도메인 - 데이터센터 목록
	 *
	 * @param storageDomainId [String] 스토리지 도메인 Id
	 * @return List<[DataCenterVo]> 데이터센터 목록
	 */
	@Throws(Error::class)
	fun findAllDataCentersFromStorageDomain(storageDomainId: String): List<DataCenterVo>
	/**
	 * [ItStorageDatacenterService.findAllDataCenterFromStorageDomain]
	 * 데이터센터 목록
	 *
	 * @return List<[DataCenterVo]> 데이터센터 목록
	 */
	@Throws(Error::class)
	fun findAllDataCenterFromStorageDomain(): List<DataCenterVo>
	/**
	 * [ItStorageDatacenterService.findAllHostsFromStorageDomain]
	 * 스토리지도메인 - 호스트 목록
	 *
	 * @param storageDomainId [String] 스토리지 도메인 Id
	 * @return List<[HostVo]> 호스트 목록
	 */
	@Throws(Error::class)
	fun findAllHostsFromStorageDomain(storageDomainId: String): List<HostVo>

	/**
	 * [ItStorageDatacenterService.attachFromDataCenter]
	 * 스토리지 도메인 - 데이터센터 연결 attach
	 *
	 * @param storageDomainId [String] 스토리지 도메인 Id
	 * @param dataCenterId [String] 데이터센터 Id
	 * @return [Boolean]
	 */
	@Throws(Error::class)
	fun attachFromDataCenter(dataCenterId: String, storageDomainId: String): Boolean
	/**
	 * [ItStorageDatacenterService.detachFromDataCenter]
	 * 스토리지 도메인 - 데이터센터 분리 detach
	 *
	 * @param storageDomainId [String] 스토리지 도메인 Id
	 * @param dataCenterId [String] 데이터센터 Id
	 * @return [Boolean]
	 */
	@Throws(Error::class)
	fun detachFromDataCenter(dataCenterId: String, storageDomainId: String): Boolean
	/**
	 * [ItStorageDatacenterService.activateFromDataCenter]
	 * 스토리지 도메인 - 데이터센터 활성 activate
	 *
	 * @param storageDomainId [String] 스토리지 도메인 Id
	 * @param dataCenterId [String] 데이터센터 Id
	 * @return [Boolean]
	 */
	@Throws(Error::class)
	fun activateFromDataCenter(dataCenterId: String, storageDomainId: String): Boolean
	/**
	 * [ItStorageDatacenterService.maintenanceFromDataCenter]
	 * 스토리지 도메인 - 데이터센터 유지보수 maintenance
	 *
	 * @param storageDomainId [String] 스토리지 도메인 Id
	 * @param dataCenterId [String] 데이터센터 Id
	 * @param ovf [Boolean] ovf 업데이트
	 * @return [Boolean]
	 */
	@Throws(Error::class)
	fun maintenanceFromDataCenter(dataCenterId: String, storageDomainId: String, ovf: Boolean): Boolean
}

@Service
class StorageDatacenterServiceImpl(
): BaseService(), ItStorageDatacenterService {

	@Throws(Error::class)
	override fun findAllDataCentersFromStorageDomain(storageDomainId: String): List<DataCenterVo> {
		log.info("findAllDataCentersFromStorageDomain ... storageDomainId: {}", storageDomainId)
		val storageDomain: StorageDomain = conn.findStorageDomain(storageDomainId)
			.getOrNull() ?: throw ErrorPattern.STORAGE_DOMAIN_ID_NOT_FOUND.toException()
		return storageDomain.toStorageDomainDataCenter(conn)
	}

	@Throws(Error::class)
	override fun findAllDataCenterFromStorageDomain(): List<DataCenterVo> {
		log.info("findAllDataCenterFromStorageDomain ... ")
		val res: List<DataCenter> = conn.findAllDataCenters(follow = "storagedomains").getOrDefault(emptyList())
			.filter { dataCenter -> dataCenter.storageDomainsPresent() &&
				dataCenter.storageDomains().any { storageDomain ->
					storageDomain.status() == StorageDomainStatus.ACTIVE
				}
			}
		return res.toDataCenterIdNames()
	}

	@Throws(Error::class)
	override fun findAllHostsFromStorageDomain(storageDomainId: String): List<HostVo> {
		log.info("findAllHostsFromStorageDomain ... storageDomainId: {}", storageDomainId)
		val storageDomain: StorageDomain = conn.findStorageDomain(storageDomainId)
			.getOrNull() ?: throw ErrorPattern.STORAGE_DOMAIN_ID_NOT_FOUND.toException()
		val res: List<Host>  = if(storageDomain.dataCentersPresent()){
			conn.findAllHostsFromDataCenter(storageDomain.dataCenters().first().id()).getOrDefault(emptyList())
		}else emptyList()
		return res.toIdentifiedVosFromHosts()
	}

	@Throws(Error::class)
	override fun attachFromDataCenter(dataCenterId: String, storageDomainId: String): Boolean {
		log.info("attachFromDataCenter ... dataCenterId: {}, storageDomainId: {}", dataCenterId, storageDomainId)
		val res: Result<Boolean> = conn.attachStorageDomainToDataCenter(dataCenterId, storageDomainId)
		return res.isSuccess
	}

	@Throws(Error::class)
	override fun detachFromDataCenter(dataCenterId: String, storageDomainId: String): Boolean {
		log.info("detachFromDataCenter ... dataCenterId: {}, storageDomainId: {}", dataCenterId, storageDomainId)
		val res: Result<Boolean> = conn.detachStorageDomainToDataCenter(dataCenterId, storageDomainId)
		return res.isSuccess
	}

	@Throws(Error::class)
	override fun activateFromDataCenter(dataCenterId: String, storageDomainId: String): Boolean {
		log.info("activateFromDataCenter ... dataCenterId: {}, storageDomainId: {}", storageDomainId, dataCenterId)
		val res: Result<Boolean> = conn.activateStorageDomainToDataCenter(dataCenterId, storageDomainId)
		return res.isSuccess
	}

	@Throws(Error::class)
	override fun maintenanceFromDataCenter(dataCenterId: String, storageDomainId: String, ovf: Boolean): Boolean {
		log.info("maintenanceFromDataCenter ... dataCenterId: {}, storageDomainId: {} ovf: {}", storageDomainId, dataCenterId, ovf)
		val res: Result<Boolean> = conn.deactivateStorageDomainToDataCenter(dataCenterId, storageDomainId, ovf)
		return res.isSuccess
	}


	companion object {
		private val log by LoggerDelegate()
	}
}
