package com.itinfo.rutilvm.api.service.computing

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.model.computing.*
import com.itinfo.rutilvm.api.model.fromStorageDomainsToIdentifiedVos
import com.itinfo.rutilvm.api.model.network.*
import com.itinfo.rutilvm.api.model.storage.*
import com.itinfo.rutilvm.api.repository.*
import com.itinfo.rutilvm.api.repository.history.*
import com.itinfo.rutilvm.api.repository.history.dto.UsageDto
import com.itinfo.rutilvm.api.repository.history.entity.HostConfigurationEntity
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.util.ovirt.*
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern
import org.ovirt.engine.sdk4.types.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.util.*
import kotlin.Error

interface ItHostService {
	/**
	 * [ItHostService.findAll]
	 * 호스트 목록
	 *
	 * @return List<[HostVo]> 호스트 목록
	 */
	@Throws(Error::class)
	fun findAll(): List<HostVo>
	/**
	 * [ItHostService.findOne]
	 * 호스트 상세정보
	 *
	 * @param hostId [String] 호스트 Id
	 * @return [HostVo]?
	 */
	@Throws(Error::class)
	fun findOne(hostId: String): HostVo?
	/**
	 * [ItHostService.add]
	 * 호스트 생성 (전원관리 제외)
	 *
	 * @param hostVo [HostVo]
	 * @return [HostVo]?
	 */
	@Throws(Error::class)
	fun add(hostVo: HostVo, deployHostedEngine: Boolean?): HostVo?
	/**
	 * [ItHostService.update]
	 * 호스트 편집 (전원관리 제외)
	 *
	 * @param hostVo [HostVo]
	 * @return [HostVo]?
	 */
	@Throws(Error::class)
	fun update(hostVo: HostVo): HostVo?
	/**
	 * [ItHostService.remove]
	 * 호스트 삭제
	 * 가상머신 돌아가는게 있는지 -> 유지보수 상태인지 -> 삭제
	 *
	 * @param hostId [String] 호스트 Id
	 * @return [Boolean]
	 */
	@Throws(Error::class)
	fun remove(hostId: String): Boolean

	/**
	 * [ItHostService.findAllVmsFromHost]
	 * 호스트 가상머신 목록
	 *
	 * @param hostId [String] 호스트 Id
	 * @return List<[VmViewVo]> 가상머신 목록
	 */
	@Throws(Error::class)
	fun findAllVmsFromHost(hostId: String): List<VmViewVo>
	/**
	 * [ItHostService.findAllHostDevicesFromHost]
	 * 호스트 호스트장치 목록
	 *
	 *  @param hostId [String] 호스트 Id
	 *  @return List<[HostDeviceVo]> 호스트장치 목록
	 */
	@Throws(Error::class)
	fun findAllHostDevicesFromHost(hostId: String): List<HostDeviceVo>
	/**
	 * [ItHostService.findAllEventsFromHost]
	 * 호스트 이벤트 목록
	 *
	 * @param hostId [String] 호스트 Id
	 * @return List<[EventVo]> 이벤트 목록
	 */
	@Throws(Error::class)
	fun findAllEventsFromHost(hostId: String): List<EventVo>


	/**
	 * [ItHostService.findAllIscsiFromHost]
	 * 도메인 생성 - iSCSI 유형 대상 LUN 목록
	 *
	 * @param hostId [String] 호스트 Id
	 * @return List<[HostStorageVo]>
	 */
	@Throws(Error::class)
	fun findAllIscsiFromHost(hostId: String): List<HostStorageVo>
	/**
	 * [ItHostService.findAllFibreFromHost]
	 * 도메인 생성 - Fibre Channel 유형 대상 LUN 목록
	 * 타입이 tcp로 뜸
	 *
	 * @param hostId [String] 호스트 Id
	 * @return List<[HostStorageVo]>
	 */
	@Throws(Error::class)
	fun findAllFibreFromHost(hostId: String): List<HostStorageVo>
	/**
	 * [ItHostService.findImportIscsiFromHost]
	 * 도메인 가져오기 - iSCSI 유형 대상 LUN 목록
	 *
	 * @param hostId [String] 호스트 Id
	 * @param iscsiDetailVo [IscsiDetailVo]
	 * @return List<[IscsiDetailVo]>
	 */
	@Throws(Error::class)
	fun findImportIscsiFromHost(hostId: String, iscsiDetailVo: IscsiDetailVo): List<IscsiDetailVo>
	/**
	 * [ItHostService.findUnregisterDomainFromHost]
	 * 도메인 가져오기 - iSCSI 유형 대상 LUN 목록
	 *
	 * @param hostId [String] 호스트 Id
	 * @return List<[StorageDomainVo]>
	 */
	@Throws(Error::class)
	fun findUnregisterDomainFromHost(hostId: String): List<IdentifiedVo>
	/**
	 * [ItHostService.loginIscsiFromHost]
	 * 도메인 가져오기 - iSCSI 로그인
	 *
	 * @param hostId [String] 호스트 Id
	 * @param iscsiDetailVo [IscsiDetailVo]
	 * @return List<[StorageDomainVo]>
	 */
	@Throws(Error::class)
	fun loginIscsiFromHost(hostId: String, iscsiDetailVo: IscsiDetailVo): Boolean
}

