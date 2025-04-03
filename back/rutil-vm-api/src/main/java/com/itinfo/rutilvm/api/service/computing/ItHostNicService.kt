package com.itinfo.rutilvm.api.service.computing

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.model.computing.*
import com.itinfo.rutilvm.api.model.network.*
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.util.ovirt.*

import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.types.Host
import org.ovirt.engine.sdk4.types.HostNic
import org.ovirt.engine.sdk4.types.NetworkAttachment
import org.springframework.stereotype.Service

interface ItHostNicService {
    /**
     * [ItHostNicService.findAllFromHost]
     * 호스트 네트워크 인터페이스 목록
     *
     * @param hostId [String] 호스트 Id
     * @return List<[HostNicVo]> 네트워크 인터페이스 목록
     */
    @Throws(Error::class)
    fun findAllFromHost(hostId: String): List<HostNicVo>
	/**
	 * [ItHostNicService.findAllHostNicsFromHost]
	 * 호스트 네트워크 인터페이스 목록
	 *
	 * @param hostId [String] 호스트 Id
	 * @return List<[HostNicVo]> 네트워크 인터페이스 목록
	 */
	@Throws(Error::class)
	fun findAllHostNicsFromHost(hostId: String): List<HostNicVo>
    /**
     * [ItHostNicService.findOneFromHost]
     * 호스트 네트워크 인터페이스
     *
     * @param hostId [String] 호스트 Id
     * @param hostNicId [String] 호스트 nic Id
     * @return [HostNicVo]? 네트워크 인터페이스 목록
     */
    @Throws(Error::class)
    fun findOneFromHost(hostId: String, hostNicId: String): HostNicVo?
	/**
	 * [ItHostNicService.findAllNetworkAttachmentsFromHost]
	 * 호스트 네트워크 할당 목록
	 *
	 * @param hostId [String] 호스트 Id
	 * @return List<[NetworkAttachmentVo]> 네트워크 목록
	 */
	@Throws(Error::class)
	fun findAllNetworkAttachmentsFromHost(hostId: String): List<NetworkAttachmentVo>
	/**
	 * [ItHostNicService.findNetworkAttachmentFromHost]
	 * 호스트 네트워크 할당 조회
	 *
	 * @param hostId [String] 호스트 Id
	 * @param naId [String] networkAttachment Id
	 * @return [NetworkAttachmentVo] 네트워크
	 */
	@Throws(Error::class)
	fun findNetworkAttachmentFromHost(hostId: String, naId: String): NetworkAttachmentVo?
    /**
     * [ItHostNicService.setUpNetworksFromHost]
     * 호스트 네트워크 설정
     *
     * @param hostId [String] 호스트 Id
     * @param hostNetworkVo [HostNetworkVo] 호스트 네트워크
     * @return [Boolean] 아직미정
     */
    @Throws(Error::class)
    fun setUpNetworksFromHost(hostId: String, hostNetworkVo: HostNetworkVo): Boolean
    /**
     * [ItHostNicService.removeBondsFromHost]
     * 호스트 네트워크 본딩 삭제
     *
     * @param hostId [String] 호스트 Id
     * @param bonds List<[HostNic]> bonding 옵션
     * @return [Boolean] 아직미정
     */
    @Throws(Error::class)
    fun removeBondsFromHost(hostId: String, bonds: List<HostNicVo>): Boolean
    /**
     * [ItHostNicService.removeBondsFromHost]
     * 호스트 네트워크 분리 (할당된 네트워크)
     *
     * @param hostId [String] 호스트 Id
     * @param networkAttachments List<[NetworkAttachmentVo]> 네트워크 연결 옵션
     * @return [Boolean] 아직미정
     */
    @Throws(Error::class)
    fun removeNetworkAttachmentFromHost(hostId: String, networkAttachments: List<NetworkAttachmentVo>): Boolean
}

