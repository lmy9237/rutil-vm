package com.itinfo.rutilvm.api.service.computing

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.model.computing.*
import com.itinfo.rutilvm.api.model.network.*
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.util.ovirt.*

import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.types.HostNic
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
        val res: List<HostNic> = conn.findAllHostNicsFromHost(hostId, follow = "host,statistics").getOrDefault(emptyList())

        val bondingSlaveIds = res.flatMap { it.bonding()?.slaves()?.map { slave -> slave.id() } ?: emptyList() }.toSet()
        val filteredNics = res.filterNot { it.id() in bondingSlaveIds }

        return filteredNics.toHostNicVos(conn)
    }

    @Throws(Error::class)
    override fun findOneFromHost(hostId: String, hostNicId: String): HostNicVo? {
        log.info("findOneFromHost ... hostId: {}, hostNicId: {}", hostId, hostNicId)
        val res: HostNic? = conn.findNicFromHost(hostId, hostNicId, follow = "host,statistics").getOrNull()
        return res?.toHostNicVo(conn)
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
