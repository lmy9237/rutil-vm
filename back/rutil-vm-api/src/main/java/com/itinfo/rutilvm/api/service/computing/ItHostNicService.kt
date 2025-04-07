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
	 * [ItHostNicService.updateNetworkAttachmentFromHost]
	 * 호스트 네트워크 분리 (할당된 네트워크)
	 *
	 * @param hostId [String] 호스트 Id
	 * @param networkAttachmentId [String] 네트워크 결합 Id
	 * @param networkAttachmentVo [NetworkAttachmentVo] 네트워크
	 * @return [Boolean] 아직미정
	 */
	@Throws(Error::class)
	fun updateNetworkAttachmentFromHost(hostId: String, networkAttachmentId: String, networkAttachmentVo: NetworkAttachmentVo): Boolean
	/**
	 * [ItHostNicService.removeNetworkAttachmentsFromHost]
	 * 호스트 네트워크 분리 (할당된 네트워크)
	 *
	 * @param hostId [String] 호스트 Id
	 * @param networkAttachmentVos List<[NetworkAttachmentVo]> 네트워크 연결 옵션
	 * @return [Boolean] 아직미정
	 */
	@Throws(Error::class)
	fun removeNetworkAttachmentsFromHost(hostId: String, networkAttachmentVos: List<NetworkAttachmentVo>): Boolean

    /**
     * [ItHostNicService.addBondFromHost]
     * 호스트 네트워크 본딩 추가
     *
     * @param hostId [String] 호스트 Id
     * @param hostNicVo [HostNic] bonding 옵션
     * @return [Boolean]
     */
    @Throws(Error::class)
    fun addBondFromHost(hostId: String, hostNicVo: HostNicVo): Boolean
    /**
     * [ItHostNicService.modifiedBondFromHost]
     * 호스트 네트워크 본딩 수정
     *
     * @param hostId [String] 호스트 Id
     * @param hostNicId [String] 호스트 네트워크 인터페이스 Id
     * @param hostNicVo [HostNic] bonding 옵션
     * @return [Boolean] 아직미정
     */
    @Throws(Error::class)
    fun modifiedBondFromHost(hostId: String, hostNicId: String, hostNicVo: HostNicVo): Boolean
    /**
     * [ItHostNicService.removeBondFromHost]
     * 호스트 네트워크 본딩 삭제
     *
     * @param hostId [String] 호스트 Id
     * @param hostNicVo [HostNicVo] bonding 옵션
     * @return [Boolean] 아직미정
     */
    @Throws(Error::class)
    fun removeBondFromHost(hostId: String, hostNicVo: HostNicVo): Boolean

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
}

@Service
class ItHostNicServiceImpl(
): BaseService(), ItHostNicService {

    @Throws(Error::class)
    override fun findAllFromHost(hostId: String): List<HostNicVo> {
        log.info("findAllFromHost ... hostId: {}", hostId)
		val res: List<HostNic> = conn.findAllHostNicsFromHost(hostId, follow = "host,statistics").getOrDefault(emptyList())
		return res.toHostNicVos(conn)
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
	override fun updateNetworkAttachmentFromHost(hostId: String, networkAttachmentId: String, networkAttachmentVo: NetworkAttachmentVo): Boolean {
		log.info("updateNetworkAttachmentFromHost ... hostId: {}, networkAttachmentId: {}, networkAttachmentVo: {}", hostId, networkAttachmentId, networkAttachmentVo)
		val res: Result<Boolean> = conn.updateNetworkAttachmentFromHost(
			hostId,
			networkAttachmentId,
			networkAttachmentVo.toModifiedNetworkAttachmentBuilder()
		)
		return res.isSuccess
	}

	@Throws(Error::class)
	override fun removeNetworkAttachmentsFromHost(hostId: String, networkAttachmentVos: List<NetworkAttachmentVo>): Boolean {
		log.info("removeNetworkAttachmentFromHost ... hostId: {}, networkAttachmentVos: {}", hostId, networkAttachmentVos)
		val res: Result<Boolean> = conn.removeNetworkAttachmentsFromHost(
			hostId,
			networkAttachmentVos.toModifiedNetworkAttachments()
		)
		return res.isSuccess
	}

	@Throws(Error::class)
	override fun addBondFromHost(hostId: String, hostNicVo: HostNicVo): Boolean {
		log.info("modifiedBondFromHost ... hostId: {}, hostNic: {}", hostId, hostNicVo)
		val res: Result<Boolean> = conn.addBondFromHost(
			hostId,
			hostNicVo.toAddBondBuilder()
		)
		return res.isSuccess
	}

	@Throws(Error::class)
	override fun modifiedBondFromHost(hostId: String, hostNicId: String, hostNicVo: HostNicVo): Boolean {
		log.info("modifiedBondFromHost ... hostId: {}, hostNicId: {}, hostNic: {}", hostId, hostNicId, hostNicVo)
		val res: Result<Boolean> = conn.modifiedBondFromHost(
			hostId,
			hostNicVo.toModifiedBondBuilder()
		)
		return res.isSuccess
	}

	@Throws(Error::class)
	override fun removeBondFromHost(hostId: String, hostNicVo: HostNicVo): Boolean {
		log.info("removeBondFromHost ... hostId: {}", hostId)
		val res: Result<Boolean> = conn.removeBondFromHost(
			hostId,
			hostNicVo.toBondBuilder()
		)
		return res.isSuccess
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


    companion object {
        private val log by LoggerDelegate()
    }
}