@Service
class HostServiceImpl(
): BaseService(), ItHostService {
	@Autowired private lateinit var hostConfigurationRepository: HostConfigurationRepository
	@Autowired private lateinit var itGraphService: ItGraphService

	@Throws(Error::class)
	override fun findAll(): List<HostVo> {
		log.info("findAll ... ")
		val res: List<Host> = conn.findAllHosts(follow = "cluster").getOrDefault(emptyList())

		return res.map { host ->
			val hostNic: HostNic? = conn.findAllHostNicsFromHost(host.id()).getOrDefault(emptyList())
				.firstOrNull()
			val usageDto: UsageDto? = calculateUsage(host, hostNic)
			host.toHostMenu(conn, usageDto)
		}
	}

	@Throws(Error::class)
	override fun findOne(hostId: String): HostVo? {
		log.info("findOne ... hostId: {}", hostId)
		val res: Host? = conn.findHost(hostId).getOrNull()
		val sw: HostConfigurationEntity = hostConfigurationRepository.findFirstByHostIdOrderByUpdateDateDesc(UUID.fromString(hostId))
		return res?.toHostInfo(conn, sw)
	}

	@Throws(Error::class)
	// override fun add(hostVo: HostVo): HostVo? {
	override fun add(hostVo: HostVo, deployHostedEngine: Boolean?): HostVo? {
		log.info("add ... ")
		val res: Host? = conn.addHost(
			hostVo.toAddHostBuilder(),
			deployHostedEngine,
		).getOrNull()
		return res?.toHostVo(conn)
	}

	@Throws(Error::class)
	override fun update(hostVo: HostVo): HostVo? {
		log.info("update ... hostName: {}", hostVo.name)
		val res: Host? = conn.updateHost(
			hostVo.toEditHostBuilder()
		).getOrNull()
		return res?.toHostVo(conn)
	}

	@Throws(Error::class)
	override fun remove(hostId: String): Boolean {
		log.info("remove ... hostId: {}", hostId)
		val res: Result<Boolean> = conn.removeHost(hostId)
		return res.isSuccess
	}


	@Throws(Error::class)
	override fun findAllVmsFromHost(hostId: String): List<VmViewVo> {
		log.info("findAllVmsFromHost ... hostId: {}", hostId)
		val res: List<Vm> = conn.findAllVmsFromHost(hostId, follow = "cluster.datacenter,statistics,reporteddevices").getOrDefault(emptyList())
		return res.toVmMenus(conn)
	}

	@Throws(Error::class)
	override fun findAllHostDevicesFromHost(hostId: String): List<HostDeviceVo> {
		log.info("findAllHostDevicesFromHost ... hostId: {}", hostId)
		val res: List<HostDevice> = conn.findAllHostDeviceFromHost(hostId).getOrDefault(emptyList())
		return res.toHostDeviceVos()
	}

	@Throws(Error::class)
	override fun findAllEventsFromHost(hostId: String): List<EventVo> {
		log.info("findAllEventsFromHost ... ")
		val host: Host = conn.findHost(hostId)
			.getOrNull() ?: throw ErrorPattern.HOST_NOT_FOUND.toException()
		val res: List<Event> = conn.findAllEvents("host.name= ${host.name()}").getOrDefault(emptyList())
		return res.toEventVos()
	}

	@Throws(Error::class)
	override fun findAllIscsiFromHost(hostId: String): List<HostStorageVo> {
		// TODO 확인필요
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
	override fun findImportIscsiFromHost(hostId: String, iscsiDetailVo: IscsiDetailVo): List<IscsiDetailVo> {
		log.info("findImportIscsiFromHost... hostId: {}", hostId)
		val res: List<IscsiDetails> = conn.discoverIscsiFromHost(
			hostId,
			iscsiDetailVo.toDiscoverIscsiDetailVo()
		).getOrDefault(emptyList())
		return res.toIscsiDetailVos()
	}

	@Throws(Error::class)
	override fun findUnregisterDomainFromHost(hostId: String): List<IdentifiedVo> {
		log.info("findUnregisterDomainFromHost... hostId: {}", hostId)
		val res: List<StorageDomain> = conn.unRegisteredStorageDomainsFromHost(hostId).getOrDefault(emptyList())
		return res.fromStorageDomainsToIdentifiedVos()
	}

	@Throws(Error::class)
	override fun loginIscsiFromHost(hostId: String, iscsiDetailVo: IscsiDetailVo): Boolean {
		log.info("loginIscsiFromHost... hostId: {}", hostId)
		val res: Result<Boolean> = conn.loginIscsiFromHost(hostId, iscsiDetailVo.toLoginIscsi())
		return res.isSuccess
	}

	private fun calculateUsage(host: Host, hostNic: HostNic?): UsageDto? {
		return if (host.status() == HostStatus.UP && hostNic != null) {
			itGraphService.hostPercent(host.id(), hostNic.id())
		} else null
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