@Service
class ItHostNicServiceImpl(
): BaseService(), ItHostNicService {

    @Throws(Error::class)
    override fun findAllFromHost(hostId: String): List<HostNicVo> {
        log.info("findAllFromHost ... hostId: {}", hostId)
        val hostNics: List<HostNic> = conn.findAllHostNicsFromHost(hostId, follow = "host,statistics").getOrDefault(emptyList())
			// .filter { !it.baseInterfacePresent() }

		val bondingSlaveIds = hostNics.flatMap { it.bonding()?.slaves()?.map { slave -> slave.id() } ?: emptyList() }.toSet()
		val filteredNics = hostNics.filterNot { it.id() in bondingSlaveIds }

        return filteredNics.toHostNicVos(conn)
    }

	@Throws(Error::class)
	override fun findAllHostNicsFromHost(hostId: String): List<HostNicVo> {
		log.info("findAllHostNicsFromHost ... hostId: {}", hostId)
		val host: Host? = conn.findHost(hostId, follow = "networkattachments.network,nics.statistics").getOrNull()

		val hostNics: List<HostNic>? = host?.nics()
		val networkAttachments: List<NetworkAttachment>? = host?.networkAttachments()
		val res: List<NetworkAttachment> = conn.findAllNetworkAttachmentsFromHost(hostId, follow = "host,host_nic,network").getOrDefault(emptyList())
		TODO("해야도ㅓㅣㅁ")
	}

	@Throws(Error::class)
    override fun findOneFromHost(hostId: String, hostNicId: String): HostNicVo? {
        log.info("findOneFromHost ... hostId: {}, hostNicId: {}", hostId, hostNicId)
        val res: HostNic? = conn.findNicFromHost(hostId, hostNicId, follow = "host,statistics").getOrNull()
        return res?.toHostNicVo(conn)
    }

	@Throws(Error::class)
	override fun findAllNetworkAttachmentsFromHost(hostId: String): List<NetworkAttachmentVo> {
		log.info("findAllNetworkAttachmentFromHost... hostId: {}", hostId)
		val res: List<NetworkAttachment> = conn.findAllNetworkAttachmentsFromHost(hostId, follow = "host,host_nic,network").getOrDefault(emptyList())
		return res.toNetworkAttachmentVos()
	}

	@Throws(Error::class)
	override fun findNetworkAttachmentFromHost(hostId: String, naId: String): NetworkAttachmentVo? {
		log.info("findNetworkAttachmentFromHost ... hostId: {}, naId: {}", hostId, naId)
		val res: NetworkAttachment? = conn.findNetworkAttachmentFromHost(hostId, naId, follow = "host,host_nic,network").getOrNull()
		return res?.toNetworkAttachmentVo()
	}

	@Throws(Error::class)
    override fun setUpNetworksFromHost(hostId: String, hostNetworkVo: HostNetworkVo): Boolean {
        log.info("setUpNetworksFromHost ... hostId: {}, hostNetworkVo: {}", hostId, hostNetworkVo)
        val res: Result<Boolean> = conn.setupNetworksFromHost(
            hostId,
			hostNetworkVo.bonds.toModifiedBonds(),
			hostNetworkVo.networkAttachments.toModifiedNetworkAttachments()
        )
        return res.isSuccess
    }

    @Throws(Error::class)
    override fun removeBondsFromHost(hostId: String, bonds: List<HostNicVo>): Boolean {
        log.info("removeBondsFromHost ... hostId: {}", hostId)
        val res: Result<Boolean> = conn.removeBondsFromHost(
            hostId,
            bonds.toModifiedBonds()
        )
        return res.isSuccess
    }

    @Throws(Error::class)
    override fun removeNetworkAttachmentFromHost(hostId: String, networkAttachments: List<NetworkAttachmentVo>): Boolean {
        log.info("removeNetworkAttachmentFromHost ... hostId: {}", hostId)
        val res: Result<Boolean> = conn.removeNetworkAttachmentsFromHost(
            hostId,
            networkAttachments.toModifiedNetworkAttachments()
        )
        return res.isSuccess
    }


    companion object {
        private val log by LoggerDelegate()
    }
}
